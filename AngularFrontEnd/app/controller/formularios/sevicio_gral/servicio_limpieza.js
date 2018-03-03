app.controller('servicio_limpiezaController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
  var fecha= new Date();
  var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
  var size = 10;
  $scope.startDateOpen = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.startDateOpened = true;
  };
  $scope.startDateOpen1 = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.startDateOpened1 = true;
  };
  $scope.getTabla = function(codigo,opc,otro){
    var nume= opc.toString();
    var nume1=nume.toUpperCase();
    var reslol = {
      "procedure_name":"sp_carga_servicio_limpieza",
      "body":{
        "params": [
        {
          "name":"cod",
          "param_type":"IN","value":codigo
        },
        {
          "name":"cam",
          "param_type":"IN","value":otro
        },
        {
          "name":"num",
          "param_type":"IN","value":nume1
        }           
        ] }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslol);
      obj.success(function (respon) {
        $scope.grupos=respon;
      });
      obj.error(function(error) {        
      });
    };
    $scope.fechini='';
    $scope.fechfin='';
    $scope.getMostrarTabla= function(cod,registro){
      $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
      $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
      $scope.TablaCreacion = true;
      var reslocal = {
        "procedure_name":"sp_carga_serv_limpieza",
        "body":{
          "params": [
          {
            "name":"cod",
            "param_type":"IN","value":cod
          },
          {
            "name":"fechini",
            "param_type":"IN","value": $scope.fechini
          },
          {
            "name":"fechfin",
            "param_type":"IN","value": $scope.fechfin
          }
          ] }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
        obj.success(function (response) {
          $scope.grupos = response; 
        })
        obj.error(function(error) {           
          $scope.errors["error_creacion"] = error;         
        }); 
      }
      $scope.cargarDatos = function(campo,num){
        var reslocal = {
          "procedure_name":"sp_data_json",
          "body":{
            "params": [
            {
              "name":"cam",
              "param_type":"IN","value":campo
            },
            {
              "name":"prcid",
              "param_type":"IN","value":num
            }
            ] }
          };
          var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
          obj.success(function (response) {
            $scope.cargas = JSON.parse(response[0].sp_data_json);
          });
          obj.error(function(error) {       
          });
          var resloca = {
            "procedure_name":"sp_data_json2",
            "body":{
              "params": [
              {
                "name":"cam",
                "param_type":"IN","value":campo
              },
              {
                "name":"prcid",
                "param_type":"IN","value":num
              }
              ] }
            };
            var obje=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resloca);
            obje.success(function (respons) {
              $scope.carga = JSON.parse(respons[0].sp_data_json2);
            })
            obje.error(function(error) {       
            });  
          };
          $scope.numero='';
          $scope.getreportemant=function(numero){
            $scope.numero= numero;
            $scope.obtpdf = $scope.grupos;
            var columns = [
            {title: "#", dataKey: "#"},
            {title: "Codigo de Limpieza", dataKey: "codigo"}, 
            {title: "Unidad Solicitante", dataKey: "uni_solicitante"}, 
            {title: "Nomnbre de la Empresa", dataKey: "nom_empresa"},
            {title: "Fecha de Culminación", dataKey: "fech_limp_1"},
            {title: "Nº de Contrato", dataKey: "nro_contrato"}
            ];
            var data=[];
            i=0;
            angular.forEach($scope.obtpdf,function(celda, fila){            
              var aporte = {};
              aporte['#'] = i+1;
              aporte['codigo'] = celda['codigo'];
              aporte['uni_solicitante'] = celda['uni_solicitante'];
              aporte['nom_empresa'] = celda['nom_empresa'];
              aporte['fech_limp_1'] = celda['fech_limp_1'];
              aporte['nro_contrato'] = celda['nro_contrato']; 
              if(celda['uni_solicitante'] == null)
              {       
                aporte['uni_solicitante'] = '';
              } 
              data[i]=aporte;
              i++;
            });
            var doc = new jsPDF('p', 'pt');
            var columnsLong = columns;

            var header = function (data) {
              doc.setFontSize(12);
              doc.setTextColor(40);
              doc.setFontStyle('normal');
              doc.addImage(USG, 'JPEG', data.settings.margin.left, 35, 540, 60);
              doc.text("REPORTE DE SERVICIO DE LIMPIEZA", data.settings.margin.left + 150, 120);
            };
            doc.setFontSize(10);
            doc.text('Del: ' + $scope.fechini+   '    Al:  ' + $scope.fechfin,  210, 150,0,235);
            switch ($scope.numero){
              case '7':
              doc.setFontSize(11);
              doc.text('Por Unidad Solicitante',  230, 135);
              break;
              case '6':
              doc.setFontSize(11);
              doc.text('Por Empresa',  260, 135);
              break;
            } 
            var totalPagesExp = "{total_pages_count_string}";
            var footer = function (data) {
              var str = "Pagina " + data.pageCount;
              if (typeof doc.putTotalPages === 'function') {
                str = str + " de " + totalPagesExp;
              }
              doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
            };
            var options = {
              beforePageContent: header,
              afterPageContent: footer,
              theme : 'amarillo',
              margin: {horizontal: 30, top: 165, bottom: 80},
              styles: {overflow: 'linebreak'},
              columnStyles: {codigo: {columnWidth: 'wrap'}},bodyStyles: {rowHeight: 10, fontSize: 8, valign: 'middle'}
            } ;

            doc.autoTable(columnsLong, data, options);
            if (typeof doc.putTotalPages === 'function') {
              doc.putTotalPages(totalPagesExp);
            }
            doc.save('cod_idcaso'+'.pdf');
          };

          $scope.ejemplo3=function(cod_idcaso,id_for){

            var resDatos = {
              "table_name":"_fr_formulario_dinamico",
              "filter": "campo_id="+id_for
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
            obj.success(function (response) {
              $scope.dato=JSON.parse(response.record[0].campo_descripcion);
              $scope.ejemplo2(cod_idcaso);

            });
            obj.error(function(error) {  

            });
          };
          $scope.ejemplo2=function(cod_idcaso){

            var resDatos = {
              "table_name":"_fr_casos",
              "filter": "cas_id="+cod_idcaso
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
            obj.success(function (response) {    
              $scope.datos=JSON.parse(response.record[0].cas_datos); 
              var columns = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"},
              {title: "cuarto", dataKey: "cuar"}
              ];
              var data = [
              {"prim":"Fecha Del:","seg":$scope.datos.USG_FEC_DEL,"ter":"Fecha Al:","cuar":$scope.datos.USG_FEC_AL},
              {"prim":"Nombre de la Empresa:","seg":$scope.datos.USG_NOM_EMP_VALOR},
              {"prim":"Area de Atención:","seg":$scope.datos.USG_UO_SOL_VALOR},
              {"prim":"Ubicación:","seg":$scope.datos.USG_UBIC},
              ];
              var colhis = [
              {title: "DESCRIPCION DE SERVICIO ", dataKey: "uno"},
              {title: "FRECUENCIA ", dataKey: "dos"},
              {title: "1 SEM ", dataKey: "tres"},
              {title: "2 SEM ", dataKey: "cuar"},
              {title: "3 SEM ", dataKey: "cin"},
              {title: "4 SEM ", dataKey: "seis"},
              {title: "OBSERVACIONES ", dataKey: "siete"}           
              ];
              var datahis = [];
              var j=0;
              for (var i=0; i<$scope.datos.USG_PER_EVALU.length;i++){
                var aporte = {"uno": $scope.datos.USG_PER_EVALU[i].USG_DESC_SER,
                "dos": $scope.datos.USG_PER_EVALU[i].USG_FREC,
                "tres":$scope.datos.USG_PER_EVALU[i].USG_P_SEM,
                "cuar":$scope.datos.USG_PER_EVALU[i].USG_S_SEM,
                "cin": $scope.datos.USG_PER_EVALU[i].USG_T_SEM,
                "seis":$scope.datos.USG_PER_EVALU[i].USG_C_SEM,
                "siete":$scope.datos.USG_PER_EVALU[i].USG_OBS};

                datahis[i]=aporte; 

              }
              var doc = new jsPDF('L', 'pt');
              var columnsLong = columns;
              var header = function (data) {
                doc.setFontSize(16);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
                doc.addImage(USG, 'JPEG', data.settings.margin.left, 35, 540, 60);
              };
              var totalPagesExp = "{total_pages_count_string}";
              var footer = function (data) {
                var str = "Pagina " + data.pageCount;
                if (typeof doc.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
                }
                doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
              };
              doc.setFontSize(8);
              doc.setFontSize(13);
              doc.text('FICHA DE CONTROL  SERVICIO DE LIMPIEZA',290,120);
              doc.autoTable(columns.splice(0,4), data, {drawHeaderRow: function() {return false;} ,
                startY: 130,pageBreak: 'avoid',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 9, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 120, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'},seg: {columnWidth: 250},ter: {columnWidth: 60,fontStyle: 'bold'},cuar: {columnWidth:150}}
              });
              doc.autoTable(colhis.splice(0,11), datahis,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 9, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 9, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 200},dos: {columnWidth: 80},tres: {columnWidth: 80},cuar: {columnWidth: 80},cin: {columnWidth: 80},seis: {columnWidth: 80},siete: {columnWidth: 120}}});
              if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
              }
              doc.save('ficha'+'.pdf');
            });
            obj.error(function(error) {

            });
          };
          $scope.$on('api:ready',function(){      
          }); 
          $scope.inicioCrear = function () {
          }; 
        });