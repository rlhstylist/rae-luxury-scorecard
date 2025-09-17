// Import the Supabase client library
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Get your Supabase credentials from Netlify's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

    if (error) {
        console.error('Error fetching stylists:', error);
        grid.innerHTML = '<p>Error loading profiles. Please try again later.</p>';
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