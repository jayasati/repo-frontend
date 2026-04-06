export function normalizeGithubRepoUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('https://github.com/')) {
    return stripRepoSuffix(trimmed);
  }

  if (/^[\w.-]+\/[\w.-]+$/.test(trimmed)) {
    return `https://github.com/${stripRepoSuffix(trimmed)}`;
  }

  return null;
}

function stripRepoSuffix(value: string): string {
  return value.replace(/\/+$/, '').replace(/\.git$/i, '');
}
