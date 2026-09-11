import React, { useState } from 'react';
import FloatingChatbot from './components/FloatingChatbot';
import DashboardCards from './components/DashboardCards';
import IndiaHeatmap from './components/IndiaHeatmap';
import CaseTracker from './components/CaseTracker';
import GuardianAlertModal from './components/GuardianAlertModal';

function App() {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [alertData, setAlertData] = useState(null);

  const triggerAlert = (data) => {
    setAlertData(data);
    setIsAlertActive(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-[#EFEAE2]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Arnold / Student</h1>
            <p className="text-sm text-slate-500">Buddy Guard Protected</p>
          </div>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          All 4 Shields Active
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Dashboard Metrics & Tracker */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <DashboardCards />
          <CaseTracker />
        </div>

        {/* Right Col: Heatmap */}
        <div className="lg:col-span-2">
          <IndiaHeatmap />
        </div>
      </div>

      {/* Floating Elements */}
      <FloatingChatbot onTriggerAlert={triggerAlert} />

      {/* Emergency Modal */}
      {isAlertActive && (
        <GuardianAlertModal
          data={alertData}
          onClose={() => setIsAlertActive(false)}
        />
      )}
    </div>
  );
}

export default App;
