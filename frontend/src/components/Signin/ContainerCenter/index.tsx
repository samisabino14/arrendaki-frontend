import Link from "next/link"
import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"


export const ContainerCenter = ({

    styles,
    handleLogin,
    email,
    setEmail,
    password,
    setPassword,
    loading

}) => {

    return (

        <>
            <h1 className="text-center text-gray-700 md:text-lg text-sm font-bold">Entrar no Sistema</h1>

            <div className={styles.containerCenter}>
        
                <div className={styles.form}>

                    <form onSubmit={handleLogin}>

                        <div>

                            <Input

                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Input

                                placeholder="Palavra-passe"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Button

                                type='submit'
                                loading={loading}
                            >

                                Acessar

                            </Button>
                        </div>

                        <button className={styles.buttonBack}>

                            <Link href='/cadastro'>

                                <span className="text-sm">Inscrever-me</span>

                            </Link>
                        </button>
                    </form>
                </div>

            </div>
        </>

    )
}