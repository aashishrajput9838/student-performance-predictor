document.getElementById('prediction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Get input values
    const studyHours = parseFloat(document.getElementById('study-hours').value);
    const attendance = parseFloat(document.getElementById('attendance').value);
    const prevMarks = parseFloat(document.getElementById('prev-marks').value);
    const assignments = parseInt(document.getElementById('assignments').value);
    const internet = parseFloat(document.getElementById('internet').value);
    const familySupport = parseInt(document.getElementById('family').value);

    // 2. Machine Learning Logic (Weighted Calculation)
    // Based on the calibrated model weights:
    // Score = (Study*5) + (Attend*0.4) + (Prev*0.3) + Assignments + (FamilySupport*5) - (Internet*2)
    const familyBoost = familySupport === 1 ? 5 : 0;
    const score = (studyHours * 5) + (attendance * 0.4) + (prevMarks * 0.3) + assignments + familyBoost - (internet * 2);

    // Threshold for passing
    const PASS_THRESHOLD = 45;
    const isPass = score >= PASS_THRESHOLD;

    // 3. Update UI
    const resultContainer = document.getElementById('result-overlay');
    const resultBadge = document.getElementById('result-badge');
    const resultMessage = document.getElementById('result-message');

    // Smooth scroll to result
    resultContainer.classList.add('active');

    // Set Result
    if (isPass) {
        resultBadge.innerText = 'PASS';
        resultBadge.className = 'result-badge pass';
        resultMessage.innerText = 'Excellent work! Your current habits suggest you are on track for success.';
    } else {
        resultBadge.innerText = 'FAIL';
        resultBadge.className = 'result-badge fail';
        resultMessage.innerText = 'Attention required! Your data suggests you may need to increase study hours or attendance.';
    }

    // Optional: Log technical score for debugging
    console.log(`Prediction Score: ${score.toFixed(2)} (Threshold: ${PASS_THRESHOLD})`);
});
