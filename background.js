// Background Service Worker for Wellness Extension

class WellnessBackground {
    constructor() {
        this.init();
    }

    init() {
        this.setupAlarmListeners();
        this.setupNotificationListeners();
        this.setupInstallListener();
    }

    setupAlarmListeners() {
        // Listen for break reminder alarms
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === 'breakReminder') {
                this.triggerBreakReminder();
            }
        });
    }

    setupNotificationListeners() {
        // Handle notification clicks
        chrome.notifications.onClicked.addListener((notificationId) => {
            if (notificationId.startsWith('break-reminder')) {
                this.handleBreakReminderClick();
            }
        });

        // Handle notification button clicks
        chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
            if (notificationId.startsWith('break-reminder')) {
                this.handleBreakReminderAction(buttonIndex);
            }
        });
    }

    setupInstallListener() {
        // Set up default values when extension is installed
        chrome.runtime.onInstalled.addListener(() => {
            chrome.storage.local.set({
                breakRemindersEnabled: false,
                waterCount: 0,
                lastWaterDate: new Date().toDateString(),
                journalEntries: [],
                gratitudeEntries: []
            });
        });
    }

    async triggerBreakReminder() {
        // Get random break activity
        const activities = [
            { name: 'Breathing Exercise', icon: '💨', action: 'breathe' },
            { name: 'Desk Stretches', icon: '🤸', action: 'stretch' },
            { name: 'Hydration Break', icon: '💧', action: 'hydrate' },
            { name: 'Gratitude Moment', icon: '🙏', action: 'gratitude' },
            { name: 'Rest Your Eyes', icon: '👀', action: 'eyes' },
            { name: 'Movement Break', icon: '🚶', action: 'move' }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];

        // Create notification
        const notificationId = `break-reminder-${Date.now()}`;
        
        try {
            await chrome.notifications.create(notificationId, {
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: '🌿 Time for a Wellness Break!',
                message: `${randomActivity.icon} ${randomActivity.name}`,
                buttons: [
                    { title: 'Take Break' },
                    { title: 'Snooze 10 min' }
                ],
                priority: 1
            });

            // Store the activity for later use
            await chrome.storage.local.set({ 
                lastBreakActivity: randomActivity.action 
            });
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    }

    handleBreakReminderClick() {
        // Open the extension popup
        chrome.action.openPopup();
    }

    async handleBreakReminderAction(buttonIndex) {
        if (buttonIndex === 0) {
            // Take Break - open popup
            chrome.action.openPopup();
        } else if (buttonIndex === 1) {
            // Snooze for 10 minutes
            await chrome.alarms.create('breakReminder', {
                delayInMinutes: 10
            });
        }
    }

    // Helper method to send gratitude reminders
    async sendGratitudeReminder() {
        const gratitudePrompts = [
            "What's one good thing right now?",
            "Who made you smile today?",
            "What's something you're looking forward to?",
            "What's a small pleasure you enjoyed recently?"
        ];

        const randomPrompt = gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)];

        try {
            await chrome.notifications.create(`gratitude-${Date.now()}`, {
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: '🙏 Gratitude Moment',
                message: randomPrompt,
                buttons: [{ title: 'Reflect' }],
                priority: 0
            });
        } catch (error) {
            console.error('Error creating gratitude notification:', error);
        }
    }

    // Random gratitude prompts (could be triggered by user or timer)
    async setupGratitudeTimer() {
        // Set up random gratitude reminders (2-3 times per day)
        const now = new Date();
        const morningTime = new Date(now);
        morningTime.setHours(10, 0, 0, 0);
        
        const afternoonTime = new Date(now);
        afternoonTime.setHours(15, 0, 0, 0);
        
        const eveningTime = new Date(now);
        eveningTime.setHours(19, 0, 0, 0);

        const times = [morningTime, afternoonTime, eveningTime];
        
        times.forEach((time, index) => {
            if (time > now) {
                const delay = Math.floor((time - now) / 1000 / 60);
                chrome.alarms.create(`gratitude-${index}`, {
                    delayInMinutes: delay,
                    periodInMinutes: 24 * 60 // Repeat daily
                });
            }
        });
    }
}

// Initialize the background service
const wellnessBackground = new WellnessBackground();

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'triggerBreakReminder') {
        wellnessBackground.triggerBreakReminder();
        sendResponse({ success: true });
    } else if (request.action === 'setupGratitudeTimer') {
        wellnessBackground.setupGratitudeTimer();
        sendResponse({ success: true });
    }
});

// Handle tab updates for potential break reminders
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Could implement smart break suggestions based on browsing activity
    if (changeInfo.status === 'complete' && tab.url) {
        // Future enhancement: analyze browsing patterns
    }
});

// Handle alarm for gratitude reminders
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith('gratitude-')) {
        wellnessBackground.sendGratitudeReminder();
    }
}); 