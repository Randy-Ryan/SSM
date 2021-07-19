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

exports.store = functions.https.onRequest((req, res) => {
    console.log("hey")
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
      } else {
        console.log("lol")

    }``

})


// });

app.get('/messages', (req, res) => {

    var params2 = req.query;
    shoes.on('value', (snapshot) => {
        const data = snapshot.val();
        console.log(params2["username"])
        res.render('messages.ejs', {
            messages: snapshot.val().messages,
            username: params2["username"]
        })
    });
 
})

// app.get('/messages', (req, res) => {
//         res.render('messages.ejs')
// })



app.get('/store', (req, res) => {
    shoes.on('value', (snapshot) => {
        res.render('store.ejs', {
            stripePublicKey: stripePublicKey,
            items: snapshot.val().shoes
        })
    });
})

app.post('/purchase', function (req, res) {


    shoes.on('value', (snapshot) => {
        const itemsArray = snapshot.val().shoes

        let total = 0

        req.body.items.forEach(function (item) {
            const itemJson = itemsArray[parseInt(item.id)];
            total = total + itemJson.price
        })


        stripe.charges.create({
            amount: total,
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


app.listen(3000)