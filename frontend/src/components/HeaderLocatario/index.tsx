import Link from 'next/link';

import { FcCalendar } from 'react-icons/fc';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

import { useState, useContext } from 'react';
import { Button } from '../Button';
import { AuthContext } from '@/contexts/AuthContext';
import { FiLogOut } from 'react-icons/fi';

export const HeaderLocatario = () => {

    const { signOut } = useContext(AuthContext);

    const [toggle, setToggle] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleLogout = async () => {

        setLoading(true);

        signOut();

        setLoading(false);
    }


    return (

        <div className='fixed bg-white top-0 w-[100%] z-20 border-b'>
            <div className='container mx-auto flex justify-between items-center p-4'>
                <div className='flex gap-1 items-center text-purple-700 font-bold text-xl md:text-2xl'>
                    <Link href='/painel_locatario'>
                        <h2 className='hover:text-purple-600'>Arrendaki</h2>
                    </Link>
                </div>
            
                <div className='hidden md:flex gap-10 text-gray-700'>

                    <Link href='/painel_locatario'>
                        <span className='hover:text-purple-700'>Início</span>
                    </Link>

                    <Link href='/painel_locatario/casas'>

                        <span className='hover:text-purple-700'>Minhas casas</span>

                    </Link>

                    <Link href='/painel_locatario/casas/nova'>

                        <span className='hover:text-purple-700'>Registar casa</span>

                    </Link>

                    <Link href='/painel_locatario/perfil'>

                        <span className='hover:text-purple-700'>Perfil</span>

                    </Link>
                </div>

                <div 
                    className='hidden md:flex font-bold bg-purple-700 px-4 py-2 rounded-lg items-center justify-between gap-2 cursor-pointer'
                    onClick={handleLogout}
                >

                    <span className='text-white text-sm'>Sair</span>

                    <FiLogOut
                        className='bg-purple-700 hover:bg-purple-800 '
                        color='white'
                    />
                    
                </div>

                {
                    toggle ? (
                        <AiOutlineClose onClick={() => setToggle(!toggle)} size={24} className='md:hidden block' />

                    ) : (
                        <FiMenu onClick={() => setToggle(!toggle)} size={24} className='md:hidden block' />
                    )
                }

            </div>

            <div className={`duration-500 md:hidden flex flex-col w-[80%] rounded-lg h-screen fixed bg-purple-700/80 gap-6 text-white top-[60px] ${toggle ? `left-[0]` : `left-[-100%]`}`}>
                <p></p>

                <Link href='/painel_locatario'>
                    <span className='hover:text-purple-700 p-5'>Início</span>
                </Link>

                <Link href='/painel_locatario/casas'>

                    <span className='hover:text-purple-700 p-5'>Minhas casas</span>

                </Link>

                <Link href='/painel_locatario/casas/nova'>

                    <span className='hover:text-purple-700 p-5'>Registar casa</span>

                </Link>

                <Link href='/painel_locatario/perfil'>

                    <span className='hover:text-purple-700 p-5'>Perfil</span>

                </Link>
            </div>
        </div >
    )
}

