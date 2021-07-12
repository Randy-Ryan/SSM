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

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userID = user.uid;
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
            document.getElementById("loginPage").style.display = "none";
            document.getElementById("registerPage").style.display = "none";
            document.getElementById("postRef").style.display = "";
            document.getElementById("accountRef").style.display = "";

        } else {
            // User is signed out
            document.getElementById("postRef").style.display = "none";
            document.getElementById("accountRef").style.display = "none";
            userIsSignedOut();
        }
    });
}

// on shoe post click (post page)
function postShoe() {
    var error = false;
    var error2 = false;


    // initialize inputs variable from all inputs with class "required"
    var requiredInputs = document.querySelectorAll(".requiredShoeInput");
    for (var i = 0; i < requiredInputs.length; i++) {
        error = false;
        // console.log(requiredInputs.length);
        // if blank input, prevent form submission
        // make input fields red and set error to true
        if (isBlank(requiredInputs[i])) {
            // e.preventDefault();
            makeRed(requiredInputs[i]);
            error = true;
            error2 = true;
            console.log("error 1");
        }
        // make input field normal if no error
        // usage when first case is error, but second is not
        if (error == false) {
            makeClean(requiredInputs[i]);
        }
    }

    if (error2 == false) {
        // no input errors, should then log into account through firebase
        for (var i = 0; i < requiredInputs.length; i++) {
            console.log(requiredInputs[i].value);
            // stance, brand, quality, size, imageURL
            if (i == 0) {
                stance = requiredInputs[i].value;
            }
            if (i == 1) {
                brand = requiredInputs[i].value;
            }
            if (i == 2) {
                quality = requiredInputs[i].value;
            }
            if (i == 3) {
                size = requiredInputs[i].value;
            }
            if (i == 4) {
                // imageURL = requiredInputs[i].value;
            }
            if (i == 5) {
                price = requiredInputs[i].value;
            }

        }
        var fileInput = document.getElementById("img");
        var file = fileInput.files.item(0);
        imageURL = "" + generateRandomNumber(1, 10000000);
        storageRef = storage.child(imageURL);
        storageRef.put(file).then((snapshot) => {
            console.log("uploaded a file: " + requiredInputs[4]);
            storage.child(imageURL).getDownloadURL().then((url) => {
                console.log(url);
                var fill = "" + generateRandomNumber(1, 10000000);
                firebase.database().ref('shoes/' + fill).set({
                    stance: stance,
                    brand: brand,
                    quality: quality,
                    size: size,
                    imageURL: url,
                    userID: userID,
                    docID: fill,
                    price:price * 100,
                    username:username
                }).then(function () {
                    // route to home page and set the url params respectivly
                    alert('successfully added to database!');
                    loadAccountPage();
                    // window.location.href = "../PostPage/post.html?username=" + username + "&email=" + email + "&userID=" + userId;
                }).catch(function (error) {
                    // An error happened.
                    alert(error);
                });
            }).catch((error) => {
                console.log('error in img download: ' + error.message);
            });
        });
       
    }

}
// on login button click (login page)
function signIn() {
    // error2 var needed for when first submission is invalid
    // but second submission is correct
    var error = false;
    var error2 = false;
    // initialize inputs variable from all inputs with class "required"
    var requiredInputs = document.querySelectorAll(".requiredLogin");
    for (var i = 0; i < requiredInputs.length; i++) {
        error = false;
        // console.log(requiredInputs.length);
        // if blank input, prevent form submission
        // make input fields red and set error to true
        if (isBlank(requiredInputs[i])) {
            makeRed(requiredInputs[i]);
            error = true;
            error2 = true;
        }
        // make input field normal if no error
        // usage when first case is error, but second is not
        if (error == false) {
            makeClean(requiredInputs[i]);
        }
    }
    if (error2 == false) {
        // no input errors, should then log into account through firebase
        email = requiredInputs[0].value;
        var password = requiredInputs[1].value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(user => {

            var fuser = firebase.auth().currentUser;
            console.log(fuser);
            userID = fuser.uid;
            username = fuser.displayName;
            window.location.href = "/store"
            //route to account page when successful and set the url params
            // window.location.href = "../AccountPage/post.html?username=" + fuser.displayName + "&email=" + email + "&userID=" + fuser.uid;;
        }).catch(err => {
            alert(err.message);
        });
    }

}
// on create account button click (register page)
function createAccount() {
    var error = false;
    var error2 = false;
    // initialize inputs variable from all inputs with class "required"
    var requiredInputs = document.querySelectorAll(".requiredRegister");
    for (var i = 0; i < requiredInputs.length; i++) {
        error = false;
        // console.log(requiredInputs.length);
        // if blank input, prevent form submission
        // make input fields red and set error to true
        if (isBlank(requiredInputs[i])) {
            makeRed(requiredInputs[i]);
            error = true;
            error2 = true;
        }
        // make input field normal if no error
        // usage when first case is error, but second is not
        if (error == false) {
            makeClean(requiredInputs[i]);
        }
    }
    if (error2 == false) {
        // no input errors, should then create an account through firebase
        console.log("Username: " + requiredInputs[0].value + "  email: " + requiredInputs[1].value + "   password: " + requiredInputs[2].value);

        // set variables from front end user input values
        username = requiredInputs[0].value;
        email = requiredInputs[1].value;
        var password = requiredInputs[2].value;

        // create firebase account with email/password
        // this logic may be a little buggy and route to account page before creating the document in the firestore database
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                // set current user id 
                var fuser = firebase.auth().currentUser;

                userID = fuser.uid;
                // create a new document in firestore database with the following fields
                firebase.database().ref('users/' + userID).set({
                    username: username,
                    email: email,
                    userID: userID
                }).then(function () {
                    // route to home page and set the url params respectivly
                    alert('Account successfully created!');
                    window.location.href = "/store"
                    // window.location.href = "../PostPage/post.html?username=" + username + "&email=" + email + "&userID=" + userId;
                }).catch(function (error) {
                    // An error happened.
                    alert(error);
                });

            });
    }


}
// on sign out button click
function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        userIsSignedOut();
    }).catch((error) => {
        alert("Error signing out:" + error);
    });
}


// function to load login page
function loadLoginPage() {
    //show login page & hide register page
    document.getElementById("loginPage").style.display = "";
    document.getElementById("registerPage").style.display = "none";
}
// function to load post page
function loadShoeListingPage() {
    //show shoe listing page & hide the rest
    document.getElementById("shoeListingPage").style.display = "";

    document.getElementById("accountPage").style.display = "none";
    document.getElementById("postPage").style.display = "none";
    document.getElementById("purchasePage").style.display = "none";


}
// function to load shoe listing page
function loadPostPage() {
    //show post page & hide the rest
    document.getElementById("postPage").style.display = "";

    document.getElementById("accountPage").style.display = "none";
    document.getElementById("shoeListingPage").style.display = "none";
    document.getElementById("purchasePage").style.display = "none";

}
// function to load register page
function loadRegisterPage() {
    //show register page & hide login page
    document.getElementById("registerPage").style.display = "";

    document.getElementById("loginPage").style.display = "none";

}
// function to load purchase page
function loadPurchasePage() {
    //show purchase page & hide the rest
    document.getElementById("purchasePage").style.display = "";

    document.getElementById("accountPage").style.display = "none";
    document.getElementById("postPage").style.display = "none";
    document.getElementById("shoeListingPage").style.display = "none";

}

async function loadPurchasePage(docID) {
    //show purchase page & hide the rest

    const dbRef = firebase.database().ref();

    document.getElementById("purchasePage").style.display = "";

    var img = document.getElementById("picture");

    dbRef.child("shoes").child(docID + "").get().then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById("stance").innerHTML = snapshot.val().stance;
            
            document.getElementById("style").innerHTML = snapshot.val().brand;

            document.getElementById("size").innerHTML = snapshot.val().size;

            document.getElementById("condition").innerHTML = snapshot.val().quality;

            storage.child(snapshot.val().imageURL).getDownloadURL().then((url) => {

                img.setAttribute('src', url);
            }).catch((error) => {
                console.log('error in img download: ' + error.message);
            });
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

    document.getElementById("accountPage").style.display = "none";
    document.getElementById("postPage").style.display = "none";
    document.getElementById("shoeListingPage").style.display = "none";

}
// function to load account page
function loadAccountPage() {

    // show account page & hide the rest
    document.getElementById("accountPage").style.display = "";

    // set the html account elements respectivly 
    document.getElementById("usernameDisplay").innerText = "Username: " + username;
    document.getElementById("emailDisplay").innerText = "Email: " + email;
    document.getElementById("idDisplay").innerText = "ID: " + userID;

}

// function to style page when user is signed out
function userIsSignedOut() {

    //show login page % hide the rest
    document.getElementById("loginPage").style.display = "";

    document.getElementById("registerPage").style.display = "none";

}

// function to add a new element to the shoe listing feed
async function createNewShoeListing(shoe) {

    //TODO//
    // needs a hover attribute

    var newShoe = document.createElement('div');
    // create the new exercise div and set HTML content w/ respective vars
    //    var addMessageButton = document.createElement('div');

    //    console.log(st,b,q,si,im);
    //    // create the new food div and set HTML content w/ respective vars
    //    addMessageButton.innerHTML = 
    //    newShoe.appendChild(addMessageButton);
    //format a string to set element html
    var fullString = "";
    if (shoe.imageURL != "") {
        fullString += "<div id='shoeListing_child' class='parent background background-filter shadow'><img class='child' id='" + shoe.imageURL + "'></img>"
    }
    fullString += "<div class='child'>"
    if (shoe.stance != "") {
        fullString += "<p id= 'listingStance'>Stance: " + shoe.stance + "</p>";
    }
    if (shoe.brand != "") {
        fullString += "<p id= 'listingBrand'>Brand: " + shoe.brand + "</p>";
    }
    if (shoe.quality != "") {
        fullString += "<p id= 'listingQuality'>Quality: " + shoe.quality + "</p>";
    }
    if (shoe.size != "") {
        fullString += "<p id= 'listingSize'>Size: " + shoe.size + "</p>";
    }
    if (shoe.userID != "") {
        var oUsername = await getUserName(shoe.userID);
        console.log(oUsername);
        fullString = fullString + "<p class= 'listing'>Posted by: " + oUsername + "</p>";
    }
    console.log(shoe.docID);
    //fullString += "<button onclick = '" + 'startNewMessageWithUser("' + otherUserId + '")' + "' class = '' >MESSAGE</button>";
    fullString += "<button onclick = 'loadPurchasePage(" + shoe.docID + ")' class = 'viewButton' >VIEW</button>";

    fullString += "</div></div>";
    //TODO//
    // add a check for empty params and setting the following HTML
    //download image from 

    newShoe.innerHTML += fullString;
    newShoe.id = "shoeListingID";
    // newShoe.className = "";

    // load new food div into the food feed
    document.getElementById("shoeListingFeed").appendChild(newShoe);

    storage.child(shoe.imageURL).getDownloadURL().then((url) => {
        console.log(url);
        var img = document.getElementById(shoe.imageURL);
        img.setAttribute('src', url);
    }).catch((error) => {
        console.log('error in img download: ' + error.message);
    });

}

async function getUserName(userID) {

    var userRef = dbRef.child("users").child(userID);
    return userRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            console.log("document data: ", snapshot.val().username);
            return snapshot.val().username;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}

/////////////////////////////////////////////////////////////////////////////////////
/////////------------------- RANDOM NUMBER GENERATOR --------------------////////////
/////////////////////////////////////////////////////////////////////////////////////
// RETURN A RANDOM NUMBER BETWEEN MIN/MAX VARS
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};



// function to check DB for all shoes in the collection & call to createNewShoeListing() each time
function loadShoeListing() {

    dbRef.child("shoes").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log()
            const shoe = {
                stance: doc.val().stance,
                brand: doc.val().brand,
                quality: doc.val().quality,
                size: doc.val().size,
                imageURL: doc.val().imageURL,
                userID: doc.val().userID,
                docID: "" + doc.val().docID,
            }
            createNewShoeListing(shoe);
        })
    }).catch((error) => {
        console.error(error);
    });

}

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
}
/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
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


// TODO
function startNewMessageWithUser(otherUserId) {
    // load the exercise feed
    console.log(otherUserId);
    console.log(userID);
    //load the message page between this user & other user id
    //    loadMessagePage(userID, otherUserId);
    // start a new message with this user id
}
// function loadMessagePage(thisID, otherID){


// function createNewMessage(message, otherID){
//     console.log(hey);
// }


// TODO
function checkoutButton() {
    // load checkout feed
    console.log("test");
    
}