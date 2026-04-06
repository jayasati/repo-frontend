const LAST_ANALYZED_REPO_KEY = 'ra:last-analyzed-repo';

export function setLastAnalyzedRepo(repoUrl: string): void {
  if (typeof window === 'undefined') return;
  if (!repoUrl.trim()) return;
  window.localStorage.setItem(LAST_ANALYZED_REPO_KEY, repoUrl);
}

export function getLastAnalyzedRepo(): string | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(LAST_ANALYZED_REPO_KEY);
  return value?.trim() ? value : null;
}
