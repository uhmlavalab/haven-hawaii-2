const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const pg = require('pg');
const connectionName = process.env.INSTANCE_CONNECTION_NAME || 'haven-hawaii-2:us-central1:haven';
const dbUser = process.env.SQL_USER || 'postgres';
const dbPassword = process.env.SQL_PASSWORD || 'havendb';
const dbName = process.env.SQL_NAME || 'haven_db';
const pgConfig = {
  max: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  host: null
};
let pgPool;
if (process.env.NODE_ENV === 'production') {
  pgConfig.host = `/cloudsql/${connectionName}`;
}

exports.capacityData = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (!pgPool) {
      pgPool = new pg.Pool(pgConfig);
    }
    let scenario = req.query.scenario;
    let query = `SELECT 
                    lt.technology, ltc.year, sum(ltc.value)
                  FROM 
                    loctechs lt, loctech_capacity ltc 
                  WHERE 
                    lt.id = ltc.loctech AND ltc.scenario = ${scenario}
                  GROUP BY 
                    lt.technology, ltc.year
                  ORDER BY 
                    ltc.year ASC;`;

    const responseResults = {};
    pgPool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(JSON.stringify(results));
      }
    });
  });
});

exports.demandData = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (!pgPool) {
      pgPool = new pg.Pool(pgConfig);
    }
    const year = req.query.year;
    const scenario = req.query.scenario;
    const scale = req.query.scale;
    const agg = req.query.aggregate;

    let scaleQuery = null;
    let limitYear = '';
    let query = '';
    if (agg == 1) {
      if (scale == 'years') {
        scaleQuery = `date_part('year', ltg.datetime) as time, 
                    SUM(ltg.value)`;
      } else if (scale == 'months') {
        scaleQuery = `date_part('months', ltg.datetime) as time, 
                    SUM(ltg.value)`;
        limitYear = `AND date_part('year', ltg.datetime) = ${year}`;
      } else if (scale == 'hours') {
        scaleQuery = `date_part('hours', ltg.datetime) as time, 
                    SUM(ltg.value) / 365 as sum`;
        limitYear = `AND date_part('year', ltg.datetime) = ${year}`;
      }
      query = `SELECT 
                      lt.technology, 
                      ${scaleQuery}
                    FROM 
                      loctechs lt, 
                      loctech_generation ltg 
                    WHERE 
                      lt.technology = 'demand' AND
                      lt.id = ltg.loctech AND 
                      ltg.scenario = ${scenario} 
                      ${limitYear}
                    GROUP BY 
                      lt.technology, 
                      time;`;
    } else {
      console.log('Demand Time');
      query = `SELECT 
                      lt.technology, 
                      extract(month from ltg.datetime) as mon,
                      extract(year from ltg.datetime) as yyyy,
                      SUM(ltg.value)
                    FROM 
                      loctechs lt, 
                      loctech_generation ltg 
                    WHERE 
                      lt.technology = 'demand' AND
                      lt.id = ltg.loctech AND 
                      ltg.scenario = ${scenario} 
                    GROUP BY 
                      lt.technology, 
                      mon,
                      yyyy;`;

    }


    pgPool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(JSON.stringify(results));
      }

    });
  });
});

exports.generationData = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (!pgPool) {
      pgPool = new pg.Pool(pgConfig);
    }
    const year = req.query.year;
    const scenario = req.query.scenario;
    const scale = req.query.scale;

    let scaleQuery = null;
    let limitYear = '';

    if (scale == 'years') {
      scaleQuery = `date_part('year', ltg.datetime) as time, 
                    SUM(ltg.value)`;
    } else if (scale == 'months') {
      scaleQuery = `date_part('months', ltg.datetime) as time, 
                    SUM(ltg.value)`;
      limitYear = `AND date_part('year', ltg.datetime) = ${year}`;
    } else if (scale == 'hours') {
      scaleQuery = `date_part('hours', ltg.datetime) as time, 
                    SUM(ltg.value) / 365 as sum`;
      limitYear = `AND date_part('year', ltg.datetime) = ${year}`;
    }
    // lt.technology != 'battery' AND
    const query = `SELECT 
                    lt.technology, 
                    ${scaleQuery}
                  FROM 
                    loctechs lt, 
                    loctech_generation ltg 
                  WHERE 
                    lt.technology != 'demand' AND
                    lt.id = ltg.loctech AND 
                    ltg.scenario = ${scenario} 
                    ${limitYear}
                  GROUP BY 
                    lt.technology, 
                    time;`;

    pgPool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(JSON.stringify(results));
      }

    });
  });
});

exports.solarTotalYear = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (!pgPool) {
      pgPool = new pg.Pool(pgConfig);
    }

    const year = req.query.year;
    const scenario = req.query.scenario;

    const query = `SELECT
                    lt.technology, sum(ltg.value) 
                   FROM 
                    loctechs lt, 
                    loctech_generation ltg 
                   WHERE 
                    lt.technology = 'pv' AND 
                    lt.id = ltg.loctech AND 
                    ltg.scenario = ${scenario} AND 
                    date_part('year', ltg.datetime) = ${year} 
                  GROUP BY 
                    lt.technology;
    `;

    pgPool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(JSON.stringify(results));
      }

    });
  });
});


exports.scenariosList = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (!pgPool) {
      pgPool = new pg.Pool(pgConfig);
    }

    const query = `SELECT 
                    *
                  FROM 
                    scenarios`;

    pgPool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        const responseResults = {
          scenarios: []
        };
        results.rows.forEach(element => {
          responseResults.scenarios.push(element);
        });
        res.send(JSON.stringify(responseResults));
      }
    });
  });
});

exports.sharesList = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    if (!pgPool) {
      pgPool = new pg.Pool(pgConfig);
    }

    const scenario = req.query.scenario;

    const query = `SELECT 
                    *
                  FROM 
                    scenario_shares ss
                  WHERE
                    ss.scenario = ${scenario};`;

    pgPool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        const responseResults = {
          shares: []
        };
        results.rows.forEach(element => {
          responseResults.shares.push(element);
        });
        res.send(JSON.stringify(responseResults));
      }
    });
  });
});