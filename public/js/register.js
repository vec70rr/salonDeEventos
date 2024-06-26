function Registrar() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const valores = {
    username: user,
    password: pass,
  };
  var options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(valores),
  };
  fetch("http://localhost/SalonEventos/register.php", options)
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      if (res === "Usuario registrado con exito") {
        alert("Registro exitoso");
        window.location.href = "http://localhost:3000/login.html";
      } else {
        alert(res);
      }
    });
}
