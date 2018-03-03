app.controller('VerifMantController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
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
  $scope.getTablatecnico = function(codigo,opc,otro){ 
    var nume= opc.toString();
    console.log(nume)
    var reslol = {
      "procedure_name":"sp_carga_tecnico",
      "body":{
        "params": [
        {
          "name":"cod",
          "param_type":"IN","value":codigo
        },
        {
          "name":"tecn",
          "param_type":"IN","value":otro
        },
        {
          "name":"nombre",
          "param_type":"IN","value":nume
        }
        ] }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslol);
      obj.success(function (respon) {
        console.log(respon);
        $scope.grupos=respon;  
      });
      obj.error(function(error) {       
      });
    };
    
    $scope.getTabla = function(otro){ 
      console.log(otro);
      var otro = angular.uppercase(otro);
      console.log(otro);
      if(angular.equals(otro,'USG_UO_SOL_VALOR')||angular.equals(otro,'USG_FUN_SOL')){
        $scope.prueba=false;
        $scope.prueba_1=false;
      }
      else{
       $scope.prueba=true;
       $scope.prueba_1=false;
      }
      var reslol = {
        "procedure_name":"sp_carga_tab_verif_mant_reales",
        "body":{
          "params": [
          {
            "name":"tecn",
            "param_type":"IN","value":otro
          }
          ] }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslol);
        obj.success(function (respon) {
        console.log("======>",respon);
          $scope.grupos=respon;  
        });
        obj.error(function(error) {      
        });
      };
      $scope.fechini='';
      $scope.fechfin='';
      $scope.getTablefecha= function(cod,registro)
      {
        $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
        $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
        $scope.TablaCreacion = true;
        $scope.prueba_1= true;
        var reslocal = {
          "procedure_name":"sp_carga_completa_usg",
          "body":{
            "params": [
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
            console.log(response);
            $scope.grupos = response; 
          })
          obj.error(function(error) {
            $scope.errors["error_creacion"] = error;         
          });
        }
        $scope.numero='';
        $scope.ejemplo=function(numero){
          console.log(numero);
          $scope.numero= numero;
          $scope.obtpdf = $scope.grupos;
          var columns = [
          {title: "#", dataKey: "#"},
          {title: "Código Tramite", dataKey: "codigo"}, 
          {title: "Unidad Solicitante", dataKey: "unidad_sol"}, 
          {title: "Funcionario Solicitante", dataKey: "funcionario_solicitante"},
          {title: "Lugar", dataKey: "ubicacion"},
          {title: "Tecnicos Asignados", dataKey: "tecnicos"},
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
            aporte['funcionario_solicitante'] = celda['funcionario_solicitante'];
            aporte['ubicacion'] = celda['ubicacion']; 
            aporte['tecnicos'] = celda['tecnicos'];
            aporte['fech_cul'] = celda['fech_cul'];      
            aporte['salida']= celda['cam'];  

            if(celda['estado'] == 'A')
            {       
              aporte['salida'] = 'En Proceso';
            }  
            else
            {
              aporte['salida'] = 'Cerrado';
            }


            if(celda['unidad_sol'] == null || celda['unidad_sol'] == 'undefined' )
            {       
              aporte['unidad_sol'] = '';
            } 

            if(celda['fech_cul'] == null || celda['fech_cul'] == 'undefined' )
            {       
              aporte['fech_cul'] = '';
            } 

            if(celda['funcionario_solicitante'] == null)
            {       
              aporte['funcionario_solicitante'] = '';
            } 

            if(celda['tec_1'] == null)
            {       
              aporte['tec_1'] = '';
            } 
            if(celda['ubicacion'] == null)
            {       
              aporte['ubicacion'] = '';
            } 
            if(celda['tecnicos'] == null)
            {       
              aporte['tecnicos'] = '';
            } 

            data[i]=aporte;
            i++;
          });

          var doc = new jsPDF('l', 'pt');
          var columnsLong = columns;

          var header = function (data) {
            doc.setFontSize(12);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            doc.addImage(USG, 'JPEG', data.settings.margin.left, 35, 780, 60);
            doc.text("REPORTE DE MANTENIMIENTO DE INFRAESTRUCTURA", data.settings.margin.left + 250, 120);
            doc.setFontSize(10);
            //doc.text('Del: ' + $scope.fechini+   '    Al:  ' + $scope.fechfin,  210, data.settings.margin.left + 150,0,235);
            doc.text('Del: ' + $scope.fechini+   '    Al:  ' + $scope.fechfin,  data.settings.margin.left + 330,150);
          };
          
          switch ($scope.numero){
            case 'USG_UO_SOL_VALOR':
            doc.setFontSize(11);
            doc.text('Por Unidad Solicitante',  230, 135);
            break;
            case 'USG_FUN_SOL':
            doc.setFontSize(11);
            doc.text('Por Funcionario Solicitante',  220, 135);
            break;
            case 'USG_TEC1':
            doc.setFontSize(11);
            doc.text('Por Técnico Albañil',  240, 135);  
            break;
            case 'USG_TEC2':
            doc.setFontSize(11);
            doc.text('Por Técnico Carpintero',  230, 135);  
            break;
            case 'USG_TEC3':
            doc.setFontSize(11);
            doc.text('Por Técnico Electricista',  225, 135);  
            break;
            case 'USG_TEC4':
            doc.setFontSize(11);
            doc.text('Por Técnico Encargado de Mantenimiento de Edificio',  150, 135);  
            break;
            case 'USG_TEC5':
            doc.setFontSize(11);
            doc.text('Por Técnico Encargado de Telefonia Analógica',  180, 135);  
            break;
            case 'USG_TEC7':
            doc.setFontSize(11);
            doc.text('Por Técnico Pintor',  240, 135);  
            break;
            case 'USG_TEC8':
            doc.setFontSize(11);
            doc.text('Por Técnico Plomero',  235, 135);  
            break;
          }  
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
            startY: 160,
            theme : 'amarillo',
            beforePageContent: header,
            afterPageContent: footer,
            margin: {horizontal: 30, top: 160, bottom: 40},
            styles: {overflow: 'linebreak'},
            columnStyles: {codigo: {columnWidth: 'wrap'}},bodyStyles: {rowHeight: 10, fontSize: 8, valign: 'middle'}
          } ;
          doc.autoTable(columnsLong, data, options);
          if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
          }
          doc.save('servicio'+'.pdf');
        };
        $scope.ejemplo3=function(hola){
          var resDatos = {
            "table_name":"_fr_casos",
            "filter": "cas_id="+hola
          };
          var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
          obj.success(function (response) {    
            $scope.datos=JSON.parse(response.record[0].cas_datos);
            var vector='';
            if($scope.datos.USG_TEC1 == undefined)
            {       
              $scope.datos.USG_TEC1= '';
            } 
            for(var i=0; i<$scope.datos.USG_TEC1.length;i++){
              if($scope.datos.USG_TEC1[i].estado){
                if(vector!=''){
                  vector=vector+', '+$scope.datos.USG_TEC1[i].resvalor;
                }
                else{
                  vector=vector+$scope.datos.USG_TEC1[i].resvalor;
                }
              }
            }

            var vector_2='';
            if($scope.datos.USG_TEC2 == undefined)
            {       
              $scope.datos.USG_TEC2= '';
            } 
            for(var i=0; i<$scope.datos.USG_TEC2.length;i++){
              if($scope.datos.USG_TEC2[i].estado){
                if(vector_2!=''){
                  vector_2=vector_2+', '+$scope.datos.USG_TEC2[i].resvalor;
                }
                else{
                  vector_2=vector_2+$scope.datos.USG_TEC2[i].resvalor;
                }
              }
            }

            var vector_3='';
            if($scope.datos.USG_TEC3 == undefined)
            {       
              $scope.datos.USG_TEC3= '';
            } 
            for(var i=0; i<$scope.datos.USG_TEC3.length;i++){
              if($scope.datos.USG_TEC3[i].estado){
                if(vector_3!=''){
                  vector_3=vector_3+', '+$scope.datos.USG_TEC3[i].resvalor;
                }
                else{
                  vector_3=vector_3+$scope.datos.USG_TEC3[i].resvalor;
                }
              }
            }

            var vector_4='';
            if($scope.datos.USG_TEC4 == undefined)
            {       
              $scope.datos.USG_TEC4= '';
            } 
            for(var i=0; i<$scope.datos.USG_TEC4.length;i++){
              if($scope.datos.USG_TEC4[i].estado){
                if(vector_4!=''){
                  vector_4=vector_4+', '+$scope.datos.USG_TEC4[i].resvalor;
                }
                else{
                  vector_4=vector_4+$scope.datos.USG_TEC4[i].resvalor;
                }
              }
            }
            var vector_5='';
            if($scope.datos.USG_TEC5 == undefined)
            {       
              $scope.datos.USG_TEC5= '';
            } 
            for(var i=0; i<$scope.datos.USG_TEC5.length;i++){
              if($scope.datos.USG_TEC5[i].estado){
                if(vector_5!=''){
                  vector_5=vector_5+', '+$scope.datos.USG_TEC5[i].resvalor;
                }
                else{
                  vector_5=vector_5+$scope.datos.USG_TEC5[i].resvalor;
                }
              }
            }
            var vector_7='';
            if($scope.datos.USG_TEC7 == undefined)
            {       
              $scope.datos.USG_TEC7= '';
            } 
            for(var i=0; i<$scope.datos.USG_TEC7.length;i++){
              if($scope.datos.USG_TEC7[i].estado){
                if(vector_7!=''){
                  vector_7=vector_7+', '+$scope.datos.USG_TEC7[i].resvalor;
                }
                else{
                  vector_7=vector_7+$scope.datos.USG_TEC7[i].resvalor;
                }
              }
            }


            var vector_8='';
            if($scope.datos.USG_TEC8 == undefined)
            {       
              $scope.datos.USG_TEC8= '';
            } 
            for(var i=0; i<$scope.datos.USG_TEC8.length;i++){
              if($scope.datos.USG_TEC8[i].estado){
                if(vector_8!=''){
                  vector_8=vector_8+', '+$scope.datos.USG_TEC8[i].resvalor;
                }
                else{
                  vector_8=vector_8+$scope.datos.USG_TEC8[i].resvalor;
                }
              }
            }

            var asunto_carp='';
            if($scope.datos.USG_ASUNTO_CARP == undefined)
            {       
              $scope.datos.USG_ASUNTO_CARP= '';
            } 
            for(var i=0; i<$scope.datos.USG_ASUNTO_CARP.length;i++){
              if($scope.datos.USG_ASUNTO_CARP[i].estado){
                if(asunto_carp!=''){
                  asunto_carp=asunto_carp+' - '+$scope.datos.USG_ASUNTO_CARP[i].resvalor;
                }
                else{
                  asunto_carp=asunto_carp+$scope.datos.USG_ASUNTO_CARP[i].resvalor;
                }
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
            {"prim":"FUNCIONARIO QUE SOLICITA","seg":$scope.datos.USG_FUN_SOL},
            ];
            var etim = document.createElement('div');
            etim.innerHTML = $scope.datos.USG_ASUNTO;

            var colseg = [
            {title: "descripcion", dataKey: "des"}
            ]; 
            var dataseg=[ 
            {"des":etim.textContent}
            ];
            var columns3 = [
            {title: "primero", dataKey: "prim"},
            {title: "segundo", dataKey: "seg"},
            ];
            var data3 = [
            {"prim":"TÉCNICO ASIGNADO","seg":""},
            {"prim":"","seg":""},
            {"prim":"Técnico Albañil","seg":$scope.datos.vector},
            {"prim":"Técnico Carpintero","seg":vector_2},
            {"prim":"Técnico Electricista","seg":vector_3},
            {"prim":"Encargado de Mantenimiento de Edificio","seg":vector_4},
            {"prim":"Técnico Encargado de Telefonía Analógica","seg":vector_5},
            {"prim":"Técnico Pintor","seg":vector_7},
            {"prim":"Técnico Plomero","seg":vector_8},
            {"prim":"","seg":""},
            {"prim":"TRABAJO REALIZADO","seg":asunto_carp},
            {"prim":"","seg":""},
            {"prim":"FECHA DE SOLICITUD:","seg":$scope.datos.USG_FEC_SOL}, 
            {"prim":"","seg":""},
            {"prim":"FECHA DE PROGRAMACIÓN:","seg":$scope.datos.USG_FEC_PROG}
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
              startY: 130,pageBreak: 'avoid',theme: 'amarillo',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'},seg: {columnWidth: 170},ter: {columnWidth: 120,fontStyle: 'bold'},cuar: {columnWidth: 80}}
            });
            doc.rect(40, 130, 525, 65);
            doc.setFontSize(12);
            doc.text('RESULTADO DEL MANTENIMIENTO REALIZADO',40,215);
            doc.autoTable(colseg.splice(0,1), dataseg, {drawHeaderRow: function() {return false;},startY:230,drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
          },pageBreak:'avoid',theme:'amarillo',bodyStyles:{rowHeight:12,fontSize:9,valign:'middle'},margin:{horizontal:50,top:110,bottom:80},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'},
        });
            doc.autoTable(columns3.splice(0,4 ), data3,  {drawHeaderRow: function() {return false;},
              theme: 'amarillo',startY: doc.autoTableEndPosY() +30,bodyStyles: {rowHeight: 12,
                fontSize: 8, valign: 'middle'},beforePageContent: header,
                afterPageContent: footer,margin: {horizontal: 50, top: 140, 
                  bottom: 80},styles: {overflow: 'linebreak'},                 
                  columnStyles: {prim: {columnWidth: 125,fontStyle: 'bold'},
                  seg: {columnWidth: 400}}, pageBreak: 'avoid',
                });
            if (typeof doc.putTotalPages === 'function') {
              doc.putTotalPages(totalPagesExp);
            }
            doc.save('ficha VM'+'.pdf');
          });
obj.error(function(error) {                                                
});    
};
$scope.$on('api:ready',function(){      
});
$scope.inicioCrear = function () {    
}; 
});
