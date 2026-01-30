import React, { useState } from 'react'
import { User, ChevronDown, Bell } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring
} from 'framer-motion'

import Video from '../components/home/Video'
import HomeHeroText from '../components/home/HomeHeroText'
import HomeBottomText from '../components/home/HomeBottomText'
import FloatingChatbot from '../components/home/FloatingChatbot'

const Home = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  /* ================= SCROLL CONTROLS ================= */
  const { scrollY } = useScroll()

  // Video darkens as user scrolls (but stays visible)
  const videoDarkness = useTransform(scrollY, [0, 800], [0, 0.5])

  // Scroll indicator fades
  const scrollOpacity = useTransform(scrollY, [0, 200], [1, 0])

  /* ================= MOUSE PARALLAX ================= */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window
    mouseX.set((e.clientX - innerWidth / 2) / 40)
    mouseY.set((e.clientY - innerHeight / 2) / 40)
  }

  return (
    <div
      className="bg-black text-white overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >

      {/* ================= HERO ================= */}
      <section className="relative h-screen w-screen overflow-hidden">

        {/* VIDEO */}
        <div className="absolute inset-0">
          <Video />
        </div>

        {/* DARK OVERLAY */}
        <motion.div
          style={{ opacity: videoDarkness }}
          className="absolute inset-0 bg-black z-10 pointer-events-none"
        />

        {/* HERO CONTENT */}
        <div className="relative z-20 h-full flex flex-col justify-between">

          {/* ANIMATED HEADER BAR */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 backdrop-blur-md bg-black/20"
          >
            <div className="max-w-screen-2xl mx-auto px-8 py-4 flex items-center justify-between">

              {/* ANIMATED LOGO */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to='/home' className='group relative inline-block'>
                  <div className='absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500'></div>
                  <div className='relative px-6 py-3 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-700 group-hover:border-blue-500 transition-all duration-500 overflow-hidden'>
                    <span className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500'></span>
                    <h1 className='relative text-2xl font-black tracking-tight'>
                      <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-blue-400 transition-all duration-700'>
                        Synapse
                      </span>
                      <span className='text-blue-400'>X</span>
                    </h1>
                  </div>
                </Link>
              </motion.div>

              {/* CENTER NAV - ANIMATED */}
              <div className='flex items-center gap-40'>
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Link
                    to="/community"
                    className="group relative px-6 py-2.5 bg-black/60 backdrop-blur-xl rounded-full border-2 border-gray-700/50 hover:border-blue-500 transition-all duration-700 overflow-hidden hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    {/* Animated Background */}
                    <span className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700'></span>

                    {/* Single Rotating Ring */}
                    <span className='absolute inset-0 border-2 border-blue-400/0 group-hover:border-blue-400/40 rounded-full animate-spin-slow transition-all duration-700'></span>

                    {/* Corner Particles */}
                    <span className='absolute top-1 right-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping'></span>
                    <span className='absolute bottom-1 left-1 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping' style={{ animationDelay: '0.2s' }}></span>

                    {/* Shimmer */}
                    <span className='absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12'></span>

                    {/* Content */}
                    <span className='relative flex items-center gap-2 text-gray-300 group-hover:text-white font-semibold text-sm'>
                      <svg className="w-4 h-4 group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      <span className='group-hover:tracking-wider transition-all duration-500'>Developers Feed</span>
                    </span>

                    {/* Outer Glow */}
                    <span className='absolute -inset-1 bg-blue-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-700'></span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Link
                    to="/alerts"
                    className="group relative px-6 py-2.5 bg-black/60 backdrop-blur-xl rounded-full border-2 border-gray-700/50 hover:border-amber-500 transition-all duration-700 overflow-hidden hover:scale-105 hover:shadow-xl hover:shadow-amber-500/30"
                  >
                    {/* Animated Background */}
                    <span className='absolute inset-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700'></span>

                    {/* Pulsing Ring */}
                    <span className='absolute inset-0 border-2 border-amber-400/0 group-hover:border-amber-400/40 rounded-full animate-pulse transition-all duration-700'></span>

                    {/* Sparkle Particles */}
                    <span className='absolute top-1 left-1/2 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping'></span>
                    <span className='absolute bottom-1 right-1/3 w-1 h-1 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping' style={{ animationDelay: '0.15s' }}></span>

                    {/* Shimmer */}
                    <span className='absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12'></span>

                    {/* Content */}
                    <span className='relative flex items-center gap-2 text-gray-300 group-hover:text-white font-semibold text-sm'>
                      <div className="relative">
                        <Bell className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {/* Bell ring effect on hover */}
                        <span className="absolute inset-0 border-2 border-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></span>
                      </div>
                      <span className='group-hover:tracking-wider transition-all duration-500'>Alerts</span>
                    </span>

                    {/* Outer Glow */}
                    <span className='absolute -inset-1 bg-amber-500 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-700'></span>
                  </Link>
                </motion.div>
              </div>

              {/* EPIC PROFILE BUTTON - ANIMATED */}
              <motion.div
                className='relative'
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className='group relative px-5 py-2.5 bg-black/60 backdrop-blur-xl rounded-full border-2 border-gray-700/50 hover:border-purple-500 transition-all duration-700 flex items-center gap-2 overflow-hidden hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50'
                >
                  {/* Animated Background Layers */}
                  <span className='absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-30 transition-opacity duration-700'></span>

                  {/* Rotating Rings */}
                  <span className='absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/60 rounded-full animate-spin-slow transition-all duration-700'></span>
                  <span className='absolute inset-0 border-2 border-purple-500/0 group-hover:border-purple-500/60 rounded-full animate-spin-reverse transition-all duration-700'></span>

                  {/* Particle Burst */}
                  <span className='absolute inset-0'>
                    <span className='absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping'></span>
                    <span className='absolute bottom-0 left-1/2 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping' style={{ animationDelay: '0.15s' }}></span>
                    <span className='absolute left-0 top-1/2 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping' style={{ animationDelay: '0.3s' }}></span>
                    <span className='absolute right-0 top-1/2 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping' style={{ animationDelay: '0.45s' }}></span>
                  </span>

                  {/* Shimmer */}
                  <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12'></span>

                  {/* Avatar */}
                  <div className='relative w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-700 shadow-lg'>
                    <User className='relative w-4 h-4 text-white drop-shadow-lg' />
                  </div>

                  {/* Text */}
                  <span className='relative font-bold text-sm text-gray-200 group-hover:tracking-wider group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500'>
                    Profile
                  </span>

                  {/* Chevron */}
                  <ChevronDown className={`relative w-4 h-4 transition-all duration-500 group-hover:text-purple-400 ${isProfileOpen ? 'rotate-180' : ''} group-hover:animate-bounce`} />

                  {/* Outer Glow */}
                  <span className='absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-700'></span>
                </button>

                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='absolute top-full right-0 mt-4 w-56 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden'
                  >
                    <div className='p-2'>
                      <Link to='/profile' className='block px-4 py-3 text-white hover:bg-gray-800/70 rounded-xl transition-all duration-300 hover:translate-x-2'>
                        <div className='flex items-center gap-3'>
                          <User className='w-5 h-5 text-gray-400' />
                          <span>View Profile</span>
                        </div>
                      </Link>
                      <div className='h-px bg-gray-700/50 my-2'></div>
                      <button onClick={async () => {
                        await supabase.auth.signOut()
                        navigate('/login')
                      }} className='w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/30 rounded-xl transition-all duration-300 hover:translate-x-2'>
                        <div className='flex items-center gap-3'>
                          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'></path>
                          </svg>
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* ANIMATED HERO TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <HomeHeroText />
          </motion.div>

          {/* ANIMATED BOTTOM BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
          >
            <HomeBottomText />
          </motion.div>

          <FloatingChatbot />
        </div>
      </section>

      {/* ================= ABOUT SECTION WITH VIDEO BACKGROUND ================= */}
      <section className="relative min-h-screen overflow-hidden">

        {/* VIDEO BACKGROUND - Continues from hero */}
        <div className="fixed inset-0 z-0">
          <Video />
        </div>

        {/* DARK OVERLAY */}
        <motion.div
          style={{ opacity: videoDarkness }}
          className="fixed inset-0 bg-black z-5 pointer-events-none"
        />

        {/* Additional gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-10"></div>

        {/* CONTENT */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative z-20 min-h-screen flex items-center px-8 md:px-16 lg:px-24 py-20"
        >
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* FLOATING IMAGE - Better Sized */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{
                x: 0,
                opacity: 1
              }}
              transition={{
                duration: 0.8,
                ease: 'easeOut'
              }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex justify-center lg:justify-start order-2 lg:order-1"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative group"
              >
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-700"></div>

                {/* Image */}
                <img
                  src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2070&auto=format&fit=crop"
                  alt="AI Abstract"
                  className="
                    relative
                    w-80 h-80
                    md:w-96 md:h-96
                    lg:w-[450px] lg:h-[450px]
                    rounded-full
                    object-cover
                    opacity-90
                    border-4 border-gray-800/50
                    shadow-2xl
                    group-hover:scale-105
                    transition-all duration-700
                  "
                />

                {/* Rotating ring */}
                <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full animate-spin-slow"></div>
              </motion.div>
            </motion.div>

            {/* TEXT WITH MOUSE PARALLAX - Better Spaced */}
            <motion.div
              style={{ x: smoothX, y: smoothY }}
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              className="order-1 lg:order-2 space-y-8"
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-sm tracking-[0.3em] text-gray-400 font-semibold"
              >
                ( ABOUT US )
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-gray-300 text-xl lg:text-2xl leading-relaxed">
                  We are <span className="text-white font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Team Synapse</span>, a
                  five-member developer team from{" "}
                  <span className="text-white font-semibold">
                    G.L. Bajaj Institute of Technology and Management
                  </span>.
                </p>

                <p className="text-gray-300 text-xl lg:text-2xl leading-relaxed">
                  <span className="text-white font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">SynapseX</span> is a calm,
                  focused developer community where real projects matter more
                  than noise and talent gets discovered naturally.
                </p>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative mt-10 px-8 py-3 border-2 border-gray-600 rounded-full text-base font-semibold text-gray-300 hover:text-white hover:border-white transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                <span className="relative">Let's talk</span>
              </motion.button>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default Home