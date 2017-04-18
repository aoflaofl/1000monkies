const fs = require('fs');

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
    var teamsString = fs.readFileSync('results.json');
    return JSON.parse(teamsString);
  } catch (e) {
    console.log(e);
    return [];
  }
};

var teams = fetchResults();

var d = new Date('Saturday, April 1, 2017');

console.log(JSON.stringify(teams, undefined, 2));

console.log(d);
