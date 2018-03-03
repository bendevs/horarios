app.controller('servicioController', function   ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce) {
  // ($scope, $q, $rootScope, $location, $route, $http, Data, sessionService,CONFIG, LogGuardarInfo, DreamFactory, $element, sweet, ngTableParams, $filter, registroLog, filterFilter,FileUploader, fileUpload, $timeout, $sce)

 // ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet)
  var fecha= new Date();
  var fechactual=fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
  
   var mapaObject = new Object();
   var mapaObjectFinal = new Array();

 
    $scope.getTabla = function(codigo,opc){
    var nume= opc.toString();
    var otro = $scope.carga.campo;
    console.log("codigo",codigo);
    console.log("opcion1",nume);
    console.log("opcion2",otro);
    var reslocal = {
      "procedure_name":"ejecutartojson",
      "body":{
        "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"SELECT cas_id, cas_nombre_caso, cas_datos FROM _fr_casos   WHERE cas_nombre_caso like'"+codigo+"%' and cas_datos->>'"+otro+"' = '"+nume+"'" 
            }]
        }
    };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
        obj.success(function (response) {
console.log("gettabla trae estos datos",response);
            $scope.grupos = JSON.parse(response[0].ejecutartojson); 
            console.log("888",$scope.grupos);
            console.log($scope.grupos[0].cas_datos.USG_TRA_DIF[0].estado);
        });
        obj.error(function(error) {
            console.log("se fue al error ...");         
        });
    };
  $scope.cargarDatos = function(campo,num){       
    
    console.log("Datos", campo,num);
   
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
          console.log("es lo que trae", response);
          $scope.cargas = JSON.parse(response[0].sp_data_json);
            console.log("lo que sale del json",$scope.cargas);
            
        });
        obj.error(function(error) {
           
            console.log("se fue al error ....");         
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
          console.log("es lo que trae get2", respons);
          $scope.carga = JSON.parse(respons[0].sp_data_json2);
            console.log("lo que sale del json2",$scope.carga,$scope.carga.campo);
        })
        obje.error(function(error) {
           
            console.log("se fue al error ....");         
        });         
        
    };
  

 $scope.ejemplo=function(img){
    $scope.obtpdf = $scope.grupos;
    console.log("5555555555",$scope.obtpdf);
    var columns = [
        {title: "#", dataKey: "#"},
        {title: "CODIGO", dataKey: "codigo"}, 
        {title: "MOTOR", dataKey: "mot"}, 
        {title: "SIS. FRENOS", dataKey: "fren"},
        {title: "SIS. SUSPENSION DELANTERA", dataKey: "sus_de"},
        {title: "SIS. SUSPENSION", dataKey: "sus"},
        {title: "SIS. DIRECION Y TRANSMISION", dataKey: "dir_trans"},
        {title: "SIS. DE LUBRICACION", dataKey: "lubr"},
        {title: "SIS. DE TRANSMISION DIFERENIAL", dataKey: "trans_dif"},
        {title: "SIS. ELECTRICO", dataKey: "elec"},
        {title: "SIS. DE ENFRIAMIENTO", dataKey: "enf"}
      
      ];
   
    var x=0;
          var sum_motor=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].motor=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_MOTOR[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_MOTOR[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_MOTOR[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_MOTOR[y].estado){
                   $scope.grupos[x].motor=$scope.grupos[x].motor+1;
                   console.log("entr al if y valor",$scope.grupos[x].motor);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_motor=sum_motor+$scope.grupos[x].motor;
              $scope.mot=sum_motor;
          }
          console.log("Trae esto suma-de motor--",sum_motor);


      var x=0;
          var sum_freno=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].freno=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_FRENO[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_FRENO[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_FRENO[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_FRENO[y].estado){
                   $scope.grupos[x].freno=$scope.grupos[x].freno+1;
                   console.log("entr al if y valor",$scope.grupos[x].freno);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_freno=sum_freno+$scope.grupos[x].freno;
              $scope.fre=sum_freno;
          }
          console.log("Trae esto suma-de sus freno--",sum_freno);




      var x=0;
          var sum_sus_delan=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].sus_delantera=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_SUSP_D[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_SUSP_D[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_SUSP_D[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_SUSP_D[y].estado){
                   $scope.grupos[x].sus_delantera=$scope.grupos[x].sus_delantera+1;
                   console.log("entr al if y valor",$scope.grupos[x].sus_delantera);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_sus_delan=sum_sus_delan+$scope.grupos[x].sus_delantera;
              $scope.sus_de=sum_sus_delan;
          }
          console.log("Trae esto suma-de sus delant--",sum_sus_delan);


      var x=0;
          var sum_suspen=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].suspension=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_SUS[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_SUS[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_SUS[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_SUS[y].estado){
                   $scope.grupos[x].suspension=$scope.grupos[x].suspension+1;
                   console.log("entr al if y valor",$scope.grupos[x].suspension);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_suspen=sum_suspen+$scope.grupos[x].suspension;
              $scope.susp=sum_suspen;
          }
          console.log("Trae esto suma-de suspension--",sum_suspen);


          var x=0;
          var sum_dir_transm=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].dir_transmi=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_DIR_TRA[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_DIR_TRA[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_DIR_TRA[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_DIR_TRA[y].estado){
                   $scope.grupos[x].dir_transmi=$scope.grupos[x].dir_transmi+1;
                   console.log("entr al if y valor",$scope.grupos[x].dir_transmi);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_dir_transm=sum_dir_transm+$scope.grupos[x].dir_transmi;
              $scope.su_dirtra=sum_dir_transm;
          }
          console.log("Trae esto suma-de direcci_trans--",sum_dir_transm);


          var x=0;
          var sum_lubr=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].lubricacion=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_LUBR[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_LUBR[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_LUBR[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_LUBR[y].estado){
                   $scope.grupos[x].lubricacion=$scope.grupos[x].lubricacion+1;
                   console.log("entr al if y valor",$scope.grupos[x].lubricacion);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_lubr=sum_lubr+$scope.grupos[x].lubricacion;
              $scope.lubri=sum_lubr;
          }
          console.log("Trae esto suma-de lubricacion--",sum_lubr);


          var x=0;
          var sum_trans_dif=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].transmision_dif=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_TRA_DIF[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_TRA_DIF[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_TRA_DIF[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_TRA_DIF[y].estado){
                   $scope.grupos[x].transmision_dif=$scope.grupos[x].transmision_dif+1;
                   console.log("entr al if y valor",$scope.grupos[x].transmision_dif);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_trans_dif=sum_trans_dif+$scope.grupos[x].transmision_dif;
              $scope.tradif=sum_trans_dif;
          }
          console.log("Trae esto suma-de trans _diferen--",sum_trans_dif);

          var x=0;
          var sum_elec=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].electrico=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_SIS_ELEC[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_SIS_ELEC[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_SIS_ELEC[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_SIS_ELEC[y].estado){
                   $scope.grupos[x].electrico=$scope.grupos[x].electrico+1;
                   console.log("entr al if y valor",$scope.grupos[x].electrico);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_elec=sum_elec+$scope.grupos[x].electrico;
              $scope.elec=sum_elec;
          }
          console.log("Trae esto suma-de electr--",sum_elec);

          var x=0;
          var sum_enfri=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].enfriamiento=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_ENFR[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_ENFR[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_ENFR[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_ENFR[y].estado){
                   $scope.grupos[x].enfriamiento=$scope.grupos[x].enfriamiento+1;
                   console.log("entr al if y valor",$scope.grupos[x].enfriamiento);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_enfri=sum_enfri+$scope.grupos[x].enfriamiento;
              $scope.enfr=sum_enfri;
          }
          console.log("Trae esto suma-de enfriamien--",sum_enfri);



    var data=[];
    i=0;
    angular.forEach($scope.obtpdf,function(celda, fila){            
      var aporte = {};
      aporte['#'] = i+1;
      aporte['codigo'] = celda['cas_nombre_caso'];
      aporte['mot'] = celda['motor'];
      aporte['fren'] = celda['freno'];
      aporte['sus_de'] = celda['sus_delantera']; 
      aporte['sus'] = celda['suspension']; 
      aporte['dir_trans'] = celda['dir_transmi']; 
      aporte['lubr'] = celda['lubricacion']; 
      aporte['trans_dif'] = celda['transmision_dif']; 
      aporte['elec'] = celda['electrico']; 
      aporte['enf'] = celda['enfriamiento'];     
      data[i]=aporte;
      i++;
     });

   // var motor=$scope.sum_motor.toString();
    var columns2 = [
        {title: "primero", dataKey: "prim"},
        {title: "segundo", dataKey: "seg"}
        
      ];
    var data2 = [
      {"prim":"TOTAL :"},
      {"prim":"Motor:","seg":sum_motor},
      {"prim":"Sistema de Freno:","seg":sum_freno},
      {"prim":"Sistema de Suspension Delantera:","seg": sum_sus_delan},
      {"prim":"Sistema de Suspension:","seg":sum_suspen},
      {"prim":"Sistema de Direccion y Transmision:","seg":sum_dir_transm},
      {"prim":"Sistema de Lubricacion:","seg":sum_lubr},
      {"prim":"Sistema de Transmision Diferencial:","seg":sum_trans_dif},
      {"prim":"Sistema Electrico:","seg":sum_elec},
      {"prim":"Sistema de Enfriamiento:","seg":sum_enfri}
      ];

    console.log("prueba real",columns)
    console.log("prueba real",data)
    


    var doc = new jsPDF('l', 'pt');
    var columnsLong = columns;

    var header = function (data) {
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.addImage(headerImgservicio, 'JPEG', data.settings.margin.left, 20, 780, 80);
 
        doc.text("Servicio de Mantenimiento Vehicular", data.settings.margin.left + 85, 125);
      
    };

    var totalPagesExp = "{total_pages_count_string}";
    var footer = function (data) {
        var str = "Pagina " + data.pageCount;
     
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
        };

    var options = {
         startY: 160,
        beforePageContent: header,
        afterPageContent: footer,
        margin: {horizontal: 30, top: 140, bottom: 80},
        styles: {overflow: 'linebreak'},
        columnStyles: {codigo: {columnWidth: 'wrap'}}
         } ;


      doc.autoTable(columnsLong, data, options);

      doc.setFontSize(12);
      doc.autoTable(columns2.splice(0,4), data2,  {drawHeaderRow: function() {return false;},
        theme: 'plain',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 180,fontStyle: 'middle'},seg: {columnWidth: 50},ter: {columnWidth: 180,fontStyle: 'middle'},cuar: {columnWidth: 50}}, pageBreak: 'avoid',
      });
   //    doc.addImage(img,'JPEG', 20, doc.autoTableEndPosY()+30,500, 220);


      if (typeof doc.putTotalPages === 'function') {
          doc.putTotalPages(totalPagesExp);
      }
      // $scope.getReportesGrafica();
      /*doc.write('<html><head><body><div id="'+containerdato+'" style="width: 1200px; height:600px; margin: 0 auto"></div>
                </div></body></head></html>');*/
      doc.save('cod_idcaso'+'.pdf');


     
 };






 $scope.getReportesGrafica = function(){
    //  $.blockUI();
    $scope.obtpdf = $scope.grupos;
    console.log("5555555555",$scope.obtpdf);
    var columns = [
        {title: "#", dataKey: "#"},
        {title: "CODIGO", dataKey: "codigo"}, 
        {title: "MOTOR", dataKey: "mot"}, 
        {title: "SIS. FRENOS", dataKey: "fren"},
        {title: "SIS. SUSPENSION DELANTERA", dataKey: "sus_de"},
        {title: "SIS. SUSPENSION", dataKey: "sus"},
        {title: "SIS. DIRECION Y TRANSMISION", dataKey: "dir_trans"},
        {title: "SIS. DE LUBRICACION", dataKey: "lubr"},
        {title: "SIS. DE TRANSMISION DIFERENIAL", dataKey: "trans_dif"},
        {title: "SIS. ELECTRICO", dataKey: "elec"},
        {title: "SIS. DE ENFRIAMIENTO", dataKey: "enf"}
      
      ];
   
     var x=0;
          var sum_motor=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].motor=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_MOTOR[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_MOTOR[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_MOTOR[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_MOTOR[y].estado){
                   $scope.grupos[x].motor=$scope.grupos[x].motor+1;
                   console.log("entr al if y valor",$scope.grupos[x].motor);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_motor=sum_motor+$scope.grupos[x].motor;
              $scope.mot=sum_motor;
          }
          console.log("Trae esto suma-de motor--",sum_motor);


      var x=0;
          var sum_freno=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].freno=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_FRENO[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_FRENO[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_FRENO[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_FRENO[y].estado){
                   $scope.grupos[x].freno=$scope.grupos[x].freno+1;
                   console.log("entr al if y valor",$scope.grupos[x].freno);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_freno=sum_freno+$scope.grupos[x].freno;
              $scope.fre=sum_freno;
          }
          console.log("Trae esto suma-de sus freno--",sum_freno);




      var x=0;
          var sum_sus_delan=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].sus_delantera=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_SUSP_D[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_SUSP_D[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_SUSP_D[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_SUSP_D[y].estado){
                   $scope.grupos[x].sus_delantera=$scope.grupos[x].sus_delantera+1;
                   console.log("entr al if y valor",$scope.grupos[x].sus_delantera);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_sus_delan=sum_sus_delan+$scope.grupos[x].sus_delantera;
              $scope.sus_de=sum_sus_delan;
          }
          console.log("Trae esto suma-de sus delant--",sum_sus_delan);


      var x=0;
          var sum_suspen=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].suspension=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_SUS[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_SUS[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_SUS[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_SUS[y].estado){
                   $scope.grupos[x].suspension=$scope.grupos[x].suspension+1;
                   console.log("entr al if y valor",$scope.grupos[x].suspension);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_suspen=sum_suspen+$scope.grupos[x].suspension;
              $scope.susp=sum_suspen;
          }
          console.log("Trae esto suma-de suspension--",sum_suspen);


          var x=0;
          var sum_dir_transm=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].dir_transmi=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_DIR_TRA[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_DIR_TRA[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_DIR_TRA[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_DIR_TRA[y].estado){
                   $scope.grupos[x].dir_transmi=$scope.grupos[x].dir_transmi+1;
                   console.log("entr al if y valor",$scope.grupos[x].dir_transmi);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_dir_transm=sum_dir_transm+$scope.grupos[x].dir_transmi;
              $scope.su_dirtra=sum_dir_transm;
          }
          console.log("Trae esto suma-de direcci_trans--",sum_dir_transm);


          var x=0;
          var sum_lubr=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].lubricacion=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_LUBR[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_LUBR[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_LUBR[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_LUBR[y].estado){
                   $scope.grupos[x].lubricacion=$scope.grupos[x].lubricacion+1;
                   console.log("entr al if y valor",$scope.grupos[x].lubricacion);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_lubr=sum_lubr+$scope.grupos[x].lubricacion;
              $scope.lubri=sum_lubr;
          }
          console.log("Trae esto suma-de lubricacion--",sum_lubr);


          var x=0;
          var sum_trans_dif=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].transmision_dif=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_TRA_DIF[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_TRA_DIF[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_TRA_DIF[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_TRA_DIF[y].estado){
                   $scope.grupos[x].transmision_dif=$scope.grupos[x].transmision_dif+1;
                   console.log("entr al if y valor",$scope.grupos[x].transmision_dif);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_trans_dif=sum_trans_dif+$scope.grupos[x].transmision_dif;
              $scope.tradif=sum_trans_dif;
          }
          console.log("Trae esto suma-de trans _diferen--",sum_trans_dif);

          var x=0;
          var sum_elec=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].electrico=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_SIS_ELEC[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_SIS_ELEC[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_SIS_ELEC[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_SIS_ELEC[y].estado){
                   $scope.grupos[x].electrico=$scope.grupos[x].electrico+1;
                   console.log("entr al if y valor",$scope.grupos[x].electrico);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_elec=sum_elec+$scope.grupos[x].electrico;
              $scope.elec=sum_elec;
          }
          console.log("Trae esto suma-de electr--",sum_elec);

          var x=0;
          var sum_enfri=0;
          for(var x=0;x<$scope.grupos.length;x++){
           $scope.grupos[x].enfriamiento=0;

            for(var y=0; y<4;y++){

                try{
                  var hinicio = ((typeof($scope.grupos[x].cas_datos.USG_ENFR[y]) == 'undefined' || $scope.grupos[x].cas_datos.USG_ENFR[y] == null) ? "" : $scope.grupos[x].cas_datos.USG_ENFR[y])

                 if(hinicio){
                  if($scope.grupos[x].cas_datos.USG_ENFR[y].estado){
                   $scope.grupos[x].enfriamiento=$scope.grupos[x].enfriamiento+1;
                   console.log("entr al if y valor",$scope.grupos[x].enfriamiento);
                }
                 
               } 

                }
                catch(e){

                }
 
            }
              sum_enfri=sum_enfri+$scope.grupos[x].enfriamiento;
              $scope.enfr=sum_enfri;
          }
          console.log("Trae esto suma-de enfriamien--",sum_enfri);

    console.log('grafica',$scope.fechai);

     mapaObjectFinal = [];
      /*  $scope.grupos[0].nombre='MOTOR';
         $scope.grupos[1].nombre='SISTEMA DE FRENOS';
         $scope.grupos[2].nombre='SISTEMA DE SUSPENSION DELANTERA';
         $scope.grupos[3].nombre='SISTEMA DE SUSPENSION';
         $scope.grupos[4].nombre='SISTEMA DE DIRECCION Y TRANSMISION';
         $scope.grupos[5].nombre='SISTEMA DE LUBRICACION';
        // $scope.grupos[6].nombre='SISTEMA DE TRANSMISION DIFERENCIAL';
         $scope.grupos[7].nombre='SISTEMA ELECTRICO';
         $scope.grupos[8].nombre='SISTEMA DE ENFRIAMIENTO';*/
         
                 mapaObject = new Object();
              // var longi = $scope.grupos[i].tipo;
              mapaObject.name = 'MOTOR';
              mapaObject.y = parseInt($scope.mot);
              console.log("1",mapaObject);
              mapaObjectFinal[0] = mapaObject;
             // $scope.cantidad=$scope.cantidad+mapaObject.y;
             
              mapaObject = new Object();
              //var longi = $scope.grupos[i].tipo;
              mapaObject.name = 'SISTEMA DE FRENOS';//freno
              mapaObject.y = parseInt($scope.fre);//$SCOPE.SUMMOTOR
              mapaObjectFinal[1] = mapaObject;//0,1,2,...9
              console.log("2",mapaObject);
              mapaObject = new Object();
              var longi = " ";
              mapaObject.name = 'SISTEMA DE SUSPENSION DELANTERA';//suspensi delantera
              mapaObject.y = parseInt($scope.sus_de);//$SCOPE.SUMMOTOR
              mapaObjectFinal[2] = mapaObject;//0,1,2,...9
console.log("3",mapaObject);
              mapaObject = new Object();
              //var longi = $scope.grupos[i].tipo;
              mapaObject.name = 'SISTEMA DE SUSPENSION';//suspension
              mapaObject.y = parseInt($scope.susp);//$SCOPE.SUMMOTOR
              mapaObjectFinal[3] = mapaObject;//0,1,2,...9
console.log("4",mapaObject);
              mapaObject = new Object();
              //var longi = $scope.grupos[i].tipo;
              mapaObject.name = 'SISTEMA DE DIRECCION Y TRANSMISION';//direccion trans
              mapaObject.y = parseInt($scope.su_dirtra);//$SCOPE.SUMMOTOR
              mapaObjectFinal[4] = mapaObject;//0,1,2,...9
console.log("5",mapaObject);
              mapaObject = new Object();
              //var longi = $scope.grupos[i].tipo;
              mapaObject.name ='SISTEMA LUBRICACION';//MOTOR
              mapaObject.y = parseInt($scope.lubri);//$SCOPE.SUMMOTOR
              mapaObjectFinal[5] = mapaObject;//0,1,2,...9
console.log("6",mapaObject);
              mapaObject = new Object();
              //var longi = $scope.grupos[i].tipo;
              mapaObject.name = 'SISTEMA DE TRANSMISION DIFERENCIAL';//MOTOR
              mapaObject.y = parseInt($scope.tradif);//$SCOPE.SUMMOTOR
              mapaObjectFinal[6] = mapaObject;//0,1,2,...9
              mapaObject = new Object();
console.log("7",mapaObject);
              //var longi = $scope.grupos[i].tipo;
              mapaObject.name = 'SISTEMA ELECTRICO';//MOTOR
              mapaObject.y = parseInt($scope.elec);//$SCOPE.SUMMOTOR
              mapaObjectFinal[7] = mapaObject;//0,1,2,...9
console.log("8",mapaObject);
              mapaObject = new Object();
              //var longi = $scope.grupos[i].tipo;
              mapaObject.name = 'SISTEMA DE ENFRIAMIENTO';//MOTOR
              mapaObject.y = parseInt($scope.enfr);//$SCOPE.SUMMOTOR
              mapaObjectFinal[8] = mapaObject;//0,1,2,...9
console.log("9",mapaObject);
console.log("FINAAAAL",mapaObjectFinal);

          //}
        //  $scope.graficaP= true;
         // $scope.tablatramite=false;
            $scope.graficarTorta();
        $.unblockUI();
      };

  $scope.graficarTorta = function () {
          $('#containerdato').highcharts({
         //     color:['#FF9933','#3333FF','#66FFF0','#FF99FF','#FF4000','#FF6633','#FFF360',,'#123456'],
                  chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie'
              },
              title: {
                  text: 'TOTAL SERVICIO DE MANTENIMIENTO VEHICULAR'
              },
              
              plotOptions: {
                  column: {
                      depth: 25,
                      colorByPoint:true
                  }
              },
              xAxis: {
                  categories: [null, null]
                  //console.log(categories);
              },
              yAxis: {
                  title: {
                      text: 'columna'
                  }
              },
              series: [{
                  name: 'TOTAL',
                  data: mapaObjectFinal
              }]
          });
      };

 $scope.$on('api:ready',function(){      
  });  
$scope.cargar = function()
  {//var img=canvas.toDataURL("image/png");
  //$scope.ejemplo(img);
      html2canvas(document.getElementById("containerdato"),{
       onrendered: function(canvas){
         var img=canvas.toDataURL("image/png");
               $scope.ejemplo(img); 
             }
      });

  };

  $scope.inicioCrear = function () {
    
  }; 


});


var headerImgservicio ='data:image/png;base64,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';