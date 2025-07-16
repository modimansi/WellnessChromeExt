// Wellness Break Assistant - Popup JavaScript

class WellnessExtension {
    constructor() {
        this.currentBreathingCycle = null;
        this.isBreathingActive = false;
        this.breathingInterval = null;
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupNatureConnection();
        this.setupJournaling();
        this.setupBreakReminders();
        this.setupBreathingExercises();
        this.setupHydrationTracker();
        this.setupGratitudePrompts();
        this.setupModals();
        this.loadSavedData();
    }

    // Tab Navigation
    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    // Nature Connection Feature
    setupNatureConnection() {
        const detectLocationBtn = document.getElementById('detect-location-btn');
        const natureBtn = document.getElementById('nature-break-btn');
        const locationStatus = document.getElementById('location-status');

        // Store user location data
        this.userLocation = null;
        this.userCity = null;

        detectLocationBtn.addEventListener('click', () => {
            this.detectUserLocation();
        });

        natureBtn.addEventListener('click', () => {
            this.findNearbyNature();
        });
    }

    async detectUserLocation() {
        const detectLocationBtn = document.getElementById('detect-location-btn');
        const natureBtn = document.getElementById('nature-break-btn');
        const locationStatus = document.getElementById('location-status');

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            this.displayLocationError('Geolocation is not supported by this browser');
            return;
        }

        // Update UI to show detecting state
        locationStatus.className = 'location-status detecting';
        locationStatus.innerHTML = '<p>🕐 Detecting your location...</p>';
        detectLocationBtn.disabled = true;
        detectLocationBtn.textContent = 'Detecting...';

        const options = {
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds timeout
            maximumAge: 300000 // Accept cached position up to 5 minutes old
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // Success callback
                this.userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };

                try {
                    // Reverse geocode to get city name
                    const cityData = await this.reverseGeocode(this.userLocation.lat, this.userLocation.lon);
                    this.userCity = cityData;

                    // Update UI to show success
                    locationStatus.className = 'location-status detected';
                    locationStatus.innerHTML = `
                        <p>✅ Location detected: ${cityData}</p>
                        <p style="font-size: 12px; margin-top: 4px; color: #888;">
                            Lat: ${this.userLocation.lat.toFixed(4)}, Lon: ${this.userLocation.lon.toFixed(4)}
                        </p>
                    `;

                    // Show the "Find Nature Nearby" button
                    detectLocationBtn.style.display = 'none';
                    natureBtn.style.display = 'block';

                } catch (error) {
                    console.error('Error reverse geocoding:', error);
                    // Still allow searching even if we can't get city name
                    this.userCity = 'Your Location';
                    
                    locationStatus.className = 'location-status detected';
                    locationStatus.innerHTML = `
                        <p>✅ Location detected successfully</p>
                        <p style="font-size: 12px; margin-top: 4px; color: #888;">
                            Lat: ${this.userLocation.lat.toFixed(4)}, Lon: ${this.userLocation.lon.toFixed(4)}
                        </p>
                    `;

                    detectLocationBtn.style.display = 'none';
                    natureBtn.style.display = 'block';
                }
            },
            (error) => {
                // Error callback
                detectLocationBtn.disabled = false;
                detectLocationBtn.textContent = '🗺️ Use My Location';

                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location permissions and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable. Please check your connection and try again.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred while retrieving location.';
                        break;
                }
                
                this.displayLocationError(errorMessage);
            },
            options
        );
    }

    async reverseGeocode(lat, lon) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.address) {
                const address = data.address;
                let cityName = address.city || address.town || address.village || address.municipality;
                
                if (cityName) {
                    const state = address.state || address.province;
                    const country = address.country;
                    
                    if (state && country === 'United States') {
                        return `${cityName}, ${state}`;
                    } else if (state) {
                        return `${cityName}, ${state}`;
                    } else if (country && country !== 'United States') {
                        return `${cityName}, ${country}`;
                    } else {
                        return cityName;
                    }
                } else {
                    // Fallback to using display_name
                    const parts = data.display_name.split(',');
                    return parts.slice(0, 2).join(',').trim();
                }
            }
            
            return 'Location Found';
        } catch (error) {
            console.error('Error in reverse geocoding:', error);
            return 'Your Location';
        }
    }

    displayLocationError(message) {
        const locationStatus = document.getElementById('location-status');
        locationStatus.className = 'location-status error';
        locationStatus.innerHTML = `<p>❌ ${message}</p>`;
    }

    async findNearbyNature() {
        const suggestionsContainer = document.getElementById('nature-suggestions');
        const loadingIndicator = document.getElementById('loading-indicator');
        
        if (!this.userLocation) {
            alert('Please detect your location first');
            return;
        }

        // Show loading indicator
        loadingIndicator.style.display = 'block';
        suggestionsContainer.style.display = 'none';
        
        try {
            // Find nature spots near the detected location
            const natureSpots = await this.findNatureSpotsNearby(
                this.userLocation.lat, 
                this.userLocation.lon, 
                this.userCity || 'Your Location'
            );
            
            loadingIndicator.style.display = 'none';
            
            if (natureSpots.length > 0) {
                this.displayNatureSuggestions(natureSpots);
            } else {
                this.displayNoResultsMessage(this.userCity || 'Your Location');
            }
        } catch (error) {
            console.error('Error finding nature spots:', error);
            loadingIndicator.style.display = 'none';
            this.displayLocationError(error.message);
        }
    }



    async findNatureSpotsNearby(lat, lon, city) {
        const natureSpots = [];
        
        // Define search queries for different types of nature spots
        const searchQueries = [
            { query: 'park', icon: '🌳', type: 'Park' },
            { query: 'garden', icon: '🌺', type: 'Garden' },
            { query: 'trail', icon: '🥾', type: 'Trail' },
            { query: 'forest', icon: '🌲', type: 'Forest' },
            { query: 'lake', icon: '🏞️', type: 'Lake' },
            { query: 'river', icon: '🌊', type: 'River' },
            { query: 'beach', icon: '🏖️', type: 'Beach' },
            { query: 'botanical garden', icon: '🌿', type: 'Botanical Garden' }
        ];

        try {
            // Search for each type of nature spot
            for (const searchType of searchQueries) {
                const spots = await this.searchPlacesOSM(lat, lon, searchType.query, searchType.type, searchType.icon);
                natureSpots.push(...spots);
            }

            // Remove duplicates and sort by distance
            const uniqueSpots = this.removeDuplicates(natureSpots);
            const sortedSpots = this.sortByDistance(uniqueSpots, lat, lon);
            
            // Return top 8 results
            return sortedSpots.slice(0, 8);
        } catch (error) {
            console.error('Error searching for nature spots:', error);
            return [];
        }
    }

    async searchPlacesOSM(lat, lon, query, type, icon) {
        try {
            const radius = 0.05; // Roughly 5km radius
            const bbox = `${lon - radius},${lat - radius},${lon + radius},${lat + radius}`;
            
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&bounded=1&viewbox=${bbox}&limit=10&extratags=1`
            );
            const data = await response.json();
            
            return data.map(place => ({
                name: place.display_name.split(',')[0],
                type: type,
                icon: icon,
                distance: this.calculateDistance(lat, lon, parseFloat(place.lat), parseFloat(place.lon)),
                description: this.generateDescription(type, place),
                lat: parseFloat(place.lat),
                lon: parseFloat(place.lon),
                address: place.display_name
            }));
        } catch (error) {
            console.error('Error searching OSM:', error);
            return [];
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3959; // Radius of the Earth in miles
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    removeDuplicates(spots) {
        const seen = new Set();
        return spots.filter(spot => {
            const key = `${spot.name.toLowerCase()}-${spot.type}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    sortByDistance(spots, centerLat, centerLon) {
        return spots.sort((a, b) => {
            const distA = this.calculateDistance(centerLat, centerLon, a.lat, a.lon);
            const distB = this.calculateDistance(centerLat, centerLon, b.lat, b.lon);
            return distA - distB;
        });
    }

    generateDescription(type, place) {
        const descriptions = {
            'Park': 'A great place for walking, relaxation, and connecting with nature',
            'Garden': 'Beautiful gardens perfect for peaceful contemplation',
            'Trail': 'Walking or hiking trail for outdoor exercise and fresh air',
            'Forest': 'Natural forest area for a deeper connection with nature',
            'Lake': 'Peaceful waterside location for reflection and tranquility',
            'River': 'Riverside area perfect for mindful walking and listening to water',
            'Beach': 'Sandy or rocky shoreline for ocean meditation and fresh air',
            'Botanical Garden': 'Curated plant collections for educational nature experiences'
        };
        
        return descriptions[type] || 'A natural location perfect for mindful breaks and reflection';
    }

    displayNatureSuggestions(suggestions) {
        const container = document.getElementById('nature-suggestions');
        container.innerHTML = '';
        
        suggestions.forEach(place => {
            const item = document.createElement('div');
            item.className = 'nature-item';
            
            const distance = place.distance ? `${place.distance.toFixed(1)} miles` : 'nearby';
            
            item.innerHTML = `
                <div class="nature-content">
                    <h4>${place.icon || '🌿'} ${place.name}</h4>
                    <p><strong>${place.type}</strong> • ${distance}</p>
                    <p>${place.description}</p>
                </div>
                <div class="nature-actions">
                    <button class="map-btn" data-lat="${place.lat}" data-lon="${place.lon}" data-name="${place.name}">
                        🗺️ View on Map
                    </button>
                    <button class="journal-btn">
                        📝 Journal Here
                    </button>
                </div>
            `;
            
            // Add click handler for "View on Map" button
            const mapBtn = item.querySelector('.map-btn');
            mapBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openGoogleMaps(place.lat, place.lon, place.name);
            });
            
            // Add click handler for "Journal Here" button
            const journalBtn = item.querySelector('.journal-btn');
            journalBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectNatureLocation(place);
            });
            
            container.appendChild(item);
        });
        
        container.style.display = 'block';
    }

    displayLocationError(message = 'Unable to find nature spots') {
        const container = document.getElementById('nature-suggestions');
        container.innerHTML = `
            <div class="nature-item">
                <h4>⚠️ ${message}</h4>
                <p>Please try a different city name or check your internet connection.</p>
            </div>
        `;
        container.style.display = 'block';
    }

    displayNoResultsMessage(city) {
        const container = document.getElementById('nature-suggestions');
        container.innerHTML = `
            <div class="nature-item">
                <h4>🔍 No results found for "${city}"</h4>
                <p>Try searching for a nearby larger city or check the spelling. You can also try terms like "New York, NY" or "Los Angeles, CA".</p>
            </div>
        `;
        container.style.display = 'block';
    }

    openGoogleMaps(lat, lon, placeName) {
        // Create Google Maps URL with coordinates
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
        
        // Alternative URL format with place name for better context
        // const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(placeName)}/@${lat},${lon},15z`;
        
        // Open in new tab
        chrome.tabs.create({ url: mapsUrl });
        
        // Show confirmation message
        this.showNotification(`Opening ${placeName} in Google Maps...`);
    }



    // Journaling System
    setupJournaling() {
        const saveBtn = document.getElementById('save-journal');
        saveBtn.addEventListener('click', () => {
            this.saveJournalEntry();
        });
    }

    selectNatureLocation(place) {
        const prompts = [
            `You're at ${place.name}. Write about a childhood memory of being in nature. What do you remember?`,
            `As you sit at ${place.name}, how do you feel connected to this land? What does it tell you?`,
            `Looking around ${place.name}, what in nature speaks to you today? Why?`,
            `Describe the sounds, smells, and sights at ${place.name}. How do they make you feel?`,
            `If you could have a conversation with the oldest tree at ${place.name}, what would you ask?`,
            `What lesson does ${place.name} teach you about peace and stillness?`,
            `Write about how visiting ${place.name} changes your perspective on your daily life.`
        ];

        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        document.getElementById('current-prompt').textContent = randomPrompt;
        
        // Store the selected location
        this.currentLocation = place;
    }

    async saveJournalEntry() {
        const entry = document.getElementById('journal-entry').value;
        const prompt = document.getElementById('current-prompt').textContent;
        
        if (!entry.trim()) {
            alert('Please write something before saving!');
            return;
        }

        const journalData = {
            date: new Date().toISOString(),
            location: this.currentLocation,
            prompt: prompt,
            entry: entry,
            timestamp: Date.now()
        };

        try {
            // Save to Chrome storage
            const result = await chrome.storage.local.get(['journalEntries']);
            const entries = result.journalEntries || [];
            entries.push(journalData);
            
            await chrome.storage.local.set({ journalEntries: entries });
            
            // Clear the form
            document.getElementById('journal-entry').value = '';
            document.getElementById('current-prompt').textContent = 'Entry saved! Select another location for a new prompt.';
            
            // Show success message
            this.showNotification('Journal entry saved successfully!');
        } catch (error) {
            console.error('Error saving journal entry:', error);
            alert('Error saving entry. Please try again.');
        }
    }

    // Break Reminders System
    setupBreakReminders() {
        const toggleBtn = document.getElementById('toggle-reminders');
        const intervalSelect = document.getElementById('break-interval');
        
        toggleBtn.addEventListener('click', () => {
            this.toggleBreakReminders();
        });

        intervalSelect.addEventListener('change', () => {
            this.updateBreakInterval();
        });

        // Check current reminder status
        this.checkReminderStatus();
    }

    async toggleBreakReminders() {
        const toggleBtn = document.getElementById('toggle-reminders');
        const isActive = toggleBtn.classList.contains('active');

        if (isActive) {
            // Disable reminders
            await chrome.alarms.clear('breakReminder');
            toggleBtn.classList.remove('active');
            toggleBtn.textContent = 'Enable Reminders';
            await chrome.storage.local.set({ breakRemindersEnabled: false });
        } else {
            // Enable reminders
            await this.createBreakAlarm();
            toggleBtn.classList.add('active');
            toggleBtn.textContent = 'Disable Reminders';
            await chrome.storage.local.set({ breakRemindersEnabled: true });
        }
    }

    async createBreakAlarm() {
        const interval = parseInt(document.getElementById('break-interval').value);
        await chrome.alarms.create('breakReminder', {
            delayInMinutes: interval,
            periodInMinutes: interval
        });
    }

    async updateBreakInterval() {
        const result = await chrome.storage.local.get(['breakRemindersEnabled']);
        if (result.breakRemindersEnabled) {
            await this.createBreakAlarm();
        }
    }

    async checkReminderStatus() {
        const result = await chrome.storage.local.get(['breakRemindersEnabled']);
        const toggleBtn = document.getElementById('toggle-reminders');
        
        if (result.breakRemindersEnabled) {
            toggleBtn.classList.add('active');
            toggleBtn.textContent = 'Disable Reminders';
        }
    }

    // Activity Modal Setup
    setupModals() {
        const activityBtns = document.querySelectorAll('.activity-btn');
        const modals = document.querySelectorAll('.modal');
        const closeBtns = document.querySelectorAll('.close');

        activityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const activity = btn.dataset.activity;
                this.openActivityModal(activity);
            });
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    openActivityModal(activity) {
        const modal = document.getElementById(`${activity}-modal`);
        if (modal) {
            modal.style.display = 'block';
            
            // Initialize activity-specific features
            if (activity === 'hydrate') {
                this.updateWaterCount();
            } else if (activity === 'gratitude') {
                this.showGratitudePrompt();
            }
        }
    }

    // Breathing Exercises
    setupBreathingExercises() {
        const startBtn = document.getElementById('start-breathing');
        const breathingType = document.getElementById('breathing-type');
        
        startBtn.addEventListener('click', () => {
            this.toggleBreathingExercise();
        });

        breathingType.addEventListener('change', () => {
            if (this.isBreathingActive) {
                this.stopBreathingExercise();
            }
        });
    }

    toggleBreathingExercise() {
        if (this.isBreathingActive) {
            this.stopBreathingExercise();
        } else {
            this.startBreathingExercise();
        }
    }

    startBreathingExercise() {
        const breathingType = document.getElementById('breathing-type').value;
        const startBtn = document.getElementById('start-breathing');
        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breathing-text');

        this.isBreathingActive = true;
        startBtn.textContent = 'Stop';
        
        // Define breathing patterns
        const patterns = {
            '478': {
                phases: [
                    { name: 'Inhale', duration: 4000, class: 'inhale' },
                    { name: 'Hold', duration: 7000, class: 'hold' },
                    { name: 'Exhale', duration: 8000, class: 'exhale' }
                ]
            },
            'box': {
                phases: [
                    { name: 'Inhale', duration: 4000, class: 'inhale' },
                    { name: 'Hold', duration: 4000, class: 'hold' },
                    { name: 'Exhale', duration: 4000, class: 'exhale' },
                    { name: 'Hold', duration: 4000, class: 'hold' }
                ]
            }
        };

        const pattern = patterns[breathingType];
        let currentPhase = 0;

        const runPhase = () => {
            if (!this.isBreathingActive) return;

            const phase = pattern.phases[currentPhase];
            text.textContent = phase.name;
            circle.className = `breathing-circle ${phase.class}`;

            setTimeout(() => {
                currentPhase = (currentPhase + 1) % pattern.phases.length;
                runPhase();
            }, phase.duration);
        };

        runPhase();
    }

    stopBreathingExercise() {
        this.isBreathingActive = false;
        const startBtn = document.getElementById('start-breathing');
        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breathing-text');

        startBtn.textContent = 'Start';
        circle.className = 'breathing-circle';
        text.textContent = 'Click to start';
    }

    // Hydration Tracker
    setupHydrationTracker() {
        const logBtn = document.getElementById('log-water');
        logBtn.addEventListener('click', () => {
            this.logWater();
        });
    }

    async logWater() {
        try {
            const result = await chrome.storage.local.get(['waterCount', 'lastWaterDate']);
            const today = new Date().toDateString();
            const lastDate = result.lastWaterDate;
            
            let waterCount = result.waterCount || 0;
            
            // Reset count if it's a new day
            if (lastDate !== today) {
                waterCount = 0;
            }
            
            waterCount++;
            
            await chrome.storage.local.set({
                waterCount: waterCount,
                lastWaterDate: today
            });
            
            this.updateWaterCount();
            this.showNotification(`Water logged! ${waterCount} glasses today`);
        } catch (error) {
            console.error('Error logging water:', error);
        }
    }

    async updateWaterCount() {
        try {
            const result = await chrome.storage.local.get(['waterCount', 'lastWaterDate']);
            const today = new Date().toDateString();
            const lastDate = result.lastWaterDate;
            
            let waterCount = result.waterCount || 0;
            
            // Reset count if it's a new day
            if (lastDate !== today) {
                waterCount = 0;
            }
            
            const countElement = document.getElementById('water-count');
            if (countElement) {
                countElement.textContent = waterCount;
            }
        } catch (error) {
            console.error('Error updating water count:', error);
        }
    }

    // Gratitude Prompts
    setupGratitudePrompts() {
        const saveBtn = document.getElementById('save-gratitude');
        saveBtn.addEventListener('click', () => {
            this.saveGratitudeReflection();
        });
    }

    showGratitudePrompt() {
        const prompts = [
            "What's one good thing right now?",
            "Who made you smile today?",
            "What's something you're looking forward to?",
            "What's a small pleasure you enjoyed recently?",
            "What's something about your work that you appreciate?",
            "What's something beautiful you noticed today?",
            "What's a skill you're grateful to have?",
            "What's something that made you laugh recently?",
            "What's something you love about your home?",
            "What's a memory that brings you joy?"
        ];

        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        document.getElementById('gratitude-prompt').textContent = randomPrompt;
        document.getElementById('gratitude-response').value = '';
    }

    async saveGratitudeReflection() {
        const response = document.getElementById('gratitude-response').value;
        const prompt = document.getElementById('gratitude-prompt').textContent;
        
        if (!response.trim()) {
            alert('Please write something before saving!');
            return;
        }

        const gratitudeData = {
            date: new Date().toISOString(),
            prompt: prompt,
            response: response,
            timestamp: Date.now()
        };

        try {
            const result = await chrome.storage.local.get(['gratitudeEntries']);
            const entries = result.gratitudeEntries || [];
            entries.push(gratitudeData);
            
            await chrome.storage.local.set({ gratitudeEntries: entries });
            
            this.showNotification('Gratitude reflection saved!');
            document.getElementById('gratitude-modal').style.display = 'none';
        } catch (error) {
            console.error('Error saving gratitude reflection:', error);
            alert('Error saving reflection. Please try again.');
        }
    }

    // Utility Functions
    showNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async loadSavedData() {
        // Load and display saved water count
        await this.updateWaterCount();
        
        // Load reminder status
        await this.checkReminderStatus();
    }
}

// Initialize the extension when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new WellnessExtension();
});