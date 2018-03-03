app.controller('resumenController', function ($scope, $q,$route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout,fileUpload, $location) {
    $scope.panelCasos=false;
    $scope.panelbuscador=true;
    $scope.wsId = "";
    $scope.actividadActual = "";
    $scope.proceso = function(){
        $.blockUI();
        var resOpcion = {
            "procedure_name":"sp_carga_procesos",
            "body":{"params": [{"name":"ws","value":sessionService.get('WS_ID')}]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion).success(function (response){
            $scope.getFractividad = response;
            $.unblockUI();
        }).error(function(error) {
        });
    };
    $scope.obtActividades= function(id){
        var resAccesos = {"table_name":"_fr_actividad",
                            "filter": "act_estado='A' and act_prc_id=" + id
                            };  
        var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(resAccesos);
        obj.success(function(data) {
               $scope.actividades=data.record;
            }).error(function(error) {
            });
    };    
    $scope.datoscampos= function(datoson){
        $scope.obtActividades(datoson);
        var resAccesos = {"table_name":"_fr_busquedas",
                            "filter": "bsq_estado='A' and bsq_ws_id="+sessionService.get('WS_ID')+" and bsq_prs_id="+datoson+""
                        };  
        var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(resAccesos);
        obj.success(function(data) {
           $scope.getbsq=data.record;
           $scope.getbsqss=data.record[0].bsq_nombre;
           console.log("aa",$scope.getbsq);
        }).error(function(error) {
        });
    };
    $scope.datosactividad= function(datoson){
        $scope.actividadActual = datoson;
        sessionService.set('ACTIVIDADRESUMEN', datoson);
        var res = { "table_name":"_fr_actividad",
                            "filter": "act_estado='A' and act_id="+datoson
                  };  
        var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(res);
        obj.success(function(data) {
           sessionService.set('ACTIVIDADRESUMENSIG', data.record[0].act_siguiente);
           sessionService.set('ACTIVIDADRESUMENORDEN', data.record[0].act_orden + "-" + data.record[0].act_nombre);
        }).error(function(error) {
        });
    };
    $scope.mostrarHistorico = function(datoson){
        console.log("1: ",datoson);
        $scope.titulo = datoson.procnombre + ", Caso Nro. " + datoson.casnombrecaso;
         var resOpcion = {
            "procedure_name":"sp_despliega_historico",
            "body":{"params": [{"name":"cas_id","value":datoson.casoid}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
        obj.success(function (response) {
            $scope.obtHistorico=response;
            console.log("Datos:  ", response);
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
        
    };
    $scope.getcasos10 = function(datos){
        $.blockUI();
        $scope.panelCasos=true;
        var resDatos = {
            "procedure_name":"impresioneslst_82",
            "body":{
                "params": [
                    {
                        "name": "ci",
                        "value": datos.valor
                    },
                    {
                        "name": "campo",
                        "value": datos.campo
                    },
                    {
                        "name": "proceso",
                        "value": parseInt(datos.espacio)
                    }           
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resDatos);
        obj.success(function (response) {
            var data = response; 
            if(data.length > 0){
                console.log("DATA RESPUESTA: ", response);
                $scope.datosGrilla = response;
                $scope.conArchivo = "mostrar";
                $scope.sinArchivo = null;
            }else{
                $scope.mensaje  =   "El C.I. no tiene trámites.";
            }
            $.unblockUI(); 
        }).error(function(results){          
            $.unblockUI();
        });
    };    
    $scope.busquedaAtenderCaso = function(datoson, estado){
        console.log(datoson);
        datoson.casoactid = sessionService.get('ACTIVIDADRESUMEN');
        datoson.tiempo = "FUTURO";
        datoson.actsigid = sessionService.get('ACTIVIDADRESUMENSIG');;
        datoson.actnombre = sessionService.get('ACTIVIDADRESUMENORDEN');;
        datoson.casonro = datoson.casnrocaso;
        datoson.casonombre = datoson.casnombrecaso;
            $.blockUI();
            $location.path('formularios|misCasos|index.html');
            setTimeout(function(){
                $rootScope.$broadcast('atenderOtro', datoson, estado);
                $.unblockUI();
            }, 600);        
    };
	$scope.clonarCaso = function(datoson, estado){
            var caso = {};
            var resFormulario = {
                procedure_name:"sp_clonar_tramite",
                body:{
                    "params": [
                        {
                            "name": "caso_id",
                            "value": datoson.casoid
                        },{
                            "name": "usr_id",
                            "value": sessionService.get('IDUSUARIO')
                        },
                    ]
                }
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resFormulario);
            obj.success(function (data){console.log(data[0].casodata);
					$.blockUI();
					$location.path('formularios|misCasos|index.html');
					setTimeout(function(){
						$rootScope.$broadcast('atenderClon', data[0], estado);				
						$.unblockUI();
					}, 600);  
            })
            .error(function(data){
                sweet.show('', "Registro no insertado", 'error');
                $scope.btnGuardar = false;
            })
    };
	$scope.getArchivosAdjuntos = function(datoson){
		$.blockUI
		var filtro = "doc_proceso='" + datoson.procid + "' and doc_id='" + datoson.casoid + "' and doc_estado='A'";
		var resOpcion = {
			"table_name":"dms_gt_documentos",
			"filter":filtro
		};
		var obj = DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resOpcion)
		.success(function (response){
			$scope.obtArchivosAdjuntos=response.record;
			$.unblockUI();
	
		}).error(function(error) {
			$scope.errors["error_rol"] = error;
		});
    };

    $scope.getArchivosSalida = function(datoson){
        $.blockUI
        var filtro = "doc_id='" + datoson.casoid + "' and doc_estado='A'";
        var resOpcion = {
            "table_name":"dms_gt_documentos",
            "filter":filtro
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resOpcion)
        .success(function (response){
            $scope.obtArchivosAdjuntos=response.record;
            $.unblockUI();
    
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };

	$scope.ImprimirProforma = function (formulario) {
		$scope.archotro = false;
		$scope.archpdf = true;
		$('#visorFum object').attr('data',formulario);
		$timeout(function(){$scope.varSpin=false}, 1000);
    };
    $scope.$on('api:ready',function(){
        $scope.proceso();
        $scope.wsId = sessionService.get('WS_ID');
    });
    $scope.inicioCrear = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.proceso();
            $scope.wsId = sessionService.get('WS_ID');
        }
    };
});