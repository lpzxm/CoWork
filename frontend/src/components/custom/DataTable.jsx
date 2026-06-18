import React, { useState, useEffect } from 'react';
import { Table, Pagination, Select, Input} from 'components/ui';
import { TableRowSkeleton } from 'components/shared'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
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
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Buscar"
                    prefix = { <HiSearch className="text-lg"/> }
                />
            </div>
        </div>
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
    { value: 20, label: '20 por página' },
    { value: 30, label: '30 por página' },
    { value: 40, label: '40 por página' },
    { value: 50, label: '50 por página' },
]

const DataTable = (props) =>
{
    const { className,columns,data,Title,LeftContent,RightContent,loading } = props;

    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [globalFilter, setGlobalFilter] = React.useState('')

    const table = useReactTable({
        data:data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            sorting,
            columnFilters,
            globalFilter
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false
    })

    const onPaginationChange = page => { table.setPageIndex( page - 1 ) }
    const onSelectChange = value => { table.setPageSize( Number(value) ) }

    const pageIndex = table.getState().pagination.pageIndex;
    const pageSize = table.getState().pagination.pageSize;

    const totalData = ( Object.keys(table.getRowModel().rowsById).length )

    return (
        <div className={`${className}`}>
            <div>{Title}</div>
            <>
                <div className={`flex justify-between mb-2`}>
                    <div className={`flex justify-start gap-2 w-6/12`}>
                        <DebouncedInput
                            key={`global-filter-${globalFilter ?? ''}`}
                            value={globalFilter ?? ''}
                            onChange={(value) => setGlobalFilter(String(value))}
                        />
                        {LeftContent}
                    </div>
                    <div className={`flex justify-end gap-2 w-6/12`}>
                        {RightContent}
                    </div>
                </div>
                <div>
                {
                    loading ? (
                        <Table compact>
                            <THead>
                                { table.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        { headerGroup.headers.map((header) => {
                                            return (
                                                <Th
                                                    key={header.id}
                                                    colSpan={header.colSpan}
                                                    className={`${header.column.columnDef.thClassName}`}
                                                >
                                                    { header.isPlaceholder ? null : (
                                                        <div
                                                            {...{
                                                                className:
                                                                    header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : '',
                                                                onClick:
                                                                header.column.getToggleSortingHandler(),
                                                            }}
                                                        >
                                                            <div className={`flex justify-start items-center ${header.column.columnDef.headerClassName}`}>
                                                                { flexRender( header.column.columnDef.header, header.getContext() )}
                                                                { header.column.getCanSort() && <Sorter sort = { header.column.getIsSorted() } />}
                                                            </div>
                                                        </div>
                                                    )}
                                                </Th>
                                            )
                                        })}
                                    </Tr>
                                ))}
                            </THead>
                            <TableRowSkeleton columns={columns.length} rows={10} />
                        </Table>
                    ) :
                    totalData > 0 ?
                    (
                        <>
                            <Table compact>
                                <THead>
                                    { table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id}>
                                            { headerGroup.headers.map((header) => {
                                                return (
                                                    <Th
                                                        key={header.id}
                                                        colSpan={header.colSpan}
                                                        className={`${header.column.columnDef.thClassName}`}
                                                    >
                                                        { header.isPlaceholder ? null : (
                                                            <div
                                                                {...{
                                                                    className:
                                                                        header.column.getCanSort()
                                                                    ? 'cursor-pointer select-none'
                                                                    : '',
                                                                    onClick:
                                                                    header.column.getToggleSortingHandler(),
                                                                }}
                                                            >
                                                                <div className={`flex justify-start items-center ${header.column.columnDef.headerClassName}`}>
                                                                    { flexRender( header.column.columnDef.header, header.getContext() )}
                                                                    { header.column.getCanSort() && <Sorter sort = { header.column.getIsSorted() } />}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Th>
                                                )
                                            })}
                                        </Tr>
                                    ))}
                                </THead>

                                <TBody>
                                    {table.getRowModel().rows.map((row) => {
                                        return (
                                            <Tr key={row.id}>
                                                {row.getVisibleCells().map((cell) => {
                                                    return (
                                                        <Td key={cell.id} className={cell.column.columnDef.cellClassName}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
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
                            <div className="flex items-center justify-between mt-4">
                                <Pagination
                                    pageSize={pageSize}
                                    currentPage={pageIndex + 1}
                                    total={totalData}
                                    onChange={onPaginationChange}
                                />
                                <div style={{ minWidth: 130 }}>
                                    <Select
                                        size="sm"
                                        isSearchable={false}
                                        value={ pageSizeOption.filter( option => option.value === pageSize )}
                                        options={pageSizeOption}
                                        onChange={(option) => onSelectChange(option.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )
                    :
                    !loading && (
                        <div className={`flex justify-between mt-5 text-lg font-semibold`}>
                            <div className={`flex justify-between gap-5 items-center`}>
                                <BiFileBlank/>
                                <span>No hay datos que mostrar</span>
                            </div>
                        </div>
                    )
                }
                </div>
            </>
        </div>
    )
}

export default DataTable;