import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export default function SearchInput({ onSearch, delay = 300 }) {
  const [value, setValue] = useState("");
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // memoriza la funcion para evitar que cambie en cada render
  const notifyParent = useCallback(
    (term) => {
      onSearch?.(term);
    },
    [onSearch]
  );

  // debounce manual
  useEffect(() => {
    // limpia timeout previo
    if (timerRef.current) clearTimeout(timerRef.current);

    // programa nueva notificacion
    timerRef.current = setTimeout(() => {
      const normalized = value.trim().toLowerCase();
      notifyParent(normalized);
      timerRef.current = null;
    }, delay);

    // clean up al desmontar
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay, notifyParent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    notifyParent(value.trim().toLowerCase());
  };

  return (
    <form className={styles.searchInput} role="search" onSubmit={handleSubmit}>
      <label htmlFor="pokemon-search" className={styles.visuallyHidden}>
        Search Pokemon:
      </label>
      <input
        type="search"
        id="pokemon-search"
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Example: Garchomp"
        aria-label="Search pokemon by name"
      />
    </form>
  );
}
