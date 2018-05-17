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
app.get('/processNewPortfolio', (req, res) => {
    const uid = req.headers.authorization.toString().split(' ')[0];
    const portfolio = req.headers.authorization.toString().split(' ')[1];
    return startKeyUpload(uid, portfolio).then(() => {
        return startCapacityUpload(uid, portfolio).then(() => {
            return startLoadUpload(uid, portfolio).then(() => {
                return startProfileUpload(uid, portfolio).then(() => {
                    res.send('Sucess');
                    return Promise.resolve(true);
                });
            });
        });
    });
});
//Key
function startKeyUpload(uid, portfolio) {
    return storage.file(`/users/${uid}/portfolios/${portfolio}/data/key.csv`).get().then((response) => {
        const filePath = response[0].name;
        const localFile = path.join(os.tmpdir(), filePath);
        const locaDir = path.dirname(localFile);
        return mkdirp(locaDir).then(() => {
            return storage.file(filePath).download({ destination: localFile }).then(() => {
                fs.readFile(localFile, 'utf8', (err, data) => {
                    const parsedData = Papa.parse(data);
                    return uploadKeyData(parsedData.data, uid, portfolio).then(() => {
                        return Promise.resolve(true);
                    });
                });
            });
        });
    });
}
function uploadKeyData(data, uid, portfolio) {
    const keyData = [];
    const columns = arrayToLowerCase(data[0]);
    let idIdx, staIdx, typeIdx, profIdx, renewIdx = -1;
    for (let i = 0; i < columns.length; i++) {
        switch (columns[i]) {
            case 'id':
                idIdx = i;
                break;
            case 'station name':
                staIdx = i;
                break;
            case 'fuel type':
                typeIdx = i;
                break;
            case 'profile':
                profIdx = i;
                break;
            case 'renewable':
                renewIdx = i;
                break;
        }
    }
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
function startCapacityUpload(uid, portfolio) {
    return storage.file(`/users/${uid}/portfolios/${portfolio}/data/capacity.csv`).get().then((response) => {
        const filePath = response[0].name;
        const localFile = path.join(os.tmpdir(), filePath);
        const locaDir = path.dirname(localFile);
        return mkdirp(locaDir).then(() => {
            return storage.file(filePath).download({ destination: localFile }).then(() => {
                fs.readFile(localFile, 'utf8', (err, data) => {
                    const parsedData = Papa.parse(data);
                    return uploadCapacityData(parsedData.data, uid, portfolio).then(() => {
                        return Promise.resolve(true);
                    });
                });
            });
        });
    });
}
function uploadCapacityData(data, uid, portfolio) {
    const capData = [];
    const columns = arrayToLowerCase(data[0]);
    let idIdx, yearIdx, capIdx = -1;
    for (let i = 0; i < columns.length; i++) {
        switch (columns[i]) {
            case 'id':
                idIdx = i;
                break;
            case 'year':
                yearIdx = i;
                break;
            case 'capacity':
                capIdx = i;
                break;
        }
    }
    for (let i = 1; i < data.length; i++) {
        capData.push({
            'id': Number.parseInt(data[i][idIdx]),
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
        const id = capData[i].id.toString();
        batch.set(eleRef, { [id]: capData[i].capacity, 'year': capData[i].year }, { merge: true });
    }
    return batch.commit().then(() => {
        return capacityDataBatchUpload(capData.slice(500, capData.length), uid, portfolio);
    });
}
// Load
function startLoadUpload(uid, portfolio) {
    return storage.file(`/users/${uid}/portfolios/${portfolio}/data/load.csv`).get().then((response) => {
        const filePath = response[0].name;
        const localFile = path.join(os.tmpdir(), filePath);
        const locaDir = path.dirname(localFile);
        return mkdirp(locaDir).then(() => {
            return storage.file(filePath).download({ destination: localFile }).then(() => {
                fs.readFile(localFile, 'utf8', (err, data) => {
                    const parsedData = Papa.parse(data);
                    return uploadLoadData(parsedData.data, uid, portfolio).then(() => {
                        return Promise.resolve(true);
                    });
                });
            });
        });
    });
}
function uploadLoadData(data, uid, portfolio) {
    const loadData = [];
    const columns = arrayToLowerCase(data[0]);
    let timeIdx, loadIdx = -1;
    for (let i = 0; i < columns.length; i++) {
        switch (columns[i]) {
            case 'time':
                timeIdx = i;
                break;
            case 'load':
                loadIdx = i;
                break;
        }
    }
    for (let i = 1; i < data.length; i++) {
        loadData.push({
            'time': new Date(data[i][timeIdx]),
            'load': Number.parseFloat(data[i][loadIdx].replace(/,/g, '')),
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
        const hour = time.getHours();
        const monthYearDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
        const dateKey = monthYearDay.toDateString().split(' ').slice(1, 4).join(' ');
        const eleRef = loadRef.doc(dateKey);
        batch.set(eleRef, { [hour]: loadData[i].load, 'time': monthYearDay }, { merge: true });
    }
    return batch.commit().then(() => {
        return loadDataBatchUpload(loadData.slice(500, loadData.length), uid, portfolio);
    });
}
//Profile
function startProfileUpload(uid, portfolio) {
    return storage.file(`/users/${uid}/portfolios/${portfolio}/data/profile.csv`).get().then((response) => {
        const filePath = response[0].name;
        const localFile = path.join(os.tmpdir(), filePath);
        const locaDir = path.dirname(localFile);
        return mkdirp(locaDir).then(() => {
            return storage.file(filePath).download({ destination: localFile }).then(() => {
                fs.readFile(localFile, 'utf8', (err, data) => {
                    const parsedData = Papa.parse(data);
                    return uploadProfileData(parsedData.data, uid, portfolio).then(() => {
                        return Promise.resolve(true);
                    });
                });
            });
        });
    });
}
function uploadProfileData(data, uid, portfolio) {
    const profileData = [];
    const columns = data[0];
    const indexs = {};
    for (let i = 0; i < columns.length; i++) {
        indexs[columns[i]] = i;
    }
    for (let i = 1; i < data.length; i++) {
        const row = {};
        for (let j = 0; j < columns.length; j++) {
            if (columns[j] === 'time') {
                row[columns[j]] = new Date(data[i][indexs[columns[j]]]);
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