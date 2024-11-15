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

/**
* Handles the display of sections based on the current hash.
*/
function handleHashChange() {
  const hash = location.hash || '#home';
  const container = document.querySelector('#container');

  // Hide all main content sections except blog posts
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
      if (!section.classList.contains('blog-post')) {
          section.classList.remove('active');
      }
  });

  // Hide all blog posts
  const blogPosts = document.querySelectorAll('.blog-post');
  blogPosts.forEach(post => {
      post.classList.remove('active');
  });

  // Handle Blog Section
  if (hash.startsWith('#blog')) {
      // Show the blog section
      document.querySelector('#blog').classList.add('active');

      // Get the blog post ID from the hash
      const blogPostId = hash.split('/')[1];
      if (blogPostId) {
          const blogPost = document.getElementById(blogPostId);
          if (blogPost) {
              // Hide the blog table
              const blogTable = document.getElementById('blog-table');
              if (blogTable) {
                  blogTable.style.display = 'none';
              }

              // Show the specific blog post
              blogPost.classList.add('active');
          }
      } else {
          // If no specific blog post, show the blog table
          const blogTable = document.getElementById('blog-table');
          if (blogTable) {
              blogTable.style.display = 'block';
          }
      }
  } else {
      // For other sections, ensure the blog table is visible
      const blogTable = document.getElementById('blog-table');
      if (blogTable) {
          blogTable.style.display = 'block';
      }

      // Show the corresponding section
      const targetSection = document.querySelector(hash);
      if (targetSection) {
          targetSection.classList.add('active');
      } else {
          // If the hash doesn't match any section, show home
          document.querySelector('#home').classList.add('active');
      }
  }

  // Update active navigation link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
      link.classList.remove('active');
      const linkHash = link.getAttribute('href');
      if (hash.startsWith(linkHash)) {
          link.classList.add('active');
      }
  });
}

/**
* Shows a specific blog post.
* @param {string} postId - The ID of the blog post to show.
*/
function showBlogPost(postId) {
  // Update the URL hash
  window.location.hash = `#blog/${postId}`;
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
