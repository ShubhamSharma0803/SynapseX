import { toast } from 'sonner';

export const triggerAlert = (title, description, type = 'success') => {
  // This sends the signal to the Toaster component
  toast[type](title, {
    description: description,
    duration: 4000,
  });

  // Since you're not using a backend, we store the alert history in the browser
  const history = JSON.parse(localStorage.getItem('synapse_alerts') || '[]');
  const newAlert = {
    id: Date.now(),
    title,
    description,
    type,
    timestamp: new Date().toLocaleTimeString(),
  };
  
  localStorage.setItem('synapse_alerts', JSON.stringify([newAlert, ...history]));
};