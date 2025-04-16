// Load all bookings from the server and display them
async function loadBookings() {
  try {
    const res = await fetch('/api/bookings');
    const bookings = await res.json();
    const bookingsList = document.getElementById('bookings-list'); // Ensure this is the correct element ID
    bookingsList.innerHTML = ''; // Clear the list before adding new rows

    bookings.forEach(booking => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.id = `booking-${booking.id}`; // Set a unique ID for each list item

      listItem.innerHTML = `
        <strong>${booking.name}</strong> (${booking.email})<br>
        Service: ${booking.service} | Date: ${booking.date} | Time: ${booking.time}
        <button class="btn btn-danger btn-sm float-end" onclick="deleteBooking(${booking.id})">Delete</button>
        <button class="btn btn-info btn-sm float-end me-2" onclick="editBooking(${booking.id})">Edit</button>
      `;

      bookingsList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

// Form submission handling
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const booking = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    service: document.getElementById('service').value
  };

  fetch('/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message); // e.g., "Booking added"
      document.getElementById('bookingForm').reset();
      loadBookings(); // Reload the list of bookings after submission
    })
    .catch(err => {
      alert("Error submitting booking");
      console.error(err);
    });
});

// Delete booking by id
async function deleteBooking(id) {
  try {
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    const data = await res.json();

    // If deletion is successful, remove the booking from the UI
    if (data.message === 'Booking deleted') {
      console.log("Deleted from database:", id);

      // Remove the corresponding list item (booking) from the frontend
      const bookingItem = document.getElementById(`booking-${id}`);
      if (bookingItem) {
        bookingItem.remove();
      }
    } else {
      console.error("Failed to delete booking");
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
  }
}

// Edit booking by id (basic example)
function editBooking(id) {
  const newName = prompt("Enter new name:");
  if (newName) {
    fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message); // "Booking updated"
        loadBookings(); // Reload the list after editing
      })
      .catch(error => {
        console.error('Error editing booking:', error);
        alert('Error editing booking');
      });
}

// Run when the page is loaded
window.onload = function() {
  loadBookings();
};
