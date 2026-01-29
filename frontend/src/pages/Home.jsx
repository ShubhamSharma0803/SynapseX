import React, { useState } from 'react'
import { User, ChevronDown, Bell } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring
} from 'framer-motion'

import Video from '../components/home/Video'
import HomeHeroText from '../components/Home/HomeHeroText'
import HomeBottomText from '../components/Home/HomeBottomText'
import FloatingChatbot from '../components/home/FloatingChatbot'

const Home = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const navigate = useNavigate()

  /* ================= SCROLL CONTROLS ================= */
  const { scrollY } = useScroll()

  // Video darkens as user scrolls
  const videoDarkness = useTransform(scrollY, [0, 400], [0, 0.7])

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

          {/* LOGO */}
          <div className="absolute top-8 left-8">
            <h1 className="text-3xl font-bold">
              Synapse<span className="text-blue-400">X</span>
            </h1>
          </div>

          {/* NAV */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-6">
            <Link
              to="/community"
              className="px-8 py-3 bg-black/60 backdrop-blur-md rounded-full border border-gray-700 hover:border-white transition"
            >
              Developers Feed
            </Link>

            <Link
              to="/alerts"
              className="px-8 py-3 bg-black/60 backdrop-blur-md rounded-full border border-gray-700 hover:border-white transition flex items-center gap-2"
            >
              <Bell className="w-5 h-5" />
              Alerts
            </Link>
          </div>

          {/* PROFILE */}
          <div className="absolute top-8 right-8">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="bg-black/60 px-6 py-3 rounded-full flex items-center gap-2 border border-gray-700"
            >
              <User />
              Profile
              <ChevronDown className={isProfileOpen ? 'rotate-180' : ''} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-4 bg-black border border-gray-700 rounded-xl w-56">
                <Link to="/profile" className="block px-4 py-3 hover:bg-gray-800">
                  View Profile
                </Link>
                <button
                  onClick={() => navigate('/login')}
                  className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/30"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <HomeHeroText />
          <HomeBottomText />

          {/* SCROLL INDICATOR */}
          <motion.div
            style={{ opacity: scrollOpacity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 text-sm"
          >
            scroll
          </motion.div>

          <FloatingChatbot />
        </div>
      </section>

      {/* ================= ABOUT – REVEAL ================= */}
      <section className="relative min-h-screen bg-black overflow-hidden">

        <motion.div
          initial={{ y: 140 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="min-h-screen flex items-center px-12 md:px-24"
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

            {/* FLOATING IMAGE */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=2070&auto=format&fit=crop"
                alt="AI Abstract"
                className="
                  w-72 md:w-96
                  aspect-square
                  rounded-full
                  object-cover
                  opacity-90
                "
              />
            </motion.div>

            {/* TEXT WITH MOUSE PARALLAX */}
            <motion.div
              style={{ x: smoothX, y: smoothY }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <p className="text-sm tracking-widest text-gray-500 mb-6">
                ( ABOUT US )
              </p>

              <p className="text-gray-200 text-lg leading-relaxed">
                We are <span className="text-white">Team Synapse</span>, a
                five-member developer team from
                <span className="text-white">
                  {" "}G.L. Bajaj Institute of Technology and Management
                </span>.
                <br /><br />
                <span className="text-white">SynapseX</span> is a calm,
                focused developer community where real projects matter more
                than noise and talent gets discovered naturally.
              </p>

              <button className="mt-8 px-6 py-2 border border-gray-600 rounded-full text-sm text-gray-300 hover:text-white hover:border-white transition">
                Let’s talk
              </button>
            </motion.div>

          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
