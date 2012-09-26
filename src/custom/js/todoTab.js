$("#pageTodoToevoeg").live('pageinit', function()
{
  db.transaction (function (transaction) 
  {
    var sql = "SELECT * FROM persoon";
    transaction.executeSql (sql, undefined, 
    
	function (transaction, result)
    {
		if (result.rows.length)
		{
			for (var i = 0; i < result.rows.length; i++) 
			{
				var row = result.rows.item (i);
				var voorNaam = row.voorNaam;
				var achterNaam = row.achterNaam;
				var email = row.email;
		 
				$('#selectPersoon').append('<option value="'+ email + '" class="dropDownBlk">'+ voorNaam + " " + achterNaam +'</option>');
			}
		}
		$("#selectPersoon").selectmenu('refresh', true); 
    }, error);
  });
});



$( "#formTodo" ).validate({ //valideren ingevulde form data
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
		var sql = "INSERT INTO todo (korteOmschrijving, langeOmschrijving, datum, status, urgentie, type, plaatsOplevering, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		transaction.executeSql (sql, [korteOmschrijving, langeOmschrijving, datum, status, urgentie, type, plaatsOplevering, email], function ()
    {
		alert ("Todo toegevoegd");
    }, error);
		showTodos("Onderhanden", "Alle");
	});
});

	
function showTodos(statusInvoer, typeInvoer)
{
	var sql = ""; 
				
	if(statusInvoer === "Onderhanden" && typeInvoer === "Alle"){
		sql = "SELECT * FROM todo where status = 'Onderhanden' order by datum";
	}

	if(statusInvoer === "Afgehandelde" && typeInvoer === "Alle"){
		sql = "SELECT * FROM todo where status = 'Afgehandeld' order by datum";
	}

	if(statusInvoer === "Alle" && typeInvoer === "Alle"){
		sql = "SELECT * FROM todo order by datum";
	}

	$("#buttonAllTodosWeergeven").addClass('ui-btn-active');
	$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
	$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
			
	db.transaction (function (transaction) 
	{
	transaction.executeSql (sql, undefined, 

		function (transaction, result)
		{
		  var html = '<ul id="OnderhandenTodoListview " data-role="listview" + " class="OnderhoudenListView" + data-filter="true" + " data-filter-placeholder="Zoek to-do..." + data-name=' + statusInvoer + '>';
		  
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
			html += "<li> Geen todo's gevonden met deze status en type </li>";
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
			$.mobile.changePage ($("#pageTodoLijst"), { transition: "slide"});
		  
		}, error);
  });
}

	
$("#buttonAllTodosWeergeven").bind("click", function ()
{
		var status = $(".OnderhoudenListView").attr('data-name');
		refreshOnderhoudenTodoList("Alle", status);
		$(this).addClass('ui-btn-active');
		$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
});
$("#buttonPriveTodosWeergeven").bind("click", function ()
{		
		var status = $(".OnderhoudenListView").attr('data-name');
		refreshOnderhoudenTodoList("Prive", status);
		$(this).addClass('ui-btn-active');
		$("#buttonAllTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
});	
$("#buttonZakelijkeTodosWeergeven").bind("click", function ()
{
		var status = $(".OnderhoudenListView").attr('data-name');
		refreshOnderhoudenTodoList("Zakelijk", status);
		$(this).addClass('ui-btn-active');
		$("#buttonAllTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
});	
	

function refreshOnderhoudenTodoList(typeInvoer, statusInvoer)
{	
	var sql = ""; 
				
	if(statusInvoer === "Onderhanden" && typeInvoer === "Alle"){
		sql = "SELECT * FROM todo where status = 'Onderhanden' order by datum";
	}
	
	if(statusInvoer === "Onderhanden" && typeInvoer === "Prive"){
		sql = "SELECT * FROM todo where status = 'Onderhanden' and type = 'Prive' order by datum";
	}
	
	if(statusInvoer === "Onderhanden" && typeInvoer === "Zakelijk"){
		sql = "SELECT * FROM todo where status = 'Onderhanden' and type = 'Zakelijk' order by datum";
	}
	
	if(statusInvoer === "Afgehandelde" && typeInvoer === "Alle"){
		sql = "SELECT * FROM todo where status = 'Afgehandeld' order by datum";
	}
	
	if(statusInvoer === "Afgehandelde" && typeInvoer === "Prive"){
		sql = "SELECT * FROM todo where status = 'Afgehandeld' and type = 'Prive' order by datum";
	}
	
	if(statusInvoer === "Afgehandelde" && typeInvoer === "Zakelijk"){
		sql = "SELECT * FROM todo where status = 'Afgehandeld' and type = 'Zakelijk' order by datum";
	}
	
	if(statusInvoer === "Alle" && typeInvoer === "Alle"){
		sql = "SELECT * FROM todo order by datum";
	}
	
	if(statusInvoer === "Alle" && typeInvoer === "Prive"){
		sql = "SELECT * FROM todo where type = 'Prive' order by datum";
	}
	
	if(statusInvoer === "Alle" && typeInvoer === "Zakelijk"){
		sql = "SELECT * FROM todo where type = 'Zakelijk' order by datum";
	}
				
	db.transaction (function (transaction) 
	{
	transaction.executeSql (sql, undefined, 
	
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
			html += "<li> Geen todo's gevonden met deze status en type </li>";
		  }
			$('.OnderhoudenListView').html(html);
			$(".OnderhoudenListView").listview('refresh');
		}, error);
	}); 
}



$("#pageTodoLijst").live('pageinit', function() {   //Haalt value van clicked listitem op
    $('.listItemOnderhandenTodo').live('vclick', function(e) {
		 showTodoDetails($(this).attr('data-name'));
    });  
});

function showTodoDetails(todoIdInvoer)
{
  db.transaction (function (transaction) 
  {
	var sql = "SELECT * FROM todo where todoId =" + "'"+ todoIdInvoer +"'";
	
    transaction.executeSql (sql, undefined, 
    
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

	  html += "<ul data-role=" + "listview" + " class='listviewDetailsTodo'" +" data-inset=" + "true" + " data-theme='f'" + " data-name="+ todoId + " data-name2="+ plaatsOplevering+ " >";
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
        $.mobile.changePage ($("#pageTodoDetails"), { transition: "slide"});
	}, error);
  });
}




$("#pageTodoDetails").live('pageinit', function() {   
    
	$('#buttonVerwijderTodo').live('vclick', function(event) {  // VERWIJDER SPECIFIEKE TO-DO
		 var todoId = $(".listviewDetailsTodo").attr('data-name'); //Haalt value van te verwijderen todo op (detailView)
		 
		 $(this).simpledialog({'mode' : 'bool', 'prompt' : 'Zeker?', 'useModal': true,
			'buttons' : {
			  'Ja': {
				click: function () {
				  $('#dialogoutput').text('OK');
					db.transaction (function (transaction) 
					{
						var sql = "DELETE FROM todo WHERE todoId = " + todoId;
									
						transaction.executeSql (sql, undefined, ok, error);
					});
					showTodos('Alle', 'Alle');
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
		  });
    });  
	
	$('#buttonTodoAfgehandeld').live('vclick', function(event) { // Wijzig status van to-do naar afgehandeld
		 var todoId = $(".listviewDetailsTodo").attr('data-name'); //Haalt value van te verwijderen todo op (detailView)
		 
		 $(this).simpledialog({'mode' : 'bool', 'prompt' : 'To-do afgehandeld?', 'useModal': true,
			'buttons' : {
			  'Ja': {
				click: function () {
				  $('#dialogoutput').text('OK');
					db.transaction (function (transaction) 
					{
						var sql = "UPDATE todo SET status = 'Afgehandeld' where todoId = " + todoId;
									
						transaction.executeSql (sql, undefined, ok, error);
					});
					showTodos('Afgehandelde', 'Alle');
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
		  });
    }); 

	$('#buttonOpenPlaats').live('vclick', function(event) { // Open Google maps view
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
		 $.mobile.changePage ($('#pageTodoMaps'), { transition: "slide"});
	}); 
});