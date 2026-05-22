// =============================== //
// CHOIRLIB — SUPABASE CONNECTION  //
// =============================== //


// ⚠️ IMPORTANT:
// Replace these values with your real
// Supabase credentials when you go online.
// Find them in:
// Supabase Dashboard → Settings → API


const SUPABASE_URL = 'YOUR_SUPABASE_URL'
// Example: 'https://abcdefgh.supabase.co'


const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'
// Example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'


// =============================== //
// CREATE SUPABASE CLIENT          //
// =============================== //


// We load Supabase from CDN in HTML
// This function returns the client
function getSupabase() {
  return supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
}


// Create one instance to use everywhere
const db = getSupabase()


// =============================== //
// CONNECTION TEST                 //
// =============================== //
async function testConnection() {
  try {
    const { data, error } = await db
      .from('songs')
      .select('count')
      .limit(1)


    if (error) {
      console.error('❌ Supabase connection failed:',
        error.message)
      return false
    }


    console.log('✅ Supabase connected successfully!')
    return true


  } catch (err) {
    console.error('❌ Connection error:', err)
    return false
  }
}
