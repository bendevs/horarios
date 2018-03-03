app.controller('fichaMantController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) { 
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
    var reslol = {
      "procedure_name":"sp_carga_tabla_servicio_mantenimiento1_sol",
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
          "param_type":"IN","value":nume
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
        "procedure_name":"sp_carga_tabla_servicio_fecha",
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
            });
            obje.error(function(error) {
            });        
          };
          $scope.ejemplo=function(){
            $scope.obtpdf = $scope.grupos;
            var columns = [
            {title: "#", dataKey: "#"},
            {title: "Código Tramite", dataKey: "codigo"}, 
            {title: "Unidad Solicitante", dataKey: "unidad_sol"}, 
            {title: "Lugar", dataKey: "ubicacion"},
            {title: "Fecha de Culminación", dataKey: "fech_cul"},
            {title: "Estado Tramite", dataKey: "salida"}
            ];
            var data=[];
            i=0;
            angular.forEach($scope.obtpdf,function(celda, fila){            
              var aporte = {};
              aporte['#'] = i+1;
              aporte['codigo'] = celda['codigo'];
              aporte['unidad_sol'] = celda['unidad_sol'];
              aporte['ubicacion'] = celda['ubicacion'];  
              aporte['fech_cul'] = celda['fech_cul'];     
              aporte['salida']= celda['salida'];  

              if(celda['estadopaso'] == 'A')
              {       
                aporte['salida'] = 'En Proceso';
              }  
              else
              {
                aporte['salida'] = 'Concluido';
              }
              if(celda['fech_cul'] == null || celda['fech_cul'] == 'undefined' )
              {       
                aporte['fech_cul'] = '';
              } 

              if(celda['unidad_sol'] == null || celda['unidad_sol'] =='undefined')
              {       
                aporte['unidad_sol'] = '';
              } 

              if(celda['ubicacion'] == null)
              {       
                aporte['ubicacion'] = '';
              } 
              data[i]=aporte;
              i++;
            });
            var doc = new jsPDF('l', 'pt');
            var columnsLong = columns;
            var header = function (data) {
              doc.setFontSize(14);
              doc.setTextColor(40);
              doc.setFontStyle('normal');
              doc.addImage(USG, 'JPEG', data.settings.margin.left, 35, 790, 60);
              doc.text("MANTENIMIENTO DE INFRAESTRUCTURA", data.settings.margin.left + 200, 120);
              doc.text("RESULTADO DEL TRABAJO ASIGNADO", data.settings.margin.left + 220, 145);
            };
            doc.setFontSize(12);
            doc.text('Del: ' + $scope.fechini+   '    Al:  ' + $scope.fechfin,  280, 170,0,235);

            var totalPagesExp = "{total_pages_count_string}";
            var footer = function (data) {
              var str = "Pagina " + data.pageCount;
              if (typeof doc.putTotalPages === 'function') {
                str = str + " de " + totalPagesExp;
              }
              doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
              doc.text("SERVICIOS GENERALES", data.settings.margin.left, doc.internal.pageSize.height - 45);
            };

            var options = {
              startY: 185,
              theme : 'amarillo',
              beforePageContent: header,
              afterPageContent: footer,
              margin: {horizontal: 30, top: 160, bottom: 50}, 
              styles: {overflow: 'linebreak'},
              columnStyles: {codigo: {columnWidth: 'wrap'}}
            } ;

            doc.autoTable(columnsLong, data, options);
            if (typeof doc.putTotalPages === 'function') {
              doc.putTotalPages(totalPagesExp);
            }
            doc.save('Reporte General'+'.pdf');
          };   

          $scope.ejemplo3=function(hola){

            var resDatos = {
              "table_name":"_fr_casos",
              "filter": "cas_id="+hola
            };
            var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
            obj.success(function (response) {    

              $scope.datos=JSON.parse(response.record[0].cas_datos);
              var vector=[];
              for( var i=0; i<8; i++){
                if($scope.datos.USG_ASUNTO_CARP[i].estado){
                  vector[i]='X';
                }
                else{
                  vector[i]=' ';
                }
              }
              var columns = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              {title: "tercero", dataKey: "ter"},
              {title: "cuarto", dataKey: "cuar"}
              ];
              var data = [
              {"prim":"UNIDAD SOLICITANTE","seg":$scope.datos.USG_UO_SOL_VALOR},
              {"prim":"LUGAR Y PISO","seg":$scope.datos.USG_LUG},
              {"prim":"TELEFONO DE CONTACTO:","seg":$scope.datos.USG_TEL}, 
              {"prim":"FUNCIONARIO QUE SOLICITA","seg":$scope.datos.USG_FUN_SOL}
              ];
              var etim = document.createElement('div');
              etim.innerHTML = $scope.datos.USG_ASUNTO;

              var colseg = [
              {title: "descripcion", dataKey: "des"}        
              ];
              var dataseg = [
              {"des":etim.textContent}
              ];    
              var columns3 = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              ];
              var data3 = [
              {"prim":"TÉCNICO REQUERIDO"},
              {"prim":$scope.datos.USG_ASUNTO_CARP[0].resvalor,"seg":vector[0]},
              {"prim":$scope.datos.USG_ASUNTO_CARP[1].resvalor,"seg":vector[1]},
              {"prim":$scope.datos.USG_ASUNTO_CARP[2].resvalor,"seg":vector[2]},
              {"prim":$scope.datos.USG_ASUNTO_CARP[3].resvalor,"seg":vector[3]},
              {"prim":$scope.datos.USG_ASUNTO_CARP[4].resvalor,"seg":vector[4]},
              {"prim":$scope.datos.USG_ASUNTO_CARP[5].resvalor,"seg":vector[5]},
              {"prim":$scope.datos.USG_ASUNTO_CARP[6].resvalor,"seg":vector[6]},
              {"prim":$scope.datos.USG_ASUNTO_CARP[7].resvalor,"seg":vector[7]}
              ];
              var columns4 = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"}
              ];
              var data4 = [
              {"prim":"FECHA DE SOLICITUD:","seg":$scope.datos.USG_FEC_SOL},    
              ];   
              var columns5 = [
              {title: "primero", dataKey: "prim"},
              {title: "segundo", dataKey: "seg"},
              ];
              var data5 = [
              {"prim":"FECHA DE PROGRAMACIÓN:","seg":$scope.datos.USG_FEC_PROG},     
              ];
              var doc = new jsPDF('p', 'pt');
              var columnsLong = columns;
              var header = function (data) {
                doc.setFontSize(20);
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
                doc.text("SERVICIOS GENERALES", data.settings.margin.left, doc.internal.pageSize.height - 45);
              };
              doc.setFontSize(12);
              doc.text('DATOS DE LA UNIDAD SOLICITANTE',40,120);
              doc.autoTable(columns.splice(0,4), data, {drawHeaderRow: function() {return false;} ,
                startY: 130,pageBreak: 'avoid',theme: 'striped',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'},seg: {columnWidth: 170},ter: {columnWidth: 120,fontStyle: 'bold'},cuar: {columnWidth: 80}}
              });
              doc.rect(40, 130, 525, 65);
              doc.setFontSize(12);
              doc.text('TRABAJO REQUERIDO',40,215);
              doc.autoTable(colseg.splice(0,1), dataseg, {drawHeaderRow: function() {return false;},startY:230,drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
            },pageBreak:'avoid',theme:'striped',bodyStyles:{rowHeight:12,fontSize:9,valign:'middle'},margin:{horizontal:50,top:110,bottom:80},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'},
          });
              doc.setFontSize(12);
              doc.autoTable(columns3.splice(0,4 ), data3,  {drawHeaderRow: function() {return false;},
                theme: 'striped',startY: doc.autoTableEndPosY() +40,bodyStyles: {rowHeight: 12,
                  fontSize: 8, valign: 'middle'},beforePageContent: header,
                  afterPageContent: footer,margin: {horizontal: 50, top: 140, 
                    bottom: 80},styles: {overflow: 'linebreak'},                 
                    columnStyles: {prim: {columnWidth: 125,fontStyle: 'bold'},
                    seg: {columnWidth: 175},
                    ter: {columnWidth: 120,fontStyle: 'bold'},
                    cuar: {columnWidth: 80}}, pageBreak: 'avoid',
                  });
              doc.setFontSize(12);
              doc.autoTable(columns4.splice(0,4 ), data4,  {drawHeaderRow: function() {return false;},
                theme: 'striped',startY: doc.autoTableEndPosY() +35,bodyStyles: {rowHeight: 12,
                  fontSize: 8, valign: 'middle'},beforePageContent: header,
                  afterPageContent: footer,margin: {horizontal: 50, top: 140, 
                    bottom: 80},styles: {overflow: 'linebreak'},                 
                    columnStyles: {prim: {columnWidth: 125,fontStyle: 'bold'},
                    seg: {columnWidth: 175},
                    ter: {columnWidth: 120,fontStyle: 'bold'},
                    cuar: {columnWidth: 80}}, pageBreak: 'avoid',
                  });
              doc.setFontSize(12);
              doc.autoTable(columns5.splice(0,4 ), data5,  {drawHeaderRow: function() {return false;},
                theme: 'striped',startY: doc.autoTableEndPosY() +28,bodyStyles: {rowHeight: 12,
                  fontSize: 8, valign: 'middle'},beforePageContent: header,
                  afterPageContent: footer,margin: {horizontal: 50, top: 140, 
                    bottom: 80},styles: {overflow: 'linebreak'},                 
                    columnStyles: {prim: {columnWidth: 125,fontStyle: 'bold'},
                    seg: {columnWidth: 175},
                    ter: {columnWidth: 120,fontStyle: 'bold'},
                    cuar: {columnWidth: 80}}, pageBreak: 'avoid',
                  });
              if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
              }
              doc.save('ficha SG'+'.pdf');
            });
obj.error(function(error) {
});   
};
$scope.$on('api:ready',function(){      
});
$scope.inicioCrear = function () {    
}; 
});





