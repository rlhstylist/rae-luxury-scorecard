// goals.js (Complete and Corrected File)

document.addEventListener('DOMContentLoaded', () => {
    initializeGoalDials();
});

function initializeGoalDials() {
    const kpiData = {
        avg_service: { label: "Avg. Service", current: 125, goal: 110, target: 140, format: 'dollar' },
        avg_retail: { label: "Avg. Retail", current: 42, goal: 50, target: 65, format: 'dollar' },
        rebook: { label: "Rebook %", current: 85, goal: 80, target: 92, format: 'percent' },
        productivity: { label: "Productivity %", current: 93, goal: 95, target: 98, format: 'percent' }
    };

    const container = document.getElementById('goals-container');
    if (!container) return;
    container.innerHTML = '';

    for (const data of Object.values(kpiData)) {
        container.appendChild(createGoalDial(data));
    }
}

function createGoalDial(data) {
    const card = document.createElement('div');
    card.className = 'kpi-card';

    // This HTML structure uses the correct class names that match the stylesheet
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
        <div class="kpi-target">DAILY GOAL: ${data.format === 'dollar' ? '$' : ''}${data.goal}${data.format === 'percent' ? '%' : ''}</div>
        <div class="kpi-target">WEEKLY TARGET: ${data.format === 'dollar' ? '$' : ''}${data.target}${data.format === 'percent' ? '%' : ''}</div>
    `;

    const progressCircle = card.querySelector('.kpi-dial-progress');
    const currentValueEl = card.querySelector('.kpi-current-value'); // This will now find the element correctly
    
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * (240 / 360);
    
    const progressPercentage = Math.min((data.current / data.goal) * 100, 100);
    const offset = arcLength - (progressPercentage / 100) * arcLength;

    card.querySelector('.kpi-dial-track').setAttribute('stroke-dasharray', `${arcLength} ${circumference}`);
    progressCircle.setAttribute('stroke-dasharray', `${arcLength} ${circumference}`);
    progressCircle.setAttribute('stroke-dashoffset', arcLength);

    let dialColorUrl;
    if (data.current >= data.target) { dialColorUrl = 'url(#gradient-green)'; } 
    else if (data.current >= data.goal) { dialColorUrl = 'url(#gradient-gold)'; } 
    else { dialColorUrl = 'url(#gradient-red)'; }
    progressCircle.style.stroke = dialColorUrl;

    setTimeout(() => {
        progressCircle.style.strokeDashoffset = offset;
        animateValue(currentValueEl, data.current, 1200, data.format);
    }, 500);

    return card;
}

function animateValue(element, end, duration, format) {
    if (!element) return; // Guard clause to prevent errors
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