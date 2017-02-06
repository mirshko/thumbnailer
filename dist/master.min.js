// DISABLE BUTTTON WHEN NO INPUT
$(document).ready(function() {
	$('input').keyup(function() {
		$('#getThumb').attr('disabled', $('input[required]').toArray().some(function(el) {
			return el.value.length == 0
		}));
	});
});

var $loading = $('#loading').hide();
$(document)
	.ajaxStart(function () {
		$loading.show();
	})
	.ajaxStop(function () {
		$loading.hide();
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

	var buttonColor = $('#wistiaPlayButtonColor').val();

	subdomain = $('#wistiaSubdomain').val();

	// BUILD CALL TO WISTIA
	var baseUrl = 'https://fast.wistia.com/oembed/?url=';
	var accountUrl = escape('http://' + subdomain + '.wistia.com');

	function getThumbnailUrl(hashedId, callback) {
		$.getJSON(baseUrl + accountUrl + '/medias/' + mediaHashedId + '&format=json&callback=?', callback)
			.error(function() {
				alert("Call to Wistia failed, the video ID or account URL may be incorrect. Try again.");
			});
	}

	// PARSE THE JSON FILE FROM WISTIA
	function parseJSON(json) {
		if ($('#wistiaPlayButton').is(':checked')) {
			var thumbnailURL = json.thumbnail_url.replace(/\d+x\d+/, width + 'x' + height) + "&image_play_button=true&image_play_button_color=" + buttonColor + "CC"; // CC = 80% Opacity
		}
		else {
			var thumbnailURL = json.thumbnail_url.replace(/\d+x\d+/, width + 'x' + height);
		}

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
