import {

    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult

} from 'next';

import { verify } from 'jsonwebtoken';

import { parseCookies, destroyCookie } from 'nookies';

import { AuthTokenError } from '../services/errors/AuthTokenError';


interface AccountTypeOfAccount {

    accountTypeOfAccount: [
        pkAccountTypeOfAccount: string,
        fkAccount: string,
        fkTypeOfAccount: string,
        createdAt: Date,
        updatedAt: Date,
        TypeOfAccount: {
            pkTypeOfAccount: string,
            designation: string,
            createdAt: Date,
            updatedAt: Date
        }
    ];
}

export function canSSRAdmin<P>(fn: GetServerSideProps<P>) {

    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);

        const token = cookies['@arrendaki2023.token'];

        if (!token) {

            return {

                redirect: {
                    destination: '/authorizedOnly',
                    permanent: false
                }
            }
        }

        const { accountTypeOfAccount } = verify(

            token,
            process.env.JWT_SECRET

        ) as AccountTypeOfAccount;

        try {

            accountTypeOfAccount.map(item => {
            console.log(accountTypeOfAccount)

                if (item.TypeOfAccount.designation === 'admin') {
                    return {
                        redirect: {
                            destination: '/painel_admin',
                            permanent: false
                        }
                    }
                }
            })

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

