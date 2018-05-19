"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const mkdirp = require('mkdirp-promise');
const path = require("path");
const os = require("os");
const fs = require("fs");
const Papa = require("papaparse");
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
app.use(cors);
//Key
app.get('/processPortfolioKey', (req, res) => {
    const uid = req.headers.authorization.toString().split(' ')[0];
    const portfolio = req.headers.authorization.toString().split(' ')[1];
    const filePath = `/users/${uid}/portfolios/${portfolio}/data/key.csv`;
    const localFile = path.join(os.tmpdir(), filePath);
    const locaDir = path.dirname(localFile);
    return mkdirp(locaDir).then(() => {
        return storage.file(filePath).download({ destination: localFile });
    }).then(() => {
        fs.readFile(localFile, 'utf8', (err, data) => {
            const parsedData = Papa.parse(data);
            return uploadKeyData(parsedData.data, uid, portfolio).then(() => {
                res.send('Successly Uploaded Key Data');
            });
        });
    });
});
function uploadKeyData(data, uid, portfolio) {
    const keyData = [];
    const columns = arrayToLowerCase(data[0]);
    const idIdx = columns.indexOf("id");
    const staIdx = columns.indexOf("station name");
    const typeIdx = columns.indexOf("fuel type");
    const profIdx = columns.indexOf("profile");
    const renewIdx = columns.indexOf("renewable");
    for (let i = 1; i < data.length; i++) {
        keyData.push({
            'id': Number.parseInt(data[i][idIdx]),
            'station name': data[i][staIdx].toLowerCase(),
            'fuel type': data[i][typeIdx].toLowerCase(),
            'profile': data[i][profIdx].toLowerCase(),
            'renewable': (data[i][renewIdx] === 'TRUE' ? true : false),
        });
    }
    return keyDataBatchUpload(keyData, uid, portfolio);
}
function keyDataBatchUpload(keyData, uid, portfolio) {
    if (keyData.length <= 0) {
        return Promise.resolve(true);
    }
    const keyRef = admin.firestore().collection(uid).doc('portfolios').collection('data').doc(portfolio).collection('key');
    const batch = admin.firestore().batch();
    for (let i = 0; i < 500 && i < keyData.length; i++) {
        const eleRef = keyRef.doc(`${keyData[i]['id']} - ${keyData[i]['station name']}`);
        batch.set(eleRef, keyData[i], { merge: true });
    }
    return batch.commit().then(() => {
        return keyDataBatchUpload(keyData.slice(500, keyData.length), uid, portfolio);
    });
}
//Capacity 
app.get('/processPortfolioCapacity', (req, res) => {
    const uid = req.headers.authorization.toString().split(' ')[0];
    const portfolio = req.headers.authorization.toString().split(' ')[1];
    const filePath = `/users/${uid}/portfolios/${portfolio}/data/capacity.csv`;
    const localFile = path.join(os.tmpdir(), filePath);
    const locaDir = path.dirname(localFile);
    return mkdirp(locaDir).then(() => {
        return storage.file(filePath).download({ destination: localFile });
    }).then(() => {
        fs.readFile(localFile, 'utf8', (err, data) => {
            const parsedData = Papa.parse(data);
            return uploadCapacityData(parsedData.data, uid, portfolio).then(() => {
                res.send('Successly Uploaded Capacity Data');
            });
        });
    });
});
function uploadCapacityData(data, uid, portfolio) {
    const capData = [];
    const columns = arrayToLowerCase(data[0]);
    const idIdx = columns.indexOf("id");
    const yearIdx = columns.indexOf("year");
    const capIdx = columns.indexOf("capacity");
    for (let i = 1; i < data.length; i++) {
        capData.push({
            'id': Number.parseInt(data[i][0]),
            'year': Number.parseInt(data[i][yearIdx]),
            'capacity': Number.parseFloat(data[i][capIdx].replace(/,/g, '')),
        });
    }
    return capacityDataBatchUpload(capData, uid, portfolio);
}
function capacityDataBatchUpload(capData, uid, portfolio) {
    if (capData.length <= 0) {
        return Promise.resolve(true);
    }
    const capRef = admin.firestore().collection(uid).doc('portfolios').collection('data').doc(portfolio).collection('capacity');
    const batch = admin.firestore().batch();
    for (let i = 0; i < 500 && i < capData.length; i++) {
        const eleRef = capRef.doc(`${capData[i]['year']}`);
        const capObj = {};
        capObj[capData[i].id] = capData[i].capacity;
        capObj['year'] = capData[i].year;
        batch.set(eleRef, capObj, { merge: true });
    }
    return batch.commit().then(() => {
        return capacityDataBatchUpload(capData.slice(500, capData.length), uid, portfolio);
    });
}
// Load
app.get('/processPortfolioLoad', (req, res) => {
    const uid = req.headers.authorization.toString().split(' ')[0];
    const portfolio = req.headers.authorization.toString().split(' ')[1];
    const filePath = `/users/${uid}/portfolios/${portfolio}/data/load.csv`;
    const localFile = path.join(os.tmpdir(), filePath);
    const locaDir = path.dirname(localFile);
    return mkdirp(locaDir).then(() => {
        return storage.file(filePath).download({ destination: localFile });
    }).then(() => {
        fs.readFile(localFile, 'utf8', (err, data) => {
            const parsedData = Papa.parse(data);
            return uploadLoadData(parsedData.data, uid, portfolio).then(() => {
                res.send('Successly Uploaded Load Data');
            });
        });
    });
});
function uploadLoadData(data, uid, portfolio) {
    const loadData = [];
    const columns = arrayToLowerCase(data[0]);
    const timeIdx = columns.indexOf("time");
    const loadIdx = columns.indexOf("load");
    for (let i = 1; i < data.length; i++) {
        loadData.push({
            'time': new Date(data[i][0]),
            'load': Number.parseFloat(data[i][1].replace(/,/g, '')),
        });
    }
    return loadDataBatchUpload(loadData, uid, portfolio);
}
function loadDataBatchUpload(loadData, uid, portfolio) {
    if (loadData.length <= 0) {
        return Promise.resolve(true);
    }
    const loadRef = admin.firestore().collection(uid).doc('portfolios').collection('data').doc(portfolio).collection('load');
    const batch = admin.firestore().batch();
    for (let i = 0; i < 500 && i < loadData.length; i++) {
        const time = new Date(loadData[i].time);
        const monthYearDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
        const dateKey = monthYearDay.toDateString().split(' ').slice(1, 4).join(' ');
        const eleRef = loadRef.doc(dateKey);
        const hour = time.getHours();
        const loadObj = {};
        loadObj[hour] = loadData[i].load;
        loadObj['time'] = monthYearDay;
        batch.set(eleRef, loadObj, { merge: true });
    }
    return batch.commit().then(() => {
        return loadDataBatchUpload(loadData.slice(500, loadData.length), uid, portfolio);
    });
}
//Profile
app.get('/processPortfolioProfile', (req, res) => {
    const uid = req.headers.authorization.toString().split(' ')[0];
    const portfolio = req.headers.authorization.toString().split(' ')[1];
    const filePath = `/users/${uid}/portfolios/${portfolio}/data/profile.csv`;
    const localFile = path.join(os.tmpdir(), filePath);
    const locaDir = path.dirname(localFile);
    return mkdirp(locaDir).then(() => {
        return storage.file(filePath).download({ destination: localFile });
    }).then(() => {
        fs.readFile(localFile, 'utf8', (err, data) => {
            const parsedData = Papa.parse(data);
            return uploadProfileData(parsedData.data, uid, portfolio).then(() => {
                res.send('Successly Uploaded Profile Data');
            });
        });
    });
});
function uploadProfileData(data, uid, portfolio) {
    const profileData = [];
    const columns = arrayToLowerCase(data[0]);
    const indexs = {};
    for (let i = 0; i < columns.length; i++) {
        indexs[columns[i]] = i;
    }
    for (let i = 1; i < data.length; i++) {
        const row = {};
        for (let j = 0; j < columns.length; j++) {
            if (j === 0) {
                row['time'] = new Date(data[i][j]);
            }
            else {
                row[columns[j]] = Number.parseFloat(data[i][indexs[columns[j]]].replace(/,/g, ''));
            }
        }
        profileData.push(row);
    }
    return profileDataBatchUpload(profileData, uid, portfolio);
}
function profileDataBatchUpload(profileData, uid, portfolio) {
    if (profileData.length <= 0) {
        return Promise.resolve(true);
    }
    const loadRef = admin.firestore().collection(uid).doc('portfolios').collection('data').doc(portfolio).collection('profiles');
    const batch = admin.firestore().batch();
    for (let i = 0; i < 500 && i < profileData.length; i++) {
        const time = new Date(profileData[i].time);
        const hour = time.getHours();
        const monthYearDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
        const dateKey = monthYearDay.toDateString().split(' ').slice(1, 4).join(' ');
        const eleRef = loadRef.doc(dateKey);
        const profiles = [];
        Object.keys(profileData[i]).forEach(key => {
            if (key !== 'time') {
                profiles.push({ [key]: profileData[i][key] });
            }
        });
        batch.set(eleRef, { [hour]: profiles, 'time': monthYearDay }, { merge: true });
    }
    return batch.commit().then(() => {
        return profileDataBatchUpload(profileData.slice(500, profileData.length), uid, portfolio);
    });
}
function arrayToLowerCase(input) {
    return input.join('|').toLowerCase().split('|');
}
exports.app = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map