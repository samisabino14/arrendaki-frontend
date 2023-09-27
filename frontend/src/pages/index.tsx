import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import Houses from '@/components/Houses';
import Head from 'next/head';


export default function Home() {
  return (

    <>

      <Head>
        <title>Arrendaki</title>
      </Head>

      <Header />

      <Hero />

      <Houses />

    </>
  )
}