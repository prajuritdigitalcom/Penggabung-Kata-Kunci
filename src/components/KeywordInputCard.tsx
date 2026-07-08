import React from 'react';
import { Plus, Trash, RotateCcw, HelpCircle } from 'lucide-react';
import { KeywordList } from '../types';
import { parseAndNormalizeList } from '../utils/keywordUtils';

interface KeywordInputCardProps {
  lists: KeywordList[];
  onAddList: () => void;
  onRemoveList: (id: string) => void;
  onUpdateListText: (id: string, text: string) => void;
  onClearList: (id: string) => void;
}

export default function KeywordInputCard({
  lists,
  onAddList,
  onRemoveList,
  onUpdateListText,
  onClearList
}: KeywordInputCardProps) {
  return (
    <div className="bg-white border border-rose-100/85 rounded-2xl p-6 shadow-[0_8px_30px_rgb(254,76,111,0.02)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-light border border-brand/20 text-[10px] font-bold text-brand uppercase tracking-wider mb-2">
            <span className="w-1 h-1 rounded-full bg-brand"></span>
            Langkah 1
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Daftar Kata Kunci
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Masukkan satu kata kunci per baris. Daftar kosong otomatis dilewati.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg">
          {lists.length} Kolom
        </span>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {lists.map((list, index) => {
          const parsedCount = parseAndNormalizeList(list.rawText).length;
          
          return (
            <div
              key={list.id}
              className="group bg-slate-50/60 border border-slate-200/60 rounded-xl p-4 hover:border-brand/35 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-brand-light text-brand border border-brand/20 text-xs font-bold font-mono">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    Daftar Keyword {index + 1}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 opacity-95 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={() => onClearList(list.id)}
                    title="Kosongkan daftar"
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors duration-150"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveList(list.id)}
                    disabled={lists.length <= 1}
                    title="Hapus daftar"
                    className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-rose-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:text-slate-300 rounded-lg transition-colors duration-150"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={list.rawText}
                  onChange={(e) => onUpdateListText(list.id, e.target.value)}
                  placeholder={`Contoh kata 1\nContoh kata 2\nContoh kata 3`}
                  className="w-full h-28 bg-white text-slate-800 border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand rounded-lg p-3 text-sm font-mono placeholder-slate-400 outline-none resize-y transition-all duration-150 shadow-inner-sm"
                />
                
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-slate-50/90 border border-slate-200 px-2 py-0.5 rounded-md backdrop-blur-sm pointer-events-none">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Keywords:</span>
                  <span className="text-xs font-bold text-brand font-mono">
                    {parsedCount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onAddList}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-light hover:bg-brand hover:text-white border border-brand/20 text-brand rounded-xl font-semibold text-sm transition-all duration-150 shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Tambah Daftar Keyword
      </button>
    </div>
  );
}
