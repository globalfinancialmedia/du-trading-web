var duPredictBaseUrl = 'ttps://jsonplaceholder.typicode.com/todos';

var getPredictContestDetails = {};
var duPredictListArray = [];
var duPredictAuthCount = 0;

var info_predict_widget_urls = [
    { "slug": "du_predict_symbol_list", "url": duPredictBaseUrl + "/api/v1/predict/contests/active/0" },
    // { "slug": "du_predict_time_zone", "url": "http://108.128.95.112:4700/api/v1/predict/contests/active/0" },
    { "slug": "du_make_prediction_widget", "url": duPredictBaseUrl + "/api/v1/predict/predictions/active/" + sessionStorage.getItem('username') },
    { "slug": "du_predict_leader_board", "url": "https://jsonplaceholder.typicode.com/todos" },
    { "slug": "du_predict_view_list", "url": duPredictBaseUrl + "/api/v1/predict/predictions/" }
];

// let myScript = document.createElement("script");
// myScript.setAttribute("src", "https://unpkg.com/sweetalert2@7.8.2/dist/sweetalert2.all.js");
// document.body.appendChild(myScript);


function loadInfoJsWidget(widget_data) {
    widget_data.widgets.forEach((config_data) => {
        let widgetSlug = config_data.widget_config[0].widgetSlug;
        let info_req_headers = {};
        info_req_headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, info_req_headers);
        info_req_headers = Object.assign({ "authorization": widget_data.authToken }, info_req_headers);
        let apiUrlObj = info_predict_widget_urls.find(
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
    containerId.innerContent = "";
    element.classList.add("loader");
};

function infoSendRequest(req_headers, body, url, url_param, request_type, htmlContainerId, customeStyles, widgetSlug) {
    console.log('check params1', req_headers);
    console.log('check params2', body);
    console.log('check param3', url);
    console.log('check params4', url_param);
    console.log('check params5', request_type);
    console.log('check params6', htmlContainerId);
    console.log('check params7', customeStyles);
    console.log('check params8', widgetSlug);
    if (url_param !== "") {
        url = url + url_param;
    }
    let fetchParams = request_type === "POST" || request_type === "PUT" ? { method: request_type, headers: req_headers, body: body } : { method: request_type, headers: req_headers };
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
            console.log('response', response);
            let generatedHTML = createHTML(response, widgetSlug);
            if (widgetSlug === 'du_make_prediction_widget' && body !== undefined) {
                swal({
                    icon: 'error',
                    title: 'Prediction Added Successfully',
                });
                this.duPredictListArray.push(response);
                // this.duPredictAuthCount += 1;
                sessionStorage.setItem('duPredictAuthCount', this.duPredictAuthCount += 1);
            }
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
    } else if (widgetSlug === "du_make_prediction_widget") {
        return makePredictionListHTML(reqDataObject);
    } else if (widgetSlug === "du_predict_leader_board") {
        return predictLeaderBoardHTML(reqDataObject);
    } else if (widgetSlug === "du_predict_view_list") {
        return predictListViewHTML(reqDataObject);
    } else if (widgetSlug === "du_predict_list_delete") {
        return deletePredictList(reqDataObject, null, null, null, null, null, null, null, null);
    } else if (widgetSlug === "market_snapshot") {
        return '<div class="d-flex gray-border mb-2 du-mt-4 coun-ls-gcc">Not Found!</div>';
    }
};

function displayIndex(index) {
    return index + 1;
}


/* Left Section Symbol of the week DU predict */
function predictSymbolListHTML(response) {
    this.getPredictContestDetails = response;
    let outputHtmlString = "";
    if (response.msg == "Active Contest Found") {
        if (response.stats.NET_CHANGE > 0) {
            var img = '<img src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/dropdown-up-arrow.svg" class="du-predict-up-arrow du-mb-2">';
            var netChangeStyle = 'color: #3c763c !important;';
        }
        if (response.stats.NET_CHANGE < 0) {
            var img = '<img src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/dropdown-down-arrow.svg" class="du-predict-down-arrow du-mb-2">';
            var netChangeStyle = 'color: #E30000 !important;'
        }
        outputHtmlString = `<h4>Price Prediction Contest</h4> <p>Participate by submitting your price and the last date to make your prediction on ` + setTimeDateFormat(response.contest.lastPredictionDate) + `.<a href="https://du-egypt.com/?page_id=99867" 
        target="_blank" class="du-learn-main-color du-ml-2">Learn More</a></p><div class="du-row"><div class="du-col-md-8"><h5 class="main-color">The Stock Name: ` + response.contest.symbol.code + `</h5></div>
        <div class="du-col-md-4 du-mt-2"><select id="predictionContestId" class="du-form-control du-form-control-sm" aria-label=".form-select-sm example" onChange="getPredictSymbolId(event)">
        <option value="0" selected>Weekly</option><option value="1">Monthly</option></select></div><div class="du-col-md-12 du-mt-3"><p><span 
        class="du-predict-contest-heading">Contest Start Date:</span> Valid till ` + setTimeDateFormat(response.contest.fromDate) + `</p></div><div class="du-col-md-12"><p><span class="du-predict-contest-heading">Contest End Date:</span> 
        Valid till ` + setTimeDateFormat(response.contest.toDate) + `</p> </div><div class="du-col-md-12"><p><span class="du-predict-contest-heading">Last Date & time to submit your Prediction:</span> 
        Valid till ` + setTimeDateFormat(response.contest.lastPredictionDate) + `</p></div><div class="du-col-md-8"><h4 class="main-color du-mt-3">Stock Statistics</h4></div>
        <div class="du-col-md-4 du-text-center du-mt-3">` + img + `<h5 class="du-d-inline du-black-title font26">` + response.stats.TRADE_PRICE + `</h5><br><span 
         class="du-predict-contest-volume du-ml-5" style="` + netChangeStyle + `">` + response.stats.NET_CHANGE + `</span><span class="du-predict-contest-volume du-ml-2" style="` + netChangeStyle + `">` + response.stats.PCT_CHANGE + `%</span></div></div>
        <div class="du-row du-mt-2"> <div class="du-col-md-6 "> <table class="du-table du-table-hover"> <tbody> <tr> <td colspan="2">Open</td>
        <td class="du-predict-table-data">` + response.stats.OPEN_PRICE + `</td></tr><tr> <td colspan="2">Previous Close</td><td class="du-predict-table-data">` + response.stats.PREV_CLOSED + `</td></tr><tr> <td colspan="2">High</td><td class="du-predict-table-data">` + response.stats.HIGH_PRICE + `</td></tr><tr>
        <td colspan="2">Low</td><td class="du-predict-table-data">` + response.stats.LOW_PRICE + `</td></tr></tbody> </table> </div><div class="du-col-md-6"> <table class="du-table du-table-hover"> 
        <tbody> <tr> <td>Volume</td><td class="du-predict-table-data">` + response.stats.VOLUME + `</td></tr><tr> <td>Turnover</td><td class="du-predict-table-data">` + response.stats.TURNOVER + `</td>
        </tr></tbody> </table> <p class="du-text-right">All the information is with 15 minutes delay</p> </div></div>`;
        return outputHtmlString;
    };
    if (response.msg == "No Active Contest Found For given Type") {
        outputHtmlString = `<h4>Price Prediction Contest</h4><p>Participate by submitting your price and the last date to make your prediction on -.
        <a href="https://du-egypt.com/?page_id=99867" target="_blank" class="du-learn-main-color du-ml-2">Learn More</a></p><div class="du-row"><div class="du-col-md-8">
        <h5 class="main-color">The Stock Name:-</h5></div><div class="du-col-md-4 du-mt-2"><select id="predictionContestId" class="du-form-control du-form-control-sm" 
        aria-label=".form-select-sm example" onChange="getPredictSymbolId(event)"><option value="0">Weekly</option><option value="1" selected>Monthly</option></select>
        </div><div class="du-col-md-12 du-mt-5 du-mb-5"><h5>There is no active competition, stay tuned for next competition</h5></div><div class="du-col-md-8"><h4 
        class="main-color du-mt-3">Stock Statistics</h4></div><div class="du-col-md-4 du-text-center du-mt-3"><h5 class="du-d-inline du-black-title font26">-</h5><br>
        <span class="du-predict-contest-volume du-ml-5">-</span><span class="du-predict-contest-volume du-ml-2">-%</span></div></div><div class="du-row du-mt-2"><div 
        class="du-col-md-6 "><table class="du-table du-table-hover"><tbody><tr><td colspan="2">Open</td><td class="du-predict-table-data">-</td></tr><tr><td colspan="2">
        Previous Close</td><td class="du-predict-table-data">-</td></tr><tr><td colspan="2">High</td><td class="du-predict-table-data">-</td></tr><tr><td colspan="2">
        Low</td><td class="du-predict-table-data">-</td></tr></tbody></table></div><div class="du-col-md-6"><table class="du-table du-table-hover"><tbody><tr><td>Volume
        </td><td class="du-predict-table-data">-</td></tr><tr><td>Turnover</td><td class="du-predict-table-data">-</td></tr></tbody></table><p class="du-text-right">
        All the information is with 15 minutes delay</p></div></div>`;
        return outputHtmlString;
    }
};


/* Make Prediction Form */
function makePredictionListHTML(response) {
    sessionStorage.setItem('duPredictAuthCount', parseInt(response.count));
    let outputHtmlString = "";
    let duPredictCountCheck = "";
    this.duPredictAuthCount = response.count;
    response.count = 2;
    if (response.count == 0) {
        duPredictCountCheck = `<button class="du-btn du-btn-primary du-btn-block du-pt-2" type="button" disabled>Make Prediction</button>`;
    } else {
        duPredictCountCheck = `<button class="du-btn du-btn-primary du-btn-block du-pt-2" type="button" onClick="postPredictionContest(event)">Make Prediction</button>`;
    }
    outputHtmlString = `<div class="du-row du-mb-4"> <div class="du-col-md-8"> <input type="number" class="du-form-control" id="predictionPriceValueField" 
    placeholder="0000.00"> </div><div class="du-col-md-4">` + duPredictCountCheck + `</div></div>`;
    return outputHtmlString;
};

function checkPredictionFieldLength(element) {
    console.log('element', element);
    if (/^-?[0-9]+(?:\.[0-9]+)?$/.test(element) && /^[0-9]{4,6}$/.test(element.replace(/[.-]/g, ""))) {
        console.log("valid");
        return true;
    }
    else {
        swal({
            icon: 'error',
            title: 'Invalid Price Format',
            text: 'Example Format: 1234.56',
        });
        return false;
    }
};

function postPredictionContest(event) {
    event.preventDefault();
    var getPredictionVal = document.getElementById("predictionPriceValueField").value;
    checkPredictionFieldLength(getPredictionVal);
    if (checkPredictionFieldLength(getPredictionVal) === true) {
        swal({
            title: 'Are you Sure?',
            text: "Please confirm your prediction price",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#25476a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Proceed it!'
        }).then((result) => {
            console.log('result', result);
            if (result.value === true) {
                const body = {
                    "contestId": this.getPredictContestDetails.contest.id,
                    "status": "ACTIVE",
                    "userName": sessionStorage.getItem('username'),
                    "firstName": sessionStorage.getItem('firstName'),
                    "lastName": sessionStorage.getItem('lastName'),
                    "createDate": new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
                    "predictionPrice": getPredictionVal,
                    "marketPrice": this.getPredictContestDetails.stats.TRADE_PRICE
                }
                const url = duPredictBaseUrl + "/api/v1/predict/predictions/";
                let req_headers = {};
                req_headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, req_headers);
                req_headers = Object.assign({ "authorization": sessionStorage.getItem('token') }, req_headers);
                this.infoSendRequest(req_headers, JSON.stringify(body), url, "", "POST", "du_make_prediction_container_widget", [], "du_make_prediction_widget");
            }
            if (result.dismiss === 'cancel') {
                console.log('request cancelled');
            }
        })
    }
};


/* Prediction List bottom */
function predictListViewHTML(response) {
    console.log('response predict list', response);
    this.duPredictListArray = response;
    let outputHtmlString = "";
    let insideLoopHTML = "";
    let predictionStatus = "";
    response.forEach(data => {
        switch (data.status) {
            case 'COMPLETED':
                predictionStatus = 'background-color: #2d9a2d !important;';
                break;
            case 'ACTIVE':
                predictionStatus = 'background-color: #7e7d7b !important;';
                break;
            case 'CANCELLED':
                predictionStatus = 'background-color: #e82a2a !important;';
                break;
            case 'AMENDED':
                predictionStatus = 'background-color: #00aac7 !important;';
                break;
            default:
                return [];
        }
        var predictData = JSON.stringify(data);
        insideLoopHTML += `<tr><td> <img src="assets/images/du-predict-edit.png" width="20px"> </td><td> <img src="assets/images/du-predict-close.png" class="du-cursor-pointer" width="20px" 
        onclick='deletePredictList(${predictData}, event);'></td><td>` + data.contest.symbol.code + `</td><td class="predictStatusView" style="` + predictionStatus + `">` +
            data.status + `</td><td>` + data.predictionPrice + `</td><td>` + data.marketPrice + `</td><td>` + setTimeDateFormat(data.createDate) + `</td></tr>`;
    });
    outputHtmlString = `<br><h4 class="main-color">Prediction List</h4><hr> <div style="margin-bottom:20px;" class="du-row "> <div class="du-col-md-2"><label>Symbol</label>
    <select class="du-form-control du-form-control-sm"><option selected>All</option><option>EGX</option></select></div><div class="du-col-md-2"> <label>Status</label><select 
    class="du-form-control du-form-control-sm"><option selected>All</option><option>Open</option><option>Expired</option><option>Amended</option><option>Cancelled</option>
    </select></div><div class="du-col-md-2"> <label>Date</label> <input type="date" class="du-form-control du-form-control-sm" placeholder="Date"> </div><div 
    class="du-col-md-1 du-mt-4"><button class="du-btn du-btn-primary du-btn-block du-btn-sm" type="button" data-toggle="dropdown">Filter</button> </div></div><div 
    class="du-predict-list-overflow"><table class="du-table du-table-bordered table-right du-table-hover" id="prediction-list-table"> <thead><tr><th></th><th></th>
    <th>Symbol</th> <th>Status</th> <th>Prediction Price</th> <th>Price</th> <th>Date</th> </tr></thead><tbody> ` + insideLoopHTML + ` </tbody></table></div>`;
    return outputHtmlString;
};


function setTimeDateFormat(date) {
    let options = {
        weekday: "long", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    return new Date(date).toLocaleDateString("en-us", options);
}

/* Delete Prediction List */
function deletePredictList(data, event) {
    event.preventDefault();
    console.log('response delete', data);
    swal({
        title: 'Are you sure?',
        text: "Do you want to delete prediction?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#25476a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        console.log('result', result);
        if (result.value === true) {
            swal(
                'Deleted!',
                'Your Prediction has been deleted',
                'success'
            );
            const body = {
                "contestId": data.contest.id,
                "status": "CANCELLED",
                "userName": data.userName,
                "firstName": data.firstName,
                "lastName": data.lastName,
                "createDate": data.contest.createDate,
                "predictionPrice": data.predictionPrice,
                "marketPrice": data.marketPrice
            }
            const url = duPredictBaseUrl + "/api/v1/predict/predictions/" + data.id;
            let req_headers = {};
            req_headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, req_headers);
            req_headers = Object.assign({ "authorization": sessionStorage.getItem('token') }, req_headers);
            this.infoSendRequest(req_headers, JSON.stringify(body), url, "", "PUT", "du_predict_view_container", [], "du_predict_view_list");
        }
        if (result.dismiss === 'cancel') {
            console.log('request cancelled');
        }
    })
};




/* Load Price Prediction Contest based on weekly/monthly */
function getPredictSymbolId(event) {
    event.preventDefault();
    var contestPredictId = document.getElementById("predictionContestId").value;
    var innerContent = document.getElementById("du_predict_symbol_container");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<div id="du_predict_symbol_container"></div>`;
    info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_predict_symbol_list" },
                    { "htmlContainerId": "du_predict_symbol_container" },
                    { "requestType": "GET" },
                    { "data": [] },
                    { "urlParam": "" },
                    { "customeStyles": [] }
                ]
            },
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    info_predict_widget_urls = [];
    info_predict_widget_urls = [
        { "slug": "du_predict_symbol_list", "url": duPredictBaseUrl + "/api/v1/predict/contests/active/" + contestPredictId }
    ];
    loadInfoJsWidget(info_widgets_config_data);
};


// LeaderBoard Right Side
function predictLeaderBoardHTML(response) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    response.forEach((data, index) => {
        insideLoopHTML += `<tr> <td>` + displayIndex(index) + `</td><td>` + data.name + `</td><td>` + data.price + `</td><td>` + data.time + `</td></tr>`
    });
    outputHtmlString = `<img src="assets/images/du-predict-leader-right-icon.svg" width="30px" class="du-predict-leader-btn-paginate">
    <img src="assets/images/du-predict-leader-left-icon.svg" width="30px" class="du-predict-leader-btn-paginate du-mr-2"><h4 class="main-color du-mb-3">Leader Board <span>
    (ETEL)</span></h4><div class="du-predict-leader-overflow"><table class="du-table du-table-hover du-predict-leader-table"> <thead> <tr> <th class="main-color">Rank</th>
    <th class="main-color">Name</th> <th class="main-color">Price</th> <th class="main-color">Time</th> </tr></thead> <tbody> ` + insideLoopHTML + ` </tbody> </table></div>`;
    return outputHtmlString;
};