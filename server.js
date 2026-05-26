/**
 * Quantum-Safe Microsite Local Server
 * Handles static files, form submissions to CSV, and analytics
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize CSV files if they don't exist
const leadsFile = path.join(DATA_DIR, 'leads.csv');
const analyticsFile = path.join(DATA_DIR, 'analytics.csv');

if (!fs.existsSync(leadsFile)) {
    fs.writeFileSync(leadsFile, 'timestamp,type,email,company,role,score,maturity,wants_call,interest,message\n');
}

if (!fs.existsSync(analyticsFile)) {
    fs.writeFileSync(analyticsFile, 'timestamp,event,page,referrer,user_id,metadata\n');
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.pdf': 'application/pdf'
};

// Escape CSV field
function escapeCSV(field) {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

// Append to CSV file
function appendToCSV(filePath, data) {
    const row = data.map(escapeCSV).join(',') + '\n';
    fs.appendFileSync(filePath, row);
}

// Parse POST body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 1e6) {
                req.destroy();
                reject(new Error('Body too large'));
            }
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

// Request handler
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // API endpoints
    if (pathname === '/api/lead' && req.method === 'POST') {
        try {
            const data = await parseBody(req);
            const timestamp = new Date().toISOString();

            appendToCSV(leadsFile, [
                timestamp,
                data.type || 'assessment',
                data.email || '',
                data.company || '',
                data.role || '',
                data.score || '',
                data.maturity || '',
                data.wants_call || false,
                data.interest || '',
                data.message || ''
            ]);

            console.log(`[LEAD] ${timestamp} - ${data.email} (${data.type})`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Lead captured' }));
        } catch (e) {
            console.error('Error saving lead:', e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
    }

    if (pathname === '/api/analytics' && req.method === 'POST') {
        try {
            const data = await parseBody(req);
            const timestamp = new Date().toISOString();

            appendToCSV(analyticsFile, [
                timestamp,
                data.event || 'pageview',
                data.page || '',
                data.referrer || '',
                data.user_id || '',
                JSON.stringify(data.metadata || {})
            ]);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
    }

    if (pathname === '/api/report' && req.method === 'POST') {
        try {
            const data = await parseBody(req);
            const timestamp = new Date().toISOString();

            // Create reports directory if it doesn't exist
            const reportsDir = path.join(DATA_DIR, 'reports');
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }

            // Save report data as JSON file
            const reportFileName = `report_${data.company.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`;
            const reportPath = path.join(reportsDir, reportFileName);

            const reportData = {
                timestamp,
                email: data.email,
                company: data.company,
                role: data.role,
                score: data.score,
                maturity: data.maturity,
                dimensions: data.dimensions,
                wants_call: data.wants_call
            };

            fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
            console.log(`[REPORT] ${timestamp} - ${data.email} - ${reportFileName}`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, report_file: reportFileName }));
        } catch (e) {
            console.error('Error saving report:', e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: e.message }));
        }
        return;
    }

    if (pathname === '/api/stats' && req.method === 'GET') {
        try {
            const leadsData = fs.readFileSync(leadsFile, 'utf-8');
            const analyticsData = fs.readFileSync(analyticsFile, 'utf-8');

            const leadsCount = leadsData.split('\n').length - 2; // minus header and empty line
            const pageviews = analyticsData.split('\n').filter(l => l.includes('pageview')).length;
            const assessments = analyticsData.split('\n').filter(l => l.includes('assessment_complete')).length;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                leads: Math.max(0, leadsCount),
                pageviews: pageviews,
                assessments: assessments
            }));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // Static file serving
    if (pathname === '/') pathname = '/index.html';

    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('Not Found: ' + pathname);
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║          Quantum-Safe Microsite Server Running            ║
╠═══════════════════════════════════════════════════════════╣
║  Local URL:    http://localhost:${PORT}                      ║
║  Data folder:  ./data/                                    ║
║  Leads CSV:    ./data/leads.csv                           ║
║  Analytics:    ./data/analytics.csv                       ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
