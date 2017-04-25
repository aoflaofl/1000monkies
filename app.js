const yargs = require('yargs');
const _ = require('lodash');

const monkeys = require('./services/monkeys.js');
const teams = require('./services/teams.js');
const standings = require('./services/standings.js');

// TODO: Put this in a file
const monkeyOptions = {
  teamFilename: 'teams.json',
  monkeyFilename: 'monkeys.json',
  numberOfMonkeys: 1000,
  forceNewMonkeysFile: false,
  season: '2017',
  resultsDir: '.\\results'
};

const argv = yargs
  .command('initMonkeys', `Initialize ${monkeyOptions.monkeyFilename}.  If file exists, must use --force`, {
    force: {
      description: 'Force removal of monkeys file',
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

if (command === 'initMonkeys') {
  monkeyOptions.forceNewMonkeysFile = argv.force;
  monkeys.init(monkeyOptions);
} else if (command === 'standings') {
  const teamsAndFixtures = teams.fetchTeamsAndFixtures(monkeyOptions);

  _.forEach(teamsAndFixtures, (teamObj, teamName) => {
    teamObj.stats = {
      home: standings.genStats(teamName, teamObj.fixtures.home),
      away: standings.genStats(teamName, teamObj.fixtures.away)
    };

    console.log(JSON.stringify(teamObj, undefined, 2));
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
