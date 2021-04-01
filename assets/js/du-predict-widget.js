const info_mubasher_widget_urls = [
    { "slug": "du_predict_symbol_list", "url": "https://jsonplaceholder.typicode.com/todos" },
    { "slug": "du_predict_time_zone", "url": "https://jsonplaceholder.typicode.com/todos/1" },
    { "slug": "du_make_prediction_widget", "url": "https://jsonplaceholder.typicode.com/todos/1" },
    { "slug": "du_predict_leader_board", "url": "https://jsonplaceholder.typicode.com/todos" },
    { "slug": "du_predict_view_list", "url": "https://jsonplaceholder.typicode.com/todos" }
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
        loader(config_data.widget_config[1].htmlContainerId);
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

function loader(containerId) {
    var element = document.getElementById(containerId);
    element.classList.add("loader");
};

function infoSendRequest(req_headers, body, url, url_param, request_type, htmlContainerId, customeStyles, widgetSlug) {
    if (url_param !== "") {
        url = url + url_param;
    }
    let fetchParams = request_type === "POST" ? { method: request_type, headers: req_headers, body: body } : { method: request_type, headers: req_headers }
    fetch(url, fetchParams).then(res => {
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
            container.classList.remove("loader");
            if (typeof container === "object") {
                container.innerHTML = generatedHTML;
            } else {
                console.log("Unable to find container by specified id in widget config. Slug name is ( " + widgetSlug + " )");
            }
            return response;
        })
        .catch(error => {
            console.log(error);
        })
};

function createHTML(reqDataObject, widgetSlug) {
    if (widgetSlug == "du_predict_symbol_list") {
        return predictSymbolListHTML(reqDataObject)
    } else if (widgetSlug === "du_predict_time_zone") {
        return predictTimeZoneHTML(reqDataObject);
    } else if (widgetSlug === "du_make_prediction_widget") {
        return makePredictionListHTML(reqDataObject);
    } else if (widgetSlug === "du_predict_leader_board") {
        return predictLeaderBoardHTML(reqDataObject);
    } else if (widgetSlug === "du_predict_view_list") {
        return predictListViewHTML(reqDataObject);
    } else if (widgetSlug === "market_snapshot") {
        return '<div class="d-flex gray-border mb-2 du-mt-4 coun-ls-gcc">Not Found!</div>';
    }
};


/* Symbol of the week DU predict */

function predictSymbolListHTML(response) {
    let outputHtmlString = "";
    outputHtmlString = `<h1>Price Prediction Contest</h1> <p>Participate by submitting your price and win $10 to $50.<a href="#">Learn More</a></p><div class="du-row"> <div class="du-col-md-8"> <h2>Symbol of the week</h2> <p>Valid till Sunday 17 2020 at 4:00PM</p></div>
    <div class="du-col-md-4-du-mt-3"> <div class="du-dropdown"> <button class="du-btn-primary du-dropdown-toggle" type="button" data-toggle="du-dropdown">Symbol
    <span class="caret"></span></button> <ul class="du-dropdown-menu"> <li><a href="#">ETEL1</a></li><li><a href="#">ETEL2</a></li><li><a href="#">ETEL2</a>
    </li></ul> </div></div><div class="du-col-md-8"> <img src="./assets/images/du-predict-logo.png"> </div><div class="du-col-md-4"> <div class="du-dropdown">
    <button class="du-btn btn-primary du-dropdown-toggle" type="button" data-toggle="du-dropdown">12.02 <span class="caret"></span></button> </div></div></div>`;
    return outputHtmlString;
};

function predictTimeZoneHTML(response) {
    let outputHtmlString = "";
    outputHtmlString = ` <div class="du-row du-mt-5"> <div class="du-col-md-6 "> <table class="du-table table-even table-hover"> <tbody> <tr> <td colspan="2">Open</td>
    <td>12.09</td></tr><tr> <td colspan="2">Previous Close</td><td>13.09</td></tr><tr> <td colspan="2">High</td><td>13.11</td></tr><tr> <td colspan="2">Low</td>
    <td>12.9</td></tr></tbody> </table> </div><div class="du-col-md-6"> <table class="du-table table-even table-hover"> <thead> <tr> <th colspan="2">Stock Statistics
    </th> </tr></thead> <tbody> <tr> <td>Volume</td><td>1,376,699</td></tr><tr> <td>Volume</td><td>1,376,699</td></tr></tbody> </table> <small>
    All the information is with 10 minutes delay</small> </div></div>`;
    return outputHtmlString;
};

function predictListViewHTML(response) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    response.forEach(data => {
        insideLoopHTML += ` <tr> <td> <a href="#"> <i class="fa fa-edit"></i> </a> </td><td> <a href="#"> <i class="fa fa-trash"></i></a>
        </td><td>FLSH(D)</td><td>Canceled</td><td>4.0</td><td>4.0</td><td>08-03-2021</td></tr>`
    });
    outputHtmlString = `<h2>Prediction List</h2> <div style="margin-bottom:20px;" class="du-row "> <div class="du-col-md-2"> <label>Symbol</label>
    <input type="text" class="du-form-control" placeholder="All"> </div><div class="du-col-md-2"> <label>Status</label> <input type="text" class="du-form-control" 
    placeholder="All"> </div><div class="du-col-md-2"> <label>Date</label> <input type="text" class="du-form-control" placeholder="Date"> </div><div class="col-md-4 du-mt-2">
    <button class="du-btn btn-primary " type="button" data-toggle="dropdown">Filter</button> </div></div><div class="du-predict-leader-overflow"><table class="du-table 
    table-right table-bordered"> <thead><tr> <th></th> <th></th> <th>Symbol</th> <th>Status</th> <th>Prediction</th> <th>Price</th> <th>Date</th> </tr></thead> 
    <tbody> ` + insideLoopHTML + ` </tbody> </table></div>`;
    return outputHtmlString;
};

function predictLeaderBoardHTML(response) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    response.forEach(data => {
        insideLoopHTML += `<tr> <td>1</td><td>Hamster Toad</td><td>12.01</td><td>Tue 15/03 13:00PM</td></tr>`
    });
    outputHtmlString = ` <h2>Leader Board <span>(ETEL)</span></h2><div class="du-predict-leader-overflow"><table class="du-table table-right table-hover"> <thead> <tr> <th>Rank</th>
    <th>Name</th> <th>Price</th> <th>Rank</th> </tr></thead> <tbody> ` + insideLoopHTML + ` </tbody> </table></div>`;
    return outputHtmlString;
};

function makePredictionListHTML(response) {
    let outputHtmlString = "";
    outputHtmlString = `<div class="du-row"> <div class="du-col-md-8"> <input type="text" class="du-form-control" id="exampleInputPredication" 
    aria-describedby="pr" placeholder="Enter Predication Price"> </div><div class="du-col-md-4"> <button class="du-btn-primary" type="button">Make 
    Predication</button> </div></div>`;
    return outputHtmlString;
};