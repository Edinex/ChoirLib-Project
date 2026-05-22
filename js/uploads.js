// =============================== //
// CHOIRLIB — FILE UPLOADS         //
// =============================== //


// =============================== //
// UPLOAD PDF SHEET MUSIC          //
// =============================== //
async function uploadPDF(file, songId, notationType) {


  try {


    // Create file path
    // e.g. songs/ave-maria/staff.pdf
    const filePath = 'songs/'
      + songId + '/'
      + notationType + '.pdf'


    // Upload to Supabase Storage
    const { data, error } = await db
      .storage
      .from('song-files')
      .upload(filePath, file, {
        contentType: 'application/pdf',
        upsert:      true,
      })


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    // Get the public URL
    const { data: urlData } = db
      .storage
      .from('song-files')
      .getPublicUrl(filePath)


    // Save file record to database
    await db
      .from('song_files')
      .insert({
        song_id:       songId,
        file_type:     'pdf',
        notation_type: notationType,
        file_url:      urlData.publicUrl,
        created_at:    new Date().toISOString(),
      })


    return {
      success:  true,
      fileUrl:  urlData.publicUrl,
      message:  'PDF uploaded successfully!'
    }


  } catch (err) {
    return {
      success:  false,
      message:  'Upload failed. Please try again.'
    }
  }


}


// =============================== //
// UPLOAD AUDIO FILE               //
// =============================== //
async function uploadAudio(file, songId, partName) {


  try {


    // Validate file type
    const validTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/mp3'
    ]


    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Please upload an MP3 or WAV file'
      }
    }


    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        success: false,
        message: 'Audio file must be under 50MB'
      }
    }


    const filePath = 'audio/'
      + songId + '/'
      + partName + '.mp3'


    const { error } = await db
      .storage
      .from('song-files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert:      true,
      })


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    const { data: urlData } = db
      .storage
      .from('song-files')
      .getPublicUrl(filePath)


    await db
      .from('song_files')
      .insert({
        song_id:    songId,
        file_type:  'audio',
        file_url:   urlData.publicUrl,
        created_at: new Date().toISOString(),
      })


    return {
      success:  true,
      fileUrl:  urlData.publicUrl,
      message:  'Audio uploaded successfully!'
    }


  } catch (err) {
    return {
      success:  false,
      message:  'Upload failed. Please try again.'
    }
  }


}


// =============================== //
// UPLOAD PROFILE PHOTO            //
// =============================== //
async function uploadProfilePhoto(file, userId) {


  try {


    // Validate image
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]


    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        message: 'Please upload a JPG or PNG image'
      }
    }


    // Max 5MB
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        success: false,
        message: 'Image must be under 5MB'
      }
    }


    const filePath = 'avatars/' + userId + '.jpg'


    const { error } = await db
      .storage
      .from('user-avatars')
      .upload(filePath, file, {
        contentType: file.type,
        upsert:      true,
      })


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    const { data: urlData } = db
      .storage
      .from('user-avatars')
      .getPublicUrl(filePath)


    // Update user profile
    await db
      .from('users')
      .update({
        profile_photo: urlData.publicUrl
      })
      .eq('id', userId)


    return {
      success:    true,
      photoUrl:   urlData.publicUrl,
      message:    'Photo uploaded successfully!'
    }


  } catch (err) {
    return {
      success:  false,
      message:  'Upload failed. Please try again.'
    }
  }


}


// =============================== //
// GET SIGNED URL (PROTECTED FILES)//
// =============================== //
async function getProtectedFileUrl(
  filePath,
  expiresInSeconds = 60
) {


  try {


    // Creates a temporary URL that expires
    // Used for protected/paid content
    const { data, error } = await db
      .storage
      .from('protected-songs')
      .createSignedUrl(filePath, expiresInSeconds)


    if (error) {
      return null
    }


    return data.signedUrl


  } catch (err) {
    console.error('Signed URL error:', err)
    return null
  }


}
