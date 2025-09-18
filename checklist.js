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

    for (const item of actionItems) {
        const button = document.createElement('button');
        button.className = 'action-item-slice';
        button.dataset.itemId = item.id;
        
        // --- THIS IS THE CORRECTED PART ---
        // We are now creating a simple span, not the complex top/bottom divs.
        button.innerHTML = `<span>${item.title}</span>`;

        button.addEventListener('click', () => {
            button.classList.toggle('active');
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