export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    const timestamp = new Date().toISOString();

    // Logged in Vercel Functions dashboard under the project
    console.log('[LEAD]', JSON.stringify({ timestamp, ...data }));

    return res.status(200).json({ success: true, message: 'Lead captured' });
  } catch (err) {
    console.error('[LEAD ERROR]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
