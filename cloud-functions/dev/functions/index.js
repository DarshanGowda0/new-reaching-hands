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
    var reqArray = req.body.result.parameters;
    const item = reqArray['itemName'];
    var date = reqArray['date'];
    var conjuct = reqArray['conjunction'];
    var exprtime = reqArray['expression-time'];
    var verb = reqArray['verb'];
    console.log('date is',date);
    var yestPrev = new Date(date);
    var yestPost = new Date(date);
    var daysPrior = 1;
    var oneMonth = 30;
    var daysLeft,perDay,a = 0;
    var currentDate = new Date(Date.now());
    var aMonth = new Date(Date.now());
  //  console.log('req date',currentDate);
    yestPost.setDate(yestPost.getDate() + daysPrior);
    //yestPost = yestPost.toISOString();
    aMonth.setDate(aMonth.getDate() - oneMonth);
    //aMonth = aMonth.toISOString();
    console.log('req date',currentDate,'and',aMonth);
    console.log('datee is prev',yestPrev);
    console.log('datee is',yestPost);
    var action_type = req.body.result['action'];
    console.log('action type',action_type);
    var temp = "Added";
    var temps = "Issued";
    let itemValuu = 0;
    var unitVal,itemIdValuu,adder;
    const db = admin.firestore();
   // if(action_type === 'quantity' ){
  
    if(date === ''){
        if(conjuct === 'when' && exprtime === ''){
            

            db.collection("items").where("itemName", "==", item).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  itemIdVal = doc.data().itemId;
                  unitVal = doc.data().unit;
                  itemVal = doc.data().itemQuantity;
                  console.log('111111111111111111st',itemIdVal);
              db.collection("logs").where("itemId", "==", itemIdVal).where('logType', '==', temps).where('date', '>=', aMonth).where('date', '<=', currentDate).orderBy('date').get()
              .then((querySnapshot) => {
                 
                  querySnapshot.forEach((doc1) => {
                      
                      console.log('111111111111111111ssst',doc1.data());
        
                      // doc.data() is never undefined for query doc snapshots
                  itemValuu = itemValuu + doc1.data().quantity;
                  console.log('total is :',itemValuu)
                  adder = doc1.data().addedBy;
                  console.log('docccc',doc1);
                  console.log('value is',itemIdVal,itemVal,itemValuu,adder);
                  //unitVal = doc.data().cost;
                  console.log('meowwww',doc1.data().date,aMonth);
                  
                  perDay = Math.ceil(itemValuu/oneMonth);
                  a = itemValuu%oneMonth;
                  console.log('perday',perDay,perDay-a);
                  
                  daysLeft = Math.ceil(itemVal/perDay);
                  console.log('daysleft',daysLeft);
                
            if (req.method === 'POST') {
                const body = req.body;
                console.log('body ', body);
                var reply =" You will run out of " + item + " in " + daysLeft  + " days ";
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
            .catch((error)=> {
                console.log("Error getting documents: ", error);
            });
            });
            })
            .catch((error)=> {
                console.log("Error getting documents: ", error);
            });
            
        
        
        

           
    
        }else if(conjuct === 'when' && exprtime !== ''){

            db.collection("items").where("itemName", "==", item).get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        itemIdVal = doc.data().itemId;
        unitVal = doc.data().unit;
        console.log('111111111111111111st',itemIdVal);
    db.collection("logs").where("itemId", "==", itemIdVal).where('logType', '==', temp).orderBy('date', 'desc').get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc1) => {
            console.log('111111111111111111st',itemIdVal);
            // doc.data() is never undefined for query doc snapshots
        lastDay= new Date(doc1.data().date);
        itemValuu = doc1.data().quantity;
        adder = doc1.data().addedBy;
        console.log('docccc',doc1);
        console.log('value is',itemIdVal,itemValuu,adder);
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
.catch((error)=> {
    console.log("Error getting documents: ", error);
});

});
})
.catch((error)=> {
    console.log("Error getting documents: ", error);
});
  

            
        }
        else if(conjuct === 'how' && verb === 'spend'){
            if(exprtime === 'lastmonth'){


            }
            else if(exprtime === 'lastyear'){


            }



        }
        else{
    
          db.collection("items").where("itemName", "==", item).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
        itemVal = doc.data().itemQuantity;
        unitVal = doc.data().unit;
        const itemIdVal = doc.data().itemId;    
            console.log('itemIdVal is',itemIdVal);
        
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
    .catch((error)=> {
        console.log("Error getting documents: ", error);
    });
    }
}
else if(date != ''){
    
    //return this.firestore.collection<ItemLog>(`logs`, ref => ref.where('itemId', '==', itemId)
  //  .where('date', '>=', startDate).where('date', '<=', endDate).orderBy('date')).valueChanges();
  db.collection("items").where("itemName", "==", item).get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        itmIdVal = doc.data().itemId;
        unitVal = doc.data().unit;
        console.log('111111111111111111st',itmIdVal);
    db.collection("logs").where("itemId", "==", itmIdVal).where('logType', '==', temp).where('date', '>=', yestPrev).where('date', '<=', yestPrev).orderBy('date','desc').get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc1) => {
            console.log('111111111111111111st2nd',itmIdVal);
            // doc.data() is never undefined for query doc snapshots
        itemValuu = doc1.data().quantity;
        adder = doc1.data().addedBy;
        console.log('docccc',doc1);
        console.log('value is',itmIdVal,itemValuu,adder);
        //unitVal = doc.data().cost;
        admin.auth().getUser(adder)
  .then(function(userRecord) {
            console.log('adddddr',adder);
            dispName = userRecord.displayName;
    if (req.method === 'POST') {
        const body = req.body;
        console.log('body ', body);
        var reply = dispName + " bought " + itemValuu + " "+ unitVal + " of " + item + " on " + date;
        res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
        res.send(JSON.stringify({
            "speech": reply, "displayText": reply
            //"speech" is the spoken version of the response, "displayText" is the visual version
        }));
    } else {
        res.status(500).send('Not a valid request!');
    
}

        })
  .catch(function(error) {
    console.log("Error fetching user data:", error);
  });
});
})
.catch((error)=> {
    console.log("Error getting documents: ", error);
});

});
})
.catch((error)=> {
    console.log("Error getting documents: ", error);
});
    
}
    console.log('yesss');




});
        