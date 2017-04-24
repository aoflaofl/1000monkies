const fs = require('fs');
const _ = require('lodash');

const teams = require('./teams.js');

// {
// "SJ": [12, 23, 3],
// "POR": [2, 33, 1]
// }
const write = opts => {
  opts = opts || {};
  const monkeyFilename = opts.monkeyFilename || 'monkies.json';
  const monkiesObj = opts.monkiesObj || {};

  fs.writeFileSync(monkeyFilename, JSON.stringify(monkiesObj));
};

const init = opts => {
  opts = opts || {};

  const monkeyFilename = opts.monkeyFilename || 'monkies.json';
  const numberOfMonkies = opts.numberOfMonkies || 1000;
  const forceNewMonkiesFile = opts.forceNewMonkiesFile || false;

  // Delete the monkey file if it already exists and force is true
  if (fs.existsSync(monkeyFilename)) {
    if (!forceNewMonkiesFile) {
      return console.log(`Performing this action deletes the existing ${monkeyFilename} file permanently.\nUse --force option if you want to do this.`);
    }
    console.log(`Removing ${monkeyFilename}.`);
    fs.unlinkSync(monkeyFilename);
  }

  console.log('Fetching teams data.');
  const teamsObj = teams.fetch();

  console.log('Creating empty monkies object.');
  const monkiesObj = {};
  Object.keys(teamsObj).forEach(team => {
    monkiesObj[team] = [0];
  });

  const teamAry = Object.keys(monkiesObj);

  console.log(`Randomly assigning ${numberOfMonkies} monkies to teams.`);
  for (let i = 0; i < numberOfMonkies; i++) {
    const monkeysTeam = _.sample(teamAry);
    monkiesObj[monkeysTeam][0]++;
  }

  console.log(monkiesObj);

  console.log(`Writing new ${monkeyFilename}.`);
  write({
    monkeyFilename, monkiesObj
  });
};

const fetch = file => {
  try {
    const monkeyString = fs.readFileSync(file || './monkies.json');
    return JSON.parse(monkeyString);
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = {
  fetch,
  init
};
