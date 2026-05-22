// =============================== //
// CHOIRLIB — LIBRARY PAGE LOGIC   //
// =============================== //


// =============================== //
// SONG DATABASE                   //
// This will later come from       //
// Supabase — for now it's here    //
// =============================== //


const songs = [
  {
    id:         'ave-maria',
    title:      'Ave Maria',
    composer:   'Franz Schubert',
    genre:      'classical',
    voicePart:  'satb',
    language:   'Latin',
    access:     'free',
    price:      0,
    emoji:      '🎵',
  },
  {
    id:         'hallelujah',
    title:      'Hallelujah Chorus',
    composer:   'G.F. Handel',
    genre:      'gospel',
    voicePart:  'satb',
    language:   'English',
    access:     'free',
    price:      0,
    emoji:      '🎶',
  },
  {
    id:         'o-holy-night',
    title:      'O Holy Night',
    composer:   'Adolphe Adam',
    genre:      'classical',
    voicePart:  'satb',
    language:   'French',
    access:     'paid',
    price:      2,
    emoji:      '🎼',
  },
  {
    id:         'amazing-grace',
    title:      'Amazing Grace',
    composer:   'John Newton',
    genre:      'gospel',
    voicePart:  'soprano',
    language:   'English',
    access:     'free',
    price:      0,
    emoji:      '🎵',
  },
  {
    id:         'nkosi',
    title:      'Nkosi Sikeleli',
    composer:   'Enoch Sontonga',
    genre:      'traditional',
    voicePart:  'satb',
    language:   'Zulu',
    access:     'free',
    price:      0,
    emoji:      '🎶',
  },
  {
    id:         'sanctus',
    title:      'Sanctus',
    composer:   'Franz Schubert',
    genre:      'classical',
    voicePart:  'satb',
    language:   'Latin',
    access:     'free',
    price:      0,
    emoji:      '🎵',
  },
  {
    id:         'bless-the-lord',
    title:      'Bless The Lord',
    composer:   'J.P. Mballa',
    genre:      'gospel',
    voicePart:  'satb',
    language:   'English',
    access:     'paid',
    price:      1,
    emoji:      '🎼',
  },
  {
    id:         'gloria',
    title:      'Gloria in Excelsis',
    composer:   'Antonio Vivaldi',
    genre:      'classical',
    voicePart:  'satb',
    language:   'Latin',
    access:     'free',
    price:      0,
    emoji:      '🎶',
  },
  {
    id:         'gloire-a-dieu',
    title:      'Gloire à Dieu',
    composer:   'J.P. Mballa',
    genre:      'gospel',
    voicePart:  'satb',
    language:   'French',
    access:     'free',
    price:      0,
    emoji:      '🎵',
  },
  {
    id:         'kyrie',
    title:      'Kyrie Eleison',
    composer:   'W.A. Mozart',
    genre:      'classical',
    voicePart:  'satb',
    language:   'Latin',
    access:     'paid',
    price:      2,
    emoji:      '🎼',
  },
  {
    id:         'african-mass',
    title:      'African Mass',
    composer:   'J.P. Mballa',
    genre:      'traditional',
    voicePart:  'satb',
    language:   'Ewondo',
    access:     'protected',
    price:      0,
    emoji:      '🎶',
  },
  {
    id:         'viens-jesus',
    title:      'Viens Jésus',
    composer:   'Marie Tchamgoue',
    genre:      'gospel',
    voicePart:  'satb',
    language:   'French',
    access:     'free',
    price:      0,
    emoji:      '🎵',
  },
]


// =============================== //
// STATE — tracks current filters  //
// =============================== //
let currentGenre  = 'all'
let currentVoice  = 'all'
let currentSearch = ''
let currentSort   = 'recent'
let isGridView    = false


// =============================== //
// RENDER SONGS                    //
// =============================== //
function renderSongs(songsToShow) {


  const container  = document.getElementById('songs-list')
  const noResults  = document.getElementById('no-results')
  const countEl    = document.getElementById('results-count')


  // Update count
  countEl.textContent = songsToShow.length


  // No results?
  if (songsToShow.length === 0) {
    container.innerHTML = ''
    noResults.classList.remove('hidden')
    return
  }


  noResults.classList.add('hidden')


  // Build HTML for each song
  container.innerHTML = songsToShow.map(function(song) {


    // Badge HTML
    let badge = ''
    if (song.access === 'free') {
      badge = '<div class="song-badge badge-free">FREE</div>'
    } else if (song.access === 'paid') {
      badge = '<div class="song-badge badge-paid">$'
        + song.price + '</div>'
    } else if (song.access === 'protected') {
      badge = '<div class="song-badge badge-protected">🔒</div>'
    }


    // Highlight search term in title
    let title = song.title
    if (currentSearch) {
      const regex = new RegExp('(' + currentSearch + ')', 'gi')
      title = title.replace(regex,
        '<span class="highlight">$1</span>'
      )
    }


    return `
      <div class="song-card"
        onclick="openSong('${song.id}')">
        <div class="song-thumb">${song.emoji}</div>
        <div class="song-info">
          <div class="song-title">${title}</div>
          <div class="song-meta">
            ${song.voicePart.toUpperCase()} ·
            ${song.genre.charAt(0).toUpperCase()
              + song.genre.slice(1)} ·
            ${song.language}
          </div>
        </div>
        ${badge}
      </div>
    `


  }).join('')


}


// =============================== //
// FILTER SONGS                    //
// =============================== //
function filterSongs() {


  let filtered = songs


  // Filter by genre
  if (currentGenre !== 'all') {
    filtered = filtered.filter(function(song) {
      return song.genre === currentGenre
    })
  }


  // Filter by voice part
  if (currentVoice !== 'all') {
    filtered = filtered.filter(function(song) {
      return song.voicePart === currentVoice
    })
  }


  // Filter by search term
  if (currentSearch) {
    filtered = filtered.filter(function(song) {
      return (
        song.title.toLowerCase()
          .includes(currentSearch.toLowerCase())
        ||
        song.composer.toLowerCase()
          .includes(currentSearch.toLowerCase())
        ||
        song.language.toLowerCase()
          .includes(currentSearch.toLowerCase())
        ||
        song.genre.toLowerCase()
          .includes(currentSearch.toLowerCase())
      )
    })
  }


  renderSongs(filtered)


}


// =============================== //
// SEARCH INPUT                    //
// =============================== //
document.getElementById('search-input')
  .addEventListener('input', function() {


    currentSearch = this.value.trim()


    // Show/hide clear button
    const clearBtn = document.getElementById('btn-clear-search')
    if (currentSearch) {
      clearBtn.classList.remove('hidden')
    } else {
      clearBtn.classList.add('hidden')
    }


    filterSongs()


  })


// Clear search
document.getElementById('btn-clear-search')
  .addEventListener('click', function() {
    document.getElementById('search-input').value = ''
    currentSearch = ''
    this.classList.add('hidden')
    filterSongs()
  })


// =============================== //
// GENRE FILTER CHIPS              //
// =============================== //
document.getElementById('genre-filters')
  .addEventListener('click', function(e) {


    if (e.target.classList.contains('filter-chip')) {


      // Update active chip
      this.querySelectorAll('.filter-chip')
        .forEach(function(chip) {
          chip.classList.remove('active')
        })
      e.target.classList.add('active')


      // Update filter
      currentGenre = e.target.dataset.filter
      filterSongs()
    }


  })


// =============================== //
// VOICE PART FILTER CHIPS         //
// =============================== //
document.getElementById('voice-filters')
  .addEventListener('click', function(e) {


    if (e.target.classList.contains('filter-chip')) {


      this.querySelectorAll('.filter-chip')
        .forEach(function(chip) {
          chip.classList.remove('active')
        })
      e.target.classList.add('active')


      currentVoice = e.target.dataset.voice
      filterSongs()
    }


  })


// =============================== //
// SORT BUTTON                     //
// =============================== //
document.getElementById('btn-sort')
  .addEventListener('click', function() {


    if (currentSort === 'recent') {
      currentSort       = 'az'
      this.textContent  = 'Sort: A–Z ↑'
      songs.sort(function(a, b) {
        return a.title.localeCompare(b.title)
      })
    } else if (currentSort === 'az') {
      currentSort       = 'za'
      this.textContent  = 'Sort: Z–A ↓'
      songs.sort(function(a, b) {
        return b.title.localeCompare(a.title)
      })
    } else {
      currentSort       = 'recent'
      this.textContent  = 'Sort: Recent ↓'
      songs.sort(function(a, b) {
        return songs.indexOf(a) - songs.indexOf(b)
      })
    }


    filterSongs()


  })


// =============================== //
// OPEN SONG                       //
// =============================== //
function openSong(songId) {
  localStorage.setItem('currentSong', songId)
  goTo('song-detail.html')
}


// =============================== //
// LOAD ON PAGE START              //
// =============================== //
window.addEventListener('load', function() {
  renderSongs(songs)
})