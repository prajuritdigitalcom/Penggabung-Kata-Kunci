export interface KeywordList {
  id: string;
  name: string;
  rawText: string;
}

export interface GeneratorOptions {
  removeDuplicates: boolean;
  ignoreCaseDuplicates: boolean;
  sortAZ: boolean;
  titleCase: boolean;
  removeDoubleSpaces: boolean;
  trimResult: boolean;
}

export interface ResultStats {
  inputListsCount: number;
  rawCombinationCount: number;
  duplicateRemovedCount: number;
  finalResultCount: number;
  executionTimeSeconds: number;
}
