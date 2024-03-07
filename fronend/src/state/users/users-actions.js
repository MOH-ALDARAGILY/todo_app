import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const baseURL = '/api';

export const register = createAsyncThunk(
    'users/register',
    async (user) => {
        const { data } = axios.post(`${baseURL}/register`, user);
        return data;
    }
);

export const login = createAsyncThunk(
    'users/login',
    async
)