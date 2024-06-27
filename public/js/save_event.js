function saveEvent() {
  const eventType = document.getElementById("eventType").value;
  const eventDate = document.getElementById("eventDate").value;
  const eventTime = document.getElementById("eventTime").value;
  const dropzone = document.getElementById("dropzone");
  const elements = dropzone.querySelectorAll(".draggable");

  let elementos = [];

  let xmlDoc = document.implementation.createDocument(null, "event", null);
  let root = xmlDoc.documentElement;

  let typeElement = xmlDoc.createElement("eventType");
  typeElement.textContent = eventType;
  root.appendChild(typeElement);

  let dateElement = xmlDoc.createElement("eventDate");
  dateElement.textContent = eventDate;
  root.appendChild(dateElement);

  let timeElement = xmlDoc.createElement("eventTime");
  timeElement.textContent = eventTime;
  root.appendChild(timeElement);

  let configElement = xmlDoc.createElement("configuration");
  elements.forEach((element) => {
    let elem = xmlDoc.createElement("element");

    elem.setAttribute("type", element.textContent);
    elem.setAttribute("x", element.style.left);
    elem.setAttribute("y", element.style.top);
    configElement.appendChild(elem);
    let elemento = {
      tipo: element.textContent,
      posx: element.style.left.replace("px", ""),
      posy: element.style.top.replace("px", ""),
    };
    elementos.push(elemento);
  });
  root.appendChild(configElement);

  let serializer = new XMLSerializer();
  let xmlStr = serializer.serializeToString(xmlDoc);

  // Enviar el XML al servidor
  fetch("/save-event", {
    method: "POST",
    headers: {
      "Content-Type": "application/xml",
    },
    body: xmlStr,
  })
    .then((response) => {
      if (response.ok) {
        let usuario = window.localStorage.getItem("usuario");
        console.log(elementos);
        const valores = {
          usuario: usuario,
          hora: eventTime,
          fecha: eventDate,
          tipoE: eventType,
          elementos: elementos,
        };
        var options = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(valores),
        };
        fetch("http://localhost/SalonEventos/crearEvento.php", options)
          .then((response) => {
            return response.text();
          })
          .then((res) => {
            if (res === "Evento creado") {
              alert("Registro exitoso");
              //window.location.href = "http://localhost:3000/login.html";
            } else {
              alert(res);
            }
          });
        alert("Evento guardado con éxito.");
      } else {
        alert("Error al guardar el evento.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error al guardar el evento.");
    });
}
