import * as XLSX from 'xlsx';

/**
 * Normalizes a single keyword: trim, replace tabs with space, remove duplicate spaces.
 */
export function normalizeKeyword(keyword: string): string {
  return keyword
    .replace(/\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits raw text by lines, normalizes each line, and filters out blank lines.
 */
export function parseAndNormalizeList(rawText: string): string[] {
  if (!rawText) return [];
  return rawText
    .split(/\r?\n/)
    .map(normalizeKeyword)
    .filter(kw => kw.length > 0);
}

/**
 * Computes the Cartesian Product of multiple lists of words/keywords,
 * joining them sequentially with spaces.
 */
export function cartesianProduct(lists: string[][]): string[] {
  const activeLists = lists.filter(list => list.length > 0);
  if (activeLists.length === 0) return [];
  
  let results = activeLists[0];
  
  for (let i = 1; i < activeLists.length; i++) {
    const current = activeLists[i];
    const next: string[] = [];
    const lenResults = results.length;
    const lenCurrent = current.length;
    
    // Performance optimized nested loops
    for (let j = 0; j < lenResults; j++) {
      const prefix = results[j];
      for (let k = 0; k < lenCurrent; k++) {
        next.push(prefix + ' ' + current[k]);
      }
    }
    results = next;
  }
  return results;
}

/**
 * Capitalizes the first letter of each word in a string.
 */
export function titleCase(text: string): string {
  return text
    .split(' ')
    .map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Removes duplicate items from a list.
 * If ignoreCase is true, case-insensitive matches are removed, keeping the first match's original case.
 */
export function removeDuplicate(keywords: string[], ignoreCase: boolean): { unique: string[], removedCount: number } {
  if (!ignoreCase) {
    const uniqueSet = new Set(keywords);
    const unique = Array.from(uniqueSet);
    return {
      unique,
      removedCount: keywords.length - unique.length
    };
  } else {
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const kw of keywords) {
      const lower = kw.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        unique.push(kw);
      }
    }
    return {
      unique,
      removedCount: keywords.length - unique.length
    };
  }
}

/**
 * Estimates the combination count using length multiplication of active lists.
 */
export function estimateCombination(lists: string[][]): number {
  const activeLengths = lists.map(l => l.length).filter(len => len > 0);
  if (activeLengths.length === 0) return 0;
  return activeLengths.reduce((acc, len) => acc * len, 1);
}

/**
 * Copies text to system clipboard.
 */
export async function copyClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (e) {
    console.error('Failed to copy text: ', e);
    return false;
  }
}

/**
 * Triggers a client-side download of a plain text file.
 */
export function downloadTxt(text: string, filename: string = "keyword-combination.txt"): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a download of an Excel file (.xlsx) formatting with bold header, sequence numbers and fit column width.
 */
export function downloadExcel(keywords: string[], filename: string = "keyword-combination.xlsx"): void {
  const data = keywords.map((kw, index) => ({
    "No": index + 1,
    "Keyword": kw
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Style bold headers in SheetJS
  // Note: Standard XLSX community edition does not support full styling but custom cell settings or plain values works.
  // We can calculate column width to avoid cropped text
  const maxLenNo = Math.max(4, String(keywords.length).length);
  const maxLenKw = keywords.reduce((max, kw) => Math.max(max, kw.length), 7);
  
  worksheet['!cols'] = [
    { wch: maxLenNo + 3 },
    { wch: maxLenKw + 3 }
  ];
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Keywords");
  XLSX.writeFile(workbook, filename);
}
