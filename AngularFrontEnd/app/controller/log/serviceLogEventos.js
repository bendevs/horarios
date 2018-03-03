app.service('LogGuardarInfo', function(){
    this.GuardarEventos = function ($scope, DreamFactory, CONFIG, DatosLog){
        $scope.LogsEventos = DreamFactory(CONFIG.APIURL, CONFIG.APP_NAME, CONFIG.SERVICE, '_bp_logs_eventos');
        $scope.disabled = {};
        $scope.errors = {};
        $scope.responses = {};
        $scope.disabled['login']=true;//opcional
        $scope.errors['login'] = false;//opcional
        $scope.LogsEventos.login(CONFIG.CREDENCIAL)    //autenticacion token
        .then(function(response){
            $scope.loggedIn = true;
            $scope.disabled['login']=false;
            //$scope.getUsuarios();
            //$scope.getPersonasS();
        },function(response){
            $scope.loggedIn = false;
            $scope.disabled['login']=false;
            //$scope.errors['login'] = $scope.LogsEventos.error(response)
        });
        var handle = function(obj, name){
            obj.success(function(response){
                //$scope.LogsEventos = response;
                console.log($scope.LogsEventos);
            }).error(function(response){  
                //$scope.errors[name] = $scope.LogsEventos.error(response)
            })
        }
        //ALMACENANDO EL EVENTO LOG
        var fecha= new Date();
        var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();        
        var sEventos = {};
        //console.log(usu);
        sEventos['lgs_usr_id'] = DatosLog.id_usuario;
        sEventos['lgs_evento'] = DatosLog.evento;
        sEventos['lgs_registrado'] = fechactual;
        sEventos['lgs_modificado'] = fechactual;
        handle($scope.LogsEventos.insert(sEventos), 'insert');
        //handle($scope.LogsEventos.getListSP('usuarioslst',{}), 'post');
    }
});
