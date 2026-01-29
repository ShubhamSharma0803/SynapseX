import { Routes, Route, Navigate } from 'react-router-dom';
// Import your pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import DevCommunity from './components/home/DevCommunity';
import Agence from './pages/Agence';
import Projects from './pages/Projects';
import { Toaster } from 'sonner';
import Alerts from './pages/Alerts'
import Profile from './pages/Profile'

function App() {
  return (
    <>
      {/* This is the master controller for your alerts */}
      <Toaster 
        theme="dark" 
        position="top-right" 
        expand={false} 
        richColors 
        closeButton 
        style={{ zIndex: 9999 }} // Force it above the video and absolute divs
      />
      <Routes>
        {/* Default route - redirect to login */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      

      {/* Auth Routes */}

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<SignUp />} />

      

      {/* Main Routes */}

      <Route path="/home" element={<Home />} />

      <Route path="/community" element={<DevCommunity />} />

      // Change this line in your App.jsx

      <Route path="/currentproject" element={<Agence />} />

      <Route path="/createproject" element={<Projects />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;