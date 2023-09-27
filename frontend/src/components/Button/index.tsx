
import React from 'react'


type Props = {
    link: string,
    text: string
}

export const Button = ({ link, text }: Props) => {
    return (
        <a href={link} className='btn'>{text}</a>
    )
}
