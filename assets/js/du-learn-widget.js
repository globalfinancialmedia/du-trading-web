var info_mubasher_widget_urls = [
    { "slug": "du_learn_top_courses", "url": "http://52.31.246.107:4600/api/v1/learn/courses" }
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
    if (widgetSlug === "du_learn_top_courses") {
        return learnTopCoursesHTML(reqDataObject);
    } else if (widgetSlug === "du_learn_course_detail") {
        return detailCourseHTML(reqDataObject);
    } else if (widgetSlug === "du_learn_listing_view") {
        return courseListingViewHTML(reqDataObject);
    } else if (widgetSlug === "du_learn_listing_detail_view") {
        return courseListingDetailHTML(reqDataObject);
    } else {
        return '<div class="d-flex gray-border mb-2 mt-4 coun-ls-gcc">Invalid Request</div>';
    }
};

/* Learn Top Courses DU */
function learnTopCoursesHTML(response) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    response.forEach(data => {
        if (data.price == 0) {
            data.price = data.duration;
        }
        if (data.paid === false) {
            data.paid = 'Paid';
        } else {
            data.paid = 'Free';
        }
        if (!data.img) {
            data.img = 'https://du-assets-bucket.s3-eu-west-1.amazonaws.com/Basics-and-Fundamentals-of-Stock-Markets/3_2_basicsandfundamentalsofstockmarkets.jpg'
        }
        insideLoopHTML += `<div class="du-col-md-4"><div class="du-card du-top-course-card du-mb-3"><a href="" onClick="viewCourseDetailPage(event,` + data.id + `)"><img class="du-card-img-top" 
        src=` + data.img + ` width="100%"></a>
        <div class="du-card-body du-p-3"><a href="" onClick="viewCourseDetailPage(event,` + data.id + `)"><h5 class="du-card-title">` + data.title + `</h5></a><p class="du-card-text">
        ` + data.source + `</p><span class="du-d-block slide-text-wrap"><span class="du-d-flex du-justify-content-between"><span class="course-price text-dark 
        font15 ff-hel-b">` + data.price + `</span> <span class="main-color ff-hel-b">` + data.paid + `</span></span></span></div></div></div>`
    });
    outputHtmlString = `<h3 class="main-color du-mb-3">Top Courses</h3><div class="du-row">` + insideLoopHTML + `</div>`;
    return outputHtmlString;
};

/* Detail Course DU */
function detailCourseHTML(response) {
    let outputHtmlString = "";
    if (!response.img) {
        response.img = 'https://du-assets-bucket.s3-eu-west-1.amazonaws.com/Basics-and-Fundamentals-of-Stock-Markets/3_2_basicsandfundamentalsofstockmarkets.jpg'
    }
    outputHtmlString = ` <h3 class="main-color du-mb-3 du-mt-5">Courses Details</h3><div class="du-row du-justify-content-center">
    <div class="du-col-md-7 du-pr-0"><img class="du-card-img-top" src=` + response.img + ` width="100%"></div>
    <div class="du-col-md-5 du-d-flex du-flex-wrap du-align-content-center"><div><h3 class="font25 du-black-title">` + response.title + `</h3><br><p class="opacity07 
    font19">` + response.description + `</p><p class="opacity07 du-mb-2">
    <img class="img-fluid du-mr-2" src="https://du-widget.herokuapp.com/assets/images/video-play.svg">` + response.duration + `</p><p><span class="font19">
    ` + response.instructor + `</span></p><p class="du-mb-4 ff-hel-b"><span><img src="https://du-widget.herokuapp.com/assets/images/icon-material-language.svg">
    <span class="opacity07">` + response.language + `</span></span></p><a class="du-btn du-btn-default du-btn-block start-btn ff-hel-b main-bg du-text-white du-btn-course-start" onClick="viewListingCoursesPage(event, `+ response.id +`)">
    Start</a></div></div></div><div class="du-row du-mt-5 du-mb-5"><div class="du-col-md-12"></div></div>`;
    window.scrollTo({ top: 1000, behavior: 'smooth' });
    return outputHtmlString;
};

/* Listing Course DU */
function courseListingViewHTML(response) {
    let outputHtmlString = "";
    let insideLoopHTML = "";
    response.forEach(data => {
        if (!data.img) {
            data.img = 'https://du-assets-bucket.s3-eu-west-1.amazonaws.com/Basics-and-Fundamentals-of-Stock-Markets/3_2_basicsandfundamentalsofstockmarkets.jpg'
        }
        insideLoopHTML += `<div class="du-row"><div class="du-col-sm-4"><a href="#" onClick="listingDetailCoursePage(event, ` + data.id + ` ,` + data.course.id + `)"><img class="du-img-fluid width-100" 
        src=` + data.img + ` alt=""> </div><div class="du-col-sm-8 du-mt-4"><small class="title-under-img">` + data.source + ` - 
        <span>10 minutes ago</span></small> <h4 class="title-news-description du-mt-2">` + data.title + `</h4><p>` + data.description + `</p></div><div class="du-col-12"><hr>
        </a></div></div>`
    });
    outputHtmlString = `<h3 class="main-news-title du-mt-5 main-color du-mb-5">Courses Listing</h3>` + insideLoopHTML;
    return outputHtmlString;
};

/* Listing Detail Course DU */
function courseListingDetailHTML(response) {
    let outputHtmlString = "";
    outputHtmlString = `<h3 class="main-news-title du-mt-4 du-mb-4 main-color">Courses Listing Detail</h3><hr>` + response.content;
    return outputHtmlString;
};



/* Du Page Redirection */

function duLearnTopCoursesPage(event) {
    event.preventDefault();
    var innerContent = document.getElementById("du_learn_page");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<div class="du-container-fluid container-fluid-pd"><section><div class="du-row"> <div class="du-col-md-12">
    <div id="du_learn_container_courses"></div></div></div></section><section class="du-my-2"><div id="du_learn_course_view_container"></div></section></div>`;
    var info_widgets_config_data = {
        "widgets": [{
            "widget_config": [
                { "widgetSlug": "du_learn_top_courses" },
                { "htmlContainerId": "du_learn_container_courses" },
                { "requestType": "GET" },
                { "data": [{ "selected_country": "sa" }] },
                { "urlParam": "" },
                { "customeStyles": [] }
            ]
        },
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    info_mubasher_widget_urls = [];
    info_mubasher_widget_urls = [
        { "slug": "du_learn_top_courses", "url": "http://52.31.246.107:4600/api/v1/learn/courses" }
    ];
    loadInfoJsWidget(info_widgets_config_data);
};

function viewCourseDetailPage(event, id) {
    event.preventDefault();
    var innerContent = document.getElementById("du_learn_course_view_container");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<div id="du_learn_course_view_container"></div>`;
    var info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_learn_course_detail" },
                    { "htmlContainerId": "du_learn_course_view_container" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "sa" }] },
                    { "urlParam": "" },
                    { "customeStyles": [] }
                ]
            }
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    var widget_slug_url = { "slug": "du_learn_course_detail", "url": "http://52.31.246.107:4600//api/v1/learn/courses/" + id };
    info_mubasher_widget_urls.push(widget_slug_url);
    info_mubasher_widget_urls.shift();
    loadInfoJsWidget(info_widgets_config_data);
};

function viewListingCoursesPage(event, id) {
    event.preventDefault();
    var innerContent = document.getElementById("du_learn_page");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<section class="banking du-mb-5"><div class="du-container-fluid container-section">
    <div class="du-row"><div class="du-col-sm-12 news-left-col"><br><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item">
    <a href="#" onClick="duLearnTopCoursesPage(event);">Home</a></li><li class="breadcrumb-item du-cursor-pointer du-black-title" aria-current="page" onClick="duLearnTopCoursesPage(event);">
    Back to Top Courses</li></ol></nav><div id="du_learn_listing_view_container"></div></div></div></div></section>`;
    var info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_learn_listing_view" },
                    { "htmlContainerId": "du_learn_listing_view_container" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "sa" }] },
                    { "urlParam": "" },
                    { "customeStyles": [] }
                ]
            }
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    info_mubasher_widget_urls = [];
    info_mubasher_widget_urls = [
        { "slug": "du_learn_listing_view", "url": "http://52.31.246.107:4600/api/v1/learn/lectures/course/" + id }
    ];
    loadInfoJsWidget(info_widgets_config_data);
};

function listingDetailCoursePage(event, id, courseId) {
    event.preventDefault();
    var innerContent = document.getElementById("du_learn_page");
    innerContent.innerHTML = "";
    innerContent.innerHTML = `<section class="banking du-mb-5"><div class="du-container-fluid container-section">
    <div class="du-row"><div class="du-col-sm-12 news-left-col"><br><nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item">
    <a href="#" onClick="duLearnTopCoursesPage(event);">Home</a></li><li class="breadcrumb-item du-cursor-pointer du-black-title" aria-current="page" onClick="viewListingCoursesPage(event, `+ courseId +`);">
    Back to Courses Listing</li></ol></nav><div id="du_learn_listing_detail_view_container"></div></div></div></div></section>`;
    var info_widgets_config_data = {
        "widgets": [
            {
                "widget_config": [
                    { "widgetSlug": "du_learn_listing_detail_view" },
                    { "htmlContainerId": "du_learn_listing_detail_view_container" },
                    { "requestType": "GET" },
                    { "data": [{ "selected_country": "sa" }] },
                    { "urlParam": "" },
                    { "customeStyles": [] }
                ]
            }
        ],
        authToken:
            "Barear eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwNzYyNDQ1NywiaWF0IjoxNjA3NTgxMjU3fQ.iu1snAa8e04EbYIBJihU0lSvscTg5mpm1Iyf9g8YueE"
    };
    info_mubasher_widget_urls = [];
    info_mubasher_widget_urls = [
        { "slug": "du_learn_listing_detail_view", "url": "http://52.31.246.107:4600/api/v1/learn/lectures/" + id }
    ];
    loadInfoJsWidget(info_widgets_config_data);
};