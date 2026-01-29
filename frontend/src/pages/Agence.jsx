import React, { useRef, useState } from 'react'
import CircularGallery from '../components/home/CircularGallery'
import { MessageSquare, Ticket, HelpCircle, RefreshCw, Clock } from 'lucide-react'; 

const Agence = () => {
  const [timelineItems, setTimelineItems] = useState([
    { id: 1, taskName: 'Project Initialization', status: 'completed', date: 'Jan 15, 2026' },
    { id: 2, taskName: 'Design Phase', status: 'completed', date: 'Jan 20, 2026' },
    { id: 3, taskName: 'Development Started', status: 'in-progress', date: 'Jan 25, 2026' },
    { id: 4, taskName: 'Testing & QA', status: 'pending', date: 'Feb 5, 2026' },
    { id: 5, taskName: 'Deployment', status: 'pending', date: 'Feb 15, 2026' }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-amber-500';
      case 'pending': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  return (
    <div className='bg-black min-h-screen overflow-x-hidden'>
      {/* 1. TOP SECTION: BLACK BACKGROUND IDENTITY */}
      <div className='relative w-full min-h-[140vh] bg-black text-white'>
        <div className='relative pt-20'>
          {/* Main Title with Amber Border */}
          <h1 className='border-2 border-amber-500/30 rounded-4xl px-5 py-20 text-[8vw] leading-[8vw] hover:text-amber-500 absolute top-[20%] left-10 z-10 transition-all duration-700 bg-black/40 backdrop-blur-md'>
            PROJECT <br /> NAME
          </h1>
        </div>

        <div className='pl-[40%] mt-[35%] pr-10'>
          {/* Details Block */}
          <p className='border-4 rounded-3xl px-10 py-20 border-amber-500/20 text-4xl hover:text-amber-400 hover:border-amber-500/50 transition-all duration-700 bg-gray-900/20'>
            Details - <br />&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus reprehenderit excepturi hic, quibusdam dicta id ipsa aspernatur molestiae. 
            Est earum a corrupti reprehenderit totam delectus cupiditate architecto perferendis aliquid inventore quis laborum debitis atque.
          </p>
        </div>
      </div>

      {/* 2. CIRCULAR GALLERY: STILL BLACK */}
      <div className='bg-black' style={{ height: '700px', position: 'relative', width: '100%', overflow: 'hidden' }}>
        <CircularGallery 
          bend={3} 
          textColor="#ffffff" 
          borderRadius={0.05} 
          scrollSpeed={2} 
          scrollEase={0.05} 
        />
      </div>

      {/* 3. TIMELINE: AMBER FADES IN AND OUT */}
      {/* Transitions from Black -> Amber-200 -> Black */}
      <div className='w-full px-10 py-24 bg-gradient-to-b from-black via-amber-200 to-black'>
        <h2 className='text-6xl font-bold text-center mb-20 text-amber-900 drop-shadow-md transition-colors duration-300'>
          Project Timeline
        </h2>

        <div className='max-w-4xl mx-auto'>
          {timelineItems.map((item, index) => (
            <div key={item.id} className='relative pb-12 last:pb-0 group'>
              {/* Timeline Connector Line */}
              {index !== timelineItems.length - 1 && (
                <div className='absolute left-8 top-8 w-0.5 h-full bg-amber-900/20 group-hover:bg-amber-900/50 transition-colors duration-300'></div>
              )}

              <div className='flex items-start gap-8'>
                <div className='relative z-10 flex-shrink-0'>
                  <div className={`w-16 h-16 rounded-full ${getStatusColor(item.status)} flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300`}>
                    {item.status === 'completed' && (
                      <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                      </svg>
                    )}
                    {item.status === 'in-progress' && <div className='w-4 h-4 bg-white rounded-full animate-pulse'></div>}
                    {item.status === 'pending' && <div className='w-4 h-4 border-2 border-white rounded-full'></div>}
                  </div>
                </div>

                {/* Glassmorphism Timeline Card */}
                <div className='flex-1 bg-white/40 backdrop-blur-md border-2 border-white/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:bg-white/60 transition-all duration-500 transform hover:-translate-y-2'>
                  <div className='flex justify-between items-start mb-3'>
                    <h3 className='text-3xl font-bold text-gray-900'>{item.taskName}</h3>
                    <span className={`px-5 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase text-white shadow-sm ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  <p className='text-gray-800 text-xl font-medium'>{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DISCORD AI INSIGHTS: BACK TO BLACK */}
      <div className="w-full px-10 py-28 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
            <div>
              <h2 className="text-6xl font-black text-indigo-400 flex items-center gap-5">
                <MessageSquare className="w-14 h-14" /> Discord Insights
              </h2>
              <p className="text-gray-500 mt-5 text-2xl font-light flex items-center gap-4">
                <Clock className="w-6 h-6 text-indigo-500 animate-pulse" /> AI Analysis Ready
              </p>
            </div>
            <button className="group relative px-10 py-5 bg-indigo-600/10 text-indigo-400 rounded-2xl border border-indigo-500/30 hover:bg-indigo-600/20 transition-all duration-500">
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-1000" /> 
              <span className="font-bold text-xl ml-4">Resync Chat</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="bg-gray-900/40 border border-gray-800 p-12 rounded-[3rem] hover:border-indigo-500/50 transition-all duration-700">
              <h3 className="text-2xl font-bold mb-8 text-indigo-300">Chat Summary</h3>
              <p className="text-gray-400 text-xl leading-relaxed italic">"Extracted chat data regarding React logic and SynapseX 'Nervous System'."</p>
            </div>
            
            <div className="bg-gray-900/40 border border-gray-800 p-12 rounded-[3rem] hover:border-green-500/50 transition-all duration-700">
              <h3 className="text-2xl font-bold mb-8 text-green-400">AUTO-TICKETS</h3>
              <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                <p className="text-gray-200">Fix Z-Index overlap on navigation.</p>
              </div>
            </div>

            <div className="bg-gray-900/40 border border-gray-800 p-12 rounded-[3rem] hover:border-amber-500/50 transition-all duration-700">
              <h3 className="text-2xl font-bold mb-8 text-amber-400">CHAT DOUBTS</h3>
              <p className="text-gray-200 text-xl italic font-medium">"Using Tailwind for custom gallery styles?"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agence;