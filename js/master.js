// DISABLE BUTTTON WHEN NO INPUT
$(document).ready(function() {
	$('input').keyup(function() {
		$('#getThumb').attr('disabled', $('input[required]').toArray().some(function(el) {
			return el.value.length == 0;
		}));
	});
	$('#wistiaPlayButtonColor').keyup(function() {
		$('#wistiaPlayButton').attr('disabled', $('#wistiaPlayButtonColor').toArray().some(function(el) {
			return el.value.length == 0;
		}));
	});
});

var $loading = $('#loading').hide();

toastr.options = {
	"newestOnTop": true,
	"progressBar": true,
	"extendedTimeOut": "2500"
}

$(document)
	.ajaxStart(function() {
		$loading.show();
	})
	.ajaxStop(function() {
		$loading.hide();
	});

// SET BUTTON LISTENER
document.getElementById('getThumb').addEventListener('click', getThumbnail);

function getThumbnail() {
	// RESET FIELDS
	$('#dynamic').remove();
	$('#url').text("Thumbnail URL");
	$('#downloadThumb').attr('href', "#");

	// GET / SET VALUES FROM INPUT FIELDS
	var mediaHashedId = $('#wistiaID').val();
	var width = $('#wistiaThumbWidth').val();
	var height = $('#wistiaThumbHeight').val();

	var buttonColor = $('#wistiaPlayButtonColor').val();

	// BUILD CALL TO WISTIA
	function getThumbnailUrl(hashedId, callback) {
		$.getJSON('https://fast.wistia.com/oembed/?url=http://home.wistia.com/medias/' + mediaHashedId + '&format=json&callback=?', callback)
			.fail(function() {
				$('#wistiaID').addClass("invalid");
				toastr.error('Something went wrong. Try again');
			})
			.done(function() {
				$('#wistiaID').removeClass("invalid");
			});
	}

	// PARSE THE JSON FILE FROM WISTIA
	function parseJSON(json) {
		var thumbnailURL;

		if ($('#wistiaPlayButton').is(':checked') && !$('#wistiaPlayButton').is(':disabled') && !$('#wistiaPlayButtonColor').is(':invalid')) {
			thumbnailURL = json.thumbnail_url.replace(/\d+x\d+/, width + 'x' + height) + '&image_play_button=true&image_play_button_color=' + buttonColor + 'CC'; // CC = 80% Opacity
		} else {
			thumbnailURL = json.thumbnail_url.replace(/\d+x\d+/, width + 'x' + height);
		}

		// DISPLAY IMAGE THUMBNAIL
		var thumb = $('<img id="dynamic" class="responsive-img">');

		thumb.attr('src', thumbnailURL);
		thumb.appendTo('#downloadThumb');

		$('#url').text(thumbnailURL);
		$('#downloadThumb').attr('href', thumbnailURL);
	}

	// CALL THE FUNCTIONS TO GET THE ID FROM WISTIA AND THE INPUT FIELD
	getThumbnailUrl(mediaHashedId, parseJSON);
}