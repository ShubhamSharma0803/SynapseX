import React, { useState, useMemo } from 'react';
import ProfileCard from './ProfileCard';
import { Search, Filter, Star } from 'lucide-react';

const DevCommunity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');

  // Sample developer data - sorted by rating (highest first)
  const developers = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'AI/ML Engineer',
      handle: 'sarahchen',
      rating: 4.9,
      experience: '6 years',
      techStack: ['Python', 'TensorFlow', 'PyTorch', 'AWS', 'Docker'],
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      miniAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'Full Stack Developer',
      handle: 'marcusdev',
      rating: 4.8,
      experience: '5 years',
      techStack: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'],
      avatarUrl: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      miniAvatarUrl: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 3,
      name: 'Jordan Lee',
      title: 'Cloud Architect',
      handle: 'priyacloud',
      rating: 4.8,
      experience: '7 years',
      techStack: ['AWS', 'Azure', 'Kubernetes', 'Python', 'Docker'],
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      miniAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      title: 'DevOps Engineer',
      handle: 'alexdevops',
      rating: 4.7,
      experience: '4 years',
      techStack: ['Docker', 'Kubernetes', 'AWS', 'Python', 'TypeScript'],
      avatarUrl: 'https://images.unsplash.com/photo-1492447273231-0f8fecec1e3a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      miniAvatarUrl: 'https://images.unsplash.com/photo-1492447273231-0f8fecec1e3a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 5,
      name: 'De Paul',
      title: 'Frontend Developer',
      handle: 'emilyzhang',
      rating: 4.6,
      experience: '4 years',
      techStack: ['React', 'Vue.js', 'TypeScript', 'Next.js', 'Tailwind'],
      avatarUrl: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      miniAvatarUrl: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 6,
      name: 'Emily Zhang',
      title: 'Backend Developer',
      handle: 'jordanlee',
      rating: 4.6,
      experience: '5 years',
      techStack: ['Node.js', 'PostgreSQL', 'GraphQL', 'TypeScript', 'Docker'],
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      miniAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 7,
      name: 'David Kim',
      title: 'Mobile Developer',
      handle: 'davidkim',
      rating: 4.5,
      experience: '3 years',
      techStack: ['React Native', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'],
      avatarUrl: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      miniAvatarUrl: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 8,
      name: 'Nina Patel',
      title: 'Data Engineer',
      handle: 'ninapatel',
      rating: 4.5,
      experience: '4 years',
      techStack: ['Python', 'PostgreSQL', 'AWS', 'Docker', 'MongoDB'],
      avatarUrl: 'https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?q=80&w=1494&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      miniAvatarUrl: 'https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?q=80&w=1494&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    }
  ];

  // Get all unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set();
    developers.forEach(dev => {
      dev.techStack.forEach(tech => techSet.add(tech));
    });
    return ['All', ...Array.from(techSet).sort()];
  }, []);

  // Filter developers based on search and tech selection
  const filteredDevelopers = useMemo(() => {
    return developers.filter(dev => {
      const matchesSearch = 
        dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.handle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTech = 
        selectedTech === 'All' || 
        dev.techStack.includes(selectedTech);
      
      return matchesSearch && matchesTech;
    });
  }, [searchQuery, selectedTech, developers]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-800/30 to-black pointer-events-none"></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
              Developer Community
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Connect with top-rated developers from around the world. Discover talent based on their skills, experience, and ratings.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{filteredDevelopers.length} Active Developers</span>
              </div>
              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Sorted by Rating</span>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, title, or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                />
              </div>

              {/* Tech Filter Dropdown */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <select
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent backdrop-blur-sm transition-all duration-300 cursor-pointer appearance-none min-w-[200px]"
                >
                  {allTechnologies.map(tech => (
                    <option key={tech} value={tech} className="bg-gray-900">
                      {tech === 'All' ? 'All Technologies' : tech}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedTech !== 'All') && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm">
                    <span className="text-gray-300">Search: <span className="text-white font-medium">{searchQuery}</span></span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
                {selectedTech !== 'All' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm">
                    <span className="text-gray-300">Tech: <span className="text-white font-medium">{selectedTech}</span></span>
                    <button 
                      onClick={() => setSelectedTech('All')}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Developer Cards Grid */}
      <div className="container mx-auto px-6 pb-20 pt-12">
        {filteredDevelopers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center">
            {filteredDevelopers.map((dev) => (
              <ProfileCard
                key={dev.id}
                name={dev.name}
                title={dev.title}
                handle={dev.handle}
                rating={dev.rating}
                experience={dev.experience}
                techStack={dev.techStack}
                avatarUrl={dev.avatarUrl}
                miniAvatarUrl={dev.miniAvatarUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-2">No developers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            💡 <span className="text-gray-400">Demo showcasing 8 developers</span> • More profiles will be added as the platform scales
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevCommunity;