"use client";

import { useState } from "react";
import { TbLeaf, TbFlame } from "react-icons/tb";
import { FiInfo } from "react-icons/fi";
import { Parser } from "html-to-react";

const TABS = [
  {
    key: "nutrition",
    label: "Nutrition",
    icon: TbFlame,
    accent: "#B85C38", // terracotta
    subtitle: "What goes into every pack",
  },
  {
    key: "details",
    label: "Details",
    icon: FiInfo,
    accent: "#8B6F3F", // warm brown
    subtitle: "Sourcing, storage & packaging",
  },
  {
    key: "benefits",
    label: "Benefits",
    icon: TbLeaf,
    accent: "#3D5A45", // deep green
    subtitle: "Why our community loves it",
  },
];

export default function ProductInfoTabs({ currentProduct }) {
  const [active, setActive] = useState("nutrition");

  const contentMap = {
    nutrition: currentProduct?.nutritionalInfo || "",
    details: currentProduct?.productDetails || "",
    benefits: currentProduct?.benefits || "",
  };

  const activeTab = TABS.find((t) => t.key === active);
  const ActiveIcon = activeTab.icon;

  return (
    <div className="w-full mt-8">
      {/* ── Section label ── */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#DAD0C4] to-transparent" />
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#7D6F60] uppercase whitespace-nowrap">
          Product Information
        </span>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#DAD0C4] to-transparent" />
      </div>

      {/* ── Tab bar ── */}
      <div className="relative flex bg-[#FCFAF6] border border-[#E8DFD2] rounded-2xl p-1.5 shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              aria-selected={isActive}
              className={`relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-white shadow-md text-[#2b1b12]"
                    : "text-[#7D6F60] hover:text-[#2b1b12]"
                }`}
            >
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full transition-colors"
                style={{
                  backgroundColor: isActive ? `${tab.accent}15` : "transparent",
                  color: isActive ? tab.accent : "inherit",
                }}
              >
                <Icon size={15} />
              </span>
              <span>{tab.label}</span>

              {/* active underline accent */}
              {isActive && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full transition-all"
                  style={{ backgroundColor: tab.accent }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content card ── */}
      <div className="mt-4 relative overflow-hidden rounded-2xl border border-[#E8DFD2] bg-linear-to-br from-[#FDFBF7] to-[#FCFAF6] shadow-[0_4px_24px_rgba(58,46,36,0.05)]">
        {/* accent glow top-right */}
        <div
          className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: activeTab.accent }}
        />

        <div key={active} className="relative p-6 lg:p-7 animate-fadeIn">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${activeTab.accent}15`,
                color: activeTab.accent,
              }}
            >
              <ActiveIcon size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2b1b12]">
                {activeTab.label}
              </h3>
              <p className="text-[11px] text-[#7D6F60]">{activeTab.subtitle}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#E8DFD2] mb-4" />

          {/* Body */}
          <div className="text-[#4a3f34] text-sm leading-7 prose prose-sm max-w-none prose-headings:text-[#2b1b12] prose-strong:text-[#2b1b12] prose-li:marker:text-[#B85C38]">
            {contentMap[active] ? (
              Parser().parse(contentMap[active])
            ) : (
              <p className="text-[#9a8b7a] italic">
                No {activeTab.label.toLowerCase()} information available yet.
              </p>
            )}
          </div>
        </div>

        {/* bottom accent line */}
        <div
          className="h-[3px] w-full transition-all duration-500"
          style={{
            background: `linear-linear(to right, transparent, ${activeTab.accent}, transparent)`,
          }}
        />
      </div>
    </div>
  );
}