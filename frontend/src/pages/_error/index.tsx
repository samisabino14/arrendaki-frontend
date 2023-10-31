import Link from "next/link";
import { useRouter } from "next/router";


const Error = () => {

    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center lg:h-[100vh] 
            bg-purple-500 text-center text-white"
        >
            <div>
                <h1 className="text-9xl font-bold">404</h1>
                <h1 className="text-1xl pb-8">Página não encontrada</h1>
                <h1 className="text-sm ">Arrendaki</h1>
                <div  onClick={router.back} className="text-sm py-10 text-center ">

                    <button className="hover:scale-110 transition-all duration-300 text-purple-400 p-4 font-bold lg:px-20 bg-white rounded-lg">
                        Voltar
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Error;
