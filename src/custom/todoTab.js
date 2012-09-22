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
		//refresh select menu
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
		showOnderhandenTodos("Alle");
	});
});

	
function showOnderhandenTodos(typeInvoer)
{
	//$('#buttonAllTodosWeergeven').trigger('click');      NIET VERWIJDEREN - nog uitzoeken of dit wel beste manier of is deze uncommenten en onderstaande 3 regels commenten.
	$("#buttonAllTodosWeergeven").addClass('ui-btn-active');
	$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
	$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
	
	var sql = "SELECT * FROM todo where status = 'Onderhanden' order by datum"; 
			
	db.transaction (function (transaction) 
	{
	transaction.executeSql (sql, undefined, 

		function (transaction, result)
		{
		  var html = '<ul id="OnderhandenTodoListview " data-role="listview" + " class="OnderhoudenListView" + data-filter="true" + " data-filter-placeholder="Zoek to-do..." >';
		  
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
			  html += "<p> Type: <strong>" + type + "</strong></p>";//html += "<p class='ui-li-aside'><strong>" + datum + "</strong></p>";
			  html += "<p> Email persoon: <strong>" + email + "</strong></p>";
			  html += "<p> Urgentie: <strong>" + urgentie + "</strong></p>";
			  html += "<p>Datum: <strong>" + datum + "</strong></p>";
			  html += "</a></li>";
			}
		  }
		  else 
		  {
			html += "<li> Geen onderhanden todo's gevonden </li>";
		  }
		  html += "</ul>";
		  refreshPage(html,"#pageTodoLijstOnderhanden");
		}, error);
  });
}

	
$("#buttonAllTodosWeergeven").bind("click", function ()
{
		refreshOnderhoudenTodoList("Alle");
		$(this).addClass('ui-btn-active');
		$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
});
$("#buttonPriveTodosWeergeven").bind("click", function ()
{
		refreshOnderhoudenTodoList("Prive");
		$(this).addClass('ui-btn-active');
		$("#buttonAllTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonZakelijkeTodosWeergeven").removeClass('ui-btn-active');
});	
$("#buttonZakelijkeTodosWeergeven").bind("click", function ()
{
		refreshOnderhoudenTodoList("Zakelijk");
		$(this).addClass('ui-btn-active');
		$("#buttonAllTodosWeergeven").removeClass('ui-btn-active');
		$("#buttonPriveTodosWeergeven").removeClass('ui-btn-active');
});	
	

function refreshOnderhoudenTodoList(typeInvoer)
{	
	if(typeInvoer === "Alle"){
		sql = "SELECT * FROM todo where status = 'Onderhanden' order by datum";
	}
	
	if(typeInvoer === "Prive"){
		sql = "SELECT * FROM todo where status = 'Onderhanden' and type = 'Prive' order by datum";
	}
	
	if(typeInvoer === "Zakelijk"){
		sql = "SELECT * FROM todo where status = 'Onderhanden' and type = 'Zakelijk' order by datum";
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
			  html += "<p> Type: <strong>" + type + "</strong></p>";
			  html += "<p> Email persoon: <strong>" + email + "</strong></p>";
			  html += "<p> Urgentie: <strong>" + urgentie + "</strong></p>";
			  html += "<p>Datum: <strong>" + datum + "</strong></p>";
			  html += "</a></li>";
			}
		  }
		  else 
		  {
			html += "<li> Geen onderhanden todo's gevonden </li>";
		  }
			$('.OnderhoudenListView').html(html);
			$(".OnderhoudenListView").listview('refresh');
		}, error);
	}); 
}



$("#pageTodoLijstOnderhanden").live('pageinit', function() {   //Haalt value van clicked listitem op
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

	  html += "<ul data-role=" + "listview" + " class='listviewDetailsTodo'" +" data-inset=" + "true" + " data-theme='f'" + " data-name="+ todoId + " >";
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
		 
		 $(this).simpledialog({
			'mode' : 'bool',
			'prompt' : 'Zeker?',
			'useModal': true,
			'buttons' : {
			  'Ja': {
				click: function () {
				  $('#dialogoutput').text('OK');
					db.transaction (function (transaction) 
					{
						var sql = "DELETE FROM todo WHERE todoId = " + todoId;
									
						transaction.executeSql (sql, undefined, ok, error);
					});
					showOnderhandenTodos('Alle', 'Onderhanden');
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
		 
		 $(this).simpledialog({
			'mode' : 'bool',
			'prompt' : 'To-do afgehandeld?',
			'useModal': true,
			'buttons' : {
			  'Ja': {
				click: function () {
				  $('#dialogoutput').text('OK');
					db.transaction (function (transaction) 
					{
						var sql = "UPDATE todo SET status = 'Afgehandeld' where todoId = " + todoId;
									
						transaction.executeSql (sql, undefined, ok, error);
					});
					showOnderhandenTodos('Alle', 'Onderhanden');
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
	
});















				


$('#map_canvas').gmap().bind('init', function(ev, map) {
	$('#map_canvas').gmap('addMarker', {'position': '57.7973333,12.0502107', 'bounds': true}).click(function() {
		$('#map_canvas').gmap('openInfoWindow', {'content': 'Hello World!'}, this);
	});
});



/*
// In the callback you can use "this" to call a function (e.g. this.get('map') instead of $('#map_canvas').gmap('get', 'map'))
$('#map_canvas').gmap({'callback': function() {
	var self = this; // we can't use "this" inside the click function (that refers to the marker object in this example)
	self.addMarker({'position': '57.7973333,12.0502107', 'bounds': true}).click(function() {
		self.openInfoWindow({'content': 'Hello World!'}, this);
	});
}});
*/
/*
$('#map_canvas').gmap({'some_option':'some_value'}); // Add the contructor
// addMarker returns a jQuery wrapped google.maps.Marker object 
var $marker = $('#map_canvas').gmap('addMarker', {'position': '57.7973333,12.0502107', 'bounds': true});

*/

$marker.click(function() {
	$('#map_canvas').gmap('openInfoWindow', {'content': 'Hello World!'}, this);
});
// If you dont add a constructor ($('#map_canvas').gmap({'some_option':'some_value'});) the plugin will auto initialize 
$('#map_canvas').gmap('addMarker', {'position': '57.7973333,12.0502107', 'bounds': true}).click(function() {
	$('#map_canvas').gmap('openInfoWindow', {'content': 'Hello World!'}, this);
});







