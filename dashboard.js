import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wditvvizexcwtkzllltn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ... (keep getLoggedInStylist, displayStylistInfo, groupAppointments functions as they are) ...

async function loadAppointments(stylist) {
    const appointmentList = document.getElementById('appointment-list');
    appointmentList.innerHTML = '';

    // NEW: Fetch completion counts for each appointment
    const { data: completedData, error: completedError } = await supabase
        .from('appointmentactions')
        .select('appointment_id, is_completed, total_actions_available')
        .eq('stylist_id', stylist.id);

    if (completedError) { console.error(completedError); }

    // NEW: Process the data into a simple map { appointment_id: count }
    const completionCounts = {};
    for (const record of completedData) {
        if (!completionCounts[record.appointment_id]) {
            completionCounts[record.appointment_id] = { completed: 0, total: record.total_actions_available };
        }
        if (record.is_completed) {
            completionCounts[record.appointment_id].completed++;
        }
    }

    const { data: appointments, error } = await supabase.from('appointments').select('*').eq('stylist_id', stylist.id).order('appointment_time');
    
    // ... (error handling) ...

    const groupedAppointments = groupAppointments(appointments);

    for (const appt of groupedAppointments) {
        const card = document.createElement('div');
        card.className = 'appointment-card';
        
        // NEW: Check for completion status and apply the correct tier
        if (completionCounts[appt.id]) {
            const count = completionCounts[appt.id];
            const missed = count.total - count.completed;
            
            card.classList.add('is-complete'); // Add the base class for the cross-through line
            
            if (missed === 0) {
                card.classList.add('tier-gold'); // 100% completion
            } else if (missed === 1) {
                card.classList.add('tier-silver'); // 1 item missed
            } else if (missed === 2) {
                card.classList.add('tier-bronze'); // 2 items missed
            } else {
                card.classList.add('tier-sad'); // 3+ items missed
            }

            card.style.cursor = 'default';
        } else {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                localStorage.setItem('selectedAppointment', JSON.stringify(appt));
                window.location.href = 'checklist.html';
            });
        }

        // ... (rest of the card creation code remains the same) ...
    }
}

// ... (keep initializeDashboard function as it is) ...