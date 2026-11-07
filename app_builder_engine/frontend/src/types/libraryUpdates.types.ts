export type LibraryEcosystem = 'npm' | 'pip';

export interface LibraryUpdateEntry {
  package: string;
  ecosystem: LibraryEcosystem;
  current: string;
  safe_update: string | null;
  latest_stable: string | null;
  latest_test: string | null;
  update_available: boolean;
  error: string | null;
}

export interface TestCandidateRequest {
  ecosystem: LibraryEcosystem;
  package: string;
  version: string;
}

export interface TestCandidateResult {
  passed: boolean;
  step_failed: string | null;
  log_excerpt: string;
  vulnerabilities_found: number;
}

export interface ApplyUpdateRequest {
  ecosystem: LibraryEcosystem;
  package: string;
  version: string;
}

export interface StackVersionEntry {
  ecosystem: string;
  current: string;
}

export interface LibraryUpdatesStatus {
  last_scan_at: string | null;
  stack_versions: {
    frontend: Record<string, StackVersionEntry>;
    backend: Record<string, StackVersionEntry>;
  };
}

/** Which of the three candidate versions the user has selected for a given row. */
export type CandidateChoice = 'safe' | 'latest' | 'test';
