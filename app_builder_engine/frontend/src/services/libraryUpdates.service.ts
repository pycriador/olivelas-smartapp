import { apiClient } from './api-client';
import type {
  LibraryUpdateEntry,
  TestCandidateRequest,
  TestCandidateResult,
  ApplyUpdateRequest,
  LibraryUpdatesStatus,
} from '@/types/libraryUpdates.types';

const BASE = '/api/v1/library-updates';

export const libraryUpdatesService = {
  /** Live query against npm/PyPI registries. Can take a few seconds. */
  scan: () => apiClient.get<LibraryUpdateEntry[]>(`${BASE}/scan`),

  getStatus: () => apiClient.get<LibraryUpdatesStatus>(`${BASE}/status`),

  /** Installs and builds a throwaway test app with the candidate version. Can take up to ~2 minutes. */
  testCandidate: (payload: TestCandidateRequest) =>
    apiClient.post<TestCandidateResult>(`${BASE}/test-candidate`, payload),

  /** Writes the chosen version to stack_versions.json on disk. Does not touch git. */
  apply: (payload: ApplyUpdateRequest) =>
    apiClient.post<Record<string, any>>(`${BASE}/apply`, payload),
};
