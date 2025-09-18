// Import the Supabase client library
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- PASTE YOUR SUPABASE INFO HERE (SAME AS IN main.js) ---
const supabaseUrl = 'https://wditvvizexcwtkzllltn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';
// ---------------------------------------------------------

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to get the currently logged-in stylist
function getLoggedInStylist() {
    const stylistData = localStorage.getItem('selectedStylist');
    if (!stylistData) {
        // If no one is logged in, send them back to the login page
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(stylistData);
}

// Function to display stylist's name
function displayStylistInfo(stylist) {
    const header = document.getElementById('stylist-name-header');
    header.textContent = `Welcome, ${stylist.name}`;
}

// Function to fetch and display appointments
async function loadAppointments(stylist) {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = ''; // Clear the "Loading..." message

    // Fetch appointments that belong to the logged-in stylist
    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('stylist_id', stylist.id) // Only get appointments for this stylist
        .order('appointment_time'); // Show them in chronological order

    if (error) {
        console.error('Error fetching appointments:', error);
        appointmentList.innerHTML = '<p>Could not load appointments.</p>';
        return;
    }

    if (appointments.length === 0) {
        appointmentList.innerHTML = '<p>You have no appointments scheduled for today.</p>';
        return;
    }

    // Create and display each appointment as a card
    for (const appt of appointments) {
        const card = document.createElement('div');
        card.className = 'appointment-card'; // We'll add styles for this

        const time = new Date(appt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        card.innerHTML = `
            <div class="appointment-time">${time}</div>
            <div class="appointment-details">
                <h3>${appt.client_name}</h3>
                <p>${appt.service_description}</p>
            </div>
        `;
        appointmentList.appendChild(card);
    }
}

// Main function to run when the dashboard loads
function initializeDashboard() {
    const stylist = getLoggedInStylist();
    if (stylist) {
        displayStylistInfo(stylist);
        loadAppointments(stylist);
    }
}

// Run the initialization function
initializeDashboard();