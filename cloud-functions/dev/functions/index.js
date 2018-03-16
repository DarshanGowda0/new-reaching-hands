const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {


    const userId = '4uaHJ1zzB9ZWiySnr610oD3oFat2';
    const payload = {
        notification: {
            title: 'New message!',
            body: `Darshan sent you a new message`,
            icon: 'https://goo.gl/Fz9nrQ'
            // "click_action" : "https://dummypage.com"
        }
    }

    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);

    userRef.get()
        .then(snapshot => snapshot.data())
        .then(user => {

            const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []

            if (!tokens.length) {
                throw new Error('User does not have any tokens!')
            }

            return admin.messaging().sendToDevice(tokens, payload)
        })
        .catch(err => console.log(err))

    response.send("Hello from Firebase!");
});