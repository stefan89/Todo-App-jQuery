$("#buttonResetData").bind ("click", function (event)
{
    $(this).simpledialog({'mode' : 'bool','prompt' : 'Zeker?','useModal': true, 
	'buttons' : {
      'Ja': {
        click: function () {
          $('#dialogoutput').text('OK');
		    db.transaction (function (transaction) 
			 {
			   var sql1 = "DELETE FROM todo";
			   transaction.executeSql (sql1, undefined, ok, error);
			   
			   var sql2 = "DELETE FROM persoon";
			   transaction.executeSql (sql2, undefined, ok, error);
			 });
        },
		theme: "c"
      },
      'Nee': {
        click: function () {
          $('#dialogoutput').text('Cancel');
        },
        icon: "delete",
        theme: "a"
      }
    }
  })
});