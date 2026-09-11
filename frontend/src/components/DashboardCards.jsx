import React from 'react';
import { Shield, AlertTriangle, Users, Phone } from 'lucide-react';

export default function DashboardCards() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EFEAE2] flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500 font-medium">Safe-Mode Threshold</p>
          <p className="text-3xl font-bold text-slate-800">85%</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EFEAE2] flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500 font-medium">Threats Neutralized</p>
          <p className="text-3xl font-bold text-slate-800">12</p>
        </div>
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-green-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EFEAE2] flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500 font-medium">Guardian Circle</p>
          <p className="text-3xl font-bold text-slate-800">Linked</p>
        </div>
        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-purple-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EFEAE2]">
        <h3 className="text-lg font-bold mb-4">Helpline Directory</h3>
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors">
            <Phone className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm">KIRAN Mental Health</p>
              <p className="text-xs">1800-599-0019</p>
            </div>
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
            <Phone className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm">Cyber Crime</p>
              <p className="text-xs">1930</p>
            </div>
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            <Phone className="w-5 h-5" />
            <div className="text-left">
              <p className="font-semibold text-sm">Childline</p>
              <p className="text-xs">1098</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
