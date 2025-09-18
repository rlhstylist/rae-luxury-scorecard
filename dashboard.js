import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wditvvizexcwtkzllltn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- NEW: A dictionary of our high-quality, reliable SVG icons ---
const TIER_ICONS = {
    gold: `<svg class="tier-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.25 21.5a.75.75 0 01-.75-.75V18.5h-1a.75.75 0 010-1.5h1V15h-1a.75.75 0 010-1.5h1v-2.25a.75.75 0 011.5 0V17h1a.75.75 0 010 1.5h-1v2.25a.75.75 0 01-.75.75zm3.5-12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0-3a.75.75 0 110 1.5.75.75 0 010-1.5zm-3.5 3a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0zm-3-1.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm10.38 3.82a.75.75 0 01.378.96l-3.32 8.298a.75.75 0 11-1.416-.568l3.32-8.298a.75.75 0 011.038-.392zM19.38 5.18a.75.75 0 01.378.96l-8.298 3.32a.75.75 0 01-.96-.378.75.75 0 01.378-.96l8.298-3.32a.75.75 0 01.582-.214z"/></svg>`,
    silver: `<svg class="tier-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.25 21.5a.75.75 0 01-.75-.75V18.5h-1a.75.75 0 010-1.5h1V15h-1a.75.75 0 010-1.5h1v-2.25a.75.75 0 011.5 0V17h1a.75.75 0 010 1.5h-1v2.25a.75.75 0 01-.75.75zm3.5-12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0-3a.75.75 0 110 1.5.75.75 0 010-1.5zm-3.5 3a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0zm-3-1.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm10.38 3.82a.75.75 0 01.378.96l-3.32 8.298a.75.75 0 11-1.416-.568l3.32-8.298a.75.75 0 011.038-.392zM19.38 5.18a.75.75 0 01.378.96l-8.298 3.32a.75.75 0 01-.96-.378.75.75 0 01.378-.96l8.298-3.32a.75.75 0 01.582-.214z"/></svg>`,
    bronze: `<svg class="tier-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.25 21.5a.75.75 0 01-.75-.75V18.5h-1a.75.75 0 010-1.5h1V15h-1a.75.75 0 010-1.5h1v-2.25a.75.75 0 011.5 0V17h1a.75.75 0 010 1.5h-1v2.25a.75.75 0 01-.75.75zm3.5-12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm0-3a.75.75 0 110 1.5.75.75 0 010-1.5zm-3.5 3a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0zm-3-1.5a.75.75 0 111.5 0 .75.75 0 01-1.5 0zm10.38 3.82a.75.75 0 01.378.96l-3.32 8.298a.75.75 0 11-1.416-.568l3.32-8.298a.75.75 0 011.038-.392zM19.38 5.18a.75.75 0 01.378.96l-8.298 3.32a.75.75 0 01-.96-.378.75.75 0 01.378-.96l8.298-3.32a.75.75 0 01.582-.214z"/></svg>`,
    sad: `<svg class="tier-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.975.435-.975.975s.435.975.975.975 .975-.435.975-.975S9.915 8.25 9.375 8.25zm5.25 0c-.54 0-.975.435-.975.975s.435.975.975.975 .975-.435.975-.975S15.165 8.25 14.625 8.25zm1.94 6.22a.75.75 0 00-1.297-.812 5.25 5.25 0 01-8.506 0 .75.75 0 00-1.297.812A6.75 6.75 0 0012 18.75a6.75 6.75 0 005.565-2.72z" clip-rule="evenodd" /></svg>`
};

// --- Unchanged functions ---
function getLoggedInStylist() { const d = localStorage.getItem('selectedStylist'); if (!d) { window.location.href = 'index.html'; return null; } return JSON.parse(d); }
function displayStylistInfo(s) { document.getElementById('stylist-name-header').textContent = `Welcome, ${s.name}`; }
function groupAppointments(a) { const g = {}; for (const p of a) { if (!g[p.client_name]) { g[p.client_name] = { ...p, services: [p.service_description], earliest_time: p.appointment_time }; } else { g[p.client_name].services.push(p.service_description); } } return Object.values(g); }

async function loadAppointments(stylist) {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '';
    const { data: completedData, error: completedError } = await supabase.from('appointmentactions').select('appointment_id, is_completed, total_actions_available').eq('stylist_id', stylist.id);
    if (completedError) { console.error(completedError); }
    const completionCounts = {};
    for (const record of completedData) {
        if (!completionCounts[record.appointment_id]) { completionCounts[record.appointment_id] = { completed: 0, total: record.total_actions_available }; }
        if (record.is_completed) { completionCounts[record.appointment_id].completed++; }
    }
    const { data: appointments, error } = await supabase.from('appointments').select('*').eq('stylist_id', stylist.id).order('appointment_time');
    if (error) { appointmentList.innerHTML = '<p>Error loading appointments.</p>'; return; }
    if (appointments.length === 0) { appointmentList.innerHTML = '<p>You have no appointments scheduled for today.</p>'; return; }
    const groupedAppointments = groupAppointments(appointments);
    for (const appt of groupedAppointments) {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        let tier = '';
        let iconHtml = '';
        if (completionCounts[appt.id]) {
            const count = completionCounts[appt.id];
            const missed = count.total - count.completed;
            card.classList.add('is-complete');
            if (missed === 0) { tier = 'tier-gold'; iconHtml = TIER_ICONS.gold; }
            else if (missed === 1) { tier = 'tier-silver'; iconHtml = TIER_ICONS.silver; }
            else if (missed === 2) { tier = 'tier-bronze'; iconHtml = TIER_ICONS.bronze; }
            else { tier = 'tier-sad'; iconHtml = TIER_ICONS.sad; }
            card.classList.add(tier);
            card.style.cursor = 'default';
        } else {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => { localStorage.setItem('selectedAppointment', JSON.stringify(appt)); window.location.href = 'checklist.html'; });
        }
        const time = new Date(appt.earliest_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const servicesHtml = appt.services.join('<br>');
        // --- MODIFIED: The icon is now part of the main innerHTML ---
        card.innerHTML = `<div class="appointment-time">${time}</div><div class="appointment-details"><h3>${appt.client_name}</h3><p>${servicesHtml}</p></div>${iconHtml}`;
        appointmentList.appendChild(card);
    }
}

function initializeDashboard() { const s = getLoggedInStylist(); if (s) { displayStylistInfo(s); loadAppointments(s); } }
initializeDashboard();
// Add this entire block to the end of your existing dashboard.js file

// === KPI SCORECARD LOGIC ===

// === Refined KPI Scorecard Logic (Corrected) ===

document.addEventListener('DOMContentLoaded', () => {
    initializeKpiDials();
});

function initializeKpiDials() {
    const kpiData = {
        avg_service: { label: "Avg. Service", current: 125, goal: 110, target: 140, format: 'dollar' },
        avg_retail: { label: "Avg. Retail", current: 42, goal: 50, target: 65, format: 'dollar' },
        rebook: { label: "Rebook %", current: 85, goal: 80, target: 92, format: 'percent' },
        productivity: { label: "Productivity %", current: 93, goal: 95, target: 98, format: 'percent' }
    };

    const container = document.getElementById('kpi-summary-container');
    if (!container) {
        console.error("KPI container not found!");
        return;
    }
    container.innerHTML = ''; // Clear previous content

    for (const data of Object.values(kpiData)) {
        container.appendChild(createKpiDial(data));
    }
}

// Replace the existing createKpiDial function in dashboard.js with this one.

function createKpiDial(data) {
    const card = document.createElement('div');
    card.className = 'kpi-card';

    card.innerHTML = `
        <div class="kpi-dial-container">
            <svg class="kpi-dial-svg" viewBox="0 0 100 100">
                <circle class="kpi-dial-track" cx="50" cy="50" r="45"></circle>
                <circle class="kpi-dial-progress" cx="50" cy="50" r="45"></circle>
            </svg>
            <div class="kpi-value-container">
                <div class="kpi-current-value">0</div>
            </div>
        </div>
        <div class="kpi-label">${data.label}</div>
        <div class="kpi-target">TARGET: ${data.format === 'dollar' ? '$' : ''}${data.target}${data.format === 'percent' ? '%' : ''}</div>
    `;

    const progressCircle = card.querySelector('.kpi-dial-progress');
    const currentValueEl = card.querySelector('.kpi-current-value');
    
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * (240 / 360);
    
    const progressPercentage = Math.min((data.current / data.goal) * 100, 100);
    const offset = arcLength - (progressPercentage / 100) * arcLength;

    card.querySelector('.kpi-dial-track').setAttribute('stroke-dasharray', `${arcLength} ${circumference}`);
    progressCircle.setAttribute('stroke-dasharray', `${arcLength} ${circumference}`);
    progressCircle.setAttribute('stroke-dashoffset', arcLength);

    // --- NEW Three-Tier Color Logic ---
    let dialColorUrl;
    if (data.current >= data.target) {
        // Met or exceeded WEEKLY goal
        dialColorUrl = 'url(#gradient-green)';
    } else if (data.current >= data.goal) {
        // Met DAILY goal but not weekly
        dialColorUrl = 'url(#gradient-gold)';
    } else {
        // Not meeting DAILY goal
        dialColorUrl = 'url(#gradient-red)';
    }
    progressCircle.style.stroke = dialColorUrl;
    // --- End of New Logic ---

    setTimeout(() => {
        progressCircle.style.strokeDashoffset = offset;
        animateValue(currentValueEl, data.current, 1200, data.format);
    }, 500);

    return card;
}}

function animateValue(element, end, duration, format) {
    let start = 0;
    const range = end - start;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        let currentValue = Math.floor(progress * range + start);

        if (format === 'dollar') {
            element.textContent = `$${currentValue}`;
        } else if (format === 'percent') {
            element.textContent = `${currentValue}%`;
        } else {
            element.textContent = currentValue;
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Ensure final value is exact
            element.textContent = (format === 'dollar' ? '$' : '') + end + (format === 'percent' ? '%' : '');
        }
    }
    window.requestAnimationFrame(step);
}