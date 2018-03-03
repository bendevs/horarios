var app = angular.module('myApp', ['ngResource','ngRoute', 'ngAnimate', 'toaster', 'ngTable','ngTableExport', 'ngDreamFactory','ui.bootstrap','angularMoment','hSweetAlert','integralui','treeGrid','xeditable','checklist-model', 'ngCkeditor', 'angularFileUpload','angularSoap', "ngCsv", "ngSanitize","ui.ace",,'ja.qr'])
app.constant('DSP_URL', 'http://192.168.5.248:80').constant('DSP_API_KEY', 'todoangular').constant('DEV_ENV', 0);
//app.constant('DSP_URL', 'http://localhost:9292').constant('DSP_API_KEY', 'angular').constant('DEV_ENV', 0);

app.config(['$httpProvider', 'DSP_API_KEY', function($httpProvider, DSP_API_KEY) {
    $httpProvider.defaults.headers.common['X-DreamFactory-Application-Name'] = DSP_API_KEY;
    }]);

/*VARIABLES URL*/

var base_url_swLicencia   =   "http://gmlpsr0116/swGenesisFinal/swLicencia.asmx";//http://gmlpsr0116/swGenesisFinalProduccion/swLicencia.asmx
var base_url_swpubfondoLicencia   =   "http://gmlpsr0116/swGenesisPubFondo/swLicencia.asmx";//http://gmlpsr0116/swGenesisPubFondoProduccion/swLicencia.asmx
var base_url_swmodificacionlicencia   =  "http://gmlpsr0116/swGenesisFinal/swModificacion.asmx";//http://gmlpsr0116/swGenesisFinalProduccion/swModificacion.asmx

app.factory("testService", ['$soap',function($soap){
    var base_url = base_url_swLicencia;
    return {
        datosActividadLicencia: function(){
            return $soap.post(base_url,"datosActividadLicencia", {numeroLicencia: 112590});
        }
	}
}]);
// ENCRIPTAR CODIGO
app.factory("wsLicencia2", ['$soap',function($soap){
  //http://gmlpsr0116/serv_qr/servicioQR.asmx?op=QRGremiales
    var base_url = "http://gmlpsr0116/serv_qr/servicioQR.asmx";
    //http://192.168.32.13/swServ_QR/servicioQR.asmx
    return {
        Obtener_XML_etiquetas: function(vidActividadEconomica){
            return $soap.post(base_url,"encriptacion", {data: vidActividadEconomica});
        }
    }
}]);
// AE - GENERAR LICENCIA
app.factory("wsLicencia", ['$soap',function($soap){
    var base_url = base_url_swpubfondoLicencia;
    return {
        generaLicenciaAEFechasNuevaActividad: function(vidActividadEconomica, vinicio, vfin, vidAreaRecauda, vusuario, vipEquip, vequip, vfuncionar){
            return $soap.post(base_url,"generaLicenciaAEFechasNuevaActividad", {idActividadEconomica: vidActividadEconomica,
																				inicio: vinicio,
																				fin: vfin,
																				idAreaRecauda: vidAreaRecauda,
																				usuario: vusuario,
																				ipEquip: vipEquip,
																				equip: vequip,
																				funcionar:vfuncionar
																				});
        }
	}
}]);

app.service('obtFechaActual', function(DreamFactory,CONFIG){
    this.obtenerFechaActual = function(){
        var fecha       =   new Date();
        var fechaactul  =   "";
        var smes        =   fecha.getMonth() + 1;

        smes        =   (smes < 10) ? '0' + smes : smes;
        fechactual  =   fecha.getFullYear() + "-" + smes + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        return fechactual;
     }
});

app.service('obtFechaHoraServer', function(){
    this.obtenerFecha = function(){
        var sfecha = "";
        var fechaactual = new fechaserver();
        fechaactual.fechahora(function(resultado){
            sfecha  =   JSON.parse(resultado).success.fecha;
        });

        var sfechafinal =   "";
        if(sfecha != null && sfecha != "") {
            var snuevafecha = "";
            var nrof    =   0;
            try{
                nrof    =   sfecha.split("/").length;
            }catch(e){}
            if(nrof > 1){
                var dateString = sfecha;
                var dateParts = sfecha.split("/");
                snuevafecha = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);// month is 0-based
            }else{
                snuevafecha = new Date(sfecha);
            }

            var messnuevafecha = "";
            var diasnuevafecha = "";
            if(snuevafecha != 'Invalid Date'){
                messnuevafecha        =     snuevafecha.getMonth()+1;
                messnuevafecha        =     (messnuevafecha < 10) ? '0' + messnuevafecha : messnuevafecha;
                if (snuevafecha.getDate()<10){
                    diasnuevafecha = "0" + (snuevafecha.getDate());
                }else{
                    diasnuevafecha = snuevafecha.getDate();
                }
                sfechafinal = diasnuevafecha + "/" + messnuevafecha + "/" + snuevafecha.getFullYear();
            }
        } else {
            sfechafinal =  sfecha;
        }
        return sfechafinal;
    }

    this.obtenerHora = function(){
        var sfecha = "";
        var fechaactual = new fechaserver();
        fechaactual.fechahora(function(resultado){
            sfecha  =   JSON.parse(resultado).success.fecha;
        });
        var sfechafinal =   "";
        if(sfecha != null && sfecha != "") {
            snuevafecha = new Date(sfecha);
            var shora     = "";
            var sminuto   = "";
            var ssegundo  = "";
            shora       =   snuevafecha.getHours();
            sminuto     =   snuevafecha.getMinutes();
            ssegundo    =   snuevafecha.getSeconds();
            sfechafinal =   shora + ":" + sminuto + ":" + ssegundo;
        } else {
            sfechafinal =  sfecha;
        }
        return sfechafinal;
     }
});


// **********SERVICIO DE OBTENCION MODIFICACION DE LICENCIAS*************************
app.factory("swLicenciaModificacion", ['$soap',function($soap){
    var base_url = base_url_swLicencia;
    return {
        datosActividadLicencia: function(vnumeroLicencia){
             console.log('*******datos ==>'+vnumeroLicencia);
            return $soap.post(base_url,"datosActividadLicencia", {numeroLicencia: vnumeroLicencia});
        }
    }
}]);
app.factory("wsRenovLicencia", ['$soap',function($soap){
    var base_url = "http://gmlpsr0116/swGenesisFinal/registrapublicidad.asmx";
    return {
        generaLicenciaAEFechas: function(vidActividadEconomica, vinicio, vfin, vidAreaRecauda, vusuario, vipEquip, vequip, vfuncionar){
            return $soap.post(base_url,"generaLicenciaAEFechas", {idActividadEconomica: vidActividadEconomica,
                                                                                inicio: vinicio,
                                                                                fin: vfin,
                                                                                idAreaRecauda: vidAreaRecauda,
                                                                                usuario: vusuario,
                                                                                ipEquip: vipEquip,
                                                                                equip: vequip,
                                                                                funcionar:vfuncionar
                                                                                });
        }
    }
}]);

app.factory("wsContribuyenteNatural", ['$soap',function($soap){
    var base_url = base_url_swLicencia;
    return {
        RegistrarNuevoContribuyenteGenesisNatural: function(datos){

            var id_semail       =   ((typeof(datos.f01_email_prop)      == 'undefined' || datos.f01_email_prop      == null) ? '' : datos.f01_email_prop);
            var id_snit         =   ((typeof(datos.f01_nit)             == 'undefined' || datos.f01_nit             == null) ? '' : datos.f01_nit);
            var id_stercer_ape  =   ((typeof(datos.f01_ter_nom_prop)    == 'undefined' || datos.f01_ter_nom_prop    == null) ? '' : datos.f01_ter_nom_prop);

            var sBloque  =   ((typeof(datos.f01_bloq_prop)    == 'undefined' || datos.f01_bloq_prop    == null) ? '' : datos.f01_bloq_prop);
            var sDepartamento  =   ((typeof(datos.f01_depa_prop)    == 'undefined' || datos.f01_depa_prop    == null) ? '' : datos.f01_depa_prop);
            var sSegundoApellido  =   ((typeof(datos.f01_ape_mat_prop)    == 'undefined' || datos.f01_ape_mat_prop    == null) ? '' : datos.f01_ape_mat_prop);

            var dataContriNatural   =   {   sTipoPersoneria:datos.f01_tipo_per,
                                            sTipoIdentidad:	datos.f01_tip_doc_prop,
                                            sIdentificacion:datos.f01_num_dos_prop,
                                            sExpedicion:datos.f01_expedido_prop,
                                            sNit:id_snit.trim(),
                                            sPrimerNombre:datos.f01_pri_nom_prop,
                                            sSegundoNombre:datos.f01_seg_nom_prop,
                                            sTercerNombre:id_stercer_ape.trim(),
                                            sPrimerApellido:datos.f01_ape_pat_prop,
                                            sSegundoApellido:datos.f01_ape_mat_prop,
                                            sTercerApellido:datos.f01_ape_cas_prop,
                                            sFechaNacimiento:datos.f01_fecha_nac,
                                            sSexo:"M",
                                            sNacionalidad:datos.f01_nac_prop,
                                            sTelefono:datos.f01_telef_prop,
                                            sEmail:id_semail.trim(),
                                            sCelular:datos.f01_cel_prop,
                                            sIdZona:datos.f01_zon_prop,
                                            sZona:datos.f01_zon_prop_descrip,
                                            sTipoVia:datos.f01_tip_via_prop,
                                            sVia:datos.f01_nom_via_prop,
                                            sNumero:datos.f01_num_prop,
                                            sEdificio:datos.f01_nom_edi_prop,
                                            sBloque:datos.f01_bloq_prop,
                                            sPiso:datos.f01_piso_prop,
                                            sDepartamento:	datos.f01_depa_prop,
                                            sDireccionDetallada:datos.f01_dir_det_prop,
                                            sEstado:"V",
                                            sFechaRegistro:datos.sFechaServer,
                                            sTipoTransaccion:"I",
                                            sUsuario:datos.user,
                                            sIpUsario:datos.ipusuario,
                                            sEquipoId:"GMLPSR0024",
                                            sfuncionario:datos.user
            };

            console.log("DATOS REGISTRO PERSONA NATURAL:", dataContriNatural);

            return $soap.post(base_url,"RegistrarNuevoContribuyenteGenesisNatural", dataContriNatural);
        }
	}
}]);

//AE - CONTRIBUYENTE NATURAL MODIFICAR PERSONA
app.factory("wsContribuyenteModificarNatural", ['$soap',function($soap){
    var base_url = base_url_swmodificacionlicencia;
    return {
        modificarPersona: function(datos){
            console.log("DATOS REGISTRO NATURAL 1:", datos);
            var id_semail       =   ((typeof(datos.f01_email_prop)      == 'undefined' || datos.f01_email_prop      == null) ? '' : datos.f01_email_prop);
            var id_snit         =   ((typeof(datos.f01_nit)             == 'undefined' || datos.f01_nit             == null) ? '' : datos.f01_nit);
            var id_stercer_nom  =   ((typeof(datos.f01_ter_nom_prop)    == 'undefined' || datos.f01_ter_nom_prop    == null) ? '' : datos.f01_ter_nom_prop);
            var sSegundoApellido  =   ((typeof(datos.f01_ape_mat_prop)    == 'undefined' || datos.f01_ape_mat_prop    == null) ? '' : datos.f01_ape_mat_prop);

            var dataContriNaturalModPersona = {
                                                idActividadEconomica:datos.f01_id_actividad_economica,
                                                idAreaRecaudacion:datos.f01_id_area_recuadadora,
                                                idPersona:datos.f01_id_contribuyente,
                                                padron:datos.f01_num_pmc,
                                                tipoIdentidad:datos.f01_tip_doc_prop,
                                                identificacion:datos.f01_num_dos_prop,
                                                expedicion:datos.f01_expedido_prop,
                                                nit:id_snit.trim(),
                                                primerNombre:datos.f01_pri_nom_prop,
                                                segundoNombre:datos.f01_seg_nom_prop,
                                                tercerNombre:id_stercer_nom.trim(),
                                                primerApellido:datos.f01_ape_pat_prop,
                                                segundoApellido:sSegundoApellido,
                                                tercerApellido:datos.f01_ape_cas_prop,
                                                fechaNacimiento:datos.f01_fecha_nac,
                                                sexo:"M",
                                                nacionalidad:datos.f01_nac_prop,
                                                telefono:datos.f01_telef_prop,
                                                email:id_semail.trim(),
                                                celular:datos.f01_cel_prop,
                                                idZona:datos.f01_zon_prop,
                                                tipoVia:datos.f01_zon_prop_descrip,
                                                via:datos.f01_nom_via_prop,
                                                numero:datos.f01_num_prop,
                                                edificio:datos.f01_nom_edi_prop,
                                                bloque:datos.f01_bloq_prop,
                                                piso:datos.f01_piso_prop,
                                                departamento:datos.f01_depa_prop,
                                                direccionDetallada:datos.f01_dir_det_prop,
                                                estado:"V",
                                                usuario: datos.usuario,
                                                ipUsuario: datos.ipUsuario,
                                                equipo: "GMLPPC05314",
                                                funcionario: datos.usuario,
                                                tipoProceso: 2,
                                                justificacion: 'Modificacion de datos de Persona Natural por renovacion'
            };
            console.log("MODIFICAR PERSONA NATURAL MAE:", dataContriNaturalModPersona);
            return $soap.post(base_url,"modificarPersona", dataContriNaturalModPersona);
        }
    }
}]);


/*CORRECTO*/
app.factory("wsContribuyenteModificarAE", ['$soap',function($soap){
    var base_url = base_url_swmodificacionlicencia;




    return {
        modificarActEco: function(datos){

            console.log("DATA URL:", base_url);

            console.log("PARAMETROS GLOBALES ACTIVIDAD ECONOMICA (1): ", datos);

            var f01_id_actividad_economica  =   ((typeof(datos.f01_id_actividad_economica)  == 'undefined' || datos.f01_id_actividad_economica    == null) ? '' : datos.f01_id_actividad_economica);
            var f01_id_area_recuadadora     =   ((typeof(datos.f01_id_area_recuadadora)    == 'undefined' || datos.f01_id_area_recuadadora    == null) ? '' : datos.f01_id_area_recuadadora);
            var f01_id_contribuyente        =   ((typeof(datos.f01_id_contribuyente)    == 'undefined' || datos.f01_id_contribuyente    == null) ? '' : datos.f01_id_contribuyente);
            var f01_tipo_per                =   ((typeof(datos.f01_tipo_per)    == 'undefined' || datos.f01_tipo_per    == null) ? '' : datos.f01_tipo_per);
            var AE_NRO_CASO                 =   ((typeof(datos.AE_NRO_CASO)    == 'undefined' || datos.AE_NRO_CASO    == null) ? '' : datos.AE_NRO_CASO);
            var f01_nro_orden               =   ((typeof(datos.f01_nro_orden)    == 'undefined' || datos.f01_nro_orden    == null) ? '' : datos.f01_nro_orden);
            var f01_num_act1                =   ((typeof(datos.f01_num_act1)    == 'undefined' || datos.f01_num_act1    == null) ? '' : datos.f01_num_act1);
            var f01_nit                     =   ((typeof(datos.f01_nit)    == 'undefined' || datos.f01_nit    == null) ? '' : datos.f01_nit);
            var f01_cod_luz                 =   ((typeof(datos.f01_cod_luz)    == 'undefined' || datos.f01_cod_luz    == null) ? '' : datos.f01_cod_luz);
            var actividadDesarrollada       =   ((typeof(datos.actividadDesarrollada)    == 'undefined' || datos.actividadDesarrollada    == null) ? '' : datos.actividadDesarrollada);
            var f01_raz_soc                 =   ((typeof(datos.f01_raz_soc)    == 'undefined' || datos.f01_raz_soc    == null) ? '' : datos.f01_raz_soc);
            var f01_fecha_ini_act           =   ((typeof(datos.f01_fecha_ini_act)    == 'undefined' || datos.f01_fecha_ini_act    == null) ? '' : datos.f01_fecha_ini_act);
            var f01_fecha_fin_act           =   ((typeof(datos.f01_fecha_fin_act)    == 'undefined' || datos.f01_fecha_fin_act    == null) ? '' : datos.f01_fecha_fin_act);
            var f01_tip_via_act             =   ((typeof(datos.f01_tip_via_act)    == 'undefined' || datos.f01_tip_via_act    == null) ? '' : datos.f01_tip_via_act);
            var f01_num_act                 =   ((typeof(datos.f01_num_act)    == 'undefined' || datos.f01_num_act    == null) ? '' : datos.f01_num_act);
            var f01_num_act1                =   ((typeof(datos.f01_num_act1)    == 'undefined' || datos.f01_num_act1    == null) ? '' : datos.f01_num_act1);
            var f01_edificio_act            =   ((typeof(datos.f01_edificio_act)    == 'undefined' || datos.f01_edificio_act    == null) ? '' : datos.f01_edificio_act);
            var f01_bloque_act              =   ((typeof(datos.f01_bloque_act)    == 'undefined' || datos.f01_bloque_act    == null) ? '' : datos.f01_bloque_act);
            var f01_piso_act                =   ((typeof(datos.f01_piso_act)    == 'undefined' || datos.f01_piso_act    == null) ? '' : datos.f01_piso_act);
            var f01_dpto_of_loc             =   ((typeof(datos.f01_dpto_of_loc)    == 'undefined' || datos.f01_dpto_of_loc    == null) ? '' : datos.f01_dpto_of_loc);
            var f01_zona_act            	=   ((typeof(datos.f01_zona_act)    == 'undefined' || datos.f01_zona_act    == null) ? '' : datos.f01_zona_act);
            var f01_tel_act1                =   ((typeof(datos.f01_tel_act1)    == 'undefined' || datos.f01_tel_act1    == null) ? '' : datos.f01_tel_act1);
            var f01_casilla                 =   ((typeof(datos.f01_casilla)    == 'undefined' || datos.f01_casilla    == null) ? '' : datos.f01_casilla);
            var f01_idCodigoZona            =   ((typeof(datos.f01_idCodigoZona)    == 'undefined' || datos.f01_idCodigoZona    == null) ? '' : datos.f01_idCodigoZona);
            var f01_sup                     =   ((typeof(datos.f01_sup)    == 'undefined' || datos.f01_sup    == null) ? '' : datos.f01_sup);
            var f01_tipo_lic                =   ((typeof(datos.f01_tipo_lic)    == 'undefined' || datos.f01_tipo_lic    == null) ? '' : datos.f01_tipo_lic);
            var f01_productosElaborados     =   ((typeof(datos.f01_productosElaborados)    == 'undefined' || datos.f01_productosElaborados    == null) ? '' : datos.f01_productosElaborados);
            var f01_actividadesSecundarias  =   ((typeof(datos.f01_actividadesSecundarias)    == 'undefined' || datos.f01_actividadesSecundarias    == null) ? '' : datos.f01_actividadesSecundarias);
            var f01_estab_es                =   ((typeof(datos.f01_estab_es)    == 'undefined' || datos.f01_estab_es    == null) ? '' : datos.f01_estab_es);
            var f01_tip_act                 =   ((typeof(datos.f01_tip_act)    == 'undefined' || datos.f01_tip_act    == null) ? '' : datos.f01_tip_act);
            var f01_factor                  =   ((typeof(datos.f01_factor)    == 'undefined' || datos.f01_factor    == null) ? '' : datos.f01_factor);
            var f01_de_hor                  =   ((typeof(datos.f01_de_hor)    == 'undefined' || datos.f01_de_hor    == null) ? '' : datos.f01_de_hor);
            var f01_a_hor                   =   ((typeof(datos.f01_a_hor)    == 'undefined' || datos.f01_a_hor    == null) ? '' : datos.f01_a_hor);
            var f01_cap_aprox               =   ((typeof(datos.f01_cap_aprox)    == 'undefined' || datos.f01_cap_aprox    == null) ? '' : datos.f01_cap_aprox);
            var usuario                     =   ((typeof(datos.usuario)    == 'undefined' || datos.usuario    == null) ? '' : datos.usuario);
            var ipusuario                   =   ((typeof(datos.ipusuario)    == 'undefined' || datos.ipusuario    == null) ? '' : datos.ipusuario);

            var scapacidad  =   parseInt(f01_cap_aprox);

            var dataContribuyenteAE   =   {
                                                idActividadEconomica: f01_id_actividad_economica,
                                                idAreaRecaudacion: f01_id_area_recuadadora,
                                                idContribuyente: f01_id_contribuyente,
                                                clase: f01_tipo_per,
                                                hojaRuta: AE_NRO_CASO,
                                                numeroOrden: f01_nro_orden,
                                                numeroActividad: f01_num_act1,
                                                nit: f01_nit,
                                                cuentaEnergiaElectrica: f01_cod_luz,
                                                idActividadDesarrollada: actividadDesarrollada,//verificar
                                                denominacion: f01_raz_soc,
                                                inicio: f01_fecha_ini_act,
                                                fin: f01_fecha_fin_act,
                                                tipoVia: f01_tip_via_act,
                                                via: f01_num_act,
                                                numero: f01_num_act1,
                                                edificio: f01_edificio_act,
                                                bloque: f01_bloque_act,
                                                piso: f01_piso_act,
                                                departamento: f01_dpto_of_loc,
                                                idZona: f01_zona_act,
                                                entreCalles: "",
                                                telefono: f01_tel_act1,
                                                casilla: f01_casilla,
                                                idCodigoZona: f01_idCodigoZona,
                                                superficie: f01_sup,
                                                idTipoLicencia: f01_tipo_lic,
                                                productosElaborados: f01_productosElaborados,
                                                actividadesSecundarias:  f01_actividadesSecundarias,
                                                establecimiento: f01_estab_es,
                                                tipoActividad: f01_tip_act,
                                                factor: f01_factor,
                                                horarioAtencion: f01_de_hor+" - "+f01_a_hor,
                                                capacidad: scapacidad,
                                                estado: "V",
                                                usuario: usuario,
                                                ipUsuario: ipusuario,
                                                equipo: "GMLPPC05314",
                                                funcionario: usuario,
                                                tipoProceso: 2,
                                                justificacion:'Modificacion de la Actividad Economica por Renovacion - Lotus'
            };

            console.log("PARAMETROS MODIFICAR ACTIVIDAD ECONOMICA (2): ", dataContribuyenteAE);

            return $soap.post(base_url,"modificarActEco", dataContribuyenteAE);
        }
    }
}]);



//AE - CONTRIBUYENTE JURIDICO
app.factory("wsContribuyenteJuridico", ['$soap',function($soap){
    var base_url = base_url_swLicencia;
    return {
        RegistrarNuevoContribuyenteGenesisJuridico: function(datos){

            console.log("DATOS REGISTRO JURICO:", datos);

            var dataContriJuridico   =   {   sIdentificacion:datos.f01_num_doc_rep,
                                            sTipoIdentidad:datos.f01_tip_doc_rep,
                                            sExpedicion:datos.f01_expedido_rep,
                                            sPprimerNombre:datos.f01_pri_nom_rep,
                                            sSegundoNombre:datos.f01_seg_nom_rep,
                                            sTercerNombre:datos.f01_ter_nom_rep,
                                            sPrimerApellido:datos.f01_ape_pat_rep,
                                            sSegundoApellido:datos.f01_ape_mat_rep,
                                            sTercerApellido:datos.f01_ape_cas_rep,
                                            sCelular:datos.f01_cel_rep,
                                            sCcorreoElectronico:datos.f01_email_rep,
                                            sNnumeroPoder:datos.f01_num_pod_leg,
                                            sNnumeroNotaria:datos.f01_num_not,
                                            sGgestionPoder:datos.f01_ges_vig_pod,
                                            sEstado:"V",
                                            sIdZona:datos.f01_id_zona_rep,
                                            sZona:datos.f01_id_zona_rep,
                                            sTipoVia:datos.f01_tipo_viarep,
                                            sVia:datos.f01_nom_via_rep,
                                            sNumeroVia:datos.f01_num_rep,
                                            sTipoTransaccion:"R",
                                            sUsuario:datos.user,
                                            sIpUsuario:datos.ipusuario,
                                            sEquipo:"GMLPSR0024",
                                            sFuncionario:datos.user,
                                            sNitE:datos.f01_nit,
                                            sEmpresaE:datos.f01_raz_soc_per_jur,//f01_raz_soc
                                            sTelefonoE:"",
                                            sIdZonaE:datos.f01_zona_act,
                                            sZonaE:datos.f01_zona_act_descrip,
                                            sTipoViaE:datos.f01_tip_via_act,
                                            sViaE:datos.f01_num_act,
                                            sNumeroE:datos.f01_num_act1,
                                            sEdificioE:datos.f01_edificio_act,
                                            sBloqueE:datos.f01_bloque_act,
                                            sPisoE:datos.f01_piso_act,
                                            sDepartamentoE:datos.f01_dpto_of_loc,
                                            sDireccionDetalladaE:"",
                                            sFechaRegistro:datos.sFechaServer,
                                            sPersoneria:datos.f01_tipo_per
            };
            console.log("DATOS REGISTRO PERSONA JURIDICA:", dataContriJuridico);
            return $soap.post(base_url,"RegistrarNuevoContribuyenteGenesisJuridico", dataContriJuridico);
        }
	}
}]);


//modificar REpresentante legal
app.factory("wsContribuyenteModificarJuridico", ['$soap',function($soap){
    var base_url = base_url_swmodificacionlicencia;
    return {
        modificarRepLegal: function(datos){
            console.log("DATOS REGISTRO JURICO MODIFICAR:", datos);
            var dataModificarContriJuridico   =   {
                                                    idActividadEconomica:datos.f01_id_actividad_economica,
                                                    idAreaRecaudacion:datos.f01_id_area_recuadadora,
                                                    //idRepresentanteLegal:datos.f01_id_representante_legal,
                                                    idRepresentanteLegal:datos.empidEmpresa,
                                                    identificacion:datos.f01_num_doc_rep,
                                                    tipoIdentidad:datos.f01_tip_doc_rep,
                                                    expedicion:datos.f01_expedido_rep,
                                                    primerNombre:datos.f01_pri_nom_rep,
                                                    segundoNombre:datos.f01_seg_nom_rep,
                                                    tercerNombre:datos.f01_ter_nom_rep,
                                                    primerApellido:datos.f01_ape_pat_rep,
                                                    segundoApellido:datos.f01_ape_mat_rep,
                                                    tercerApellido:datos.f01_ape_cas_rep,
                                                    celular:datos.f01_cel_rep,
                                                    correoElectronico:datos.f01_email_rep,
                                                    numeroPoder:datos.f01_num_pod_leg,
                                                    numeroNotaria:datos.f01_num_not,
                                                    gestionPoder:datos.f01_ges_vig_pod,
                                                    estado:"V",
                                                    idZona:datos.f01_id_zona_rep,
                                                    tipoVia:datos.f01_tipo_viarep,
                                                    via:datos.f01_nom_via_rep,
                                                    numeroVia:datos.f01_num_rep,
                                                    usuario:datos.user,
                                                    ipUsuario:datos.ipusuario,
                                                    equipo:"GMLPSR0024",
                                                    funcionario:datos.user,
                                                    tipoProceso:datos.jtipoProceso,
                                                    justificaion:datos.justificacion

            };
            console.log("DATOS DE MODIFICACION DE PERSONA JURIDICA:", dataModificarContriJuridico);
            return $soap.post(base_url,"modificarRepLegal", dataModificarContriJuridico);
        }
    }
}]);

//AE - MODIFICAR EMPRESA
app.factory("wsContribuyenteModificarEmpresa", ['$soap',function($soap){
    var base_url = base_url_swmodificacionlicencia;
    return {
        modificarEmpresa: function(datos){
            console.log("DATOS EMPRESA A MODIFICAR 22:", datos);
            var dataModificarDatosEmpresa   =   {
                                                    idActividadEconomica: datos.f01_id_actividad_economica,
                                                    idAreaRecaudacion: datos.f01_id_area_recuadadora,
                                                    empresa: datos.f01_raz_soc_per_jur,
                                                    idEmpresa: datos.f01_id_contribuyente,
                                                    padron: datos.f01_num_pmc,
                                                    nit: datos.f01_num_doc_per_jur,
                                                    //idRepresentanteLegal: datos.f01_id_representante_legal,
                                                    idRepresentanteLegal: 0,
                                                    estado: "V",
                                                    usuario: datos.user,
                                                    ipUsuario: datos.ipusuario,
                                                    equipo: "GMLPSR0024",
                                                    funcionario: datos.user,
                                                    tipoProceso: datos.jtipoProceso,
                                                    justificacion: datos.justificacion,
                                                    numeroOrden: datos.f01_nro_orden
            };

            console.log("DATOS DE MODIFICACION DE PERSONA JURIDICA 22:", dataModificarDatosEmpresa);
            return $soap.post(base_url,"modificarEmpresa", dataModificarDatosEmpresa);
        }
    }
}]);



app.factory("wsContribuyenteJurideweweico", ['$soap',function($soap){
    var base_url = base_url_swLicencia;
    return {

        RegistrarNuevoContribuyenteGenesisJuridico: function(datos){
            var fechaInicio= datos.INT_INICIO_AE.split('/')
            var resFechaInicio = fechaInicio[2] +"-"+ fechaInicio[1] +"-"+fechaInicio[0];

            var fechaFin=datos.f01_fecha_fin_act.split("/");
            var resFechaFin=fechaFin[2] +"-"+ fechaFin[1] +"-"+fechaFin[0];
            return $soap.post(base_url,"RegistrarNuevoContweweweribuyenteGenesisJuridico", {idActividadEconomica:datos.f01_id_actividad_economica,
                                                                            numeroLicencia: 1234,
                                                                            fEmision: "01/05/2016",
                                                                            fVencimiento: "01/05/2017",
                                                                            idAreaRecaudacion:789,
                                                                            idContribuyente:datos.f01_id_contribuyente,
                                                                            clase:datos.f01_tipo_per,
                                                                            hojaRuta:"123",
                                                                            numeroOrden:123,
                                                                            nit:datos.f01_nit,
                                                                            cuentaEnergiaElectrica:"-----",
                                                                            idActividadDesarrollada:datos.INT_CAT_DESARROLADA_ID,
                                                                            denominacion: datos.INT_DENOMINACION,
                                                                            inicio:resFechaInicio,
                                                                            fin:resFechaFin,
                                                                            tipoVia:datos.INT_TIP_VIA,
                                                                            via:datos.INT_AC_NOMBRE_VIA,
                                                                            numero:datos.INT_AC_NOMBRE_VIA1,
                                                                            edificio:datos.INT_AC_EDIFICIO,
                                                                            bloque:datos.INT_AC_BLOQUE,
                                                                            piso:datos.INT_AC_PISO,
                                                                            departamento:datos.INT_AC_NUMERO,
                                                                            idZona:datos.INT_AC_ID_ZONA,
                                                                            idDistrito:datos.INT_AC_DISTRITO,
                                                                            entreCalles:"al medio",
                                                                            telefono:datos.f01_tel_act1,
                                                                            casilla:datos.f01_casilla,
                                                                            codigoZona:datos.f01_idCodigoZona,
                                                                            superficie: datos.INT_AC_SUPERFICIE,
                                                                            idCategoria:datos.INT_TIPO_LICENCIA,
                                                                            productosElaborados:datos.f01_productosElaborados,
                                                                            actividadesSecundarias:  datos.f01_actividadesSecundarias,
                                                                            establecimiento: datos.INT_AC_ESTADO,
                                                                            tipoActividad:datos.f01_tip_act,
                                                                            factor:datos.f01_factor,
                                                                            horarioAtencion:  datos.INT_AC_HR_INICIO+" - "+datos.INT_AC_HR_FINAL,
                                                                            capacidad: parseInt(datos.INT_AC_CAPACIDAD),
                                                                            estado:"V",
                                                                            tipoTransaccion: "M",
                                                                            usuario: "fsegales",
                                                                            ipUsuario: "192,168,5,190",
                                                                            equipo: "GMLPPC05314",
                                                                            funcionario: "fsegales",
                                                                            tipoFormulario: 1,
                                                                            observaciones: datos.f01_observaciones_i

                                                                                });
        }
    }
}]);

app.factory("wsModificacionActividadLicencia", ['$soap',function($soap){
    var base_url = base_url_swLicencia;
    return {

            modificacionActividadLicencia: function(datos){
                console.log("datosss:",datos);
                var fechaInicio= datos.INT_INICIO_AE.split('/')
                var resFechaInicio = fechaInicio[2] +"-"+ fechaInicio[1] +"-"+fechaInicio[0];

                var fechaFin=datos.f01_fecha_fin_act.split("/");
                var resFechaFin=fechaFin[2] +"-"+ fechaFin[1] +"-"+fechaFin[0];

                console.log(resFechaInicio);
            return $soap.post(base_url,"modificacionActividadLicencia", {   //idActividadEconomica:datos.f01_id_actividad_economica,
                                                                            idActividadEconomica:datos.INT_ID_ACTIVIDAD_ECONOMICA,
                                                                            numeroLicencia: 0,
                                                                            fEmision: resFechaInicio,
                                                                            fVencimiento: resFechaFin,
                                                                            idAreaRecaudacion:datos,
                                                                            //idContribuyente:datos.f01_id_contribuyente,
                                                                            idContribuyente:datos.INT_ID_CONTRIBUYENTE,
                                                                            clase:datos.f01_tipo_per,
                                                                            hojaRuta:"0",
                                                                            numeroOrden:0,
                                                                            nit:datos.f01_nit,
                                                                            cuentaEnergiaElectrica:"-----",
                                                                            idActividadDesarrollada:datos.INT_CAT_DESARROLADA_ID,
                                                                            //idActividadDesarrollada:2679,
                                                                            denominacion: datos.INT_DENOMINACION,
                                                                            inicio:resFechaInicio,
                                                                            fin:resFechaFin,
                                                                            tipoVia:datos.INT_TIP_VIA,
                                                                            via:datos.INT_AC_NOMBRE_VIA,
                                                                            numero:datos.INT_AC_NOMBRE_VIA1,
                                                                            edificio:datos.INT_AC_EDIFICIO,
                                                                            bloque:datos.INT_AC_BLOQUE,
                                                                            piso:datos.INT_AC_PISO,
                                                                            departamento:datos.INT_AC_NUMERO,
                                                                            idZona:datos.INT_AC_ID_ZONA,
                                                                            idDistrito:datos.INT_AC_DISTRITO,
                                                                            entreCalles:"al medio",
                                                                            telefono:datos.f01_tel_act1,
                                                                            casilla:datos.f01_casilla,
                                                                            codigoZona:datos.f01_idCodigoZona,
                                                                            superficie: datos.INT_AC_SUPERFICIE,
                                                                            idCategoria:datos.INT_TIPO_LICENCIA,
                                                                            productosElaborados:datos.f01_productosElaborados,
                                                                            actividadesSecundarias:  datos.f01_actividadesSecundarias,
                                                                            establecimiento: datos.INT_AC_ESTADO,
                                                                            tipoActividad:datos.f01_tip_act,
                                                                            factor:datos.f01_factor,
                                                                            horarioAtencion:  datos.INT_AC_HR_INICIO+" - "+datos.INT_AC_HR_FINAL,
                                                                            capacidad: parseInt(datos.INT_AC_CAPACIDAD),
                                                                            estado:"V",
                                                                            tipoTransaccion: "M",
                                                                            usuario: "fsegales",
                                                                            ipUsuario: "192,168,5,190",
                                                                            equipo: "GMLPPC05314",
                                                                            funcionario: "fsegales",
                                                                            tipoFormulario: 1,
                                                                            observaciones: datos.f01_observaciones_i

                                                                                });
        }
    }
}]);

//***DAR DE BAJA ACTIVIDAD ECONOMICA, GENERAR POSTERIORMENTE UNA NUEVA***//
app.factory("wsBajaActividad", ['$soap',function($soap){
    var base_url = base_url_swLicencia;
    return {
            bajaActividadEconomica: function(datos){
                var fechaInicio     =   datos.f01_fecha_ini_act.split('/');
                var resFechaInicio  =   fechaInicio[2]  +   "-" +   fechaInicio[1]  +   "-" +   fechaInicio[0];
                var fechaFin        =   datos.f01_fecha_fin_act.split("/");
                var resFechaFin     =   fechaFin[2] +   "-" +   fechaFin[1] +   "-" +   fechaFin[0];

                /*VALIDANDO CAMPOS*/
                var sActividadEconomica  =   ((typeof(datos.f01_id_actividad_economica)    == 'undefined' || datos.f01_id_actividad_economica    == null) ? '' : datos.f01_id_actividad_economica);
                var sAreaRecaudacion  =   ((typeof(datos.f01_id_area_recuadadora)    == 'undefined' || datos.f01_id_area_recuadadora    == null) ? '' : datos.f01_id_area_recuadadora);
                var sIdContribuyente  =   ((typeof(datos.f01_id_contribuyente)    == 'undefined' || datos.f01_id_contribuyente    == null) ? '' : datos.f01_id_contribuyente);
                var sTipoPer  =   ((typeof(datos.f01_tipo_per)    == 'undefined' || datos.f01_tipo_per    == null) ? '' : datos.f01_tipo_per);
                var sAeNumeroCaso  =   ((typeof(datos.AE_NRO_CASO)    == 'undefined' || datos.AE_NRO_CASO    == null) ? '' : datos.AE_NRO_CASO);
                var sNroCaso  =   ((typeof(datos.f01_nro_orden)    == 'undefined' || datos.f01_nro_orden    == null) ? '' : datos.f01_nro_orden);
                var sNroNit  =   ((typeof(datos.f01_nit)    == 'undefined' || datos.f01_nit    == null) ? '' : datos.f01_nit);
                var sCodigoLuz  =   ((typeof(datos.f01_cod_luz)    == 'undefined' || datos.f01_cod_luz    == null) ? '' : datos.f01_cod_luz);
                var sActividadDesarrollada  =   ((typeof(datos.actividadDesarrollada)    == 'undefined' || datos.actividadDesarrollada    == null) ? '' : datos.actividadDesarrollada);
                var sRazonSocial  =   ((typeof(datos.f01_raz_soc)    == 'undefined' || datos.f01_raz_soc    == null) ? '' : datos.f01_raz_soc);
                var sTipoViaActividad  =   ((typeof(datos.f01_tip_via_act)    == 'undefined' || datos.f01_tip_via_act    == null) ? '' : datos.f01_tip_via_act);
                var sNumeroAct  =   ((typeof(datos.f01_num_act)    == 'undefined' || datos.f01_num_act    == null) ? '' : datos.f01_num_act);
                var sNumeroAct1  =   ((typeof(datos.f01_num_act1)    == 'undefined' || datos.f01_num_act1    == null) ? '' : datos.f01_num_act1);
                var sEdificioAct  =   ((typeof(datos.f01_edificio_act)    == 'undefined' || datos.f01_edificio_act    == null) ? '' : datos.f01_edificio_act);
                var sBloqueAct  =   ((typeof(datos.f01_bloque_act)    == 'undefined' || datos.f01_bloque_act    == null) ? '' : datos.f01_bloque_act);
                var sPisoAct  =   ((typeof(datos.f01_piso_act)    == 'undefined' || datos.f01_piso_act    == null) ? '' : datos.f01_piso_act);
                var sDdptoOfloc  =   ((typeof(datos.f01_dpto_of_loc)    == 'undefined' || datos.f01_dpto_of_loc    == null) ? '' : datos.f01_dpto_of_loc);
                var sZonaAct  =   ((typeof(datos.f01_zona_act)    == 'undefined' || datos.f01_zona_act    == null) ? '' : datos.f01_zona_act);
                var sDistAct  =   ((typeof(datos.f01_dist_act)    == 'undefined' || datos.f01_dist_act    == null) ? '' : datos.f01_dist_act);
                var sTelAct1  =   ((typeof(datos.f01_tel_act1)    == 'undefined' || datos.f01_tel_act1    == null) ? '' : datos.f01_tel_act1);
                var sCasilla  =   ((typeof(datos.f01_casilla)    == 'undefined' || datos.f01_casilla    == null) ? '' : datos.f01_casilla);
                var sIdCodigoZona  =   ((typeof(datos.f01_idCodigoZona)    == 'undefined' || datos.f01_idCodigoZona    == null) ? '' : datos.f01_idCodigoZona);
                var sF01Sup  =   ((typeof(datos.f01_sup)    == 'undefined' || datos.f01_sup    == null) ? '' : datos.f01_sup);
                var sF01TipoLic  =   ((typeof(datos.f01_tipo_lic)    == 'undefined' || datos.f01_tipo_lic    == null) ? '' : datos.f01_tipo_lic);
                var sProductosElaborados  =   ((typeof(datos.f01_productosElaborados)    == 'undefined' || datos.f01_productosElaborados    == null) ? '' : datos.f01_productosElaborados);
                var sF01ActividadesSecundarias  =   ((typeof(datos.f01_actividadesSecundarias)    == 'undefined' || datos.f01_actividadesSecundarias    == null) ? '' : datos.f01_actividadesSecundarias);
                var sEstabEs  =   ((typeof(datos.f01_estab_es)    == 'undefined' || datos.f01_estab_es    == null) ? '' : datos.f01_estab_es);
                var sTipAct  =   ((typeof(datos.f01_tip_act)    == 'undefined' || datos.f01_tip_act    == null) ? '' : datos.f01_tip_act);
                var sF01Factor  =   ((typeof(datos.f01_factor)    == 'undefined' || datos.f01_factor    == null) ? '' : datos.f01_factor);
                var sF01DeHor  =   ((typeof(datos.f01_de_hor)    == 'undefined' || datos.f01_de_hor    == null) ? '' : datos.f01_de_hor);
                var sF01AHor  =   ((typeof(datos.f01_a_hor)    == 'undefined' || datos.f01_a_hor    == null) ? '' : datos.f01_a_hor);
                var sF01CapAprox  =   ((typeof(datos.f01_cap_aprox)    == 'undefined' || datos.f01_cap_aprox    == null) ? '' : datos.f01_cap_aprox);
                var sUsuario  =   ((typeof(datos.usuario)    == 'undefined' || datos.usuario    == null) ? '' : datos.usuario);
                var sIpUsuario  =   ((typeof(datos.ipusuario)    == 'undefined' || datos.ipusuario    == null) ? '' : datos.ipusuario);
                var sF01Observaciones_i  =   ((typeof(datos.f01_observaciones_i)    == 'undefined' || datos.f01_observaciones_i    == null) ? '' : datos.f01_observaciones_i);

                //idActividadEconomica
                var datosRegistroAct    =   {
                                                idActividadEconomica:sActividadEconomica,
                                                numeroLicencia: 0,
                                                fEmision: resFechaInicio,//*
                                                fVencimiento: resFechaFin,//*
                                                idAreaRecaudacion:sAreaRecaudacion,
                                                idContribuyente:sIdContribuyente,
                                                clase:sTipoPer,
                                                hojaRuta:sAeNumeroCaso,
                                                numeroOrden:sNroCaso,
                                                nit:sNroNit,
                                                cuentaEnergiaElectrica:sCodigoLuz,
                                                idActividadDesarrollada:sActividadDesarrollada,
                                                denominacion: sRazonSocial,
                                                inicio:resFechaInicio,//*
                                                fin:resFechaFin,//*
                                                tipoVia:sTipoViaActividad,
                                                via:sNumeroAct,//* f01_num_act ?
                                                numero:sNumeroAct1,//* f01_num_act1 ?
                                                edificio:sEdificioAct,
                                                bloque:sBloqueAct,
                                                piso:sPisoAct,
                                                departamento:sDdptoOfloc,
                                                idZona:sZonaAct,//f01_zona_act ?
                                                idDistrito:sDistAct,
                                                entreCalles:"",//*
                                                telefono:sTelAct1,
                                                casilla:sCasilla,
                                                codigoZona:sIdCodigoZona,
                                                superficie: sF01Sup,
                                                idCategoria:sF01TipoLic,//* f01_categoria ?
                                                productosElaborados:sProductosElaborados,
                                                actividadesSecundarias:sF01ActividadesSecundarias,
                                                establecimiento: sEstabEs,
                                                tipoActividad:sTipAct,//* f01_tip_act ?
                                                factor:sF01Factor,
                                                horarioAtencion:  sF01DeHor + " - " + sF01AHor,
                                                capacidad: parseInt(sF01CapAprox),
                                                estado:"V",
                                                tipoTransaccion: "M",//string tipoTransaccionE = "R";
                                                usuario: sUsuario,
                                                ipUsuario: sIpUsuario,
                                                equipo: "GMLPSR0024",
                                                funcionario: sUsuario,
                                                tipoFormulario: 1,//string tipoFtomulario = "2";
                                                observaciones: sF01Observaciones_i
                };
                console.log("DATOS ENVIADOS ACTIVIDAD BAJA ->: ", datosRegistroAct);
                return $soap.post(base_url,"cancelarAsociarActividad", datosRegistroAct);
                //return $soap.post(base_url,"modificacionActividadLicencia", datosRegistroAct);
        }
    }
}]);


app.factory("wsRgistrarPubliciadad", ['$soap',function($soap){
    var base_url = "http://gmlpsr0116/swGenesisFinalProduccion/registrapublicidad.asmx";
    return {
        registra_publicidades: function(datos){
            //console.log("---****-->",datos);
            var jsonString = '{ "elementos": '+ datos +' }';
            return $soap.post(base_url,"registra_publicidades", { letrero: jsonString });
        }
    }
}]);


//OBITO
app.factory("wsObt", ['$soap',function($soap){
    return {
        wsPandora: function(servicio, url_metodo, base_url, datos){

            var bapcasada	=	((typeof(datos.bapcasada)    == 'undefined' || datos.bapcasada == null) ? '' : datos.bapcasada);
            var bci			=	((typeof(datos.bci)    == 'undefined' || datos.bci == null) ? 0 : datos.bci);
            var bfdesde		=	((typeof(datos.bfdesde)    == 'undefined' || datos.bfdesde == null) ? '' : datos.bfdesde);
            var bfhasta		=	((typeof(datos.bfhasta)    == 'undefined' || datos.bfhasta == null) ? '' : datos.bfhasta);
            var bmaterno	=	((typeof(datos.bmaterno)    == 'undefined' || datos.bmaterno == null) ? '' : datos.bmaterno);
            var bnombre		=	((typeof(datos.bnombre)    == 'undefined' || datos.bnombre == null) ? '' : datos.bnombre);
            var bpaterno	=	((typeof(datos.bpaterno)    == 'undefined' || datos.bpaterno == null) ? '' : datos.bpaterno);
            var oexpedido	=	((typeof(datos.oexpedido)    == 'undefined' || datos.oexpedido == null) ? '' : datos.oexpedido);

            //bapcasada,bci,bfdesde,bfhasta,bmaterno,bnombre,bpaterno,oexpedido

            console.log(bapcasada, " - ", bci, " - ", bfdesde, " - ",bfhasta, " - ",bmaterno, " - ",bnombre, " - ",bpaterno, " - ",oexpedido);

            switch(servicio) {
                //LISTAR DIFUNTO
                case "listar_df":
                        return $soap.post(base_url,url_metodo, {
                            Nombre:bnombre,
                            Paterno:bpaterno,
                            Materno:bmaterno,
                            ApellidoCasada:bapcasada,
                            Fecha1:bfdesde,
                            Fecha2:bfhasta,
                            CI_fallecido:bci
                        });
                    break;
                case "ListarDifuntos2":
                        return $soap.post(base_url,url_metodo, {
                            Nombre:bnombre,
                            Paterno:bpaterno,
                            Materno:bmaterno,
                            ApellidoCasada:bapcasada,
                            Fecha1:bfdesde,
                            Fecha2:bfhasta,
                            CI_fallecido:bci
                        });
                    break;
                case "ListarDifuntos3":
                        return $soap.post(base_url,url_metodo, {
                            Nombre:bnombre,
                            Paterno:bpaterno,
                            Materno:bmaterno,
                            ApellidoCasada:bapcasada,
                            Fecha1:bfdesde,
                            Fecha2:bfhasta,
                            CI_fallecido:bci
                        });
                    break;
                case "seleccionar_df":
                    console.log("DATOS SELECCIONAR: ", datos);
                    var accion      = 'A';
                    var tipo        = datos[0].tipo;
                    var idfallecido = datos[0].id_fallecido;
                    var fechamuerte = datos[0].fecha_registro;
                    return $soap.post(base_url,url_metodo, {accion:accion,tipo:tipo,id_fallecido:idfallecido,fecha_muerte:fechamuerte});
                    break;
                case "imprmir_solicitud":
                    var idfum        = datos.idfum;
                    var cisolicitud  = datos.rci;
                    return $soap.post(base_url,url_metodo, {ci:cisolicitud,Idfum:idfum});
                    break;
                case "generar_pdf_certificado":
                    console.log("ID TRAMITE: ", datos.idnrotramite);
                    console.log("base url: ", base_url);
                    console.log("url metodo ", url_metodo);
                    var nrotramite        = datos.idnrotramite;
                    //return $soap.post(base_url,url_metodo, {codigo: 'QHAkemQf'});
                    return $soap.post(base_url,url_metodo, {codigo: nrotramite});
                    break;
                case "listar_pdf_certificado":
                    var nrotramite        = datos.idfum;
                    return $soap.post(base_url,url_metodo, {idFUM: nrotramite});
                    break;
                case "generar_certificado":
                    console.log("DATOS SELECCIONAR CERTIFICADO : ", datos);

                    var id_solicitud    =   ((typeof(datos.idsolicitud)     == 'undefined' || datos.idsolicitud == null) ? 0 : datos.idsolicitud);
                    var id_nro_tramite  =   ((typeof(datos.idnrotramite)    == 'undefined' || datos.idnrotramite == null) ? '' : datos.idnrotramite);
                    var nombre          =   ((typeof(datos.nnombre)         == 'undefined' || datos.nnombre == null) ? '' : datos.nnombre);
                    var paterno         =   ((typeof(datos.npaterno)        == 'undefined' || datos.npaterno == null) ? '' : datos.npaterno);
                    var materno         =   ((typeof(datos.nmaterno)        == 'undefined' || datos.nmaterno == null) ? '' : datos.nmaterno);
                    var genero          =   ((typeof(datos.ngenero)         == 'undefined' || datos.ngenero == null) ? '' : datos.ngenero);
                    var nacionalidad    =   ((typeof(datos.nnacionalidad)   == 'undefined' || datos.nnacionalidad == null) ? '' : datos.nnacionalidad);
                    var edad            =   ((typeof(datos.edad)            == 'undefined' || datos.edad == null) ? 0 : datos.edad);
                    var profesion       =   ((typeof(datos.nprofesion)      == 'undefined' || datos.nprofesion == null) ? '' : datos.nprofesion);
                    var estado_civil    =   ((typeof(datos.nestado_civil)   == 'undefined' || datos.nestado_civil == null) ? '' : datos.nestado_civil);
                    var provincia       =   ((typeof(datos.nprovincia)      == 'undefined' || datos.nprovincia == null) ? '' : datos.nprovincia);
                    var causamuerte     =   ((typeof(datos.ncausamuerte)    == 'undefined' || datos.ncausamuerte == null) ? '' : datos.ncausamuerte);
                    var medico          =   ((typeof(datos.nmedico)         == 'undefined' || datos.nmedico == null) ? '' : datos.nmedico);
                    var libro           =   ((typeof(datos.nlibro)          == 'undefined' || datos.nlibro == null) ? '' : datos.nlibro);
                    var folio           =   ((typeof(datos.nfolio)          == 'undefined' || datos.nfolio == null) ? '' : datos.nfolio);
                    var folio           =   ((typeof(datos.nfolio)          == 'undefined' || datos.nfolio == null) ? '' : datos.nfolio);
                    var partida         =   ((typeof(datos.npartida)        == 'undefined' || datos.npartida == null) ? '' : datos.npartida);
                    var distrito        =   ((typeof(datos.ndistrito)       == 'undefined' || datos.ndistrito == null) ? '' : datos.ndistrito);
                    var fechamuerte     =   ((typeof(datos.nfechamuerte)    == 'undefined' || datos.nfechamuerte == null) ? '' : datos.nfechamuerte);
                    var fila            =   1;
                    var numero          =   1;
                    var idFum           =   ((typeof(datos.idfum)           == 'undefined' || datos.idfum == null) ? 0 : datos.idfum);
                    var localidad       =   ((typeof(datos.nlocalidad)      == 'undefined' || datos.nlocalidad == null) ? 0 : datos.nlocalidad);
                    var registrocivil   =   ((typeof(datos.nregistrocivil)  == 'undefined' || datos.nregistrocivil == null) ? 0 : datos.nregistrocivil);


                    if((id_solicitud && id_solicitud >0)  && id_nro_tramite && (idFum && idFum >=0) && (edad && edad >= 0) && (fila && fila >=0 ) && (numero && numero >= 0)){
                        return $soap.post(base_url,url_metodo, {
                            id_nro_tramite: 	id_nro_tramite,
                            id_solicitud: 		id_solicitud,
                            idFum: 				idFum,
                            tipo: 				"1",
                            nombre_f: 			nombre.toUpperCase(),
                            primer_apellido_f: 	paterno.toUpperCase(),
                            segundo_apellido_f: materno.toUpperCase(),
                            sexo: 				genero,
                            nacionalidad: 		nacionalidad.toUpperCase(),
                            edad: 				edad,
                            profesion: 			profesion,
                            estado_civil: 		estado_civil,
                            provincia: 			provincia,
                            localidad: 			localidad,
                            causa_muerte: 		causamuerte,
                            medico: 			medico.toUpperCase(),
                            oficial: 			registrocivil,
                            libro: 				libro,
                            folio: 				folio,
                            partida: 			partida,
                            distrito: 			distrito,
                            fecha_defuncion: 	fechamuerte,
                            domicilio: 			"",
                            procedencia: 		"",
                            cuartel: 			"1",
                            fila: 				fila,
                            numero: 			numero,
                            raza: 				"1",
                            cod_qr:				""
                        });
                    }else{
                        alert("Error en la cadena de entrada !!!");
                    }
                    break;
            }
        }
    }
}]);

//Servicio actualizacion de logs
app.service('registroLog', function(DreamFactory,CONFIG){
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var aLog = {};
    this.almacenarLog = function(sIdUsuario, sIdCiudadano, sIdFormulario, sEvento){
        aLog = {
            'lgs_usr_id' : sIdUsuario,
            'lgs_dtspsl_id': sIdCiudadano,
            'lgs_frm_id': sIdFormulario,
            'lgs_evento' : sEvento,
            'lgs_registrado' : fechactual,
            'lgs_modificado' : fechactual
        };
        var datosLog = {
            table_name:"_bp_logs_eventos",
            body:aLog
        };
        //servicio insertar usuarios
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(datosLog);
        obj.success(function(data){
            console.log("Registro almacenado");
        })
        .error(function(data){
            console.log("Error al almacenar registro");
        });
    }
});

app.directive('uploaderModel', ["$parse", function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs)
        {
            iElement.on("change", function(e)
            {
                $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
            });
        }
    };
}]);

///servicio para q funcione el upload
app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('files', file);
        $http.post(uploadUrl + file.name + "?app_name=todoangular", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);

/*COMPLEMENTO*/
app.factory("wsGenesisPubFondoProduc", ['$soap',function($soap){
    var base_url = base_url_swpubfondoLicencia;
    return {
        datosfaltantes: function(datos){
            console.log("DATOS FALTANTES DE PRODUCCION:", datos);
            var dataFaltantes   =   {
                                        idActividadEconomica: datos.f01_id_actividad_economica,
                                        tipo : datos.tipoA

            };
            console.log("PRODUCCION: ", dataFaltantes);
            return $soap.post(base_url,"datosfaltantes", dataFaltantes);
        }
    }
}]);

app.factory("wsGenesisPubFondoB", ['$soap',function($soap){
    var base_url = base_url_swpubfondoLicencia;
    return {
        datosfaltantes: function(datos){
            console.log("DATOS FALTANTES DE PRODUCCION2:", datos);
            var dataFaltantesB   =   {
                                        idActividadEconomica: datos.id_actividad_baja,
                                        tipo : datos.tipoB
            };
            console.log("PRODUCCION2: ", dataFaltantesB);
            return $soap.post(base_url,"datosfaltantes", dataFaltantesB);
        }
    }
}]);


app.controller('NavCtrl',['$scope', 'DreamFactory','$http','$rootScope','sessionService','CONFIG', '$location', function ($scope, DreamFactory, $http, $rootScope, sessionService,CONFIG,$location) {
    "use strict";

    //funcion listarMenu
    var urlSalud = "http://192.168.5.248:9091/wsIf";
    //var urlSalud = "http://192.168.6.57:91/wsIf";
    var urlComp;
    var dataResp;
    var dataParams;
    var typeCall;
    function ejecutarAjax2(vUrlComp, vTypeCall, vDataCall, vFunctionResp) {
        $.ajax({
          type: vTypeCall,
          url: urlSalud + vUrlComp,
          data: vDataCall,
          async: false,
          success: function(response) {
            dataResp = JSON.stringify(response);
            vFunctionResp(dataResp);
          },
          error: function (response, status, error) {
            dataResp = "{\"error\":{\"message\":\""+response.responseText+"\",\"code\":700}}";
            vFunctionResp(dataResp);
          }
        });
        return dataResp;
    };

    function prcmenu() {
        this.idusuario;
    };

    prcmenu.prototype.obtMenu = function (functionResp) {
        var urlComLogin = "/getMenu";
        var typeCallLogin = "post";
        var dataParamsLogin = {
            "idusr":this.idusuario
        };
        ejecutarAjax2(urlComLogin, typeCallLogin, dataParamsLogin, functionResp);
    };

    $scope.generarMenu = function(){
        var objmenu         =   new prcmenu();
        objmenu.idusuario   =   sessionService.get('IDUSUARIO');

        objmenu.obtMenu(function(resultado){
            var results = JSON.parse(resultado);
            if (!results.error) {
                    if(Object.keys(results).length > 0){
                        //Generar el json correcto para el menu
                        var sgrupo = "";
                        var lstGrupos = [];
                        var lstSubGrupo = [];
                        var j=0;
                        console.log("RESULTADO 123: ", results);
                        results =   results.success.data;
                        $.each(results, function(key, value){
                            var lstOpciones = [];
                            var sContenido = value["contenido"].replace("../", "");
                            sContenido = sContenido.replace(/\//gi, "|");
                            lstOpciones[0] = {};
                            lstOpciones[0]["id_opcion"] = value["idopcion"];
                            lstOpciones[0]["opcion"] = value["opcion"];
                            lstOpciones[0]["contenido"] = sContenido;
                            var sOpciones = JSON.stringify(lstOpciones);
                            var sOpciones = sOpciones.substring(1, sOpciones.length)
                            var sOpciones = sOpciones.substring(0, sOpciones.length-1);
                            if(sgrupo != value["grp"]){
                                if(sgrupo != ""){
                                    lstSubGrupo = [];
                                }
                                lstGrupos[j] = {};
                                lstGrupos[j]["id_grupo"] = value["idgrp"];
                                lstGrupos[j]["grupo"] = value["grp"];
                                lstGrupos[j]["sub_categories"] = lstOpciones;
                                sgrupo = value["grp"];
                                j = j + 1;
                            }
                            lstGrupos[j-1]["sub_categories"] = lstSubGrupo;
                            lstSubGrupo.push(sOpciones);
                        });
                        var listarMenu = JSON.stringify(lstGrupos);
                        listarMenu = listarMenu.replace(/\[\"/gi, "[");
                        listarMenu = listarMenu.replace(/}","{/gi, "},{");
                        listarMenu = listarMenu.replace(/\"\]/gi, "]");
                        listarMenu = listarMenu.replace(/\\"/gi, '"');
                        $scope.categories = JSON.parse(listarMenu);
                    }else{
                        $scope.msg = "Error en usuario y/o contraseña";
                        $location.path('');
                    }
            } else {
            }
        });
    };

    //Workspaces
    $scope.cargarWpIf = function(idWp, nombreWp){
        sessionService.set('WS_ID', idWp);
        sessionService.set('WS_NOMBRE', nombreWp);
        $location.path('formularios|misCasos|index.html');
        $rootScope.$broadcast('inicializarGetDatosGrilla', '');
        $scope.stituloWs  = nombreWp;
    };

    $scope.generarWp = function(){
        var wspce           =   JSON.parse(localStorage.getItem('wkSpace'));
        $scope.workspacesIf =   wspce;
        if($scope.workspacesIf.length > 0){
            sessionService.set('WS_ID', $scope.workspacesIf[0].ws_id);
            $scope.stituloWs  =   $scope.workspacesIf[0].ws_nombre;
        }
    };
    //al realizar f5
    $scope.$on('api:ready',function(){
        $scope.generarMenu();
        $scope.generarWp();
    });
    $scope.inicioMenu = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.generarMenu();
            $scope.generarWp();
        }
    };
}]);

app.config(['$routeProvider',
  function ($routeProvider) {
        $default = '../autenticacion/index.html';
        //$ruta = '../administracion/usuarios.html';
        $routeProvider.
        when('/login', {
            title: 'Login',
            templateUrl: 'partials/login.html',
            controller: 'authCtrl'
        })
            .when('/logout', {
                title: 'Logout',
                templateUrl: 'partials/login.html',
                controller: 'logoutCtrl'
            })
            .when('/signup', {
                title: 'Signup',
                templateUrl: 'partials/signup.html',
                controller: 'authCtrl'
            })
            .when('/registro', {
                title: 'Registro',
                templateUrl: '../registro_ciudadano/registro/index.html',
                controller: 'authCtrl'
            })
            .when('/dashboard', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                controller: 'authCtrl'
            })
            .when('/', {
                title: 'Login',
                templateUrl: 'partials/login.html',
                controller: 'authCtrl',
                role: '0'
            })
            .when('/:name', {
                    templateUrl: 'partials/blank.html',
                    controller: PagesController
                })
            .otherwise({
                    templateUrl: 'partials/nofound.html'
            });
  }])
    .run(function ($rootScope, $location, Data, sessionService,CONFIG,editableOptions) {
        editableOptions.theme = 'bs3';
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            $rootScope.usuario = sessionService.get('IDUSUARIO');
            $rootScope.usRol = sessionService.get('US_ROL');
            $rootScope.usNombre = sessionService.get('US_NOMBRE');
            $rootScope.usPaterno = sessionService.get('US_PATERNO');
            $rootScope.usMaterno = sessionService.get('US_MATERNO');
            if ($rootScope.usuario) {
                $rootScope.nombre = sessionService.get('USUARIO');
            } else {
                if(next.originalPath != "/registro"){
                    $location.path("");
                }
            }
        });
    });

function PagesController($scope, $http, $route, $routeParams, $compile) {
    var cadena = $routeParams.name;
    var res = cadena.replace(/\|/g, "/");
    //console.log(cadena);
    //console.log(res);
    var direccion = "../"+res;
    $route.current.templateUrl = direccion;
    $http.get($route.current.templateUrl).then(function(msg) {
        $('#ng-view').html($compile(msg.data)($scope));
    });
}

PagesController.$inject = ['$scope', '$http', '$route', '$routeParams', '$compile'];
