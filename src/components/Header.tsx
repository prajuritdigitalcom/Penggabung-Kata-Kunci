import React from 'react';
import { Layers } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-rose-100 bg-white/85 backdrop-blur-md sticky top-0 z-50 py-4 px-6 mb-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-light border border-brand/20 rounded-xl">
            <Layers className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Keyword Combination Generator
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Gabungkan beberapa daftar keyword menjadi seluruh kemungkinan kombinasi secara instan di browser Anda.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/80 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>100% Client-Side (Data aman & tidak dikirim ke server)</span>
        </div>
      </div>
    </header>
  );
}
