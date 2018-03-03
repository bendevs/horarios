 app.controller('abmbuscadorController', function ($scope, $q,$route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout,fileUpload) {
    var fecha= new Date();
    var mes=fecha.getMonth()+1;
    if(mes.toString().length==1)
        mes='0'+mes;
    var dia=fecha.getDate();
    if(dia.toString().length==1)
        dia='0'+dia;
    $scope.fechactual=fecha.getFullYear() + "-" + mes + "-" + dia + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    console.log('mes---> ',mes);
    console.log('fecha---> ',$scope.fechactual);
    $scope.panelCasos=false;
    $scope.panelFormularios=false;
    $scope.tituloP='Mis Trámites';
    $scope.nodoAsignado=true;
    $scope.memoria=[];
    $scope.contador=0;
    $scope.errors = {};
    $scope.array = [];
    $scope.ImagenProceso = '{}';
    $scope.ImagenLinks = '';
    $scope.cargarLibreria = 0;
    $scope.abrirHistorico = 0;
    $scope.panelcreacion=true;
   
    $scope.proceso = function(datos){
        $scope.wsId=datos;
        $.blockUI();
        var resOpcion = {
            "procedure_name":"sp_carga_procesos",
            "body":{"params": [{"name":"ws","value":$scope.wsId}]
            }
        };

        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion).success(function (response){
                $scope.getFractividad = response;
            $.unblockUI();

        }).error(function(error) {
        });
    };
    $scope.getworkspace0= function(){
         
         var resAccesos = {"table_name":"_bp_workspace",
                            };  
            var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(resAccesos);
                obj.success(function(data)

                {
                    
                
                $scope.getFractividad=data.record;
                console.log("lllll",$scope.getAemacro);

   
            })   
        };
    $scope.listarbuscadores= function(){
         
         var resAccesos = {"table_name":"_fr_busquedas",
                            "filter": "bsq_estado='A' and bsq_ws_id="+$scope.wsId+""
                            };  
            var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(resAccesos);
                obj.success(function(data)
                {

                $scope.datosbusqueda=data.record;
                
            })   
    };

/*
bsq_id 
  bsq_ws_id 
  bsq_registrado 
  bsq_modificado 
  bsq_prs_id 
  bsq_campo 
  bsq_estado 
  bsq_nombre

*/
  $scope.adicionarbuscador = function(datosProceso){
    $scope.wsId=sessionService.get('WS_ID');
        var proceso = {};
        $.blockUI();
        var misDatos = {
            "procedure_name":"sp_crearbusqueda",
            "body":{
                "params": [
                    {
                        "name": "ws",
                        "value": $scope.wsId
                    },{
                        "name": "registro",
                        "value": $scope.fechactual
                    },{
                        "name": "modificacion",
                        "value": $scope.fechactual
                    },{
                        "name": "prs",
                        "value": datosProceso.bsq_prs_id
                    },{
                        "name": "campo",
                        "value": datosProceso.bsq_campo
                    },{
                        "name": "nombre",
                        "value": datosProceso.bsq_nombre
                    }
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (response){
            if(response){
                sweet.show('', 'Registro insertado', 'success');
                $.unblockUI(); //cerrar la mascara
                $route.reload();
            } else {
                sweet.show('', 'Registro no insertado', 'error');
                $.unblockUI();
                $route.reload();
            }
        }).error(function(response){
        });
    };
    $scope.modificarbuscador = function(datosProceso){
        console.log("aaaaaa",datosProceso);
    $scope.wsId=sessionService.get('WS_ID');
        var proceso = {};
        $.blockUI();
        var misDatos = {
            "procedure_name":"sp_modificarbusqueda",
            "body":{
                "params": [
                    {
                        "name": "idb",
                        "value": datosProceso.bsq_id
                    },{
                        "name": "modificacion",
                        "value": $scope.fechactual
                    },{
                        "name": "prs",
                        "value": datosProceso.bsq_prs_id
                    },{
                        "name": "campo",
                        "value": datosProceso.bsq_campo
                    },{
                        "name": "nombre",
                        "value": datosProceso.bsq_nombre
                    }
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (response){
            if(response){
                sweet.show('', 'Registro modificado', 'success');
                $.unblockUI(); //cerrar la mascara
                $route.reload();
            } else {
                sweet.show('', 'Registro no modificado', 'error');
                $.unblockUI();
                $route.reload();
            }
        }).error(function(response){
        });
    };
    $scope.eliminarbusqueda = function(datosProceso){
        console.log("aaaaaa",datosProceso);
        var proceso = {};
        $.blockUI();
        var misDatos = {
            "procedure_name":"sp_eliminarbusqueda",
            "body":{
                "params": [
                    {
                        "name": "idb",
                        "value": datosProceso.bsq_id
                    },{
                        "name": "modificacion",
                        "value": $scope.fechactual
                    }
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (response){
            if(response){
                sweet.show('', 'Registro eliminado', 'success');
                $.unblockUI(); //cerrar la mascara
                $route.reload();
            } else {
                sweet.show('', 'Registro no eliminado', 'error');
                $.unblockUI();
                $route.reload();
            }
        }).error(function(response){
        });
    };

    $scope.modificarPersonaCargar = function(persona){
        $scope.desabilitado=false;
        $scope.datos = persona;
        $scope.boton="upd";
        $scope.titulo="Modificar";
    };
    $scope.eliminarPersonaCargar = function(persona){
        $scope.desabilitado=true;
        $scope.datos = persona;
        $scope.boton="del";
        $scope.titulo="Eliminar";
    };
    $scope.limpiar = function(){
        $scope.datos='';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro";
    };


 //$scope.getCasos
    

    /*$scope.$on('$destroy', function() {
        clsIniciarGetDatosGrilla();
    });*/

    /***FIN DE HISTORICO***/
    $scope.$on('api:ready',function(){
        $scope.proceso(sessionService.get('WS_ID'));
        $scope.listarbuscadores();
        /*$scope.usuarioid = sessionService.get('IDUSUARIO');
        sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
        sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
        
        $scope.getNodosUsusario();
        
        $scope.datoscampos();*/
    });
    $scope.inicioCrear = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.proceso(sessionService.get('WS_ID'));
            $scope.listarbuscadores();
            /*$scope.usuarioid = sessionService.get('IDUSUARIO');
            sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
            sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
            
            $scope.getNodosUsusario();
            
            $scope.datoscampos();*/
        }
    };
});