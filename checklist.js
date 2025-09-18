import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get the selected appointment from localStorage
const selectedAppointment = JSON.parse(localStorage.getItem('selectedAppointment'));
if (!selectedAppointment) {
    // If no appointment was selected, go back to the dashboard
    window.location.href = 'dashboard.html';
}

// Function to display the client's name
function displayClientInfo() {
    const header = document.getElementById('client-name-header');
    header.textContent = selectedAppointment.client_name;
}

// Function to fetch and display the action items
async function loadActionItems() {
    const container = document.getElementById('action-item-container');
    container.innerHTML = ''; // Clear "Loading..." text

    const { data: actionItems, error } = await supabase
        .from('actionitems')
        .select('*');

    if (error) {
        console.error('Error fetching action items:', error);
        container.innerHTML = '<p>Could not load action items.</p>';
        return;
    }

    // Create a toggle button for each action item
    for (const item of actionItems) {
        const button = document.createElement('button');
        button.className = 'action-item-toggle';
        button.textContent = item.title;
        button.dataset.itemId = item.id; // Store the item's ID on the button

        // Add click event to toggle the 'active' state
        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });

        container.appendChild(button);
    }
}

// Function to handle the "Mark Complete" button
function setupCompletionButton() {
    const completeBtn = document.getElementById('mark-complete-btn');
    completeBtn.addEventListener('click', () => {
        // For now, this will just take us back to the dashboard.
        // In a future step, we will add logic here to SAVE the selected items.
        alert('Appointment marked complete! (Saving logic to be added)');
        window.location.href = 'dashboard.html';
    });
}

// Initialize the page
displayClientInfo();
loadActionItems();
setupCompletionButton();