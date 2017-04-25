const _ = require('lodash');
const Enum = require('enum');

const resultsEnum = new Enum(['DRAW', 'HOME_WIN', 'AWAY_WIN']);

const sidesEnum = new Enum(['HOME', 'AWAY']);

const gameResult = fixture => {
  let result = resultsEnum.DRAW;
  if (fixture.home.score > fixture.away.score) {
    result = resultsEnum.HOME_WIN;
  } else if (fixture.home.score < fixture.away.score) {
    result = resultsEnum.AWAY_WIN;
  }

  return result;
};

const teamIsHome = (team, fixture) => {
  return fixture.home.team === team;
};

const genStats = (team, teamFixtures) => {
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
    if (teamIsHome(team, fixture)) {
      goals.for += Number(fixture.home.score);
      goals.against += Number(fixture.away.score);
      switch (gameResult(fixture)) {
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
      goals.against += Number(fixture.home.score);
      goals.for += Number(fixture.away.score);
      switch (gameResult(fixture)) {
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
    record, goals
  };
};

module.exports = {
  genStats
};
