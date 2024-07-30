function conversion(amount, currency1, currency2) {
    let conversionList = {
        USD: {
            "cad": 1.38,
            "pound": 0.77,
            "franc": 0.86,
            "euros": 0.92
        },

        CAD: {
            "usd": 0.73,
            "pound": 0.56,
            "franc": 0.65,
            "euros": 0.67
        },



        POUND: {

            "cad": 1.79,
            "usd": 1.30,
            "franc": 1.12,
            "euros": 1.19
        },

        EURO: {
            "cad": 1.49,
            "usd": 1.09,
            "pound": 0.84,
            "franc": 0.94
        },

        FRANC: {
            "cad": 1.54,
            "usd": 1.16,
            "pound": 0.89,
            "euros": 1.06
        },
    }

    let conversionValue = (conversionList["cad".toUpperCase()])[currency2];
    return (amount * conversionValue).toFixed(2);
}
module.exports = { conversion }