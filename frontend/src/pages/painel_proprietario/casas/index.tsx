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
                    fkOwner: '171e4c18-ff32-4341-a255-04840c589f26',
                }
            });

            setResidencesList(response.data);
        }

        findAllResidences();

        setLoading(false);

    }, []);



    return (
        <>
            <Head>
                <title>Arrendaki</title>
            </Head>

            <HeaderOwner />

            <div className='p-20'>




                <h1>Casas</h1>

                {residencesList.map((residence, index) => (


                    <div key={index}
                        className='rounded-lg p-10 flex flex-col justify-center items-center gap-8'
                    >

                        <img className='bg-gray-200'
                            src={`http://localhost:5000/files/${residence.Photos[0].designation}`}
                            alt="" width={320} height={280}
                        />

                        <div className='text-sm text-gray-800'>

                            <p><span className='text-xl text-purple-700 font-bold'>{residence.pricePerMonth} AKz</span></p>
                            <p>Tipologia: <span className='text-xl font-bold'>{residence.Typology.designation}</span></p>
                            
                            <p>Endereço: {residence.address}</p>
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