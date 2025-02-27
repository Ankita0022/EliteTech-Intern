const API_URL = "http://localhost:5000/api/auth";

async function register() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    alert(data.message);

    if (response.status === 201) {
        window.location.href = "login.html"; 
    }
}

async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.status === 200) {
        localStorage.setItem("token", data.token);
        alert(data.message);
        window.location.href = "secure.html";
    } else {
        alert(data.message);
    }
}
