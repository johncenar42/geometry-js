//https://www.youtube.com/watch?v=7BHs1BzA4fs

//SLEEP FUNCT:
const sleep = ms => new Promise(r => setTimeout(r, ms));

//FULL SCREEN STUFF

// Find the right method, call on correct element
function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

// Launch fullscreen for browsers that support it!
// launchFullScreen(document.documentElement); // the whole page
// launchFullScreen(document.getElementById("canvasHolder")); // any individual element

