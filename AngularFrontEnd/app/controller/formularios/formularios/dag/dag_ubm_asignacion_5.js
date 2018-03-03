app.controller('busquedaController' , function ($scope, $rootScope, $routeParams, $location, $http, Data, sessionService, CONFIG, LogGuardarInfo, DreamFactory,ngTableParams,$filter,sweet, $sce, registroLog,FileUploader) {
    var vAsunto = "Cambio_de_PIN_GAMLP";
    var vMensaje = "Usted_solicito,_Cambio_de_PIN.";

    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var aRegistro = { "cedula": "","complemento": "","celular":"","correo":"","direccion":"","estado_civil":"",
    "fecha_nacimiento":"","materno":"","nombre":"","ocupacion":"","paterno":"","sexo":"","telefono":"",
    "cedula2": "","complemento2": "","repLegal": "","nroDocumento": "","nroNotaria": "",
    "nit": "","razonSocial": "","tipoP": "","cestcivil_id": "", "cestcivil_id": "",
    "cestcivil_id": "","zona": "","zona_mdst_id": "","yzona_dst_id": ""};
    $scope.titulo = "Busqueda";
    $scope.tipo_persona = "NATURAL";
    $scope.templates =
        [ { name: 'template1.html', url: '../../../app/view/registro_ciudadano/servicios/index.html'}, //internet y juegos
          { name: 'template2.html', url: '../../../app/view/registro_ciudadano/documentos/index.html'}, // documentos vigentes
          { name: 'template3.html', url: '../../../app/view/registro_ciudadano/modificarRegistro/index.html'},// modificar ciudadano
          { name: 'template4.html', url: '../../../app/view/registro_ciudadano/servicios/index2.html'}, // solicitud de viajes
          { name: 'template5.html', url: '../../../app/view/catastro/duplicado/index.html'},
          { name: 'template6.html', url: '../../../app/view/registro_ciudadano/servicios/index3.html'},
          { name: 'template7.html', url: '../../../app/view/registro_ciudadano/salud/index.html'}// certificado de Obito
          ];

          var formularioPersona = "";
          var telefonomodif = "";
          var celularmodif = "";
          var existe = "";

          /*******************************/

          $scope.cambiarVista = function(dato) {
            console.log(dato);
            $scope.formCambioPin = null;
            $scope.formActivacionDigital = null;
            if (dato == 1)
                sessionService.set('ID_FORMULARIO', 3);
            else
                sessionService.set('ID_FORMULARIO', 1);

            console.log("cambio de vista a " + dato);
            $scope.template = $scope.templates[dato];
        };

        $scope.abrirDivPersona = function(dato) {
            if (dato=="NATURAL") {
                sessionService.set('TIPO_PERSONA', "NATURAL");
                $scope.personaNatural = "mostrar";
                $scope.personaJuridica = null;
                $scope.tipoPersona = "ocultar";
                $scope.titulo = "Busqueda Ciudadano";
                $scope.frmPersonaNatural = "mostrar";
                $scope.frmPersonaJuridica = null;
            } else {
                sessionService.set('TIPO_PERSONA', "JURIDICO");                
                $scope.personaNatural = null;
                $scope.personaJuridica = "mostrar";
                $scope.tipoPersona = "ocultar";
                $scope.titulo = "Busqueda Empresa";
                $scope.frmPersonaNatural = null;
                $scope.frmPersonaJuridica = "mostrar";
            }
        }
        $scope.abrirDivPersonaN = function (){
            $scope.restaurarBusqueda();
            $scope.personaNatural = "mostrar";
            $scope.personaJuridica = null;
            $scope.tipoPersona = "ocultar";
            $scope.titulo = "Busqueda Ciudadano";
            $scope.frmPersonaNatural = "mostrar";
            $scope.frmPersonaJuridica = null;
            sessionService.destroy("IDSOLICITANTE");
            $scope.template = "";

        }
        $scope.abrirDivPersonaJ = function (){
            $scope.restaurarBusqueda();
            $scope.personaNatural = null;
            $scope.personaJuridica = "mostrar";
            $scope.tipoPersona = "ocultar";
            $scope.titulo = "Busqueda Empresa";
            $scope.frmPersonaNatural = null;
            $scope.frmPersonaJuridica = "mostrar";
            sessionService.destroy("IDSOLICITANTE");
            $scope.template = "";

        }
        $scope.volverBusqueda = function() {
            $scope.restaurarBusqueda();
            $scope.titulo = "Busqueda";
            $scope.tipoPersona = null;
            $scope.personaNatural = null;
            $scope.personaJuridica = null;
            $scope.tablaCiudadanos = null;
            $scope.tablaEmpresas = null;
            $scope.opciones = null;
            $scope.opciones2 = null;
            $scope.formCambioPin = null;
            $scope.regMedico =null;
            $scope.formActivacionDigital = null;
            $scope.modRegistro =null;
            $scope.nuevaBusqueda = null;
            $scope.nuevaBusquedaJ = null;
            sessionService.destroy("IDSOLICITANTE");
            $scope.template = "";
        }
        $scope.startDateOpen = function($event) {
            console.log('open');
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startDateOpened = false;
            $scope.startDateOp = true;
        };
        $scope.startDateOpen2 = function($event) {
            console.log('open2');
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startDateOpened = true;
            $scope.startDateOp = false;
        };
    $scope.antecedentes = [ //<--- Adding the data
    {id:1,ant:'Alergias o medicamentos',det:'Penicilina'},
    {id:2,ant:'Problemas respiratorios',det:'asma'},
    {id:3,ant:'Problemas congenitos',det:'malformaciones'}
    ];
    $scope.antecedentesFamiliares = [ //<--- Adding the data
    {id:1,ante:'Diabetes'},
    {id:2,ante:'Cirrocis'},
    {id:3,ante:'Cancer'}
    ];
    $rootScope.prsId=0;
    $scope.registroMedico = function(prsId) {
        $scope.checkboxes = { 'checked': true, items: {} };
        $scope.checkboxesi = { 'checked': true, items: {} };
        $rootScope.prsId=prsId;
        $scope.regMedico = "mostrar";
        $scope.formCambioPin = null;
        $scope.formActivacionDigital = null;
        $scope.modRegistro = null;
        var misDatos = {
            "procedure_name":"spbuscarregistromedico",
            "body":{"params": [{"name": "prsId","value": prsId}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos);
        $scope.boton='new';
        obj.success(function (response){
            $scope.datosMedicos='';
            if(response.length>0){
                $scope.boton='upd';
                $scope.datosMedicos=response[0];
                var antPer1=response[0].dtsmdcantpersonal_1.split('&');
                var antPer2=response[0].dtsmdcantpersonal_2.split('&');
                var antPer3=response[0].dtsmdcantpersonal_3.split('&');
                var antFam1=response[0].dtsmdcantfamiliar_1.split('&');
                var antFam2=response[0].dtsmdcantfamiliar_2.split('&');
                var antFam3=response[0].dtsmdcantfamiliar_3.split('&');
                if(antPer1[0]==1)
                    $scope.checkboxes.items[1]=true;
                else
                    $scope.checkboxes.items[1]=false;

                if(antPer2[0]==1)
                    $scope.checkboxes.items[2]=true;
                else
                    $scope.checkboxes.items[2]=false;

                if(antPer3[0]==1)
                    $scope.checkboxes.items[3]=true;
                else
                    $scope.checkboxes.items[3]=false;

                if(antFam1[0]==1)
                    $scope.checkboxesi.items[1]=true;
                else
                    $scope.checkboxesi.items[1]=false;
                if(antFam2[0]==1)
                    $scope.checkboxesi.items[2]=true;
                else
                    $scope.checkboxesi.items[2]=false;
                if(antFam3[0]==1)
                    $scope.checkboxesi.items[3]=true;
                else
                    $scope.checkboxesi.items[3]=false;
            }
            else{
                $scope.checkboxes = { 'checked': true, items: {} };
                $scope.checkboxesi = { 'checked': true, items: {} };
            }
        });
    };
    $scope.guardarDatosMedicos = function(opcion,datosMedicos) {
        var datosMed = {};
        angular.forEach($scope.antecedentes,function(celda, fila){
            var idAnt=celda['id'];
            if($scope.checkboxes.items[idAnt])
            {
                datosMed['dtsmdc_ant_personal_'+idAnt] = '1&'+celda['id']+'&'+celda['ant']+'&'+celda['det'];
            }
            else{
                datosMed['dtsmdc_ant_personal_'+idAnt] = '0&'+celda['id']+'&'+celda['ant']+'&'+celda['det'];
            }
        });
        angular.forEach($scope.antecedentesFamiliares,function(celda, fila){
            var idAntf=celda['id'];
            if($scope.checkboxesi.items[idAntf])
                datosMed['dtsmdc_ant_familiar_'+idAntf] = '1&'+celda['id']+'&'+celda['ante'];
            else
                datosMed['dtsmdc_ant_familiar_'+idAntf] = '0&'+celda['id']+'&'+celda['ante'];
        });
        if(datosMedicos.dtsmdcfechaalta.getFullYear)
            var fechaAlta=datosMedicos.dtsmdcfechaalta.getFullYear() + "-" + (datosMedicos.dtsmdcfechaalta.getMonth()+1) + "-" + datosMedicos.dtsmdcfechaalta.getDate() + " " + datosMedicos.dtsmdcfechaalta.getHours() + ":" + datosMedicos.dtsmdcfechaalta.getMinutes() + ":" + datosMedicos.dtsmdcfechaalta.getSeconds();
        else
            var fechaAlta=datosMedicos.dtsmdcfechaalta;
        datosMed['dtsmdc_dtspsl_id'] = $rootScope.prsId;
        datosMed['dtsmdc_grp_sanguineo'] = datosMedicos.dtsmdcgrpsanguineo;
        datosMed['dtsmdc_cbt_medica'] = datosMedicos.dtsmdcsbtmedica;
        datosMed['dtsmdc_fecha_alta'] = fechaAlta;
        datosMed['dtsmdc_observaciones'] = datosMedicos.dtsmdcobservaciones;
        datosMed['dtsmdc_modificado'] = fechactual;
        datosMed['dtsmdc_usr_id'] = sessionService.get('IDUSUARIO');
        if(opcion=='new')
        {
            datosMed['dtsmdc_registrado'] = fechactual;
            datosMed['dtsmdc_estado'] = 'A';
            var resDatosMed = {
                table_name:"_bp_datos_medicos",
                body:datosMed
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resDatosMed);
            obj.success(function(data){
                sweet.show('', "Registro insertado", 'success');
            })
            obj.error(function(data){
                sweet.show('', "Registro no insertado", 'error');
            })
        }
        else{
            var resDatosMed = {
                table_name:"_bp_datos_medicos",
                id: datosMedicos.dtsmdcid,
                body: datosMed
            };
            //servicio modificar personas
            var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resDatosMed);
            obj.success(function(data){
                sweet.show('', "Registro modificado", 'success');
            })
            .error(function(data){
                sweet.show('', "registro no modificado", 'error');
            })
        }
        $scope.regMedico = null;
    };


    $scope.cargando = function(datos){
        var buscarCiudadano = new rcNatural();
        buscarCiudadano.tipo_persona = "NATURAL";
        if (datos.vci)
            buscarCiudadano.ci = datos.vci.toUpperCase();
        if (datos.vnombre)
            buscarCiudadano.nombres = datos.vnombre.toUpperCase();
        if (datos.vappaterno)
            buscarCiudadano.paterno = datos.vappaterno.toUpperCase();
        if (datos.vapmaterno)
            buscarCiudadano.materno = datos.vapmaterno.toUpperCase();
        console.log(buscarCiudadano);
        buscarCiudadano.buscarPersona(function(resultado){
            resultadoApi = JSON.parse(resultado);
            console.log(resultadoApi);
            if(resultadoApi.length > 0){
                $scope.tablaCiudadanos = "mostrar";
                $scope.obtDatos = resultadoApi;
                //cerrar(); 
                sweet.show('', "Datos Encontrados", 'success');
            } else {
                sweet.show('', "No existen ninguno ciudadano", 'error');
                $scope.obtDatos="";
                $scope.tablaCiudadanos = null;
                $scope.tablaEmpresas = null;
            }           
        }); 
    }
   //BUSQUEDA PERSONA NATURAL
   $scope.buscarPersona = function (datos) {
    $scope.tablaCiudadanos = "mostrar";
    $scope.cargando(datos);



};


$scope.buscarPersonaJ = function (datos) {
    $.blockUI();
    console.log(datos);
    var buscarCiudadano = new rcNatural();
    if (datos.vnit)
        buscarCiudadano.nit = datos.vnit.toUpperCase();
    if (datos.vrazonsocial)
        buscarCiudadano.razonSocial = datos.vrazonsocial.toUpperCase();
    if (datos.vciJ)
        buscarCiudadano.ci_r = datos.vciJ.toUpperCase();
    if (datos.vciJ)
        buscarCiudadano.ci_r = datos.vciJ.toUpperCase();
    buscarCiudadano.tipo_persona = "JURIDICO";
    buscarCiudadano.buscarPersona(function(resultado){
        resultadoApi = JSON.parse(resultado);
        console.log(resultadoApi);
        if(resultadoApi.length > 0){
            $scope.tablaEmpresas = "mostrar";
            $scope.obtDatos = resultadoApi;
            if($scope.obtDatos.dtspsl_complemento_representante != null)
                $scope.obtDatos.dtspsl_ci_representante = $scope.obtDatos.dtspsl_ci_representante + '-' + $scope.obtDatos.dtspsl_complemento_representante;
            sweet.show('', "Datos Encontrados", 'success');
        } else {
            $.unblockUI();
            sweet.show('', "No existen ninguna empresa", 'error');
            $scope.obtDatos="";
            $scope.tablaCiudadanos = null;
            $scope.tablaEmpresas = null;
        }      
        $.unblockUI();  
    }); 
};

$scope.combopais = function(){
    var parametros = {"table_name":"_bp_pais",
                        "filter":"pais_estado='A'",
                    };  
    var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(parametros);
        obj.success(function(data){
        $rootScope.comdpais=data.record;
    })   
};

$scope.combodepa = function(){  
    var parametros = {"table_name":"_bp_departamento",
                "filter":"dpto_estado='A'",    
                    };  
    var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(parametros);
        obj.success(function(data){
        $rootScope.comdepa=data.record;
    })   
};
$scope.cargarMacrodistrito = function(){
             var parametros = {
                             "table_name":"_bp_macrodistrito",
                             "filter":"mcdstt_estado = 'A'", 
                             "order":"mcdstt_id" 
             };        
    /*           DreamFactory.api[CONFIG.SERVICE].getRecords(parametros).success(function (results){
                     if(results.record.length > 0){
                             $rootScope.aMacrodistritos = results.record;
                             $rootScope.deshabilitadoMc = false;
                     }else{
                        console.log("erorrr");
                             $rootScope.msg = "Error !!";
                             $rootScope.deshabilitadoMc = true;
                             $rootScope.deshabilitadoDs = true;
                             $rootScope.deshabilitadoZ = true;
                             $rootScope.registro.macrodistrito = 0;
                             $rootScope.registro.distrito = 0;
                             $rootScope.registro.zona = 0;         
                     }             
             }).error(function(results){
             });*/
             var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(parametros);
        obj.success(function(data){
        $rootScope.aMacrodistritos=data.record;
        }) 
     };

     $scope.cargarDistrito = function(idDis){
             var parametros = {
                             "table_name":"_bp_distrito",
                             "filter":"dstt_id_mcdstt='" + idDis +"'"

             };        
             DreamFactory.api[CONFIG.SERVICE].getRecords(parametros).success(function (results){
                     if(results.record.length > 0){
                             $rootScope.aDistritos = results.record;
                             $rootScope.deshabilitadoDs = false;
                     }else{
                             $rootScope.msg = "Error !!";
                             $rootScope.deshabilitadoDs = true;
                             $rootScope.deshabilitadoZ = true;
                             $rootScope.registro.distrito = 0;
                             $rootScope.registro.zona = 0;         
                     }             
             }).error(function(results){
             });
     };

     $scope.cargarZona = function(idZona){
            
             var parametros = {
                             "table_name":"_bp_distritos_zonas",
                             

                             "filter":"dist_dstt_id=" + idZona
             };        
             DreamFactory.api[CONFIG.SERVICE].getRecords(parametros).success(function (results){
                     console.log(results.record.length);
                     if(results.record.length > 0){
                             $rootScope.aZonas = results.record;
                             console.log($scope.aZonas);
                             $rootScope.deshabilitadoZ = false;
                     }else{
                             $rootScope.msg = "Error !!";
                             $rootScope.deshabilitadoZ = true;
                             $rootScope.registro.zona = 0;         
                     }             
             }).error(function(results){
             });
     };

      $scope.cargarProvincia = function(idProv){
            var parametros = {
                             "table_name":"_bp_provincias",
                              "filter":"prv_dpto_codigo='" + idProv +"'"
             };        
             DreamFactory.api[CONFIG.SERVICE].getRecords(parametros).success(function (results){
                     if(results.record.length > 0){
                             $rootScope.aProvincias = results.record;
                             $rootScope.deshabilitadoP = false;
                     }else{
                             $rootScope.msg = "Error !!";
                             $rootScope.deshabilitadoP = true;
                             $scope.deshabilitadoM = false;
                             $rootScope.deshabilitadoMc = true;
                             $rootScope.deshabilitadoDs = true;
                             $rootScope.deshabilitadoZ = true;
                             $rootScope.registro.provincia = 0;
                             $rootScope.registro.municipio = 0;
                             $rootScope.registro.macrodistrito = 0;
                             $rootScope.registro.distrito = 0;
                             $rootScope.registro.zona = 0;
                     }             
             }).error(function(results){
             });
     };

$scope.cargarMunicipio = function(idMun){
             var parametros = {
                             "table_name":"_bp_municipios",
                             "filter":"mnc_codigo_compuesto_prov='" + idMun +"'"
             };        
             DreamFactory.api[CONFIG.SERVICE].getRecords(parametros).success(function (results){
                     if(results.record.length > 0){
                             $rootScope.aMunicipios = results.record;
                             $rootScope.deshabilitadoM = false;
                     }else{

                             $rootScope.msg = "Error !!";
                             $rootScope.deshabilitadoM = true;
                             $rootScope.deshabilitadoMc = true;
                             $rootScope.deshabilitadoDs = true;
                             $rootScope.deshabilitadoZ = true;
                             $rootScope.registro.municipio = 0;
                             $rootScope.registro.macrodistrito = 0;
                             $rootScope.registro.distrito = 0;
                             $rootScope.registro.zona = 0;         
                     }             
             }).error(function(results){
             });
     };

  

$scope.getprof = function(){
     var resAccesos = {
        "table_name":"_bp_profesion",
                        "filter": "prf_estado='A'",
                        "order" : "prf_profesion"
                        };  
        var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(resAccesos);
            obj.success(function(data)
            {
                $rootScope.getpro=data.record;
            })   
};

$scope.estadoCivil = function(){
     var parametros = {
                     "table_name":"_bp_estados_civiles"
     };        
     DreamFactory.api[CONFIG.SERVICE].getRecordsByPost(parametros).success(function (results){
             if(results.record.length > 0){
                     $rootScope.aEstadoCivil = results.record;
                    
             }else{
                     $scope.msg = "Error !!";
             }             
     }).error(function(results){
     });
 };       
$scope.verOpciones = function (datos) {
    console.log("Estos son los datos===>>",datos);
    $rootScope.datos = datos;
    $scope.combopais();
    $scope.combodepa();
    $scope.cargarProvincia(datos.dtspsl_departamento);
    $scope.cargarMunicipio(datos.dtspsl_provincia);
    $scope.cargarMacrodistrito();
    $scope.cargarDistrito(datos.dtspsl_macrodistrito);
    $scope.cargarZona(datos.dtspsl_distrito);
    $scope.getprof();
    $scope.estadoCivil();
    sessionService.set('IDSOLICITANTE', datos._id);
    $scope.tablaCiudadanos = null;
    $scope.tablaEmpresas = null;
    $scope.nuevaBusqueda = "mostrar";
    $scope.nuevaBusquedaJ = "mostrar";
    $scope.opciones = "mostrar";
    $scope.opciones2 = null;
    $scope.msg = "Procesando";
    $scope.desabilitado = "true";
    $scope.datos = datos;
    $scope.encontrado = "si";
    if(datos.vestado_activacion=='BLOQUEADO')
    {
        datos.icono='fa fa-lock fa-lg';
    }
    else{
        datos.icono='fa fa-unlock fa-lg';
    }
    if(datos.dtspsl_activacionf=='SI')
    {
        datos.iconoAF='fa fa-thumbs-o-up fa-lg';
    }
    else{
        datos.iconoAF='fa fa-thumbs-o-down fa-lg';
    }
    if(datos.dtspsl_activaciond=='SI')
    {
        $scope.iconoAD='fa fa-thumbs-o-up fa-lg';
    }
    else{
        $scope.iconoAD='fa fa-thumbs-o-down fa-lg';
    }
    $scope.dataP = [datos];
    $scope.frmPersonaNatural = null;
    $scope.frmPersonaJuridica = null;

    if (datos.dtspsl_fec_nacimiento) {
        var fechaNacimiento = new Date(datos.dtspsl_fec_nacimiento);
        var mesFechaNacimiento = "";
        var diaFechaNacimiento = "";
        if (fechaNacimiento.getMonth()<9 ) 
        {
            mesFechaNacimiento = "0" + (fechaNacimiento.getMonth()+1);
        }
        else{
            mesFechaNacimiento = fechaNacimiento.getMonth()+1;
        }

        if (fechaNacimiento.getDate()<10) 
        {
            diaFechaNacimiento = "0" + (fechaNacimiento.getDate());
        }
        else{
            diaFechaNacimiento = fechaNacimiento.getDate();
        }
        $scope.fechadenac = fechaNacimiento.getFullYear();
        fechanac = diaFechaNacimiento + "/" + mesFechaNacimiento + "/" + fechaNacimiento.getFullYear();
    } else {
        fechanac = "__/__/____";
    }

   if (datos.dtspsl_tipo_persona == "NATURAL")
    $scope.titulo = "Ciudadano: " + datos.dtspsl_nombres + " " + datos.dtspsl_paterno + " " + datos.dtspsl_materno + " " + ", Fecha de Nacimiento: " +  fechanac;
else
    $scope.titulo = "Empresa: " + datos.dtspsl_razon_social + " " + ", NIT: " + datos.dtspsl_nit + ", Representante Legal: "  + datos.dtspsl_representante;
};

$scope.renderHtml = function(html_code) {
    return $sce.trustAsHtml(html_code);
}

$scope.body = "";
$scope.verOpciones2 = function (dato, datos) {
    $scope.opciones = null;
    $scope.formCambioPin = null;
    $scope.regMedico = null;
    $scope.formActivacionDigital = null;
    $scope.opciones2 = "mostrar";
    var parametros = {
        "table_name":"_servicio_div"
    };
    $scope.body = ' <div class="container"> ' +
    ' <ul class="mainnav"> ';
    DreamFactory.api[CONFIG.SERVICE].getRecordsByPost(parametros).success(function (results){
        if(results.record.length > 0){
            $scope.aEstadoCivil = results.record;
            angular.forEach(results.record,function(celda, fila){
                $scope.body = $scope.body + ' <li ><a href="#/' + celda.serdv_url + '" style="color:#249FE6"><i class="fa fa-tasks"></i><span> SERVICIO ' + celda.serdv_servicio + '</span></a></li> ';
            });
                //$scope.body = $scope.body + ' <li ><a ng-click="volverOpciones()" style="color:#249FE6"><i class="fa fa-reply"></i><span> Volver</span></a></li> ';
                $scope.body = $scope.body + '</ul>' +
                '</div>';
            }else{
                $scope.msg = "Error !!";
            }
        }).error(function(results){
        });
    };

    $scope.volverOpciones = function () {
        $scope.opciones = "mostrar";
        $scope.opciones2 = null;
        $scope.template = "";
    };

    $scope.cambioPin = function (datos) {
        console.log(' cambioPin ',datos);
        $scope.msg = "Procesando";
        $scope.formCambioPin = "ingresando";
        $scope.regMedico = null;
        $scope.formActivacionDigital = null;
        $scope.modRegistro = null;
        $scope.prsCI = datos["dtspsl_ci"];
        $scope.pin = datos["dtspsl_pin"];
        $scope.correo = datos["dtspsl_correo"];
        $scope.id = datos["_id"];
        $scope.opciones2 = null;
        $scope.template = "";
    };
    $scope.salud = function (datos) {
        console.log(' salud===>> ',datos);
       
    };
    $scope.copiarPin = function () {
        $scope.prsPinA = $scope.pin;
        $scope.restaurarPin2();
    };
    $scope.imprimirPin = function () {  
        if ($scope.datos.dtspsl_zona_desc)
            zona = $scope.datos.dtspsl_zona_desc.trim();
        else 
            zona = "";
        if ($scope.datos.dtspsl_correo)
            email = $scope.datos.dtspsl_correo.trim();
        else 
            email = "";
        if ($scope.datos.dtspsl_fec_nacimiento) {
            var fechaNacimiento = new Date($scope.datos.dtspsl_fec_nacimiento);
            var mesFechaNacimiento = "";
            var diaFechaNacimiento = "";
            if (fechaNacimiento.getMonth()<9 ) 
            {
                mesFechaNacimiento = "0" + (fechaNacimiento.getMonth()+1);
            }
            else{
                mesFechaNacimiento = fechaNacimiento.getMonth()+1;
            }

            if (fechaNacimiento.getDate()<10) 
            {
                diaFechaNacimiento = "0" + (fechaNacimiento.getDate());
            }
            else{
                diaFechaNacimiento = fechaNacimiento.getDate();
            }
            fecnac = diaFechaNacimiento + "/" + mesFechaNacimiento + "/" + fechaNacimiento.getFullYear();
        } else {
            fecnac = "__/__/____";
        }
        if ($scope.datos.dtspsl_nombres)
            nombre =$scope.datos.dtspsl_nombres.trim();
        else
            nombre = "";

        if ($scope.datos.dtspsl_paterno)
            appat =$scope.datos.dtspsl_paterno.trim();
        else
            appat = "";

        if ($scope.datos.dtspsl_materno)
            apmat =$scope.datos.dtspsl_materno.trim();
        else
            apmat = "";

        if ($scope.datos.dtspsl_registrado)
            regis =$scope.datos.dtspsl_registrado.trim();
        else
            regis = "";

        if ($scope.datos.dtspsl_movil)
            movil =$scope.datos.dtspsl_movil.trim();
        else
            movil = "";

        if ($scope.datos.dtspsl_materno)
            apmat =$scope.datos.dtspsl_materno.trim();
        else
            apmat = "";
        var  printContents =  '<div align="center">' +
        '<table width="98%" border="0" cellspacing="0" cellpadding="0">' +
        '<tr>' +
        '<td><div align="center"><img src="../../libs/img/logo.jpg" height="50" /></div></td>' +
        '<td><p align="center"><span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; ">Gobierno Autónomo Municipal de La Paz</span><br>' +
        '<span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; ">Secretaría Ejecutiva Municipal</span><br>' +
        '<span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; ">Dirección de Gobierno Electrónico y  Modernización de la Gestión</span></p>' +
        '</td>' +
        '<td><div align="center"><img src="../../libs/img/logo.png" alt="" height="50" /></div></td>' +
        '</tr>' +
        '</table>' +
        '</div> ' +
        '<div align="center"><span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; text-decoration: underline;"> Plataforma de Gobierno Electronico Innovador - iGob 24/7 </span></div> ' +
        '<div align="center"><span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; text-decoration: underline;"> Respaldo de Copia: Gestor de Servicios </span></div> ' +
        '<table width="98%" border="0" align="center" cellpadding="1" cellspacing="0"><tr>' +
        '<td>' +
        '<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td colspan="3" class="titulo">&nbsp;</td></tr> ' +
        '<tr><td colspan="3" style="font-family:Arial; font-size:12px; color:#666; font-style:normal; "> Estimado <b> '+ nombre + ' ' + appat + ' ' + apmat + ' </b>, gracias por utilizar nuestra plataforma virtual de servicios del Gobierno Autónomo Municipal de La Paz, favor tomar nota de la siguiente información: </td></tr>' +
        '<tr>' +
        '<td><center><table border="1" cellpadding="0" cellspacing="0" style="font-family:Arial; font-size:11px; color:#333;"><tr><td>Fecha y hora de registro:</td><td> '+ regis +' </td></tr> ' +  
        '<tr border="1"><td>Correo Electrónico:</td><td> '+ email +' </td></tr> ' +  
        '<tr><td>Nombre Completo:</td><td>' + nombre + ' ' + appat + ' ' + apmat + '</td></tr> ' +  
        '<tr><td>Fecha de Nacimiento:</td><td> '+ fecnac +' </td></tr> ' +  
        '<tr><td>Número de Celular: </td><td> '+ movil +' </td></tr> '  +
        '<tr><td>Zona:</td><td> '+ zona +' </td></tr></table></center></td></tr> '  +
        '<tr><td colspan="3">&nbsp;</td></tr><tr>'  +
        '<td colspan="3" style="text-align: justify; font-family:Arial; font-size:12px; color:#666; "><p>Con esta opción tiene acceso a todas las solicitudes de servicios en línea del Gobierno Autónomo Municipal de La Paz.</p>'  + 
        '<p><span style="text-align: justify; font-family:Arial; font-size:10px; color:#666; ">Mediante la utilización de nuestros Servicios usted está aceptando estas condiciones. Por favor, léalas detenidamente.</span></p>'  + 
        '<p><span style="text-align: justify; font-family:Arial; font-size:10px; color:#666;"><b>Condiciones de uso:</b> - No utilice nuestros Servicios de forma indebida. - El uso de nuestros Servicios otorga derecho de propiedad intelectual. - En relación con su uso de los Servicios, podremos enviarle anuncios del servicio, mensajes administrativos y otra información. Usted podrá rechazar algunas de dichas comunicaciones. - Algunos de nuestros Servicios están disponibles en dispositivos móviles. No utilice estos Servicios de un modo que pueda distraerlo y que le impida cumplir con las leyes de tránsito o seguridad. - Es necesario crear una cuenta para utilizar nuestros servicios</span></p>'  + 
        '<p><span style="text-align: justify; font-family:Arial; font-size:10px; color:#666;"><b>Consideraciones de seguridad:</b> Con el fin de precautelar la seguridad de su información recomendamos las siguientes medidas de seguridad: - Su clave secreta PIN es personal e intransferible. - No permita que terceros lean el mensaje electrónico y/o documento impreso conteniendo su usuario y PIN. - Memorice el usuario y PIN asignados. - Cambie con cierta frecuencia su PIN. - Recuerde cerrar sesión cada vez que termine sus tareas en la Plataforma.</span></p></td></tr>'  + 
        '<tr>' +
        '<td colspan="3" style="text-align: justify; font-family:Arial; font-size:10px; color:#666; ">&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td></tr>' +
        '<tr><td colspan="3">&nbsp;</td></tr><tr><td colspan="3" style="text-align: justify; font-family:Arial; font-size:12px; color:#666; "><center>Firma Gestor de Servicios &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma Ciudadano</center> </td></tr>' +
        '<tr><td colspan="3">&nbsp;</td></tr></table></td>' +
        '</tr></table><table width="98%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td align="center" style="font-family:Arial; font-size:7px; color:#333;">Para mayor información comuníquese con nuestras Plataformas de Atención Ciudadana (265 1446, 265 1447, 265 1448, 265 1449, línea gratuita 800 13 5555 o al correo electrónico 247ciudadano@lapaz.bo). La información de este correo electrónico es confidencial y se remite a la dirección de correo dispuesto y administrado por el Ciudadano, quedando el Gobierno Autónomo Municipal de La Paz, liberado de toda responsabilidad.</td></tr></table> ' +
        '<center><hr></center></div>'+

        '<div align="center">' +
        '<table width="98%" border="0" cellspacing="0" cellpadding="0">' +
        '<tr>' +
        '<td><div align="center"><img src="../../libs/img/logo.jpg" height="50" /></div></td>' +
        '<td><p align="center"><span style="font-family:Arial; font-size:14px; color:#666; font-style:italic;">Gobierno Autónomo Municipal de La Paz</span><br>' +
        '<span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; ">Secretaría Ejecutiva Municipal</span><br>' +
        '<span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; ">Dirección de Gobierno Electrónico y  Modernización de la Gestión</span></p>' +
        '</td>' +
        '<td><div align="center"><img src="../../libs/img/logo.png" alt="" height="50" /></div></td>' +
        '</tr>' +
        '</table>' +
        '</div> ' +
        '<div align="center"><span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; text-decoration: underline;"> Plataforma de Gobierno Electronico Innovador - iGob 24/7 </span></div> ' +
        '<div align="center"><span style="font-family:Arial; font-size:14px; color:#666; font-style:italic; text-decoration: underline;"> Respaldo de Copia: Ciudadano </span></div> ' +
        '<table width="98%" border="0" align="center" cellpadding="1" cellspacing="0"><tr>' +
        '<td>' +
        '<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td colspan="3" class="titulo">&nbsp;</td></tr> ' +
        '<tr><td colspan="3" style="font-family:Arial; font-size:12px; color:#666; font-style:normal;"> Estimado <b>'+ nombre + ' ' + appat + ' ' + apmat + '</b>, gracias por utilizar nuestra plataforma virtual de servicios del Gobierno Autónomo Municipal de La Paz, favor tomar nota de la siguiente información: </td></tr>' +
        '<tr>' +
        '<td><center><table border="1" cellpadding="0" cellspacing="0" style="font-family:Arial; font-size:11px; color:#333;"><tr><td>Fecha y hora de registro:</td><td> '+ regis +' </td></tr> ' +  
        '<tr border="1"><td>*Usuario:</td><td>' + $scope.datos.dtspsl_ci + '</td></tr>' +
        '<tr border="1"><td>*Número de PIN (clave secreta):</td><td>' + $scope.datos.dtspsl_pin + '</td></tr>' +
        '<tr border="1"><td>Correo Electrónico:</td><td> '+ email +' </td></tr> ' +  
        '<tr><td>Nombre Completo:</td><td>' + nombre + ' ' + appat + ' ' + apmat +  '</td></tr> ' +  
        '<tr><td>Fecha de Nacimiento:</td><td> '+ fecnac +' </td></tr> ' +  
        '<tr><td>Número de Celular: </td><td> '+ movil +' </td></tr> '  +
        '<tr><td>Zona:</td><td> '+ zona +' </td></tr></table></center></td></tr> '  +
        '<tr style="font-family:Arial; font-size:11px; color:#333;"><td><center>* Datos de usuario y PIN son otorgados únicamente al Ciudadano.</center></td></tr>'+
        '<tr><td colspan="3">&nbsp;</td></tr><tr>'  +
        '<td colspan="3" style="text-align: justify; font-family:Arial; font-size:12px; color:#666; "><p>Con esta opción tiene acceso a todas las solicitudes de servicios en línea del Gobierno Autónomo Municipal de La Paz.</p>'  + 
        '<p><span style="text-align: justify; font-family:Arial; font-size:10px; color:#666; ">Mediante la utilización de nuestros Servicios usted está aceptando estas condiciones. Por favor, léalas detenidamente.</span></p>'  + 
        '<p><span style="text-align: justify; font-family:Arial; font-size:10px; color:#666;"><b>Condiciones de uso:</b> - No utilice nuestros Servicios de forma indebida. - El uso de nuestros Servicios otorga derecho de propiedad intelectual. - En relación con su uso de los Servicios, podremos enviarle anuncios del servicio, mensajes administrativos y otra información. Usted podrá rechazar algunas de dichas comunicaciones. - Algunos de nuestros Servicios están disponibles en dispositivos móviles. No utilice estos Servicios de un modo que pueda distraerlo y que le impida cumplir con las leyes de tránsito o seguridad. - Es necesario crear una cuenta para utilizar nuestros servicios</span></p>'  + 
        '<p><span style="text-align: justify; font-family:Arial; font-size:10px; color:#666;"><b>Consideraciones de seguridad:</b> Con el fin de precautelar la seguridad de su información recomendamos las siguientes medidas de seguridad: - Su clave secreta PIN es personal e intransferible. - No permita que terceros lean el mensaje electrónico y/o documento impreso conteniendo su usuario y PIN. - Memorice el usuario y PIN asignados. - Cambie con cierta frecuencia su PIN. - Recuerde cerrar sesión cada vez que termine sus tareas en la Plataforma.</span></p></td></tr>'  + 
        '<tr>' +
        '<td colspan="3" style="text-align: justify; font-family:Arial; font-size:10px; color:#666; ">&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td></tr>' +
        '<tr><td>&nbsp;</td></tr>' +
        '<tr><td colspan="3">&nbsp;</td></tr><tr><td colspan="3" style="text-align: justify; font-family:Arial; font-size:12px; color:#666; "><center>Firma Gestor de Servicios &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Firma Ciudadano</center> </td></tr>' +
        '<tr><td colspan="3">&nbsp;</td></tr></table></td>' +
        '</tr></table><table width="98%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td align="center" style="font-family:Arial; font-size:7px; color:#333;">Para mayor información comuníquese con nuestras Plataformas de Atención Ciudadana (265 1446, 265 1447, 265 1448, 265 1449, línea gratuita 800 13 5555 o al correo electrónico 247ciudadano@lapaz.bo). La información de este correo electrónico es confidencial y se remite a la dirección de correo dispuesto y administrado por el Ciudadano, quedando el Gobierno Autónomo Municipal de La Paz, liberado de toda responsabilidad.</td></tr></table> ';



        var popupWin = window.open('', '_blank', 'width=800,height=550');
        popupWin.document.open()
        popupWin.document.write('<html><head></head><body onload="window.print()">' + printContents + '<br><br></html>');
        popupWin.document.close();
    };

    $scope.restaurarPin2 = function (datosCambioPin, prsCI, correo, prsPinA) {
        sNumeroAleatorio = Math.round(Math.random()*100000) + $scope.datos.dtspsl_ci;
        var restauraPin = new rcNatural();
        restauraPin.pinNuevo = sNumeroAleatorio;
        restauraPin.pinAnterior = $scope.pin;
        restauraPin.oid = $scope.datos._id;
        restauraPin.modificarCambioPinNatural(function(resultado){
            resultadoApi = JSON.parse(resultado);
            //sweet.show('', 'Actualizacion correcta', 'success'); 
            var mensajeLog = "se restauró el Pin de la persona con CI. "+$scope.datos.dtspsl_ci;
            registroLog.almacenarLog(sessionService.get('IDUSUARIO'),$rootScope.vid,0, mensajeLog);
            var detalleMensaje  = "Su nuevo número de PIN : " + sNumeroAleatorio;
            var sCiudadano = $scope.datos.dtspsl_nombres;
            var mensajeExito = "Su PIN fue restaurado ";
            var sCorreo = $scope.datos.dtspsl_correo;
            vAsunto = "Cambio_de_PIN_GAMLP";
            vMensaje = "Usted_solicito,_Cambio_de_PIN.";
            if($scope.datos.dtspsl_correo != "" && $scope.datos.dtspsl_correo != " "){
                $scope.envioMensaje(detalleMensaje, mensajeExito, sCorreo, sCiudadano);
            }
            else{
                sweet.show('', mensajeExito+"\nla persona no posee correo electronico, por favor imprima el numero de pin", 'success');
            }
            var buscarCiudadano = new rcNatural();
            buscarCiudadano.ci = $scope.datos.dtspsl_ci;
            buscarCiudadano.tipo_persona = $scope.datos.dtspsl_tipo_persona;
            buscarCiudadano.buscarPersona(function(resultado){
                resultadoApi = JSON.parse(resultado);
                if(resultadoApi.length > 0){
                    $scope.datos = resultadoApi[0];
                } else {
                    console.log(error);
                    
                }      
                $.unblockUI();  
            }); 

            $.unblockUI();  
        }); 
    };

    $scope.restaurarPin = function (datosCambioPin, prsCI, correo, prsPinA) {
        if (datosCambioPin.prsPinN == datosCambioPin.prsPinC) {
            var parametros = {
                     "table_name":"ciudadanos",
                     "id": $scope.id,
                "fields": 'dtspsl_ci,dtspsl_pin'
            }; 
            DreamFactory.api[CONFIG.SERVICEMONGO].getRecord(parametros).success(function (results){
                console.log(results,"resuiltado",$scope.id);
                if(results.dtspsl_ci == prsCI && results.dtspsl_pin == prsPinA){
                    var parametross = {
                             "table_name":"ciudadanos",
                             "body":{
                                     "record": {
                                         "dtspsl_pin": datosCambioPin.prsPinC
                                     }
                             },
                             "ids": $scope.id
                    }; 
                    var ss =  DreamFactory.api[CONFIG.SERVICEMONGO].updateRecordsByIds(parametross).success(function (results){
                        sweet.show('', 'Actualizacion correcta', 'success'); 
                        registroLog.almacenarLog(sessionService.get('IDUSUARIO'),$rootScope.vid,0, "se modifico el Pin");
                        $scope.envioMensaje(datosCambioPin.prsPinN, correo);
                        $scope.datosCambioPin='';
                        $scope.prsPinA = '';
                        $scope.pin = datosCambioPin.prsPinC;
                    });
                    ss.error(function(results){
                             alert("error");
                    });
                }else{
                    sweet.show('', 'Verifique su PIN Anterior', 'warning');
                }
            }).error(function(results){
                     alert("error");
            });
        } else {
            sweet.show('', "No Concuerdan Pin Nuevo y su Confirmacion", 'error');

        }
    };
    $scope.envioMensaje = function(mensajeCorreo, mensajeAlerta, email, ciudadano){
            var sMensajeValidacion = mensajeCorreo.replace(/ /g, "_");
               var parametros = {
                    "cuerpo" : sMensajeValidacion,
        "asunto" : vAsunto,
                    "para" : email,
                    "ciudadano" : ciudadano,
        "mensaje": vMensaje
            }
            $.ajax({ 
                    data: parametros, 
                    url: 'http://gmlpsr0179:9090/smsemail/email/mail.php',
                    type: 'get', 
                    beforeSend: function () { 
                    }, 
                    success: function (response) { 
                                console.log(response); 
                    }
            }); 
        sweet.show('', mensajeAlerta, 'success'); 
    };

    ////////// cambio de bloqueado a desbloqueado
    $scope.cambioEstado = function (datos) {
        $scope.formCambioPin = null;
        $scope.regMedico = null;
        $scope.formActivacionDigital = null;
        var misDatos = {
            "procedure_name":"spcambioestado",
            "body":{
                "params": [
                {
                    "name": "id",
                    "value": datos._id
                },
                {
                    "name": "sestado",
                    "value": datos.vestado_activacion
                }
                ]
            }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos);
        obj.success(function (results){
            if(results.length > 0){
                if(results[0].spcambioestado=='BLOQUEADO'){
                    datos.icono='fa fa-lock fa-lg';
                    datos.vestado_activacion=results[0].spcambioestado;
                    registroLog.almacenarLog(sessionService.get('IDUSUARIO'), sessionService.get('IDSOLICITANTE'), 0, "Bloqueo del ciudadano");
                }
                else{
                    datos.icono='fa fa-unlock fa-lg';
                    datos.vestado_activacion=results[0].spcambioestado;
                    registroLog.almacenarLog(sessionService.get('IDUSUARIO'), sessionService.get('IDSOLICITANTE'), 0, "Desbloqueo del ciudadano");
                }
                $scope.dataP = [datos];
                sweet.show('', "Ciudadano " + results[0].spcambioestado, 'success');
            } else {
             sweet.show('', "Error ", 'error');
         }
     })
        obj.error(function(results){
        });
    };
    ////////// Activacion Fisica del ciudadano
    $scope.activacionFisica = function (datos) {
        console.log(datos);
        if (datos.dtspsl_activacionf=="NO") {
            var activacionf = new rcNatural();
            activacionf.oid = datos._id;
            activacionf.activacionFisica(function(resultado){
                console.log(resultado);
                resultadoApi = JSON.parse(resultado);
                console.log(resultadoApi);
                if(resultadoApi){
                    if(datos.dtspsl_activacionf=='NO'){
                        datos.iconoAF='fa fa-thumbs-o-up fa-lg';
                        datos.dtspsl_activacionf = 'SI';
                    } else {
                        datos.iconoAF='fa fa-thumbs-o-down fa-lg';
                        datos.dtspsl_activacionf = 'SI';
                    }
                    $scope.dataP = [datos];
                    sweet.show('', "Ciudadano Activado");
                    registroLog.almacenarLog(sessionService.get('IDUSUARIO'), sessionService.get('IDSOLICITANTE'), 0, "Activación física del ciudadano");
                    console.log("activacion digital es: ", datos.dtspsl_activaciond);
                    if (datos.dtspsl_activaciond=="SI") {
                        var detalleMensaje  = "Su activación a sido existosa";
                        var sCiudadano = datos.dtspsl_nombres;
                        var mensajeExito = "Se envio mensaje correctamente";
                        var sCorreo = datos.dtspsl_correo;
                        vAsunto = "Habilitación_Nivel_2";
                        vMensaje = "Con_esta_opción_tiene_acceso_a_todas_las_solicitudes_de_servicios_en_línea_del_Gobierno_Autónomo_Municipal_de_La_Paz.";
                        $scope.envioMensaje(detalleMensaje, mensajeExito, sCorreo, sCiudadano);
                    }

                } else {
                    sweet.show('', "No existen ninguno ciudadano", 'error');
                }
                $.unblockUI();  
                $('#formModal').modal('hide');
            });           

        } else {
            sweet.show('', "Ciudadano activo");
            $scope.formCambioPin = null;
            $scope.regMedico = null;
            $scope.formActivacionDigital = null;
        }
    };
    ////fin activacion Fisica
    ////////// Activacion Digital del ciudadano
    $scope.frmactivacionDigital = function (datos) {
        $scope.template = '';
        if (datos.dtspsl_activaciond == "NO") {
            $scope.formCambioPin = null;
            $scope.regMedico = null;
            $scope.modRegistro = null;
            $scope.formActivacionDigital = "mostrar" ;
            $scope.prsCIAD = datos.dtspsl_ci;
            $scope.idCiudadano = datos._id;
            $scope.estadoActivacion = datos.dtspsl_activaciond;
        } else {
            sweet.show('', "Ciudadano activo");
            $scope.formCambioPin = null;
            $scope.regMedico = null;
            $scope.formActivacionDigital = null;
        }
    };
    $scope.activacionDigital = function (idCiudadano, estadoActivacion, prsCIAD, pinActivacion) {
        var activaciond = new rcNatural();
        activaciond.oid = idCiudadano;
        activaciond.pin = pinActivacion;
        activaciond.activacionDigital(function(resultado){
            console.log(resultado);
            resultadoApi = JSON.parse(resultado);
            console.log(resultadoApi);
            if(resultadoApi){
                registroLog.almacenarLog(sessionService.get('IDUSUARIO'), sessionService.get('IDSOLICITANTE'), 0, "Activación digital del ciudadano");
                $scope.iconoAD='fa fa-thumbs-o-up fa-lg';
                datos = $scope.dataP;
                datos[0]["dtspsl_activaciond"] = "SI";
                $scope.dataP= datos;
                $scope.formActivacionDigital = null;
                if (datos[0]["dtspsl_activacionf"]=="SI") {
                    var detalleMensaje  = "Su activación a sido existosa";
                    var sCiudadano = datos[0]["dtspsl_nombres"];
                    var mensajeExito = "Se envio mensaje correctamente";
                    var sCorreo = datos[0]["dtspsl_correo"];
                    vAsunto = "Habilitación_Nivel_2";
                    vMensaje = "Con_esta_opción_tiene_acceso_a_todas_las_solicitudes_de_servicios_en_línea_del_Gobierno_Autónomo_Municipal_de_La_Paz.";
                    $scope.envioMensaje(detalleMensaje, mensajeExito, sCorreo, sCiudadano);
                }

            } else {
                sweet.show('', "No existen ninguno ciudadano", 'error');
            }
            $.unblockUI();  
            $('#formModal').modal('hide');
        }); 

    };
    ////fin activacion Fisica
    $scope.restaurarBusqueda = function(){
        $scope.tablaCiudadanos = null;
        $scope.nuevaBusqueda = null;
        $scope.opciones = null;
        $scope.opciones2 = null;
        $scope.desabilitado = null;
        $scope.datos = null;
        $scope.formCambioPin = null;
        $scope.regMedico = null;
        $scope.formActivacionDigital = null;
        $scope.modRegistro = null;
        $scope.nuevaBusqueda = null;
        $scope.nuevaBusquedaJ = null;
        $scope.frmPersonaNatural = "mostrar";
        $scope.frmPersonaJuridica = "mostrar";
        idCiu = "78";
        sessionService.destroy("IDSOLICITANTE");

        $scope.template = "";
    }
    //verifica si el CI ah sido modificado para volver a ser validado
    $scope.ciVerificarModificado=function(response){
        if($scope.mostrarNumComplemento)
            var ci1=response.cedula+"-"+response.complemento;
        else
            var ci1=response.cedula;

        if(ci1==$rootScope.ciMod){
            $scope.modificarRegistroCiudadano(response);
        }
        else{
            $("#abrir").click();
        }
    }
    //Buscar registro ciudadano por ci
    $scope.validarCiCiudadano = function(response){
        console.log("validar Ci");
        console.log(response);
        if($scope.mostrarNumComplemento)
            var ci1=response.cedula+"-"+response.complemento;
        else
            var ci1=response.cedula;
        if($scope.mostrarNumComplemento2)
            var ci2=response.cedula2+"-"+response.complemento2;
        else
            var ci2=response.cedula2;
        if(ci1==ci2)
        {
            response.cedula=ci1;
            $scope.modificarRegistroCiudadano(response);
            $("#cerrar").click();
            /*var misDatos = {
                "procedure_name":"spbuscarci",
                "body":{
                    "params": [
                        {
                            "name": "sci",
                            "value": response.cedula
                        }
                    ]
                }
            };
            DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (data){
                if(data.length > 0){
                    sweet.show('', "Este numero de CI ya fue registrado", 'error');
                } else {
                    $scope.modificarRegistroCiudadano(response);
                    $("#cerrar").click();
                }
            }).error(function(data){
            });*/
        }
        else{
            sweet.show('', "El número de ci es no concuerda con el anterior formulario ", 'warning');
        }
    }

    $rootScope._id = '';
    $rootScope.ciMod = '';
    var estcivil = "";
    var tipoPersonaModificar = "";
    $scope.modificarRegistroCiudadanoCargar = function(_id){
        console.log("_id",_id);
        tipoPersonaModificar = _id.vtipo_persona;
        if (_id.dtspsl_tipo_persona == 'NATURAL') {
            $rootScope._id = _id._id;
            //idCiu = _id._id;
            $scope.formCambioPin = null;
            $scope.regMedico = null;
            $scope.modRegistro = "ingresando";
            $scope.signupFormModificar="ingresando";
            $scope.formActivacionDigital = null ;
            $scope.aEstadoCivil = {};
            $rootScope.correo='';
            $rootScope.telefono='';
            $rootScope.celular='';
            $rootScope.direccion='';
            

            if($rootScope._id){
                var sIdRegistro = $rootScope._id;
                var resciudadanoMongo = {
                    "table_name":"ciudadanos",
                    "ids" : sIdRegistro
                };
                var obj=DreamFactory.api[CONFIG.SERVICEMONGO].getRecordsByIds(resciudadanoMongo);
                obj.success(function (results) {
                    //console.log(sessionService.get('IDCIUDADANO'));
                    var ciudadanomongo = results.record;
                    console.log(ciudadanomongo);
                    aRegistro.nombre = ciudadanomongo[0].dtspsl_nombres;
                    aRegistro.paterno = ciudadanomongo[0].dtspsl_materno;
                    aRegistro.materno = ciudadanomongo[0].dtspsl_paterno;
                    aRegistro.cedula = ciudadanomongo[0].dtspsl_ci;
                    aRegistro.estado_civil = ciudadanomongo[0].dtspsl_id_estado_civil;
                    console.log("estcivil",aRegistro.estado_civil);
                    aRegistro.ocupacion = ciudadanomongo[0].dtspsl_ocupacion;
                    aRegistro.celular = ciudadanomongo[0].dtspsl_movil;
                    aRegistro.telefono = ciudadanomongo[0].dtspsl_telefono;
                    aRegistro.correo = ciudadanomongo[0].dtspsl_correo;
                    aRegistro.direccion = ciudadanomongo[0].dtspsl_direccion;
                    aRegistro.fecha_nacimiento = ciudadanomongo[0].dtspsl_fec_nacimiento;
                    aRegistro.sexo = ciudadanomongo[0].dtspsl_sexo;


                    /*************** obtener estados civiles **********************/
                    $scope.getZonaMD();
                    var resCon= {
                        "table_name":"_bp_estados_civiles",
                        "filter":" estcivil_id = " +  aRegistro.estado_civil,
                        "order":"estcivil asc"
                    };
                    DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resCon)
                    .success(function (response) {
                        $scope.aEstadoCivil = response.record;
                        //console.log("$scope.aEstadoCivil",$scope.aEstadoCivil);
                    }).error(function(error) {
                        $scope.errors["error_uos"] = error;
                    });
                    /*var parametros = {
                        "procedure_name":"obtestadoscivil",
                        "body":{"params": [
                                    {
                                        "name": "idestcivil",
                                        "param_type":"IN",
                                        "value": aRegistro.cestcivil_id
                                    }
                        ]}
                    };
                    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros);
                    obj.success(function (response) {
                        $scope.aEstadoCivil = response;
                        //console.log("idestcivil",$scope.aEstadoCivil);
                    }).error(function(error) {
                        $scope.errors["error_uos"] = error;
                    });*/
                    /**************************************/
                });
            }
            $scope.registro = aRegistro;
        }
        else {
            $scope.formCambioPin = null;
            $scope.formCambioPin = null;
            $scope.regMedico = null;
            $scope.formActivacionDigital = null ;
            $scope.signupFormModificar=null;
            $scope.modRegistro = "ingresando";
            $scope.signupFormJuridicoModificar = "mostrar";
            $rootScope.correo='';
            $rootScope.telefono='';
            $rootScope.celular='';
            $rootScope.direccion='';
            $rootScope._id = _id._id;
            idCiu = _id._id;
            if($rootScope._id){
                var sIdRegistro = $rootScope._id;
                var parametros = {
                    "table_name":"ciudadanos",
                    "ids" : sIdRegistro
                };
                DreamFactory.api[CONFIG.SERVICEMONGO].getRecordsByIds(parametros).success(function (response){
                    var results=response.record;

                    if(results.length > 0){
                        aRegistro.nombre = results[0].dtspsl_nombres;
                        aRegistro.paterno = results[0].dtspsl_paterno;
                        aRegistro.materno = results[0].dtspsl_materno;
                        $rootScope.ciMod = results[0].dtspsl_ci;
                        var ciDuplicidad = results[0].dtspsl_ci.split('-');
                        if(ciDuplicidad[1])
                        {
                            aRegistro.cedula = ciDuplicidad[0];
                            aRegistro.complemento = ciDuplicidad[1];
                            $scope.mostrarNumComplemento=true;
                        }
                        else{
                            aRegistro.cedula = results[0].dtspsl_ci;
                            $scope.mostrarNumComplemento=false;
                        }
                        aRegistro.nroDocumento = results[0].dtspsl_nro_documento;
                        aRegistro.nroNotaria = results[0].dtspsl_nro_notaria;
                        aRegistro.repLegal = results[0].dtspsl_poder_replegal;
                        aRegistro.razonSocial = results[0].dtspsl_razon_social;
                        aRegistro.nit = results[0].dtspsl_nit;
                    }else{
                        $scope.msg = "Error !!";
                    }
                }).error(function(results){
                });
            }
            $scope.registro = aRegistro;
            //sweet.show('En construccion', "Formulario de persona Juridica", 'warning');
        }
    }
    /**************************/
     // $scope.idCiudadanito
    //idCiu = sessionService.set('IDSOLICITANTE',34);

    var idTramite = "";
    /*******************/
    var a = "";
    var b = "";
    /*************************/
    var nombreimagen= "";
    var idArchivo = "";
    var tipoPersona = "";
    var tipoDocumento = "";
    $scope.ciVerificarArchiv = function()
    {
        //a = datos._id;
        //console.log('_id.......',a);
        b = sessionService.get('IDSOLICITANTE');
        //idCiu = sessionService.set('IDSOLICITANTE',34);
        //console.log('IDSOLICITANTE......',b);
        idTramite = sessionService.get('IDSOLICITANTE');
        //console.log("idTramite",idTramite);
        var parametros = {
            "procedure_name":"archciudadanolst",
            "body":{
                "params": [
                {   "name": "idCiudadano",
                "value": sessionService.get('IDSOLICITANTE')
            },
            {
                "name": "proceso",
                "value": "imagenCiudadano"
            }
            ]
        }
    };
    DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (results){
        if(results.length > 0){
            idArchivo = results[0].crchidarchivo;
            nombreimagen = results[0].crchnombre;
            $scope.img_url = CONFIG.IMG_URL+ "/ciudadano/"+sessionService.get('IDSOLICITANTE');
            $scope.nombreimg = nombreimagen;
            existe = 0;
                    //console.log(" existe");
                } else {
                    existe = 1;
                    //console.log(" no existe");
                    $scope.nombreimg= "/ciudadano/im4g3nn0ne23133434290756564558453453460696847346.png";
                    $scope.img_url = CONFIG.IMG_URL;
                }
            }).error(function(data){
            });
        }
   // $scope.ciVerificarArchiv();

   /***************************/

   idCiu = sessionService.get("IDSOLICITANTE");

   var existeidArchivo = "";
    //$scope.img_url = CONFIG.IMG_URL+ "ciudadano/"+sessionService.get('IDSOLICITANTE');
    //alert(idCiu);

    $scope.img_ninguna=CONFIG.IMG_URL+"/uploads/im4g3nn0ne23133434290756564558453453460696847346.png";

    /************/

    var direccionURL=CONFIG.IMG_URL+"/ciudadano/"+idTramite;
    $scope.uploader = new FileUploader({
    });
    sessionService.destroy("IDSOLICITANTE");
    var uploader = $scope.uploader;
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
               // console.log("",uploader.filters);
               return this.queue.length <10;
           }
       });
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };

    uploader.onAfterAddingFile = function(fileItem) {

            //console.info('onAfterAddingFile', fileItem);
            //console.log(idTramite);
            //console.log("..............",idTramite);
            fileItem.url= CONFIG.UPLOAD_URL+"?desripcion=ciudadano&&idCiudadano="+idTramite; // direccionamiento para upload

            tipoDocumento = fileItem.file.type;
            var nameArray = tipoDocumento.split('/');
            tipoDocumento = nameArray[1];
            var count = 0;
            if(tipoDocumento == "png" || tipoDocumento == "jpg" || tipoDocumento == "jpeg")
            {
                $scope.botonSubirOriginal = null;
                $scope.botonSubirError = "oculta";
            }
            else
            {

                $scope.botonSubirError = null;
                $scope.botonSubirOriginal = "oculta";
            }
        };
        $scope.falla = function()
        {
            sweet.show('', "Tipo de archivo incorrecto elimine porfavor", 'error');
            $scope.desabilitado2=true;
        }
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
         console.info('onBeforeUploadItem', item);
     };
     uploader.onProgressItem = function(fileItem, progress) {
                    //console.info('onProgressItem', fileItem, progress);
                };
                uploader.onProgressAll = function(progress) {
                    //console.info('onProgressAll', progress);
                };
                var archivoUpload = "";
                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    //console.info('onSuccessItem', fileItem, response, status, headers
        //sweet.show('', "Imagen adjuntada con exito", 'success');
        archivoUpload =fileItem.file.name;
       // console.log(archivoUpload);
       direccionURL = direccionURL+"/"+archivoUpload;

   };
   uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
};
uploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
};
uploader.onCompleteItem = function(fileItem, response, status, headers) {
    console.info('onCompleteItem', fileItem, response, status, headers);
};
uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
};
uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
};
/*********************/
/**************************/
$scope.modificarRegistroCiudadano = function(response){
    console.log("modificarRegistroCiudadano",response);
    if (existe == 0) {
            //console.log("no hay ninguno");
            var archivoCiu = {};
            archivoCiu['crch_ciudadano_id'] = idCiu;
            archivoCiu['crch_proceso'] = "imagenCiudadano";
            archivoCiu['crch_actividad'] = "1";
            archivoCiu['crch_nombre'] = archivoUpload;
            archivoCiu['crch_direccion'] = direccionURL;
            archivoCiu['crch_registrado'] = fechactual;
            archivoCiu['crch_modificado'] = fechactual;
            archivoCiu['cnt_id_usuario'] = sessionService.get('IDUSUARIO');
            var parametros = {"table_name":"_ciudadano_archivos",
            "body":archivoCiu,
            "id" : idArchivo};
            var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(parametros);
                //$scope.ciVerificarArchiv();
                //sweet.show('', 'Registro Insertado', 'success');
                //$route.reload();
            }
            else{
                var parametros = {
                    "table_name":"_ciudadano_archivos",
                    "body":{
                        "record": [
                        {
                            "crch_ciudadano_id": idCiu,
                            "crch_proceso": "imagenCiudadano",
                            "crch_actividad": "1",
                            "crch_nombre": archivoUpload,
                            "crch_tamano": "mb",
                            "crch_direccion": direccionURL,
                            "crch_registrado": fechactual,
                            "crch_modificado": fechactual,
                            "crch_estado": "A",
                            "crch_id_usuario": "1"
                        }
                        ]
                    }
                };
                DreamFactory.api[CONFIG.SERVICE].createRecords(parametros).success(function (results){
                    //$scope.ciVerificarArchiv();
                    //if(results.record.length > 0){
                      //sweet.show('', "Registro Insertado", 'success');
                     //$route.reload();
                        //$scope.ciVerificarArchiv();
                        //$scope.CiudadanoMongo();

                    /*}else{
                       sweet.show('', "Registro no insertado", 'error');
                   }    */
               }).error(function(results){
               });
           }
        /*if (tipoPersona == "J") {
            estcivil = 1;
        }
        else
        {
            estcivil = response.estado_civil;
        }*/
        //console.log("natural");

        var parametros = {
            "table_name":"ciudadanos",
            "body":{
                "record": {
                    "dtspsl_id_estado_civil": response.cestcivil_id,
                    "dtspsl_id_tp_registro": "1",
                    "dtspsl_ci": response.cedula,
                    "dtspsl_ocupacion": response.ocupacion,
                    "dtspsl_nombres": response.nombre,
                    "dtspsl_paterno": response.paterno,
                    "dtspsl_materno": response.materno,
                    "dtspsl_direccion": response.direccion,
                    "dtspsl_correo": response.correo,
                    "dtspsl_telefono": response.telefono,
                    "dtspsl_movil": response.celular,
                    "dtspsl_sexo": response.sexo,
                    "dtspsl_fec_nacimiento": response.fecha_nacimiento,
                    "dtspsl_usr_id": "1",
                    "dtspsl_modificado": fechactual,
                    "dtspsl_poder_replegal": response.repLegal,
                    "dtspsl_nro_documento": response.nroDocumento,
                    "dtspsl_nro_notaria": response.nroNotaria,
                    "dtspsl_razon_social": response.razonSocial,
                    "dtspsl_nit": response.nit
                }
            },
            "ids": $rootScope._id
        };
        DreamFactory.api[CONFIG.SERVICEMONGO].updateRecordsByIds(parametros).success(function (results){
                console.log("=======>:",results);
                //alert("registro modificado");
                sweet.show('', "Registro modificado", 'success');
                $scope.ciVerificarArchiv();
                //$route.reload();
                //$location.path("#/registro_ciudadano|modificarRegistro");
            }).error(function(results){
                sweet.show('', "Registro no modificado", 'error');

            });

            /*if($rootScope.direccion!=response.direccion)
            {
                var parametros = {
                    "table_name":"_bp_datos_direccion",
                    "body":{
                        "dtsdrc_direccion": response.direccion,
                        "dtsdrc_id_zona": '1', //deberiamos poder filtrar
                        "dtsdrc_id_dtspesonales": $rootScope.vid,
                        "dtsdrc_usr_id": '1',
                        "dtsdrc_registrado" : "2015-06-05",
                        "dtsdrc_modificado" : "2015-06-05"
                    }
                };
                DreamFactory.api[CONFIG.SERVICE].createRecords(parametros);
            }*/
            /*if($rootScope.telefono!=response.telefono)
            {
                var parametros = {
                    "table_name":"_bp_datos_comunicacion",
                    "body":{
                        "dtscmc_id_dtspersonal": $rootScope.vid,
                        "dtscmc_id_tpcomunicacion": '2',
                        "dtscmc_validacion": 'NO',
                        "dtscmc_usr_id": '1',
                        "dtscmc_referencia": response.telefono,
                        "dtscmc_registrado" : "2015-06-05",
                        "dtscmc_modificado" : "2015-06-05"
                    }
                };
                DreamFactory.api[CONFIG.SERVICE].createRecords(parametros);
            }*/
            /*if($rootScope.celular!=response.celular)
            {
                var parametros = {
                    "table_name":"_bp_datos_comunicacion",
                    "body":{
                        "dtscmc_id_dtspersonal": $rootScope.vid,
                        "dtscmc_id_tpcomunicacion": '3',
                        "dtscmc_validacion": 'NO',
                        "dtscmc_usr_id": '1',
                        "dtscmc_referencia": response.celular,
                        "dtscmc_registrado" : "2015-06-05",
                        "dtscmc_modificado" : "2015-06-05"
                    }
                };
                DreamFactory.api[CONFIG.SERVICE].createRecords(parametros);
            }*/
            /*if($rootScope.correo!=response.correo)
            {
                var parametros = {
                    "table_name":"_bp_datos_comunicacion",
                    "body":{
                        "dtscmc_id_dtspersonal": $rootScope.vid,
                        "dtscmc_id_tpcomunicacion": '1',
                        "dtscmc_validacion": 'NO',
                        "dtscmc_usr_id": '1',
                        "dtscmc_referencia": response.correo,
                        "dtscmc_registrado" : "2015-06-05",
                        "dtscmc_modificado" : "2015-06-05"
                    }
                };
                DreamFactory.api[CONFIG.SERVICE].createRecords(parametros);
            }*/
            /*var parametros = {
                        "procedure_name":"archciudadanolst",
                        "body":{
                            "params": [
                            {   "name": "idCiudadano",
                                "value": idCiu
                            },
                            {
                                "name": "proceso",
                                "value": "imagenCiudadano"
                            }
                            ]
                        }
                };
                      DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function (results){
                            if(results.length > 0){
                                idArchivo = results[0].crchnombre;

                            } else {


                            }
                        }).error(function(data){
                        });*/
           //registroLog.almacenarLog(4,$rootScope.vid,0, " Se Modifico los datos personales " );

            //$route.reload();
            /**********************************************/
            //$scope.ciVerificarArchiv();
        };
    // llamado a las zona - machositrito - distrito
    $scope.getZonaMD = function() {
        $scope.aZonaMD = {};
        var parametros = {
            "procedure_name": "lstzonamacrodistritos"
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros).success(function(response) {
            if (response.length > 0) {
                $scope.aZonaMD = response;
                //console.log("$scope.aZonaMD",$scope.aZonaMD);
            } else {
                $scope.aZonaMD = "";
            }
        }).error(function(response) {});
    };
    // actualiza los datos de macrodistrito y distrito
    $scope.actualizaZonaMD = function(dato) {
        //$.blockUI();
        //lstmacrodistritos(IN idz integer )
        var resproductos = {
            "procedure_name":"lstmacrodistritos",
            "body":{"params": [{"name":"idz","param_type":"IN","value":dato}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resproductos);
        obj.success(function (data) {
            $scope.macrod = data;
            //console.log("$scope.macrod",$scope.macrod);
            $rootScope.txtMacrodistritoDistrito = $scope.macrod[0].ymdst_macrodistrito;
            $rootScope.idMacrodistritoDistrito = $scope.macrod[0].yzona_mdst_id;
            $scope.registro['zona_mdst_id'] = $scope.macrod[0].yzona_mdst_id;

            $rootScope.txtDistrito = $scope.macrod[0].ydst_distrito;
            $rootScope.idDistrito = $scope.macrod[0].yzona_dst_id;
            $scope.registro['yzona_dst_id'] = $scope.macrod[0].yzona_dst_id;

            //console.log($rootScope.txtMacrodistritoDistrito +"> "+ $rootScope.idMacrodistritoDistrito +"> "+ $rootScope.txtDistrito +"> "+ $rootScope.idDistrito);
            $.unblockUI();
        })
        obj.error(function(error) {
            $scope.errors["error_usuarios"] = error;
        });
    };

    //************** mapa
    /*var latitud = 0;
    var longitud = 0;
    var activarClick = false;
    var versionUrl = "";
    var markerToClose = null;
    var dynamicMarkers;

    google.maps.visualRefresh = true;

    $http.get(versionUrl).success(function (data) {
        if (!data)
            console.error("no version object found!!");
        $scope.version = data.version;
    });*/

    /*------------------------------------------------------------------------------------------------------------------*/
    /*------------------------------------------------- MAPA PRINCIPAL -------------------------------------------------*/
    /*------------------------------------------------------------------------------------------------------------------*/
    /*angular.extend($scope, {
        map: {
            control: {},
            center: {
                latitude: -16.495833,
                longitude: -68.133749
            },
            options: {
                streetViewControl: false,
                panControl: true,
                maxZoom: 20,
                minZoom: 3
            },
            zoom: 16,
            events: {
                tilesloaded: function (map, eventName, originalEventArgs) {
                },
                click: function (mapModel, eventName, originalEventArgs) {
                    console.log(activarClick);
                        var e = originalEventArgs[0];
                        var lat = e.latLng.lat(),
                        lon = e.latLng.lng();

                        var mapaObject = new Object();
                        var mapaObjectFinal = new Array();

                        mapaObject = new Object();
                        mapaObject.id = Math.floor((Math.random() * 1000000) + 1),
                        mapaObject.nombre = "Carta de llamada: "+$scope.imeEquipoActivo,
                        mapaObject.latitude = lat;
                        mapaObject.longitude = lon;
                        mapaObjectFinal[0] = mapaObject;
                        $scope.mapaDatos=mapaObject;
                        $scope.swMapa=1;
                        dynamicMarkers = mapaObjectFinal;

                        $scope.addMarkerMap();
                }
            },
            clickedMarker: {
                id:0,
                title: ''
            },
            onMarkerClicked: function (marker) {
                marker.showWindow = true;
                $scope.$apply();
            },
            dynamicMarkers: []
        }
    });

    $scope.markersEvents = {
        click: function (gMarker, eventName, model) {
            if(model.$id){
                model = model.coords;
            }
            alert(model.nombre);
        }
    };

    $scope.refreshMap = function (longitudRF, latitudRF) {
        $scope.map.control.refresh({latitude: longitudRF, longitude: latitudRF});
        $scope.map.control.getGMap().setZoom(16);
    };

    $scope.addMarkerMap = function () {
        $timeout(function () {
            $scope.map.dynamicMarkers = dynamicMarkers;
        }, 1000);
    };

    $scope.onMarkerClicked = function (marker) {
        markerToClose = marker;
        marker.showWindow = true;
        $scope.$apply();
    };

    var origCenter = {latitude: $scope.map.center.latitude, longitude: $scope.map.center.longitude};    */

    /*$scope.$on('api:ready',function(){
        $scope.ciVerificarArchiv();
        google.maps.visualRefresh = true;

    });
    $scope.archivosCiudadano = function () {
        if(DreamFactory.isReady()){
            $scope.ciVerificarArchiv();
            google.maps.visualRefresh = true;
        }
    };*/

    $scope.$on('api:ready',function(){
        $scope.ciVerificarArchiv();
        //google.maps.visualRefresh = true;
        $scope.getZonaMD();
    });

    $scope.archivosCiudadano = function () {
        if(DreamFactory.isReady()){
            $scope.ciVerificarArchiv();
            //google.maps.visualRefresh = true;
            $scope.getZonaMD();
        }
    };
});
