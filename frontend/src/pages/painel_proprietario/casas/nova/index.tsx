import { HeaderOwner } from '@/components/HeaderOwner'
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input'
import Head from 'next/head'
import React, { useEffect, ChangeEvent, useState, FormEvent, useContext } from 'react'
import styles from './styles.module.scss';
import { toast } from 'react-toastify';

import { FiUpload } from 'react-icons/fi';
import { api } from '@/services/apiClient';
import Router from 'next/router';
import { canSSRProprietario } from '@/utils/canSSRProprietario';
import { AuthContext } from '@/contexts/AuthContext';

function Nova() {

    const { user } = useContext(AuthContext);

    const [provincesList, setProvincesList] = useState([]);
    const [countysList, setCountysList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [typologyList, setTypologyList] = useState([]);
    
    const [province, setProvince] = useState<string>("" || provincesList[0]?.pkProvince);
    const [county, setCounty] = useState<string>("" || countysList[0]?.pkCounty);
    const [district, setDistrict] = useState<string>("" || districtList[0]?.pkDistrict);

    const [neighborhood, setNeighborhood] = useState("");
    const [road, setRoad] = useState("");
    const [houseNumber, setHouseNumber] = useState("");

    const [avatar1Url, setAvatar1Url] = useState("");
    const [avatar2Url, setAvatar2Url] = useState("");
    const [imageAvatar1, setImageAvatar1] = useState(null);
    const [imageAvatar2, setImageAvatar2] = useState(null);

    const [info, setInfo] = useState("");
    const [address, setAddress] = useState("");
    const [pricePerMonth, setPricePerMonth] = useState("");
    const [iban, setIban] = useState("");
    const [pkTypology, setPkTypology] = useState("");
    const [isFurnished, setIsFurnished] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        setLoading(true);

        async function findAllTypology() {

            const response = await api.get('/typologies');

            setTypologyList(response.data);
        }

        findAllTypology();

        setLoading(false);

    }, []);


    useEffect(() => {

        setLoading(true)

        async function findAllProvinces() {

            const response = await api.get('/provinces');

            setProvincesList(response.data);
        }

        findAllProvinces();

        setLoading(false);

    }, []);

    useEffect(() => {

        setLoading(true)

        async function findAllCountys() {

            const response = await api.get('/countys');

            setCountysList(response.data);
        }

        findAllCountys();

        setLoading(false);

    }, [province]);

    useEffect(() => {

        setLoading(true)

        async function findAllDistrict() {

            const response = await api.get('/districts');

            setDistrictList(response.data);
        }

        findAllDistrict();

        setLoading(false);

    }, [county]);

    const handleChangeProvince = (event) => {
        setProvince(provincesList[event.target.value]?.pkProvince)
    }

    const handleChangeCounty = (event) => {
        setCounty(countysList[event.target.value]?.pkCounty)
    }

    const handleChangeDistrict = (event) => {
        setDistrict(districtList[event.target.value]?.pkDistrict)
    }

    const handleChangeTypology = (event) => {
        setPkTypology(typologyList[event.target.value].pkTypology)
    }

    useEffect(() => {

        handleChangeProvince
        handleChangeCounty
        handleChangeDistrict

    }, [province, county, district]);


    const handleFile1 = (event: ChangeEvent<HTMLInputElement>) => {

        if (!event.target.files) {
            return;
        }

        const image = event.target.files[0];

        if (!image) {
            return;
        }
        if (image.type === 'image/png' || image.type === 'image/jpeg') {

            setImageAvatar1(image);
            setAvatar1Url(URL.createObjectURL(event.target.files[0]));
        }
    }


    const handleFile2 = (event: ChangeEvent<HTMLInputElement>) => {

        if (!event.target.files) {
            return;
        }

        const image = event.target.files[0];

        if (!image) {
            return;
        }
        if (image.type === 'image/png' || image.type === 'image/jpeg') {

            setImageAvatar2(image);
            setAvatar2Url(URL.createObjectURL(event.target.files[0]));
        }
    }

    const handleSave = async (e: FormEvent) => {

        e.preventDefault();

        if (
            !imageAvatar1 ||
            !imageAvatar2 ||
            !province ||
            !county ||
            !district ||
            !neighborhood ||
            !road ||
            !iban ||
            !pricePerMonth ||
            !pkTypology
        ) {
            toast.warn("Preencha todos os campos.");
            setInfo("Preencha todos os campos.");
            return;
        }

        if (imageAvatar1.name === imageAvatar2.name) {
            toast.warn("Escolha imagens diferentes.");
            setInfo("Escolha imagens diferentes.");
            return;
        }

        try {

            const photos = [];

            photos.push(imageAvatar1)
            photos.push(imageAvatar2)

            const districtResponse = await api.get(`/districts/${district}`);

            if (!districtResponse) {
                toast.error('Distrito/Comuna inválido!');
                return;
            }

            const typoligyResponse = await api.get(`/typologies/${pkTypology}`);

            const localityResponse = await api.post('/localitys', {
                neighborhood,
                road,
                houseNumber,
                fkDistrict: districtResponse.data.pkDistrict
            });

            console.log(user)

            console.log({
                address: `${neighborhood}, ${road}, ${houseNumber},`,
                iban,
                pricePerMonth,
                fkOwner: user.fkPerson,
                fkLocality: localityResponse.data.pkLocality,
                fkTypology: typoligyResponse.data.pkTypology,
            })

            const residenceResponse = await api.post('/residences', {
                address: `${neighborhood}, ${road}, ${houseNumber},`,
                iban,
                pricePerMonth,
                fkOwner: user.fkPerson,
                fkLocality: localityResponse.data.pkLocality,
                fkTypology: typoligyResponse.data.pkTypology,
            });

            const fkResidence = residenceResponse.data.pkResidence

            photos.map(async (photo) => {
                const data = new FormData();

                data.append('fkResidence', fkResidence)
                data.append('file', photo)

                await api.post('/photos', data);
            });

            toast.success('Casa salva!');

            Router.push('/painel_proprietario');

        } catch (err) {
            toast.error('Erro ao guardar!');
        }
    }

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

                        <form onSubmit={handleSave}>

                            <div>
                                <h1 className='text-sm mb-10 text-center text-gray-500'>Imagens da casa:</h1>

                                <div className='md:flex flex-row md:gap-8'>

                                    <label className={styles.labelAvatar}>

                                        <span className={styles.icon}>
                                            <FiUpload size={30} color='#FFF' />
                                        </span>

                                        <input
                                            type="file"
                                            accept='image/png image/jpeg'
                                            onChange={handleFile1}
                                        />

                                        {
                                            avatar1Url && (
                                                <img
                                                    className={styles.preview}
                                                    src={avatar1Url}
                                                    alt='Foto'
                                                    width={250}
                                                    height={250}
                                                />
                                            )
                                        }

                                    </label>

                                    <label className={styles.labelAvatar}>

                                        <span className={styles.icon}>
                                            <FiUpload size={30} color='#FFF' />
                                        </span>

                                        <input
                                            type="file"
                                            accept='image/png image/jpeg'
                                            onChange={handleFile2}
                                        />

                                        {
                                            avatar2Url && (
                                                <img
                                                    className={styles.preview}
                                                    src={avatar2Url}
                                                    alt='Foto'
                                                    width={250}
                                                    height={250}
                                                />
                                            )
                                        }

                                    </label>
                                </div>

                                <div className='md:grid grid-cols-2 md:gap-8 md:mb-10'>

                                    <div className='md:shadow-lg shadow-gray-500 md:p-10 rounded-lg'>

                                        <h1 className='text-center pb-10'>Informação da casa</h1>

                                        {typologyList?.length !== 0 &&
                                            <>
                                                <label className='text-sm my-3 text-gray-500' htmlFor="">Tipologia da casa:</label>

                                                <Select
                                                    onChange={handleChangeTypology}
                                                    required
                                                >
                                                    {typologyList.map((typology, index) => {
                                                        return (
                                                            <option key={typology.pkTypology} value={index}>{typology.designation}</option>
                                                        )
                                                    })}

                                                </Select>
                                            </>
                                        }


                                        <label className='text-sm' htmlFor="district">Valor Mensal:</label>

                                        <Input

                                            id='pricePerMonth'
                                            name='pricePerMonth'
                                            placeholder="Valor Mensal"
                                            type="text"
                                            value={pricePerMonth}
                                            onChange={(e) => setPricePerMonth(e.target.value)}
                                            required
                                        />

                                        <label className='text-sm my-3 text-gray-500' htmlFor="address">IBAN:</label>

                                        <Input
                                            placeholder="IBAN"
                                            type="text"
                                            value={iban}
                                            onChange={(e) => setIban(e.target.value)}
                                        />

                                    </div>


                                    <div className='md:shadow-lg shadow-gray-500 md:p-10 rounded-lg'>
                                        <h1 className='text-center pb-10'>Localização</h1>

                                        {provincesList?.length !== 0 &&
                                            <>
                                                <label className='text-sm my-3 text-gray-500' htmlFor="county">Província:</label>

                                                <Select
                                                    onChange={handleChangeProvince}
                                                    required
                                                >
                                                    {provincesList.map((province, index) => {
                                                        return (
                                                            <option key={province.pkProvince} value={index}>{province.designation}</option>
                                                        )
                                                    })}

                                                </Select>
                                            </>
                                        }

                                        {countysList?.length !== 0 &&

                                            <>
                                                <label className='text-sm my-3 text-gray-500' htmlFor="county">Município:</label>

                                                <Select
                                                    onChange={handleChangeCounty}
                                                    required
                                                >
                                                    {
                                                        countysList.map((county, index) => {
                                                            return (
                                                                <option key={county.pkCounty} value={index}>{county.designation}</option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </>
                                        }

                                        {districtList?.length !== 0 &&

                                            <>
                                                <label className='text-sm' htmlFor="district">Distrito/Comuna:</label>

                                                <Select
                                                    onChange={handleChangeDistrict}
                                                    required
                                                >
                                                    {
                                                        districtList.map((district, index) => {
                                                            return (
                                                                <option key={district.pkDistrict} value={index}>{district.designation}</option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </>
                                        }

                                        <label className='text-sm' htmlFor="district">Bairro:</label>

                                        <Input

                                            id='neighborhood'
                                            name='neighborhood'
                                            placeholder="Bairro"
                                            type="text"
                                            value={neighborhood}
                                            onChange={(e) => setNeighborhood(e.target.value)}
                                            required
                                        />

                                        <label className='text-sm' htmlFor="road">Rua:</label>

                                        <Input

                                            id='road'
                                            name='road'
                                            placeholder="Rua"
                                            type="text"
                                            value={road}
                                            onChange={(e) => setRoad(e.target.value)}
                                        />

                                        <label className='text-sm' htmlFor="houseNumber">Número da casa:</label>

                                        <Input

                                            id='houseNumber'
                                            name='houseNumber'
                                            placeholder="Número da casa"
                                            type="number"
                                            value={houseNumber}
                                            onChange={(e) => setHouseNumber(e.target.value)}
                                        />
                                    </div>

                                </div>

                                {info && <p className='md:text-sm text-xs font-bold text-red-500 md:py-2'>{info}</p>}

                                <Button
                                    type='submit'
                                    loading={loading}
                                >

                                    Guardar

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

export const getServerSideProps = canSSRProprietario(async (context) => {

    return {
        props: {
        }
    }
})