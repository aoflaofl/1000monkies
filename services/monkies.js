const fs = require('fs');
const _ = require('lodash');

const teams = require('./teams.js');

// {
// "SJ": [12, 23, 3],
// "POR": [2, 33, 1]
// }

var init = (opts) => {
  opts = opts || {};

  teamFilename = opts.teamFilename || 'teams.json';
  monkeyFilename = opts.monkeyFilename || 'monkies.json';
  numberOfMonkies = opts.numberOfMonkies || 1000;
  forceNewMonkiesFile = opts.forceNewMonkiesFile || false;

  // Delete the monkey file if it already exists and force is true
  if (fs.existsSync(monkeyFilename)) {
    if (!forceNewMonkiesFile) {
      return console.log(`Performing this action deletes the existing ${monkeyFilename} file permanently.\nUse --force option if you want to do this.`);
    }
    console.log(`Removing ${monkeyFilename}.`);
    fs.unlinkSync(monkeyFilename);
  }

  console.log('Fetching teams data.');
  var teamsObj = teams.fetch();

  console.log('Creating empty monkies object.');
  var monkiesObj = {};
  Object.keys(teamsObj).forEach((team) => {
    monkiesObj[team] = [0];
  });

  var teamAry = Object.keys(monkiesObj);

  console.log(`Randomly assigning ${numberOfMonkies} monkies to teams.`);
  for (i = 0; i < numberOfMonkies; i++) {
    var monkeysTeam = _.sample(teamAry);
    monkiesObj[monkeysTeam][0]++;
  }

  console.log(monkiesObj);

  console.log(`Writing new ${monkeyFilename}.`);
  write({
    monkeyFilename, monkiesObj
  });
};

var fetch = (file) => {
  try {
    var monkeyString = fs.readFileSync(file || './monkies.json');
    return JSON.parse(monkeyString);
  } catch (e) {
    console.log(e);
    return [];
  }
};

var write = (opts) => {
  opts = opts || {};
  monkeyFilename = opts.monkeyFilename || 'monkies.json';
  monkiesObj = opts.monkiesObj || {};

  fs.writeFileSync(monkeyFilename, JSON.stringify(monkiesObj));
};

module.exports = {
    fetch, 
    init
};
