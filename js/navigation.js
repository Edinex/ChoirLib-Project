// =============================== //
// CHOIRLIB — NAVIGATION           //
// =============================== //


// This function navigates to any page
function goTo(page) {
  window.location.href = page
}


// Shortcut functions for each page
function goToSplash()    { goTo('splash.html')    }
function goToWelcome()   { goTo('welcome.html')   }
function goToRegister()  { goTo('register.html')  }
function goToLogin()     { goTo('login.html')     }
function goToHome()      { goTo('home.html')      }
function goToLibrary()   { goTo('library.html')   }
function goToProfile()   { goTo('profile.html')   }
function goToCommunity() { goTo('community.html') }
function goToProfileSetup(){goTo('profile-setup.html')}
function goToNotifications(){goTo('notifications.html')}
function goToSongDetail(){goTo('song-detail.html')}

// Go back to previous page
function goBack() {
  window.history.back()
}
