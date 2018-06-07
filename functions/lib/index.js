"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const mkdirp = require('mkdirp-promise');
const whitelist = ['https://haven-196001.firebaseapp.com/', 'http://localhost:4200'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
const cors = require('cors')(corsOptions);
const serviceAccount = require('../service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://haven-196001.appspot.com'
});
const storage = admin.storage().bucket();
const app = express();
function deleteCollections(collectionRefs) {
    if (collectionRefs.length === 0) {
        return Promise.resolve();
    }
    else {
        return collectionRefs[0].get().then((querySnapshot) => {
            const docRefs = [];
            querySnapshot.forEach((doc) => {
                docRefs.push(collectionRefs[0].doc(doc.id));
            });
            return deleteDocs(docRefs).then(() => {
                console.log(`Collection Deleted. ${collectionRefs.length} remaining`);
                return deleteCollections(collectionRefs.splice(1));
            });
        });
    }
}
function deleteDocs(docRefs) {
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
    });
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
    console.log(`Starting to delete portfolio: ${portfolioName} from user: ${uid}`);
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
                console.log('Collection References Obtained');
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
//# sourceMappingURL=index.js.map