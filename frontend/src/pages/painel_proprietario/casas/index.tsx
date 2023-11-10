import { HeaderOwner } from '@/components/HeaderOwner'
import { AuthContext } from '@/contexts/AuthContext';
import { api } from '@/services/apiClient';
import { canSSRProprietario } from '@/utils/canSSRProprietario';
import Head from 'next/head'
import Image from 'next/image';
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

                {residencesList.map((residence, index) => {
                    return (

                        <>
                            <h1>{residence.Photos[0].designation}</h1>

                            {residence.Photos && residence.Photos.map((photo, index) => {
                                <>
                                    <h1>UDSUDUS</h1>

                                    <div key={photo.pkPhoto}>
                                        <p >{photo}</p>

                                    </div>
                                </>

                            })}

                            <div key={residence.pkResidence}>
                                <p>{residence.pricePerMonth}</p>

                            </div>
                        </>
                    )
                })}
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