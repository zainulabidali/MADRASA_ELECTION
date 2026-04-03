// script.js - Core functionality & DB Wrapper

const DB_KEY = 'positions'; // Using consistent key requested by user

const db = {
    // Get all data from local storage
    getData: () => {
        try {
            const dataStr = localStorage.getItem(DB_KEY);
            if (dataStr) {
                const parsed = JSON.parse(dataStr);
                // Ensure safe parsing whether the data is an array or an object
                if (Array.isArray(parsed)) {
                    return { positions: parsed };
                } else if (parsed && Array.isArray(parsed.positions)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Error parsing localStorage data. Data might be corrupted.", e);
        }

        // Default Fallback
        const defaultData = [
            // {
            //     id: db.generateId(),
            //     title: "Madrasa Leader",
            //     candidates: [
            //         { id: db.generateId(), name: "Ali", photo: "", symbol: "", votes: 0 },
            //         { id: db.generateId(), name: "Hassan", photo: "", symbol: "", votes: 0 }
            //     ]
            // }
        ];
        db.saveData(defaultData);
        return { positions: defaultData };
    },

    // Save all data to local storage
    saveData: (data) => {
        try {
            // Normalize back to Array to strictly match user's expected data structure
            const dataToSave = (data && Array.isArray(data.positions)) ? data.positions : data;
            localStorage.setItem(DB_KEY, JSON.stringify(dataToSave));
        } catch (e) {
            console.error("Error saving to localStorage", e);
            alert("Storage quota exceeded or error saving data. Please check available space.");
        }
    },

    // Generate a short unique ID
    generateId: () => {
        return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    }
};

// Fullscreen toggle utility for EVM Kiosk Mode
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
            alert("Fullscreen mode is not supported by your browser or requires user interaction.");
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Convert image/file to Base64 String with compression for localStorage storage
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve('');
            return;
        }
        
        // Only process images
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Max width 300px
                const MAX_WIDTH = 300;
                if (width > MAX_WIDTH) {
                    height = Math.round((MAX_WIDTH / width) * height);
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to JPEG format with 0.70 compression quality
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.70);
                resolve(compressedDataUrl);
            };
            img.onerror = () => reject(new Error('Failed to load image for processing'));
            img.src = e.target.result;
        };
        reader.onerror = error => reject(error);
    });
}
