$("#pageTodoToevoeg").on('pageshow', function()
{
  html = "";
  db.transaction (function (transaction) 
  {
    var sqlQuery = "SELECT * FROM persoon order by UPPER(achterNaam)";
    transaction.executeSql (sqlQuery, undefined, 
    
	function (transaction, result)
    {
		if (result.rows.length)
		{
			console.log("aa");
			for (var i = 0; i < result.rows.length; i++) 
			{
				var row = result.rows.item (i);
				var voorNaam = row.voorNaam;
				var achterNaam = row.achterNaam;
				var email = row.email;
				
				html += ('<option value="'+ email + '" class="dropDownBlk">'+ voorNaam + " " + achterNaam +'</option>');
			}
					console.log("bb");
					$('#selectPersoon').html(html);
					$("#selectPersoon").selectmenu('refresh', true); 
		}
		else{
			succeeded("Er dient eerst een persoon toegevoegd te worden!", "OK", function() {
				$('.persoonlijstWeergeven').trigger('click');		
			});
		}
    }, error);
  });
});



$( "#formTodo" ).validate({ //valideren ingevulde form data Nieuwe todo
    submitHandler: function(form) {
		$('#buttonVoegTodoToe').trigger('click');
    }
});
$("#buttonVoegTodoToe").bind ("click", function (event) //Todo toevoegen
{
	var korteOmschrijving = $("#korteOmschrijving").val();
	var langeOmschrijving = $("#langeOmschrijving").val();
	var datum = $("#datumOplevering").val();
	var urgentie = $("#urgentie").val();
	var plaatsOplevering = $("#plaats").val();
	var type = $("#type").val();
	var status = "Onderhanden";
	var email = $("#selectPersoon").val();
  
	db.transaction (function (transaction) 
	{
		var sqlQuery = "INSERT INTO todo (korteOmschrijving, langeOmschrijving, datum, status, urgentie, type, plaatsOplevering, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		transaction.executeSql (sqlQuery, [korteOmschrijving, langeOmschrijving, datum, status, urgentie, type, plaatsOplevering, email], function ()
		{
		succeeded("Succesvol toegevoegd!", "OK", function() {
			showTodos("Onderhanden", "Alle");
		});
		}, error);
	});
});


$( "#formTodoWijzig").validate({ //valideren ingevulde form data Nieuwe todo
    submitHandler: function(form) {
		$('#buttonWijzigTodoToe').trigger('click');
    }
});
$("#buttonWijzigTodoToe").bind ("click", function (event) //Todo wijzigen
{
	var todoId = $("#todoIdWijzig").val();
	var korteOmschrijving = $("#korteOmschrijvingWijzig").val();
	var langeOmschrijving = $("#langeOmschrijvingWijzig").val();
	var datum = $("#datumOpleveringWijzig").val();
	var urgentie = $("#urgentieWijzig").val();
	var plaatsOplevering = $("#plaatsWijzig").val();
	var type = $("#typeWijzig").val();
  
	db.transaction (function (transaction) 
	{
		var sqlQuery = 'UPDATE todo SET korteOmschrijving=?, langeOmschrijving=?, datum=?, urgentie=?, plaatsOplevering=?, type=? WHERE todoId=?;';
		transaction.executeSql (sqlQuery, [korteOmschrijving, langeOmschrijving, datum, urgentie, plaatsOplevering, type, todoId], function()
		{
		succeeded("Succesvol gewijzigd!", "OK", function() {
			showTodos("Onderhanden", "Alle");
		});
		}, error);
	});
});



function showTodos(statusInvoer, typeInvoer)
{
	var sqlQuery = ""; 
				
	if(statusInvoer === "Onderhanden" && typeInvoer === "Alle"){
		sqlQuery = "SELECT * FROM todo where status = 'Onderhanden' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}

	else if(statusInvoer === "Afgehandelde" && typeInvoer === "Alle"){
		sqlQuery = "SELECT * FROM todo where status = 'Afgehandeld' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}

	else if(statusInvoer === "Alle" && typeInvoer === "Alle"){
		sqlQuery = "SELECT * FROM todo order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}

	$("#buttonAllTodosWeergeven").addClass('ui-btn-active');
	$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
	$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
			
	db.transaction (function (transaction) 
	{
	transaction.executeSql (sqlQuery, undefined, 

		function (transaction, result)
		{
		  var html = '<ul id="OnderhandenTodoListview " data-role="listview" + " class="todoListView" + data-filter="true" + " data-filter-placeholder="Zoek to-do..." + data-name=' + statusInvoer + '>';
		  
		  if (result.rows.length) 
		  {
			for (var i = 0; i < result.rows.length; i++) 
			{
			  var row = result.rows.item (i);
			  var todoId = row.todoId;
			  var korteOmschrijving = row.korteOmschrijving;
			  var status = row.status;
			  var datum = row.datum;
			  var type = row.type;
			  var urgentie = row.urgentie;
			  var email = row.email;
			
			  html +="<li data-theme='c'" + "data-name="+ todoId + " class='listItemOnderhandenTodo'>" 
			  html += "<h3><strong>" + korteOmschrijving + "</strong></h3>" + "<a href='#'>";
			  html += "<p> Email persoon: <strong>" + email + "</strong></p>";
			  html += "<p> Type: <strong>" + type + "</strong> - Status:<strong>  "+ status +"</strong></p>";
			  html += "<p> Urgentie: <strong>" + urgentie + "</strong></p>";
			  html += "<p>Datum: <strong>" + datum + "</strong></p>";
			  html += "</a></li>";
			}
		  }
		  else
		  {
              html += "<li data-theme='c'> Geen todo's gevonden met deze status en type </li>";
		  }
		  html += "</ul>";
		  	  
		  $("#pageTodoLijst").unbind ().bind ("pagebeforeshow", function ()
		  {
			$("#pageTodoLijstH1").html(statusInvoer +" todo's");
			var content = $("#pageTodoLijst div:jqmData(role=content)");
			content.html (html);
			var ul = content.find ("ul");
			ul.listview ();
		  });
			$.mobile.changePage ($("#pageTodoLijst"), { transition: "none"});
		}, error);
  });
}

	
$("#buttonAllTodosWeergeven").bind("click", function ()
{
		var status = $(".todoListView").attr('data-name');
		refreshTodoList("Alle", status);
		$(this).addClass('ui-btn-active');
		$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
});
$("#buttonPriveTodosWeergeven").bind("click", function ()
{		
		var status = $(".todoListView").attr('data-name');
		refreshTodoList("Prive", status);
		$(this).addClass('ui-btn-active');
		$("#buttonAllTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
});	
$("#buttonZakelijkeTodosWeergeven").bind("click", function ()
{
		var status = $(".todoListView").attr('data-name');
		refreshTodoList("Zakelijk", status);
		$(this).addClass('ui-btn-active');
		$("#buttonAllTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
});	
	

function refreshTodoList(typeInvoer, statusInvoer)
{	
	var sqlQuery = ""; 
				
	if(statusInvoer === "Onderhanden" && typeInvoer === "Alle"){
		sqlQuery = "SELECT * FROM todo where status = 'Onderhanden' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
	
	else if(statusInvoer === "Onderhanden" && typeInvoer === "Prive"){
		sqlQuery = "SELECT * FROM todo where status = 'Onderhanden' and type = 'Prive' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
	
	else if(statusInvoer === "Onderhanden" && typeInvoer === "Zakelijk"){
		sqlQuery = "SELECT * FROM todo where status = 'Onderhanden' and type = 'Zakelijk' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
	
	else if(statusInvoer === "Afgehandelde" && typeInvoer === "Alle"){
		sqlQuery = "SELECT * FROM todo where status = 'Afgehandeld' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
	
	else if(statusInvoer === "Afgehandelde" && typeInvoer === "Prive"){
		sqlQuery = "SELECT * FROM todo where status = 'Afgehandeld' and type = 'Prive' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
	
	else if(statusInvoer === "Afgehandelde" && typeInvoer === "Zakelijk"){
		sqlQuery = "SELECT * FROM todo where status = 'Afgehandeld' and type = 'Zakelijk' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
	
	else if(statusInvoer === "Alle" && typeInvoer === "Alle"){
		sqlQuery = "SELECT * FROM todo order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
	
	else if(statusInvoer === "Alle" && typeInvoer === "Prive"){
		sqlQuery = "SELECT * FROM todo where type = 'Prive' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
	
	else if(statusInvoer === "Alle" && typeInvoer === "Zakelijk"){
		sqlQuery = "SELECT * FROM todo where type = 'Zakelijk' order by substr(datum,7)||substr(datum,4,2)||substr(datum,1,2)";
	}
				
	db.transaction (function (transaction) 
	{
	transaction.executeSql (sqlQuery, undefined, 
	
		function (transaction, result)
		{
		  var html = "";
		  
		  if (result.rows.length)  
		  {
			for (var i = 0; i < result.rows.length; i++) 
			{
			  var row = result.rows.item (i);
			  var todoId = row.todoId;
			  var korteOmschrijving = row.korteOmschrijving;
			  var status = row.status;
			  var datum = row.datum;
			  var type = row.type;
			  var urgentie = row.urgentie;
			  var email = row.email;
			
			  html += "<li data-theme='c'" + "data-name="+ todoId + " class='listItemOnderhandenTodo'>"; 
			  html += "<h3><strong>" + korteOmschrijving + "</strong></h3>" + "<a href='#'>";
			  html += "<p> Email persoon: <strong>" + email + "</strong></p>";
			  html += "<p> Type: <strong>" + type + "</strong> - Status:<strong>  "+ status +"</strong></p>";
			  html += "<p> Urgentie: <strong>" + urgentie + "</strong></p>";
			  html += "<p>Datum: <strong>" + datum + "</strong></p>";
			  html += "</a></li>";
			}
		  }
		  else 
		  {
			html += "<li data-theme='c'> Geen todo's gevonden met deze status en type </li>";
		  }
			$('.todoListView').html(html);
			$(".todoListView").listview('refresh');
		}, error);
	}); 
}



$("#pageTodoLijst").live('pageinit', function() {   //Haalt value van clicked listitem op
    $('.listItemOnderhandenTodo').live('click', function(e) {
		 showTodoDetails($(this).attr('data-name'));
    });  
});

function showTodoDetails(todoIdInvoer)
{
  db.transaction (function (transaction) 
  {
	var sqlQuery = "SELECT * FROM todo where todoId =" + "'"+ todoIdInvoer +"'";
	
    transaction.executeSql (sqlQuery, undefined, 
	function (transaction, result)
    {
		  var row = result.rows.item (0);
		  var todoId = row.todoId;
		  var email = row.email;
          var korteOmschrijving = row.korteOmschrijving;
		  var langeOmschrijving = row.langeOmschrijving;
		  var datum = row.datum;
		  var urgentie = row.urgentie;
		  var plaatsOplevering = row.plaatsOplevering;
		  var type = row.type;
		  var status = row.status;
		    
	  var html = "<p>Hieronder vind u detailinformatie van de geselecteerde to-do. </p>";

	  html += "<ul data-role=" + "listview" + " class='listviewDetailsTodo'" +" data-inset=" + "true" + " data-theme='c'" + " data-name="+ todoId + " data-name2="+ plaatsOplevering+ " >";
	  html += "<li>" + "E-mail persoon: " +  email +"</li>";
      html += "<li>" + "Korte omschrijving: " + korteOmschrijving + "</li>";
	  html += "<li>" + "Lange omschrijving: " + langeOmschrijving + "</li>";
	  html += "<li>" + "Datum: " + datum + "</li>";
	  html += "<li>" + "Urgentie: " + urgentie + "</li>";
	  html += "<li>" + "Plaats: " + plaatsOplevering + "</a></li>";
	  html += "<li>" + "Type: " + type + "</li>";
	  html += "<li>" + "Status: " + status + "</li>";
	  html += "</a></ul>";
	  
      $("#pageTodoDetails").unbind ().bind ("pagebeforeshow", function ()
      {
		var buttonOpenPlaats = $("#buttonOpenPlaats");
		var buttonTodoAfgehandeld = $("#buttonTodoAfgehandeld");
		
        var content = $("#pageTodoDetails div:jqmData(role=content)");
        content.html (html);
		content.append(buttonOpenPlaats);
		content.append(buttonTodoAfgehandeld);
		
		if(status === "Afgehandeld"){
			$("#buttonTodoAfgehandeld").hide();
			$("#buttonVerwijderTodo").hide();
			$("#buttonWijzigTodo").hide();
		}
		else{
			$("#buttonTodoAfgehandeld").show();
			$("#buttonVerwijderTodo").show();
			$("#buttonWijzigTodo").show();
		}
        var ul = content.find ("ul");
        ul.listview ();
      });
        $.mobile.changePage ($("#pageTodoDetails"), { transition: "none"});
	}, error);
  });
}



function wijzigTodo(todoIdInvoer)
{
  db.transaction (function (transaction) 
  {
	var sqlQuery = "SELECT * FROM todo where todoId =" + "'"+ todoIdInvoer +"'";
	
    transaction.executeSql (sqlQuery, undefined, 
    
	function (transaction, result)
    {
		  var row = result.rows.item (0);
          var korteOmschrijving = row.korteOmschrijving;
		  var langeOmschrijving = row.langeOmschrijving;
		  var datum = row.datum;
		  var urgentie = row.urgentie;
		  var plaatsOplevering = row.plaatsOplevering;
		  var type = row.type;
		  
      $("#pageTodoWijzig").unbind ().bind ("pagebeforeshow", function ()
      {
			$("#todoIdWijzig").val(todoIdInvoer);
			$("#korteOmschrijvingWijzig").val(korteOmschrijving);
			$("#langeOmschrijvingWijzig").val(langeOmschrijving);
			$("#datumOpleveringWijzig").val(datum);
			$("#urgentieWijzig").val(urgentie);
			$("#plaatsWijzig").val(plaatsOplevering);
			$("#typeWijzig").val(type);
			$("#todoIdWijzig").hide();
      });
        $.mobile.changePage ($("#pageTodoWijzig"), { transition: "none"});
	}, error);
  });
}



$("#pageTodoDetails").live('pageinit', function() { //Todo detailpagina button 'handlers'
    
	$('#buttonVerwijderTodo').live('click', function(event) {  // VERWIJDER SPECIFIEKE TO-DO
		 var todoId = $(".listviewDetailsTodo").attr('data-name'); //Haalt value van te verwijderen todo op (detailView)
		 areYouSure("Weet u het zeker?", "Ja", function() {
			db.transaction (function (transaction) 
				{
					var sqlQuery = "DELETE FROM todo WHERE todoId = " + todoId;
									
					transaction.executeSql (sqlQuery, undefined, ok, error);
				});
			showTodos('Alle', 'Alle');
		});
    });  
	
	$('#buttonWijzigTodo').live('click', function(event) {  // WIJZIG SPECIFIEKE TO-DO
		var todoId = $(".listviewDetailsTodo").attr('data-name'); //Haalt value van te verwijderen todo op (detailView)
		wijzigTodo(todoId);
    });  
	
	$('#buttonTodoAfgehandeld').live('click', function(event) { // Wijzig status van to-do naar afgehandeld
		 var todoId = $(".listviewDetailsTodo").attr('data-name'); //Haalt value van te verwijderen todo op (detailView)
		 areYouSure("Weet u het zeker?", "Ja", function() {
			db.transaction (function (transaction) 
				{
					var sqlQuery = "UPDATE todo SET status = 'Afgehandeld' where todoId = " + todoId;
									
					transaction.executeSql (sqlQuery, undefined, ok, error);
				});
			showTodos('Afgehandelde', 'Alle');
		});
    });

	$('#buttonOpenPlaats').live('click', function(event) { // Open Google maps view
		var plaatsInvoer = $(".listviewDetailsTodo").attr('data-name2');	
		$("#pageTodoMaps").unbind ().bind ("pagebeforeshow", function ()
		{
			$('#map_canvas').gmap('search', { 'address': plaatsInvoer}, function(results, status) {
				if ( status === 'OK' ) {
							$('#map_canvas').gmap('get', 'map').panTo(results[0].geometry.location);
							var zoom= $('#map_canvas').gmap('option', 'zoom');
							$('#map_canvas').gmap('option', 'zoom', 12);
							$('#map_canvas').gmap('refresh');
				}
			});
		});	
		$.mobile.changePage ($('#pageTodoMaps'), { transition: "none"});
	}); 
});