import { useState } from "react";
import { usePokemons } from "./hooks/usePokemons.js";
import { LIMIT } from "./utils/constants.js";
import PokemonList from "./components/PokemonList/index.jsx";
import SearchInput from "./components/SearchInput/index.jsx";
import Pagination from "./components/Pagination/index.jsx";
import Loading from "./components/UI/Loading.jsx";
import Error from "./components/UI/Error.jsx";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const { page, setPage, totalPages, data, loading, error } = usePokemons({
    limit: LIMIT,
    maxTotal: 643,
    searchTerm,
  });

  const pokemonToRender = data ? data.normalized : null;

  return (
    <main>
      <h1>PokeDev 2</h1>

      <SearchInput onSearch={setSearchTerm} />

      {loading && <Loading message={`Loading page ${page}`} />}
      {error && <Error message={error.message} onRetry={() => setPage(page)} />}

      <PokemonList pokemons={pokemonToRender} />

      {totalPages && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </main>
  );
}
