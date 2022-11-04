const str = "34397317664422574275|4.8||RCT1666967869069|47170|0|0";


const formartMessage = (_str) => {
    const splitted = _str.split("|");
    const token = splitted[0];
    const units = splitted[1];
    const rate = splitted[2];
    const merchantReceipt = splitted[3];
    const netAmount = splitted[4];
    const taxAmount = splitted[5];
    const taxRate = splitted[6]

    return {
        token, units, rate, merchantReceipt, netAmount, taxAmount, taxRate
    }
}


// console.log(formartMessage(str));



const telone = [
    {
        "productName": "Home Basic ",
        "productShortName": "500034",
        "productCode": "500034",
        "minimumAmount": 241300,
        "maximumAmount": 241300,
        "price": 241300,
        "serviceId": null
    },
    {
        "productName": "Home Basic Night ",
        "productShortName": "500035",
        "productCode": "500035",
        "minimumAmount": 330100,
        "maximumAmount": 330100,
        "price": 330100,
        "serviceId": null
    },
    {
        "productName": "Home Extra ",
        "productShortName": "500036",
        "productCode": "500036",
        "minimumAmount": 265500,
        "maximumAmount": 265500,
        "price": 265500,
        "serviceId": null
    },
    {
        "productName": "Home Plus 30G",
        "productShortName": "500037",
        "productCode": "500037",
        "minimumAmount": 531300,
        "maximumAmount": 531300,
        "price": 531300,
        "serviceId": null
    },
    {
        "productName": "Home Plus Night ",
        "productShortName": "500038",
        "productCode": "500038",
        "minimumAmount": 676200,
        "maximumAmount": 676200,
        "price": 676200,
        "serviceId": null
    },
    {
        "productName": "Home Premier Night ",
        "productShortName": "500039",
        "productCode": "500039",
        "minimumAmount": 1175300,
        "maximumAmount": 1175300,
        "price": 1175300,
        "serviceId": null
    },
    {
        "productName": "Home Surfer ",
        "productShortName": "500040",
        "productCode": "500040",
        "minimumAmount": 1690500,
        "maximumAmount": 1690500,
        "price": 1690500,
        "serviceId": null
    },
    {
        "productName": "Home Boost ",
        "productShortName": "500041",
        "productCode": "500041",
        "minimumAmount": 2656500,
        "maximumAmount": 2656500,
        "price": 2656500,
        "serviceId": null
    },
    {
        "productName": "Infinity Pro ",
        "productShortName": "500042",
        "productCode": "500042",
        "minimumAmount": 3542000,
        "maximumAmount": 3542000,
        "price": 3542000,
        "serviceId": null
    },
    {
        "productName": "Intense ",
        "productShortName": "500043",
        "productCode": "500043",
        "minimumAmount": 3783500,
        "maximumAmount": 3783500,
        "price": 3783500,
        "serviceId": null
    },
    {
        "productName": "Infinity Supreme",
        "productShortName": "500050",
        "productCode": "500050",
        "minimumAmount": 5152000,
        "maximumAmount": 5152000,
        "price": 5152000,
        "serviceId": null
    },
    {
        "productName": "Intense Extra",
        "productShortName": "500051",
        "productCode": "500051",
        "minimumAmount": 7084000,
        "maximumAmount": 7084000,
        "price": 7084000,
        "serviceId": null
    },
    {
        "productName": "Home Premier",
        "productShortName": "500052",
        "productCode": "500052",
        "minimumAmount": 998200,
        "maximumAmount": 998200,
        "price": 998200,
        "serviceId": null
    },
    {
        "productName": "Prepaid Voice 20",
        "productShortName": "105",
        "productCode": "105",
        "minimumAmount": 2000,
        "maximumAmount": 2000,
        "price": 2000,
        "serviceId": null
    },
    {
        "productName": "Prepaid Voice 100",
        "productShortName": "106",
        "productCode": "106",
        "minimumAmount": 10000,
        "maximumAmount": 10000,
        "price": 10000,
        "serviceId": null
    },
    {
        "productName": "Prepaid Voice 500",
        "productShortName": "121",
        "productCode": "121",
        "minimumAmount": 50000,
        "maximumAmount": 50000,
        "price": 50000,
        "serviceId": null
    },
    {
        "productName": "Prepaid Voice 1000",
        "productShortName": "122",
        "productCode": "122",
        "minimumAmount": 100000,
        "maximumAmount": 100000,
        "price": 100000,
        "serviceId": null
    },
    {
        "productName": "Prepaid Voice 2000",
        "productShortName": "123",
        "productCode": "123",
        "minimumAmount": 200000,
        "maximumAmount": 200000,
        "price": 200000,
        "serviceId": null
    },
    {
        "productName": "Prepaid Voice 5000",
        "productShortName": "124",
        "productCode": "124",
        "minimumAmount": 500000,
        "maximumAmount": 500000,
        "price": 500000,
        "serviceId": null
    },
    {
        "productName": "Prepaid Voice 10000",
        "productShortName": "125",
        "productCode": "125",
        "minimumAmount": 1000000,
        "maximumAmount": 1000000,
        "price": 1000000,
        "serviceId": null
    },
    {
        "productName": "Voice On Net",
        "productShortName": "500053",
        "productCode": "500053",
        "minimumAmount": 250000,
        "maximumAmount": 250000,
        "price": 250000,
        "serviceId": null
    },
    {
        "productName": "Blaze Lite ",
        "productShortName": "500044",
        "productCode": "500044",
        "minimumAmount": 217200,
        "maximumAmount": 217200,
        "price": 217200,
        "serviceId": null
    },
    {
        "productName": "Blaze Xtra",
        "productShortName": "500045",
        "productCode": "500045",
        "minimumAmount": 337900,
        "maximumAmount": 337900,
        "price": 337900,
        "serviceId": null
    },
    {
        "productName": "Blaze Boost",
        "productShortName": "500046",
        "productCode": "500046",
        "minimumAmount": 434400,
        "maximumAmount": 434400,
        "price": 434400,
        "serviceId": null
    },
    {
        "productName": "Blaze Ultra",
        "productShortName": "500047",
        "productCode": "500047",
        "minimumAmount": 699800,
        "maximumAmount": 699800,
        "price": 699800,
        "serviceId": null
    },
    {
        "productName": "Blaze Trailblazer",
        "productShortName": "500048",
        "productCode": "500048",
        "minimumAmount": 1497300,
        "maximumAmount": 1497300,
        "price": 1497300,
        "serviceId": null
    },
    {
        "productName": "Blaze Supernova",
        "productShortName": "500049",
        "productCode": "500049",
        "minimumAmount": 2978500,
        "maximumAmount": 2978500,
        "price": 2978500,
        "serviceId": null
    }
]

// ) => telone.map((_package) => {
//     return _package.productName.search('Home')
// })

const home = telone.filter((_package) => {

    return _package.productName.search("Home") != -1

})


const infinity = telone.filter((_package) => {

    return _package.productName.search("Infinity") != -1

})

const Intense = telone.filter((_package) => {

    return _package.productName.search("Intense") != -1

})

const Voice = telone.filter((_package) => {

    return _package.productName.search("Voice") != -1

})


const blaze = telone.filter((_package) => {

    return _package.productName.search("Blaze") != -1

})

const adsl_fibre = [...home, ...infinity, ...Intense]



const total = [...home, ...infinity, ...Intense, ...Voice, ...blaze]
console.log(Voice.length)
