import React, { useEffect, useState } from 'react';

const Alerts = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Read from the "Nervous System" history we created earlier
    const savedAlerts = JSON.parse(localStorage.getItem('synapse_alerts') || '[]');
    setHistory(savedAlerts);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-20">
      <h1 className="text-4xl font-bold mb-10 text-amber-500">System Alerts</h1>
      <div className="space-y-4">
        {history.length > 0 ? history.map((alert) => (
          <div key={alert.id} className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-amber-100">{alert.title}</h3>
              <p className="text-gray-400">{alert.description}</p>
            </div>
            <span className="text-sm text-gray-600">{alert.timestamp}</span>
          </div>
        )) : (
          <p className="text-gray-500">No alerts in your history yet.</p>
        )}
      </div>
    </div>
  );
};

export default Alerts;