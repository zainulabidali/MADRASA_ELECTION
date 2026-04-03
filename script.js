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

// Convert image/file to Base64 String for localStorage storage
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve('');
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
