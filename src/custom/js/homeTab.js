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
		$.mobile.changePage ($("#pageHome"));
	});
});
