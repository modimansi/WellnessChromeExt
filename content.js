// Content Script for Wellness Extension
// This script runs on web pages and can be used for future enhancements

class WellnessContentScript {
    constructor() {
        this.init();
    }

    init() {
        this.setupMessageListener();
        this.monitorPageActivity();
    }

    setupMessageListener() {
        // Listen for messages from popup or background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'showWellnessTip') {
                this.showWellnessTip(request.tip);
                sendResponse({ success: true });
            } else if (request.action === 'checkPageStress') {
                this.checkPageStressIndicators();
                sendResponse({ success: true });
            }
        });
    }

    monitorPageActivity() {
        // Future enhancement: Monitor for stress indicators
        // For now, just log page activity
        let scrollCount = 0;
        let clickCount = 0;
        
        window.addEventListener('scroll', () => {
            scrollCount++;
            // Could detect rapid scrolling as stress indicator
        });

        window.addEventListener('click', () => {
            clickCount++;
            // Could detect rapid clicking as stress indicator
        });

        // Reset counters every minute
        setInterval(() => {
            scrollCount = 0;
            clickCount = 0;
        }, 60000);
    }

    showWellnessTip(tip) {
        // Create a non-intrusive wellness tip overlay
        const tipElement = document.createElement('div');
        tipElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            max-width: 300px;
            line-height: 1.4;
            animation: slideIn 0.3s ease-out;
        `;

        tipElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">🌿</span>
                <span>${tip}</span>
                <button style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; margin-left: auto;" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add animation keyframes
        if (!document.getElementById('wellness-tip-styles')) {
            const style = document.createElement('style');
            style.id = 'wellness-tip-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(tipElement);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (tipElement.parentElement) {
                tipElement.remove();
            }
        }, 5000);
    }

    checkPageStressIndicators() {
        // Future enhancement: Analyze page content for stress indicators
        // Could look for words like "deadline", "urgent", "stress", etc.
        const stressWords = ['deadline', 'urgent', 'stress', 'crisis', 'emergency', 'immediate', 'asap'];
        const bodyText = document.body.innerText.toLowerCase();
        
        const stressScore = stressWords.reduce((score, word) => {
            return score + (bodyText.split(word).length - 1);
        }, 0);

        if (stressScore > 5) {
            // High stress content detected
            chrome.runtime.sendMessage({
                action: 'highStressDetected',
                score: stressScore,
                url: window.location.href
            });
        }
    }

    // Eye strain detection (future enhancement)
    detectEyeStrain() {
        // Could monitor scroll speed, time spent on page, etc.
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            if (timeSpent > 30 * 60 * 1000) { // 30 minutes
                chrome.runtime.sendMessage({
                    action: 'longSessionDetected',
                    duration: timeSpent,
                    url: window.location.href
                });
            }
        });
    }
}

// Initialize content script
const wellnessContent = new WellnessContentScript();

// Export for potential use by other scripts
window.wellnessContent = wellnessContent; 