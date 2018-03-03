app.controller('authCtrl' , function ($scope, $rootScope, $routeParams, $location, $http, Data, sessionService, CONFIG, LogGuardarInfo, DreamFactory, registroLog, sweet) {
    //inicialmente fijado esos objetos como null para evitar el error indefinido
    $scope.login = {};
    $scope.signup = {};
    $scope.doLogin = function (customer) {
        //Comentando la autenticacion de los servicios, hasta encontrar solucion al problema
        /*DreamFactory.api.user.login(CONFIG.CREDENCIAL,
            function(result) {*/
                var misDatos = {
					"procedure_name":"adm_autenticacion",
					"body":{
						"params": [
							{
								"name": "usrid",
								"value": customer.usuario
							},
							{
								"name": "usuario",
								"value": customer.clave
							}
						]
					}
                };
                $.blockUI();
                DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (results){
                    if(results.length > 0){
                        sessionService.set('IDUSUARIO', results[0].idusr);
                        sessionService.set('USUARIO', results[0].usr);                        
                        sessionService.set('US_IDROL', results[0].idrl);
                        sessionService.set('US_ROL', results[0].rol);
                        $rootScope.nombre = sessionService.get('USUARIO');
                        sessionService.set('US_NOMBRE', results[0].nombre);
                        sessionService.set('US_PATERNO', results[0].paterno);
                        sessionService.set('US_MATERNO', results[0].materno);
                        sessionService.set('US_IDNODO', results[0].idnodo);
						sessionService.set('US_IDMACRO', results[0].idmacro);
                        sessionService.set('US_NODODESCRIPCION', results[0].nod_nombre);
                        //Registro log inicio de session usuario
                        registroLog.almacenarLog(results[0].idusr,0,0, "Inicio de session");
                        //$rootScope.wkSpace =    results[0].json_workspace;
                        console.log("ESPACIO DE TRABAJO:", results[0].json_workspace);
                        console.log("USUARIO GENESIS:", results[0].usuario_genesis);
                        
                        localStorage.setItem("wkSpace", results[0].json_workspace);                        
				        if(results[0].usuario_genesis != null){
                            sessionService.set('US_GENESIS', results[0].usuario_genesis);
							$scope.getAreaRecaudacion(results[0].usuario_genesis);
						}
                        //DESTRUIMOS LAS SESSIONES DEL ESPACIO DE TRABAJO SI EXISTIERAN
                        sessionService.destroy('WS_ID');
                        sessionService.destroy('WS_NOMBRE');
                        //sessionService.get('IDUSUARIO');
                        //Redireccionando a dashboard
                        $location.path('dashboard');                        
                    }else{
						sweet.show('', 'Error en usuario y/o contraseña', 'warning');
                        $location.path('');
                    }
                    $.unblockUI();
                }).error(function(results){
                    $.unblockUI();
                    //Alguna alerta si da un error
                });
              //Comentando la autenticacion de los servicios, hasta encontrar solucion al problema        
              /*},
              // Error function
              function(error) {
                // Handle Login failure
              });*/
    };

    $scope.getAreaRecaudacion = function (usuarioIf) {
        var misDatos = {
			"procedure_name":"GENERAL.spCUsuarioAreaRecaudacionNombre",
			"body":{
				"params": [
					{
						"name": "usuario",
						"value": usuarioIf
					}
				]
			}
        };                    
        DreamFactory.api[CONFIG.SERVICEGENESIS].callStoredProcWithParams(misDatos).success(function (results){
            if(results.length > 0){                        
                sessionService.set('ID_AREA_RECAUDACION', results[0].idAreaRecaudacion);
        
            }else{
				sweet.show('', 'El usuario no tiene Área Recaudación', 'warning');
            }
        }).error(function(results){
            //Alguna alerta si da un error
        });
    };
	
    $scope.signup = {usuario:'',clave:'',name:'',phone:'',address:''};
    $scope.signUp = function (customer) {
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    };
    $scope.logout = function () {
        //Registro log, cierre de sesison usuario
        registroLog.almacenarLog(sessionService.get('IDUSUARIO'),0,0, "Cierre de session");
        //Destruyendo las variables de session 
        sessionService.destroy('USER');
        sessionService.destroy('IDUSUARIO');
        sessionService.destroy('USUARIO');        
        sessionService.destroy('US_IDROL');
        sessionService.destroy('US_ROL');
        sessionService.destroy('US_NOMBRE');
        sessionService.destroy('US_PATERNO');
        sessionService.destroy('US_MATERNO');
        sessionService.destroy('US_IDNODO');
        
        sessionService.destroy('WS_ID');
        sessionService.destroy('WS_NOMBRE');
        $location.path('');
    }
    $scope.registroCiudadano = function (customer) {
       console.log(customer);    
    };
});