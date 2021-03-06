"use strict";

angular.module('starter.controllers', ['ionic', 'starter.services'])

.constant('DIAS_CALCULO_MENU', 7)
.constant('INGRESOS_PARA_MOSTRAR_ENCUESTA', 8)

.controller('CartaController', function ($scope, Carta) {
	
	$scope.mostrarMenu = false;
	
	$scope.verMenu = function() {
		$scope.mostrarMenu = true;
	};
	
	$scope.ocultarMenu = function() {
		$scope.mostrarMenu = false;
	};
	
	$scope.ahora = Carta.getFechaHoy();
	
    Carta.getRecetaDeHoy(function(data){
    	
    	//$scope.$apply(function () {
    		$scope.receta = data;   
    		
    	//});
    });
    
    Carta.getMenuSemanal( function(data) {
    	$scope.menu = data;
    });
});