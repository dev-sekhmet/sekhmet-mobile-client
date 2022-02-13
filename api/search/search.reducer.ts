import {createSlice} from '@reduxjs/toolkit';
export const initialState = {
    searchQuery: null as unknown as string
};

export const onPerformSearchQuery = searchQuery => dispatch => {
    dispatch(onSearchQuery(searchQuery));
};

export type SearchState = Readonly<typeof initialState>;
export const SearchSlice = createSlice({
    name: 'search',
    initialState: initialState as SearchState,
    reducers: {
        onSearchQuery(state, action) {
            return {
                ...state,
                searchQuery: action.payload
            };
        },
    }
});


export const {onSearchQuery} = SearchSlice.actions;
export default SearchSlice.reducer;