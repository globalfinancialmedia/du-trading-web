const info_mubasher_widget_urls = [
    { "slug": "generate_payment_html", "url": "https://jsonplaceholder.typicode.com/todos/1" },
];


function loadInfoJsWidget(widget_data) {
    widget_data.widgets.forEach((config_data) => {
        let widgetSlug = config_data.widget_config[0].widgetSlug;
        let info_req_headers = {};
        info_req_headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, info_req_headers);
        info_req_headers = Object.assign({ "authorization": widget_data.authToken }, info_req_headers);
        let apiUrlObj = info_mubasher_widget_urls.find(
            ({ slug }) => slug === widgetSlug
        );
        if ((apiUrlObj.url != "" && apiUrlObj.url !== undefined)) {
            infoSendRequest(info_req_headers,
                config_data.widget_config[3].data[0], //body
                apiUrlObj.url, //url
                config_data.widget_config[4].urlParam,//url_param
                config_data.widget_config[2].requestType, //request_type
                config_data.widget_config[1].htmlContainerId,//htmlContainerId
                config_data.widget_config[5].customeStyles, //styles
                widgetSlug //widget identifier
            );
        }
    });
};

function infoSendRequest(req_headers, body, url, url_param, request_type, htmlContainerId, customeStyles, widgetSlug) {
    if (url_param !== "") {
        url = url + "?" + url_param;
    }
    let fetchParams = request_type === "POST" ? { method: request_type, headers: req_headers, body: body } : { method: request_type, headers: req_headers }
    fetch(url, fetchParams).then(res => {
        console.log(res);
        switch (res.status) {
            case 200:
                return res.json();
                break;
            case 400:
                return 'Invalid syntax request!';
                break;
            case 401:
                return 'Unauthorized Access';
                break;
            case 403:
                return 'Dont have rights to this content';
                break;
            case 404:
                return 'Not Found';
                break;
            case 429:
                return 'Too Many Requests, Pleaes try again later!';
                break;
            case 500:
                return 'Internal Server error!';
                break;
            case 502:
                return 'Bad Gateway!';
                break;
            case 408:
                return 'Request Timeout!';
                break;
            default:
                return [];
        }
    })
        .then(response => {
            let generatedHTML = createHTML(response, widgetSlug);
            var container = document.getElementById(htmlContainerId);
            if (typeof container === "object") {
                container.innerHTML = generatedHTML;
            }
            return response;
        })
        .catch(error => {
            console.log(error);
        })
};

function createHTML(reqDataObject, widgetSlug) {
    if (widgetSlug === "generate_payment_html") {
        return testHTML(reqDataObject);
    } else if (widgetSlug === "market_snapshot") {
        return '<div class="d-flex gray-border mb-2 mt-4 coun-ls-gcc">market Snapshot Data is in console</div>';
    }
};


function testHTML(responseDataObj) {
    let outputHtmlStringAr = "";
    outputHtmlStringAr = `<div class="du-card du-payment-wrapper"><div class="du-card-header">Payment Info</div><div class="du-card-body">
    <div class="du-text-center"><img src="./assets/images/Visa-icon.png" width="100px"><img src="./assets/images/Master-Card-icon.png" width="100px">
    <img src="./assets/images/Paypal-icon.png" width="100px"></div><form><div class="du-row du-mb-3"><div class="du-col">
    <label for="formGroupExampleInput">Cardholder's Name</label><input type="hidden" id="currency" name="currency" value="EGP">
    <input type="hidden" id="clientIdentifier" name="clientIdentifier" value="duMubasher"><input type="hidden" id="amount" name="amount" value="27">
    <input type="text" class="du-form-control" name='cardholder' placeholder="Mike John" id="cardholder"></div><div class="du-col">
    <label for="formGroupExampleInput">Card Number</label><input type="text" class="du-form-control" placeholder="1234567891011" 
    id="cardNumber" name="cardNumber"></div></div><div class="du-row"><div class="du-col"><label for="formGroupExampleInput">
    Valid thru</label><input type="text" name="cardExpiryDate" id="cardExpiryDate" class="du-form-control" placeholder="01/22">
    </div><div class="du-col"><label for="formGroupExampleInput">CVV / CVC *</label><input type="text" class="du-form-control" 
    placeholder="123" id="cardSecurityCode" name="cardSecurityCode"></div></div><div class="du-row du-mt-3"><div class="du-col">
    <p class="small">* CVV or CVC is the card security code, unique three digits number on the back of your card seperate from its number.</p>
    </div></div><button class="btn du-btn-primary du-payment-btn-submit" onclick='handleSubmit(event)'>Start Subscription</button></form></div></div>`;
    return outputHtmlStringAr;
};

function handleSubmit(event) {
    event.preventDefault();

    console.log('submit Payment function');
    var cd = document.getElementById('cardholder').value;
	var cn = document.getElementById('cardNumber').value;
	var ced = document.getElementById('cardExpiryDate').value;
	var csc = document.getElementById('cardSecurityCode').value;

//4005550000000001
	var ItemJSON = '{    "cardExpiryDate": "'+ced+'",    "cardNumber": "'+cn+'",   "cardHolder": "'+cd+'",   "cardSecurityCode": "'+csc+'", "currency": "EGP",  "customer_email": "test@test.com",  "language": "en",  "clientIdentifier": "testClient", "userId":"testUser", "appId":"duTestApp", "amount":"100"  }';

console.log('request body: ' + ItemJSON);

    fetch('http://localhost:2120/payment/v1/init', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: ItemJSON,
    })
    .then(response => response.json())
    .then(value => {
    console.log('Success:', value);
	
    })
    .catch((error) => {
    console.error('Error:', error);
    });
    
};