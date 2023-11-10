import { HeaderOwner } from '@/components/HeaderOwner'
import { canSSRAdmin } from '@/utils/canSSRAdmin'
import { canSSRProprietario } from '@/utils/canSSRProprietario'
import Head from 'next/head'
import React from 'react'

function PainelProprietario() {
  return (

    <>
      <Head>
        <title>Arrendaki</title>
      </Head>

      <HeaderOwner />
      
    </>
  )
}

export default PainelProprietario

export const getServerSideProps = canSSRProprietario(async (context) => {

  return {
    props: {
    }
  }
})