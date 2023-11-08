import React from 'react'
import Card from '../Card'
import Headline from '../Headline'

const Houses = () => {
    return (

        <section className='max-w-[1640px] mx-auto p-4 py-12'>
            <Headline title='Casas' />

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-20 py-12'>
                <Card image='/assets/house1.JPEG' title='' />
                <Card image='/assets/house2.JPEG' title='' />
                <Card image='/assets/house3.JPEG' title='' />
                <Card image='/assets/house4.JPEG' title='' />
            </div>
        </section>
    )
}

export default Houses