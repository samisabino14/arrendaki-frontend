import { HeaderLocatario } from '@/components/HeaderLocatario'
import { AuthContext } from '@/contexts/AuthContext'
import { setupAPIClient } from '@/services/api'
import { api } from '@/services/apiClient'
import { canSSRGuest } from '@/utils/canSSRGuest'
import { canSSRProprietario } from '@/utils/canSSRProprietario'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'




type Residences = {

  pkResidence: string,
  address: string,
  pricePerMonth: string,
  iban: string,
  isFurnished: string,
  createdAt: string,
  updatedAt: string,
  Photos: [
    pkPhoto: string,
    designation: string,
    fkResidence: string,
    createdAt: string,
    updatedAt: string,
  ],
  Locality: [
    pkLocality: string,
    neighborhood: string,
    road: string,
    houseNumber: string,
    createdAt: string,
    updatedAt: string,
    District: {
      pkDistrict: string,
      designation: string,
      createdAt: string,
      updatedAt: string,
      County: {
        pkCounty: string,
        designation: string,
        createdAt: string,
        updatedAt: string,
        Province: {
          pkCounty: string,
          designation: string,
          createdAt: string,
          updatedAt: string,
        }
      }
    }
  ],
  Owner: [
    pkPerson: string,
    fullName: string,
    identifyCardNumber: string,
    phoneNumber: string,
    phoneNumber: string,
    birthDate: string,
    createdAt: string,
    updatedAt: string,
  ],
  Typology: [
    pkTypology: string,
    designation: string,
    createdAt: string,
    updatedAt: string,

  ],
}

interface ResidencesProps {

  residences: Residences[]
}


function PainelLocatario({ residences }: ResidencesProps) {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useContext(AuthContext);

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

      <HeaderLocatario />
      <div className="p-20 gap-4">

        {
          residence && <>

            <div
              className=''
            >
              {/**
                 
                {residence.Photos.map((photo, index) => (
                  <div key={index}>
                    <p>{photo.designation}</p>
                  </div>
                ))}
                */}

              <div className='md:flex flex-row md:gap-8 justify-center items-center my-20'>

                {residence.Photos.map((photo, index) => (
                  <div key={index}>
                    <img
                      className='rounded-lg shadow-lg'
                      src={`http://localhost:5000/files/${photo.designation}`}
                      alt="" width={420} height={280}
                    />
                  </div>
                ))}
              </div>

              <div className='text-sm text-gray-800'>
                <div className='text-center'>
                  <p><span className='text-5xl text-purple-700 font-bold text-center'>{residence.pricePerMonth} AKz</span></p>

                </div>
                <div className='grid text-center my-5 bg-gray-50 text-lg mx-20 gap-4 grid-cols-2 justify-center items-center text-sm text-gray-800'>

                  <p>Tipologia: <span className='text-xl font-bold'>{residence.Typology.designation}</span></p>
                  <p>Província: {residence.Locality.District.County.Province.designation}
                  </p>
                  <p>Município: {residence.Locality.District.County.designation}</p>
                  <p>Distrito/Comuna: {residence.Locality.District.designation}</p>
                  <p>Endereço: {residence.address}</p>
                  <p>Mobiliada: {residence.isFurnished ? 'Sim' : 'Não'}</p>
                  <p>{user.email}</p>
                </div>
              </div>

              <Link href={'/login'}>

                <div
                  className='flex justify-center items-center p-30 text-center mx-20  bg-purple-700 text-white font-semibold 
                    rounded-lg text-sm hover:bg-purple-800 hover:scale-105 cursor-pointer py-3'>

                  <span>Arrendar</span>

                </div>
              </Link>

            </div>

          </>
        }
      </div>

    </>

  )
}

export default PainelLocatario

export const getServerSideProps = canSSRGuest(async (context) => {

  const apiClient = setupAPIClient(context);

  const residences = await apiClient.get(`/residences`);

  return {
    props: {
      residences: residences.data,
    }
  }
})