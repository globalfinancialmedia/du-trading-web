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
        return '<div class="d-flex gray-border mb-2 mt-4 coun-ls-gcc">market Snapshot Data is in console</div>';
    }
};

/* Top News DU */
function topNewsHomeHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<div class="du-col-md-6"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
                <small class="title-under-img">Markets - <span>10 minutes ago</span></small><h5 class="title-img-description">` + data.title + `</h5></a><hr></div>`
            });
            outputHtmlString = `<a href="#" class="lnd-tp-news lnd-tp-news-des">
                <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-main-banner.png"><span class="lnd-tp-news-title font35 ff-hel-b du-text-white">
                Egypt runs first return flight for workers stranded in Kuwait</span>
                <span class="lnd-tp-news-time font14 du-text-white">Markets - 10 minutes ago</span></a><div class="du-row du-mt-3">
                <a href="#" class="lnd-tp-news lnd-tp-news-mob">
                <span class="lnd-tp-news-title font35 ff-hel-b du-text-white">Egypt runs first return flight for workers stranded in Kuwait</span>
                <span class="lnd-tp-news-time font14 du-text-white">Markets - 10 minutes ago</span>
                <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-main-banner.png"></a>` + insideLoopHTML + `</div>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<div class="du-col-md-6"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
                <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h5 class="title-img-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</h5></a><hr></div>`
            });
            outputHtmlStringAr = `<a href="#" class="lnd-tp-news"><img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-main-banner.png">
            <span class="lnd-tp-news-title ff-hel-b du-text-white">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</span>
            <span class="lnd-tp-news-time font14 du-text-white">قبل 3 ساعات</span></a><div class="du-row du-mt-3">` + insideLoopHTMLAr + `</div>`;
            return outputHtmlStringAr;
            break;
    }
}

/* Most Read News DU */
function mostReadNewsHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<div class="du-row">
                <div class="du-row ml-1"><div class="du-col-sm-4 col-3 pr-0 d-flex flex-wrap align-content-center">
                <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-3.png"></div><div class="du-col-sm-8 col-9">
                <p class="most-read-news-title">` + data.title + `</p></div><div class="du-col-12"><hr></div>
                </div></div>`
            });
            outputHtmlString = `<h4 class="font26 du-black-title">Most Read</h4><hr>` + insideLoopHTML + `<div class="du-col-sm-12 du-text-center">
            <a href="#" class="main-color ff-hel-b">View More<span><img src="https://du-widget.herokuapp.com/assets/images/path-392.svg" alt=""></span></a></div>`;
            return outputHtmlString;
        break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<div class="du-row"><div class="du-col-4">
                <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-2.png" alt="">
                </div><div class="du-col-8"><div class="sidebar-readmore-description">هو السيناريو الأكثر قسوة على المملكة ودول العالم، وهي أن تتخذ السعودية قراراً بإلغاء</div></div>
                <div class="du-col-12"><hr class="sidebar-hr"></div></div>`
            });
            outputHtmlStringAr = `<div class="most-read-news-list"><h4 class="sidebar-readmore-title">الأخبار الأكثر</h4>` + insideLoopHTMLAr + `<div class="du-row">
            <div class="du-col-sm-12 du-text-center du-mb-3"><a href="#" class="view-all-text main-color">عرض الكل <img class="pr-1 rotate90" 
            src="https://du-widget.herokuapp.com/assets/images/path-392.svg" alt=""></a></div></div></div>`;
            return outputHtmlStringAr;
        break;
    }
}

/* Exclusive News DU */
function exclusiveNewsHomeHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
                <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-mubasher-exclusive.png">
                <small class="title-under-img">Markets - <span>10 minutes ago</span></small>
                <h5 class="title-img-description">` + data.title + `</h5></a><hr></div>`
            });
            outputHtmlString = `<h4 class="exclusive-heading mt70">Mubasher Exclusive</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
            <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row">` + insideLoopHTML + `</div>`;
            return outputHtmlString;
        break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
                <img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/left-mubasher-exclusive.png">
                <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h5 class="title-img-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</h5></a><hr></div>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading mt70">حصرياً مباشر</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">اظهار الكل <img class="pr-1 rotate180" 
            src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row du-mt-3 du-mb-5">` + insideLoopHTMLAr + `</div>`;
            return outputHtmlStringAr;
        break;
    }
}

/* Islamic Finance News DU */
function islamicFinanceNewsHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<div class="isl-fi-news-wrap du-col-sm-4" style="margin-bottom:25px;"><div class="du-row"><div class="du-col-sm-4">
                <a href="#" onClick="viewDuNewsPage('summaryPage', event);"><img class="du-img-fluid du-w-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e.png" alt="">
                </div><div class="du-col-sm-8"><small>Markets - <span>10 minutes ago</span></small>
                <h6>Egypt runs first return flight for workers stranded in Kuwait</h6></a></div></div></div>`
            });
            outputHtmlString = `<h4 class="exclusive-heading">Islamic Finance</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
            <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><hr><div class="du-row">` + insideLoopHTML + `<div class="du-col-12"><hr></div></div>`;
            return outputHtmlString;
        break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<div class="isl-fi-news-wrap du-col-sm-4 du-mb-4"><div class="du-row"><div class="du-col-sm-4">
                <a href="#" onClick="viewDuNewsPage('summaryPage', event);"><img class="du-img-fluid w-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e.png" alt=""></div><div class="du-col-sm-8">
                <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h6 class="title-img-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام</h6></a></div></div></div>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading">اقتصاد إسلامي</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">اظهار الكل<img class="pr-1 rotate180" 
            src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><hr><div class="du-row">` + insideLoopHTMLAr + `<div class="du-col-12"><hr></div></div>`;
            return outputHtmlStringAr;
        break;
    }
}

/* Arab Market News DU */
function arabMarketNewsHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<div class="isl-fi-news-wrap du-col-sm-4"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
                <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png" alt="">
                <div class="clearfix du-mt-3"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
                <h6 class="title-img-description">` + data.title + `</h6></div></a><hr></div>`
            });
            outputHtmlString = `<h4 class="exclusive-heading">Arab Market</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
            <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row du-mt-2">` + insideLoopHTML + `</div>`;
            return outputHtmlString;
        break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<div class="isl-fi-news-wrap du-col-sm-4"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
                <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png" alt=""><div class="clearfix du-mt-3">
                <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span>
                </small><h6 class="title-img-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</h6>
                </div></a><hr></div>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading">الأسواق العربية</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">اظهار الكل<img class="pr-1 rotate180" 
            src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row du-mt-2">` + insideLoopHTMLAr + `</div>`;
            return outputHtmlStringAr;
        break;
    }
}

/* International Market News DU */
function internationalMarketHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<div class="du-row"><div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
                <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png"></div>
                <div class="du-col-md-8 du-mt-4"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
                <h5 class="title-img-description">` + data.title + `</h5><p>` + data.body + `</p></a></div></div><hr>`
            });
            outputHtmlString = `<h4 class="exclusive-heading">International Market</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all<img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a>` + insideLoopHTML;
            return outputHtmlString;
        break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<div class="du-row"><div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage', event);">
                <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/111.png">
                </div><div class="du-col-md-8"><small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h5 class="title-img-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</h5>
                <p>لكن لا بد أن أوضح لك أن كل هذه الأفكار المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل،
                 وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤلاء</p></a></div></div><hr>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading">الأسواق العالمية</h4><a href="#" onClick="duListingNewsPage('summaryPage', event);" 
            class="view-all-text">اظهار الكل <img class="pr-1 rotate180" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a>` + insideLoopHTMLAr;
            return outputHtmlStringAr;
        break;
    }   
}

/* Press Release DU */
function pressReleaseNewsHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<a href="#" onClick="viewDuNewsPage('summaryPage', event);"><div class="press-rel-news">
                <small class="title-under-img">Markets - <span>10 minutes ago</span></small>
                <h5 class="title-img-description mb-3">` + data.title + `</h5></div></a><hr>`
            });
            outputHtmlString = `<h4 class="exclusive-heading">Press Release</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
            <img class="pl-1" src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row">
            <div class="du-col-md-4"><img class="du-img-fluid" src="https://du-widget.herokuapp.com/assets/images/ccb89c0d02e8fdcc7cfdb45678d7395f.png"></div>
            <div class="du-col-md-8">` + insideLoopHTML + `</div></div>`;
            return outputHtmlString;
        break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<a href="#" onClick="viewDuNewsPage('summaryPage', event);"><div class="press-rel-news du-mt-3"><small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h5 class="title-img-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</h5></div></a><hr>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading">بيانات صحفية</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">اظهار الكل<img class="pr-1 rotate180" 
            src="https://du-widget.herokuapp.com/assets/images/path-487.svg" alt=""></a><div class="du-row"><div class="du-col-md-4"><img class="du-img-fluid" 
            src="https://du-widget.herokuapp.com/assets/images/ccb89c0d02e8fdcc7cfdb45678d7395f.png"></div><div class="du-col-md-8">` + insideLoopHTMLAr + `</div></div>`;
            return outputHtmlStringAr;
        break;
    }  
}


/* DU News View */

/* Related News DU */
function relatedViewNewsHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<div class="du-row"><div class="du-col-sm-4 ml-5">
                <a href="#" onClick="viewDuNewsPage('summaryPag1e', event);"><img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-1.png" alt="">
                </div><div class="du-col-sm-8"><small>Markets - <span>10 minutes ago</span></small><br><br><h4 class="news-title">
                <a href="#">` + data.title + `</a></h4>
                <p>` + data.body + `</p></a></div></div><hr>`
            });
            outputHtmlString = `<h1>Egypt runs first return flight for workers stranded in Kuwait</h1>
            <img class="du-img-fluid du-mb-4 width-100" src="https://du-widget.herokuapp.com/assets/images/Group 1062.png" alt=""><div class="du-row"><div class="du-col-md-6">
            <p class="du-mb-4">Committed investments in the GCC region increased by 2.3% </p></div><div class="du-col-md-6">
            <small class="pull-right">Markets - <span>10 minutes ago</span></small></div></div><div class="du-row"><div class="du-col-sm-12">
            <p>Mubasher: The Arab Petroleum Investments Corporation (APICORP) estimates that planned and committed investments in the Middle East and North Africa 
            (MENA) region will exceed $792 billion over the next five years from 2020 to 2024.</p><p>The estimated value marks a $173 billion decline from last year’s 
            estimation, which is mostly in planned investments due to what APICORP calls the 2020 triple crisis.</p><p>The triple crisis is referring to the 
            coronavirus (COVID-19) pandemic and its related health crisis, coupled with the oil crisis and the looming financial crisis, according to the 
            MENA Energy Investment Outlook 2020-2024.</p><p>However, the outlook report mentioned that despite the difficulties, committed investments in 
            the GCC region increased by 2.3% compared to a 6% overall decrease in the entire MENA region.</p>
            <img class="du-img-fluid mb-3 du-d-block du-mx-auto" src="https://du-widget.herokuapp.com/assets/images/image-49.png" alt="">
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
        break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<div class="du-row"><div class="du-col-sm-4"><img class="img-fluid width-100" 
                src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-1.png" alt=""></div><div class="du-col-sm-8 news-block"><small class="title-under-img">
                محتوی الشریک - <span>قبل 3 ساعات</span></small><h4 class="title-news-description">متعامل يتابع أس الأسهم سوق الأسهم
                 السعودية يرتفع بالختام بسيولة 4.4 مليار ريال</h4><p>هو السيناريو الأكثر قسوة على المملكة ودول العالم، وهي أن تتخذ السعودية
                  قراراً بإلغاء موسم الحج لهذا العام، خوفاً من تكوين بؤرة جديدة لانتشار فيروس كورونا
                  في واحدة من أكبر التجمعات البشرية سنوياً في العالم، خاصة بعدما تخطت</p></div><div class="du-col-12"><hr></div></div>`
            });
            outputHtmlStringAr = `<h1 class="news-main-heading">لكن لا بد أن أوضح لك أن كل هذه الأفكار المغلوطة حول استنكار النشوة وتمجيد الألم</h1>
            <small class="news-under-title-description">محتوی الشریک - <span>قبل 3 ساعات</span></small><img class="img-fluid du-mb-3 du-mt-2 width-100" 
            src="https://du-widget.herokuapp.com/assets/images/Group 1062.png" alt=""><p class="du-mb-5 commit-text">لكن لا بد أن أوضح لك أن كل هذه الأفكار المغلوطة حول استنكار </p>
            <div class="du-row"><div class="du-col-md-12"><p class="mubasher-news-description">لكن لا بد أن أوضح لك أن كل هذه الأفكار المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل،
             وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية،
             فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤلاء</p><br><p class="mubasher-news-description"> الأشخاص الذين لا يدركون بأن السعادة لا بد أن نستشعرها
              بصورة أكثر عقلانية ومنطقية فيعرضهم هذا لمواجهة الظروف الأليمة، وأكرر بأنه لا يوجد من
                    يرغب في الحب ونيل المنال ويتلذذ بالآلام، الألم هو الألم ولكن نتيجة لظروف ما قد تكمن السعاده فيما نتحمله من كد وأسي.</p><br><p class="mubasher-news-description"> و سأعرض مثال حي لهذا، من منا لم يتحمل جهد بدني شاق إلا
                    من أجل الحصول على ميزة أو فائدة؟ ولكن من لديه الحق أن ينتقد شخص ما أراد أن يشعر بالسعادة
                    التي لا تشوبها عواقب أليمة أو آخر أراد أن يتجنب الألم الذي ربما تنجم عنه بعض المتعة ؟</p>
                <br><p class="mubasher-news-description"> علي الجانب الآخر نشجب ونستنكر هؤلاء الرجال المفتونون بنشوة اللحظة الهائمون في رغباتهم
                 فلا يدركون ما يعقبها من الألم والأسي المحتم، واللوم كذلك يشمل هؤلاء الذين أخفقوا</p><br>
                 <img class="img-fluid du-mb-3 d-block du-mx-auto" src="https://du-widget.herokuapp.com/assets/images/image-49.png" alt="">
                 <p class="mubasher-news-description">لكن لا بد أن أوضح لك أن كل هذه الأفكار المغلوطة حول
                    استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك
                    السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤلاء الأشخاص
                    الذين لا يدركون بأن السعادة لا بد أن نستشعرها بصورة أكثر عقلانية ومنطقية فيعرضهم هذا
                    لمواجهة الظروف الأليمة، وأكرر بأنه لا يوجد من يرغب في الحب ونيل المنال ويتلذذ بالآلام،
                    الألم هو الألم ولكن نتيجة لظروف ما قد تكمن السعاده فيما نتحمله من كد وأسي.</p><br>
                    <p class="mubasher-news-description du-mb-0">و سأعرض مثال حي لهذا، من منا لم يتحمل جهد بدني
                    شاق إلا من أجل الحصول على ميزة أو فائدة؟ ولكن من لديه الحق أن ينتقد شخص ما أراد أن يشعر
                    بالسعادة التي لا تشوبها عواقب أليمة أو آخر أراد أن يتجنب الألم الذي ربما تنجم عنه بعض
                    المتعة ؟</p><p class="mubasher-news-description">علي الجانب الآخر نشجب ونستنكر هؤلاء الرجال المفتونون
                    بنشوة اللحظة الهائمون في رغباتهم فلا يدركون ما يعقبها من الألم والأسي المحتم، واللوم
                    كذلك يشمل هؤلاء الذين أخفقوا في واجباتهم نتيجة لضعف إرادتهم فيتساوي مع هؤلاء الذين
                    يتجنبون وينأون عن تحمل الكدح والألم .</p><br><p class="mubasher-news-description">لكن لا بد أن أوضح لك أن كل هذه الأفكار المغلوطة حول
                    استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل لتكتشف حقيقة وأساس تلك
                    السعادة البشرية، فلا أحد يرفض أو يكره أو يتجنب الشعور بالسعادة، ولكن بفضل هؤلاء الأشخاص
                    الذين لا يدركون بأن السعادة لا بد أن نستشعرها بصورة أكثر عقلانية ومنطقية فيعرضهم هذا
                    لمواجهة الظروف الأليمة، وأكرر بأنه لا يوجد من يرغب في الحب ونيل المنال ويتلذذ بالآلام،
                    الألم هو الألم ولكن نتيجة لظروف ما قد تكمن السعاده فيما نتحمله من كد وأسي.</p><br>
                    <p class="mubasher-news-description du-mb-0">و سأعرض مثال حي لهذا، من منا لم يتحمل جهد بدني
                    شاق إلا من أجل الحصول على ميزة أو فائدة؟ ولكن من لديه الحق أن ينتقد شخص ما أراد أن يشعر
                    بالسعادة التي لا تشوبها عواقب أليمة أو آخر أراد أن يتجنب الألم الذي ربما تنجم عنه بعض
                    المتعة ؟</p><p class="mubasher-news-description">علي الجانب الآخر نشجب ونستنكر هؤلاء الرجال المفتونون
                    بنشوة اللحظة الهائمون في رغباتهم فلا يدركون ما يعقبها من الألم والأسي المحتم، واللوم
                    كذلك يشمل هؤلاء الذين أخفقوا في واجباتهم نتيجة لضعف إرادتهم فيتساوي مع هؤلاء الذين
                    يتجنبون وينأون عن تحمل الكدح والألم .</p></div></div><div class="du-row du-mt-5"><div class="du-col-12">
                    <h4 class="exclusive-heading">أخبار ذات صلة</h4><div class="du-col-12"><hr></div></div></div>` + insideLoopHTMLAr + `<div class="du-row">
                    <div class="du-col-sm-12 du-mt-4 du-mb-5 du-text-center"><a href="#" class="main-color ff-hel-b">تحميل المزيد <span><img 
                    src="https://du-widget.herokuapp.com/assets/images/path-392.svg" alt=""></span></a></div></div>`;
            return outputHtmlStringAr;
        break;
    }
}


/* DU News Listing View */

/* Listing View News DU */
function newsListingViewNewsHTML(responseDataObj) {
    switch (sessionStorage.getItem('duStateLanguage')) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTML += `<div class="du-row"><div class="du-col-sm-4">
                <a href="#" onClick="viewDuNewsPage('listingPage', event);"><img class="du-img-fluid width-100" 
                src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-1.png" alt="">
                </div><div class="du-col-sm-8 du-mt-4"><small class="title-under-img">Markets - <span>10 minutes ago</span></small>
                <h4 class="title-news-description">` + data.title + `</h4><p>` + data.body + `</p></div>
                <div class="du-col-12"><hr></a></div></div>`
            });
            outputHtmlString = `<h1 class="main-news-title du-mt-4">Banking</h1><div class="du-row"><div class="du-col-sm-6">
            <div class="news-inner"><a href="#"><div class="bg-clr-fr-news d-flex flex-wrap align-content-center">
            <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/Image%2056.png" alt=""></div></a><div class="clearfix du-mt-3">
            <small class="title-under-img">Markets - <span>10 minutes ago</span></small><h3 class="title-img-description">
            <a class="title-img-description txt-black" href="#"> Egypt runs first return flight for workers stranded in Kuwait</a></h3></div></div></div>
            <div class="du-col-sm-6"><div class="news-inner"><img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/Image%2056.png" alt="">
            <div class="clearfix du-mt-3"><small class="title-under-img">Markets - <span>10 minutes ago</span></small><h3 class="title-img-description">
            Egypt runs first return flight for workers stranded in Kuwait</h3></div></div></div></div>` + insideLoopHTML;
            return outputHtmlString;
        break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.articles.forEach(data => {
                insideLoopHTMLAr += `<div class="du-row"><div class="du-col-sm-4">
                <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/ae4c4d011de2d059445e75a1dd74280e-1.png" alt=""></div>
                <div class="du-col-sm-8"><small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h4 class="title-news-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</h4>
                <p>هو السيناريو الأكثر قسوة على المملكة ودول العالم، وهي أن تتخذ السعودية قراراً بإلغاء موسم الحج لهذا العام،
                 خوفاً من تكوين بؤرة جديدة لانتشار فيروس كورونا في واحدة من أكبر التجمعات البشرية سنوياً في العالم، خاصة بعدما تخطت</p></div>
                 <div class="du-col-12"><hr></div></div>`
            });
            outputHtmlStringAr = `<h1 class="main-news-title mt-4">أخبار عالمية</h1><div class="du-row"><div class="du-col-sm-6"><div class="news-inner">
            <img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/01abf890bdc6ddfff8451fe7d54057f0.png" alt=""><div class="clearfix mt-3">
            <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
            <h3 class="title-img-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال</h3></div></div></div>
            <div class="du-col-sm-6"><div class="news-inner"><img class="du-img-fluid width-100" src="https://du-widget.herokuapp.com/assets/images/01abf890bdc6ddfff8451fe7d54057f0.png" alt="">
            <div class="clearfix mt-3"><small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
            <h3 class="title-img-description">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</h3></div></div>
            </div></div>` + insideLoopHTMLAr + `<div class="du-row"><div class="du-col-sm-12 mt-4 mb-5 du-text-center "><a href="#" class="main-color ff-hel-b">تحميل المزيد <span>
            <img src="https://du-widget.herokuapp.com/assets/images/path-392.svg" alt=""></span></a></div></div>`;
            return outputHtmlStringAr;
        break;
    }
}



/* Du Page Redirection */

function duListingNewsPage(state, event) {
    event.preventDefault();
    sessionStorage.setItem('du-widget-state', state);
    var innerContent = document.getElementById("du_news_page");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<section class="banking du-mb-5"><div class="du-container-fluid container-section">
    <div class="du-row"><div class="du-col-sm-12 news-left-col"><br><a href="#" class="back-btn-du" onClick="duNewsBackState();">Back to Du News Summary</a>
    <div id="du_news_view_container"></div></div></div></div></section>`
    var info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_news_view_listing" },
                    { "htmlContainerId": "du_news_view_container" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "sa" }] },
                    { "urlParam": "du_news_listing" },
                    { "customeStyles": [] }
                ]
            },
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    loadInfoJsWidget(info_widgets_config_data);
}

function viewDuNewsPage(state, event) {
    event.preventDefault();
    sessionStorage.setItem('du-widget-state', state);
    var innerContent = document.getElementById("du_news_page");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<div class="du-container-fluid du-mt-5">
    <div class="du-row"><div class="du-col-md-12 news-left-col"><a href="#" class="back-btn-du" onClick="duNewsBackState();">Back to Du News Summary</a>
    <div id="du_related_news_container"></div></div></div></div>`
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

function duNewsSummaryPage(state, event) {
    event.preventDefault();
    sessionStorage.setItem('du-widget-state', state);
    var innerContent = document.getElementById("du_news_page");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<div class="du-container-fluid container-fluid-pd du-mt-5"><section>
    <div class="du-row"><div class="du-col-md-9"><div id="du_top_container_news"></div></div><div class="du-col-md-3 stocks-sidebar">
    <div id="du_most_read_container_news"></div></div></div></section><section><div class="du-row"><div class="du-col-md-12">
    <div id="du_exclusive_news_container"></div></div></div></section><section><div class="du-row du-mt-5"><div class="du-col-md-12">
    <div id="du_ismalic_finance_container"></div></div></div></section><section><div class="du-row du-mt-5"><div class="du-col-md-12">
    <div id="du_arab_market_container"></div></div></div></section><section><div class="du-row mt70"><div class="du-col-md-12">
    <div id="du_international_market_container"></div></div></div></section><section><div class="du-row mt70 du-mb-5"><div class="du-col-md-12">
    <div id="du_press_container_release"></div></div></div></section></div>`
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

function duNewsBackState() {
    var state = sessionStorage.getItem('du-widget-state');
    switch (state) {
        case 'summaryPage':
            return this.duNewsSummaryPage('summaryPage', event);
            break;
        case 'detailPage':
            return this.viewDuNewsPage('detailPage', event);
            break;
        case 'listingPage':
            return this.duListingNewsPage('listingPage', event);
            break;
        default:
            return this.duNewsSummaryPage('summaryPage', event);
    }
}