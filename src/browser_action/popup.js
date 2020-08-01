const MAX_UPPER_RANGE = 4.13;
const MIN_LOWER_RANGE = 0.468;
const RANGE_STEP = 0.001;

function findLowerBoundQuestion(questions, target) {
  // Far future TODO: Make each question in a range have the same chance
  // i.e. from 4.00 to 4.130 there's only a few questions,
  // but the chance of getting each question isn't equal, since we find
  // the first question that's higher than our randomized range. What
  // we'd want to do is equalize the chance for each question in between.
  console.log("target:");
  console.log(target);

  let low = 0;
  let hi = questions.length - 1;
  let mid;
  while (low <= hi) {
    mid = low + Math.floor((hi - low) / 2);

    if (mid + 1 >= questions.length) {
      return questions[mid];
    } else if (
      // Found first question >= target value
      target >= questions[mid]["Score"] &&
      target < questions[mid + 1]["Score"]
    ) {
      // Return exact question value if you can,
      // the upper question if you can't
      return target == questions[mid]["Score"]
        ? questions[mid]
        : questions[mid + 1];
    } else if (target < questions[mid]["Score"]) {
      hi = mid - 1;
    } else {
      low = mid + 1;
    }
  }
}

function setRangeEventListener() {
  // JQuery .change() function wasn't working :(
  var left_range = document.getElementById("left-range");
  var right_range = document.getElementById("right-range");

  // TODO: Cleanup
  left_range.addEventListener("change", function() {
    if ($(" #left-range ").val() < MIN_LOWER_RANGE) {
      $(" #left-range ").val(MIN_LOWER_RANGE);
    } else if ($(" #left-range ").val() > $(" #right-range ").val()) {
      $(" #left-range ").val($(" #right-range ").val());
    }
    chrome.storage.local.set({
      range: [$(" #left-range ").val(), $(" #right-range ").val()]
    });
  });

  right_range.addEventListener("change", function() {
    if ($(" #right-range ").val() > MAX_UPPER_RANGE) {
      $(" #right-range ").val(MAX_UPPER_RANGE);
    } else if ($(" #right-range ").val() < $(" #left-range ").val()) {
      $(" #right-range ").val($(" #left-range ").val());
    }
    chrome.storage.local.set({
      range: [$(" #left-range ").val(), $(" #right-range ").val()]
    });
  });
}

function setFindButtonOnClick() {
  $("#find-button").click(function() {
    let left = parseFloat($("#left-range").val());
    let right = parseFloat($("#right-range").val());
    let random_val = parseFloat(Math.random() * (right - left) + left).toFixed(
      3
    );
    let question = findLowerBoundQuestion(data, random_val);

    console.log(question);
    console.assert(question);

    let new_url = "https://leetcode.com/problems/" + question["Title"] + "/";
    let new_link =
      '<a id="question-link" href=' + new_url + '">Question Link</a>';
    console.log(new_link);
    $("#question-link").replaceWith($(new_link));
    $("#question-value").text("Question Value: " + question["Score"]);

    // Have window reload this event listener on each new question
    $("#question-link").click(function() {
      chrome.tabs.create({
        url: new_url
      });
    });
  });
}

function setEventListeners() {
  setRangeEventListener();
  setFindButtonOnClick();
}

async function getLeetcodeData() {
  fetch("https://leetcode.com/api/problems/algorithms/")
    .then(response => response.json())
    .then(function(data) {
      user_data = data;
      chrome.storage.local.set({ key: user_data }, function() {
        console.log("Saved user session.");
      });
      console.log(user_data);

      username = user_data["user_name"];
      questions_solved = user_data["num_solved"];
    });
}

function updateUserData(username, questions_solved) {
  $("#username").text("Username: " + (username ? username : "Not logged in!"));
  $("#questions-solved").text(
    "Questions Solved: " + (username ? questions_solved : 0)
  );
}

// ============================================================

var data;
fetch(chrome.extension.getURL("leetcode.json"))
  .then(resp => resp.json())
  .then(function(jsonData) {
    data = jsonData;
  });

var user_data;
var username;
var questions_solved;

// TODO: Update user stats every submission?
chrome.storage.local.get(["key"], function(result) {
  // console.log('Value currently is ' + JSON.stringify(value));
  user_data = result.key;
  username = user_data["user_name"];
  questions_solved = user_data["num_solved"];
  updateUserData(username, questions_solved);
});

if (!username) {
  getLeetcodeData().then(function() {
    updateUserData;
  });
}

window.onload = function() {
  chrome.storage.local.get(["range"], function(result) {
    // Empty objects in JS {} aren't inherently falsy :-(
    if (!jQuery.isEmptyObject(result)) {
      console.log(JSON.stringify(result));
      if (result.range[0]) $(" #left-range ").val(result.range[0]);
      if (result.range[1]) $(" #right-range ").val(result.range[1]);
    }
  });

  setEventListeners();
};