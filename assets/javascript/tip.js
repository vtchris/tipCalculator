document.cookie = 'cross-site-cookie=bar; SameSite=Strict';

//Create our DOM variables
var subtotal = document.getElementById("subtotal-txt");
var tax = document.getElementById("tax-txt");
var total = document.getElementById("total-txt");
var rounding = document.getElementsByName("rounding");
var tipRate = document.getElementById("tip-rate-txt");
var tip = document.getElementById("tip-txt");
var effectiveRate = document.getElementById("effectiveRate-h");
var split = document.getElementById("split-txt");
var grandTotal = document.getElementById("grand-total-txt");
var perPerson = document.getElementById("per-person-txt");
var displayTotal = document.getElementById("total-h");
var displayTip = document.getElementById("tip-h");
var displayGrandTotal = document.getElementById("grandtotal-h");
var displayPerPerson = document.getElementById("perperson-h");
var displayPerPersonSection = document.getElementById("perperson-display");
var displayJoke = document.getElementById("joke-h");
var jokeDiv = document.getElementById("joke-div");

//Create Global variables
var round = "";

//Temporary counter for testing purposes
var message = document.getElementById("message");
var count = 0;

//Set default values
subtotal.value = parseFloat(0).toFixed(2);
tax.value = parseFloat(0).toFixed(2);
total.value = parseFloat(subtotal.value + tax.value).toFixed(2);
tipRate.value = .15;
split.value = parseFloat(1).toFixed(0);
preferredRound = "";

//Check local storage for preferred tip rate
if (localStorage.getItem("tipRate")) {

    tipRate.value = localStorage.getItem("tipRate");
}
//Check local storage for preferred rounding option
if (localStorage.getItem("rounding")) {

    preferredRound = localStorage.getItem("rounding")

    for (var i = 0; i < rounding.length; i++) {
        if (rounding[i].value === preferredRound) {
            round = rounding[i].value
            rounding[i].checked = true;
        } else {
            rounding[i].checked = false;
        }
    }
} else {
    rounding[0].checked = true;
}
//Add event listener(s)
for (var i = 0; i < rounding.length; i++) {
    rounding[i].addEventListener("click", function () {

        round = this.value;

        if (preferredRound !== round) {
            localStorage.setItem("rounding", round)
        }

        calculate_tip();
    })
}
subtotal.onblur = function () {

    if (this.value < 0 || this.value === null || this.value === "") {
        this.value = 0;
    }

    this.value = parseFloat(this.value).toFixed(2)
    calculate_tip();

}
tax.onblur = function () {

    if (this.value < 0 || this.value === null || this.value === "") {
        this.value = 0;
    }

    this.value = parseFloat(this.value).toFixed(2);
    calculate_tip()

}
tipRate.onblur = function () {

    if (this.value < 0 || this.value === null || this.value === "") {
        this.value = 0;
    } else if (this.value > 1) {
        this.value = parseFloat(this.value / 100);
    }

    this.value = parseFloat(this.value).toFixed(2);

    localStorage.setItem("tipRate", this.value);
    calculate_tip()

}
split.onblur = function () {

    if (this.value < 1 || this.value === null || this.value === "") {
        this.value = 1;
    }

    this.value = parseInt(this.value).toFixed(0);

    calculate_tip()

}
function calculate_tip() {

    console.log(`Tip Rate: ${tipRate.value}
                Round: ${round}`)
    //Do not continue if there is no amounts to total
    if (parseFloat(subtotal.value) + parseFloat(tax.value) === 0) {
        return
    }

    //temp counter for testing
    // count++
    // message.innerText = count

    total.value = parseFloat(parseFloat(subtotal.value) + parseFloat(tax.value)).toFixed(2);

    let myTip = parseFloat(subtotal.value) * parseFloat(tipRate.value);
    let myGrandTotal = parseFloat(total.value) + parseFloat(myTip);

    switch (round) {
        case "1":

            break;
        case "2":
            //Round tip up to nearest dollar
            if (!Number.isInteger(myTip)) {
                myTip = parseFloat(Math.ceil(myTip));
                myGrandTotal = parseFloat(total.value) + parseFloat(myTip)
            }
            break;
        case "3":
            //Round grand total up to nearest dollar
            if (!Number.isInteger(myGrandTotal)) {
                myGrandTotal = parseFloat(Math.ceil(myGrandTotal));
                myTip = parseFloat(myGrandTotal) - parseFloat(total.value)
            }
    }

    let myPerPerson = parseFloat(parseFloat(myGrandTotal) / parseFloat(split.value)).toFixed(2);

    if (split.value > 1) {
        //If grand total cannot be evenly divided by the split, add .01 to each persons 
        //total and apply the difference to the tip.
        if ((parseFloat(myPerPerson) * parseInt(split.value)) !== parseFloat(myGrandTotal)) {
            myPerPerson = parseFloat(myPerPerson) + .01
            myPerPerson = Math.ceil(myPerPerson * 100)
            myPerPerson = parseFloat(myPerPerson / 100).toFixed(2);
            myGrandTotal = myPerPerson * split.value;
            myTip = myGrandTotal - total.value;

        }
    }

    myTip = parseFloat(myTip).toFixed(2);
    myGrandTotal = parseFloat(myGrandTotal).toFixed(2);

    tip.value = myTip;
    grandTotal.value = myGrandTotal;
    perPerson.value = myPerPerson

    displayTotal.innerText = total.value;
    displayTip.innerText = myTip;
    displayGrandTotal.innerText = myGrandTotal;
    displayPerPerson.innerText = myPerPerson;

    //Only display the per person amount when appropriate   
    if (split.value > "1") {
        displayPerPersonSection.classList.remove("display_none");

    } else {
        displayPerPersonSection.classList.add("display_none");
    }

    //Determine effective tip rate resulting from above rounding
    var myEffectiveRate = parseFloat(myTip / subtotal.value).toFixed(2) * 100

    if (!isNaN(myEffectiveRate)) {
        effectiveRate.innerText = "Effective Tip Rate: " + parseFloat(myEffectiveRate).toFixed(2) + "%"
    }


    //For testing, in case the totals don't foot correctly
    // if ((parseFloat(total.value) + parseFloat(myTip)).toFixed(2) != parseFloat(myGrandTotal) || (parseFloat(parseFloat(myPerPerson) * parseFloat(split.value)).toFixed(2) != parseFloat(myGrandTotal))){

    //     alert("Houston, we have a problem")

    // }

}
//API call for a joke
let joke = {}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://joke3.p.rapidapi.com/v1/joke');
xhr.setRequestHeader("X-RapidAPI-Key", "f204a6af09msh4b9848f8978842ap1a687djsnafe71a174e45");
xhr.send(null);
xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    if (xhr.readyState === DONE) {
        if (xhr.status === OK) {
            //console.log(xhr.responseText);         
            joke = JSON.parse(xhr.response)
            //alert(joke.content)
            displayJoke.innerText = joke.content;
            console.log(joke)

            jokeDiv.classList.remove("display_none");
            jokeDiv.classList.add("animate-fadeIn");

        } else {
            console.log('Error: ' + xhr.status); // An error occurred during the request.
        }
    }
};
