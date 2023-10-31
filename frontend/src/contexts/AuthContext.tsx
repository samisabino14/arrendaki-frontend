import {

    createContext,
    ReactNode,
    useState,
    useEffect,

} from 'react';

import { toast } from 'react-toastify';

import { destroyCookie, setCookie, parseCookies } from 'nookies';

import Router from 'next/router';
import { api } from '../services/apiClient';

type AuthContextData = {

    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    internalError: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string
    email: string
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    fullName: string,
    biNumber: string,
    birthDate: string,
    genre: string,
    email: string,
    phoneNumber: string,
    provinceId: string,
    countyId: string,
    district: string,
    neighborhood: string,
    road: string,
    houseNumber: string,
}

interface RoleProps {
    role: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export const signOut = () => {

    try {

        destroyCookie(undefined, '@arrendaki2023.token');

        Router.push('/login');

        toast.success('Sessão terminada!');

    } catch (err) {
        toast.success('Erro ao deslogar!');
    }
}

export const internalError = () => {

    Router.push('/_error');

    toast.success('Houve um erro!');
}


export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>({
        id: "",
        email: ""
    });

    const [auxUser, setAuxUser] = useState({});

    const isAuthenticated = !!user;

    const signIn = async ({ email, password }: SignInProps) => {

        try {

            console.log({ email, password });

            setUser({
                id: "1",
                email,
            })

            if (email === 'sami@gmail.com') {
                toast.success('Logado com sucesso!');
                Router.push('/painel_admin');
            }

            else if (email === 'jozzy@gmail.com') {
                toast.success('Logado com sucesso!');
                Router.push('/painel_proprietario');
            }

            else if (email === 'marcos@gmail.com') {
                toast.success('Logado com sucesso!');
                Router.push('/painel_locatario');
            } 

            else {
                toast.error('Credenciais inválidas!');
            }

            //toast.success('Logado com sucesso!');

        } catch (err) {
            toast.error('Conexão perdida ou credenciais inválidas.');
        }
    }

    const signUp = async ({

        fullName,
        biNumber,
        birthDate,
        genre,
        email,
        phoneNumber,
        provinceId,
        countyId,
        district,
        neighborhood,
        road,
        houseNumber

    }: SignUpProps) => {

        try {

            console.log({ email });

            toast.success('Cadastrado com sucesso!');

            Router.push('/login');

        } catch (err) {

            toast.error('Erro ao cadastrar!');
        }
    }

    return (

        <AuthContext.Provider value={{
            user, isAuthenticated,
            signUp, signIn, signOut,
            internalError,

        }}>

            {children}

        </AuthContext.Provider>
    )
}



