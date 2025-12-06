import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchPokemonList,
  fetchPokemonDetails,
  fetchPokemonByName,
} from "../services/pokemonService.js";
import { LIMIT } from "../utils/constants.js";

function normalizeFromListEntry(entry) {
  const { name, url } = entry;
  const parts = url.split("/").filter(Boolean);
  const id = Number(parts[parts.length - 1]) || null;
  const sprite = id
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    : null;

  return { id, name, sprite, types: [], source: "list" };
}

export function usePokemons({
  limit = LIMIT,
  initialPage = 1,
  maxTotal = null,
  searchTerm = "",
} = {}) {
  // estados principales
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredCount, setFilteredCount] = useState(null);

  // ref para cache y abort
  const cacheRef = useRef({});
  const abortRef = useRef(null);
  const masterListRef = useRef(null); // lista maestra (name + url)

  // cargar lista maestra hasta maxTotal para poder hacer la busqueda por nombre
  const ensureMasterList = useCallback(async () => {
    if (masterListRef.current) return masterListRef.current;

    const fetchLimit = maxTotal || 700;
    const response = await fetchPokemonList(fetchLimit, 0);
    masterListRef.current = response.results || [];

    return masterListRef.current;
  }, [maxTotal]);

  // funcion principal de carga
  const loadPage = useCallback(
    async (pageToLoad) => {
      setLoading(true);
      setError(null);

      // cancelar fetch anterior si existe
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // --- modo busqueda ---
        if (searchTerm && searchTerm.trim().length > 0) {
          // obtener lista maestra cacheada
          const master = await ensureMasterList();
          if (controller.signal.aborted) return;

          const term = searchTerm.trim().toLowerCase();
          const matched = master.filter((entry) => entry.name.toLowerCase().includes(term));
          const normalizedAll = matched.map(normalizeFromListEntry);

          // paginar resultados de busqueda
          const offset = (pageToLoad - 1) * limit;
          const paged = normalizedAll.slice(offset, offset + limit);

          // si hay EXACT match único, enriquecer con fetchPokemonByName
          if (matched.length === 1 && matched.at(0).name.toLowerCase() === term) {
            try {
              const full = await fetchPokemonByName(term, controller.signal);
              if (!controller.signal.aborted && full) {
                const fullNormalized = {
                  id: full.id,
                  name: full.name,
                  sprite: full.sprites?.front_default || null,
                  types: (full.types || []).map((tp) => tp.type.name),
                  source: "detail",
                  raw: full,
                };

                setData({
                  normalized: [fullNormalized],
                  rawList: master,
                  count: matched.length,
                  next: null,
                  previous: null,
                });
                setLoading(false);

                return;
              }
            } catch (err) {
              // si falla el fetch por nombre, caemos a la versión derivada de la lista
              console.warn("fetchPokemonByName failed", err);
            }
          }

          setData({
            normalized: paged,
            rawList: master,
            count: matched.length,
            next: null,
            previous: null,
          });
          setLoading(false);
          return;
        }

        // --- modo paginado ---
        // cache check
        if (cacheRef.current[pageToLoad]) {
          setData(cacheRef.current[pageToLoad]);
          setLoading(false);
          return;
        }

        const offset = (pageToLoad - 1) * limit;
        const list = await fetchPokemonList(limit, offset);
        if (controller.signal.aborted) return;

        // aplicar cap de total si maxTotal está definido
        const totalCount = maxTotal ? Math.min(list.count, maxTotal) : list.count;

        // traer detalles de cada entry
        const details = await Promise.all(
          list.results.map((res) => fetchPokemonDetails(res.url, controller.signal))
        );
        if (controller.signal.aborted) return;

        const normalized = details.map((detail) => ({
          id: detail.id,
          name: detail.name,
          types: detail.types.map((tp) => tp.type.name),
          sprite: detail.sprites.front_default,
        }));

        const pageData = {
          normalized,
          rawList: list.results,
          count: totalCount,
          next: list.next,
          previous: list.previous,
        };

        // cache y estado
        cacheRef.current[pageToLoad] = pageData;
        setData(pageData);
        setLoading(false);

        // prefetch siguiente página
        const nextPage = pageToLoad + 1;
        const totalPages = Math.ceil(totalCount / limit);

        if (nextPage <= totalPages && !cacheRef.current[nextPage]) {
          (async () => {
            try {
              const nextOffset = (nextPage - 1) * limit;
              const nextList = await fetchPokemonList(limit, nextOffset);
              const nextDetails = await Promise.all(
                nextList.results.map((res) => fetchPokemonDetails(res.url))
              );
              const nextNormalized = nextDetails.map((detail) => ({
                id: detail.id,
                name: detail.name,
                types: detail.types.map((tp) => tp.type.name),
                sprite: detail.sprites.front_default,
              }));

              const nextTotalCount = maxTotal ? Math.min(nextList.count, maxTotal) : nextList.count;

              cacheRef.current[nextPage] = {
                normalized: nextNormalized,
                rawList: nextList.results,
                count: nextTotalCount,
                next: nextList.next,
                previous: nextList.previous,
              };
            } catch (e) {
              console.warn("Prefetch failed", e);
            }
          })();
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        setError(err);
        setLoading(false);
      }
    },
    [limit, maxTotal, searchTerm, ensureMasterList]
  );

  // efecto principal
  useEffect(() => {
    (async () => {
      await loadPage(page);
    })();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [page, loadPage]);

  useEffect(() => {
    let cancelled = false;

    // Si no hay término de búsqueda, reseteamos el contador solo si es necesario,
    // pero lo hacemos de forma diferida para evitar setState síncrono en el efecto.
    if (!searchTerm || searchTerm.trim().length === 0) {
      if (filteredCount !== null) {
        // diferir la actualización a la siguiente microtarea
        Promise.resolve().then(() => {
          if (!cancelled) setFilteredCount(null);
        });
      }
      return;
    }

    (async () => {
      try {
        const master = await ensureMasterList();
        if (cancelled) return;

        const term = searchTerm.trim().toLowerCase();
        const count = master.filter((pokemonEntry) =>
          pokemonEntry.name.toLowerCase().includes(term)
        ).length;

        if (!cancelled) setFilteredCount(count);
      } catch (err) {
        if (!cancelled) {
          console.warn(err);
          setFilteredCount(0);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // Razon: intentionally omitting filteredCount from deps to avoid re-execution loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, ensureMasterList]);

  // cálculo de totalPages: si hay búsqueda, basarse en masterList; si no, en maxTotal
  let totalPages = null;
  if (searchTerm) {
    // Si aún no se ha calculado filteredCount, totalPages puede ser null (indica loading)
    if (filteredCount == null) {
      totalPages = null;
    } else {
      totalPages = Math.max(1, Math.ceil(filteredCount / limit));
    }
  } else if (data && data.count != null) {
    totalPages = Math.max(1, Math.ceil(data.count / limit));
  } else if (maxTotal) {
    totalPages = Math.max(1, Math.ceil(maxTotal / limit));
  }

  return {
    page,
    setPage,
    totalPages,
    data,
    loading,
    error,
    cacheRef,
    masterListRef,
  };
}
