const _ = require('lodash');
const Enum = require('enum');

const resultsEnum = new Enum(['DRAW', 'HOME_WIN', 'AWAY_WIN']);

const sidesEnum = new Enum(['HOME', 'AWAY']);

const gameResult = fixture => {
  if (fixture.home.score > fixture.away.score) {
    return resultsEnum.HOME_WIN;
  } else if (fixture.home.score < fixture.away.score) {
    return resultsEnum.AWAY_WIN;
  }
  return resultsEnum.DRAW;
};

const teamIsHome = (team, fixture) => {
  return fixture.home.team === team;
};

const genStats = (team, teamFixtures) => {
  let gamesPlayed = 0;

  const record = {
    wins: 0,
    losses: 0,
    draws: 0
  };

  const goals = {
    for: 0,
    against: 0
  };

  _.forEach(teamFixtures, fixture => {
    console.log(fixture);
    console.log('------------------');

    gamesPlayed++;
    if (teamIsHome(team, fixture.fixture)) {
      goals.for += Number(fixture.fixture.home.score);
      goals.against += Number(fixture.fixture.away.score);
      switch (gameResult(fixture.fixture)) {
      case resultsEnum.HOME_WIN:
        record.wins++;
        break;
      case resultsEnum.AWAY_WIN:
        record.losses++;
        break;
      default:
        record.draws++;
      }
    } else {
      goals.against += Number(fixture.fixture.home.score);
      goals.for += Number(fixture.fixture.away.score);
      switch (gameResult(fixture.fixture)) {
      case resultsEnum.HOME_WIN:
        record.losses++;
        break;
      case resultsEnum.AWAY_WIN:
        record.wins++;
        break;
      default:
        record.draws++;
      }
    }
  });

  return {
    gamesPlayed, record, goals
  };
};

const points = stats => {
  console.log(stats);

  const retObj = {
    home: 0,
    away: 0,
    total: 0
  };

  retObj.home = (stats.home.record.wins * 3) + stats.home.record.draws;
  retObj.away = (stats.away.record.wins * 3) + stats.away.record.draws;
  retObj.total = retObj.home + retObj.away;

  return retObj;
};

const makeStatsObj = (teamObj, teamName) => {
  teamObj.stats = {
    home: genStats(teamName, teamObj.fixtures.home),
    away: genStats(teamName, teamObj.fixtures.away)
  };

  teamObj.standingsPoints = points(teamObj.stats);
};

module.exports = {
  points, makeStatsObj
};
