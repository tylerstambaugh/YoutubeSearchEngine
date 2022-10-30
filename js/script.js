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
        '<img src="' + thumbnail + '">' +
        '</div>' +
        '<div class=list-right>' +
        '<h3>' + title + '</h3>' +
        '<small>By <span class="cTitle">' + channelTitle + '</span > on ' + videoDate + '</small>' +
        '<p>' + description + '</p>'
    '</div>' +
        '</li>' +
        '<div class="clearfix"></div>' +
        '';

    return formattedResponse;

}


//format the buttons
function formatButtons(prevPageToken, nextPageToken){
    if(!nextPageToken){
        var formattedButtons = '<div class="buttonContainer>' +
        '<button id="next-button" class+"paging-button" data-token="' + nextPageToken + 
        '" data-query="' + q +
        'onclick="nextPage();">Next Page</button></div>';
    } else {
        var formattedButtons = '<div class="buttonContainer>' +
        '<button id="prev-button" class+"paging-button" data-token="' + prevPageToken + 
        '" data-query="' + q +
        'onclick="prevPage();">Previous Page</button>' +
        '<button id="next-button" class+"paging-button" data-token="' + nextPageToken + 
        '" data-query="' + q +
        'onclick="nextPage();">Next Page</button></div>';
    }

    return formatButtons;
}

