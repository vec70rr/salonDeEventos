document.addEventListener('DOMContentLoaded', () => {
  fetch('/events')
    .then(response => response.json())
    .then(events => {
      const eventItems = document.getElementById('eventItems');
      events.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `Tipo de evento: ${event.eventType[0]}, Fecha: ${event.eventDate[0]}, Hora: ${event.eventTime[0]}`;
        listItem.setAttribute('data-event-id', event.eventId); // Añadir un atributo de data para identificar el evento
        listItem.addEventListener('click', () => showEditForm(event)); // Mostrar formulario al hacer clic
        eventItems.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
});

function showEditForm(event) {
  const editForm = document.getElementById('editForm');
  const editEventType = document.getElementById('editEventType');
  const editEventDate = document.getElementById('editEventDate');
  const editEventTime = document.getElementById('editEventTime');
  const eventIdInput = document.getElementById('eventId');

  // Llenar el formulario con los detalles del evento seleccionado
  editEventType.value = event.eventType[0];
  editEventDate.value = event.eventDate[0];
  editEventTime.value = event.eventTime[0];
  eventIdInput.value = event.eventId;

  // Mostrar el formulario de edición
  editForm.style.display = 'block';
}

function updateEvent() {
  const eventEditForm = document.getElementById('eventEditForm');
  const eventId = eventEditForm.elements['eventId'].value;
  const editEventType = eventEditForm.elements['editEventType'].value;
  const editEventDate = eventEditForm.elements['editEventDate'].value;
  const editEventTime = eventEditForm.elements['editEventTime'].value;

  // Verifica que eventId no sea undefined o vacío antes de continuar
  if (!eventId) {
    alert('Error: No se puede actualizar el evento. Identificador de evento no encontrado.');
    return;
  }

  // Aquí estás enviando una solicitud PUT al servidor
  fetch(`/update-event/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventType: editEventType,
      eventDate: editEventDate,
      eventTime: editEventTime,
    }),
  })
    .then(response => {
      if (response.ok) {
        alert('Evento actualizado correctamente.');
        // Opcional: Ocultar el formulario de edición después de actualizar
        document.getElementById('editForm').style.display = 'none';
      } else {
        alert('Error al actualizar el evento.'); // Este alert se muestra si hay un error en la respuesta
      }
    })
    .catch(error => {
      console.error('Error updating event:', error); // Este console.error se muestra si ocurre un error en la solicitud
      alert('Error al actualizar el evento.');
    });
}

function cancelEdit() {
  document.getElementById('editForm').style.display = 'none';
}
