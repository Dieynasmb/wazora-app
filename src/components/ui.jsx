import React from "react";
import { X, CircleDot } from "lucide-react";
import { COLORS, STATUT_META } from "../lib/theme";

export const inputStyle = { border: `1px solid ${COLORS.line}`, background: COLORS.paper, color: COLORS.ink };

export function Container({ children, className = "" }) {
  return <div className={`max-w-6xl mx-auto px-6 md:px-8 ${className}`}>{children}</div>;
}

export function Badge({ statut }) {
  const m = STATUT_META[statut];
  return (
    <span style={{ background: m.bg, color: m.color, fontWeight: 600 }}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap">
      <CircleDot size={10} />{statut}
    </span>
  );
}

export function Button({ children, onClick, variant = "solid", size = "md", className = "", type = "button", disabled }) {
  const base = "inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { md: "px-3.5 py-2 text-sm", sm: "px-2.5 py-1.5 text-xs" };
  const variants = {
    solid: { background: COLORS.ink, color: COLORS.paper },
    gold: { background: COLORS.gold, color: "#fff" },
    outline: { background: "transparent", color: COLORS.ink, border: `1px solid ${COLORS.line}` },
    ghost: { background: "transparent", color: COLORS.textMuted },
    danger: { background: "transparent", color: COLORS.rose },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${sizes[size]} ${className}`} style={variants[variant]}>
      {children}
    </button>
  );
}

export function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(27,42,36,0.45)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.card, maxWidth: width, borderTop: `3px solid ${COLORS.gold}` }}
        className="w-full rounded-md shadow-xl max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
          <h3 className="font-semibold text-base" style={{ color: COLORS.ink, fontFamily: "Fraunces, serif" }}>{title}</h3>
          <button onClick={onClose} style={{ color: COLORS.textMuted }}><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium mb-1" style={{ color: COLORS.textMuted }}>{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.textMuted }} />}
      <input {...props} style={{ ...inputStyle, ...(props.style || {}), paddingLeft: Icon ? 34 : (props.style?.paddingLeft ?? 12) }}
        className={`w-full rounded px-3 py-2 text-sm outline-none focus:ring-1 ${props.className || ""}`} />
    </div>
  );
}

export function SelectInput(props) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }} className={`w-full rounded px-3 py-2 text-sm outline-none ${props.className || ""}`} />;
}

export function Empty({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={28} style={{ color: COLORS.textMuted }} />
      <p className="mt-3 font-medium" style={{ color: COLORS.ink }}>{title}</p>
      {subtitle && <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>{subtitle}</p>}
    </div>
  );
}