document.addEventListener('DOMContentLoaded', () => {

  // Unix timestamp (in seconds) to count down to
  // var twoDaysFromNow = (new Date().getTime() / 1000) + (3600 * 2) + 1;

  // Set up flipclock
  var flipclock = new FlipClock()

    // Start the countdown
    .start()

    // Do something when the countdown ends
    .ifEnded(() => {
      console.log('The countdown has ended!');
    });

  // Toggle theme
  //  var interval = setInterval(() => {
  //   let body = document.body;
  //   body.classList.toggle('light-theme');
  //   body.querySelector('#flipclock').classList.toggle('flipclock__theme-dark');
  //   body.querySelector('#flipclock').classList.toggle('flipclock__theme-light');
  // }, 5000);



  let body = document.body;
  body.classList.toggle('light-theme');
  body.querySelector('#flipclock').classList.toggle('flipclock__theme-light');

  // Show version number
  // var ver = document.getElementById('ver');
  // ver.innerHTML = flipclock.version;
  
});
