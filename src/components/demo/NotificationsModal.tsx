import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Truck, 
  Award, 
  ChevronRight, 
  Clock,
  Trash2
} from 'lucide-react';
import { UserNotification } from '../../types/koba';
import { TurtleIcon } from './TurtleIcon';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: UserNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (reportId?: string) => void;
  themeMode: 'forest' | 'fixora';
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
  themeMode,
}) => {
  if (!isOpen) return null;

  const isFixora = themeMode === 'fixora';
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all animate-in zoom-in-95 ${
          isFixora
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#1C1C1E] border-slate-800 text-white'
        }`}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white leading-none">
                Notifications
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                {unreadCount > 0 ? `${unreadCount} nouvelle(s)` : 'Toutes les alertes lues'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                title="Effacer l'historique"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        {unreadCount > 0 && (
          <div className="px-3.5 py-1.5 bg-teal-50 dark:bg-teal-950/40 border-b border-teal-100 dark:border-teal-900/60 flex items-center justify-between text-xs">
            <span className="text-[11px] text-teal-800 dark:text-teal-300 font-normal">
              Restez informé de chaque pesée
            </span>
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:underline cursor-pointer"
            >
              Tout marquer comme lu
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="p-3 space-y-2 overflow-y-auto flex-1 scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="py-10 text-center space-y-2 text-slate-400 dark:text-slate-500">
              <Bell className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">Aucune notification pour le moment.</p>
              <p className="text-[11px] text-slate-400">
                Vous recevrez une alerte dès qu'un collecteur ramasse l'un de vos signalements.
              </p>
            </div>
          ) : (
            notifications.map((item) => {
              const isCollected = item.type === 'collected';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNotification(item.reportId);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] space-y-1.5 ${
                    !item.isRead
                      ? isFixora
                        ? 'bg-teal-50/80 border-teal-300 text-slate-900 shadow-xs'
                        : 'bg-teal-950/40 border-teal-800 text-white shadow-xs'
                      : isFixora
                      ? 'bg-white border-slate-200 text-slate-900 shadow-2xs hover:bg-slate-50'
                      : 'bg-[#161618] border-slate-800 text-white shadow-2xs hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white shadow-2xs ${
                          isCollected
                            ? 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                            : item.type === 'nest_protected'
                            ? 'bg-amber-500'
                            : 'bg-teal-600'
                        }`}
                      >
                        {isCollected ? (
                          <Truck className="w-3.5 h-3.5 text-white" />
                        ) : item.type === 'nest_protected' ? (
                          <TurtleIcon className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="font-semibold text-xs truncate block text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal block">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>

                    {item.pointsEarned && (
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 border border-amber-500 shadow-2xs shrink-0">
                        +{item.pointsEarned} pts
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed pl-9">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-end text-[11px] text-teal-700 dark:text-teal-400 font-medium gap-1 pt-0.5">
                    <span>Consulter le signalement</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
