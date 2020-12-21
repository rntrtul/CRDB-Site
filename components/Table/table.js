import React from 'react'
import { useTable, useSortBy,  useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import {matchSorter} from 'match-sorter'
import regeneratorRuntime from "regenerator-runtime"

function GlobalFilter({preGlobalFilteredRows,globalFilter,setGlobalFilter,}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {setGlobalFilter(value || undefined)}, 200)

    return (
        <>
            <div className="field is-horizontal">
                <div className = "field-label is-normal">
                    <label className='label'>Search</label>
                </div>
                <div className = "field-body">
                    <div className = "field">
                        <p className="control">
                            <input
                                className="input" type="text" placeholder="Search all columns"
                                value={value || ""}
                                onChange={e => {setValue(e.target.value); onChange(e.target.value)}}/>
                        </p>
                    </div>
                </div>
            </div>
        </>)
}

export function DefaultColumnFilter({column: {filterValue, preFilteredRows, setFilter}}){
    const count = preFilteredRows.length
    return (
        <div className="fields">
            <div className="control">
                <input className="input" placeholder={`Search ${count} records...`}
                       value={filterValue ||""}
                       onChange={e => {
                           setFilter(e.target.value || undefined)
                       }}/>
            </div>
        </div>
    )
}

export function SelectColumnFilter({column: {filterValue, preFilteredRows, setFilter, id}}){
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <div className="control">
            <div className="select">
                <select value={filterValue}
                        onChange={e => {setFilter(e.target.value || undefined)}}>
                    <option value = "">All</option>
                    {options.map((option, i) => <option key={i} value={option}>{option}</option>
                    )}
                </select>
            </div>
        </div>
    )
}

export function NumberRangeColumnFilter({column: {filterValue = [], preFilteredRows, setFilter, id}}){
    const [min,max] = React.useMemo(() => {
        let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
        preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
        })
        return [min, max]
    }, [id, preFilteredRows])

    return (
        <>
            <input
                value={filterValue[0] || ''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
                }}
                placeholder={`Min ${min}`}
            />
            <input
                value={filterValue[1]||''}
                type="number"
                onChange={e => {
                    const val = e.target.value
                    setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
                }}
                placeholder={`Max ${max}`}
            />
        </>)
}

export function fuzzyTextFilterFn(rows, id, filterValue){
    return matchSorter(rows, filterValue, {keys: [row => row.values[id]]})
}

fuzzyTextFilterFn.autoRemove = val => !val

function Table ({columns, data, showFilter= false}){
    const filterTypes = React.useMemo(() => ({
        fuzzyText : fuzzyTextFilterFn,
    }), [])

    const defaultColumn = React.useMemo(() => ({
        Filter: DefaultColumnFilter,
    }), [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter
    } = useTable(
        {columns,
            data,
            defaultColumn,
            filterTypes,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
    )

    return (
        <>
            {showFilter &&
            <>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <div className="box">
                    {headerGroups.map(headerGroup => (
                        <div {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <p {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    <div>
                                        {column.canFilter ? column.render('Filter') : null}
                                    </div>
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </>
            }
            <table {...getTableProps()} className='table is-striped is-fullwidth is-hoverable'>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                  {column.isSorted
                                      ? column.isSortedDesc
                                          ? ' 🔽'
                                          : ' 🔼'
                                      : ''
                                  }
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()} key={index}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </>
    )
}

export default Table