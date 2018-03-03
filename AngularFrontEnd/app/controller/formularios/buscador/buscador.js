app.controller('buscadorController', function ($scope, $q,$route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout,fileUpload) {
    var strfecha= new Date();
    var mes=strfecha.getMonth()+1;
    if(mes.toString().length==1)
        mes='0'+mes;
    var dia=strfecha.getDate();
    if(dia.toString().length==1)
        dia='0'+dia;
    $scope.fechactual=strfecha.getFullYear() + "-" + mes + "-" + dia + " " + strfecha.getHours() + ":" + strfecha.getMinutes() + ":" + strfecha.getSeconds();
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
    $scope.panelbuscador=true;
   
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
    $scope.getcasos10 = function(datos){
    $scope.panelCasos=true;
   console.log(datos.campo);
   console.log(datos.valor);
   console.log("espacio",datos.espacio);
   console.log(sessionService.get('WS_ID'));
    //var otro = $scope.compara[0].campo.campo
    
     var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select _fr_casos.cas_id,_fr_casos.cas_nombre_caso,_fr_casos.cas_fecha_inicio,_fr_casos.cas_fecha_limite,_fr_proceso.prc_nombre,_fr_casos.cas_id,_fr_casos.cas_act_id,_fr_casos.cas_datos from _fr_casos  INNER JOIN _fr_actividad ON _fr_casos.cas_act_id = _fr_actividad.act_id INNER JOIN _fr_proceso ON prc_id='"+datos.espacio+"' and act_prc_id=prc_id and prc_ws_id='"+sessionService.get('WS_ID')+"' where  cas_datos->>'"+datos.campo+"'  ='"+datos.valor+"'" 
            }]
        }
    };
    

    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      if (response[0].ejecutartojson!=null) {
        $scope.grupos1=0;
        $scope.grupos1 = JSON.parse(response[0].ejecutartojson);
        console.log("11111",response[0].ejecutartojson);
        console.log("campos",$scope.grupos1[0].cas_datos);
        
        console.log("MOSTRAR",$scope.grupos1[0].cas_datos.length);

        var jsontext = '{"firstname":"Jesper","surname":"Aaberg","phone":["555-0100","555-0120"]}';
        var contact = JSON.parse(jsontext);
        console.log(contact);
        //document.write(contact.surname + ", " + contact.firstname);
        //document.write(contact.phone[1]);


        console.log("2",$scope.grupos1);
        console.log("3",$scope.grupos1[0].cas_id);
        console.log("4",$scope.grupos1[0].cas_nombre_caso);
        console.log("5",$scope.grupos1[0].prc_nombre);
        $scope.nombrecas = $scope.grupos1[0].cas_nombre_caso;
        console.log("6",$scope.grupos1[0].cas_fecha_inicio);
        console.log("7",$scope.grupos1[0].cas_fecha_limite);
        $scope.caso = $scope.grupos1[0].cas_id;
        var fecha1=$scope.grupos1[0].cas_fecha_inicio.split("T");
        //var dia1=fecha1[2];
        //var mes1=fecha1[1];
        var ges1=fecha1[0];
        $scope.inicio=ges1;
        console.log(ges1);
        var fecha=$scope.grupos1[0].cas_fecha_limite.split("T");
        //var dia1=fecha1[2];
        //var mes1=fecha1[1];
        var ges=fecha[0];
        $scope.fin=ges;
        console.log(ges);
        $scope.getCasos();
        }else{
            //alert("111");
            
            sweet.show('', "No existe el valor", 'error');
        }

    });
      obj.error(function(error) {
        console.log("error");  
             
    }); 
    };
    $scope.datoscampos= function(datoson){
         
         var resAccesos = {"table_name":"_fr_busquedas",
                           "filter": "bsq_estado='A' and bsq_ws_id="+$scope.wsId+" and bsq_prs_id="+datoson+""
                            };  
         var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(resAccesos);
            obj.success(function(data)

            {
               $scope.getbsq=data.record;
               $scope.getbsqss=data.record[0].bsq_nombre;
               console.log("aa",$scope.getbsq);
            }).error(function(error) {
            });
  };
    /*$scope.getCasos = function(){
      $scope.nombrecas;
      console.log("5",$scope.nombrecas);
        console.log("0",sessionService.get('IDNODO'));
        console.log("00",sessionService.get('WS_ID'));

        var resOpcion = {
            "procedure_name":"casoslst2",
            "body":{
                "params": [
                    {
                        "name": "id_nodo",
                        "value": sessionService.get('IDNODO')
                    },
                    {
                        "name": "id_workspace",
                        "value": sessionService.get('WS_ID')
                    },
                    {
                        "name": "cas_nombre",
                        "value": $scope.nombrecas
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            $scope.obtCasos=response;
            console.log("0",response);
            
            
            var data = response;   //grabamos la respuesta para el paginado   casonombre
            //console.log(data,"1");
            //$scope.tablaBandeja.reload();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };*/
    $scope.getNodosUsusario = function(){
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
            $scope.nodos=response;
            $timeout( function(){
                $scope.getNodoSelect();
            }, 1000);
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
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
    $scope.tablaBandeja = {};
    $scope.obtCasos = "";
    $scope.getCasos = function(){
        console.log("0",sessionService.get('IDNODO'));
        console.log("00",sessionService.get('WS_ID'));

        var resOpcion = {
            "procedure_name":"casoslst2",
            "body":{
                "params": [
                    {
                        "name": "id_nodo",
                        "value": sessionService.get('IDNODO')
                    },
                    {
                        "name": "id_workspace",
                        "value": sessionService.get('WS_ID')
                    },
                    {
                        "name": "cas_nombre",
                        "value": $scope.nombrecas
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            $scope.obtCasos=response;
            var data = response;   //grabamos la respuesta para el paginado
            //console.log(data,"1");
            $scope.tablaBandeja.reload();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
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
        var nodoDato=JSON.parse(nodo);
        console.log("nodo elegido    ",nodo);
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
            function_name: "lst_procesos_workspace",
            body:{
                "params": [
                    {
                      "name": "workspace_id",
                      "value": sessionService.get('WS_ID')
                    }
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
            $scope.obtProcesos=response;
            angular.forEach($scope.obtProcesos,function(val, index){
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
            //$.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    $scope.volver = function(){
        $scope.tituloP='Mis Casos';
        $scope.panelCasos=true;
        $scope.panelFormularios=false;
        $scope.nodoAsignado = true;
        $route.reload();
    }

    $scope.atenderCaso = function(caso,estadoT){
        console.log("1",caso);
        console.log("2",estadoT);
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
        console.log("1111");
        console.log(sessionService.set('DATOSTRAMITE',JSON.stringify(caso).toString()));
        $scope.nodoAsignado=false;
        $scope.casoActual=caso;
        $scope.seleccionado=true;
        $scope.tituloP='TRÁMITE: '+caso.casonombre;
        $scope.datos=JSON.parse(caso.casodata);
        console.log( "datos originales", $scope.datos);
        $scope.trmFormulario = $scope.datos;
        $scope.impFormulario = JSON.parse(caso.casodata);
        $scope.panelCasos=false;
        $scope.panelFormularios=true;
        $scope.panelbuscador=false;
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
    };
    $scope.recibirTramite = function (datos,estadoT){
        console.log("id del usuario    ",sessionService.get('IDUSUARIO'),"id del tramite   ",datos.casoid,"numero  ",datos.casonro);
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
                    $scope.getCasos();
                }
                if(estadoT == 'dejar')
                {
                    sweet.show('', "Trámite Dejado", 'success');
                    $route.reload();
                    $scope.getCasos();
                }
            } else {
                sweet.show('', "El Trámite ya fue recibido por otro usuario", 'error');
                $route.reload();
            }
        }).error(function(response){
        });
    };

    $scope.cargarDatos=function(datos){
        $scope.datosHistorico=datos;
        $scope.datos=datos;
        //$scope.datos.g_fecha=$scope.fechactual;
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

    $scope.datosRender = function() {
        var multi_datos = document.renderForm.elements;     
        var caso = {};
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
                            $scope.direccionvirtual= CONFIG.APIURL +"/files/" + $scope.sIdProcesoActual + "/" + $scope.sCasoNro + "/";
                                    var direccion = fileUpload.uploadFileToUrl(multi_datos[i].files[0], $scope.direccionvirtual);                                    
                                    data = data + '"'+ nombreCampo +'": "'+ $scope.direccionvirtual +valorCampo+'?app_name=todoangular",';
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
                                //ELIMINADO ESTILO CREADO POR DEFECTO - EDITOR
                                /*var elemento    =   document.getElementById('mceu_74');
                                if(elemento){
                                    elemento.parentNode.removeChild(elemento);                                          
                                }*/
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
                        valorCHK="";
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
                        //console.log("check simple");
                        nombreCampoInterno = multi_datos[i].id;
                        valorCampoInterno = multi_datos[i].value;
                        seleccionadoI = multi_datos[i].checked;
                        if (seleccionadoI ==true) {
                            valorCampoCHKI = "true";
                        } else {
                            valorCampoCHKI = "false";
                        }
                        data = data + '"'+ nombreCampoInterno +'": "'+ valorCampoCHKI +'", ';
                    }
                }
            }
            /*
            for (var i = 0; i < multi_datos.length; i++) {
                nombreCampo = multi_datos[i].id;
                valorCampo = multi_datos[i].value;
                if (multi_datos[i].type=="checkbox") {
                    var multi_radio = document.renderForm.elements[multi_datos[i].id];
                    if (multi_radio.length > 1){
                        //checkbox multiples
                        valorCHK="";
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
                        console.log(valorCHK);
                        i = i + multi_radio.length;
                        valorCHK = valorCHK.substring(0, valorCHK.length -1);
                        valorCHK = '"' + nombreCampo +'":[' + valorCHK +'],';
                        data = data + valorCHK;
                    } else {
                        //console.log("check simple");
                        nombreCampoInterno = multi_datos[i].id;
                        valorCampoInterno = multi_datos[i].value;
                        seleccionadoI = multi_datos[i].checked;
                        if (seleccionadoI ==true) {
                            valorCampoCHKI = "true";
                        } else {
                            valorCampoCHKI = "false";
                        }
                        data = data + '"'+ nombreCampoInterno +'": "'+ valorCampoCHKI +'", ';
                    }
                }
            }*/
            //console.log("Parcial2",data);
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
            //console.log("Parcial3",data);
            //data = data + '"AE_SW_TIPO":"' + $scope.datos['AE_SW_TIPO'] + '", ';
            //data = data + '"AE_NRO_CASO":"' + $scope.datos['AE_NRO_CASO'] + '", ';
            //data = data + '"fecha":"' + $scope.datos['fecha'] + '" ';
            data = data.substring(0, data.length -2);
            data = data + '}"';
            data = data.substring(1, data.length -1);
            caso['cas_datos'] = data;
            caso['cas_modificado'] = $scope.fechactual;
            caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
            $scope.datosSerializados = data;
            
            console.log("CONTENIDO FORMULARIO :  ", data);
            
            //VARIABLE DE IMPRESION FORMULARIOS
            $scope.impFormulario = JSON.parse($scope.datosSerializados);
        }
        console.log("A",$scope.casoActual.casoid);
        var resProceso = {"table_name":"_fr_casos",
                        "body":caso,
                        "id":$scope.casoActual.casoid};
        console.log(resProceso);
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
        obj.success(function(data){
            $scope.getCasos();
            $scope.evalReglasFormulario();
            $scope.datos=JSON.parse($scope.datosSerializados);
            console.log( "datos despues", $scope.datos);
            //$scope.datos = $scope.datosSerializados
            //$scope.trmFormulario = $scope.datosSerializados;
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        });
    }

    $scope.guardarData=function(datos){
        var datosSerializados = JSON.stringify(datos);
        $scope.datosSerializados = JSON.stringify(datos);
        var caso = {};
        caso['cas_datos'] = datosSerializados;
        caso['cas_modificado'] = $scope.fechactual;
        caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
        var resProceso = {"table_name":"_fr_casos",
                        "body":caso,
                        "id":$scope.casoActual.casoid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
        obj.success(function(data){
            $scope.getCasos();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
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
            console.log(sReglaAct);
            sReglaEvaluada = eval(sReglaAct);
            if(sReglaEvaluada){
                aRespuesta=cel['regsig'];
                console.log("respuesta-->>>",aRespuesta);
            }
        });
        if(aRespuesta!=''){
            $scope.resp = aRespuesta;
            $scope.derivarOtro();
            console.log("ACTIVIDAD:", aRespuesta);
        }
        else{
            $scope.cerrarCaso();
        }
    }
    
    $scope.evalReglasFormularioEntrada = function(){
        var sFormMostrar = "";
        $scope.formSigId=null;
        //$scope.datos.g_fecha = $scope.fechactual;
        $scope.datos.g_tipo = sessionService.get("TIPO_PROCESO");
        $scope.datos.AE_NRO_CASO = sessionService.get("TRAMITE_ACTUAL");
        if ($scope.casoActual.casonombre){
            console.log($scope.datos.AE_NRO_CASO);
        } else {
            $scope.casoActual.casonombre = $scope.datos.AE_NRO_CASO;
        }
        console.log('dataaa:-->>>',$scope.datos);
        $scope.data = $scope.datos;
        $scope.obtReglasForm = JSON.parse($scope.reglasFormulario);
        console.log('entrada:   ',$scope.obtReglasForm);
        /*RECORREMOS LAS REGLAS DE NEGOCIO*/
        console.log("data", $scope.obtReglasForm);
        angular.forEach($scope.obtReglasForm,function(celda, fila){
            if(celda['regftipo']=='ENTRADA')
            {   var sReglaForm = celda['regfregla'];
                var sReglaEvaluada = false;
                var flags = "gi";
             
                /*RECORREMOS EL FORMULARIO*/                
                angular.forEach($scope.data,function(campoValor, campoNombre){
                    if(sReglaForm.indexOf(campoNombre) != -1 ){
                        //sReglaForm = sReglaForm.replace('#'+campoNombre+'#', campoValor,flags);
                        var regex = new RegExp('#'+campoNombre+'#', flags);
                        sReglaForm = sReglaForm.replace(regex, campoValor);
                    }
                });
                console.log('regla formulario mis casos: -->>>',sReglaForm);
                sReglaEvaluada = eval(sReglaForm);
                if(sReglaEvaluada){
                    console.log(sReglaEvaluada);
                    $scope.formSigId=celda['regfsiguiente'];
                }
            }
        });

        if($scope.formSigId){
            console.log('existe siguiente');
            $scope.cargarFormularioCargar($scope.formSigId)
            $scope.memoria[$scope.contador]=$scope.formSigId;
            $scope.contador++;
            console.log('memoria',$scope.memoria);
        }
        else{
            console.log('no  existe siguiente');
            var caso = {};
            console.log($scope.casoActual.actsigid);
            if($scope.casoActual.actsigid==0 ){
                $scope.evalReglasAvanzar();
            }
            else{
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
            }
            else{
                $scope.derivar();
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
            closeOnConfirm: false
        }, function() {
            sweet.close();
            if($scope.datos.INT_AC_MACRO_ID)
            {
                $scope.macro_id=$scope.datos.INT_AC_MACRO_ID;
            }
            else{
                $scope.macro_id=null;
            }
            var resOpcion = {
                "procedure_name":"derivar_macro",
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
                            "name": "nrocaso",
                            "value": $scope.casoActual.casonro
                        },{
                            "name": "nodoid",
                            "value": sessionService.get('IDNODO')
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
            });
        });
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
            if($scope.datos.INT_AC_MACRO_ID)
            {
                $scope.macro_id=$scope.datos.INT_AC_MACRO_ID;
            }
            else{
                $scope.macro_id=null;
            }
            var resOpcion = {
                "procedure_name":"derivar_macro",
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
                            "name": "nrocaso",
                            "value": $scope.casoActual.casonro
                        },{
                            "name": "nodoid",
                            "value": sessionService.get('IDNODO')
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
                $scope.array=[];
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
                                $scope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                            });
                        } else {
                            $scope.array[value.campo] = value.data;
                        }

                    } else {
                        $scope.array[value.campo] = "";
                    }
                }, log);
                $.unblockUI();
                deferred.resolve($scope.array);
            });
        $.unblockUI();
        return deferred.promise;
    }

    $scope.cargarFormularioCargar=function(formid){
        $scope.template ='';
        console.log('form siguiente->>',    formid);
        angular.forEach($scope.obtFormularios,function(celda, fila){
            if(celda['formid']==formid){
                console.log('celda----',celda['formurl']);
                cadVariables = celda['formurl']; 
                arrVariables = cadVariables.split("?");
                if (arrVariables[1]) {
                    $scope.miPropioFormulario = arrVariables[1];
                    var arregloDatos = $scope.obtenerData($scope.miPropioFormulario);
                    arregloDatos.then(function(respuesta) {
                        $scope.datosBD = respuesta;
                        //console.log($scope.datosBD);
                        $scope.template = '../../../app/view/formularios/formularios/'+arrVariables[0];
                        $scope.tituloForm = '../../../app/view/formularios/formularios/'+arrVariables[0];
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

    $scope.volverFormulario = function(){
        $scope.cargarFormularioCargar($scope.memoria[$scope.contador-2]);
        $scope.contador=$scope.contador-1;
    }

    $scope.limpiar = function(){
        $scope.datosCasoData = '';
        $scope.datosCaso = '';
        $scope.boton="new";
        $scope.desabilitado = false;
        $scope.titulo="Crear Trámite";
        $scope.getProcesos();
        $scope.procesoSeleccionado='';
        $scope.procesoid='';
    };

    $scope.seleccionarProceso = function(proceso){
        $scope.procesoSeleccionado=proceso.procid;
        $scope.procesoid=proceso;
    }

    $scope.adicionarCaso = function(){
        sessionService.set("TIPO_PROCESO", $scope.procesoid.procodigo);
        if($scope.procesoid.actid!= null)
        {
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
                            "value": '{"g_fecha": "'+$scope.fechactual+'", "g_tipo": "'+$scope.procesoid.procodigo+'"}'
                        },{
                            "name": "procodigo",
                            "value": $scope.procesoid.procodigo
                        },{
                            "name": "macro_id",
                            "value": null
                        },{
                            "name": "nodo_id",
                            "value": sessionService.get('IDNODO')
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
            })
            .error(function(data){
                sweet.show('', "Registro no insertado", 'error');
                $scope.btnGuardar = false;
            })
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
                                x = c + 50;
                                y = y + 50;
                                if(bifurcacion == 0)
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                                else
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
                                x = c + 35;
                                if(bifurcacion == 0)
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                                else
                                  bifurcacion = 0;
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '","color":"yellowgreen", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                            }
                            break;
                        }else{
                            $scope.actividadEstado[i]= 1;
                            b=1;
                            if(response[i].tipoactid == 2)
                            {
                                x = c + 50;
                                y = y + 50;
                                if(bifurcacion == 0)
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                                else
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
                                x = c + 35;
                                if(bifurcacion == 0)
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                                else
                                  bifurcacion = 0;
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
                        x = c + 50;
                        y = y + 50;
                        if(bifurcacion == 0)
                          $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                        else
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
                        x = c + 35;
                        if(bifurcacion == 0)
                          $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                        else
                          bifurcacion = 0;
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

    /***FIN DE HISTORICO***/
    $scope.$on('api:ready',function(){
        $scope.usuarioid = sessionService.get('IDUSUARIO');
        sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
        sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
        $scope.getCasos();
        $scope.getNodosUsusario();
        $scope.proceso(sessionService.get('WS_ID'));
        $scope.datoscampos();
    });
    $scope.inicioCrear = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.usuarioid = sessionService.get('IDUSUARIO');
            sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
            sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
            $scope.getCasos();
            $scope.getNodosUsusario();
            $scope.proceso(sessionService.get('WS_ID'));
            $scope.datoscampos();
        }
    };
});
