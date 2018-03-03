app.controller('sProhibController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,FileUploader,$sce,fileUpload) {
    var fechas= new Date();
    var fechactual=fechas.getFullYear() + "-" + fechas.getMonth() + "-" + fechas.getDate() + " " + fechas.getHours() + ":" + fechas.getMinutes() + ":" + fechas.getSeconds();
    $scope.cambiarFile = function(obj, valor){
        var z = valor.split('\\');
        if(z[2]===undefined){
            $scope.datos[obj.name] = valor;
        }else{
            $scope.datos[obj.name] = z[2];
        }
        console.log(obj);
        console.log(valor);
        console.log($scope.datos);
    }; 
    $scope.guardarArchivo = function (fArchivo) {
        if(fArchivo.files.length > 0){
            nombreCampo = fArchivo.id;
            valorCampo = fArchivo.value;
            tipo = fArchivo.type;
           $scope.direccionvirtual= CONFIG.APIURL +"/files/semdes/prohibicion/" + $scope.nroregistro + "/";
            var direccion = fileUpload.uploadFileToUrl(fArchivo.files[0], $scope.direccionvirtual);
        }else{
            console.log("undefined");
        }
    };
    $scope.getRegistros = function(){
        $.blockUI();
        var resRegistro = {
            "procedure_name":"semdes.prohibicionlst"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRegistro);
        obj.success(function (response) {
            console.log(response);
            $scope.nroregistro = response.length + 1;
            $scope.obtRegistros = response;
            var data = response;   
            $scope.tablaRegistros = new ngTableParams({
                page: 1,          
                count: 10,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtRegistros.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtRegistros, params.filter()) :
                    $scope.obtRegistros;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtRegistros;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            });
            $.unblockUI();            
        })
        obj.error(function(error) {
            $.unblockUI(); 
            console.log(error);            
        });        
    };
    $scope.verImagen = function(imagen){
        console.log(imagen);
        $scope.archivo = imagen;
    }
    sumaFecha = function(d, fecha)
    {
        var fff = fecha.split("-");
        fecha = fff[2]+"/"+fff[1]+"/"+fff[0];
        var Fecha = new Date();
        var sFecha = fecha || (Fecha.getDate() + "/" + (Fecha.getMonth() +1) + "/" + Fecha.getFullYear());
        var sep = sFecha.indexOf('/') != -1 ? '/' : '-'; 
        var aFecha = sFecha.split(sep);
        var fecha = aFecha[2]+'/'+aFecha[1]+'/'+aFecha[0];
        fecha= new Date(fecha);
        fecha.setDate(fecha.getDate()+parseInt(d));
        var anno=fecha.getFullYear();
        var mes= fecha.getMonth()+1;
        var dia= fecha.getDate();
        mes = (mes < 10) ? ("0" + mes) : mes;
        dia = (dia < 10) ? ("0" + dia) : dia;
        var fechaFinal = anno+"-"+mes+"-"+dia;
        return (fechaFinal);
    }
    $scope.adicionarRegistro = function(datos){
        var registro = {};
        var fileee = document.getElementById('ter_doc_adj');
        if(fileee.files.length > 0){
            $scope.guardarArchivo(fileee);
            datos.ter_doc_adj_url = CONFIG.APIURL +"/files/semdes/prohibicion/" + $scope.nroregistro + "/" + datos.ter_doc_adj +"?app_name=todoangular";
        }else{
            console.log("ADICIONAR FILE undefined");
        }
        datos.def_ing = fechas;
        datos.fecha_fin = sumaFecha(datos.ter_plazo_prohib,fechas);
        datos.def_vict_edad = document.getElementById('def_vict_edad').value;
        registro['proh_datos'] = JSON.stringify(datos);
        registro['proh_registrado'] = fechactual;
        registro['proh_modificado'] = fechactual;
        registro['proh_estado'] = 'A';
        var resRegistro = {
            table_name:'semdes.def_prohibiciones',
            body:registro
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resRegistro);
        obj.success(function(data){
            $.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
            $route.reload();
            $scope.getRegistros();
        })
        .error(function(data){
            $.unblockUI(); 
            console.log(data);
            sweet.show('', 'Registro no insertado', 'error');
        })
    };
    $scope.modificarRegistro = function(prohid,datos){
        $scope.nroregistro = parseInt(prohid);        
        $scope.guardarArchivo(document.getElementById('ter_doc_adj'));
        datos.ter_doc_adj_url = CONFIG.APIURL +"/files/semdes/prohibicion/" + $scope.nroregistro + "/" + datos.ter_doc_adj +"?app_name=todoangular";
        datos.fecha_fin = sumaFecha(datos.ter_plazo_prohib,datos.def_ing);
        datos.def_vict_edad = document.getElementById('def_vict_edad').value;
        var registro = {};
        registro['proh_datos'] = JSON.stringify(datos);
        registro['proh_modificado'] = fechactual;
        var resRegistro = {
            table_name:'semdes.def_prohibiciones',
            id:prohid,
            body:registro
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resRegistro);
        obj.success(function(data){
            $.unblockUI(); 
            sweet.show('', 'Registro modificado', 'success');
            $route.reload();
            $scope.getRegistros();
        })
        .error(function(data){
            $.unblockUI(); 
            console.log(data);
            sweet.show('', 'Registro no modificado', 'error');
        })
    };
    $scope.eliminarRegistro = function(prohid){
        $.blockUI();
        var registro = {};
        registro['proh_modificado'] = fechactual;
        registro['proh_estado'] = 'B';

        var resRegistro = {
            table_name:"semdes.def_prohibiciones",
            id:prohid,
            body:registro
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resRegistro);
        obj.success(function(data){
            $.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            $route.reload();
        })
        .error(function(data){
            $.unblockUI(); 
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 
    $scope.modificarRegistroCargar = function(registro){
        tipo=registro.ter_sol_prohib;if (tipo=='1'){f_oculta_div('div_ter_t_prohib');f_oculta_div('div_ter_docjuz_prohib');f_oculta_div('div_ter_nrodocjuz_prohib');f_oculta_div('div_ter_femisen_prohib');f_oculta_div('div_ter_mun_prohib');f_oculta_div('div_ter_inst_prohib');f_oculta_div('div_ter_autsent_prohib');f_oculta_div('div_ter_quieninst_prohib');f_oculta_div('div_ter_respquien_prohib');f_muestra_div('div_ter_motivo_prohib');f_muestra_div('div_ter_plazo_prohib');f_muestra_div('div_ter_nna_prohib');f_muestra_div('div_def_vict_tipoiden');f_muestra_div('div_def_vict_ci');f_muestra_div('div_def_vict_exp');f_muestra_div('div_def_vict_otro');f_muestra_div('div_def_vict_gen');f_muestra_div('div_def_vict_pat');f_muestra_div('div_def_vict_mat');f_muestra_div('div_def_vict_nom');f_muestra_div('div_def_vict_fec_nac');f_muestra_div('div_def_vict_edad');f_muestra_div('div_ter_nomquien_prohib');f_muestra_div('div_def_denun_tipoiden');f_muestra_div('div_ter_telquien_prohib');f_muestra_div('div_ter_doc_adj');} if (tipo=='2'){f_oculta_div('div_ter_t_prohib');f_oculta_div('div_ter_docjuz_prohib');f_oculta_div('div_ter_nrodocjuz_prohib');f_oculta_div('div_ter_femisen_prohib');f_oculta_div('div_ter_mun_prohib');f_oculta_div('div_ter_inst_prohib');f_oculta_div('div_ter_autsent_prohib');f_oculta_div('div_ter_nomquien_prohib');f_muestra_div('div_ter_motivo_prohib');f_muestra_div('div_ter_plazo_prohib');f_muestra_div('div_ter_nna_prohib');f_muestra_div('div_def_vict_tipoiden');f_muestra_div('div_def_vict_ci');f_muestra_div('div_def_vict_exp');f_muestra_div('div_def_vict_gen');f_muestra_div('div_def_vict_pat');f_muestra_div('div_def_vict_mat');f_muestra_div('div_def_vict_nom');f_muestra_div('div_def_vict_fec_nac');f_muestra_div('div_def_vict_edad');f_muestra_div('div_def_denun_tipoiden');f_muestra_div('div_ter_respquien_prohib');f_oculta_div('div_ter_nomquien_prohib');f_muestra_div('div_ter_quieninst_prohib');f_muestra_div('div_ter_telquien_prohib');f_muestra_div('div_ter_doc_adj');} if (tipo=='3'){f_muestra_div('div_ter_respquien_prohib');f_oculta_div('div_ter_nomquien_prohib');f_oculta_div('div_def_denun_tipoiden');f_oculta_div('div_def_denun_ci');f_oculta_div('div_def_denun_exp');f_oculta_div('div_def_denun_otro');f_oculta_div('div_ter_quieninst_prohib');f_muestra_div('div_ter_motivo_prohib');f_muestra_div('div_ter_plazo_prohib');f_muestra_div('div_ter_nna_prohib');f_muestra_div('div_def_vict_tipoiden');f_muestra_div('div_def_vict_ci');f_muestra_div('div_def_vict_exp');f_muestra_div('div_def_vict_gen');f_muestra_div('div_def_vict_pat');f_muestra_div('div_def_vict_mat');f_muestra_div('div_def_vict_nom');f_muestra_div('div_def_vict_fec_nac');f_muestra_div('div_def_vict_edad');f_muestra_div('div_ter_telquien_prohib');f_muestra_div('div_ter_doc_adj');}
        tipo1 = registro.def_denun_tipoiden;if (tipo1=='1'){f_muestra_div('div_def_denun_ci');f_muestra_div('div_def_denun_exp');f_oculta_div('div_def_denun_otro');}if (tipo1=='2'){f_muestra_div('div_def_denun_ci');f_oculta_div('div_def_denun_exp');f_muestra_div('div_def_denun_otro');}if(tipo1=='3'){f_muestra_div('div_def_denun_ci');f_oculta_div('div_def_denun_exp');f_oculta_div('div_def_denun_otro');}
        tipo2 = registro.def_denun_exp;if (tipo2=='11'){f_muestra_div('div_def_denun_otro');}else{f_oculta_div('div_def_denun_otro');}
        tipo3 = registro.def_vict_tipoiden;if (tipo3=='1'){f_muestra_div('div_def_vict_ci');f_oculta_div('div_def_vict_exp');f_oculta_div('div_def_vict_otro');}if (tipo3=='2'){f_muestra_div('div_def_vict_ci');f_muestra_div('div_def_vict_exp');f_oculta_div('div_def_vict_otro');}if(tipo3=='3'){f_muestra_div('div_def_vict_ci');f_oculta_div('div_def_vict_exp');f_muestra_div('div_def_vict_otro');}
        registro.ter_plazo_prohib = parseInt(registro.ter_plazo_prohib);
        registro.ter_telquien_prohib = parseInt(registro.ter_telquien_prohib);
        registro.def_vict_ci = parseInt(registro.def_vict_ci);        
        $scope.desabilitado=false;
        $scope.datos = registro;
        $scope.boton="upd";
        $scope.titulo="Modificar Registro";
    };
    $scope.eliminarRegistroCargar = function(registro){
        tipo=registro.ter_sol_prohib;if (tipo=='1'){f_oculta_div('div_ter_t_prohib');f_oculta_div('div_ter_docjuz_prohib');f_oculta_div('div_ter_nrodocjuz_prohib');f_oculta_div('div_ter_femisen_prohib');f_oculta_div('div_ter_mun_prohib');f_oculta_div('div_ter_inst_prohib');f_oculta_div('div_ter_autsent_prohib');f_oculta_div('div_ter_quieninst_prohib');f_oculta_div('div_ter_respquien_prohib');f_muestra_div('div_ter_motivo_prohib');f_muestra_div('div_ter_plazo_prohib');f_muestra_div('div_ter_nna_prohib');f_muestra_div('div_def_vict_tipoiden');f_muestra_div('div_def_vict_ci');f_muestra_div('div_def_vict_exp');f_muestra_div('div_def_vict_otro');f_muestra_div('div_def_vict_gen');f_muestra_div('div_def_vict_pat');f_muestra_div('div_def_vict_mat');f_muestra_div('div_def_vict_nom');f_muestra_div('div_def_vict_fec_nac');f_muestra_div('div_def_vict_edad');f_muestra_div('div_ter_nomquien_prohib');f_muestra_div('div_def_denun_tipoiden');f_muestra_div('div_ter_telquien_prohib');f_muestra_div('div_ter_doc_adj');} if (tipo=='2'){f_oculta_div('div_ter_t_prohib');f_oculta_div('div_ter_docjuz_prohib');f_oculta_div('div_ter_nrodocjuz_prohib');f_oculta_div('div_ter_femisen_prohib');f_oculta_div('div_ter_mun_prohib');f_oculta_div('div_ter_inst_prohib');f_oculta_div('div_ter_autsent_prohib');f_oculta_div('div_ter_nomquien_prohib');f_muestra_div('div_ter_motivo_prohib');f_muestra_div('div_ter_plazo_prohib');f_muestra_div('div_ter_nna_prohib');f_muestra_div('div_def_vict_tipoiden');f_muestra_div('div_def_vict_ci');f_muestra_div('div_def_vict_exp');f_muestra_div('div_def_vict_gen');f_muestra_div('div_def_vict_pat');f_muestra_div('div_def_vict_mat');f_muestra_div('div_def_vict_nom');f_muestra_div('div_def_vict_fec_nac');f_muestra_div('div_def_vict_edad');f_muestra_div('div_def_denun_tipoiden');f_muestra_div('div_ter_respquien_prohib');f_oculta_div('div_ter_nomquien_prohib');f_muestra_div('div_ter_quieninst_prohib');f_muestra_div('div_ter_telquien_prohib');f_muestra_div('div_ter_doc_adj');} if (tipo=='3'){f_muestra_div('div_ter_respquien_prohib');f_oculta_div('div_ter_nomquien_prohib');f_oculta_div('div_def_denun_tipoiden');f_oculta_div('div_def_denun_ci');f_oculta_div('div_def_denun_exp');f_oculta_div('div_def_denun_otro');f_oculta_div('div_ter_quieninst_prohib');f_muestra_div('div_ter_motivo_prohib');f_muestra_div('div_ter_plazo_prohib');f_muestra_div('div_ter_nna_prohib');f_muestra_div('div_def_vict_tipoiden');f_muestra_div('div_def_vict_ci');f_muestra_div('div_def_vict_exp');f_muestra_div('div_def_vict_gen');f_muestra_div('div_def_vict_pat');f_muestra_div('div_def_vict_mat');f_muestra_div('div_def_vict_nom');f_muestra_div('div_def_vict_fec_nac');f_muestra_div('div_def_vict_edad');f_muestra_div('div_ter_telquien_prohib');f_muestra_div('div_ter_doc_adj');}
        tipo1 = registro.def_denun_tipoiden;if (tipo1=='1'){f_muestra_div('div_def_denun_ci');f_muestra_div('div_def_denun_exp');f_oculta_div('div_def_denun_otro');}if (tipo1=='2'){f_muestra_div('div_def_denun_ci');f_oculta_div('div_def_denun_exp');f_muestra_div('div_def_denun_otro');}if(tipo1=='3'){f_muestra_div('div_def_denun_ci');f_oculta_div('div_def_denun_exp');f_oculta_div('div_def_denun_otro');}
        tipo2 = registro.def_denun_exp;if (tipo2=='11'){f_muestra_div('div_def_denun_otro');}else{f_oculta_div('div_def_denun_otro');}
        tipo3 = registro.def_vict_tipoiden;if (tipo3=='1'){f_muestra_div('div_def_vict_ci');f_oculta_div('div_def_vict_exp');f_oculta_div('div_def_vict_otro');}if (tipo3=='2'){f_muestra_div('div_def_vict_ci');f_muestra_div('div_def_vict_exp');f_oculta_div('div_def_vict_otro');}if(tipo3=='3'){f_muestra_div('div_def_vict_ci');f_oculta_div('div_def_vict_exp');f_muestra_div('div_def_vict_otro');}
        registro.ter_plazo_prohib = parseInt(registro.ter_plazo_prohib);
        registro.ter_telquien_prohib = parseInt(registro.ter_telquien_prohib);
        registro.def_vict_ci = parseInt(registro.def_vict_ci);
        $scope.desabilitado=true;
        $scope.datos = registro;
        $scope.boton="del";
        $scope.titulo="Eliminar Registro";
    };
    $scope.limpiar = function(){
        $scope.datos='';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Nuevo registro de NNA";
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
        fechas = f.getFullYear() + '-' + mes + '-' + dia;
        document.getElementById('def_ing').value = fechas;        
    };
    //iniciando el controlador
    $scope.$on('api:ready',function(){
        $scope.getRegistros();
    });
    $scope.inicioRegistros = function () {
        if(DreamFactory.isReady()){
            $scope.getRegistros();
        }
    };    
    
});
