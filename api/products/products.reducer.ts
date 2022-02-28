import {axiosInstance} from "../axios-config";
import {createAsyncThunk, createSlice, isFulfilled, isPending} from '@reduxjs/toolkit';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSession } from '../authentification/authentication.reducer';
import { AppThunk } from '../store';
import {IQueryParams, serializeAxiosError} from '../reducer.utils';
import axios from "axios";
import {IProduct} from "../../model/product.model";

const initialState = {
    loading: false,
    errorMessage: null,
    entities: [],
    entity: {},
    totalItems: 0,
    updating: false,
    updateSuccess: false,
};

export type ProductState = Readonly<typeof initialState>;

// Actions
const apiUrl = '/products';

const apiSearchUrl = '/_search/products';

// Actions

export const searchEntities = createAsyncThunk('products/search_entity', async ({ query, page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiSearchUrl}?query=${query}${sort ? `&page=${page}&size=${size}&sort=${sort}` : ''}`;
    return axiosInstance.get<IProduct[]>(requestUrl);
});

export const getEntities = createAsyncThunk('products/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
    const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}`;
    return axios.get<IProduct[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
    'products/fetch_entity',
    async (id: string | number) => {
        const requestUrl = `${apiUrl}/${id}`;
        return axios.get<IProduct>(requestUrl);
    },
    { serializeError: serializeAxiosError }
);


export const createEntity = createAsyncThunk(
    'products/create_entity',
    async (entity: IProduct, thunkAPI) => {
        const result = await axios.post<IProduct>(apiUrl, entity);
        thunkAPI.dispatch(getEntities({}));
        return result;
    },
    { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
    'products/update_entity',
    async (entity: IProduct, thunkAPI) => {
        const result = await axios.put<IProduct>(`${apiUrl}/${entity.id}`, entity);
        thunkAPI.dispatch(getEntities({}));
        return result;
    },
    { serializeError: serializeAxiosError }
);

export const partialUpdateEntity = createAsyncThunk(
    'products/partial_update_entity',
    async (entity: IProduct, thunkAPI) => {
        const result = await axios.patch<IProduct>(`${apiUrl}/${entity.id}`, entity);
        thunkAPI.dispatch(getEntities({}));
        return result;
    },
    { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
    'products/delete_entity',
    async (id: string | number, thunkAPI) => {
        const requestUrl = `${apiUrl}/${id}`;
        const result = await axios.delete<IProduct>(requestUrl);
        thunkAPI.dispatch(getEntities({}));
        return result;
    },
    { serializeError: serializeAxiosError }
);

export const ProductsSlice = createSlice({
    name: 'products',
    initialState: initialState as ProductState,
    reducers: {
        reset() {
            return initialState;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getEntity.fulfilled, (state, action) => {
                state.loading = false;
                state.entity = action.payload.data;
            })
            .addCase(deleteEntity.fulfilled, state => {
                state.updating = false;
                state.updateSuccess = true;
                state.entity = {};
            })
            .addMatcher(isFulfilled(getEntities, searchEntities), (state, action) => {
                return {
                    ...state,
                    loading: false,
                    entities: action.payload.data,
                    totalItems: parseInt(action.payload.headers['x-total-count'], 10),
                };
            })
            .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
                state.updating = false;
                state.loading = false;
                state.updateSuccess = true;
                state.entity = action.payload.data;
            })
            .addMatcher(isPending(getEntities, getEntity, searchEntities), state => {
                state.errorMessage = null;
                state.updateSuccess = false;
                state.loading = true;
            })
            .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
                state.errorMessage = null;
                state.updateSuccess = false;
                state.updating = true;
            });
    },
});

export const { reset } = ProductsSlice.actions;

// Reducer
export default ProductsSlice.reducer;
