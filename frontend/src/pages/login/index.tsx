import React, {

    FormEvent,
    useState,
    useContext,

} from 'react';

import { canSSRGuest } from '../../utils/canSSRGuest';


import Head from 'next/head';

import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/AuthContext';

import { Header } from '../../components/Header';

import { Input } from '../../components/ui/Input/index';
import { Button } from '../../components/ui/Button/index';

import styles from './styles.module.scss';
import { ContainerCenter } from '../../components/Signin/ContainerCenter';


export default function SignIn() {

    const { signIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent) => {

        e.preventDefault();

        if (email === '' || password === '') {

            toast.error("Credenciais inválidas!");
        }

        setLoading(true);

        await signIn({ email, password })

        setLoading(false);

    }

    return (

        <>
            <Head>
                <title>Entrar</title>
            </Head>

            <div className='mt-[6rem] md:mt-[7rem] text-gray-500'>

                <Header />


                <ContainerCenter
            
                    styles={styles}
                    handleLogin={handleLogin}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    loading={loading}
                    
                />

            </div>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (context) => {

    return {

        props: {}
    }
})
