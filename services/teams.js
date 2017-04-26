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

const fetch = () => {
  try {
    const teamsString = fs.readFileSync('./teams.json');
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
    home: {},
    away: {}
  };

  homeTeam.fixtures.home[date] = fixture;

  awayTeam.fixtures = awayTeam.fixtures || {
    home: {},
    away: {}
  };

  awayTeam.fixtures.away[date] = fixture;
};

const fetchTeamsAndFixtures = opt => {
  const teamsObj = fetch();

  const resultObj = results.fetchAll(opt);
  Object.keys(resultObj).forEach(date => {
    resultObj[date].forEach(fixture => {
      addFixtureToTeams(teamsObj, fixture, date);
    });
  });

  return teamsObj;
};

module.exports = {
  fetch, fetchTeamsAndFixtures
};
