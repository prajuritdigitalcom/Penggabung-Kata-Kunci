import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import Header from './components/Header';
import KeywordInputCard from './components/KeywordInputCard';
import OptionsCard from './components/OptionsCard';
import StatsCard from './components/StatsCard';
import OutputCard from './components/OutputCard';
import { KeywordList, GeneratorOptions, ResultStats } from './types';
import {
  parseAndNormalizeList,
  cartesianProduct,
  titleCase,
  removeDuplicate,
  estimateCombination,
  copyClipboard,
  downloadTxt,
  downloadExcel
} from './utils/keywordUtils';

export default function App() {
  // Pre-fill initial list state as requested in the PRD
  const [lists, setLists] = useState<KeywordList[]>([
    { id: '1', name: 'Daftar Keyword 1', rawText: 'Jasa Bekam\nBekam Panggilan' },
    { id: '2', name: 'Daftar Keyword 2', rawText: 'Jakarta\nBandung' },
    { id: '3', name: 'Daftar Keyword 3', rawText: 'Murah\nTerdekat' },
  ]);

  // Checkbox option state
  const [options, setOptions] = useState<GeneratorOptions>({
    removeDuplicates: true,
    ignoreCaseDuplicates: false,
    sortAZ: false,
    titleCase: false,
    removeDoubleSpaces: true,
    trimResult: true,
  });

  // Outputs and performance stats
  const [output, setOutput] = useState<string[]>([]);
  const [stats, setStats] = useState<ResultStats | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Helper: add a new list at the bottom
  const handleAddList = () => {
    const nextNum = lists.length + 1;
    const newList: KeywordList = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      name: `Daftar Keyword ${nextNum}`,
      rawText: '',
    };
    setLists([...lists, newList]);
    toast.success('Daftar keyword baru ditambahkan!', {
      description: `Sekarang membuat draf pada Daftar ${nextNum}.`,
    });
  };

  // Helper: delete list by ID
  const handleRemoveList = (id: string) => {
    if (lists.length <= 1) {
      toast.error('Anda harus menyisakan setidaknya satu daftar keyword.');
      return;
    }
    setLists(lists.filter(l => l.id !== id));
    toast.info('Daftar keyword telah dihapus.');
  };

  // Helper: update text content of a list
  const handleUpdateListText = (id: string, text: string) => {
    setLists(lists.map(l => l.id === id ? { ...l, rawText: text } : l));
  };

  // Helper: clear content of a list
  const handleClearList = (id: string) => {
    setLists(lists.map(l => l.id === id ? { ...l, rawText: '' } : l));
    toast.info('Area teks daftar telah dikosongkan.');
  };

  // Trigger main cartesian combination processing engine
  const executeGeneration = () => {
    setIsGenerating(true);
    setShowWarning(false);

    // Run computation asynchronously to prevent locking the browser's render thread immediately
    setTimeout(() => {
      try {
        const startTime = performance.now();

        // 1. Parse lists and keep active ones
        const parsedLists = lists.map(l => parseAndNormalizeList(l.rawText));
        const activeLists = parsedLists.filter(l => l.length > 0);
        const inputListsCount = activeLists.length;

        // 2. Generate raw Cartesian product
        let processed = cartesianProduct(activeLists);
        const rawCombinationCount = processed.length;

        // 3. Post-Process: Title Case
        if (options.titleCase) {
          processed = processed.map(titleCase);
        }

        // 4. Post-Process: Remove Double Spaces
        if (options.removeDoubleSpaces) {
          processed = processed.map(kw => kw.replace(/\s+/g, ' ').trim());
        }

        // 5. Post-Process: Trim Result
        if (options.trimResult) {
          processed = processed.map(kw => kw.trim());
        }

        // 6. Post-Process: Duplicates Filtering
        let finalOutput = processed;
        let duplicateRemovedCount = 0;
        if (options.removeDuplicates) {
          const deduplicated = removeDuplicate(processed, options.ignoreCaseDuplicates);
          finalOutput = deduplicated.unique;
          duplicateRemovedCount = deduplicated.removedCount;
        }

        // 7. Post-Process: Sorting
        if (options.sortAZ) {
          finalOutput.sort((a, b) => a.localeCompare(b));
        }

        const endTime = performance.now();
        const executionTimeSeconds = (endTime - startTime) / 1000;

        // Save outcomes
        setOutput(finalOutput);
        setStats({
          inputListsCount,
          rawCombinationCount,
          duplicateRemovedCount,
          finalResultCount: finalOutput.length,
          executionTimeSeconds,
        });

        toast.success('Kombinasi berhasil dibuat!', {
          description: `Berhasil membuat ${new Intl.NumberFormat().format(finalOutput.length)} keyword dalam ${executionTimeSeconds.toFixed(3)} detik.`,
        });
      } catch (error) {
        console.error(error);
        toast.error('Terjadi kesalahan saat membuat kombinasi.');
      } finally {
        setIsGenerating(false);
      }
    }, 50);
  };

  const handleGenerate = () => {
    // Check if everything is blank
    const parsedLists = lists.map(l => parseAndNormalizeList(l.rawText));
    const activeLists = parsedLists.filter(l => l.length > 0);

    if (activeLists.length === 0) {
      toast.error('Silakan masukkan setidaknya satu keyword.');
      return;
    }

    // Estimate combination counts
    const estimatedCount = estimateCombination(parsedLists);

    if (estimatedCount > 300000) {
      setShowWarning(true);
      toast.warning('Estimasi ukuran output sangat besar!', {
        description: 'Silakan konfirmasi di dalam kartu output untuk memulai.',
      });
      return;
    }

    executeGeneration();
  };

  const handleConfirmGenerateOverLimit = () => {
    executeGeneration();
  };

  // Copy result to clipboard
  const handleCopy = async () => {
    if (output.length === 0) return;
    const joinedText = output.join('\n');
    const success = await copyClipboard(joinedText);
    if (success) {
      toast.success('Berhasil Disalin!', {
        description: 'Semua kombinasi keyword yang dihasilkan telah disalin ke papan klip.',
      });
    } else {
      toast.error('Gagal menyalin ke papan klip.');
    }
  };

  // Download plain TXT format
  const handleDownloadTxt = () => {
    if (output.length === 0) return;
    downloadTxt(output.join('\n'), 'kombinasi-keyword.txt');
    toast.success('Unduhan Berhasil!', {
      description: 'Menyimpan file kombinasi-keyword.txt ke direktori unduhan Anda.',
    });
  };

  // Download rich Excel format
  const handleDownloadExcel = () => {
    if (output.length === 0) return;
    downloadExcel(output, 'kombinasi-keyword.xlsx');
    toast.success('Unduhan Excel Berhasil!', {
      description: 'Menyimpan file kombinasi-keyword.xlsx ke direktori unduhan Anda.',
    });
  };

  // Reset entire dashboard
  const handleClearAll = () => {
    setLists([
      { id: '1', name: 'Daftar Keyword 1', rawText: '' },
      { id: '2', name: 'Daftar Keyword 2', rawText: '' },
      { id: '3', name: 'Daftar Keyword 3', rawText: '' },
    ]);
    setOutput([]);
    setStats(null);
    setShowWarning(false);
    toast.info('Berhasil Direset', {
      description: 'Berhasil mereset seluruh daftar input teks dan output kombinasi yang dihasilkan.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Toaster position="top-right" theme="light" closeButton richColors />
      
      <Header />

      <main className="max-w-7xl mx-auto w-full px-6 pb-16 flex-1">
        {/* Two column responsive grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Config and lists input */}
          <div className="lg:col-span-6 space-y-6 flex flex-col h-full">
            <KeywordInputCard
              lists={lists}
              onAddList={handleAddList}
              onRemoveList={handleRemoveList}
              onUpdateListText={handleUpdateListText}
              onClearList={handleClearList}
            />

            <OptionsCard
              options={options}
              onChangeOptions={setOptions}
            />

            <StatsCard
              lists={lists}
              stats={stats}
            />
          </div>

          {/* Right panel: Final combinations output */}
          <div className="lg:col-span-6 h-full">
            <OutputCard
              output={output}
              onGenerate={handleGenerate}
              onCopy={handleCopy}
              onDownloadTxt={handleDownloadTxt}
              onDownloadExcel={handleDownloadExcel}
              onClearAll={handleClearAll}
              isGenerating={isGenerating}
              outputLimitWarning={showWarning}
              onConfirmGenerateOverLimit={handleConfirmGenerateOverLimit}
            />
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Keyword Combination Generator &copy; 2026</span>
          <span>Bypass batasan, jalankan kueri lokal secepat kilat.</span>
        </div>
      </footer>
    </div>
  );
}
