// Load all bookings from the server and display them
function loadBookings() {
  fetch('/api/bookings')
    .then(response => response.json())
    .then(bookings => {
      const bookingsList = document.getElementById('bookings-list');
      bookingsList.innerHTML = ''; // Clear the list before adding new rows
      bookings.forEach(booking => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `
          <strong>${booking.name}</strong> (${booking.email})<br>
          Service: ${booking.service} | Date: ${booking.date} | Time: ${booking.time}
          <button class="btn btn-danger btn-sm float-end" onclick="deleteBooking(${booking.id})">Delete</button>
          <button class="btn btn-info btn-sm float-end me-2" onclick="editBooking(${booking.id})">Edit</button>
        `;
        bookingsList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error loading bookings:', error);
    });
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

// Function to handle delete operation
async function deleteBooking(id) {
  try {
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error('Failed to delete booking');
    }

    const data = await res.json();
    if (data.message === 'Booking deleted') {
      console.log("Deleted booking with ID:", id);
      const bookingItem = document.getElementById(`booking-${id}`);
      if (bookingItem) {
        bookingItem.remove(); // Remove the item from the list
      }
    } else {
      console.error("Failed to delete booking:", data);
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
  }
}

// Load the bookings from the server and display them
async function loadBookings() {
  try {
    const res = await fetch('/api/bookings');
    if (!res.ok) {
      throw new Error('Failed to load bookings');
    }
    const bookings = await res.json();

    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = ''; // Clear the list before adding new bookings

    bookings.forEach(booking => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.id = `booking-${booking.id}`; // Assign a unique id to each list item

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
document.getElementById('bookingForm').addEventListener('submit', function (e) {
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
      document.getElementById('bookingForm').reset(); // Reset the form
      loadBookings(); // Reload the list of bookings after submission
    })
    .catch(err => {
      alert("Error submitting booking");
      console.error(err);
    });
});
  // Edit booking by id (basic example)
function editBooking(id) {
  const newName = prompt("Enter new name:");
  if (newName) {
    // Send PUT request to the backend to update the booking
    fetch(`/api/bookings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Booking updated:', data);
        alert(data.message); // "Booking updated"
        loadBookings(); // Reload the list of bookings after editing
      })
      .catch(error => {
        console.error('Error editing booking:', error);
        alert('Error editing booking');
      });
  }
}
