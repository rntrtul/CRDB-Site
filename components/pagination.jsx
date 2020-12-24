import React from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const Pagination = ({
  canPreviousPage,
  canNextPage,
  gotoPage,
  nextPage,
  pageCount,
  pageSize,
  previousPage,
  setPageSize,
}) => (
  <nav className="pagination" role="navigation" aria-label="pagination">
    <ul className="pagination-list">
      <button
        aria-label="Goto previous page"
        className="pagination-link"
        disabled={!canPreviousPage}
        onClick={() => previousPage()}
        type="button"
      >
        Prev
      </button>
      <button
        aria-label="Goto page 1"
        disabled={!canPreviousPage}
        className="pagination-link"
        onClick={() => gotoPage(0)}
        type="button"
      >
        1
      </button>
      <button
        aria-label="Goto last page"
        disabled={!canNextPage}
        className="pagination-link"
        onClick={() => gotoPage(pageCount - 1)}
        type="button"
      >
        {pageCount}
      </button>
      <button
        aria-label="Goto next page"
        className="pagination-link"
        disabled={!canNextPage}
        onClick={() => nextPage()}
        type="button"
      >
        Next
      </button>
    </ul>
    <select
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
    >
      {publicRuntimeConfig.pageSizeOptions.map((pageSizeOption) => (
        <option
          key={pageSizeOption}
          value={pageSizeOption}
          selected={pageSizeOption === publicRuntimeConfig.defaultPageSize ? 'selected' : ''}
        >
          Show
          {' '}
          {pageSizeOption}
        </option>
      ))}
    </select>
  </nav>
);

Pagination.propTypes = {
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  pageCount: PropTypes.number,
  pageSize: PropTypes.number,
  previousPage: PropTypes.func,
  setPageSize: PropTypes.func,
};

export default Pagination;
