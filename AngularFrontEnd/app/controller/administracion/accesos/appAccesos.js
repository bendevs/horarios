/****************************/
app.controller('accesosControler',function ($scope,$rootScope,$route,$window,DreamFactory,ngTableParams,$filter,CONFIG,sessionService,sweet ) { 
    var strfecha= new Date();
    var strfechactual=strfecha.getFullYear() + "-" + strfecha.getMonth() + "-" + strfecha.getDate() + " " + strfecha.getHours() + ":" + strfecha.getMinutes() + ":" + strfecha.getSeconds(); 
    var introlId = "";
    var respuestaSuccess = "TRUE";
    $scope.getRoles = function(){
        var resRoles = {
           function_name: "roleslst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resRoles).success(function (response){
            $scope.obtRoles=response;
            //$.unblockUI(); //cerrar la mascara             
        },function(error) {
            alert("error al cargar");           
        });        
    };
       
    /****************Primera   grilla**************************/
    $scope.getOpcioneslibres = function(introlId){
    var resOpcion =  {
                        "function_name":"opcioneslibres",
                        "body":{
                                "params": [
                                    {
                                        "name": "usrid",
                                        "value": introlId
                                    }
                                ]
                        }
                };             
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion);
        obj.success(function (response) {
            $scope.Opciones = response; 
            //$.unblockUI(); //cerrar la mascara         
        })
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;            
        });
    };
    /****************Segunda   grilla**************************/
    $scope.getAccesosroles = function(introlId){
    var resAccesosroles =  {
                        "function_name":"accesosroles",
                        "body":{
                                "params": [
                                    {
                                        "name": "idrl",
                                        "value": introlId
                                    }
                                ]
                        }
                };             
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resAccesosroles).success(function (response){
            $scope.obtAccesosRoles=response;
            //$.unblockUI(); //cerrar la mascara
        }).error(function(response){
            alert("error al cargar");
        });                 
    };
    $scope.getAccesos = function (id) {
        introlId= id; 
        $scope.getOpcioneslibres(introlId);
        //$.blockUI();
        $scope.getAccesosroles(introlId);
        //$.blockUI();
        $scope.checkboxes = { 'checked': false, items: {} }; 
        $scope.checkboxes2 = { 'checked': false, items: {} };
    };  
    $scope.adicionar = function(){
        //$.blockUI();
        $scope.obtOpciones=$rootScope;
        angular.forEach($scope.Opciones,function(celda, fila){
            var opc_Id=celda['opcId'];
            console.log(opc_Id);
            var rol = introlId;
            var accregistrado = '2015-04-22 18:13:58';
            var accmodificado = '2015-04-22 18:13:58';
            var accusrId = '1';
            var accEstado = 'A';
            if($scope.checkboxes.items[opc_Id])
            {
                 {
                    var acceso = {};
                    acceso['acc_opc_id'] = opc_Id; 
                    acceso['acc_rls_id'] = introlId; 
                    acceso['acc_registrado'] = accregistrado; 
                    acceso['acc_modificado'] = accmodificado; 
                    acceso['acc_usr_id'] = sessionService.get('IDUSUARIO'); 
                    acceso['acc_estado'] = accEstado;
                    console.log(acceso); 
                    var resAccesos = {"table_name":"_bp_accesos",
                                      "body":acceso};  
                    var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resAccesos);
                        obj.success(function(data){
                        $scope.getOpcioneslibres(introlId);
                        $scope.getAccesosroles(introlId);
                       if (respuestaSuccess == "TRUE") { 
                            sweet.show('', 'Asignacion exitosa', 'success');
                            respuestaSuccess = "FALSE";
                        };        
                    })
                    .error(function(data){
                         if (respuestaSuccess == "TRUE") { 
                            sweet.show('', 'Falla asignacion', 'error');
                            respuestaSuccess = "FALSE";
                        };         
                    });    
                } 
            } 
        });
        //$.unblockUI(); 
    }
    $scope.retirar = function(){
            angular.forEach($scope.obtAccesosRoles,function(celda, fila){ 
            var accId=celda['accid'];
            if($scope.checkboxes2.items[accId])
                {
                    var acceso = {};
                    acceso['acc_estado'] = 'B';
                    var resAccesos = {"table_name":"_bp_accesos", 
                        "body":acceso,
                        "id" : accId}; 
                    var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resAccesos);                     
                    obj.success(function(data){
                        $scope.getOpcioneslibres(introlId);
                        $scope.getAccesosroles(introlId);
                         if (respuestaSuccess == "TRUE") { 
                            sweet.show('', 'retiro exitoso', 'success');
                            respuestaSuccess = "FALSE";
                        };                
                    })
                    .error(function(data){
                        if (respuestaSuccess == "TRUE") { 
                            sweet.show('', 'falla asignacion', 'error');
                            respuestaSuccess = "FALSE";
                        };            
                    });
                } 
            })
    };
    $scope.$on('api:ready',function(){            
        $scope.getRoles();
        $scope.getAccesos();

    });
    $scope.inicioAccesos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getRoles();
            $scope.getAccesos();
            //$.blockUI();
        }
    };      
});