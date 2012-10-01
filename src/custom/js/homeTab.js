$("#buttonResetData").bind ("click", function (event)
{
  	areYouSure("Weet u het zeker?", "Ja", function() {
		db.transaction (function (transaction) 
			 {
			   var sql1 = "DELETE FROM todo";
			   transaction.executeSql (sql1, undefined, ok, error);
			   
			   var sql2 = "DELETE FROM persoon";
			   transaction.executeSql (sql2, undefined, ok, error);
		});
		$.mobile.changePage ($("#pageHome"), { transition: "slide"});
	});
});


var	carousel,
	el,
	i,
	page,
	slides = [
		'<strong>Swipe</strong> to know more &gt;&gt;&gt;<br>Or scroll down for <em>Lorem Ipsum</em>',
		'1. A robot may not injure a human being or, through inaction, allow a human being to come to harm.',
		'2. A robot must obey the orders given to it by human beings, except where such orders would conflict with the First Law.',
		'3. A robot must protect its own existence as long as such protection does not conflict with the First or Second Laws.'
	];

carousel = new SwipeView('#wrapper', {
	numberOfPages: slides.length,
	hastyPageFlip: true
});

// Load initial data
for (i=0; i<3; i++) {
	page = i==0 ? slides.length-1 : i-1;

	el = document.createElement('span');
	el.innerHTML = slides[page];
	carousel.masterPages[i].appendChild(el)
}

carousel.onFlip(function () {
	var el,
		upcoming,
		i;

	for (i=0; i<3; i++) {
		upcoming = carousel.masterPages[i].dataset.upcomingPageIndex;

		if (upcoming != carousel.masterPages[i].dataset.pageIndex) {
			el = carousel.masterPages[i].querySelector('span');
			el.innerHTML = slides[upcoming];
		}
	}
});
