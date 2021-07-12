if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS

const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

var firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyDBLsz1BVWiJTB5HofoERqvW03G0ihMY5s",
    authDomain: "skateshoemate-3a12f.firebaseapp.com",
    databaseURL: "https://skateshoemate-3a12f-default-rtdb.firebaseio.com",
    projectId: "skateshoemate-3a12f",
    storageBucket: "skateshoemate-3a12f.appspot.com",
    messagingSenderId: "62694744898",
    appId: "1:62694744898:web:3dd732327ebd241a5a5edb",
    measurementId: "G-3CYN3Z5E83"
}
firebase.initializeApp(firebaseConfig)
var ref = firebase.app().database().ref();

//update this db every 30 seconds
//this should be changed so that when the shoe is posted - it will update directly
(function loop() {
    setTimeout(function () {
      // execute script
      ref.once('value')
.then(function (snap) {
    var obj = snap.val()
    fs.writeFile ("input.json", JSON.stringify(obj), function(err) {
        if (err) throw err;
        console.log('updated');
        }
    );
})
      loop()
    }, 30000); //9000 = 9000ms = 9s
  }())


app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/store', function (req, res) {
    ref.once('value')
    .then(function (snap) {
        res.render('store.ejs', {
            stripePublicKey: stripePublicKey,
            items: snap.val().shoes
        })
    })
})

app.post('/purchase', function (req, res) {

    fs.readFile('input.json', function(error, data) {
        if (error){
            res.status(500).end()
        }
        else{
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.shoes

            let total = 0

            req.body.items.forEach(function(item) {
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
        }
    })
})


app.listen(3000)