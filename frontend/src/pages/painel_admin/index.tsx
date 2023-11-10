import { canSSRAdmin } from '@/utils/canSSRAdmin'
import React from 'react'

function PainelAdmin() {
  return (
    <div>PainelAdmin</div>
  )
}

export default PainelAdmin

export const getServerSideProps = canSSRAdmin(async (context) => {

  return {
    props: {
    }
  }
})