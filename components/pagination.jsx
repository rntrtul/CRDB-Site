import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';

const { publicRuntimeConfig } = getConfig();

const Pagination = ({
  canPreviousPage,
  canNextPage,
  gotoPage,
  nextPage,
  pageIndex,
  pageCount,
  pageSize,
  previousPage,
  setPageSize,
}) => {
  const [pages, setPages] = useState([]);
  const pageNeighbours = 1;

  const range = (from, to, step = 1) => {
    let i = from;
    const numRange = [];

    while (i <= to) {
      numRange.push(i);
      i += step;
    }

    return numRange;
  };
  const LEFT_PAGE = 'Prev';
  const RIGHT_PAGE = 'Next';

  const fetchPageNumbers = () => {
    const totalButtons = (pageNeighbours * 2) + 3;
    const totalBlocks = totalButtons + 2;

    if (pageCount > totalBlocks) {
      const startPage = Math.max(2, pageIndex + 1 - pageNeighbours);
      const endPage = Math.min(pageCount - 1, pageIndex + 1 + pageNeighbours);
      let pagesShown = range(startPage, endPage);
      
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = (pageCount - endPage) > 1;
      const spillOffset = totalButtons - (pagesShown.length + 1);

      switch (true) {
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pagesShown = [LEFT_PAGE, ...extraPages, ...pagesShown];
          break;
        }
        
        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pagesShown = [...pagesShown, ...extraPages, RIGHT_PAGE];
          break;
        }
        
        case (hasLeftSpill && hasRightSpill):
        default: {
          pagesShown = [LEFT_PAGE, ...pagesShown, RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pagesShown, pageCount];
    }

    return range(1, pageCount);
  };

  useEffect(() => {
    setPages(fetchPageNumbers());
  }, [pageSize, pageIndex, pageCount]);

  return (
    <nav className="pagination" role="navigation" aria-label="pagination">
      <ul className="pagination-list">
        {pages.map((page) => {
          if (page === LEFT_PAGE) {
            return (
              <button
                aria-label="Goto previous page"
                className="pagination-link"
                disabled={!canPreviousPage}
                key={page}
                onClick={() => previousPage()}
                type="button"
              >
                <GrLinkPrevious />
              </button>
            );
          }
          if (page === RIGHT_PAGE) {
            return (
              <button
                aria-label="Goto next page"
                className="pagination-link"
                disabled={!canNextPage}
                key={page}
                onClick={() => nextPage()}
                type="button"
              >
                <GrLinkNext />
              </button>
            );
          }
          return (
            <button
              aria-label="Goto page 1"
              className={`pagination-link ${pageIndex === (page - 1) ? 'is-current' : ''}`}
              onClick={() => gotoPage(page - 1)}
              key={page}
              type="button"
            >
              {page}
            </button>
          );
        })}
      </ul>
      <div className="select">
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {publicRuntimeConfig.pageSizeOptions.map((pageSizeOption) => (
            <option
              key={pageSizeOption}
              value={pageSizeOption}
            >
              Show
              {' '}
              {pageSizeOption}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  pageIndex: PropTypes.number,
  pageCount: PropTypes.number,
  pageSize: PropTypes.number,
  previousPage: PropTypes.func,
  setPageSize: PropTypes.func,
};

export default Pagination;
