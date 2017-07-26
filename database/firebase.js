import * as admin from 'firebase-admin';

var serviceAccount = require('./firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://boomtown-b4c5d.firebaseio.com"
});

export default admin;