import { HeaderOwner } from '@/components/HeaderOwner'
import { api } from '@/services/apiClient';
import { canSSRProprietario } from '@/utils/canSSRProprietario'
import Head from 'next/head'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function EncontrarUmaCasaPorID() {

  const router = useRouter();
  const { id } = router.query;
  
  const [residence, setResidence] = useState(null);

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {

    async function findOneResidence() {

      setLoading(true)

      const response = await api.get(`/residences/${id}`);

      console.log(response.data);
      setResidence(response.data);
    }

    findOneResidence();

    setLoading(false);

  }, [id]);

  return (
    <>
      <Head>
        <title>Arrendaki</title>
      </Head>

      <HeaderOwner />

      <h1>EncontrarUmaCasaPorID</h1>

    </>
  )
}

export default EncontrarUmaCasaPorID

export const getServerSideProps = canSSRProprietario(async (context) => {

  return {
    props: {
    }
  }
})