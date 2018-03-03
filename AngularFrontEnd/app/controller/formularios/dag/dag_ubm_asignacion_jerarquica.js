app.controller('dagAsigJerarController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout, $routeParams, $location, $http, Data, LogGuardarInfo, $sce, registroLog, FileUploader, $window) {
	var f = new Date();
    var dia=parseInt(f.getDate());
    if(dia<10) {
        dia='0'+f.getDate();
    } else {
        dia=f.getDate();
    }
    if(parseInt(f.getMonth() +1)<10){
        mes='0'+(f.getMonth() +1);
    }else{
        mes=(f.getMonth() +1);
    }
    fecha = f.getFullYear() + '-' + mes + '-' + dia;
    $scope.gestion=f.getFullYear();

    // cargo funcionarios para asignar
	$scope.ListFuncionarios = "";
    $scope.Cargarfuncionarios = function () {
        var datosFuncionarios = {
            "procedure_name":"dag.sp_dag_ubm_funcionarioreponsable",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosFuncionarios).success(function (response){
            // var tmpListFuncionarios = JSON.stringify(response);
            // $scope.ListFuncionarios = JSON.parse(tmpListFuncionarios);
            $scope.ListFuncionarios = response;
        })
        .error(function(data){
            sweet.show('', 'Error al cargar la informacion de los funcionarios: ', 'error');
        });
    };
    //Cuando eliges un usuario lo reemplaza en el campo de texto
    $scope.cambiafuncionario = function(funcionario,ap_pat,ap_mat,nomb){
        $scope.funcionario = funcionario + ' ' + ap_pat + ' ' + ap_mat + ', ' + nomb;
        $scope.Cargar_s_da_ue_uo_func(funcionario);
    }

    //funcion para determinar unidad organizacional del funcionario solicitante
    $scope.Cargar_s_da_ue_uo_func = function (xx) {
        var resRoles = {
            "procedure_name":"dag.sp_dag_ubm_s_da_ue_uo_funcionario",
            "body":{
            "params": [                                
                {
                    "name": "funcionario",
                    "value": xx
                },
                {
                    "name": "fecha",
                    "value": fecha
                }
            ]
        }
        };
        obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            $scope.s_da_ue_uo_func = response;
            if (Object.keys($scope.s_da_ue_uo_func).length == 1) {
                $scope.S_SOLICITANTE = $scope.s_da_ue_uo_func[0].dag_s_s;
                $scope.S_SOLICITANTE_D = $scope.s_da_ue_uo_func[0].dag_s_descripcion;
                $scope.DA_SOLICITANTE = $scope.s_da_ue_uo_func[0].dag_da_da;
                $scope.DA_SOLICITANTE_D = $scope.s_da_ue_uo_func[0].dag_da_descripcion;
                $scope.UE_SOLICITANTE = $scope.s_da_ue_uo_func[0].dag_ue_ue;
                $scope.UE_SOLICITANTE_D = $scope.s_da_ue_uo_func[0].dag_ue_descripcion;
                $scope.UO_SOLICITANTE = $scope.s_da_ue_uo_func[0].dag_uo_uo;
                $scope.UO_SOLICITANTE_D = $scope.s_da_ue_uo_func[0].dag_uo_descripcion;
                //$scope.TecnicoAsignadof();
            }
            else
            {
                sweet.show('', 'El funcionario no tiene unidad organizacional actualizada, contactese con el administrador del sistema', 'error');
            }

        })
        obj.error(function(error) {
            $.unblockUI();
            sweet.show('', 'Error al recuperar la informacion, intentelo nuevamente', 'warning');
        });
    };
    $scope.cerear = function () {
        $scope.S_SOLICITANTE = "";
        $scope.S_SOLICITANTE_D = "";
        $scope.DA_SOLICITANTE = "";
        $scope.DA_SOLICITANTE_D = "";
        $scope.UE_SOLICITANTE = "";
        $scope.UE_SOLICITANTE_D = "";
        $scope.UO_SOLICITANTE = "";
        $scope.UO_SOLICITANTE_D = "";
        $scope.CODIGOAF="";
    }

    $scope.GetActivo = function (testo) {
        if ($scope.S_SOLICITANTE != "") {
            if (testo.length>=12) {
                var datosActivos = {
                    "procedure_name":"dag.sp_dag_ubm_buscaactivo",
                    "body":{
                        "params": [                                
                            {
                                "name": "pcodigoaf",
                                "value": testo
                            }
                        ]
                    }
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosActivos).success(function (response){
                    var tmpListActivos = JSON.stringify(response);
                    $scope.ListActivos = JSON.parse(tmpListActivos);
                })
                .error(function(data){
                    sweet.show('', 'Error al cargar la informacion de los técnicos: ', 'error');
                });
            }
            $scope.ListActivos = "";
        }
        else {
            sweet.show('', 'Debe seleccionar funcionario primero: ', 'warning');
            $scope.CODIGOAF="";
        }
    }
    $scope.selectedRow = null;
    $scope.setClickedRow = function(index){
        $scope.selectedRow = index ;
        sweet.show({
            title: 'Asignar',
            text: 'Desea Asignar el Activo ' + $scope.ListActivos[$scope.selectedRow].dag_ubm_activo_codigoaf + '?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'SI',
            closeOnConfirm: false
        }, function() {
            sweet.close();
            var size = Object.keys($scope.ListActivos1).length;
            var sw=true;
            for(var j=0; j<size; j++){
                console.log($scope.ListActivos1[j].dag_ubm_activo_codigoaf,' ',$scope.ListActivos[$scope.selectedRow].dag_ubm_activo_codigoaf)
                if ($scope.ListActivos1[j].dag_ubm_activo_codigoaf == $scope.ListActivos[$scope.selectedRow].dag_ubm_activo_codigoaf) {
                    sw=false;
                }
            }
            if (sw) {
                $scope.ListActivos1.push({ 
                    dag_ubm_activo_codigoaf: $scope.ListActivos[$scope.selectedRow].dag_ubm_activo_codigoaf,
                    dag_ubm_activo_codigo: $scope.ListActivos[$scope.selectedRow].dag_ubm_activo_codigo,
                    dag_ubm_activo_codigoold: $scope.ListActivos[$scope.selectedRow].dag_ubm_activo_codigoold,
                    dag_ubm_activo_nombre: $scope.ListActivos[$scope.selectedRow].dag_ubm_activo_nombre,
                    dag_ubm_activo_descripcion: $scope.ListActivos[$scope.selectedRow].dag_ubm_activo_descripcion
                });    
            }
            // sweet.show('', 'Error al guardar la informacion: ', 'error');
            $scope.ListActivos.splice(index,1);

        });
    }
    $scope.selectedRow1 = null;
    $scope.setClickedRow1 = function(index){
        $scope.selectedRow1 = index ;
        sweet.show({
            title: 'Quitar de la Lista',
            text: 'Desea eliminar el Activo ' + $scope.ListActivos1[$scope.selectedRow1].dag_ubm_activo_codigoaf + '?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'SI',
            closeOnConfirm: false
        }, function() {
            sweet.close();
            $scope.ListActivos1.splice(index,1);
        });
    }
    $scope.RevisarFunc = function () {
        if ($scope.S_SOLICITANTE != "") {
            // no hacer nada
        }
        else {
            sweet.show('', 'Debe seleccionar funcionario primero: ', 'warning');
            $scope.Sec_Sel="0";
        }
    }
    $scope.getSector = function(){
        var resSector = {
            table_name:"dag.dag_dag_sectores",
            order:"dag_s_s ASC",
            filter:"dag_s_gestion=" + $scope.gestion + " and dag_s_estado='A'"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resSector);
        obj.success(function(response){
            $scope.datosSector = response.record;
            $scope.Sec_Sel="0";
        })
        .error(function(response){
            sweet.show('', 'Error: ', 'error');
        })
    }
    $scope.getDA = function(){
        var resDA = {
            table_name:"dag.dag_dag_direccion_administrativa",
            order:"dag_da_s ASC, dag_da_da ASC",
            filter:"dag_da_gestion=" + $scope.gestion + " and dag_da_estado LIKE 'A'"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resDA);
        obj.success(function(response){
            $scope.datosDirAdm = response.record;
            $scope.DA_Sel="0";
        })
        .error(function(response){
            sweet.show('', 'Error: ', 'error');
        })
    }
    $scope.getUE = function(){
        var resUE = {
            table_name:"dag.dag_dag_unidad_ejecutora",
            order:"dag_ue_s ASC, dag_ue_da ASC, dag_ue_ue ASC",
            filter:"dag_ue_gestion=" + $scope.gestion + " and dag_ue_estado LIKE 'A'"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resUE);
        obj.success(function(response){
            $scope.datosUniEje = response.record;
            $scope.UE_Sel="0";
        })
        .error(function(response){
            sweet.show('', 'Error: ', 'error');
        })
    }
    $scope.getUO = function(){
        var resUO= {
            table_name:"dag.dag_dag_unidad_organizacional",
            order:"dag_uo_s ASC, dag_uo_da ASC, dag_uo_ue ASC, dag_uo_uo ASC",
            filter:"dag_uo_gestion=" + $scope.gestion + " and dag_uo_estado LIKE 'A'"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resUO);
        obj.success(function(response){
            $scope.datosUniOrg = response.record;
            $scope.UO_Sel="0";
        })
        .error(function(response){
            sweet.show('', 'Error: ', 'error');
        })
    }
    $scope.guardarcontinuar = function () {
        var sw = false;
        if (Object.keys($scope.ListActivos1).length == 0){
            sweet.show('', 'No selecciono ningun activo para asignar al funcionario', 'error');
        }
        else
        {
            if ($scope.Sec_Sel != 0 && $scope.DA_Sel != 0 && $scope.UE_Sel != 0 && $scope.UO_Sel != 0 &&
                $scope.Sec_Sel != null && $scope.DA_Sel != null && $scope.UE_Sel != null && $scope.UO_Sel != null)
            {
                var size = Object.keys($scope.ListActivos1).length;
                var xi = 0;
                var nodo_asigna = '[';
                for(var j=0; j<size; j++){
                    if (xi>0) {nodo_asigna=nodo_asigna+','}
                    nodo_asigna = nodo_asigna+'{"codigoaf":"'+$scope.ListActivos1[j].dag_ubm_activo_codigoaf
                                    +'","ciresp":"'+$scope.funcionario+'","sector":'+$scope.Sec_Sel+',"da":'
                                    +$scope.DA_Sel+',"ue":'+$scope.UE_Sel+',"uo":'+$scope.UO_Sel+',"gestion":'
                                    +$scope.gestion+',"obsform":"","tecasig":"'+$scope.ID_Tecnico+'","obsact":""}';
                    xi++;
                }
                nodo_asigna=nodo_asigna+']'
                var datosAsignacion = {
                    "procedure_name":"dag.sp_dag_ubm_generaasignacionjer",
                    "body":{
                        "params": [
                            {
                                "name": "parametrosasig",
                                "value": nodo_asigna

                            }
                        ]
                    }
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosAsignacion).success(function (response){
                    $scope.FormulariosGenerados = response;
                    console.log("Formularios Generados ",$scope.FormulariosGenerados);
                })
                .error(function(data){
                    sweet.show('', 'Error al guardar la informacion: ', 'error');
                });
            }
            else
            {
                sweet.show('', 'No selecciono bien el Area Organizacional', 'error');
            }
        }
    }
    // PROCEDIMINETOS CUANDO SE INGRESA AL FORMULARIO O SE HACE F5
	$scope.$on('api:ready',function(){
        $scope.ID_Tecnico=sessionStorage.IDUSUARIO;
        $scope.getSector();
        $scope.getDA();
        $scope.getUE();
        $scope.getUO();
        $scope.Sec_Sel="0";
        $scope.DA_Sel="0";
        $scope.UE_Sel="0";
        $scope.UO_Sel="0";
		$scope.Cargarfuncionarios();
        $scope.S_SOLICITANTE = "";
        $scope.ListActivos1 = [];
        $scope.CODIGOAF="";
        $scope.filtro="";
		//$scope.datos.agregado = "false";
        //console.log("tecnico:",$scope.ID_Tecnico);
	});
	$scope.inicioDagAsigJer = function () {
		if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.ID_Tecnico=sessionStorage.IDUSUARIO;
            $scope.getSector();
            $scope.getDA();
            $scope.getUE();
            $scope.getUO();
            $scope.Sec_Sel="0";
            $scope.DA_Sel="0";
            $scope.UE_Sel="0";
            $scope.UO_Sel="0";
			$scope.Cargarfuncionarios();
            $scope.S_SOLICITANTE = "";
            $scope.ListActivos1 = [];
            $scope.CODIGOAF="";
            $scope.filtro="";
			//$scope.datos.agregado = "false";
            //console.log("tecnico:",$scope.ID_Tecnico);
		}
	}; 
});