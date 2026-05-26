/* ===================================
   Quantum-Safe Readiness Microsite
   Interactive Games JavaScript
   =================================== */

// Data Sensitivity Game
document.addEventListener('DOMContentLoaded', function() {
    initSensitivityGame();
});

function initSensitivityGame() {
    const gameCards = document.getElementById('game-cards');
    const zoneSensitive = document.getElementById('zone-sensitive');
    const zoneNotSensitive = document.getElementById('zone-not-sensitive');
    const gameResults = document.getElementById('game-results');
    const resultsGrid = document.getElementById('results-grid');

    if (!gameCards || !zoneSensitive || !zoneNotSensitive) return;

    const cards = gameCards.querySelectorAll('.game-card');
    const zones = [zoneSensitive, zoneNotSensitive];
    let placedCards = 0;

    // Explanations for each data type
    const explanations = {
        patient: {
            sensitive: true,
            title: 'Patient Records',
            correct: 'Healthcare data has regulatory retention requirements (HIPAA: 6+ years) and contains PII that remains sensitive indefinitely.',
            incorrect: 'Patient records contain sensitive PII and are protected by HIPAA with long retention requirements. They remain sensitive well beyond 2035.'
        },
        ma: {
            sensitive: true,
            title: 'M&A Documents',
            correct: 'Merger and acquisition details often contain strategic information that remains competitive intelligence for decades.',
            incorrect: 'M&A documents reveal strategic decisions, valuations, and negotiations that competitors could exploit even years later.'
        },
        formula: {
            sensitive: true,
            title: 'R&D Formulas',
            correct: 'Trade secrets and intellectual property often have value for 20+ years, especially in pharma and manufacturing.',
            incorrect: 'Research formulas represent significant R&D investment and competitive advantage that persists for decades.'
        },
        logs: {
            sensitive: false,
            title: 'System Logs',
            correct: 'Most system logs lose relevance within 1-2 years and contain operational data rather than business secrets.',
            incorrect: 'System logs typically have short retention periods and limited long-term sensitivity, though some security logs may be exceptions.'
        },
        newsletter: {
            sensitive: false,
            title: 'Newsletters',
            correct: 'Marketing newsletters are designed for public consumption and have no long-term sensitivity.',
            incorrect: 'While newsletters may contain business updates, they are public communications without lasting sensitivity.'
        }
    };

    // Drag and Drop handlers
    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        // Touch support
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd);
    });

    zones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    let draggedCard = null;
    let touchStartX, touchStartY;
    let touchClone = null;

    function handleDragStart(e) {
        draggedCard = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.type);
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        zones.forEach(zone => zone.classList.remove('drag-over'));
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDragEnter(e) {
        this.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');

        if (draggedCard) {
            const zoneCards = this.querySelector('.zone-cards');
            const cardClone = draggedCard.cloneNode(true);
            cardClone.removeAttribute('draggable');
            cardClone.classList.remove('dragging');

            // Store the zone choice
            cardClone.dataset.placedZone = this.dataset.zone;

            zoneCards.appendChild(cardClone);
            draggedCard.remove();
            placedCards++;

            checkGameComplete();
        }
    }

    // Touch handlers for mobile
    function handleTouchStart(e) {
        e.preventDefault();
        draggedCard = this;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        touchClone = this.cloneNode(true);
        touchClone.style.position = 'fixed';
        touchClone.style.zIndex = '1000';
        touchClone.style.pointerEvents = 'none';
        touchClone.style.opacity = '0.8';
        touchClone.style.width = this.offsetWidth + 'px';
        document.body.appendChild(touchClone);
        updateTouchClonePosition(touch);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (touchClone) {
            const touch = e.touches[0];
            updateTouchClonePosition(touch);

            // Highlight drop zones
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            zones.forEach(zone => {
                if (zone.contains(elementBelow) || zone === elementBelow) {
                    zone.classList.add('drag-over');
                } else {
                    zone.classList.remove('drag-over');
                }
            });
        }
    }

    function handleTouchEnd(e) {
        if (touchClone) {
            document.body.removeChild(touchClone);
            touchClone = null;
        }

        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);

        zones.forEach(zone => {
            zone.classList.remove('drag-over');
            if (zone.contains(elementBelow) || zone === elementBelow) {
                const zoneCards = zone.querySelector('.zone-cards');
                const cardClone = draggedCard.cloneNode(true);
                cardClone.removeAttribute('draggable');
                cardClone.dataset.placedZone = zone.dataset.zone;

                // Remove touch event listeners from clone
                cardClone.style.touchAction = 'none';

                zoneCards.appendChild(cardClone);
                draggedCard.remove();
                placedCards++;

                checkGameComplete();
            }
        });
    }

    function updateTouchClonePosition(touch) {
        if (touchClone) {
            touchClone.style.left = (touch.clientX - touchClone.offsetWidth / 2) + 'px';
            touchClone.style.top = (touch.clientY - touchClone.offsetHeight / 2) + 'px';
        }
    }

    function checkGameComplete() {
        if (placedCards >= 5) {
            showResults();
        }
    }

    function showResults() {
        gameResults.classList.remove('hidden');
        resultsGrid.innerHTML = '';

        // Gather all placed cards
        const allPlacedCards = document.querySelectorAll('.zone-cards .game-card');

        allPlacedCards.forEach(card => {
            const type = card.dataset.type;
            const placedZone = card.dataset.placedZone;
            const data = explanations[type];

            const isCorrect = (placedZone === 'sensitive' && data.sensitive) ||
                              (placedZone === 'not-sensitive' && !data.sensitive);

            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${isCorrect ? 'correct' : 'incorrect'}`;
            resultItem.innerHTML = `
                <div class="result-icon">
                    ${isCorrect ?
                        '<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>' :
                        '<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>'
                    }
                </div>
                <div class="result-text">
                    <strong>${data.title}</strong>
                    <span>${isCorrect ? data.correct : data.incorrect}</span>
                </div>
            `;
            resultsGrid.appendChild(resultItem);
        });

        // Smooth scroll to results
        setTimeout(() => {
            gameResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}
