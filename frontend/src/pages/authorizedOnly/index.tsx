import Link from "next/link";
import { useRouter } from "next/router";


const AuthorizedOnly = () => {

    const router = useRouter()

    return (
        <div className="justify-items-center lg:h-[100vh] 
            bg-purple-500 text-center text-white"
        >
            <div>
                <h1 className="text-9xl font-bold">400</h1>
                <h1 className="text-1xl pb-8">Somente para pessoas autorizadas.</h1>
                <h1 className="text-sm ">Lista Integrada Pública</h1>
                <div onClick={router.back} className="text-sm py-10 text-center ">

                    <button className="text-purple-400 p-4 font-bold lg:px-20 bg-white rounded-lg">
                        Voltar
                    </button>

                </div>
            </div>
        </div>
    )
}

export default AuthorizedOnly;