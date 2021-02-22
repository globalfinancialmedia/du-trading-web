const info_mubasher_widget_urls = [
    { "slug": "du_top_news", "url": "http://localhost:8183/api/news" },
    { "slug": "du_most_read", "url": "http://localhost:8183/api/news" },
    { "slug": "du_press_release", "url": "http://localhost:8183/api/news" },
    { "slug": "du_international_market", "url": "http://localhost:8183/api/news" },
    { "slug": "du_international_market",  "url": "http://localhost:8183/api/news" },
    { "slug": "du_arab_market", "url": "http://localhost:8183/api/news" },
    { "slug": "du_islamic_finance", "url": "http://localhost:8183/api/news" },
    { "slug": "du_news_exclusive", "url": "http://localhost:8183/api/news" },
    // Du News View
    { "slug": "du_related_news", "url": "http://localhost:8183/api/news" },
    // Du News View Listing
    { "slug": "du_news_view_listing", "url": "http://localhost:8183/api/news" },
    { "slug": "du_news_view_listing","url": "http://localhost:8183/api/news" },
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
        return '<div class="d-flex gray-border mb-2 mt-4 coun-ls-gcc">market Snapshot Data is in console</div>';
    }
};

/* Top News DU */
function topNewsHomeHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += ` <div class="du-col-md-6"><a href="#" onClick="viewDuNewsPage();"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
            <h5 class="title-img-description">` + data.title + `</h5></a><hr>
            </div>`
    });
    outputHtmlString = `<a href="news-view.html" class="lnd-tp-news lnd-tp-news-des">
        <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-main-banner.png"><span class="lnd-tp-news-title font35 ff-hel-b du-text-white">
        Egypt runs first return flight for workers stranded in Kuwait</span>
        <span class="lnd-tp-news-time font14 du-text-white">Markets - 10 minutes ago</span></a><div class="du-row du-mt-3">
        <a href="news-view.html" class="lnd-tp-news lnd-tp-news-mob">
        <span class="lnd-tp-news-title font35 ff-hel-b du-text-white">Egypt runs first return flight for workers stranded in Kuwait</span>
        <span class="lnd-tp-news-time font14 du-text-white">Markets - 10 minutes ago</span>
        <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-main-banner.png"></a>` + insideLoopHTML + `</div>`;
    return outputHtmlString;
}

/* Exclusive News DU */
function exclusiveNewsHomeHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage();">
        <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-mubasher-exclusive.png">
        <small class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h5 class="title-img-description">` + data.title + `</h5></a><hr></div>`
    });
    outputHtmlString = `<h4 class="exclusive-heading mt70">Mubasher Exclusive</h4><a href="#" class="view-all-text" onClick="duListingNewsPage(this.id, event);">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row">` + insideLoopHTML + `</div>`;
    return outputHtmlString;
}

/* Islamic Finance News DU */
function islamicFinanceNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="isl-fi-news-wrap du-col-sm-4" style="margin-bottom:25px;"><div class="du-row"><div class="du-col-sm-4">
        <a href="#" onClick="viewDuNewsPage();"><img class="du-img-fluid du-w-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e.png" alt="">
        </div><div class="du-col-sm-8"><small>Markets - <span>10 minutes ago</span></small>
        <h6>Egypt runs first return flight for workers stranded in Kuwait</h6></a></div></div></div>`
    });
    outputHtmlString = `<h4 class="exclusive-heading">Islamic Finance</h4><a href="#" class="view-all-text" onClick="duListingNewsPage(this.id, event);">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><hr><div class="du-row">` + insideLoopHTML + `<div class="du-col-12"><hr></div></div>`;
    return outputHtmlString;
}

/* Arab Market News DU */
function arabMarketNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="isl-fi-news-wrap du-col-sm-4"><a href="#" onClick="viewDuNewsPage();">
        <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png" alt="">
        <div class="clearfix du-mt-3"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h6 class="title-img-description">` + data.title + `</h6></div></a><hr></div>`
    });
    outputHtmlString = `<h4 class="exclusive-heading">Arab Market</h4><a href="#" class="view-all-text" onClick="duListingNewsPage(this.id, event);">See all
    <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row du-mt-2">` + insideLoopHTML + `</div>`;
    return outputHtmlString;
}

/* International Market News DU */
function internationalMarketHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="du-row"><div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage();">
        <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png"></div>
        <div class="du-col-md-8 du-mt-4"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h5 class="title-img-description">` + data.title + `</h5><p>` + data.body + `</p></a></div></div><hr>`
    });
    outputHtmlString = `<h4 class="exclusive-heading">International Market</h4><a href="#" class="view-all-text" onClick="duListingNewsPage(this.id, event);">See all<img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a>` + insideLoopHTML;
    return outputHtmlString;
}

/* Press Release DU */
function pressReleaseNewsHTML(responseDataObj) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<a href="#" onClick="viewDuNewsPage();"><div class="press-rel-news">
        <small class="title-under-img">Markets - <span>10 minutes ago</span></small>
        <h5 class="title-img-description mb-3">` + data.title + `</h5></div></a><hr>`
    });
    outputHtmlString = `<h4 class="exclusive-heading">Press Release</h4><a href="#" class="view-all-text" onClick="duListingNewsPage(this.id, event);">See all
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




/* Du Page Redirection */

function duListingNewsPage(element_id, event) {

    event.preventDefault(); 
    event.stopPropagation();
    event.stopImmediatePropagation();

    var idfff = element_id;
    info_widgets_config_data.widgets.forEach(removeAddWidgetSection);
    function removeAddWidgetSection(config_data) {
        if(config_data.widget_config[1].htmlContainerId==="du_news_view_container"){

         var duNewsViewContainer = document.getElementById(config_data.widget_config[1].htmlContainerId);
         duNewsViewContainer.removeAttribute("style");
                let widgetSlug = config_data.widget_config[0].widgetSlug;
                let info_req_headers = {};
                info_req_headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, info_req_headers);
                info_req_headers = Object.assign({ "authorization": info_widgets_config_data.authToken }, info_req_headers);
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
                    // console.log(info_req_headers+
                    //     config_data.widget_config[3].data[0]+
                    //     apiUrlObj.url+
                    //     config_data.widget_config[4].urlParam+
                    //     config_data.widget_config[2].requestType+config_data.widget_config[1].htmlContainerId+config_data.widget_config[5].customeStyles+ widgetSlug //widget identifier
                    //     );
                    //return newsListingViewNewsHTML();

                }
        }else{
            var selectedElement = document.getElementById(config_data.widget_config[1].htmlContainerId);
            if(selectedElement!==null)
            selectedElement.remove()
        }
    }

    // document.body.innerHTML = "";
    // document.body.innerHTML = `<main><section class="banking du-mb-5"><div class="du-container container-section">
    // <div class="du-row"><div class="du-col-sm-12 news-left-col"><br><a href="#" class="back-btn-du" onClick="duNewsSummaryPage();">Back to Du News Summary</a>
    // <div id="du_news_view_container"></div></div></div></div></section></main>`
    // var info_widgets_config_data = {
    //     "widgets": [
    //         {
    //             "widget_config": [
    //                 { "widgetSlug": "du_news_view_listing" },
    //                 { "htmlContainerId": "du_news_view_container" },
    //                 { "requestType": "GET" },
    //                 { "data": [{ "selected_country": "sa" }] },
    //                 { "urlParam": "du_news_listing" },
    //                 { "customeStyles": [] }
    //             ]
    //         },
    //     ],
    //     authToken:
    //         "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    // };
    // loadInfoJsWidget(info_widgets_config_data);
}

function viewDuNewsPage() {
    document.body.innerHTML = "";
    document.body.innerHTML = `<div id="du_news_view_page"><div class="du-container du-mt-5">
    <div class="du-row"><div class="du-col-md-12 news-left-col"><a href="#" class="back-btn-du" onClick="duNewsSummaryPage();">Back to Du News Summary</a>
    <div id="du_related_news_container"></div></div></div></div></div>`
    var info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_related_news" },
                    { "htmlContainerId": "du_related_news_container" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "sa" }] },
                    { "urlParam": "du_news_view" },
                    { "customeStyles": [] }
                ]
            }
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    loadInfoJsWidget(info_widgets_config_data);
}

function duNewsSummaryPage() {
    document.body.innerHTML = "";
    document.body.innerHTML = `<main><div id="du_news_page"><div class="du-container-fluid container-fluid-pd du-mt-5"><section>
    <div class="du-row"><div class="du-col-md-9"><div id="du_top_container_news"></div></div><div class="du-col-md-3 stocks-sidebar">
    <div id="du_most_read_container_news"></div></div></div></section><section><div class="du-row"><div class="du-col-md-12">
    <div id="du_exclusive_news_container"></div></div></div></section><section><div class="du-row du-mt-5"><div class="du-col-md-12">
    <div id="du_ismalic_finance_container"></div></div></div></section><section><div class="du-row du-mt-5"><div class="du-col-md-12">
    <div id="du_arab_market_container"></div></div></div></section><section><div class="du-row mt70"><div class="du-col-md-12">
    <div id="du_international_market_container"></div></div></div></section><section><div class="du-row mt70 du-mb-5"><div class="du-col-md-12">
    <div id="du_press_container_release"></div></div></div></section></div></div></main>`
    var info_widgets_config_data = {
        "widgets": [{
            "widget_config": [
                { "widgetSlug": "du_top_news" },
                { "htmlContainerId": "du_top_container_news" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "du_news" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_most_read" },
                { "htmlContainerId": "du_most_read_container_news" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "du_news" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_press_release" },
                { "htmlContainerId": "du_press_container_release" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "du_news" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_international_market" },
                { "htmlContainerId": "du_international_market_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "du_news" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_arab_market" },
                { "htmlContainerId": "du_arab_market_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "du_news" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_islamic_finance" },
                { "htmlContainerId": "du_ismalic_finance_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "du_news" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_news_exclusive" },
                { "htmlContainerId": "du_exclusive_news_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "du_news" },
                { "customeStyles": [] }
            ]
        },
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    loadInfoJsWidget(info_widgets_config_data);
}


/* DU News View */

/* Related News DU */
function relatedViewNewsHTML(responseDataObj) {
    // $('#du_news_listing_page').css('display', 'none');
    // $('#du_news_page').css('display', 'none');
    let outputHtmlString = "";
    let insideLoopHTML = "";
    responseDataObj.articles.forEach(data => {
        insideLoopHTML += `<div class="du-row"><div class="du-col-sm-4 ml-5">
        <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-1.png" alt="">
        </div><div class="du-col-sm-8"><small>Markets - <span>10 minutes ago</span></small><br><br><h4 class="news-title">
        <a href="#">` + data.title + `</a></h4>
        <p>` + data.body + `</p></div></div><hr>`
    });
    outputHtmlString = `<h1>Egypt runs first return flight for workers stranded in Kuwait</h1>
    <img class="du-img-fluid du-mb-4 width-100" src="./assets/images/Group 1062.png" alt=""><div class="du-row"><div class="du-col-md-6">
    <p class="du-mb-4">Committed investments in the GCC region increased by 2.3% </p></div><div class="du-col-md-6">
    <small class="pull-right">Markets - <span>10 minutes ago</span></small></div></div><div class="du-row"><div class="du-col-sm-12">
    <p>Mubasher: The Arab Petroleum Investments Corporation (APICORP) estimates that planned and committed investments in the Middle East and North Africa 
    (MENA) region will exceed $792 billion over the next five years from 2020 to 2024.</p><p>The estimated value marks a $173 billion decline from last year’s 
    estimation, which is mostly in planned investments due to what APICORP calls the 2020 triple crisis.</p><p>The triple crisis is referring to the 
    coronavirus (COVID-19) pandemic and its related health crisis, coupled with the oil crisis and the looming financial crisis, according to the 
    MENA Energy Investment Outlook 2020-2024.</p><p>However, the outlook report mentioned that despite the difficulties, committed investments in 
    the GCC region increased by 2.3% compared to a 6% overall decrease in the entire MENA region.</p>
    <img class="du-img-fluid mb-3 du-d-block du-mx-auto" src="./assets/images/image-49.png" alt="">
    <p>In addition, the report referred to the current dilemma in dealing with the consequences of the COVID-19 pandemic, emphasizing that the resumption of 
    travel and trade will require international coordination.</p><p>APICORP estimates the price of Brent crude oil to average $30-40 in 2020 and 2021 before 
    reflecting a more balanced market.</p><p>As for the financial crisis, the report noted that stimulus plans could create enormous unproductive debt that 
    could negatively impact economic growth.</p><p>“The nature of this triple crisis and the profound restructuring in oil and gas will hit energy investments 
    for a potentially long period of time, sowing the seeds of supply crunches and price volatility. Therefore, we expect a W-shaped recovery for the MENA 
    region,” said Ahmed Ali Attiga, CEO of APICORP.</p><p>Attiga further noted that despite the positive effects of digitization and automation on 
    efficiencies across the value chains, many fundamental questions remain, which will negatively affect investments.</p><p>“International 
    collaboration between the private and public sector will, therefore, be critical to counter the expected shortfalls in investment,” the CEO added.</p>
    <p>APICORP expects “a restructuring of the value chain, thus putting the strongest countries and companies from a total cost and leverage 
    standpoint in the best position to preserve their long-term value proposition and return to their respective shareholders,” according 
    to Leila R Benali, Chief Economist, Head of Strategy, Energy Economics and Sustainability of APICORP.</p></div></div><h4>Related News</h4><hr>` + insideLoopHTML;
    return outputHtmlString;
}



/* DU News Listing View */

/* Listing View News DU */
function newsListingViewNewsHTML(responseDataObj) {
    // $('#du_news_view_page').css('display', 'none');
    // $('#du_news_page').css('display', 'none');
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