const fs = require('fs');
const _ = require('lodash');

const results = require('./results.js');

/*
 * Flatten the teams Object to have the team as the top level.
 */
const flatten = teamsObj => {
  const retObj = {};

  _.forIn(teamsObj, (teams, conference) => {
    _.forIn(teams, (teamObj, teamName) => {
      retObj[teamName] = _.merge(teamObj, {
        conference
      });
    });
  });

  return retObj;
};

const fetch = fname => {
  try {
    const teamsString = fs.readFileSync(fname);
    return flatten(JSON.parse(teamsString));
  } catch (err) {
    console.log(err);
    return [];
  }
};

const addFixtureToTeams = (teamsObj, fixture, date) => {
  const homeTeam = teamsObj[fixture.home.team];
  const awayTeam = teamsObj[fixture.away.team];

  homeTeam.fixtures = homeTeam.fixtures || {
    home: [],
    away: []
  };

  homeTeam.fixtures.home.push({
    date, fixture
  });

  awayTeam.fixtures = awayTeam.fixtures || {
    home: [],
    away: []
  };

  awayTeam.fixtures.away.push({
    date, fixture
  });
};

const fetchTeamsAndFixtures = opt => {
  const teamsObj = fetch(opt.teamFilename);

  const resultObj = results.fetchAll(opt);
  Object.keys(resultObj).forEach(date => {
    resultObj[date].forEach(fixture => {
      addFixtureToTeams(teamsObj, fixture, date);
    });
  });

  const fixturesObj = {};

  _.forEach(resultObj, (fixtureAry, date) => {
    _.forEach(fixtureAry, v => {
      const homeSide = v.home.team;
      const awaySide = v.away.team;

      fixturesObj[homeSide] = fixturesObj[homeSide] || {
        home: {},
        away: {}
      };
      fixturesObj[awaySide] = fixturesObj[awaySide] || {
        home: {},
        away: {}
      };

      fixturesObj[homeSide].home[date] = v;
      fixturesObj[awaySide].away[date] = v;
    });
  });

  console.log(fixturesObj);

  return fixturesObj;
};

module.exports = {
  fetch, fetchTeamsAndFixtures
};
