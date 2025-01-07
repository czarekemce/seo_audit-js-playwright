const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Inicjalizacja dotenv
dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Serwowanie plików frontendowych
app.use(express.static(path.join(__dirname, 'public')));

// Funkcja wykonująca komendę
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

const updateEnvFile = async (url) => {
    const envPath = path.resolve(__dirname, '.env');
    const envContent = `URL=${url}\n`;
    await fs.writeFile(envPath, envContent, 'utf8'); 
    console.log(`Updated .env file with URL: ${url}`);
};

// POST do uruchamiania testów
app.post('/run-tests', async (req, res) => {
    const { url } = req.body;

    if (!url || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    await updateEnvFile(url);

    // Logowanie URL po stronie backendu
    console.log('Received URL:', url); 

    process.env.URL = url;

    async function updateEnvFile(url) {
        const envContent = `URL=${url}\n`;
        fs.writeFileSync('.env', envContent, 'utf8');  // Zapisanie do pliku .env
        console.log('Updated .env file with URL:', url);
        
        // Przeładowanie zmienne środowiskowe
        dotenv.config();  
    }

    try {
        // Zaktualizowanie pliku .env
        await updateEnvFile(url);

        // Uruchomienie testów
        console.log('Starting tests...');
        const { stdout, stderr } = await execPromise('npx playwright test --project=chromium');

        if (stderr) {
            console.error('Test execution error:', stderr);
            return res.status(500).json({ error: stderr });
        }

        res.json({
            results: stdout,
            url: url
        });

    } catch (error) {
        console.error('Test execution error:', error.message);
        return res.status(500).json({ error: error.message });
    }
});

// Start serwera
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
