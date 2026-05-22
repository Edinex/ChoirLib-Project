// =============================== //
// CHOIRLIB — HOME PAGE LOGIC      //
// =============================== //


// --- Load user greeting ---
window.addEventListener('load', function() {


  // Get logged in user
  const storedUser = localStorage.getItem('loggedInUser')
    || localStorage.getItem('newUser')


  if (storedUser) {
    const user = JSON.parse(storedUser)


    // Set greeting name
    document.getElementById('user-greeting').textContent =
      user.firstName || user.displayName || 'Chorister'


    // Set greeting based on time of day
    const hour     = new Date().getHours()
    const greeting = document.querySelector('.greeting-hi')


    if (hour < 12) {
      greeting.textContent = 'Good morning,'
    } else if (hour < 17) {
      greeting.textContent = 'Good afternoon,'
    } else {
      greeting.textContent = 'Good evening,'
    }


    // Load download count
    const downloads = localStorage.getItem('downloadCount') || 0
    document.getElementById('stat-downloads').textContent =
      downloads


  }


})


// --- Navigation buttons ---
document.getElementById('btn-notifications')
  .addEventListener('click', function() {
    goToNotifications()
  })


document.getElementById('btn-profile')
  .addEventListener('click', function() {
    goToProfile()
  })


document.getElementById('btn-try-ai')
  .addEventListener('click', function() {
    alert('AI Composition Assistant coming soon! 🎤')
  })


// --- Song detail navigation ---
function goToSongDetail(songId) {
  // Save which song was clicked
  localStorage.setItem('currentSong', songId)
  goTo('song-detail.html')
}


// --- Bottom nav active state ---
document.getElementById('bnav-home')
  .addEventListener('click', function() {
    setActiveNav('bnav-home')
  })


function setActiveNav(activeId) {
  // Remove active from all
  const allBtns = document.querySelectorAll('.bnav-item')
  allBtns.forEach(function(btn) {
    btn.classList.remove('active')
  })


  // Set active on clicked
  document.getElementById(activeId)
    .classList.add('active')
}