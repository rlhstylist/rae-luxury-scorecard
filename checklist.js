import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wditvvizexcwtkzllltn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const selectedAppointment = JSON.parse(localStorage.getItem('selectedAppointment'));
if (!selectedAppointment) {
    window.location.href = 'dashboard.html';
}

function displayClientInfo() {
    document.getElementById('client-name-header').textContent = selectedAppointment.client_name;
}

async function loadActionItems() {
    const container = document.getElementById('action-item-container');
    container.innerHTML = '';

    const { data: actionItems, error } = await supabase.from('actionitems').select('*');

    if (error) {
        console.error('Error fetching action items:', error);
        container.innerHTML = '<p>Could not load action items.</p>';
        return;
    }

    // --- NEW: SVG code for our checkmark icon ---
    const checkmarkSVG = `
        <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    `;

    for (const item of actionItems) {
        const button = document.createElement('button');
        button.className = 'action-item-toggle';
        button.dataset.itemId = item.id;
        
        // --- NEW: Add the text and the SVG icon to the button ---
        button.innerHTML = `<span>${item.title}</span>` + checkmarkSVG;

        button.addEventListener('click', () => {
            button.classList.toggle('active');

            // --- NEW: Add haptic feedback if the browser supports it ---
            if (window.navigator.vibrate) {
                window.navigator.vibrate(50); // A short 50ms vibration
            }
        });

        container.appendChild(button);
    }
}

function setupCompletionButton() {
    const completeBtn = document.getElementById('mark-complete-btn');
    completeBtn.addEventListener('click', () => {
        alert('Appointment marked complete! (Saving logic to be added)');
        window.location.href = 'dashboard.html';
    });
}

displayClientInfo();
loadActionItems();
setupCompletionButton();