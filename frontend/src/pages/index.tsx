"use client"

import Head from 'next/head';

import { canSSRGuest } from '../utils/canSSRGuest';

import { Header } from '../components/Header';
import { Hero } from '@/components/Hero';



export default function Home() {

    return (

        <>
            <Head>
                <title>Arrendaki</title>
            </Head>

            <Header />

            <Hero/>

        </>
    )
}

export const getServerSideProps = canSSRGuest(async (context) => {

    return {

        props: {}
    }
})
