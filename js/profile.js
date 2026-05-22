// =============================== //
// CHOIRLIB — PROFILE PAGE LOGIC   //
// =============================== //


// =============================== //
// LOAD USER DATA                  //
// =============================== //
window.addEventListener('load', function() {


  const storedUser = localStorage.getItem('loggedInUser')
    || localStorage.getItem('newUser')


  if (storedUser) {


    const user = JSON.parse(storedUser)


    // Set name
    const fullName = (user.firstName || '')
      + ' ' + (user.lastName || '')
    document.getElementById('profile-name')
      .textContent = fullName.trim() || 'Your Name'


    // Set role
    const voicePart = user.voicePart
      ? user.voicePart.charAt(0).toUpperCase()
        + user.voicePart.slice(1)
      : 'Chorister'


    const role = user.role
      ? user.role.charAt(0).toUpperCase()
        + user.role.slice(1)
      : 'Member'


    document.getElementById('profile-role')
      .textContent = '🎵 ' + voicePart + ' · ' + role


    // Set download count
    const downloads = localStorage
      .getItem('downloadCount') || 0
    document.getElementById('profile-downloads')
      .textContent = downloads


    // Load downloads list
    loadDownloadsList()


  }


})


// =============================== //
// LOAD DOWNLOADS LIST             //
// =============================== //
function loadDownloadsList() {


  const count = parseInt(
    localStorage.getItem('downloadCount') || 0
  )


  const container = document
    .getElementById('downloads-list')
  const emptyState = document
    .getElementById('empty-downloads')


  if (count === 0) {
    emptyState.classList.remove('hidden')
    return
  }


  emptyState.classList.add('hidden')


  // Demo downloads based on count
  const demoDownloads = [
    { emoji: '🎵', title: 'Ave Maria — Schubert',
      date: '2 days ago' },
    { emoji: '🎶', title: 'Amazing Grace',
      date: '5 days ago' },
    { emoji: '🎼', title: 'Hallelujah Chorus',
      date: '1 week ago' },
  ]


  const toShow = demoDownloads.slice(0,
    Math.min(count, demoDownloads.length)
  )


  container.innerHTML = toShow.map(function(item) {
    return `
      <div class="download-item">
        <div class="download-icon">${item.emoji}</div>
        <div class="download-title">${item.title}</div>
        <div class="download-date">${item.date}</div>
        <div class="download-open">Open →</div>
      </div>
    `
  }).join('')


}


// =============================== //
// EDIT PROFILE BUTTON             //
// =============================== //
document.getElementById('btn-edit-profile')
  .addEventListener('click', function() {
    goToProfileSetup()
  })


// =============================== //
// TOGGLE SWITCHES                 //
// =============================== //
function setupToggle(toggleId) {


  const toggle = document.getElementById(toggleId)


  toggle.addEventListener('click', function() {
    this.classList.toggle('active')
  })


}


setupToggle('dark-mode-toggle')
setupToggle('notif-toggle')


// =============================== //
// SETTINGS ITEMS                  //
// =============================== //
document.getElementById('setting-subscription')
  .addEventListener('click', function() {
    alert('Subscription plans coming soon! 👑\n'
      + 'Premium — $4/month\n'
      + 'Choir Plan — $15/month')
  })


document.getElementById('setting-language')
  .addEventListener('click', function() {
    alert('Language options:\n'
      + '🇬🇧 English\n'
      + '🇫🇷 French\n'
      + '(More coming soon!)')
  })


document.getElementById('setting-privacy')
  .addEventListener('click', function() {
    alert('Privacy & Security settings coming soon! 🔒')
  })


document.getElementById('setting-help')
  .addEventListener('click', function() {
    alert('Help & FAQ coming soon! ❓\n'
      + 'Contact: support@choirlib.com')
  })


// =============================== //
// LOG OUT                         //
// =============================== //
document.getElementById('setting-logout')
  .addEventListener('click', function() {


    const confirm = window.confirm(
      'Are you sure you want to log out?'
    )


    if (confirm) {
      // Clear login data
      localStorage.removeItem('loggedInUser')


      // Go to welcome screen
      alert('You have been logged out. See you soon! 👋')
      goToWelcome()
    }


  })


// =============================== //
// ADD TO NAVIGATION               //
// =============================== //
// Make sure profile setup nav works
function goToProfileSetup() {
  goTo('profile-setup.html')
}