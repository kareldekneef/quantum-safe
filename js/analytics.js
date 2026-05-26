/**
 * Simple Analytics for Quantum-Safe Microsite
 * Tracks pageviews, events, and user journeys
 */

(function() {
    'use strict';

    const Analytics = {
        // Generate or retrieve user ID
        getUserId: function() {
            let userId = localStorage.getItem('qs_user_id');
            if (!userId) {
                userId = 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('qs_user_id', userId);
            }
            return userId;
        },

        // Get session ID (refreshes after 30 min inactivity)
        getSessionId: function() {
            const now = Date.now();
            let sessionData = JSON.parse(localStorage.getItem('qs_session') || '{}');

            if (!sessionData.id || (now - sessionData.lastActive) > 30 * 60 * 1000) {
                sessionData = {
                    id: 's_' + Date.now(),
                    started: now
                };
            }

            sessionData.lastActive = now;
            localStorage.setItem('qs_session', JSON.stringify(sessionData));

            return sessionData.id;
        },

        // Send event to server
        send: function(event, metadata = {}) {
            const data = {
                event: event,
                page: window.location.pathname,
                referrer: document.referrer,
                user_id: this.getUserId(),
                session_id: this.getSessionId(),
                metadata: {
                    ...metadata,
                    screen_width: window.innerWidth,
                    screen_height: window.innerHeight,
                    timestamp: Date.now()
                }
            };

            // Use sendBeacon for reliability (won't block page unload)
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/api/analytics', JSON.stringify(data));
            } else {
                // Fallback to fetch
                fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    keepalive: true
                }).catch(() => {}); // Silently fail
            }

            // Also log to console in development
            console.log('[Analytics]', event, metadata);
        },

        // Track page view
        pageview: function() {
            this.send('pageview', {
                title: document.title,
                path: window.location.pathname
            });
        },

        // Track custom event
        event: function(eventName, metadata = {}) {
            this.send(eventName, metadata);
        },

        // Track time on page
        trackTimeOnPage: function() {
            const startTime = Date.now();
            let maxScroll = 0;

            // Track scroll depth
            window.addEventListener('scroll', () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
                );
                maxScroll = Math.max(maxScroll, scrollPercent);
            });

            // Send on page unload
            window.addEventListener('beforeunload', () => {
                const timeOnPage = Math.round((Date.now() - startTime) / 1000);
                this.send('page_exit', {
                    time_on_page: timeOnPage,
                    max_scroll_depth: maxScroll
                });
            });
        },

        // Track outbound links
        trackOutboundLinks: function() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (link && link.hostname !== window.location.hostname) {
                    this.send('outbound_link', {
                        url: link.href,
                        text: link.textContent.trim().substring(0, 50)
                    });
                }
            });
        },

        // Track CTA clicks
        trackCTAClicks: function() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn, button, [data-track]');
                if (btn) {
                    const trackName = btn.dataset.track || btn.textContent.trim().substring(0, 30);
                    this.send('cta_click', {
                        text: trackName,
                        href: btn.href || null,
                        classes: btn.className
                    });
                }
            });
        },

        // Initialize all tracking
        init: function() {
            // Track pageview on load
            this.pageview();

            // Set up additional tracking
            this.trackTimeOnPage();
            this.trackOutboundLinks();
            this.trackCTAClicks();

            // Track assessment-specific events
            this.trackAssessmentProgress();

            console.log('[Analytics] Initialized for user:', this.getUserId());
        },

        // Assessment-specific tracking
        trackAssessmentProgress: function() {
            // Listen for custom events from assessment
            window.addEventListener('assessment_start', () => {
                this.send('assessment_start');
            });

            window.addEventListener('assessment_complete', (e) => {
                this.send('assessment_complete', {
                    score: e.detail?.score,
                    maturity: e.detail?.maturity
                });
            });

            window.addEventListener('assessment_question', (e) => {
                this.send('assessment_question', {
                    question: e.detail?.question,
                    dimension: e.detail?.dimension
                });
            });
        }
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Analytics.init());
    } else {
        Analytics.init();
    }

    // Expose globally for custom tracking
    window.QSAnalytics = Analytics;
})();
