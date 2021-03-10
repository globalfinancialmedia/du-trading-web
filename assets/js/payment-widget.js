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
    outputHtmlStringAr = `
    <div id="wrapper">
    <div class="row">
      <div class="col-xs-5">
        <div id="cards">
          <img src="./assets/images/Visa-icon.png">
          <img src="./assets/images/Master-Card-icon.png">
          <img src="./assets/images/Paypal-icon.png">
        </div><!--#cards end-->
      </div><!--col-xs-5 end-->
    </div><!--row end-->
    
    <div class="row">
      <div class="col-xs-5">
        <i class="fa fa fa-user"></i>
        <label for="cardholder">Cardholder's Name</label>
        
        <input type="hidden" id="currency" name="currency" value="EGP">
        <input type="hidden" id="clientIdentifier" name="clientIdentifier" value="duMubasher">
        <input type="hidden" id="amount" name="amount" value="27">
        

        <input type="text" name='cardholder' placeholder="Mike John" id="cardholder">
      </div><!--col-xs-5-->
      <div class="col-xs-5">
        <i class="fa fa-credit-card-alt"></i>
        <label for="cardnumber">Card Number</label>
        <input type="text" placeholder="1234567891011" id="cardNumber" name="cardNumber">
      </div><!--col-xs-5-->
    </div><!--row end-->
    <div class="row row-three">
      <div class="col-xs-2">
        <i class="fa fa-calendar"></i>
        <label for="date">Valid thru</label>
        <input type="text" placeholder="01/22" id="cardExpiryDate" name="cardExpiryDate">
      </div><!--col-xs-3-->
      <div class="col-xs-2">
        <i class="fa fa-lock"></i>
        <label for="date">CVV / CVC *</label>
        <input type="text" placeholder="123" id="cardSecurityCode" name="cardSecurityCode">
      </div><!--col-xs-3-->
      <div class="col-xs-5">
        <span class="small">* CVV or CVC is the card security code, unique three digits number on the back of your card seperate from its number.</span>
      </div><!--col-xs-6 end-->
    </div><!--row end-->
    <footer>
      <button class="btn" type='submit'>Start Subscription</button>
    </footer>
  </div>`;
    return outputHtmlStringAr;
};

function handleSubmit(event) {
    event.preventDefault();

    console.log('submit Payment function');
    

    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    fetch('http://localhost:2120/payment/v1/init', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
    })
    .then(response => response.json())
    .then(value => {
    console.log('Success:', value);
    })
    .catch((error) => {
    console.error('Error:', error);
    });

    console.log({ value });
};