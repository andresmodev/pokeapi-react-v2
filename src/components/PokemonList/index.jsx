import React from "react";
import PropTypes from "prop-types";
import PokemonCard from "../PokemonCard/index.jsx";
import Loading from "../UI/Loading.jsx";
import Error from "../UI/Error.jsx";
import styles from "./styles.module.css";

function PokemonList({ pokemons }) {
  if (!pokemons) return <Loading size="large" message="Loading..." />;
  if (Array.isArray(pokemons) && pokemons.length === 0)
    return <Error message="No pokemons to show" />;

  return (
    <section className={styles.grid}>
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </section>
  );
}

PokemonList.propTypes = {
  pokemons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sprite: PropTypes.string,
      types: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
};

export default React.memo(PokemonList);
