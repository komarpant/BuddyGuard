import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, Phone } from 'lucide-react';

export default function GuardianAlertModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-red-600 p-6 text-white flex flex-col items-center text-center">
          <AlertOctagon className="w-16 h-16 mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">CRITICAL EMERGENCY</h2>
          <p className="text-red-100">High-risk intent detected.</p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-1">Detected Intent</p>
            <p className="font-semibold text-lg text-slate-800 bg-red-50 p-3 rounded-xl">
              {data?.intent || "Distress / Self-Harm"}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-1">Actions Taken Automatically</p>
            <ul className="list-disc pl-5 text-slate-700 text-sm space-y-2">
              <li>Notified linked Guardian via SMS/Email.</li>
              <li>Case logged in encrypted Incident Vault.</li>
              <li>Flagged for immediate review.</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Acknowledge
            </button>
            <button className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> Dispatch
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
