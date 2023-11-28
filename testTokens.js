function extractTokenValue(obj) {
    const token = obj.token;

    if (!token) {
        return []; // Token value not found, return an empty array
    }

    const tokens = token.split("#"); // Split the token by '#'
    const results = tokens.map((t, index) => {
        const values = t.split("|"); // Split each token by '|'
        const tokenNumber = `token`; // Generate token key (e.g., token1, token2, etc.)
        const tokenValue = values[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        ; // Format token value with spaces every three digits
        return { tokenValue, units: values[1], vat: values[5] }; // Create an object with token number as key and formatted value as value
    });

    return results;
}

// Usage example
const obj = {
    "mti": "0210",
    "vendorReference": "03423768dwy",
    "processingCode": "U50000",
    "transactionAmount": "1000001",
    "amount": "",
    "transmissionDate": "30920081415",
    "vendorNumber": "VE19257147501",
    "transactionReference": "ESO32525032942",
    "responseCode": "00",
    "vendorTerminalId": "",
    "vendorBranchId": "",
    "merchantName": "ZETDC",
    "customerAddress": "",
    "customerData": "",
    "arrears": "",
    "vendorBalance": "",
    "aggregator": "POWERTEL",
    "utilityAccount": "43015110372",
    "narrative": "Transaction processed successfully",
    "paymentType": "",
    "token": "09211850287018781693|171.3||00001231127143319210|943396|0|0.00#73260134147919584780|171.3||00001231127143319210|943396|0|0.00#37274823293481826421|171.3||00001231127143319210|943396|0|0.00",
    "fixedCharges": "RE Levy|00001231127143319210|56604|0|6%",
    "miscellaneousData": "",
    "currencyCode": "ZWL",
    "sourceMobile": "",
    "targetMobile": "",
    "productName": "ZETDC_PREPAID",
    "subProductName": "",
    "serviceId": "",
    "requiresVoucher": false,
    "initialBalance": 0.0,
    "finalBalance": 0.0,
    "customerBalance": null,
    "originalReference": null,
    "receiptNumber": null,
    "accountNumber": null,
    "apiVersion": "02",
    "id": null
};

// const tokenValues = extractTokenValue(obj);
// console.log(tokenValues);

const smsBody = (obj) => {
    const sms =
        `
    ${extractTokenValue(obj).map((token, index) => { return `Token${index + 1}: ${token.tokenValue}` })}
    Meter: ${obj.utilityAccount}
    KwH: ${extractTokenValue(obj).map((token, index) => { return `${token.units}` })[0]}
    Energy: ${extractTokenValue(obj).map((token, index) => { return `${token.units}` })[0]}
    Debt: ${obj?.arrears ? obj?.arrears : `$0.00`}
    REA: 
    VAT:  ${extractTokenValue(obj).map((token, index) => { return `${token.vat}` })[0]}
    Total Amt:  ${obj?.transactionAmount}
    ${obj.transmissionDate}
    Please input tokens in their given order

    `
    return sms
}

// console.log(generateSms())