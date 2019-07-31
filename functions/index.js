const functions = require('firebase-functions');
const enrollmentController = require('./src/controller/enrollment');

const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.sendNotification = functions.https.onRequest(enrollmentController.sendWeeklyNotification(db));
exports.handle = functions.https.onRequest(enrollmentController.handle(db));
exports.randomRoster = functions.https.onRequest(enrollmentController.randomRoster(db));