import React, {
    forwardRef,
    useMemo,
    useRef,
    useState,
    useImperativeHandle,
    useCallback,
} from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Table, Pagination, Select, Checkbox, Alert } from 'components/ui'
import TableRowSkeleton from './loaders/TableRowSkeleton'
import Loading from './Loading'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { BiFileBlank } from 'react-icons/bi'
import { IS_DEV } from 'utils/env'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const IndeterminateCheckbox = ((props) => {

    const {
        checked,
        indeterminate,
        onChange,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        ...rest
    } = props

    const ref = useRef(null)

    const setCheckboxRef = useCallback((node) => {
        ref.current = node

        if (node && typeof indeterminate === 'boolean') {
            node.indeterminate = !checked && indeterminate
        }
    }, [checked, indeterminate])

    const handleChange = (e) => {
        onChange(e)
        onCheckBoxChange?.(e)
        onIndeterminateCheckBoxChange?.(e)
    }

    return (
        <Checkbox
            className="mb-0"
            ref={setCheckboxRef}
            checked={checked}
            onChange={(_, e) => handleChange(e)}
            {...rest}
        />
    )
})

const DataTable = forwardRef((props, ref) => {
    const {
        availableAll,
        skeletonAvatarColumns,
        columns: columnsProp,
        data,
        loading,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        onPaginationChange,
        onSelectChange,
        onSort,
        pageSizes,
        selectable,
        skeletonAvatarProps,
        pagingData,
    } = props

    const { pageSize, paginate, pageIndex, total } = pagingData;

    const [sorting, setSorting] = useState(null)

    const pageSizeOption = useMemo(() => {
        let options = pageSizes.map(number => ({ value: number, label: `${number} por página` }));
        if (availableAll) options.push({ value: (total * paginate), label: 'Todos' });
        return options;
    },
        [pageSizes, availableAll, total, paginate]
    );

    const selectedPageSizeOption = useMemo(
        () => pageSizeOption.find((option) => option.value === paginate) ?? null,
        [pageSizeOption, paginate]
    )

    const handleCheckBoxChange = useCallback((checked, row) => {
        if (!loading) {
            onCheckBoxChange?.(checked, row)
        }
    }, [loading, onCheckBoxChange])

    const handleIndeterminateCheckBoxChange = useCallback((checked, rows) => {
        if (!loading) {
            onIndeterminateCheckBoxChange?.(checked, rows)
        }
    }, [loading, onIndeterminateCheckBoxChange])

    const handlePaginationChange = useCallback((page) => {
        if (!loading) {
            onPaginationChange?.(page)
        }
    }, [loading, onPaginationChange])

    const handleSelectChange = useCallback((value) => {
        if (!loading) {
            onSelectChange?.(Number(value))
        }
    }, [loading, onSelectChange])

    const handleSortingChange = useCallback((updater) => {
        setSorting((currentSorting) => {
            const nextSorting =
                typeof updater === 'function' ? updater(currentSorting) : updater
            const activeSort = Array.isArray(nextSorting) ? nextSorting[0] : null

            onSort?.({
                order: activeSort ? (activeSort.desc ? 'desc' : 'asc') : '',
                key: activeSort?.id ?? '',
            })

            return nextSorting
        })
    }, [onSort])

    const hasOldColumnMetaKey = columnsProp.some(col => col.Header || col.accessor || col.Cell)

    const finalColumns = useMemo(() => {

        const columns = columnsProp

        if (selectable) {
            return [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <IndeterminateCheckbox
                            checked={table.getIsAllRowsSelected()}
                            indeterminate={table.getIsSomeRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            onIndeterminateCheckBoxChange={(e) => {
                                handleIndeterminateCheckBoxChange(
                                    e.target.checked,
                                    table.getRowModel().rows
                                )
                            }}
                        />
                    ),
                    cell: ({ row }) => (
                        <IndeterminateCheckbox
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            onCheckBoxChange={(e) =>
                                handleCheckBoxChange(
                                    e.target.checked,
                                    row.original
                                )
                            }
                        />
                    ),
                },
                ...columns
            ]
        }
        return columns
    }, [
        columnsProp,
        selectable,
        handleCheckBoxChange,
        handleIndeterminateCheckBoxChange,
    ])

    const table = useReactTable({
        data,
        columns: hasOldColumnMetaKey ? [] : finalColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        onSortingChange: handleSortingChange,
        state: {
            sorting,
        },
    })

    const resetSorting = () => {
        table.resetSorting()
    };

    const resetSelected = () => {
        table.toggleAllRowsSelected(false);
    }

    useImperativeHandle(ref, () => ({
        resetSorting,
        resetSelected
    }));

    if (hasOldColumnMetaKey) {

        const message = 'You are using old react-table v7 column config, please use v8 column config instead, refer to our demo or https://tanstack.com/table/v8'

        if (IS_DEV) {
            console.warn(message)
        }

        return (
            <Alert>{message}</Alert>
        )
    }

    return (
        <Loading loading={loading && data.length !== 0} type="cover">
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className={header.column.columnDef.headerClassName}
                                >
                                    {header.isPlaceholder ? null : (
                                        <button
                                            type="button"
                                            className={
                                                classNames(
                                                    'w-full text-left',
                                                    header.column.getCanSort() && 'cursor-pointer select-none point',
                                                    loading && 'pointer-events-none'
                                                )
                                            }
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getCanSort() && <Sorter sort={header.column.getIsSorted()} />}
                                        </button>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                {loading && data.length === 0 ? (
                    <TableRowSkeleton
                        columns={finalColumns.length}
                        rows={pagingData.pageSize}
                        avatarInColumns={skeletonAvatarColumns}
                        avatarProps={skeletonAvatarProps}
                    />
                ) : (
                    <TBody>
                        {table.getRowModel().rows.slice(0, pageSize).map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id} className={cell.column.columnDef.cellClassName}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                )}
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={pageIndex}
                    total={total}
                    onChange={handlePaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        menuPlacement="top"
                        isSearchable={false}
                        value={selectedPageSizeOption}
                        options={pageSizeOption}
                        onChange={(option) => handleSelectChange(option?.value)}
                    />
                </div>
            </div>
            {/* Agregar el mensaje cuando no hay datos */}
            {data.length === 0 && !loading && (
                <div className="flex justify-between mt-5 text-lg font-semibold">
                    <div className="flex justify-between gap-5 items-center">
                        <BiFileBlank />
                        <span>No hay datos que mostrar</span>
                    </div>
                </div>
            )}
        </Loading>
    );

})

DataTable.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    loading: PropTypes.bool,
    onCheckBoxChange: PropTypes.func,
    onIndeterminateCheckBoxChange: PropTypes.func,
    onPaginationChange: PropTypes.func,
    onSelectChange: PropTypes.func,
    onSort: PropTypes.func,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    selectable: PropTypes.bool,
    skeletonAvatarColumns: PropTypes.arrayOf(PropTypes.number),
    skeletonAvatarProps: PropTypes.object,
    pagingData: PropTypes.shape({
        total: PropTypes.number,
        pageIndex: PropTypes.number,
        pageSize: PropTypes.number,
        paginate: PropTypes.number
    }),
}

DataTable.defaultProps = {
    pageSizes: [10, 25, 50, 100],
    pagingData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        paginate: 10
    },
    data: [],
    columns: [],
    selectable: false,
    loading: false,
}

export default DataTable
