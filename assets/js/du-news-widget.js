var duStateLanguage = "EN";
duStateLanguage = sessionStorage.getItem('duStateLanguage');
var duLangState = 2;

if (duStateLanguage === "AR") {
    duStateLanguage = "AR";
    duLangState = 1;
}
var info_news_widget_urls = [
    { "slug": "du_top_news", "url": "http://5.79.47.21:80/" + duLangState + "/" },
    { "slug": "du_most_read", "url": "http://5.79.47.21:80/" + duLangState + "/" },
    { "slug": "du_press_release", "url": "http://5.79.47.21:80/" + duLangState + "/" },
    { "slug": "du_international_market", "url": "http://5.79.47.21:80/" + duLangState + "/" },
    { "slug": "du_arab_market", "url": "http://5.79.47.21:80/" + duLangState + "/" },
    { "slug": "du_islamic_finance", "url": "http://5.79.47.21:80/" + duLangState + "/" },
    { "slug": "du_news_exclusive", "url": "http://5.79.47.21:80/" + duLangState + "/" },
];

console.log("duStateLanguage", duStateLanguage);
console.log("duLangState", duLangState);
console.log("info_news_widget_urls", info_news_widget_urls);

function loadInfoJsWidget(widget_data) {
    widget_data.widgets.forEach((config_data) => {
        let widgetSlug = config_data.widget_config[0].widgetSlug;
        if (widgetSlug === 'du_top_news' && widgetSlug === 'du_most_read' && widgetSlug === 'du_press_release' && widgetSlug === 'du_international_market'
            && widgetSlug === 'du_arab_market' && widgetSlug === 'du_islamic_finance' && widgetSlug === 'du_news_exclusive') {
            this.reloadWidgets();
        }
        let info_req_headers = {};
        info_req_headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, info_req_headers);
        info_req_headers = Object.assign({ "authorization": widget_data.authToken }, info_req_headers);
        let apiUrlObj = info_news_widget_urls.find(
            ({ slug }) => slug === widgetSlug
        );
        // loader(config_data.widget_config[1].htmlContainerId);
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

function reloadWidgets() {
    console.log('reload recalls');
    var innerContent = document.getElementById("du_news_page");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<div class="du-container-fluid container-fluid-pd"><section>
    <div class="du-row"><div class="du-col-md-9"><div id="du_top_container_news"></div></div><div class="du-col-md-3 stocks-sidebar du-overflow-blocks">
    <div id="du_most_read_container_news"></div></div></div></section><section><div class="du-row"><div class="du-col-md-12">
    <div id="du_exclusive_news_container"></div></div></div></section><section><div class="du-row du-mt-5"><div class="du-col-md-12">
    <div id="du_ismalic_finance_container"></div></div></div></section><section><div class="du-row du-mt-5"><div class="du-col-md-12">
    <div id="du_arab_market_container"></div></div></div></section><section><div class="du-row mt70"><div class="du-col-md-12">
    <div id="du_international_market_container"></div></div></div></section><section><div class="du-row mt70 du-mb-5"><div class="du-col-md-12">
    <div id="du_press_container_release"></div></div></div></section></div>`
}

// function loader(containerId) {
//     var element = document.getElementById(containerId);
//     // element.style.position = "relative";
//     // element.style.width = "100%";
//     containerId.innerHTML = "";
//     element.innerHTML = "";

//     // var arham = document.createElement('div');
//     element.classList.add("loader");
//     // element.appendChild(arham);


//     // console.log('innerloader element', element);
//     // console.log('innerloader element2', element.appendChild(arham));
//     // element.classList.add("loader");
// };

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
            console.log('response', response);
            var container = document.getElementById(htmlContainerId);
            // container.classList.remove("loader");
            let generatedHTML = createHTML(response, widgetSlug);
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
    } else if (widgetSlug === "du_related_news_view") {
        return viewNewsDetailHTML(reqDataObject);
    } else if (widgetSlug === "du_related_news") {
        return relatedViewNewsHTML(reqDataObject);
    } else if (widgetSlug === "du_news_view_listing") {
        return newsListingViewNewsHTML(reqDataObject);
    } else if (widgetSlug === "market_snapshot") {
        return '<div class="d-flex gray-border mb-2 mt-4 coun-ls-gcc">market Snapshot Data is in console</div>';
    }
};


function stripHTML(string) {
    charArr = string.split('');
    resultArr = [];
    htmlZone = 0;
    quoteZone = 0;
    for (x = 0; x < charArr.length; x++) {
        switch (charArr[x] + htmlZone + quoteZone) {
            case "<00": htmlZone = 1; break;
            case ">10": htmlZone = 0; resultArr.push(' '); break;
            case '"10': quoteZone = 1; break;
            case "'10": quoteZone = 2; break;
            case '"11':
            case "'12": quoteZone = 0; break;
            default: if (!htmlZone) { resultArr.push(charArr[x]) }
        }
    }
    return resultArr.join('')
};

/* Top News DU */
function topNewsHomeHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            var srcImgSet = responseDataObj[0].image.srcset.split(',')[2];
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="du-col-md-6"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <small class="title-under-img">Markets - <span>10 minutes ago</span></small><h5 class="title-img-description">` + data.title + `</h5></a><hr></div>`
            });
            outputHtmlString = `<a href="#" onClick="viewDuNewsPage('summaryPage',` + responseDataObj[0].id + `, event);" class="lnd-tp-news lnd-tp-news-des">
                <img class="du-img-fluid" src=` + srcImgSet + `><span class="lnd-tp-news-title font35 ff-hel-b 
                du-text-white">` + responseDataObj[0].title + `</span>
                <span class="lnd-tp-news-time font14 du-text-white">` + responseDataObj[0].source.name.stringEn + ` - 10 minutes ago</span></a><div class="du-row du-mt-3">
                <a href="#" class="lnd-tp-news lnd-tp-news-mob">
                <span class="lnd-tp-news-title font35 ff-hel-b du-text-white">Egypt runs first return flight for workers stranded in Kuwait</span>
                <span class="lnd-tp-news-time font14 du-text-white">Markets - 10 minutes ago</span>
                <img class="du-img-fluid" src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/left-main-banner.png"></a>` + insideLoopHTML + `</div>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            var srcImgSet = responseDataObj[0].image.srcset.split(',')[2];
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<div class="du-col-md-6"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h5 class="title-img-description">` + data.title + `</h5></a><hr></div>`
            });
            outputHtmlStringAr = `<a href="#" class="lnd-tp-news"><img class="du-img-fluid" src=` + srcImgSet + `>
            <span class="lnd-tp-news-title ff-hel-b du-text-white">متعامل يتابع أس الأسهم سوق الأسهم السعودية يرتفع بالختام بسيولة 4.4 مليار ريال بدعم القياديات</span>
            <span class="lnd-tp-news-time font14 du-text-white">قبل 3 ساعات</span></a><div class="du-row du-mt-3">` + insideLoopHTMLAr + `</div>`;
            return outputHtmlStringAr;
            break;
    }
};

/* Most Read News DU */
function mostReadNewsHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="du-row">
                <div class="du-row ml-1"><div class="du-col-sm-4 col-3 pr-0 d-flex flex-wrap align-content-center">
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><img class="du-img-fluid" src=` + data.image.primary + `></a>
                </div><div class="du-col-sm-8 col-9"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <p class="most-read-news-title">` + data.title + `</p></a></div><div class="du-col-12"><hr></div>
                </div></div>`
            });
            outputHtmlString = `<h4 class="font26 du-black-title">Most Read</h4><hr>` + insideLoopHTML + `<div class="du-col-sm-12 du-text-center">
            <a href="#" class="main-color ff-hel-b" onClick="paginateNews('du_most_read', event)">View More<span class="du-ml-1"><img src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-392.svg" alt=""></span></a></div>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<div class="du-row"><div class="du-col-4">
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><img class="du-img-fluid width-100" src=` + data.image.primary + `></a>
                </div><div class="du-col-8"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><div class="sidebar-readmore-description txt-black font15">`
                    + data.title + `</div></a></div><div class="du-col-12"><hr class="sidebar-hr"></div></div>`
            });
            outputHtmlStringAr = `<div class="most-read-news-list"><h4 class="sidebar-readmore-title du-black-title">الأخبار الأكثر</h4>` + insideLoopHTMLAr + `<div class="du-row">
            <div class="du-col-sm-12 du-text-center du-mb-3"><a href="#" class="view-all-text main-color" onClick="paginateNews('du_most_read', event)">عرض الكل <img class="pr-1 rotate90" 
            src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-392.svg" alt=""></a></div></div></div>`;
            return outputHtmlStringAr;
            break;
    }
};


var paginationCounter = 10;
function paginateNews(slug, event) {
    event.preventDefault();
    paginationCounter += 10;
    var paginateWidget = [];
    paginateWidget.push(info_widgets_config_data.widgets.find(x => { return x.widget_config[0].widgetSlug === slug }));
    paginateWidget[0].widget_config[4].urlParam = '0/' + paginationCounter;
    var innerContent = document.getElementById(paginateWidget[0].widget_config[1].htmlContainerId);
    innerContent.innerHTML = "";
    info_widgets_config_data.widgets = paginateWidget;
    loadInfoJsWidget(info_widgets_config_data);
};

/* Exclusive News DU */
function exclusiveNewsHomeHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <img class="du-img-fluid img-width-100" src=` + data.image.primary + `><small class="title-under-img du-black-title"></a>` + data.source.name.stringEn + ` - <span>10 minutes ago</span>
                </small><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><h5 class="title-img-description">` + data.title + `</h5></a><hr></div>`
            });
            outputHtmlString = `<h4 class="exclusive-heading mt70">Mubasher Exclusive</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
            <img class="pl-1" src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg" alt=""></a><div class="du-row">` + insideLoopHTML + `</div>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <img class="du-img-fluid img-width-100" src=` + data.image.primary + `>
                <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h5 class="title-img-description">` + data.title + `</h5></a><hr></div>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading mt70">حصرياً مباشر</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">اظهار الكل <img class="pr-1 rotate180" 
            src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg" alt=""></a><div class="du-row du-mt-3 du-mb-5">` + insideLoopHTMLAr + `</div>`;
            return outputHtmlStringAr;
            break;
    }
};

/* Islamic Finance News DU */
function islamicFinanceNewsHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="isl-fi-news-wrap du-col-sm-4" style="margin-bottom:25px;"><div class="du-row"><div class="du-col-sm-4">
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><img class="du-img-fluid du-w-100" src=` + data.image.primary + `></a>
                </div><div class="du-col-sm-8"><small>` + data.source.name.stringEn + ` - <span>10 minutes ago</span></small>
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><h6>` + data.title + `</h6></a></div></div></div>`
            });
            outputHtmlString = `<h4 class="exclusive-heading">Islamic Finance</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
            <img class="pl-1" src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg" alt=""></a><hr><div class="du-row">` + insideLoopHTML + `<div class="du-col-12"><hr></div></div>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<div class="isl-fi-news-wrap du-col-sm-4 du-mb-4"><div class="du-row"><div class="du-col-sm-4">
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><img class="du-img-fluid w-100" src=` + data.image.primary + `></div><div class="du-col-sm-8">
                <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h6 class="title-img-description">` + data.title + `</h6></a></div></div></div>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading">اقتصاد إسلامي</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">اظهار الكل<img class="pr-1 rotate180" 
            src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg" alt=""></a><hr><div class="du-row">` + insideLoopHTMLAr + `<div class="du-col-12"><hr></div></div>`;
            return outputHtmlStringAr;
            break;
    }
};

/* Arab Market News DU */
function arabMarketNewsHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="isl-fi-news-wrap du-col-sm-4"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <img class="du-img-fluid width-100 img-width-100" src=` + data.image.primary + `></a>
                <div class="clearfix du-mt-3"><small class="title-under-img du-black-title">` + data.source.name.stringEn + ` - <span>10 minutes ago</span></small>
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><h6 class="title-img-description">` + data.title + `</h6></a></div><hr></div>`
            });
            outputHtmlString = `<h4 class="exclusive-heading">Arab Market</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all
            <img class="pl-1" src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg"></a><div class="du-row du-mt-2">` + insideLoopHTML + `</div>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<div class="isl-fi-news-wrap du-col-sm-4"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <img class="du-img-fluid width-100 img-width-100" src=` + data.image.primary + `><div class="clearfix du-mt-3">
                <small class="title-under-img du-black-title">محتوی الشریک - <span>قبل 3 ساعات</span>
                </small><h6 class="title-img-description">` + data.title + `</h6>
                </div></a><hr></div>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading">الأسواق العربية</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">اظهار الكل<img class="pr-1 rotate180" 
            src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg" alt=""></a><div class="du-row du-mt-2">` + insideLoopHTMLAr + `</div>`;
            return outputHtmlStringAr;
            break;
    }
};

/* International Market News DU */
function internationalMarketHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="du-row"><div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <img class="du-img-fluid width-100" src=` + data.image.primary + `></a></div>
                <div class="du-col-md-8 du-mt-4"><small class="title-under-img du-black-title">` + data.source.name.stringEn + ` - <span>10 minutes ago</span></small>
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><h5 class="title-img-description">` + data.title + `</h5></a><p>` + data.teaser + `</p></div></div><hr>`
            });
            outputHtmlString = `<h4 class="exclusive-heading">International Market</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">See all<img class="pl-1" src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg" alt=""></a>` + insideLoopHTML;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<div class="du-row"><div class="du-col-md-4"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <img class="du-img-fluid width-100" src=` + data.image.primary + `>
                </div><div class="du-col-md-8"><small class="title-under-img du-black-title">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h5 class="title-img-description">` + data.title + `</h5>
                <p>` + data.teaser + `</p></a></div></div><hr>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading">الأسواق العالمية</h4><a href="#" onClick="duListingNewsPage('summaryPage', event);" 
            class="view-all-text">اظهار الكل <img class="pr-1 rotate180" src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg" alt=""></a>` + insideLoopHTMLAr;
            return outputHtmlStringAr;
            break;
    }
};

/* Press Release DU */
function pressReleaseNewsHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            var srcImgSet = responseDataObj[0].image.srcset.split(',')[2];
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="press-rel-news"><small class="title-under-img du-black-title">` + data.source.name.stringEn + ` - <span>10 minutes ago</span></small>
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><h5 class="title-img-description mb-3">` + data.title + `</h5></a></div><hr>`
            });
            outputHtmlString = `<h4 class="exclusive-heading">Press Release</h4><div class="du-row">
            <div class="du-col-md-4"><img class="du-img-fluid du-mt-3" src=` + srcImgSet + `></div>
            <div class="du-col-md-8">` + insideLoopHTML + `</div></div>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            var srcImgSet = responseDataObj[0].image.srcset.split(',')[2];
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><div class="press-rel-news du-mt-3"><small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
                <h5 class="title-img-description">` + data.title + `</h5></div></a><hr>`
            });
            outputHtmlStringAr = `<h4 class="exclusive-heading">بيانات صحفية</h4><a href="#" class="view-all-text" onClick="duListingNewsPage('summaryPage', event);">اظهار الكل<img class="pr-1 rotate180" 
            src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-487.svg" alt=""></a><div class="du-row"><div class="du-col-md-4"><img class="du-img-fluid" 
            src=` + srcImgSet + `></div><div class="du-col-md-8">` + insideLoopHTMLAr + `</div></div>`;
            return outputHtmlStringAr;
            break;
    }
};

/* DU News Listing View */

/* Listing View News DU */
function newsListingViewNewsHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="du-row"><div class="du-col-sm-4">
                <a href="#" onClick="viewDuNewsPage('listingPage',` + data.id + `, event);"><img class="du-img-fluid width-100" 
                src=` + data.image.primary + ` alt=""></a></div><div class="du-col-sm-8 du-mt-4"><small class="title-under-img du-black-title">` + data.source.name.stringEn + ` - 
                <span>10 minutes ago</span></small><a href="#" onClick="viewDuNewsPage('listingPage',` + data.id + `, event);"><h4 class="title-news-description">`
                    + data.title + `</h4></a><p>` + data.teaser + `</p></div><div class="du-col-12"><hr></div></div>`
            });
            outputHtmlString = `<h1 class="main-news-title du-mt-4 du-black-title">` + responseDataObj[0].title + `</h1><div class="du-row"><div class="du-col-sm-6">
            <div class="news-inner"><a href="#"><div class="bg-clr-fr-news d-flex flex-wrap align-content-center">
            <img class="du-img-fluid width-100" src=` + responseDataObj[0].image.primary + ` alt=""></div></a><div class="clearfix du-mt-3">
            <small class="title-under-img du-black-title">Markets - <span>10 minutes ago</span></small><h3 class="title-img-description">
            <a class="title-img-description txt-black" href="#" onClick="viewDuNewsPage('listingPage',` + responseDataObj[0].id + `, event);">` + responseDataObj[0].title + `</a></h3></div></div></div>
            <div class="du-col-sm-6"><div class="news-inner"><img class="du-img-fluid width-100" src=` + responseDataObj[1].image.primary + ` alt="">
            <div class="clearfix du-mt-3"><small class="title-under-img du-black-title">Markets - <span>10 minutes ago</span></small><h3 class="title-img-description">
            <a class="title-img-description txt-black" href="#" onClick="viewDuNewsPage('listingPage',` + responseDataObj[1].id + `, event);">` + responseDataObj[1].title + `</a></h3></div></div></div></div>` + insideLoopHTML;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<div class="du-row"><div class="du-col-sm-4">
                <img class="du-img-fluid width-100" src=` + data.image.primary + ` alt=""></div>
                <div class="du-col-sm-8"><small class="title-under-img">` + data.source.name.stringEn + ` - <span>قبل 3 ساعات</span></small><a href="#" onClick="viewDuNewsPage('listingPage',` + data.id + `, event);">
                <h4 class="title-news-description">`+ data.title + `</h4></a><p>` + data.teaser + `</p></div><div class="du-col-12"><hr></div></div>`
            });
            outputHtmlStringAr = `<h1 class="main-news-title mt-4">` + responseDataObj[0].title + `</h1><div class="du-row"><div class="du-col-sm-6">
            <div class="news-inner"><img class="du-img-fluid width-100" src=` + responseDataObj[0].image.primary + `  alt=""><div class="clearfix mt-3">
            <small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
            <h3 class="title-img-description">` + responseDataObj[0].title + `</h3></div></div></div>
            <div class="du-col-sm-6"><div class="news-inner"><img class="du-img-fluid width-100" src=` + responseDataObj[1].image.primary + ` alt="">
            <div class="clearfix mt-3"><small class="title-under-img">محتوی الشریک - <span>قبل 3 ساعات</span></small>
            <h3 class="title-img-description">`+ responseDataObj[1].title + `</h3></div></div>
            </div></div>` + insideLoopHTMLAr + `<div class="du-row"><div class="du-col-sm-12 mt-4 mb-5 du-text-center "><a href="#" class="main-color ff-hel-b">تحميل المزيد <span>
            <img src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-392.svg" alt=""></span></a></div></div>`;
            return outputHtmlStringAr;
            break;
    }
};

/* DU News View */

/* View News DU Detail */
function viewNewsDetailHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            var srcImgSet = responseDataObj.image.srcset.split(',')[2];
            outputHtmlString = `<h1 class="du-black-title">` + responseDataObj.title + `</h1>
            <img class="du-img-fluid du-mb-4 width-100" src=` + srcImgSet + ` alt=""><div class="du-row"><div class="du-col-md-6">
            <p class="du-mb-4">` + responseDataObj.mainImageCaption + `</p></div><div class="du-col-md-6">
            <small class="pull-right">` + responseDataObj.source.name.stringEn + ` - <span>10 minutes ago</span></small></div></div><div class="du-row">
            <div class="du-col-sm-12"><p>` + stripHTML(responseDataObj.data.description) + `</p></div></div><h4 class="exclusive-heading du-mt-3">Related News</h4><hr>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            var srcImgSet = responseDataObj.image.srcset.split(',')[2];
            outputHtmlStringAr = `<h1 class="news-main-heading du-black-title">` + responseDataObj.title + `</h1>
            <small class="news-under-title-description">محتوی الشریک - <span>قبل 3 ساعات</span></small><img class="img-fluid du-mb-3 du-mt-2 width-100" 
            src=` + srcImgSet + ` alt=""><p class="commit-text">` + responseDataObj.mainImageCaption + `</p>
            <div class="du-row"><div class="du-col-md-12"><p class="mubasher-news-description">` + stripHTML(responseDataObj.data.description) + `</p><br></div></div>`;
            return outputHtmlStringAr;
            break;
    }
};


/* Related News DU View */
function relatedViewNewsHTML(responseDataObj) {
    switch (duStateLanguage) {
        default:
            let outputHtmlString = "";
            let insideLoopHTML = "";
            responseDataObj.forEach(data => {
                insideLoopHTML += `<div class="du-row"><div class="du-col-sm-4 ml-5">
                <a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);"><img class="du-img-fluid width-100" src=` + data.image.primary + ` alt=""></a>
                </div><div class="du-col-sm-8"><small class="du-black-title">Markets - <span>10 minutes ago</span></small><br><br><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <h4 class="news-title">` + data.title + `</h4></a><p>` + data.teaser + `</p></div></div><hr>`
            });
            outputHtmlString = insideLoopHTML + `<div class="du-col-sm-12 du-text-center"><a href="#" class="main-color ff-hel-b" onclick="paginateNews('du_related_news', event)">
            View More<span class="du-ml-1"><img src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-392.svg" alt=""></span></a></div>`;
            return outputHtmlString;
            break;
        case 'AR':
            let outputHtmlStringAr = "";
            let insideLoopHTMLAr = "";
            responseDataObj.forEach(data => {
                insideLoopHTMLAr += `<div class="du-row"><div class="du-col-sm-4"><a href="#" onClick="viewDuNewsPage('summaryPage',` + data.id + `, event);">
                <img class="img-fluid width-100" src=` + data.image.primary + ` alt=""></div><div class="du-col-sm-8 news-block"><small class="title-under-img">
                محتوی الشریک - <span>قبل 3 ساعات</span></small><h4 class="title-news-description">` + data.title + `</h4><p>` + data.teaser + `</p></div>
                <div class="du-col-12"></a><hr></div></div>`
            });
            outputHtmlStringAr = `<div class="du-row du-mt-5"><div class="du-col-12">
                    <h4 class="exclusive-heading">أخبار ذات صلة</h4><div class="du-col-12"><hr></div></div></div>` + insideLoopHTMLAr + `<div class="du-row">
                    <div class="du-col-sm-12 du-text-center"><a href="#" class="main-color ff-hel-b" onclick="paginateNews('du_related_news', event)">تحميل المزيد <span><img 
                    src="https://du-assets-bucket.s3-eu-west-1.amazonaws.com/du/assets/images/path-392.svg" alt=""></span></a></div></div>`;
            return outputHtmlStringAr;
            break;
    }
};


/* Du Page Redirection */

function viewDuNewsPage(state, id, event) {
    event.preventDefault();
    sessionStorage.setItem('du-widget-state', state);
    var innerContent = document.getElementById("du_news_page");
    innerContent.innerHTML = "";
    var backStateDuNews = "Back to Du News";
    var backStateHome = "Home";
    switch (duStateLanguage) {
        default:
            backStateDuNews = "Back to Du News";
            backStateHome = "Home";
        break;
        case 'AR':
            backStateDuNews = "الرجوع الى Du News";
            backStateHome = "الرئيسية";
        break;
    }
    innerContent.innerHTML = `<div class="du-container-fluid">
    <div class="du-row"><div class="du-col-md-12 news-left-col">
    <nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#" onClick="duNewsSummaryPage('summaryPage', event);">` + backStateHome + `</a></li>
    <li class="breadcrumb-item du-cursor-pointer du-black-title" aria-current="page" onClick="duNewsBackState();">` + backStateDuNews + `</li></ol></nav><div id="du_related_news_view_container"></div>
    <div id="du_related_news_container"></div>
    </div></div></div>`;
    info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_related_news_view" },
                    { "htmlContainerId": "du_related_news_view_container" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "sa" }] },
                    { "urlParam": id },
                    { "customeStyles": [] }
                ]
            },
            {
                "widget_config": [
                    { "widgetSlug": "du_related_news" },
                    { "htmlContainerId": "du_related_news_container" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "sa" }] },
                    { "urlParam": "0/10" },
                    { "customeStyles": [] }
                ]
            }
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    info_news_widget_urls = [];
    info_news_widget_urls = [
        { "slug": "du_related_news_view", "url": "http://5.79.47.21:80/" },
        { "slug": "du_related_news", "url": "http://5.79.47.21:80/" + duLangState + "/" }
    ];
    loadInfoJsWidget(info_widgets_config_data);
};

function duListingNewsPage(state, event) {
    event.preventDefault();
    sessionStorage.setItem('du-widget-state', state);
    var innerContent = document.getElementById("du_news_page");
    innerContent.innerHTML = "";
    var backStateDuNews = "Back to Du News";
    var backStateHome = "Home";
    switch (duStateLanguage) {
        default:
            backStateDuNews = "Back to Du News";
            backStateHome = "Home";
        break;
        case 'AR':
            backStateDuNews = "الرجوع الى Du News";
            backStateHome = "الرئيسية";
        break;
    }
    innerContent.innerHTML = `<section class="banking du-mb-5"><div class="du-container-fluid container-section">
    <div class="du-row"><div class="du-col-sm-12 news-left-col"><br><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item">
    <a href="#" onClick="duNewsSummaryPage('summaryPage', event);">` + backStateHome + `</a></li><li class="breadcrumb-item du-cursor-pointer du-black-title" aria-current="page" 
    onClick="duNewsBackState();">` + backStateDuNews + `</li></ol></nav><div id="du_news_view_container"></div></div></div></div></section>`
    info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_news_view_listing" },
                    { "htmlContainerId": "du_news_view_container" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "sa" }] },
                    { "urlParam": "0/10" },
                    { "customeStyles": [] }
                ]
            },
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    info_news_widget_urls = [];
    info_news_widget_urls = [
        { "slug": "du_news_view_listing", "url": "http://5.79.47.21:80/" + duLangState + "/" }
    ];
    loadInfoJsWidget(info_widgets_config_data);
};

function duNewsSummaryPage(state, event) {
    event.preventDefault();
    sessionStorage.setItem('du-widget-state', state);
    var innerContent = document.getElementById("du_news_page");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<div class="du-container-fluid container-fluid-pd"><section>
    <div class="du-row"><div class="du-col-md-9"><div id="du_top_container_news"></div></div><div class="du-col-md-3 stocks-sidebar du-overflow-blocks">
    <div id="du_most_read_container_news"></div></div></div></section><section><div class="du-row"><div class="du-col-md-12">
    <div id="du_exclusive_news_container"></div></div></div></section><section><div class="du-row du-mt-5"><div class="du-col-md-12">
    <div id="du_ismalic_finance_container"></div></div></div></section><section><div class="du-row du-mt-5"><div class="du-col-md-12">
    <div id="du_arab_market_container"></div></div></div></section><section><div class="du-row mt70"><div class="du-col-md-12">
    <div id="du_international_market_container"></div></div></div></section><section><div class="du-row mt70 du-mb-5"><div class="du-col-md-12">
    <div id="du_press_container_release"></div></div></div></section></div>`
    info_widgets_config_data = {
        "widgets": [{
            "widget_config": [
                { "widgetSlug": "du_top_news" },
                { "htmlContainerId": "du_top_container_news" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/10" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_most_read" },
                { "htmlContainerId": "du_most_read_container_news" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/10" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_press_release" },
                { "htmlContainerId": "du_press_container_release" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/4" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_international_market" },
                { "htmlContainerId": "du_international_market_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/10" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_arab_market" },
                { "htmlContainerId": "du_arab_market_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/10" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_islamic_finance" },
                { "htmlContainerId": "du_ismalic_finance_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/10" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_news_exclusive" },
                { "htmlContainerId": "du_exclusive_news_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/10" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_related_news" },
                { "htmlContainerId": "du_related_news_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/10" },
                { "customeStyles": [] }
            ]
        },
        {
            "widget_config": [
                { "widgetSlug": "du_news_view_listing" },
                { "htmlContainerId": "du_news_view_container" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "0/10" },
                { "customeStyles": [] }
            ]
        },
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    info_news_widget_urls = [];
    info_news_widget_urls = [
        { "slug": "du_top_news", "url": "http://5.79.47.21:80/" + duLangState + "/" },
        { "slug": "du_most_read", "url": "http://5.79.47.21:80/" + duLangState + "/" },
        { "slug": "du_press_release", "url": "http://5.79.47.21:80/" + duLangState + "/" },
        { "slug": "du_international_market", "url": "http://5.79.47.21:80/" + duLangState + "/" },
        { "slug": "du_arab_market", "url": "http://5.79.47.21:80/" + duLangState + "/" },
        { "slug": "du_islamic_finance", "url": "http://5.79.47.21:80/" + duLangState + "/" },
        { "slug": "du_news_exclusive", "url": "http://5.79.47.21:80/" + duLangState + "/" },
    ];
    loadInfoJsWidget(info_widgets_config_data);
};

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
};