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
        const query = `SELECT 
                    lt.id, lt.technology, ltc.year, ltc.value 
                  FROM 
                    loctechs lt, loctech_capacity ltc 
                  WHERE 
                    lt.id = ltc.loctech;`;
        pgPool.query(query, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            }
            else {
                const responseResults = {};
                results.rows.forEach(element => {
                    const technology = element['technology'];
                    const year = element['year'];
                    const value = Number(element['value']);
                    if (!responseResults[technology]) {
                        responseResults[technology] = {};
                    }
                    if (!responseResults[technology][year]) {
                        responseResults[technology][year] = 0;
                    }
                    responseResults[technology][year] += value;
                });
                res.send(JSON.stringify(responseResults));
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
        const query = `SELECT 
                    lt.technology, ltg.datetime AS hour, SUM(ltg.value)
                  FROM 
                    loctechs lt, loctech_generation ltg 
                  WHERE 
                    lt.id = ltg.loctech AND
                    ltg.scenario = ${scenario} AND
                    ltg.datetime >= '${year}-01-01 00:00:00' AND
                    ltg.datetime <= '${year}-12-31 23:00:00'
                  GROUP BY
                    lt.technology, hour;`;
        pgPool.query(query, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send(err);
            }
            else {
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
            }
            else {
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
            }
            else {
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
//# sourceMappingURL=index.js.map