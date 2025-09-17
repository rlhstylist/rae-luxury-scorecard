// Import the Supabase client library
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- PASTE YOUR SUPABASE INFO HERE ---
const supabaseUrl = 'https://wditvvizexcwtkzllltn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkaXR2dml6ZXhjd3RremxsbHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDc4ODUsImV4cCI6MjA3MzcyMzg4NX0.6snZfp6_ktod8lS-AgYJlkPI397OmOCtgG06fmO816I';
// -------------------------------------

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch stylists and display them
async function loadStylistProfiles() {
    const grid = document.getElementById('stylist-selection-grid');

    // Fetch data from the 'Stylists' table
    const { data: stylists, error } = await supabase
        .from('Stylists')
        .select('*')
        .order('name'); // Sort them alphabetically

    // Hide the loading spinner
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }

    if (error || !stylists) {
        console.error('Error fetching stylists:', error);
        grid.innerHTML = '<p>Could not load profiles. Please check your Supabase credentials and RLS policies.</p>';
        return;
    }
    
    // If there are no stylists, show a message
    if (stylists.length === 0) {
        grid.innerHTML = '<p>No stylist profiles found.</p>';
        return;
    }

    // Create a tile for each stylist
    for (const stylist of stylists) {
        const tile = document.createElement('div');
        tile.classList.add('stylist-tile');
        
        const name = document.createElement('h2');
        name.textContent = stylist.name;
        
        const level = document.createElement('p');
        level.textContent = stylist.is_manager ? 'Manager' : stylist.level;
        
        tile.appendChild(name);
        tile.appendChild(level);

        // Add click event listener for future navigation
        tile.addEventListener('click', () => {
            // Store selected stylist info and navigate (we'll build this next)
            alert(`Selected: ${stylist.name}`);
        });

        grid.appendChild(tile);
    }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', loadStylistProfiles);