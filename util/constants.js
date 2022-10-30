
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

export const testVendorNumber = "VE19257147501";

export const vendorNumbers = {
    econet: "VE19257147501",
    netone: 'VE19257147502',
    telecel: "VE19257147503",
    zetdc: '',
    dstv: '',
    moonlight: '',
    nyaradzo: '',
    lifeAssurrance: "LIFEASSURERANCE",

    _liveVendorNumber: "VE28436262401"

}


export const apiUrl = "http://localhost:5500";


const STATUS_CODES = {
    '100': 'Continue',
    '101': 'Switching Protocols',
    '102': 'Processing',
    '103': 'Early Hints',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '207': 'Multi-Status',
    '208': 'Already Reported',
    '226': 'IM Used',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '307': 'Temporary Redirect',
    '308': 'Permanent Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Failed',
    '413': 'Payload Too Large',
    '414': 'URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': "I'm a Teapot",
    '421': 'Misdirected Request',
    '422': 'Unprocessable Entity',
    '423': 'Locked',
    '424': 'Failed Dependency',
    '425': 'Too Early',
    '426': 'Upgrade Required',
    '428': 'Precondition Required',
    '429': 'Too Many Requests',
    '431': 'Request Header Fields Too Large',
    '451': 'Unavailable For Legal Reasons',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported',
    '506': 'Variant Also Negotiates',
    '507': 'Insufficient Storage',
    '508': 'Loop Detected',
    '509': 'Bandwidth Limit Exceeded',
    '510': 'Not Extended',
    '511': 'Network Authentication Required'
}


export const econetSMSGatewayUrl = "https://europe-west2-projectx-ussd-game.cloudfunctions.net/send_econet_sms_message"


export const eSolutionsSmsGatewayUrl = "https://mobile.esolutions.co.zw/bmg/api/single";