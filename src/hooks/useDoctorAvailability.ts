import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface DoctorAvailability {
  isOnline: boolean;
  isVisible: boolean;
}

export const useDoctorAvailability = (initialApiStatus?: DoctorAvailability) => {
  const [status, setStatusState] = useState<DoctorAvailability>(() => {
    try {
      const saved = sessionStorage.getItem('doctor_status');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    if (initialApiStatus) return initialApiStatus;
    return { isOnline: false, isVisible: false };
  });

  const setStatus = async (newStatus: DoctorAvailability) => {
    try {
      setStatusState(newStatus);
      sessionStorage.setItem('doctor_status', JSON.stringify(newStatus));

      await api.post('/doctors/status', {
        is_online: newStatus.isOnline,
        is_visible_for_matching: newStatus.isVisible
      });
    } catch (error) {
      console.error('Failed to set doctor status', error);
    }
  };

  useEffect(() => {
    if (initialApiStatus && !sessionStorage.getItem('doctor_status')) {
      setStatusState(initialApiStatus);
      sessionStorage.setItem('doctor_status', JSON.stringify(initialApiStatus));
    }
  }, [initialApiStatus]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      let token = '';
      try {
        const authData = localStorage.getItem('auth-storage');
        if (authData) {
          const parsed = JSON.parse(authData);
          if (parsed.state && parsed.state.token) {
            token = parsed.state.token;
          }
        }
      } catch (e) {
        // ignore
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';
      fetch(`${apiUrl}/doctors/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ is_online: false, is_visible_for_matching: false }),
        keepalive: true,
      });
      sessionStorage.removeItem('doctor_status');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return { status, setStatus };
};
