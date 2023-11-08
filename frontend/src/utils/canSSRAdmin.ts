import {

    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult

} from 'next';

import { verify } from 'jsonwebtoken';

import { parseCookies, destroyCookie } from 'nookies';

import { AuthTokenError } from '../services/errors/AuthTokenError';

interface Role {
    role: string;
}

export function canSSRAdmin<P>(fn: GetServerSideProps<P>) {

    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);

        const token = cookies['@authlip2022.token'];
        
        if (!token) {

            return {

                redirect: {
                    destination: '/authorizedOnly',
                    permanent: false
                }
            }
        }

        const { role } = verify(
            token,
            process.env.JWT_SECRET
        ) as Role;
        
        try {
             
            if(role !== 'administrador') {

                return {

                    redirect: {
                        destination: '/dashboard',
                        permanent: false
                    }
                }
            }

            return await fn(context);
            
        } catch (err) {

            if (err instanceof AuthTokenError) {
                destroyCookie(context, '@authlip2022.token');
            }

            return {

                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }
    }
}

