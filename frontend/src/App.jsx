import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Toaster } from 'sonner';

// Import your pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import DevCommunity from './components/home/DevCommunity';
import Agence from './pages/Agence';
import Projects from './pages/Projects';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding'; 

function App() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      // 1. Get the current active session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // 2. Check the "profiles" table for the onboarding flag
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed') 
          .eq('id', session.user.id)
          .single();

        // 3. Traffic Control: If no profile or onboarding not done, force Onboarding
        // If profile doesn't exist or flag is false, we send them to /onboarding
        if (error || !profile || profile.onboarding_completed === false) {
          // Prevent infinite redirect if they are already on the onboarding page
          if (window.location.pathname !== '/onboarding') {
            navigate('/onboarding');
          }
        }
      }
      setIsChecking(false);
    };

    checkUserStatus();

    // Listen for auth changes (like logging in for the first time)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkUserStatus();
      } else {
        // If logged out, reset check and potentially redirect to login
        setIsChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isChecking) return null; // Prevent UI flicker

  return (
    <>
      <Toaster 
        theme="dark" 
        position="top-right" 
        expand={false} 
        richColors 
        closeButton 
        style={{ zIndex: 9999 }} 
      />
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Onboarding Route */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/community" element={<DevCommunity />} />
        <Route path="/currentproject" element={<Agence />} />
        <Route path="/createproject" element={<Projects />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;