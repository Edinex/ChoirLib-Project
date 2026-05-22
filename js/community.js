// =============================== //
// CHOIRLIB — COMMUNITY LOGIC      //
// =============================== //


// Community database
const communities = {
  'sight-reading': {
    name:    'Sight Reading Help',
    icon:    '📖',
    members: '342',
    posts: [
      {
        id:      1,
        author:  'Marie Tchamgoue',
        avatar:  '👩',
        time:    '2 hours ago',
        content: 'Just uploaded a new sight reading exercise for beginners! Check it out in the library under "Educational". 🎵',
        likes:   14,
        liked:   false,
        replies: 5,
      },
      {
        id:      2,
        author:  'Paul Nkemdirim',
        avatar:  '👨',
        time:    '5 hours ago',
        content: 'Does anyone have tips for reading intervals quickly? I struggle with sixths and sevenths.',
        likes:   8,
        liked:   false,
        replies: 12,
      },
      {
        id:      3,
        author:  'Grace Ebong',
        avatar:  '👩',
        time:    'Yesterday',
        content: 'Tried the solfège method for the first time today. It really helps! Do-Re-Mi makes so much more sense now.',
        likes:   22,
        liked:   false,
        replies: 7,
      },
    ]
  },
  'cameroon-composers': {
    name:    'Cameroon Composers',
    icon:    '🎵',
    members: '128',
    posts: [
      {
        id:      4,
        author:  'Jean-Pierre Mballa',
        avatar:  '👨',
        time:    '1 hour ago',
        content: 'Just finished my new SATB arrangement of a traditional Ewondo folk song. Will upload it this weekend. 🎼',
        likes:   31,
        liked:   false,
        replies: 9,
      },
      {
        id:      5,
        author:  'Marie Tchamgoue',
        avatar:  '👩',
        time:    '3 hours ago',
        content: 'Looking for a tenor soloist for my new Gospel arrangement. Based in Yaoundé. Please contact me! 🙏',
        likes:   6,
        liked:   false,
        replies: 15,
      },
    ]
  },
  'advent-music': {
    name:    'Advent Season Music',
    icon:    '🎄',
    members: '204',
    posts: [
      {
        id:      6,
        author:  'Sister Agnes',
        avatar:  '🙏',
        time:    '4 hours ago',
        content: 'Advent is approaching! Let\'s start preparing. I recommend we collect at least 10 Advent songs in both Staff and Sol-fa notation.',
        likes:   45,
        liked:   false,
        replies: 18,
      },
    ]
  },
  'solfa-learners': {
    name:    'Tonic Sol-fa Learners',
    icon:    '🎼',
    members: '89',
    posts: [
      {
        id:      7,
        author:  'Emmanuel Fon',
        avatar:  '👨',
        time:    'Just now',
        content: 'Welcome to the Sol-fa Learners community! This is a safe space to ask questions and learn together. 🎵',
        likes:   12,
        liked:   false,
        replies: 3,
      },
    ]
  },
  'gospel-africa': {
    name:    'Gospel Music Africa',
    icon:    '🙏',
    members: '517',
    posts: [
      {
        id:      8,
        author:  'Pastor James',
        avatar:  '👨',
        time:    '30 minutes ago',
        content: 'African gospel music is spreading globally! Let\'s support each other and share our arrangements here. God bless! 🙏',
        likes:   67,
        liked:   false,
        replies: 24,
      },
    ]
  },
}


// Track joined communities
let joinedCommunities = ['cameroon-composers']


// Current open forum
let currentForum = null


// =============================== //
// JOIN / LEAVE COMMUNITY          //
// =============================== //
function toggleJoin(event, communityId) {


  // Stop card click from firing
  event.stopPropagation()


  const btn = document.getElementById(
    'join-' + communityId
  )


  if (joinedCommunities.includes(communityId)) {


    // Leave
    joinedCommunities = joinedCommunities
      .filter(function(id) { return id !== communityId })
    btn.textContent = 'Join'
    btn.classList.remove('joined')


  } else {


    // Join
    joinedCommunities.push(communityId)
    btn.textContent = 'Joined'
    btn.classList.add('joined')


  }


}


// =============================== //
// OPEN COMMUNITY FORUM            //
// =============================== //
function openCommunity(communityId) {


  const community = communities[communityId]
  if (!community) return


  currentForum = communityId


  // Set forum details
  document.getElementById('forum-title').textContent =
    community.name
  document.getElementById('forum-banner-icon')
    .textContent = community.icon
  document.getElementById('forum-banner-name')
    .textContent = community.name
  document.getElementById('forum-banner-meta')
    .textContent = community.members
    + ' members · ' + community.posts.length
    + ' posts today'


  // Render posts
  renderPosts(community.posts)


  // Show forum overlay
  document.getElementById('forum-page')
    .classList.remove('hidden')


}


// =============================== //
// RENDER POSTS                    //
// =============================== //
function renderPosts(posts) {


  const container = document.getElementById('posts-list')


  container.innerHTML = posts.map(function(post) {
    return `
      <div class="post-card" id="post-${post.id}">
        <div class="post-header">
          <div class="post-avatar">${post.avatar}</div>
          <div>
            <div class="post-author">
              ${post.author}
            </div>
            <div class="post-time">${post.time}</div>
          </div>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
          <button
            class="post-action ${post.liked
              ? 'liked' : ''}"
            onclick="toggleLike(${post.id})">
            <i class="fa-${post.liked
              ? 'solid' : 'regular'} fa-heart"></i>
            ${post.likes}
          </button>
          <button class="post-action">
            <i class="fa-regular fa-comment"></i>
            ${post.replies} replies
          </button>
          <button class="post-action">
            <i class="fa-solid fa-share-nodes"></i>
            Share
          </button>
        </div>
      </div>
    `
  }).join('')


}


// =============================== //
// LIKE A POST                     //
// =============================== //
function toggleLike(postId) {


  // Find post in all communities
  let foundPost = null


  Object.values(communities).forEach(function(community) {
    community.posts.forEach(function(post) {
      if (post.id === postId) foundPost = post
    })
  })


  if (!foundPost) return


  // Toggle like
  if (foundPost.liked) {
    foundPost.liked  = false
    foundPost.likes -= 1
  } else {
    foundPost.liked  = true
    foundPost.likes += 1
  }


  // Re-render posts
  const community = communities[currentForum]
  renderPosts(community.posts)


}


// =============================== //
// NEW POST                        //
// =============================== //
document.getElementById('btn-post')
  .addEventListener('click', function() {


    const input   = document.getElementById('new-post-input')
    const content = input.value.trim()


    if (content === '') return


    // Get user name
    const storedUser = localStorage.getItem('loggedInUser')
      || localStorage.getItem('newUser')
    const user   = storedUser ? JSON.parse(storedUser) : null
    const author = user ? user.firstName
      + ' ' + user.lastName : 'Anonymous'


    // Create new post
    const newPost = {
      id:      Date.now(),
      author:  author,
      avatar:  '👤',
      time:    'Just now',
      content: content,
      likes:   0,
      liked:   false,
      replies: 0,
    }


    // Add to community posts
    communities[currentForum].posts.unshift(newPost)


    // Re-render
    renderPosts(communities[currentForum].posts)


    // Clear input
    input.value = ''


  })


// =============================== //
// CLOSE FORUM                     //
// =============================== //
function closeForum() {
  document.getElementById('forum-page')
    .classList.add('hidden')
  currentForum = null
}


// =============================== //
// OPEN CHOIR                      //
// =============================== //
function openChoir(choirId) {
  alert('Choir profile coming soon! 🎵\n'
    + 'Choir: ' + choirId)
}


// =============================== //
// SHOW JOIN CHOIR MODAL           //
// =============================== //
function showJoinChoir() {
  document.getElementById('join-choir-modal')
    .classList.remove('hidden')
}


function closeModal(modalId) {
  document.getElementById(modalId)
    .classList.add('hidden')
}


// Join choir from modal
document.getElementById('btn-modal-join')
  .addEventListener('click', function() {


    const code = document.getElementById('modal-choir-code')
      .value.trim().toUpperCase()
    const resultEl = document.getElementById(
      'modal-choir-result'
    )


    const validCodes = {
      'CHOIR001': 'St. Joseph\'s Cathedral Choir',
      'CHOIR002': 'Youth Praise Ensemble',
      'CHOIR003': 'Divine Harmony Choir',
    }


    if (validCodes[code]) {
      resultEl.innerHTML = `
        <div class="success-box">
          <i class="fa-solid fa-circle-check"></i>
          Joined ${validCodes[code]}!
        </div>
      `
      resultEl.classList.remove('hidden')


      setTimeout(function() {
        closeModal('join-choir-modal')
        resultEl.classList.add('hidden')
      }, 2000)


    } else {
      resultEl.innerHTML = `
        <div class="error-box">
          <i class="fa-solid fa-circle-exclamation"></i>
          Invalid invite code. Try CHOIR001
        </div>
      `
      resultEl.classList.remove('hidden')
    }


  })


// =============================== //
// NEW COMMUNITY BUTTON            //
// =============================== //
document.getElementById('btn-new-community')
  .addEventListener('click', function() {
    alert('Create a community coming soon! 👥')
  })