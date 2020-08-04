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
chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
  // TODO: Add clearInterval on new search
    if( request.msg === "startTimer" )
    {
      console.log("received startTimer")
      clearInterval(timer_func);
      seconds = 0;
      timer_func = setInterval(function() {
        seconds++;
      }, 1000);
    }
    else if ( request.msg === "getTimer" ) 
    {
      console.log("received getTimer");
      console.log(seconds);
      min = (parseInt(seconds / 60)).toString().padStart(2, '0');
      sec = (parseInt(seconds % 60)).toString().padStart(2, '0');
      console.log(min + ":" + sec);
      sendResponse( {time_string: min + ":" + sec} );
    }
});