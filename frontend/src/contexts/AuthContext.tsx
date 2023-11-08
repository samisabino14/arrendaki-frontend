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
    identifyCardNumber: string,
    birthDate: string,
    genre: string,
    username: string,
    email: string,
    password: string,
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
        identifyCardNumber,
        birthDate,
        genre,
        username,
        email,
        password,
        phoneNumber,
        provinceId,
        countyId,
        district,
        neighborhood,
        road,
        houseNumber

    }: SignUpProps) => {

        try {

            console.log({
                fullName,
                identifyCardNumber,
                birthDate,
                genre,
                username,
                email,
                password,
                phoneNumber,
                provinceId,
                countyId,
                district,
                neighborhood,
                road,
                houseNumber
            })

            /*
            const person = await api.post('/persons', {
                fullName,
                identifyCardNumber,
                phoneNumber,
                birthDate,
                fkLocalidade: {
                    pkLocality: district
                }
            })

            const account = await api.post('/api/usuario', {
                username,
                email,
                password,
                pessoa: {
                    pkPerson: 7
                },
                tipoConta: {
                    pkTypeOfAccount: 3
                }
            })
            */

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



