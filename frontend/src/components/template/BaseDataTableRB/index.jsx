import React, { useEffect, useCallback, useMemo, useRef, forwardRef } from 'react';
import { getData, setTableData, setSortedColumn, setUrl } from './store/dataSlice';
import cloneDeep from 'lodash/cloneDeep';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'components/shared';
import debounce from 'lodash/debounce';
import { Input } from 'components/ui';
import { HiOutlineSearch } from 'react-icons/hi';

import { injectReducer } from 'store/index';
import reducer from './store';

injectReducer('dataTable', reducer);

const BaseDataTableRB = forwardRef((props, ref) => {
	const { columns, reqUrl } = props;

	const dispatch = useDispatch();

	const data = useSelector((state) => state.dataTable.data.data);
	const loading = useSelector((state) => state.dataTable.data.loading);
	const { current_page, perPage, total, search, sort } = useSelector((state) => state.dataTable.data.tableData);

	const fetchData = useCallback(() => {
		dispatch(getData({ reqParams: { current_page, perPage, sort, search }, reqUrl }));
		dispatch(setUrl(reqUrl));
	}, [current_page, perPage, sort, search, reqUrl, dispatch]);

	useEffect(() => { fetchData() }, [fetchData, current_page, perPage, sort, search]);

	const tableData = useMemo(() => ({ current_page, perPage, sort, search, total }), [current_page, perPage, sort, search, total]);

	const onPaginationChange = current_page => {
		const newTableData = cloneDeep(tableData);
		newTableData.current_page = current_page;
		dispatch(setTableData(newTableData));
	}

	const onSort = (sort, sortingColumn) => {
		const newTableData = cloneDeep(tableData);
		newTableData.sort = sort;
		dispatch(setTableData(newTableData));
		dispatch(setSortedColumn(sortingColumn));
	}

	const handleInputChanges = (val) => {
		const newTableData = cloneDeep(tableData)
		newTableData.search = val
		newTableData.current_page = 1

		if (typeof val === 'string' && val.length > 1) {
			dispatch(setTableData(newTableData));
		}

		if (typeof val === 'string' && val.length === 0) {
			dispatch(setTableData(newTableData));
		}
	}


	const debounceFn = debounce(handleDebounceFn, 500);

	function handleDebounceFn(val) {
		handleInputChanges?.(val);
	}

	const handleInputChange = (e) => {
		debounceFn(e.target.value);
	}

	return (
		<>
			<Input
				ref={ref}
				className="max-w-md md:w-52"
				size="sm"
				placeholder="Buscar"
				prefix={<HiOutlineSearch className="text-lg" />}
				onChange={handleInputChange}
			/>
			<DataTable
				columns={columns}
				data={data}
				skeletonAvatarColumns={[0]}
				skeletonAvatarProps={{ width: 28, height: 28 }}
				loading={loading}
				pagingData={{ current_page, perPage, total }}
				pageSizes={[5, 10, 25, 50, 100]}
				onPaginationChange={onPaginationChange}
				onSort={onSort}
			/>
		</>
	)
});

export default BaseDataTableRB;