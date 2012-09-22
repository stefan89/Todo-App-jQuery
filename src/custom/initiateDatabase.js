//Open or create the database
	var db = openDatabase("ToDo", '1.0', "ToDo", 5 * 1024 * 1024);
    
    //Initialize the database
    db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS persoon " +
			"(email VARCHAR(100) NOT NULL PRIMARY KEY, " + 
			"voorNaam VARCHAR(50) NOT NULL, " + 
			"achterNaam VARCHAR(50) NOT NULL, " +
			"geslacht VARCHAR(10) NOT NULL, " + 
			"geboorteDatum DATETIME NOT NULL, " + 
			"telefoonNummer VARCHAR(20)) "); 
	
			tx.executeSql("CREATE TABLE IF NOT EXISTS todo " +
			"(todoId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
			"korteOmschrijving VARCHAR(100) NOT NULL, " + 
			"langeOmschrijving VARCHAR(2000), " +
			"datum DATETIME NOT NULL, " + 
			"urgentie INTEGER NOT NULL, " + 
			"plaatsOplevering VARCHAR(100) NOT NULL, " + 
			"type VARCHAR (20) NOT NULL, " +
			"status VARCHAR(100) NOT NULL, " +
			"email VARCHAR(100) NOT NULL, " +
		    "FOREIGN KEY (email) REFERENCES persoon(email))");
	});