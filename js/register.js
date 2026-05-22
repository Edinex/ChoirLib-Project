// =============================== //
// CHOIRLIB — REGISTER PAGE LOGIC  //
// =============================== //


// --- Toggle password visibility ---
document.getElementById('toggle-password')
  .addEventListener('click', function() {


    const passwordInput = document.getElementById('password')
    const pwIcon        = document.getElementById('pw-icon')


    if (passwordInput.type === 'password') {
      passwordInput.type  = 'text'
      pwIcon.className    = 'fa-solid fa-eye-slash'
    } else {
      passwordInput.type  = 'password'
      pwIcon.className    = 'fa-solid fa-eye'
    }


  })


// --- Password strength checker ---
document.getElementById('password')
  .addEventListener('input', function() {


    const password    = this.value
    const strengthBar = document.getElementById('strength-fill')
    const strengthTxt = document.getElementById('strength-text')


    let strength = 0


    if (password.length >= 8)           strength++
    if (password.match(/[A-Z]/))        strength++
    if (password.match(/[0-9]/))        strength++
    if (password.match(/[^A-Za-z0-9]/)) strength++


    if (password.length === 0) {
      strengthBar.style.width     = '0%'
      strengthTxt.textContent     = ''


    } else if (strength === 1) {
      strengthBar.style.width      = '25%'
      strengthBar.style.background = '#DC2626'
      strengthTxt.style.color      = '#DC2626'
      strengthTxt.textContent      = 'Weak — add numbers and symbols'


    } else if (strength === 2) {
      strengthBar.style.width      = '50%'
      strengthBar.style.background = '#D97706'
      strengthTxt.style.color      = '#D97706'
      strengthTxt.textContent      = 'Fair — add uppercase letters'


    } else if (strength === 3) {
      strengthBar.style.width      = '75%'
      strengthBar.style.background = '#2563EB'
      strengthTxt.style.color      = '#2563EB'
      strengthTxt.textContent      = 'Good — almost there!'


    } else if (strength === 4) {
      strengthBar.style.width      = '100%'
      strengthBar.style.background = '#16A34A'
      strengthTxt.style.color      = '#16A34A'
      strengthTxt.textContent      = 'Strong password! ✓'
    }


  })


// --- Form validation ---
document.getElementById('btn-submit-register')
  .addEventListener('click', function() {


    const firstName = document.getElementById('first-name').value.trim()
    const lastName  = document.getElementById('last-name').value.trim()
    const email     = document.getElementById('email').value.trim()
    const password  = document.getElementById('password').value
    const errorBox  = document.getElementById('register-error')
    const errorText = document.getElementById('register-error-text')


    // Validation
    if (firstName === '') {
      errorText.textContent = 'Please enter your first name'
      errorBox.classList.remove('hidden')
      return
    }


    if (lastName === '') {
      errorText.textContent = 'Please enter your last name'
      errorBox.classList.remove('hidden')
      return
    }


    if (email === '') {
      errorText.textContent = 'Please enter your email address'
      errorBox.classList.remove('hidden')
      return
    }


    if (!email.includes('@') || !email.includes('.')) {
      errorText.textContent = 'Please enter a valid email address'
      errorBox.classList.remove('hidden')
      return
    }


    if (password.length < 8) {
      errorText.textContent = 'Password must be at least 8 characters'
      errorBox.classList.remove('hidden')
      return
    }


    // All good!
    errorBox.classList.add('hidden')


    // Save user data temporarily
    localStorage.setItem('newUser', JSON.stringify({
      firstName : firstName,
      lastName  : lastName,
      email     : email,
    }))


    // Go to profile setup
    alert('Welcome ' + firstName + '! 🎉')
    setTimeout(function(){
      goToProfileSetup() },800)


  })
