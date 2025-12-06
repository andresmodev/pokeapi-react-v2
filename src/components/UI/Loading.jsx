import PropTypes from "prop-types";
import styles from "./Loading.module.css";

function Loading({ size = "medium", message = "Loading..." }) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={`${styles.spinner} ${styles[size]}`} />
      {message && <span className={styles.message}>{message}</span>}
    </div>
  );
}

Loading.PropTypes = {
  size: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default Loading;
