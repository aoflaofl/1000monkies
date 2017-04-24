const _ = require('lodash');
const Enum = require('enum');

const resultsEnum = new Enum(['DRAW', 'HOME_WIN', 'AWAY_WIN']);

const gameResult = fixture => {
  let result = resultsEnum.DRAW;
  if (fixture.home.score > fixture.away.score) {
    result = resultsEnum.HOME_WIN;
  } else if (fixture.home.score < fixture.away.score) {
    result = resultsEnum.AWAY_WIN;
  }

  return result;
};

const resultScore = (team, fixture) => {
  const result = gameResult(fixture);

  if (result === resultsEnum.DRAW) {
    return 1;
  }
  if (team === fixture.home.team) {
    if (result === resultsEnum.HOME_WIN) {
      return 3;
    }
    return 0;
  }
  if (result === resultsEnum.HOME_WIN) {
    return 0;
  }
  return 3;
};

const teamIsHome = (team, fixture) => {
  return fixture.home.team === team;
};

const standingsPoints = (team, teamFixtures) => {
  let tot = 0;
  _.forEach(teamFixtures, fixture => {
    console.log(fixture);
    tot += resultScore(team, fixture);
    console.log(resultScore(team, fixture));
  });
  console.log(`Total is ${tot}`);
};

const record = (team, teamFixtures) => {
  const retObj = {
    wins: 0,
    losses: 0,
    draws: 0
  };

  _.forEach(teamFixtures, fixture => {
    if (teamIsHome(team, fixture)) {
      switch (gameResult(fixture)) {
        case resultsEnum.HOME_WIN:
          retObj.wins++;
          break;
        case resultsEnum.AWAY_WIN:
          retObj.losses++;
          break;
        default:
          retObj.draws++;
      }
    } else {
      switch (gameResult(fixture)) {
        case resultsEnum.HOME_WIN:
          retObj.losses++;
          break;
        case resultsEnum.AWAY_WIN:
          retObj.wins++;
          break;
        default:
          retObj.draws++;
      }
    }
  });

  console.log(retObj);
  return retObj;
};

module.exports = {
  resultScore, standingsPoints, record
};
