// Script that detects when Leetcode questions complete by checking DOM

console.log("content scripts")

let x = 0;

window.onload = function() {
    // not sure how to do this in jQuery
    var submitButton = $(".submit__2ISl.css-gahzfj-sm");

    submitButton.click(function() {
        console.log("submit clicked")
        x += 1
        // Currently updates local variable on each storage
        chrome.storage.local.set({submitted: "you just submitted " + toString(x)});
        console.log("x val is now " + toString(x))
    });
}
