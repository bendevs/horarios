app.controller('reporteController2', function ($scope, $q, $rootScope, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
    
    
    $scope.registro = {};
    $scope.tablaReporte = null;

    
    $scope.get_pre = function(x){
        return $sce.trustAsHtml(x);
    };

    
    $scope.get_pre2 = function(x){
        return $sce.trustAsHtml(x);
    };
    
    
    $scope.getReportes = function(){
        $.blockUI();
        var resReportes = {
            "procedure_name":"sp_reportes"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resReportes);
        obj.success(function (response) {
            $scope.obtReportes = response;
            $.unblockUI();            
        })
        obj.error(function(error) {
            console.log("sp_reportes", error);
            $.unblockUI();            
        });        
    };


    $scope.selecReporte = function() {
          
        $scope.idReporte = $scope.rptSelec;
        //console.log(idReporte);
        $scope.reporteVista();
    }


    $scope.cargarDatos = function()
    {    
        var filtro="";
        var mutli_education = document.reportForm.elements["registro[]"];

        if(mutli_education.length > 0)
        {
            filtro = " WHERE ";

            for (var i = 0; i < mutli_education.length; i++) 
            {
                nombreCampo = mutli_education[i].name;
                valorCampo = mutli_education[i].value;
                if (mutli_education[i].value.length>0)
                {
                    filtro = filtro + "cas_datos->>'" + nombreCampo + "'::text='" + valorCampo +"' AND ";
                }
            };

            $scope.filtro = filtro.substring(0,filtro.length - 4);     
        }

        $scope.getDatos($scope.filtro);
    }
    
    
    $scope.reporteVista = function(){
        $.blockUI();
        $scope.html = "";
        $scope.doct_tps_doc_id = 2;
        
        var resDatos = {
            "table_name":"_bp_reportes",
             "filter": "rep_id= "+ $scope.idReporte +" and rep_estado='A'"
        }; 
        
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos); 
        obj.success(function (response) { 
            
            console.log("response", response);
            $scope.nombReporte = response.record[0].rep_titulo; 
            $scope.subTituloReporte = response.record[0].rep_subtitulo; 
            $scope.datosCampos = response.record[0].rep_campos; 
            $scope.tituloColumnas = (response.record[0].rep_titulo_columnas).split("|"); 
            $scope.ordenadoPor = response.record[0].rep_ordenado_por; 


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            $scope.datadocumentos1 = response;

            var i=0;  
            titulos = "[{";
            camposBD = response.record[0].rep_filtrado;

            $scope.datadocumentos = camposBD.split("|");
            while(i<$scope.datadocumentos.length) {              
                valores = $scope.datadocumentos[i].split("#");
                titulo = valores[0];
                idName = valores[1];
                dominio = valores[2];
                titulos = titulos + '"label":"' + titulo +'"}, {';
                switch(dominio)
                {
                  case "TXT":
                    $scope.html = $scope.html + '<div class="col-md-3">';
                    $scope.html = $scope.html + '<div class="form-group">';
                    $scope.html = $scope.html + '<label class="col-sm-4 control-label no-padding-right" for="url">' + titulo + ':</label>';
                    $scope.html = $scope.html + '<div class="col-sm-8">';
                    $scope.html = $scope.html + '<input id="registro[]" name="' + idName + '" onkeyUp="return conMayusculas(this)" class="form-control" placeholder="'+titulo+'" ng-model="registro.'+idName+'">';
                    $scope.html = $scope.html + '</div></div></div> ';
                    break;                  
                  case "combo":
                    $scope.html = $scope.html + '<div class="col-md-3"> ';
                    $scope.html = $scope.html + '<div class="form-group" >';
                    $scope.html = $scope.html + '<label for="url">'+titulo+':</label> ';
                    $scope.html = $scope.html + '<div class="controls">';
                    $scope.html = $scope.html + '<select id="registro[]" name="registro[]" class="form-control" type="'+titulo+'" ng-model="registro.'+idName+'" >';
                    var arrayDatos = datosCmb.split("|");                     
                    for(i=0; i<arrayDatos.length; i++)
                    {
                      var arrayOptions = arrayDatos[i].split("%");                   
                      if(arrayOptions.length > 0)
                      {
                        $scope.html = $scope.html + '<option value="'+arrayOptions[1]+'">'+arrayOptions[1]+'</option>'; 
                      }
                    }
                    $scope.html = $scope.html + '</select>';
                    $scope.html = $scope.html + '</div>';
                    $scope.html = $scope.html + '</div>';
                    $scope.html = $scope.html + '</div>';
                    break;
                case "number":
                    $scope.html = $scope.html + '<div class="col-md-3"> ';
                    $scope.html = $scope.html + '<div class="form-group" > ' ;
                    $scope.html = $scope.html + '<label for="url" >' + titulo + ':</label> ' ;
                    $scope.html = $scope.html + '<div class="controls"> ' ;
                    $scope.html = $scope.html + '<input type="number" id="registro[]" onkeyUp="return conMayusculas(this)" name="registro[]" type="text" class="form-control" placeholder="' + titulo + '" ng-model="registro.' + idName + '">' ;
                    $scope.html = $scope.html + '</div></div></div> ';
                    break;
                default:
                    $scope.html = $scope.html + '<div class="col-md-3"> ';
                    $scope.html = $scope.html + '<div class="form-group" > ' ;
                    $scope.html = $scope.html + '<label for="url" >' + titulo + ':</label> ' ;
                    $scope.html = $scope.html + '<div class="controls"> ' ;
                    $scope.html = $scope.html + '<input id="registro[]" name="registro[]" onkeyUp="return conMayusculas(this)" type="text" class="form-control" placeholder="' + titulo + '" ng-model="registro.' + idName + '">' ;
                    $scope.html = $scope.html + '</div></div></div> ';
                    break;
                }
                i=i+1;
            }  
            titulos = titulos.substring(0,titulos.length - 3);
            titulos = titulos + "]";
            //console.log(titulos);
            $scope.obtTitulos = JSON.parse(titulos);
            $scope.get_pre($scope.html);   
            $.unblockUI();        
        })
        obj.error(function(error) {
            console.log("_bp_reportes", error);
        }); 
    };

    $scope.getDatos=function(query){
        /*var resDatos = {
            "table_name":"_bp_reportes",
             "filter": "rep_id= "+$scope.idReporte+" and rep_estado='A'"
        }; 
        
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
        obj.success(function (data) {*/

            camposBD = $scope.datosCampos;
            $scope.campos = camposBD.split("|");

            var log = [];
            campos = "SELECT ";
            
            angular.forEach($scope.campos, function(value, key) {
              campos = campos + "(cas_datos->>'" + value.trim() + "'::text) AS " + value.trim() + ",";
            }, log);
            $scope.consulta = campos.substring(0,campos.length - 1); 
            $scope.consulta = $scope.consulta + " FROM _fr_casos "
            $scope.consulta = $scope.consulta + " " + query;
            
            if($scope.ordenadoPor != "" && $scope.ordenadoPor != null)
            {
                $scope.consulta = $scope.consulta + " ORDER BY cas_datos->>'"+$scope.ordenadoPor+"'::text ";    
            }

            console.log($scope.consulta);

            var resQuery = {
                    "procedure_name":"sp_reporte_dinamico123",
                    "body":{
                            "params": [
                                {
                                    "name": "sql",
                                    "value": $scope.consulta
                                }                                
                            ]
                    }
            };                  
            DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery).success(function (response){
                var promise = $scope.getTabla(response);
                promise.then(function(respuesta) {
                    $scope.get_pre2(respuesta);
                }, function(reason) {
                    alert('Failed: ' + reason);
                });
            });            
        //});
    }

    $scope.getTabla = function(returnedData) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
        
        $scope.html2 = ''; 
        $scope.html2 = $scope.html2 + '<table class="table table-striped table-bordered">';
        $scope.html2 = $scope.html2 + '<thead>';
        
        //$scope.html2 = $scope.html2 + '<th> TIPO </th>';
        //$scope.html2 = $scope.html2 + '<th> ACTIVIDAD </th>';
        console.log("aa", $scope.tituloColumnas);
        angular.forEach($scope.tituloColumnas, function(value, key) {
          $scope.html2 = $scope.html2 + '<th> ' + value.trim() + ' </th>';
        }, log);

        
        $scope.html2 = $scope.html2 + '</thead>';
        $scope.html2 = $scope.html2 + '<tbody>';

        $scope.obtRegistroReporte = JSON.parse(returnedData[0].sp_reporte_dinamico123);

        angular.forEach($scope.obtRegistroReporte,function(celda, fila){
            $scope.html2 = $scope.html2 + '<tr class="column"> <td>' + celda["ae_sw_tipo"]+ '</td> ';
            $scope.html2 = $scope.html2 + '<td>' + celda["int_actividad"]+ '</td> </tr>';
        });      
        $scope.html2 = $scope.html2 + '</tbody> </table>';
        
        deferred.resolve($scope.html2);
        return deferred.promise;
    }

    //iniciando el controlador
    $scope.$on('api:ready',function(){
        //$scope.reporteVista();
        $scope.getReportes();
    });
    $scope.inicioActuaciones = function () {
        if(DreamFactory.isReady()){
            //$scope.reporteVista();
            $scope.getReportes();
        }
    };
});