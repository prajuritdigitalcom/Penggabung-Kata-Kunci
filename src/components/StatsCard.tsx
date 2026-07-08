import React from 'react';
import { BarChart3, TrendingUp, Zap, ListTodo, Layers, AlertCircle } from 'lucide-react';
import { KeywordList, ResultStats } from '../types';
import { parseAndNormalizeList, estimateCombination } from '../utils/keywordUtils';

interface StatsCardProps {
  lists: KeywordList[];
  stats: ResultStats | null;
}

export default function StatsCard({ lists, stats }: StatsCardProps) {
  // Parse lists to get their parsed keyword counts
  const listCounts = lists.map((list, index) => {
    const keywords = parseAndNormalizeList(list.rawText);
    return {
      index: index + 1,
      name: `List ${index + 1}`,
      count: keywords.length,
    };
  });

  // Multiplication estimation
  const parsedLists = lists.map(l => parseAndNormalizeList(l.rawText));
  const estimatedCount = estimateCombination(parsedLists);

  // Formatting helper
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const isWarningLimit = estimatedCount > 300000;

  return (
    <div className="space-y-6">
      {/* Live Estimation Panel */}
      <div className="bg-white border border-rose-100/85 rounded-2xl p-6 shadow-[0_8px_30px_rgb(254,76,111,0.02)]">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
          <TrendingUp className="w-5 h-5 text-brand" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Estimasi Langsung</h2>
            <p className="text-xs text-slate-500">
              Kalkulasi langsung dari isi daftar dan potensi ukuran hasil penggabungan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {listCounts.map((item) => (
            <div
              key={item.index}
              className="bg-slate-50 border border-slate-150 rounded-xl p-3 flex flex-col justify-between"
            >
              <span className="text-xs text-slate-500 font-medium">Daftar {item.index}</span>
              <span className="text-lg font-extrabold text-slate-800 font-mono mt-1">
                {formatNumber(item.count)} <span className="text-xs font-normal text-slate-400">kw</span>
              </span>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Estimasi Jumlah Output
            </span>
            <span className={`text-2xl font-black font-mono tracking-tight mt-0.5 block ${
              isWarningLimit ? 'text-amber-600' : 'text-brand'
            }`}>
              {formatNumber(estimatedCount)}
            </span>
          </div>
          <div className="text-xs text-slate-500 max-w-xs leading-relaxed">
            {isWarningLimit && (
              <span className="text-amber-800 flex items-start gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Output sangat besar!</strong> Di atas 300.000 kombinasi, browser mungkin menjadi lambat. Coba kurangi isi daftar.
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Generation Report Panel */}
      {stats && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden animate-fade-in">
          {/* Subtle decoration bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
          
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <BarChart3 className="w-5 h-5 text-brand" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Metrik Eksekusi</h2>
              <p className="text-xs text-slate-500">
                Rincian performa dari proses penggabungan terakhir.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Daftar Input</span>
              </div>
              <span className="text-xl font-bold text-slate-800 font-mono mt-1 block">
                {stats.inputListsCount}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ListTodo className="w-3.5 h-3.5 text-slate-400" />
                <span>Kombinasi Awal</span>
              </div>
              <span className="text-xl font-bold text-slate-800 font-mono mt-1 block">
                {formatNumber(stats.rawCombinationCount)}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Duplikat Dihapus</span>
              </div>
              <span className="text-xl font-bold text-rose-500 font-mono mt-1 block">
                {formatNumber(stats.duplicateRemovedCount)}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Zap className="w-3.5 h-3.5 text-brand" />
                <span>Waktu Eksekusi</span>
              </div>
              <span className="text-xl font-bold text-brand font-mono mt-1 block">
                {stats.executionTimeSeconds.toFixed(3)} <span className="text-xs font-normal">detik</span>
              </span>
            </div>
          </div>

          <div className="mt-4 bg-brand-light border border-brand/20 rounded-xl p-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Hasil Akhir Bersih:</span>
            <span className="text-lg font-black text-brand font-mono">
              {formatNumber(stats.finalResultCount)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
