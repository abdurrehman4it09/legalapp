"use client";

import React, { useState } from "react";
import {
  Scale,
  BookOpen,
  Landmark,
  Briefcase,
  Newspaper,
  Calculator,
  Sparkles,
  ShieldCheck,
  Award,
  FileText,
} from "lucide-react";

export type BannerVariant =
  | "codex"
  | "judgments"
  | "lawyers_careers"
  | "legal_aid_news"
  | "wirasat_tools";

interface Architectural3DBannerProps {
  variant: BannerVariant;
  kickerEn: string;
  titleEn: string;
  titleUr: string;
  subtitleEn: string;
  stats: Array<{ label: string; value: string }>;
  primaryCtaLabel?: string;
  onPrimaryCtaClick?: () => void;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export default function Architectural3DBanner({
  variant,
  kickerEn,
  titleEn,
  titleUr,
  subtitleEn,
  stats,
  primaryCtaLabel,
  onPrimaryCtaClick,
  secondaryCtaLabel,
  secondaryCtaHref,
}: Architectural3DBannerProps) {
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 4, ry: -8 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 10 + 3).toFixed(2)),
      ry: Number((x * 14 - 6).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 4, ry: -8 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-2xl border border-[#E5E2D9] bg-[#F2EFE9] p-7 sm:p-10 mb-10 transition-editorial"
    >
      {/* Subtle Architectural Grid & Warm Museum Sunbeam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 28%, rgba(11, 93, 59, 0.10) 0%, rgba(242, 239, 233, 0) 60%), linear-gradient(to right, rgba(20, 20, 19, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(20, 20, 19, 0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 36px 36px, 36px 36px",
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 7 Columns: Editorial Typography, Bilingual Title & Metrics */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-[#66645E] mb-3">
            <span className="text-[#0B5D3B] font-semibold">{kickerEn}</span>
            <span aria-hidden="true">·</span>
            <span>QanoonPK 3D Archival Pavilion</span>
          </div>

          <h2 className="font-legal-serif text-2xl sm:text-3xl md:text-[34px] text-[#141413] leading-[1.18] tracking-tight">
            {titleEn}
          </h2>

          <p
            dir="rtl"
            className="mt-3 font-urdu text-xl sm:text-2xl text-[#141413]/90"
          >
            {titleUr}
          </p>

          <p className="mt-4 text-sm sm:text-base text-[#66645E] leading-relaxed max-w-3xl">
            {subtitleEn}
          </p>

          {/* Unboxed Tabular Metrics Row */}
          <div className="mt-6 pt-5 border-t border-[#E5E2D9] flex flex-wrap items-center gap-x-8 gap-y-3">
            {stats.map((st, idx) => (
              <div key={idx}>
                <div className="font-legal-serif text-lg sm:text-xl font-bold text-[#141413] tabular-nums">
                  {st.value}
                </div>
                <div className="text-xs text-[#66645E]">{st.label}</div>
              </div>
            ))}
          </div>

          {(primaryCtaLabel || secondaryCtaLabel) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {primaryCtaLabel && onPrimaryCtaClick && (
                <button
                  type="button"
                  onClick={onPrimaryCtaClick}
                  className="px-5 py-2.5 min-h-[42px] rounded-xl bg-[#0B5D3B] hover:bg-[#09482E] text-[#FAF9F5] text-xs sm:text-sm font-medium transition-editorial cursor-pointer whitespace-nowrap shrink-0"
                >
                  {primaryCtaLabel}
                </button>
              )}
              {secondaryCtaLabel && secondaryCtaHref && (
                <a
                  href={secondaryCtaHref}
                  className="px-4 py-2.5 min-h-[42px] rounded-xl border border-[#141413] bg-[#FAF9F5] hover:bg-[#141413] hover:text-[#FAF9F5] text-xs sm:text-sm font-medium text-[#141413] inline-flex items-center justify-center transition-editorial whitespace-nowrap shrink-0"
                >
                  {secondaryCtaLabel}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right 5 Columns: Interactive 3D Sculptural Diorama */}
        <div
          className="lg:col-span-5 flex items-center justify-center lg:justify-end py-4"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative w-full max-w-[420px] h-[250px] rounded-2xl border border-[#E5E2D9] bg-gradient-to-br from-[#FAF9F5] via-[#F2EFE9] to-[#E6E1D6] p-6 shadow-xl transition-transform duration-300 ease-out flex flex-col justify-between"
            style={{
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* 3D Scene Header Plate */}
            <div
              className="flex items-center justify-between border-b border-[#E5E2D9] pb-3"
              style={{ transform: "translateZ(24px)" }}
            >
              <span className="font-mono-code text-[10px] tracking-widest uppercase text-[#66645E]">
                {variant === "codex" && "CONSTITUTION · PPC · ACTS"}
                {variant === "judgments" && "SCMR · PLD · HIGH COURTS"}
                {variant === "lawyers_careers" && "BAR COUNCIL · CHAMBERS"}
                {variant === "legal_aid_news" && "LEGAL AID GAZETTE · 2026"}
                {variant === "wirasat_tools" && "FARAID · SUCCESSION DESK"}
              </span>
              <span className="w-6 h-6 rounded-md bg-[#0B5D3B] text-[#FAF9F5] flex items-center justify-center">
                {variant === "codex" && <BookOpen className="w-3.5 h-3.5" />}
                {variant === "judgments" && <Landmark className="w-3.5 h-3.5" />}
                {variant === "lawyers_careers" && <Briefcase className="w-3.5 h-3.5" />}
                {variant === "legal_aid_news" && <Newspaper className="w-3.5 h-3.5" />}
                {variant === "wirasat_tools" && <Calculator className="w-3.5 h-3.5" />}
              </span>
            </div>

            {/* 3D Centerpiece Sculpture by Variant */}
            {variant === "codex" && (
              <div
                className="my-auto flex items-end justify-center gap-3 pt-2"
                style={{ transform: "translateZ(46px)" }}
              >
                {/* 3D Volume 1: Constitution 1973 */}
                <div className="w-20 h-32 rounded-r-lg rounded-l-xs bg-[#0B5D3B] border-l-4 border-[#D4AF37] text-[#FAF9F5] p-2.5 flex flex-col justify-between shadow-lg -rotate-3">
                  <span className="font-mono-code text-[9px] text-[#D4AF37]">1973</span>
                  <span className="font-legal-serif text-xs font-bold leading-tight">
                    Constitution of Pakistan
                  </span>
                  <span dir="rtl" className="font-urdu text-xs text-[#FAF9F5]/90">
                    آئینِ پاکستان
                  </span>
                </div>

                {/* 3D Volume 2: Pakistan Penal Code */}
                <div className="w-20 h-28 rounded-r-lg rounded-l-xs bg-[#141413] border-l-4 border-[#C5B358] text-[#FAF9F5] p-2.5 flex flex-col justify-between shadow-lg">
                  <span className="font-mono-code text-[9px] text-[#C5B358]">ACT XLV</span>
                  <span className="font-legal-serif text-xs font-bold leading-tight">
                    Pakistan Penal Code
                  </span>
                  <span dir="rtl" className="font-urdu text-xs text-[#FAF9F5]/90">
                    تعزیرات
                  </span>
                </div>

                {/* 3D Volume 3: Civil & Family Acts */}
                <div className="w-20 h-24 rounded-r-lg rounded-l-xs bg-[#FAF9F5] border border-[#141413]/30 border-l-4 border-l-[#0B5D3B] text-[#141413] p-2.5 flex flex-col justify-between shadow-md rotate-3">
                  <span className="font-mono-code text-[9px] text-[#0B5D3B]">CODE</span>
                  <span className="font-legal-serif text-[11px] font-bold leading-tight">
                    Civil & Family Acts
                  </span>
                  <span dir="rtl" className="font-urdu text-xs text-[#66645E]">
                    دیوانی قوانین
                  </span>
                </div>
              </div>
            )}

            {variant === "judgments" && (
              <div
                className="my-auto flex flex-col items-center justify-center pt-1"
                style={{ transform: "translateZ(46px)" }}
              >
                {/* Pediment + 4 Fluted Marble Columns of Supreme Court */}
                <div className="w-56 h-5 rounded-t-lg bg-[#141413] text-[#FAF9F5] flex items-center justify-center font-mono-code text-[9px] tracking-widest shadow-sm">
                  SUPREME & HIGH COURTS ARCHIVE
                </div>
                <div className="w-52 h-20 bg-[#FAF9F5]/90 border-x border-[#E5E2D9] px-4 py-2 flex items-stretch justify-between shadow-inner">
                  {[1, 2, 3, 4].map((col) => (
                    <div
                      key={col}
                      className="w-5 h-full rounded-xs bg-gradient-to-r from-[#E5E2D9] via-[#FAF9F5] to-[#D5D0C5] border border-[#E5E2D9] flex flex-col justify-between p-0.5"
                    >
                      <span className="h-1 bg-[#141413]/20 rounded-full" />
                      <span className="h-1 bg-[#141413]/20 rounded-full" />
                    </div>
                  ))}
                  <div className="my-auto px-2 py-1 rounded bg-[#0B5D3B] text-[#FAF9F5] font-mono-code text-[10px] font-semibold shadow-sm">
                    PLD · SCMR
                  </div>
                </div>
                <div className="w-60 h-3.5 rounded-b-md bg-[#141413]/90 shadow-md" />
              </div>
            )}

            {variant === "lawyers_careers" && (
              <div
                className="my-auto flex items-center justify-center gap-3.5"
                style={{ transform: "translateZ(46px)" }}
              >
                {/* Verified Advocate Chamber Card */}
                <div className="w-36 rounded-xl bg-[#141413] text-[#FAF9F5] p-3.5 shadow-lg -rotate-2">
                  <div className="flex items-center justify-between mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-mono-code text-[9px] text-[#D4AF37]">PBC VERIFIED</span>
                  </div>
                  <div className="font-legal-serif text-xs font-bold">
                    Find Verified Advocates
                  </div>
                  <div dir="rtl" className="font-urdu text-xs text-[#FAF9F5]/80 mt-0.5">
                    تصدیق شدہ وکلاء
                  </div>
                </div>

                {/* Legal Career & Hiring Medallion Card */}
                <div className="w-36 rounded-xl bg-[#0B5D3B] text-[#FAF9F5] p-3.5 shadow-lg rotate-2">
                  <div className="flex items-center justify-between mb-2">
                    <Award className="w-4 h-4 text-[#FAF9F5]" />
                    <span className="font-mono-code text-[9px] text-[#FAF9F5]/80">GET HIRED</span>
                  </div>
                  <div className="font-legal-serif text-xs font-bold">
                    Chambers & Legal Jobs
                  </div>
                  <div dir="rtl" className="font-urdu text-xs text-[#FAF9F5]/90 mt-0.5">
                    قانونی روزگار
                  </div>
                </div>
              </div>
            )}

            {variant === "legal_aid_news" && (
              <div
                className="my-auto flex items-center justify-center"
                style={{ transform: "translateZ(46px)" }}
              >
                {/* 3D Broadsheet Legal Aid Gazette */}
                <div className="w-64 rounded-xl bg-[#FAF9F5] border border-[#141413]/20 p-3.5 shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-1.5 mb-2">
                    <span className="font-legal-serif text-[11px] font-bold text-[#141413]">
                      THE CITIZEN JUSTICE GAZETTE
                    </span>
                    <span className="font-mono-code text-[9px] text-[#0B5D3B] font-semibold">
                      PRO-BONO
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-8 space-y-1">
                      <div className="h-2 w-full rounded bg-[#141413]/80" />
                      <div className="h-2 w-4/5 rounded bg-[#141413]/60" />
                      <div className="h-1.5 w-full rounded bg-[#66645E]/40 mt-1" />
                      <div className="h-1.5 w-3/4 rounded bg-[#66645E]/40" />
                    </div>
                    <div className="col-span-4 h-12 rounded-lg bg-[#0B5D3B] text-[#FAF9F5] flex flex-col items-center justify-center p-1">
                      <Scale className="w-4 h-4" />
                      <span className="font-mono-code text-[8px] mt-0.5">FREE AID</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {variant === "wirasat_tools" && (
              <div
                className="my-auto flex items-center justify-center"
                style={{ transform: "translateZ(46px)" }}
              >
                {/* 3D Shariah Inheritance Proportional Matrix */}
                <div className="w-64 rounded-xl bg-[#FAF9F5] border border-[#141413]/20 p-3.5 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono-code text-[10px] font-semibold text-[#0B5D3B]">
                      SURAH AN-NISA · FARAID SHARES
                    </span>
                    <span dir="rtl" className="font-urdu text-xs text-[#141413]">
                      شرعی حصص
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center font-mono-code text-[10px]">
                    <div className="p-2 rounded bg-[#0B5D3B] text-[#FAF9F5]">
                      <div className="font-bold">1/8 · 1/4</div>
                      <div className="text-[8px] opacity-85">Spouse</div>
                    </div>
                    <div className="p-2 rounded bg-[#141413] text-[#FAF9F5]">
                      <div className="font-bold">2 : 1</div>
                      <div className="text-[8px] opacity-85">Son : Daughter</div>
                    </div>
                    <div className="p-2 rounded bg-[#F2EFE9] border border-[#E5E2D9] text-[#141413]">
                      <div className="font-bold">1/6 · 1/6</div>
                      <div className="text-[8px] text-[#66645E]">Parents</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Base Pedestal Caption */}
            <div
              className="pt-2.5 border-t border-[#E5E2D9] flex items-center justify-between text-[10px] font-mono-code text-[#66645E]"
              style={{ transform: "translateZ(20px)" }}
            >
              <span>INTERACTIVE 3D ARCHIVE</span>
              <span dir="rtl" className="font-urdu text-xs text-[#141413]">
                مستند قانونی ذخیرہ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
