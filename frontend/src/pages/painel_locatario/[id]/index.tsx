import { HeaderLocatario } from '@/components/HeaderLocatario'
import { Input, Select } from '@/components/ui/Input'
import { AuthContext } from '@/contexts/AuthContext'
import { setupAPIClient } from '@/services/api'
import { api } from '@/services/apiClient'
import { canSSRLocatario } from '@/utils/canSSRLocatario'
import { canSSRProprietario } from '@/utils/canSSRProprietario'
import Head from 'next/head'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';




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


type typeOfContracts = {
  pkTypeOfContract: string,
  designation: string,
  createdAt: string,
  updatedAt: string,
}

interface ResidencesProps {

  residences: Residences[]
  typeOfContracts: typeOfContracts[]
}


function PainelLocatario({ residences, typeOfContracts }: ResidencesProps) {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useContext(AuthContext);

  console.log(typeOfContracts)

  const [residence, setResidence] = useState(null);
  const [typeTypeOfContractsList, setTypeTypeOfContractsList] = useState(typeOfContracts || []);

  const [typeOfContract, setTypeOfContracts] = useState<string>("" || typeTypeOfContractsList[0]?.pkTypeOfContract);
  const [startsAt, setStartsAt] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [info, setInfo] = useState("");


  useEffect(() => {

    async function findOneResidence() {

      setLoading(true)

      const response = await api.get(`/residences/${id}`);

      setResidence(response.data);
    }

    findOneResidence();

    setLoading(false);

  }, [id]);


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

  const handleFinish = async (pkResidence: string) => {



    if (!typeOfContract || !startsAt) {

      toast.warn("Preencha todos os campos!");
      setInfo("Preencha todos os campos.");
      return;
    }

    const birth = new Date(startsAt);
    const today = new Date();

    const differenceInYears = calculateYearDifference(birth, today);

    if (new Date(startsAt) < new Date()) {
      toast.error("Data de início inválida.");
      setInfo(`Selecione uma data posterior a de hoje.`);
      return;
    }

    if (differenceInYears > 5) {
      toast.error("Data inválida.");
      setInfo(`Contratos com mais de ${differenceInYears} anos não são permitidos.`);
      return;
    }

    try {

      const fkClient = user.pkAccount;
      const fkTypeOfContract = typeOfContract;
      const fkResidence = pkResidence;

      console.log({
        typeOfContract,
        pkResidence,
        fkClient,
        startsAt
      })

      const contract = await api.post('/contracts', {
        fkTypeOfContract,
        fkResidence,
        fkClient,
        startsAt
      })

      toast.success('Contrato criado com sucesso.');
      Router.push(`contratos/${contract.data.pkContract}`)

    } catch (err) {
      toast.error('Houve um error interno.');
    }
  }

  const handleChangeTypeOfContracts = (event) => {
    setTypeOfContracts(typeTypeOfContractsList[event.target.value]?.pkTypeOfContract)
  }

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
                <div className='grid text-center my-20 bg-gray-50 text-lg mx-20 gap-4 grid-cols-2 justify-center items-center text-sm text-gray-800'>

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

              {typeOfContracts?.length !== 0 &&
                <div className='mx-20 my-10'>
                  <label className='text-sm my-3 text-gray-500' htmlFor="">Tipo de contrato (Meses):</label>

                  {
                    typeTypeOfContractsList && (
                      <>
                        <Select
                          onChange={handleChangeTypeOfContracts}
                          required
                        >
                          {typeTypeOfContractsList.map((typeOfContract, index) => {
                            return (
                              <option key={typeOfContract.pkTypeOfContract} value={index}>{typeOfContract.designation}</option>
                            )
                          })}

                        </Select>

                        <label className='text-sm my-3 text-gray-500' htmlFor="birthDate">Data de início de contrato:</label>

                        <Input
                          placeholder="Data de nascimento"
                          type="date"
                          value={startsAt}
                          onChange={(e) => setStartsAt(e.target.value)}
                        />

                        {info && <p className='md:text-sm text-xs font-bold text-red-500 md:py-2'>{info}</p>}

                      </>
                    )
                  }
                </div>
              }


              <div
                onClick={() => handleFinish(residence.pkResidence)}
                className='flex justify-center items-center p-30 text-center mx-20  bg-purple-700 text-white font-semibold 
                    rounded-lg text-sm hover:bg-purple-800 hover:scale-105 cursor-pointer py-3'>
                <span>Arrendar</span>

              </div>

            </div>
          </>
        }
      </div>

    </>

  )
}

export default PainelLocatario

export const getServerSideProps = canSSRLocatario(async (context) => {

  const apiClient = setupAPIClient(context);

  const residences = await apiClient.get(`/residences`);
  const typeOfContracts = await apiClient.get(`/typeOfContracts`);

  return {
    props: {
      residences: residences.data,
      typeOfContracts: typeOfContracts.data
    }
  }
})