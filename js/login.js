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
  .addEventListener('click', async function() {


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


    // Show loading state
    const signInBtn = document
      .getElementById('btn-sign-in')
    signInBtn.textContent = 'Signing in...'
    signInBtn.disabled    = true

    // Check if Supabase is connected
    if (typeof db !== 'undefined'
      && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {

      // Use real Supabase login
      const result = await loginUser(email, password)

      if (result.success) {

        successText.textContent =
          'Welcome back! 🎉'
        successBox.classList.remove('hidden')

        setTimeout(function() {
          goToHome()
        }, 1500)

      } else {

        errorText.textContent  = result.message
        errorBox.classList.remove('hidden')
        signInBtn.textContent  = 'Sign In'
        signInBtn.disabled     = false

      }

    } else {

      // Supabase not connected yet
      // Use localStorage fallback
      const storedUser =
        localStorage.getItem('newUser')

      if (storedUser) {

        const user = JSON.parse(storedUser)

        if (user.email === email) {

          successText.textContent =
            'Welcome back, '
            + user.firstName + '! 🎉'
          successBox.classList.remove('hidden')

          localStorage.setItem(
            'loggedInUser',
            JSON.stringify(user)
          )

          setTimeout(function() {
            goToHome()
          }, 1500)

        } else {

          errorText.textContent =
            'Email or password is incorrect'
          errorBox.classList.remove('hidden')
          signInBtn.textContent = 'Sign In'
          signInBtn.disabled    = false

        }

      } else {

        errorText.textContent =
          'No account found. '
          + 'Please create an account first.'
        errorBox.classList.remove('hidden')
        signInBtn.textContent = 'Sign In'
        signInBtn.disabled    = false

      }

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