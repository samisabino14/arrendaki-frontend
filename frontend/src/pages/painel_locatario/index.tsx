import { HeaderLocatario } from '@/components/HeaderLocatario'
import { setupAPIClient } from '@/services/api'
import { canSSRLocatario } from '@/utils/canSSRLocatario'
import { canSSRProprietario } from '@/utils/canSSRProprietario'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'




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


  return (

    <>
      <Head>
        <title>Arrendaki</title>
      </Head>

      <HeaderLocatario />

      <div className="p-20 grid grid-cols-1 gap-4">

        <ul className="grid lg:grid-cols-3 gap-4 lg:p-8">
        
          {residences.map((residence, index) => (


            <div key={index}
              className='shadow-lg rounded-lg p-10 flex flex-col justify-center items-center gap-8'
            >
              {/**
                 
                {residence.Photos.map((photo, index) => (
                  <div key={index}>
                    <p>{photo.designation}</p>
                  </div>
                ))}
                */}

              <img className='bg-gray-200'
                src={`http://localhost:5000/files/${residence.Photos[0].designation}`}
                alt="" width={320} height={280}
              />

              <div className='text-sm text-gray-800'>

                <p><span className='text-xl text-purple-700 font-bold'>{residence.pricePerMonth} AKz</span></p>
                <p>Tipologia: <span className='text-xl font-bold'>{residence.Typology.designation}</span></p>
                <p>Província: {residence.Locality.District.County.Province.designation}
                </p>
                <p>Município: {residence.Locality.District.County.designation}</p>
                <p>Distrito/Comuna: {residence.Locality.District.designation}</p>
                <p>Endereço: {residence.address}</p>
                <p>Mobiliada: {residence.isFurnished ? 'Sim' : 'Não'}</p>
              </div>

              <div className=''>
                <Link
                  className='px-32 text-center py-2 m-5 bg-purple-700 text-white font-semibold 
                    rounded-lg text-sm hover:bg-purple-800 hover:scale-125'
                  href={`painel_locatario/${residence.pkResidence}`}
                >
                  Detalhes
                </Link>

              </div>

            </div>


          ))}
        </ul>
      </div>

    </>

  )
}

export default PainelLocatario

export const getServerSideProps = canSSRLocatario(async (context) => {

  const apiClient = setupAPIClient(context);

  const residences = await apiClient.get(`/residences`);

  return {
    props: {
      residences: residences.data,
    }
  }
})