const yargs = require('yargs');
const fs = require('fs');
const _ = require('lodash');

const monkies = require('./services/monkies.js');
const teams = require('./services/teams.js');

var monkeyOptions = {
  teamFilename: 'teams.json',
  monkeyFilename: 'monkies.json',
  numberOfMonkies: 1000,
  forceNewMonkiesFile: false,
  season: '2017',
  resultsDir: '.\\results'
};

const argv = yargs
  .command('initMonkies', `Initialize ${monkeyOptions.monkeyFilename}.  If file exists, must use --force`, {
    force: {
      description: 'Force removal of monkies file',
      boolean: true
    }
  })
  .command('standings', 'Output JSON object of current league standings', {
    conference: {
      description: 'Separate by conference',
      boolean: true
    }
  })
  .help('h')
  .alias('h', 'help')
  .argv;
var command = argv._[0];

if (command === 'initMonkies') {
  monkeyOptions.forceNewMonkiesFile = argv.force;
  monkies.init(monkeyOptions);
} else if (command === 'standings') {
  var fixtures = teams.fetchTeamsAndFixtures(monkeyOptions);
  console.log(JSON.stringify(fixtures.SJ, undefined, 2));

  _.forEach(fixtures.SJ.fixtures, (v, k) => {
    console.log(k);
    console.log(v);
    console.log(teams.resultScore('SJ', v));
  });
}
