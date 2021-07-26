const firebaseConfig = {
    apiKey: "AIzaSyDBLsz1BVWiJTB5HofoERqvW03G0ihMY5s",
    authDomain: "skateshoemate-3a12f.firebaseapp.com",
    databaseURL: "https://skateshoemate-3a12f-default-rtdb.firebaseio.com",
    projectId: "skateshoemate-3a12f",
    storageBucket: "skateshoemate-3a12f.appspot.com",
    messagingSenderId: "62694744898",
    appId: "1:62694744898:web:3dd732327ebd241a5a5edb",
    measurementId: "G-3CYN3Z5E83"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var storage = firebase.storage().ref();
var database = firebase.database();
var userID = "";
var username = "";
var email = "";
const dbRef = firebase.database().ref();



// on page load check if user is signed in - style respectivly
window.onload = function () {

    // console.log(items.replaceAll('&#34;', ''))
    // console.log(JSON.parse(items.replaceAll('&#34;', '')))
    // console.log(items.length)
    // for (var i = 0; i<items.length;i++){
    //     addItemToCart(items[i].title, items[i].price, items[i].imageSrc, items[i].id)
    // }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userID = user.uid;
            document.getElementById("accountRef").style.display = "";

            dbRef.child("users").child(userID).get().then((snapshot) => {
                if (snapshot.exists()) {
                    email = snapshot.val().email;
                    username = snapshot.val().username;
                    // document.getElementById("username").innerText = username;

                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
            // set global vars to use for this user

            // username = user.displayName;
            // user.phoneNumber
            // user.photoURL
            // user.emailVerified
            // user.email
            // ...

            // hide login/register pages
            // will add more hides here
            //document.getElementById("postRef").style.display = "";
            document.getElementById("accountRef").style.display = "";


            //load account page for now - should load home page

        } else {
            // User is signed out
            //document.getElementById("postRef").style.display = "none";
            document.getElementById("accountRef").style.display = "none";
            // userIsSignedOut();
        }
    });
}


function displayMessages() {

    console.log("sup");


    //console.log(data.users['4mS0tNjZF9eMey1Ya6dfFJ3aMfN2'].userID);



    /*for i = 0 i < something i ++ {

        if message.userrecieved == username

            display message
    }*/
}
function messageUser() {

    var error = false;
    var error2 = false;
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    var dateTime = date + ' ' + strTime;
    var requiredMessageInput = document.getElementById("message");

    message = requiredMessageInput.value
    userSend = username;

    // console.log(theirUsername)

    theirUsername = document.getElementById("testTheirs").innerText.slice(3)
    var fill = "" + generateRandomNumber(1, 10000000);

    firebase.database().ref('messages/' + fill).set({
        userRecieve: theirUsername,
        date: dateTime,
        message: message,
        userSend: username,
        messageID: fill
    }).then(function () {
        // route to home page and set the url params respectivly
        alert('successfully added to database!');
        window.location.href = '/messages?username=' + username + '&theirUsername=' + theirUsername
    }).catch(function (error) {
        // An error happened.
        alert(error);
    });
}
function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}


function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    var id = shopItem.dataset.itemId
    console.log(title)

    addItemToCart(title, price, imageSrc, id)
    updateCartTotal()
}



function addItemToCart(title, price, imageSrc, id) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.dataset.itemId = id
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        total = total + (price * 1)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}


var stripeHandler =
    StripeCheckout.configure({
        key: stripePublicKey,
        image: "./Images/jawsx3.jpg",
        locale: 'auto',
        token: function (token) {
            // var items = []
            // var cartItemContainer = document.getElementsByClassName('cart-items')[0]
            // var cartRows = cartItemContainer.getElementsByClassName('cart-row')

            // for (var i = 0; i < cartRows.length; i++) {
            //     var cartRow = cartRows[i]
            //     var id = cartRow.dataset.itemId

            //     var price = cartRow.getElementsByClassName('cart-price').innerText
            //     console.log("PRICE: " + price)
            //     items.push({
            //         id: id,
            //         quantity: 1
            //     })
            // }

            fetch('/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    stripeTokenId: token.id,
                    price: price
                })
            }).then(function (res) {
                console.log(res)
                return res.json()
            }).then(function (data) {
                alert(data.message)
                // var cartItems = document.getElementsByClassName('cart-items')[0]
                // while (cartItems.hasChildNodes()) {
                //     cartItems.removeChild(cartItems.firstChild)
                // }
                // updateCartTotal()
                window.location.assign("/index.html")
            }).catch(function (error) {
                console.error(error)
            })

        }
    })

function checkoutClicked() {
    // alert("heyyyy")
    var priceElement = document.getElementById('checkout-price')
    var price = parseFloat(priceElement.innerText.replace('$', '')) * 100
    // alert(price)
    stripeHandler.open({
        amount: price
    })
}


//function to check if input field is blank
function isBlank(inputField) {
    //checks for empty checkbox
    if (inputField.type === "checkbox") {
        if (inputField.checked) {
            return false;
        }
        else {
            return true;
        }
    }
    //checks for empty input fields
    if (inputField.value === "") {
        return true;
    }
    else {
        return false;
    }
}
//function to make the input fields red
function makeRed(inputDiv) {
    //input field set to red
    inputDiv.style.backgroundColor = "#c80815";
}
//function to reset the input fields to normal
function makeClean(inputDiv) {
    //text set to black
    inputDiv.parentNode.style.color = "#000000";
    //text field set to white	
    inputDiv.style.backgroundColor = "#FFFFFF";
}

const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}