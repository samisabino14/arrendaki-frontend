import Link from 'next/link';

import { FcCalendar } from 'react-icons/fc';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

import { useState } from 'react';
import { Button } from '../Button';

export const Header = () => {

    const [toggle, setToggle] = useState(false)

    return (

        <div className='fixed bg-white top-0 w-[100%] z-20'>
            <div className='container mx-auto flex justify-between items-center p-4'>
                <div className='flex gap-1 items-center text-purple-700 font-bold text-xl md:text-2xl'>
                    <Link href='/'>
                        <h2 className='hover:text-purple-600'>Arrendaki</h2>
                    </Link>
                </div>

                <div className='hidden md:flex gap-10 text-gray-700'>
                    <Link href='/'>
                        <span className='hover:text-purple-700'>Início</span>
                    </Link>

                    <Link href='/casas'>

                        <span className='hover:text-purple-700'>Casas</span>

                    </Link>

                    <Link href='/'>

                        <span className='hover:text-purple-700'>Sobre</span>

                    </Link>

                    <Link href='/'>

                        <span className='hover:text-purple-700'>Cadastrar-me</span>

                    </Link>
                </div>

                <div className='hidden md:block'>

                    <Button link='#' text='Entrar' />                        

                </div>

                {
                    toggle ? (
                        <AiOutlineClose onClick={() => setToggle(!toggle)} size={24} className='md:hidden block' />

                    ) : (
                        <FiMenu onClick={() => setToggle(!toggle)} size={24} className='md:hidden block' />
                    )
                }

            </div>

            <div className={`duration-500 md:hidden flex flex-col w-[70%] rounded-lg h-screen fixed bg-purple-700/80 gap-6 text-white top-[60px] ${toggle ? `left-[0]` : `left-[-100%]`}`}>
                <p></p>
                
                <Link href='/'>
                        <span className='hover:text-purple-700 p-5'>Início</span>
                    </Link>

                    <Link href='/casas'>

                        <span className='hover:text-purple-700 p-5'>Casas</span>

                    </Link>

                    <Link href='/'>

                        <span className='hover:text-purple-700 p-5'>Sobre</span>

                    </Link>

                    <Link href='/'>

                        <span className='hover:text-purple-700 p-5'>Cadastrar-me</span>

                    </Link>
            </div>
        </div>
    )
}

