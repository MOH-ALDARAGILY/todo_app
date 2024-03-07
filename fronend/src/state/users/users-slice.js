import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: {} };

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUser: state => { state.user = initialState.user }
    },
    extraReducers: {

    }
});

export default usersSlice.reducer;
export const { clearUser } = usersSlice.actions;