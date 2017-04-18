const fs = require('fs');

// This contains code to help convert and format JSON files.

// ^\s+(\d\d)\.(\d\d)\.\s(\d\d):(\d\d)\s([^\s]+)\s+([^\s]+)\s+(\d+)\s+:\s+(\d+)

console.log('1000monkeys');

var fetchTeams = () => {
  try {
    var teamsString = fs.readFileSync('teams.json');
    return JSON.parse(teamsString);
  } catch (e) {
    console.log(e);
    return [];
  }
};

var fetchResults = () => {
  try {
    var teamsString = fs.readFileSync('results/all.json');
    return JSON.parse(teamsString);
  } catch (e) {
    console.log(e);
    return [];
  }
};

var teams = fetchResults();

var out = {};

teams.forEach((e) => {
  var d = new Date(2017, e.month - 1, e.day);
  var h = {
    'team': e.homeSide,
    'score': e.homeScore
  };
  var a = {
    'team': e.awaySide,
    'score': e.awayScore
  };

  var r = {
    'home': h,
    'away': a
  };

  console.log(r);
  if (!out[d.toDateString()]) {
    out[d.toDateString()] = [];
  }
  out[d.toDateString()].push(r);

});

var keys = Object.keys(out);

keys = keys.sort((a, b) => {
  return new Date(a) - new Date(b);
});



var weeks = [];
var week = 1;

keys.forEach((a) => {
  console.log('Week ' + week);
  if (!weeks[week]) {
    weeks[week] = {
      'week': week
    };
  }
  var x = out[a];
  weeks[week][a] = x;

  var d = new Date(a);
  console.log(a);
  if (d.getDay() === 0) {
    week++;
  }
});


weeks.forEach((a) => {
  if (a) {
    console.log(JSON.stringify(a));
    console.log('---------------');
  }
});
