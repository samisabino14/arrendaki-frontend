import { verify } from 'jsonwebtoken';
import {

    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult

} from 'next';

import { parseCookies } from 'nookies';


interface Role {
    
    role: string;
}

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {

    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);

        const token = cookies['@authlip2022.token'];

        if (token) {

            const { role } = verify(

                token,
                process.env.JWT_SECRET

            ) as Role;            

            if(role === 'administrador') {
            
                return {

                    redirect: {

                        destination: '/dashboard',
                        permanent: false
                    }
                }
            }

            if(role === 'funcionario') {
            
                return {

                    redirect: {

                        destination: '/employee',
                        permanent: false
                    }
                }
            }  

            if(role === 'autoridade') {
            
                return {

                    redirect: {

                        destination: '/authority',
                        permanent: false
                    }
                }
            }            
        }

        return await fn(context);
    }
}
