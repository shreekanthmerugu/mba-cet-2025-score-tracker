document.getElementById('file-upload').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const slot = document.getElementById('slot-selection').value;
    if (!slot) {
        alert('⚠️ Please select your Slot before uploading the file!');
        event.target.value = '';
        return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const htmlContent = e.target.result;
        parseHTML(htmlContent, slot);
    };
    reader.readAsText(file);
}

function parseHTML(htmlContent, slot) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    const span = doc.querySelector('span.hidden-sm.hidden-md');
    let applicationId = "-", name = "-";
    if (span) {
        const textContent = span.textContent.trim();
        [applicationId, name] = textContent.split(' - ').map(item => item.trim());
    }

    const rows = Array.from(doc.querySelectorAll('tbody tr'));
    let totalCorrect = 0;
    const totalQuestions = 200;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
            const optionsText = cells[2].innerText.trim();
            const correctOptionMatch = optionsText.match(/Correct Option:\s*(\d+)/);
            const candidateResponseMatch = optionsText.match(/Candidate Response:\s*(\d+)/);

            const correctOption = correctOptionMatch ? correctOptionMatch[1] : '-';
            const userOption = candidateResponseMatch ? candidateResponseMatch[1] : '-';

            const isCorrect = (correctOption === userOption) ? 'Yes' : 'No';
            if (isCorrect === 'Yes') totalCorrect++;
        }
    });

    const percentage = ((totalCorrect / totalQuestions) * 100).toFixed(2);

    document.getElementById('name').textContent = name;
    document.getElementById('appId').textContent = applicationId;
    document.getElementById('total-marks').textContent = `${totalCorrect}/200`;
    document.getElementById('percentage').textContent = `${percentage}%`;

    // ➡️ Automatically open Google Form with Prefilled Data
    openGoogleForm(name, applicationId, totalCorrect, percentage, slot);
}

function openGoogleForm(name, appId, totalCorrect, percentage, slot) {
    // Paste your own Google Form ID and Field Entry IDs below
    const formBaseURL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url';

    const params = new URLSearchParams({
        'entry.1111111111': name,         // Name Field
        'entry.2222222222': appId,         // Application ID Field
        'entry.3333333333': `${totalCorrect}/200`,  // Total Marks Field
        'entry.4444444444': `${percentage}%`,       // Percentage Field
        'entry.5555555555': slot            // Slot Field
    });

    const finalURL = `${formBaseURL}&${params.toString()}`;
    window.open(finalURL, '_blank');
}
