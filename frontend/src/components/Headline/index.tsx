import React from 'react'


type Props = {
  title: string
}

const Headline = ({ title }: Props) => {
  return (
    <div className='flex gap-5 items-center justify-center'>
      <div className='bg-purple-700 md:w-[200px] w-[50px] md:h-[2px] h-[.5px]'></div>
      <h1 className='text-purple-700 uppercase text-sm md:text-xl'>{title}</h1>
      <div className='bg-purple-700 md:w-[200px] w-[50px] md:h-[2px] h-[.5px]'></div>
    </div>
  )
}

export default Headline