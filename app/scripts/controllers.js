"use strict";

angular.module('starter.controllers', ['ionic', 'starter.services'])

.constant('DIAS_CALCULO_MENU', 7)
.constant('INGRESOS_PARA_MOSTRAR_ENCUESTA', 8)

.controller('CartaController', function ($scope, Carta) {
    Carta.getRecetaDeHoy(function(data){
    	
    	$scope.$apply(function () {
    		$scope.receta = data;    		
    	});
    });
});