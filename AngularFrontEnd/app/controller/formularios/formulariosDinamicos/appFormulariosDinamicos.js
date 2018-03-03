app.controller('formulariosDinamicosController', function ($scope,$location,$route,$rootScope,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.errors = {};
    $scope.reporteEstado = false;
    $scope.tabReporteEstado = true;
    $scope.panelVerCampos = false;
    var dimension = 0;
    $scope.objCampos = {};
    var datos = [];
    var indice = 0;
    var vectorIndice = [];
    $scope.getCamposFormulario = function(){
        $.blockUI();
        var resOpcion = {
            function_name: "sp_lst_camposformulario",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
            $scope.obtCampoFormulario = response;
            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };

    $scope.adicionarFormularioDinamico = function(datosfd){
        $.blockUI(); 
        var formularioD = {}; 
        formularioD['campo_nombre'] = datosfd.cnombre;
        formularioD['campo_descripcion'] = '[]';
        formularioD['campo_registrado'] = fechactual;
        formularioD['campo_modificado'] = fechactual;
        formularioD['campo_usr_id'] = sessionService.get('IDUSUARIO');
        formularioD['campo_estado'] = 'A';
        var resformularioD = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioD};      
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resformularioD);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $.unblockUI(); //cerrar la mascara 
            $scope.getCamposFormulario();  
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarFormularioDinamico = function(datosfd){
        $.blockUI(); 
        var formularioD = {};  
        formularioD['campo_nombre'] = datosfd.cnombre;
        formularioD['campo_modificado'] = fechactual;
        formularioD['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioD = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioD};      
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioD);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI(); //cerrar la mascara 
            $scope.getCamposFormulario();  
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };

    $scope.modificarFormularioDinamico = function(datosfd){
        $.blockUI();
        var formularioD = {}; 
        formularioD['campo_nombre'] = datosfd.cnombre;
        formularioD['campo_modificado'] = fechactual;
        formularioD['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioD = {"table_name":"_fr_formulario_dinamico", 
                        "body":formularioD,
                        "id" : datosfd.cid}; 
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioD);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI(); 
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })   
    };

    $scope.eliminarFormularioDinamico = function(datosfd){
        $.blockUI();
        var formularioD = {}; 
        formularioD['campo_modificado'] = fechactual;
        formularioD['campo_usr_id'] = sessionService.get('IDUSUARIO');
        formularioD['campo_estado'] = 'B';
        var resformularioD = {"table_name":"_fr_formulario_dinamico", 
                        "body":formularioD,
                        "id" : datosfd.cid}; 
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioD);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $.unblockUI();
            $scope.getCamposFormulario();  
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };

    $scope.limpiar = function(){
        $scope.datosfd = '';
        $scope.boton = "new";
        $scope.desabilitado = false;
        $scope.tituloP = "Registrar Formulario Dinámico";
    };
    $scope.modificarFormularioDinamicoCargar = function(camposFormulario){
        $scope.datosfd = camposFormulario;
        $scope.boton = "upd";
        $scope.desabilitado = false;
        $scope.tituloR = "Modificar Formulario Dinámico";
    };
    $scope.eliminarFormularioDinamicoCargar = function(camposFormulario){
        $scope.datosfd = camposFormulario;
        $scope.desabilitado = true;
        $scope.boton = "del";
        $scope.tituloR = "Eliminar Formulario Dinámico";
    };

    $scope.getCampos = function(campo){
        ind = 0;
        $scope.indices = []; 
        $scope.seleccionar = [];
        $.blockUI();
        $scope.idfd = campo;
        $scope.panelVerCampos = true;
        var resCampos = {
            "procedure_name":"sp_lst_campos",
            "body":{
                "params": [
                    {
                        "name": "idcampo",
                        "value": campo
                    }
                ]
            }
        }; 
        //servicio listar roles 
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resCampos)
        .success(function (results) {
            if (results.length>0) {
                if (results[0].sp_lst_campos != '') {
                    //console.log('resultado--->',results[0].sp_lst_campos);
                datos = JSON.parse(results[0].sp_lst_campos);
                var vectorCampos = [];
                angular.forEach(datos,function(celda, fila){
                    var objetoCampo = {};
                    objetoCampo.titulo = celda['titulo'];
                    objetoCampo.campo = celda['campo'];
                    objetoCampo.tipo = celda['tipo'];
                    objetoCampo.posicion = celda['posicion'];
                    objetoCampo.columnas = celda['columnas'];
                    objetoCampo.estado = celda['estado'];
                    objetoCampo.orden = celda['orden'];
                    if (celda['tipo'] == 'CBO') {
                        objetoCampo.tipo_llenado = celda['tipo_llenado'];
                        if(celda['tipo_llenado'] == 'datos'){
                        objetoCampo.data = JSON.stringify(celda['data']);
                        }
                        else{
                            objetoCampo.data = celda['data'];
                        };
                    };
                    vectorCampos[fila] = objetoCampo;
                });
                
                $scope.obtCampos = vectorCampos;
                dimension = datos.length-1;
                $.unblockUI(); 
                } else{
                $scope.obtCampos = '';
                datos = [];
                dimension = datos.length-1;
                $.unblockUI();  
                };
            }
        }).error(function(error) {
            $scope.errors["error_roles"] = error;            
        });        
    };

    $scope.adicionarCampos = function(datosCampo){
        $.blockUI();
        var formularioCampos = {}; 
        $scope.objCampos.titulo = datosCampo.titulo;
        $scope.objCampos.campo = datosCampo.campo;
        $scope.objCampos.tipo = datosCampo.tipo;
        $scope.objCampos.posicion = datosCampo.posicion;
        $scope.objCampos.columnas = datosCampo.columnas;
        $scope.objCampos.estado = datosCampo.estado;
        $scope.objCampos.orden = datosCampo.orden;
        if (datosCampo.tipo == 'CBO') {
            $scope.objCampos.tipo_llenado = datosCampo.tipo_llenado;
            if (datosCampo.tipo_llenado == 'datos') {
                datosData = JSON.parse(datosCampo.data);
                $scope.objCampos.data = datosData;
            }
            else{
                $scope.objCampos.data = datosCampo.data;
            };
        }
        dimension = dimension + 1;
        datos[dimension] = $scope.objCampos;
        var descripcion = JSON.stringify(datos);  
        formularioCampos['campo_descripcion'] = descripcion;
        formularioCampos['campo_modificado'] = fechactual;
        formularioCampos['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioCampos = {"table_name":"_fr_formulario_dinamico", 
                        "body":formularioCampos,
                        "id" : $scope.idfd}; 
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioCampos);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $scope.getCampos($scope.idfd); 
            $.unblockUI(); //cerrar la mascara 
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
            $.unblockUI();
        })
    };

    $scope.modificarCampos = function(datosCampo){
        $.blockUI();
        var formularioCampos = {};
        var vectorCampos2 = [];
        for (var i = 0; i <= datos.length-1; i++) {
            if (i != $scope.indice) {
                vectorCampos2[i] = datos[i];
            } else{
                var objetoCampo2 = {};
                objetoCampo2.titulo = datosCampo.titulo;
                objetoCampo2.campo = datosCampo.campo;
                objetoCampo2.tipo = datosCampo.tipo;
                objetoCampo2.posicion = datosCampo.posicion;
                objetoCampo2.columnas = datosCampo.columnas;
                objetoCampo2.estado = datosCampo.estado;
                objetoCampo2.orden = datosCampo.orden;
                if (datosCampo.tipo == 'CBO') {
                    objetoCampo2.tipo_llenado = datosCampo.tipo_llenado;
                    if (datosCampo.tipo_llenado == 'datos') {
                        datosData = JSON.parse(datosCampo.data);
                    objetoCampo2.data = datosData;
                    }
                    else{
                    objetoCampo2.data = datosCampo.data;
                    };
                }
                vectorCampos2[i] = objetoCampo2;
            };
        };
        var descripcion = JSON.stringify(vectorCampos2);  
        formularioCampos['campo_descripcion'] = descripcion;
        formularioCampos['campo_modificado'] = fechactual;
        formularioCampos['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioCampos = {"table_name":"_fr_formulario_dinamico", 
                        "body":formularioCampos,
                        "id" : $scope.idfd};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioCampos);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $scope.getCampos($scope.idfd); 
            $.unblockUI(); //cerrar la mascara 
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
            $.unblockUI();
        })
    };

    $scope.eliminarCampos = function(datosCampo){
        $.blockUI();
        var formularioCampos = {};
        datos.splice($scope.indice, 1);
        var descripcion = JSON.stringify(datos); 
        formularioCampos['campo_descripcion'] = descripcion;
        formularioCampos['campo_modificado'] = fechactual;
        formularioCampos['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioCampos = {"table_name":"_fr_formulario_dinamico", 
                        "body":formularioCampos,
                        "id" : $scope.idfd};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioCampos);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $scope.getCampos($scope.idfd); 
            $.unblockUI(); //cerrar la mascara 
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
            $.unblockUI();
        })
    };

    $scope.seleccionar = [];
    $scope.indices = [];
    var ind = 0;

    $scope.check = function(seleccionado, index){
        if(seleccionado){
            $scope.seleccionar.push(datos[index]);
            $scope.indices.push(index);
            ind++;
        } else {
            for(var i=0 ; i < $scope.seleccionar.length; i++) {
                if(index == $scope.indices[i]){
                    $scope.seleccionar.splice(i,1);
                    $scope.indices.splice(i,1);
                }
            }      
        }
        console.log("el vector copiado  ",$scope.seleccionar,"indicesss   ",$scope.indices);
    };
    
    $scope.clonarCampos = function(idf){
        $.blockUI();
        var formularioCampos = {}; 
        console.log("id form   ",idf);
        var campoClonado = JSON.stringify(datos); 
        if (idf > 0 && $scope.seleccionar.length >0) {
            formularioCampos['campo_descripcion'] = campoClonado;
        formularioCampos['campo_modificado'] = fechactual;
        formularioCampos['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioCampos = {"table_name":"_fr_formulario_dinamico", 
                        "body":formularioCampos,
                        "id" : idf}; 
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioCampos);
        obj.success(function(data){
            sweet.show('', 'Registro copiado', 'success');
            $scope.datosCombo='';
            $scope.getCampos($scope.idfd);
            ind = 0;
            $scope.indices = []; 
            $scope.seleccionar = [];
            $.unblockUI(); //cerrar la mascara 
        })
        .error(function(data){
            sweet.show('', 'Registro no copiado', 'error');
            $.unblockUI();
        })
            console.log("el vector copiado  ",$scope.seleccionar,"indicesss   ",$scope.indices);
        }else{
            sweet.show('', 'Seleccione campo y formulario', 'warning');
            $.unblockUI();
        };  
    };




    $scope.limpiarCampos = function(){
        $scope.datosCampo = '';
        $scope.boton = "new";
        $scope.desabilitado = false;
        $scope.tituloP = "Añadir Campo";
    };
    $scope.modificarCamposCargar = function(campos,indice){
        $scope.indice = indice;
        console.log("este es el vector     ",datos,"  dimension   ",dimension,"  indice a modificar  ",$scope.indice);
        $scope.datosCampo = campos;
        $scope.boton = "upd";
        $scope.desabilitado = false;
        $scope.tituloR = "Modificar Campo";
    };
    $scope.eliminarCamposCargar = function(campos,indice){
        $scope.indice = indice;
        console.log("este es el vector     ",datos,"  dimension   ",dimension,"  indice a eliminar  ",$scope.indice);
        $scope.datosCampo = campos;
        $scope.desabilitado = true;
        $scope.boton = "del";
        $scope.tituloR = "Eliminar Campo";
    };




    $scope.$on('api:ready',function(){
        $scope.getCamposFormulario()   
    });
    $scope.inicioFormularioDinamico = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getCamposFormulario()
        }
    }; 

});