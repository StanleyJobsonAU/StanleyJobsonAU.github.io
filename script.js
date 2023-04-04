let lastClicked = null;

document.addEventListener('DOMContentLoaded', function() {
  var banner = document.getElementById('banner');

  banner.addEventListener('click', function(e) {
    e.preventDefault();
    loadContent('index.html');
  });
});

function loadContent(url) {
  if (lastClicked === url) {
    return; // Don't reload the same content again
  }
  if (url === "index.html"){
    fetch(url)
    .then(response => response.text())
    .then(data => {
      const container = document.querySelector('#container');
      const tmp = document.createElement('div');
      tmp.innerHTML = data;
      container.innerHTML = tmp.querySelector('#container').innerHTML;
      lastClicked = url;
    });
  }
  else {
    fetch(url)
    .then(response => response.text())
    .then(data => {
      const container = document.querySelector('#container');
      container.innerHTML = data;
      lastClicked = url;
    });
  }
}