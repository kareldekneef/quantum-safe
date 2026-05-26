/**
 * Quantum-Safe Action Brief PDF Generator
 * Generates personalized PDF reports for assessment completions
 * Uses jsPDF directly for more reliable PDF generation
 */

// Load jsPDF library
(function() {
    if (!window.jspdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            console.log('jsPDF loaded successfully');
        };
        document.head.appendChild(script);
    }
})();

const PDFGenerator = {
    // Get next steps based on maturity level
    getNextSteps: function(maturity) {
        const steps = {
            'Unaware': [
                { step: 'Schedule a quantum risk awareness briefing for your security leadership', timeline: 'Within 30 days' },
                { step: 'Identify an owner for quantum-safe strategy exploration', timeline: 'Within 30 days' },
                { step: 'Begin documenting your cryptographic inventory starting with critical systems', timeline: 'Within 90 days' },
                { step: 'Review NIST PQC standards (FIPS 203, 204) at a high level', timeline: 'Within 60 days' },
                { step: 'Assess data sensitivity periods to understand your HNDL risk window', timeline: 'Within 90 days' }
            ],
            'Exploring': [
                { step: 'Complete a cryptographic inventory of your top 20 critical systems', timeline: 'Within 90 days' },
                { step: 'Classify data by sensitivity period and HNDL risk level', timeline: 'Within 60 days' },
                { step: 'Assign formal ownership of quantum-safe strategy to a senior leader', timeline: 'Within 30 days' },
                { step: 'Engage vendors to understand their PQC roadmaps', timeline: 'Within 90 days' },
                { step: 'Draft an initial PQC migration roadmap for leadership review', timeline: 'Within 120 days' }
            ],
            'Planning': [
                { step: 'Get leadership approval on your PQC migration roadmap', timeline: 'Within 60 days' },
                { step: 'Begin hybrid PQC pilot in a non-production environment', timeline: 'Within 90 days' },
                { step: 'Assess HSM and PKI upgrade requirements and timelines', timeline: 'Within 60 days' },
                { step: 'Include PQC requirements in vendor security questionnaires', timeline: 'Within 30 days' },
                { step: 'Develop a crypto agility improvement plan for key applications', timeline: 'Within 120 days' }
            ],
            'Executing': [
                { step: 'Expand hybrid PQC deployment to production systems', timeline: 'Within 180 days' },
                { step: 'Complete HSM and PKI upgrades for PQC support', timeline: 'Within 12 months' },
                { step: 'Establish regular board-level reporting on migration progress', timeline: 'Within 60 days' },
                { step: 'Conduct independent review of your PQC migration plan', timeline: 'Within 90 days' },
                { step: 'Develop incident response procedures for quantum-related scenarios', timeline: 'Within 120 days' }
            ],
            'Leading': [
                { step: 'Share your PQC journey with industry peers to elevate the ecosystem', timeline: 'Ongoing' },
                { step: 'Conduct regular reviews to ensure continued crypto agility', timeline: 'Quarterly' },
                { step: 'Monitor emerging quantum computing developments and adjust strategy', timeline: 'Ongoing' },
                { step: 'Ensure all new systems are deployed with PQC-ready architecture', timeline: 'Immediate' },
                { step: 'Plan for full phase-out of classical algorithms before 2035 deadline', timeline: 'Within 24 months' }
            ]
        };
        return steps[maturity] || steps['Unaware'];
    },

    // Convert hex color to RGB
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    },

    // Generate and download PDF using jsPDF
    generatePDF: function(data) {
        return new Promise((resolve, reject) => {
            try {
                // Wait for jsPDF to load
                const checkAndGenerate = (retries = 20) => {
                    if (window.jspdf && window.jspdf.jsPDF) {
                        this.createPDF(data);
                        resolve(true);
                    } else if (retries > 0) {
                        setTimeout(() => checkAndGenerate(retries - 1), 100);
                    } else {
                        reject(new Error('jsPDF library failed to load'));
                    }
                };
                checkAndGenerate();
            } catch (err) {
                console.error('PDF generation error:', err);
                reject(err);
            }
        });
    },

    createPDF: function(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        let y = margin;

        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Colors
        const primaryBlue = this.hexToRgb('#2563eb');
        const darkGray = this.hexToRgb('#1e293b');
        const mediumGray = this.hexToRgb('#64748b');
        const lightGray = this.hexToRgb('#f1f5f9');
        const maturityColor = this.hexToRgb(data.maturityColor);

        // === HEADER ===
        // Logo box
        doc.setFillColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
        doc.roundedRect(margin, y, 12, 12, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Q', margin + 6, y + 8, { align: 'center' });

        // Logo text
        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(16);
        doc.text('Quantum-Safe', margin + 16, y + 8);

        // Company and date (right side)
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(mediumGray.r, mediumGray.g, mediumGray.b);
        doc.text(`Prepared for: ${data.company}`, pageWidth - margin, y + 4, { align: 'right' });
        doc.text(today, pageWidth - margin, y + 9, { align: 'right' });

        y += 18;

        // Blue line under header
        doc.setDrawColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
        doc.setLineWidth(1);
        doc.line(margin, y, pageWidth - margin, y);

        y += 12;

        // === TITLE ===
        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Quantum-Safe Action Brief', margin, y);
        y += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(mediumGray.r, mediumGray.g, mediumGray.b);
        doc.text(`Personalized assessment results and recommendations for ${data.company}`, margin, y);
        y += 14;

        // === SCORE SECTION (Dark box) ===
        const scoreBoxHeight = 55;
        doc.setFillColor(darkGray.r, darkGray.g, darkGray.b);
        doc.roundedRect(margin, y, contentWidth, scoreBoxHeight, 3, 3, 'F');

        // Score circle
        const circleCenterX = pageWidth / 2;
        const circleCenterY = y + 22;
        const circleRadius = 16;

        // Circle border
        doc.setDrawColor(maturityColor.r, maturityColor.g, maturityColor.b);
        doc.setLineWidth(1.5);
        doc.circle(circleCenterX, circleCenterY, circleRadius, 'S');

        // Score number
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text(String(data.score), circleCenterX, circleCenterY + 4, { align: 'center' });

        // Maturity label
        doc.setTextColor(maturityColor.r, maturityColor.g, maturityColor.b);
        doc.setFontSize(16);
        doc.text(data.maturity, circleCenterX, y + 44, { align: 'center' });

        // Description (wrap text)
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(data.maturityDescription, contentWidth - 30);
        doc.text(descLines, circleCenterX, y + 50, { align: 'center', maxWidth: contentWidth - 30 });

        y += scoreBoxHeight + 12;

        // === DIMENSION SCORES ===
        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Scores by Dimension', margin, y);
        y += 2;

        // Underline
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 10;

        // Dimension bars
        const dimensions = Object.keys(data.dimensions);
        dimensions.forEach((key) => {
            const dim = data.dimensions[key];
            const barWidth = contentWidth - 70;
            const barHeight = 6;
            const fillWidth = Math.max(3, (dim.score / 100) * barWidth);

            // Label
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
            doc.text(dim.name, margin, y + 4);

            // Background bar
            doc.setFillColor(lightGray.r, lightGray.g, lightGray.b);
            doc.roundedRect(margin + 50, y, barWidth, barHeight, 1, 1, 'F');

            // Fill bar
            doc.setFillColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
            doc.roundedRect(margin + 50, y, fillWidth, barHeight, 1, 1, 'F');

            // Score value
            doc.setTextColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
            doc.setFont('helvetica', 'bold');
            doc.text(String(dim.score), pageWidth - margin, y + 4, { align: 'right' });

            y += 11;
        });

        y += 6;

        // === NEXT STEPS ===
        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Your Recommended Next Steps', margin, y);
        y += 2;

        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 10;

        const nextSteps = this.getNextSteps(data.maturity);
        nextSteps.forEach((step, i) => {
            // Check if we need a new page
            if (y > pageHeight - 40) {
                doc.addPage();
                y = margin;
            }

            // Step box background
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');

            // Blue left border
            doc.setFillColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
            doc.rect(margin, y, 1.5, 18, 'F');

            // Step number circle
            doc.setFillColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
            doc.circle(margin + 10, y + 9, 5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(String(i + 1), margin + 10, y + 11, { align: 'center' });

            // Step text
            doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            const stepLines = doc.splitTextToSize(step.step, contentWidth - 35);
            doc.text(stepLines, margin + 20, y + 7);

            // Timeline badge
            doc.setFillColor(226, 232, 240);
            const timelineWidth = doc.getTextWidth(step.timeline) + 6;
            doc.roundedRect(margin + 20, y + 11, timelineWidth, 5, 1, 1, 'F');
            doc.setTextColor(mediumGray.r, mediumGray.g, mediumGray.b);
            doc.setFontSize(7);
            doc.text(step.timeline, margin + 23, y + 14.5);

            y += 22;
        });

        // === PAGE 2: ROADMAP ===
        doc.addPage();
        y = margin;

        doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Migration Roadmap', margin, y);
        y += 2;

        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 12;

        // Roadmap box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, contentWidth, 70, 3, 3, 'F');

        // Three phases
        const phases = [
            { num: '1', title: 'Discovery & Planning', years: '2025-2026', color: '#2563eb', items: ['Cryptographic inventory', 'Data classification', 'Vendor assessment', 'Initial roadmap'] },
            { num: '2', title: 'Pilot & Validate', years: '2027-2030', color: '#06b6d4', items: ['Hybrid PQC pilots', 'Team training', 'PKI updates', 'Performance testing'] },
            { num: '3', title: 'Production Rollout', years: '2030-2035', color: '#10b981', items: ['Full PQC deployment', 'Phase out classical', 'Compliance achieved', 'Continuous monitoring'] }
        ];

        const phaseWidth = contentWidth / 3;
        phases.forEach((phase, i) => {
            const phaseX = margin + (i * phaseWidth) + (phaseWidth / 2);
            const phaseColor = this.hexToRgb(phase.color);

            // Phase circle
            doc.setFillColor(phaseColor.r, phaseColor.g, phaseColor.b);
            doc.circle(phaseX, y + 15, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(phase.num, phaseX, y + 18, { align: 'center' });

            // Phase title
            doc.setTextColor(darkGray.r, darkGray.g, darkGray.b);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(phase.title, phaseX, y + 30, { align: 'center' });

            // Years
            doc.setTextColor(mediumGray.r, mediumGray.g, mediumGray.b);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(phase.years, phaseX, y + 36, { align: 'center' });

            // Items
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            phase.items.forEach((item, j) => {
                doc.text('• ' + item, phaseX - 20, y + 44 + (j * 5));
            });
        });

        y += 78;

        // Regulatory box
        doc.setFillColor(254, 243, 199);
        doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
        doc.setFillColor(245, 158, 11);
        doc.rect(margin, y, 1.5, 22, 'F');

        doc.setTextColor(146, 64, 14);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Regulatory Milestones', margin + 8, y + 8);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('2028: UK discovery phase must begin  |  2030: US RSA-2048/ECC-256 deprecated  |  2035: Complete phase-out', margin + 8, y + 16);

        y += 32;

        // Contact box
        doc.setFillColor(primaryBlue.r, primaryBlue.g, primaryBlue.b);
        doc.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Ready to Accelerate Your Quantum-Safe Journey?', pageWidth / 2, y + 10, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Get expert guidance tailored to your organization\'s specific needs and timeline.', pageWidth / 2, y + 18, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Karel De Kneef | Strategic Cybersecurity Advisor', pageWidth / 2, y + 26, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.text('linkedin.com/in/kareldekneef', pageWidth / 2, y + 32, { align: 'center' });

        y += 45;

        // Footer
        doc.setTextColor(mediumGray.r, mediumGray.g, mediumGray.b);
        doc.setFontSize(8);
        doc.text('Generated by Quantum-Safe Readiness Assessment | karleefcyber.dekneef.be', pageWidth / 2, y, { align: 'center' });
        doc.setFont('helvetica', 'italic');
        doc.text('"Doing nothing is a decision too."', pageWidth / 2, y + 6, { align: 'center' });

        // Save the PDF
        const filename = `Quantum-Safe-Action-Brief-${data.company.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
        doc.save(filename);
    },

    // Save report data to server for record keeping
    saveReportData: function(data) {
        return fetch('/api/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                email: data.email,
                company: data.company,
                role: data.role,
                score: data.score,
                maturity: data.maturity,
                dimensions: data.dimensions,
                wants_call: data.wantsCall
            })
        })
        .then(res => res.json())
        .catch(err => console.error('Error saving report:', err));
    }
};

// Export for use
window.PDFGenerator = PDFGenerator;
