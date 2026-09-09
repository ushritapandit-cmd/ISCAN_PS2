import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, X, AlertTriangle, AlertOctagon, CheckCircle2, Info, Check } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationOpen, setIsNotificationOpen, notifications, markNotificationsAsRead, setActiveTab } = useApp();

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-base">Enforcement Notifications</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                {notifications.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markNotificationsAsRead}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Mark all read
              </button>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.map((notif) => {
              let Icon = Info;
              let bg = 'bg-blue-50 border-blue-200 text-blue-800';

              if (notif.type === 'urgent') {
                Icon = AlertOctagon;
                bg = 'bg-rose-50 border-rose-200 text-rose-800';
              } else if (notif.type === 'warning') {
                Icon = AlertTriangle;
                bg = 'bg-amber-50 border-amber-200 text-amber-900';
              } else if (notif.type === 'success') {
                Icon = CheckCircle2;
                bg = 'bg-emerald-50 border-emerald-200 text-emerald-800';
              }

              return (
                <div
                  key={notif.id}
                  className={`rounded-xl border p-3.5 transition-all ${
                    notif.read ? 'bg-white border-slate-200 opacity-80' : `${bg} shadow-2xs`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon className="h-5 w-5 shrink-0" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action */}
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <button
              onClick={() => {
                setIsNotificationOpen(false);
                setActiveTab('history');
              }}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-center text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
            >
              Open Inspection Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
