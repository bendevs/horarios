app.controller('misCasosController', function ($scope, $q,$route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout,fileUpload, $location) {
    var strfecha= new Date();
    var mes=strfecha.getMonth()+1;
    if(mes.toString().length==1)
        mes='0'+mes;
    var dia=strfecha.getDate();
    if(dia.toString().length==1)
        dia='0'+dia;
    $scope.fechactual=strfecha.getFullYear() + "-" + mes + "-" + dia + " " + strfecha.getHours() + ":" + strfecha.getMinutes() + ":" + strfecha.getSeconds();
    $scope.panelCasos=true;
    $scope.panelFormularios=false;
    $scope.tituloP='Mis Trámites';
    $scope.nodoAsignado=true;
    $scope.memoria=[];
    $scope.contador=0;
    $scope.errors = {};
    $rootScope.array = [];
    $scope.ImagenProceso = '{}';
    $scope.ImagenLinks = '';
    $scope.cargarLibreria = 0;
    $scope.abrirHistorico = 0;
    //paginado
    var rango = 10;
    var inicio = 0;
    var fin = 10;
    $scope.pagina = 1;
    $scope.totalcasos = 1;
    var datoslong = 0;
    var datosy = 0;
    var contnum = 0;
    var obtdatoscasos = 0;
    var xaux = 0;
    var x2 = 0;
    $scope.tablaBandeja = {};
    $scope.obtCasos = "";

    $scope.getNodosUsusario = function(){
        try {
            var rNodo = new nodo();
            rNodo.usuario = sessionService.get('USUARIO');
            rNodo.listarNodo(function(res){
                x = JSON.parse(res);
                response = x.success.data;
                $scope.nodos=response;
                $timeout( function(){
                    $scope.getNodoSelect();
                }, 1000);
            });
        } catch (error){
            $scope.errors["error_rol"] = error;
        }

        /*
        var resOpcion = {
            "procedure_name":"sp_lst_nodo",
            "body":{
                "params": [
                    {
                        "name": "usuario",
                        "value": sessionService.get('USUARIO')
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            console.log(response);
            $scope.nodos=response;
            $timeout( function(){
                $scope.getNodoSelect();
            }, 1000);
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
        */
    };
    $scope.getNodoSelect = function(){
        var valorCombo='';
        if(sessionService.get('US_IDNODO')){
            valorCombo='{"nodoid":'+sessionService.get('US_IDNODO')+',"nodonombre":"'+sessionService.get('NODO')+'"}';
        }
        else{
            valorCombo='{"nodoid":'+sessionService.get('US_IDNODO')+',"nodonombre":"'+sessionService.get('US_NODODESCRIPCION')+'"}';
        }
        if(document.getElementById('NodoId'))
        {
            document.getElementById('NodoId').value = valorCombo
        }
    }

    $scope.getCasos = function(){
        $('.pagination').hide();
        $('.btn-group').hide();
        try {
            var rCaso = new casos();
            rCaso.nodo = sessionService.get('IDNODO');
            rCaso.ws = sessionService.get('WS_ID');
            rCaso.listar(function(res){
                x = JSON.parse(res);
                response = x.success.data;
                angular.forEach(response,function(celda, fila){
                    celda.casodata = JSON.stringify(celda.casodata);
                });
                $scope.obtCasos = response;
                obtdatoscasos = response;
                var data = response;
                console.log("data: ",data.length, data,"total casos: ",obtdatoscasos.length);

                if(obtdatoscasos.length < 10){
                    $scope.totalcasos = 1;
                    document.getElementById("idsiguiente").disabled = true;
                     console.log('ingresa <10');
                }
                else{
                    console.log("siguienteeeeee");
                    //$scope.totalcasos = obtdatoscasos.length/10;
                    xaux = obtdatoscasos.length/10;
                    x2 = obtdatoscasos.length%10;
                    if(x2 > 0 && x2 < 6){
                        $scope.totalcasos = parseInt(xaux)+1;
                        console.log('total casos1: ',$scope.totalcasos);
                        document.getElementById("idsiguiente").disabled = false;

                    }
                    else{
                            $scope.totalcasos = xaux.toFixed();
                           console.log('total casos2: ',$scope.totalcasos);
                            document.getElementById("idsiguiente").disabled = false;

                        }

                }

                $scope.tablaBandeja.reload();
            });
        }catch (error){
            $scope.errors["error_rol"] = error;
        }
        /*
        var resOpcion = {
            "procedure_name":"casoslst",
            "body":{
                "params": [
                    {
                        "name": "id_nodo",
                        "value": sessionService.get('IDNODO')
                    },
                    {
                        "name": "id_ws",
                        "value": sessionService.get('WS_ID')
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            console.log(response);
            $scope.obtCasos = response;
            var data = response;
            $scope.tablaBandeja.reload();
            console.log("response sirve");
            console.log(response);

        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
*/
    };

    $scope.tablaBandeja = new ngTableParams({
        page: 1,
        count: 10,
        filter: {},
        sorting: {
            casoid: 'desc'
        }
    }, {
        total: $scope.obtCasos.length,
        getData: function($defer, params) {
            var filteredData = params.filter() ?
            $filter('filter')($scope.obtCasos, params.filter()) :
            $scope.obtCasos;
            var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            $scope.obtCasos;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

        }
    });

    $scope.filtroTramites = function(nodo){
        $scope.pagina = 1;
        obtdatoscasos = 0;
        inicio = 0;
        fin = 10;
        var xaux = 0;
        var x2 = 0;
        var nodoDato=JSON.parse(nodo);
        var resParametricos = {
            "table_name" : "ct_nodos",
            "filter":"nodo_id="+ nodoDato.nodoid
        };
        console.log(resParametricos);
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resParametricos);
        obj.success(function (data) {
            console.log(data.record[0].nodo_macrodistrito);
            sessionService.set('US_IDMACRO', data.record[0].nodo_macrodistrito);
        });
        sessionService.set('NODO', nodoDato.nodonombre);
        sessionService.set('IDNODO', nodoDato.nodoid);
        $scope.getCasos();
    }

    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };
    $scope.startDateOpen2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened2 = true;
    };
    $scope.getDatos = function(tablaNombre){
        var promise;
        var resGestion = {
            "table_name":tablaNombre
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resGestion);
        obj.success(function (data) {
            $scope.promise=data.record;
        })
        obj.error(function(error) {
            defered.reject(error);
        });
    };

    $scope.getProcesos = function(){
        var resOpcion = {
            "procedure_name":"sp_lstproceso",
            "body":{
                "params": [
                    {
                        "name": "wsid",
                        "value": sessionService.get('WS_ID')
                    },
                    {
                        "name": "usr",
                        "value": sessionService.get('USUARIO')
                    }
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion).success(function (response){
            $scope.obtProceso = response;
            var data = $scope.obtProceso;
            angular.forEach($scope.obtProceso,function(val, index){
                if($scope.sIdProcesoActual == val.procid){
                    $scope.mostrardepuracion = val.pdepuracion;
                    if($scope.mostrardepuracion){
                        $scope.classPropiedadesFormulario = "col-md-3";
                        $scope.classCuerpo = "col-md-9";
                        $scope.btnBlock_1   = true;
                        $scope.btnBlock_2   = false;
                    }else{
                        $scope.classPropiedadesFormulario = "col-md-0";
                        $scope.classCuerpo = "col-md-12";
                    }
                }
            });

        $scope.tablaProcesos = new ngTableParams({
                page: 1,
                count: 10,
                filter: {},
                sorting: {}

            }, {
                total: $scope.obtProceso.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtProceso, params.filter()) :
                    $scope.obtProceso;
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtProceso;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };

    $scope.volver = function(){
        if ($scope.estadoCaso=="ACTIVIDAD") {
            $location.path('formularios|reimpresion|index.html');
        } else {
            $scope.tituloP='Mis Casos';
            $scope.panelCasos=true;
            $scope.panelFormularios=false;
            $scope.nodoAsignado = true;
            $route.reload();
        }
    }

    $scope.atenderCaso = function(caso,estadoT){
        $scope.estadoCaso = estadoT;
        if (estadoT == "RESUMEN") {
            sessionService.set("TRAMITE_ACTUAL", caso.casonombre);
            //$scope.getProcesos();
            $scope.sIdProcesoActual = caso.procid;
            $scope.sCasoNro = caso.casonro;
            $scope.sCasonombre = caso.casonombre;
            $scope.sCasoNombre = caso.actnombre;
            $scope.sIdCaso = caso.casoid;
            $scope.sProcNombre = caso.procnombre;
            sessionService.set('DATOSTRAMITE',JSON.stringify(caso).toString());
            $scope.nodoAsignado=false;
            $scope.casoActual=caso;
            $scope.seleccionado=true;
            $scope.tituloP='TRÁMITE: '+caso.casonombre;
            $scope.datos=JSON.parse(caso.casodata);
            $scope.trmFormulario = $scope.datos;
            $scope.impFormulario = JSON.parse(caso.casodata);
            $scope.panelCasos=false;
            $scope.panelFormularios=true;
            var response1 = {};
            response1.actid = 0;
            response1.formdescripcion = "RESUMEN GERMAN";
            response1.formdescripcion2 = "FORMULARIO RESUMEN";
            response1.formdireccionamiento = null;
            response1.formid = caso.resumenid;
            response1.formorden = 10;
            response1.formreglas = '[{"regfid":183,"regformid":' + caso.resumenid + ',"regforden":10,"regfsiguiente":176,"regfregla":"true","regftipo":"ENTRADA"}]"';
            response1.formtpdescripcion = "formulario";
            response1.formtpid = 1;
            response1.formurl = "render.html?"+caso.resumenid;
            sessionService.set('FRMRENDER', caso.resumenid);
            response = new Array(1);
            response[0] = response1;
            $scope.cargarDatosResumen($scope.datos);
            //$scope.directorio = response.formdireccionamiento;
            $scope.cargarFormularioResumen(response,0);
        } else {
            if (estadoT=="ACTIVIDAD") {
                sessionService.set("TRAMITE_ACTUAL", caso.casonombre);
                $scope.getProcesos();
                $scope.sIdProcesoActual = caso.procid;
                $scope.sCasoNro = caso.casonro;
                $scope.sCasonombre = caso.casonombre;
                $scope.sCasoNombre = caso.actnombre;
                $scope.sIdCaso = caso.casoid;
                $scope.sProcNombre = caso.procnombre;
                sessionService.set('DATOSTRAMITE',JSON.stringify(caso).toString());
                $scope.nodoAsignado=false;
                $scope.casoActual=caso;
                $scope.seleccionado=true;
                $scope.tituloP='TRÁMITE: '+caso.casonombre;
                $scope.datos=JSON.parse(caso.casodata);
                $scope.trmFormulario = $scope.datos;
                $scope.impFormulario = JSON.parse(caso.casodata);
                $scope.panelCasos=false;
                $scope.panelFormularios=true;
                var resOpcion = {
                    function_name: "formularioslst",
                    "body":{"params": [{"name":"actidd","value":caso.casoactid}]}
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
                    $scope.obtFormularios=response;
                    if(response.length>0)
                    {   $scope.cargarDatos($scope.datos);
                        $scope.directorio = response[0].formdireccionamiento;
                        $scope.cargarFormulario(response[0],0);
                    }
                    else
                        $scope.cargarFormulario('');
                }).error(function(error) {
                    $scope.errors["error_rol"] = error;
                });
                var resRegla = {
                   function_name: "reglaslst",
                   "body":{"params": [{"name":"actidd","value":caso.casoactid}]}
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resRegla).success(function (response){
                    if(response.length>0)
                    {
                        $scope.obtReglas=response;
                    }
                    else
                        $scope.obtReglas='';
                }).error(function(error) {
                    $scope.errors["error_rol"] = error;
                });
            } else {
                sessionService.set("TRAMITE_ACTUAL", caso.casonombre);
                if(estadoT == 'ver'){
                    $scope.desabilitado=true;
                }
                $scope.getProcesos();
                $scope.sIdProcesoActual = caso.procid;
                $scope.sCasoNro = caso.casonro;
                $scope.sCasonombre = caso.casonombre;
                $scope.sCasoNombre = caso.actnombre;
                $scope.sIdCaso = caso.casoid;
                $scope.sProcNombre = caso.procnombre;
                sessionService.set('DATOSTRAMITE',JSON.stringify(caso).toString());
                $scope.nodoAsignado=false;
                $scope.casoActual=caso;
                $scope.seleccionado=true;
                $scope.tituloP='TRÁMITE: '+caso.casonombre;
                if (caso.casodata != null && typeof caso.casodata != 'object') {
                    $scope.datos=JSON.parse(caso.casodata);
                    $scope.impFormulario = JSON.parse(caso.casodata);
                } else {
                    $scope.datos=caso.casodata;
                    $scope.impFormulario = caso.casodata;
                }
                $scope.trmFormulario = $scope.datos;
                $scope.panelCasos=false;
                $scope.panelFormularios=true;
                var resOpcion = {
                    function_name: "formularioslst",
                    "body":{"params": [{"name":"actidd","value":caso.casoactid}]}
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
                    $scope.obtFormularios=response;
                    if(response.length>0)
                    {   $scope.cargarDatos($scope.datos);
                        $scope.directorio = response[0].formdireccionamiento;
                        $scope.cargarFormulario(response[0],0);
                    }
                    else
                        $scope.cargarFormulario('');
                }).error(function(error) {
                    $scope.errors["error_rol"] = error;
                });
                var resRegla = {
                   function_name: "reglaslst",
                   "body":{"params": [{"name":"actidd","value":caso.casoactid}]}
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resRegla).success(function (response){
                    if(response.length>0)
                    {
                        $scope.obtReglas=response;
                    }
                    else
                        $scope.obtReglas='';
                }).error(function(error) {
                    $scope.errors["error_rol"] = error;
                });
            }
        }
    };

    $scope.getGrillaDatos = function(){
        inicio = 0;
        fin = 10;
        $scope.pagina = 1;
    }

    $scope.recibirTramite = function (datos,estadoT){
        sessionService.set("TRAMITE_ACTUAL", datos.casonombre);
        if ($scope.procesoid)
            sessionService.set("TRAMITE_ACTUAL", $scope.procesoid.procodigo + datos.casonro + "/" + strfecha.getFullYear());
        if(estadoT == 'recibir' || estadoT == 'tomarAtender')
        {
            $scope.usuarioid=sessionService.get('IDUSUARIO');
        }
        else{
            $scope.usuarioid=0;
        };
        var misDatos = {
            "procedure_name":"sp_tomar_tramite",
            "body":{
                "params": [
                    {
                        "name": "tid",
                        "value": datos.casoid
                    },{
                        "name": "tuser",
                        "value": $scope.usuarioid
                    }
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (response){
            if(response[0].sp_tomar_tramite){
                if(estadoT == 'recibir')
                {
                    sweet.show('', "Trámite recibido", 'success');
                    $scope.lstcaso_actual();
                }
                if(estadoT == 'dejar')
                {
                    sweet.show('', "Trámite Dejado", 'success');
                    $route.reload();
                    //$scope.getCasos();
                }
            } else {
                sweet.show('', "El Trámite ya fue recibido por otro usuario", 'error');
                $route.reload();
            }
        }).error(function(response){
        });
    };
    $scope.cargarDatosResumen = function(datos){
        $scope.datosHistorico=datos;
        $scope.datos=datos;
        $scope.datos.g_tipo=$scope.casoActual.procodigo;
        $scope.datos.AE_NRO_CASO=$scope.sCasonombre;
    }
    $scope.cargarDatos=function(datos){
        $scope.datosHistorico=datos;
        $scope.datos=datos;
        $scope.datos.g_tipo=$scope.casoActual.procodigo;
        $scope.datos.AE_NRO_CASO=$scope.sCasonombre;

        if($scope.datos.INT_TIPO_DOC_IDENTIDAD=="NIT"){
            $scope.datos.INT_TIPO_DOC_IDENTIDAD="NT"
        }

        if($scope.datos.INT_TIPO_DOC_IDENTIDAD=="RC"){
            $scope.datos.INT_TIPO_DOC_IDENTIDAD="RUC"
        }

        if ($scope.datos.INT_TIP_VIA=="AVENIDA") {
            $scope.datos.INT_VIA="AV";
            $scope.datos.INT_TIP_VIA="AV";
        }

        if ($scope.datos.INT_TIP_VIA=="CALLE") {
            $scope.datos.INT_VIA="CA";
            $scope.datos.INT_TIP_VIA="CA";
        }

        if ($scope.datos.INT_TIP_VIA=="CALLEJON") {
            $scope.datos.INT_VIA="CL";
            $scope.datos.INT_TIP_VIA="CL";
        }

        if ($scope.datos.INT_TIP_VIA=="CANCHA") {
            $scope.datos.INT_VIA="CN";
            $scope.datos.INT_TIP_VIA="CN";
        }

        if ($scope.datos.INT_TIP_VIA=="PARQUE") {
            $scope.datos.INT_VIA="PR";
            $scope.datos.INT_TIP_VIA="PR";
        }

        if ($scope.datos.INT_TIP_VIA=="PLAZA") {
            $scope.datos.INT_VIA="PL";
            $scope.datos.INT_TIP_VIA="PL";
        }

        if ($scope.datos.INT_TIP_VIA=="NO DEFINIDO") {
            $scope.datos.INT_VIA="ND";
            $scope.datos.INT_TIP_VIA="ND";
        }

        if ($scope.datos.INT_TIP_VIA=="PASAJE") {
            $scope.datos.INT_VIA="PA";
            $scope.datos.INT_TIP_VIA="PA";
        }
    }
    $scope.mensajeError = function(mensaje) {
        sweet.show('Campos obligatorios', mensaje, 'error');
    }
    $scope.datosRender = function() {
        $.blockUI();

        var sDataSession    =   sessionService.get('DATOSTRAMITE');
        var sNumCasoNombre =   "";
        if(sDataSession){
            sNumCasoNombre =   JSON.parse(sDataSession).casonombre;
        }
        var multi_datos = document.renderForm.elements;
        var caso = {};
        try{
            data = '"{';
            if(multi_datos.length > 0 )
            {
                for (var i = 0; i < multi_datos.length; i++) {
                    nombreCampo = multi_datos[i].id;
                    valorCampo = multi_datos[i].value;
                    tipo = multi_datos[i].type;
                    if (multi_datos[i].type!="checkbox") {
                        if (multi_datos[i].style.cssText == "visibility: hidden;"){
                            //caso de la grilla usando un textarea
                            campo = multi_datos[i].id;
                            if (document.getElementById(campo).value != "undefined"){
                                datos = JSON.parse(document.getElementById(campo).value);
                                nuevosDatos = JSON.stringify(datos);
                                X = new RegExp("null,", "g");
                                Y = new RegExp(",null", "g");
                                Z = new RegExp("null", "g");
                                nuevosDatos = nuevosDatos.replace(X,"");
                                nuevosDatos = nuevosDatos.replace(Y,"");
                                nuevosDatos = nuevosDatos.replace(Z,"");
                                data = data + '"'+ nombreCampo +'": '+ nuevosDatos +', ';
                            } else {
                                data = data + '"'+ nombreCampo +'": [], ';
                            }
                        } else {
                            if (multi_datos[i].type=="radio"){
                                //caso de radio button
                                var multi_radio = document.renderForm.elements[multi_datos[i].name];
                                i = i + multi_radio.length-1;
                                data = data + '"'+ nombreCampo +'": "'+ multi_radio.value +'", ';
                            } else  if (tipo=="file") {
                                if(multi_datos[i].files[0] === undefined){
                                    $scope.direccionvirtual= CONFIG.APIURL +"/files/" + $scope.sIdProcesoActual + "/" + $scope.sIdCaso + "/";
                                    data = data+ '"'+nombreCampo +'":"'+$scope.direccionvirtual+multi_datos[i].name+'?app_name=todoangular",';
                                }
                                else{
                                   $scope.direccionvirtual= CONFIG.APIURL +"/files/" + $scope.sIdProcesoActual + "/" + $scope.sIdCaso + "/";
                                    var direccion = fileUpload.uploadFileToUrl(multi_datos[i].files[0], $scope.direccionvirtual);
                                    var z=valorCampo.split('\\');
                                    if (z[2] === undefined){
                                         data = data+ '"'+nombreCampo +'":"'+$scope.direccionvirtual+valorCampo+'?app_name=todoangular",';
                                    }
                                    else{
                                         data = data+ '"'+nombreCampo +'":"'+$scope.direccionvirtual+z[2]+'?app_name=todoangular",';
                                    }
                                 }
                            } else {
                                //caso para text, textarea, campo oculto, etc
                                if (document.getElementById(nombreCampo+"_ifr")){
                                    var iFrame =  document.getElementById(nombreCampo+"_ifr");
                                    var iFrameBody;
                                    if ( iFrame.contentDocument )
                                    { // FF
                                        iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
                                        valorCampo = iFrameBody.outerHTML;
                                        quitarComillas = new RegExp('"', "g");
                                        valorCampo = valorCampo.replace(quitarComillas,"'");
                                    }
                                    else if ( iFrame.contentWindow )
                                    { // IE
                                        iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
                                        valorCampo = iFrameBody.outerHTML;
                                        quitarComillas = new RegExp('"', "g");
                                        valorCampo = valorCampo.replace(quitarComillas,"'");
                                    }
                                }

                                if (nombreCampo){
                                    data = data + '"'+ nombreCampo +'": "'+ valorCampo +'", ';
                                }
                            }
                        }
                    } else {
                        var multi_radio = document.renderForm.elements[multi_datos[i].id];
                        if (multi_radio.length > 1){
                            //checkbox multiples
                            valorCHK='{"tipo":"CHKM"},';
                            for (var j = 0; j < multi_radio.length; j++) {
                                //contador = contador + 1;
                                nombreCampoInterno = multi_radio[j].id;
                                valorCampoInterno = multi_radio[j].value;
                                seleccionadoI = multi_radio[j].checked;
                                if (seleccionadoI ==true) {
                                    valorCampoCHKI = "true";
                                } else {
                                    valorCampoCHKI = "false";
                                }
                                partesI = valorCampoInterno.split("_");
                                valorCHK = valorCHK + '{"resid": ' + partesI[0]+ ', "estado": ' + valorCampoCHKI + ', "resvalor": "' + partesI[1]+ '"},';
                            }
                            i = i + multi_radio.length - 1;
                            valorCHK = valorCHK.substring(0, valorCHK.length -1);
                            valorCHK = '"' + nombreCampo +'":[' + valorCHK +'],';
                            data = data + valorCHK;
                        } else {

                            nombreCampoInterno = multi_datos[i].id;
                            valorCampoInterno = multi_datos[i].value;
                            seleccionadoI = multi_datos[i].checked;
                            partesI = valorCampoInterno.split("_");
                            if (partesI.length > 1){
                                if (seleccionadoI ==true) {
                                    valorCampoCHKI = "true";
                                } else {
                                    valorCampoCHKI = "false";
                                }
                                valorCHK = '{"tipo":"CHKM"}, {"resid": ' + partesI[0]+ ', "estado": ' + valorCampoCHKI + ', "resvalor": "' + partesI[1]+ '"}';
                                valorCHK = '"' + nombreCampoInterno +'":[' + valorCHK +'],';
                                data = data + valorCHK;

                            } else {
                                if (seleccionadoI ==true) {
                                    valorCampoCHKI = "true";
                                } else {
                                    valorCampoCHKI = "false";
                                }
                                data = data + '"'+ nombreCampoInterno +'": [{"tipo":"CHK"},{"valor": "'+ valorCampoCHKI +'"}], ';
                            }


                        }
                    }
                }
                angular.forEach($scope.datos,function(cel, fil){
                    swDatos = 0;
                    for (var i = 0; i < multi_datos.length; i++) {
                        nombreCampo = multi_datos[i].id;
                        valorCampo = multi_datos[i].value;
                        if (fil==nombreCampo){
                            i = multi_datos.length
                            swDatos = 1;
                        }
                    }
                    if (swDatos == 0){
                        valorData = JSON.stringify(cel);
                        if (valorData) {
                            var patt = valorData.substring(0, 1);
                            var patt1 = valorData.substring(valorData.length-1,valorData.length);
                            if (patt=="[" && patt1=="]"){
                                data = data + '"' + fil + '":' + valorData + ', ';
                            } else{
                                valorData = valorData.substring(1, valorData.length -1);
                                data = data + '"' + fil + '":"' + valorData + '", ';
                            }
                        }
                    }
                });
                data = data + '"AE_NRO_CASO":"' + sNumCasoNombre + '", ';
                //data = data + '"fecha":"' + $scope.datos['fecha'] + '" ';
                data = data.substring(0, data.length -2);
                data = data + '}"';
                data = data.substring(1, data.length -1);
                data = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
                caso['cas_datos'] = data;
                caso['cas_modificado'] = $scope.fechactual;
                caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
                $scope.datosSerializados = data;
                $.unblockUI();
            }
        }catch(e){
            $.unblockUI();
        }

        try{
            var modcas = new modificarCasos();
            modcas.casid = $scope.casoActual.casoid;
            modcas.modificacion =  $scope.fechactual;
            modcas.casdatos = data;
            modcas.usr_id = sessionService.get('IDUSUARIO');
            modcas.modificar_Casos(function(res){
                x = JSON.parse(res);
                var data = x.success.data;
                $scope.getCasos();
                $scope.evalReglasFormulario();
                $scope.datos=JSON.parse($scope.datosSerializados);
            }).error(function(data){
                sweet.show('', 'Registro no insertado, verifique los datos del Formulario', 'error');
            });
        }catch (error){
            $scope.errors["error_rol"] = error;
        }
        
        /*var resProceso = {"table_name":"_fr_casos",
                        "body":caso,
                        "id":$scope.casoActual.casoid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
        obj.success(function(data){

            //$scope.evalScriptSalida();
            $scope.getCasos();
            $scope.evalReglasFormulario();
            $scope.datos=JSON.parse($scope.datosSerializados);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado, verifique los datos del Formulario', 'error');
        });*/
    }

    //ALMACENAR DATA SIN EVALUAR REGLAS DE NEGOCIO
    $scope.guardarSoloData  =   function(datos){
        var datosSerializados = JSON.stringify(datos);
        $scope.datosSerializados = JSON.stringify(datos);
        var caso = {};
        caso['cas_datos'] = datosSerializados;
        caso['cas_modificado'] = $scope.fechactual;
        caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
        /*
        var resProceso = {"table_name":"_fr_casos",
                        "body":caso,
                        "id":$scope.casoActual.casoid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
        obj.success(function(data){
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        });
        */

        console.log("FECHA ACTUAL: ", $scope.fechactual);
        console.log("FECHA ACTUAL: ", sessionService.get('IDUSUARIO'));

        var guardadata          =   new guardarFormData();
        guardadata.datos        =   datosSerializados;
        guardadata.fmodificado  =   $scope.fechactual;
        guardadata.usrid        =   sessionService.get('IDUSUARIO');
        guardadata.casid        =   $scope.casoActual.casoid;
        guardadata.casdatos(function(respuesta){
            console.log("GUARDAR SOLO DATA - FR_CASOS : OK");
        });
    }

    //ALMACENAR DATA EVALUANDO REGLAS DE NEGOCIO
    $scope.guardarData  =   function(datos){
      angular.forEach(datos, function(value, key) {
       cadena = "";
       try {
           cadena = JSON.parse(value);
           cadena = "OK";
       } catch(error){
           cadena = "OTRO";
       }

       if(value != undefined){
         value = value.toString();
         var respuesta = value.indexOf('tipo":"GRD"');
            if(respuesta != - 1){
            }else{
              if (cadena!="OTRO") {
                  if (typeof(datos[key]) == "string") {
                      posicion = value.indexOf('@');
                      if (posicion >= 0) {
                          datos[key] = value.toLowerCase();
                      } else {
                          datos[key] = value.toUpperCase();
                      }
                  }
              }
               console.log("palabra no encontrada"+ respuesta);
            }
       }
   }, log);

      /*  angular.forEach(datos, function(value, key) {
            cadena = "";
            try {
                cadena = JSON.parse(value);
                cadena = "OK";
            } catch(error){
                cadena = "OTRO";
            }

            if (cadena!="OTRO") {
                if (typeof(datos[key]) == "string") {
                    posicion = value.indexOf('@');
                    if (posicion >= 0) {
                        datos[key] = value.toLowerCase();
                    } else {
                        datos[key] = value.toUpperCase();
                    }
                }
            }

        }, log);*/

        var datosSerializados = JSON.stringify(datos);
        $scope.datosSerializados = JSON.stringify(datos);

        var caso = {};
        caso['cas_datos'] = datosSerializados;
        caso['cas_modificado'] = $scope.fechactual;
        caso['cas_usr_id'] = sessionService.get('IDUSUARIO');

/*

        var resProceso = {"table_name":"_fr_casos",
                        "body":caso,
                        "id":$scope.casoActual.casoid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
        obj.success(function(data){
            $scope.evalReglasFormulario();
            $scope.getCasos();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        });
*/

        //alert("guardar avanzar !!");
        var guardadata          =   new guardarFormData();
        guardadata.datos        =   datosSerializados;
        guardadata.fmodificado  =   $scope.fechactual;
        guardadata.usrid        =   sessionService.get('IDUSUARIO');
        guardadata.casid        =   $scope.casoActual.casoid;
        guardadata.casdatos(function(respuesta){
            console.log("GUARDAR SOLO DATA - FR_CASOS : OK");
            $scope.evalReglasFormulario();
            $scope.getCasos();
        });
    }

    /*BIFURCACION*/
    $scope.evalReglasAvanzar=function(){
        if($scope.datosSerializados){
            $scope.resp;
            $scope.data = JSON.parse($scope.datosSerializados);
        }
        else{
            $scope.resp;
            $scope.data = $scope.datos;
        }
        var sigActividad = "";
        var aRespuesta = '';
        //console.log($scope.obtReglas);
        //if ($scope.obtReglas.length > 0 ) {
            angular.forEach($scope.obtReglas,function(cel, fil){
                var sReglaAct    = cel['regregla'];
                var sReglaEvaluada = false;
                var flags = "gi";
                angular.forEach($scope.data,function(campoVarlor, campoNombre){
                    if(sReglaAct.indexOf(campoNombre) != -1 ){
                        //sReglaAct = sReglaAct.replace('#'+campoNombre+'#', campoVarlor,flags);
                        asignarValor = new RegExp('#'+campoNombre+'#', "g");
                        sReglaAct = sReglaAct.replace(asignarValor,campoVarlor);
                    }
                });
                //console.log("regla");
                //console.log(sReglaAct);
                sReglaEvaluada = eval(sReglaAct);
                if(sReglaEvaluada){
                    aRespuesta=cel['regsig'];
                 }
            });
            if(aRespuesta!=''){

                $scope.resp = aRespuesta;
                $scope.derivarOtro();
             }
            else{
                if ($scope.estadoCaso=="ACTIVIDAD") {
                    sweet.show('', 'Trámite Actualizado', 'success');
                    $location.path('formularios|reimpresion|index.html');
                } else {
                    $scope.cerrarCaso();
                }
            }
        }
//
//    }
    $scope.evalReglasFormularioEntradaResumen = function(item){
        var sFormMostrar = "";
        $scope.formSigId=null;
        $scope.datos.g_tipo = sessionService.get("TIPO_PROCESO");
        $scope.datos.AE_NRO_CASO = sessionService.get("TRAMITE_ACTUAL");
        if ($scope.casoActual.casonombre){
            console.log($scope.datos.AE_NRO_CASO);
        } else {
            $scope.casoActual.casonombre = $scope.datos.AE_NRO_CASO;
        }
        $scope.data = $scope.datos;
        $scope.publicid =[];
        $scope.publicid = $scope.datos.publicidad;
        $scope.obtReglasForm = JSON.parse(true);
        $scope.cargarFormularioCargarResumen(item)
    };
    $scope.evalReglasFormularioEntrada = function(){
        var sFormMostrar = "";
        $scope.formSigId=null;
        $scope.datos.g_tipo = sessionService.get("TIPO_PROCESO");
        $scope.datos.AE_NRO_CASO = sessionService.get("TRAMITE_ACTUAL");
        if ($scope.casoActual.casonombre){
            console.log($scope.datos.AE_NRO_CASO);
        } else {
            $scope.casoActual.casonombre = $scope.datos.AE_NRO_CASO;
        }
        $scope.data = $scope.datos;
        $scope.publicid =[];
        $scope.publicid = $scope.datos.publicidad;
        $scope.obtReglasForm = JSON.parse($scope.reglasFormulario);
        /*RECORREMOS LAS REGLAS DE NEGOCIO*/
        angular.forEach($scope.obtReglasForm,function(celda, fila){
            if(celda['regftipo']=='ENTRADA')
            {   var sReglaForm = celda['regfregla'];
                var sReglaEvaluada = false;
                var flags = "gi";
                /*RECORREMOS EL FORMULARIO*/
                angular.forEach($scope.data,function(campoValor, campoNombre){
                    if(sReglaForm.indexOf(campoNombre) != -1 ){
                        var regex = new RegExp('#'+campoNombre+'#', flags);
                        sReglaForm = sReglaForm.replace(regex, campoValor);
                    }
                });
                sReglaEvaluada = eval(sReglaForm);
                if(sReglaEvaluada){
                    console.log(sReglaEvaluada);
                    $scope.formSigId=celda['regfsiguiente'];
                }
            }
        });
        if($scope.formSigId) {
            $scope.cargarFormularioCargar($scope.formSigId)
            $scope.memoria[$scope.contador]=$scope.formSigId;
            $scope.contador++;
        } else {
            var caso = {};
            if($scope.casoActual.actsigid==0 ) {
                $scope.evalReglasAvanzar();
            } else {
                $scope.derivar();
            }
        }
    };

    $scope.evalReglasFormulario = function(){
        var sFormMostrar = "";
        $scope.formSigId=null;
        $scope.data = JSON.parse($scope.datosSerializados);
        $scope.obtReglasForm = JSON.parse($scope.reglasFormulario);
        console.log("reglas",$scope.obtReglasForm);
        /*RECORREMOS LAS REGLAS DE NEGOCIO*/
        angular.forEach($scope.obtReglasForm,function(celda, fila){
            if(celda['regftipo']=='SALIDA')
            {
                var sReglaForm = celda['regfregla'];
                console.log('regla--->   ',celda['regfregla']);
                var sReglaEvaluada = false;
                var flags = "gi";
                /*RECORREMOS EL FORMULARIO*/
                angular.forEach($scope.data,function(campoValor, campoNombre){
                    if(sReglaForm.indexOf(campoNombre) != -1 ){
                        //sReglaForm = sReglaForm.replace('#'+campoNombre+'#', campoValor,flags);
                        /*var regex = new RegExp('#'+campoNombre+'#', flags);
                        sReglaForm = sReglaForm.replace(regex, campoValor);*/
                        asignarValor = new RegExp('#'+campoNombre+'#', "gi");
                        sReglaForm = sReglaForm.replace(asignarValor,campoValor);
                        //sReglaForm = sReglaForm.replace('#'+campoNombre+'#', campoValor,flags);
                    }
                });
                console.log('reglaSustituida--->   ',sReglaForm);
                sReglaEvaluada = eval(sReglaForm);
                if(sReglaEvaluada){
                    $scope.formSigId=celda['regfsiguiente'];
                }
            }
        });
        if($scope.formSigId){
            console.log('existe siguiente');
            $scope.cargarFormularioCargar($scope.formSigId)
            $scope.memoria[$scope.contador]=$scope.formSigId;
            $scope.contador++;
        }
        else{
            console.log('no  existe siguiente');
            var caso = {};
            console.log($scope.casoActual.actsigid);
            if($scope.casoActual.actsigid==0 ){
                $scope.evalReglasAvanzar();
            } else {
                if ($scope.estadoCaso=="ACTIVIDAD") {
                    sweet.show('', 'Trámite Actualizado', 'success');
                    $location.path('formularios|reimpresion|index.html');
                } else {
                    $scope.derivar();
                }
            }
        }
    };

    $scope.derivarOtro=function(){
        var datosSerializados = JSON.stringify($scope.datos);
        sweet.show({
            title: 'Derivar',
            text: 'Esta seguro de Derivar el Trámite?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'SI',
            cancelButtonText: 'NO',
            closeOnConfirm: false
        }, function() {
            sweet.close();
            if(sessionService.get('US_IDMACRO') == 'null')
            {
                 $scope.macro_id=0;
            }
            else{
               $scope.macro_id=sessionService.get('US_IDMACRO');
            }

            /*var resOpcion = {
                "procedure_name":"derivar",
                "body":{
                    "params": [
                        {
                            "name": "actid",
                            "value": $scope.resp
                        },{
                            "name": "usrid",
                            "value": sessionService.get('IDUSUARIO')
                        },{
                            "name": "casoid",
                            "value": $scope.casoActual.casoid
                        },{
                            "name": "datoshistorico",
                            "value": datosSerializados
                        },{
                            "name": "macro_id",
                            "value": $scope.macro_id
                        }
                    ]
                }
            };
            var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
            obj.success(function(data){
                sweet.show('', 'Trámite Derivado', 'success');
                $scope.getCasos();
                $scope.volver();
            })
            .error(function(data){
                sweet.show('', 'Trámite no Derivado', 'error');
            });*/

            var objavanzar              =   new avanzarCaso();
            objavanzar.actid            =   $scope.resp;
            objavanzar.usrid            =   sessionService.get('IDUSUARIO');
            objavanzar.casoid           =   $scope.casoActual.casoid;
            objavanzar.datoshistorico   =   datosSerializados;
            objavanzar.macro_id         =   $scope.macro_id;
            objavanzar.avanzar(function(respuesta){
                sweet.show('', 'Trámite Derivado', 'success');
                $scope.getCasos();
                $scope.volver();
            });
        });
    }
    $scope.evalScriptSalida = function() {
        $scope[name] = 'Running';
        var deferred = $q.defer();
        frmRender = sessionService.get('FRMRENDER');
        var rData = new renderData();
        rData.id_form = frmRender;
        $scope.exito = "SI";
        try{
            rData.obtenerDataRender(function(response){
                console.log("EVALUAR SCRIPT DE SALIDA");
                x = JSON.parse(response);
                $rootScope.arrayScript = x.success.data[0].campo_descripcion;
                console.log($rootScope.arrayScript);
                angular.forEach($rootScope.arrayScript,function(val, index){
                    if (val.tipo == "SCRIPT" && val.tipo_script == "OUT") {
                        console.log(val.comportamientos);
                        eval(val.comportamientos);
                    }
                });
                $q.all($scope.exito).then(function(data){
                    deferred.resolve($scope.exito);
                });
            });
        }catch(e){
            $scope.exito = "NO";
            $q.all($scope.exito).then(function(data){
                deferred.resolve($scope.exito);
            });
        }
        return deferred.promise;
    }
    $scope.derivar=function(){
        var datosSerializados = JSON.stringify($scope.datos);
        sweet.show({
            title: 'Derivar',
            text: 'Esta seguro de Derivar el Trámite?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'SI',
            closeOnConfirm: false
        }, function() {
            sweet.close();
            if(sessionService.get('US_IDMACRO') == 'null')
            {
                 $scope.macro_id=0;
            }
            else{
               $scope.macro_id=sessionService.get('US_IDMACRO');
            }

            /*var resOpcion = {
                "procedure_name":"derivar",
                "body":{
                    "params": [
                        {
                            "name": "actid",
                            "value": $scope.casoActual.actsigid
                        },{
                            "name": "usrid",
                            "value": sessionService.get('IDUSUARIO')
                        },{
                            "name": "casoid",
                            "value": $scope.casoActual.casoid
                        },{
                            "name": "datoshistorico",
                            "value": datosSerializados
                        },{
                            "name": "macro_id",
                            "value": $scope.macro_id
                        }
                    ]
                }
            };
            var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
            obj.success(function(data){
                sweet.show('', 'Trámite Derivado', 'success');
                $scope.getCasos();
                $scope.volver();
            })
            .error(function(data){
                sweet.show('', 'Trámite no Derivado', 'error');
            });*/

            var arregloDatos = $scope.evalScriptSalida();
            arregloDatos.then(function(respuesta) {
                console.log(respuesta);
                var objavanzar              =   new avanzarCaso();
                objavanzar.actid            =   $scope.casoActual.actsigid;
                objavanzar.usrid            =   sessionService.get('IDUSUARIO');
                objavanzar.casoid           =   $scope.casoActual.casoid;
                objavanzar.datoshistorico   =   datosSerializados;
                objavanzar.macro_id         =   $scope.macro_id;
                objavanzar.avanzar(function(respuesta){
                    sweet.show('', 'Trámite Derivado', 'success');
                    $scope.getCasos();
                    $scope.volver();
                });
            }, function(reason) {
                alert('Failed: ' + reason);
            });
        });
    }
    $scope.cerrarCaso=function(){
        sweet.show({
            title: 'Cerrar',
            text: 'Esta seguro de Cerrar el Trámite?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'SI',
            closeOnConfirm: false
        }, function() {
            sweet.close();
            var caso = {};
            caso['cas_estado'] = 'B';
            caso['cas_modificado'] = $scope.fechactual;
            caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
            var resProceso = {"table_name":"_fr_casos",
                            "body":caso,
                            "id":$scope.casoActual.casoid};
            var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
            obj.success(function(data){
                sweet.show('', 'Cerrado', 'success');
                $scope.getCasos();
                $scope.volver();
            })
            .error(function(data){
                sweet.show('', '', 'error');
            });
        });
    }

    $scope.cargarFormularioResumen = function(item,posicion){
        $scope.tituloForm = item.formurl;
        $scope.formularioSeleccionado=item.formid;
        $scope.evalReglasFormularioEntradaResumen(item);
    };
    $scope.cargarFormulario=function(item,posicion){
        $scope.tituloForm = item.formurl;
        $scope.formularioSeleccionado=item.formid;
        $scope.reglasFormulario=item.formreglas;
        $scope.evalReglasFormularioEntrada();
        $scope.posicion = posicion+1;
        $scope.siguiente=$scope.obtFormularios[posicion+1];
    };
    $scope.obtenerData = function(formulario) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
            $.blockUI();
            var resDatos = {
                    "table_name":"_fr_formulario_dinamico",
                     "filter": "campo_id="+ formulario +" and campo_estado='A'"
                };
            var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
            obj.success(function (response) {
                resultado = response.record[0].campo_descripcion;
                $scope.datadocumentos = JSON.parse(response.record[0].campo_descripcion);
                var i=0;
                $rootScope.array=[];
                angular.forEach($scope.datadocumentos, function(value, key) {
                    if (value.tipo_llenado){
                        if (value.tipo_llenado == "SQL") {
                            var resQuery = {
                                "procedure_name":"sp_reporte_dinamico123",
                                "body":{
                                    "params": [
                                        {
                                            "name": "sql",
                                            "value": value.data
                                        }
                                    ]
                                }
                            };
                            DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery).success(function (response){
                                $rootScope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                            });
                        }  else if (value.tipo_llenado == "SQL2") {
                          nombreCampo = new RegExp("@TRAMITE@", "g");
                          console.log("Sin reemplazo", value.data);
                          value.data= value.data.replace(nombreCampo,"'"+$scope.datos.AE_NRO_CASO+"'");
                          console.log("Con reemplazo", value.data);
                          var resQuery = {
                              "procedure_name":"sp_reporte_dinamico123",
                              "body":{
                                  "params": [
                                      {
                                          "name": "sql",
                                          "value": value.data
                                      }
                                  ]
                              }
                          };
                          DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery).success(function (response){
                              $rootScope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                              console.log("Resultado",$rootScope.array[value.campo]);
                          });
                        } else {
                            $rootScope.array[value.campo] = value.data;
                        }
                    } else {
                        $rootScope.array[value.campo] = "";
                    }
                }, log);
                $.unblockUI();
                deferred.resolve($rootScope.array);
            });
        $.unblockUI();
        return deferred.promise;
    }
    $scope.obtenerDataNuevo = function(formulario, idForm) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
            $.blockUI();
            var resDatos = {
                "procedure_name":"sp_lst_get_json_sql",
                "body":{
                    "params": [
                        {
                            "name": "id_form",
                            "value": formulario
                        }

                    ]
                }
            };
            var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resDatos);
            obj.success(function (response) {
                resultado = response[0].campo_descripcion;
                $scope.datadocumentos = JSON.parse(response[0].campo_descripcion);
                var i=0;
                $rootScope.array=[];
                try {
                    /*angular.forEach($scope.datadocumentos, function(value, key) {
                        console.log(value);
                        if (value.tipo_llenado){
                            if (value.tipo_llenado == "SQL") {
                                try {
                                    if (value.data) {
                                        var rData = new renderData();
                                        rData.sql = value.data;
                                        rData.renderSqlDinamic(function(response){
                                            x = JSON.parse(response);
                                            $rootScope.array[value.campo] = x.success.data[0].sp_reporte_dinamico123;
                                        });
                                    } else {
                                        $rootScope.array[value.campo] = "";
                                        console.log("Id : ", value.campo, "es un componente sin consulta SQL");
                                    }
                                } catch(error) {
                                    console.log("error : ", error);
                                    $scope.errors[value.campo] = error;
                                    $rootScope.array[value.campo] = "";
                                }

                            } else {
                                if (value.tipo_llenado == "SQL2") {
                                nombreCampo = new RegExp("@TRAMITE@", "g");
                                console.log("Sin reemplazo", value.data);
                                value.data= value.data.replace(nombreCampo,"'"+$scope.datos.AE_NRO_CASO+"'");
                                console.log("Con reemplazo", value.data);
                                try {
                                    var rData = new renderData();
                                    rData.sql = value.data;
                                    rData.renderSqlDinamic(function(response){
                                        x = JSON.parse(response);
                                        $rootScope.array[value.campo] = x.success.data[0].sp_reporte_dinamico123;
                                        console.log("Resultado",$rootScope.array[value.campo]);
                                    });
                                } catch(error) {
                                    $scope.errors[value.campo] = error;
                                    $rootScope.array[value.campo] = "";
                                }


                            } else {
                                $rootScope.array[value.campo] = value.data;
                            }
                            }
                        } else {
                            $rootScope.array[value.campo] = "";
                        }
                    }, log)*/
                    angular.forEach($scope.datadocumentos, function(value, key) {
                        console.log(value);
                        if (value.tipo_llenado){
                            if (value.tipo_llenado == "SQL") {
                                try {
                                    if (value.data) {
                                        var rData = new renderData();
                                        rData.sql = value.data;
                                        rData.renderSqlDinamic(function(response){
                                            x = JSON.parse(response);
                                            console.log("-------------------------------------------------------------");
                                            console.log(value.data);
                                            console.log(x);
                                            console.log("-------------------------------------------------------------");

                                            $rootScope.array[value.campo] = x.success.data[0].sp_reporte_dinamico123;
                                        });
                                    } else {
                                        $rootScope.array[value.campo] = "";
                                        console.log("Id : ", value.campo, "es un componente sin consulta SQL");
                                    }
                                } catch(error) {
                                    console.log("error : ", error);
                                    $scope.errors[value.campo] = error;
                                    $rootScope.array[value.campo] = "";
                                }
                                /*
                                var resQuery = {
                                    "procedure_name":"sp_reporte_dinamico123",
                                    "body":{
                                        "params": [
                                            {
                                                "name": "sql",
                                                "value": value.data
                                            }
                                        ]
                                    }
                                };
                                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery);
                                obj.success(function (response){
                                    $rootScope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                                    console.log(JSON.parse(response[0].sp_reporte_dinamico123));
                                })
                                obj.error(function(error) {
                                    $scope.errors[value.campo] = error;
                                    $rootScope.array[value.campo] = "";
                                });*/
                            } else {
                                if (value.tipo_llenado == "SQL2") {
                                nombreCampo = new RegExp("@TRAMITE@", "g");
                                console.log("Sin reemplazo", value.data);
                                value.data= value.data.replace(nombreCampo,"'"+$scope.datos.AE_NRO_CASO+"'");
                                console.log("Con reemplazo", value.data);
                                try {
                                    var rData = new renderData();
                                    rData.sql = value.data;
                                    rData.renderSqlDinamic(function(response){
                                        x = JSON.parse(response);
                                        $rootScope.array[value.campo] = x.success.data[0].sp_reporte_dinamico123;
                                        console.log("Resultado",$rootScope.array[value.campo]);
                                    });
                                } catch(error) {
                                    $scope.errors[value.campo] = error;
                                    $rootScope.array[value.campo] = "";
                                }

                                /*var resQuery = {
                                      "procedure_name":"sp_reporte_dinamico123",
                                      "body":{
                                          "params": [
                                              {
                                                  "name": "sql",
                                                  "value": value.data
                                              }
                                          ]
                                      }
                                };
                                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery);
                                obj.success(function (response){
                                    $rootScope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                                    console.log("Resultado",$rootScope.array[value.campo]);
                                })
                                obj.error(function(error) {
                                    $scope.errors[value.campo] = error;
                                    $rootScope.array[value.campo] = "";
                                });*/
                            } else {
                                $rootScope.array[value.campo] = value.data;
                            }
                            }
                        } else {
                            $rootScope.array[value.campo] = "";
                        }
                    }, log)
                    $q.all($scope.datadocumentos).then(function(data){
                        $scope.datosBD = $rootScope.array;
                        $scope.template = '../../../app/view/formularios/formularios/'+idForm;
                        $scope.tituloForm = '../../../app/view/formularios/formularios/'+idForm;
                        $.unblockUI();
                        deferred.resolve($rootScope.array);
                    });
                } catch(e) {
                    console.log("excepcion",nombreCampo);
                }
            });
        //$.unblockUI();
        return deferred.promise;
    }

    $scope.cargarFormularioCargarResumen=function(resumen){
        formid = resumen[0].formid;
        $scope.template ='';
        console.log('form siguiente->>',    formid);
        console.log('form RESUMEN->>',   resumen);

        angular.forEach(resumen,function(celda, fila){

            if(celda['formid']==formid){
                console.log('celda---->>>>',celda['formurl']);
                cadVariables = celda['formurl']; 
                arrVariables = cadVariables.split("?");
                if (arrVariables[1]) {
                    $scope.miPropioFormulario = arrVariables[1];

                    var arregloDatos = $scope.obtenerDataNuevo($scope.miPropioFormulario, arrVariables[0]);
                    arregloDatos.then(function(respuesta) {
                        $scope.formularioSeleccionado=celda['formid'];
                        $scope.reglasFormulario=celda['formreglas'];
                    }, function(reason) {
                        alert('Failed: ' + reason);
                    });
                } else {
                    $scope.template = '../../../app/view/formularios/formularios/'+celda['formurl'];
                    $scope.tituloForm = '../../../app/view/formularios/formularios/'+celda['formurl'];
                    $scope.formularioSeleccionado=celda['formid'];
                    $scope.reglasFormulario=celda['formreglas'];
                }
            }
        });
    };
    $scope.cargarFormularioCargar=function(formid){
        $scope.template ='';
        console.log('form siguiente->>',    formid);
        console.log('form RESUMEN->>',    $scope.obtFormularios);
        angular.forEach($scope.obtFormularios,function(celda, fila){
            if(celda['formid']==formid){
                console.log('celda----',celda['formurl']);
                cadVariables = celda['formurl']; 
                arrVariables = cadVariables.split("?");
                if (arrVariables[1]) {
                    $scope.miPropioFormulario = arrVariables[1];
                    sessionService.set('FRMRENDER', arrVariables[1]);
                    var arregloDatos = $scope.obtenerDataNuevo($scope.miPropioFormulario, arrVariables[0]);
                    arregloDatos.then(function(respuesta) {
                        $scope.formularioSeleccionado=celda['formid'];
                        $scope.reglasFormulario=celda['formreglas'];
                    }, function(reason) {
                        alert('Failed: ' + reason);
                    });
                } else {
                    $scope.template = '../../../app/view/formularios/formularios/'+celda['formurl'];
                    $scope.tituloForm = '../../../app/view/formularios/formularios/'+celda['formurl'];
                    $scope.formularioSeleccionado=celda['formid'];
                    $scope.reglasFormulario=celda['formreglas'];
                    console.log("--------------------------------------");
                    console.log($scope.reglasFormulario);
                    console.log("--------------------------------------");
                }
            }
        });
    };
    $scope.volverFormulario = function(){
        $scope.cargarFormularioCargar($scope.memoria[$scope.contador-2]);
        $scope.contador=$scope.contador-1;
    }
    $scope.limpiar = function(){
        $scope.datosCasoData = '';
        $scope.datosCaso = '';
        $scope.boton="new";
        $scope.desabilitado = false;
        $scope.titulo="CREAR TRAMITE";
        $scope.getProcesos();
        $scope.procesoSeleccionado='';
        $scope.procesoid='';
        $scope.datos = "";
        $scope.botontit="Siguiente";
        $scope.procventana=true;
        $scope.sig=false;
        $scope.inicioNexoValidarBtn();
        $scope.desabilitadoRc=false;
        $scope.botoncerrar="Cerrar";
        $scope.tipo_hr='';
        $scope.datos.RC_NIT='';
        $scope.tipoPersonaRc="";
        $scope.datos.INT_RL_NUM_DOCUMENTO='';
    };

    $scope.seleccionarProceso = function(proceso){
        $scope.procesoSeleccionado=proceso.procid;
        $scope.procesoid=proceso;
    }






    $scope.adicionarCaso = function(){
        var sWpaceId    = 1;
        if(sessionService.get('WS_ID')){
            sWpaceId    = sessionService.get('WS_ID');
        }
        sessionService.set("TIPO_PROCESO", $scope.procesoid.procodigo);
        $scope.fechactual=strfecha.getFullYear() + "-" + mes + "-" + dia + " " + strfecha.getHours() + ":" + strfecha.getMinutes() + ":" + strfecha.getSeconds();

        var json='{"g_fecha":"'+$scope.fechactual+'","g_tipo":"'+ $scope.procesoid.procodigo+'","g_usuario": "'+sessionService.get('USUARIO')+'","g_datos_solicitante": [], "G_CI":""}';
        if($scope.procesoid.actid!= null) {
            var ct          =   new crearTramite();
            ct.proid = $scope.procesoid.procid;
            ct.actid = $scope.procesoid.actid;
            ct.usr_id = sessionService.get('IDUSUARIO');
            ct.datos = json;
            ct.procodigo = $scope.procesoid.procodigo;
            ct.macro_id = null;
            ct.nodo_id = sessionService.get('IDNODO');
            ct.ws_id = sWpaceId;
            ct.crear_tramite_macro(function(respuesta){
                resuApi = JSON.parse(respuesta);
                data = resuApi.success.data[0];
                data.casonombre =   data.casonro;
                sessionService.set("TRAMITE_ACTUAL", data.casonro);
                sweet.show('', 'Registro insertado', 'success');
                $scope.getCasos();
                $scope.atenderCaso(data);
                $scope.recibirTramite(data,'recibir');
            });
            /*
            var caso = {};
            var resFormulario = {
                procedure_name:"crear_tramite_macro",
                body:{
                    "params": [
                        {
                            "name": "proid",
                            "value": $scope.procesoid.procid
                        },{
                            "name": "actid",
                            "value": $scope.procesoid.actid
                        },{
                            "name": "usr_id",
                            "value": sessionService.get('IDUSUARIO')
                        },{
                            "name": "datos",
                            "value": json
                        },{
                            "name": "procodigo",
                            "value": $scope.procesoid.procodigo
                        },{
                            "name": "macro_id",
                            "value": null
                        },{
                            "name": "nodo_id",
                            "value": sessionService.get('IDNODO')
                        },{
                            "name": "ws_id",
                            "value": sWpaceId
                        }
                    ]
                }
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resFormulario);
            obj.success(function (data){
                sessionService.set("TRAMITE_ACTUAL", data.casonro);
                sweet.show('', 'Registro insertado', 'success');
                $scope.getCasos();
                $scope.atenderCaso(data[0]);
                $scope.recibirTramite(data[0],'recibir');
                data[0].casonombre =   data[0].casonro;
            })
            .error(function(data){
                sweet.show('', "Registro no insertado", 'error');
                $scope.btnGuardar = false;
            })
        */

        } else {
            sweet.show('', 'El proceso no contiene actividad de Inicio', 'warning');
        }
    };







    $scope.getCombos = function(tablaNombre, filtro, campos) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
        var resParametricos = {
            "table_name":tablaNombre,
            "filter":filtro,
            "fields":campos
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resParametricos);
        obj.success(function (data) {
            $scope.res = JSON.stringify(data.record).toString();
            deferred.resolve(data.record);
        });
        return deferred.promise;
    }
    $scope.getSPCombos = function(nombreSp, parametros) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
        if (parametros==""){
            var inDatos = {
                "procedure_name": nombreSp
            };
        } else {
            var inDatos = {
                "procedure_name": nombreSp,
                "body": parametros
            };
        }
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(inDatos);
        obj.success(function (response) {
            $scope.res = JSON.stringify(response).toString();
            deferred.resolve(response);
        });
        return deferred.promise;
    }

    $scope.classPropiedadesFormulario = "col-md-3";
    $scope.classCuerpo = "col-md-9";
    /*MOSTRAR OCULTAR DIVS DEPURACION*/
    $scope.mostrarEsconderDepuracion = function(){
        if($scope.mostrardiv){
            if($scope.mostrardiv.visibility == 'hidden'){
                $scope.mostrardiv = {'visibility': 'visible'};
                $scope.classPropiedadesFormulario = "col-md-3";
                $scope.classCuerpo = "col-md-9";
            }else{
                $scope.mostrardiv = {'visibility': 'hidden'};
                $scope.classPropiedadesFormulario = "col-md-1";
                $scope.classCuerpo = "col-md-11";
            }
        }else{
            $scope.mostrardiv = {'visibility': 'hidden'};
            $scope.classPropiedadesFormulario = "col-md-1";
            $scope.classCuerpo = "col-md-11";
        }
    };

    /*DEPURACION*/
    $scope.blocDesblocBtnDepuracion = function(){
        if($scope.btnBlock_1 == true){
            $scope.btnBlock_1   = false;
            $scope.btnBlock_2   = true;
        }else{
            $scope.btnBlock_1   = true;
            $scope.btnBlock_2   = false;
        }
    };

    /***HISTORICO***/
    $scope.getHistorico = function(){
         var resOpcion = {
            "procedure_name":"sp_mostrar_historico",
            "body":{"params": [{"name":"cas_id","value":$scope.sIdCaso}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
        obj.success(function (response) {
            $scope.obtHistorico=response;
            console.log("Datos:  ", $scope.obtHistorico);
            $scope.seleccionaProcesoMapa();
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };

    /*************************************MAPA DE PROCESOS****************************************/
    $scope.initDiagram = function() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram =
      $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
        {
          initialContentAlignment: go.Spot.Center,
          allowDrop: true,  // must be true to accept drops from the Palette
          "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
          "LinkRelinked": showLinkLabel,
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          "undoManager.isEnabled": true  // enable undo & redo
        });
    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function(e) {
      var button = document.getElementById("SaveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });
    // helper definitions for node templates
    function nodeStyle() {
      return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // the Node.location is at the center of each node
          locationSpot: go.Spot.Center,
          //isShadowed: true,
          //shadowColor: "#888",
          // handle mouse enter/leave events to show/hide the ports
          mouseEnter: function (e, obj) { showPorts(obj.part, true); },
          mouseLeave: function (e, obj) { showPorts(obj.part, false); }
        }
      ];
    }
    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
      // the port is basically just a small circle that has a white stroke when it is made visible
      return $(go.Shape, "Circle",
               {
                  fill: "transparent",
                  stroke: null,  // this is changed to "white" in the showPorts function
                  desiredSize: new go.Size(8, 8),
                  alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                  portId: name,  // declare this object to be a "port"
                  fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                  fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                  cursor: "pointer"  // show a different cursor to indicate potential link point
               });
    }
    // define the Node templates for regular nodes
    var lightText = 'whitesmoke';
    myDiagram.nodeTemplateMap.add("",  // the default category
      $(go.Node, "Spot", nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",
            { fill: "lightslategrey", stroke: null },
            new go.Binding("figure", "figure"),
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              stroke: lightText,
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: false
            },
            new go.Binding("text").makeTwoWay())
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, false, false),
        makePort("L", go.Spot.Left, false, false),
        makePort("R", go.Spot.Right, false, false),
        makePort("B", go.Spot.Bottom, false, false)
      ));
    myDiagram.nodeTemplateMap.add("Start",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
          $(go.TextBlock, "Start",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("L", go.Spot.Left, false, false),
        makePort("R", go.Spot.Right, false, false),
        makePort("B", go.Spot.Bottom, false, false)
      ));
    myDiagram.nodeTemplateMap.add("End",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
          $(go.TextBlock, "End",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the bottom, all input only:
        makePort("T", go.Spot.Top, false, false),
        makePort("L", go.Spot.Left, false, false),
        makePort("R", go.Spot.Right, false, false)
      ));
    myDiagram.nodeTemplateMap.add("Comment",
      $(go.Node, "Auto", nodeStyle(),
        $(go.Shape, "File",
          { fill: "#EFFAB4", stroke: null }),
        $(go.TextBlock,
          {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: false,
            font: "bold 12pt Helvetica, Arial, sans-serif",
            stroke: '#454545'
          },
          new go.Binding("text").makeTwoWay())
        // no ports, because no links are allowed to connect with a comment
      ));
    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5, toShortLength: 4,
          relinkableFrom: false,
          relinkableTo: false,
          reshapable: false,
          resegmentable: false,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
          mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", stroke: null, fill: "gray"}),
        $(go.Panel, "Auto",  // the link label, normally not visible
          { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
          new go.Binding("visible", "visible").makeTwoWay(),
          $(go.Shape, "RoundedRectangle",  // the label shape
            { fill: "#F8F8F8", stroke: null }),
          $(go.TextBlock, "Yes",  // the label
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
      );

    myDiagram.model = go.Model.fromJson($scope.ImagenProceso);
    // support editing the properties of the selected person in HTML
    if (window.Inspector) myInspector = new Inspector('myInspector', myDiagram,
          {
        properties: {
          'key': { readOnly: true },
          'comments': {}
        }
      });
    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
      if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    }
    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.model = go.Model.fromJson($scope.ImagenProceso);  // load an initial diagram from some JSON text
    // initialize the Palette that is on the left side of the page
    myPalette =
      $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        {
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
          model: new go.GraphLinksModel([  // specify the contents of the Palette
            { category: "Start", text: "" },
            { text: "" },
            { text: "???", figure: "diamond" },
            { category: "End", text: "" },
            { category: "Comment", text: "[ ]" }
          ])
        });
    }
    // Make all ports on a node visible when the mouse is over the node
    function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function(port) {
            port.stroke = (show ? "white" : null);
          });
    }
    // Show the diagram's model in JSON format that the user may edit
    $scope.save = function() {
        $scope.ImagenProceso = myDiagram.model.toJson();
        myDiagram.isModified = false;
    }
    // add an SVG rendering of the diagram at the end of this page
    $scope.makeSVG = function() {
        myDiagram.model = go.Model.fromJson($scope.ImagenProceso);
        var svg = myDiagram.makeSvg({
            scale: 0.9
          });
        obj = document.getElementById("SVGArea");
        obj.appendChild(svg);
        if (obj.children.length > 0) {
        obj.replaceChild(svg, obj.children[0]);
        }
    }

    $scope.seleccionaProcesoMapa = function(){
        //$.blockUI();
        if($scope.cargarLibreria == 0)
        {
          $scope.initDiagram();
          $scope.cargarLibreria = 1;
        }
        $scope.bifurcaciones = {};
        $scope.nombreActividad = {};
        $scope.idActividad = {};
        $scope.ordenActividad = {};
        $scope.actividadEstado = {};
        $scope.actividadDias = {};
        $scope.actividadTranscurrido = {};
        $scope.actividadDiferencia = {};
        $scope.panelReglaNegocioActividadMapa = false;
        $scope.ImagenProceso = '{ "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [ ';
        $scope.ImagenProceso = $scope.ImagenProceso + '{"key":-1 , "category":"Start", "loc":"-360 80", "text":""},';
        var x = -360;
        var a = x+15;
        var c = a+25;
        var y = 80;
        var keya= -1;
        var keyb = -1;
        var bifurcacion = 0;
        var resRoles = {
            "procedure_name":"actividadlst",
            "body":{"params": [{"name":"procid","value":$scope.sIdProcesoActual}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            //$.unblockUI();
            $scope.procTitulo = $scope.sProcNombre;
            $scope.casoTitulo = "Tramite Nro. " + $scope.sCasoNro;
            $scope.procElementos = response.length;
            for(var i = 0; i < $scope.procElementos; i++)
            {
                var b = 0;
                $scope.bifurcaciones[i] = response[i].tipoactid;
                $scope.nombreActividad[i] = response[i].actnombreorden;
                $scope.idActividad[i] = response[i].actid;
                $scope.ordenActividad[i] = response[i].actorden;
                $scope.actividadDias[i] = response[i].actduracion;
                keyb = response[i].actid;
                if(i == 0)
                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                for(var j = 0; j < $scope.obtHistorico.length; j++)
                {
                    if(response[i].actid == $scope.obtHistorico[j].actid)
                    {
                        if($scope.obtHistorico[j+1])
                        {
                            var fecha1=$scope.obtHistorico[j].fechaini.split("-");
                            var dia1=fecha1[2];
                            var mes1=fecha1[1];
                            var ges1=fecha1[0];
                            var fecha2=$scope.obtHistorico[j+1].fechaini.split("-");
                            var dia2=fecha2[2];
                            var mes2=fecha2[1];
                            var ges2=fecha2[0];
                            var nuevafecha1=new Date(ges1+","+mes1+","+dia1);
                            var nuevafecha2=new Date(ges2+","+mes2+","+dia2);
                            var dif=nuevafecha2.getTime() - nuevafecha1.getTime();
                            var dias=Math.floor(dif/(1000*24*60*60));
                            $scope.actividadTranscurrido[i]=dias;
                            $scope.actividadDiferencia[i]=dias-response[i].actduracion;
                            console.log('aquiii---> ',j,"---",$scope.obtHistorico[j].fechaini," - - ",$scope.obtHistorico[j+1].fechaini);
                        }
                        if (j == $scope.obtHistorico.length-1) {
                            $scope.actividadEstado[i]= 2;
                            var fecha1=$scope.obtHistorico[j].fechaini.split("-");
                            var dia1=fecha1[2];
                            var mes1=fecha1[1];
                            var ges1=fecha1[0];
                            var fecha2=new Date();
                            var dia2=fecha2.getDate();
                            var mes2=fecha2.getMonth()+1;
                            var ges2=fecha2.getFullYear();
                            var nuevafecha1=new Date(ges1+","+mes1+","+dia1);
                            var nuevafecha2=new Date(ges2+","+mes2+","+dia2);
                            var dif=nuevafecha2.getTime() - nuevafecha1.getTime();
                            var dias=Math.floor(dif/(1000*24*60*60));
                            $scope.actividadTranscurrido[i]=dias;
                            $scope.actividadDiferencia[i]=dias-response[i].actduracion;
                            console.log('aquiii final---> ',j,"---",$scope.obtHistorico[j].fechaini);
                            b=1;
                            if(response[i].tipoactid == 2)
                            {
                                x = c + 90;
                                y = y + 50;
                                if(bifurcacion != 0)
                                  bifurcacion = 0;
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '" , "figure":"diamond", "color":"yellowgreen", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                                bifurcacion = 1;
                                var resRNactivdad = {
                                    "procedure_name":"sp_lst_rnactividad",
                                    "body":{"params": [{"name":"actid","value":response[i].actid}]}
                                };
                                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
                                obj.success(function (response2) {
                                    for(var j = 0; j < response2.length; j++)
                                    {
                                      if(response2[j].rna_act_id < response2[j].rna_siguiente)
                                      {
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"B", "toPort":"B"},';
                                      }else if(response2[j].rna_act_id > response2[j].rna_siguiente){
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"T", "toPort":"T"},';
                                      }else{
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"R", "toPort":"T"},';
                                      }
                                    }
                                });
                                obj.error(function(error) {
                                    $scope.errors["error_rol"] = error;
                                });
                            }else{
                                x = c + 15;
                                y = y + 50;
                                if(bifurcacion == 0)
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                                else{
                                  bifurcacion = 0;
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                                }
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '","color":"yellowgreen", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                            }
                            break;
                        }else{
                            $scope.actividadEstado[i]= 1;
                            b=1;
                            if(response[i].tipoactid == 2)
                            {
                                x = c + 90;
                                y = y + 50;
                                if(bifurcacion != 0)
                                  bifurcacion = 0;
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '" , "figure":"diamond", "color":"lightskyblue", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                                bifurcacion = 1;
                                var resRNactivdad = {
                                    "procedure_name":"sp_lst_rnactividad",
                                    "body":{"params": [{"name":"actid","value":response[i].actid}]}
                                };
                                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
                                obj.success(function (response2) {
                                    for(var j = 0; j < response2.length; j++)
                                    {
                                      if(response2[j].rna_act_id < response2[j].rna_siguiente)
                                      {
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"B", "toPort":"B"},';
                                      }else if(response2[j].rna_act_id > response2[j].rna_siguiente){
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"T", "toPort":"T"},';
                                      }else{
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"R", "toPort":"T"},';
                                      }
                                    }
                                });
                                obj.error(function(error) {
                                    $scope.errors["error_rol"] = error;
                                });
                            }else{
                                x = c + 15;
                                y = y + 50;
                                if(bifurcacion == 0)
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                                else{
                                  bifurcacion = 0;
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                                }
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '", "color":"lightskyblue", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                            }
                            break;
                        }
                    }
                }
                if(b==0){
                    $scope.actividadEstado[i]= 0;
                    if(response[i].tipoactid == 2)
                    {
                        x = c + 90;
                        y = y + 50;
                        if(bifurcacion != 0)
                          bifurcacion = 0;
                        $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '" , "figure":"diamond"},';
                        bifurcacion = 1;
                        var resRNactivdad = {
                                    "procedure_name":"sp_lst_rnactividad",
                                    "body":{"params": [{"name":"actid","value":response[i].actid}]}
                                };
                                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
                                obj.success(function (response2) {
                                    for(var j = 0; j < response2.length; j++)
                                    {
                                      if(response2[j].rna_act_id < response2[j].rna_siguiente)
                                      {
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"B", "toPort":"B"},';
                                      }else if(response2[j].rna_act_id > response2[j].rna_siguiente){
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"T", "toPort":"T"},';
                                      }else{
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"R", "toPort":"T"},';
                                      }
                                    }
                                });
                                obj.error(function(error) {
                                    $scope.errors["error_rol"] = error;
                                });
                    }else{
                      x = c + 15;
                      y = y + 50;
                      if(bifurcacion == 0)
                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                      else{
                        bifurcacion = 0;
                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                      }
                      $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '"},';
                    }
                }
                a = x+15;
                c = a+25;
                keya =keyb;
            }
            $.blockUI();
            setTimeout(function(){            
                x = c + 40;
                $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keyb + ', "to":0, "fromPort":"R", "toPort":"L"}';
                $scope.ImagenProceso = $scope.ImagenProceso + '{"category":"End", "text":"", "key": 0, "loc":"' + x + ' ' + y + '"} ], "linkDataArray": [ ' + $scope.ImagenLinks + ']}';
                try{
                    $scope.makeSVG();
                }catch(err){
                    $.unblockUI();
                }
                $.unblockUI();
            },3000);
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };

    /*reglas de negocio actividades*/
    $scope.getReglaNegocioActividadMapa = function(actividad, sel){
        var resRNactivdad = {
            "procedure_name":"sp_lst_rnactividad",
            "body":{"params": [{"name":"actid","value":actividad}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
        obj.success(function (response) {
            $scope.panelReglaNegocioActividadMapa = true;
            $scope.obtNRactividadMapa = response;
            $scope.tituloRNMapa='Reglas de Negocio de la Actividad: '+ $scope.nombreActividad[sel];
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    /**********************************FIN MAPA DE PROCESOS****************************************/
    $scope.llamarHistorico = function (caso) {
        if($scope.abrirHistorico == 0){
            console.log($scope.abrirHistorico);
            $scope.abrirHistorico = 1;
            $scope.getHistorico();
        }else{
            console.log($scope.abrirHistorico);
            $scope.abrirHistorico = 0
        }
    };

    $scope.showhide = function () {
        var ibox = $element.closest('div.ibox');
        var icon = $element.find('i:first');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        $timeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    };

    function iboxTools($timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'views/common/ibox_tools.html',
            controller: function ($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                };
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
            }
        };
    }

    //$scope.getCasos
    var clsIniciarGetDatosGrilla = $rootScope.$on('inicializarGetDatosGrilla', function(event, data){
        $scope.getCasos();
    });

    $scope.$on('$destroy', function() {
        clsIniciarGetDatosGrilla();
    });


    //inicio registro ciudadano
    /*REGISTROCIUDADANO*/
    $scope.consultaCiuTipoPer = "";
    $scope.consultaCiudadano = false;
    $scope.consultaCiuCampos = false;
    $scope.consultaCiuCampos2 = true;
    $scope.desabilitadoRc = false;
    $scope.rcDesabilitar = false;
    $scope.tipoPersonaRc = "";
    $scope.rcOid = "";
    $scope.aDatosRc = {};

    var sFono = "";
    var sCelular = "";
    var sCorreo = "";
    var sCi = "";
    var sw = 0;
    var sw2 = 1;
    var sNumeroAleatorio = "";

    $scope.bloquerCamposRc = function(){
        document.getElementById('region').disabled = true;
        document.getElementById('INT_SOLICITANTE').disabled = true;
        document.getElementById('direccion').disabled = true;
        document.getElementById('INT_CORREO').disabled = true;
    };

    $scope.desbloquearCamposRc = function(){
        try{
            document.getElementById('region').disabled = false;
            document.getElementById('INT_SOLICITANTE').disabled = false;
            document.getElementById('direccion').disabled = false;
            document.getElementById('INT_CORREO').disabled = false;
        }catch(e){}

    };



     $scope.envioMensaje = function(mensaje, email){
        var sMensajeValidacion = mensaje.replace(/ /g, "_");
        var parametros = {
            "cuerpo" : sMensajeValidacion,
            "asunto" : "Registro_GAMLP",
            "para" : email//'ed.marcelo25@gmail.com'
        }
        $.ajax({
            data: parametros,
            url: 'http://gmlpsr0082:9090/smsemail/email/mail.php',
            type: 'get',
            beforeSend: function () {
            },
            success: function (response) {
                    console.log(response);
            }
        });

    };

     $scope.recuperarDatosRc = function(tipoPersona, numeroDoc){
        console.log('datos del registro: ',tipoPersona, numeroDoc);
            $scope.tipoPersonaRc = tipoPersona;
            $scope.registroCiudadano = "";

            if(!$scope.datos){
                $scope.datos = {};
            }

            var sIdRegistro = sessionService.get('IDUSUARIO');
            if(tipoPersona == 'NATURAL'){
                filtro = "dtspsl_ci = '" + numeroDoc +"'";
            }else if(tipoPersona == 'JURIDICO'){
                filtro = "dtspsl_nit = '" + numeroDoc + "'";
            }else{
                filtro = "";
            }

            var misDatos = {
                    "table_name":"Ciudadano",
                    "body":{
                        "filter": filtro
                    }
            };
            DreamFactory.api[CONFIG.SERVICERC].getRecordsByPost(misDatos).success(function (response){
                var results = response.record;
                if(results.length > 0){//REGISTRO ENCONTRADO
                    $scope.aDatosRc = response.record;
            console.log('registro encontrado: ',response.record);
                    if(tipoPersona == 'NATURAL'){
                        try{
                        var rcRegin = ((typeof(results[0].dtspsl_expedido) == 'undefined') ? "" : results[0].dtspsl_expedido);
                        }catch(e){}
                        var rcNombre = ((typeof(results[0].dtspsl_nombres) == 'undefined') ? "" : results[0].dtspsl_nombres);
                        var rcPaterno = ((typeof(results[0].dtspsl_paterno) == 'undefined') ? "" : results[0].dtspsl_paterno);
                        var rcMaterno = ((typeof(results[0].dtspsl_materno) == 'undefined') ? "" : results[0].dtspsl_materno);
                        var rcDireccion = ((typeof(results[0].dtspsl_direccion) == 'undefined') ? "" : results[0].dtspsl_direccion);
                        var rcCorreo = ((typeof(results[0].dtspsl_correo) == 'undefined') ? "" : results[0].dtspsl_correo);
                        var rcMovil = ((typeof(results[0].dtspsl_movil) == 'undefined') ? "" : results[0].dtspsl_movil);
                        var rcTelefono = ((typeof(results[0].dtspsl_telefono) == 'undefined') ? "" : results[0].dtspsl_telefono);

                        $scope.datos.region = rcRegin.trim();
                        $scope.datos.INT_SOLICITANTE = rcNombre.trim() + " " + rcPaterno.trim() + " " + rcMaterno.trim();
            console.log('nombre: ',$scope.datos.INT_SOLICITANTE);
                        $scope.datos.RC_NOMBRE = rcNombre.trim();
                        $scope.datos.RC_PATERNO = rcPaterno.trim();
                        $scope.datos.RC_MATERNO = rcMaterno.trim();
                        $scope.datos.direccion = rcDireccion.trim();
                        $scope.datos.INT_CORREO = rcCorreo.trim();
                        $scope.datos.INT_TEL_CELULAR = rcMovil.trim();
                        $scope.datos.telefonoFijo = rcTelefono.trim();
                        $scope.consultaCiuTipoPer = 'NATURAL';
                        $scope.datosT = {};
                    }else{
                        var rcJRazonSocial = ((typeof(results[0].dtspsl_razon_social) == 'undefined') ? "" : results[0].dtspsl_razon_social);
                        var rcJCorreo = ((typeof(results[0].dtspsl_correo) == 'undefined') ? "" : results[0].dtspsl_correo);
                        var rcJDireccion = ((typeof(results[0].dtspsl_direccion) == 'undefined') ? "" : results[0].dtspsl_direccion);
                        var rcJFonoFijo = ((typeof(results[0].dtspsl_telefono) == 'undefined') ? "" : results[0].dtspsl_telefono);

                        $scope.datos.nombreRazonSocial = rcJRazonSocial.trim();
                        $scope.datos.direccionJuridico = rcJDireccion.trim();
                        $scope.datos.RC_CORREO = rcJCorreo.trim();
                        $scope.datos.telefonoFijoJuridico = rcJFonoFijo.trim();
                        $scope.consultaCiuTipoPer = 'JURIDICO';
                        $scope.datosT = {};
                    }
                    $scope.rcOid = results[0]._id;
                    $scope.consultaCiudadano = true;
                    $scope.desabilitadoFormulario = false; //habilitando tipo de formulario
                    //BUSCAR REGISTRO TIPO SUCCESS
                    $scope.btnClass = "success";
                    //Mensaje
                    $scope.spanOcultarMostrarExito = true;
                }else{
                    if(tipoPersona == 'NATURAL'){
                        $scope.limpiarCamposRcNatural();
                    }else{
                        $scope.limpiarCamposRcJuridico();
                    }
                    $scope.consultaCiudadano = false;
                    $scope.consultaCiuCampos = true;
                    $scope.consultaCiuCampos2 = false;
                    //BUSCAR REGISTRO
                    $scope.btnClass = "danger";
                    $scope.datos.INT_SOLICITANTE=".";
                    $scope.spanOcultarMostrarExito = false;
                    $scope.spanOcultarMostrarFracaso = true;
                }
                /*VALIDACNION FORMULARIO JURIDICO*/
                $scope.desabilitadoFormularioJuridico = false;
                $scope.camposCiudadanoCiHabilitar = true;
                $scope.rcDesabilitar = true;
                $scope.desbloquearCamposRc();
                         setTimeout(function(){            
                         $.unblockUI(); 
            },1000);
            }).error(function(results){
                         setTimeout(function(){            
                         $.unblockUI(); 
            },1000);
            });
    };

    $scope.limpiarCamposRcNatural = function(){
        $scope.datos.region = 0;
        $scope.datos.INT_SOLICITANTE = "";
        $scope.datos.direccion = "";
        $scope.datos.INT_CORREO = "";
        $scope.datos.INT_TEL_CELULAR = "";
        $scope.datos.telefonoFijo = "";
        $scope.datos.RC_NOMBRE = "";
        $scope.datos.RC_PATERNO = "";
        $scope.datos.RC_MATERNO = "";
    }
    $scope.limpiarCamposRcJuridico = function(){
        $scope.datos.nombreRazonSocial = "";
        $scope.datos.direccionJuridico = "";
        $scope.datos.RC_CORREO = "";
        $scope.datos.telefonoFijoJuridico = "";
    }

     //VALIDAR REGISTRO CIUDADANO
    $scope.validacamposJuridico = function (){
        if(tipoPersona == 'NATURAL'){
            $scope.opcionpersonaNatural = true;
            $scope.opcionpersonaJuridico = null;
            $scope.tituloVentana = 'Verificacion de número de carnet de identidad';
        } else {
            $scope.opcionpersonaJuridico = true;
            $scope.opcionpersonaNatural = null;
            $scope.tituloVentana = 'Verificacion de número de NIT';
        }
     }

     //VALIDAR REGISTRO CIUDADANO
     $scope.validaDatosRegistroCiudadano = function (response){
         if(tipoPersona == 'NATURAL'){
             $scope.opcionpersonaNatural = true;
             $scope.opcionpersonaJuridico = null;
             $scope.tituloVentana = 'Verificacion de número de carnet de identidad';
         } else {

             $scope.opcionpersonaJuridico = true;
             $scope.opcionpersonaNatural = null;
             $scope.tituloVentana = 'Verificacion de número de NIT';
         }
     }

    //REGISTRAR DATOS DEL CIUDADANO (NATURAL O JURIDICO)
    $scope.registroCiudadanoR = function (response) {
    console.log('registro ciudadano: ',response);

        var datos               = {};
        var tipoPersona         = $scope.tipoPersonaRc;
        var sDireccion          = response.direccion;
        var sFono               = response.telefonoFijo;
        var sCelular            = response.INT_TEL_CELULAR;
        var descripcionNombre   = response.RC_NOMBRE;
        var descripcionPaterno  = response.RC_PATERNO;
        var descripcionMaterno  = response.RC_MATERNO;
        var sCorreo             = "";
        var estado_civil        = '';
        var fecha               = new Date();
        var mes                 = fecha.getMonth()+1;

        if(mes.toString().length == 1)
            mes = '0'+mes;
        var dia = fecha.getDate();
        if(dia.toString().length == 1)
            dia='0'+dia;

        var fechactual          = fecha.getFullYear() + "-" + mes + "-" + dia + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();

        if(tipoPersona == 'NATURAL'){
            sCorreo = response.INT_CORREO;
        }else{
            sCorreo = response.RC_CORREO;
        }

        if(response.estado_civil) {
            datos['dtspsl_id_estado_civil'] = '';//response.estado_civil;
        } else {
            datos['dtspsl_id_estado_civil'] = '';
        }
        if(estado_civil == " ") {//response.estado_civil
            response.estado_civil = ""
        }

        if(tipoPersona == "NATURAL") {

                var parametros = {
                "table_name":"Ciudadano",
                "body":{
                    "record": [
                        {
                            "dtspsl_id":"1",
                            "dtspsl_id_estado_civil": estado_civil,//response.estado_civil,
                            "dtspsl_id_tp_registro": "1",
                            "dtspsl_ci": response.INT_RL_NUM_DOCUMENTO,//response.cedula2,
                            "dtspsl_complemento": '',//response.complemento,
                            "dtspsl_expedido": response.region,//response.expedido,
                            "dtspsl_pin": sNumeroAleatorio,
                            "dtspsl_nombres": response.RC_NOMBRE,
                            "dtspsl_paterno": response.RC_PATERNO,
                            "dtspsl_materno": response.RC_MATERNO,
                            "dtspsl_tercer_apellido": '',//response.tercer,
                            "dtspsl_sexo": '',//response.sexo,
                            "dtspsl_activacionf": "NO",
                            "dtspsl_activaciond": "NO",
                            "dtspsl_fec_nacimiento": response.RC_FECHA_NAC,//response.fecha_nacimiento,
                            "dtspsl_usr_id": '',//idUsuario,
                            "dtspsl_registrado": fechactual,
                            "dtspsl_modificado":fechactual,
                            "dtspsl_ocupacion": '',//response.ocupacion,
                            "dtspsl_poder_replegal": '',//response.repLegal,
                            "dtspsl_nro_documento": '',//response.nroDocumento,
                            "dtspsl_nro_notaria": '',//response.nroNotaria,
                            "dtspsl_nit": '',//response.nit,
                            "dtspsl_razon_social": '',//response.razonSocial,
                            "dtspsl_correo" : response.INT_CORREO,
                            "dtspsl_telefono" : response.telefonoFijo,
                            "dtspsl_movil" : response.INT_TEL_CELULAR,
                            "dtspsl_estado" : "ACTIVO",
                            "dtspsl_estado_activacion" : "DESBLOQUEADO",
                            "dtspsl_observacion_activacion" : "NINGUNA",
                            "dtspsl_fec_activacionf" : fechactual,
                            "dtspsl_fec_activaciond" : fechactual,
                            "dtspsl_direccion" : response.direccion,
                            "dtspsl_tipo_persona" : tipoPersona,
                            "dtspsl_lugar_nacimiento" : '',//response.lugarNacimiento,
                            "dtspsl_pais" :  '',//response.pais,
                            "dtspsl_departamento" :  '',//response.departamento,
                            "dtspsl_provincia" :  '',//response.provincia,
                            "dtspsl_municipio" :  '',//response.municipio,
                            "dtspsl_macrodistrito":  '',//response.macrodistrito,
                            "dtspsl_distrito":  '',//response.distrito,
                            "dtspsl_zona" :  '',//response.zona,
                            "dtspsl_tipo_via" :  '',//response.tipo_via,
                            "dtspsl_nombre_via" :  '',//response.nombrevia,
                            "dtspsl_numero_casa" :  '',//response.numero,
                            "dtspsl_edificio" :  '',//response.edificio,
                            "dtspsl_bloque" :  '',//response.bloque,
                            "dtspsl_piso" :  '',//response.piso,
                            "dtspsl_oficina" :  '',//response.numeroOficina,
                            "dtspsl_latitud" :  '',//response.latitud,
                            "dtspsl_longitud" :  '',//response.longitud,
                            "dtspsl_sistema" :  'IF247'//response.sistema
                        }
                    ]
                }
            };
        }else{

            var parametros = {
                "table_name":"Ciudadano",
                "body":{
                    "record": [
                        {
                            "dtspsl_id": "1",
                            "dtspsl_id_tp_registro": "1",
                            "dtspsl_ci_representante": "",// c1111,
                            "dtspsl_complemento_representante": "",//response.complemento,
                            "dtspsl_pin": sNumeroAleatorio,
                            "dtspsl_nombres_representante": "",//response.nombre_representante,
                            "dtspsl_paterno_representante": "",// response.paterno_representante,
                            "dtspsl_materno_representante": "",// response.materno_representante,
                            "dtspsl_tercer_apellido_representante": "",// response.tercer_representante,
                            "dtspsl_activacionf": "NO",
                            "dtspsl_activaciond": "NO",
                            "dtspsl_usr_id": "",// idUsuario,
                            "dtspsl_registrado": fechactual,
                            "dtspsl_modificado":fechactual,
                            "dtspsl_poder_replegal": "",// response.repLegal,
                            "dtspsl_nro_notaria": "",// response.nroNotaria,
                            "dtspsl_nit": response.RC_NIT,
                            "dtspsl_razon_social": response.nombreRazonSocial,
                            "dtspsl_correo" : response.RC_CORREO,// response.correo,//RC_CORREO
                            "dtspsl_telefono" : response.telefonoFijoJuridico,
                            "dtspsl_movil" : "",// response.celular,
                            "dtspsl_estado" : "ACTIVO",
                            "dtspsl_estado_activacion" : "DESBLOQUEADO",
                            "dtspsl_observacion_activacion" : "NINGUNA",
                            "dtspsl_fec_activacionf" : fechactual,
                            "dtspsl_fec_activaciond" : fechactual,
                            "dtspsl_tipo_persona" : tipoPersona,
                            "dtspsl_direccion" : response.direccionJuridico,
                            "dtspsl_sistema" :  'IF247'
                        }
                    ]
                }
            };
        }

       DreamFactory.api[CONFIG.SERVICERC].createRecords(parametros).success(function (results){
            if(results.record.length > 0){
                $scope.registro = '';
                if(tipoPersona == "NATURAL") {
                    if (sCorreo==""  && sCelular== "") {
                        var mensajeExito = "Formulario Almacenado. Estimado Ciudadano debe tomar nota de su Nro PIN : " + sNumeroAleatorio;

                        var sReferencia ="warning";
                        $scope.envioMensaje(mensajeExito, sReferencia);
                    } else {
                        if (sCorreo != "") {
                            var mensajeExito = "Formulario Almacenado. Estimado Ciudadano se envio el Nro PIN : " + sNumeroAleatorio + " a " + sCorreo;

                            $scope.envioMensaje(mensajeExito, sCorreo);
                        } else {
                            var mensajeExito = "Formulario Almacenado. Estimado Ciudadano se envio el Nro PIN : " + sNumeroAleatorio + " a " + sCelular;

                            $scope.envioMensaje(mensajeExito, sCelular);
                        }
                    }
                } else if(tipoPersona == "JURIDICO") {
                    if (sCorreo==""  && sCelular== "") {
                        var mensajeExito = "Formulario Almacenado. Estimado Ciudadano debe tomar nota de su Nro PIN : " + sNumeroAleatorio;

                        $("#cerrar").click();
                        var sReferencia ="warning";
                        $scope.envioMensaje(mensajeExito, sReferencia);
                    } else {
                        if (sCorreo != "") {
                            var mensajeExito = "Formulario Almacenado. Estimado Ciudadano se envio el Nro PIN : " + sNumeroAleatorio + " a " + sCorreo;

                            $("#cerrar").click();
                            $scope.envioMensaje(mensajeExito, sCorreo);
                        } else {
                            var mensajeExito = "Formulario Almacenado. Estimado Ciudadano se envio el Nro PIN : " + sNumeroAleatorio + " a " + sCelular;

                            $("#cerrar").click();
                            $scope.envioMensaje(mensajeExito, sCelular);
                        }
                    }
                }else{
                     $scope.msg = "Error !!";
                }
            }
        }).error(function(results){
        });
    };//FIN REGISTRAR DATOS RC

     //MODIFICAR REGISTRO CIUDADANO (NATURAL O JURIDICO)
    /*$scope.modificarRegistroCiudadano = function (response) {

    console.log('modificar: ',response);
        var fecha= new Date();
        var mes = fecha.getMonth() + 1;
        if(mes.toString().length == 1)
            mes = '0'+mes;
        var dia = fecha.getDate();
        if(dia.toString().length == 1)
            dia='0'+dia;
        var fechactual=fecha.getFullYear() + "-" + mes + "-" + dia + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        var tipoPersona  = $scope.tipoPersonaRc;
        var oidCiudadano = $scope.rcOid;
        var datos        = {};

        if(tipoPersona == 'NATURAL'){
            $scope.aDatosRc[0].dtspsl_expedido       = response.region;
            $scope.aDatosRc[0].dtspsl_nombres        = response.RC_NOMBRE;
            $scope.aDatosRc[0].dtspsl_paterno        = response.RC_PATERNO;
            $scope.aDatosRc[0].dtspsl_materno        = response.RC_MATERNO;
            $scope.aDatosRc[0].dtspsl_direccion      = response.direccion;
            $scope.aDatosRc[0].dtspsl_correo         = response.INT_CORREO;
            $scope.aDatosRc[0].dtspsl_movil          = response.INT_TEL_CELULAR;
            $scope.aDatosRc[0].dtspsl_telefono       = response.telefonoFijo;
            $scope.aDatosRc[0].dtspsl_fec_nacimiento = response.RC_FECHA_NAC;
            $scope.aDatosRc[0].dtspsl_modificado = fechactual;
            $scope.aDatosRc[0].dtspsl_sistema = 'IF247';
            //NUMERO ALEATORIO
            sNumeroAleatorio = Math.round(Math.random()*100000) + response.cedula;
        }else{
            $scope.aDatosRc[0].dtspsl_correo       = response.RC_CORREO;
            $scope.aDatosRc[0].dtspsl_direccion    = response.direccionJuridico;
            $scope.aDatosRc[0].dtspsl_telefono     = response.telefonoFijoJuridico;
            $scope.aDatosRc[0].dtspsl_razon_social = response.nombreRazonSocial;
            $scope.aDatosRc[0].dtspsl_modificado   = fechactual;
            $scope.aDatosRc[0].dtspsl_sistema   = "IF247";
            //NUMERO ALEATORIO
            sNumeroAleatorio = Math.round(Math.random()*100000) + response.RC_NIT;
        }

        var parametros = {
            "table_name":"Ciudadano",
            "ids" : oidCiudadano,
            "body":{
                 "record": [$scope.aDatosRc[0]]
            }
        };
        DreamFactory.api[CONFIG.SERVICERC].updateRecordsByIds(parametros).success(function (results){
        var mensajeExito = "Datos modificados correctamente.";
            sweet.show('', mensajeExito, 'success');
        });
    };*/

    $scope.modificarRegistroCiudadano = function (response) {
    console.log('modificar: ',response);
        var fecha= new Date();
        var mes = fecha.getMonth() + 1;
        if(mes.toString().length == 1)
            mes = '0'+mes;
        var dia = fecha.getDate();
        if(dia.toString().length == 1)
            dia='0'+dia;
        var fechactual=fecha.getFullYear() + "-" + mes + "-" + dia + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        var tipoPersona  = $scope.tipoPersonaRc;
        var oidCiudadano = $scope.rcOid;
        var datos        = {};

    var persona = {};

        if(tipoPersona == 'NATURAL'){

     persona['dtspsl_expedido'] = response.region;
        persona['dtspsl_nombres'] = response.RC_NOMBRE;
        persona['dtspsl_paterno'] = response.RC_PATERNO;
        persona['dtspsl_materno'] = response.RC_MATERNO;
        persona['dtspsl_direccion'] = response.direccion;
        persona['dtspsl_correo'] = response.INT_CORREO;
        persona['dtspsl_movil'] = response.INT_TEL_CELULAR;
        persona['dtspsl_telefono'] = response.telefonoFijo;
        persona['dtspsl_fec_nacimiento'] = response.RC_FECHA_NAC;
        persona['dtspsl_modificado'] = fechactual;
        persona['dtspsl_sistema'] = 'IF247';

            sNumeroAleatorio = Math.round(Math.random()*100000) + response.cedula;
        }else{

            persona['dtspsl_correo'] = response.RC_CORREO;
        persona['dtspsl_direccion'] = response.direccionJuridico;
        persona['dtspsl_telefono'] = response.telefonoFijoJuridico;
        persona['dtspsl_razon_social'] = response.nombreRazonSocial;
        persona['dtspsl_modificado'] = fechactual;
        persona['dtspsl_sistema'] = "IF247";
            //NUMERO ALEATORIO
            sNumeroAleatorio = Math.round(Math.random()*100000) + response.RC_NIT;
        }

        var parametros = {
            "table_name":"Ciudadano",
            "ids" : oidCiudadano,
             "body":persona
        };
        DreamFactory.api[CONFIG.SERVICERC].updateRecordsByIds(parametros).success(function (results){
        var mensajeExito = "Datos modificados correctamente.";
            sweet.show('', mensajeExito, 'success');
        });
    };//FINALIZAR MODIFICAR RC


//FINALIZAR MODIFICAR RC


    $scope.isActive = false;

    $scope.inicioNexoValidarBtn = function(){
        $scope.desabilitadoFormulario = true;

        $scope.camposRcEncontrados = false;
        $scope.isActive = true;
        $scope.btnClass = "warning";
        $scope.btnActulizarClass = "success";
        $scope.btnMostrarRcConsulta = true;
        $scope.btnMostrarRcActualizar = false;

        $scope.spanOcultarMostrarExito = false;
        $scope.spanOcultarMostrarFracaso = false;

        $scope.desabilitadoFormularioJuridico = true;
    };

    $scope.habilitarFormJuridico = function(){
        $scope.desabilitadoFormulario = false;
    };

    $scope.mostrarBtnActualizar = function(){
        if($scope.consultaCiudadano){
            $scope.btnMostrarRcConsulta = true;
            $scope.btnMostrarRcActualizar = true;
            $scope.consultaCiuCampos = true;
            $scope.consultaCiuCampos2 = false;
        }
    };

    $scope.habilitarFormNatural = function(){
        $scope.desabilitadoFormulario = false;
    };

    $scope.cambiarColorBtn = function(){
        $scope.btnClass = "warning";
        $scope.btnMostrarRcActualizar = false;
        $scope.btnMostrarRcConsulta = true;
        $scope.consultaCiuCampos = false;
        $scope.consultaCiuCampos2 = true;
        $scope.limpiarCamposRcNatural();
        $scope.spanOcultarMostrarExito = false;
        $scope.spanOcultarMostrarFracaso = false;

        $scope.desabilitadoFormulario = true;

        /*VALIDANDO FORMULARIO JURIDICO*/
        $scope.desabilitadoFormularioJuridico = true;
        $scope.limpiarCamposRcJuridico();
    };

    /*REGISTROCIUDADANO*/
    /*comportamiento de los botones*/
     $scope.emisionprueba = function(datosRc){
        $scope.titulo="CREAR TRAMITE";
        if($scope.procesoid!='')    {
            $scope.adicionarCaso($scope.datosCaso);
            $scope.procventana=false;
        }
         $("#registro .close").click();

       /* if($scope.botontit=="Siguiente" && $scope.procesoid!=''){
        $scope.botontit="Crear";
        $scope.botoncerrar="atras";
        $scope.tipoPersonaRc='';
        $scope.datos.INT_RL_NUM_DOCUMENTO='';
        $scope.datos='';
        $scope.tipo_hr='';
        //$scope.btnMostrarRcConsulta = false;
        $scope.btnMostrarRcActualizar = false;

        }
         else{
        console.log('error');
        if($scope.botontit=="Crear"){
            console.log('adicionar');
             $scope.adicionarCaso($scope.datosCaso);
             $("#registro .close").click();
             //REGISTROCIUDADANO
            if(!$scope.consultaCiudadano){
            console.log('nuevo registro');

                if($scope.tipoPersonaRc == 'JURIDICO'){
                    //VALIDANDO NIT
                    if(datosRc.RC_NIT != 0 && datosRc.RC_NIT.length >= 5){
                        $scope.registroCiudadanoR(datosRc);
                    }
                }else{
                    $scope.registroCiudadanoR(datosRc);
                }
            }else{

            }

        }
         else{
            console.log('error en adicionar');
            sweet.show('', "No selecciono ningun tramite", 'error');
            $scope.botontit=null;
                }
        }*/

        }

    $scope.mouseOver = function (proceso) {
           $scope.colorb = proceso;
        };

    $scope.emisioncerrar = function(){
        if($scope.botoncerrar=="atras"){
           $scope.procventana=true;
           $scope.sig=false;
           $scope.botoncerrar="Cerrar";
           $scope.botontit="Siguiente";
        }
        else{
            if($scope.botoncerrar=="Cerrar"){
               $scope.botoncerrar="Cerrar";
               $("#registro .close").click();
               $.unblockUI();
            }
        }
    }


$scope.lstanterior_casos = function(){

    if($scope.pagina >0){
        inicio = inicio - rango;
        fin = fin - rango;
        $scope.pagina = $scope.pagina-1;
         document.getElementById("idsiguiente").disabled=false;
    }
    if($scope.pagina ==1){
        document.getElementById("idanterior").disabled=true;
    }
    console.log("Ingresa por anterior",inicio, fin);
    var misDatos = {
        "procedure_name":"sp_listar_paginador",
                "body":{
                "params": [
                {
                "name": "id_nodo",
                "value": sessionService.get('IDNODO')
                },{
                "name": "id_ws",
                "value": sessionService.get('WS_ID')
                },{
                "name": "inicio",
                "value": inicio
                },{
                "name": "fin",
                "value": fin
                }
            ]
        }
    };
    console.log(misDatos);
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos);
    obj.success(function (response) {
        console.log("asfcs", response);
        console.log("Cantidad de tramites: ",response.length);
        $scope.obtCasos = response;
        var data = response;
        $scope.tablaBandeja.reload();
    });
    obj.error(function(error) {
        $scope.errors["error_rol"] = error;
        console.log("NO EXISTE VALOR");
    });
}

$scope.lstiniciolista = function(){
    if($scope.pagina == 1){
        inicio = 0;
        fin = 10;
        $scope.lstsiguiente_casos();
    }
}

$scope.lstsiguiente_casos = function(){
    $('.pagination').hide();
    $('.btn-group').hide();

    if(obtdatoscasos.length > 0){
        var datoslong = obtdatoscasos.length;
        x = datoslong / 10;
        y = datoslong % 10;
            if(y>=1 && contnum == 0){
                z = 10 - y;
                console.log("y: ",y, "z: ",z);
                obtdatoscasos.length = obtdatoscasos.length+z;
                contnum++;
            }
            if($scope.iniciogrilla == 0){
                inicio = 0;
                fin =inicio + rango;
                $scope.iniciogrilla=1;
                $scope.pagina = 0;
            }

            else{
                inicio = inicio + rango;
                fin =inicio + rango;
            }
    }
    else{
        if($scope.iniciogrilla == 0){
                inicio = 0;
                fin =inicio + rango;
                $scope.iniciogrilla=1;
                $scope.pagina = 0;
            }
    }

    if(x-1 == $scope.pagina){
        console.log("deshabilitado el btn siguiente");
        document.getElementById("idsiguiente").disabled=true;
    }
    console.log("Ingresa por siguiente",inicio, fin);
    $scope.pagina = $scope.pagina + 1;
    $scope.pagini = inicio;
    $scope.pagfin = fin;
    $scope.casoActual = $scope.pagina;
    console.log("$scope.pagina 2: ",$scope.pagina);
         var misDatos = {
                "procedure_name":"sp_listar_paginador",
                "body":{
                    "params": [
                        {
                            "name": "id_nodo",
                            "value": sessionService.get('IDNODO')
                        },{
                            "name": "id_ws",
                            "value": sessionService.get('WS_ID')
                        },{
                            "name": "inicio",
                            "value": inicio
                        },{
                            "name": "fin",
                            "value": fin
                        }
                    ]
                }
            };
            console.log(misDatos);
           var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos);
            obj.success(function (response) {
                console.log("asfcs", response);
                   $scope.obtCasos = response;
                    var data = response;
                    $scope.tablaBandeja.reload();
            });
            obj.error(function(error) {
                $scope.errors["error_rol"] = error;
                console.log("NO EXISTE VALOR");
            });
    }

    $scope.lstcaso_actual = function(){
    $('.pagination').hide();
    $('.btn-group').hide();
    inicio = $scope.pagini;
    fin = $scope.pagfin;
    $scope.pagina = $scope.casoActual;
         var misDatos = {
                "procedure_name":"sp_listar_paginador",
                "body":{
                    "params": [
                        {
                            "name": "id_nodo",
                            "value": sessionService.get('IDNODO')
                        },{
                            "name": "id_ws",
                            "value": sessionService.get('WS_ID')
                        },{
                            "name": "inicio",
                            "value": inicio
                        },{
                            "name": "fin",
                            "value": fin
                        }
                    ]
                }
            };
           var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos);
            obj.success(function (response) {
                console.log("asfcs", response);
                   $scope.obtCasos = response;
                    var data = response;
                    $scope.tablaBandeja.reload();
            });
            obj.error(function(error) {
                $scope.errors["error_rol"] = error;
                console.log("NO EXISTE VALOR");
            });
    }

    $scope.btnbuscador = function(datos){
        try {
            var bsc = new buscarCaso();
            bsc.id_nodo   =   sessionService.get('IDNODO');
            bsc.id_ws  =   sessionService.get('WS_ID');
            bsc.scampo   =  datos;
            console.log("bsc: ",bsc);
            bsc.bsccaso(function(res){
                x = JSON.parse(res);
                response = x.success.data;
                angular.forEach(response,function(celda, fila){
                    celda.casodata = JSON.stringify(celda.casodata);
                });
                $scope.obtCasos = response;
                var data = response;
            });

        } catch (error){
            $scope.errors["error_rol"] = error;
        }
        $scope.tablaBandeja.reload();
    };


    /***FIN DE HISTORICO***/
    $scope.$on('api:ready',function(){
        $scope.usuarioid = sessionService.get('IDUSUARIO');
        sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
        sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
        $scope.iniciogrilla=0;
        $scope.getCasos();
        $scope.lstiniciolista();
        $scope.getNodosUsusario();
    });
    $scope.inicioCasos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.usuarioid = sessionService.get('IDUSUARIO');
            sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
            sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
            $scope.getCasos();
            $scope.iniciogrilla=0;
            $scope.lstiniciolista();
            $scope.getNodosUsusario();
        }
    };

    var clsAtender = $rootScope.$on('atenderOtro', function(event, data, estado){
        $scope.atenderCaso(data, estado);
    });   
    var clsAtenderClon = $rootScope.$on('atenderClon', function(event, data, estado){
        $scope.getCasos();
        data.casonombre=data.casonro;
        $scope.atenderCaso(data,estado);
        $scope.recibirTramite(data,'recibir');
    });  
    $scope.$on('$destroy', function() {
        clsAtender(); 
        clsAtenderClon();
    });

});
