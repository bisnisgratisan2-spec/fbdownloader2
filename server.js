const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/api/getVideo', async (req, res) => {
  const videoPageUrl = req.query.url;
  if (!videoPageUrl) return res.status(400).json({ error: 'Missing url param' });

  try {
    const resp = await fetch(videoPageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html'
      }
    });

    const html = await resp.text();

    const patterns = [
      /"hd_src_no_ratelimit":"([^"]+)"/,
      /"hd_src":"([^"]+)"/,
      /"playable_url_quality_hd":"([^"]+)"/,
      /"playable_url":"([^"]+)"/,
      /"fallback_src":"([^"]+)"/
    ];

    let found = null;
    for (const p of patterns) {
      const m = html.match(p);
      if (m && m[1]) { found = m[1]; break; }
    }

    if (!found) return res.status(404).json({ error: 'Direct video URL not found.' });

    let url = found.replace(/\\//g, '/');
    return res.json({ videoUrl: url });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));