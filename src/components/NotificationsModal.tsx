import React from "react";
import { NotificationItem } from "../types";
import { X, Bell, CheckCircle2, Dumbbell, Utensils, TrendingUp, Bot } from "lucide-react";

interface NotificationsModalProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="w-4 h-4 text-[#003ec7]" />;
      case "nutrition":
        return <Utensils className="w-4 h-4 text-[#506600]" />;
      case "progress":
        return <TrendingUp className="w-4 h-4 text-[#ba1a1a]" />;
      case "ai":
        return <Bot className="w-4 h-4 text-[#003ec7]" />;
      default:
        return <Bell className="w-4 h-4 text-[#003ec7]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto border border-[#c3c5d9] shadow-2xl p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003ec7] text-2xl">
              notifications
            </span>
            <h3 className="font-headline font-bold text-lg text-[#131b2e]">
              Notifications
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs font-bold text-[#003ec7] hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#eaedff] text-[#737688]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                n.read
                  ? "bg-[#faf8ff] border-[#c3c5d9]/40 opacity-75"
                  : "bg-white border-[#003ec7]/30 shadow-xs ring-1 ring-[#003ec7]/10"
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-[#eaedff] flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline font-bold text-xs text-[#131b2e]">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-[#737688]">{n.time}</span>
                </div>
                <p className="text-xs text-[#434656] mt-0.5 leading-relaxed">
                  {n.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
