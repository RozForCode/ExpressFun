function notValid(amount, currency1, currency2) {
    if (isNaN(amount) || amount <= 0) return true;
    else if (currency1 == currency2) return true;
    else return false;
}
module.exports = { notValid }