import { ReactNode, ButtonHTMLAttributes } from 'react';

import { FiLoader } from 'react-icons/fi';

import styles from './styles.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

    loading: boolean,
    children: ReactNode
}


export const Button = ({ loading, children, ...rest }: ButtonProps) => {

    return (

        <button

            className={styles.button}
            disabled={loading}
            {...rest}
        >

            {loading

                ? (<FiLoader color='#fff' size={18} />)

                : <span>{children}</span>
            }


        </button>
    )
}