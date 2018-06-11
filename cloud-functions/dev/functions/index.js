const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();

exports.helloWorld = functions.https.onRequest((request, response) => {

    const payload = {
        notification: {
            title: 'New message!',
            body: `Darshan sent you a new message`,
            icon: 'https://goo.gl/Fz9nrQ'
            // "click_action" : "https://dummypage.com"
        }
    }

    const db = admin.firestore();
    const userRef = db.collection('users');

    userRef.get()
        .then(querySnapshot => {
            let tokens = [];
            querySnapshot.forEach(userDoc => {
                if (userDoc.data().fcmTokens) {
                    tokens = tokens.concat(Object.keys(userDoc.data().fcmTokens));
                }
            });
            if (!tokens.length) {
                throw new Error('User does not have any tokens!');
            }
            console.log('tokens ', tokens)
            return admin.messaging().sendToDevice(tokens, payload)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        })
        .catch(err => console.log(err))

    response.send("Hello from Firebase!");
});

function checkBelowThreshold(modifiedQuantity, thresholdValue, itemId, itemName) {
    if (modifiedQuantity <= thresholdValue) {
        sendAlert(itemId, itemName);
    }
}

function sendAlert(itemId, itemName) {
    const payload = {
        notification: {
            title: itemName + ' are in Danger!',
            body: itemName + ' are running out of stock',
            icon: 'https://goo.gl/Fz9nrQ',
            click_action: "http://localhost:4200/item-details/" + itemId
        }
    }

    const db = admin.firestore();
    const userRef = db.collection('users');

    userRef.get()
        .then(querySnapshot => {
            let tokens = [];
            querySnapshot.forEach(userDoc => {
                if (userDoc.data().fcmTokens) {
                    tokens = tokens.concat(Object.keys(userDoc.data().fcmTokens));
                }
            });
            if (!tokens.length) {
                throw new Error('User does not have any tokens!');
            }
            console.log('tokens ', tokens)
            return admin.messaging().sendToDevice(tokens, payload)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        })
        .catch(err => console.log(err))
}


exports.itemsCreateLog = functions.firestore.document('logs/{logId}').onCreate(event => {
    const logId = event.params.logId;

    console.log('on create called for log id ', logId);

    var document = event.data.data();

    // category,itemId,logType,quantity
    console.log('doc ', document);

    var category = document.category;
    var itemId = document.itemId;
    var logType = document.logType;
    var quantity = document.quantity;
    var timestamp = document.date;

    if (category !== "Inventory") {
        return "NOT INVENTORY LOG";
    }

    if (logType === "Issued") {
        quantity = quantity * -1;
    }

    itemDocRef = firestore.doc('items/' + itemId);
    var transaction = firestore.runTransaction(mTransaction => {
        return mTransaction.get(itemDocRef)
            .then(itemDoc => {
                var modifiedQuantity = itemDoc.data().itemQuantity + quantity;
                checkBelowThreshold(modifiedQuantity, itemDoc.data().thresholdValue, itemDoc.data().itemId, itemDoc.data().itemName);
                mTransaction.update(itemDocRef, {
                    itemQuantity: modifiedQuantity,
                    lastModified: timestamp
                });
            })
    }).then(result => {
        console.log('Transaction for added log success');
    }).catch(err => {
        console.error('Transaction error for add log ', err);
    })

    return "OK";

});

exports.itemsDeleteLog = functions.firestore.document('logs/{logId}').onDelete(event => {

    const logId = event.params.logId;
    console.log('on delete called for log id ', logId);

    var previousDocument = event.data.previous.data();

    if (previousDocument) {

        console.log('previuos doc ', previousDocument);

        var category = previousDocument.category;
        var itemId = previousDocument.itemId;
        var logType = previousDocument.logType;
        var quantity = previousDocument.quantity;
        var timestamp = previousDocument.date;

        if (category !== "Inventory") {
            return "NOT INVENTORY LOG";
        }

        if (logType === "Issued") {
            quantity = quantity * -1;
        }

        itemDocRef = firestore.doc('items/' + itemId);
        var transaction = firestore.runTransaction(mTransaction => {
            return mTransaction.get(itemDocRef)
                .then(itemDoc => {
                    var modifiedQuantity = itemDoc.data().itemQuantity - quantity;
                    checkBelowThreshold(modifiedQuantity, itemDoc.data().thresholdValue, itemDoc.data().itemId, itemDoc.data().itemName);
                    mTransaction.update(itemDocRef, {
                        itemQuantity: modifiedQuantity,
                        lastModified: timestamp
                    });
                })
        }).then(result => {
            console.log('Transaction for delete log success');
        }).catch(err => {
            console.error('Transaction error for delete log ', err);
        })

        return "OK";
    }

    return "FAILED AT FETCHING PREVIOUS DOC";
});

exports.itemsUpdateLog = functions.firestore.document('logs/{logId}').onUpdate(event => {

    const logId = event.params.logId;
    console.log('on update called for log id ', logId);

    var previousQuantity = 0;
    var previousDocument = event.data.previous.data();

    if (previousDocument) {
        console.log('previuos doc ', previousDocument);

        if (previousDocument.category !== "Inventory") {
            return "NOT INVENTORY LOG";
        }

        if (previousDocument.logType === "Issued") {
            previousQuantity = previousDocument.quantity * -1;
        } else {
            previousQuantity = previousDocument.quantity;
        }
    }

    var document = event.data.data();

    var category = document.category;
    var itemId = document.itemId;
    var logType = document.logType;
    var quantity = document.quantity;
    var timestamp = document.date;

    if (logType === "Issued") {
        quantity = quantity * -1;
    }

    itemDocRef = firestore.doc('items/' + itemId);
    var transaction = firestore.runTransaction(mTransaction => {
        return mTransaction.get(itemDocRef)
            .then(itemDoc => {
                var modifiedQuantity = itemDoc.data().itemQuantity - previousQuantity + quantity;
                checkBelowThreshold(modifiedQuantity, itemDoc.data().thresholdValue, itemDoc.data().itemId, itemDoc.data().itemName);
                mTransaction.update(itemDocRef, {
                    itemQuantity: modifiedQuantity,
                    lastModified: timestamp
                });
            })
    }).then(result => {
        console.log('Transaction for update log success');
    }).catch(err => {
        console.error('Transaction error for update log ', err);
    })

    return "OK";

});

exports.notifyNewUser = functions.auth.user().onCreate((event) => {

    const user = event.data;

    const email = user.email;
    const displayName = user.displayName;
    console.log('user ', displayName, ' logged in');

    sendUserAddedAlert(displayName);

    return "OK";

});

function sendUserAddedAlert(displayName) {
    const payload = {
        notification: {
            title: displayName + ' just logged',
            body: 'grant user previlages for ' + displayName,
            icon: 'https://goo.gl/Fz9nrQ',
            click_action: 'http://localhost:4200/AccessControl'
        }
    }

    const db = admin.firestore();
    const userRef = db.collection('users');

    userRef.get()
        .then(querySnapshot => {
            let tokens = [];
            querySnapshot.forEach(userDoc => {
                if (userDoc.data().fcmTokens && userDoc.data().checkAdmin) {
                    tokens = tokens.concat(Object.keys(userDoc.data().fcmTokens));
                }
            });
            if (!tokens.length) {
                throw new Error('User does not have any tokens!');
            }
            console.log('tokens ', tokens)
            return admin.messaging().sendToDevice(tokens, payload)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        })
        .catch(err => console.log(err))
}


exports.getItemDetails = functions.https.onRequest((req, res) => {

    console.log("request method", req.method);
    var reqArray = req.body.queryResult.parameters;
    const item = reqArray['item_name'];
    var date = reqArray['date'];
    //var temp = reqArray['conjunction'];
    var conjuct = temp[0];
    //var exprtime = reqArray['expression-time'];
    //var verbTemp = reqArray['verb'];
    var send = verbTemp[2];
    var how = verbTemp[1];
    var avg = verbTemp[0];
    console.log('date is', date);
    var yestPrev = new Date(date);
    var yestPost = new Date(date);
    var daysPrior = 1;
    var oneMonth = 30;
    var oneYear = 365;
    var daysLeft, perDay, a = 0;
    var currentDate = new Date(Date.now());
    var aMonth = new Date(Date.now());
    var aYear = new Date(Date.now());
    //  console.log('req date',currentDate);
    yestPost.setDate(yestPost.getDate() + daysPrior);
    //yestPost = yestPost.toISOString();
    aMonth.setDate(aMonth.getDate() - oneMonth);
    aYear.setDate(aYear.getDate() - oneYear);
    //aMonth = aMonth.toISOString();
    console.log('req date', currentDate, 'and', aMonth, aYear);
    console.log('datee is prev', yestPrev);
    console.log('datee is', yestPost);
    var action_type = req.body.queryResult['action'];
    console.log('action type', action_type);
    var temp = "Added";
    var temps = "Issued";
    let itemValuu = 0;
    let itemCost = 0;
    let countVar = 0;
    var unitVal, itemIdValuu, adder;
    const db = admin.firestore();
    // if(action_type === 'quantity' ){


    if (action_type === 'getWhenWillItemRunOut') {//conjuct === 'when' && 


        db.collection("items").where("itemName", "==", item).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    itemIdVal = doc.data().itemId;
                    unitVal = doc.data().unit;
                    itemVal = doc.data().itemQuantity;
                    console.log('111111111111111111st', itemIdVal);
                    db.collection("logs").where("itemId", "==", itemIdVal).where('logType', '==', temps).where('date', '>=', aMonth).where('date', '<=', currentDate).orderBy('date').get()
                        .then((querySnapshot) => {

                            querySnapshot.forEach((doc1) => {

                                console.log('111111111111111111ssst', doc1.data());

                                // doc.data() is never undefined for query doc snapshots
                                itemValuu = itemValuu + doc1.data().quantity;
                                console.log('total is :', itemValuu);
                                adder = doc1.data().addedBy;
                                console.log('docccc', doc1);
                                console.log('value is', itemIdVal, itemVal, itemValuu, adder);
                                //unitVal = doc.data().cost;
                                console.log('meowwww', doc1.data().date, aMonth);
                                countVar = countVar + 1;
                                console.log('count var :', countVar);
                            });

                            perDay = Math.ceil(itemValuu / countVar);

                            console.log('perday', perDay);

                            daysLeft = Math.ceil(itemVal / perDay);
                            console.log('daysleft', daysLeft);

                            if (req.method === 'POST') {
                                const body = req.body;
                                console.log('body ', body);
                                var reply = " You will run out of " + item + " in " + daysLeft + " days ";
                                res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
                                res.send(JSON.stringify({
                                    "speech": reply, "displayText": reply
                                    //"speech" is the spoken version of the response, "displayText" is the visual version
                                }));
                            } else {
                                res.status(500).send('Not a valid request!');

                            }
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });


    } else if (action_type === 'getWhenWasItemLastBought') {//conjuct === 'when' && 

        db.collection("items").where("itemName", "==", item).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    itemIdVal = doc.data().itemId;
                    unitVal = doc.data().unit;
                    console.log('111111111111111111st', itemIdVal);
                    db.collection("logs").where("itemId", "==", itemIdVal).where('logType', '==', temp).orderBy('date', 'desc').get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc1) => {
                                console.log('111111111111111111st', itemIdVal);
                                // doc.data() is never undefined for query doc snapshots
                                lastDay = new Date(doc1.data().date);
                                itemValuu = doc1.data().quantity;
                                adder = doc1.data().addedBy;
                                console.log('docccc', doc1);
                                console.log('value is', itemIdVal, itemValuu, adder);
                                //unitVal = doc.data().cost;
                                if (req.method === 'POST') {
                                    const body = req.body;
                                    console.log('body ', body);
                                    var reply = item + " was last bought on " + lastDay;
                                    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
                                    res.send(JSON.stringify({
                                        "speech": reply, "displayText": reply
                                        //"speech" is the spoken version of the response, "displayText" is the visual version
                                    }));
                                } else {
                                    res.status(500).send('Not a valid request!');

                                }


                            });
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });



    }
    else if (action_type === '') {
        if (exprtime === 'lastmonth') {
            db.collection("items").where("itemName", "==", item).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        itemIdVal = doc.data().itemId;
                        unitVal = doc.data().unit;
                        itemVal = doc.data().itemQuantity;
                        console.log('111111111111111111st', itemIdVal);
                        db.collection("logs").where("itemId", "==", itemIdVal).where('logType', '==', temp).where('date', '>=', aMonth).where('date', '<=', currentDate).orderBy('date').get()
                            .then((querySnapshot) => {

                                querySnapshot.forEach((doc1) => {

                                    console.log('111111111111111111ssst', doc1.data());

                                    // doc.data() is never undefined for query doc snapshots
                                    itemCost = itemCost + doc1.data().cost;
                                    console.log('total is :', itemValuu)
                                    adder = doc1.data().addedBy;
                                    console.log('docccc', doc1);
                                    console.log('value is', itemIdVal, itemVal, itemCost, adder);
                                    //unitVal = doc.data().cost;
                                    console.log('meowwww', doc1.data().date, aYear);

                                });

                                if (req.method === 'POST') {
                                    const body = req.body;
                                    console.log('body ', body);
                                    var reply = " Last month,you spent Rs." + itemCost + " on " + item;
                                    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
                                    res.send(JSON.stringify({
                                        "speech": reply, "displayText": reply
                                        //"speech" is the spoken version of the response, "displayText" is the visual version
                                    }));
                                } else {
                                    res.status(500).send('Not a valid request!');

                                }
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                            });
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });

        }
        else if (exprtime === 'lastyear') {

            db.collection("items").where("itemName", "==", item).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        itemIdVal = doc.data().itemId;
                        unitVal = doc.data().unit;
                        itemVal = doc.data().itemQuantity;
                        console.log('111111111111111111st', itemIdVal);
                        db.collection("logs").where("itemId", "==", itemIdVal).where('logType', '==', temp).where('date', '>=', aYear).where('date', '<=', currentDate).orderBy('date').get()
                            .then((querySnapshot) => {

                                querySnapshot.forEach((doc1) => {

                                    console.log('111111111111111111ssst', doc1.data());

                                    // doc.data() is never undefined for query doc snapshots
                                    itemCost = itemCost + doc1.data().cost;
                                    console.log('total is :', itemValuu)
                                    adder = doc1.data().addedBy;
                                    console.log('docccc', doc1);
                                    console.log('value is', itemIdVal, itemVal, itemCost, adder);
                                    //unitVal = doc.data().cost;
                                    console.log('meowwww', doc1.data().date, aYear);

                                });

                                if (req.method === 'POST') {
                                    const body = req.body;
                                    console.log('body ', body);
                                    var reply = "Last year,you spent Rs." + itemCost + " on " + item;
                                    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
                                    res.send(JSON.stringify({
                                        "speech": reply, "displayText": reply
                                        //"speech" is the spoken version of the response, "displayText" is the visual version
                                    }));
                                } else {
                                    res.status(500).send('Not a valid request!');

                                }
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                            });
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });


        }



    }
    else if (action_type === 'ave') {
        if (exprtime === 'lastmonth') {
            db.collection("items").where("itemName", "==", item).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        itemIdVal = doc.data().itemId;
                        unitVal = doc.data().unit;
                        itemVal = doc.data().itemQuantity;
                        console.log('111111111111111111st', itemIdVal);
                        db.collection("logs").where("itemId", "==", itemIdVal).where('logType', '==', temp).where('date', '>=', aMonth).where('date', '<=', currentDate).orderBy('date').get()
                            .then((querySnapshot) => {

                                querySnapshot.forEach((doc1) => {

                                    console.log('111111111111111111ssst', doc1.data());

                                    // doc.data() is never undefined for query doc snapshots
                                    itemCost = itemCost + doc1.data().cost;
                                    console.log('total is :', itemCost);
                                    adder = doc1.data().addedBy;
                                    console.log('docccc', doc1);
                                    console.log('value is', itemIdVal, itemVal, itemValuu, adder);
                                    //unitVal = doc.data().cost;
                                    console.log('meowwww', doc1.data().date, aMonth);
                                    countVar = countVar + 1;
                                    console.log('count var :', countVar);
                                });
                                avgMonth = Math.ceil(itemCost / countVar);

                                if (req.method === 'POST') {
                                    const body = req.body;
                                    console.log('body ', body);
                                    var reply = " Average spent on " + item + "s in the past month is :  Rs." + avgMonth;
                                    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
                                    res.send(JSON.stringify({
                                        "speech": reply, "displayText": reply
                                        //"speech" is the spoken version of the response, "displayText" is the visual version
                                    }));
                                } else {
                                    res.status(500).send('Not a valid request!');

                                }
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                            });
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });

        }
        else if (exprtime === 'lastyear') {
            db.collection("items").where("itemName", "==", item).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        itemIdVal = doc.data().itemId;
                        unitVal = doc.data().unit;
                        itemVal = doc.data().itemQuantity;
                        console.log('111111111111111111st', itemIdVal);
                        db.collection("logs").where("itemId", "==", itemIdVal).where('logType', '==', temp).where('date', '>=', aYear).where('date', '<=', currentDate).orderBy('date').get()
                            .then((querySnapshot) => {

                                querySnapshot.forEach((doc1) => {

                                    console.log('111111111111111111ssst', doc1.data());

                                    // doc.data() is never undefined for query doc snapshots
                                    itemCost = itemCost + doc1.data().cost;
                                    console.log('total is :', itemCost);
                                    adder = doc1.data().addedBy;
                                    console.log('docccc', doc1);
                                    console.log('value is', itemIdVal, itemVal, itemValuu, adder);
                                    //unitVal = doc.data().cost;
                                    console.log('meowwww', doc1.data().date, aMonth);
                                    console.log('count var :', countVar);
                                    countVar = countVar + 1;
                                    console.log('count var :', countVar);
                                });

                                avgYear = Math.ceil(itemCost / countVar);
                                // a = itemValuu % oneMonth;
                                // console.log('perday', perDay, perDay - a);

                                // daysLeft = Math.ceil(itemVal / perDay);
                                // console.log('daysleft', daysLeft);

                                if (req.method === 'POST') {
                                    const body = req.body;
                                    console.log('body ', body);
                                    var reply = " Average spent on" + item + "s in the past year is :  Rs." + avgYear;
                                    res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
                                    res.send(JSON.stringify({
                                        "speech": reply, "displayText": reply
                                        //"speech" is the spoken version of the response, "displayText" is the visual version
                                    }));
                                } else {
                                    res.status(500).send('Not a valid request!');

                                }
                            })
                            .catch((error) => {
                                console.log("Error getting documents: ", error);
                            });
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });



        }
    }
    else if (action_type == 'getItemQuantity') {

        db.collection("items").where("itemName", "==", item).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    itemVal = doc.data().itemQuantity;
                    unitVal = doc.data().unit;
                    const itemIdVal = doc.data().itemId;
                    console.log('itemIdVal is', itemIdVal);

                    if (req.method === 'POST') {
                        const body = req.body;
                        console.log('body ', body);
                        var reply = "Quantity of " + item + "s left :" + itemVal + unitVal;
                        res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
                        res.send(JSON.stringify({
                            "speech": reply, "displayText": reply
                            //"speech" is the spoken version of the response, "displayText" is the visual version
                        }));
                    } else {
                        res.status(500).send('Not a valid request!');

                    }

                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
    else if (action_type === 'getUserWhoBought') {

        //return this.firestore.collection<ItemLog>(`logs`, ref => ref.where('itemId', '==', itemId)
        //  .where('date', '>=', startDate).where('date', '<=', endDate).orderBy('date')).valueChanges();
        db.collection("items").where("itemName", "==", item).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    itmIdVal = doc.data().itemId;
                    unitVal = doc.data().unit;
                    console.log('111111111111111111st', itmIdVal);
                    db.collection("logs").where("itemId", "==", itmIdVal).where('logType', '==', temp).where('date', '>=', yestPrev).where('date', '<=', yestPost).orderBy('date', 'desc')
                        .get()
                        .then((querySnapshot) => {
                            console.log('qsp', querySnapshot);
                            querySnapshot.forEach((doc1) => {
                                console.log('111111111111111111st2nd', itmIdVal);
                                // doc.data() is never undefined for query doc snapshots
                                itmValuu = doc1.data().quantity;
                                adder = doc1.data().addedBy;
                                console.log('docccc', doc1);
                                console.log('value is', itmIdVal, itmValuu, adder);
                                //unitVal = doc.data().cost;
                                admin.auth().getUser(adder)
                                    .then(function (userRecord) {
                                        console.log('adddddr', adder);
                                        dispName = userRecord.displayName;
                                        if (req.method === 'POST') {
                                            const body = req.body;
                                            console.log('body ', body);
                                            var reply = dispName + " bought " + itmValuu + " " + unitVal + " of " + item + " on " + date;
                                            res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
                                            res.send(JSON.stringify({
                                                "speech": reply, "displayText": reply
                                                //"speech" is the spoken version of the response, "displayText" is the visual version
                                            }));
                                        } else {
                                            res.status(500).send('Not a valid request!');

                                        }

                                    })
                                    .catch(function (error) {
                                        console.log("Error fetching user data:", error);
                                    });
                            });
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });

                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

    }
    console.log('yesss');

});



exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {



    let action = request.body.queryResult.action;
    const parameters = request.body.queryResult.parameters;

    const inputContexts = request.body.queryResult.contexts;

    console.log(action);
    console.log(parameters);

    let res = '';
    switch (action) {
        case 'getItemQuantity':
            res = getItemQuantity(parameters);
            break;
        case 'getAverageSpent':
            res = getAverageSpent(parameters);
            break;
        case 'getUserWhoBought':
            res = getUserWhoBought(parameters);
            break;
        case 'getItemBoughtQuantity':
            res = getItemBoughtQuantity(parameters);
            break;
        case 'getWhenWasItemLastBought':
            res = getWhenWasItemLastBought(parameters);
            break;
        case 'getWhenWillItemRunOut':
            res = getWhenWillItemRunOut(parameters);
            break;
        default:
            res = {
                "fulfillmentText": "This is a text response",
                "fulfillmentMessages": [
                    {
                        "card": {
                            "title": "card title",
                            "subtitle": "card text",
                            "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
                            "buttons": [
                                {
                                    "text": "button text",
                                    "postback": "https://assistant.google.com/"
                                }
                            ]
                        }
                    }
                ]
            };
            break;
    }

    response.send(res);
    return;
});

function getItemQuantity(parameters) {
    console.log('inside get item quantity with params ', parameters);
    const itemName = parameters['item_name'].trim();

    let res = {};
    res.fulfillmentText = 'This is reponse for ' + itemName;
    res.fulfillmentMessages = [
        {
            "card": {
                "title": itemName,
                "subtitle": "quantity of " + itemName + " is 12kgs",
                "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
                "buttons": [
                    {
                        "text": "Go to " + itemName,
                        "postback": "https://localhost:4200/someItemId"
                    }
                ]
            }
        }
    ]

    return res;

}