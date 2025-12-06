import PropTypes from "prop-types";
import styles from "./Error.module.css";

const Error = ({ message = "Somenthing went wrong", onRetry }) => {
  return (
    <div className={styles.container} role="alert">
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry} type="button">
          Retry
        </button>
      )}
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default Error;
