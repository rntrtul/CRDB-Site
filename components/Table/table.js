import React, { useState, useEffect } from 'react';
import {
  useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce, usePagination,
} from 'react-table';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { matchSorter } from 'match-sorter';
import Slider from 'rc-slider';
import Pagination from '../pagination';
import 'rc-slider/assets/index.css';
import regeneratorRuntime from 'regenerator-runtime';
import TableFilter from './tableFilter';

// todo: debounce filters so typing won't be slow

const debounce = require('lodash.debounce');

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

function getMinMax(arr, id) {
  let currMin = arr.length && arr[0].values[id] !== 'Cantrip' ? arr[0].values[id] : 0;
  let currMax = arr.length && arr[0].values[id] !== 'Cantrip' ? arr[0].values[id] : 0;

  arr.forEach((row) => {
    const curr = row.values[id] !== 'Cantrip' ? row.values[id] : 0;
    currMin = Math.min(curr, currMin);
    currMax = Math.max(curr, currMax);
  });
  return [currMin, currMax];
}

function GlobalFilter({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => { setGlobalFilter(value || undefined); }, 200);

  return (
    <>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Search</label>
        </div>
        <div className="field-body">
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                placeholder="Search all columns"
                value={value || ''}
                onChange={(e) => { setValue(e.target.value); onChange(e.target.value); }}
              />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const [query, setQuery] = useState(filterValue);
  const count = preFilteredRows.length;

  const search = debounce(() => setFilter(query !== '' ? query : undefined), 100);

  return (
    <input
      className="input"
      placeholder={`Search ${count} records...`}
      value={query || ''}
      onChange={(e) => {
        setQuery(e.target.value);
        search();
      }}
    />
  );
}

export function SelectColumnFilter({
  column: {
    filterValue,
    preFilteredRows,
    setFilter,
    id,
  },
}) {
  const options = React.useMemo(() => {
    const availOptions = new Set();

    preFilteredRows.forEach(row => {
      availOptions.add(row.values[id].key);
    });
    return [...availOptions.values()].sort((a, b) => a.localeCompare(b));
  }, [id, preFilteredRows]);

  return (
    <div className="control">
      <div className="select">
        <select
          value={filterValue}
          onChange={(e) => { setFilter(e.target.value || undefined); }}
        >
          <option value="">All</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    </div>
  );
}

export function NumberRangeColumnFilter({
  column: {
    filterValue = [],
    preFilteredRows,
    setFilter,
    id,
  },
}) {
  const [range, setRange] = useState([0, 0]);

  const [min, max] = React.useMemo(() => {
    const minMax = getMinMax(preFilteredRows, id);
    setRange(minMax);
    return minMax;
  }, [id]);

  const updateFilter = debounce((newRange) => setFilter(newRange), 200);

  const update = (newRange) => {
    setRange(newRange);
    updateFilter(newRange);
  };

  const marks = {};
  marks[min] = min;
  marks[max] = max;
  marks[range[1]] = range[1];
  marks[range[0]] = range[0];

  return (
    <>
      <p>Min: {range[0]} Max: {range[1]}</p>
      <p>{id}</p>
      <Range
        allowCross={false}
        ariaLabelForHandlers={[`min value of ${id}`, `max value of ${id}`]}
        disabled={min === max}
        marks={marks}
        min={min}
        max={max}
        step={1}
        onChange={update}
        value={range}
      />
    </>
  );
}

export function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = (val) => !val;

function Table({
  columns,
  data,
  showFilter = false,
  defaultPageSize,
  title,
}) {
  const filterTypes = React.useMemo(() => ({
    fuzzyText: fuzzyTextFilterFn,
  }), []);

  const defaultColumn = React.useMemo(() => ({
    Filter: DefaultColumnFilter,
  }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortedData },
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: defaultPageSize },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  return (
    <>
      {showFilter && <TableFilter headerGroups={headerGroups} /> }
      { data.length > defaultPageSize
      && (
        <Pagination
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          gotoPage={gotoPage}
          nextPage={nextPage}
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          previousPage={previousPage}
          setPageSize={setPageSize}
        />
      )}
      <div className="table__wrapper">
        {title && <h3>{title} {rows.length}</h3>}
        <table {...getTableProps()} className="table is-striped is-fullwidth is-hoverable">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <FaCaretUp />
                          : <FaCaretDown />
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      { data.length > defaultPageSize
        && (
          <Pagination
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
            gotoPage={gotoPage}
            nextPage={nextPage}
            pageIndex={pageIndex}
            pageCount={pageCount}
            pageSize={pageSize}
            previousPage={previousPage}
            setPageSize={setPageSize}
          />
        )}
    </>
  );
}

export default Table;
