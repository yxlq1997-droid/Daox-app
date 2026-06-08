module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });

    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=3`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'Search failed' });
    }

    const images = (data.items || []).map(item => ({
      url: item.link,
      title: item.title,
      thumbnail: item.image?.thumbnailLink
    }));

    return res.json({ images });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
