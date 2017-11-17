var config = {
  apiKey: "AIzaSyCgaOgEV2TDQQTJvrTPKEdqEcKPL9nfiDA",
  authDomain: "train-times-d3fd1.firebaseapp.com",
  databaseURL: "https://train-times-d3fd1.firebaseio.com",
  projectId: "train-times-d3fd1",
  storageBucket: "train-times-d3fd1.appspot.com",
  messagingSenderId: "30541938363"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destinationName = "";
var firstTrain = "";
var frequencyMin = "";
var nextArrival = "";
var minutesAway = "";

$("#submit-btn").on("click", function(event) {
  event.preventDefault();

  trainName = $("#name-train").val().trim();
  destinationName = $("#destination").val().trim();
  firstTrain = $("#first-train").val().trim();
  frequencyMin = $("#frequency").val().trim();

  $("#name-train").val("");
  $("#destination").val("");
  $("#first-train").val("");
  $("#frequency").val("");

  database.ref().push({
    trainName: trainName,
    destinationName: destinationName,
    firstTrain: firstTrain,
    frequencyMin: frequencyMin,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

});

database.ref().on("child_added", function(childSnapshot) {
  var currentTime = moment().format("HH:mm");
  var startTime = childSnapshot.val().firstTrain;

  var splitting = startTime.split(":");
  var newtime = (parseInt(splitting[0]) * 60) + parseInt(splitting[1]);
  var splitCurrent = currentTime.split(":");
  var newCurrentTime = (parseInt(splitCurrent[0]) * 60) + parseInt(splitCurrent[1]);
  var dif = newCurrentTime - newtime;
  var freq = parseInt(childSnapshot.val().frequencyMin);
  var roundup = Math.ceil(dif / freq);
  var numTrain = dif / freq;
  var nextTrain = newtime + (roundup * freq);
  var timeLeft = Math.round((roundup - numTrain) * freq);
  var minNextTrain = nextTrain % 60;
  var hrNextTrain = nextTrain / 60;
  var nextArrival = moment.utc().hours(hrNextTrain).minutes(minNextTrain).format("HH:mm");


  var tableRow = $("<tr>");
  tableRow.attr("data-key", childSnapshot.key);
  var tableName = $("<td>" + childSnapshot.val().trainName + "</td>");
  var tableDesination = $("<td>" + childSnapshot.val().destinationName + "</td>");
  var tableFrequency = $("<td>" + childSnapshot.val().frequencyMin + "</td>");
  var tableNextArrival = $("<td>" + nextArrival + "</td>");
  var tableMinAway = $("<td>" + timeLeft + "</td>");
  tableRow.append(tableName, tableDesination, tableFrequency, tableNextArrival, tableMinAway);
  $("tbody").append(tableRow);


});
