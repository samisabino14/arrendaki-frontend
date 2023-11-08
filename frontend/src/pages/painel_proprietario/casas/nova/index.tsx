import { HeaderOwner } from '@/components/HeaderOwner'
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'
import Head from 'next/head'
import React, { useState } from 'react'
import styles from './styles.module.scss';


function Nova() {

    const [info, setInfo] = useState("");
    const [address, setAddress] = useState("");
    const [pricePerMonth, setPricePerMonth] = useState(0.0);
    const [iban, setIban] = useState("");
    const [pkLocality, setPkLocality] = useState("");
    const [pkTypology, setPkTypology] = useState("");
    const [fotos, setFotos] = useState([]);
    const [isFurnished, setIsFurnished] = useState(false);

    const [loading, setLoading] = useState(false);


    return (

        <>
            <Head>
                <title>Arrendaki</title>
            </Head>

            <HeaderOwner />

            <div className='p-20'>

                <h1 className="text-center text-gray-700 md:text-lg text-sm font-bold mt-10">Registrar Casa</h1>

                <div className={styles.containerCenter}>

                    <div className={styles.form}>

                        <form>

                            <div>

                                <label className='text-sm my-3 text-gray-500' htmlFor="address">Endereço:</label>

                                <Input
                                    placeholder="Endereço"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />

                                <label className='text-sm my-3 text-gray-500' htmlFor="photo1">Foto 1:</label>
                                <input type="file" title='Foto' name="photo1" id="photo1" />

                                <label className='text-sm my-3 text-gray-500' htmlFor="photo2">Foto 2:</label>
                                <input type="file" title='Foto' name="photo2" id="photo2" />


                                {info && <p className='md:text-sm text-xs font-bold text-red-500 md:py-2'>{info}</p>}

                                <Button
                                    type='submit'
                                    loading={loading}
                                >

                                    Próximo

                                </Button>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Nova