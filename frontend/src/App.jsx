import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
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
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // Memoized profile check to prevent unnecessary re-runs
  const checkProfileStatus = useCallback(async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      // If no profile found or onboarding incomplete, force redirect
      if (error || !profile || !profile.onboarding_completed) {
        if (location.pathname !== '/onboarding') {
          navigate('/onboarding', { replace: true });
        }
      }
    } catch (err) {
      console.error("Profile check failed:", err);
    } finally {
      // Always stop the loading state regardless of outcome
      setIsChecking(false);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(activeSession);
        if (activeSession) {
          await checkProfileStatus(activeSession.user.id);
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setIsChecking(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      
      setSession(newSession);
      if (newSession) {
        await checkProfileStatus(newSession.user.id);
      } else {
        setIsChecking(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkProfileStatus]);

  // Replace 'null' with a loading UI to diagnose if the app is stuck
  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        theme="dark" 
        position="top-right" 
        richColors 
        closeButton 
        style={{ zIndex: 9999 }} 
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route path="/onboarding" element={session ? <Onboarding /> : <Navigate to="/login" />} />

        {/* Protected Dashboard Routes */}
        <Route path="/home" element={session ? <Home /> : <Navigate to="/login" />} />
        <Route path="/community" element={session ? <DevCommunity /> : <Navigate to="/login" />} />
        <Route path="/currentproject" element={session ? <Agence /> : <Navigate to="/login" />} />
        <Route path="/createproject" element={session ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/alerts" element={session ? <Alerts /> : <Navigate to="/login" />} />
        <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;