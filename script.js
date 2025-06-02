let isLogin = true;

function toggleForm() {
  isLogin = !isLogin;
  document.getElementById("form-title").innerText = isLogin ? "Login" : "Sign Up";
  document.getElementById("confirm-password").style.display = isLogin ? "none" : "block";
  document.getElementById("message").innerText = "";
}

function handleSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (!isLogin && password !== confirm) {
    document.getElementById("message").innerText = "Passwords do not match.";
    return false;
  }

  if (isLogin) {
    alert("Logged in successfully (simulated).");
  } else {
    alert("Account created (simulated).");
  }

  document.getElementById("auth-form").reset();
  return false;
}
