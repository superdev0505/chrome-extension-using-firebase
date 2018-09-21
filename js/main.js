



chrome.storage.sync.get(['uxuicorn_show_type'], function(result) {
	var show_type = result.uxuicorn_show_type;
	if (show_type == "extension") {
		window.location.href = 'https://www.google.com' ;
	}
	else {

		load_post();
	}
});


function load_post() {
	var config = {
		apiKey: "AIzaSyBDmZsXrDi6xnUeu_fXmoHh0StKjYCthvk",
		authDomain: "uxunicorns-fca1e.firebaseapp.com",
		databaseURL: "https://uxunicorns-fca1e.firebaseio.com",
		projectId: "uxunicorns-fca1e",
		storageBucket: "uxunicorns-fca1e.appspot.com",
		messageingSenderId: "752488928557"
	};

	function sortbydate(a, b) {
		if(a.create_date == b.create_date){
	    return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
	  }

	  return a.create_date > b.create_date ? -1 : 1;
	}

	function sortbydate_category(a, b) {
		if(a.created_date == b.created_date){
	    return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
	  }

	  return a.created_date > b.created_date ? -1 : 1;
	}

	function reorder_for_new_job(arr, pos) {
		var temp;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].id == 4) {
				temp = arr[i];
				if (i > pos) {
					for (var j = i; j > pos; j --) {
						arr[j] = arr[j - 1];
					}
				}
				else if(i < pos) {
					for (var j = i; j < pos; j ++) {
						arr[j] = arr[j + 1];
					}
				}
				arr[pos] = temp;
				break;
			}

		}
		return arr;
	}

	function getsite(url) {
		let start = url.indexOf("://");
		if(start == -1) start = 0;
		else start += 3;
		let end = url.indexOf("/", start);
		let result ="";
		if (end == -1)  result = url.substring(start);
		else result = url.substring(start, end);
		return result;
	}
	function sort_category_by_post(category, posts) {
		var temp = [];
		for (var i = 0; i <= category.length; i++) {
			temp[i] = 0;
		}
		var result = [];
		var cnt = 0;
		var i;
		for (i = 0; i < posts.length; i++) {
			if(temp[posts[i].category_id] == 0) {
				for (var j = 0; j < category.length; j ++) {
					if(category[j].id == posts[i].category_id) {
						result.push(category[j])
						cnt ++;
						temp[posts[i].category_id] = 1;
						break;
					}
				}
			}
			else {
				continue;
			}
			if (cnt == category.length) break;
		}
		if(cnt < category.length) {
			for(i = 0; i < category.length; i ++) {
				if(temp[category[i].id] == 0) {
					result.push(category[i]);
					temp[category[i].id] = 1;
					cnt ++;
				}
				else {
					continue;
				}
				if (cnt == category.length) break;
			}
		}
		return result;
	}

	function getrandomdelay() {
		return Math.floor(Math.random() * 1000);
	}

	firebase.initializeApp(config);
	var firedata = firebase.database();
	var posts = [];
	var category = [];
	var new_job_position = 5;
	if($(window).width() < 1063) {
		new_job_position=1;
	}
	else if($(window).width() < 1423) {
		new_job_position=2;
	}
	else if($(window).width() < 1783) {
		new_job_position=3;
	}
	else if($(window).width() < 2143) {
		new_job_position=4;
	}
	else {
		new_job_position = 5;
	}
	firedata.ref('/category').once('value').then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			category.push(childSnapshot.val())
		});
		category.sort(sortbydate_category);
		firedata.ref('/posts').once('value').then(function(snapshot) {
			// console.log(snapshot);
			chrome.storage.sync.set({'uxuicorn_post_count': snapshot.numChildren()});
			chrome.browserAction.setBadgeText({text: ""});
			snapshot.forEach(function(childSnapshot) {
				posts.push(childSnapshot.val())
			});
			posts.sort(sortbydate);
			category = sort_category_by_post(category, posts);
			category = reorder_for_new_job(category, new_job_position);
			for (var i = 0; i < category.length; i += (new_job_position + 1)) {
				var result = '<div class="row" >';
				for (var j = 0; j < (new_job_position + 1); j ++) {
					if (i + j >= category.length) break;
					result += '<div class="ad-card-div">';
					if (j % 2 == 0) {
						if(category[i+j].id != 4) {
							result += '<div class="image-card ad-card-2" style="background-image: url('+category[i+j].img_link+')">';
							result += '<a class="image-card-link" href="'+category[i+j].post_link+'"></a>';
							result += '</div>';
							result += '<div class="title-card ad-card-3" style="background:linear-gradient(160deg, ' + category[i+j].color1 + ', ' + category[i+j].color2 + ')">';
						}
						else {
							result += '<div class="image-card ad-card-2 new-job-div" style="background-image: url('+category[i+j].img_link+')">';
							result += '<a class="image-card-link" href="'+category[i+j].post_link+'"></a>';
							result += '</div>';
							result += '<div class="title-card ad-card-3 new-job-div" style="background:linear-gradient(160deg, ' + category[i+j].color1 + ', ' + category[i+j].color2 + ')">';
						}
						result += '<div class="ad-mail-to"><a href="mailto:hello@uxunicorns.club?subject='+category[i+j].title+'">'+category[i+j].cat_text+'</a></div>';
						result += '<h1 class="title-h1">'+category[i+j].title+'</h1>'
						var flag = 0;
						for (var k = 0; k < posts.length; k++) {
							if (posts[k].category_id == category[i+j].id) {
								flag ++;
								result += '<div class="post-div">';
								result += '<a class="post-link" href="'+posts[k].link+'"><p class="post-title">'+posts[k].title+'</p><span>'+getsite(posts[k].link)+'</span></a>';
								result += '</div>';
								if (flag == 2 && category[i+j].id != 4) {
									result += '<div class="post-hidden-layout">';
								}
							}

							if (flag == 5) {
								if(category[i+j].id != 4) result += '</div>';
								break;
							}
						}
						if (flag >=2 && flag < 5 && category[i+j].id != 4) {result += '</div>';}
						if (category[i+j].id != 4) {result += '<div class="more-div"> <span class="more-button">More</span> </div>';}
						else {result += '<div class="more-div"> <span class="more-button">Close</span> </div>';}
						result += '</div>';
					}
					else {
						if(category[i+j].id != 4) {
							result += '<div class="title-card ad-card-3" style="background:linear-gradient(160deg, ' + category[i+j].color1 + ', ' + category[i+j].color2 + ')">';
						} else {
							result += '<div class="title-card ad-card-3 new-job-div" style="background:linear-gradient(160deg, ' + category[i+j].color1 + ', ' + category[i+j].color2 + ')">';
						}
						result += '<div class="ad-mail-to"><a href="mailto:mailto:hello@uxunicorns.club?subject='+category[i+j].title+'">'+category[i+j].cat_text+'</a></div>';
						result += '<h1 class="title-h1">'+category[i+j].title+'</h1>'
						var flag = 0;
						for (var k = 0; k < posts.length; k++) {
							if (posts[k].category_id == category[i+j].id) {
								flag ++;
								result += '<div class="post-div">';
								result += '<a class="post-link" href="'+posts[k].link+'"><p class="post-title">'+posts[k].title+'</p><span>'+getsite(posts[k].link)+'</span></a>';
								result += '</div>';
								if (flag == 2 && category[i+j].id != 4) {
									result += '<div class="post-hidden-layout">';
								}
							}

							if (flag == 5) {
								if(category[i+j].id != 4) result += '</div>';
								break;
							}
						}
						if (flag >=2 && flag < 5 && category[i+j].id != 4) {result += '</div>';}
						if (category[i+j].id != 4) {result += '<div class="more-div"> <span class="more-button">More</span> </div>';}
						else {result += '<div class="more-div"> <span class="more-button">Close</span> </div>';}
						result += '</div>';
						if(category[i+j].id != 4) {
							result += '<div class="image-card ad-card-2" style="background-image: url('+category[i+j].img_link+')">';
							result += '<a class="image-card-link" href="'+category[i+j].post_link+'"></a>';
							result += '</div>';
						}
						if(category[i+j].id == 4) {
							result += '<div class="image-card ad-card-2 new-job-div" style="background-image: url('+category[i+j].img_link+')">';
							result += '<a class="image-card-link" href="'+category[i+j].post_link+'"></a>';
							result += '</div>';
						}


					}
					result += '</div>';
				}
				result += '</div>';
				//$(".template-div").hide();
				$("#main-content").append(result);
			}
			$('.post-div').click(function(){
				url = $('a',$(this)).attr('href');
				window.location.href = url;
			});
			$('.more-div').click(function() {
				if($('.more-button', $(this)).text() == 'More') {
					$('.more-button', $(this)).text('Close');
					$('.image-card', $(this).parent().parent()).animate({'height': '0px'}, 300);
					$('.post-hidden-layout', $(this).parent()).show();
					$(this).parent().animate({'height': '916px'}, 300);
				}
				else {
					$('.more-button', $(this)).text('More');
					$('.image-card', $(this).parent().parent()).animate({'height': '360px'}, 300);
					$('.post-hidden-layout', $(this).parent()).hide();
					$(this).parent().animate({'height': '556px'}, 300);
				}
			});

			$(".ad-card-2").each(function() {$(this).delay(getrandomdelay()).animate({"opacity": "1"}, 500)});
			$(".ad-card-3").each(function() {$(this).delay(getrandomdelay()).animate({"opacity": "1"}, 500)});
			$(".template-div").delay(1600).animate({"opacity": "0"}, 500);
		});
	});

	$("#idOfUl").on( 'scroll', function(){
	   console.log('Event Fired');
	});



	var targetOffset = $(document).height() + 916;
	console.log(targetOffset+', '+$(document).height())

	$(document).bind('scroll', function() {
	  if ($(window).scrollTop() > targetOffset) { // apply any filtering condition
	      $('.fab-icon').css('bottom', '104px');
	      $('.fab-icon').css('transform', 'rotate(180deg)');
	    } else {
	      $('.fab-icon').css('bottom', '20px');
	      $('.fab-icon').css('transform', 'rotate(0deg)');
	    }
	});



	$(document).ready(function() {
		$('.fab-btn').click(function() {
			var n = $(document).height();
			var scrollPosition = 916 + $(window).scrollTop();
			var scrollval = scrollPosition;
			if(n < scrollPosition) {
				scrollval = 0;
			}

			$('html, body').animate({scrollTop: scrollval + 'px'}, 200);
		});

	});
}

//alert(category);
