import React from 'react';
import { Play, Clipboard, Download, FileSpreadsheet, Trash, Loader2 } from 'lucide-react';

interface OutputCardProps {
  output: string[];
  onGenerate: () => void;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onDownloadExcel: () => void;
  onClearAll: () => void;
  isGenerating: boolean;
  outputLimitWarning: boolean;
  onConfirmGenerateOverLimit: () => void;
}

export default function OutputCard({
  output,
  onGenerate,
  onCopy,
  onDownloadTxt,
  onDownloadExcel,
  onClearAll,
  isGenerating,
  outputLimitWarning,
  onConfirmGenerateOverLimit,
}: OutputCardProps) {
  const hasOutput = output.length > 0;
  const joinedOutput = output.join('\n');

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Output Kombinasi</h2>
          <p className="text-xs text-slate-500">
            Lihat, salin, atau unduh hasil penggabungan kata kunci Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-brand bg-brand-light px-2.5 py-1 rounded-md border border-brand/20">
            {new Intl.NumberFormat().format(output.length)} Keyword
          </span>
        </div>
      </div>

      <div className="flex-1 relative mb-5">
        <textarea
          readOnly
          value={joinedOutput}
          placeholder="Hasil kombinasi kata kunci Anda akan muncul di sini..."
          className="w-full h-80 sm:h-[430px] bg-slate-50 text-slate-850 border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand rounded-xl p-4 text-sm font-mono placeholder-slate-400 outline-none resize-none custom-scrollbar"
        />
        
        {!hasOutput && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Isi daftar kata kunci di sebelah kiri, sesuaikan opsi aturan, lalu klik <strong>Hubungkan Keyword</strong>.
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-xl">
            <Loader2 className="w-8 h-8 text-brand animate-spin mb-2" />
            <span className="text-sm text-slate-700 font-semibold font-mono">
              Memproses Penggabungan...
            </span>
          </div>
        )}
      </div>

      {/* Warning/Modal overlay for >300,000 keywords inside output box */}
      {outputLimitWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex flex-col gap-3">
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong className="block mb-1 text-sm font-bold">⚠️ Peringatan Volume Tinggi</strong>
            Hasil kombinasi melebihi 300.000 kata. Merender dan mengekspor mungkin membuat browser Anda sedikit lambat sementara waktu. Apakah Anda yakin ingin melanjutkan?
          </div>
          <div className="flex gap-2">
            <button
              onClick={onConfirmGenerateOverLimit}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Ya, Hubungkan
            </button>
          </div>
        </div>
      )}

      {/* Responsive Buttons container */}
      <div className="flex flex-col gap-3">
        {/* Main Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 py-3 px-5 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all duration-150 shadow-md shadow-rose-200/50 active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menghubungkan...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Hubungkan Keyword
              </>
            )}
          </button>

          <button
            onClick={onCopy}
            disabled={!hasOutput || isGenerating}
            className="flex items-center justify-center gap-2 py-3 px-5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 text-slate-700 disabled:text-slate-400 rounded-xl font-semibold text-sm transition-all duration-150 border border-slate-200 active:scale-[0.98]"
          >
            <Clipboard className="w-4 h-4" />
            Salin Semua Hasil
          </button>
        </div>

        {/* Download & Export row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={onDownloadTxt}
            disabled={!hasOutput || isGenerating}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-600 disabled:text-slate-400 rounded-xl font-semibold text-xs border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Format TXT
          </button>

          <button
            onClick={onDownloadExcel}
            disabled={!hasOutput || isGenerating}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-600 disabled:text-slate-400 rounded-xl font-semibold text-xs border border-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Format Excel
          </button>

          <button
            onClick={onClearAll}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-semibold text-xs border border-rose-150 transition-colors"
          >
            <Trash className="w-3.5 h-3.5" />
            Reset Semua
          </button>
        </div>
      </div>
    </div>
  );
}
