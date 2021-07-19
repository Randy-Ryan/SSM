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
            // document.getElementById("postRef").style.display = "";
            //document.getElementById("accountRef").style.display = "";
            document.getElementById("postPage").style.display = "";


            //load account page for now - should load home page

        } else {
            // User is signed out
            // document.getElementById("postRef").style.display = "none";
            //document.getElementById("accountRef").style.display = "none";
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
                    window.location.href = "/store"
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


// function to style page when user is signed out
function userIsSignedOut() {

    //show login page % hide the rest
    //shouldnt be the case so route to home
}


/////////////////////////////////////////////////////////////////////////////////////
/////////------------------- RANDOM NUMBER GENERATOR --------------------////////////
/////////////////////////////////////////////////////////////////////////////////////
// RETURN A RANDOM NUMBER BETWEEN MIN/MAX VARS
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    );
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