
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
//var stance = "'document.getElementById("stanceFilters").value;'"
const dbRef = firebase.database().ref();

// on page load check if user is signed in - style respectivly
window.onload = function () {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userID = user.uid;
            document.getElementById("accountRef").style.display = "";

            dbRef.child("users").child(userID).get().then((snapshot) => {
                if (snapshot.exists()) {
                    email = snapshot.val().email;
                    username = snapshot.val().username;
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
            // document.getElementById("postRef").style.display = "";
            //document.getElementById("accountRef").style.display = "";

            //load account page for now - should load home page

        } else {
            // User is signed out
            // document.getElementById("postRef").style.display = "none";
            //document.getElementById("accountRef").style.display = "none";
            userIsSignedOut();
        }
    });
}
// function to style page when user is signed out
function userIsSignedOut() {

    //show login page % hide the rest
    //shouldnt be the case so route to home
    // console.log("HEYYYY")
    // document.getElementById("accountRef").style.display = "none"
}




if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function ratingFunction(tUsername) {

    //let test = propmt("This is a test: ", "");

    window.location.assign("/ratings?theirUsername=" + tUsername)


}

async function test(theirUsername) {

    window.location.assign('/messages?username=' +username+'&theirUsername=' + theirUsername); 
}


// var stripeHandler =
//     StripeCheckout.configure({
//         key: stripePublicKey,
//         locale: 'auto',
//         token: function (token) {
//             // var items = []
//             // var cartItemContainer = document.getElementsByClassName('cart-items')[0]
//             // var cartRows = cartItemContainer.getElementsByClassName('cart-row')

//             // for (var i = 0; i < cartRows.length; i++) {
//             //     var cartRow = cartRows[i]
//             //     var id = cartRow.dataset.itemId

//             //     var price = cartRow.getElementsByClassName('cart-price').innerText
//             //     console.log("PRICE: " + price)
//             //     items.push({
//             //         id: id,
//             //         quantity: 1
//             //     })
//             // }

//             fetch('/purchase', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     stripeTokenId: token.id,
//                     items: items
//                 })
//             }).then(function (res) {
//                 console.log(res)
//                 return res.json()
//             }).then(function (data) {
//                 alert(data.message)
//                 var cartItems = document.getElementsByClassName('cart-items')[0]
//                 while (cartItems.hasChildNodes()) {
//                     cartItems.removeChild(cartItems.firstChild)
//                 }
//                 updateCartTotal()
//             }).catch(function (error) {
//                 console.error(error)
//             })

//         }
//     })

function base64_url_encode($input) {
    return strtr(base64_encode($input), '+/=', '._-');
}

function applyFilters(){

    stanceEle = document.getElementById("stanceFilters");
    sizeEle = document.getElementById("sizeFilters");
    qualityEle = document.getElementById("qualityFilters");

    stance = stanceEle.value;
    size = sizeEle.value;
    quality = qualityEle.value;

    window.location.assign("/filters?stance=" + stance + "&size=" + size +"&quality=" + quality);
    // document.getElementById("shopTest").style.display = "none";
   // window.location.assign("/store?size=" + size);
    //window.location.assign("/store?size=" + quality);

}


function purchaseClicked() {
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerText.replace('$', '')) * 100
    // stripeHandler.open({
    //     amount: price
    // })
    window.location.assign('/checkout?price=' + price)

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

var items = [];

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    var id = shopItem.dataset.itemId
    console.log(title)

    addItemToCart(title, price, imageSrc, id)

    items.push({
        "title": title,
        "price": price,
        "img": imageSrc,
        "id": id
    })
    console.log(items)
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


function testCheckout() {
    //load the shipping page



}