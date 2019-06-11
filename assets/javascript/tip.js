//Create our DOM variables
var subtotal = document.getElementById("subtotal-txt");
var tax = document.getElementById("tax-txt");
var total = document.getElementById("total-txt");
var tipRate = document.getElementById("tip-rate-txt");
var tip = document.getElementById("tip-txt");
var split = document.getElementById("split-txt");
var grandTotal = document.getElementById("grand-total-txt");
var perPerson = document.getElementById("per-person-txt");

//Set default values
subtotal.value = parseFloat(0).toFixed(2);
tax.value = parseFloat(0).toFixed(2);
total.value = parseFloat(subtotal.value + tax.value).toFixed(2);
tipRate.value = .15;
split.value = parseFloat(1).toFixed(0);

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
    calculate_tip()

}
split.onblur = function () {

    if (this.value < 1 || this.value === null || this.value === "") {
        this.value = 1;
    }

    this.value = parseFloat(this.value).toFixed(0);

    calculate_tip()

}
function calculate_tip() {
    total.value = parseFloat(parseFloat(subtotal.value) + parseFloat(tax.value)).toFixed(2);
    tip.value = parseFloat(parseFloat(subtotal.value) * parseFloat(tipRate.value)).toFixed(2);
    grandTotal.value = parseFloat(parseFloat(total.value) + parseFloat(tip.value)).toFixed(2)
    perPerson.value = parseFloat(parseFloat(grandTotal.value) / parseFloat(split.value)).toFixed(2)
}