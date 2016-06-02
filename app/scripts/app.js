"use strict";
// Ionic Starter App

var db = null;

function errorCB() {
    alert("DB access FAILED");
}

function insertIfEmpty(tx, results) {
	if (results.rows.length === 0) {
		
		var iteradores = { 
				"primerPlato" : [
				     { "id" : 'CARNES_LACTEOS_HUEVOS', "valor": 0 },
		             { "id" : 'VEGETALES', "valor": 0 },
		             { "id" : 'PASTAS_CEREALES_LEGUMBRES', "valor": 0 }
		         ],
		         "guarnicion": [
				     { "id" : 'TIPO_A', "valor": 0 },
				     { "id" : 'TIPO_B', "valor": 0 }
				 ],
				 "actual" : [{ "id" : 'ACTUAL', "valor": 0 }]
		};
		
		tx.executeSql("INSERT INTO Storage(key, value) VALUES (?, ?);", 
				['iteradores', JSON.stringify(iteradores)]);
	}
}

function populateDB(tx) {
//	tx.executeSql("DROP TABLE IF EXISTS Storage");
    tx.executeSql("CREATE TABLE IF NOT EXISTS Storage (key text primary key, value text)");
    tx.executeSql("SELECT * FROM Storage;", [], insertIfEmpty, errorCB);
}

function successCB() {
    alert("DB access SUCCEEDED");
}

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    
    alert("window.cordova: " + window.cordova);
    alert("window.SQLitePlugin: " + window.SQLitePlugin);

    if (window.cordova && window.SQLitePlugin) { // because Cordova is platform specific and doesn't work when you run ionic serve               
        db = window.sqlitePlugin.openDatabase({ "name": "queremosComer.db" }); //device - SQLite
        alert("device db (SQLite) loaded");
        
    } else {

        db = window.openDatabase("queremosComerDB", "1.0", "queremosComer.db", 100 * 1024 * 1024); // browser webSql, a fall-back for debugging
        alert("browser db (WebSQL) loaded");
    }

    db.transaction(populateDB, errorCB, successCB);
    
/*
    if (window.cordova) {
      db = $cordovaSQLite.openDB({ name: "queremosComer.db" }); //device
    }else{
      db = window.openDatabase("queremosComer.db", '1', 'queremosComer', 1024 * 1024 * 100); // browser
    }
    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Storage (key text primary key, value text)");
    */
    
  });
});






