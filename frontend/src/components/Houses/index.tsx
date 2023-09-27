import React from 'react'
import Card from '../Card'
import Headline from '../Headline'

const Houses = () => {
    return (

        <section className='max-w-[1640px] mx-auto p-4 py-12'>
            <Headline title='Casas' />

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-20 py-12'>
                <Card image='/assets/house1.jpg' title='' />
                <Card image='/assets/house1.jpg' title='' />
                <Card image='/assets/house1.jpg' title='' />
                <Card image='/assets/house1.jpg' title='' />
                <Card image='/assets/house1.jpg' title='' />
                <Card image='/assets/house1.jpg' title='' />
                <Card image='/assets/house1.jpg' title='' />
            </div>
        </section>

    )
}

export default Houses