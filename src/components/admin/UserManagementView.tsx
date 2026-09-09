import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_USERS } from '../../data/mockDatabase';
import { Users, Shield, UserCheck, Key, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

export const UserManagementView: React.FC = () => {
  const { currentUser, loginAs } = useApp();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              User Management & Access Control
            </h1>
            <span className="rounded bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 font-bold">
              RBAC Enabled
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Role-based authorization hierarchy (Inspector, Supervisor, Administrator) for Legal Metrology enforcement
          </p>
        </div>
      </div>

      {/* Roles Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <UserCheck className="h-5 w-5" />
            <span>Field Inspector Role</span>
          </div>
          <p className="text-xs text-slate-500">
            Access to Product Scanner, OCR extraction, measurement checks, evidence review, and initial finding recording.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <Shield className="h-5 w-5" />
            <span>Supervisor Role</span>
          </div>
          <p className="text-xs text-slate-500">
            All Inspector privileges plus notice approval, escalated review determination, workload allocation, and rule oversight.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <Key className="h-5 w-5" />
            <span>Administrator Role</span>
          </div>
          <p className="text-xs text-slate-500">
            Full platform governance: Rule database editing, user permissions, security audit trail, and optical calibration.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900">Enforcement Staff Roster</h2>
          <span className="text-xs text-slate-500">Click "Simulate Login" to test specific role view</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Badge Number</th>
                <th className="py-3 px-4">Assigned Jurisdiction</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INITIAL_USERS.map((user) => {
                const isCurrent = currentUser?.id === user.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-400">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-xs uppercase text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-semibold">
                      {user.badgeNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {user.region}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isCurrent ? (
                        <span className="rounded bg-emerald-50 text-emerald-800 text-xs font-bold px-2 py-1 border border-emerald-200">
                          Current Active User
                        </span>
                      ) : (
                        <button
                          onClick={() => loginAs(user.role)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          Simulate Login
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
