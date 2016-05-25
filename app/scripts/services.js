"use strict";

angular.module('starter.services', ['ionic'])

.constant('CARNES_LACTEOS_HUEVOS', 'carnes')
.constant('VEGETALES', 'vegetales')
.constant('PASTAS_CEREALES_LEGUMBRES', 'cereales')
.constant('TIPO_A', 'A')
.constant('TIPO_B', 'B')

.constant('CANTIDAD_CARNE', 3)

.factory('Carta', function ($http, CARNES_LACTEOS_HUEVOS, VEGETALES, PASTAS_CEREALES_LEGUMBRES, TIPO_A, TIPO_B) {
	
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
	
	var iteradoresPP = [
	                  { "id" : 'CARNES_LACTEOS_HUEVOS', "valor": 0 },
	                  { "id" : 'VEGETALES', "valor": 0 },
	                  { "id" : 'PASTAS_CEREALES_LEGUMBRES', "valor": 0 }
	                  ];
	
	var iteradoresGuarnicion = [
		                  { "id" : 'TIPO_A', "valor": 0 },
		                  { "id" : 'TIPO_B', "valor": 0 }
		                  ];
	
	var iteradorActualPP = 0;
	
	function getSiguienteReceta(recetas) {
		
		var it = iteradoresPP[iteradorActualPP];
		var receta = recetas.primerosPlatos[it.id][it.valor] ;
		
		var itGuarnicion = iteradoresGuarnicion[0];
		if (receta.complemento === TIPO_B) {
			itGuarnicion = iteradoresGuarnicion[1];
		}
		
		var guarnicion = recetas.guarniciones[itGuarnicion.id][itGuarnicion.valor];
		
		incrementarIterador(it, recetas.primerosPlatos[it.id].length);
		incrementarIterador(itGuarnicion, recetas.guarniciones[itGuarnicion.id].length);
		
		iteradorActualPP++;
		if (iteradorActualPP >= iteradoresPP.length){
			iteradorActualPP = 0;
		}
		
		return {"primerPlato": receta, "guarnicion": guarnicion};
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
    		var receta = getSiguienteReceta(recetas);
    		
    		callback(receta.primerPlato.nombre + " con " + receta.guarnicion.nombre);
    	});
    }
  };
});