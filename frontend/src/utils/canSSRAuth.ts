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

export function canSSRAuth<P>(fn: GetServerSideProps<P>) {

    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);
        
        const token = cookies['@arrendaki2023.token'];
        
        if (!token) {

            return {

                redirect: {

                    destination: '/signin',
                    permanent: false
                }
            }
        }
        
        try {

            return await fn(context);

        } catch (err) {

            if (err instanceof AuthTokenError) {

                destroyCookie(context, '@arrendaki2023.token');
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

