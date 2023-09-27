import { Header } from '@/components/Header'
import Head from 'next/head'
import React from 'react'

export const Casas = () => {
    return (

        <>

            <Head>
                <title>Arrendaki</title>
            </Head>

            <Header />

            <div className='container mt-20'>
                <h1>CASAS</h1>
            </div>

        </>
    )
}

export default Casas