document.getElementById('file-upload').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const slot = document.getElementById('slot-selection').value;
    if (!slot) {
        alert('Please select your Slot before uploading the file!');
        // Reset file input so student is forced to select again after choosing slot
        event.target.value = '';
        return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const htmlContent = e.target.result;
        parseHTML(htmlContent, slot); // pass slot along
        showSubmitButton();
    };
    reader.readAsText(file);
}

function parseHTML(htmlContent, slot) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // (Your existing name, appId, table parsing code here...)

    // Save slot into hidden place so you can use it during Submit
    document.getElementById('submit-button').dataset.slot = slot;
}

// OPEN Google Form with all fields prefilled
function openGoogleForm() {
    const name = document.getElementById('name').textContent;
    const appId = document.getElementById('appId').textContent;
    const lrScore = document.getElementById('lr-score').textContent;
    const arScore = document.getElementById('ar-score').textContent;
    const qaScore = document.getElementById('qa-score').textContent;
    const vaScore = document.getElementById('va-score').textContent;
    const totalMarks = document.getElementById('total-marks').textContent;
    const percentage = document.getElementById('percentage').textContent;
    const slot = document.getElementById('submit-button').dataset.slot || '';

    const googleFormURL = `https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url
        &entry.123456=${encodeURIComponent(name)}
        &entry.654321=${encodeURIComponent(appId)}
        &entry.111111=${encodeURIComponent(lrScore)}
        &entry.222222=${encodeURIComponent(arScore)}
        &entry.333333=${encodeURIComponent(qaScore)}
        &entry.444444=${encodeURIComponent(vaScore)}
        &entry.555555=${encodeURIComponent(totalMarks)}
        &entry.666666=${encodeURIComponent(percentage)}
        &entry.777777=${encodeURIComponent(slot)}`;

    window.open(googleFormURL, '_blank');
}

function showSubmitButton() {
    document.getElementById('submit-button').style.display = 'inline-block';
}
