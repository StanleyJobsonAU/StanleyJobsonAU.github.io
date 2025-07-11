document.addEventListener('DOMContentLoaded', function() {
  // Initialize the view based on the current hash
  handleHashChange();

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);

  // Handle navigation link clicks for smooth scrolling (optional)
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          const target = this.getAttribute('href');
          window.location.hash = target;
          toggleMenu(); // Close the menu if it's open (for mobile)
      });
  });
});

// Close-modal on “X”
document.getElementById('modalClose')
        .addEventListener('click', () => {
  document.getElementById('loginModal').style.display = 'none';
  activePostId = null;
});

// 1) Success handler
function onLoginSuccess() {
  const modal     = document.getElementById('loginModal');
  const content   = modal.querySelector('.modal-content');
  const inputs    = content.querySelectorAll('.overlay-input, .modal-close, #modalError');
  const originalBg= content.style.background;

  // hide inputs & close-X
  inputs.forEach(el => el.style.visibility = 'hidden');

  // swap to the granted GIF
  content.style.background = "url('/assets/granted.gif') center/cover no-repeat";

  // play granted.mp3 three times, 500ms apart
  const src = '/assets/granted.mp3';
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const snd = new Audio(src);
      snd.play().catch(()=>{});
    }, i * 500);
  }

  // add an “Enter” button
  const btn = document.createElement('button');
  btn.textContent = 'Enter';
  btn.className   = 'enter-button';
  // quick inline styling; you can move to CSS if you prefer
  btn.style.cssText = `
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5em 1em;
    font-size: 1em;
    cursor: pointer;
  `;
  content.appendChild(btn);

  // when clicked: hide modal + reveal the post
  btn.addEventListener('click', () => {
    modal.style.display = 'none';
    // run your standard show‐logic (handles encrypted vs decrypted)
    handleHashChange();
  });
}


function onLoginFailed() {
  const modalContent = document.querySelector('.modal-content');
  const inputs = modalContent.querySelectorAll('.overlay-input');
  const originalBg = modalContent.style.background;

  // ① ensure always transparent
  inputs.forEach(i => i.style.background = 'transparent');

  // ② hide the inputs completely
  inputs.forEach(i => i.style.visibility = 'hidden');

  // swap in the Denied.gif
  modalContent.style.background = "url('/assets/Denied.gif') center/cover no-repeat";

  // play the denied sound 3 times, 500ms apart
  const soundSrc = '/assets/denied.mp3';
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const snd = new Audio(soundSrc);
      snd.play().catch(() => {});
    }, i * 500);
  }

  // after 3s, restore background *and* show inputs again
  setTimeout(() => {
    modalContent.style.background = originalBg;
    inputs.forEach(i => i.style.visibility = 'visible');
  }, 2100);
}

// Form submit on Enter
document.getElementById('loginForm')
        .addEventListener('submit', async function(e) {
  e.preventDefault();
  const user = document.getElementById('modalUsername').value;
  const pass = document.getElementById('modalPassword').value;
  try {
    await tryDecryptPost(activePostId, user, pass);
    onLoginSuccess();
  } catch (_) {
    onLoginFailed();
  }
});

/**
* Handles the display of sections based on the current hash.
*/
function handleHashChange() {
  const hash = location.hash || '#home';

  // 1) Nav‐link highlighting
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkHash = link.getAttribute('href');
    link.classList.toggle('active', hash.startsWith(linkHash));
  });

  // 2) Hide all main sections (except blog-posts)
  document.querySelectorAll('.content-section').forEach(sec => {
    if (!sec.classList.contains('blog-post')) {
      sec.classList.remove('active');
    }
  });

  // 3) Hide all blog posts
  document.querySelectorAll('.blog-post').forEach(post => {
    post.classList.remove('active');
  });

  // 4) Blog routing
  if (hash.startsWith('#blog')) {
    // show the Blog section itself
    document.getElementById('blog').classList.add('active');

    const blogTable = document.getElementById('blog-table');
    const parts    = hash.split('/');
    const postId   = parts[1];

    if (postId) {
      // hide the table of posts
      if (blogTable) blogTable.style.display = 'none';

      const blogPost  = document.getElementById(postId);
      const contentEl = blogPost?.querySelector('.blog-content');

      if (blogPost && contentEl) {
        // if encrypted *and* not yet decrypted, force the login modal
        if (blogPost.dataset.encrypted && !contentEl.innerHTML) {
          activePostId = postId;
          document.getElementById('modalError').style.display = 'none';
          document.getElementById('loginForm').reset();
          document.getElementById('loginModal').style.display = 'flex';
          document.getElementById('modalUsername').focus();
          return;  // bail so the post stays hidden
        }

        // otherwise reveal the post
        blogPost.classList.add('active');
      }
    } else {
      // no specific post → show the list again
      if (blogTable) blogTable.style.display = 'block';
    }

    return;  // done handling #blog/*
  }

  // 5) Non-blog routing: show the table if it exists
  const blogTable = document.getElementById('blog-table');
  if (blogTable) blogTable.style.display = 'block';

  // 6) Show the matching section or default to Home
  const target = document.querySelector(hash);
  if (target) {
    target.classList.add('active');
  } else {
    document.getElementById('home').classList.add('active');
  }
}

/**
* Shows a specific blog post.
* @param {string} postId - The ID of the blog post to show.
*/
let activePostId = null;

function showBlogPost(postId) {
  const postEl = document.getElementById(postId);
  // if it has a data-encrypted attribute, gate it:
  if (postEl.dataset.encrypted) {
    activePostId = postId;
    document.getElementById('modalError').style.display = 'none';
    document.getElementById('loginForm').reset();
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('modalUsername').focus();
  } else {
    // fallback to your old behavior:
    window.location.hash = `#blog/${postId}`;
  }
}

/**
* Shows the main blog list.
*/
function showBlogList() {
  window.location.hash = '#blog';
}

/**
* Toggles the navigation menu on smaller screens.
*/
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}

/* Optional: Function to close the menu when clicking outside (for better UX) */
document.addEventListener('click', function(event) {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
      navLinks.classList.remove('active');
  }
});

async function tryDecryptPost(postId, username, password) {
  const postEl = document.getElementById(postId);
  const b64     = postEl.dataset.encrypted;            // Base64 string

  // 1) Derive the same 32-byte key
  const key = CryptoJS.SHA256(`${username}:${password}`);

  // 2) Convert Base64 into a WordArray, then split IV + ciphertext
  const raw = CryptoJS.enc.Base64.parse(b64);
  const iv  = CryptoJS.lib.WordArray.create(
                raw.words.slice(0, 4), 16            // first 16 bytes = IV
              );
  const ct  = CryptoJS.lib.WordArray.create(
                raw.words.slice(4), raw.sigBytes - 16 // rest = ciphertext
              );

  // 3) Decrypt
  const bytes = CryptoJS.AES.decrypt(
    { ciphertext: ct },
    key,
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  const html  = bytes.toString(CryptoJS.enc.Utf8);

  if (!html) throw new Error('bad decryption');

  // 4) Inject
  postEl.querySelector('.blog-content').innerHTML = html;
}
