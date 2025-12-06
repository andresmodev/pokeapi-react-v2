import React, { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const goToPage = (page) => {
    const isPage = Math.max(1, Math.min(totalPages, page));
    if (isPage !== currentPage) onPageChange(isPage);
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  // genera la ventana de páginas a mostrar
  const pages = useMemo(() => {
    if (!totalPages) return [];
    const delta = 2; // muestra current ± delta
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1); // siempre mostrar la primera

    if (left > 2) range.push("left-ellipsis");

    for (let i = left; i <= right; i++) range.push(i);

    if (right < totalPages - 1) range.push("right-ellipsis");

    if (totalPages > 1) range.push(totalPages); // siempre mostrar la última

    return range;
  }, [currentPage, totalPages]);

  if (!totalPages || totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={`${styles.control} ${isFirstPage ? styles.disabled : ""}`}
        onClick={handlePrev}
        disabled={isFirstPage}
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className={styles.pages}>
        {pages.map((page, idx) => {
          if (page === "left-ellipsis" || page === "right-ellipsis") {
            return (
              <span key={page + idx} className={styles.ellipsis} aria-hidden="true">
                …
              </span>
            );
          }
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              className={`${styles.page} ${isActive ? styles.active : ""}`}
              onClick={() => goToPage(page)}
              aria-current={isActive ? "page" : undefined}
              aria-label={isActive ? `Page ${page}, current page` : `Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.control} ${isLastPage ? styles.disabled : ""}`}
        onClick={handleNext}
        disabled={isLastPage}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default React.memo(Pagination);
