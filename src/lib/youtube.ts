export const YOUTUBE_URL_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/
] as const;

export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function isValidYouTubeVideoId(videoId: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

export function getThumbnailUrl(videoId: string, quality: 'maxres' | 'hq' | 'mq' | 'default' = 'hq'): string {
  const base = `https://img.youtube.com/vi/${videoId}`;
  switch (quality) {
    case 'maxres':
      return `${base}/maxresdefault.jpg`;
    case 'hq':
      return `${base}/hqdefault.jpg`;
    case 'mq':
      return `${base}/mqdefault.jpg`;
    case 'default':
    default:
      return `${base}/default.jpg`;
  }
}

export function getThumbnailUrls(videoId: string): { maxres: string; hq: string; mq: string; default: string } {
  return {
    maxres: getThumbnailUrl(videoId, 'maxres'),
    hq: getThumbnailUrl(videoId, 'hq'),
    mq: getThumbnailUrl(videoId, 'mq'),
    default: getThumbnailUrl(videoId, 'default')
  };
}

export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}