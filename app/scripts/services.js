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
	
	
	function getSiguienteReceta(recetas, iteradoresJSON) {
		
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
		
		return {"primerPlato": receta, "guarnicion": guarnicion};
		
	}
	
	
	function incrementarIterador(iterador, limite) {
		
		iterador.valor++;
		if (iterador.valor >= limite) {
			iterador.valor = 0;
		}
	}
	
	function formatDate(date) {
		
		var dd = date.getDate();
		var mm = date.getMonth()+1; //January is 0!
		var yyyy = date.getFullYear();

		if(dd<10) {
		    dd='0'+dd;
		} 

		if(mm<10) {
		    mm='0'+mm;
		} 

		return yyyy + "/" + mm + "/" + dd;
	}
	
	
	function formatReceta(receta) {
		
		return receta.primerPlato.nombre + " con " + receta.guarnicion.nombre;
	}
	
	function getRecetaParaAhora(menu) {
		
		var hoy = formatDate(new Date());
		
		var recetaDeHoy = null;
		
		menu.forEach( function(item){
			if (item.dia === hoy) {
				recetaDeHoy = item;
			}
		});
		
		if (recetaDeHoy !== null) {
			
			var ahora = "almuerzo";
			var horas = new Date().getHours();
			
			if (horas > 15) {
				ahora = "cena";
			}
			
			recetaDeHoy = recetaDeHoy.recetas[ahora];
		}
		
		return recetaDeHoy;
	}
	
	
	function getMenuSemanal(callback) {
		
		StorageService.getValor("menu").then( function(menu){
			
			var recetaAhora = null;
			
			if (menu) {				
				recetaAhora = getRecetaParaAhora(JSON.parse(menu));
			}
			
			if (recetaAhora !== null) {
				callback(recetaAhora);
				
			} else {
				
				getCarta().success(function (response) {
		    		
					menu = [];
		    		var recetas = armarMapaRecetas(response);
		    		
		    		StorageService.getValor("iteradores").then( function(iteradores){
		    			
		    			var fecha = new Date();
		    			
		    			var iteradoresJSON = JSON.parse(iteradores);
		    			for (var i=0; i < 7; i++) {
		    				
		    				var receta1 = getSiguienteReceta(recetas, iteradoresJSON);
		    				var receta2 = getSiguienteReceta(recetas, iteradoresJSON);
		    				
		    				menu.push({"dia": formatDate(fecha), 
		    					"recetas": {"almuerzo": formatReceta(receta1), 
		    						"cena": formatReceta(receta2)}});
		    				
		    				fecha.setDate(fecha.getDate() + 1);
		    			}
		    			
		    			StorageService.guardar("iteradores", JSON.stringify(iteradoresJSON));
		    			StorageService.guardar("menu", JSON.stringify(menu));
		    			
		    			callback(getRecetaParaAhora(menu));
		    		});
				});
			}
		});
	}
	

  return {
    
    getRecetaDeHoy: function(callback) {
    	
    	setTimeout(function(){
    		getMenuSemanal(function(menu) {
        		callback(menu);
        	});
        }, 1);

    	
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