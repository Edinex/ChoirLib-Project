// =============================== //
// CHOIRLIB — WELCOME PAGE LOGIC   //
// =============================== //


// Create Account button
document.getElementById('btn-register')
  .addEventListener('click', function() {
    goToRegister()
  })


// Sign In button
document.getElementById('btn-login')
  .addEventListener('click', function() {
    goToLogin()
  })


// Guest button
document.getElementById('btn-guest')
  .addEventListener('click', function() {
    goToHome()
  })
