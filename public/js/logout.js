function CerrarSesion() {
  window.localStorage.setItem("usuario", "");
  window.location.href = "http://localhost:3000/index.html";
}
