let editingId = null;

async function loadBookings() {
  const list = document.getElementById('bookingList');
  list.innerHTML = '';

  try {
    const res = await fetch('/api/bookings');
    const bookings = await res.json();

    bookings.forEach(b => {
      const li = document.createElement('li');
      li.textContent = `${b.name} - ${b.service} on ${b.date} at ${b.time}`;

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => startEdit(b);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.onclick = () => deleteBooking(b.id);

      li.appendChild(editBtn);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  } catch (error) {
    console.error('Error loading bookings:', error);
    alert('Error loading bookings. Please try again later.');
  }
}

function startEdit(booking) {
  document.getElementById('name').value = booking.name;
  document.getElementById('email').value = booking.email;
  document.getElementById('date').value = booking.date;
  document.getElementById('time').value = booking.time;
  document.getElementById('service').value = booking.service;
  editingId = booking.id;
  document.querySelector('form button').textContent = 'Update';
}

async function deleteBooking(id) {
  try {
    await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    loadBookings();
  } catch (error) {
    console.error('Error deleting booking:', error);
    alert('Error deleting booking. Please try again later.');
  }
}

document.getElementById('bookingForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    service: document.getElementById('service').value,
  };

  if (editingId) {
    await fetch(`/api/bookings/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    editingId = null;
    document.querySelector('form button').textContent = 'Book';
  } else {
    await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  this.reset();
  loadBookings();
});

window.onload = loadBookings;

