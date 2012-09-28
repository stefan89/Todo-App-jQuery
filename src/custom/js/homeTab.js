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
	});
});
