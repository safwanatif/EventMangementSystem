document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});

function fetchEvents() {
    fetch('http://localhost:3001/events')
        .then(response => response.json())
        .then(events => {
            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = ''; // Clear previous content

            events.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                    <span>${event.name} - ${event.date}</span>
                    <button onclick="deleteEvent(${event.id})">Delete</button>
                `;
                eventsList.appendChild(eventItem);
            });
        })
        .catch(error => console.error('Error fetching events:', error));
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        fetch(`http://localhost:3001/event/${eventId}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchEvents(); // Refresh the list of events
        })
        .catch(error => console.error('Error deleting event:', error));
    }
}
