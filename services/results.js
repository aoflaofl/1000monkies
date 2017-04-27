const fs = require('fs');
const _ = require('lodash');

const fetchFileNames = opt => {
  try {
    return _.map(fs.readdirSync(`${opt.resultsDir}\\${opt.season}`), n => {
      return `${opt.resultsDir}\\${opt.season}\\${n}`;
    });
  } catch (err) {
    console.log(err);
    return [];
  }
};

const fetch = fname => {
  try {
    const resultString = fs.readFileSync(fname);
    return JSON.parse(resultString);
  } catch (err) {
    console.log(err);
    return [];
  }
};

const fetchAll = opt => {
  const retObj = {};

  const resultFiles = fetchFileNames(opt);

  _.forEach(resultFiles, resultFile => {
    const resultObj = fetch(resultFile);

    _.forEach(resultObj, (fixturesAry, date) => {
      retObj[date] = _.concat((retObj[date] || []), fixturesAry);
    });
  });

  return retObj;
};

module.exports = {
  fetchFileNames, fetch, fetchAll
};
