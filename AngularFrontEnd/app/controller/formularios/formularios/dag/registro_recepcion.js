app.controller('registroRecepcionController', function ($scope, $q,$route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout,fileUpload, $location) {
            //$scope.datos.UBM_UNIDAD_SOLICITANTE_VALOR = "";
      $scope.modelFecha1 = {
            startDate: new Date('09/21/2015'),
            endDate: new Date()
        };
    $scope.startDateOpen = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.startDateOpened = true;
    };
    $scope.startDateOpen2 = function($event) {
           $event.preventDefault();
           $event.stopPropagation();
           $scope.startDateOpened2 = true;
           $scope.modelFecha = {
                 startDate: new Date('09/21/2015'),
                 endDate: new Date($scope.datos.UBM_FEC_INICIO_RECEPCION)
             };
    };
    $scope.prueba1= function($event) {
      var nroCompra = document.getElementById("nrocompra").value;
      $scope.obtDatosContrato(nroCompra);
    };



    $scope.derivacion = function(){
      $scope[name] = 'Running';
       var deferred = $q.defer();
       $scope.exito = "SI";
          if(200000 < parseInt($scope.datos.UBM_MONTO_ADJUDICACION) && parseInt($scope.datos.UBM_MONTO_ADJUDICACION) <= 1000000){
            $scope.variable = 2;
          }
          if(parseInt($scope.datos.UBM_MONTO_ADJUDICACION) > 1000000){
            $scope.variable = 4;
          }
          x = $scope.datos.UBM_UNIDAD_SOLICITANTE.split('-');
          var codificacion = {
                 "procedure_name":"dag.sp_dag_derivacion",
                 "body":{
                     "params": [
                         {
                             "name": "ps",
                             "value": 1
                         },
                         {
                           "name": "pda",
                             "value": parseInt($scope.datos.UBM_CENTRO_ADMINISTRATIVO)
                         },
                         {
                           "name": "pue",
                             "value": parseInt($scope.datos.UBM_UNIDAD_EJECUTORA)
                         },
                         {
                          "name": "puo",
                             "value": parseInt(x[0])
                         },
                         {
                          "name": "clave",
                             "value": parseInt($scope.variable)
                         }
                     ]
                 }
             };
             DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(codificacion).success(function (response){
                 console.log("response==>",response);
                 $scope.exito = response;
                 //$scope.datos.g_UO_solicitante = response[0].rpc;
                 $q.all($scope.exito).then(function(data){
                      deferred.resolve($scope.exito);
                  });
             })
             .error(function(data){
                 $scope.exito = "NO";
               $q.all($scope.exito).then(function(data){
                      deferred.resolve($scope.exito);
                  });
                 sweet.show('', 'Error al cargar la informacion del item: ', 'error');
             });

          return deferred.promise;
    }

      $scope.modificarfecha = function(){
        if(parseInt($scope.datos.UBM_MONTO_ADJUDICACION) <= 200000){
          console.log("NODO DE SESION",sessionService.get('IDNODO'));
          console.log(sessionStorage);
            $scope.datos.g_UO_solicitante = sessionService.get('IDNODO');
            $scope.datos.UBM_NODO_UAF = sessionService.get('IDNODO');
            console.log($scope.datos.UBM_UNIDAD_EJECUTORA);
            var fec0 = $scope.datos.UBM_FEC_INICIO_RECEPCION;
            var fecnac = new Date(fec0);
            var mes = fecnac.getMonth() + 1;
            var dia = fecnac.getDate()
              if(fecnac.getDate()<10){
                  dia = "0"+ dia;
              }
              if(fecnac.getMonth()<9){
                  mes = "0"+ mes;
              }
            $scope.datos.UBM_FEC_INICIO_RECEPCION  = fecnac.getFullYear()+"-"+mes+"-"+dia;
            console.log("LA FECHA DE INICIO",$scope.datos.UBM_FEC_INICIO_RECEPCION);
            var fec0 = $scope.datos.UBM_FEC_FIN_RECEPCION;
            var fecnac = new Date(fec0);
            var mes = fecnac.getMonth() + 1;
            var dia = fecnac.getDate()
              if(fecnac.getDate()<10){
                  dia = "0"+ dia;
              }
              if(fecnac.getMonth()<9){
                  mes = "0"+ mes;
              }
            $scope.datos.UBM_FEC_FIN_RECEPCION  = fecnac.getFullYear()+"-"+mes+"-"+dia;
            $scope.cargarDatos($scope.datos);
            $scope.guardarData($scope.datos);
          }else{
            var arregloDatos = $scope.derivacion();
                   arregloDatos.then(function(respuesta) {
                       console.log("*****************");
                       console.log(respuesta);
                       $scope.datos.g_UO_solicitante = respuesta[0].rpc;
                       $scope.datos.UBM_NODO_UAF = respuesta[0].uaf;
                       console.log($scope.datos.UBM_UNIDAD_EJECUTORA);
                       var fec0 = $scope.datos.UBM_FEC_INICIO_RECEPCION;
                       var fecnac = new Date(fec0);
                       var mes = fecnac.getMonth() + 1;
                       var dia = fecnac.getDate()
                         if(fecnac.getDate()<10){
                             dia = "0"+ dia;
                         }
                         if(fecnac.getMonth()<9){
                             mes = "0"+ mes;
                         }
                       $scope.datos.UBM_FEC_INICIO_RECEPCION  = fecnac.getFullYear()+"-"+mes+"-"+dia;
                       console.log("LA FECHA DE INICIO",$scope.datos.UBM_FEC_INICIO_RECEPCION);
                       var fec0 = $scope.datos.UBM_FEC_FIN_RECEPCION;
                       var fecnac = new Date(fec0);
                       var mes = fecnac.getMonth() + 1;
                       var dia = fecnac.getDate()
                         if(fecnac.getDate()<10){
                             dia = "0"+ dia;
                         }
                         if(fecnac.getMonth()<9){
                             mes = "0"+ mes;
                         }
                       $scope.datos.UBM_FEC_FIN_RECEPCION  = fecnac.getFullYear()+"-"+mes+"-"+dia;
                       console.log("LA FECHA DE INICIO",$scope.datos.UBM_FEC_INICIO_RECEPCION);
                       console.log("LA FECHA DE INICIO",$scope.datos.UBM_FEC_FIN_RECEPCION);
                       $scope.cargarDatos($scope.datos);
                       $scope.guardarData($scope.datos);
                       console.log("estos son los datos",$scope.datos);
                       console.log("****************");
                   }, function(reason) {
                       alert('Failed: ' + reason);
                   });
          }




            }


  $scope.modificarfec = function(){
    console.log("la fechaaaa creoo",new Date('2017-03-24'));
    console.log("este es el tecnico",$scope.datos.UBM_TECNICO_UBM);
      //console.log("DAa",$scope.datos.UBM_CENTRO_ADMINISTRATIVO);
      if(parseInt($scope.datos.UBM_MONTO_ADJUDICACION) <= 200000){
          $scope.datos.g_UO_solicitante = sessionService.get('IDNODO');
          $scope.datos.UBM_NODO_UAF = sessionService.get('IDNODO');
      }
      if(200000 < parseInt($scope.datos.UBM_MONTO_ADJUDICACION) && parseInt($scope.datos.UBM_MONTO_ADJUDICACION) <= 1000000){
        $scope.variable = 2;
      }
      if(parseInt($scope.datos.UBM_MONTO_ADJUDICACION) > 1000000){
        $scope.variable = 4;
      }
      x = $scope.datos.UBM_UNIDAD_SOLICITANTE.split('-');

         console.log("  ESTOS SON LOS DATOOSSSS",$scope.datos);
    console.log("la derivacion aquiii",$scope.datos.g_UO_solicitante);
    console.log($scope.datos.UBM_UNIDAD_EJECUTORA);
    var fec0 = $scope.datos.UBM_FEC_INICIO_RECEPCION;
    var fecnac = new Date(fec0);
    var mes = fecnac.getMonth() + 1;
    var dia = fecnac.getDate()
      if(fecnac.getDate()<10){
          dia = "0"+ dia;
      }
      if(fecnac.getMonth()<9){
          mes = "0"+ mes;
      }
    $scope.datos.UBM_FEC_INICIO_RECEPCION  = fecnac.getFullYear()+"-"+mes+"-"+dia;
    console.log("LA FECHA DE INICIO",$scope.datos.UBM_FEC_INICIO_RECEPCION);
    var fec0 = $scope.datos.UBM_FEC_FIN_RECEPCION;
    var fecnac = new Date(fec0);
    var mes = fecnac.getMonth() + 1;
    var dia = fecnac.getDate()
      if(fecnac.getDate()<10){
          dia = "0"+ dia;
      }
      if(fecnac.getMonth()<9){
          mes = "0"+ mes;
      }
    $scope.datos.UBM_FEC_FIN_RECEPCION  = fecnac.getFullYear()+"-"+mes+"-"+dia;
    $scope.cargarDatos($scope.datos);
    $scope.guardarData($scope.datos);

  }


  $scope.inciarUpload =   function(){
        try{
          $('#multiDocsButon').click(function(){
                $('#multiDocsFile').click();
          });
        }catch(e){}
    };



  $scope.limpiar = function (){
    $scope.datos.UBM_OBJETO_COMPRA = "";
    $scope.datos.nrocontrato = "";
    $scope.datos.codigoproceso = "";
    $scope.datos.cuce  = "";
    $scope.datos.UBM_SECTOR_VALOR = "";
    $scope.datos.UBM_CENTRO_ADMINISTRATIVO_VALOR = "";
    $scope.datos.UBM_UNIDAD_EJECUTORA_VALOR = "";
    $scope.datos.UBM_UNIDAD_SOLICITANTE = "";
    $scope.datos.UBM_TECNICO_UBM = "";
    $scope.datos.UBM_C31 = "";
    $scope.datos.UBM_FEC_VER_TECNICA = "";
    $scope.datos.UBM_MONTO_ADJUDICACION =  "";
  };



    $scope.obtDatosContrato = function(nrocontrato){
        $.blockUI();
        console.log(nrocontrato.length);
        if(nrocontrato.length > 0){
        $.ajax({
            type        : 'POST',
            url         : 'http://192.168.35.119/contrataciones/rest/WSContratosDAG',
            data: '{"NumeroContrato":"'+ nrocontrato +'"}',
            contentType : 'application/json',
            dataType    : 'json',
            success: function(dataIN) {

                $.unblockUI();
                console.log("que me esta devolviendo==>",dataIN.ContratosDag[0]);
                var x = dataIN.ContratosDag[0].Estructura.split('-');
                console.log(x);
                if(dataIN.ContratosDag[0] != undefined || dataIN.ContratosDag[0] != '')
                 {
                    sweet.show('', "Datos encontrado", 'success');
                    console.log("esto es un response==>>",dataIN.ContratosDag[0]);
                    $scope.datos.UBM_OBJETO_COMPRA = dataIN.ContratosDag[0].ObjetoContrato;
                    $scope.datos.nrocontrato = nrocontrato;
                    $scope.datos.UBM_FORMA_ADQUISICION = dataIN.ContratosDag[0].Modalidad;
                    $scope.datos.codigoproceso = dataIN.ContratosDag[0].Carpeta;
                    $scope.datos.nrocarpeta = dataIN.ContratosDag[0].Carpeta;
                    $scope.datos.cuce  = dataIN.ContratosDag[0].CUCE;
                    $scope.datos.UBM_SECTOR_VALOR = "1 GAMLP";
                    $scope.datos.UBM_CENTRO_ADMINISTRATIVO = dataIN.ContratosDag[0].IDDA;
                    $scope.datos.UBM_UNIDAD_EJECUTORA = dataIN.ContratosDag[0].IDUE;
                    $scope.datos.UBM_CENTRO_ADMINISTRATIVO_VALOR = dataIN.ContratosDag[0].IDDA+" "+dataIN.ContratosDag[0].DA;
                    $scope.datos.UBM_UNIDAD_EJECUTORA_VALOR = dataIN.ContratosDag[0].IDUE+" "+dataIN.ContratosDag[0].UE;
                    $scope.uevalor = dataIN.ContratosDag[0].IDUE;
                    $scope.datos.UBM_C31 = dataIN.ContratosDag[0].C31;
                    $scope.datos.UBM_FEC_VER_TECNICA = dataIN.ContratosDag[0].FechaContrato;
                    $scope.datos.UBM_MONTO_ADJUDICACION = dataIN.ContratosDag[0].MontoContrato;
                    $scope.datos.programa = parseInt(x[0]);
                    $scope.datos.proyecto = parseInt(x[1]);
                    $scope.datos.actividad = parseInt(x[2]);
                    $scope.datos.entidad = dataIN.ContratosDag[0].Entidad;
                    $scope.datos.UBM_ADJUDICADA = dataIN.ContratosDag[0].Adjudicado;
                    $scope.unidadOrganizacional();
                    $scope.$apply();
                }
                else
                {
                 sweet.show('','No se Encontraron los Datos','error');
                 document.getElementById("nrocompra").value = "";
                }

               // $scope.datos.apply();

            },
            error: function (xhr, status, error) {
              sweet.show('','No se Encontraron los Datos ','error');
                $.unblockUI();
            }

       });
        }
        else{
            sweet.show('','Ingrese número de Contrato','warning');
            $.unblockUI();
        }
       /* cadena = 'GAMLP-2578/2016';
         $.ajax({
        type: 'POST',
        url: 'http://192.168.35.119/contrataciones/rest/WSContratosDAG',
        data: '{"NumeroContrato":"  "}',
        contentType: 'application/json',
        success: function (data) {

        },
        error: function (jqXHR, textStatus, errorThrown) {
        }

        });*/


       /* if(a == 123){
            sweet.show('', "Datos encontrado", 'success');
        console.log(a);
        var objetoJSON = {
        "fecha_registro":"2016-11-11",
        "obj_compra":"televisor",
        "forma_adquisicon":"remate",
        "nro_contrato":"21",
        "nro_carpeta":"5",
        "codigo_proceso":"CP1",
        "cuce":"1058ABC",
        "sector":"A",
        "direccion":"colon nº118",
        "unidad_ejecutora":"UAF(Unidad de Autorizacion de Finanzas)",
        "oficina":"A-1",
        "tecnico_ubm":"Jhon Caillante",
        "C31":"1234",
        "fecha_finalizacion":"2016-12-25",
        "monto_adjudicacion":"210",
        "categoria":"B - alignmentFocus"};
        console.log(objetoJSON);
        $scope.datos.UBM_OBJETO_COMPRA = objetoJSON.obj_compra;
        $scope.datos.UBM_FORMA_ADQUISICION = objetoJSON.forma_adquisicon;
        $scope.datos.nrocontrato = objetoJSON.nro_contrato;
        $scope.datos.nrocarpeta = objetoJSON.nro_carpeta;
        $scope.datos.codigoproceso = objetoJSON.codigo_proceso;
        $scope.datos.cuce = objetoJSON.cuce;
        $scope.datos.UBM_SECTOR_VALOR = objetoJSON.sector;
        $scope.datos.UBM_CENTRO_ADMINISTRATIVO_VALOR = objetoJSON.direccion;
        $scope.datos.UBM_UNIDAD_EJECUTORA_VALOR = objetoJSON.unidad_ejecutora;
        $scope.datos.UBM_UNIDAD_SOLICITANTE_VALOR = objetoJSON.oficina;
        $scope.datos.UBM_TECNICO_UBM = objetoJSON.tecnico_ubm;
        $scope.datos.UBM_C31 = objetoJSON.C31;
        $scope.datos.UBM_FEC_VER_TECNICA = objetoJSON.fecha_finalizacion;
        $scope.datos.UBM_MONTO_ADJUDICACION = objetoJSON.categoria;

        console.log($scope.datos);
        document.getElementById("g_fecha").value = objetoJSON.fecha_registro;
        document.getElementById("UBM_OBJETO_COMPRA").value = objetoJSON.obj_compra;
        document.getElementById("UBM_FORMA_ADQUISICION").value = objetoJSON.forma_adquisicon;
        document.getElementById("nrocontrato").value = objetoJSON.nro_contrato;
        document.getElementById("nrocarpeta").value = objetoJSON.nro_carpeta;
        document.getElementById("codigoproceso").value = objetoJSON.codigo_proceso;
        document.getElementById("cuce").value = objetoJSON.cuce;
        document.getElementById("UBM_SECTOR_VALOR").value = objetoJSON.sector;
        document.getElementById("UBM_CENTRO_ADMINISTRATIVO_VALOR").value = objetoJSON.direccion;
        document.getElementById("UBM_UNIDAD_EJECUTORA").value = objetoJSON.unidad_ejecutora;
        document.getElementById("oficina").value = objetoJSON.oficina;
        document.getElementById("UBM_TECNICO_UBM").value = objetoJSON.tecnico_ubm;
        document.getElementById("UBM_C31").value = objetoJSON.C31;
        document.getElementById("UBM_FEC_VER_TECNICA").value = objetoJSON.fecha_finalizacion;
        document.getElementById("UBM_MONTO_ADJUDICACION").value = objetoJSON.categoria;
        }
        else{
            sweet.show('', "No hay Datos", 'error');
        }*/


    }
    /*$scope.cargarDatosJhon = function(){
        var objetoJSON = {"fecha_registro":"2016-11-11","obj_compra":"televisor","forma_adquisicon":"remate","nro_contrato":"21","nro_carpeta":"5"};
        document.getElementById("g_fecha").value = objetoJSON.fecha_registro;
        $scope.objCompra = objetoJSON.obj_compra;
        console.log(datos.UBM_OBJETO_COMPRA);
    };*/

    /*$scope.cargarDatosRecepcion = function(a){
        alert(a);

        var objetoJSON = {
        "fecha_registro":"2016-11-11",
        "obj_compra":"televisor",
        "forma_adquisicon":"remate",
        "nro_contrato":"21",
        "nro_carpeta":"5",
        "codigo_proceso":"CP1",
        "cuce":"1058ABC",
        "sector":"A",
        "direccion":"colon nº118",
        "unidad_ejecutora":"UAF(Unidad de Autorizacion de Finanzas)",
        "oficina":"A-1",
        "tecnico_ubm":"Jhon Caillante",
        "C31":"1234",
        "fecha_finalizacion":"2016-12-25",
        "monto_adjudicacion":"210",
        "categoria":"B - alignmentFocus"};
        document.getElementById("g_fecha").value = objetoJSON.fecha_registro;
        document.getElementById("UBM_OBJETO_COMPRA").value = objetoJSON.obj_compra;
        document.getElementById("UBM_FORMA_ADQUISICION").value = objetoJSON.forma_adquisicon;
        document.getElementById("nrocontrato").value = objetoJSON.nro_contrato;
        document.getElementById("nrocarpeta").value = objetoJSON.nro_carpeta;
        document.getElementById("codigoproceso").value = objetoJSON.codigo_proceso;
        document.getElementById("cuce").value = objetoJSON.cuce;
        document.getElementById("UBM_SECTOR").value = objetoJSON.sector;
        document.getElementById("UBM_CENTRO_ADMINISTRATIVO").value = objetoJSON.direccion;
        document.getElementById("UBM_UNIDAD_EJECUTORA").value = objetoJSON.unidad_ejecutora;
        document.getElementById("oficina").value = objetoJSON.oficina;
        document.getElementById("UBM_TECNICO_UBM").value = objetoJSON.tecnico_ubm;
        document.getElementById("UBM_C31").value = objetoJSON.C31;
        document.getElementById("UBM_FEC_VER_TECNICA").value = objetoJSON.fecha_finalizacion;
        document.getElementById("UBM_MONTO_ADJUDICACION").value = objetoJSON.categoria;
         }
        }*/




    $scope.volver = function(){
        console.log("aqui estan los datosssss de vueltaaa",$scope.datos);
        if ($scope.estadoCaso=="ACTIVIDAD") {
            $location.path('formularios|reimpresion|index.html');
        } else {
            $scope.tituloP='Mis Casos';
            $scope.panelCasos=true;
            $scope.panelFormularios=false;
            $scope.nodoAsignado = true;
            $route.reload();
        }
    }
    $scope.guardarvalor = function (valor){
        console.log("aqui estan los valores=>",valor);
        $scope.datos.UO_Sel = valor;
    }
    $scope.tecnico_asignado = function(){
        console.log( $scope.datos.UBM_CENTRO_ADMINISTRATIVO);
        console.log($scope.datos.UBM_UNIDAD_EJECUTORA);
        console.log($scope.datos.UBM_UNIDAD_SOLICITANTE);
        var x = $scope.datos.UBM_UNIDAD_SOLICITANTE.split('-');
        console.log("---------------------->",x[1]);
         var codificacion = {
                "procedure_name":"dag.sp_dag_ubm_tecnicoasig4",
                "body":{
                    "params": [
                        {
                            "name": "ps",
                            "value": 1
                        },
                        {
                          "name": "pda",
                            "value": $scope.datos.UBM_CENTRO_ADMINISTRATIVO
                        },
                        {
                          "name": "pue",
                            "value": $scope.datos.UBM_UNIDAD_EJECUTORA
                        },
                        {
                         "name": "puo",
                            "value": x[0]
                        }

                    ]
                }
            };
            DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(codificacion).success(function (response){
                console.log("response==>",response);
                $scope.datos.UBM_TECNICO_UBM = response[0].sp_dag_ubm_tecnicoasig4;
                console.log("-------EEEEEEE>",$scope.tecnicosE);
                console.log("WWWWw--->",$scope.datos.UBM_TECNICO_UBM);
                angular.forEach($scope.tecnicosE,function(cel, fil){

                    //console.log("fil",fil);
                    if ($scope.datos.UBM_TECNICO_UBM == cel.tec_id) {
                      $scope.datos.UBM_TECNICO_UBM_VALOR = cel.prs_nombres +" "+ cel.prs_paterno+" "+cel.prs_materno;
                      console.log("valor ",$scope.datos.UBM_TECNICO_UBM_VALOR);

                    }
                });

                // $scope.cargarFuncionario();
                console.log($scope.datos.UBM_TECNICO_UBM);
            })
            .error(function(data){
                sweet.show('', 'Error al cargar la informacion del item: ', 'error');
            });
    };
    $scope.cargarUnidades = function(){
           var resUnidades = {
                "function_name":"dag.sp_dag_uo1"
            };

            DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resUnidades).success(function (response){
                console.log(response);
                $scope.unidades= response;

            }).error(function(error) {
                $scope.errors["error_rol"] = error;
            });
        }

     $scope.unidadOrganizacional = function(){

     console.log($scope.datos.UBM_CENTRO_ADMINISTRATIVO);
     console.log($scope.datos.UBM_UNIDAD_EJECUTORA);

            var codificacion = {
                "procedure_name":"dag.sp_dag_uo",
                "body":{
                    "params": [
                        {
                          "name": "da",
                            "value": $scope.datos.UBM_CENTRO_ADMINISTRATIVO
                        },
                        {
                          "name": "ue",
                            "value": $scope.datos.UBM_UNIDAD_EJECUTORA
                        }
                    ]
                }
            };
            DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(codificacion).success(function (response){
                console.log("response==>111111111",response);
                $scope.unidades = response;
            })
            .error(function(data){
                sweet.show('', 'Error al cargar la informacion del item: ', 'error');
            });
        };

        $scope.asignar = function(){
            var data_asignada = $scope.datos.UBM_UNIDAD_SOLICITANTE.split("-");
            $scope.datos.UBM_UNIDAD_SOLICITANTE_VALOR = $scope.datos.UBM_UNIDAD_SOLICITANTE;
            $scope.tecnico_asignado();
        }

         $scope.cargarFuncionario = function(){
            var resTecnico = {
                "function_name":"dag.sp_dag_ubm_tecnicoasignado"
            };

            DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resTecnico).success(function (response){
                console.log("EEEEEEE----->",response);
                $scope.tecnicos = response;
                $scope.tecnicosE = response;

            }).error(function(error) {
                $scope.errors["error_rol"] = error;
            });
        }


        $scope.getUO = function(){
           var resUO= {
               table_name:"dag.dag_dag_unidad_organizacional",
              order:"dag_uo_s ASC, dag_uo_da ASC, dag_uo_ue ASC, dag_uo_uo ASC",
               filter:"dag_uo_gestion=2016 and dag_uo_estado LIKE 'A' and dag_uo_s=1"
           };
           var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resUO);
           obj.success(function(response){
              console.log("aqui esta la repuesta==>>",response);
                var tam = JSON.stringify(response);

                console.log("aqui esta la repuesta==>>",tam);
                var unidades = JSON.parse(tam);
                console.log("aqui estan las unidadaesssss==>>", unidades);
                console.log("aqui estan los del primero",unidades.record[0]);
                //console.log("aqui esta la descripcion==>",response[0].descripcion+' '+response[0].dag_uo_uo);
               $scope.unidades = response;
               //$scope.$apply();
               //$scope.datos.UO_Sel=1062;
           })
           .error(function(response){

               sweet.show('', 'Error: ', 'error');
           })
       }

    $scope.atenderCaso = function(caso,estadoT){
        $scope.estadoCaso = estadoT;
        if (estadoT == "RESUMEN") {
            sessionService.set("TRAMITE_ACTUAL", caso.casonombre);
            //$scope.getProcesos();
            $scope.sIdProcesoActual = caso.procid;
            $scope.sCasoNro = caso.casonro;
            $scope.sCasonombre = caso.casonombre;
            $scope.sCasoNombre = caso.actnombre;
            $scope.sIdCaso = caso.casoid;
            $scope.sProcNombre = caso.procnombre;
            sessionService.set('DATOSTRAMITE',JSON.stringify(caso).toString());
            $scope.nodoAsignado=false;
            $scope.casoActual=caso;
            $scope.seleccionado=true;
            $scope.tituloP='TRÁMITE: '+caso.casonombre;
            $scope.datos=JSON.parse(caso.casodata);
            $scope.trmFormulario = $scope.datos;
            $scope.impFormulario = JSON.parse(caso.casodata);
            $scope.panelCasos=false;
            $scope.panelFormularios=true;
            var response1 = {};
            response1.actid = 0;
            response1.formdescripcion = "RESUMEN GERMAN";
            response1.formdescripcion2 = "FORMULARIO RESUMEN";
            response1.formdireccionamiento = null;
            response1.formid = caso.resumenid;
            response1.formorden = 10;
            response1.formreglas = '[{"regfid":183,"regformid":' + caso.resumenid + ',"regforden":10,"regfsiguiente":176,"regfregla":"true","regftipo":"ENTRADA"}]"';
            response1.formtpdescripcion = "formulario";
            response1.formtpid = 1;
            response1.formurl = "render.html?"+caso.resumenid;
            response = new Array(1);
            response[0] = response1;
            $scope.cargarDatosResumen($scope.datos);
            //$scope.directorio = response.formdireccionamiento;
            $scope.cargarFormularioResumen(response,0);
        } else {
            if (estadoT=="ACTIVIDAD") {
                sessionService.set("TRAMITE_ACTUAL", caso.casonombre);
                $scope.getProcesos();
                $scope.sIdProcesoActual = caso.procid;
                $scope.sCasoNro = caso.casonro;
                $scope.sCasonombre = caso.casonombre;
                $scope.sCasoNombre = caso.actnombre;
                $scope.sIdCaso = caso.casoid;
                $scope.sProcNombre = caso.procnombre;
                sessionService.set('DATOSTRAMITE',JSON.stringify(caso).toString());
                $scope.nodoAsignado=false;
                $scope.casoActual=caso;
                $scope.seleccionado=true;
                $scope.tituloP='TRÁMITE: '+caso.casonombre;
                $scope.datos=JSON.parse(caso.casodata);
                $scope.trmFormulario = $scope.datos;
                $scope.impFormulario = JSON.parse(caso.casodata);
                $scope.panelCasos=false;
                $scope.panelFormularios=true;
                var resOpcion = {
                    function_name: "formularioslst",
                    "body":{"params": [{"name":"actidd","value":caso.casoactid}]}
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
                    $scope.obtFormularios=response;
                    if(response.length>0)
                    {   $scope.cargarDatos($scope.datos);
                        $scope.directorio = response[0].formdireccionamiento;
                        $scope.cargarFormulario(response[0],0);
                    }
                    else
                        $scope.cargarFormulario('');
                }).error(function(error) {
                    $scope.errors["error_rol"] = error;
                });
                var resRegla = {
                   function_name: "reglaslst",
                   "body":{"params": [{"name":"actidd","value":caso.casoactid}]}
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resRegla).success(function (response){
                    if(response.length>0)
                    {
                        $scope.obtReglas=response;
                    }
                    else
                        $scope.obtReglas='';
                }).error(function(error) {
                    $scope.errors["error_rol"] = error;
                });
            } else {
                sessionService.set("TRAMITE_ACTUAL", caso.casonombre);
                if(estadoT == 'ver'){
                    $scope.desabilitado=true;
                }
                $scope.getProcesos();
                $scope.sIdProcesoActual = caso.procid;
                $scope.sCasoNro = caso.casonro;
                $scope.sCasonombre = caso.casonombre;
                $scope.sCasoNombre = caso.actnombre;
                $scope.sIdCaso = caso.casoid;
                $scope.sProcNombre = caso.procnombre;
                sessionService.set('DATOSTRAMITE',JSON.stringify(caso).toString());
                $scope.nodoAsignado=false;
                $scope.casoActual=caso;
                $scope.seleccionado=true;
                $scope.tituloP='TRÁMITE: '+caso.casonombre;
                $scope.datos=JSON.parse(caso.casodata);
                $scope.trmFormulario = $scope.datos;
                $scope.impFormulario = JSON.parse(caso.casodata);
                $scope.panelCasos=false;
                $scope.panelFormularios=true;
                var resOpcion = {
                    function_name: "formularioslst",
                    "body":{"params": [{"name":"actidd","value":caso.casoactid}]}
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
                    $scope.obtFormularios=response;
                    if(response.length>0)
                    {   $scope.cargarDatos($scope.datos);
                        $scope.directorio = response[0].formdireccionamiento;
                        $scope.cargarFormulario(response[0],0);
                    }
                    else
                        $scope.cargarFormulario('');
                }).error(function(error) {
                    $scope.errors["error_rol"] = error;
                });
                var resRegla = {
                   function_name: "reglaslst",
                   "body":{"params": [{"name":"actidd","value":caso.casoactid}]}
                };
                DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resRegla).success(function (response){
                    if(response.length>0)
                    {
                        $scope.obtReglas=response;
                    }
                    else
                        $scope.obtReglas='';
                }).error(function(error) {
                    $scope.errors["error_rol"] = error;
                });
            }
        }
    };
    $scope.recibirTramite = function (datos,estadoT){
        sessionService.set("TRAMITE_ACTUAL", datos.casonombre);
        if ($scope.procesoid)
            sessionService.set("TRAMITE_ACTUAL", $scope.procesoid.procodigo + datos.casonro + "/" + strfecha.getFullYear());
        if(estadoT == 'recibir' || estadoT == 'tomarAtender')
        {
            $scope.usuarioid=sessionService.get('IDUSUARIO');
        }
        else{
            $scope.usuarioid=0;
        };
        var misDatos = {
            "procedure_name":"sp_tomar_tramite",
            "body":{
                "params": [
                    {
                        "name": "tid",
                        "value": datos.casoid
                    },{
                        "name": "tuser",
                        "value": $scope.usuarioid
                    }
                ]
            }
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(misDatos).success(function (response){
            if(response[0].sp_tomar_tramite){
                if(estadoT == 'recibir')
                {
                    sweet.show('', "Trámite recibido", 'success');
                    $scope.getCasos();
                }
                if(estadoT == 'dejar')
                {
                    sweet.show('', "Trámite Dejado", 'success');
                    $route.reload();
                    $scope.getCasos();
                }
            } else {
                sweet.show('', "El Trámite ya fue recibido por otro usuario", 'error');
                $route.reload();
            }
        }).error(function(response){
        });
    };
    $scope.cargarDatosResumen = function(datos){
        $scope.datosHistorico=datos;
        $scope.datos=datos;
        $scope.datos.g_tipo=$scope.casoActual.procodigo;
        $scope.datos.AE_NRO_CASO=$scope.sCasonombre;
    }

  /*  $scope.cargarDatos=function(datos){
       console.log("aqui estan los datosssss===>>",datos);
    }*/
    $scope.mensajeError = function(mensaje) {
        sweet.show('Campos obligatorios', mensaje, 'error');
    }
    $scope.evalReglasFormulario = function(){
        $scope.memoria=[];
        var sFormMostrar = "";
        $scope.formSigId=null;
        $scope.data = JSON.parse($scope.datosSerializados);
        $scope.obtReglasForm = JSON.parse($scope.reglasFormulario);
        console.log($scope.obtReglasForm);
        /*RECORREMOS LAS REGLAS DE NEGOCIO*/
        angular.forEach($scope.obtReglasForm,function(celda, fila){
            if(celda['regftipo']=='SALIDA')
            {
                var sReglaForm = celda['regfregla'];
                console.log('regla--->   ',celda['regfregla']);
                var sReglaEvaluada = false;
                var flags = "gi";
                /*RECORREMOS EL FORMULARIO*/
                angular.forEach($scope.data,function(campoValor, campoNombre){
                    if(sReglaForm.indexOf(campoNombre) != -1 ){
                        //sReglaForm = sReglaForm.replace('#'+campoNombre+'#', campoValor,flags);
                        var regex = new RegExp('#'+campoNombre+'#', flags);
                        sReglaForm = sReglaForm.replace(regex, campoValor);
                    }
                });
                console.log('reglaSustituida 1--->   ',sReglaForm);
                sReglaEvaluada = eval(sReglaForm);
                if(sReglaEvaluada){
                    $scope.formSigId=celda['regfsiguiente'];
                }
            }
        });
        if($scope.formSigId){

            console.log('existe siguiente');
            $scope.cargarFormularioCargar($scope.formSigId)
            $scope.memoria[$scope.contador]=$scope.formSigId;
            $scope.contador++;
        }
        else{
            console.log('no  existe siguiente');
            var caso = {};
            console.log($scope.casoActual.actsigid);
            if($scope.casoActual.actsigid==0 ){
                $scope.evalReglasAvanzar();
            }
            else{
                $scope.derivar();
            }
        }
    };

  /*  $scope.guardarData=function(datos){
        console.log("esto es mi datos jhon===>>",datos);
        var datosSerializados = JSON.stringify(datos);
        console.log(datosSerializados);
        $scope.datosSerializados = JSON.stringify(datos);
        var caso = {};
        caso['cas_datos'] = datosSerializados;
        caso['cas_modificado'] = $scope.fechactual;
        caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
        console.log(datosSerializados,"FR_CASOS 2");
        var resProceso = {"table_name":"_fr_casos",
                        "body":caso,
                        "id":$scope.casoActual.casoid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
        obj.success(function(data){
          $scope.evalReglasFormulario();
            $scope.getCasos();
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        });
    }
    /*BIFURCACION*
   */


    $scope.cargarFormularioResumen = function(item,posicion){
        $scope.tituloForm = item.formurl;
        $scope.formularioSeleccionado=item.formid;
        $scope.evalReglasFormularioEntradaResumen(item);

        //$scope.posicion = posicion+1;
        //$scope.siguiente=$scope.obtFormularios[posicion+1];
    };
    $scope.cargarFormulario=function(item,posicion){
        $scope.tituloForm = item.formurl;
        $scope.formularioSeleccionado=item.formid;
        $scope.reglasFormulario=item.formreglas;
        $scope.evalReglasFormularioEntrada();
        $scope.posicion = posicion+1;
        $scope.siguiente=$scope.obtFormularios[posicion+1];
    };
    $scope.obtenerData = function(formulario) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
            $.blockUI();
            var resDatos = {
                    "table_name":"_fr_formulario_dinamico",
                     "filter": "campo_id="+ formulario +" and campo_estado='A'"
                };
            var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
            obj.success(function (response) {
                resultado = response.record[0].campo_descripcion;
                $scope.datadocumentos = JSON.parse(response.record[0].campo_descripcion);
                var i=0;
                $scope.array=[];
                angular.forEach($scope.datadocumentos, function(value, key) {
                    if (value.tipo_llenado){
                        if (value.tipo_llenado == "SQL") {
                            var resQuery = {
                                "procedure_name":"sp_reporte_dinamico123",
                                "body":{
                                    "params": [
                                        {
                                            "name": "sql",
                                            "value": value.data
                                        }
                                    ]
                                }
                            };
                            DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery).success(function (response){
                                $scope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                            });
                        }  else if (value.tipo_llenado == "SQL2") {
                          nombreCampo = new RegExp("@TRAMITE@", "g");
                          console.log("Sin reemplazo", value.data);
                          value.data= value.data.replace(nombreCampo,"'"+$scope.datos.AE_NRO_CASO+"'");
                          console.log("Con reemplazo", value.data);
                          var resQuery = {
                              "procedure_name":"sp_reporte_dinamico123",
                              "body":{
                                  "params": [
                                      {
                                          "name": "sql",
                                          "value": value.data
                                      }
                                  ]
                              }
                          };
                          DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery).success(function (response){
                              $scope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                              console.log("Resultado",$scope.array[value.campo]);
                          });
                        } else {
                            $scope.array[value.campo] = value.data;
                        }
                    } else {
                        $scope.array[value.campo] = "";
                    }
                }, log);
                $.unblockUI();
                deferred.resolve($scope.array);
            });
        $.unblockUI();
        return deferred.promise;
    }




    $scope.seleccionarProceso = function(proceso){
        $scope.procesoSeleccionado=proceso.procid;
        $scope.procesoid=proceso;
    }

    $scope.adicionarCaso = function(){
        console.log('asunto adicionar: ',$scope.datos.asunto);
        var sWpaceId    = 1;
        if(sessionService.get('WS_ID')){
            sWpaceId    = sessionService.get('WS_ID');
        }

        //sessionService.get('IDUSUARIO');//WS_ID

        sessionService.set("TIPO_PROCESO", $scope.procesoid.procodigo);
        // var json='{"g_fecha":"'+$scope.fechactual+'","g_tipo":"'+ $scope.procesoid.procodigo+'","g_usuario": "'+sessionService.get('USUARIO')+'","g_datos_solicitante": [{"tipo_solicitante": "'+$scope.datos.solicitante+'","num_documento": "'+$scope.datos.INT_RL_NUM_DOCUMENTO+'","expedido": "'+$scope.datos.region+'","nombre": "'+$scope.datos.RC_NOMBRE+'", "paterno": "'+$scope.datos.RC_PATERNO+'", "materno": "'+$scope.datos.RC_MATERNO+'", "direccion": "'+$scope.datos.direccion+'", "correo": "'+$scope.datos.INT_CORREO+'", "telefono_celular": "'+$scope.datos.INT_TEL_CELULAR+'", "telefono_fijo": "'+$scope.datos.telefonoFijo+'", "nit": "'+$scope.datos.RC_NIT+'","nombre_RazonSocial": "'+$scope.datos.nombreRazonSocial+'","dir_juridico":"'+$scope.datos.direccionJuridico+'","telefono_juridico":"'+$scope.datos.telefonoFijoJuridico+'"}]}';
        //var json='{"g_fecha":"'+$scope.fechactual+'","g_tipo":"'+ $scope.procesoid.procodigo+'","g_usuario": "'+sessionService.get('USUARIO')+'","g_datos_solicitante": []}';
        console.log('armado del json',json);
        if($scope.procesoid.actid!= null)
        {
            var caso = {};
            var resFormulario = {
                procedure_name:"crear_tramite_macro",
                body:{
                    "params": [
                        {
                            "name": "proid",
                            "value": $scope.procesoid.procid
                        },{
                            "name": "actid",
                            "value": $scope.procesoid.actid
                        },{
                            "name": "usr_id",
                            "value": sessionService.get('IDUSUARIO')
                        },{
                            "name": "datos",
                            "value": json
                        },{
                            "name": "procodigo",
                            "value": $scope.procesoid.procodigo
                        },{
                            "name": "macro_id",
                            "value": null
                        },{
                            "name": "nodo_id",
                            "value": sessionService.get('IDNODO')
                        },{
                            "name": "ws_id",
                            "value": sWpaceId
                        }
                    ]
                }
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resFormulario);
            obj.success(function (data){
                sessionService.set("TRAMITE_ACTUAL", data.casonro);
                sweet.show('', 'Registro insertado', 'success');
                $scope.getCasos();
                $scope.atenderCaso(data[0]);
                $scope.recibirTramite(data[0],'recibir');
                data[0].casonombre =   data[0].casonro;
            })
            .error(function(data){
                sweet.show('', "Registro no insertado", 'error');
                $scope.btnGuardar = false;
            })
        } else {
            sweet.show('', 'El proceso no contiene actividad de Inicio', 'warning');
        }
    };
    $scope.getCombos = function(tablaNombre, filtro, campos) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
        var resParametricos = {
            "table_name":tablaNombre,
            "filter":filtro,
            "fields":campos
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resParametricos);
        obj.success(function (data) {
            $scope.res = JSON.stringify(data.record).toString();
            deferred.resolve(data.record);
        });
        return deferred.promise;
    }
    $scope.getSPCombos = function(nombreSp, parametros) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
        if (parametros==""){
            var inDatos = {
                "procedure_name": nombreSp
            };
        } else {
            var inDatos = {
                "procedure_name": nombreSp,
                "body": parametros
            };
        }
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(inDatos);
        obj.success(function (response) {
            $scope.res = JSON.stringify(response).toString();
            deferred.resolve(response);
        });
        return deferred.promise;
    }

    $scope.classPropiedadesFormulario = "col-md-3";
    $scope.classCuerpo = "col-md-9";
    /*MOSTRAR OCULTAR DIVS DEPURACION*/
    $scope.mostrarEsconderDepuracion = function(){
        if($scope.mostrardiv){
            if($scope.mostrardiv.visibility == 'hidden'){
                $scope.mostrardiv = {'visibility': 'visible'};
                $scope.classPropiedadesFormulario = "col-md-3";
                $scope.classCuerpo = "col-md-9";
            }else{
                $scope.mostrardiv = {'visibility': 'hidden'};
                $scope.classPropiedadesFormulario = "col-md-1";
                $scope.classCuerpo = "col-md-11";
            }
        }else{
            $scope.mostrardiv = {'visibility': 'hidden'};
            $scope.classPropiedadesFormulario = "col-md-1";
            $scope.classCuerpo = "col-md-11";
        }
    };

    /*DEPURACION*/
    $scope.blocDesblocBtnDepuracion = function(){
        if($scope.btnBlock_1 == true){
            $scope.btnBlock_1   = false;
            $scope.btnBlock_2   = true;
        }else{
            $scope.btnBlock_1   = true;
            $scope.btnBlock_2   = false;
        }
    };

    /***HISTORICO***/
    $scope.getHistorico = function(){
         var resOpcion = {
            "procedure_name":"sp_mostrar_historico",
            "body":{"params": [{"name":"cas_id","value":$scope.sIdCaso}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
        obj.success(function (response) {
            $scope.obtHistorico=response;
            console.log("Datos:  ", $scope.obtHistorico);
            $scope.seleccionaProcesoMapa();
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };

    /*************************************MAPA DE PROCESOS****************************************/
    $scope.initDiagram = function() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates
    myDiagram =
      $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
        {
          initialContentAlignment: go.Spot.Center,
          allowDrop: true,  // must be true to accept drops from the Palette
          "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
          "LinkRelinked": showLinkLabel,
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          "undoManager.isEnabled": true  // enable undo & redo
        });
    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function(e) {
      var button = document.getElementById("SaveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });
    // helper definitions for node templates
    function nodeStyle() {
      return [
        // The Node.location comes from the "loc" property of the node data,
        // converted by the Point.parse static method.
        // If the Node.location is changed, it updates the "loc" property of the node data,
        // converting back using the Point.stringify static method.
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          // the Node.location is at the center of each node
          locationSpot: go.Spot.Center,
          //isShadowed: true,
          //shadowColor: "#888",
          // handle mouse enter/leave events to show/hide the ports
          mouseEnter: function (e, obj) { showPorts(obj.part, true); },
          mouseLeave: function (e, obj) { showPorts(obj.part, false); }
        }
      ];
    }
    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
    // and where the port is positioned on the node, and the boolean "output" and "input" arguments
    // control whether the user can draw links from or to the port.
    function makePort(name, spot, output, input) {
      // the port is basically just a small circle that has a white stroke when it is made visible
      return $(go.Shape, "Circle",
               {
                  fill: "transparent",
                  stroke: null,  // this is changed to "white" in the showPorts function
                  desiredSize: new go.Size(8, 8),
                  alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                  portId: name,  // declare this object to be a "port"
                  fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                  fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                  cursor: "pointer"  // show a different cursor to indicate potential link point
               });
    }
    // define the Node templates for regular nodes
    var lightText = 'whitesmoke';
    myDiagram.nodeTemplateMap.add("",  // the default category
      $(go.Node, "Spot", nodeStyle(),
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(go.Panel, "Auto",
          $(go.Shape, "Rectangle",
            { fill: "lightslategrey", stroke: null },
            new go.Binding("figure", "figure"),
            new go.Binding("fill", "color")),
          $(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              stroke: lightText,
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: false
            },
            new go.Binding("text").makeTwoWay())
        ),
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, false, false),
        makePort("L", go.Spot.Left, false, false),
        makePort("R", go.Spot.Right, false, false),
        makePort("B", go.Spot.Bottom, false, false)
      ));
    myDiagram.nodeTemplateMap.add("Start",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
          $(go.TextBlock, "Start",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the top, all output only:
        makePort("L", go.Spot.Left, false, false),
        makePort("R", go.Spot.Right, false, false),
        makePort("B", go.Spot.Bottom, false, false)
      ));
    myDiagram.nodeTemplateMap.add("End",
      $(go.Node, "Spot", nodeStyle(),
        $(go.Panel, "Auto",
          $(go.Shape, "Circle",
            { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
          $(go.TextBlock, "End",
            { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
            new go.Binding("text"))
        ),
        // three named ports, one on each side except the bottom, all input only:
        makePort("T", go.Spot.Top, false, false),
        makePort("L", go.Spot.Left, false, false),
        makePort("R", go.Spot.Right, false, false)
      ));
    myDiagram.nodeTemplateMap.add("Comment",
      $(go.Node, "Auto", nodeStyle(),
        $(go.Shape, "File",
          { fill: "#EFFAB4", stroke: null }),
        $(go.TextBlock,
          {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: false,
            font: "bold 12pt Helvetica, Arial, sans-serif",
            stroke: '#454545'
          },
          new go.Binding("text").makeTwoWay())
        // no ports, because no links are allowed to connect with a comment
      ));
    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5, toShortLength: 4,
          relinkableFrom: false,
          relinkableTo: false,
          reshapable: false,
          resegmentable: false,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
          mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        },
        new go.Binding("points").makeTwoWay(),
        $(go.Shape,  // the highlight shape, normally transparent
          { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $(go.Shape,  // the link path shape
          { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
        $(go.Shape,  // the arrowhead
          { toArrow: "standard", stroke: null, fill: "gray"}),
        $(go.Panel, "Auto",  // the link label, normally not visible
          { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
          new go.Binding("visible", "visible").makeTwoWay(),
          $(go.Shape, "RoundedRectangle",  // the label shape
            { fill: "#F8F8F8", stroke: null }),
          $(go.TextBlock, "Yes",  // the label
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#333333",
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
      );

    myDiagram.model = go.Model.fromJson($scope.ImagenProceso);
    // support editing the properties of the selected person in HTML
    if (window.Inspector) myInspector = new Inspector('myInspector', myDiagram,
          {
        properties: {
          'key': { readOnly: true },
          'comments': {}
        }
      });
    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
      if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
    }
    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
    myDiagram.model = go.Model.fromJson($scope.ImagenProceso);  // load an initial diagram from some JSON text
    // initialize the Palette that is on the left side of the page
    myPalette =
      $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        {
          "animationManager.duration": 800, // slightly longer than default (600ms) animation
          nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
          model: new go.GraphLinksModel([  // specify the contents of the Palette
            { category: "Start", text: "" },
            { text: "" },
            { text: "???", figure: "diamond" },
            { category: "End", text: "" },
            { category: "Comment", text: "[ ]" }
          ])
        });
    }
    // Make all ports on a node visible when the mouse is over the node
    function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function(port) {
            port.stroke = (show ? "white" : null);
          });
    }
    // Show the diagram's model in JSON format that the user may edit
    $scope.save = function() {
        $scope.ImagenProceso = myDiagram.model.toJson();
        myDiagram.isModified = false;
    }
    // add an SVG rendering of the diagram at the end of this page
    $scope.makeSVG = function() {
        myDiagram.model = go.Model.fromJson($scope.ImagenProceso);
        var svg = myDiagram.makeSvg({
            scale: 0.9
          });
        obj = document.getElementById("SVGArea");
        obj.appendChild(svg);
        if (obj.children.length > 0) {
        obj.replaceChild(svg, obj.children[0]);
        }
    }

    $scope.seleccionaProcesoMapa = function(){
        //$.blockUI();
        if($scope.cargarLibreria == 0)
        {
          $scope.initDiagram();
          $scope.cargarLibreria = 1;
        }
        $scope.bifurcaciones = {};
        $scope.nombreActividad = {};
        $scope.idActividad = {};
        $scope.ordenActividad = {};
        $scope.actividadEstado = {};
        $scope.actividadDias = {};
        $scope.actividadTranscurrido = {};
        $scope.actividadDiferencia = {};
        $scope.panelReglaNegocioActividadMapa = false;
        $scope.ImagenProceso = '{ "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [ ';
        $scope.ImagenProceso = $scope.ImagenProceso + '{"key":-1 , "category":"Start", "loc":"-360 80", "text":""},';
        var x = -360;
        var a = x+15;
        var c = a+25;
        var y = 80;
        var keya= -1;
        var keyb = -1;
        var bifurcacion = 0;
        var resRoles = {
            "procedure_name":"actividadlst",
            "body":{"params": [{"name":"procid","value":$scope.sIdProcesoActual}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            //$.unblockUI();
            $scope.procTitulo = $scope.sProcNombre;
            $scope.casoTitulo = "Tramite Nro. " + $scope.sCasoNro;
            $scope.procElementos = response.length;
            for(var i = 0; i < $scope.procElementos; i++)
            {
                var b = 0;
                $scope.bifurcaciones[i] = response[i].tipoactid;
                $scope.nombreActividad[i] = response[i].actnombreorden;
                $scope.idActividad[i] = response[i].actid;
                $scope.ordenActividad[i] = response[i].actorden;
                $scope.actividadDias[i] = response[i].actduracion;
                keyb = response[i].actid;
                if(i == 0)
                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                for(var j = 0; j < $scope.obtHistorico.length; j++)
                {
                    if(response[i].actid == $scope.obtHistorico[j].actid)
                    {
                        if($scope.obtHistorico[j+1])
                        {
                            var fecha1=$scope.obtHistorico[j].fechaini.split("-");
                            var dia1=fecha1[2];
                            var mes1=fecha1[1];
                            var ges1=fecha1[0];
                            var fecha2=$scope.obtHistorico[j+1].fechaini.split("-");
                            var dia2=fecha2[2];
                            var mes2=fecha2[1];
                            var ges2=fecha2[0];
                            var nuevafecha1=new Date(ges1+","+mes1+","+dia1);
                            var nuevafecha2=new Date(ges2+","+mes2+","+dia2);
                            var dif=nuevafecha2.getTime() - nuevafecha1.getTime();
                            var dias=Math.floor(dif/(1000*24*60*60));
                            $scope.actividadTranscurrido[i]=dias;
                            $scope.actividadDiferencia[i]=dias-response[i].actduracion;
                            console.log('aquiii---> ',j,"---",$scope.obtHistorico[j].fechaini," - - ",$scope.obtHistorico[j+1].fechaini);
                        }
                        if (j == $scope.obtHistorico.length-1) {
                            $scope.actividadEstado[i]= 2;
                            var fecha1=$scope.obtHistorico[j].fechaini.split("-");
                            var dia1=fecha1[2];
                            var mes1=fecha1[1];
                            var ges1=fecha1[0];
                            var fecha2=new Date();
                            var dia2=fecha2.getDate();
                            var mes2=fecha2.getMonth()+1;
                            var ges2=fecha2.getFullYear();
                            var nuevafecha1=new Date(ges1+","+mes1+","+dia1);
                            var nuevafecha2=new Date(ges2+","+mes2+","+dia2);
                            var dif=nuevafecha2.getTime() - nuevafecha1.getTime();
                            var dias=Math.floor(dif/(1000*24*60*60));
                            $scope.actividadTranscurrido[i]=dias;
                            $scope.actividadDiferencia[i]=dias-response[i].actduracion;
                            console.log('aquiii final---> ',j,"---",$scope.obtHistorico[j].fechaini);
                            b=1;
                            if(response[i].tipoactid == 2)
                            {
                                x = c + 90;
                                y = y + 50;
                                if(bifurcacion != 0)
                                  bifurcacion = 0;
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '" , "figure":"diamond", "color":"yellowgreen", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                                bifurcacion = 1;
                                var resRNactivdad = {
                                    "procedure_name":"sp_lst_rnactividad",
                                    "body":{"params": [{"name":"actid","value":response[i].actid}]}
                                };
                                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
                                obj.success(function (response2) {
                                    for(var j = 0; j < response2.length; j++)
                                    {
                                      if(response2[j].rna_act_id < response2[j].rna_siguiente)
                                      {
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"B", "toPort":"B"},';
                                      }else if(response2[j].rna_act_id > response2[j].rna_siguiente){
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"T", "toPort":"T"},';
                                      }else{
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"R", "toPort":"T"},';
                                      }
                                    }
                                });
                                obj.error(function(error) {
                                    $scope.errors["error_rol"] = error;
                                });
                            }else{
                                x = c + 15;
                                y = y + 50;
                                if(bifurcacion == 0)
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                                else{
                                  bifurcacion = 0;
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                                }
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '","color":"yellowgreen", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                            }
                            break;
                        }else{
                            $scope.actividadEstado[i]= 1;
                            b=1;
                            if(response[i].tipoactid == 2)
                            {
                                x = c + 90;
                                y = y + 50;
                                if(bifurcacion != 0)
                                  bifurcacion = 0;
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '" , "figure":"diamond", "color":"lightskyblue", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                                bifurcacion = 1;
                                var resRNactivdad = {
                                    "procedure_name":"sp_lst_rnactividad",
                                    "body":{"params": [{"name":"actid","value":response[i].actid}]}
                                };
                                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
                                obj.success(function (response2) {
                                    for(var j = 0; j < response2.length; j++)
                                    {
                                      if(response2[j].rna_act_id < response2[j].rna_siguiente)
                                      {
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"B", "toPort":"B"},';
                                      }else if(response2[j].rna_act_id > response2[j].rna_siguiente){
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"T", "toPort":"T"},';
                                      }else{
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"R", "toPort":"T"},';
                                      }
                                    }
                                });
                                obj.error(function(error) {
                                    $scope.errors["error_rol"] = error;
                                });
                            }else{
                                x = c + 15;
                                y = y + 50;
                                if(bifurcacion == 0)
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                                else{
                                  bifurcacion = 0;
                                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                                }
                                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '", "color":"lightskyblue", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                            }
                            break;
                        }
                    }
                }
                if(b==0){
                    $scope.actividadEstado[i]= 0;
                    if(response[i].tipoactid == 2)
                    {
                        x = c + 90;
                        y = y + 50;
                        if(bifurcacion != 0)
                          bifurcacion = 0;
                        $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '" , "figure":"diamond"},';
                        bifurcacion = 1;
                        var resRNactivdad = {
                                    "procedure_name":"sp_lst_rnactividad",
                                    "body":{"params": [{"name":"actid","value":response[i].actid}]}
                                };
                                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
                                obj.success(function (response2) {
                                    for(var j = 0; j < response2.length; j++)
                                    {
                                      if(response2[j].rna_act_id < response2[j].rna_siguiente)
                                      {
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"B", "toPort":"B"},';
                                      }else if(response2[j].rna_act_id > response2[j].rna_siguiente){
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"T", "toPort":"T"},';
                                      }else{
                                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response2[j].rna_act_id + ', "to":' + response2[j].rna_siguiente + ', "fromPort":"R", "toPort":"T"},';
                                      }
                                    }
                                });
                                obj.error(function(error) {
                                    $scope.errors["error_rol"] = error;
                                });
                    }else{
                      x = c + 15;
                      y = y + 50;
                      if(bifurcacion == 0)
                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                      else{
                        bifurcacion = 0;
                        $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + response[i].actid + ', "to":' + response[i].actsiguiente + ', "fromPort":"R", "toPort":"L"},';
                      }
                      $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '"},';
                    }
                }
                a = x+15;
                c = a+25;
                keya =keyb;
            }
            $.blockUI();
            setTimeout(function(){            
                x = c + 40;
                $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keyb + ', "to":0, "fromPort":"R", "toPort":"L"}';
                $scope.ImagenProceso = $scope.ImagenProceso + '{"category":"End", "text":"", "key": 0, "loc":"' + x + ' ' + y + '"} ], "linkDataArray": [ ' + $scope.ImagenLinks + ']}';
                try{
                    $scope.makeSVG();
                }catch(err){
                    $.unblockUI();
                }
                $.unblockUI();
            },3000);
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };

    /*reglas de negocio actividades*/
    $scope.getReglaNegocioActividadMapa = function(actividad, sel){
        var resRNactivdad = {
            "procedure_name":"sp_lst_rnactividad",
            "body":{"params": [{"name":"actid","value":actividad}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
        obj.success(function (response) {
            $scope.panelReglaNegocioActividadMapa = true;
            $scope.obtNRactividadMapa = response;
            $scope.tituloRNMapa='Reglas de Negocio de la Actividad: '+ $scope.nombreActividad[sel];
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    /**********************************FIN MAPA DE PROCESOS****************************************/
    $scope.llamarHistorico = function (caso) {
        if($scope.abrirHistorico == 0){
            console.log($scope.abrirHistorico);
            $scope.abrirHistorico = 1;
            $scope.getHistorico();
        }else{
            console.log($scope.abrirHistorico);
            $scope.abrirHistorico = 0
        }
    };

    $scope.showhide = function () {
        var ibox = $element.closest('div.ibox');
        var icon = $element.find('i:first');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
        $timeout(function () {
            ibox.resize();
            ibox.find('[id^=map-]').resize();
        }, 50);
    };

    function iboxTools($timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'views/common/ibox_tools.html',
            controller: function ($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                };
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
            }
        };
    }

    //$scope.getCasos
    var clsIniciarGetDatosGrilla = $rootScope.$on('inicializarGetDatosGrilla', function(event, data){
        $scope.getCasos();
    });

    $scope.$on('$destroy', function() {
        clsIniciarGetDatosGrilla();
    });


    //inicio registro ciudadano
    /*REGISTROCIUDADANO*/
    $scope.consultaCiuTipoPer = "";
    $scope.consultaCiudadano = false;
    $scope.consultaCiuCampos = false;
    $scope.consultaCiuCampos2 = true;
    $scope.desabilitadoRc = false;
    $scope.rcDesabilitar = false;
    $scope.tipoPersonaRc = "";
    $scope.rcOid = "";
    $scope.aDatosRc = {};

    var sFono = "";
    var sCelular = "";
    var sCorreo = "";
    var sCi = "";
    var sw = 0;
    var sw2 = 1;
    var sNumeroAleatorio = "";

    $scope.bloquerCamposRc = function(){
        document.getElementById('region').disabled = true;
        document.getElementById('INT_SOLICITANTE').disabled = true;
        document.getElementById('direccion').disabled = true;
        document.getElementById('INT_CORREO').disabled = true;
    };

    $scope.desbloquearCamposRc = function(){
        try{
            document.getElementById('region').disabled = false;
            document.getElementById('INT_SOLICITANTE').disabled = false;
            document.getElementById('direccion').disabled = false;
            document.getElementById('INT_CORREO').disabled = false;
        }catch(e){}

    };



     $scope.envioMensaje = function(mensaje, email){
        var sMensajeValidacion = mensaje.replace(/ /g, "_");
        var parametros = {
            "cuerpo" : sMensajeValidacion,
            "asunto" : "Registro_GAMLP",
            "para" : email//'ed.marcelo25@gmail.com'
        }
        $.ajax({
            data: parametros,
            url: 'http://gmlpsr0082:9090/smsemail/email/mail.php',
            type: 'get',
            beforeSend: function () {
            },
            success: function (response) {
                    console.log(response);
            }
        });

    };

     $scope.recuperarDatosRc = function(tipoPersona, numeroDoc){
        console.log('datos del registro: ',tipoPersona, numeroDoc);
            $scope.tipoPersonaRc = tipoPersona;
            $scope.registroCiudadano = "";

            if(!$scope.datos){
                $scope.datos = {};
            }

            var sIdRegistro = sessionService.get('IDUSUARIO');
            if(tipoPersona == 'NATURAL'){
                filtro = "dtspsl_ci = '" + numeroDoc +"'";
            }else if(tipoPersona == 'JURIDICO'){
                filtro = "dtspsl_nit = '" + numeroDoc + "'";
            }else{
                filtro = "";
            }

            var misDatos = {
                    "table_name":"Ciudadano",
                    "body":{
                        "filter": filtro
                    }
            };

            //$.blockUI();
        //cargando


            DreamFactory.api[CONFIG.SERVICERC].getRecordsByPost(misDatos).success(function (response){
                var results = response.record;
                if(results.length > 0){//REGISTRO ENCONTRADO
                    $scope.aDatosRc = response.record;
            console.log('registro encontrado: ',response.record);
                    if(tipoPersona == 'NATURAL'){
                        try{
                        var rcRegin = ((typeof(results[0].dtspsl_expedido) == 'undefined') ? "" : results[0].dtspsl_expedido);
                        }catch(e){}
                        var rcNombre = ((typeof(results[0].dtspsl_nombres) == 'undefined') ? "" : results[0].dtspsl_nombres);
                        var rcPaterno = ((typeof(results[0].dtspsl_paterno) == 'undefined') ? "" : results[0].dtspsl_paterno);
                        var rcMaterno = ((typeof(results[0].dtspsl_materno) == 'undefined') ? "" : results[0].dtspsl_materno);
                        var rcDireccion = ((typeof(results[0].dtspsl_direccion) == 'undefined') ? "" : results[0].dtspsl_direccion);
                        var rcCorreo = ((typeof(results[0].dtspsl_correo) == 'undefined') ? "" : results[0].dtspsl_correo);
                        var rcMovil = ((typeof(results[0].dtspsl_movil) == 'undefined') ? "" : results[0].dtspsl_movil);
                        var rcTelefono = ((typeof(results[0].dtspsl_telefono) == 'undefined') ? "" : results[0].dtspsl_telefono);

                        $scope.datos.region = rcRegin.trim();
                        $scope.datos.INT_SOLICITANTE = rcNombre.trim() + " " + rcPaterno.trim() + " " + rcMaterno.trim();
            console.log('nombre: ',$scope.datos.INT_SOLICITANTE);
                        $scope.datos.RC_NOMBRE = rcNombre.trim();
                        $scope.datos.RC_PATERNO = rcPaterno.trim();
                        $scope.datos.RC_MATERNO = rcMaterno.trim();
                        $scope.datos.direccion = rcDireccion.trim();
                        $scope.datos.INT_CORREO = rcCorreo.trim();
                        $scope.datos.INT_TEL_CELULAR = rcMovil.trim();
                        $scope.datos.telefonoFijo = rcTelefono.trim();
                        $scope.consultaCiuTipoPer = 'NATURAL';
                        $scope.datosT = {};
                    }else{
                        var rcJRazonSocial = ((typeof(results[0].dtspsl_razon_social) == 'undefined') ? "" : results[0].dtspsl_razon_social);
                        var rcJCorreo = ((typeof(results[0].dtspsl_correo) == 'undefined') ? "" : results[0].dtspsl_correo);
                        var rcJDireccion = ((typeof(results[0].dtspsl_direccion) == 'undefined') ? "" : results[0].dtspsl_direccion);
                        var rcJFonoFijo = ((typeof(results[0].dtspsl_telefono) == 'undefined') ? "" : results[0].dtspsl_telefono);

                        $scope.datos.nombreRazonSocial = rcJRazonSocial.trim();
                        $scope.datos.direccionJuridico = rcJDireccion.trim();
                        $scope.datos.RC_CORREO = rcJCorreo.trim();
                        $scope.datos.telefonoFijoJuridico = rcJFonoFijo.trim();
                        $scope.consultaCiuTipoPer = 'JURIDICO';
                        $scope.datosT = {};
                    }
                    $scope.rcOid = results[0]._id;
                    $scope.consultaCiudadano = true;
                    $scope.desabilitadoFormulario = false; //habilitando tipo de formulario
                    //BUSCAR REGISTRO TIPO SUCCESS
                    $scope.btnClass = "success";
                    //Mensaje
                    $scope.spanOcultarMostrarExito = true;
                }else{
                    if(tipoPersona == 'NATURAL'){
                        $scope.limpiarCamposRcNatural();
                    }else{
                        $scope.limpiarCamposRcJuridico();
                    }
                    $scope.consultaCiudadano = false;
                    $scope.consultaCiuCampos = true;
                    $scope.consultaCiuCampos2 = false;
                    //BUSCAR REGISTRO
                    $scope.btnClass = "danger";
                    $scope.datos.INT_SOLICITANTE=".";
                    $scope.spanOcultarMostrarExito = false;
                    $scope.spanOcultarMostrarFracaso = true;
                }
                /*VALIDACNION FORMULARIO JURIDICO*/
                $scope.desabilitadoFormularioJuridico = false;
                $scope.camposCiudadanoCiHabilitar = true;
                $scope.rcDesabilitar = true;
                $scope.desbloquearCamposRc();
                         setTimeout(function(){            
                         $.unblockUI(); 
            },1000);
            }).error(function(results){
                         setTimeout(function(){            
                         $.unblockUI(); 
            },1000);
            });
    };



    $scope.limpiarCamposRcNatural = function(){
        $scope.datos.region = 0;
        $scope.datos.INT_SOLICITANTE = "";
        $scope.datos.direccion = "";
        $scope.datos.INT_CORREO = "";
        $scope.datos.INT_TEL_CELULAR = "";
        $scope.datos.telefonoFijo = "";
        $scope.datos.RC_NOMBRE = "";
        $scope.datos.RC_PATERNO = "";
        $scope.datos.RC_MATERNO = "";
    }
    $scope.limpiarCamposRcJuridico = function(){
        $scope.datos.nombreRazonSocial = "";
        $scope.datos.direccionJuridico = "";
        $scope.datos.RC_CORREO = "";
        $scope.datos.telefonoFijoJuridico = "";
    }

     //VALIDAR REGISTRO CIUDADANO
    $scope.validacamposJuridico = function (){
        if(tipoPersona == 'NATURAL'){
            $scope.opcionpersonaNatural = true;
            $scope.opcionpersonaJuridico = null;
            $scope.tituloVentana = 'Verificacion de número de carnet de identidad';
        } else {
            $scope.opcionpersonaJuridico = true;
            $scope.opcionpersonaNatural = null;
            $scope.tituloVentana = 'Verificacion de número de NIT';
        }
     }

     //VALIDAR REGISTRO CIUDADANO
     $scope.validaDatosRegistroCiudadano = function (response){
         if(tipoPersona == 'NATURAL'){
             $scope.opcionpersonaNatural = true;
             $scope.opcionpersonaJuridico = null;
             $scope.tituloVentana = 'Verificacion de número de carnet de identidad';
         } else {

             $scope.opcionpersonaJuridico = true;
             $scope.opcionpersonaNatural = null;
             $scope.tituloVentana = 'Verificacion de número de NIT';
         }
     }

    //REGISTRAR DATOS DEL CIUDADANO (NATURAL O JURIDICO)
    $scope.registroCiudadanoR = function (response) {
    console.log('registro ciudadano: ',response);

        var datos               = {};
        var tipoPersona         = $scope.tipoPersonaRc;
        var sDireccion          = response.direccion;
        var sFono               = response.telefonoFijo;
        var sCelular            = response.INT_TEL_CELULAR;
        var descripcionNombre   = response.RC_NOMBRE;
        var descripcionPaterno  = response.RC_PATERNO;
        var descripcionMaterno  = response.RC_MATERNO;
        var sCorreo             = "";
        var estado_civil        = '';
        var fecha               = new Date();
        var mes                 = fecha.getMonth()+1;

        if(mes.toString().length == 1)
            mes = '0'+mes;
        var dia = fecha.getDate();
        if(dia.toString().length == 1)
            dia='0'+dia;

        //var fechactual          = fecha.getFullYear() + "-" + mes + "-" + dia + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();

        if(tipoPersona == 'NATURAL'){
            sCorreo = response.INT_CORREO;
        }else{
            sCorreo = response.RC_CORREO;
        }

        if(response.estado_civil) {
            datos['dtspsl_id_estado_civil'] = '';//response.estado_civil;
        } else {
            datos['dtspsl_id_estado_civil'] = '';
        }
        if(estado_civil == " ") {//response.estado_civil
            response.estado_civil = ""
        }

        if(tipoPersona == "NATURAL") {

                var parametros = {
                "table_name":"Ciudadano",
                "body":{
                    "record": [
                        {
                            "dtspsl_id":"1",
                            "dtspsl_id_estado_civil": estado_civil,//response.estado_civil,
                            "dtspsl_id_tp_registro": "1",
                            "dtspsl_ci": response.INT_RL_NUM_DOCUMENTO,//response.cedula2,
                            "dtspsl_complemento": '',//response.complemento,
                            "dtspsl_expedido": response.region,//response.expedido,
                            "dtspsl_pin": sNumeroAleatorio,
                            "dtspsl_nombres": response.RC_NOMBRE,
                            "dtspsl_paterno": response.RC_PATERNO,
                            "dtspsl_materno": response.RC_MATERNO,
                            "dtspsl_tercer_apellido": '',//response.tercer,
                            "dtspsl_sexo": '',//response.sexo,
                            "dtspsl_activacionf": "NO",
                            "dtspsl_activaciond": "NO",
                            "dtspsl_fec_nacimiento": response.RC_FECHA_NAC,//response.fecha_nacimiento,
                            "dtspsl_usr_id": '',//idUsuario,
                            "dtspsl_registrado": fechactual,
                            "dtspsl_modificado":fechactual,
                            "dtspsl_ocupacion": '',//response.ocupacion,
                            "dtspsl_poder_replegal": '',//response.repLegal,
                            "dtspsl_nro_documento": '',//response.nroDocumento,
                            "dtspsl_nro_notaria": '',//response.nroNotaria,
                            "dtspsl_nit": '',//response.nit,
                            "dtspsl_razon_social": '',//response.razonSocial,
                            "dtspsl_correo" : response.INT_CORREO,
                            "dtspsl_telefono" : response.telefonoFijo,
                            "dtspsl_movil" : response.INT_TEL_CELULAR,
                            "dtspsl_estado" : "ACTIVO",
                            "dtspsl_estado_activacion" : "DESBLOQUEADO",
                            "dtspsl_observacion_activacion" : "NINGUNA",
                            "dtspsl_fec_activacionf" : fechactual,
                            "dtspsl_fec_activaciond" : fechactual,
                            "dtspsl_direccion" : response.direccion,
                            "dtspsl_tipo_persona" : tipoPersona,
                            "dtspsl_lugar_nacimiento" : '',//response.lugarNacimiento,
                            "dtspsl_pais" :  '',//response.pais,
                            "dtspsl_departamento" :  '',//response.departamento,
                            "dtspsl_provincia" :  '',//response.provincia,
                            "dtspsl_municipio" :  '',//response.municipio,
                            "dtspsl_macrodistrito":  '',//response.macrodistrito,
                            "dtspsl_distrito":  '',//response.distrito,
                            "dtspsl_zona" :  '',//response.zona,
                            "dtspsl_tipo_via" :  '',//response.tipo_via,
                            "dtspsl_nombre_via" :  '',//response.nombrevia,
                            "dtspsl_numero_casa" :  '',//response.numero,
                            "dtspsl_edificio" :  '',//response.edificio,
                            "dtspsl_bloque" :  '',//response.bloque,
                            "dtspsl_piso" :  '',//response.piso,
                            "dtspsl_oficina" :  '',//response.numeroOficina,
                            "dtspsl_latitud" :  '',//response.latitud,
                            "dtspsl_longitud" :  '',//response.longitud,
                            "dtspsl_sistema" :  'IF247'//response.sistema
                        }
                    ]
                }
            };
        }else{

            var parametros = {
                "table_name":"Ciudadano",
                "body":{
                    "record": [
                        {
                            "dtspsl_id": "1",
                            "dtspsl_id_tp_registro": "1",
                            "dtspsl_ci_representante": "",// c1111,
                            "dtspsl_complemento_representante": "",//response.complemento,
                            "dtspsl_pin": sNumeroAleatorio,
                            "dtspsl_nombres_representante": "",//response.nombre_representante,
                            "dtspsl_paterno_representante": "",// response.paterno_representante,
                            "dtspsl_materno_representante": "",// response.materno_representante,
                            "dtspsl_tercer_apellido_representante": "",// response.tercer_representante,
                            "dtspsl_activacionf": "NO",
                            "dtspsl_activaciond": "NO",
                            "dtspsl_usr_id": "",// idUsuario,
                            "dtspsl_registrado": fechactual,
                            "dtspsl_modificado":fechactual,
                            "dtspsl_poder_replegal": "",// response.repLegal,
                            "dtspsl_nro_notaria": "",// response.nroNotaria,
                            "dtspsl_nit": response.RC_NIT,
                            "dtspsl_razon_social": response.nombreRazonSocial,
                            "dtspsl_correo" : response.RC_CORREO,// response.correo,//RC_CORREO
                            "dtspsl_telefono" : response.telefonoFijoJuridico,
                            "dtspsl_movil" : "",// response.celular,
                            "dtspsl_estado" : "ACTIVO",
                            "dtspsl_estado_activacion" : "DESBLOQUEADO",
                            "dtspsl_observacion_activacion" : "NINGUNA",
                            "dtspsl_fec_activacionf" : fechactual,
                            "dtspsl_fec_activaciond" : fechactual,
                            "dtspsl_tipo_persona" : tipoPersona,
                            "dtspsl_direccion" : response.direccionJuridico,
                            "dtspsl_sistema" :  'IF247'
                        }
                    ]
                }
            };
        }

       DreamFactory.api[CONFIG.SERVICERC].createRecords(parametros).success(function (results){
            if(results.record.length > 0){
                $scope.registro = '';
                if(tipoPersona == "NATURAL") {
                    if (sCorreo==""  && sCelular== "") {
                        var mensajeExito = "Formulario Almacenado. Estimado Ciudadano debe tomar nota de su Nro PIN : " + sNumeroAleatorio;

                        var sReferencia ="warning";
                        $scope.envioMensaje(mensajeExito, sReferencia);
                    } else {
                        if (sCorreo != "") {
                            var mensajeExito = "Formulario Almacenado. Estimado Ciudadano se envio el Nro PIN : " + sNumeroAleatorio + " a " + sCorreo;

                            $scope.envioMensaje(mensajeExito, sCorreo);
                        } else {
                            var mensajeExito = "Formulario Almacenado. Estimado Ciudadano se envio el Nro PIN : " + sNumeroAleatorio + " a " + sCelular;

                            $scope.envioMensaje(mensajeExito, sCelular);
                        }
                    }
                } else if(tipoPersona == "JURIDICO") {
                    if (sCorreo==""  && sCelular== "") {
                        var mensajeExito = "Formulario Almacenado. Estimado Ciudadano debe tomar nota de su Nro PIN : " + sNumeroAleatorio;

                        $("#cerrar").click();
                        var sReferencia ="warning";
                        $scope.envioMensaje(mensajeExito, sReferencia);
                    } else {
                        if (sCorreo != "") {
                            var mensajeExito = "Formulario Almacenado. Estimado Ciudadano se envio el Nro PIN : " + sNumeroAleatorio + " a " + sCorreo;

                            $("#cerrar").click();
                            $scope.envioMensaje(mensajeExito, sCorreo);
                        } else {
                            var mensajeExito = "Formulario Almacenado. Estimado Ciudadano se envio el Nro PIN : " + sNumeroAleatorio + " a " + sCelular;

                            $("#cerrar").click();
                            $scope.envioMensaje(mensajeExito, sCelular);
                        }
                    }
                }else{
                     $scope.msg = "Error !!";
                }
            }
        }).error(function(results){
        });
    };//FIN REGISTRAR DATOS RC

     //MODIFICAR REGISTRO CIUDADANO (NATURAL O JURIDICO)
    /*$scope.modificarRegistroCiudadano = function (response) {

    console.log('modificar: ',response);
        var fecha= new Date();
        var mes = fecha.getMonth() + 1;
        if(mes.toString().length == 1)
            mes = '0'+mes;
        var dia = fecha.getDate();
        if(dia.toString().length == 1)
            dia='0'+dia;
        var fechactual=fecha.getFullYear() + "-" + mes + "-" + dia + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        var tipoPersona  = $scope.tipoPersonaRc;
        var oidCiudadano = $scope.rcOid;
        var datos        = {};

        if(tipoPersona == 'NATURAL'){
            $scope.aDatosRc[0].dtspsl_expedido       = response.region;
            $scope.aDatosRc[0].dtspsl_nombres        = response.RC_NOMBRE;
            $scope.aDatosRc[0].dtspsl_paterno        = response.RC_PATERNO;
            $scope.aDatosRc[0].dtspsl_materno        = response.RC_MATERNO;
            $scope.aDatosRc[0].dtspsl_direccion      = response.direccion;
            $scope.aDatosRc[0].dtspsl_correo         = response.INT_CORREO;
            $scope.aDatosRc[0].dtspsl_movil          = response.INT_TEL_CELULAR;
            $scope.aDatosRc[0].dtspsl_telefono       = response.telefonoFijo;
            $scope.aDatosRc[0].dtspsl_fec_nacimiento = response.RC_FECHA_NAC;
            $scope.aDatosRc[0].dtspsl_modificado = fechactual;
            $scope.aDatosRc[0].dtspsl_sistema = 'IF247';
            //NUMERO ALEATORIO
            sNumeroAleatorio = Math.round(Math.random()*100000) + response.cedula;
        }else{
            $scope.aDatosRc[0].dtspsl_correo       = response.RC_CORREO;
            $scope.aDatosRc[0].dtspsl_direccion    = response.direccionJuridico;
            $scope.aDatosRc[0].dtspsl_telefono     = response.telefonoFijoJuridico;
            $scope.aDatosRc[0].dtspsl_razon_social = response.nombreRazonSocial;
            $scope.aDatosRc[0].dtspsl_modificado   = fechactual;
            $scope.aDatosRc[0].dtspsl_sistema   = "IF247";
            //NUMERO ALEATORIO
            sNumeroAleatorio = Math.round(Math.random()*100000) + response.RC_NIT;
        }

        var parametros = {
            "table_name":"Ciudadano",
            "ids" : oidCiudadano,
            "body":{
                 "record": [$scope.aDatosRc[0]]
            }
        };
        DreamFactory.api[CONFIG.SERVICERC].updateRecordsByIds(parametros).success(function (results){
        var mensajeExito = "Datos modificados correctamente.";
            sweet.show('', mensajeExito, 'success');
        });
    };*/

    $scope.modificarRegistroCiudadano = function (response) {

    console.log('modificar: ',response);
        var fecha= new Date();
        var mes = fecha.getMonth() + 1;
        if(mes.toString().length == 1)
            mes = '0'+mes;
        var dia = fecha.getDate();
        if(dia.toString().length == 1)
            dia='0'+dia;
        //var fechactual=fecha.getFullYear() + "-" + mes + "-" + dia + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
        var tipoPersona  = $scope.tipoPersonaRc;
        var oidCiudadano = $scope.rcOid;
        var datos        = {};

    var persona = {};

        if(tipoPersona == 'NATURAL'){

     persona['dtspsl_expedido'] = response.region;
        persona['dtspsl_nombres'] = response.RC_NOMBRE;
        persona['dtspsl_paterno'] = response.RC_PATERNO;
        persona['dtspsl_materno'] = response.RC_MATERNO;
        persona['dtspsl_direccion'] = response.direccion;
        persona['dtspsl_correo'] = response.INT_CORREO;
        persona['dtspsl_movil'] = response.INT_TEL_CELULAR;
        persona['dtspsl_telefono'] = response.telefonoFijo;
        persona['dtspsl_fec_nacimiento'] = response.RC_FECHA_NAC;
        persona['dtspsl_modificado'] = fechactual;
        persona['dtspsl_sistema'] = 'IF247';

            sNumeroAleatorio = Math.round(Math.random()*100000) + response.cedula;
        }else{

            persona['dtspsl_correo'] = response.RC_CORREO;
        persona['dtspsl_direccion'] = response.direccionJuridico;
        persona['dtspsl_telefono'] = response.telefonoFijoJuridico;
        persona['dtspsl_razon_social'] = response.nombreRazonSocial;
        persona['dtspsl_modificado'] = fechactual;
        persona['dtspsl_sistema'] = "IF247";
            //NUMERO ALEATORIO
            sNumeroAleatorio = Math.round(Math.random()*100000) + response.RC_NIT;
        }

        var parametros = {
            "table_name":"Ciudadano",
            "ids" : oidCiudadano,
             "body":persona
        };
        DreamFactory.api[CONFIG.SERVICERC].updateRecordsByIds(parametros).success(function (results){
        var mensajeExito = "Datos modificados correctamente.";
            sweet.show('', mensajeExito, 'success');
        });
    };//FINALIZAR MODIFICAR RC


//FINALIZAR MODIFICAR RC


    $scope.isActive = false;

    $scope.inicioNexoValidarBtn = function(){
        $scope.desabilitadoFormulario = true;
        //$scope.desabilitadoTipoPersona = true;
        $scope.camposRcEncontrados = false;
        $scope.isActive = true;
        $scope.btnClass = "warning";
        $scope.btnActulizarClass = "success";
        $scope.btnMostrarRcConsulta = true;
        $scope.btnMostrarRcActualizar = false;
        //OCULTANDO MENSAJE
        $scope.spanOcultarMostrarExito = false;
        $scope.spanOcultarMostrarFracaso = false;
        /*VALIDACNION FORMULARIO JURIDICO*/
        $scope.desabilitadoFormularioJuridico = true;
    };

    $scope.habilitarFormJuridico = function(){
        $scope.desabilitadoFormulario = false;
    };

    $scope.mostrarBtnActualizar = function(){
        if($scope.consultaCiudadano){
            $scope.btnMostrarRcConsulta = true;
            $scope.btnMostrarRcActualizar = true;
            $scope.consultaCiuCampos = true;
            $scope.consultaCiuCampos2 = false;
        }
    };

    $scope.habilitarFormNatural = function(){
        $scope.desabilitadoFormulario = false;
    };

    $scope.cambiarColorBtn = function(){
        $scope.btnClass = "warning";
        $scope.btnMostrarRcActualizar = false;
        $scope.btnMostrarRcConsulta = true;
        $scope.consultaCiuCampos = false;
        $scope.consultaCiuCampos2 = true;
        $scope.limpiarCamposRcNatural();
        $scope.spanOcultarMostrarExito = false;
        $scope.spanOcultarMostrarFracaso = false;

        $scope.desabilitadoFormulario = true;

        /*VALIDANDO FORMULARIO JURIDICO*/
        $scope.desabilitadoFormularioJuridico = true;
        $scope.limpiarCamposRcJuridico();
    };

    /*REGISTROCIUDADANO*/
    /*comportamiento de los botones*/
     $scope.emisionprueba = function(datosRc){
        console.log('nuevo registro: ',datosRc);
       // $scope.sig='';
        console.log('pruebas');

       // $scope.sig=true;
        $scope.titulo="CREAR TRAMITE";
        if($scope.procesoid!='')    {
            $scope.adicionarCaso($scope.datosCaso);
            $scope.procventana=false;
        }
         $("#registro .close").click();

       /*   if($scope.botontit=="Siguiente" && $scope.procesoid!=''){
        $scope.botontit="Crear";
        $scope.botoncerrar="atras";
        $scope.tipoPersonaRc='';
        $scope.datos.INT_RL_NUM_DOCUMENTO='';
        $scope.datos='';
        $scope.tipo_hr='';
        //$scope.btnMostrarRcConsulta = false;
        $scope.btnMostrarRcActualizar = false;

        }
         else{
        console.log('error');
        if($scope.botontit=="Crear"){
            console.log('adicionar');
             $scope.adicionarCaso($scope.datosCaso);
             $("#registro .close").click();
             //REGISTROCIUDADANO
            if(!$scope.consultaCiudadano){
            console.log('nuevo registro');

                if($scope.tipoPersonaRc == 'JURIDICO'){
                    //VALIDANDO NIT
                    if(datosRc.RC_NIT != 0 && datosRc.RC_NIT.length >= 5){
                        $scope.registroCiudadanoR(datosRc);
                    }
                }else{
                    $scope.registroCiudadanoR(datosRc);
                }
            }else{

            }

        }
         else{
            console.log('error en adicionar');
            sweet.show('', "No selecciono ningun tramite", 'error');
            $scope.botontit=null;
                }
        }*/

        }

    $scope.mouseOver = function (proceso) {
           $scope.colorb = proceso;
        };

    $scope.emisioncerrar = function(){
        if($scope.botoncerrar=="atras"){
           $scope.procventana=true;
           $scope.sig=false;
           $scope.botoncerrar="Cerrar";
           $scope.botontit="Siguiente";
        }
        else{
            if($scope.botoncerrar=="Cerrar"){
               $scope.botoncerrar="Cerrar";
               $("#registro .close").click();
               $.unblockUI();
            }
        }
    }



    /***FIN DE HISTORICO***/
    $scope.$on('api:ready',function(){
        $scope.usuarioid = sessionService.get('IDUSUARIO');
        sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
        $scope.inciarUpload();
         $scope.unidadOrganizacional();
      $scope.cargarFuncionario();
    });
    $scope.inicioCasos = function () {
         console.log("======>>",$scope.datos.UBM_UNIDAD_EJECUTORA);
        if(DreamFactory.api[CONFIG.SERVICE]){
            $scope.usuarioid = sessionService.get('IDUSUARIO');
            sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
            $scope.inciarUpload();
                            console.log("aqui tiene que haner el dato ==>",$scope.datos);
                            console.log("aqui tiene que haner el dato ==>",$scope.datos.UBM_UNIDAD_SOLICITANTE_VALOR);
                            $scope.cargarFuncionario();
                            console.log("aqui esta el valor del tecnico",$scope.datos.UBM_TECNICO_UBM);
                            $scope.datos.UBM_TECNICO_UBM = $scope.datos.UBM_TECNICO_UBM;

                            setTimeout(function () {
                                $scope.$apply(function () {
                                    var x = $scope.datos.UBM_UNIDAD_SOLICITANTE.split('-');
                                        $scope.datos.UBM_UNIDAD_SOLICITANTE=x[0];
                                       $scope.cargarUnidades();
                                    document.getElementById("UBM_UNIDAD_SOLICITANTE").value = $scope.datos.UBM_UNIDAD_SOLICITANTE;
                                    $scope.datos.UBM_UNIDAD_SOLICITANTE = $scope.datos.UBM_UNIDAD_SOLICITANTE;
                                    console.log("123456",$scope.datos.UBM_UNIDAD_SOLICITANTE);
                                });
                            }, 2000);

                            console.log("aqui talvez tb puede estar===>",document.getElementById("UBM_UNIDAD_SOLICITANTE_VALOR").value);
        }
    };

    var clsAtender = $rootScope.$on('atenderOtro', function(event, data, estado){
        $scope.atenderCaso(data, estado);
    });   
    $scope.$on('$destroy', function() {
        clsAtender(); 
    });

});
