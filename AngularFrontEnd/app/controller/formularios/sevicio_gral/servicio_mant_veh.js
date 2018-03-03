app.controller('servicio_mantenimientoController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
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
    console.log(opc);
    console.log(codigo);
    console.log(otro);
    //var nume= opc.toString();
    
   // var nume1=nume.toUpperCase();
   /* var reslol = {
      "procedure_name":"sp_carga_table_servicio_mant",
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
          "param_type":"IN","value":opc
        }           
        ] }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslol);
      obj.success(function (respon) {
        $scope.grupos=respon;
      });
      obj.error(function(error) {
        console.log("se fue al error noooooooooooo....");         
      });*/
    };

    $scope.fechini='';
    $scope.fechfin='';
    
    $scope.getMostrarTabla= function(cod,registro){
      $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
      $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
      $scope.TablaCreacion = true;
      var reslocal = {
        "procedure_name":"sp_carga_table_serviciomant_fech",
        "body":{
          "params": [
          {
            "name":"cod",
            "param_type":"IN","value":cod
          },
          {
            "name":"fechini",
            "param_type":"IN","value":$scope.fechini
          },
          {
            "name":"fechfin",
            "param_type":"IN","value":$scope.fechfin
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
            {title: "Codigo de Vehículo", dataKey: "codigo"}, 
            {title: "Tipo de Vehículo", dataKey: "tip_vehiculo"}, 
            {title: "Marca", dataKey: "marca"},
            {title: "Unidad Solicitante", dataKey: "asignado"},
            {title: "Placa", dataKey: "placa"},
            {title: "Fecha de Salida Taller", dataKey: "fsal"},
            {title: "Estado Tramite", dataKey: 'estado'}

            ];
            var data=[];
            i=0;
            angular.forEach($scope.obtpdf,function(celda, fila){            
              var aporte = {};
              aporte['#'] = i+1;
              aporte['codigo'] = celda['codigo'];
              aporte['tip_vehiculo'] = celda['tip_vehiculo'];
              aporte['marca'] = celda['marca'];
              aporte['asignado'] = celda['asignado']; 
              aporte['placa'] = celda['placa']; 
              aporte['fsal'] = celda['fsal']; 
              aporte['estado tramite'] = celda['estado'];  

              if(celda['estado'] == 'A') 
                    {       
                        aporte['estado'] = 'EN PROCESO'; 
                    }        
                    else          
                    { 
                        aporte['estado'] = 'CONCLUIDO'; 
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
              doc.text("REPORTE DE DIAGNÓSTICO Y MANTENIMIENTO VEHICULAR", data.settings.margin.left + 80, 115);
            };
            doc.setFontSize(10);
            doc.text('DEL: ' + $scope.fechini+   '    AL:  ' + $scope.fechfin,  210, 150,0,235);

            switch ($scope.numero){
              case '0':
              doc.setFontSize(11);
              doc.text('Por Solicitud de Servicio',  230, 135);
              break;
              case '5':
              doc.setFontSize(11);
              doc.text('Por Unidad Solicitante',  240, 135);
              break;
              case '6':
              doc.setFontSize(11);
              doc.text('Por Placa de Vehículo',  240, 135);  
              break;
              case '3':
              doc.setFontSize(11);
              doc.text('Por Tipo de Vehículo',  240, 135);  
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
              var vector=[];
              for(var i=0; i<8;i++){
                if($scope.datos.USG_MOTOR[i].estado){
                  vector[i]='X';
                }
                else{
                  vector[i]=' ';
                }
              }
              var vectorx_0=[];
              for(var i=0; i<4;i++){
                if($scope.datos.USG_DIR_TRA[i].estado){
                  vectorx_0[i]='X';
                }
                else{
                  vectorx_0[i]=' ';
                }
              }
              var vectorx_1=[];
              for(var i=0; i<4;i++){
                if($scope.datos.USG_FRENO[i].estado){
                  vectorx_1[i]='X';
                }
                else{
                  vectorx_1[i]=' ';
                }
              }
              var vectorx_2=[];
              for(var i=0; i<4;i++){
                if($scope.datos.USG_LUBR[i].estado){
                  vectorx_2[i]='X';
                }
                else{
                  vectorx_2[i]=' ';
                }
              }
              var vectorx_3=[];
              for(var i=0; i<8;i++){
                if($scope.datos.USG_SUSP_D[i].estado){
                  vectorx_3[i]='X';
                }
                else{
                  vectorx_3[i]=' ';
                }
              }
              var vectorx_4=[];
              for(var i=0; i<5;i++){
                if($scope.datos.USG_TRA_DIF[i].estado){
                  vectorx_4[i]='X';
                }
                else{
                  vectorx_4[i]=' ';
                }
              }
              var vectorx_5=[];
              for(var i=0; i<6;i++){
                if($scope.datos.USG_SUS[i].estado){
                  vectorx_5[i]='X';
                }
                else{
                  vectorx_5[i]=' ';
                }
              }
              var vectorx_6=[];
              for(var i=0; i<5;i++){
                if($scope.datos.USG_SIS_ELEC[i].estado){
                  vectorx_6[i]='X';
                }
                else{
                  vectorx_6[i]=' ';
                }
              }
              var vectorx_7='';
              if($scope.datos.USG_ENFR=true){
                vectorx_7='X';
              }
              else{
                vectorx_7=' ';
              }
              var columns = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"},
              {title: "cuarto", dataKey: "cuar"}
              ];
              var data = [
              {"prim":"Tipo de Servicio:","seg":$scope.datos.USG_SOL_VH_VALOR,"ter":"Orden nro:","cuar":$scope.datos.AE_NRO_CASO},
              {"prim":"Tipo de Vehiculo:","seg":$scope.datos.USG_VEHI,"ter":"Marca:","cuar":$scope.datos.USG_MARCA},
              {"prim":"Asignado al Area:","seg":$scope.datos.USG_ASIGNADO,"ter":"Placa:","cuar":$scope.datos.USG_PLACA},
              {"prim":"Fecha de Ingreso a Taller:","seg":$scope.datos.USG_FEC_ING,"ter":"Fecha Salida del Taller:","cuar":$scope.datos.USG_FEC_SALE},
              {"prim":"Combustible:","seg":$scope.datos.USG_COMBO,"ter":"Kilometraje","cuar":$scope.datos.USG_KIL},   
              ];

              var columns2 = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"},
              {title: "cuarto", dataKey: "cuar"}
              ];
              var data2 = [
              {"prim":'',"seg":'',"ter":'',"cuar":''},
              {"prim":"MOTOR:","seg":$scope.datos.PTR_FEC_CREA,"ter":"SISTEMA DE DIRECCION Y TRANSMISION","cuar":" "},
              {"prim":$scope.datos.USG_MOTOR[0].resvalor,"seg":vector[0],"ter":$scope.datos.USG_DIR_TRA[0].resvalor,"cuar":vectorx_0[0]},
              {"prim":$scope.datos.USG_MOTOR[1].resvalor,"seg":vector[1],"ter":$scope.datos.USG_DIR_TRA[1].resvalor,"cuar":vectorx_0[1]},
              {"prim":$scope.datos.USG_MOTOR[2].resvalor,"seg":vector[2],"ter":$scope.datos.USG_DIR_TRA[2].resvalor,"cuar":vectorx_0[2]},
              {"prim":$scope.datos.USG_MOTOR[3].resvalor,"seg":vector[3],"ter":$scope.datos.USG_DIR_TRA[3].resvalor,"cuar":vectorx_0[3]},
              {"prim":$scope.datos.USG_MOTOR[4].resvalor,"seg":vector[4],"ter":'',"cuar":''},
              {"prim":$scope.datos.USG_MOTOR[5].resvalor,"seg":vector[5],"ter":"SISTEMA DE LUBRICACION","cuar":" "},
              {"prim":$scope.datos.USG_MOTOR[6].resvalor,"seg":vector[6],"ter":$scope.datos.USG_LUBR[0].resvalor,"cuar":vectorx_2[0]},
              {"prim":$scope.datos.USG_MOTOR[7].resvalor,"seg":vector[7],"ter":$scope.datos.USG_LUBR[1].resvalor,"cuar":vectorx_2[1]},
              {"prim":$scope.datos.USG_MOTOR[8].resvalor,"seg":vector[8],"ter":$scope.datos.USG_LUBR[2].resvalor,"cuar":vectorx_2[2]},
              {"prim":'',"seg":'',"ter":$scope.datos.USG_LUBR[3].resvalor,"cuar":vectorx_2[3]},
              {"prim":"SISTEMA DE FRENO:","seg":'',"ter":'',"cuar":''},
              {"prim":$scope.datos.USG_FRENO[0].resvalor,"seg":vectorx_1[0],"ter":"SISTEMA DE TRANSMISION DIFERENCIAL","cuar":''},
              {"prim":$scope.datos.USG_FRENO[1].resvalor,"seg":vectorx_1[1],"ter":$scope.datos.USG_TRA_DIF[0].resvalor,"cuar":vectorx_4[0]},
              {"prim":$scope.datos.USG_FRENO[2].resvalor,"seg":vectorx_1[2],"ter":$scope.datos.USG_TRA_DIF[1].resvalor,"cuar":vectorx_4[1]},
              {"prim":$scope.datos.USG_FRENO[3].resvalor,"seg":vectorx_1[3],"ter":$scope.datos.USG_TRA_DIF[2].resvalor,"cuar":vectorx_4[2]},
              {"prim":'',"seg":'',"ter":$scope.datos.USG_TRA_DIF[3].resvalor,"cuar":vectorx_4[3]},
              {"prim":"SISTEMA DE SUSPENSION DELANTERA:","seg":''},
              {"prim":$scope.datos.USG_SUSP_D[0].resvalor,"seg":vectorx_3[0],"ter":$scope.datos.USG_TRA_DIF[4].resvalor,"cuar":vectorx_4[4]},
              {"prim":$scope.datos.USG_SUSP_D[1].resvalor,"seg":vectorx_3[1],"ter":'',"cuar":''},
              {"prim":$scope.datos.USG_SUSP_D[2].resvalor,"seg":vectorx_3[2],"ter":"SISTEMA ELECTRICO","cuar":''},
              {"prim":$scope.datos.USG_SUSP_D[3].resvalor,"seg":vectorx_3[3],"ter":$scope.datos.USG_SIS_ELEC[0].resvalor,"cuar":vectorx_6[0]},
              {"prim":$scope.datos.USG_SUSP_D[4].resvalor,"seg":vectorx_3[4],"ter":$scope.datos.USG_SIS_ELEC[1].resvalor,"cuar":vectorx_6[1]},
              {"prim":$scope.datos.USG_SUSP_D[5].resvalor,"seg":vectorx_3[5],"ter":$scope.datos.USG_SIS_ELEC[2].resvalor,"cuar":vectorx_6[2]},
              {"prim":$scope.datos.USG_SUSP_D[6].resvalor,"seg":vectorx_3[6],"ter":$scope.datos.USG_SIS_ELEC[3].resvalor,"cuar":vectorx_6[3]},
              {"prim":$scope.datos.USG_SUSP_D[7].resvalor,"seg":vectorx_3[7],"ter":$scope.datos.USG_SIS_ELEC[4].resvalor,"cuar":vectorx_6[4]},
              {"prim":$scope.datos.USG_SUSP_D[8].resvalor,"seg":vectorx_3[8],"ter":'',"cuar":''},
              {"prim":'',"seg":'',"ter":"SISTEMA DE ENFRIAMIENTO","cuar":''},
              {"prim":"SISTEMA DE SUSPENSION","seg":'',"ter":'Revisión de radiador, tapa de radiador, manguera, bomba de agua, acople, aspa',"cuar":vectorx_7},
              {"prim":$scope.datos.USG_SUS[0].resvalor,"seg":vectorx_5[0]},
              {"prim":$scope.datos.USG_SUS[1].resvalor,"seg":vectorx_5[1]}
              ];   

              var columns3 = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"},
              {title: "cuarto", dataKey: "cuar"}
              ];
              var data3 = [
              {"prim":$scope.datos.USG_SUS[2].resvalor,"seg":vectorx_5[2]},
              {"prim":$scope.datos.USG_SUS[3].resvalor,"seg":vectorx_5[3]},
              {"prim":$scope.datos.USG_SUS[4].resvalor,"seg":vectorx_5[4]},
              {"prim":$scope.datos.USG_SUS[5].resvalor,"seg":vectorx_5[5]}
              ];  
              var columns4 = [
              {title: "primero", dataKey: "prim"}
              ];
              var data4 = [
              {"prim":'OBSERVACIONES'},
              {"prim":''}
              ]; 
              var columns5 = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"}
              ];
              var data5 = [
              {"prim":'',"seg":'',"ter":''},
              {"prim":"Solicitante","seg":"Autorizacion Jefatura USG","ter":"Tecnico Mecanico USG"}
              ];
              var doc = new jsPDF('p', 'pt');
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
              doc.setFontSize(11);
              doc.text('SERVICIO DE DIAGNÓSTICO Y MANTENIMIENTO VEHÍCULAR',150,120);
              doc.autoTable(columns2.splice(0,4), data, {drawHeaderRow: function() {return false;} ,
                startY: 130,pageBreak: 'avoid',theme: 'amarillo',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 120, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'},seg: {columnWidth: 170},ter: {columnWidth: 120,fontStyle: 'bold'},cuar: {columnWidth: 100}}
              });
              doc.setFontSize(12);
              doc.autoTable(columnsLong.splice(0,4), data2,  {drawHeaderRow: function() {return false;},
                theme: 'amarillo',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 130, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 235,fontStyle: 'middle'},seg: {columnWidth: 30},ter: {columnWidth: 235,fontStyle: 'middle'},cuar: {columnWidth: 30}}, pageBreak: 'avoid',
              });
              doc.setFontSize(12);
              doc.autoTable(columns3.splice(0,4), data3,  {drawHeaderRow: function() {return false;},
                theme: 'amarillo',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 230,fontStyle: 'middle'},seg: {columnWidth: 30},ter: {columnWidth: 235,fontStyle: 'middle'},cuar: {columnWidth: 30}}, pageBreak: 'avoid',
              });
              doc.setFontSize(12);
              doc.autoTable(columns4.splice(0,1), data4,  {drawHeaderRow: function() {return false;},
                theme: 'amarillo',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 400,fontStyle: 'middle'}}, pageBreak: 'avoid',
              });
              doc.setFontSize(12);
              doc.autoTable(columns5.splice(0,3), data5,  {drawHeaderRow: function() {return false;},
                theme: 'amarillo',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 180,fontStyle: 'middle'},seg: {columnWidth: 180},ter: {columnWidth: 180,fontStyle: 'middle'}}, pageBreak: 'avoid',
              });
              if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
              }
              doc.save('ficha'+'.pdf');

            });
obj.error(function(error) {
  console.log("se fue al error de tabla casos");  
});
};

$scope.$on('api:ready',function(){      
});  
$scope.inicioCrear = function () {

};
});

