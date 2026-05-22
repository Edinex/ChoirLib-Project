// =============================== //
// CHOIRLIB — LOGIN PAGE LOGIC     //
// =============================== //


// --- Toggle password visibility ---
document.getElementById('toggle-login-pw')
  .addEventListener('click', function() {


    const pwInput = document.getElementById('login-password')
    const pwIcon  = document.getElementById('login-pw-icon')


    if (pwInput.type === 'password') {
      pwInput.type     = 'text'
      pwIcon.className = 'fa-solid fa-eye-slash'
    } else {
      pwInput.type     = 'password'
      pwIcon.className = 'fa-solid fa-eye'
    }


  })


// --- Sign In button ---
document.getElementById('btn-sign-in')
  .addEventListener('click', function() {


    // Read what user typed
    const email    = document.getElementById('login-email').value.trim()
    const password = document.getElementById('login-password').value


    // Get message boxes
    const errorBox     = document.getElementById('login-error')
    const errorText    = document.getElementById('login-error-text')
    const successBox   = document.getElementById('login-success')
    const successText  = document.getElementById('login-success-text')


    // Hide both boxes first
    errorBox.classList.add('hidden')
    successBox.classList.add('hidden')


    // --- Validation ---


    // Check 1 — Email empty?
    if (email === '') {
      errorText.textContent = 'Please enter your email address'
      errorBox.classList.remove('hidden')
      return
    }


    // Check 2 — Email format valid?
    if (!email.includes('@') || !email.includes('.')) {
      errorText.textContent = 'Please enter a valid email address'
      errorBox.classList.remove('hidden')
      return
    }


    // Check 3 — Password empty?
    if (password === '') {
      errorText.textContent = 'Please enter your password'
      errorBox.classList.remove('hidden')
      return
    }


    // Check 4 — Password too short?
    if (password.length < 8) {
      errorText.textContent = 'Password must be at least 8 characters'
      errorBox.classList.remove('hidden')
      return
    }


    // --- Check against stored user ---
    // (Later this will check Supabase database)
    const storedUser = localStorage.getItem('newUser')


    if (storedUser) {


      // Parse the stored user data
      const user = JSON.parse(storedUser)


      // Check if email matches
      if (user.email === email) {


        // Login successful!
        successText.textContent =
          'Welcome back, ' + user.firstName + '! 🎉'
        successBox.classList.remove('hidden')


        // Store logged in user
        localStorage.setItem('loggedInUser',
          JSON.stringify(user)
        )


        // Go to home page after 1.5 seconds
        setTimeout(function() {
          goToHome()
        }, 1500)


      } else {


        // Email doesn't match
        errorText.textContent =
          'Email or password is incorrect'
        errorBox.classList.remove('hidden')


      }


    } else {


      // No user registered yet
      errorText.textContent =
        'No account found. Please create an account first.'
      errorBox.classList.remove('hidden')


    }


  })


// --- Forgot password ---
document.getElementById('btn-forgot-password')
  .addEventListener('click', function() {
    alert('Password reset coming soon! 📧')
  })


// --- Google login ---
document.getElementById('btn-google-login')
  .addEventListener('click', function() {
    alert('Google login coming soon! 🌐')
  })


// --- Facebook login ---
document.getElementById('btn-facebook-login')
  .addEventListener('click', function() {
    alert('Facebook login coming soon! 📘')
  })