// api/code.js
const MAP = {
  "ABC1234": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/ornek.json",
  "XYZ7890": "https://raw.githubusercontent.com/darkneslord19/shortener/main/pastes/test.json"
};

export default async function handler(req, res) {
  // CORS ayarları
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const code = url.searchParams.get('code');

    if (!code) {
      return res.status(400).json({ 
        error: "Kod gerekli",
        message: "Lütfen ?code=KOD şeklinde bir parametre gönderin"
      });
    }

    const targetUrl = MAP[code];

    if (!targetUrl) {
      return res.status(404).json({ 
        error: "Kod bulunamadı",
        message: `"${code}" kodu için eşleşen bir link bulunamadı`
      });
    }

    // Hedef URL'den veriyi çek
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "Hedef URL'den veri alınamadı",
        status: response.status
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Hatası:', error);
    return res.status(500).json({ 
      error: "Sunucu hatası",
      message: error.message 
    });
  }
}
