const fs = require('fs');
const _ = require('lodash');

const teams = require('./teams.js');

// {
// "SJ": [12, 23, 3],
// "POR": [2, 33, 1]
// }
const write = opts => {
  opts = opts || {};
  const monkeyFilename = opts.monkeyFilename || 'monkeys.json';
  const monkeysObj = opts.monkeysObj || {};

  fs.writeFileSync(monkeyFilename, JSON.stringify(monkeysObj));
};

const init = opts => {
  opts = opts || {};

  const monkeyFilename = opts.monkeyFilename || 'monkeys.json';
  const numberOfMonkeys = opts.numberOfMonkeys || 1000;
  const forceNewMonkeysFile = opts.forceNewMonkeysFile || false;

  // Delete the monkey file if it already exists and force is true
  if (fs.existsSync(monkeyFilename)) {
    if (!forceNewMonkeysFile) {
      return console.log(`Performing this action deletes the existing ${monkeyFilename} file permanently.\nUse --force option if you want to do this.`);
    }
    console.log(`Removing ${monkeyFilename}.`);
    fs.unlinkSync(monkeyFilename);
  }

  console.log('Fetching teams data.');
  const teamsObj = teams.fetch();

  console.log('Creating empty monkeys object.');
  const monkeysObj = {};
  Object.keys(teamsObj).forEach(team => {
    monkeysObj[team] = [0];
  });

  const teamAry = Object.keys(monkeysObj);

  console.log(`Randomly assigning ${numberOfMonkeys} monkeys to teams.`);
  for (let i = 0; i < numberOfMonkeys; i++) {
    const monkeysTeam = _.sample(teamAry);
    monkeysObj[monkeysTeam][0]++;
  }

  console.log(monkeysObj);

  console.log(`Writing new ${monkeyFilename}.`);
  write({
    monkeyFilename, monkeysObj
  });
};

const fetch = file => {
  try {
    const monkeyString = fs.readFileSync(file || './monkeys.json');
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
