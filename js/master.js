// TOASTR OPTIONS
toastr.options = {
	newestOnTop: true,
	progressBar: true,
	extendedTimeOut: '2500'
};

// LISTENERS
$(document).ready(function () {
	// MAKE SURE BUTTON IS ONLY ACTIVE WHEN REQUIRED FIELDS ARE GOOD
	$('input').keyup(function () {
		$('#getThumb').attr('disabled', $('input[required]').toArray().some(function (el) {
			return el.value.length === 0;
		}));
	});

	// RUN calcHeight() FUNCTION WHEN TEXT IS INPUT OR CHECKBOX IS CLICKED
	$('#wistiaThumbWidth').keyup(calcHeight);
	$('#wistiaThumbRatio').click(calcHeight);

	// SET BUTTON LISTENER
	$('#getThumb').click(getThumbnail);
});

// AJAX REQUEST LOADING
var $loading = $('#loading').hide();
$(document)
	.ajaxStart(function () {
		$loading.show();
	})
	.ajaxStop(function () {
		$loading.hide();
	});

// CALCULATE HEIGHT FOR VIDEO BASED ON ASPECT RATIO
function calcHeight() {
	// VARS
	var value = $('#wistiaThumbWidth').val();
	// MATHS
	if ($('#wistiaThumbRatio').is(':checked')) {
		// CALC FOR 16:10
		value *= 1;
		window.valueHeight = Math.round((value / 16) * 10);
	} else {
		// CALC FOR 16:9
		value *= 1;
		window.valueHeight = Math.round((value / 16) * 9);
	}
	// SET HEIGHT TEXT PREVIEW
	$('#wistiaThumbHeight').text(window.valueHeight);
}

// POST CALL TO WISTIA AND BUILD THUMBNAIL AND URL
function getThumbnail() {
	// JQUERY VARS
	var url = $('#wistiaURL');
	var button = $('#wistiaPlayButton');
	var buttoncolor = $('#wistiaPlayButtonColor');
	var thumbUrl = $('#url');
	var downloadThumb = $('#downloadThumb');

	// RESET FIELDS
	$('#dynamic').remove();
	thumbUrl.text('Thumbnail URL');
	downloadThumb.attr('href', '#');

	// GET / SET VALUES FROM INPUT FIELDS
	var mediaHashedId = url.val().match(/medias\/(\w{10})/)[1];
	var width = $('#wistiaThumbWidth').val();
	var buttonColor = buttoncolor.val();

	// BUILD CALL TO WISTIA
	function getThumbnailUrl(hashedId, callback) {
		$.getJSON('https://fast.wistia.com/oembed/?url=http://home.wistia.com/medias/' + mediaHashedId + '&format=json&callback=?', callback)
			.fail(function () {
				url.addClass('invalid');
				toastr.error('Something went wrong. Try again.');
			})
			.done(function () {
				url.removeClass('invalid');
			});
	}

	// PARSE THE JSON FILE FROM WISTIA
	function parseJSON(json) {
		var thumbnailURL;
		var emptyField = false;

		// Check if color field is empty
		if($('#wistiaPlayButtonColor').val() === '')
			emptyField = true;

		if (button.is(':checked') && !buttoncolor.is(':invalid') && !emptyField) {
			// PROCESS COLOR
			buttonColor
			var fixedButtonColor = buttonColor.replace('#','');
			// ADD PLAY BUTTON IN DESIRED COLOR
			thumbnailURL = json.thumbnail_url.replace(/\d+x\d+/, width + 'x' + window.valueHeight) + '&image_play_button=true&image_play_button_color=' + fixedButtonColor + 'CC'; // CC = 80% Opacity
		} else {
			// DISPLAY THUMBNAIL NO PLAY BUTTON
			thumbnailURL = json.thumbnail_url.replace(/\d+x\d+/, width + 'x' + window.valueHeight);
		}

		// DISPLAY IMAGE THUMBNAIL
		var thumb = $('<img id="dynamic" class="responsive-img">');

		thumb.attr('src', thumbnailURL);
		thumb.appendTo(downloadThumb);

		thumbUrl.text(thumbnailURL);
		downloadThumb.attr('href', thumbnailURL);
	}

	// CALL THE FUNCTIONS TO GET THE ID FROM WISTIA AND THE INPUT FIELD
	getThumbnailUrl(mediaHashedId, parseJSON);
}
