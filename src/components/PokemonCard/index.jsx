import React, { useCallback, useState } from "react";
import { usePokemonSpecies, prefetchSpecies } from "../../hooks/usePokemonSpecies.js";
import TypeIcon from "../TypeIcon/index.jsx";
import Loading from "../UI/Loading.jsx";
import Error from "../UI/Error.jsx";
import styles from "./styles.module.css";

function PokemonCard({ pokemon }) {
  const { id, name, sprite, types } = pokemon;

  const [expanded, setExpanded] = useState(false);

  // el hook solo hace fetch cuando enabled === true
  const { description, loading, error } = usePokemonSpecies(id, { enabled: expanded });

  const toggleExpanded = () => setExpanded((prevValue) => !prevValue);

  // prefetch en hover para mejorar la percepción de la velocidad
  const handleMouseEnter = useCallback(() => {
    prefetchSpecies(id);
  }, [id]);

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.id}>#{id}</span>
      </header>

      <img src={sprite} alt={name} className={styles.sprite} />

      <ul className={styles.types}>
        {types.map((type) => (
          <li key={type} className={styles.type}>
            <TypeIcon typeName={type} />
            <span>{type}</span>
          </li>
        ))}
      </ul>

      <button
        className={styles.button}
        type="button"
        onClick={toggleExpanded}
        onMouseEnter={handleMouseEnter}
        aria-expanded={expanded}
      >
        {expanded ? "Show less" : "See more"}
      </button>

      {expanded && (
        <div className={styles.description}>
          {loading && <Loading size="small" message="Loading description..." />}
          {error && (
            <Error message="Error loading description" onRetry={() => prefetchSpecies(id)} />
          )}
          {!loading && !error && <p>{description || "No description available"}</p>}
        </div>
      )}
    </article>
  );
}

export default React.memo(PokemonCard);
