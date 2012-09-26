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



function ok ()
{
}



function error (transaction, err) 
{
  alert ("DB error : " + err.message);
  return false;
}
