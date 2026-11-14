"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/client/auth.types";
import {
  UserCheck,
  ShieldAlert,
  User,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: LucideIcon }[] = [
    { role: "guest", label: "Guest / Tamu", icon: User },
    { role: "kader", label: "Kader Aktif", icon: UserCheck },
    { role: "admin", label: "Admin / Pengurus", icon: ShieldAlert },
  ];

  return (
    <aside aria-label="Dev Role Switcher" className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-mono px-2 py-1 text-slate-300 hover:text-white cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Role:{" "}
            <strong className="text-amber-400 uppercase">
              {user?.role || "guest"}
            </strong>
          </span>
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
            {roles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg text-left transition-colors cursor-pointer ${
                    (user?.role || "guest") === item.role
                      ? "bg-red-700 text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}