"use strict";

angular.module('starter.services', ['ionic'])

.constant('MINIMO_RECETAS_RECOMENDADAS', 3)

.factory('Carta', function ($http) {

  return {
    getCarta: function () {

    	var carta = {platos:null, guarniciones:null};

        $http.get('carta.json').success(function(data) {
        	carta.platos = data.primerPlato;
        	carta.guarniciones = data.guarnicion;
        });    

        return carta;
    }
  };
});