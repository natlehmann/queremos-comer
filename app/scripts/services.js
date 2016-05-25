"use strict";

angular.module('starter.services', ['ionic'])

.constant('CARNES_LACTEOS_HUEVOS', 'carnes')
.constant('VEGETALES', 'vegetales')
.constant('PASTAS_CEREALES_LEGUMBRES', 'cereales')
.constant('TIPO_A', 'A')
.constant('TIPO_B', 'A')

.factory('Carta', function ($http, CARNES_LACTEOS_HUEVOS, VEGETALES, PASTAS_CEREALES_LEGUMBRES, TIPO_A) {
	
	function getCarta() {
    	return $http.get('carta.json');    
    }

  return {
    
    getRecetaDeHoy: function(callback) {
    	
    	var primerosPlatos = {
    			CARNES_LACTEOS_HUEVOS: [],
    			VEGETALES: [],
    			PASTAS_CEREALES_LEGUMBRES: []
    	};
    	var guarniciones = {
    			TIPO_A: [],
    			TIPO_B: []
    	};
    	
    	getCarta().success(function (response) {
    		
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
    		
    		callback(primerosPlatos.VEGETALES[0].nombre + " con " + guarniciones.TIPO_A[0].nombre);
    	});
    }
  };
});