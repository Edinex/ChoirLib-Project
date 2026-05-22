// =============================== //
// CHOIRLIB — SONG DETAIL LOGIC    //
// =============================== //


// Track playing state for audio
let isPlaying = { 1: false, 2: false }
let audioTimers = {}


// =============================== //
// LOAD SONG DATA                  //
// =============================== //
window.addEventListener('load', function() {


  // Get song ID from localStorage
  const songId = localStorage.getItem('currentSong')


  // Find song in our database
  const song = songs.find(function(s) {
    return s.id === songId
  })


  // If song not found go back
  if (!song) {
    goBack()
    return
  }


  // Fill in song details
  document.getElementById('hero-emoji').textContent   = song.emoji
  document.getElementById('detail-title').textContent = song.title
  document.getElementById('detail-composer').textContent =
    song.composer + (song.arranger ?
      ' · Arr. ' + song.arranger : '')
  document.getElementById('pdf-name').textContent =
    song.title.replace(/ /g, '_') + '_SATB.pdf'
  document.title = 'ChoirLib — ' + song.title


  // Build tags
  const tagsRow = document.getElementById('tags-row')
  tagsRow.innerHTML = `
    <span class="tag tag-purple">
      ${song.voicePart.toUpperCase()}
    </span>
    <span class="tag">
      ${song.genre.charAt(0).toUpperCase()
        + song.genre.slice(1)}
    </span>
    <span class="tag">${song.language}</span>
    <span class="tag ${song.access === 'free'
      ? 'tag-green'
      : song.access === 'paid'
      ? 'tag-gold'
      : 'tag-purple'}">
      ${song.access === 'free' ? 'FREE'
        : song.access === 'paid' ? '$' + song.price
        : '🔒 Protected'}
    </span>
  `


  // Load lyrics
  document.getElementById('lyrics-box').textContent =
    getLyrics(songId)


  // Show paid overlay if needed
  if (song.access === 'paid') {
    document.getElementById('paid-price').textContent =
      song.price
    document.getElementById('paid-overlay')
      .classList.remove('hidden')
  }


})


// =============================== //
// LYRICS DATABASE                 //
// =============================== //
function getLyrics(songId) {


  const lyricsDB = {
    'ave-maria': `Ave Maria, gratia plena
Maria, gratia plena
Maria, gratia plena
Ave, ave dominus
Dominus tecum


Benedicta tu in mulieribus
Et benedictus
Et benedictus fructus ventris
Ventris tuae, Jesus`,


    'amazing-grace': `Amazing grace how sweet the sound
That saved a wretch like me
I once was lost but now am found
Was blind but now I see


'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed`,


    'hallelujah': `Hallelujah! Hallelujah!
Hallelujah! Hallelujah!
Hallelujah!


For the Lord God Omnipotent reigneth
Hallelujah! Hallelujah!
Hallelujah! Hallelujah!


The kingdom of this world
Is become the kingdom of our Lord
And of His Christ, and of His Christ`,


    'viens-jesus': `Viens Jésus, viens dans nos cœurs
Remplis-nous de ta grâce
Viens Seigneur, viens aujourd'hui
Et prends toute la place


Ton amour est éternel
Ta gloire remplit la terre
Nous te louons ô Dieu vivant
Pour toujours et à jamais`,
  }


  return lyricsDB[songId]
    || 'Lyrics not available for this song yet.'


}


// =============================== //
// TAB SWITCHING                   //
// =============================== //
document.querySelectorAll('.tab')
  .forEach(function(tab) {


    tab.addEventListener('click', function() {


      // Check if content is locked
      const song = songs.find(function(s) {
        return s.id === localStorage.getItem('currentSong')
      })


      if (song && song.access === 'paid') {
        document.getElementById('paid-overlay')
          .classList.remove('hidden')
        return
      }


      // Remove active from all tabs
      document.querySelectorAll('.tab')
        .forEach(function(t) {
          t.classList.remove('active')
        })


      // Remove active from all tab contents
      document.querySelectorAll('.tab-content')
        .forEach(function(c) {
          c.classList.remove('active')
        })


      // Activate clicked tab
      this.classList.add('active')
      document.getElementById(
        'tab-' + this.dataset.tab
      ).classList.add('active')


    })


  })


// =============================== //
// NOTATION TOGGLE                 //
// =============================== //
document.getElementById('btn-staff')
  .addEventListener('click', function() {
    this.classList.add('active')
    document.getElementById('btn-solfa')
      .classList.remove('active')
    document.getElementById('pdf-name')
      .textContent = 'Staff_Notation_SATB.pdf'
  })


document.getElementById('btn-solfa')
  .addEventListener('click', function() {
    this.classList.add('active')
    document.getElementById('btn-staff')
      .classList.remove('active')
    document.getElementById('pdf-name')
      .textContent = 'Solfa_Notation_SATB.pdf'
  })


// =============================== //
// SAVE / FAVOURITE BUTTON         //
// =============================== //
document.getElementById('btn-save')
  .addEventListener('click', function() {


    const icon = document.getElementById('save-icon')


    if (this.classList.contains('saved')) {
      this.classList.remove('saved')
      icon.className = 'fa-regular fa-heart'
    } else {
      this.classList.add('saved')
      icon.className = 'fa-solid fa-heart'
    }


  })


// =============================== //
// AUDIO PLAYER (MOCK)             //
// =============================== //
function togglePlay(trackNum) {


  const playBtn  = document.getElementById(
    'btn-play-' + trackNum
  )
  const playIcon = document.getElementById(
    'play-icon-' + trackNum
  )
  const fillBar  = document.getElementById(
    'audio-fill-' + trackNum
  )
  const timeEl   = document.getElementById(
    'audio-time-' + trackNum
  )


  if (isPlaying[trackNum]) {


    // Pause
    isPlaying[trackNum]  = false
    playIcon.className   = 'fa-solid fa-play'
    playBtn.classList.remove('playing')
    clearInterval(audioTimers[trackNum])


  } else {


    // Play — simulate progress
    isPlaying[trackNum] = true
    playIcon.className  = 'fa-solid fa-pause'
    playBtn.classList.add('playing')


    let seconds = 0
    const total = 208 // 3:28 in seconds


    audioTimers[trackNum] = setInterval(function() {


      seconds++


      // Update progress bar
      const percent = (seconds / total) * 100
      fillBar.style.width = percent + '%'


      // Update time display
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      timeEl.textContent = mins + ':'
        + (secs < 10 ? '0' : '') + secs


      // Stop at end
      if (seconds >= total) {
        clearInterval(audioTimers[trackNum])
        isPlaying[trackNum] = false
        playIcon.className  = 'fa-solid fa-play'
        playBtn.classList.remove('playing')
        fillBar.style.width = '0%'
        timeEl.textContent  = '0:00'
        seconds = 0
      }


    }, 1000)


  }


}


// =============================== //
// DOWNLOAD BUTTON                 //
// =============================== //
document.getElementById('btn-download')
  .addEventListener('click', function() {


    const songId = localStorage.getItem('currentSong')
    const song   = songs.find(function(s) {
      return s.id === songId
    })


    if (song && song.access === 'free') {


      // Update download count
      let count = parseInt(
        localStorage.getItem('downloadCount') || 0
      )
      count++
      localStorage.setItem('downloadCount', count)


      alert('Downloading ' + song.title + '! 📥\n'
        + 'Total downloads: ' + count)


    } else {
      document.getElementById('paid-overlay')
        .classList.remove('hidden')
    }


  })


// =============================== //
// VIEW PDF BUTTON                 //
// =============================== //
document.getElementById('btn-view-pdf')
  .addEventListener('click', function() {
    alert('PDF viewer coming soon! 📄\n'
      + 'Will open sheet music in full screen.')
  })


// =============================== //
// CONVERT BUTTON                  //
// =============================== //
document.getElementById('btn-convert')
  .addEventListener('click', function() {
    alert('Staff ↔ Sol-fa converter coming soon! 🎼')
  })


// =============================== //
// SHARE BUTTON                    //
// =============================== //
document.getElementById('btn-share')
  .addEventListener('click', function() {


    const song = songs.find(function(s) {
      return s.id === localStorage.getItem('currentSong')
    })


    if (navigator.share) {
      navigator.share({
        title: song.title + ' — ChoirLib',
        text:  'Check out ' + song.title
          + ' on ChoirLib!',
        url:   window.location.href,
      })
    } else {
      alert('Share: ' + song.title + ' — ChoirLib 🎵')
    }


  })


// =============================== //
// PURCHASE BUTTON                 //
// =============================== //
document.getElementById('btn-purchase')
  .addEventListener('click', function() {
    alert('Payment system coming soon! 💳\n'
      + 'Stripe + MTN Money + Orange Money')
  })