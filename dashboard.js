// dashboard.js (Final Version with Alert Test)

alert("NEW FILE LOADED!"); // If you see this, the file has been successfully updated.

// --- SUPABASE CLIENT SETUP ---
const SUPABASE_URL = 'https://wditvvizexcwtkzllltn.supabase.com';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- CORE FUNCTIONS ---

function displayStylistInfo(stylist) {
    const stylistNameEl = document.getElementById('stylist-name');
    if (stylistNameEl) {
        stylistNameEl.textContent = stylist.stylist_name;
    }
}

async function displayAppointments(stylistId) {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '<div class="loading-spinner"></div>';

    const { data, error } = await client
        .from('appointments')
        .select('*')
        .eq('stylist_id', stylistId)
        .order('appointment_time', { ascending: true });

    if (error) {
        appointmentList.innerHTML = '<p>Error loading appointments.</p>';
        console.error('Error fetching appointments:', error);
        return;
    }

    appointmentList.innerHTML = '';
    if (data.length === 0) {
        appointmentList.innerHTML = '<p>No appointments scheduled for today.</p>';
    } else {
        data.forEach(appt => {
            const card = document.createElement('div');
            card.className = 'appointment-card';
            card.innerHTML = `
                <div class="appointment-time">${new Date('1970-01-01T' + appt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div class="appointment-details">
                    <h3>${appt.client_name}</h3>
                    <p>${appt.service_name}</p>
                </div>
            `;
            card.addEventListener('click', () => {
                window.location.href = `checklist.html?appointmentId=${appt.appointment_id}`;
            });
            appointmentList.appendChild(card);
        });
    }
}

function initializeDashboard() {
    const loggedInStylist = JSON.parse(localStorage.getItem('loggedInStylist'));
    if (!loggedInStylist) {
        window.location.href = 'index.html';
        return;
    }
    displayStylistInfo(loggedInStylist);
    displayAppointments(loggedInStylist.stylist_id);
    initializeKpiDials();
}

// --- KPI DIAL LOGIC ---

function initializeKpiDials() {
    const kpiData = {
        avg_service: { label: "Avg. Service", current: 125, target: 140, format: 'dollar' },
        avg_retail: { label: "Avg. Retail", current: 42, target: 65, format: 'dollar' },
        rebook: { label: "Rebook %", current: 85, target: 92, format: 'percent' },
        productivity: { label: "Productivity %", current: 93, target: 98, format: 'percent' }
    };
    const container = document.getElementById('kpi-summary-container');
    if (!container) return;
    container.innerHTML = '';
    for (const data of Object.values(kpiData)) {
        container.appendChild(createKpiDial(data));
    }
}

function createKpiDial(data) {
    const card = document.createElement('div');
    card.className = 'kpi-card-summary';
    card.innerHTML = `
        <div class="kpi-dial-container-summary">
            <svg class="kpi-dial-svg" viewBox="0 0 100 100">
                <circle class="kpi-dial-track" cx="50" cy="50" r="45"></circle>
                <circle class="kpi-dial-progress" cx="50" cy="50" r="45"></circle>
            </svg>
            <div class="kpi-value-container">
                <div class="kpi-current-value-summary">0</div>
            </div>
        </div>
        <div class="kpi-label">${data.label}</div>
    `;
    const progressCircle = card.querySelector('.kpi-dial-progress');
    const currentValueEl = card.querySelector('.kpi-current-value-summary');
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * (240 / 360);
    const progressPercentage = Math.min((data.current / data.target) * 100, 100);
    const offset = arcLength - (progressPercentage / 100) * arcLength;
    card.querySelector('.kpi-dial-track').setAttribute('stroke-dasharray', `${arcLength} ${circumference}`);
    progressCircle.setAttribute('stroke-dasharray', `${arcLength} ${circumference}`);
    progressCircle.setAttribute('stroke-dashoffset', arcLength);
    progressCircle.style.stroke = data.current >= data.target ? 'url(#gradient-green)' : 'url(#gradient-gold)';
    setTimeout(() => {
        progressCircle.style.strokeDashoffset = offset;
        animateValue(currentValueEl, data.current, 1200, data.format);
    }, 500);
    return card;
}

function animateValue(element, end, duration, format) {
    if (!element) return;
    let start = 0;
    const range = end - start;
    let startTime = null;
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        let currentValue = Math.floor(progress * range + start);
        if (format === 'dollar') { element.textContent = `$${currentValue}`; }
        else if (format === 'percent') { element.textContent = `${currentValue}%`; }
        else { element.textContent = currentValue; }
        if (progress < 1) { window.requestAnimationFrame(step); }
        else { element.textContent = (format === 'dollar' ? '$' : '') + end + (format === 'percent' ? '%' : ''); }
    }
    window.requestAnimationFrame(step);
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', initializeDashboard);
document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('loggedInStylist');
    window.location.href = 'index.html';
});