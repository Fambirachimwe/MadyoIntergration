
//  message type indicators 
export const MTI = {
    transactionRequest: "0200",
    transactionResponse: "0210",
    transactionResendRequest: "0201",
    transactionResendResponse: "0211"

}

export const processingCodes = {
    vendorBalanceEnquiry: "300000",
    customerInfomation: "310000",
    lastCustomerToken: "320000",
    tokenPuchaseRequest: "U50000"
}

export const responseCodes = {
    "00": "Transaction Successful",
    "05": "Error",
    "09": "Transaction still in progress",
    "14": "Invalid meter number",
    "68": "Transaction timeout",
    "94": "Dublicate transaction"
}