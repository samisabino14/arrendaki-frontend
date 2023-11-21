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
    pkAccount: string,
    email: string,
    fkPerson: string,

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
    fkProvince: string,
    fkCounty: string,
    fkDistrict: string,
    neighborhood: string,
    road: string,
    houseNumber: string,
    pkTypeOfAccount: string
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
        pkAccount: "",
        email: "",
        fkPerson: "",
    });

    const [auxUser, setAuxUser] = useState({});

    const isAuthenticated = !!user;

    useEffect(() => {

        const { '@arrendaki2023.token': token } = parseCookies();

        if (token) {
            api.get('/me').then(response => {

                const myAccount = response.data;

                const {

                    pkAccount,
                    email,
                    fkPerson,

                } = myAccount;

                setUser({
                    pkAccount,
                    email,
                    fkPerson
                })

            }).catch(() => {
                signOut();
            })
        }
    }, [])

    const signIn = async ({ email, password }: SignInProps) => {

        try {

            const response = await api.post('/session', {
                email,
                password
            });

            const {

                token,
                pkAccount,
                accountTypeOfAccount,
                fkPerson
            } = response.data
            
            setCookie(undefined, '@arrendaki2023.token', token, {
                maxAge: 60 * 60 * 24, // Expires in 1 day
                path: '/' // Path accessed by cookie
            });


            setUser({
                pkAccount,
                email: response.data.email,
                fkPerson,
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            accountTypeOfAccount.map(accountTypeOfAccount => {

                if (accountTypeOfAccount.TypeOfAccount.designation.toLowerCase() === 'proprietario') {
                    Router.push('/painel_proprietario');
                }

                else if (accountTypeOfAccount.TypeOfAccount.designation.toLowerCase() === 'locatario') {
                    Router.push('/painel_locatario');
                }

                else if (accountTypeOfAccount.TypeOfAccount.designation.toLowerCase() === 'admin') {
                    Router.push('/painel_admin');
                }
            })

            toast.success('Logado com sucesso!');

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
        fkProvince,
        fkCounty,
        fkDistrict,
        neighborhood,
        road,
        houseNumber,
        pkTypeOfAccount

    }: SignUpProps) => {

        try {

            if (!houseNumber) {
                houseNumber = "S/N"
            }

            const response = await api.get(`/accounts/${email}`);
            const emailAlreadyExists = response.data;

            if (emailAlreadyExists !== null) {
                toast.error("Email já existente");
                return;
            }

            const locality = await api.post('/localitys', {
                neighborhood,
                road,
                houseNumber,
                fkDistrict
            })

            const person = await api.post('/persons', {
                fullName,
                identifyCardNumber,
                phoneNumber,
                birthDate,
                fkLocality: locality.data.pkLocality
            });

            const pkPerson = person.data?.pkPerson;

            const account = await api.post('/accounts', {
                email,
                password,
                fkPerson: pkPerson
            });

            const typeOfAccount = await api.post('/accountTypeOfAccount', {
                fkTypeOfAccount: pkTypeOfAccount,
                fkAccount: account.data.pkAccount
            });

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



