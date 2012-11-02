$('.homeWeergeven').bind("click", function (event) { //zet navigationbar buttonpressed
	$(".homeWeergeven").addClass('ui-btn-active ui-state-persist'); 
	$(".persoonlijstWeergeven").removeClass('ui-btn-active ui-state-persist');
	$(".todolijstWeergeven").removeClass('ui-btn-active ui-state-persist');
 });
$('.persoonlijstWeergeven').bind("click", function (event) { //zet navigationbar buttonpressed
	$(".homeWeergeven").removeClass('ui-btn-active ui-state-persist');
	$(".persoonlijstWeergeven").addClass('ui-btn-active ui-state-persist'); 
	$(".todolijstWeergeven").removeClass('ui-btn-active ui-state-persist');
 });
 $('.todolijstWeergeven').bind("click", function (event) { //zet navigationbar buttonpressed
	$(".homeWeergeven").removeClass('ui-btn-active ui-state-persist');
	$(".persoonlijstWeergeven").removeClass('ui-btn-active ui-state-persist'); 
	$(".todolijstWeergeven").addClass('ui-btn-active ui-state-persist');
 });


function refreshPage(htmlInvoer, pageInvoer) //refresh the page when data is collected    	//Pagina opbouw veranderen en tonen
{
      $(pageInvoer).unbind ().bind ("pagebeforeshow", function ()
      {
        var content = $(pageInvoer + " div:jqmData(role=content)");
        content.html (htmlInvoer);
        var ul = content.find ("ul");
        ul.listview();
      });
      $.mobile.changePage ($(pageInvoer));
}


function succeeded(titleTextInvoer, buttonTextInvoer, callback) {
  $("#informatieDialog .informatieDialogH3Text").text(titleTextInvoer);
  $("#informatieDialog .informatieDialog-do").text(buttonTextInvoer).on("click.informatieDialog", function() {
    callback();
    $(this).off("click.informatieDialog");
  });
  $.mobile.changePage($("#informatieDialog"));
}


function areYouSure(titleTextInvoer, buttonTextInvoer, callback) {
  $("#bevestigDialog .bevestigDialogH3Text").text(titleTextInvoer);
  $("#bevestigDialog .bevestigDialog-do").text(buttonTextInvoer).on("click.bevestigDialog", function() {
    callback();
    $(this).off("click.bevestigDialog");
  });
  $.mobile.changePage($("#bevestigDialog"));
}


function ok ()
{
}


function error (transaction, err) 
{
  alert ("DB error : " + err.message);
  return false;
}