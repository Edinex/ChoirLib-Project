// =============================== //
// CHOIRLIB — PROFILE SETUP LOGIC  //
// =============================== //


// --- Load user name into display field ---
window.addEventListener('load', function() {


  const storedUser = localStorage.getItem('newUser')


  if (storedUser) {
    const user = JSON.parse(storedUser)
    document.getElementById('display-name').value =
      user.firstName + ' ' + user.lastName
  }


})


// --- Avatar upload ---
document.getElementById('avatar-ring')
  .addEventListener('click', function() {
    document.getElementById('avatar-input').click()
  })


document.getElementById('avatar-input')
  .addEventListener('change', function() {


    const file = this.files[0]


    if (file) {
      const reader = new FileReader()


      reader.onload = function(e) {
        const preview = document.getElementById('avatar-preview')
        const icon    = document.getElementById('avatar-icon')


        // Show image, hide icon
        preview.src = e.target.result
        preview.classList.remove('hidden')
        icon.classList.add('hidden')
      }


      reader.readAsDataURL(file)
    }


  })


// --- Voice part chip selection ---
// Only one chip can be selected at a time
document.getElementById('voice-chips')
  .addEventListener('click', function(e) {


    // Check if a chip was clicked
    if (e.target.classList.contains('chip')) {


      // Remove selected from all chips
      const allChips = this.querySelectorAll('.chip')
      allChips.forEach(function(chip) {
        chip.classList.remove('selected')
      })


      // Select the clicked chip
      e.target.classList.add('selected')
    }


  })


// --- Role chip selection ---
document.getElementById('role-chips')
  .addEventListener('click', function(e) {


    if (e.target.classList.contains('chip')) {


      const allChips = this.querySelectorAll('.chip')
      allChips.forEach(function(chip) {
        chip.classList.remove('selected')
      })


      e.target.classList.add('selected')
    }


  })


// --- Join choir button ---
document.getElementById('btn-join-choir')
  .addEventListener('click', function() {


    const code      = document.getElementById('choir-code').value.trim()
    const hintBox   = document.getElementById('choir-hint')


    if (code === '') {
      hintBox.textContent  = 'Please enter an invite code'
      hintBox.className    = 'choir-hint error'
      return
    }


    // Demo codes for testing
    // Later this will check Supabase database
    const validCodes = {
      'CHOIR001': 'St. Joseph\'s Cathedral Choir',
      'CHOIR002': 'Youth Praise Ensemble',
      'CHOIR003': 'Divine Harmony Choir',
    }


    if (validCodes[code.toUpperCase()]) {
      hintBox.textContent = '✓ Joined ' + validCodes[code.toUpperCase()]
      hintBox.className   = 'choir-hint success'


      // Save choir to user data
      const storedUser = localStorage.getItem('newUser')
      if (storedUser) {
        const user  = JSON.parse(storedUser)
        user.choir  = validCodes[code.toUpperCase()]
        localStorage.setItem('newUser', JSON.stringify(user))
      }


    } else {
      hintBox.textContent = '✗ Invalid invite code'
      hintBox.className   = 'choir-hint error'
    }


  })


// --- Complete Setup button ---
document.getElementById('btn-complete-setup')
  .addEventListener('click', function() {


    const displayName = document.getElementById('display-name').value.trim()
    const errorBox    = document.getElementById('setup-error')
    const errorText   = document.getElementById('setup-error-text')


    // Get selected voice part
    const selectedVoice = document.querySelector(
      '#voice-chips .chip.selected'
    )


    // Get selected role
    const selectedRole = document.querySelector(
      '#role-chips .chip.selected'
    )


    // Validation
    if (displayName === '') {
      errorText.textContent = 'Please enter your display name'
      errorBox.classList.remove('hidden')
      return
    }


    if (!selectedVoice) {
      errorText.textContent = 'Please select your voice part'
      errorBox.classList.remove('hidden')
      return
    }


    if (!selectedRole) {
      errorText.textContent = 'Please select your role'
      errorBox.classList.remove('hidden')
      return
    }


    // All good — save profile
    errorBox.classList.add('hidden')


    const storedUser = localStorage.getItem('newUser')
    const user       = storedUser ? JSON.parse(storedUser) : {}


    // Add profile info to user data
    user.displayName = displayName
    user.voicePart   = selectedVoice.dataset.value
    user.role        = selectedRole.dataset.value
    user.profileComplete = true


    // Save updated user
    localStorage.setItem('newUser', JSON.stringify(user))
    localStorage.setItem('loggedInUser', JSON.stringify(user))


    // Go to home screen!
    alert('Profile complete! Welcome to ChoirLib, '
      + user.firstName + '! 🎉')


    setTimeout(function() {
      goToHome()
    }, 800)


  })