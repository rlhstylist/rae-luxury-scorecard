import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wditvvizexcwtkzllltn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function getLoggedInStylist() {
    const stylistData = localStorage.getItem('selectedStylist');
    if (!stylistData) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(stylistData);
}

function displayStylistInfo(stylist) {
    document.getElementById('stylist-name-header').textContent = `Welcome, ${stylist.name}`;
}

// NEW FUNCTION: Group appointments by client name
function groupAppointments(appointments) {
    const grouped = {};
    for (const appt of appointments) {
        if (!grouped[appt.client_name]) {
            // First time we see this client, create a new entry
            grouped[appt.client_name] = {
                ...appt, // Copy all appointment details
                services: [appt.service_description], // Start a list of services
                earliest_time: appt.appointment_time // Set the earliest time
            };
        } else {
            // We've seen this client before, just add the new service
            grouped[appt.client_name].services.push(appt.service_description);
        }
    }
    // Return an array of the grouped appointments
    return Object.values(grouped);
}

async function loadAppointments(stylist) {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '';

    const { data: appointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('stylist_id', stylist.id)
        .order('appointment_time');

    if (error) {
        console.error('Error fetching appointments:', error);
        appointmentList.innerHTML = '<p>Could not load appointments.</p>';
        return;
    }

    if (appointments.length === 0) {
        appointmentList.innerHTML = '<p>You have no appointments scheduled for today.</p>';
        return;
    }

    // Group the appointments before displaying them
    const groupedAppointments = groupAppointments(appointments);

    for (const appt of groupedAppointments) {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.style.cursor = 'pointer';

        card.addEventListener('click', () => {
            localStorage.setItem('selectedAppointment', JSON.stringify(appt));
            window.location.href = 'checklist.html';
        });

        const time = new Date(appt.earliest_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Join all services with a line break
        const servicesHtml = appt.services.join('<br>');

        card.innerHTML = `
            <div class="appointment-time">${time}</div>
            <div class="appointment-details">
                <h3>${appt.client_name}</h3>
                <p>${servicesHtml}</p>
            </div>
        `;
        appointmentList.appendChild(card);
    }
}

function initializeDashboard() {
    const stylist = getLoggedInStylist();
    if (stylist) {
        displayStylistInfo(stylist);
        loadAppointments(stylist);
    }
}

initializeDashboard();