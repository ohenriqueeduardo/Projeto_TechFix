import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAutoLogout = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // We only need to attach listeners if the user is logged in
    const token = localStorage.getItem('token');
    if (!token) return;

    const handleLogout = () => {
      // Only log out if there is an active session
      if (localStorage.getItem('token') || localStorage.getItem('user')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Sessão expirada por inatividade. Faça login novamente para sua segurança.', {
          duration: 8000,
        });
        navigate('/login');
      }
    };

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT_MS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    const activityListener = () => {
      resetTimer();
    };

    // Attach event listeners
    events.forEach((event) => {
      window.addEventListener(event, activityListener);
    });

    // Initialize the timer
    resetTimer();

    return () => {
      // Cleanup event listeners
      events.forEach((event) => {
        window.removeEventListener(event, activityListener);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigate]);
};
