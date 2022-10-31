jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

// searchbar handlers
$(function () {
    var searchField = $('#query');
    var icon = $('#search-btn');

    //focus event handler (what happens when you click into search)
    $(searchField).on('focus', function () {
        $(this).animate({
            width: '100%'
        }, 400);
        $(icon).animate({
            right: '10px'
        }, 400);
    });

    //blur event handler
    $(searchField).on('blur', function () {
        if (searchField.val() == '') {
            $(searchField).animate({
                width: '45%'
            }, 400, function () { });
            $(icon).animate({
                right: '360px'
            }, 400, function () { });
        }
    });

    //prevent page from reloading
    $('#search-form').submit(function (e) {
        e.preventDefault();
    });
})

//search function - 
function search() {
    //clear results
    $('#results').html('');
    $('#buttons').html('');

    //get input
    q = $('#query').val();

    //call API 
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
        part: 'snippet, id',
        q: q,
        type: 'video',
        key: 'AIzaSyBZg-PVM63bSB6db3WQGx97gVbHswfZSeo'
    },
        function (data) {
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            console.log(data);

            $.each(data.items, function (i, item) {
                //get output from response
                var formattedResponse = formatResponse(item);

                //display results
                $('#results').append(formattedResponse);
            });

            var formattedButtons = formatButtons(prevPageToken, nextPageToken);
            //display buttons
            $('#buttons').append(formattedButtons);

        }
    );
}

//next page function
function nextPage() {
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');

    //clear results
    $('#results').html('');
    $('#buttons').html('');

    //get input
    q = $('#query').val();

    //call API 
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
        part: 'snippet, id',
        q: q,
        pageToken: token,
        type: 'video',
        key: 'AIzaSyBZg-PVM63bSB6db3WQGx97gVbHswfZSeo'
    },
        function (data) {
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            console.log(data);

            $.each(data.items, function (i, item) {
                //get output from response
                var formattedResponse = formatResponse(item);

                //display results
                $('#results').append(formattedResponse);
            });

            var formattedButtons = formatButtons(prevPageToken, nextPageToken);
            //display buttons
            $('#buttons').append(formattedButtons);

        }
    );
}

//previous page function
function prevPage() {
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');

    //clear results
    $('#results').html('');
    $('#buttons').html('');

    //get input
    q = $('#query').val();

    //call API 
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
        part: 'snippet, id',
        q: q,
        pageToken: token,
        type: 'video',
        key: 'AIzaSyBZg-PVM63bSB6db3WQGx97gVbHswfZSeo'
    },
        function (data) {
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;

            console.log(data);

            $.each(data.items, function (i, item) {
                //get output from response
                var formattedResponse = formatResponse(item);

                //display results
                $('#results').append(formattedResponse);
            });

            var formattedButtons = formatButtons(prevPageToken, nextPageToken);
            //display buttons
            $('#buttons').append(formattedButtons);

        }
    );
}

//format response content
function formatResponse(item) {
    //gather properties
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumbnail = item.snippet.thumbnails.high.url
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishTime;

    //build response
    var formattedResponse = '<li>' +
        '<div class="list-left">' +
        '<a data-fancybox="video-gallery" href="http://www.youtube.com/watch?v='+videoId+'&amp;autoplay=1&amp;rel=0&amp;controls=0&amp;showinfo=0"><img src="'+thumbnail+'"></a>' +
        '</div>' +
        '<div class=list-right>' +
        '<h3><a data-fancybox="video-gallery" href="http://www.youtube.com/watch?v='+videoId+'&amp;autoplay=1&amp;rel=0&amp;controls=0&amp;showinfo=0">'+title+'</a></h3>' +
        '<small>By <span class="cTitle">'+channelTitle+'</span > on '+videoDate+'</small>' +
        '<p>'+description+'</p>'
    '</div>' +
        '</li>' +
        '<div class="clearfix"></div>' +
        '';

    return formattedResponse;
}

//format the buttons
function formatButtons(prevPageToken, nextPageToken) {
    if (!prevPageToken) {
        var formattedButtons = '<div class="buttonContainer">' +
            '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
            'onclick="nextPage();">Next Page</button></div>';
    } else {
        var formattedButtons = '<div class="buttonContainer">' +
            '<button id="prev-button" class="paging-button" data-token="' + prevPageToken + '" data-query="' + q + '"' +
            'onclick="prevPage();">Previous Page</button>' +
            '<button id="next-button" class="paging-button" data-token="' + nextPageToken + '" data-query="' + q + '"' +
            'onclick="nextPage();">Next Page</button></div>';
    }

    return formattedButtons;
}

