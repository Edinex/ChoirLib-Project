// =============================== //
// CHOIRLIB — PAYMENTS             //
// =============================== //


// =============================== //
// CHECK IF USER OWNS SONG         //
// =============================== //
async function userOwnsSong(songId, userId) {


  try {


    const { data, error } = await db
      .from('purchases')
      .select('id')
      .eq('song_id', songId)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .single()


    if (error || !data) return false


    return true


  } catch (err) {
    return false
  }


}


// =============================== //
// CREATE PURCHASE RECORD          //
// =============================== //
async function createPurchase(
  songId,
  userId,
  amount,
  paymentMethod
) {


  try {


    const { data, error } = await db
      .from('purchases')
      .insert({
        song_id:        songId,
        user_id:        userId,
        amount:         amount,
        payment_method: paymentMethod,
        status:         'pending',
        created_at:     new Date().toISOString(),
      })
      .select()
      .single()


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    return {
      success:    true,
      purchaseId: data.id,
      message:    'Purchase initiated!'
    }


  } catch (err) {
    return {
      success: false,
      message: 'Could not create purchase.'
    }
  }


}


// =============================== //
// COMPLETE PURCHASE               //
// =============================== //
async function completePurchase(purchaseId) {


  try {


    const { error } = await db
      .from('purchases')
      .update({ status: 'completed' })
      .eq('id', purchaseId)


    if (error) {
      return {
        success: false,
        message: error.message
      }
    }


    return {
      success: true,
      message: 'Purchase completed! '
        + 'Check your email for delivery.'
    }


  } catch (err) {
    return {
      success: false,
      message: 'Could not complete purchase.'
    }
  }


}


// =============================== //
// GET USER PURCHASES              //
// =============================== //
async function getUserPurchases(userId) {


  try {


    const { data, error } = await db
      .from('purchases')
      .select(`
        *,
        songs ( title, composer, emoji )
      `)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })


    if (error) {
      console.error('Purchases error:',
        error.message)
      return []
    }


    return data


  } catch (err) {
    console.error('Purchases error:', err)
    return []
  }


}


// =============================== //
// PROCESS MTN MOBILE MONEY        //
// (Placeholder — needs MTN API)   //
// =============================== //
async function processMTNPayment(
  phoneNumber,
  amount,
  purchaseId
) {


  try {


    // This will connect to MTN MoMo API
    // For now it simulates the process
    console.log('Processing MTN payment...')
    console.log('Phone:', phoneNumber)
    console.log('Amount:', amount)


    // Simulate API delay
    await new Promise(function(resolve) {
      setTimeout(resolve, 2000)
    })


    // In production this calls MTN API:
    // const response = await fetch(MTN_API_URL, {
    //   method: 'POST',
    //   headers: { Authorization: MTN_API_KEY },
    //   body: JSON.stringify({ phoneNumber, amount })
    // })


    // For now mark as complete
    const result = await completePurchase(purchaseId)
    return result


  } catch (err) {
    return {
      success: false,
      message: 'MTN payment failed.'
    }
  }


}


// =============================== //
// PROCESS STRIPE CARD PAYMENT     //
// (Placeholder — needs Stripe)    //
// =============================== //
async function processCardPayment(
  cardToken,
  amount,
  purchaseId
) {


  try {


    // This will connect to Stripe API
    // For now it simulates the process
    console.log('Processing card payment...')
    console.log('Amount: $' + amount)


    // In production:
    // const stripe = Stripe(STRIPE_PUBLIC_KEY)
    // const result = await stripe.confirmPayment(...)


    const result = await completePurchase(purchaseId)
    return result


  } catch (err) {
    return {
      success: false,
      message: 'Card payment failed.'
    }
  }


}
