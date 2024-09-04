document.addEventListener('DOMContentLoaded', function() {
    // Check if eventForm exists before adding an event listener
    if (document.getElementById('eventForm')) {
        document.getElementById('eventForm').addEventListener('submit', createEvent);
    }

    // Load events on page load
    loadEvents();

    // Event listener for "eventsPerPage" dropdown change
    const eventsPerPageDropdown = document.getElementById('eventsPerPage');
    if (eventsPerPageDropdown) {
        eventsPerPageDropdown.addEventListener('change', function() {
            loadEvents(1);  // Reload events starting from page 1 whenever the number per page changes
        });
    }

    // Navigation handling (Assuming you have a nav element)
    const navLink = document.querySelector('nav ul li a[href="#"]');
    if (navLink) {
        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadEvents();
        });
    }

    // Bulb blinking effect
    setInterval(() => {
        const bulb = document.querySelector("#bulb");
        if (bulb) {
            bulb.classList.toggle("bulb");
        }
    }, 1500); // Adjusted the interval to match the animation timing
});

function createEvent(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('date', document.getElementById('date').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('venueImage', document.getElementById('venueImage').files[0]);

    fetch('http://localhost:3001/event', {
        method: 'POST',
        body: formData
    })

    .then(res => res.text())
    .then(data => {
        alert(data);
        loadEvents();  // Refresh the events list after adding a new event
    });
}

function loadEvents(page = 1) {
    const eventsPerPageDropdown = document.getElementById('eventsPerPage');
    const eventsPerPage = eventsPerPageDropdown ? eventsPerPageDropdown.value || 3 : 3;  // Default to 3 events per page

    fetch(`http://localhost:3001/events?page=${page}&limit=${eventsPerPage}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const { events, totalPages, currentPage } = data;
            let output = '<h2>Events</h2>';
            events.forEach(event => {
                output += `
                    <div class="event">
                        <h3>${event.name}</h3>
                        <p>${event.date}</p>
                        <p>${event.location}</p>
                        <p>${event.description}</p>
                        <img src="http://localhost:3001/uploads/${event.venue_image}" alt="Venue Image" style="width:100px;height:100px;">
                        <button class="delete-button" onclick="deleteEvent(${event.id})">Delete</button>
                    </div>
                `;
            });
            document.getElementById('events').innerHTML = output;

            // Add pagination controls
            let pagination = '<div class="pagination">';
            if (currentPage > 1) {
                pagination += `<a href="#" onclick="loadEvents(${currentPage - 1})">&#171; Prev</a>`;
            }
            for (let i = 1; i <= totalPages; i++) {
                pagination += `<a href="#" onclick="loadEvents(${i})">${i}</a>`;
            }
            if (currentPage < totalPages) {
                pagination += `<a href="#" onclick="loadEvents(${currentPage + 1})">Next &#187;</a>`;
            }
            pagination += '</div>';
            document.getElementById('events').innerHTML += pagination;
        })
        .catch(error => console.error('Fetch error:', error));
}

function deleteEvent(id) {
    fetch(`http://localhost:3001/event/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        loadEvents();
    });
}

/*

document.addEventListener('DOMContentLoaded', function() {
    // Check if eventForm exists before adding an event listener
    if (document.getElementById('eventForm')) {
        document.getElementById('eventForm').addEventListener('submit', createEvent);
    }

    // Load events when the "Delete Event" section is shown
    const deleteEventSection = document.getElementById('deleteEvent');
    if (deleteEventSection) {
        loadEvents();  // Load events immediately or when navigating to "Delete Event"
    }

    // Event listener for "eventsPerPage" dropdown change
    const eventsPerPageDropdown = document.getElementById('eventsPerPage');
    if (eventsPerPageDropdown) {
        eventsPerPageDropdown.addEventListener('change', function() {
            loadEvents(1);  // Reload events starting from page 1 whenever the number per page changes
        });
    }

    // Bulb blinking effect
    setInterval(() => {
        const bulb = document.querySelector("#bulb");
        if (bulb) {
            bulb.classList.toggle("bulb");
        }
    }, 1500); // Adjusted the interval to match the animation timing
});

function createEvent(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('date', document.getElementById('date').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('venueImage', document.getElementById('venueImage').files[0]);

    fetch('http://localhost:3001/event', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        loadEvents();  // Refresh the events list after adding a new event
    });
}

function loadEvents(page = 1) {
    const eventsPerPageDropdown = document.getElementById('eventsPerPage');
    const eventsPerPage = eventsPerPageDropdown ? eventsPerPageDropdown.value || 3 : 3;  // Default to 3 events per page

    fetch(`http://localhost:3001/events?page=${page}&limit=${eventsPerPage}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const { events, totalPages, currentPage } = data;
            let output = '<h2>Events</h2>';
            events.forEach(event => {
                output += `
                    <div class="event">
                        <h3>${event.name}</h3>
                        <p>${event.date}</p>
                        <p>${event.location}</p>
                        <p>${event.description}</p>
                        <img src="http://localhost:3001/uploads/${event.venue_image}" alt="Venue Image" style="width:100px;height:100px;">
                        <button class="delete-button" onclick="deleteEvent(${event.id})">Delete</button>
                    </div>
                `;
            });
            document.getElementById('events').innerHTML = output;

            // Add pagination controls
            let pagination = '<div class="pagination">';
            if (currentPage > 1) {
                pagination += `<a href="#" onclick="loadEvents(${currentPage - 1})">&#171; Prev</a>`;
            }
            for (let i = 1; i <= totalPages; i++) {
                pagination += `<a href="#" onclick="loadEvents(${i})">${i}</a>`;
            }
            if (currentPage < totalPages) {
                pagination += `<a href="#" onclick="loadEvents(${currentPage + 1})">Next &#187;</a>`;
            }
            pagination += '</div>';
            document.getElementById('events').innerHTML += pagination;
        })
        .catch(error => console.error('Fetch error:', error));
}

function deleteEvent(id) {
    fetch(`http://localhost:3001/event/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        loadEvents();
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    if (sectionId === 'deleteEvent') {
        loadEvents();  // Load events when the Delete Event section is shown
    }
}

*/