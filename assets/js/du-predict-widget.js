const info_mubasher_widget_urls = [
    { "slug": "du_leader_board", "url": "http://52.31.246.107:8086/du/prediction/getLeaderBoard" }
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
    if (widgetSlug == "du_symbols_list") {
        return symbolListHTML(reqDataObject)
    } else if (widgetSlug === "du_leader_board") {
        return leaderBoardListHTML(reqDataObject);
    } else if (widgetSlug === "du_make_prediction") {
        return makePredictionHTML(reqDataObject);
    } else if (widgetSlug === "du_leaderboard") {
        return leaderboardHTML(reqDataObject);
    } else if (widgetSlug === "market_snapshot") {
        return '<div class="d-flex gray-border mb-2 mt-4 coun-ls-gcc">market Snapshot Data is in console</div>';
    }
};


/* Symbol of the week DU predict */
function symbolListHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    console.log("test" + JSON.stringify(responseDataObj));
    //responseDataObj.apiUrlObj.forEach(data => {
    insideLoopHTML += `<div class="du-container"><div class="du-row blog-row"> <div class="du-col-md-6"> <h1>Price Prediction Contest</h1><p>Participate by 
    submitting your price and win $10 to $50.<a href="#">Learn More</a></p><div class="du-row"> <div class="du-col-md-8"> <h2>Symbol of the week</h2>
    <p>Valid till Sunday 17 2020 at 4:00PM</p></div><div class="du-col-md-4-mt-3"> <div class="du-dropdown"> <button class="du-btn-primary du-dropdown-toggle" 
    type="button" data-toggle="du-dropdown">Symbol <span class="caret"></span></button> <ul class="du-dropdown-menu"> <li><a href="#">ETEL1</a></li><li><a href="#">
    ETEL2</a></li><li><a href="#">ETEL2</a></li></ul> </div></div><div class="du-col-md-8"> <img src="./assets/images/logo.png"> </div><div class="du-col-md-4">
    <div class="du-dropdown"> <button class="du-btn btn-primary du-dropdown-toggle" type="button" data-toggle="du-dropdown">12.02 <span class="caret"></span></button>
    </div></div></div><div class="du-row mt-5"> <div class="du-col-md-6 "> <table class="du-table table-even table-hover"> <tbody> <tr> <td colspan="2">Open</td>
    <td>12.09</td></tr><tr> <td colspan="2">Previous Close</td><td>13.09</td></tr><tr> <td colspan="2">High</td><td>13.11</td></tr><tr> <td colspan="2">Low</td>
    <td>12.9</td></tr></tbody> </table> </div><div class="du-col-md-6"> <table class="du-table table-even table-hover"> <thead> <tr> <th colspan="2">Stock Statistics</th>
    </tr></thead> <tbody> <tr> <td>Volume</td><td>1,376,699</td></tr><tr> <td>Volume</td><td>1,376,699</td></tr></tbody> </table> <small>All the information is with 
    10 minutes delay</small> </div></div>`
    outputHtmlString = `<h4 class="exclusive-heading mt70">Mubasher Exclusive</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row">` + insideLoopHTML + `</div>`;
    return outputHtmlString;
}



/* Prediction list DU predict*/
function leaderBoardListHTML(responseDataObj) {
    console.log(responseDataObj);
    let outputHtmlString = "";
    let insideLoopHTML = "";
    let counter = 0;
    responseDataObj.forEach(data => {
        counter++;
        let getTimeStamp = new Date(data.time).getTime();
        let getMinutes = new Date(data.time).getMinutes();
        let getHours = new Date(data.time).getHours();
        let getDate = new Date(getTimeStamp).getDate();
        let getDay = new Date(getTimeStamp).getDay();
        let getMonth = new Date(data.time).getMonth() + 1;
        if (getMinutes < 10) {
            getMinutes = "0" + getMinutes;
        }
        if (getDate < 10) {
            getDate = "0" + getDate;
        }
        if (getMonth < 10) {
            getMonth = "0" + getMonth;
        }
        let ampm = "AM";
        if (getHours > 12) {
            getHours -= 12;
            ampm = "PM";
        }
        if (getDay === 0) {
            getDay = "Sun";
        } else if (getDay === 1) {
            getDay = "Mon";
        } else if (getDay === 2) {
            getDay = "Tue";
        } else if (getDay === 3) {
            getDay = "Wed";
        } else if (getDay === 4) {
            getDay = "Thu";
        } else if (getDay === 5) {
            getDay = "Fri";
        } else if (getDay === 6) {
            getDay = "Sat";
        }
        let getYear = new Date(data.time).getFullYear();
        insideLoopHTML += `
        <tr>
        <td>` + counter + `</td>
        <td>` + data.name + `</td>
        <td>` + data.price + `</td>
        <td>` + getDay + ` ` + getDate + `/` + getMonth + ` ` + getHours + `:` + getMinutes + ampm + `</td>
      </tr>
      `
    });
    outputHtmlString = `<h2>Leader Board <span>(ETEL)</span></h2> <table class="du-table table-right table-hover"> <thead> <tr> <th>Rank</th> <th>Name</th> 
    <th>Price</th> <th>Rank</th> </tr></thead> <tbody>  ` + insideLoopHTML + `</tbody></table>`;
    return outputHtmlString;
}

/* make prediction DU predict */
function makePredictionHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    // responseDataObj.json.forEach(data => {
    //     insideLoopHTML += `<div class="du-row"><div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
    //     <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png"></div>
    //     <div class="du-col-md-8 du-mt-4"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
    //     <h5 class="title-img-description">` + data.title + `</h5><p>` + data.body + `</p></a></div></div><hr>`
    // });
    outputHtmlString = `<h4 class="exclusive-heading">International Market</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all<img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a>` + insideLoopHTML;
    return outputHtmlString;
}

/* leaderboard  DU predict */
function leaderboardHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    // responseDataObj.json.forEach(data => {
    //     insideLoopHTML += `<a href="#" onClick="viewDuNewsPage('summaryPage', event);"><div class="press-rel-news">
    //     <small class="title-under-img">Markets - <span>10 minutes ago</span></small>
    //     <h5 class="title-img-description mb-3">` + data.title + `</h5></div></a><hr>`
    // });
    outputHtmlString = `<h4 class="exclusive-heading">Press Release</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row">
    <div class="du-col-md-4"><img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/ccb89c0d02e8fdcc7cfdb45678d7395f.png"></div>
    <div class="du-col-md-8">` + insideLoopHTML + `</div></div>`;
    return outputHtmlString;
}