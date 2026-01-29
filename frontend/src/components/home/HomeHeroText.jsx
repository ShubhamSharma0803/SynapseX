import Video from '../home/Video'
import TrueFocus from '../home/TrueFocus';
import React from 'react'

const HomeHeroText = () => {
  return (


    <div className='pt-5 mt-40 font-mono text-center '>
        <div className='text-[6.5vw]  hover:text-[#D3FD50] justify-center flex items-center  uppercase leading-[6vw] mb-7'>Work On Projects
</div>
        <div className='text-[5.5vw]  hover:text-[#D3FD50] justify-center flex items-center  uppercase leading-[6vw]'>
            <TrueFocus 
sentence="Build Reputation"
manualMode={false}
blurAmount={5}
borderColor="#5227FF"
animationDuration={0.5}
pauseBetweenAnimations={1}
/>
            </div>
        <div className='text-[8.5vw] mt-7  hover:text-[#D3FD50] justify-center flex items-center uppercase leading-[6vw]'>Get Hired</div>
    </div>
  )
}

export default HomeHeroText