const fs = require('fs');
const _ = require('lodash');

var fetch = () => {
  try {
    var teamsString = fs.readFileSync('./teams.json');
    return flatten(JSON.parse(teamsString));
  } catch (e) {
    console.log(e);
    return [];
  }
};

/*
 * Flatten the teams Object to have the team as the top level.
 */
var flatten = (teamsObj) => {
  var retObj = {};

  _.forIn(teamsObj, (teams, conference) => {
    _.forIn(teams, (teamObj, teamName) => {
      retObj[teamName] = _.merge(teamObj, {
        conference
      });
    });
  });
  return retObj;
};

var fetchTeamsAndFixtures = (opt) => {
  var teamsObj = fetch();

  var dir = `${opt.resultsDir}\\${opt.season}`;
  var resultFiles = fs.readdirSync(dir);

  resultFiles.forEach((result) => {
    var file = `${dir}\\${result}`;
    var resultString = fs.readFileSync(file);
    resultObj = JSON.parse(resultString);
    Object.keys(resultObj).forEach((date) => {
      resultObj[date].forEach((fixture) => {
        var homeObj = teamsObj[fixture.home.team];
        homeObj.fixtures = homeObj.fixtures || {};
        homeObj.fixtures[date] = fixture;

        var awayObj = teamsObj[fixture.away.team];
        awayObj.fixtures = awayObj.fixtures || {};
        awayObj.fixtures[date] = fixture;
      });
    });
  });

  return teamsObj;
};

var resultScore = (team, fixture) => {
  var result = gameResult(fixture);

  if (result === 'tie') {
    return 1;
  }
  if (team === fixture.home.team) {
    if (result === 'home') {
      return 3;
    }
    return 0;
  } else {
    if (result === 'home') {
      return 0;
    }
    return 3;
  }
};

var gameResult = (fixture) => {
  var result = 'tie';
  if (fixture.home.score > fixture.away.score) {
    result = 'home';
  } else if (fixture.home.score < fixture.away.score) {
    result = 'away';
  }

  return result;
};

module.exports = {
  fetch, fetchTeamsAndFixtures, resultScore
};
