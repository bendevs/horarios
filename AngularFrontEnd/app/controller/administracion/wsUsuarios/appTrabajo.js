/****************************/
app.controller('trabajoControler',function ($scope,$rootScope,$route,$window,DreamFactory,ngTableParams,$filter,CONFIG,sessionService,sweet ) { 
    var strfecha= new Date();
    var strfechactual=strfecha.getFullYear() + "-" + strfecha.getMonth() + "-" + strfecha.getDate() + " " + strfecha.getHours() + ":" + strfecha.getMinutes() + ":" + strfecha.getSeconds(); 
    var introlId = "";
    var respuestaSuccess = "TRUE";
    $scope.getUsuarios = function(){
        $.blockUI();
        var resUsuarios = {
           function_name: "usuariolst",
        };
        
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resUsuarios).success(function (response){
            $scope.obtUsuarios=response;
            var data = response
    //        console.log("saddsada",data);
            $.unblockUI(); //cerrar la mascara             
        },function(error) {
            $.unblockUI();
            console.log("error al cargar");           
        });        
    };
       
    /****************Primera   grilla**************************/
    $scope.getOpcioneslibres = function(introlId){
    var resOpciones =  {
                        "function_name":"espacioslibres",
                        "body":{
                                "params": [
                                    {
                                        "name": "usrid",
                                        "value": introlId
                                    }
                                ]
                        }
                }; 
                console.log("resOpciones",resOpciones);            
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpciones);
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
                        "function_name":"accesosusuarios",
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

    console.log(id);
        introlId= id; 
        $scope.getOpcioneslibres(introlId);
        //$.blockUI();
        $scope.getAccesosroles(introlId);
        //$.blockUI();
        $scope.checkboxes = { 'checked': false, items: {} }; 
        $scope.checkboxes2 = { 'checked': false, items: {} };
    };  
    $scope.adicionar = function(usrid){
           $scope.obtOpciones=$rootScope;
        angular.forEach($scope.Opciones,function(celda, fila){
            var wsid=celda['wsid'];
            console.log(wsid);
            var rol = introlId;
            var accregistrado = strfechactual;
            var accmodificado = strfechactual;
            var accusrId = usrid;
           if($scope.checkboxes.items[wsid])
            {
                console.log(wsid,introlId);
              var resAccesosroles =  {
                        "function_name":"sp_espaciotrabajo",
                        "body":{
                                "params": [
                                    {
                                        "name": "wsid",
                                        "value": wsid
                                    },{
                                        "name": "nombre",
                                        "value": introlId
                                    },{
                                        "name": "wsidd",
                                        "value": sessionService.get('IDUSUARIO') 
                                    }
                                ]
                        }
                };          
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resAccesosroles).success(function (response){
            console.log(response); $scope.getOpcioneslibres(introlId);
                        $scope.getAccesosroles(introlId);
                       if (respuestaSuccess == "TRUE") { 
                            sweet.show('', 'Asignacion exitosa', 'success');
                            respuestaSuccess = "FALSE";
                        };   
        }).error(function(response){
           console.log(response);
        });    
}
          
        });
    };

    

    $scope.retirar = function(usrid){
            angular.forEach($scope.obtAccesosRoles,function(celda, fila){ 
            var uwid=celda['uwid'];
            if($scope.checkboxes2.items[uwid])
                {
                    var acceso = {};
                    acceso['uw_estado'] = 'B';
                    var resAccesos = {"table_name":"_bp_usuarios_workspace", 
                        "body":acceso,
                        "id" : uwid}; 
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
        $scope.getUsuarios();
        $scope.getAccesos();

    });
    $scope.inicioAccesos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.getUsuarios();
            $scope.getAccesos();
            console.log("si inicia y esta enviando a get");
            //$.blockUI();
        }
    };      
});