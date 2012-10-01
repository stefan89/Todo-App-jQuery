function refreshPage(htmlInvoer, pageInvoer) //refresh the page when data is collected    	//Pagina opbouw veranderen en tonen
{
      $(pageInvoer).unbind ().bind ("pagebeforeshow", function ()
      {
        var content = $(pageInvoer + " div:jqmData(role=content)");
        content.html (htmlInvoer);
        var ul = content.find ("ul");
        ul.listview();
      });
      $.mobile.changePage ($(pageInvoer), { transition: "slide"});
}




function succeeded(titleTextInvoer, buttonTextInvoer, callback) {
  $("#informatieDialog .informatieDialogH3Text").text(titleTextInvoer);
  $("#informatieDialog .informatieDialog-do").text(buttonTextInvoer).on("click.informatieDialog", function() {
    callback();
    $(this).off("click.informatieDialog");
  });
  $.mobile.changePage("#informatieDialog");  
}



function areYouSure(titleTextInvoer, buttonTextInvoer, callback) {
  $("#bevestigDialog .bevestigDialogH3Text").text(titleTextInvoer);
  $("#bevestigDialog .bevestigDialog-do").text(buttonTextInvoer).on("click.bevestigDialog", function() {
    callback();
    $(this).off("click.bevestigDialog");
  });
  $.mobile.changePage("#bevestigDialog");
}



function ok ()
{
}



function error (transaction, err) 
{
  alert ("DB error : " + err.message);
  return false;
}



$(document).bind("mobileinit", function(){ //Back button fix for Android devices 
        $.mobile.pushStateEnabled = false; 
});