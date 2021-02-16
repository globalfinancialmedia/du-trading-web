const info_mubasher_widget_urls = [
    { "slug": "du_top_news", "url": "http://localhost:8183/api/news" },
    { "slug": "du_most_read", "url": "http://localhost:8183/api/news" },
    { "slug": "du_press_release", "url": "http://localhost:8183/api/news" },
    { "slug": "du_international_market", "url": "http://localhost:8183/api/news" },
    { "slug": "du_arab_market", "url": "http://localhost:8183/api/news" },
    { "slug": "du_islamic_finance", "url": "http://localhost:8183/api/news" },
    { "slug": "du_news_exclusive", "url": "http://localhost:8183/api/news" },
    // Du News View
    { "slug": "du_related_news", "url": "http://localhost:8183/api/news" },
    // Du News View Listing
    { "slug": "du_news_view_listing", "url": "http://localhost:8183/api/news" },
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
    if (widgetSlug === "du_top_news") {
        return topNewsHomeHTML(reqDataObject);
    } else if (widgetSlug === "du_most_read") {
        return mostReadNewsHTML(reqDataObject);
    } else if (widgetSlug === "du_press_release") {
        return pressReleaseNewsHTML(reqDataObject);
    } else if (widgetSlug === "du_international_market") {
        return internationalMarketHTML(reqDataObject);
    } else if (widgetSlug === "du_arab_market") {
        return arabMarketNewsHTML(reqDataObject);
    } else if (widgetSlug === "du_islamic_finance") {
        return islamicFinanceNewsHTML(reqDataObject);
    } else if (widgetSlug === "du_news_exclusive") {
        return exclusiveNewsHomeHTML(reqDataObject);
    } else if (widgetSlug === "du_related_news") {
        return relatedViewNewsHTML(reqDataObject);
    } else if (widgetSlug === "du_news_view_listing") {
        return newsListingViewNewsHTML(reqDataObject);
    } else if (widgetSlug === "market_snapshot") {
        return '<div class="d-flex gray-border mb-2 mt-4 coun-ls-gcc">marketSNapShot Data is in console</div>';
    }
};

/* Top News DU */
function topNewsHomeHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += ` <div class="du-col-md-6"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
            <h5 class="title-img-description">` + data.title + `</h5><hr>
            </div>`
    });
    outputHtmlString = `<a href="news-view.html" class="lnd-tp-news lnd-tp-news-des">
        <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-main-banner.png"><span class="lnd-tp-news-title font35 ff-hel-b text-white">
        Egypt runs first return flight for workers stranded in Kuwait</span>
        <span class="lnd-tp-news-time font14 text-white">Markets - 10 minutes ago</span></a><div class="du-row du-mt-3">
        <a href="news-view.html" class="lnd-tp-news lnd-tp-news-mob">
        <span class="lnd-tp-news-title font35 ff-hel-b text-white">Egypt runs first return flight for workers stranded in Kuwait</span>
        <span class="lnd-tp-news-time font14 text-white">Markets - 10 minutes ago</span><img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-main-banner.png"></a>` + insideLoopHTML + `</div>`;
    return outputHtmlString;
}

/* Exclusive News DU */
function exclusiveNewsHomeHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="du-col-md-4"><img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-mubasher-exclusive.png">
        <smal class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h5 class="title-img-description">` + data.title + `</h5><hr></div>`
    });
    outputHtmlString = `<h4 class="exclusive-heading mt70">Mubasher Exclusive</h4><a href="#" class="view-all-text">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row">` + insideLoopHTML + `</div>`;
    return outputHtmlString;
}

/* Islamic Finance News DU */
function islamicFinanceNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="isl-fi-news-wrap du-col-sm-4" style="margin-bottom:25px;"><div class="du-row"><div class="du-col-sm-4">
        <img class="du-img-fluid du-w-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e.png" alt=""></div><div class="du-col-sm-8">
        <small>Markets - <span>10 minutes ago</span></small><h6>Egypt runs first return flight for workers stranded in Kuwait</h6></div></div></div>`
    });
    outputHtmlString = `<h4 class="exclusive-heading">Islamic Finance</h4><a href="#" class="view-all-text">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><hr><div class="du-row">` + insideLoopHTML + `<div class="du-col-12"><hr></div></div>`;
    return outputHtmlString;
}

/* Arab Market News DU */
function arabMarketNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="isl-fi-news-wrap du-col-sm-4"><img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png" alt="">
        <div class="clearfix du-mt-3"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h6 class="title-img-description">` + data.title + `</h6></div><hr></div>`
    });
    outputHtmlString = `<h4 class="exclusive-heading">Arab Market</h4><a href="#" class="view-all-text">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row du-mt-2">` + insideLoopHTML + `</div>`;
    return outputHtmlString;
}

/* International Market News DU */
function internationalMarketHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="du-row"><div class="du-col-md-4"><img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png"></div>
        <div class="du-col-md-8 du-mt-4"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h5 class="title-img-description">` + data.title + `</h5><p>` + data.body + `</p></div></div><hr>`
    });
    outputHtmlString = `<h4 class="exclusive-heading">International Market</h4><a href="news-listing.html" class="view-all-text">See all<img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a>` + insideLoopHTML;
    return outputHtmlString;
}

/* Press Release DU */
function pressReleaseNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="press-rel-news">
        <small class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h5 class="title-img-description mb-3">` + data.title + `</h5></div><hr>`
    });
    outputHtmlString = `<h4 class="exclusive-heading">Press Release</h4><a href="news-listing.html" class="view-all-text">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row">
    <div class="du-col-md-4"><img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/ccb89c0d02e8fdcc7cfdb45678d7395f.png"></div>
    <div class="du-col-md-8">` + insideLoopHTML + `</div></div>`;
    return outputHtmlString;
}

/* Most Read News DU */
function mostReadNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="du-row">
        <div class="du-row ml-1"><div class="du-col-sm-4 col-3 pr-0 d-flex flex-wrap align-content-center">
        <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-3.png"></div><div class="du-col-sm-8 col-9">
        <div class="most-read-news-title">` + data.title + `</div></div><div class="du-col-12"><hr></div>
        </div></div>`
    });
    outputHtmlString = `<h4 class="font26">Most Read</h4><hr>` + insideLoopHTML + `<div class="du-col-sm-12 text-center">
    <a href="#" class="main-color ff-hel-b">View More<span><img src="https://du-widget.herokuapp.com/assets/images/path-392.svg" alt=""></span></a></div>`;
    return outputHtmlString;
}



/* DU News View */

/* Related News DU */
function relatedViewNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="du-row"><div class="du-col-sm-4 ml-5">
        <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-1.png" alt="">
        </div><div class="du-col-sm-8"><small>Markets - <span>10 minutes ago</span></small><br><br><h4 class="news-title">
        <a href="#">` + data.title + `</a></h4>
        <p>` + data.body + `</p></div></div><hr>`
    });
    outputHtmlString = `<h4>Related News</h4><hr>` + insideLoopHTML;
    return outputHtmlString;
}



/* DU News Listing View */

/* Listing View News DU */
function newsListingViewNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="du-row"><div class="du-col-sm-4">
        <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-1.png" alt="">
        </div><div class="du-col-sm-8 du-mt-4"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h4 class="title-news-description">` + data.title + `</h4><p>` + data.body + `</p></div>
        <div class="du-col-12"><hr></div></div>`
    });
    outputHtmlString = `<h1 class="main-news-title du-mt-4">Banking</h1><div class="du-row"><div class="du-col-sm-6">
    <div class="news-inner"><a href="news-view.html"><div class="bg-clr-fr-news d-flex flex-wrap align-content-center">
    <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/Image%2056.png" alt=""></div></a><div class="clearfix du-mt-3">
    <small class="title-under-img">Markets - <span>10 minutes ago</span></small><h3 class="title-img-description">
    <a class="title-img-description txt-black" href="news-view.html"> Egypt runs first return flight for workers stranded in Kuwait</a></h3></div></div></div>
    <div class="du-col-sm-6"><div class="news-inner"><img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/Image%2056.png" alt="">
    <div class="clearfix du-mt-3"><small class="title-under-img">Markets - <span>10 minutes ago</span></small><h3 class="title-img-description">
    Egypt runs first return flight for workers stranded in Kuwait</h3></div></div></div></div>` + insideLoopHTML;
    return outputHtmlString;
}