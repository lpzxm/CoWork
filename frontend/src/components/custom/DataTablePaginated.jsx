import React, { useState, useEffect } from 'react';
import { Table, Pagination, Select, Input} from 'components/ui';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    flexRender,
    getSortedRowModel
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils'

import { HiSearch } from 'react-icons/hi'
import { BiFileBlank } from 'react-icons/bi'

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

function DebouncedInput( { value: initialValue, onChange, debounce = 500, ...props } ) {

    const [value, setValue] = useState(() => initialValue)
    
    useEffect(() => {
        const timeout = setTimeout( () => {
            onChange(value)
        }, debounce )
        return () => clearTimeout( timeout )
    }, [value,onChange,debounce])

    return (
        <Input
            {...props}
            className='md:w-2/12'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Buscar por ID"
            prefix = { <HiSearch className="text-lg"/> }
        />
    )
}

const fuzzyFilter = (row, columnId, value, addMeta) => {
    // console.log(areSimilar(row.getValue(columnId),value))
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const pageSizeOption = [
    { value: 10, label: '10 por página' },
    { value: 25, label: '25 por página' },
    { value: 50, label: '50 por página' },
    { value: 100, label: '100 por página' },
    { value: 0, label: 'Todos' },
];

const DataTablePaginated = (props) =>
{
    const {
        className,
        columns,
        data,
        Title,
        LeftContent,
        RightContent,
        defaultPageSize = 50,
        debouncedInputClassName = '',
        loading = false,
        hiddenSearchField = false,
        serverSidePagination = false,
        sorting = [],
        onSortingChange = () => {},
        pageIndex = 0,
        pageSize = 50,
        pageCount = 0,
        onPaginationChange = () => {},
        totalCount = 0,
    } = props

    // const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState('')

    const tablePageSize = pageSize === 0 ? defaultPageSize : pageSize

    const table = useReactTable({
        data: data ?? [],
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            pagination: { pageIndex, pageSize: tablePageSize },
            sorting,
            columnFilters,
            globalFilter,
        },
        manualPagination: serverSidePagination,
        manualSorting: serverSidePagination,
        onSortingChange: serverSidePagination ? onSortingChange : undefined,
        enableSortingRemoval: false,
        pageCount: serverSidePagination ? pageCount : undefined,
        onPaginationChange: serverSidePagination
            ? (updater) => {
                  const next =
                      typeof updater === 'function'
                          ? updater({ pageIndex, pageSize: tablePageSize })
                          : updater || {}

                  const nextPi =
                      typeof next.pageIndex === 'number'
                          ? next.pageIndex
                          : pageIndex
                  const nextPs =
                      typeof next.pageSize === 'number'
                          ? next.pageSize
                          : tablePageSize

                  onPaginationChange(nextPi, nextPs)
              }
            : undefined,
        initialState: {
            pagination: {
                pageSize: tablePageSize ,
            },
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        // onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: serverSidePagination
            ? undefined
            : getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    // const onPaginationChange = page => { table.setPageIndex( page - 1 ) }
    const onSelectChange = (value) => {
        const next = Number(value)
        if (serverSidePagination) {
            onPaginationChange(0, next) // fuerza página 0 en el padre
        }
        if (next !== 0) {
            table.setPageSize(next)
        }
    }

    // const pageIndex = table.getState().pagination.pageIndex;
    // const pageSize = table.getState().pagination.pageSize;

    const totalData = Object.keys(table.getRowModel().rowsById).length

    const localRowCount = Object.keys(table.getRowModel().rowsById).length

    // choose the right total
    const totalRows = serverSidePagination ? totalCount : localRowCount

    const menuPortalTarget =
        typeof document !== 'undefined' ? document.body : null

    return (
        <div className={`${className}`}>
            <div>{Title}</div>
            <>
                <div
                    className={`
                    flex mb-4
                    xs:flex-col xs:justify-start xs:items-start xs:gap-2
                    md:flex-row md:justify-between  md:items-end
                `}
                >
                    <div
                        className={`
                        flex
                        xs:flex-col xs:justify-start xs:items-start xs:gap-2
                        md:flex-row md:justify-start md:gap-2 md:w-8/12 md:items-end
                    `}
                    >
                        {!hiddenSearchField && (
                            <DebouncedInput
                                key={`global-filter-${globalFilter ?? ''}`}
                                className={`m-0 p-0 ${debouncedInputClassName}`}
                                value={globalFilter ?? ''}
                                onChange={(value) =>
                                    setGlobalFilter(String(value))
                                }
                            />
                        )}
                        {LeftContent}
                    </div>
                    <div
                        className={`
                        flex
                        xs:flex-col xs:justify-start xs:items-start xs:gap-2
                        md:flex-row md:justify-end md:gap-2 md:w-4/12
                    `}
                    >
                        {RightContent}
                    </div>
                </div>

                {!loading ? (
                    <div>
                        {totalData > 0 ? (
                            <>
                                <Table compact>
                                    <THead>
                                        {table
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <Tr key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => {
                                                            return (
                                                                <Th
                                                                    key={
                                                                        header.id
                                                                    }
                                                                    colSpan={
                                                                        header.colSpan
                                                                    }
                                                                    className={`${header.column.columnDef.thClassName}`}
                                                                >
                                                                    {header.isPlaceholder ? null : (
                                                                        <button
                                                                            type="button"
                                                                            className={
                                                                                header.column.getCanSort()
                                                                                    ? 'cursor-pointer select-none w-full text-left'
                                                                                    : ''
                                                                            }
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                const state =
                                                                                    header.column.getIsSorted() // false | 'asc' | 'desc'
                                                                                if (
                                                                                    !state
                                                                                ) {
                                                                                    // first click when unsorted -> force ASC
                                                                                    header.column.toggleSorting(
                                                                                        false,
                                                                                        e.shiftKey
                                                                                    )
                                                                                } else {
                                                                                    // if asc -> desc, if desc -> asc
                                                                                    header.column.toggleSorting(
                                                                                        state ===
                                                                                            'asc',
                                                                                        e.shiftKey
                                                                                    )
                                                                                }
                                                                            }}
                                                                        >
                                                                            <div
                                                                                className={`flex justify-start items-center ${header.column.columnDef.headerClassName}`}
                                                                            >
                                                                                {flexRender(
                                                                                    header
                                                                                        .column
                                                                                        .columnDef
                                                                                        .header,
                                                                                    header.getContext()
                                                                                )}
                                                                                {header.column.getCanSort() && (
                                                                                    <Sorter
                                                                                        sort={header.column.getIsSorted()}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </button>
                                                                    )}
                                                                </Th>
                                                            )
                                                        }
                                                    )}
                                                </Tr>
                                            ))}
                                    </THead>

                                    <TBody>
                                        {table.getRowModel().rows.map((row) => {
                                            return (
                                                <Tr key={row.id}>
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) => {
                                                            return (
                                                                <Td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    className={
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cellClassName
                                                                    }
                                                                >
                                                                    {flexRender(
                                                                        cell
                                                                            .column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </Td>
                                                            )
                                                        })}
                                                </Tr>
                                            )
                                        })}
                                    </TBody>
                                </Table>
                                {tablePageSize !== 0 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <Pagination
                                            pageSize={tablePageSize}
                                            currentPage={pageIndex + 1}
                                            total={totalRows}
                                            onChange={(page) =>
                                                onPaginationChange(
                                                    page - 1,
                                                    tablePageSize
                                                )
                                            }
                                        />
                                        <div style={{ minWidth: '10%' }}>
                                            <Select
                                                size="sm"
                                                isSearchable={false}
                                                value={
                                                    pageSizeOption.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            tablePageSize
                                                    ) || null
                                                }
                                                options={pageSizeOption}
                                                onChange={(option) =>
                                                    onSelectChange(option.value)
                                                }
                                                menuPortalTarget={menuPortalTarget}
                                                menuPosition="fixed"
                                                menuShouldScrollIntoView={false}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // stay above dialogs
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {tablePageSize === 0 && (
                                    <div
                                        className="flex items-center justify-end mt-4"
                                        style={{ minWidth: '10%' }}
                                    >
                                        <Select
                                            size="sm"
                                            isSearchable={false}
                                            value={pageSizeOption.find(
                                                (opt) => opt.value === 0
                                            )}
                                            options={pageSizeOption}
                                            onChange={(option) =>
                                                onSelectChange(option.value)
                                            }
                                            menuPortalTarget={menuPortalTarget}
                                                menuPosition="fixed"
                                                menuShouldScrollIntoView={false}
                                                styles={{
                                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }), // stay above dialogs
                                                }}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                className={`flex justify-between mt-5 text-lg font-semibold`}
                            >
                                <div
                                    className={`flex justify-between gap-5 items-center`}
                                >
                                    <BiFileBlank />
                                    <span>No hay datos que mostrar</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <></>
                )}
            </>
        </div>
    )
}

export default DataTablePaginated;