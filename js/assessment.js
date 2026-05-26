/* ===================================
   Quantum-Safe Readiness Assessment
   Assessment Logic & Questions
   =================================== */

// Assessment Questions
const questions = [
    // Dimension: Cryptographic Inventory
    {
        id: 1,
        dimension: 'inventory',
        dimensionName: 'Cryptographic Inventory',
        question: 'How well do you know where RSA, ECC, and other public-key cryptography is used in your organization?',
        helpText: 'This includes certificates, key management, digital signatures, and encrypted communications.',
        type: 'choice',
        options: [
            { value: 0, label: 'We have no visibility', description: 'We don\'t know where cryptography is used in our systems' },
            { value: 25, label: 'Ad-hoc awareness', description: 'Some teams know their own systems, but no central view' },
            { value: 50, label: 'Partial inventory', description: 'We\'ve documented major systems but gaps remain' },
            { value: 75, label: 'Comprehensive inventory', description: 'We have a complete inventory of cryptographic assets' },
            { value: 100, label: 'Automated discovery', description: 'We use tools to continuously discover and track crypto usage' }
        ]
    },
    {
        id: 2,
        dimension: 'inventory',
        dimensionName: 'Cryptographic Inventory',
        question: 'Do you have visibility into the cryptographic algorithms used by your third-party vendors and cloud services?',
        helpText: 'Consider SaaS applications, cloud infrastructure, and key business partners.',
        type: 'choice',
        options: [
            { value: 0, label: 'No visibility', description: 'We don\'t track vendor cryptography' },
            { value: 33, label: 'Limited visibility', description: 'We know critical vendors\' high-level approach' },
            { value: 66, label: 'Good visibility', description: 'We have documented crypto requirements in contracts' },
            { value: 100, label: 'Full visibility', description: 'We audit and verify vendor cryptographic practices' }
        ]
    },

    // Dimension: Data Lifetime & Sensitivity
    {
        id: 3,
        dimension: 'data',
        dimensionName: 'Data Lifetime & Sensitivity',
        question: 'What is the longest sensitivity period for data your organization handles?',
        helpText: 'Consider regulatory requirements, competitive value, and privacy obligations.',
        type: 'choice',
        options: [
            { value: 100, label: 'Less than 5 years', description: 'Our data loses sensitivity relatively quickly' },
            { value: 75, label: '5-10 years', description: 'Moderate long-term sensitivity' },
            { value: 50, label: '10-15 years', description: 'Significant long-term sensitivity requirements' },
            { value: 25, label: '15-25 years', description: 'Very long retention and sensitivity periods' },
            { value: 0, label: '25+ years', description: 'Indefinite sensitivity (healthcare, government, R&D)' }
        ]
    },
    {
        id: 4,
        dimension: 'data',
        dimensionName: 'Data Lifetime & Sensitivity',
        question: 'Have you classified your data based on sensitivity to the "Harvest Now, Decrypt Later" threat?',
        helpText: 'HNDL risk is highest for data that will still be sensitive when quantum computers mature.',
        type: 'choice',
        options: [
            { value: 0, label: 'No classification', description: 'We haven\'t considered quantum-specific risks' },
            { value: 33, label: 'Initial awareness', description: 'We\'re aware of the risk but haven\'t classified data' },
            { value: 66, label: 'Partial classification', description: 'We\'ve identified high-risk data categories' },
            { value: 100, label: 'Complete classification', description: 'All data is classified with quantum risk in mind' }
        ]
    },

    // Dimension: Governance & Ownership
    {
        id: 5,
        dimension: 'governance',
        dimensionName: 'Governance & Ownership',
        question: 'Who owns the quantum-safe strategy in your organization?',
        helpText: 'Clear ownership accelerates decision-making and resource allocation.',
        type: 'choice',
        options: [
            { value: 0, label: 'No owner', description: 'Nobody is responsible for quantum-safe strategy' },
            { value: 25, label: 'IT/Security interest', description: 'Technical teams are aware but no formal ownership' },
            { value: 50, label: 'CISO/CTO ownership', description: 'A senior technical leader owns the initiative' },
            { value: 75, label: 'Executive sponsorship', description: 'C-suite sponsor with dedicated team' },
            { value: 100, label: 'Board oversight', description: 'Board-level visibility and regular reporting' }
        ]
    },
    {
        id: 6,
        dimension: 'governance',
        dimensionName: 'Governance & Ownership',
        question: 'Does your organization have a documented post-quantum cryptography roadmap?',
        helpText: 'A roadmap helps coordinate migration efforts across teams and systems.',
        type: 'choice',
        options: [
            { value: 0, label: 'No roadmap', description: 'We haven\'t started planning' },
            { value: 25, label: 'Informal discussions', description: 'Some planning discussions but nothing documented' },
            { value: 50, label: 'Draft roadmap', description: 'Initial roadmap exists but not approved' },
            { value: 75, label: 'Approved roadmap', description: 'Formal roadmap approved by leadership' },
            { value: 100, label: 'Executing roadmap', description: 'We\'re actively executing our PQC migration plan' }
        ]
    },

    // Dimension: Vendor / HSM / PKI
    {
        id: 7,
        dimension: 'infrastructure',
        dimensionName: 'Infrastructure Readiness',
        question: 'Are your Hardware Security Modules (HSMs) capable of supporting post-quantum algorithms?',
        helpText: 'HSMs are critical for key management and may need upgrades for PQC support.',
        type: 'choice',
        options: [
            { value: 0, label: 'Unknown', description: 'We don\'t know our HSM capabilities' },
            { value: 25, label: 'Not capable', description: 'Our HSMs don\'t support PQC algorithms' },
            { value: 50, label: 'Upgrade planned', description: 'We have a plan to upgrade to PQC-capable HSMs' },
            { value: 75, label: 'Partially capable', description: 'Some HSMs support PQC, others need upgrading' },
            { value: 100, label: 'Fully capable', description: 'All HSMs support NIST-approved PQC algorithms' }
        ]
    },
    {
        id: 8,
        dimension: 'infrastructure',
        dimensionName: 'Infrastructure Readiness',
        question: 'Can your PKI (Public Key Infrastructure) support hybrid or post-quantum certificates?',
        helpText: 'PKI changes are often the longest lead-time item in PQC migration.',
        type: 'choice',
        options: [
            { value: 0, label: 'Unknown', description: 'We haven\'t assessed our PKI\'s capabilities' },
            { value: 25, label: 'Not ready', description: 'Our PKI cannot support PQC certificates' },
            { value: 50, label: 'Assessment complete', description: 'We know what needs to change' },
            { value: 75, label: 'Upgrade in progress', description: 'We\'re actively upgrading our PKI' },
            { value: 100, label: 'PQC ready', description: 'Our PKI can issue hybrid or PQC certificates' }
        ]
    },

    // Dimension: Crypto Agility
    {
        id: 9,
        dimension: 'agility',
        dimensionName: 'Crypto Agility',
        question: 'How easily can you change cryptographic algorithms in your applications without major code changes?',
        helpText: 'Crypto agility enables faster migration and response to algorithm vulnerabilities.',
        type: 'choice',
        options: [
            { value: 0, label: 'Hardcoded everywhere', description: 'Algorithms are embedded throughout code' },
            { value: 25, label: 'Mostly hardcoded', description: 'Some abstraction but major changes needed' },
            { value: 50, label: 'Partial abstraction', description: 'Critical systems use configurable crypto' },
            { value: 75, label: 'Good abstraction', description: 'Most systems use crypto libraries/frameworks' },
            { value: 100, label: 'Fully agile', description: 'Algorithms can be swapped via configuration' }
        ]
    },
    {
        id: 10,
        dimension: 'agility',
        dimensionName: 'Crypto Agility',
        question: 'Do you use standardized cryptographic libraries that are being updated for PQC?',
        helpText: 'Libraries like OpenSSL, BoringSSL, and language-specific crypto libraries are adding PQC support.',
        type: 'choice',
        options: [
            { value: 0, label: 'Custom/Legacy', description: 'We use custom or outdated cryptographic implementations' },
            { value: 33, label: 'Mixed', description: 'Some standard libraries, some legacy code' },
            { value: 66, label: 'Mostly standardized', description: 'We primarily use maintained libraries' },
            { value: 100, label: 'Fully standardized', description: 'All crypto uses current, maintained libraries' }
        ]
    },

    // Dimension: PQC Pilots & Experiments
    {
        id: 11,
        dimension: 'progress',
        dimensionName: 'PQC Progress',
        question: 'Have you run any post-quantum cryptography pilots or experiments?',
        helpText: 'Hands-on experience helps teams understand performance impacts and integration challenges.',
        type: 'choice',
        options: [
            { value: 0, label: 'No experimentation', description: 'We haven\'t explored PQC practically' },
            { value: 25, label: 'Research only', description: 'We\'ve read about PQC but no hands-on work' },
            { value: 50, label: 'Lab testing', description: 'We\'ve tested PQC in isolated environments' },
            { value: 75, label: 'Limited pilot', description: 'We\'ve piloted PQC in non-production systems' },
            { value: 100, label: 'Production pilot', description: 'We\'re running PQC or hybrid in production' }
        ]
    },
    {
        id: 12,
        dimension: 'progress',
        dimensionName: 'PQC Progress',
        question: 'Has your security team received training on post-quantum cryptography?',
        helpText: 'PQC introduces new concepts (lattices, hash-based signatures) that teams need to understand.',
        type: 'choice',
        options: [
            { value: 0, label: 'No training', description: 'Team has no PQC knowledge' },
            { value: 33, label: 'Self-study', description: 'Some individuals have learned independently' },
            { value: 66, label: 'Formal training', description: 'Team has received structured PQC training' },
            { value: 100, label: 'Expert level', description: 'Team has deep PQC expertise and ongoing learning' }
        ]
    }
];

// Maturity levels based on score
const maturityLevels = [
    { min: 0, max: 20, label: 'Unaware', color: '#ef4444', description: 'Your organization has not yet begun addressing quantum risks. Immediate action is recommended to understand your exposure.' },
    { min: 21, max: 40, label: 'Exploring', color: '#f59e0b', description: 'You\'re aware of quantum threats but lack formal planning. It\'s time to build your cryptographic inventory and roadmap.' },
    { min: 41, max: 60, label: 'Planning', color: '#3b82f6', description: 'You have some foundations in place. Focus on formalizing your strategy and beginning pilot projects.' },
    { min: 61, max: 80, label: 'Executing', color: '#06b6d4', description: 'You\'re making good progress on your quantum-safe journey. Continue executing and expand your migration scope.' },
    { min: 81, max: 100, label: 'Leading', color: '#10b981', description: 'Your organization is well-positioned for the quantum transition. Focus on continuous improvement and vendor alignment.' }
];

// Next steps based on maturity
const nextStepsTemplates = {
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

// State
let currentQuestion = 0;
let answers = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderQuestion(currentQuestion);
    setupNavigation();
});

function renderQuestion(index) {
    const container = document.getElementById('questions-container');
    const question = questions[index];

    let optionsHTML = '';
    question.options.forEach((option, i) => {
        const isSelected = answers[question.id] === option.value;
        optionsHTML += `
            <div class="answer-option ${isSelected ? 'selected' : ''}" data-value="${option.value}" onclick="selectAnswer(${question.id}, ${option.value}, this)">
                <div class="answer-radio"></div>
                <div class="answer-content">
                    <div class="answer-label">${option.label}</div>
                    <div class="answer-description">${option.description}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="question-card">
            <span class="question-number">${question.dimensionName}</span>
            <h2 class="question-text">${question.question}</h2>
            <p class="question-help">${question.helpText}</p>
            <div class="answer-options">
                ${optionsHTML}
            </div>
        </div>
    `;

    updateProgress();
    updateNavButtons();
}

function selectAnswer(questionId, value, element) {
    answers[questionId] = value;

    // Update UI
    document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');

    // Auto-advance after short delay
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            renderQuestion(currentQuestion);
        }
    }, 300);
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-step').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

    const remaining = Math.ceil((questions.length - currentQuestion - 1) * 0.7);
    document.getElementById('progress-time').textContent = remaining > 0 ? `~${remaining} minutes remaining` : 'Almost done!';
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {
        nextBtn.innerHTML = `
            View Results
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        `;
    } else {
        nextBtn.innerHTML = `
            Next
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        `;
    }
}

function setupNavigation() {
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion(currentQuestion);
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            renderQuestion(currentQuestion);
        } else {
            showResults();
        }
    });
}

function calculateResults() {
    // Calculate overall score
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions === 0) {
        return { overallScore: 0, dimensions: {}, maturity: maturityLevels[0] };
    }

    let totalScore = 0;
    const dimensions = {};

    questions.forEach(q => {
        const answer = answers[q.id] !== undefined ? answers[q.id] : 0;
        totalScore += answer;

        if (!dimensions[q.dimension]) {
            dimensions[q.dimension] = {
                name: q.dimensionName,
                scores: [],
                total: 0
            };
        }
        dimensions[q.dimension].scores.push(answer);
    });

    const overallScore = Math.round(totalScore / totalQuestions);

    // Calculate dimension averages
    Object.keys(dimensions).forEach(key => {
        const dim = dimensions[key];
        dim.score = Math.round(dim.scores.reduce((a, b) => a + b, 0) / dim.scores.length);
    });

    // Determine maturity level
    const maturity = maturityLevels.find(m => overallScore >= m.min && overallScore <= m.max) || maturityLevels[0];

    return { overallScore, dimensions, maturity };
}

function showResults() {
    const results = calculateResults();

    // Hide assessment elements
    document.getElementById('assessment-header').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('questions-container').style.display = 'none';
    document.getElementById('assessment-nav').style.display = 'none';

    // Show results
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.classList.remove('hidden');

    // Calculate stroke dashoffset for score ring
    const circumference = 2 * Math.PI * 90; // radius = 90
    const offset = circumference - (results.overallScore / 100) * circumference;

    // Get next steps based on maturity
    const nextSteps = nextStepsTemplates[results.maturity.label] || nextStepsTemplates['Unaware'];

    resultsContainer.innerHTML = `
        <div class="results-container">
            <div class="results-header">
                <h1>Your Quantum Readiness Results</h1>
                <p>Based on your responses, here's your organization's quantum-safe readiness profile.</p>
            </div>

            <div class="score-display">
                <div class="score-circle">
                    <svg viewBox="0 0 200 200">
                        <circle class="score-ring-bg" cx="100" cy="100" r="90"/>
                        <circle class="score-ring" cx="100" cy="100" r="90" style="stroke-dashoffset: ${offset}; stroke: ${results.maturity.color}"/>
                    </svg>
                    <div class="score-number">${results.overallScore}</div>
                </div>
                <div class="score-label" style="color: ${results.maturity.color}">${results.maturity.label}</div>
                <p class="score-description">${results.maturity.description}</p>
            </div>

            <div class="dimension-scores">
                <h2>Scores by Dimension</h2>
                <div class="dimension-grid">
                    ${Object.keys(results.dimensions).map(key => {
                        const dim = results.dimensions[key];
                        return `
                            <div class="dimension-item">
                                <div class="dimension-header">
                                    <span class="dimension-name">${dim.name}</span>
                                    <span class="dimension-score">${dim.score}/100</span>
                                </div>
                                <div class="dimension-bar">
                                    <div class="dimension-fill" style="width: ${dim.score}%"></div>
                                </div>
                                <p class="dimension-description">${getDimensionFeedback(key, dim.score)}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="next-steps">
                <h2>Your Recommended Next Steps</h2>
                <div class="steps-list">
                    ${nextSteps.map((step, i) => `
                        <div class="step-item">
                            <div class="step-number">${i + 1}</div>
                            <div class="step-content">
                                <h4>${step.step}</h4>
                                <span class="step-timeline">${step.timeline}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="lead-capture">
                <h2>Get Your Quantum-Safe Action Brief</h2>
                <p>Receive a personalized PDF with your scores, detailed recommendations, and a visual roadmap to share with your team.</p>
                <form class="lead-form" id="lead-form" onsubmit="handleLeadSubmit(event)">
                    <div class="form-group">
                        <input type="email" class="form-input" placeholder="Work email" required id="lead-email">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" placeholder="Company name" required id="lead-company">
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-input" placeholder="Your role" required id="lead-role">
                    </div>
                    <div class="form-checkbox">
                        <input type="checkbox" id="lead-call">
                        <label for="lead-call">I'd also like to book a 30-minute strategy call with Karel</label>
                    </div>
                    <button type="submit" class="btn btn-primary btn-lg">
                        Download Action Brief
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                    </button>
                    <p class="form-note">We respect your privacy. No spam, just your personalized action brief.</p>
                </form>
            </div>
        </div>
    `;

    // Animate score ring after render
    setTimeout(() => {
        const ring = document.querySelector('.score-ring');
        if (ring) {
            ring.style.strokeDashoffset = offset;
        }
    }, 100);
}

function getDimensionFeedback(dimension, score) {
    const feedback = {
        inventory: {
            low: 'You need to build visibility into where cryptography is used across your organization.',
            medium: 'You have some visibility but should expand your cryptographic inventory.',
            high: 'Strong cryptographic visibility positions you well for migration planning.'
        },
        data: {
            low: 'Understanding your data\'s sensitivity timeline is critical for prioritizing migration.',
            medium: 'Continue classifying data to understand your full HNDL risk exposure.',
            high: 'Good data classification will help you prioritize your PQC migration.'
        },
        governance: {
            low: 'Assign clear ownership and develop a formal quantum-safe strategy.',
            medium: 'Strengthen governance with executive sponsorship and a documented roadmap.',
            high: 'Strong governance foundation supports effective execution.'
        },
        infrastructure: {
            low: 'Assess your HSM and PKI capabilities to understand upgrade requirements.',
            medium: 'Continue planning infrastructure upgrades for PQC support.',
            high: 'Your infrastructure is well-positioned for PQC migration.'
        },
        agility: {
            low: 'Improving crypto agility should be a priority to enable future algorithm changes.',
            medium: 'Continue building abstraction layers to improve crypto agility.',
            high: 'Strong crypto agility will accelerate your PQC transition.'
        },
        progress: {
            low: 'Start with PQC education and small-scale experiments.',
            medium: 'Expand your pilots and deepen team expertise.',
            high: 'Your hands-on progress puts you ahead of most organizations.'
        }
    };

    const level = score < 40 ? 'low' : score < 70 ? 'medium' : 'high';
    return feedback[dimension]?.[level] || '';
}

function handleLeadSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('lead-email').value;
    const company = document.getElementById('lead-company').value;
    const role = document.getElementById('lead-role').value;
    const wantsCall = document.getElementById('lead-call').checked;

    const results = calculateResults();

    // Prepare lead data
    const leadData = {
        type: 'assessment',
        email,
        company,
        role,
        wants_call: wantsCall,
        score: results.overallScore,
        maturity: results.maturity.label
    };

    // Save to server CSV
    fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Lead saved:', data);
    })
    .catch(err => {
        console.error('Error saving lead:', err);
    });

    // Track analytics event
    if (window.QSAnalytics) {
        window.QSAnalytics.event('assessment_complete', {
            score: results.overallScore,
            maturity: results.maturity.label
        });
    }

    // Prepare PDF data
    const pdfData = {
        email: email,
        company: company,
        role: role,
        score: results.overallScore,
        maturity: results.maturity.label,
        maturityColor: results.maturity.color,
        maturityDescription: results.maturity.description,
        dimensions: results.dimensions,
        wantsCall: wantsCall
    };

    // Show generating message
    const form = document.getElementById('lead-form');
    form.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="loading-spinner" style="margin: 0 auto 1rem; width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.3); border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <h3 style="color: white; margin-bottom: 0.5rem;">Generating Your Action Brief...</h3>
            <p style="opacity: 0.9;">Your personalized PDF is being prepared.</p>
        </div>
        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;

    // Generate PDF (wait for jsPDF library to load if needed)
    const generatePDFWithRetry = (retries = 20) => {
        if (window.jspdf && window.PDFGenerator) {
            // Save report data to server
            window.PDFGenerator.saveReportData(pdfData);

            // Generate and download PDF
            window.PDFGenerator.generatePDF(pdfData)
                .then(success => {
                    // Show success message
                    form.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#10b981" stroke-width="2" style="margin-bottom: 1rem;">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                                <path d="M22 4L12 14.01l-3-3"/>
                            </svg>
                            <h3 style="color: white; margin-bottom: 0.5rem;">Your Action Brief is Ready!</h3>
                            <p style="opacity: 0.9;">Your PDF has been downloaded. Share it with your team to start your quantum-safe journey.</p>
                            ${wantsCall ? '<p style="opacity: 0.9; margin-top: 1rem;">We\'ll also be in touch to schedule your strategy call.</p>' : ''}
                            <a href="services.html" class="btn btn-primary" style="margin-top: 1.5rem;">
                                Explore Our Services
                            </a>
                        </div>
                    `;
                })
                .catch(err => {
                    console.error('PDF generation error:', err);
                    form.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#f59e0b" stroke-width="2" style="margin-bottom: 1rem;">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <h3 style="color: white; margin-bottom: 0.5rem;">PDF Download Issue</h3>
                            <p style="opacity: 0.9;">We've saved your results. Please try downloading again or contact us for your action brief.</p>
                            ${wantsCall ? '<p style="opacity: 0.9; margin-top: 1rem;">We\'ll be in touch to schedule your strategy call.</p>' : ''}
                            <a href="services.html" class="btn btn-primary" style="margin-top: 1.5rem;">
                                Contact Us
                            </a>
                        </div>
                    `;
                });
        } else if (retries > 0) {
            // Wait for library to load
            setTimeout(() => generatePDFWithRetry(retries - 1), 200);
        } else {
            // Fallback if library fails to load
            form.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="#10b981" stroke-width="2" style="margin-bottom: 1rem;">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                        <path d="M22 4L12 14.01l-3-3"/>
                    </svg>
                    <h3 style="color: white; margin-bottom: 0.5rem;">Results Saved!</h3>
                    <p style="opacity: 0.9;">We've captured your assessment results. We'll send your personalized Action Brief to ${email}.</p>
                    ${wantsCall ? '<p style="opacity: 0.9; margin-top: 1rem;">We\'ll also be in touch to schedule your strategy call.</p>' : ''}
                    <a href="services.html" class="btn btn-primary" style="margin-top: 1.5rem;">
                        Explore Our Services
                    </a>
                </div>
            `;
        }
    };

    generatePDFWithRetry();
}
