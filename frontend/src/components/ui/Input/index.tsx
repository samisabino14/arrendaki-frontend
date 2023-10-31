import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { }

export const Input = ({ ...rest }: InputProps) => {

    return (
        <input className={styles.input} {...rest} />
    )
}

export const TextArea = ({ ...rest }: TextAreaProps) => {

    return (
        <textarea className={styles.textarea} {...rest} />
    )
}

export const Select = ({ ...rest }: SelectProps) => {

    return (
        <select className={styles.select} {...rest} />
    )
}