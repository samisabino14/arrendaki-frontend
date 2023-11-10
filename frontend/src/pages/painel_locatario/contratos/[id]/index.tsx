import { HeaderOwner } from '@/components/HeaderOwner'
import { api } from '@/services/apiClient';
import { canSSRProprietario } from '@/utils/canSSRProprietario'
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
function ContratoID() {

    const router = useRouter();
    const { id } = router.query;

    const [contract, setContract] = useState(null);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {

        async function findOneContract() {

            setLoading(true)

            const response = await api.get(`/contracts/${id}`);

            setContract(response.data);
        }

        findOneContract();

        setLoading(false);

    }, [id]);

    const returnDate = (date: string): string => {

        const aux = new Date(date);

        aux.setMonth(aux.getMonth() + 1);

        return `${aux.getDate()}/${aux.getMonth()}/${aux.getFullYear}`
    }

    return (
        <div className="p-20 grid grid-cols-1 gap-4">
            {contract
                &&

                <div
                    className='shadow-lg rounded-lg p-10 flex flex-col justify-center items-center gap-8'
                >


                    <div className='text-sm text-gray-800 flex flex-col justify-center items-center'>

                        <img className='bg-gray-200'
                            src={`http://localhost:5000/files/${contract.Residence.Photos[0]?.designation}`}
                            alt="" width={420} height={280}
                        />

                        <p className='text-2xl text-center my-5 text-purple-700 font-bold'>{contract.Residence.pricePerMonth} AKz</p>

                        <div className='flex flex-col gap-2 pb-10'>
                            <p>Residencia: {contract.Residence.address}</p>
                            <p>Início: {new Date(contract.startsAt).getDate()}-{new Date(contract.startsAt).getMonth() + 1}-{new Date(contract.startsAt).getFullYear()}</p>
                            <p>Término: {new Date(contract.endsAt).getDate() + 1}-{new Date(contract.endsAt).getMonth() + 1}-{new Date(contract.endsAt).getFullYear()}</p>
                            <p>Duração: {contract.TypeOfContract.designation} Mes (es)</p>
                        </div>

                        <div className=''>
                            <Link
                                className='px-52 text-center py-2 m-10 bg-purple-700 text-white font-semibold 
                    rounded-lg text-sm hover:bg-purple-800 hover:scale-125'
                                href={`/painel_locatario`}
                            >
                                Voltar
                            </Link>

                        </div>

                    </div>

                </div>


            }

        </div>
    )
}

export default ContratoID