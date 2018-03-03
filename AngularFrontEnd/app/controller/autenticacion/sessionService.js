'use strict';
	
//factoria para guardar y eliminar sesiones con sessionStorage
app.factory('sessionService',['$http', function($http){
    return {
        //creamos una sesión //setter
        set : function(key, val) {
            return sessionStorage.setItem(key, val)
        },
        //obtenemos una sesión //getter
        get : function(key) {
            return sessionStorage.getItem(key)
        },
        //limpiamos una sesión
        destroy : function(key) {
            return sessionStorage.removeItem(key)
        }
    };
}])