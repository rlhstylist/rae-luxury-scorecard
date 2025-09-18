import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wditvvizexcwtkzllltn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- We will keep the other functions the same ---
function getLoggedInStylist() {
    const stylistData = localStorage.getItem('selectedStylist');
    if (!stylistData) { window.location.href = 'index.html'; return null; }
    return JSON.parse(stylistData);
}
function displayStylistInfo(stylist) {
    document.getElementById('stylist-name-header').textContent = `Welcome, ${stylist.name}`;
}
function groupAppointments(appointments) {
    const grouped = {};
    for (const appt of appointments) {
        if (!grouped[appt.client_name]) {
            grouped[appt.client_name] = { ...appt, services: [appt.service_description], earliest_time: appt.appointment_time };
        } else { grouped[appt.client_name].services.push(appt.service_description); }
    }
    return Object.values(grouped);
}

// --- This is the function we are debugging ---
async function loadAppointments(stylist) {
    console.log('Step 1: Starting loadAppointments function for stylist:', stylist.name);
    const appointmentList = document.getElementById('appointment-list');
    
    // --- Fetching completion counts ---
    console.log('Step 2: Fetching completion data from appointmentactions table...');
    const { data: completedData, error: completedError } = await supabase
        .from('appointmentactions')
        .select('appointment_id, is_completed, total_actions_available')
        .eq('stylist_id', stylist.id);

    if (completedError) {
        console.error('DEBUG: Error fetching completed data:', completedError);
        appointmentList.innerHTML = '<p>Error loading completion data.</p>';
        return;
    }
    console.log('Step 3: Successfully fetched completion data:', completedData);

    // --- Processing the data ---
    const completionCounts = {};
    for (const record of completedData) {
        if (!completionCounts[record.appointment_id]) {
            completionCounts[record.appointment_id] = { completed: 0, total: record.total_actions_available };
        }
        if (record.is_completed) {
            completionCounts[record.appointment_id].completed++;
        }
    }
    console.log('Step 4: Processed completion counts:', completionCounts);

    // --- Fetching appointments ---
    console.log('Step 5: Fetching appointment list...');
    const { data: appointments, error } = await supabase.from('appointments').select('*').eq('stylist_id', stylist.id).order('appointment_time');
    
    if (error) {
        console.error('DEBUG: Error fetching appointments:', error);
        appointmentList.innerHTML = '<p>Error loading appointments.</p>';
        return;
    }
    console.log('Step 6: Successfully fetched appointments:', appointments);

    // --- Clearing the loading message and displaying cards ---
    appointmentList.innerHTML = ''; // This should now happen
    if (appointments.length === 0) {
        appointmentList.innerHTML = '<p>You have no appointments scheduled for today.</p>';
        return;
    }

    const groupedAppointments = groupAppointments(appointments);
    console.log('Step 7: Displaying appointment cards...');

    for (const appt of groupedAppointments) {
        // ... (The rest of the card creation logic is the same)
        const card = document.createElement('div');
        card.className = 'appointment-card';
        if (completionCounts[appt.id]) {
            const count = completionCounts[appt.id];
            const missed = count.total - count.completed;
            card.classList.add('is-complete');
            if (missed === 0) card.classList.add('tier-gold');
            else if (missed === 1) card.classList.add('tier-silver');
            else if (missed === 2) card.classList.add('tier-bronze');
            else card.classList.add('tier-sad');
            card.style.cursor = 'default';
        } else {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                localStorage.setItem('selectedAppointment', JSON.stringify(appt));
                window.location.href = 'checklist.html';
            });
        }
        const time = new Date(appt.earliest_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const servicesHtml = appt.services.join('<br>');
        card.innerHTML = `<div class="appointment-time">${time}</div><div class="appointment-details"><h3>${appt.client_name}</h3><p>${servicesHtml}</p></div>`;
        appointmentList.appendChild(card);
    }
    console.log('Step 8: Finished displaying cards.');
}

function initializeDashboard() {
    const stylist = getLoggedInStylist();
    if (stylist) {
        displayStylistInfo(stylist);
        loadAppointments(stylist);
    }
}

initializeDashboard();