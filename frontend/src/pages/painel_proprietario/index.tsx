import { HeaderOwner } from '@/components/HeaderOwner'
import { AuthContext } from '@/contexts/AuthContext';
import { api } from '@/services/apiClient';
import { canSSRProprietario } from '@/utils/canSSRProprietario';
import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useContext } from 'react'

function Casas() {

  const { user } = useContext(AuthContext)

  const [loading, setLoading] = useState(false);

  const [residencesList, setResidencesList] = useState([]);

  useEffect(() => {

    setLoading(true);

    async function findAllResidences() {

      const response = await api.get('/owner/residences', {
        params: {
          fkOwner: user.fkPerson,
        }
      });

      setResidencesList(response.data);
    }

    findAllResidences();

    setLoading(false);

  }, [user]);

  return (
    <>
      <Head>
        <title>Arrendaki</title>
      </Head>

      <HeaderOwner />

      <div className="p-20 grid grid-cols-1 gap-4">
        {
          residencesList.length !== 0 ? <>
            <ul className="grid lg:grid-cols-3 gap-4 lg:p-8">


              {residencesList.map((residence, index) => (


                <div key={index}
                  className='shadow-lg rounded-lg p-10 flex flex-col justify-center items-center gap-8'
                >
                  <img className='bg-gray-200'
                    src={`http://localhost:5000/files/${residence.Photos[0].designation}`}
                    alt="" width={320} height={280}
                  />

                  <div className='text-sm text-gray-800'>

                    <p><span className='text-xl text-purple-700 font-bold'>{residence.pricePerMonth} AKz</span></p>
                    <p>Tipologia: <span className='text-xl font-bold'>{residence.Typology.designation}</span></p>
                    <p>Endereço: {residence.address.Locality}</p>
                    <p>Mobiliada: {residence.isFurnished ? 'Sim' : 'Não'}</p>
                  </div>

                  <div className=''>
                    <Link
                      className='px-32 text-center py-2 m-5 bg-purple-700 text-white font-semibold 
                    rounded-lg text-sm hover:bg-purple-800 hover:scale-125'
                      href={`painel_proprietario/${residence.pkResidence}`}
                    >
                      Detalhes
                    </Link>

                  </div>

                </div>


              ))}


            </ul>
          </> : <div className='text-bold my-10 text-center'>

            <h1>Nenhuma casa cadastrada.</h1>

            <Link href={'/painel_proprietario/casas/nova'}>

                <div
                  className='justify-center items-center p-30 text-center mx-52 my-20 bg-purple-700 text-white font-semibold 
                    rounded-lg text-sm hover:bg-purple-800 hover:scale-105 cursor-pointer py-3'>

                  <span>Registrar casa</span>

                </div>
              </Link>
          </div>
        }
      </div>



    </>
  )
}

export default Casas

export const getServerSideProps = canSSRProprietario(async (context) => {

  return {
    props: {
    }
  }
})