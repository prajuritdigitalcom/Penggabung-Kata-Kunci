import React from 'react';
import { Settings, CheckSquare, Square } from 'lucide-react';
import { GeneratorOptions } from '../types';

interface OptionsCardProps {
  options: GeneratorOptions;
  onChangeOptions: (options: GeneratorOptions) => void;
}

export default function OptionsCard({ options, onChangeOptions }: OptionsCardProps) {
  const toggleOption = (key: keyof GeneratorOptions) => {
    onChangeOptions({
      ...options,
      [key]: !options[key],
    });
  };

  const optionItems = [
    {
      key: 'removeDuplicates' as const,
      label: 'Hapus Keyword Duplikat',
      description: 'Menghapus hasil kata kunci yang sama menggunakan JavaScript Set().',
    },
    {
      key: 'sortAZ' as const,
      label: 'Urutkan Sesuai Abjad (A-Z)',
      description: 'Mengurutkan hasil kombinasi kata kunci secara alfabetis.',
    },
    {
      key: 'titleCase' as const,
      label: 'Ubah ke Kapital Setiap Kata (Title Case)',
      description: 'Mengubah huruf awal dari setiap kata menjadi huruf besar (contoh: "Jasa Terapi Bekam Jakarta").',
    },
    {
      key: 'removeDoubleSpaces' as const,
      label: 'Hapus Spasi Ganda',
      description: 'Membersihkan spasi ganda berlebih di dalam hasil kombinasi.',
    },
    {
      key: 'trimResult' as const,
      label: 'Trim Hasil',
      description: 'Menghapus spasi kosong berlebih di awal dan akhir baris.',
    },
  ];

  return (
    <div className="bg-white border border-rose-100/85 rounded-2xl p-6 shadow-[0_8px_30px_rgb(254,76,111,0.02)]">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-light border border-brand/20 text-[10px] font-bold text-brand uppercase tracking-wider mb-2">
            <span className="w-1 h-1 rounded-full bg-brand"></span>
            Langkah 2
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand" />
            Opsi Hasil Proses
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Aturan penyaringan otomatis setelah kata kunci digabungkan.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {optionItems.map((item) => {
          const isActive = options[item.key];

          return (
            <button
              key={item.key}
              onClick={() => toggleOption(item.key)}
              className={`w-full flex items-start text-left gap-3.5 p-3 rounded-xl border transition-all duration-150 ${
                isActive
                  ? 'bg-brand-light border-brand/25 text-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-brand/25 text-slate-700'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isActive ? (
                  <div className="w-4 h-4 bg-brand rounded border border-brand flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded border border-slate-300 hover:border-brand/40" />
                )}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
