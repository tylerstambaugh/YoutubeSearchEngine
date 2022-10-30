// searchbar handler
$(function () {
    var searchField = $('#query');
    var icon = $('#search-btn');

    //focus event handler
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

    $('#search-form').submit(function (e) {
        e.preventDefault();
    });
})

//search function
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

            //console.log(data);

            $.each(data.items, function(i, item){
                //get output from response
                var output = getOutput(item);

                //display results
                $('#results').append(output);
            });
        }
    );
}