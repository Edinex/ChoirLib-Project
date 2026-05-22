// =============================== //
// CHOIRLIB — AUTHENTICATION       //
// =============================== //


// =============================== //
// REGISTER NEW USER               //
// =============================== //
async function registerUser(
  firstName,
  lastName,
  email,
  password
) {


  try {


    // Step 1 — Create auth account in Supabase
    const { data, error } = await db.auth.signUp({
      email:    email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name:  lastName,
        }
      }
    })


    // Check for errors
    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    // Step 2 — Save extra user info to users table
    const { error: profileError } = await db
      .from('users')
      .insert({
        id:         data.user.id,
        first_name: firstName,
        last_name:  lastName,
        email:      email,
        role:       'member',
        created_at: new Date().toISOString(),
      })


    if (profileError) {
      console.error('Profile save error:',
        profileError.message)
    }


    return {
      success: true,
      user:    data.user,
      message: 'Account created successfully!'
    }


  } catch (err) {
    return {
      success: false,
      message: 'Something went wrong. Please try again.'
    }
  }


}


// =============================== //
// LOGIN USER                      //
// =============================== //
async function loginUser(email, password) {


  try {


    const { data, error } = await db.auth.signInWithPassword({
      email:    email,
      password: password,
    })


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    // Save user to localStorage for easy access
    localStorage.setItem(
      'loggedInUser',
      JSON.stringify({
        id:        data.user.id,
        email:     data.user.email,
        firstName: data.user.user_metadata.first_name,
        lastName:  data.user.user_metadata.last_name,
      })
    )


    return {
      success: true,
      user:    data.user,
      message: 'Login successful!'
    }


  } catch (err) {
    return {
      success: false,
      message: 'Something went wrong. Please try again.'
    }
  }


}


// =============================== //
// LOGOUT USER                     //
// =============================== //
async function logoutUser() {


  try {


    const { error } = await db.auth.signOut()


    if (error) {
      console.error('Logout error:', error.message)
      return false
    }


    // Clear localStorage
    localStorage.removeItem('loggedInUser')
    localStorage.removeItem('newUser')


    return true


  } catch (err) {
    console.error('Logout error:', err)
    return false
  }


}


// =============================== //
// GET CURRENT USER                //
// =============================== //
async function getCurrentUser() {


  try {


    const { data, error } = await db.auth.getUser()


    if (error || !data.user) {
      return null
    }


    return data.user


  } catch (err) {
    return null
  }


}


// =============================== //
// RESET PASSWORD                  //
// =============================== //
async function resetPassword(email) {


  try {


    const { error } = await db.auth
      .resetPasswordForEmail(email, {
        redirectTo: window.location.origin
          + '/pages/reset-password.html',
      })


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    return {
      success: true,
      message: 'Password reset email sent! '
        + 'Check your inbox.'
    }


  } catch (err) {
    return {
      success: false,
      message: 'Something went wrong.'
    }
  }


}


// =============================== //
// SAVE PROFILE SETUP              //
// =============================== //
async function saveProfile(
  userId,
  displayName,
  voicePart,
  role
) {


  try {


    const { error } = await db
      .from('users')
      .update({
        display_name:     displayName,
        voice_part:       voicePart,
        role:             role,
        profile_complete: true,
      })
      .eq('id', userId)


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    return {
      success: true,
      message: 'Profile saved!'
    }


  } catch (err) {
    return {
      success: false,
      message: 'Could not save profile.'
    }
  }


}


// =============================== //
// CHECK IF USER IS LOGGED IN      //
// =============================== //
async function requireLogin() {


  const user = await getCurrentUser()


  if (!user) {
    // Redirect to welcome if not logged in
    goToWelcome()
    return false
  }


  return true


}
