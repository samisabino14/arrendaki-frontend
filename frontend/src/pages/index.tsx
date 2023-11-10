"use client"

import Head from 'next/head';

import { canSSRGuest } from '../utils/canSSRGuest';

import { Header } from '../components/Header';
import { Hero } from '@/components/Hero';
import Houses from '@/components/Houses';
import { setupAPIClient } from '@/services/api';
import Link from 'next/link';
import Headline from '@/components/Headline';



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


export default function Home({ residences }: ResidencesProps) {

    return (

        <>
            <Head>
                <title>Arrendaki</title>
            </Head>

            <Header />

            <Hero />

            <Headline title='Casas' />

            <div className="p-20 grid grid-cols-1 gap-4">

                <ul className="grid lg:grid-cols-3 gap-4 lg:p-8">

                    {residences.map((residence, index) => (

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
                                    href={`residencia/${residence.pkResidence}`}
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

export const getServerSideProps = canSSRGuest(async (context) => {
    const apiClient = setupAPIClient(context);

    const residences = await apiClient.get(`/residences`);

    return {
        props: {
            residences: residences.data,
        }
    }
})
