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


console.log(formartMessage(str));
