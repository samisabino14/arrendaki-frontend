import React from 'react'
import { Button } from '../Button'

export const Hero = () => {

    return (
        
        <div className='bg-[url("/heroImage.jpg")] h-screen bg-cover bg-no-repeat bg-fixed flex items-center justify-center relative'>
            <div className='absolute inset-0 bg-black/70'></div>

            <div className='container lg:mt-20 mx-auto px-4 z-10'>
        
                <div className='text-center text-white flex flex-col gap-[20px] md:gap-[40px]'>

                    <div>
                        <h1 className='text-2xl md:text-3xl lg:text-5xl font-semibold tracking-wider'>Encontre A Casa Que Você Deseja!</h1>
                    </div>
                    
                    <div>
                        <h1 className='text-2xl lg:text-4xl font-semibold tracking-wider text-gray-200'><span className=''>Arrende</span> Connosco</h1>
                    </div>

                    <div className='mx-auto bg-purple-700 h-[2px] w-[150px]'></div>

                    <div>
                        <p className='text-sm md:text-xl text-gray-100 tracking-wider'>A tua satisfação é a nossa motivação</p>

                    </div>
                    <div>
                        <Button link='/login' text='Arrendar agora' />
                    </div>

                </div>

            </div>
        </div>
    )
}
