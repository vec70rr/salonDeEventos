
function validarLogin(){
    var email = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if(email == "usuario1" && password == "pass1234"){
        window.location.href = "create_event.html";
    }
    else{
        alert("Usuario o contraseña incorrecta");
    }

}