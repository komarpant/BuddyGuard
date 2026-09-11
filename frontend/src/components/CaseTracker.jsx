import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function CaseTracker() {
  const steps = [
    { label: "Report Filed", status: "completed" },
    { label: "AI Context Analysis", status: "completed" },
    { label: "Human Review", status: "current" },
    { label: "Counselor Follow-up", status: "pending" },
    { label: "Resolved", status: "pending" },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EFEAE2]">
      <h3 className="text-lg font-bold mb-6">Latest Case Status</h3>
      <p className="text-xs text-slate-500 mb-4 font-mono">Case ID: CAS-002</p>
      
      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
        
        <div className="flex flex-col gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="bg-white relative z-10">
                {step.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />}
                {step.status === 'current' && <Clock className="w-6 h-6 text-blue-500 animate-pulse" />}
                {step.status === 'pending' && <Circle className="w-6 h-6 text-slate-300" />}
              </div>
              <p className={`text-sm font-medium ${
                step.status === 'completed' ? 'text-slate-800' :
                step.status === 'current' ? 'text-blue-600 font-bold' : 'text-slate-400'
              }`}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
