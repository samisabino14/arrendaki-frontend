import React, {

    FormEvent,
    useState,
    useContext,
    useEffect

} from 'react';

import { FiChevronLeft } from 'react-icons/fi'
import axios from 'axios';
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

    const { signUp } = useContext(AuthContext);

    const [provincesList, setProvincesList] = useState([]);
    const [countysList, setCountysList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [typeOfAccountList, setTypeOfAccountList] = useState([]);
    const [genreList, setGenreList] = useState(genres || []);
    
    const [fullName, setFullName] = useState("");
    const [identifyCardNumber, setIdentifyCardNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [genre, setGenre] = useState("" || genres[0]);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [pkTypeOfAccount, setPkTypeOfAccount] = useState("" || typeOfAccountList[0]?.pkTypeOfAccount);
    const [phoneNumber, setPhoneNumber] = useState("");

    const [province, setProvince] = useState<string>("" || provincesList[0]?.pkProvince);
    const [county, setCounty] = useState<string>("" || countysList[0]?.pkCounty);
    const [district, setDistrict] = useState<string>("" || districtList[0]?.pkDistrict);

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

        async function findAllTypeOfAccount() {

            const response = await api.get('/typeOfAccount');

            setTypeOfAccountList(response.data.filter(
                typeOfAccount => typeOfAccount.designation.toLowerCase() !== 'admin' ||
                    typeOfAccount.designation.toLowerCase() === null
            ));
        }

        findAllTypeOfAccount();

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

        if (!fullName || !identifyCardNumber || !birthDate || !genre) {
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

        if (identifyCardNumber.length !== 14) {
            toast.error("Número do BI inválido.");
            setInfo(`O número do BI tem ${identifyCardNumber.length} caracteres. Deve conter 14.`);
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

        console.log(
            provincesList
        )

        if (!email || !phoneNumber || !username || !password || !pkTypeOfAccount) {
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
        
        console.log({
            fullName,
            identifyCardNumber,
            birthDate,
            genre,
            username,
            email,
            password,
            phoneNumber,
            provinceId: province,
            countyId: county,
            districtId: district,
            neighborhood,
            road,
            houseNumber,
            pkTypeOfAccount
        })


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
            identifyCardNumber,
            birthDate,
            genre,
            username,
            email,
            password,
            phoneNumber,
            fkProvince: province,
            fkCounty: county,
            fkDistrict: district,
            neighborhood,
            road,
            houseNumber,
            pkTypeOfAccount
        })

        setLoading(false);
    }

    const handleChangeGenre = (event) => {
        setGenre(genreList[event.target.value])
    }

    const handleChangeProvince = (event) => {
        setProvince(provincesList[event.target.value]?.pkProvince)
    }

    const handleChangeCounty = (event) => {
        setCounty(countysList[event.target.value]?.pkCounty)
    }

    const handleChangeDistrict = (event) => {
        setDistrict(districtList[event.target.value]?.pkDistrict)
    }

    const handleChangeTypeOfAccount = (event) => {
        setPkTypeOfAccount(typeOfAccountList[event.target.value].pkTypeOfAccount)
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
                                            value={identifyCardNumber}
                                            onChange={(e) => setIdentifyCardNumber(e.target.value)}
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
                                                <label className='text-sm my-3 text-gray-500' htmlFor="">Gênero:</label>

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

                                <p className="text-lg mb-10 font-semibold">Utilizador</p>

                                <form onSubmit={goLocation}>

                                    <div>

                                        <label className='text-sm my-3 text-gray-500' htmlFor="county">Nome de utilizador:</label>

                                        <Input

                                            placeholder="Nome de utilizador"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />

                                        <label className='text-sm my-3 text-gray-500' htmlFor="county">Email:</label>

                                        <Input

                                            placeholder="Email"
                                            type="enail"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />

                                        <label className='text-sm my-3 text-gray-500' htmlFor="">Palavra-passe:</label>

                                        <Input

                                            placeholder="Palavra-passe"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />

                                        <label className='text-sm my-3 text-gray-500' htmlFor="">Telemóvel:</label>

                                        <Input

                                            placeholder="Telemóvel"
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                        />


                                        {typeOfAccountList?.length !== 0 &&
                                            <>
                                                <label className='text-sm my-3 text-gray-500' htmlFor="">Tipo de utilizador:</label>

                                                <Select
                                                    onChange={handleChangeTypeOfAccount}
                                                    required
                                                >
                                                    {typeOfAccountList.map((typeOfAccount, index) => {
                                                        return (
                                                            <option key={typeOfAccount.pkTypeOfAccount} value={index}>{typeOfAccount.designation}</option>
                                                        )
                                                    })}

                                                </Select>
                                            </>
                                        }

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


export const getServerSideProps = canSSRGuest(async (context) => {
    const apiClient = setupAPIClient(context);

    const genres = [
        "Feminino",
        "Masculino"
    ]

    return {

        props: {
           
        }
    }
})
