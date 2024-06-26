function Iniciar() {
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
  fetch("http://localhost/SalonEventos/login.php", options)
    .then((response) => {
      return response.text();
    })
    .then((res) => {
      console.log(res);
    });
}