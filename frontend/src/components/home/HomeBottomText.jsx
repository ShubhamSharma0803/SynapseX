import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const HomeBottomText = () => {

  return (
    <div className='font-sans mb-7 flex items-center justify-center gap-50'>
      <div className='lg:border-3 border-2 hover:border-[#010200] hover:text-[#D3FD50] lg:h-20 flex items-center px-3  lg:px-10 border-white rounded-full uppercase'>
        <Link className='text-[3vw] lg:mt-2' to='/createproject'>Create Project</Link>
      </div>
      <div className='lg:border-3 border-2 hover:border-[#000000] hover:text-[#D3FD50]  lg:h-20 flex items-center px-3  lg:px-10 border-white rounded-full uppercase'>
        <Link className='text-[3vw] lg:mt-2' to='/currentproject'>Current project</Link>
      </div>
    </div>
  )
}

export default HomeBottomText