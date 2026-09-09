import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Sparkles, UserCheck, Key, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';
import { IScanLogo } from '../common/IScanLogo';

export const LoginView: React.FC = () => {
  const { loginAs, setActiveTab } = useApp();

  const handleSelectRole = (role: UserRole) => {
    loginAs(role);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-50/70">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-6">
        {/* Emblem & Branding */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex justify-center mb-1">
            <IScanLogo size="lg" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">i-Scan</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mt-0.5">
              Legal Metrology Compliance Platform
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Smart India Hackathon • Problem Statement SIH26034
          </p>
        </div>

        {/* 1-Click Role Login Options for Hackathon Judges */}
        <div className="space-y-3 pt-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Select Demonstration Role
          </span>

          <button
            onClick={() => handleSelectRole('inspector')}
            className="w-full rounded-2xl border-2 border-slate-200 p-4 text-left hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">Field Inspector</span>
                <span className="text-[11px] text-slate-500">Rajesh Sharma • Kamrup Metro, Assam</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
          </button>

          <button
            onClick={() => handleSelectRole('supervisor')}
            className="w-full rounded-2xl border-2 border-slate-200 p-4 text-left hover:border-amber-500 hover:bg-amber-50/40 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">Enforcement Supervisor</span>
                <span className="text-[11px] text-slate-500">Dr. Ananya Roy • North East Directorate</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-700 transition-colors" />
          </button>

          <button
            onClick={() => handleSelectRole('admin')}
            className="w-full rounded-2xl border-2 border-slate-200 p-4 text-left hover:border-purple-500 hover:bg-purple-50/40 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-900 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">System Administrator</span>
                <span className="text-[11px] text-slate-500">Vikram Sengupta • Ministry Admin</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-700 transition-colors" />
          </button>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-slate-100">
          Complies with Legal Metrology (Packaged Commodities) Rules, 2011
        </div>
      </div>
    </div>
  );
};
