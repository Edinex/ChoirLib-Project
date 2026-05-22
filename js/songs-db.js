// =============================== //
// CHOIRLIB — SONGS DATABASE       //
// =============================== //


// =============================== //
// GET ALL SONGS                   //
// =============================== //
async function getAllSongs() {


  try {


    const { data, error } = await db
      .from('songs')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })


    if (error) {
      console.error('Error fetching songs:',
        error.message)
      return []
    }


    return data


  } catch (err) {
    console.error('Songs fetch error:', err)
    return []
  }


}


// =============================== //
// SEARCH SONGS                    //
// =============================== //
async function searchSongs(searchTerm) {


  try {


    const { data, error } = await db
      .from('songs')
      .select('*')
      .eq('is_approved', true)
      .or(
        'title.ilike.%' + searchTerm + '%,'
        + 'composer.ilike.%' + searchTerm + '%,'
        + 'lyrics.ilike.%' + searchTerm + '%'
      )


    if (error) {
      console.error('Search error:', error.message)
      return []
    }


    return data


  } catch (err) {
    console.error('Search error:', err)
    return []
  }


}


// =============================== //
// FILTER SONGS BY GENRE           //
// =============================== //
async function getSongsByGenre(genre) {


  try {


    const { data, error } = await db
      .from('songs')
      .select('*')
      .eq('is_approved', true)
      .eq('genre', genre)
      .order('created_at', { ascending: false })


    if (error) {
      console.error('Filter error:', error.message)
      return []
    }


    return data


  } catch (err) {
    console.error('Filter error:', err)
    return []
  }


}


// =============================== //
// GET SINGLE SONG                 //
// =============================== //
async function getSongById(songId) {


  try {


    const { data, error } = await db
      .from('songs')
      .select(`
        *,
        song_files (*),
        social_links (*)
      `)
      .eq('id', songId)
      .single()


    if (error) {
      console.error('Song fetch error:',
        error.message)
      return null
    }


    return data


  } catch (err) {
    console.error('Song fetch error:', err)
    return null
  }


}


// =============================== //
// GET RECENTLY ADDED SONGS        //
// =============================== //
async function getRecentSongs(limit = 10) {


  try {


    const { data, error } = await db
      .from('songs')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(limit)


    if (error) {
      console.error('Recent songs error:',
        error.message)
      return []
    }


    return data


  } catch (err) {
    console.error('Recent songs error:', err)
    return []
  }


}


// =============================== //
// SUGGEST A SONG UPLOAD           //
// =============================== //
async function suggestSong(songData, userId) {


  try {


    const { data, error } = await db
      .from('songs')
      .insert({
        title:       songData.title,
        composer:    songData.composer,
        genre:       songData.genre,
        language:    songData.language,
        voice_parts: songData.voiceParts,
        lyrics:      songData.lyrics,
        access_type: songData.accessType || 'free',
        uploaded_by: userId,
        is_approved: false, // Needs admin approval
        created_at:  new Date().toISOString(),
      })


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    return {
      success: true,
      message: 'Song submitted for review! '
        + 'An admin will approve it soon.'
    }


  } catch (err) {
    return {
      success: false,
      message: 'Could not submit song.'
    }
  }


}


// =============================== //
// RECORD A DOWNLOAD               //
// =============================== //
async function recordDownload(songId, userId) {


  try {


    // Record in downloads table
    await db
      .from('downloads')
      .insert({
        song_id:    songId,
        user_id:    userId,
        created_at: new Date().toISOString(),
      })


    // Update local count
    let count = parseInt(
      localStorage.getItem('downloadCount') || 0
    )
    count++
    localStorage.setItem('downloadCount', count)


    return true


  } catch (err) {
    console.error('Download record error:', err)
    return false
  }


}
