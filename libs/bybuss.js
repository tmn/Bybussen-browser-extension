/*!
 * ByBuss v1.1
 *
 * ByBuss is an Opera Extension made by Tri M. Nguyen (TriMN @ MyOpera)
 * http://trimn.net/
 * http://my.opera.com/trimn/
 * Email: mail@trimn.net
 * 
 * Features:
 * - search the timetable of the busses in Trondheim Norway
 * - all searches are saved locally
 * - search by using history
 *
 */

$(document).ready(function() {
	//localStorage.clear()
	$('#error').width(0);
	$('#error').height(0);
	// when history button clicked
	$('#historyButton').click(function() {
		$('.fadeBackground').css('z-index', '100');
		$('#history').css('z-index', '100');
		
		$('.fadeBackground').addClass('visible');
		$('.fadeBackground').width($(window).width());
		$('.fadeBackground').height($(window).height()-8);
	});
	
	
	// when hit the close button
	$('#historyCloseButton').click(function() {
		historyCloseDialog();
	});
	
	// add click handler for all the elements in the History list
	$('#historyList li a').live('click', function() {
		fillAndSearch($(this).text());
	});
	
	
	// Triggers when clicking the delete button on a post
	$('.delete').live('click', function() {
		$(this).hide('slow');
		$(this).parent().hide('slow');
		localStorage.removeItem(this.id);
	});
	

	// generate custom scroll
	$(function() {
		$('#historyScroll').jScrollPane({
				autoReinitialise: true
		});
	});
	
	
	/* search part */
	$('#ask').live('keypress', function(e) {
		if (e.keyCode == 13 || e.keyCode == 10) {
			handleQuestion($('#ask').val());
		}
	});
	
});






// LocalStroage stuff goes here
var storeSearch = function(query) {
	if (localStorage.getItem('count') == null) {
		localStorage['count'] = 0;
	}
	
	// sjekk om søk allerede ligger inne -> lagre
	if (checkIfItemIsInLocalStorage(query)) {
		localStorage[parseInt(localStorage['count'])] = query;
		$('#historyList').append('<li><a href="#">' + localStorage.getItem(parseInt(localStorage["count"])) + '</a><span class="delete" id="'+parseInt(localStorage["count"])+'" value="'+localStorage.getItem(parseInt(localStorage["count"]))+'">slett</span></li>');
		// count++
		localStorage['count'] = parseInt(localStorage['count']) + 1;
	}
}

/**
* Checks if element is already in local storage
*/
var checkIfItemIsInLocalStorage = function(item) {
	for (key in localStorage) {
		if (localStorage.getItem(key) == item) {
			return false;
		}
	}
	return true;
}

/**
* Fills the history list
*/
var showItemInLocalStorage = function() {
	for (key in localStorage) {
		if (key != 'count' && localStorage.getItem(key) != null) {
			$('#historyList').append('<li><a href="#">' + localStorage.getItem(key) + '</a><span class="delete" id="'+key+'" value="'+localStorage.getItem(key)+'">slett</span></li>');
		}
	}
}

/**
* Fills and triggers search when a record in the History list is clicked
*/
var fillAndSearch = function(query) {
	$('#ask').val(query);
	handleQuestion($('#ask').val());
	historyCloseDialog();
}



/**
* Triggers when close button in History dialog is clicked
*/
var historyCloseDialog = function() {
	$('.fadeBackground').removeClass('visible');
	setTimeout(function() {
		$('.fadeBackground').removeClass('visible');
		setTimeout(function() {
			$('.fadeBackground').css('z-index', '-2');
			$('#history').css('z-index', '-2');
		}, 180);
	}, 180);
}


/**
* Triggers when History button is clicked
*/
var showHistory = function() {
	$('.fadeBackground').addClass('visible');
	$('.fadeBackground').width($(window).width());
	$('.fadeBackground').height($(window).height()-8);
}




/** 
* Error message when search field is empty
*/
var errorMessage = function() {
	var delaytime = 600;
	$('.fadeBackground').css('z-index', '1');
	$('#error').addClass('visible');
	$('#error').width($(window).width());
	$('#error').height($(window).height()-8);
	
	setTimeout(function() {
		$('#error').removeClass('visible');
		setTimeout(function() {
			$('#error').width(0);
			$('#error').height(0);
			$('.fadeBackground').css('z-index', '-5');
		}, delaytime);
	}, delaytime);
	
}




/**
* Sends request to AtB and displays the answer
*/
var handleQuestion = function(question) {
	if (question.length <= 0) {
		errorMessage();
	} else {
		question = question.toLowerCase();
		
		storeSearch(question);
		$('#result').html('Venter på svar fra bussorakelet <img src="images/loader.gif" alt="loader">');
		$.ajax({
			type: 'POST',
			url: 'http://www.atb.no/xmlhttprequest.php?service=routeplannerOracle.getOracleAnswer',
			data: 'question=' + question + '',
			success: function(data) {
				var answerArray 	= new Array();
				var answer 			= (data.replace(/ kl. /gi, ' kl '));
				answerArray 		= answer.split(". ");
				answer 				= "";
				
				for (var i = 0; i < answerArray.length; i++) {
					answer += '<p>' + answerArray[i] + '</p>';
				}
				
				// return the result to #result-field
				$('#result').html(answer);
			}
		});
	}
	
}