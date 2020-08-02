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

// if we get a message, start this timer, then return the correct string to show for frontend
// setInterval(function() {
//   let time = new Date(seconds * 1000).toISOString().substr(11, 8);
//   $("#timer").html(time);
//   seconds++;
// }, 1000);
