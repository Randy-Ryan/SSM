const functions = require("firebase-functions");

const bodyParser =require('body-parser');

const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

//const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS

const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

var firebase = require('firebase');
const cors = require('cors')({ origin: true });

var config = {
    apiKey:  process.env.FIREBASE_API_KEY,
    authDomain: "skateshoemate-3a12f.firebaseapp.com",
    databaseURL: "https://skateshoemate-3a12f-default-rtdb.firebaseio.com",
    projectId: "skateshoemate-3a12f",
    storageBucket: "skateshoemate-3a12f.appspot.com",
    messagingSenderId: "62694744898",
    appId: "1:62694744898:web:3dd732327ebd241a5a5edb",
    measurementId: "G-3CYN3Z5E83"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();


var shoes = database.ref()


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(express.json())
app.use(express.static('../public'))



// const path = require('path')

// exports.store = functions.https.onRequest((req, res) => {


// })


// });


app.get('/ratings', (req, res, next) => {

    var params2 = req.query;
    console.log(params2)
    shoes.on('value', (snapshot) => {
        const data = snapshot.val();
        res.render('ratings.ejs', {
            username: params2["username"],
            theirUsername: params2["theirUsername"]
        })
    });
    res.send = function sendWrapper(...args) {
        try {
            send.apply(this, args);
        } catch (err) {
            console.error(`Error in res.send | ${err.code} | ${err.message} | ${res.stack}`);
        }
    };
    next();
})

app.get('/messages', (req, res, next) => {
    var params2 = req.query;
    shoes.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(params2["username"])
        res.render('messages.ejs', {
            messages: snapshot.val().messages,
            username: params2["username"],
            theirUsername: params2["theirUsername"]
        })
        res.send = function sendWrapper(...args) {
            try {
                send.apply(this, args);
            } catch (err) {
                console.error(`Error in res.send | ${err.code} | ${err.message} | ${res.stack}`);
            }
        };
        next();
    });

})
app.get('/theirAccount', (req, res, next) => {
    var params2 = req.query;
    // shoes.on('value', (snapshot) => {
        // const data = snapshot.val();
        // console.log(data)
        // console.log(params2["username"])
        res.render('theirAccount.ejs', {
            // messages: snapshot.val().messages,
            // username: params2["username"],
            theirUsername: params2["theirUsername"]
        })
    // });
    res.send = function sendWrapper(...args) {
        try {
            send.apply(this, args);
        } catch (err) {
            console.error(`Error in res.send | ${err.code} | ${err.message} | ${res.stack}`);
        }
    };
    next();
})


app.get('/filters', (req, res, next) => {
    shoes.on('value', (snapshot) => {
        res.render('filters.ejs', {
            stripePublicKey: stripePublicKey,
            username: req.query.username,
            items: snapshot.val().shoes,
            stance: req.query.stance,
            size: req.query.size,
            quality: req.query.quality
        })
    });
    res.send = function sendWrapper(...args) {
        try {
            send.apply(this, args);
        } catch (err) {
            console.error(`Error in res.send | ${err.code} | ${err.message} | ${res.stack}`);
        }
    };
    next();
})

app.get('/store', (req, res, next) => {
    shoes.on('value', (snapshot) => {
        res.render('../views/store.ejs', {
            stripePublicKey: stripePublicKey,
            username: req.query.username,
            items: snapshot.val().shoes,
            stance: req.query.stance,
            size: req.query.size,
            quality: req.query.quality
        })
    });
    res.send = function sendWrapper(...args) {
        try {
            send.apply(this, args);
        } catch (err) {
            console.error(`Error in res.send | ${err.code} | ${err.message} | ${res.stack}`);
        }
    };
    next();
})

app.get('/checkout', (req, res, next) => {
    // console.log(req.query.items)
    // console.log(JSON.parse(req.query.items))
    shoes.on('value', (snapshot) => {
        res.render('checkout.ejs', {
            stripePublicKey: stripePublicKey,
            price: req.query.price,
            // items: req.query.items
        })
    });
    res.send = function sendWrapper(...args) {
        try {
            send.apply(this, args);
        } catch (err) {
            console.error(`Error in res.send | ${err.code} | ${err.message} | ${res.stack}`);
        }
    };
    next();
})

app.post('/purchase', function (req, res) {
    console.log(req.query.price)

    shoes.on('value', (snapshot) => {
        // const itemsArray = snapshot.val().shoes
        // let total = 0
        // req.body.items.forEach(function (item) {
        //     const itemJson = itemsArray[parseInt(item.id)];
        //     total = total + itemJson.price
        // })
        // console.log(req.body.price)
        // total = req.body.price
        stripe.charges.create({
            amount: req.body.price,
            source: req.body.stripeTokenId,
            currency: 'usd'
        }).then(function () {
            console.log("Charge successful")
            res.json({ message: 'Successfully purchased items' })
        }).catch(function (error) {
            console.log('Charge Fail' + error)
            res.status(500).end()
        })
    })
})

// exports.main = functions.https.onRequest(app)

const PORT = 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`);
