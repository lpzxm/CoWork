import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetData } from 'services/DataService';

export const initialTableData =
{
    total: 0,
    page: 1,
    paginate: 25,
    sort:
    {
        order:'',
        key:''
    },
    search:''
}

export const getData = createAsyncThunk('dataTable/getData', async (data) =>
{
    data.reqParams = data.reqParams ? data.reqParams : {...initialTableData}
    return await apiGetData(data.reqParams,data.reqUrl);
})

const dataSlice = createSlice(
{
    name: 'dataTable',
    initialState:
    {
        url: '',
        loading: false,
        data: [],
        tableData: initialTableData,
        sortedColumn: () => {}
    },
    reducers:
    {
        setData: (state, action) =>
        {
            state.data = action.payload;
        },
        setUrl: (state, action) =>
        {
            state.url = action.payload;
        },
        setTableData: (state, action) =>
        {
            state.tableData = action.payload;
        },
        setSortedColumn: (state, action) =>
        {
            state.sortedColumn = action.payload;
        }
    },
    extraReducers:
    {
        [getData.fulfilled]: (state, action) =>
        {
            state.data = action.payload.data.data;
            state.tableData.total = action.payload.data.last_page;
            state.loading = false;
        },
        [getData.pending]: (state) =>
        {
            state.loading = true;
        }
    }
});

export const
{
    setData,
    setTableData,
    setSortedColumn,
    setUrl
} = dataSlice.actions;

export default dataSlice.reducer;
