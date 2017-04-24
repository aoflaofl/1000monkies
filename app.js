const yargs = require('yargs');
const _ = require('lodash');

const monkies = require('./services/monkies.js');
const teams = require('./services/teams.js');
const standings = require('./services/standings.js');

// TODO: Put this in a file
const monkeyOptions = {
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
  .demandCommand(1)
  .help('h')
  .alias('h', 'help')
  .argv;
const command = argv._[0];

if (command === 'initMonkies') {
  monkeyOptions.forceNewMonkiesFile = argv.force;
  monkies.init(monkeyOptions);
} else if (command === 'standings') {
  const teamsAndFixtures = teams.fetchTeamsAndFixtures(monkeyOptions);

  _.forEach(teamsAndFixtures, (teamObj, teamName) => {
    console.log(JSON.stringify(teamObj.homeFixtures, undefined, 2));

    standings.record(teamName, teamObj.homeFixtures);
    standings.record(teamName, teamObj.awayFixtures);
  });
}

/*

     Total number of wins
    Goal Differential (GD)
    Goals For (GF)
    Fewest Disciplinary Points*
    Away Goals Differential
    Away Goal For
    Home Goals Differential
    Home Goal For
    Coin Toss (tie of 2 clubs) or Drawing of Lots (tie of 3 or more clubs)

*/
