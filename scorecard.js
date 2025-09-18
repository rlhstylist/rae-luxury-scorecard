// scorecard.js

document.addEventListener('DOMContentLoaded', () => {
    // Mock data until SC-103/104 are complete.
    // In the future, this will be fetched from Supabase and the compensation plan.
    const kpiData = {
        reschedule_percent: { value: 85, format: 'percent' },
        retail_per_ticket: { value: 42, format: 'dollar' },
        new_client_prebook_percent: { value: 92, format: 'percent' },
        color_add_on_percent: { value: 48, format: 'percent' }
    };

    // Initialize all gauges on the page
    const gauges = document.querySelectorAll('.kpi-gauge');
    gauges.forEach(gauge => {
        const kpiName = gauge.dataset.kpi;
        const kpiInfo = kpiData[kpiName];
        if (kpiInfo) {
            createGauge(gauge, kpiInfo.value, kpiInfo.format);
        }
    });
});

function createGauge(gaugeElement, value, format) {
    const svg = gaugeElement.querySelector('.gauge-svg');
    const percentageText = gaugeElement.querySelector('.gauge-percentage');
    const radius = 45; // ViewBox is 100x100, so center is 50,50
    const circumference = 2 * Math.PI * radius;
    
    // We use a 270-degree arc, which is 75% of the circle
    const arcLength = circumference * 0.75;
    const offset = arcLength - (value / 100) * arcLength;

    // SVG Namespace
    const svgNS = "http://www.w3.org/2000/svg";

    // Background Track
    const track = document.createElementNS(svgNS, "circle");
    track.setAttribute("cx", "50");
    track.setAttribute("cy", "50");
    track.setAttribute("r", radius);
    track.setAttribute("class", "gauge-track");
    track.setAttribute("stroke-dasharray", `${arcLength} ${circumference}`);
    svg.appendChild(track);

    // Progress Indicator
    const progress = document.createElementNS(svgNS, "circle");
    progress.setAttribute("cx", "50");
    progress.setAttribute("cy", "50");
    progress.setAttribute("r", radius);
    progress.setAttribute("class", "gauge-progress");
    progress.setAttribute("stroke-dasharray", `${arcLength} ${circumference}`);
    // Set initial offset to full to animate from zero on load
    progress.setAttribute("stroke-dashoffset", arcLength); 
    svg.appendChild(progress);
    
    // Animate the progress bar and text after a short delay
    setTimeout(() => {
        progress.style.strokeDashoffset = offset;
        updateText(percentageText, value, format);
    }, 300);
}

function updateText(element, value, format) {
    let finalValue;
    if (format === 'percent') {
        finalValue = `${value}%`;
    } else if (format === 'dollar') {
        finalValue = `$${value}`;
    } else {
        finalValue = value;
    }
    element.textContent = finalValue;
}