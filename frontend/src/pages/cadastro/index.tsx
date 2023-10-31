import React, {

    FormEvent,
    useState,
    useContext,
    useEffect

} from 'react';

import { FiChevronLeft } from 'react-icons/fi'

import Head from 'next/head';

import { canSSRGuest } from '../../utils/canSSRGuest';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { Input, Select } from '../../components/ui/Input/index';
import { Button } from '../../components/ui/Button/index';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { setupAPIClient } from '../../services/api';
import { api } from '../../services/apiClient';


type Province = {

    id: string,
    name: string,
    capital: number,
    status: boolean,
    createdAt: string,
    updatedAt: string
}
interface ProvinceProps {
    provinces: Province[],
    genres: string[],
}

export default function SignUp() {

    const genres = [
        "Feminino",
        "Masculino"
    ]

    const provinces = [
        {
            id:'112345',
            name:'Benguela'
        },
        {
            id:'276543',
            name:'Luanda'
        },
    ]

    const { signUp } = useContext(AuthContext);

    const [provincesList] = useState(provinces || []);
    const [countysList, setCountysList] = useState([]);
    
    const [fullName, setFullName] = useState("");
    const [biNumber, setBiNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [genreList, setGenreList] = useState(genres || []);
    const [genre, setGenre] = useState("" || genres[0]);

    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [province, setProvince] = useState<string>("" || provincesList[0]?.id);
    const [county, setCounty] = useState<string>("");

    const [district, setDistrict] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [road, setRoad] = useState("");
    const [houseNumber, setHouseNumber] = useState("");

    const [loading, setLoading] = useState(false);

    const [formPersonalData, setFormPersonalData] = useState(true);
    const [formLocation, setFormLocation] = useState(false);
    const [formContact, setFormContact] = useState(false);

    const [info, setInfo] = useState("");

    useEffect(() => {

        setLoading(true)


            async function findManyCountysByIDProvince() {

                const countys = await api.get(`/province/countys`, {
                    params: {
                        provinceId: province
                    }
                });

                if (countys.data.length === 0) {
                    toast.warn("Sem registro de municípios para esta província.");
                    setCounty('');
                }

                setCountysList(countys.data);
                setCounty(countys.data[0]?.id);
            }

            //findManyCountysByIDProvince();

        setLoading(false);

    }, [province]);

    const calculateYearDifference = (date1, date2) => {

        const firstDate = new Date(date1);
        const secondDate = new Date(date2);

        // Calculate the difference in milliseconds
        const differenceMilliseconds = Math.abs(Number(secondDate) - Number(firstDate));

        // Calculate the difference in years
        const millisecondsPerYear = 3.15576e10; // Approximately 1 year in milliseconds
        const differenceYears = Math.floor(differenceMilliseconds / millisecondsPerYear);

        return differenceYears;
    };

    const goPersonalData = (event: FormEvent) => {

        event.preventDefault();

        setFormPersonalData(true);
        setFormContact(false);
        setFormLocation(false);
    }

    const goContacts = (event: FormEvent) => {

        event.preventDefault();

        const birth = new Date(birthDate);
        const today = new Date();

        const differenceInYears = calculateYearDifference(birth, today);

        if (!fullName || !biNumber || !birthDate || !genre) {
            toast.warn("Preencha todos os campos.");
            setInfo("Preencha todos os campos.");
            return;
        }


        if (new Date(birthDate) > new Date()) {
            toast.error("Data de nascimento inválida.");
            setInfo("Selecione uma data anterior a de hoje.");
            return;
        }

        if (differenceInYears < 18) {
            toast.error("Data inválida.");
            setInfo(`Tens ${differenceInYears} anos. Deves ter 18 anos para se inscrever.`);
            return;
        }

        if (fullName.length < 3) {
            toast.error("Nome completo inválido.");
            setInfo(`O nome completo tem ${fullName.length} caracteres. Deve conter 3 caracteres no mínimo.`);
            return;
        }

        if (biNumber.length !== 14) {
            toast.error("Número do BI inválido.");
            setInfo(`O número do BI tem ${biNumber.length} caracteres. Deve conter 14.`);
            return;
        }

        if (!genre) {
            toast.error("Género inválido.");
            setInfo("Selecione um género.");
            return;
        }

        if (!birthDate) {
            toast.error("Data de nascimento inválida.");
            setInfo("Selecione a tua data de nascimento.");
            return;
        }

        setInfo('')
        setFormPersonalData(false);
        setFormLocation(false);
        setFormContact(true);
    }

    const goLocation = (event: FormEvent) => {

        event.preventDefault();

        if (!email || !phoneNumber) {
            toast.warn("Preencha todos os campos.");
            setInfo("Preencha todos os campos");
            return;
        }

        if (!phoneNumber) {
            toast.error("Número de telemóvel inválido.");
            setInfo("Informe o teu número de telemóvel.");
            return;
        }

        if (email.length < 12) {
            toast.error("O Email inválido.");
            setInfo("O Email deve conter no mínimo 12 caracteres.");
            return;
        }

        else if (phoneNumber.length < 9) {
            toast.error("Número de telemóvel deve conter no mínimo 9 números.");
            setInfo("Número de telemóvel deve conter no mínimo 9 números.");
            return;
        }

        setInfo('')
        setFormContact(false);
        setFormLocation(true);
    }

    const handleSignUp = async (event: FormEvent) => {

        event.preventDefault();

        if (!province || !district || !neighborhood) {

            toast.warn("Preencha todos os campos!");
            setInfo("Preencha todos os campos.");
            return;
        }

        /*
        if (province.length < 3) {

            toast.error("Província inválida.");
            setInfo("A província deve conter no mínimo 3 caracteres.");
            return;
        }

        if (county.length < 3) {

            toast.error("Município inválido.");
            setInfo("O Município deve conter no mínimo 3 caracteres.");
            return;
        }
        */
        
        setInfo('')
        setLoading(true);

        await signUp({

            fullName,
            biNumber,
            birthDate,
            genre,
            email,
            phoneNumber,
            provinceId: province,
            countyId: county,
            district,
            neighborhood,
            road,
            houseNumber
        })

        setLoading(false);
    }

    const handleChangeGenre = (event) => {
        setGenre(genreList[event.target.value])
    }

    const handleChangeProvince = (event) => {
        setProvince(provincesList[event.target.value]?.id)
    }

    const handleChangeCounty = (event) => {
        setCounty(countysList[event.target.value]?.id)
    }

    useEffect(() => {

        handleChangeProvince
        handleChangeCounty
        handleChangeGenre

    }, [province, county, genre]);

    return (

        <>
            <Head>
                <title>Inscrever-me</title>
            </Head>

            <div className='mt-[6rem] md:mt-[7rem] text-gray-500'>

                <Header />

                <h1 className="text-center text-gray-700 md:text-lg text-sm font-bold">Inscreva-se</h1>

                <div className={styles.containerCenter}>

                    <div className={styles.form}>

                        {formPersonalData &&

                            <>

                                <p className="text-lg mb-10 font-semibold">Dados pessoais</p>

                                <form onSubmit={goContacts}>

                                    <div id="locationData">

                                        <label className='text-sm my-3 text-gray-500' htmlFor="birthDate">Nome completo:</label>

                                        <Input

                                            placeholder="Nome completo"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />

                                        <label className='text-sm my-3 text-gray-500' htmlFor="birthDate">Identidade:</label>

                                        <Input

                                            placeholder="Número de identificação"
                                            type="text"
                                            value={biNumber}
                                            onChange={(e) => setBiNumber(e.target.value)}
                                        />

                                        <label className='text-sm my-3 text-gray-500' htmlFor="birthDate">Data de nascimento:</label>

                                        <Input
                                            placeholder="Data de nascimento"
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                        />

                                        {genreList?.length !== 0 &&
                                            <>
                                                <label className='text-sm my-3 text-gray-500' htmlFor="county">Gênero:</label>

                                                <Select
                                                    onChange={handleChangeGenre}
                                                    required
                                                >
                                                    {genreList.map((genre, index) => {
                                                        return (
                                                            <option key={genre} value={index}>{genre}</option>
                                                        )
                                                    })}

                                                </Select>
                                            </>
                                        }

                                        {info && <p className='md:text-sm text-xs font-bold text-red-500 md:py-2'>{info}</p>}

                                        <Button
                                            type='submit'
                                            loading={loading}
                                        >

                                            Próximo

                                        </Button>

                                    </div>
                                </form>

                            </>
                        }

                        {formContact &&
                            <>

                                <p className="text-lg mb-10 font-semibold">Contactos</p>

                                <form onSubmit={goLocation}>

                                    <div>

                                        <Input

                                            placeholder="Email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />

                                        <Input

                                            placeholder="Telemóvel"
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                        />

                                        {
                                            info && <p className='md:text-sm text-xs font-bold text-red-500 md:py-2'>{info}</p>
                                        }

                                        <Button

                                            type='submit'
                                            loading={loading}
                                        >

                                            Próximo
                                        </Button>
                                    </div>

                                </form>


                                <button className={styles.buttonBack} onClick={goPersonalData}>
                                    <FiChevronLeft color='#8E8A8B' size={20} />
                                </button>

                            </>
                        }

                        {formLocation &&
                            <>
                                <p className="text-lg mb-10 font-semibold">Localização</p>

                                <form onSubmit={handleSignUp}>

                                    <div>
                                        {provincesList?.length !== 0 &&
                                            <>
                                                <label className='text-sm my-3 text-gray-500' htmlFor="county">Província:</label>

                                                <Select
                                                    onChange={handleChangeProvince}
                                                    required
                                                >
                                                    {provincesList.map((province, index) => {
                                                        return (
                                                            <option key={province.id} value={index}>{province.name}</option>
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
                                                                <option key={county.id} value={index}>{county.name}</option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </>
                                        }

                                        <label className='text-sm' htmlFor="district">Distrito/Comuna:</label>

                                        <Input

                                            id='district'
                                            name='district'
                                            placeholder="Distrito/Comuna"
                                            type="text"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            required
                                        />

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

                                        {
                                            info && <p className='md:text-sm text-xs font-bold text-red-500 md:py-2'>{info}</p>
                                        }

                                        <Button

                                            type='submit'
                                            loading={loading}
                                        >

                                            Cadastrar

                                        </Button>


                                    </div>
                                </form>

                                <button className={styles.buttonBack} onClick={goContacts}>
                                    <FiChevronLeft color='#8E8A8B' size={20} />
                                </button>
                            </>
                        }

                    </div>
                </div>

            </div >
        </>
    )
}

/*
export const getServerSideProps = canSSRGuest(async (context) => {
    const apiClient = setupAPIClient(context);

    const provinces = await apiClient.get(`/provinces`);

    const genres = [
        "Feminino",
        "Masculino"
    ]

    return {

        props: {
            provinces: provinces.data,
            genres
        }
    }
})
*/