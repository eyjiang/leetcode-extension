// Equivalent to backend listener logic - server

// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });

let time;
let seconds = 0;
let timer_func;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // TODO: Add clearInterval on new search
  if (request.msg === "startTimer") {
    // Resets Timer
    console.log("received startTimer");
    seconds = 0;

    // Starts iterating seconds if not already iterating
    if (!timer_func) {
      timer_func = setInterval(function() {
        seconds++;
      }, 1000);
    }
  } else if (request.msg === "stopTimer") {
    clearInterval(timer_func);
  } else if (request.msg === "getTimer") {
    min = parseInt(seconds / 60)
      .toString()
      .padStart(2, "0");
    sec = parseInt(seconds % 60)
      .toString()
      .padStart(2, "0");
    sendResponse({ time_string: min + ":" + sec });
  }
});
