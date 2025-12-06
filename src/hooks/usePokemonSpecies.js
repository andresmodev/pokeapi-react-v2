import { useEffect, useState } from "react";
import { fetchPokemonSpecies } from "../services/pokemonService.js";
import { cleanFlavorText } from "../utils/formatters.js";

// cache en módulo, persiste entre mounts
// (persistente mientras la app esté abierta). Evita re‑requests para el mismo id.
const speciesCache = new Map();

export function usePokemonSpecies(id, { enabled = true } = {}) {
  // estados iniciales
  const cached = id ? speciesCache.get(id) : undefined;
  const [description, setDescription] = useState(cached || "");
  const [loading, setLoading] = useState(Boolean(enabled && !cached));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !enabled) return; // no arranca si no hay id o no está habilitado

    if (speciesCache.has(id)) {
      setDescription(speciesCache.get(id));
      setLoading(false);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const specie = await fetchPokemonSpecies(id, controller.signal);
        const entry = specie.flavor_text_entries?.find((eng) => eng.language?.name === "en");
        const text = entry ? cleanFlavorText(entry.flavor_text) : "";

        speciesCache.set(id, text);

        if (mounted) setDescription(text);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, enabled]);

  return { description, loading, error };
}

// exponer prefetch para usar en onMouseEnter
export async function prefetchSpecies(id) {
  if (!id || speciesCache.has(id)) return;

  try {
    const specie = await fetchPokemonSpecies(id);
    const entry = specie.flavor_text_entries.find((eng) => eng.language.name === "en");
    const text = entry ? cleanFlavorText(entry.flavor_text) : "";

    speciesCache.set(id, text);
  } catch (err) {
    console.warn(err);
  }
}
