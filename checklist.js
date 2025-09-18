import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wditvvizexcwtkzllltn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const selectedAppointment = JSON.parse(localStorage.getItem('selectedAppointment'));
const loggedInStylist = JSON.parse(localStorage.getItem('selectedStylist'));

if (!selectedAppointment || !loggedInStylist) {
    window.location.href = 'index.html';
}

function displayClientInfo() {
    document.getElementById('client-name-header').textContent = selectedAppointment.client_name;
}

let totalActionItems = 0; // Variable to hold the count

async function loadActionItems() {
    const container = document.getElementById('action-item-container');
    container.innerHTML = '';
    const { data: actionItems, error } = await supabase.from('actionitems').select('*');

    if (error) { /* ... error handling ... */ return; }
    
    totalActionItems = actionItems.length; // Store the total count

    for (const item of actionItems) {
        const button = document.createElement('button');
        button.className = 'action-item-slice';
        button.dataset.itemId = item.id;
        button.innerHTML = `<div class="top"><span>${item.title}</span></div><div class="bottom"><span>${item.title}</span></div>`;
        button.addEventListener('click', () => button.classList.toggle('active'));
        container.appendChild(button);
    }
}

async function saveCompletedActions() {
    const completeBtn = document.getElementById('mark-complete-btn');
    completeBtn.textContent = 'Saving...';
    completeBtn.disabled = true;

    const selectedButtons = document.querySelectorAll('.action-item-slice.active');
    
    const recordsToSave = [];
    for (const button of selectedButtons) {
        recordsToSave.push({
            appointment_id: selectedAppointment.id,
            action_item_id: button.dataset.itemId,
            is_completed: true,
            stylist_id: loggedInStylist.id,
            // NEW: Save the total count with each record
            total_actions_available: totalActionItems 
        });
    }

    // If nothing was selected, we still save a record to mark it as complete
    if (recordsToSave.length === 0) {
        recordsToSave.push({
            appointment_id: selectedAppointment.id,
            action_item_id: null, // No specific action
            is_completed: false, // Nothing was completed
            stylist_id: loggedInStylist.id,
            total_actions_available: totalActionItems
        });
    }

    const { error } = await supabase.from('appointmentactions').insert(recordsToSave);

    if (error) {
        console.error('Error saving data:', error);
        alert('Could not save progress. Please try again.');
        completeBtn.textContent = 'Mark Appointment Complete';
        completeBtn.disabled = false;
    } else {
        window.location.href = 'dashboard.html';
    }
}

function setupCompletionButton() {
    const completeBtn = document.getElementById('mark-complete-btn');
    completeBtn.addEventListener('click', saveCompletedActions);
}

displayClientInfo();
loadActionItems();
setupCompletionButton();