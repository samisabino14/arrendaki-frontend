import { useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

import { AuthTokenError } from './errors/AuthTokenError';
import { signOut } from '../contexts/AuthContext';


export const setupAPIClient = (context = undefined) => {

    let cookies = parseCookies(context);

    const api = axios.create({

        baseURL: 'http://localhost:8080',
        headers: {
            //Authorization: `Bearer ${cookies['@arrendaki2023.token']}`
        }
    })

    api.interceptors.response.use(response => {

        return response;

    }, (err: AxiosError) => {

        if (err.response?.status === 401) {
            
            if (typeof window !== 'undefined') {

                // SIGNOUT USER
                signOut();
            } else {
                return Promise.reject(new AuthTokenError());
            }
        }

        return Promise.reject(err);
    })

    return api;
}
