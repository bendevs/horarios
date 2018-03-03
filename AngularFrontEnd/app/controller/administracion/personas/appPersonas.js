app.controller('personasController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet) {
    var fecha= new Date();
    var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    var size = 10;
    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };
    //listar personas
    $scope.getPersonas = function(){
        $.blockUI();
        var resPersona = {
            "procedure_name":"personaslst"
        };
        //servicio listar personas
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resPersona);
        obj.success(function (response) {
            $scope.obtPersonas = response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaPersonas = new ngTableParams({
                page: 1,          
                count: 10,
                filter: {},
                sorting: {}      
            }, {
                total: $scope.obtPersonas.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.obtPersonas, params.filter()) :
                    $scope.obtPersonas;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.obtPersonas;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
                }
            });
            $.unblockUI();            
        })
        obj.error(function(error) {
            $scope.errors["error_persona"] = error;            
        });        
    };
    //estados
    $scope.getEstados = function(){
        var resEstadoCivil = {
            "procedure_name":"stdcivilst"
        };        
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resEstadoCivil)
        .success(function (response) {
            $scope.estados = response;           
        }).error(function(error) {
            $scope.errors["error_reg_civil"] = error;            
        });
    }
    $scope.adicionarPersona = function(datosPersona){
        $.blockUI();
        var persona = {};
        var fechaNacimiento=datosPersona.prsfecnmt.getFullYear() + "-" + datosPersona.prsfecnmt.getMonth() + "-" + datosPersona.prsfecnmt.getDate() + " " + datosPersona.prsfecnmt.getHours() + ":" + datosPersona.prsfecnmt.getMinutes() + ":" + datosPersona.prsfecnmt.getSeconds();
        persona['prs_nombres'] = datosPersona.prsNom; 
        persona['prs_id_estado_civil'] = datosPersona.prsStcvlId;
        persona['prs_ci'] = datosPersona.prsCi;
        persona['prs_paterno'] = datosPersona.prsPat;
        persona['prs_materno'] = datosPersona.prsMat;
        persona['prs_direccion'] = datosPersona.prsDireccion;
        persona['prs_telefono'] = datosPersona.prsTelefono;
        persona['prs_sexo'] = datosPersona.prsSexo;
        persona['prs_fec_nacimiento'] = fechaNacimiento;

        if(datosPersona.prsDireccion2)
        {   persona['prs_direccion2'] = datosPersona.prsDireccion2;   }
        else{   persona['prs_direccion2'] = '';    }

        if(datosPersona.prsTelefono2)
        {   persona['prs_telefono2'] = datosPersona.prsTelefono2;   }
        else{   persona['prs_telefono2'] = '';    }

        if(datosPersona.prsCelular)
        {   persona['prs_celular'] = datosPersona.prsCelular;   }
        else{   persona['prs_celular'] = '';    }

        if(datosPersona.prsEmpTel)
        {   persona['prs_empresa_telefonica'] = datosPersona.prsEmpTel;   }
        else{   persona['prs_empresa_telefonica'] = '';    }

        if(datosPersona.prsCorreo)
        {   persona['prs_correo'] = datosPersona.prsCorreo;   }
        else{   persona['prs_correo'] = '';    }

        persona['prs_id_archivo_cv'] = '1';
        persona['prs_registrado'] = fechactual;
        persona['prs_modificado'] = fechactual;
        persona['prs_usr_id'] = sessionService.get('IDUSUARIO');
        persona['prs_estado'] = 'A';
        
        var resPersona = {
            table_name:"_bp_personas",
            body:persona
        };
        //servicio insertar personas
        var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(resPersona);
        obj.success(function(data){
            $scope.getEstados();
            
            $.unblockUI(); 
            sweet.show('', 'Registro insertado', 'success');
            $route.reload();
            $scope.getPersonas();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };
    $scope.modificarPersona = function(prsId,datosPersona){
        $.blockUI();
        var persona = {};
        if(datosPersona.prsfecnmt.getFullYear)
        {
            console.log(datosPersona.prsfecnmt.getMonth()+1);
            var fechaNacimiento=datosPersona.prsfecnmt.getFullYear() + "-" + (datosPersona.prsfecnmt.getMonth()+1) + "-" + datosPersona.prsfecnmt.getDate() + " " + datosPersona.prsfecnmt.getHours() + ":" + datosPersona.prsfecnmt.getMinutes() + ":" + datosPersona.prsfecnmt.getSeconds();
        }
        else{
            var fechaNacimiento=datosPersona.prsfecnmt;
        }
        persona['prs_id_estado_civil'] = datosPersona.prsStcvlId;
        persona['prs_ci'] = datosPersona.prsCi;
        persona['prs_nombres'] = datosPersona.prsNom;
        persona['prs_paterno'] = datosPersona.prsPat;
        persona['prs_materno'] = datosPersona.prsMat;
        persona['prs_direccion'] = datosPersona.prsDireccion;
        persona['prs_direccion2'] = datosPersona.prsDireccion2;
        persona['prs_telefono'] = datosPersona.prsTelefono;
        persona['prs_telefono2'] = datosPersona.prsTelefono2;
        persona['prs_celular'] = datosPersona.prsCelular;
        persona['prs_empresa_telefonica'] = datosPersona.prsEmpTel;
        persona['prs_correo'] = datosPersona.prsCorreo;
        persona['prs_sexo'] = datosPersona.prsSexo;
        persona['prs_fec_nacimiento'] = fechaNacimiento;
        persona['prs_modificado'] = fechactual;
        persona['prs_usr_id'] = sessionService.get('IDUSUARIO');
        var resPersona = {
            table_name:"_bp_personas",
            id:prsId,
            body:persona
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resPersona);
        obj.success(function(data){
            $scope.getEstados();
            $.unblockUI(); 
            sweet.show('', 'Registro modificado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };
    $scope.eliminarPersona = function(prsId){
        $.blockUI();
        var persona = {};
        persona['prs_modificado'] = fechactual;
        persona['prs_estado'] = 'B';
        persona['prs_usr_id'] = sessionService.get('IDUSUARIO');

        var resPersona = {
            table_name:"_bp_personas",
            id:prsId,
            body:persona
        };
        //servicio eliminar personas
        var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(resPersona);
        obj.success(function(data){
            $scope.getEstados();
            $.unblockUI(); 
            sweet.show('', 'Registro eliminado', 'success');
            $route.reload();
        })
        .error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    }; 
    $scope.modificarPersonaCargar = function(persona){
        $scope.desabilitado=false;
        $scope.datosPersona = persona;
        $scope.boton="upd";
        $scope.titulo="Modificar Personas";
    };
    $scope.eliminarPersonaCargar = function(persona){
        $scope.desabilitado=true;
        $scope.datosPersona = persona;
        $scope.boton="del";
        $scope.titulo="Eliminar Personas";
    };
    $scope.limpiar = function(){
        $scope.datosPersona='';
        $scope.desabilitado=false;
        $scope.boton="new";
        $scope.titulo="Registro de Personas";
    };
    //iniciando el controlador
    $scope.$on('api:ready',function(){
        $scope.getPersonas();
        $scope.getEstados();
    });
    $scope.inicioPersonas = function () {
        if(DreamFactory.isReady()){
            $scope.getPersonas();
            $scope.getEstados();
        }
    };    
    
});
