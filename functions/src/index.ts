import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
const mkdirp = require('mkdirp-promise');
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import * as Papa from 'papaparse'


///// SQL TEST
const mysql = require('mysql');

/**
 * TODO(developer): specify SQL connection details
 */
const connectionName = process.env.INSTANCE_CONNECTION_NAME || 'haven-196001:us-west1:haven-sql';
const dbUser = process.env.SQL_USER || 'psip_oahu_user';
const dbPassword = process.env.SQL_PASSWORD || 'oahupsip!';
const dbName = process.env.SQL_NAME || 'psip_oahu';

const mysqlConfig = {
  connectionLimit: 1,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  socketPath: `/cloudsql/${connectionName}`,
};

// Connection pools reuse connections between invocations,
// and handle dropped or expired connections automatically.
let mysqlPool;

exports.mysqlDemo = functions.https.onRequest((req, res) => {
  // Initialize the pool lazily, in case SQL access isn't needed for this
  // GCF instance. Doing so minimizes the number of active SQL connections,
  // which helps keep your GCF instances under SQL connection limits.
  if (!mysqlPool) {
    mysqlPool = mysql.createPool(mysqlConfig);
  }

  const year = 2031;
  const loadType = `Base`;
  const scenario = `E3`;
  mysqlPool.query(`SELECT * FROM profiles WHERE year(time)=${year}`, (errProfile, profileResults) => {
    if (errProfile) {
      console.log('profile error', errProfile);
      res.status(500).send(errProfile);
    }
    mysqlPool.query(`SELECT * FROM capacity WHERE year=${year} AND scenario='${scenario}'`, (errCapacity, capacityResults) => {
      if (errCapacity) {
        console.log('capacity error', errProfile);
        res.status(500).send(errCapacity);
      }
      mysqlPool.query(`SELECT * FROM demand WHERE year(time)=${year} AND type='${loadType}'`, (errDemand, demandResults) => {
        if (errDemand) {
          console.log('demand error', errDemand);
          res.status(500).send(errDemand);
        }
        mysqlPool.query(`SELECT * FROM stationkey`, (errKey, keyResults) => {
          if (errKey) {
            console.log('key error', errKey);
            res.status(500).send(errKey);
          } else {
            const supply = {};

            keyResults.forEach(el => {
              const station = capacityResults.filter(obj => {
                return obj['stationId'] === el['stationId'];
              })
              el['capacity'] = station.capacity;
            })

            const results = {
              key: keyResults,
            };

            console.log('Query Successful')
            res.send(results);
          }
        });
      });
    });
  });


  // Close any SQL resources that were declared inside this function.
  // Keep any declared in global scope (e.g. mysqlPool) for later reuse.
});

///////////

const whitelist = ['https://haven-196001.firebaseapp.com/', 'http://localhost:4200']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}



const cors = require('cors')(corsOptions);
const serviceAccount = require('../service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://haven-196001.appspot.com'
});
const storage = admin.storage().bucket();
const app = express();


function deleteCollections(collectionRefs: FirebaseFirestore.CollectionReference[]): Promise<any> {
  if (collectionRefs.length === 0) {
    return Promise.resolve();
  } else {
    return collectionRefs[0].get().then((querySnapshot) => {
      const docRefs = [];
      querySnapshot.forEach((doc) => {
        docRefs.push(collectionRefs[0].doc(doc.id));
      });
      return deleteDocs(docRefs).then(() => {
        console.log(`Collection Deleted. ${collectionRefs.length} remaining`);
        return deleteCollections(collectionRefs.splice(1));
      })
    })
  }
}

function deleteDocs(docRefs: any[]): Promise<any> {
  if (docRefs.length === 0) {
    return Promise.resolve();
  }
  const batch = admin.firestore().batch();
  for (let i = 0; i < 50 && docRefs.length; i++) {
    if (typeof docRefs[i] != 'undefined') {
      batch.delete(docRefs[i]);
    }
  }
  return batch.commit().then(() => {
    return deleteDocs(docRefs.slice(50));
  })
}

exports.deletePortfolio = functions.firestore
  .document('deletePortfolio/{portfolioId}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();
    // access a particular field as you would any JS property
    const portfolioName = newValue.portfolioName;
    const uid = newValue.uid;
    const portfolioDBRef = admin.firestore().doc(`/${uid}/data/portfolios/${portfolioName}`);
    console.log(`Starting to delete portfolio: ${portfolioName} from user: ${uid}`)
    return portfolioDBRef.delete().then(() => {
      const collectionRefs = [];

      const keyRef = portfolioDBRef.collection('key');
      collectionRefs.push(keyRef);
      const profileRef = portfolioDBRef.collection('profile');
      collectionRefs.push(profileRef);
      const layersRef = portfolioDBRef.collection('layers');
      collectionRefs.push(layersRef);

      return portfolioDBRef.collection('loads').get().then((loadsSnapshot) => {
        loadsSnapshot.forEach((doc) => {
          collectionRefs.push(portfolioDBRef.collection('loads').doc(doc.id).collection('load'));
        });
        return portfolioDBRef.collection('scenarios').get().then((scenariosSnapshot) => {
          scenariosSnapshot.forEach((doc) => {
            collectionRefs.push(portfolioDBRef.collection('scenarios').doc(doc.id).collection('capacity'));
            collectionRefs.push(portfolioDBRef.collection('scenarios').doc(doc.id).collection('renewablePercent'));
          });
          console.log('Collection References Obtained')
          return deleteCollections(collectionRefs).then(() => {
            console.log(`SUCCESSFULLY DELETED : ${portfolioName}`);
            return Promise.resolve(true);
          });
        });
      });
    });
  });

app.use(cors);
exports.app = functions.https.onRequest(app);

// firebase.firestore().collection(this.afAuth.auth.currentUser.uid).doc('data').collection('portfolios').doc('PSIP_Test').collection('portfolio_data').doc('data').collection('profile').get().then((querySnapshot) => {
//   const docIds = [];
//   querySnapshot.forEach((doc) => {
//     docIds.push(doc.id);
//   });
//   function deleteDoc(docIdList: any[], userid: string): Promise<any> {
//     return firebase.firestore().collection(userid).doc('data').collection('portfolios').doc('PSIP').collection('portfolio_data').doc('data').collection('profile').doc(docIdList[0]).delete().then(() => {
//       console.log(docIdList[0] + ' Deleted');
//       return deleteDoc(docIdList.slice(1), userid);
//     });
//   }
//   return deleteDoc(docIds, this.afAuth.auth.currentUser.uid);
// });


