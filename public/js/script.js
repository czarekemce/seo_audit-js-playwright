let testInProgress = false;

document.getElementById('seo-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const url = document.getElementById('website-url').value.trim();
    const resultDiv = document.getElementById('seo-results');

    // Walidacja URL
    if (!url || !/^https?:\/\/.*/.test(url)) {
        resultDiv.innerHTML = '<p style="color: red;">Please enter a valid URL starting with http:// or https://</p>';
        return;
    }
    
    // Wyświetlanie ładowania
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingMessage = document.getElementById('loading-message');

    loadingOverlay.style.display = 'flex';  // Pokazuje overlay z komunikatem "Loading..."
    loadingMessage.innerHTML = 'Loading...'; // Zmiana tekstu na "Loading..."

    setTimeout(() => {
        loadingMessage.innerHTML = 'Almost ready...'; 
    }, 15000);  // Po 15 sekundach zmiana tekstu

    try {
        const response = await fetch('/run-tests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <h2>SEO Audit Results</h2>
                <p><strong>Page Title:</strong> ${data.title}</p>
                <p><strong>Meta Description:</strong> ${data.meta_description || 'No meta description found'}</p>
                <p><strong>Word Count:</strong> ${data.word_count}</p>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    } 
    finally {
        // Testy zakończone
        testInProgress = false;
        loadingOverlay.style.display = 'none'; // Ukryj overlay
    }
});
document.addEventListener('visibilitychange', function () {
    const loadingOverlay = document.getElementById('loading-overlay');

    if (document.visibilityState === 'hidden') {
        console.log('Tab is now hidden, hiding the loading overlay.');
        loadingOverlay.style.display = 'none'; // Ukryj overlay, jeśli użytkownik zmienia kartę
    } else if (document.visibilityState === 'visible' && testInProgress) {
        console.log('Tab is visible, showing the loading overlay again.');
        loadingOverlay.style.display = 'flex'; // Przywróć overlay, jeśli testy trwają
    }
});
