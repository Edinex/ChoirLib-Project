// =============================== //
// CHOIRLIB — JAVASCRIPT            //
// =============================== //


// ---- SCREEN NAVIGATION ---- //


// This function shows one screen
// and hides all the others
function showScreen(screenId) {


  // Step 1 — Find ALL screens
  const allScreens = document.querySelectorAll('.screen')


  // Step 2 — Hide every screen
  allScreens.forEach(function(screen) {
    screen.classList.remove('active')
  })


  // Step 3 — Show only the one we want
  const targetScreen = document.getElementById(screenId)
  targetScreen.classList.add('active')


}


// ---- SPLASH SCREEN TIMER ---- //


// When the page loads, show splash screen
// then automatically go to welcome after 3 seconds
window.addEventListener('load', function() {


  // Show splash screen first
  showScreen('splash-screen')


  // After 3 seconds go to welcome screen
  setTimeout(function() {
    showScreen('welcome-screen')
  }, 3000)


})


// ---- BUTTON CLICK EVENTS ---- //


// When user clicks "Create an Account"
document.getElementById('btn-register').addEventListener('click', function() {
  alert('Register screen coming soon!')
})


// When user clicks "Sign In"
document.getElementById('btn-login').addEventListener('click', function() {
  alert('Login screen coming soon!')
})


// When user clicks "Continue as Guest"
document.getElementById('btn-guest').addEventListener('click', function() {
  alert('Home screen coming soon!')
})