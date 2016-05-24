"use strict";

angular.module('starter.services', ['ionic'])

.constant('MINIMO_RECETAS_RECOMENDADAS', 3)

.factory('Carta', function ($http) {
	
	function getCarta() {

    	return $http.get('carta.json');    
    }

  return {
    
    getRecetaDeHoy: function(callback) {
    	
    	getCarta().success(function (response) {
    		callback(response.primerPlato[0].nombre + response.guarnicion[0].nombre);
    	});
    }
  };
});