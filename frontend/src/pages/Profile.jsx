import React, { useState, useEffect } from 'react';
import { User, Github, Linkedin, Award, Code2, Cpu, ExternalLink, Flame, Mail, Loader2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

const Profile = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error) setProfile(data);
        } else {
          navigate('/login'); // Redirect to login if no session
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login'); // Send user back to login page
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  const displayUser = {
    name: profile?.full_name || "Guest User",
    rollNo: profile?.id?.slice(0, 8) || "UNREGISTERED",
    role: profile?.role === 'leader' ? "Lead Architect & AI Innovator" : "Full Stack Contributor",
    stats: [
      { label: 'Projects', value: '12+', icon: <Code2 className="w-5 h-5"/> },
      { label: 'Hackathons', value: '2', icon: <Award className="w-5 h-5"/> },
      { label: 'Streak', value: '45 Days', icon: <Flame className="w-5 h-5"/> }
    ],
    skills: ["React.js", "Tailwind CSS", "FastAPI", "Python", "Supabase", "Java", "DSA"]
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12 selection:bg-amber-500/30 relative overflow-hidden font-sans">
      
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.12), transparent 80%)`
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* 1. IDENTITY CARD */}
        <div className="md:col-span-1 bg-gray-900/20 border border-gray-800 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-50"></div>
          
          <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 p-1 mb-8 shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              <User className="w-24 h-24 text-gray-500" />
            </div>
            <div className="absolute bottom-3 right-3 w-8 h-8 bg-green-500 border-4 border-black rounded-full animate-pulse"></div>
          </div>

          <h1 className="text-4xl font-black mb-2 tracking-tight">{displayUser.name}</h1>
          <p className="text-amber-500 font-mono text-sm mb-8 uppercase tracking-[0.25em] font-bold">{displayUser.role}</p>
          
          <div className="flex gap-4 mb-10">
            <button className="p-4 bg-gray-800/40 rounded-2xl hover:bg-amber-500/20 hover:text-amber-400 transition-all border border-gray-800"><Github /></button>
            <button className="p-4 bg-gray-800/40 rounded-2xl hover:bg-amber-500/20 hover:text-amber-400 transition-all border border-gray-800"><Linkedin /></button>
            <button onClick={handleLogout} className="p-4 bg-gray-800/40 rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all border border-gray-800 flex items-center gap-2 group">
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full space-y-4 pt-8 border-t border-gray-800/50">
             <div className="flex justify-between items-center text-xs">
               <span className="text-gray-500 uppercase tracking-widest font-bold">System ID</span>
               <span className="text-gray-300 font-mono bg-gray-800/50 px-3 py-1 rounded-lg">{displayUser.rollNo}</span>
             </div>
          </div>
        </div>

        {/* 2. TECH STACK & PROJECTS */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-900/20 border border-gray-800 rounded-[3rem] p-10 hover:border-amber-500/30 transition-all duration-500 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-4 text-amber-200 uppercase tracking-tighter">
              <Cpu className="w-7 h-7" /> Intelligence Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {displayUser.skills.map(skill => (
                <span key={skill} className="px-5 py-2.5 bg-black border border-gray-800 rounded-2xl text-sm font-bold text-gray-400 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/20 border border-gray-800 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-indigo-500/30 transition-all duration-500">
            <div className="flex justify-between items-start">
              <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase text-indigo-400 tracking-widest">Active Development</div>
              <Link to="/currentproject" className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <ExternalLink className="w-6 h-6 text-gray-600 group-hover:text-white" />
              </Link>
            </div>
            <div className="mt-8">
              <h4 className="text-5xl font-black mb-3 tracking-tighter">SynapseX</h4>
              <p className="text-gray-500 text-lg font-medium leading-snug">AI-Powered Project Orchestration & Discord Intelligence.</p>
            </div>
            <div className="w-full bg-gray-800/50 h-3 rounded-full mt-10 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full w-[75%] animate-pulse"></div>
            </div>
          </div>

          <div className="sm:col-span-2 bg-gradient-to-br from-amber-900/10 via-gray-900/40 to-indigo-900/10 border border-amber-900/20 rounded-[3.5rem] p-10 flex flex-col md:flex-row items-center gap-10 group transition-all duration-700 hover:border-amber-500/20">
            <div className="p-8 bg-amber-500/10 rounded-[2.5rem] border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.1)] group-hover:scale-105 transition-transform duration-500">
              <Award className="w-16 h-16 text-amber-500" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black mb-3 tracking-tight">Loop 1.0 Hackathon Winner</h3>
              <p className="text-gray-400 text-xl font-light leading-relaxed">
               Recognized at the 24-hour National Level Offline Hackathon organized by Bharati Vidyapeeth College of Engineering for innovative AI solutions.
              </p>
            </div>
          </div>
        </div>

        {/* 3. PERFORMANCE METRICS */}
        {displayUser.stats.map((stat, i) => (
          <div key={i} className="bg-gray-900/20 border border-gray-800 rounded-[3rem] p-10 flex flex-col items-center justify-center hover:-translate-y-3 transition-all duration-500 group overflow-hidden relative">
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="mb-6 text-amber-500 p-4 bg-amber-500/10 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
            <span className="text-5xl font-black mb-2 tracking-tighter">{stat.value}</span>
            <span className="text-gray-500 text-xs uppercase tracking-[0.4em] font-black">{stat.label}</span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Profile;