import styles from "./styles.module.css";

function TypeIcon({ typeName }) {
  if (!typeName) return null;

  const src = `/icons/${typeName.toLowerCase()}.svg`;

  return (
    <img
      src={src}
      alt={`${typeName} icon`}
      className={`${styles.icon} ${styles[typeName]}`}
      loading="lazy"
      aria-hidden="true"
    />
  );
}

export default TypeIcon;
