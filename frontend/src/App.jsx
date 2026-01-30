import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; //
import { Toaster } from 'sonner';

// Import your pages
import Login from './pages/Login'; //
import SignUp from './pages/SignUp'; //
import Home from './pages/Home'; //
import DevCommunity from './components/home/DevCommunity'; //
import Agence from './pages/Agence'; //
import Projects from './pages/Projects'; //
import Alerts from './pages/Alerts'; //
import Profile from './pages/Profile'; //
import Onboarding from './pages/Onboarding'; //

function App() {
  const navigate = useNavigate(); //
  const location = useLocation(); //
  const [session, setSession] = useState(null); //
  const [isChecking, setIsChecking] = useState(true); //

  useEffect(() => {
    // 1. Initial Session Check
    const initializeAuth = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession(); //
      setSession(activeSession);
      
      if (activeSession) {
        await checkProfileStatus(activeSession.user.id);
      } else {
        setIsChecking(false);
      }
    };

    initializeAuth();

    // 2. Listen for Auth State Changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        await checkProfileStatus(newSession.user.id);
      } else {
        setIsChecking(false);
      }
    });

    return () => subscription.unsubscribe(); //
  }, [location.pathname]);

  // 3. Traffic Controller: Profile Verification
  const checkProfileStatus = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single(); //

      // If profile is missing or onboarding is not complete, redirect to onboarding
      if (error || !profile || !profile.onboarding_completed) {
        if (location.pathname !== '/onboarding') {
          navigate('/onboarding', { replace: true });
        }
      }
    } catch (err) {
      console.error("Profile check failed:", err);
    } finally {
      setIsChecking(false);
    }
  };

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
        {/* Public/Auth Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Onboarding Route */}
        <Route path="/onboarding" element={session ? <Onboarding /> : <Navigate to="/login" />} />

        {/* Protected Dashboard Routes */}
        <Route path="/home" element={session ? <Home /> : <Navigate to="/login" />} />
        <Route path="/community" element={session ? <DevCommunity /> : <Navigate to="/login" />} />
        <Route path="/currentproject" element={session ? <Agence /> : <Navigate to="/login" />} />
        <Route path="/createproject" element={session ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/alerts" element={session ? <Alerts /> : <Navigate to="/login" />} />
        <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;