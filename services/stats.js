const sorting = stats => {
  const home = stats.home;
  const away = stats.away;

  return {
    totalWins: home.record.wins + away.record.wins,
    goalDiff: (home.goals.for + away.goals.for) - (home.goals.against + away.goals.against),
    goalsFor: home.goals.for + away.goals.for,
    awayGoalsDiff: away.goals.for - away.goals.against,
    awayGoalsFor: away.goals.for,
    homeGoalsDiff: home.goals.for - home.goals.against,
    homeGoalsFor: home.goals.for
  };
};

const report = team => {
  console.log(team.fullname, team.standingsPoints.total);
};

module.exports = {
  sorting, report
};
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
