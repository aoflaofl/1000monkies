// Modify team data files

const fs = require('fs');

var fetchTeams = () => {
  try {
    var teamsString = fs.readFileSync('./teams.json');
    return JSON.parse(teamsString);
  } catch (e) {
    console.log(e);
    return [];
  }
};

var teams = fetchTeams();

var out = {};

Object.keys(teams).forEach((e) => {
  console.log(e);
  out[teams[e].conference] = out[teams[e].conference] || {};
  out[teams[e].conference][e] = {
    'fullname': teams[e].fullname
  };
});

console.log(JSON.stringify(out));
