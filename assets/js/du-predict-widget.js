var info_predict_widget_urls = [
    { "slug": "du_predict_symbol_list", "url": "http://52.31.246.107:8086/du/api/du/symbols" },
    { "slug": "du_predict_time_zone", "url": "http://52.31.246.107:8086/du/prediction/symbols/1" },
    { "slug": "du_make_prediction_widget", "url": "http://52.31.246.107:8086/du/contest/postPrediction/120" },
    { "slug": "du_predict_leader_board", "url": "http://52.31.246.107:8086/du/prediction/getLeaderBoard" },
    { "slug": "du_predict_view_list", "url": "http://52.31.246.107:8086/du/prediction/getPredictionList" }
];


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
    console.log('body', body);
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
            console.log('response', response);
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
    let insideLoopHTML = "";
    let insideSelectorLoopHTML = "";
    response.forEach(data => {
        insideLoopHTML += `<option value=` + data.id + `>` + data.name + `</option>`
    });
    // response.forEach(data => {
    //     insideSelectorLoopHTML += `<option value=` + data.id + `>` + data.code + `</option>`
    // });
    if(!response){
        var img = '<img src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/dropdown-down-arrow.svg" class="du-predict-down-arrow">';
    } else {
        var img = '<img src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/dropdown-up-arrow.svg" class="du-predict-up-arrow">';
    }
    outputHtmlString = `<h3 class="main-color">Price Prediction Contest</h3> <p>Participate by submitting your price and win $10 to $50.<a href="#" class="main-color du-ml-2">Learn More</a></p>
    <div class="du-row"><div class="du-col-md-8"> <h3 class="main-color">Symbol of the week</h3><p>Valid till Sunday 17 2020 at 4:00PM</p></div><div class="du-col-md-4 du-mt-2">
    <select class="du-form-control du-form-control-sm" aria-label=".form-select-sm example" onChange="getPredictSymbolId(event)"> <option selected>Select Symbol</option>` + insideLoopHTML + `</select></div>
    <div class="du-col-md-8"><img src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/du-predict-logo.png"> </div><div class="du-col-md-4">
    <h5 class="du-d-inline">14.56</h5>` + img + `</div></div>`;
    return outputHtmlString;
};

/* Load the Symbols Based Statistics */
function getPredictSymbolId(event) {
    event.preventDefault();
    var innerContent = document.getElementById("du_predict_time_container_zone");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<div id="du_predict_time_container_zone"></div>`;
    var info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_predict_time_zone" },
                    { "htmlContainerId": "du_predict_time_container_zone" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "" }] },
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
        { "slug": "du_predict_time_zone", "url": "http://52.31.246.107:8086/du/prediction/symbols/" + event.target.value }
    ];
    loadInfoJsWidget(info_widgets_config_data);
}

/* Stock Statistics based on symbol selection */
function predictTimeZoneHTML(response) {
    var data = "";
    if (response.response.docs[0]) {
        var data = response.response.docs[0];
    }
    let outputHtmlString = "";
    outputHtmlString = ` <div class="du-row du-mt-5"> <div class="du-col-md-6 "> <table class="du-table table-even table-hover"> <tbody> <tr> <td colspan="2">Open</td>
    <td>` + data.OPEN_PRICE + `</td></tr><tr> <td colspan="2">Previous Close</td><td>` + data.PREV_CLOSED + `</td></tr><tr> <td colspan="2">High</td><td>` + data.HIGH_PRICE + `</td></tr><tr>
    <td colspan="2">Low</td><td>` + data.LOW_PRICE + `</td></tr></tbody> </table> </div><div class="du-col-md-6"> <table class="du-table table-even table-hover"> <thead>
    <tr> <th colspan="2">Stock Statistics</th> </tr></thead> <tbody> <tr> <td>Volume</td><td>` + data.VOLUME + `</td></tr><tr> <td>Key</td><td>` + data.KEY + `</td>
    </tr></tbody> </table> <small>All the information is with 10 minutes delay</small> </div></div>`;
    return outputHtmlString;
};

function predictListViewHTML(response) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    response.forEach(data => {
        insideLoopHTML += `<tr><td>` + data.symbol + `</td><td>` + data.status + `</td><td>` + data.prediction + `</td><td>` + data.price + `</td><td>` + data.date + `
        </td><td> first </td><td> second</td></tr>`
    });
    outputHtmlString = `<h2 class="main-color">Prediction List</h2> <div style="margin-bottom:20px;" class="du-row "> <div class="du-col-md-2"> <label>Symbol</label>
    <input type="text" class="du-form-control" placeholder="All"> </div><div class="du-col-md-2"> <label>Status</label> <input type="text" class="du-form-control" 
    placeholder="All"> </div><div class="du-col-md-2"> <label>Date</label> <input type="text" class="du-form-control" placeholder="Date"> </div><div class="col-md-4 du-mt-2">
    <button class="du-btn du-btn-primary du-mt-3 du-pl-4 du-pr-4 du-pt-2" type="button" data-toggle="dropdown">Filter</button> </div></div><div class="du-predict-list-overflow"><table class="du-table du-table-bordered 
    table-right du-table-hover"> <thead><tr><th>Symbol</th> <th>Status</th> <th>Prediction</th> <th>Price</th> <th>Date</th><th></th> <th></th> </tr></thead> 
    <tbody> ` + insideLoopHTML + ` </tbody> </table></div>`;
    return outputHtmlString;
};

function predictLeaderBoardHTML(response) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    response.forEach((data, index) => {
        insideLoopHTML += `<tr> <td>` + index + `</td><td>` + data.name + `</td><td>` + data.price + `</td><td>` + data.time + `</td></tr>`
    });
    outputHtmlString = ` <h3 class="main-color">Leader Board <span>(ETEL)</span></h3><div class="du-predict-leader-overflow"><table class="du-table du-table-bordered table-right du-table-hover"> <thead> <tr> <th>Rank</th>
    <th>Name</th> <th>Price</th> <th>Rank</th> </tr></thead> <tbody> ` + insideLoopHTML + ` </tbody> </table></div>`;
    return outputHtmlString;
};

function makePredictionListHTML(response) {
    let outputHtmlString = "";
    outputHtmlString = `<div class="du-row du-mb-4"> <div class="du-col-md-7"> <input type="text" class="du-form-control" id="exampleInputPredication" 
    aria-describedby="pr" placeholder="Enter Predication Price"> </div><div class="du-col-md-5"><button class="du-btn du-btn-primary du-pt-2" type="button" onClick="getPost(event)">
    Submit Your Prediction</button> </div></div>`;
    return outputHtmlString;
};


function getPost(event) {
    event.preventDefault();
    var getPredictionVal = document.getElementById("exampleInputPredication").value;
    var innerContent = document.getElementById("du_make_prediction_container_widget");
    innerContent.innerHTML = "";
    var info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_make_prediction_widget" },
                    { "htmlContainerId": "du_make_prediction_container_widget" },
                    { "requestType": "POST" },
                    {
                        "data": [
                            {
                                "id": 23,
                                "from_date": "2021-02-20T00:00:00.000+00:00",
                                "to_date": "2021-02-27T00:00:00.000+00:00",
                                "result_date": "2021-03-01T00:00:00.000+00:00",
                                "symbol": {
                                    "id": 2
                                }
                            }
                        ]
                    },
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
        { "slug": "du_make_prediction_widget", "url": "http://52.31.246.107:8086/du/contest/postPrediction/120" },
    ];
    loadInfoJsWidget(info_widgets_config_data);
}