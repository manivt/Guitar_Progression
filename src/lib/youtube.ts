export const YOUTUBE_URL_PATTERNS = [
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
] as const;

export function isValidYouTubeVideoId(videoId: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const hasProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://');
    const parsed = new URL(hasProtocol ? trimmed : `https://${trimmed}`);
    const host = parsed.hostname.toLowerCase();

    if (host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        if (v && isValidYouTubeVideoId(v)) {
          return v;
        }
      }
      const pathMatch = parsed.pathname.match(/^\/(?:shorts|embed|v)\/([a-zA-Z0-9_-]{11})/);
      if (pathMatch && pathMatch[1] && isValidYouTubeVideoId(pathMatch[1])) {
        return pathMatch[1];
      }
    } else if (host === 'youtu.be') {
      const id = parsed.pathname.replace(/^\/+/, '').split('/')[0];
      if (id && isValidYouTubeVideoId(id)) {
        return id;
      }
    }
  } catch {
    // Fall back to regex parsing
  }

  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1] && isValidYouTubeVideoId(match[1])) {
      return match[1];
    }
  }

  return null;
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