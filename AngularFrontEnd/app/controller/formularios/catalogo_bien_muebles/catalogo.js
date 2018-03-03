app.controller('catalogo_bien_mueble', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
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




///*/////////////////
    $scope.getTipoTramite = function (){
        $.blockUI();
        var resTipoTra= { 
            "table_name":"CT_TIPOS_TRAMITES",
            "order":"tipo_tramite_estado desc"           
        }; 
        DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resTipoTra) 
        .success(function (response) { 
            $scope.tipostra = response.record; 
            $scope.tipostramod=response.record;
             $.unblockUI();
            var data = response.record;             
            $scope.tablaTramites = new ngTableParams({
                page: 1,          
                count: 5,
                filter: {},
                sorting: {}      
            },{
                total: $scope.tipostra.length,
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                    $filter('filter')($scope.tipostra, params.filter()) :
                    $scope.tipostra;              
                    var orderedData = params.sorting() ?
                    $filter('orderBy')(filteredData, params.orderBy()) :
                    $scope.tipostra;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count())); 
                    setTimeout(function(){            
                   
                },1000);                
                }
            });
        }).error(function(error) { 
            $scope.errors = error; 
             setTimeout(function(){            
                    $.unblockUI();
                },1000);
        });
    }

/*****/
   $scope.getTabla11 = function(codigo,otro){
   // var nume= opc.toString();
  //  var nume1=nume.toUpperCase();
    console.log("codigo",codigo);
    //console.log("opcion1",nume);
    console.log("opcion2",otro);
    var reslol = {
      "procedure_name":"sp_catalogo_descrip",
      "body":{
        "params": [
            {
              "name":"cod",
              "param_type":"IN","value":codigo
            },
            {
              "name":"cam",
              "param_type":"IN","value":otro
            }           
            ] }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslol);
        obj.success(function (respon) {
          console.log("es lo que trae", respon);
          $scope.grupos=respon;
            
        });
        obj.error(function(error) {
           
            console.log("se fue al error noooooooooooo....");         
        });
           
  };

   $scope.getTabla22 = function(codigo,otro){
   // var nume= opc.toString();
  //  var nume1=nume.toUpperCase();
    console.log("codigo",codigo);
    //console.log("opcion1",nume);
    console.log("opcion2",otro);
    var reslol = {
      "procedure_name":"sp_catalogo_nombre",
      "body":{
        "params": [
            {
              "name":"cod",
              "param_type":"IN","value":codigo
            },
            {
              "name":"cam",
              "param_type":"IN","value":otro
            }           
            ] }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslol);
        obj.success(function (respon) {
          console.log("es lo que trae", respon);
          $scope.grupos=respon;
            
        });
        obj.error(function(error) {
           
            console.log("se fue al error noooooooooooo....");         
        });
           
  };
   $scope.getTabla33 = function(codigo,otro){
   // var nume= opc.toString();
  //  var nume1=nume.toUpperCase();
    console.log("codigo",codigo);
    //console.log("opcion1",nume);
    console.log("opcion2",otro);
    var reslol = {
      "procedure_name":"sp_catalogo_part",
      "body":{
        "params": [
            {
              "name":"cod",
              "param_type":"IN","value":codigo
            },
            {
              "name":"cam",
              "param_type":"IN","value":otro
            }           
            ] }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslol);
        obj.success(function (respon) {
          console.log("es lo que trae", respon);
          $scope.grupos=respon;
            
        });
        obj.error(function(error) {
           
            console.log("se fue al error noooooooooooo....");         
        });
           
  };
 
  $scope.getTabla44 = function(codigo,otro){
   // var nume= opc.toString();
  //  var nume1=nume.toUpperCase();
    console.log("codigo",codigo);
    //console.log("opcion1",nume);
    console.log("opcion2",otro);
    var reslol = {
      "procedure_name":"sp_catalogo_depre",
      "body":{
        "params": [
            {
              "name":"cod",
              "param_type":"IN","value":codigo
            },
            {
              "name":"cam",
              "param_type":"IN","value":otro
            }           
            ] }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslol);
        obj.success(function (respon) {
          console.log("es lo que trae", respon);
          $scope.grupos=respon;
            
        });
        obj.error(function(error) {
           
            console.log("se fue al error noooooooooooo....");         
        });
           
  };


/*******/////////////



   $scope.getTabla = function(codigo,opc,otro){
    var nume= opc.toString();
    var nume1=nume.toUpperCase();
    console.log("codigo",codigo);
    console.log("opcion1",nume);
    console.log("opcion2",otro);
    var reslol = {
      "procedure_name":"sp_catalogo_bm",
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
          console.log("es lo que trae", respon);
          $scope.grupos=respon;
            
        });
        obj.error(function(error) {
           
            console.log("se fue al error noooooooooooo....");         
        });
           
  };





  $scope.getMostrarTabla= function(cod,registro){
      console.log("DAtos", cod,registro.FECHA1.getFullYear()+" "+registro.FECHA1.getMonth()+" "+registro.FECHA1.getDate());
      var fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
      console.log("fecha convertida   ",$scope.fechini);
      var fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
      console.log("fecha convertida   ",$scope.fechfin);
    $scope.TablaCreacion = true;
    var reslocal = {
      "procedure_name":"sp_carga_table_servicio_veh_fech",
      "body":{
        "params": [
            {
              "name":"cod",
              "param_type":"IN","value":cod
            },
            {
              "name":"fechini",
              "param_type":"IN","value":fechini
            },
            {
              "name":"fechfin",
              "param_type":"IN","value":fechfin
            }
            ] }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
        obj.success(function (response) {
            $scope.grupos = response; 
            console.log("lo q trae la tabla fecha", response);
             console.log("lo q trae la tabla fecha111", $scope.grupos);
        })
        obj.error(function(error) {
           
            $scope.errors["error_creacion"] = error;         
        });        
        

    }


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
  

/****/
$scope.convertImgToDataURLviaCanvas = function(idfrcasos,num){
//  console.log("numero",num);
  // if(num==='8'||num==='7'){
  //   if(num==='7'){
  //     $scope.forlenguaje(idfrcasos);
  //   }
  //   else{
  //     $scope.forper(idfrcasos);
  //   }
  // }
  // else{ 
    var resDatos = {
                    "table_name":"_fr_casos",
                     "filter": "cas_id="+idfrcasos
                };
      var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
      obj.success(function (response) { 
        $scope.datos=JSON.parse(response.record[0].cas_datos);
      //console.log("image1",$scope.datos.PTR_FOT1);

      var img = new Image();
          img.crossOrigin = 'Anonymous';
         img.onload = function(){
          //console.log("2",img);
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL("image/png");
             var img2 = new Image();
             //   console.log("1",img2);
                img2.crossOrigin = 'Anonymous';
                img2.onload = function(){
               //   console.log("2ss",img2);
                    var canvas = document.createElement('CANVAS');
                    var ctx = canvas.getContext('2d');
                    var dataURL2;
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);
                    dataURL2 = canvas.toDataURL("image/png");
                 //   console.log("URL22222",dataURL2,dataURL);
                    $scope.categoria(idfrcasos,num,dataURL,dataURL2)
                 };
                img2.src = $scope.datos.PTR_FOT2;
            //console.log("URL",dataURL);
             
         };
        img.src = $scope.datos.PTR_FOT1;
       
         
     
      });
      obj.error(function(error) {
        console.log("se fue al error ....");         
    }); 
 // }
};


 $scope.categoria=function(idfrcasos,numero,img1,img2){
    
   
        var resDatos = {
                    "table_name":"_fr_formulario_dinamico",
                     "filter": "campo_id="+199
                };
      var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
      obj.success(function (response) { 
        $scope.dat=JSON.parse(response.record[0].campo_descripcion);
    

       switch (numero){
          case '1':
            //$scope.formpat();
          break;
          case '2':
            $scope.formgen(idfrcasos,$scope.dat[2].titulo,numero,img1,img2);
          break;
          case '3':
            $scope.formgen(idfrcasos,$scope.dat[3].titulo,numero,img1,img2);    
          break;
          case '4':
            $scope.formgen(idfrcasos,$scope.dat[4].titulo,numero,img1,img2);
          break;
          case '5':
            $scope.formgen(idfrcasos,$scope.dat[6].titulo,numero,img1,img2);
          break;
          case '6':
            $scope.formgen(idfrcasos,$scope.dat[5].titulo,numero,img1,img2);
          break;
          case '7':
            $scope.forper(idfrcasos);
          break;
          case '8':
            $scope.forlenguaje(idfrcasos);
          break;
           default: console.log("se fue al default--:/",hola,numero);

        }

            });
            obj.error(function(error) {
                $.unblockUI(); 
               console.log("se fue al error de tabla casos");   
                                
              });

                
    };




/*******/

  $scope.gettablavista=function(){
    $scope.obtpdf = $scope.grupos;
    var columns = [
        {title: "#", dataKey: "#"},
        {title: "Codigo ", dataKey: "codigo"}, 
        {title: "Nombre ", dataKey: "nombre_item"}, 
       // {title: "Partida",datakey:"nombre_item"},
        {title: "Descripcion de Item", dataKey: "descripcion_item"}, 
        {title: "Partida", dataKey: "categoria_item"},
       // {title: "Codigo de depreciacion", dataKey: "cod_deprc"},
        {title: "Descripción de Depreciación", dataKey: "nombre_deprc"},
       // {title: "Vida Util", dataKey: "placa"},
        {title: "Observacion", dataKey: 'obsser'},
        {title: " ", dataKey: 'estado'}
      
      ];
    var data=[];
    i=0;
    angular.forEach($scope.obtpdf,function(celda, fila){            
      var aporte = {};
      aporte['#'] = i+1;
      aporte['codigo'] = celda['codigo'];
      aporte['nombre_item'] = celda['nombre_item'];
      aporte['descripcion_item'] = celda['descripcion_item'];
      aporte['categoria_item'] = celda['categoria_item'];
     // aporte['cod_deprc'] = celda['cod_deprc']; 
      aporte['nombre_deprc'] = celda['nombre_deprc']; 
      aporte['obsser'] = celda['obsser']; 
         if(celda['obsser'] == null) 
      {       
          aporte['obsser'] = ''; 
        }        
      
    
      
   
  
   data[i]=aporte;
      i++;
   
    });

    console.log("prueba real",columns)
    console.log("prueba real",data)
    
    var doc = new jsPDF('l', 'pt');
    var columnsLong = columns;

    var header = function (data) {
        doc.setFontSize(12);
        doc.setTextColor(40);
        doc.setFontStyle('bold');
    
         doc.addImage(headerImgbien, 'JPEG', data.settings.margin.left, 20, 790, 80);
         doc.text("REPORTE CATALOGO DE BIEN MUEBLE", data.settings.margin.left + 260, 125);
      
       // doc.text("SERVICIO DE MANTENIMIENTO VEHICULAR", data.settings.margin.left + 85, 125)
    };

    var totalPagesExp = "{total_pages_count_string}";
    var footer = function (data) {
        var str = "Pagina " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
        //doc.text("OFICIALIA MAYOR DE CULTURAS. TEL. 2-2202559 AV. 6 DE AGOSTO", data.settings.margin.left, doc.internal.pageSize.height - 45);
    };

    var options = {
        beforePageContent: header,
        afterPageContent: footer,
        margin: {horizontal: 30, top: 140, bottom: 80},
        styles: {overflow: 'linebreak'},
        columnStyles: {codigo: {columnWidth: 'wrap'}}
         } ;
    doc.autoTable(columnsLong, data, options);

    doc.autoTable(columnsLong, data, options);
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }
    doc.save('cod_idcaso'+'.pdf');
  };

 $scope.getrep_catalogo=function(cod_idcaso,id_for){
  
  var resDatos = {
                    "table_name":"_fr_formulario_dinamico",
                     "filter": "campo_id="+id_for
                };
  var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
  obj.success(function (response) {
    $scope.dato=JSON.parse(response.record[0].campo_descripcion);
    $scope.reporte_asig(cod_idcaso);
      
     });
    obj.error(function(error) {
                
    console.log("se fue al error de tabla casos");   
                                
    });
 };
 

$scope.reporte_asig=function(cod_idcaso){

  var resDatos = {
                    "table_name":"_fr_casos",
                     "filter": "cas_id="+cod_idcaso
                };
  var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
  obj.success(function (response) {    
    $scope.datos=JSON.parse(response.record[0].cas_datos);
   // console.log("lo que sale del record",$scope.datos);


    // var perfil=   $scope.datos.DAG_CAT_DESCRIPCION.split('>');
    // var perfil2=  perfil[2].split('<');
    // var perfil1= perfil2[0].split(';');
    // if(perfil1[0]==='&nbsp;'){
    //   perfil1[0]=' ';
    // }else{
    //   if(perfil1[0]==='&nbsp'){
    //     perfil1[0]=perfil1[1];
    //   }
    // }
        
   
    var columns = [
        {title: "primero", dataKey: "prim"},
        {title: "segundo", dataKey: "seg"},
        {title: "tercero", dataKey: "ter"},
        {title: "cuarto", dataKey: "cuar"}
      ];
    var data = [
      {"prim":'',"seg":''}
      // {"prim":"Fecha de Solicitud:","seg":$scope.datos.g_fecha,"ter":"Fecha Uso Programado:","cuar":$scope.datos.USG_FEC_PROG},
      // {"prim":"Horario de Uso"},
      // {"prim":"DE:","seg":$scope.datos.USG_HOR,"ter":"A:","cuar":$scope.datos.USG_HORA},
       ];
 
      var columns2 = [
        {title: "primero", dataKey: "prim"},
        {title: "segundo", dataKey: "seg"},
        {title: "tercero", dataKey: "ter"},
        {title: "cuarto", dataKey: "cuar"}
      ];
     var data2 = [
      {"prim":'',"seg":'',"ter":'',"cuar":''},
      {"prim":"Partida:","seg":$scope.datos.DAG_CAT_PARTIDA4_VALOR},
      {"prim":''},
      {"prim":"Item:","seg":$scope.datos.DAG_CAT_ITEM},
      {"prim":"Descripción:"},
      {"prim":'',"seg":$scope.datos.DAG_CAT_DESCRIPCION},
      {"prim":''},
      {"prim":"Marcas y Modelos Sugeridos:","seg":$scope.datos.DAG_CAT_MARCMOD},
      {"prim":''},
      {"prim":"Precio Referencial:","seg":$scope.datos.DAG_CAT_PRECIO},
      {"prim":''},
      {"prim":"Unidad de Medida:","seg":$scope.datos.DAG_CAT_UM},
      {"prim":''},
      {"prim":"Tipo de Carpeta (Bienes,Servicios,Funcionamiento y Otros):","seg":$scope.datos.DAG_TIP_CAR_VALOR},
      {"prim":''},
      {"prim":"Fecha Solicitud:","seg":$scope.datos.g_fecha},
      {"prim":''},
      {"prim":"Codigo de Depreciación:","seg":$scope.datos.DAG_FACTDEPRE},
      {"prim":''},
      {"prim":"Justificación:","seg":$scope.datos.DAG_CAT_JUSTINCO},
      {"prim":''},
      {"prim":"Descripcion de Depreciación:","seg":$scope.datos.DAG_FAC_VALOR},
      {"prim":''},
      {"prim":"Observación:","seg":$scope.datos.DAG_CAT_UBMOBSER}
      
   
      ];   
   
  
    var doc = new jsPDF('p', 'pt');
    var columnsLong = columns;

    var header = function (data) {
        doc.setFontSize(16);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.addImage(headerImgbien, 'JPEG', data.settings.margin.left, 20, 510, 80);
       //doc.text('Bienes Inmuebles', data.settings.margin.left + 60, 120);
    };

    var totalPagesExp = "{total_pages_count_string}";
    var footer = function (data) {
        var str = "Pagina " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
      //  doc.text("OFICIALIA MAYOR DE CULTURAS. TEL. 2-2202559 AV. 6 DE AGOSTO", data.settings.margin.left, doc.internal.pageSize.height - 45);
    };


      doc.setFontSize(8);
    //  doc.text('Direccion de Administracion General',40,70);
      //doc.text('Unidad de Servicios Generales',40,80);

      doc.setFontSize(12);
       doc.setFontStyle('bold');
      doc.text('FICHA DE BIEN MUEBLE',220,120);

      doc.autoTable(columns2.splice(0,4), data, {drawHeaderRow: function() {return false;} ,
            startY: 120,pageBreak: 'avoid',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'},seg: {columnWidth: 170},ter: {columnWidth: 120,fontStyle: 'bold'},cuar: {columnWidth: 80}}
        });
     // doc.rect(40, 130, 525, 50);
     
     doc.setFontSize(12);
      doc.autoTable(columnsLong.splice(0,4), data2,  {drawHeaderRow: function() {return false;},
        theme: 'plain',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 9, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 130,fontStyle: 'bold'},seg: {columnWidth: 380}}, pageBreak: 'avoid',
      });
      //doc.rect(40, 200, 525, 70);


     
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



//var headerImgData = 'data:image/jpeg;base64,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';

var headerImgbien ='data:image/png;base64,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';