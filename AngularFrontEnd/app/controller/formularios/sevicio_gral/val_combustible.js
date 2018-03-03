app.controller('combustibleController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
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
      "procedure_name":"sp_carga_combustible",
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
        "procedure_name":"sp_carga_combustible_fech",
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
            {title: "PLACA DE VEHÍCULO", dataKey: "placa"},
            {title: "UNIDAD SOLICITANTE", dataKey: "unidad"}, 
            {title: "TIPO COMBUSTIBLE", dataKey: "tipo_combustible"},
            {title: "VALES ENTREGADOS", dataKey: "vales"}, 
            {title: "TOTAL LITROS", dataKey: "total_litros"},
            {title: "VALES ADI. ENTREGADOS", dataKey: "vales1"},
            {title: "TOTAL LITROS ADICIONALES", dataKey: 'total_litros1'},
            {title: "FECHA DE CULMINACIÓN", dataKey: 'fech_al'}

            ];
            var data=[];
            i=0;
            angular.forEach($scope.obtpdf,function(celda, fila){            
              var aporte = {};
              aporte['#'] = i+1;
              aporte['placa'] = celda['placa']; 
              aporte['unidad'] = celda['unidad'];
              aporte['tipo_combustible'] = celda['tipo_combustible'];
              aporte['vales'] = celda['vales']; 
              aporte['total_litros'] = celda['total_litros']; 
              aporte['vales1'] = celda['vales1'];    
              aporte['total_litros1'] = celda['total_litros1']; 
              aporte['fech_al'] = celda['fech_al']; 

              if(celda['tipo_combustible'] === 'undefined') 
                     {       
                        aporte['tipo_combustible'] = ''; 
                    }        


              if(celda['placa'] == null) 
                    {       
                        aporte['placa'] = '-'; 
                    }        
              if(celda['vales'] == null) 
                     {       
                        aporte['vales'] = '-'; 
                    }        

              if(celda['total_litros'] == null) 
                     {       
                        aporte['total_litros'] = '-'; 
                    }    
              if(celda['vales1'] == null) 
                     {       
                        aporte['vales1'] = '-'; 
                    }  
              if(celda['total_litros1'] == null) 
                     {       
                        aporte['total_litros1'] = '-'; 
                    }      

               
              data[i]=aporte;
              i++;
            });
            var doc = new jsPDF('L', 'pt');
            var columnsLong = columns;
            var header = function (data) {
              doc.setFontSize(15);
              doc.setTextColor(40);
              doc.setFontStyle('normal');
              doc.addImage(USG, 'JPEG', data.settings.margin.left, 35, 790, 60);
              doc.text("REPORTE DE VALES DE COMBUSTIBLE", data.settings.margin.left + 240, 115);

            };
            doc.setFontSize(12);
            doc.text('Del: ' + $scope.fechini+   '    Al:  ' + $scope.fechfin,  320, 155,0,235);

            switch ($scope.numero){
              case '3':
              doc.setFontSize(13);
              doc.text('Por Unidad Solicitante',  350, 135);
              break;
              case '5':
              doc.setFontSize(13);
              doc.text('Por Tipo de Motorizado',  350, 135);
              break;
              case '1':
              doc.setFontSize(13);
              doc.text('Por el Tipo de Combustible',  330, 135);  
              break;
              case '9':
              doc.setFontSize(13);
              doc.text('Por Vales Adicionales',  350, 135);  
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
              columnStyles: {codigo: {columnWidth: 'wrap'}}
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
              {title: "aaaaaa", dataKey: "cero"},
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"},
              {title: "cuarto", dataKey: "cuar"}
              ];
              var data = [
              {"cero":" ","prim":''},  
              {"cero":" ","prim":"DEL:","seg":$scope.datos.USG_FEC_DEL ,"ter":" AL :","cuar":$scope.datos.USG_FEC_AL}
              ];
              if($scope.datos.USG_TIP_MOT_VALOR === 'undefined')
                {$scope.datos.USG_TIP_MOT_VALOR =" ";}
              if($scope.datos.USG_TIP_COMB_VALOR === 'undefined')
                {$scope.datos.USG_TIP_COMB_VALOR =" ";}
              if($scope.datos.USG_TIP_MOT ==-1)
                {$scope.datos.USG_TIP_MOT_VALOR ="Vehículo";} 
              var columns2 = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"},
              {title: "cuarto", dataKey: "cuar"}
              ];
              var data2 = [
              {"prim":"TIPO DE COMBUSTIBLE:","seg":$scope.datos.USG_TIP_COMB_VALOR,"ter":'TIPO DE MOTORIZADO:',"cuar":$scope.datos.USG_TIP_MOT_VALOR},
              {"prim":" ","seg":''}, 
              ];
              var colhis = [
              {title: "PLACA", dataKey: "uno"},
              {title: "Cant. de Vales", dataKey: "dos"},
              {title: "(Serie) del", dataKey: "tres"},
              {title: "(Serie) al", dataKey: "cuar"},
              {title: "Total Litros Entregados", dataKey: "cin"},
              {title: "Cant. Utilizados", dataKey: "seis"},
              {title: "Kilometros inicial", dataKey: "siete"},
              {title: "Kilometros final", dataKey: "ocho"},
              {title: "Total Litros", dataKey: "nueve"},
              {title: "Cant No Utilizados", dataKey: "diez"},
              {title: "Total Litros No Utilizados", dataKey: "once"}
              ];
              var datahis = [];
              var j=0;
              for (var i=0; i<$scope.datos.USG_USA_DOS.length;i++){
                var aporte = {"uno": $scope.datos.USG_USA_DOS[i].USG_PLACA,
                "dos":$scope.datos.USG_USA_DOS[i].USG_CANT_VALES,
                "tres": $scope.datos.USG_USA_DOS[i].USG_ENTR,
                "cuar": $scope.datos.USG_USA_DOS[i].USG_ENTR1,
                "cin": $scope.datos.USG_USA_DOS[i].USG_TL,
                "seis": $scope.datos.USG_USA_DOS[i].USG_CANT_UTIL,
                "siete": $scope.datos.USG_USA_DOS[i].USG_KIL, 
                "ocho": $scope.datos.USG_USA_DOS[i].USG_KIL1,
                "nueve": $scope.datos.USG_USA_DOS[i].USG_TL1,
                "diez": $scope.datos.USG_USA_DOS[i].USG_CANT_VNO_UTIL,
                "once": $scope.datos.USG_USA_DOS[i].USG_TL2};
                datahis[i]=aporte; 
              }
              var coladi = [
              {title: "PLACA", dataKey: "uno"},
              {title: "Cant. de Vales", dataKey: "dos"},
              {title: "(Serie) del", dataKey: "tres"},
              {title: "(Serie) al", dataKey: "cuar"},
              {title: "Total Litros Entregados", dataKey: "cin"},
              {title: "Cant. Utilizados", dataKey: "seis"},
              {title: "Kilometro Inicial", dataKey: "siete"},
              {title: "Kilometro Final", dataKey: "ocho"},
              {title: "Total Litros", dataKey: "nueve"},
              {title: "Cant No Utilizados", dataKey: "diez"},
              {title: "Total Litros No Utilizados", dataKey: "once"}
              ];
              var dataadi = [];
              var j=0;
              for (var i=0; i<$scope.datos.USG_VAL_ADI.length;i++){
                var aporte = {"uno": $scope.datos.USG_VAL_ADI[i].USG_PLACA,
                "dos":$scope.datos.USG_VAL_ADI[i].USG_CANT_VALES,
                "tres": $scope.datos.USG_VAL_ADI[i].USG_ENTR,
                "cuar": $scope.datos.USG_VAL_ADI[i].USG_ENTR1,
                "cin": $scope.datos.USG_VAL_ADI[i].USG_TL,

                "seis": $scope.datos.USG_VAL_ADI[i].USG_CANT_UTIL,
                "siete": $scope.datos.USG_VAL_ADI[i].USG_KIL, 
                "ocho": $scope.datos.USG_VAL_ADI[i].USG_KIL1,
                "nueve": $scope.datos.USG_VAL_ADI[i].USG_TL1,
                "diez": $scope.datos.USG_VAL_ADI[i].USG_CANT_VNO_UTIL,
                "once": $scope.datos.USG_VAL_ADI[i].USG_TL2};

                dataadi[i]=aporte; 
              }
              var columns3 = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"},
              {title: "cuarto", dataKey: "cuar"},
              {title: "cinco", dataKey: "cin"}
              ];
              var data3 = [
              {"prim":" ","seg":''}, 
              {"prim":" ","seg":''}, 
              {"prim":" ","seg":''}, 
              {"prim":" ","seg":''}, 
              {"prim":'',"seg":'NOMBRE Y FIRMA',"ter":'',"cuar":'VoBo. SECRETARIA MUNICIPAL / DIRECTOR /',"cin":''},
              {"prim":'',"seg":'RESPONSABLE DE ADMINISTRACIÓN DE VALES',"ter":'',"cuar":'SUBALCALDE / JEFE DE UNIDAD',"cin":''}
              ];
              var doc = new jsPDF('l', 'pt');
              var columnsLong = columns;
              var header = function (data) {
                doc.setFontSize(16);
                doc.setTextColor(40);
                doc.setFontStyle('normal');
                doc.addImage(USG, 'JPEG', data.settings.margin.left, 35, 790, 60);
                doc.setDrawColor(0,0,0); 
                doc.setLineWidth(1.5);
                doc.line(50,100,810,100);
              };
              var totalPagesExp = "{total_pages_count_string}";
              var footer = function (data) {
              };
              doc.setFontStyle('bold');
              doc.setFontSize(14);
              doc.text('PLANILLA DE DESCARGO DE COMBUSTIBLE',270,120);
              doc.autoTable(columns.splice(0,5), data, {drawHeaderRow: function() {return false;} ,
                startY: 130,pageBreak: 'avoid',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 10, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 120, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {cero: {columnWidth: 260},prim: {columnWidth: 40,fontStyle: 'bold'},seg: {columnWidth: 70},ter: {columnWidth: 40,fontStyle: 'bold'},cuar: {columnWidth: 70}}
              });
              doc.setFontSize(12);
              doc.autoTable(columns2.splice(0,4), data2,  {drawHeaderRow: function() {return false;},
                theme: 'plain',startY: doc.autoTableEndPosY() +10,bodyStyles: {rowHeight: 12, fontSize:  9, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 125, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 140,fontStyle: 'bold'},seg: {columnWidth: 120},ter: {columnWidth: 120,fontStyle: 'bold'},cuar: {columnWidth: 50}}, pageBreak: 'avoid',
              });
              doc.setFontStyle('bold');
              doc.setFontSize(10);
              doc.text('VALES RECIBIDOS',180,doc.autoTableEndPosY() +25);
              doc.text('VALES NO UTILIZADOS',560,doc.autoTableEndPosY() +25);
              doc.autoTable(colhis.splice(0,11), datahis,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 9, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 70},dos: {columnWidth: 70},tres: {columnWidth: 50},cuar: {columnWidth: 50},cin: {columnWidth: 70},seis: {columnWidth: 65},siete: {columnWidth: 80},ocho: {columnWidth: 70},nueve: {columnWidth: 70},diez: {columnWidth: 90},once: {columnWidth: 70}}});
              doc.text('VALES ADICIONALES',380,doc.autoTableEndPosY() +25);
              doc.autoTable(coladi.splice(0,11), dataadi,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 9, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 70},dos: {columnWidth: 70},tres: {columnWidth: 50},cuar: {columnWidth: 50},cin: {columnWidth: 70},seis: {columnWidth: 65},siete: {columnWidth: 80},ocho: {columnWidth: 70},nueve: {columnWidth: 70},diez: {columnWidth: 90},once: {columnWidth: 70}}});
              doc.autoTable(columns3.splice(0,5), data3,  {drawHeaderRow: function() {return false;},
                theme: 'plain',startY: doc.autoTableEndPosY() +10,bodyStyles: {rowHeight: 12, fontSize: 9, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 125, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120},seg: {columnWidth: 220},ter: {columnWidth: 120},cuar: {columnWidth: 200},cin: {columnWidth: 120}}, pageBreak: 'avoid',
              });
              if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
              }
              doc.save('Vales_Combustible'+'.pdf');    
            });
obj.error(function(error) {
});
};
$scope.$on('api:ready',function(){      
});  
$scope.inicioCrear = function () {    
}; 
});

