import { verify } from 'jsonwebtoken';
import {

    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult

} from 'next';

import { parseCookies } from 'nookies';


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

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {

    return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);

        const token = cookies['@arrendaki2023.token'];

        if (token) {
            

            const { accountTypeOfAccount } = verify(

                token,
                process.env.JWT_SECRET

            ) as AccountTypeOfAccount;
            
            if (accountTypeOfAccount[0].TypeOfAccount.designation.toLowerCase() === 'locatario') {

                return {
                    redirect: {
                        destination: '/painel_locatario',
                        permanent: false
                    }
                }
            }

            console.log(accountTypeOfAccount)

            accountTypeOfAccount.map(item => {
                
                if (item.TypeOfAccount.designation.toLowerCase() === 'locatario') {

                    return {
                        redirect: {
                            destination: '/painel_locatario',
                            permanent: false
                        }
                    }
                }

                if (item.TypeOfAccount.designation.toLowerCase() === 'proprietario') {

                    return {
                        redirect: {
                            destination: '/painel_proprietario',
                            permanent: false
                        }
                    }
                }
                if (item.TypeOfAccount.designation === 'admin') {
                    return {
                        redirect: {
                            destination: '/painel_admin',
                            permanent: false
                        }
                    }
                }
            })
        }
        return await fn(context);
    }
}
