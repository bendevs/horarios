app.controller('impresionController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet, $sce) {
    $scope.datosImpresion           =   "";
    $scope.formatoImpresionData    =   "";

    var strfecha        = new Date();
    var strfechactual   =   strfecha.getFullYear() + "-" + strfecha.getMonth() + "-" + strfecha.getDate() + " " + strfecha.getHours() + ":" + strfecha.getMinutes() + ":" + strfecha.getSeconds();

    /*IMPRESIONES*/

    /*$scope.getImpresiones = function(datosActividad){
        $scope.datosImpresion = datosActividad;
    };*/


    /*INCIALIZANDO VARIABLES DEL BOTON*/
    $scope.btnImprimir = "";


    $scope.vistaprevia = function(impresion){
        var impcon= impresion.impcontenido;
        var contenido ="<div id='muestra'><div align='center'><table width='750' height='183' border='1px' bordercolor='#000000'> "+"</td></tr><tr><td colspan='5'><b>contenido:</b><td>" + impresion.impcontenido + "</td>";
        var popupWin = window.open('', '_blank', 'width=900,height=300');
        var printContents = document.getElementById('impcontenido').innerHTML;
        $scope.contenido1=printContents
        var popupWin;
        popupWin.document.open();
        popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" />' + contenido + '</html>');
        popupWin.document.close();
    };

    $scope.vistaFormatoImpresion = function(impresion){
      console.log("VISTA DATOS DE IMPRESION:", impresion);
      $scope.desabilitado = true;
        $scope.formatoImpresionData    =   impresion;
        var vistap=document.getElementById('impVistaPrevia');
        vistap.innerHTML  = impresion.impcontenido;
        $scope.tituloImp  = "Impresión Vista Previa";
    };

    /*VALIDANDO BOTONES FORMULARIO*/
    $scope.actualizarFormImpresion = function(){
      console.log("NUEVOS DATOS DE IMPRESION:");
        $scope.btnImprimir="new";
        $scope.desabilitado=false;
        $scope.tituloImp="Registrar Formato de Impresión";
        $scope.formatoImpresionData='';
    };

    /*VALIDANDO BOTONES FORMULARIO - ACTUALIZAR*/
    $scope.modificarCargarFormatoImpresion = function(impresion){
        console.log("MODIFICAR DATOS DE IMPRESION:", impresion);
        $scope.desabilitado=false;
        $scope.formatoImpresionData=impresion;
        $scope.btnImprimir="upd";
        $scope.tituloImp="Modificar Formato de Impresión";
        /*$scope.desabilitado=false;
        $scope.tituloP="Modificar Actividad";
        $scope.getTipoActividad();
        $scope.buscarNodo(datosActividad.nodonombre);
        $scope.getActividad();*/
    };


    /*VALIDANDO BOTONES FORMULARIO - ACTUALIZAR*/
    $scope.eliminarCargarFormatoImpresion = function(impresion){
      console.log("Eliminar DATOS DE IMPRESION:", impresion);
      $scope.desabilitado=true;
        $scope.formatoImpresionData    =   impresion;
        $scope.btnImprimir             =   "del";
        $scope.tituloImp="Eliminar Formato de Impresión";


        /*$scope.desabilitado=false;
        $scope.tituloP="Modificar Actividad";
        $scope.getTipoActividad();
        $scope.buscarNodo(datosActividad.nodonombre);
        $scope.getActividad();*/
    };

    /*LISTA FORMATOS DE IMPRESION*/
    $scope.tablaImpresion = {};
    $scope.obtImpresion = "";
   $scope.impresionFormatoListar = function(datosImpresion){
            $scope.wsId=datosImpresion;
            console.log("ggggggggg",$scope.wsId);
            $.blockUI();

            $scope.formatoImpresionData = null;
            var resOpcion = {
                "procedure_name":"sp_lst_formato_impresion",
                "body":{"params": [{"name":"ws_id","value":datosImpresion}]
                }
            };

            var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion).success(function (response){
                    $scope.formImpresionData = response;
                    console.log("aver",response);

                    console.log($scope.formatoImpresionData);
                      $scope.obtImpresion = response;
                      console.log("hola",$scope.obtImpresion);
                      //console.log($scope.obtImpresion);
                    //$scope.obtImpresion = response;
                    var data = response;   //grabamos la respuesta para el paginado
                    $scope.tablaImpresion.reload();
                $.unblockUI();

            }).error(function(error) {
            });
        };
        $scope.tablaImpresion = new ngTableParams({
            page: 1,
            count: 10,
            filter: {},
            sorting: {}
        }, {
            total: $scope.obtImpresion.length,
            getData: function($defer, params) {
                var filteredData = params.filter() ?
                $filter('filter')($scope.obtImpresion, params.filter()) :
                $scope.obtImpresion;
                var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                $scope.obtImpresion;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    /*ADICIONAR NUEVO FORMATO DE IMPRESION*/
    $scope.adicionarFormatoImpresion = function(datosImpresion){
      console.log("ADICIONAR DATOS DE IMPRESION:", datosImpresion);
        $.blockUI();
        var impresion = {};
        impresion['fimp_descripcion']   = datosImpresion.impdescripcion;
        impresion['fimp_contenido']     = datosImpresion.impcontenido;
        impresion['fimp_tipo_hoja']     = datosImpresion.imptipo_hoja;
        impresion['fimp_margenes']      = datosImpresion.impmargenes;
        impresion['fimp_ws_id']   = $scope.wsId;
        impresion['fimp_registrado']    = strfechactual;
        impresion['fimp_modificado']    = strfechactual;

        var resImpresion = {"table_name":"_fr_formatos_impresion",
                        "body":impresion};
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resImpresion);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            //$.unblockUI(); //cerrar la mascara
            $scope.impresionFormatoListar($scope.wsId);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    /*MODIFICAR DATOS DE LA IMPRESION*/
    $scope.modificarFormatoImpresion = function(datosImpresion){
        /*ACTUALIZAR UN CAMPO DEL FORMULARIO*/
        console.log("MODIFICAR DATOS IMPRESION:", datosImpresion);
        var resOpcion = {
            "procedure_name":"sp_actualizar_formato_impresion",
            "body":{
                "params": [
                    {
                        "name": "impid",
                        "value": datosImpresion.impid
                    },{
                        "name": "impdescripcion",
                        "value": datosImpresion.impdescripcion
                    },{
                        "name": "impcontenido",
                        "value": datosImpresion.impcontenido
                    },{
                        "name": "imptipo_hoja",
                        "value": datosImpresion.imptipo_hoja
                    },{
                        "name": "impmargenes",
                        "value": datosImpresion.impmargenes
                    },{
                        "name": "tipo_espa",
                        "value": $scope.wsId
                    }
                ]
            }
        };

        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
        obj.success(function (data){
            console.log(data);
            $scope.impresionFormatoListar($scope.wsId);
            sweet.show('', 'Registro modificado', 'success');
        }).error(function(error) {
        });
    };


    /*ELIMINAR DATOS DE LA IMPRESION*/
    $scope.eliminarFormatoImpresion = function(impid){
        console.log("1111111111111",strfechactual);
        $.blockUI();
        console.log("ELIMINAR REGISTRO:", impid);
        
        var resOpcion = {
            "procedure_name":"eliminar_for_impresion",
            "body":{
                "params": [
                    {
                        "name": "wd_id",
                        "value": impid
                    },{
                        "name": "mod",
                        "value": strfechactual
                    },{
                        "name": "est",
                        "value": 'B'
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
       
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $scope.impresionFormatoListar($scope.wsId);
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };




    $scope.$on("ckeditor.ready", function( event ) {
        $scope.isReady = true;
    });
    $scope.editorOptions = {
        language: 'es',
        uiColor: '#E5E6E8'
    };

    $scope.$on('api:ready',function(){
        $scope.impresionFormatoListar(sessionService.get('WS_ID'));
    });
    $scope.inicioFormatoImpresion = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.impresionFormatoListar(sessionService.get('WS_ID'));
        }
    };
});
