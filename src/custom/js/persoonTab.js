$(function(){  //mobiscroll datepicker
	var datumVandaag = new Date(); 
    var maximaleDatum = new Date(datumVandaag.getFullYear()-18, datumVandaag.getMonth(), datumVandaag.getDate());
	$('#geboorteDatum').scroller({preset: 'date', theme: 'default', display: 'modal', mode: 'scroller', dateOrder: 'yy mm dd', lang: 'de', maxDate: maximaleDatum
    });    
});



$( "#formPersoon" ).validate({
    submitHandler: function(form) {
		$('#buttonVoegPersoonToe').trigger('click');
    }
});

$("#buttonVoegPersoonToe").bind ("click", function (event)
{
  var voorNaam = $("#voorNaam").val();
  var achterNaam = $("#achterNaam").val();
  var geslacht = $("input[name='geslacht']:checked").val();
  var geboorteDatum = $("#geboorteDatum").val();
  var email = $("#email").val();
  var telefoonNummer = $("#telefoonNummer").val();
  
  db.transaction (function (transaction) 
  {
    var sqlQuery = "INSERT INTO persoon (voorNaam, achterNaam, geslacht, geboorteDatum, email, telefoonNummer) VALUES (?, ?, ?, ?, ?, ?)";
    transaction.executeSql (sqlQuery, [voorNaam, achterNaam, geslacht, geboorteDatum, email, telefoonNummer], function ()
    { 
	  succeeded("Succesvol toegevoegd!", "OK", function() {
			showPersonen();
		});
    }, error);
  });
});



function showPersonen()
{
  db.transaction (function (transaction) 
  {
    var sqlQuery = "SELECT * FROM persoon order by UPPER(achterNaam)";
    transaction.executeSql (sqlQuery, undefined, 
    
	function (transaction, result)
    {
	  var html = '<ul id="persoonListview " data-role="listview" + " data-filter="true" + " data-filter-placeholder="Zoek persoon..." >';
	  
      if (result.rows.length) 
      {
        for (var i = 0; i < result.rows.length; i++) 
        {
          var row = result.rows.item (i);
          var voorNaam = row.voorNaam;
          var achterNaam = row.achterNaam;
		  var email = row.email;

			html += "<li data-theme='c'" + "data-name="+ email + " class='listItem'>" +"<a href='#'>" +  "<h3>" + voorNaam + " " + achterNaam + "</h3><p>" + email + "</p></a></li>";	
		}
      }
      else
      {
        html += "<li> Geen Personen gevonden </li>";
      }
      html += "</ul>";
      refreshPage(html,"#pagePersoonLijst");
    }, error);
  });
}



 $("#pagePersoonLijst").live('pageinit', function() {   //Haalt value van clicked listitem op
    $('.listItem').live('click', function(event) {
		 showPersoonDetails($(this).attr('data-name'));
    });  
});

function showPersoonDetails(emailInvoer)
{
  db.transaction (function (transaction) 
  {
	var sqlQuery = "SELECT * FROM persoon where email =" + "'"+ emailInvoer +"'";
	
    transaction.executeSql (sqlQuery, undefined, 
	function (transaction, result)
    {
		  var row = result.rows.item (0);
          var voorNaam = row.voorNaam;
          var achterNaam = row.achterNaam;	
		  var geslacht = row.geslacht;
		  var geboorteDatum = row.geboorteDatum;
		  var email = row.email;
		  var telefoonNummer = row.telefoonNummer;
	
	  var html = "<p>Hieronder vind u detailinformatie van de geselecteerde persoon. </p>";
	  html += "<ul data-role=" + "listview" + " data-inset=" + "true" + " data-theme='c'" +">";
      html += "<li>" + "Voornaam: " + voorNaam + "</li>";
	  html += "<li>" + "Achternaam: " + achterNaam + "</li>";
	  html += "<li>" + "Geslacht: " + geslacht + "</li>";
	  html += "<li>" + "Geboortedatum: " + geboorteDatum + "</li>";
	  html += "<li>" + "Email: " + email + "</li>";
	  html += "<li>" + "Telefoonnummer: " + telefoonNummer + "</li>";
	  html += "</ul>";
	  
	  refreshPage(html,"#pagePersoonDetails");
    }, error);
  });
}