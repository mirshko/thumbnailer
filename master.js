// DISABLE BUTTTON WHEN NO INPUT
$(document).ready(function() {
    $('input').keyup(function() {
        var empty = false;
        $('input').each(function() {
            if ($(this).val().length == 0) {
                empty = true;
            }
        });
        if (empty) {
            $('#getThumb').attr('disabled', true);
        } else {
            $('#getThumb').attr('disabled', false);
        }
    });
});

// NEEDED DUE TO SAVING SOME INPUT
var subdomain;

// SET BUTTON LISTENER
document.getElementById('getThumb').addEventListener('click', getThumbnail);

function getThumbnail() {
    // GET / SET VALUES FROM INPUT FIELDS
    var mediaHashedId = $('#wistiaID').val();
    var width = $('#wistiaThumbWidth').val();
    var height = $('#wistiaThumbHeight').val();
    subdomain = $('#wistiaSubdomain').val();
    // BUILD CALL TO WISTIA
    var baseUrl = 'https://fast.wistia.com/oembed/?url=';
    // var accountUrl = escape($('#wistiaSubdomain').val().replace('/projects', ''));
    var accountUrl = escape('http://' + subdomain + '.wistia.com');
    // console.log(accountUrl);
    function getThumbnailUrl(hashedId, callback) {
        $.getJSON(baseUrl + accountUrl + '/medias/' + mediaHashedId + '&format=json&callback=?', callback);
    }
    // PARSE THE JSON FILE FROM WISTIA
    function parseJSON(json) {
        var thumbnailURL = json.thumbnail_url.replace(/\d+x\d+/, width + 'x' + height);
        // DISPLAY IMAGE THUMBNAIL
        $('#thumbURL').text(thumbnailURL);
        $('#thumbPreview').attr('src', thumbnailURL);
        $('#thumbPreview').removeClass('hide');
        $('#downloadThumb').attr('href', thumbnailURL);
    }
    // CALL THE FUNCTIONS TO GET THE ID FROM WISTIA AND THE INPUT FIELD
    getThumbnailUrl(mediaHashedId, parseJSON);
}
// SAVING THE SUBDOMAIN USED
window.onbeforeunload = function() {
    localStorage.setItem(subdomain, $('#wistiaSubdomain').val());
};
window.onload = function() {
    var subdomain = localStorage.getItem(subdomain);
    if (subdomain !== null) {
        $('#wistiaSubdomain').val(subdomain);
    }
};
