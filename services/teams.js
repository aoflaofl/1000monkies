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

  // HomeTeam.fixtures = homeTeam.fixtures || {};
  // homeTeam.fixtures[date] = fixture;

  homeTeam.homeFixtures = homeTeam.homeFixtures || {};
  homeTeam.homeFixtures[date] = fixture;

  // AwayTeam.fixtures = awayTeam.fixtures || {};
  // awayTeam.fixtures[date] = fixture;

  awayTeam.awayFixtures = awayTeam.awayFixtures || {};
  awayTeam.awayFixtures[date] = fixture;
};

const fetchTeamsAndFixtures = opt => {
  const teamsObj = fetch();

  const resultFiles = results.fetchFileNames(opt);

  resultFiles.forEach(resultFile => {
    const resultObj = results.fetch(resultFile);
    Object.keys(resultObj).forEach(date => {
      resultObj[date].forEach(fixture => {
        addFixtureToTeams(teamsObj, fixture, date);
      });
    });
  });

  return teamsObj;
};

module.exports = {
  fetch, fetchTeamsAndFixtures
};
