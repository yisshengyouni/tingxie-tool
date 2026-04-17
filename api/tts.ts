export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');

  if (!text) {
    return new Response('Missing text parameter', { status: 400 });
  }

  const ttsUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=1`;

  try {
    const response = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://dict.youdao.com/',
      },
    });

    if (!response.ok) {
      return new Response('TTS service error', { status: 502 });
    }

    const headers = new Headers(response.headers);
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Cache-Control', 'public, max-age=86400');

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    return new Response('Fetch failed', { status: 500 });
  }
}
