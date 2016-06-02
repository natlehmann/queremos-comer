"use strict";

angular.module('starter.services', ['ionic', 'ngCordova'])

.constant('CARNES_LACTEOS_HUEVOS', 'carnes')
.constant('VEGETALES', 'vegetales')
.constant('PASTAS_CEREALES_LEGUMBRES', 'cereales')
.constant('TIPO_A', 'A')
.constant('TIPO_B', 'B')

.factory('Carta', function ($http, $q, StorageService, 
		CARNES_LACTEOS_HUEVOS, VEGETALES, PASTAS_CEREALES_LEGUMBRES, TIPO_A, TIPO_B) {
	
	function getCarta() {
    	return $http.get('carta.json');    
    }
	
	function armarMapaRecetas(response) {
		
		var primerosPlatos = {
    			CARNES_LACTEOS_HUEVOS: [],
    			VEGETALES: [],
    			PASTAS_CEREALES_LEGUMBRES: []
    	};
    	var guarniciones = {
    			TIPO_A: [],
    			TIPO_B: []
    	};
    	
    	response.primerPlato.forEach(function(item){
			
			if (item.categoria === CARNES_LACTEOS_HUEVOS) {
				primerosPlatos.CARNES_LACTEOS_HUEVOS.push(item);
				
			} else {
				if (item.categoria === VEGETALES) {
					primerosPlatos.VEGETALES.push(item);
					
				} else {
					primerosPlatos.PASTAS_CEREALES_LEGUMBRES.push(item);
				}
			}
		});
    	
    	response.guarnicion.forEach(function(item){
			
			if (item.tipo === TIPO_A) {
				guarniciones.TIPO_A.push(item);
				
			} else {
				guarniciones.TIPO_B.push(item);
			}
		});
    	
    	return {"primerosPlatos" : primerosPlatos, "guarniciones": guarniciones};
	}
	
	
	function getSiguienteReceta(recetas, callback) {
		
		StorageService.getValor("iteradores").then( function(iteradores){
			
			var iteradoresJSON = JSON.parse(iteradores);
			
			var iteradorActualPP = iteradoresJSON.actual[0];
			var it = iteradoresJSON.primerPlato[iteradorActualPP.valor];
			var receta = recetas.primerosPlatos[it.id][it.valor] ;
			
			var itGuarnicion = iteradoresJSON.guarnicion[0];
			if (receta.complemento === TIPO_B) {
				itGuarnicion = iteradoresJSON.guarnicion[1];
			}
			
			var guarnicion = recetas.guarniciones[itGuarnicion.id][itGuarnicion.valor];
			
			incrementarIterador(it, recetas.primerosPlatos[it.id].length);
			incrementarIterador(itGuarnicion, recetas.guarniciones[itGuarnicion.id].length);
			incrementarIterador(iteradorActualPP, 3);
			
			StorageService.guardar("iteradores", JSON.stringify(iteradoresJSON));
			
			callback( {"primerPlato": receta, "guarnicion": guarnicion} );
		});
		
	}
	
	
	function incrementarIterador(iterador, limite) {
		
		iterador.valor++;
		if (iterador.valor >= limite) {
			iterador.valor = 0;
		}
	}
	

  return {
    
    getRecetaDeHoy: function(callback) {
    	
    	getCarta().success(function (response) {
    		
    		var recetas = armarMapaRecetas(response);	
    		getSiguienteReceta(recetas, function(receta){
    			
    			callback(receta.primerPlato.nombre + " con " + receta.guarnicion.nombre);
    		});
    		
    		
    	});
    }
  };
})


.factory('StorageService', function ($q) {
	
	function crear(clave, valor) {
		
		db.transaction(function(tx){
			
			tx.executeSql("INSERT INTO Storage(key,value) VALUES (?,?);", 
					[clave, valor], insertQuerySuccess, queryError);
			
		}, errorCon, successCon);
	}
	
	function insertQuerySuccess(tx, results) {
        var len = results.rows.length;

        for (var i = 0; i < len; i++) { 
            console.log(results.rows.item(i).key + " - " + results.rows.item(i).value);
        }
    }
	
	function queryError(tx, error) {
		console.error("Error al realizar la query " + error.message);
	}
	
	function errorCon(tx, error) {
		console.error("Error de conexion a la BD " + error.message);
	}
	
	function successCon() {
		console.log("Conexion a la BD exitosa");
	}
	
	function modificar(clave, valor) {		
		db.transaction(function(tx){
			
			tx.executeSql("UPDATE Storage SET value = ? WHERE key = ?;", 
					[valor, clave], insertQuerySuccess, queryError);
			
		}, errorCon, successCon);
	}
	
	function getValor(clave) {
		
		var deferred = $q.defer();
		
		db.transaction(function(tx){
			
			tx.executeSql("SELECT value FROM Storage WHERE key = ?;", [clave], 
					function(tx, results){
				
						var resultado = null;
						
						if(results.rows.length > 0) {
			                console.log("SELECTED -> " + results.rows.item(0).value);
			                resultado = results.rows.item(0).value;
			                
			            } else {
			                console.log("No results found");
			            }	
						
						deferred.resolve(resultado);
					}, 
					queryError);
			
		}, errorCon, successCon);
		
		return deferred.promise;
	}
	
	return {
	    
		guardar: function(clave, valor) {
	    	
			getValor(clave).then( function(existente){
				
				if (existente) {				
					modificar(clave, valor);
				
				} else {
					crear(clave, valor);
				}
			});
				    	
		},
		
		getValor: getValor
	};
})

;