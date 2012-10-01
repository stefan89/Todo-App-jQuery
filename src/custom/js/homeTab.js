$("#buttonResetData").bind ("click", function (event)
{
  	areYouSure("Weet u het zeker?", "Ja", function() {
		db.transaction (function (transaction) 
			 {
			   var sqlQuery1 = "DELETE FROM todo";
			   transaction.executeSql (sqlQuery1, undefined, ok, error);
			   
			   var sqlQuery2 = "DELETE FROM persoon";
			   transaction.executeSql (sqlQuery2, undefined, ok, error);
		});
		$.mobile.changePage ($("#pageHome"), { transition: "slide"});
	});
});



$(".pageHomeTekst").append("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis " + 
						"natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, " +
						"pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, " +
						"rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum " +
						"semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, " +
						"dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam " +
						"ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.");

