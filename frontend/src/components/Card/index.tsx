import Image from 'next/image'
import React from 'react'
import { Button } from '../Button'


type Props = {
    title: string,
    image: string
}


const Card = ({ image, title }: Props) => {
    return (
        <div className='rounded-xl relative overflow-hidden group hover:scale-105 hover:shadow-md duration-300'>
            <img src={image} alt='/' className='max-h-[160px] md:max-h-[200px] w-full object-cover rounded-xl' />

            <div className='absolute w-full h-full bg-black/50 rounded-xl text-white z-10 flex flex-col 
                items-center justify-center gap-5
            '>
                <h3>{title}</h3>
                <Button link='' text='Visualizar' />
            </div>
        </div>
    )
}

export default Card