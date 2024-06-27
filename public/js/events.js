document.addEventListener("DOMContentLoaded", () => {
  /*fetch('/events')
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
    });*/
  let usuario = window.localStorage.getItem("usuario");
  const valores = {
    usuario: usuario,
  };
  var options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(valores),
  };
  fetch("http://localhost/SalonEventos/obtenerEventos.php", options)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      console.log(res);
      let eventos = res.dataArray;
      eventos.forEach((event) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Tipo de evento: ${event.nombre}, Fecha: ${event.fecha}, Hora: ${event.hora}`;
        listItem.setAttribute("data-event-id", event.id_evento); // Añadir un atributo de data para identificar el evento
        listItem.addEventListener("click", () => showEditForm(event)); // Mostrar formulario al hacer clic
        eventItems.appendChild(listItem);
      });
    });
});

function showEditForm(event) {
  const editForm = document.getElementById("editForm");
  const editEventType = document.getElementById("editEventType");
  const editEventDate = document.getElementById("editEventDate");
  const editEventTime = document.getElementById("editEventTime");
  const eventIdInput = document.getElementById("eventId");

  // Llenar el formulario con los detalles del evento seleccionado
  editEventType.value = event.id_tipoevento;
  editEventDate.value = event.fecha;
  editEventTime.value = event.hora;
  eventIdInput.value = event.id_evento;

  // Mostrar el formulario de edición
  editForm.style.display = "block";

  let salon = document.getElementById("dropzone");
  while (salon.firstChild) {
    salon.removeChild(salon.firstChild);
  }
  salon.style.display = "block";
  const valores = {
    id: event.id_evento,
  };
  var options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(valores),
  };
  fetch("http://localhost/SalonEventos/obtenerElementos.php", options)
    .then((response) => {
      return response.json();
    })
    .then((res) => {
      console.log(res);
      let mesas = res.mesas;
      let elementos = res.elementos;

      mesas.forEach((mesa) => {
        let temp = document.createElement("img");
        temp.setAttribute("name", "Mesa");
        temp.setAttribute("src", "img/mesa.jpeg");
        temp.style.setProperty("position", "absolute");
        temp.style.setProperty("left", mesa.posx + "px");
        temp.style.setProperty("top", mesa.posy + "px");
        salon.appendChild(temp);
      });

      elementos.forEach((elemento) => {
        let temp = document.createElement("img");
        temp.setAttribute("name", elemento.nombre);
        switch (elemento.nombre) {
          case "Mesero":
            temp.setAttribute("src", "img/mesero.jpg");
            break;
          case "Grupo Musical":
            temp.setAttribute("src", "img/grupoMusical.jpg");
            break;
          case "Pista":
            temp.setAttribute("src", "img/pistaBaile.webp");
            break;
          case "Bocina":
            temp.setAttribute("src", "img/bocina.jpg");
            break;
        }

        temp.style.setProperty("position", "absolute");
        temp.style.setProperty("left", elemento.posx + "px");
        temp.style.setProperty("top", elemento.posy + "px");
        salon.appendChild(temp);
      });
    });
}

function updateEvent() {
  const eventEditForm = document.getElementById("eventEditForm");
  const eventId = eventEditForm.elements["eventId"].value;
  const editEventType = eventEditForm.elements["editEventType"].value;
  const editEventDate = eventEditForm.elements["editEventDate"].value;
  const editEventTime = eventEditForm.elements["editEventTime"].value;

  // Verifica que eventId no sea undefined o vacío antes de continuar
  /*if (!eventId) {
    alert(
      "Error: No se puede actualizar el evento. Identificador de evento no encontrado."
    );
    return;
  }*/

  // Aquí estás enviando una solicitud PUT al servidor
  /*fetch(`/update-event/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventType: editEventType,
      eventDate: editEventDate,
      eventTime: editEventTime,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Evento actualizado correctamente.");
        // Opcional: Ocultar el formulario de edición después de actualizar
        document.getElementById("editForm").style.display = "none";
      } else {
        alert("Error al actualizar el evento."); // Este alert se muestra si hay un error en la respuesta
      }
    })
    .catch((error) => {
      console.error("Error updating event:", error); // Este console.error se muestra si ocurre un error en la solicitud
      alert("Error al actualizar el evento.");
    });*/

  const valores = {
    id_evento: eventId,
    hora: editEventTime,
    fecha: editEventDate,
    tipoE: editEventType,
  };
  var options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(valores),
  };
  fetch("http://localhost/SalonEventos/actualizarEvento.php", options)
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      if (res === "Evento actualizado con exito") {
        alert("Datos actualizados correctamente");
        window.location.href = "http://localhost:3000/events.html";
      } else {
        alert(res);
      }
    });
}

function cancelEdit() {
  document.getElementById("editForm").style.display = "none";
}
