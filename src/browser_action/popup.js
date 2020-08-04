// Equivalent to frontend logic

const MAX_UPPER_RANGE = 4.13;
const MIN_LOWER_RANGE = 0.468;
const RANGE_STEP = 0.001;
let timed_mode = false;
let timing = false;
let curr_time = "00:00";

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

  // Function object that returns value if input_val
  // is empty, else assigns a value
  const left_val = input_val => {
    if (!input_val) return $(" #left-range ").val();
    else $(" #left-range ").val(input_val);
  };
  const right_val = input_val => {
    if (!input_val) return $(" #right-range ").val();
    else $(" #right-range ").val(input_val);
  };

  // TODO: Cleanup
  left_range.addEventListener("change", function() {
    if (left_val() < MIN_LOWER_RANGE) {
      left_val(MIN_LOWER_RANGE);
    } else if (left_val() > right_val()) {
      left_val(right_val());
    }
    chrome.storage.local.set({
      range: [left_val(), right_val()]
    });
  });

  right_range.addEventListener("change", function() {
    if (right_val() > MAX_UPPER_RANGE) {
      right_val(MAX_UPPER_RANGE);
    } else if (right_val() < left_val()) {
      right_val(left_val());
    }
    chrome.storage.local.set({
      range: [left_val(), right_val()]
    });
  });
}

function startTimer() {
  chrome.extension.sendMessage({msg: "startTimer"});
}

function setFindButtonOnClick() {
  $("#find-button").click(function() {
    let left = parseFloat($("#left-range").val());
    let right = parseFloat($("#right-range").val());
    let random_val = parseFloat(Math.random() * (right - left) + left).toFixed(
      3
    );
    let question = findLowerBoundQuestion(data, random_val);

    let new_url = "https://leetcode.com/problems/" + question["Title"] + "/";
    let new_link =
      '<a id="question-link" href=' + new_url + '">Question Link</a>';
    $("#question-link").replaceWith($(new_link));
    $("#question-value").text("Question Value: " + question["Score"]);

    // console.log("pressed find button");
    // if (timed_mode) {
    //   startTimer();
    // }
    // Have window reload this event listener on each new question
    $("#question-link").click(function() {
      if (timed_mode) {
        startTimer();
      }
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
  // TODO: Move all .get() into one function
  chrome.storage.local.get(["curr_time", "range", "timed_flag"], function(result) {
    console.log(JSON.stringify(result));
    if (result.curr_time) {
      chrome.extension.sendMessage({msg: "getTimer"},     
      // TODO: FUnctionalize
      function (response) {
        $("#timer").text(response.time_string);
      });
    }
    if (result.range) {
      if (result.range[0])
      $(" #left-range ").val(parseFloat(result.range[0]).toFixed(3));
      if (result.range[1])
      $(" #right-range ").val(parseFloat(result.range[1]).toFixed(3));
    }
    if (result.timed_flag !== 'undefined') {
      console.log("flag is now" + result.timed_flag);
      timed_mode = result.timed_flag
      console.log("wahh" + timed_mode.toString())

      if (timed_mode) {
        $("#timed-button").addClass("active");
      }
      else {
        $("#timed-button").removeClass("active");
      }
      $("#timed-button").css("aria-pressed", timed_mode.toString());
    }
  });

  // Send a getTimer message and update #timer every second
  setInterval(() => {
    chrome.extension.sendMessage({msg: "getTimer"},
    function (response) {
        time_string = response.time_string;
        $("#timer").text(time_string);
        chrome.storage.local.set({
          curr_time: time_string
        });
    });
  }, 1000);

  $(".glyphicon-question-sign").tooltip();
  $("#timed-button").click(function() {
    alert("timed clicked");
    timed_mode = !timed_mode;
    chrome.storage.local.set({
      timed_flag: timed_mode
    });
  })
  setEventListeners();
};
