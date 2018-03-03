angular.module('DreamFactory', []).factory('DreamFactory', function($http, $q) {
    return function(dsp_url, app_name, servicio, table) {
        $http.defaults.headers.common["X-DreamFactory-Application-Name"] = app_name;
        
        var d = {};

        var requires = function(name, chkval, val) {
            if (!chkval) {
                var o = {
                    "error": function(callback) {
                        "callback"({
                            "error": [{
                                "message": name + " is required."
                            }]
                        });
                    },
                    "success": function() {
                        return o;
                    }
                }
                return o;
            }
            return val;
        };
        d.getListLogin = function(sUsuario, sClave) {
			filter="filter=usr_usuario = '" + sUsuario + "' and usr_clave='" + sClave + "'";
            fields="fields=usr_usr_id, usr_usuario,prs_nombres, prs_paterno, prs_materno,usr_rol";
            return $http.get(dsp_url + '/'+servicio+'/' + table + '/'+ '?'+fields+'&'+filter);
        };
        d.getListFiltro = function(filter,fields) {
            return $http.get(dsp_url + '/'+servicio+'/' + table + '/?'+fields+'&'+filter);
        };
        d.getListFuncion = function(params) {
            return $http.post(dsp_url + '/system/script/'+params+'?is_user_script=true');
        };     
        d.getList = function() {
            return $http.get(dsp_url + '/'+servicio+'/' + table + '/');
        };
        d.getListSP = function(proc,record) {
            return $http.post(dsp_url + '/'+servicio+'/_proc/' + proc + '/',record);
        };
        d.getItem = function(id) {
            return requires('id', id, $http.get(dsp_url + '/'+servicio+'/' + table + '/' + id));
        };

        d.insert = function(record) {
            return requires('record', record, $http.post(dsp_url + '/'+servicio+'/' + table + '/', record));
        };

        d.update = function(id, record) {
            return requires('id & record', id && record, $http.put(dsp_url + '/'+servicio+'/' + table + '/' + id, record));
        };

        d.delete = function(id) {
            return requires('id', id, $http.delete(dsp_url + '/'+servicio+'/' + table + '/' + id));
        };

        d.login = function(credencial) {
            var deferred = $q.defer();
            $http.post(dsp_url + "/user/session", credencial).success(function(data, status) {
                $http.defaults.headers.common["X-DreamFactory-Session-Token"] = data.session_id;
                deferred.resolve(data);
            }).error(deferred.reject);
            return deferred.promise;
        };

        d.error = function(response) {
            var err = (response.error) ? response.error[0].message : "An error occurred, but the server provided no additional information.";
            return err;
        };

        return d;
    }
});
