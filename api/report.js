export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = req.body;
    const timestamp = new Date().toISOString();
    const reportId = `${(data.company || 'unknown').replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;

    console.log('[REPORT]', JSON.stringify({ timestamp, reportId, ...data }));

    return res.status(200).json({ success: true, report_file: reportId });
  } catch (err) {
    console.error('[REPORT ERROR]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
}
