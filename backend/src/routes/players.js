const express = require('express');
const { runQuery } = require('../db/databricks');

const router = express.Router();

const CATALOG = process.env.DATABRICKS_CATALOG || 'workspace';
const SCHEMA = process.env.DATABRICKS_SCHEMA || 'lol_marts_dev_lol_intermediate';
const table = (name) => `${CATALOG}.${SCHEMA}.${name}`;

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

// GET /api/players/:playerName/summary -> career averages
router.get(
  '/players/:playerName/summary',
  handle((req) => {
    const playerName = clean(req.params.playerName);
    return `SELECT team, COUNT(*) AS games, AVG(kills) AS avg_kills,
                   AVG(deaths) AS avg_deaths, AVG(assists) AS avg_assists, AVG(cs) AS avg_cs
            FROM ${table('int_player_games_enriched')}
            WHERE player_name = '${playerName}'
            GROUP BY team`;
  })
);

// GET /api/players/:playerName/champions -> per-champion breakdown
router.get(
  '/players/:playerName/champions',
  handle((req) => {
    const playerName = clean(req.params.playerName);
    return `SELECT champion, COUNT(*) AS games_played, AVG(kills) AS avg_kills,
                   AVG(deaths) AS avg_deaths, AVG(assists) AS avg_assists
            FROM ${table('int_player_games_enriched')}
            WHERE player_name = '${playerName}'
            GROUP BY champion
            ORDER BY games_played DESC`;
  })
);

module.exports = router;