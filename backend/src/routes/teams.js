const express = require('express');
const { runQuery } = require('../db/databricks');

const router = express.Router();

const CATALOG = process.env.DATABRICKS_CATALOG || 'workspace';
const SCHEMA = process.env.DATABRICKS_SCHEMA || 'lol_marts_dev_lol_intermediate';
const table = (name) => `${CATALOG}.${SCHEMA}.${name}`;

// Strips quote characters out of anything coming from the URL before it
// gets interpolated into SQL, closes off the obvious injection path.
const clean = (value) => (value ? String(value).replace(/['";]/g, '') : value);

function handle(queryBuilder) {
  return async (req, res) => {
    try {
      const rows = await runQuery(queryBuilder(req));
      res.json({ count: rows.length, rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

// GET /api/teams -> list of team names for the home page
router.get(
  '/teams',
  handle(() => `SELECT DISTINCT team FROM ${table('int_current_rosters')} ORDER BY team`)
);

// GET /api/teams/:team/roster -> players on that team
router.get(
  '/teams/:team/roster',
  handle((req) => {
    const team = clean(req.params.team);
    return `SELECT player_name, games_played, last_game
            FROM ${table('int_current_rosters')}
            WHERE team = '${team}'
            ORDER BY player_name`;
  })
);

// GET /api/teams/:team/draft-tendencies -> champion pick/ban data for that team
router.get(
  '/teams/:team/draft-tendencies',
  handle((req) => {
    const team = clean(req.params.team);
    return `SELECT champion, times_picked, times_banned, pick_win_rate, pick_rate, ban_rate
            FROM ${table('int_team_draft_tendencies')}
            WHERE team = '${team}'
            ORDER BY pick_rate DESC`;
  })
);

module.exports = router;