app.controller('BusquedaPatriController', function ($scope, $q,$route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout,fileUpload, $location) {
  $scope.panelCasos=false;
  $scope.panelbuscador=true;
  $scope.wsId = "";
  $scope.actividadActual = "";
  $scope.bloquess = false;
  $scope.bloques = false;
  $scope.procesonro = 0;
  var strfecha= new Date();
  var mes=strfecha.getMonth()+1;
  if(mes.toString().length==1)
    mes='0'+mes;
  var dia=strfecha.getDate();
  if(dia.toString().length==1)
    dia='0'+dia;
  $scope.fechactual=strfecha.getFullYear() + "-" + mes + "-" + dia + " " + strfecha.getHours() + ":" + strfecha.getMinutes() + ":" + strfecha.getSeconds();
  $scope.panelCasos=true;
  var fechas= new Date();
  var fechactual=fechas.getFullYear() + "-" + fechas.getMonth() + "-" + fechas.getDate() + " " + fechas.getHours() + ":" + fechas.getMinutes() + ":" + fechas.getSeconds();
       
  $scope.panelFormularios=false;
  $scope.tituloP='Mis Fichas';
  $scope.panelbuscador=true;
  $scope.archivos=false;
  $scope.memoria=[];
  $scope.contador=0;
  $scope.errors = {};
  $scope.array = [];
  $scope.ImagenProceso = '{}';
  $scope.ImagenLinks = '';
  $scope.cargarLibreria = 0;
  $scope.abrirHistorico = 0;
  $scope.proceso = function(){
    //$.blockUI();
    var resOpcion = {
      "procedure_name":"sp_carga_procesos",
      "body":{"params": [{"name":"ws","value":sessionService.get('WS_ID')}]}
    };
    var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion).success(function (response){
      $scope.getFractividad = response;
      $.unblockUI();
    }).error(function(error) {
    });
  };
  
  $scope.fotografias = function(casos) {
    var proceso = 0;
    var ficha = '';
    var titulo = '';
    var idfrcasos = casos.casoid;
    var nombre = casos.sonombre;
    var tipo = nombre.substring(0,7);    
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=response.record[0].cas_nro_caso;
      $scope.data = JSON.parse(response.record[0].cas_datos);
      if(tipo == 'PTR_CBI'){
        proceso = $scope.procesonro;
        ficha =$scope.data.PTR_NUM_FIC;
        titulo = "ARCHIVO FOTOGRAFICO DE BIENES INMUEBLES"; 
      }else if(tipo == 'PTR_BMA'){
        proceso = $scope.procesonro;
        ficha =$scope.data.PTR_COD;
        titulo = "ARCHIVO FOTOGRAFICO DE BIENES ARQUEOLOGICOS"; 
      }else if(tipo == 'PTR_IME'){
        proceso = $scope.procesonro;
        ficha =$scope.data.PTR_NRO_FIC;
        titulo = "ARCHIVO FOTOGRAFICO DE ESCULTURAS"; 
      }else if(tipo == 'PTR-PCI'){
        proceso = $scope.procesonro;;
        ficha =$scope.data.PTR_COD;
        titulo = "ARCHIVO FOTOGRAFICO DE PATRIMONIO INMATERIAL"; 
      }else if(tipo == 'PTR-CON'){
        proceso = $scope.procesonro;
        ficha =$scope.data.PTR_NUM_FIC;
        titulo = "ARCHIVO FOTOGRAFICO DE CONJUNTOS"; 
      }else if(tipo == 'PTR-ESP'){
        proceso = $scope.procesonro;
        ficha =$scope.data.PTR_REG;
        titulo = "ARCHIVO FOTOGRAFICO DE ESPACIOS ABIERTOS"; 
      }  
      var reslocal = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select doc_url_logica,doc_correlativo, doc_datos, doc_nombre from dms_gt_documentos where doc_proceso = '"+ proceso+"' and doc_estado = 'A' and doc_id ="+$scope.datos
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (respons) {
        $scope.url = JSON.parse(respons[0].ejecutartojson)
        var pic =[];
        pic[0] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[1] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[2] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[3] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[4] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[5] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        var nom = [];
        nom[0]=" ";
        nom[1]=" ";
        nom[2]=" ";
        nom[3]=" ";
        nom[4]=" ";
        nom[5]=" ";
        var k =0;
        var j=0;
        var n = 10;
        console.log(1111111111111);
        console.log($scope.url);
        console.log($scope.url.length);
        if($scope.url == null){
                sweet.show(' ', 'No se cuenta con fotografias para el Archivo Fotografico', 'error');
                $scope.archivofotografico(pic,nom,ficha,titulo);       
        } else {
          for(var i=0;i<$scope.url.length ;i++){
            var a = $scope.url[i].doc_nombre;
            var imga = $scope.url[i].doc_url_logica;
            
            imga = imga.replace(/Ñ/gi,"%d1");
            imga = imga.replace(/ñ/gi,"%f1");
            imga = imga.replace(/Á/gi,"%c1");
            imga = imga.replace(/á/gi,"%e1");
            imga = imga.replace(/É/gi,"%c9");
            imga = imga.replace(/é/gi,"%e9");
            imga = imga.replace(/Í/gi,"%cd");
            imga = imga.replace(/í/gi,"%ed");
            imga = imga.replace(/Ó/gi,"%d3");
            imga = imga.replace(/ó/gi,"%f3");
            imga = imga.replace(/Ú/gi,"%da");
            imga = imga.replace(/ú/gi,"%fa");
            imga = imga.replace(/“/gi,"%93");
            imga = imga.replace(/”/gi,"%94");
            imga = imga.replace(/&/gi,"%26");
            imga = imga.replace(/\\/gi,"/");
            console.log($scope.url[i].doc_correlativo);
            if($scope.url[i].doc_correlativo == 5){
              nom[0]=$scope.url[i].doc_datos;
              console.log(nom[0]);
              k++;          
              var img4 = new Image();
              img4.crossOrigin = 'Anonymous';
              img4.src = imga;
              img4.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img4.height;
                canvas.width = img4.width;
                ctx.drawImage(img4, 0, 0);
                pic[0] = canvas.toDataURL("image/jpeg",0.2);
                j++;
                if(j == n){
                  $scope.archivofotografico(pic,nom,ficha,titulo);
                }
              }
              img4.onerror = function(){
                sweet.show('Error de Carga de Imagen', a, 'error');
              }          
            } else if($scope.url[i].doc_correlativo == 6) {
              nom[1]=$scope.url[i].doc_datos;
              console.log(nom[1]);

              k++;
              var img5 = new Image();
              img5.crossOrigin = 'Anonymous';
              img5.src = imga;
              img5.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img5.height;
                canvas.width = img5.width;
                console.log(img5.height,img5.width);
                ctx.drawImage(img5, 0, 0);
                pic[1] = canvas.toDataURL("image/jpeg",0.2);
                j++;
                if(j == n ){
                  $scope.archivofotografico(pic,nom,ficha,titulo);
                }
              }
              img5.onerror = function(){
                sweet.show('Error de Carga de Imagen', a, 'error');
              }
            } else if($scope.url[i].doc_correlativo == 7){
              nom[2]=$scope.url[i].doc_datos;
              console.log(nom[2]);
              k++;
              var img6 = new Image();
              img6.crossOrigin = 'Anonymous';
              img6.src = imga;
              img6.onload = function(){
                  var canvas = document.createElement('CANVAS');
                  var ctx = canvas.getContext('2d');
                  canvas.height = img6.height;
                  canvas.width = img6.width;
                  console.log(img6.height,img6.width);
                  ctx.drawImage(img6, 0, 0);
                  pic[2] = canvas.toDataURL("image/jpeg",0.2);
                  j++;
                  if(j == n ){
                    $scope.archivofotografico(pic,nom,ficha,titulo);
                  }
                
              }
              img6.onerror = function(){
                sweet.show('Error de Carga de Imagen', a, 'error');
              }
            } else if($scope.url[i].doc_correlativo ==8){
              nom[3]=$scope.url[i].doc_datos;
              console.log(nom[3]);
              k++;
              var img7 = new Image();
              img7.crossOrigin = 'Anonymous';
              img7.src = imga;
              img7.onload = function(){
               
                  var canvas = document.createElement('CANVAS');
                  var ctx = canvas.getContext('2d');
                  canvas.height = img7.height;
                  canvas.width = img7.width;
                  console.log(img7.height,img7.width);
                  ctx.drawImage(img7, 0, 0);
                  pic[3] = canvas.toDataURL("image/jpeg",0.2);
                  j++;
                  if(j == n ){
                    $scope.archivofotografico(pic,nom,ficha,titulo);
                  }
                
              }
              img7.onerror = function(){
                sweet.show('Error de Carga de Imagen', a , 'error');
              }
            } else if($scope.url[i].doc_correlativo ==9){
              nom[4]=$scope.url[i].doc_datos;
              console.log(nom[4]);
              k++;
              var img8 = new Image();
              img8.crossOrigin = 'Anonymous';
              img8.src = imga;
              img8.onload = function(){
                
                  var canvas = document.createElement('CANVAS');
                  var ctx = canvas.getContext('2d');
                  canvas.height = img8.height;
                  canvas.width = img8.width;
                  console.log(img8.height,img8.width);
                  ctx.drawImage(img8, 0, 0);
                  pic[4] = canvas.toDataURL("image/jpeg",0.2);
                  j++;
                  if(j == n){
                  $scope.archivofotografico(pic,nom,ficha,titulo);
                  }
                           
              }
              img8.onerror = function(){
                sweet.show('Error de Carga de Imagen', a, 'error');
              }
            } else if($scope.url[i].doc_correlativo ==10){
              nom[5]=$scope.url[i].doc_datos;
              k++;
              var img9 = new Image();
              img9.crossOrigin = 'Anonymous';
              img9.src = imga;
              img9.onload = function(){
                
                  var canvas = document.createElement('CANVAS');
                  var ctx = canvas.getContext('2d');
                  canvas.height = img9.height;
                  canvas.width = img9.width;
                  console.log(img9.height,img9.width);
                  ctx.drawImage(img9, 0, 0);
                  pic[5] = canvas.toDataURL("image/jpeg",0.2);
                  j++;
                  if(j == n){
                    $scope.archivofotografico(pic,nom,ficha,titulo); 
                  }
                           
              }
              img9.onerror = function(){
                sweet.show('Error de Carga de Imagen', a, 'error');
              }
            }

          if($scope.url.length == i+1 && k==0){
            sweet.show(' ', 'No se cuenta con fotografias para el Archivo Fotografico', 'error');
            $scope.archivofotografico(pic,nom,ficha,titulo);
          }

          if($scope.url.length == i+1){
            n=k;
          }
        }
      }
      })
      obj.error(function(error) {
      });
      })
    obj.error(function(error) {
    });
  };
  $scope.archivofotografico = function(pic,nom,fic,texto){
    console.log("Archivo",pic);
    console.log("Archivo",nom);
    console.log("Archivo",fic);
    console.log("Archivo",texto);
    var doc = new jsPDF('p', 'pt');
    doc.addImage(material,'JPEG', 35, 40, 525, 60);
    doc.setTextColor(0);
    doc.setFontStyle('bold');
    doc.setFontSize(11);
    doc.text(texto,40,120);
    doc.setFontSize(9);
    doc.text('NRO. FICHA: ',400,120);
    doc.setFontStyle('normal');
    doc.text(fic,470,120);
    doc.rect(390, 105, 170, 25);
      var a=40;
      var b=360;
      var g=135;
      var j=0;
        doc.setFontSize(8);
      for(var i=0;i<pic.length;i++){
        j++;
        if(nom[i] === null){
          nom[i] = " ";
        }
        if(i%2 === 0){
          doc.addImage(pic[i],'JPEG', a, g, 190, 190);
          doc.setTextColor(0);
          doc.text(nom[i],a, g+200);
        }
        else{
          doc.addImage(pic[i],'JPEG', b, g, 190, 190);
          doc.setTextColor(0);
          doc.text(nom[i],b, g+200);
          g=g+220;
        }
      }
      doc.setFontStyle('normal');
      doc.setFontSize(8); 
      doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746 ", 150, doc.internal.pageSize.height - 40);
      doc.text("Página 1 de 1", 470, doc.internal.pageSize.height - 40);
      $.unblockUI();
      //doc.save('arcfotografico'+'.pdf');
        $('#visorFu object').attr('data',doc.output('datauristring'));
        $("#divPopup4").modal('show');

        //window.open(doc.output('datauri'));
     
  };
  
  $scope.impresion = function(casos){        
    var idfrcasos = casos.casoid;
    var nombre = casos.sonombre;
    var tipo = nombre.substring(0,7);
    if(tipo == 'PTR_CBI'){
      $scope.inmueble(idfrcasos);
    }else if(tipo == 'PTR_BMA'){
      $scope.arqueologia(idfrcasos);
    }else if(tipo == 'PTR_IME'){
      $scope.monumento(idfrcasos);
    }else if(tipo == 'PTR-PCI'){
      $scope.inmaterial(idfrcasos);
    }else if(tipo == 'PTR-CON'){
      $scope.conjunto(idfrcasos);
    }else if(tipo == 'PTR-ESP'){
      $scope.espacioabierto(idfrcasos);
    }
  };
  $scope.getRegistross = function(idproceso,nro){
    //$.blockUI;   
    var filtro = "doc_proceso='" + idproceso + "' and doc_estado = 'A' and doc_id=" + nro ;
    var resOpcion = {
        "table_name":"dms_gt_documentos",
        "filter":filtro
    };
    var obj = DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resOpcion)
    .success(function (response){
        response = response.record;
        $scope.nroregistro = response.length + 1;
        $scope.obtRegistros = response;
        var data = response;   
        $scope.tablaRegistros = new ngTableParams({
            page: 1,          
            count: 10,
            filter: {},
            sorting: {}      
        }, {
            total: $scope.obtRegistros.length,
            getData: function($defer, params) {
                var filteredData = params.filter() ?
                $filter('filter')($scope.obtRegistros, params.filter()) :
                $scope.obtRegistros;              
                var orderedData = params.sorting() ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                $scope.obtRegistros;
                params.total(orderedData.length);
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
            }
        });
        $.unblockUI();
      }).error(function(error) {
          $.unblockUI();  
      });
      //$.blockUI();
  };
  $scope.sCasonombre = "";
  $scope.procid = "";
  $scope.casonro = "";
  $scope.archivo = function(casos){
    $scope.getRegistross(casos.procid,casos.casonro);
    $scope.panelbuscador=false;
    $scope.archivos=true;
    $scope.sCasonombre = casos.casnombrecaso;
    $scope.procid = casos.procid;
    $scope.casonro = casos.casonro;
    
  };
  $scope.archotro = false;
  $scope.archpdf = false;
  $scope.verImagens = function(imagen){
      var extencion = imagen.doc_nombre.split('.');
      if( extencion[1] == "png" || extencion[1] == "jpg"|| extencion[1] == "JPG" || extencion[1] == "jpeg" || extencion[1] == "gif" ){
        var imga = imagen.doc_url_logica;
          imga = imga.replace(/Ñ/gi,"%d1");
          imga = imga.replace(/ñ/gi,"%f1");
          imga = imga.replace(/Á/gi,"%c1");
          imga = imga.replace(/á/gi,"%e1");
          imga = imga.replace(/É/gi,"%c9");
          imga = imga.replace(/é/gi,"%e9");
          imga = imga.replace(/Í/gi,"%cd");
          imga = imga.replace(/í/gi,"%ed");
          imga = imga.replace(/Ó/gi,"%d3");
          imga = imga.replace(/ó/gi,"%f3");
          imga = imga.replace(/Ú/gi,"%da");
          imga = imga.replace(/ú/gi,"%fa");
          imga = imga.replace(/“/gi,"%93");
          imga = imga.replace(/”/gi,"%94");
          imga = imga.replace(/&/gi,"%26");
          imga = imga.replace(/\\/gi,"/");
          $scope.archotro = true;
          $scope.archpdf = false;
          $scope.archivoP = imga;
          $('#imgSalidas').attr("src",imga);
      }else if (extencion[1] == "pdf"){
          $scope.archotro = false;
          $scope.archpdf = true;
          $('#visorFums object').attr('data',imagen.doc_url_logica);
      }else{
      document.location = imagen.doc_url_logica;}
  };
  $scope.cambiarFiles = function(obj, valor){
    var nombre = obj.files[0].name;
    $scope.dato[obj.name] = obj.files[0].name;
    tipo = nombre.split(".");
    if(tipo[1] == "png" || tipo[1] == "jpg" || tipo[1] == "jpeg" || tipo[1] == "gif" || tipo[1] == "dwg" ||tipo[1] == "doc" || tipo[1] == "pdf"){
      if(obj.files[0].size > 2500000 && (tipo[1] == "png" || tipo[1] == "jpg" || tipo[1] == "jpeg" || tipo[1] == "gif" )){
        sweetAlert('', 'Archivo muy Grande', 'error');                    
      }
    }else{
      sweetAlert('', 'Tipo de Archivo no Valido', 'error');
    }
  }; 
  $scope.adicionarRegistross = function(data){
      var nombrecor = 'doc_correlativo'+$scope.patrimonio;
      var select = document.getElementById(nombrecor);
      if($scope.posicionfinal != "0"){
        $scope.posicionfinal = select.options[select.selectedIndex].text;
      }else{
        data.doc_correlativo = " ";
      }
      data.direccion = 'OTROS';
      if(data.doc_tps_doc_id != '2'){
              data.direccion = 'OTROS';
      }
      else{
          data.direccion='FOTOS'
      }
      if($scope.patrimonio == 'PTR-ESP'){
          $scope.procesoActual = 'WWDocumentadorEsp';
      }else if($scope.patrimonio == 'PTR_CBI'){
          $scope.procesoActual = 'WWDocumentadorInm';
      }else if($scope.patrimonio == 'PTR-PCI'){
          $scope.procesoActual = 'WWDocumentadorInma';
      }else if($scope.patrimonio == 'PTR_BMA'){
          $scope.procesoActual = 'WWDocumentadorArq';
      }else if($scope.patrimonio == 'PTR_IME'){
          $scope.procesoActual = 'WWDocumentadorEsc';
      }else{
          $scope.procesoActual = $scope.sIdProcesoActual;
      }
      var file = document.getElementById('doc_nombres');
      $scope.imagenDoc=uploadUrl + file.files[0].name  + '?app_name=' + CONFIG.APP_NAME;
      $scope.direccionvirtual= "/PATRIMONIO/" + $scope.procesoActual + "/" + $scope.sCasoNro + "/" + data.direccion;
      var uploadUrl = CONFIG.APIURL+"/files"+$scope.direccionvirtual+"/";
      var nombreFile = file.files[0].name ;
      tipo = nombreFile.split(".");
      var cadenaURL = uploadUrl + file.files[0].name  + '?app_name=' + CONFIG.APP_NAME;
      var cadenaURI = $scope.direccionvirtual +"/" + file.files[0].name ;
      fileUpload.uploadFileToUrl(file.files[0], uploadUrl);
      var datosUpload = {};
      datosUpload['doc_sistema'] = 'IF'; 
      datosUpload['doc_proceso'] = $scope.procid;
      datosUpload['doc_id'] = $scope.casonro
      datosUpload['doc_ci_nodo'] = $scope.sCasoNombre;
      datosUpload['doc_datos'] = data.doc_datos; 
      datosUpload['doc_titulo'] = data.doc_titulo; 
      datosUpload['doc_palabras'] = 0;   
      datosUpload['doc_version'] ='1';      
      datosUpload['doc_tiempo'] = 0;      
      datosUpload['doc_firma_digital'] = 0;      
      datosUpload['doc_acceso'] = "P";
      datosUpload['doc_tamanio_documento'] = "0";      
      datosUpload['doc_tps_doc_id'] = data.doc_tps_doc_id;      
      datosUpload['doc_tipo_documentacion'] = $scope.posicionfinal;      
      datosUpload['doc_tipo_ingreso'] = 'I';      
      datosUpload['doc_estado_de_envio'] = 'N';      
      datosUpload['doc_correlativo'] = data.doc_correlativo;
      datosUpload['doc_tipo_documento_ext'] = '';
      datosUpload['doc_nrotramite_nexo'] = '';
      datosUpload['doc_id_carpeta'] = '0';
      datosUpload['doc_registro'] = fechactual;
      datosUpload['doc_modificacion'] = fechactual;
      datosUpload['doc_usuario'] = sessionService.get('USUARIO');
      datosUpload['doc_estado'] = 'A';
      datosUpload['doc_url'] = cadenaURI;
      datosUpload['doc_url_logica'] = cadenaURL;
      datosUpload['doc_nombre'] = nombreFile;
      datosUpload['doc_tipo_documento'] = tipo[1];  
      var ressubirU = {
          table_name:"dms_gt_documentos",
          body:datosUpload
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].createRecords(ressubirU);
      obj.success(function(data){
        $.unblockUI();
        $scope.dato='';
        $scope.getRegistross($scope.procid,$scope.casonro);
      })
      .error(function(data){
          $.unblockUI();
      })
  };
  $scope.posicionfinal = ' ';
  $scope.modificarRegistross = function(prohid,data){    
      var nombrecor = 'doc_correlativo'+$scope.patrimonio;
      var select = document.getElementById(nombrecor);
      if($scope.posicionfinal != "0"){
        $scope.posicionfinal = select.options[select.selectedIndex].text;
      }else{        
        data.doc_correlativo = " ";
      }
      data.direccion = 'OTROS';
      if(data.doc_tps_doc_id != '2'){
              data.direccion = 'OTROS';
      }
      else{
          data.direccion='FOTOS'
      }
      if($scope.patrimonio == 'PTR-ESP'){
          $scope.procesoActual = 'WWDocumentadorEsp';
      }else if($scope.patrimonio == 'PTR_CBI'){
          $scope.procesoActual = 'WWDocumentadorInm';
      }else if($scope.patrimonio == 'PTR-PCI'){
          $scope.procesoActual = 'WWDocumentadorInma';
      }else if($scope.patrimonio == 'PTR_BMA'){
          $scope.procesoActual = 'WWDocumentadorArq';
      }else if($scope.patrimonio == 'PTR_IME'){
          $scope.procesoActual = 'WWDocumentadorEsc';
      }else{
          $scope.procesoActual = $scope.sIdProcesoActual;
      }
      var file = document.getElementById('doc_nombres');
      if(file.files.length > 0){
          $scope.imagenDoc=uploadUrl + file.files[0].name  + '?app_name=' + CONFIG.APP_NAME;
          $scope.direccionvirtual= "/PATRIMONIO/" + $scope.procesoActual + "/" + $scope.sCasoNro + "/" + data.direccion;
          var uploadUrl = CONFIG.APIURL+"/files"+$scope.direccionvirtual+"/";
          var nombreFile = file.files[0].name ;
          tipo = nombreFile.split(".");
          var cadenaURL = uploadUrl + file.files[0].name  + '?app_name=' + CONFIG.APP_NAME;
          var cadenaURI = $scope.direccionvirtual +"/" + file.files[0].name ;
          fileUpload.uploadFileToUrl(file.files[0], uploadUrl);
      }else{
          var nombreFile = data.doc_nombre;
          tipo = nombreFile.split(".");
          var cadenaURL = data.doc_url_logica;
          var cadenaURI = data.doc_url;
      }
      var datosUpload = {};
      datosUpload['doc_datos'] = data.doc_datos; 
      datosUpload['doc_titulo'] = data.doc_titulo;    
      datosUpload['doc_tps_doc_id'] = data.doc_tps_doc_id;
      datosUpload['doc_correlativo'] = data.doc_correlativo;
      datosUpload['doc_modificacion'] = fechactual;
      datosUpload['doc_url'] = cadenaURI;
      datosUpload['doc_url_logica'] = cadenaURL;
      datosUpload['doc_nombre'] = nombreFile;
      datosUpload['doc_tipo_documento'] = tipo[1]; 
      datosUpload['doc_tipo_documentacion'] =  $scope.posicionfinal;
      var ressubirU = {
          table_name:"dms_gt_documentos",
          id:prohid,
          body:datosUpload
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(ressubirU);
      obj.success(function(data){
        $.unblockUI();
        sweet.show('', 'Registro modificado', 'success');
        $scope.dato='';
        $scope.getRegistross($scope.procid,$scope.casonro);
      })
      .error(function(data){
          $.unblockUI();
          sweet.show('', 'Registro no modificado', 'error');
      })         
  };
  $scope.eliminarRegistross = function(prohid){
      var datosUpload = {};
      datosUpload['doc_estado'] = 'B';
      datosUpload['doc_modificacion'] = fechactual;
      var ressubirU = {
          table_name:"dms_gt_documentos",
          id:prohid,
          body:datosUpload
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].updateRecord(ressubirU);
      obj.success(function(data){
          $.unblockUI();
          sweet.show('', 'Registro eliminado', 'success');
          $scope.dato='';
          $scope.getRegistross($scope.procid,$scope.casonro);
      })
      .error(function(data){
          $.unblockUI();
          sweet.show('', 'Registro no eliminado', 'error');
      })
  }; 
  $scope.mostpos = function(datooo){
    if(datooo.doc_tps_doc_id != 2){
      $scope.patrimonio = "0";
      $scope.posicionfinal = "0";
    }else{
      $scope.patrimonio = $scope.sCasonombre.substring(0,7);
      $scope.posicionfinal = "1";
    }
  }
  $scope.modificarRegistroCargars = function(registro){
      if(registro.doc_tps_doc_id != 2){
        $scope.patrimonio = "0";
        $scope.posicionfinal = "0";
      }else{
        $scope.patrimonio = $scope.sCasonombre.substring(0,7);
        $scope.posicionfinal = "1";
      }
      $scope.desabilitado=false;
      $scope.dato = registro;
      $scope.boton="upd";
      $scope.titulo="Modificar Adjunto";
  };
  $scope.eliminarRegistroCargars = function(registro){
      var tipo = $scope.sCasonombre.substring(0,7);
      $scope.patrimonio = tipo;
      $scope.desabilitado=true;
      $scope.dato = registro;
      $scope.boton="del";
      $scope.titulo="Eliminar Adjunto";
  };
  $scope.limpiaradjs = function(){
      $scope.patrimonio = "0";
      $scope.dato='';
      document.getElementById('doc_nombres').value = "";
      document.getElementById('doc_nombress').value = "";
      $scope.desabilitado=false;
      $scope.boton="new";
      $scope.titulo="Adjutar Documentos";      
  }; 
  $scope.bloque = function(casid){
    $scope.casoid=casid;
    $scope.panelbuscador=false;
    $scope.bloques=true;
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+casid
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var nro = $scope.datos.PTR_BLOQ_INV;
      switch (nro) {
        case '1':
        $scope.bloq=true;
        $scope.bloq1=true;
        $scope.NombreBloque1=$scope.datos.PTR_DES_BLOQ1;
        $scope.bloq2=false;
        $scope.bloq3=false;
        $scope.bloq4=false;
        $scope.bloq5=false;
        break;
        case '2':
        $scope.bloq=true;
        $scope.bloq1=true;
        $scope.bloq2=true;
        $scope.NombreBloque1=$scope.datos.PTR_DES_BLOQ1;
        $scope.NombreBloque2=$scope.datos.PTR_DES_BLOQ2;
        $scope.bloq3=false;
        $scope.bloq4=false;
        $scope.bloq5=false;
        break;
        case '3':
        $scope.bloq=true;
        $scope.bloq1=true;
        $scope.bloq2=true;
        $scope.bloq3=true;
        $scope.NombreBloque1=$scope.datos.PTR_DES_BLOQ1;
        $scope.NombreBloque2=$scope.datos.PTR_DES_BLOQ2;
        $scope.NombreBloque3=$scope.datos.PTR_DES_BLOQ3;      
        $scope.bloq4=false;
        $scope.bloq5=false;
        break;
        case '4':
        $scope.bloq=true;
        $scope.bloq1=true;
        $scope.bloq2=true;
        $scope.bloq3=true;
        $scope.bloq4=true;
        $scope.NombreBloque1=$scope.datos.PTR_DES_BLOQ1;
        $scope.NombreBloque2=$scope.datos.PTR_DES_BLOQ2;
        $scope.NombreBloque3=$scope.datos.PTR_DES_BLOQ3;      
        $scope.NombreBloque4=$scope.datos.PTR_DES_BLOQ4;      
        $scope.bloq5=false;
        break;
        case '5':
        $scope.bloq=true;
        $scope.bloq1=true;
        $scope.bloq2=true;
        $scope.bloq3=true;
        $scope.bloq4=true;
        $scope.bloq5=true;
        $scope.NombreBloque1=$scope.datos.PTR_DES_BLOQ1;
        $scope.NombreBloque2=$scope.datos.PTR_DES_BLOQ2;
        $scope.NombreBloque3=$scope.datos.PTR_DES_BLOQ3;     
        $scope.NombreBloque4=$scope.datos.PTR_DES_BLOQ4;     
        $scope.NombreBloque5=$scope.datos.PTR_DES_BLOQ5;
        break;
        default:
        $scope.bloq=true;
        $scope.bloq1=false;
        $scope.bloq2=false;
        $scope.bloq3=false;
        $scope.bloq4=false;
        $scope.bloq5=false;
      }
    });
    obj.error(function(error) {
    });
  }; 
  
  $scope.inmueble = function(idfrcasos,nro) {
    //$.blockUI();  
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=response.record[0].cas_nro_caso;
      var reslocal = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select doc_url_logica,doc_correlativo, doc_datos ,doc_nombre from dms_gt_documentos where doc_proceso = '"+ $scope.procesonro+"' and doc_estado = 'A' and doc_id ="+$scope.datos
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (respons) {
        $scope.url = JSON.parse(respons[0].ejecutartojson)
        var pic =[];
        pic[0] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[1] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[2] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[3] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[4] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[5] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[6] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[7] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[8] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[9] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        var nom = [];
        nom[0]=" ";
        nom[1]=" ";
        nom[2]=" ";
        nom[3]=" ";
        nom[4]=" ";
        nom[5]=" ";
        var k =0;
        var j=0;
        var n = 10;
        if($scope.url == null){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);         
          }
          else{
        for(var i=0;i<$scope.url.length ;i++){
          var a = $scope.url[i].doc_nombre;
          var imga = $scope.url[i].doc_url_logica;
          imga = imga.replace(/Ñ/gi,"%d1");
          imga = imga.replace(/ñ/gi,"%f1");
          imga = imga.replace(/Á/gi,"%c1");
          imga = imga.replace(/á/gi,"%e1");
          imga = imga.replace(/É/gi,"%c9");
          imga = imga.replace(/é/gi,"%e9");
          imga = imga.replace(/Í/gi,"%cd");
          imga = imga.replace(/í/gi,"%ed");
          imga = imga.replace(/Ó/gi,"%d3");
          imga = imga.replace(/ó/gi,"%f3");
          imga = imga.replace(/Ú/gi,"%da");
          imga = imga.replace(/ú/gi,"%fa");
          imga = imga.replace(/“/gi,"%93");
          imga = imga.replace(/”/gi,"%94");
          imga = imga.replace(/&/gi,"%26");
          imga = imga.replace(/\\/gi,"/");
          if($scope.url[i].doc_correlativo == 1){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){
              var canvas = document.createElement('CANVAS');
              var ctx = canvas.getContext('2d');
              canvas.height = img.height;
              canvas.width = img.width;
              ctx.drawImage(img, 0, 0);      
              pic[0] = canvas.toDataURL("image/jpeg",0.3);
              j++;
              if(j == n){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }else if($scope.url[i].doc_correlativo == 2){
            k++;
            var img1 = new Image();
            img1.crossOrigin = 'Anonymous';
            img1.src = imga;
            img1.onload = function(){
              var canvas = document.createElement('CANVAS');
              var ctx = canvas.getContext('2d');
              canvas.height = img1.height;
              canvas.width = img1.width;
              ctx.drawImage(img1, 0, 0);
              pic[1] = canvas.toDataURL("image/jpeg",0.1);
              j++;
              if(j == n){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img1.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }else if($scope.url[i].doc_correlativo == 3){
            k++;
            var img2 = new Image();
            img2.crossOrigin = 'Anonymous';
            img2.src = imga;
            img2.onload = function(){              
              var canvas = document.createElement('CANVAS');
              var ctx = canvas.getContext('2d');
              canvas.height = img2.height;
              canvas.width = img2.width;
              ctx.drawImage(img2, 0, 0);
              pic[2] = canvas.toDataURL("image/jpeg",0.1);
              j++;
              if(j == n){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img2.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }else if($scope.url[i].doc_correlativo ==4){
            k++;
            var img3 = new Image();
            img3.crossOrigin = 'Anonymous';
            img3.src = imga;
            img3.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img3.height;
                canvas.width = img3.width;
                ctx.drawImage(img3, 0, 0);
                pic[3] = canvas.toDataURL("image/jpeg",0.1);
              j++;
              if(j == n){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img3.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }else if($scope.url[i].doc_correlativo == 5){
            nom[0]=$scope.url[i].doc_datos;
            k++;          
            var img4 = new Image();
            img4.crossOrigin = 'Anonymous';
            img4.src = imga;
            img4.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img4.height;
                canvas.width = img4.width;
                ctx.drawImage(img4, 0, 0);
                pic[4] = canvas.toDataURL("image/jpg",0.2);
              j++;
              if(j == n){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img4.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }         
          }else if($scope.url[i].doc_correlativo == 6){
            nom[1]=$scope.url[i].doc_datos;
            k++;
            var img5 = new Image();
            img5.crossOrigin = 'Anonymous';
            img5.src = imga;
            img5.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img5.height;
                canvas.width = img5.width;
                ctx.drawImage(img5, 0, 0);
                pic[5] = canvas.toDataURL("image/jpeg",0.2);
              j++;
              if(j == n ){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img5.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }else if($scope.url[i].doc_correlativo == 7){
            nom[2]=$scope.url[i].doc_datos;
            k++;
            var img6 = new Image();
            img6.crossOrigin = 'Anonymous';
            img6.src = imga;
            img6.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img6.height;
                canvas.width = img6.width;
                ctx.drawImage(img6, 0, 0);
                pic[6] = canvas.toDataURL("image/jpeg",0.2);
              j++;
              if(j == n ){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img6.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }else if($scope.url[i].doc_correlativo ==8){
            nom[3]=$scope.url[i].doc_datos;
            k++;
            var img7 = new Image();
            img7.crossOrigin = 'Anonymous';
            img7.src = imga;
            img7.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img7.height;
                canvas.width = img7.width;
                ctx.drawImage(img7, 0, 0);
                pic[7] = canvas.toDataURL("image/jpeg",0.2);
              j++;
              if(j == n ){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img7.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }else if($scope.url[i].doc_correlativo ==9){
            nom[4]=$scope.url[i].doc_datos;
            k++;
            var img8 = new Image();
            img8.crossOrigin = 'Anonymous';
            img8.src = imga;
            img8.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img8.height;
                canvas.width = img8.width;
                ctx.drawImage(img8, 0, 0);
                pic[8] = canvas.toDataURL("image/jpeg",0.2);
              j++;
              if(j == n){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img8.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }else if($scope.url[i].doc_correlativo ==10){
            nom[5]=$scope.url[i].doc_datos;
            k++;
            var img9 = new Image();
            img9.crossOrigin = 'Anonymous';
            img9.src = imga;
            img9.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img9.height;
                canvas.width = img9.width;
                ctx.drawImage(img9, 0, 0);
                pic[9] = canvas.toDataURL("image/jpeg",0.2);
              j++;
              if(j == n){
                $scope.fichainmueble(idfrcasos,pic,nro,nom);
              }
            }
            img9.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }
          }
          if($scope.url.length == i+1 && k==0){
            $scope.fichainmueble(idfrcasos,pic,nro,nom);
          }

          if($scope.url.length == i+1){
            n=k;
          }
        }
      }
      })
      obj.error(function(error) {
      });
      })
    obj.error(function(error) {
    });
  };  
  $scope.fotos = function(idfrcasos,nro) {
    $.blockUI();  
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var doc = new jsPDF('p', 'pt');
      var htmlOb = document.createElement('div');
      htmlOb.innerHTML = $scope.datos.PTR_VAL_TEC_DESC1;
      var htmlObj = document.createElement('div');
      htmlObj.innerHTML = $scope.datos.PTR_VAL_HIS_DESC1;
      var htmlObje = document.createElement('div');
      htmlObje.innerHTML = $scope.datos.PTR_VAL_ART_DESC1;
      var htmlObjet = document.createElement('div');
      htmlObjet.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC1;
      var inte1 = document.createElement('div');
      inte1.innerHTML = $scope.datos.PTR_VAL_INTE_DESC1;
      var urb1 = document.createElement('div');
      urb1.innerHTML = $scope.datos.PTR_VAL_URB_DESC1;
      var inmat1 = document.createElement('div');
      inmat1.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC1;
      var simb1 = document.createElement('div');
      simb1.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC1;      
      var tec2 = document.createElement('div');
      tec2.innerHTML = $scope.datos.PTR_VAL_TEC_DESC2;
      var his2 = document.createElement('div');
      his2.innerHTML = $scope.datos.PTR_VAL_HIS_DESC2;
      var art2 = document.createElement('div');
      art2.innerHTML = $scope.datos.PTR_VAL_ART_DESC2;
      var arq2 = document.createElement('div');
      arq2.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC2;
      var inte2 = document.createElement('div');
      inte2.innerHTML = $scope.datos.PTR_VAL_INTE_DESC2;
      var urb2 = document.createElement('div');
      urb2.innerHTML = $scope.datos.PTR_VAL_URB_DESC2;
      var inmat2 = document.createElement('div');
      inmat2.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC2;
      var simb2 = document.createElement('div');
      simb2.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC2; 
      var tec3 = document.createElement('div');
      tec3.innerHTML = $scope.datos.PTR_VAL_TEC_DESC3;
      var his3 = document.createElement('div');
      his3.innerHTML = $scope.datos.PTR_VAL_HIS_DESC3;
      var art3 = document.createElement('div');
      art3.innerHTML = $scope.datos.PTR_VAL_ART_DESC3;
      var arq3 = document.createElement('div');
      arq3.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC3;
      var inte3 = document.createElement('div');
      inte3.innerHTML = $scope.datos.PTR_VAL_INTE_DESC3;
      var urb3 = document.createElement('div');
      urb3.innerHTML = $scope.datos.PTR_VAL_URB_DESC3;
      var inmat3 = document.createElement('div');
      inmat3.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC3;
      var simb3 = document.createElement('div');
      simb3.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC3;
      var tec4 = document.createElement('div');
      tec4.innerHTML = $scope.datos.PTR_VAL_TEC_DESC4;
      var his4 = document.createElement('div');
      his4.innerHTML = $scope.datos.PTR_VAL_HIS_DESC4;
      var art4 = document.createElement('div');
      art4.innerHTML = $scope.datos.PTR_VAL_ART_DESC4;
      var arq4 = document.createElement('div');
      arq4.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC4;
      var inte4 = document.createElement('div');
      inte4.innerHTML = $scope.datos.PTR_VAL_INTE_DESC4;
      var urb4 = document.createElement('div');
      urb4.innerHTML = $scope.datos.PTR_VAL_URB_DESC4;
      var inmat4 = document.createElement('div');
      inmat4.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC4;
      var simb4 = document.createElement('div');
      simb4.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC4;
      var tec5 = document.createElement('div');
      tec5.innerHTML = $scope.datos.PTR_VAL_TEC_DESC5;
      var his5 = document.createElement('div');
      his5.innerHTML = $scope.datos.PTR_VAL_HIS_DESC5;
      var art5 = document.createElement('div');
      art5.innerHTML = $scope.datos.PTR_VAL_ART_DESC5;
      var arq5 = document.createElement('div');
      arq5.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC5;
      var inte5 = document.createElement('div');
      inte5.innerHTML = $scope.datos.PTR_VAL_INTE_DESC5;
      var urb5 = document.createElement('div');
      urb5.innerHTML = $scope.datos.PTR_VAL_URB_DESC5;
      var inmat5 = document.createElement('div');
      inmat5.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC5;
      var simb5 = document.createElement('div');
      simb5.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC5;
      if(nro==1){
        var colbloque = [
        {title: "primero", dataKey: "one"},
        {title: "segundo", dataKey: "two"},
        {title: "tercero", dataKey: "three"},
        {title: "cuarto", dataKey: "for"},
        {title: "quinto", dataKey: "five"},
        {title: "sexto", dataKey: "six"}
        ];
        var databloque = [
        {"one":"Estilo del Bloque:","two":$scope.datos.PTR_EST_BLOQ1.toUpperCase(),"three":"Rango Época Bloque:","for":$scope.datos.PTR_RANG_EPO1.toUpperCase(),"five":"Sistema Constructivo:","six":$scope.datos.PTR_SIS_CONSTRUC1.toUpperCase()}
        ];
        var colvaloracion = [
        {title: "primero", dataKey: "prim"}
        ];
        var dataval = [
        {"prim":htmlObj.innerText.toUpperCase()},
        {"prim":htmlObje.innerText.toUpperCase()},
        {"prim":htmlObjet.innerText.toUpperCase()},
        {"prim":htmlOb.innerText.toUpperCase()},
        {"prim":inte1.innerText.toUpperCase()},
        {"prim":urb1.innerText.toUpperCase()},
        {"prim":inmat1.innerText.toUpperCase()},
        {"prim":simb1.innerText.toUpperCase()}
        ];
      }
      if(nro===2){
        var colbloque = [
        {title: "primero", dataKey: "one"},
        {title: "segundo", dataKey: "two"},
        {title: "tercero", dataKey: "three"},
        {title: "cuarto", dataKey: "for"},
        {title: "quinto", dataKey: "five"},
        {title: "sexto", dataKey: "six"}
        ];
        var databloque = [
        {"one":"Estilo del Bloque:","two":$scope.datos.PTR_EST_BLOQ2.toUpperCase(),"three":"Rango Época Bloque:","for":$scope.datos.PTR_RANG_EPO2.toUpperCase(),"five":"Sistema Constructivo:","six":$scope.datos.PTR_SIS_CONSTRUC2.toUpperCase()}
        ];
        var colvaloracion = [
        {title: "primero", dataKey: "prim"}
        ];
        var dataval = [
        {"prim":his2.innerText.toUpperCase()},
        {"prim":art2.innerText.toUpperCase()},
        {"prim":arq2.innerText.toUpperCase()},
        {"prim":tec2.innerText.toUpperCase()},
        {"prim":inte2.innerText.toUpperCase()},
        {"prim":urb2.innerText.toUpperCase()},
        {"prim":inmat2.innerText.toUpperCase()},
        {"prim":simb2.innerText.toUpperCase()}
        ];
      }
      if(nro===3){
        var colbloque = [
        {title: "primero", dataKey: "one"},
        {title: "segundo", dataKey: "two"},
        {title: "tercero", dataKey: "three"},
        {title: "cuarto", dataKey: "for"},
        {title: "quinto", dataKey: "five"},
        {title: "sexto", dataKey: "six"}
        ];
        var databloque = [
        {"one":"Estilo del Bloque:","two":$scope.datos.PTR_EST_BLOQ3.toUpperCase(),"three":"Rango Época Bloque:","for":$scope.datos.PTR_RANG_EPO3.toUpperCase(),"five":"Sistema Constructivo:","six":$scope.datos.PTR_SIS_CONSTRUC3.toUpperCase()}
        ];
        var colvaloracion = [
        {title: "primero", dataKey: "prim"}
        ];
        var dataval = [
        {"prim":his3.innerText},
        {"prim":art3.innerText},
        {"prim":arq3.innerText},
        {"prim":tec3.innerText},
        {"prim":inte3.innerText},
        {"prim":urb3.innerText},
        {"prim":inmat3.innerText},
        {"prim":simb3.innerText}
        ];
      }
      var nombre = '';
      switch (nro) {
        case 1:
        $scope.datos.PTR_CATEGORIA = $scope.datos.PTR_CATEGORIA1;
        nombre=$scope.datos.PTR_DES_BLOQ1.toUpperCase();
        nombre = doc.splitTextToSize(nombre,700,{halign: 'center',valign: 'middle'});
        break;
        case 2:
        $scope.datos.PTR_CATEGORIA = $scope.datos.PTR_CATEGORIA2;
        nombre=$scope.datos.PTR_DES_BLOQ2.toUpperCase();
        nombre = doc.splitTextToSize(nombre,700,{halign: 'center',valign: 'middle'});
        break;
        case 3:
        $scope.datos.PTR_CATEGORIA = $scope.datos.PTR_CATEGORIA3;
        nombre=$scope.datos.PTR_DES_BLOQ3.toUpperCase();
        nombre = doc.splitTextToSize(nombre,700,{halign: 'center',valign: 'middle'});
        break;
        case 4:
        $scope.datos.PTR_CATEGORIA = $scope.datos.PTR_CATEGORIA4;
        nombre=$scope.datos.PTR_DES_BLOQ4.toUpperCase();
        nombre = doc.splitTextToSize(nombre,700,{halign: 'center',valign: 'middle'});
        break;
        case 5:
        $scope.datos.PTR_CATEGORIA = $scope.datos.PTR_CATEGORIA5;
        nombre=$scope.datos.PTR_DES_BLOQ5.toUpperCase();
        nombre = doc.splitTextToSize(nombre,700,{halign: 'center',valign: 'middle'});
        break;
        default:
        nombre=' ';
      }
      if(nro===4){
        var colbloque = [
        {title: "primero", dataKey: "one"},
        {title: "segundo", dataKey: "two"},
        {title: "tercero", dataKey: "three"},
        {title: "cuarto", dataKey: "for"},
        {title: "quinto", dataKey: "five"},
        {title: "sexto", dataKey: "six"}
        ];
        var databloque = [
        {"one":"Estilo del Bloque:","two":$scope.datos.PTR_EST_BLOQ4.toUpperCase(),"three":"Rango Época Bloque:","for":$scope.datos.PTR_RANG_EPO4.toUpperCase(),"five":"Sistema Constructivo:","six":$scope.datos.PTR_SIS_CONSTRUC4.toUpperCase()}
        ];

        var colvaloracion = [
        {title: "primero", dataKey: "prim"}
        ];
        var dataval = [
        {"prim":his4.innerText.toUpperCase()},
        {"prim":art4.innerText.toUpperCase()},
        {"prim":arq4.innerText.toUpperCase()},
        {"prim":tec4.innerText.toUpperCase()},
        {"prim":inte4.innerText.toUpperCase()},
        {"prim":urb4.innerText.toUpperCase()},
        {"prim":inmat4.innerText.toUpperCase()},
        {"prim":simb4.innerText.toUpperCase()}
        ];
      }
      if(nro===5){

        var colbloque = [
        {title: "primero", dataKey: "one"},
        {title: "segundo", dataKey: "two"},
        {title: "tercero", dataKey: "three"},
        {title: "cuarto", dataKey: "for"},
        {title: "quinto", dataKey: "five"},
        {title: "sexto", dataKey: "six"}
        ];
        var databloque = [
        {"one":"Estilo del Bloque:","two":$scope.datos.PTR_EST_BLOQ5.toUpperCase(),"three":"Rango Época Bloque:","for":$scope.datos.PTR_RANG_EPO5.toUpperCase(),"five":"Sistema Constructivo:","six":$scope.datos.PTR_SIS_CONSTRUC5.toUpperCase()}
        ];

        var colvaloracion = [
        {title: "primero", dataKey: "prim"}
        ];
        var dataval = [
        {"prim":his5.innerText.toUpperCase()},
        {"prim":art5.innerText.toUpperCase()},
        {"prim":arq5.innerText.toUpperCase()},
        {"prim":tec5.innerText.toUpperCase()},
        {"prim":inte5.innerText.toUpperCase()},
        {"prim":urb5.innerText.toUpperCase()},
        {"prim":inmat5.innerText.toUpperCase()},
        {"prim":simb5.innerText.toUpperCase()}
        ];
      }
      var header = function (data) {
        doc.addImage(material,'JPEG', 35, 40, 525, 60);
        doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(9);
        doc.text('FICHA DE CATALOGACIÓN DE BIENES INMUEBLES',40,120);
        doc.text('CATEGORIA: ',400,120);
        doc.text('NRO. FICHA: ',400,135);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_CATEGORIA,470,120);
        doc.text($scope.datos.PTR_NUM_FIC,470,135);
        doc.rect(390, 105, 170, 35);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var footer = function (data) {
        var str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746 ", 40,  doc.internal.pageSize.height - 40);
        doc.text(str, 470,  doc.internal.pageSize.height - 40);
      };
      doc.setFontSize(9);
      if($scope.datos.PTR_CATEGORIA===undefined){
        $scope.datos.PTR_CATEGORIA=" ";
      }
      if(nro>=1){
        doc.setFontSize(9);
        doc.setFontStyle('bold');
        doc.text('INFORMACIÓN POR BLOQUE:',40,135);
        doc.setFontSize(8);
        doc.text('DESCRIPCIÓN DEL BLOQUE:',60,150);
        doc.text('BLOQUES INVENTARIADOS:',60,185);
        doc.setFontStyle('normal');
        doc.text(nombre,200,150);
        doc.text($scope.datos.PTR_BLOQ_INV,200,185);
        doc.setFontSize(8);
        doc.text('BLOQUE NÚMERO:  '+nro,60,205);
        doc.autoTable(colbloque.splice(0,6), databloque, {drawHeaderRow: function() {return false;},startY: 210,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 55, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {one: {columnWidth: 90,fontStyle: 'bold'},two: {columnWidth: 85},three: {columnWidth: 90,fontStyle: 'bold'},for: {columnWidth: 70},five: {columnWidth: 90,fontStyle: 'bold'},six: {columnWidth: 85}}});
        doc.rect(40, doc.autoTableEndPosY() -25, 525, 25);
        doc.setFontSize(9);
        doc.setFontStyle('bold');
        doc.text('VALORACIÓN:',40,doc.autoTableEndPosY() +20);
        doc.setFontSize(9);
        doc.autoTable(colvaloracion.splice(0,2), dataval, {drawHeaderRow: function() {return false;},   startY: doc.autoTableEndPosY()+30,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 130, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {tit: {columnWidth: 140,fontStyle: 'bold'}},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
          if (row.index === 0) {
            doc.autoTableText("INDICADOR HISTÓRICO CULTURAL", 40, row.y + 5, {
              halign: 'left',
              valign: 'botton'
            });
            data.cursor.y += 20;
          } else if (row.index === 1) {
            doc.setTextColor(0);
            doc.autoTableText("INDICADOR ARTÍSTICO" , 40, row.y + 10, {
              halign: 'left',
              valign: 'botton'
            });
            data.cursor.y += 20;
          }  else if (row.index === 2) {
            doc.setTextColor(0);
            doc.autoTableText("INDICADOR TIPOLÓGICO" , 40, row.y + 10, {
              halign: 'left',
              valign: 'botton'
            });
            data.cursor.y += 20;
          }else if (row.index === 3) {
            doc.setTextColor(0);
            doc.autoTableText("INDICADOR TECNOLÓGICO" , 40, row.y + 10, {
              halign: 'left',
              valign: 'botton'
            });
            data.cursor.y += 20;
          }else if (row.index === 4) {
            doc.setTextColor(0);
            doc.autoTableText("INDICADOR DE INTEGRIDAD" , 40, row.y + 10, {
              halign: 'left',
              valign: 'botton'
            });
            data.cursor.y += 20;
          }else if (row.index === 5) {
            doc.setTextColor(0);
            doc.autoTableText("INDICADOR URBANO" , 40, row.y + 10, {
              halign: 'left',
              valign: 'botton'
            });
            data.cursor.y += 20;
          }else if (row.index === 6) {
            doc.setTextColor(0);
            doc.autoTableText("INDICADOR INMATERIAL" , 40, row.y + 10, {
              halign: 'left',
              valign: 'botton'
            });
            data.cursor.y += 20;
          }else if (row.index === 7) {
            doc.setTextColor(0);
            doc.autoTableText("INDICADOR SIMBÓLICO" , 40, row.y + 10, {
              halign: 'left',
              valign: 'botton'
            });
            data.cursor.y += 20;
          }}});
      }
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      $.unblockUI();
      //doc.save('inmueble'+'.pdf');

        $('#visorFu object').attr('data',doc.output('datauristring'));
        $("#divPopup4").modal('show');
        //window.open(doc.output('datauristring'));
    });
    obj.error(function(error) {
    });
  };
   $scope.fichainmueble = function(frcasos,pic,nro,nom){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+frcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var doc = new jsPDF('p', 'pt');
      var tradicional='';
      for(var i=1; i<$scope.datos.PTR_USO_TRAD.length;i++){
        if($scope.datos.PTR_USO_TRAD[i].estado){
          if(tradicional!=''){
            tradicional=tradicional+', '+$scope.datos.PTR_USO_TRAD[i].resvalor;
          }
          else{
            tradicional=tradicional+$scope.datos.PTR_USO_TRAD[i].resvalor;
          }
        }
      }
      var actual='';
      for(var i=1; i<$scope.datos.PTR_USO_ACT.length;i++){
        if($scope.datos.PTR_USO_ACT[i].estado){
          if(actual!=''){
            actual=actual+', '+$scope.datos.PTR_USO_ACT[i].resvalor;
          }
          else{
            actual = actual + $scope.datos.PTR_USO_ACT[i].resvalor;
          }
        }
      }
      var columns = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"}
      ];
      var figuraa = '';
      if($scope.datos.PTR_FIG_PROT[1] == undefined){
        figuraa='  '
      }
      else{
        figuraa= $scope.datos.PTR_FIG_PROT[1].f01_FIG_LEG_.toUpperCase();
      }
      var data = [
      {"prim":"CÓDIGO CATASTRAL:","seg":$scope.datos.PTR_COD_CAT},
      {"prim":"FECHA DE REGISTRO:","seg":$scope.datos.PTR_FEC_CREA},
      {"prim":"DENOMINACIÓN DEL INMUEBLE:","seg":$scope.datos.PTR_ACT.toUpperCase()},
     // {"prim":"FIGURA DE PROTECCIÓN:","seg":figuraa}
      ];
      var columns2 = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      {title: "tercero", dataKey: "ter"},
      {title: "cuarto", dataKey: "cuar"}
      ];
      if($scope.datos.PTR_MACRO ==-1||$scope.datos.PTR_MACRO =='(Ninguno)')
        {$scope.datos.PTR_MACRO =" ";} 
      var data2 = [
      {"prim":"MUNICIPIO:","seg":$scope.datos.PTR_MUNI.toUpperCase(),"ter":"NÚMERO DE CASA","cuar":" "},
      {"prim":"MACRODISTRITO:","seg":$scope.datos.PTR_MACRO,"ter":"NÚMERO 1:","cuar":$scope.datos.PTR_NUM1},
      {"prim":"ZONA:","seg":$scope.datos.PTR_ZONA,"ter":"NÚMERO 2:","cuar":$scope.datos.PTR_NUM2},
      {"prim":"DIRECCIÓN:","seg":$scope.datos.PTR_DIRE.toUpperCase(),"ter":"NÚMERO 3:","cuar":$scope.datos.PTR_NUM3},
      {"prim":"DEPARTAMENTO:","seg":$scope.datos.PTR_DEP.toUpperCase(),"ter":"NÚMERO 4:","cuar":$scope.datos.PTR_NUM4},
      {"prim":"CIUDAD/POBLACIÓN:","seg":$scope.datos.PTR_MUNI.toUpperCase(),"ter":"NÚMERO 5:","cuar":$scope.datos.PTR_NUM5},
      ];
      var columns3 = [
      {title: "primero", dataKey: "prim"}
      ];
      var despred = document.createElement('div');
      despred.innerHTML = $scope.datos.PTR_DES_PRED.toUpperCase();
      var data3 = [
      {"prim":despred.innerText}
      ];
      var columns4 = [
      {title: "primero", dataKey: "prim"}
      ];
      var data4 = [];
      for(var i = 1; i<$scope.datos.PTR_REG_PROPI.length;i++){
         var aporte = {"prim": $scope.datos.PTR_REG_PROPI[i].f01_reja_INT_.toUpperCase()};
        data4[i]=aporte; 
      }
      var columns67 = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"}
      ];
      var data67 = [];
      for(var i = 1; i<$scope.datos.PTR_FIG_PROT.length;i++){
         data67[i] = {"prim": "* "+$scope.datos.PTR_FIG_PROT[i].f01_FIG_LEG_.toUpperCase(),"seg":$scope.datos.PTR_FIG_PROT[i].f01_FIG_OBS.toUpperCase()};
      }
      var columns66 = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      {title: "tercero", dataKey: "ter"},
      {title: "cuarto", dataKey: "cuar"}
      ];
      var data66 = [
      {"prim":"USO ACTUAL:","seg":actual.toUpperCase(),"ter":"USO TRADICIONAL:","cuar":tradicional.toUpperCase()}
      ];
      var columns6 = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      {title: "tercero", dataKey: "ter"},
      {title: "cuarto", dataKey: "cuar"}
      ];
      if($scope.datos.PTR_TIP_ARQ == -1 ||$scope.datos.PTR_TIP_ARQ =='(Ninguno)')
        {$scope.datos.PTR_TIP_ARQ =" ";}
      if($scope.datos.PTR_LIN_CONS ==-1 ||$scope.datos.PTR_LIN_CONS =='(Ninguno)')
        {$scope.datos.PTR_LIN_CONS =" ";}
      if($scope.datos.PTR_UBIC_MAN ==-1 ||$scope.datos.PTR_UBIC_MAN =='(Ninguno)')
        {$scope.datos.PTR_UBIC_MAN =" ";}
      if($scope.datos.PTR_EST_CON ==-1 ||$scope.datos.PTR_EST_CON =='(Ninguno)')
        {$scope.datos.PTR_EST_CON =" ";}
      if($scope.datos.PTR_TRAZ_MAN ==-1 ||$scope.datos.PTR_TRAZ_MAN =='(Ninguno)')
        {$scope.datos.PTR_TRAZ_MAN =" ";}
      if($scope.datos.PTR_TIP_VIA ==-1 ||$scope.datos.PTR_TIP_VIA =='(Ninguno)')
        {$scope.datos.PTR_TIP_VIA =" ";}
      if($scope.datos.PTR_RAN_EPO ==-1 ||$scope.datos.PTR_RAN_EPO =='(Ninguno)')
        {$scope.datos.PTR_RAN_EPO =" ";}
      if($scope.datos.PTR_MAT_VIA ==-1 ||$scope.datos.PTR_MAT_VIA =='(Ninguno)')
        {$scope.datos.PTR_MAT_VIA =" ";}
      if($scope.datos.PTR_EST_GEN ==-1 ||$scope.datos.PTR_EST_GEN =='(Ninguno)')
        {$scope.datos.PTR_EST_GEN =" ";}

      var data6 = [
      {"prim":"TIPOLOGIA ARQUITECTÓNICA:","seg":$scope.datos.PTR_TIP_ARQ.toUpperCase(),"ter":"UBICACIÓN DE MANZANA:","cuar":$scope.datos.PTR_UBIC_MAN.toUpperCase()},
      {"prim":"LINEA DE CONSTRUCCIÓN:","seg":$scope.datos.PTR_LIN_CONS.toUpperCase(),"ter":"ESTADO DE CONSERVACIÓN:","cuar":$scope.datos.PTR_EST_CON.toUpperCase()},
      {"prim":"TRAZO DE MANZANA:","seg":$scope.datos.PTR_TRAZ_MAN.toUpperCase(),"ter":"TIPO DE VÍA:","cuar":$scope.datos.PTR_TIP_VIA.toUpperCase()},
      {"prim":"RANGO DE ÉPOCA:","seg":$scope.datos.PTR_RAN_EPO.toUpperCase(),"ter":"MATERIAL DE VÍA:","cuar":$scope.datos.PTR_MAT_VIA.toUpperCase()},
      {"prim":"ESTILO GENERAL:","seg":$scope.datos.PTR_EST_GEN.toUpperCase(),"ter":" ","cuar":" "}
      ];
      var columns7 = [
      {title: "REFERENCIAS", dataKey: "uno"},
      {title: "OBSERVACIÓN", dataKey: "tres"}
      ];
      var data7=[];
      for (var i=1; i<$scope.datos.PTR_REF_HIST.length;i++){
        var desc = $scope.datos.PTR_REF_HIST[i].f01_ref_hist_.split('-');
        var aporte = {"uno":"* "+$scope.datos.PTR_REF_HIST[i].f01_ref_hist_.toUpperCase() ,"tres":$scope.datos.PTR_REF_HIST[i].f01_Obs_REF_};
        data7[i]=aporte;
      }
      var htmlOb = document.createElement('div');
      htmlOb.innerHTML = $scope.datos.PTR_VAL_TEC_DESC1;
      var htmlObj = document.createElement('div');
      htmlObj.innerHTML = $scope.datos.PTR_VAL_HIS_DESC1;
      var htmlObje = document.createElement('div');
      htmlObje.innerHTML = $scope.datos.PTR_VAL_ART_DESC1;
      var htmlObjet = document.createElement('div');
      htmlObjet.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC1;
      var inte1 = document.createElement('div');
      inte1.innerHTML = $scope.datos.PTR_VAL_INTE_DESC1;
      var urb1 = document.createElement('div');
      urb1.innerHTML = $scope.datos.PTR_VAL_URB_DESC1;
      var inmat1 = document.createElement('div');
      inmat1.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC1;
      var simb1 = document.createElement('div');
      simb1.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC1;      
      var tec2 = document.createElement('div');
      tec2.innerHTML = $scope.datos.PTR_VAL_TEC_DESC2;
      var his2 = document.createElement('div');
      his2.innerHTML = $scope.datos.PTR_VAL_HIS_DESC2;
      var art2 = document.createElement('div');
      art2.innerHTML = $scope.datos.PTR_VAL_ART_DESC2;
      var arq2 = document.createElement('div');
      arq2.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC2;
      var inte2 = document.createElement('div');
      inte2.innerHTML = $scope.datos.PTR_VAL_INTE_DESC2;
      var urb2 = document.createElement('div');
      urb2.innerHTML = $scope.datos.PTR_VAL_URB_DESC2;
      var inmat2 = document.createElement('div');
      inmat2.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC2;
      var simb2 = document.createElement('div');
      simb2.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC2; 
      var tec3 = document.createElement('div');
      tec3.innerHTML = $scope.datos.PTR_VAL_TEC_DESC3;
      var his3 = document.createElement('div');
      his3.innerHTML = $scope.datos.PTR_VAL_HIS_DESC3;
      var art3 = document.createElement('div');
      art3.innerHTML = $scope.datos.PTR_VAL_ART_DESC3;
      var arq3 = document.createElement('div');
      arq3.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC3;
      var inte3 = document.createElement('div');
      inte3.innerHTML = $scope.datos.PTR_VAL_INTE_DESC3;
      var urb3 = document.createElement('div');
      urb3.innerHTML = $scope.datos.PTR_VAL_URB_DESC3;
      var inmat3 = document.createElement('div');
      inmat3.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC3;
      var simb3 = document.createElement('div');
      simb3.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC3;
      var tec4 = document.createElement('div');
      tec4.innerHTML = $scope.datos.PTR_VAL_TEC_DESC4;
      var his4 = document.createElement('div');
      his4.innerHTML = $scope.datos.PTR_VAL_HIS_DESC4;
      var art4 = document.createElement('div');
      art4.innerHTML = $scope.datos.PTR_VAL_ART_DESC4;
      var arq4 = document.createElement('div');
      arq4.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC4;
      var inte4 = document.createElement('div');
      inte4.innerHTML = $scope.datos.PTR_VAL_INTE_DESC4;
      var urb4 = document.createElement('div');
      urb4.innerHTML = $scope.datos.PTR_VAL_URB_DESC4;
      var inmat4 = document.createElement('div');
      inmat4.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC4;
      var simb4 = document.createElement('div');
      simb4.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC4;
      var tec5 = document.createElement('div');
      tec5.innerHTML = $scope.datos.PTR_VAL_TEC_DESC5;
      var his5 = document.createElement('div');
      his5.innerHTML = $scope.datos.PTR_VAL_HIS_DESC5;
      var art5 = document.createElement('div');
      art5.innerHTML = $scope.datos.PTR_VAL_ART_DESC5;
      var arq5 = document.createElement('div');
      arq5.innerHTML = $scope.datos.PTR_VAL_ARQ_DESC5;
      var inte5 = document.createElement('div');
      inte5.innerHTML = $scope.datos.PTR_VAL_INTE_DESC5;
      var urb5 = document.createElement('div');
      urb5.innerHTML = $scope.datos.PTR_VAL_URB_DESC5;
      var inmat5 = document.createElement('div');
      inmat5.innerHTML = $scope.datos.PTR_VAL_INMAT_DESC5;
      var simb5 = document.createElement('div');
      simb5.innerHTML = $scope.datos.PTR_VAL_SIMB_DESC5;
      
      var header = function (data) {
        doc.addImage(material,'JPEG', 35, 40, 525, 60);
        doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(11);
        doc.text('FICHA DE CATALOGACIÓN DE BIENES INMUEBLES',80,120);
        doc.setFontSize(9);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_NUM_FIC,470,120);
        doc.rect(390, 105, 170, 25);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var footer = function (data) {
        var str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746 ", 150, doc.internal.pageSize.height - 40);
      };
      doc.setFontSize(9);
      if($scope.datos.PTR_CATEGORIA===undefined){
        $scope.datos.PTR_CATEGORIA=" ";
      }
      doc.setFontStyle('bold');      
      doc.text('IDENTIFICACIÓN',40,140);
      doc.autoTable(columns.splice(0,2), data, {drawHeaderRow: function() {return false;},startY: 150,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 160, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'}}});
      doc.rect(40, 150, 525, 60);
      doc.rect(40, doc.autoTableEndPosY() +30, 525, 80);
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('LOCALIZACIÓN',40,doc.autoTableEndPosY() +25);
      doc.autoTable(columns2.splice(0,4), data2,  {drawHeaderRow: function() {return false;},theme: 'plain',startY: doc.autoTableEndPosY() +35,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'},seg: {columnWidth: 170},ter: {columnWidth: 120,fontStyle: 'bold'},cuar: {columnWidth: 80}}});
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('FOTOGRAFÍA PRINCIPAL',340,doc.autoTableEndPosY() +20);
      doc.addImage(pic[0],'JPEG',290, doc.autoTableEndPosY() +30, 275 , 440);
      doc.setFontStyle('bold');
      doc.text('PLANO DE UBICACIÓN',70,doc.autoTableEndPosY() +20);
      doc.addImage(pic[1],'JPEG',40, doc.autoTableEndPosY() +30, 230 , 133);
      doc.setFontStyle('bold');
      doc.text('TIPOLOGÍA ARQUITECTÓNICA',70,doc.autoTableEndPosY() +173);
      doc.addImage(pic[2],'JPEG',40, doc.autoTableEndPosY() +183, 230 , 133);
      doc.setFontStyle('bold');
      doc.text('PERFÍL DE ACERA',70,doc.autoTableEndPosY() +326);
      doc.addImage(pic[3],'JPEG',40, doc.autoTableEndPosY() +336, 230 , 133);

      doc.setFontStyle('normal');
      doc.setFontSize(8);
      doc.text("Página 1 de 3", 470, doc.internal.pageSize.height - 40);
      doc.addPage();
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('DESCRIPCIÓN DEL INMUEBLE',40,140);
      doc.autoTable(columns3.splice(0,1), data3,  {drawHeaderRow: function() {return false;},
        theme: 'plain',startY: 150,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto'});
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('TIPO DE PROPIEDAD',40,doc.autoTableEndPosY() + 15);
      doc.autoTable(columns4.splice(0,1), data4,  {drawHeaderRow: function() {return false;},
        theme: 'plain',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto'});
      doc.rect(40, doc.autoTableEndPosY() +5, 525, 20);
      doc.autoTable(columns66.splice(0,4), data66, {drawHeaderRow: function() {return false;} ,
        startY: doc.autoTableEndPosY() + 10,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'},seg: {columnWidth: 170},ter: {columnWidth: 120,fontStyle: 'bold'},cuar: {columnWidth: 80}}});
      doc.rect(40, doc.autoTableEndPosY() +12, 525, 85);
      doc.autoTable(columns6.splice(0,4), data6, {drawHeaderRow: function() {return false;} ,
        startY: doc.autoTableEndPosY() +15,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'},seg: {columnWidth: 170},ter: {columnWidth: 120,fontStyle: 'bold'},cuar: {columnWidth: 80}}});
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('DATOS ORALES Y DOCUMENTALES',40,doc.autoTableEndPosY() +20);
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('FIGURA DE PROTECCIÓN LEGAL',40,doc.autoTableEndPosY() +35);
      doc.autoTable(columns67.splice(0,4), data67, {drawHeaderRow: function() {return false;} ,
        startY: doc.autoTableEndPosY() +45,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 140, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 120,fontStyle: 'bold'}}});

      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('ORALES',40,doc.autoTableEndPosY() +15);
      doc.setFontSize(8);
      doc.setFontStyle('normal');
      doc.text('AUTOR O CONSTRUCTOR:',60,doc.autoTableEndPosY() +30);
      doc.text($scope.datos.PTR_AUT_CON.toUpperCase(),240,doc.autoTableEndPosY() +30);
      doc.text('FECHA DE CONSTRUCCIÓN:',60,doc.autoTableEndPosY() +45);
      doc.text($scope.datos.PTR_FECH_CONS.toUpperCase(),240,doc.autoTableEndPosY() +45);
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('DOCUMENTALES',40,doc.autoTableEndPosY() +60);
      doc.setFontSize(8);
      doc.setFontStyle('normal');
      doc.text('AUTOR O CONSTRUCTOR:',60,doc.autoTableEndPosY() +75);
      doc.text($scope.datos.PTR_AUT_CONS.toUpperCase(),240,doc.autoTableEndPosY() +75);
      doc.text('FECHA DE CONSTRUCCIÓN:',60,doc.autoTableEndPosY() +90);
      doc.text($scope.datos.PTR_FEC_CONST_DOC.toUpperCase(),240,doc.autoTableEndPosY() +90);
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('REFERENCIAS HISTORICAS:',40,doc.autoTableEndPosY() +105);
      doc.setFontStyle('normal');
      doc.autoTable(columns7, data7,{drawHeaderRow: function() {return false;},theme: 'plain',startY: doc.autoTableEndPosY() +110,headerStyles: {rowHeight: 15, fontSize: 8, fontStyle:'bold'},bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 60, top: 140, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto',columnStyles: {uno: {columnWidth: 'wrap'}}});

      doc.setFontStyle('normal');
      doc.setFontSize(8);
      doc.text("Página 2 de 3", 470, doc.internal.pageSize.height - 40);
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      $('#visorFu object').attr('data',doc.output('datauristring'));
      $("#divPopup4").modal('show');
    })
    obj.error(function(error) {
      $.unblockUI();
    });
  };
 
  $scope.formlp = function(idfrcasos){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) { 
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var col = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"}
      ];
      var data = [
      {"prim":"Bien Cultural:","seg":$scope.datos.PTR_DEN.toUpperCase()},
      {"prim":"Tipo de Bien Cultural:","seg":$scope.datos.PTR_TB_CUL.toUpperCase()},
      {"prim":"Categoría de la declaratoria:","seg":$scope.datos.PTR_PROT_LEGAL.toUpperCase()},
      {"prim":"Norma Legal:","seg":$scope.datos.PTR_NIV_PROTEC.toUpperCase()},
      {"prim":"Número Legal:","seg":$scope.datos.PTR_NUM_PRLEGAL.toUpperCase()},
      {"prim":"Fecha de Programación:","seg":$scope.datos.PTR_FEC_PROG.toUpperCase()}
      ];
      var doc = new jsPDF('p', 'pt');

      var header = function (data) {
       doc.addImage(inmaterial,'JPEG', 35, 40, 525, 60);
         doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(11);
        doc.text('PATRIMONIO CULTURAL DE LA CIUDAD DE LA PAZ',40,120);
        doc.setFontSize(9);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_COD,470,120);
        doc.rect(390, 105, 170, 25);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var footer = function (data) {
        var str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text(str, 470, doc.internal.pageSize.height - 45);
        doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746", 150, doc.internal.pageSize.height - 45);
      };

      doc.autoTable(col.splice(0,2), data, {drawHeaderRow: function() {return false;},startY: 135,pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:8,valign:'middle'},margin:{horizontal:50,top:130,bottom:60},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'},columnStyles: {prim: {columnWidth: 'wrap',fontStyle: 'bold'}}
    });
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      //doc.save('pidmlp'+'.pdf');

        $('#visorFu object').attr('data',doc.output('datauristring'));
        $("#divPopup4").modal('show');
        //window.open(doc.output('datauristring'));

    });
    obj.error(function(error) {  
    });
  };
  $scope.inmaterial = function(idfrcasos){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=response.record[0].cas_nro_caso;
      $scope.dato = JSON.parse(response.record[0].cas_datos);
      var nro = $scope.dato.PTR_AREAS;
      if(nro == 8)
      {
        $scope.formlp(idfrcasos);

      }
      else{ 
        var reslocal = {
          "procedure_name":"ejecutartojson",
          "body":{
            "params": [
            {
              "name":"expression",

              "param_type":"IN","value":"select doc_datos, doc_url_logica,doc_correlativo, doc_nombre from dms_gt_documentos where doc_proceso = '"+ $scope.procesonro+"' and doc_estado = 'A' and doc_id ="+$scope.datos+" "
            }]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
        obj.success(function (respons) {
          $scope.url = JSON.parse(respons[0].ejecutartojson);
          var pic =[];
          var j=0;
          var k=0;
          var text1 = " ";
          var text2 = " ";
          pic[0] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
          pic[1] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
          if($scope.url == null){
              $scope.categoria(idfrcasos,nro,pic[0],pic[1]);            
          }
          else{
          for(var i=0;i<$scope.url.length ;i++){
            var a = $scope.url[i].doc_nombre;
            var imga = $scope.url[i].doc_url_logica;
            imga = imga.replace(/Ñ/gi,"%d1");
            imga = imga.replace(/ñ/gi,"%f1");
            imga = imga.replace(/Á/gi,"%c1");
            imga = imga.replace(/á/gi,"%e1");
            imga = imga.replace(/É/gi,"%c9");
            imga = imga.replace(/é/gi,"%e9");
            imga = imga.replace(/Í/gi,"%cd");
            imga = imga.replace(/í/gi,"%ed");
            imga = imga.replace(/Ó/gi,"%d3");
            imga = imga.replace(/ó/gi,"%f3");
            imga = imga.replace(/Ú/gi,"%da");
            imga = imga.replace(/ú/gi,"%fa");
            imga = imga.replace(/“/gi,"%93");
            imga = imga.replace(/”/gi,"%94");
            imga = imga.replace(/&/gi,"%26");
          imga = imga.replace(/\\/gi,"/");
            if($scope.url.length == i+1 && k==0){
              $scope.categoria(idfrcasos,nro,pic[0],pic[1]);
            }
            if($scope.url[i].doc_correlativo == 1){
              k++;
              var img = new Image();
              img.crossOrigin = 'Anonymous';
              img.src = imga;
              text1 = $scope.url[i].doc_datos;
              img.onload = function(){
                  var canvas = document.createElement('CANVAS');
                  var ctx = canvas.getContext('2d');
                  canvas.height = this.height;
                  canvas.width = this.width;
                  ctx.drawImage(this, 0, 0);
                  pic[0] = canvas.toDataURL("image/jpg",0.2);
                j++;
                if(j == 2 ){
                  $scope.categoria(idfrcasos,nro,pic[0],pic[1],text1,text2);
                }
              } 
              img.onerror = function(){
                sweet.show('Error de Carga de Imagen', a, 'error');
              }         
            }else if($scope.url[i].doc_correlativo == 2){
              k++;
              var img = new Image();
              img.crossOrigin = 'Anonymous';
              img.src = imga;
              text2 = $scope.url[i].doc_datos;
              img.onload = function(){
                  var canvas = document.createElement('CANVAS');
                  var ctx = canvas.getContext('2d');
                  canvas.height = this.height;
                  canvas.width = this.width;
                  ctx.drawImage(this, 0, 0);
                  pic[1] = canvas.toDataURL("image/jpg",0.2);
                j++;
                if(j == 2 ){
                  $scope.categoria(idfrcasos,nro,pic[0],pic[1],text1,text2);
                }
              }
              img.onerror = function(){
                sweet.show('Error de Carga de Imagen', a, 'error');
              } 
            }
          }
          }
        });
        obj.error(function(error) {
          console.log(error);
        });
      }
    });
    obj.error(function(error) {
      console.log(error);
    });
  };
  $scope.formper=function(idfrcasos,img1,img2,text1,text2){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) { 
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var colprim = [
      {title: "descripcion", dataKey: "des"}
      ];
      var obser1 = document.createElement('div');
      obser1.innerHTML = $scope.datos.PTR_CONTEX;      
      var funcion1 = document.createElement('div');
      funcion1.innerHTML = $scope.datos.PTR_CARACT; 
      var decoracion1 = document.createElement('div');
      decoracion1.innerHTML = $scope.datos.PTR_SIG_INTER;
      var descatri1 = document.createElement('div');
      descatri1.innerHTML = $scope.datos.PTR_DAT_HIS;
      var descest1 = document.createElement('div');
      descest1.innerHTML = $scope.datos.PTR_NARR_DEN;
      var tecnica1 = document.createElement('div');
      tecnica1.innerHTML = $scope.datos.PTR_DAT_COMP;
      var manufactura1 = document.createElement('div');
      manufactura1.innerHTML = $scope.datos.PTR_OTROS;
      var etim = document.createElement('div');
      etim.innerHTML = $scope.datos.PTR_ETIM;
      var proteccion='';
      for(var i=1; i<$scope.datos.PTR_NIV_PROTEC.length;i++){
        if($scope.datos.PTR_NIV_PROTEC[i].estado){
          if(proteccion!=''){
            proteccion=proteccion+', '+$scope.datos.PTR_NIV_PROTEC[i].resvalor;
          }
          else{
            proteccion=proteccion+$scope.datos.PTR_NIV_PROTEC[i].resvalor;
          }
        }
      }
      if($scope.datos.PTR_PROT_LEGAL ==-1)
        {$scope.datos.PTR_PROT_LEGAL =" ";} 
      if($scope.datos.PTR_INSTR_PRLEGAL ==-1)
        {$scope.datos.PTR_INSTR_PRLEGAL =" ";}
      var dataprim=[
      {"des":$scope.datos.PTR_EXPR.toUpperCase()},
      {"des":$scope.datos.PTR_DEN.toUpperCase()},
      {"des":etim.innerText.toUpperCase()},
      {"des":$scope.datos.PTR_PERIODO.toUpperCase()},
      {"des":$scope.datos.PTR_DIR.toUpperCase()},
      {"des":funcion1.innerText.toUpperCase()},    
      {"des":obser1.innerText.toUpperCase()}, 
      {"des":descatri1.innerText.toUpperCase()},
      {"des":decoracion1.innerText.toUpperCase()},   
      {"des":proteccion.toUpperCase()},
      {"des":$scope.datos.PTR_PROT_LEGAL.toUpperCase()},     
      {"des":$scope.datos.PTR_INSTR_PRLEGAL.toUpperCase() +' '+ $scope.datos.PTR_NUM_LEGAL.toUpperCase()},
      ];
      var colseg = [
      {title: "descripcion", dataKey: "des"}
      ];
      var dataseg=[ 
      {"des":$scope.datos.PTR_RESP_INF.toUpperCase()},     
      {"des":$scope.datos.PTR_RESP_FEC},
      {"des":tecnica1.innerText.toUpperCase()},
      {"des":manufactura1.innerText.toUpperCase()}
      ];
      var doc = new jsPDF('p', 'pt');
      var header = function (data) {
        doc.addImage(inmaterial,'JPEG', 35, 40, 525, 60);
         doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(11);
        doc.text('PERSONAJES RELACIONADOS CON EL PATRIMONIO CULTURAL',40,120);
        doc.setFontSize(9);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_COD,470,120);
        doc.rect(390, 105, 170, 25);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var numeropag = 0;
      var footer = function (data) {
        if(data.pageCount >= 1){
          numeropag = numeropag + 1;
        }
        var str = "Página " + numeropag;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text(str, 470, doc.internal.pageSize.height - 45);
        doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746", 150, doc.internal.pageSize.height - 45);
      };
      doc.setFontSize(9);
      doc.setTextColor(40);
      doc.setFontStyle('bold')
      doc.text('DATOS ORALES', 40, 135);
      doc.autoTable(colprim.splice(0,1), dataprim, {drawHeaderRow: function() {return false;},startY: 140,drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(9);
        if (row.index === 0) {          
            doc.setTextColor(0);
          doc.autoTableText("1. EXPRESIÓN CULTURAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }else if (row.index === 1) {          
            doc.setTextColor(0);
          doc.autoTableText("2. DENOMINACIÓN" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 2) {          
            doc.setTextColor(0);
          doc.autoTableText("3. ETIMOLOGÍA" , 40, row.y +15,{
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 3) {          
            doc.setTextColor(0);
          doc.autoTableText("4. ÉPOCA O AÑO DE ORIGEN" , 40,row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 4) {          
            doc.setTextColor(0);
          doc.autoTableText("5. LOCALIZACIÓN" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }
        else if (row.index === 5) {          
            doc.setTextColor(0);
          doc.autoTableText("6. CARACTERIZACIÓN DEL PERSONAJE" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }
        else if (row.index === 6) {

          doc.autoTableText("7. CONTEXTO SOCIO - CULTURAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }
        else if (row.index === 7) {          
            doc.setTextColor(0);
          doc.autoTableText("8. DESCRIPCIÓN DEL PERSONAJE" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 8) {          
            doc.setTextColor(0);
          doc.autoTableText("9. DATOS HISTÓRICOS " , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 9) {          
            doc.setTextColor(0);
          doc.autoTableText("10. SIGNIFICADO E INTERPRETACIÓN" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 10) {          
            doc.setTextColor(0);
          doc.autoTableText("11. NIVEL DE PROTECCIÓN LEGAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 11) {          
            doc.setTextColor(0);
          doc.autoTableText("12. ORGANO EMISOR DE PROTECCIÓN LEGAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }else if (row.index === 12) {          
            doc.setTextColor(0);
          doc.autoTableText("13. INSTRUMENTO DE PROTECCIÓN LEGAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }        
      },pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:8,valign:'middle'},margin:{horizontal:50,top:130,bottom:80},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'},
    });
      doc.setFontSize(9);
      doc.setTextColor(40);
      doc.setFontStyle('bold');
      if(doc.autoTableEndPosY()>600){
        doc.addPage();
        doc.text('14. IMAGENES', 40, 140);
        doc.addImage(img1,'JPEG', 50, 150, 200, 200);
        doc.addImage(img2,'JPEG', 290, 150, 200, 200);
        doc.text('14.1. DESCRIPCIÓN', 50, 360);  
        doc.text('14.2. DESCRIPCIÓN', 290, 360);
        doc.setFontStyle('normal');
        doc.setFontSize(8);
        doc.text(text1.toUpperCase(), 50, 370);  
        doc.text(text2.toUpperCase(), 290, 370);

        doc.autoTable(colseg.splice(0,1), dataseg, {drawHeaderRow: function() {return false;},startY:375,drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
          if  (row.index === 0) {           
            doc.setTextColor(0);
            doc.autoTableText("15.1.  RESPONSABLE DE LA INFORMACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }else if (row.index === 1) {

            doc.setTextColor(0);
            doc.autoTableText("15.2.  FECHA DE ELABORACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          } else if (row.index === 2) {

            doc.setTextColor(0);
            doc.autoTableText("16. FUENTES DE INFORMACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }
          else if (row.index === 3) {
            doc.setTextColor(0);
            doc.autoTableText("17. DATOS COMPLEMENTARIOS" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }
        },pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:7,valign:'middle'},margin:{horizontal:50,top:100,bottom:80},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'},
      });
      }
      else{
        doc.text('14. IMAGENES', 40, doc.autoTableEndPosY()+10);
        doc.addImage(img1,'JPEG', 50, doc.autoTableEndPosY()+20, 200, 200);
        doc.addImage(img2,'JPEG', 290, doc.autoTableEndPosY()+20, 200, 200);
        doc.text('14.1. DESCRIPCIÓN', 50, doc.autoTableEndPosY()+230);  
        doc.text('14.2. DESCRIPCIÓN', 290, doc.autoTableEndPosY()+230);
        doc.setFontStyle('normal');
        doc.text(text1.toUpperCase(), 50, doc.autoTableEndPosY()+240);  
        doc.text(text2.toUpperCase(), 290, doc.autoTableEndPosY()+240);

        doc.autoTable(colseg.splice(0,1), dataseg, {drawHeaderRow: function() {return false;},startY:doc.autoTableEndPosY()+250,drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(9);
          if  (row.index === 0) {           
            doc.autoTableText("15.1.  RESPONSABLE DE LA INFORMACIÓN " , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }else if (row.index === 1) {
            doc.setTextColor(0);
            doc.autoTableText("15.2.  FECHA DE ELABORACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          } else if (row.index === 2) {
            doc.setTextColor(0);
            doc.autoTableText("16. FUENTES DE INFORMACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }
          else if (row.index === 3) {
            doc.setTextColor(0);
            doc.autoTableText("17. DATOS COMPLEMENTARIOS" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }

        },pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:8,valign:'middle'},margin:{horizontal:50,top:120,bottom:80},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'}});    
      }
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      //doc.save('inmaterial'+'.pdf');

        $('#visorFu object').attr('data',doc.output('datauristring'));
        $("#divPopup4").modal('show');
        //window.open(doc.output('datauristring'));

    })
    obj.error(function(error) {
      $.unblockUI();   

    });
  };
  $scope.formgen=function(idfrcasos,tulo,numero,img1,img2,text1,text2){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) { 
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var doc = new jsPDF('p', 'pt');
      var colprim = [
      {title: "descripcion", dataKey: "des"}
      ];
      var obser1 = document.createElement('div');
      obser1.innerHTML = $scope.datos.PTR_CONTEX;      
      var funcion1 = document.createElement('div');
      funcion1.innerHTML = $scope.datos.PTR_CARACT; 
      var decoracion1 = document.createElement('div');
      decoracion1.innerHTML = $scope.datos.PTR_SIG_INTER;
      var descatri1 = document.createElement('div');
      descatri1.innerHTML = $scope.datos.PTR_DAT_HIS;
      var descest1 = document.createElement('div');
      descest1.innerHTML = $scope.datos.PTR_NARR_DEN;
      var tecnica1 = document.createElement('div');
      tecnica1.innerHTML = $scope.datos.PTR_DAT_COMP;
      var manufactura1 = document.createElement('div');
      manufactura1.innerHTML = $scope.datos.PTR_OTROS;
      var etim = document.createElement('div');
      etim.innerHTML = $scope.datos.PTR_ETIM; 
      var proteccion='';
      for(var i=1; i<$scope.datos.PTR_NIV_PROTEC.length;i++){
        if($scope.datos.PTR_NIV_PROTEC[i].estado){
          if(proteccion!=''){
            proteccion=proteccion+', '+$scope.datos.PTR_NIV_PROTEC[i].resvalor;
          }
          else{
            proteccion=proteccion+$scope.datos.PTR_NIV_PROTEC[i].resvalor;
          }
        }
      }
      if($scope.datos.PTR_PROT_LEGAL ==-1)
        {$scope.datos.PTR_PROT_LEGAL =" ";} 
      if($scope.datos.PTR_INSTR_PRLEGAL ==-1)
        {$scope.datos.PTR_INSTR_PRLEGAL =" ";} 
      var dataprim=[
      {"des":$scope.datos.PTR_EXPR.toUpperCase()},
      {"des":$scope.datos.PTR_DEN},
      {"des":etim.innerText.toUpperCase()},
      {"des":$scope.datos.PTR_PERIODO},
      {"des":$scope.datos.PTR_DEP+'- '+$scope.datos.PTR_PROV+' '+$scope.datos.PTR_ZONA+' '+$scope.datos.PTR_DIR},
      {"des":funcion1.outerText.toUpperCase()},    
      {"des":obser1.outerText.toUpperCase()}, 
      {"des":descest1.outerText.toUpperCase()},
      {"des":descatri1.outerText.toUpperCase()},
      {"des":decoracion1.outerText.toUpperCase()},   
      {"des":proteccion.toUpperCase()},
      {"des":$scope.datos.PTR_PROT_LEGAL.toUpperCase()},     
      {"des":$scope.datos.PTR_INSTR_PRLEGAL.toUpperCase()+' '+ $scope.datos.PTR_NUM_LEGAL.toUpperCase()},
      ];
      var colseg = [
      {title: "descripcion", dataKey: "des"}
      ];
      var dataseg=[ 
      {"des":$scope.datos.PTR_RESP_INF},     
      {"des":$scope.datos.PTR_RESP_FEC},
      {"des":tecnica1.outerText.toUpperCase()},
      {"des":manufactura1.outerText.toUpperCase()}
      ];
      var textos = doc.splitTextToSize(tulo, 800, {halign: 'center',valign: 'middle'});
      var header = function (data) {
        doc.addImage(inmaterial,'JPEG', 35, 40, 525, 60);
        doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(11);
        doc.text(textos,40,120);
        doc.setFontSize(9);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_COD,470,120);
        doc.rect(390, 105, 170, 25);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var numeropag = 0;
      var footer = function (data) {
        if(data.pageCount >= numeropag){
          numeropag = numeropag + 1;
        }
        var str = "Página " + numeropag;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text(str, 470, doc.internal.pageSize.height - 45);
          doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746", 150, doc.internal.pageSize.height - 45);
      };
      doc.setFontSize(9);
      doc.setTextColor(40);
      doc.setFontStyle('bold')
      doc.text('DATOS ORALES', 40, 155);
      doc.autoTable(colprim.splice(0,1), dataprim, {drawHeaderRow: function() {return false;},startY: 160,drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(9);
        if (row.index === 0) {
          doc.autoTableText("1. EXPRESIÓN CULTURAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }else if (row.index === 1) {          
            doc.setTextColor(0);
          doc.autoTableText("2. DENOMINACIÓN" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 2) {
          doc.autoTableText("3. ETIMOLOGÍA" , 40, row.y +15,{
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 3) {          
            doc.setTextColor(0);
          doc.autoTableText("4. ÉPOCA O AÑO DE ORIGEN" , 40,row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 4) {
          doc.autoTableText("5. LOCALIZACIÓN" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }
        else if (row.index === 5) {          
            doc.setTextColor(0);
          doc.autoTableText("6. CARACTERIZACIÓN DE LA EXPRESIÓN CULTURAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }
        else if (row.index === 6) {          
          doc.setTextColor(0);
          doc.autoTableText("7. CONTEXTO SOCIO - CULTURAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }
        else if (row.index === 7) {          
          doc.setTextColor(0);
          doc.autoTableText("8. NARRACIÓN DE LA DENOMINACIÓN" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 8) {          
            doc.setTextColor(0);
          doc.autoTableText("9. DATOS HISTÓRICOS " , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 9) {          
            doc.setTextColor(0);
          doc.autoTableText("10. SIGNIFICADO E INTERPRETACIÓN" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 10) {          
            doc.setTextColor(0);
          doc.autoTableText("11. NIVEL DE PROTECCION LEGAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 11) {          
            doc.setTextColor(0);
          doc.autoTableText("12. ORGANO EMISOR DE PROTECCIÓN LEGAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }else if (row.index === 12) {          
            doc.setTextColor(0);
          doc.autoTableText("13. INSTRUMENTO DE PROTECCIÓN LEGAL" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }        
      },pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:8,valign:'top'},margin:{horizontal:50,top:150,bottom:80},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'},
    });
      doc.setFontSize(9);
      doc.setTextColor(40);
      doc.setFontStyle('bold');
      if(doc.autoTableEndPosY()>600){
        doc.addPage();
        doc.text('14. IMAGENES', 40, 140);
        doc.addImage(img1,'JPEG', 50, 150, 200, 200);
        doc.addImage(img2,'JPEG', 290, 150, 200, 200);
        doc.text('14.1. DESCRIPCIÓN', 40, 360);  
        doc.text('14.2. DESCRIPCIÓN', 280, 360);
        doc.setFontStyle('normal');
        doc.setFontSize(8);
        if(text1 == undefined)
          text1 = " ";

        if(text2 == undefined)
          text2 = " ";
        doc.text(text1, 50, 370);  
        doc.text(text2, 290, 370);
        doc.autoTable(colseg.splice(0,1), dataseg, {drawHeaderRow: function() {return false;},startY:375,drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(9);
          if  (row.index === 0) {             
            doc.setTextColor(0);        
            doc.autoTableText("15.1.  RESPONSABLE DE LA INFORMACIÓN " , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }else if (row.index === 1) {
            doc.setTextColor(0);
            doc.autoTableText("15.2.  FECHA DE ELABORACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          } else if (row.index === 2) {
            doc.setTextColor(0);
            doc.autoTableText("16. DATOS COMPLEMENTARIOS" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }
          else if (row.index === 3) {
            doc.setTextColor(0);
            doc.autoTableText("17. FUENTES DE INFORMACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }

        },pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:8,valign:'top'},margin:{horizontal:50,top:140,bottom:80},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'},
        });
      }
      else{
        doc.text('14. IMAGENES', 40, doc.autoTableEndPosY()+10);
        if(img1===""){

        }
        else{
          doc.addImage(img1,'JPEG', 50, doc.autoTableEndPosY()+20, 200, 200);
          doc.addImage(img2,'JPEG', 290, doc.autoTableEndPosY()+20, 200, 200);
        }
          doc.text('14.1. DESCRIPCIÓN', 50, doc.autoTableEndPosY()+230);  
          doc.text('14.2. DESCRIPCIÓN', 290, doc.autoTableEndPosY()+230);
          doc.setFontStyle('normal');
          if(text1 == undefined)
            text1 = " ";
          else
            text1 = text1.toUpperCase();
          if(text2 == undefined)
            text2 = " ";
          else
            text2 = text2.toUpperCase();
          doc.text(text1, 50, doc.autoTableEndPosY()+240);  
          doc.text(text2, 290, doc.autoTableEndPosY()+240);
        
        doc.autoTable(colseg.splice(0,1), dataseg, {drawHeaderRow: function() {return false;},startY:doc.autoTableEndPosY()+250,drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(9);
          if  (row.index === 0) {           
            doc.autoTableText("15.1.  RESPONSABLE DE LA INFORMACIÓN " , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }else if (row.index === 1) {

            doc.autoTableText("15.2.  FECHA DE ELABORACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          } else if (row.index === 2) {

            doc.autoTableText("16. DATOS COMPLEMENTARIOS" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }
          else if (row.index === 3) {

            doc.autoTableText("17. FUENTES DE INFORMACIÓN" , 40, row.y +15, {
              halign: 'left',
              valign: 'middle'
            });
            data.cursor.y += 20;
          }

        },pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:8,valign:'top'},margin:{horizontal:50,top:150,bottom:80},beforePageContent: header,afterPageContent: footer,styles: {overflow:'linebreak'}});    
      }
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      //doc.save('inmaterial'+'.pdf');

        $('#visorFu object').attr('data',doc.output('datauristring'));
        $("#divPopup4").modal('show');
        //window.open(doc.output('datauristring'));

    })
    obj.error(function(error) {
      $.unblockUI();  
    });
  };
  $scope.categoria=function(idfrcasos,numero,img1,img2,text1,text2){
    switch (numero){
      case '1':
      $scope.formgen(idfrcasos,'ÁMBITO I TRADICIONES Y EXPRESIONES ORALES, INCLUIDO EL IDIOMA COMO VEHÍCULO DEL PATRIMONIO CULTURAL INMATERIAL',numero,img1,img2,text1,text2);
      break;
      case '2':
      $scope.formgen(idfrcasos,'ÁMBITO II ARTES DEL ESPECTÁCULO',numero,img1,img2,text1,text2);    
      break;
      case '3':
      $scope.formgen(idfrcasos,'ÁMBITO III USOS SOCIALES, RITUALES Y ACTOS FESTIVOS',numero,img1,img2,text1,text2);
      break;
      case '4':
      $scope.formgen(idfrcasos,'ÁMBITO IV CONOCIMIENTOS Y USOS RELACIONADOS CON LA NATURALEZA Y EL UNIVERSO',numero,img1,img2,text1,text2);
      break;
      case '5':
      $scope.formgen(idfrcasos,'ÁMBITO V TÉCNICAS ARTESANALES TRADICIONALES',numero,img1,img2,text1,text2);
      break;
      case '7':
      $scope.formper(idfrcasos,img1,img2,text1,text2);
      break;
      default: console.log("se fue al default",numero);
    }
   
  };
  $scope.monumento = function(idfrcasos){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=response.record[0].cas_nro_caso;
      var reslocal = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select doc_datos, doc_url_logica,doc_correlativo, doc_nombre from dms_gt_documentos where doc_proceso = '"+ $scope.procesonro+"' and doc_estado = 'A' and doc_id ="+$scope.datos+" "
          }
          ]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (respons) {
        $scope.url = JSON.parse(respons[0].ejecutartojson);
        var pic =[];
        var j=0;
        var k=0;
        var n= 4;
        pic[0] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[1] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[2] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[3] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        if($scope.url == null){
                $scope.fichamonumento2(idfrcasos,pic[0],pic[1],pic[2],pic[3])           
          }
          else{
        for(var i=0;i<$scope.url.length ;i++){
          var a = $scope.url[i].doc_nombre;
          var imga = $scope.url[i].doc_url_logica;          
          imga = imga.replace(/Ñ/gi,"%d1");
          imga = imga.replace(/ñ/gi,"%f1");
          imga = imga.replace(/Á/gi,"%c1");
          imga = imga.replace(/á/gi,"%e1");
          imga = imga.replace(/É/gi,"%c9");
          imga = imga.replace(/é/gi,"%e9");
          imga = imga.replace(/Í/gi,"%cd");
          imga = imga.replace(/í/gi,"%ed");
          imga = imga.replace(/Ó/gi,"%d3");
          imga = imga.replace(/ó/gi,"%f3");
          imga = imga.replace(/Ú/gi,"%da");
          imga = imga.replace(/ú/gi,"%fa");
          imga = imga.replace(/“/gi,"%93");
          imga = imga.replace(/”/gi,"%94");
          imga = imga.replace(/&/gi,"%26");
          imga = imga.replace(/\\/gi,"/");
          if($scope.url[i].doc_correlativo == 1){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                pic[0] = canvas.toDataURL("image/jpeg",0.5);
              j++;
              if(j == n ){
                $scope.fichamonumento2(idfrcasos,pic[0],pic[1],pic[2],pic[3])
              }
            } 
            img.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            }          
          }else if($scope.url[i].doc_correlativo == 2){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                pic[1] = canvas.toDataURL("image/jpeg",0.5);
              j++;
              if(j == n ){
                $scope.fichamonumento2(idfrcasos,pic[0],pic[1],pic[2],pic[3])
              }
            }
            img.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            } 
          }else if($scope.url[i].doc_correlativo == 3){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                pic[2] = canvas.toDataURL("image/jpeg",0.5);
              j++;
              if(j == n ){
                $scope.fichamonumento2(idfrcasos,pic[0],pic[1],pic[2],pic[3])
              }
            }
          }else if($scope.url[i].doc_correlativo == 4){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                pic[3] = canvas.toDataURL("image/jpeg",0.5);
              j++;
              if(j == n ){
                $scope.fichamonumento2(idfrcasos,pic[0],pic[1],pic[2],pic[3])
              }
            }
            img.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            } 
          }
          if($scope.url.length == i+1 && k==0){
            $scope.fichamonumento2(idfrcasos,pic[0],pic[1],pic[2],pic[3]);
          }
          if($scope.url.length == i+1){
            n=k;
          }
        };
      }
      })
      obj.error(function(error) {
        console.log(error);
      });
    })
    obj.error(function(error) {
      console.log(error);
    });
  };
  $scope.fichamonumento2=function(casid,frente,perfil,pedestal,plano){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+casid
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
      obj.success(function (response) {
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var columns = [
      {title: "titulo", dataKey: "tit"},
      {title: "descripcion", dataKey: "des"}
      ];
      var data=[
      {"tit":"DENOMINACIÓN:","des":$scope.datos.PTR_NOMBRE},
      {"tit":"EPOCA:","des": $scope.datos.PTR_EPOCA}
      ];
      var columns2 = [
      {title: "titulo", dataKey: "tit"},
      {title: "descripcion", dataKey: "des"}
      ];
      var autor1 = document.createElement('div');
      autor1.innerHTML = $scope.datos.PTR_AU; 
      var obra1 = document.createElement('div');
      obra1.innerHTML = $scope.datos.PTR_DESC_OBRA; 
      var fuente1 = document.createElement('div');
      fuente1.innerHTML = $scope.datos.PTR_FUENT_BIBLIO; 
      var descripcion1 = document.createElement('div');
      descripcion1.innerHTML = $scope.datos.PTR_DES_PER; 
      var referencia1 = document.createElement('div');
      referencia1.innerHTML = $scope.datos.PTR_REF_HIST; 
      if($scope.datos.PTR_MACRO ==-1)
        {$scope.datos.PTR_MACRO =" ";}
      if($scope.datos.PTR_EST_CON ==-1)
        {$scope.datos.PTR_EST_CON =" ";}
      var tradicional='';
      for(var i=0; i<3;i++){
        if($scope.datos.PTR_CONJ_ESC[i].estado){
          if(tradicional!=''){
            tradicional=tradicional+', '+$scope.datos.PTR_CONJ_ESC[i].resvalor;
          }
          else{
            tradicional=tradicional+$scope.datos.PTR_CONJ_ESC[i].resvalor;
          }
        }
      }
      var data2=[
        {"tit":"PAÍS:","des":$scope.datos.PTR_PAIS.toUpperCase()},
        {"tit":"DEPARTAMENTO:","des":$scope.datos.PTR_DEP.toUpperCase()},
        {"tit":"MUNICIPIO:","des":$scope.datos.PTR_MUNI.toUpperCase()},
        {"tit":"PROVINCIA:","des":$scope.datos.PTR_PROV.toUpperCase()},
        {"tit":"MACRODISTRITO:","des":$scope.datos.PTR_MACRO.toUpperCase()},
        {"tit":"ZONA:","des":$scope.datos.PTR_ZONA.toUpperCase()},
        {"tit":"COMUNIDAD:","des":$scope.datos.PTR_COMU.toUpperCase()},
        {"tit":"DIRECCIÓN:","des":$scope.datos.PTR_DIR.toUpperCase()},
        {"tit":"DATOS DEL AUTOR:","des":autor1.innerText.toUpperCase()},
        {"tit":"ESPECIALIDAD:","des":$scope.datos.PTR_ESP.toUpperCase()},
        {"tit":"TÉCNICA Y MATERIAL:","des":$scope.datos.PTR_TEC_MAT.toUpperCase()},
        {"tit":"PIEZA ESCULTÓRICA","des":tradicional.toUpperCase()},
        {"tit":"ALTO:","des":$scope.datos.PTR_ALTO.toUpperCase()},
        {"tit":"ANCHO","des":$scope.datos.PTR_ANCHO.toUpperCase()},
        {"tit":"PESO:","des":$scope.datos.PTR_PESO.toUpperCase()},
        {"tit":"DESCRIPCIÓN DE LA OBRA:","des":obra1.innerText.toUpperCase()},
        {"tit":"ORIGEN DE LA PIEZA:","des":$scope.datos.PTR_ORG_PIE.toUpperCase()},
        {"tit":"NOMBRE DEL PROPIETARIO:","des":$scope.datos.PTR_PROP.toUpperCase()},
        {"tit":"RESPONSABLES:","des": $scope.datos.PTR_RESP.toUpperCase()},
        {"tit":"TIPO:","des": $scope.datos.PTR_TIPO.toUpperCase()},
        {"tit":"NRO. LEY U ORDENANZA MUNICIPAL:","des": $scope.datos.PTR_LEY_OR.toUpperCase()},
        {"tit":"DESCRIPCIÓN DEL PERSONAJE O MOTIVO:","des":descripcion1.innerText.toUpperCase()},
        {"tit":"REFERENCIAS HISTÓRICAS DE LA OBRA:","des": referencia1.innerText.toUpperCase()},
        {"tit":"ESTADO DE CONSERVACIÓN:","des":$scope.datos.PTR_EST_CON.toUpperCase()},
        {"tit":"OBSERVACIONES:","des":$scope.datos.PTR_OBS.toUpperCase()},
        {"tit":"FUENTES:","des":fuente1.innerText.toUpperCase()}
      ];
      var doc = new jsPDF('p', 'pt');
      var header = function (data) {
        doc.addImage(inmaterial,'JPEG', 35, 40, 525, 60);
        doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(11);
        doc.text('FICHA DE REGISTRO DE ESCULTURAS',120,120);
        doc.setFontSize(9);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_NRO_FIC,470,120);
        doc.rect(390, 105, 170, 25);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var numeropag = 0;
      var footer = function (data) {
        if(data.pageCount >= numeropag){
          numeropag = numeropag + 1;
        }
        var str = "Página " + numeropag;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text(str, 470, doc.internal.pageSize.height - 45);
          doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746", 150, doc.internal.pageSize.height - 45);
      };
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.autoTable(columns.splice(0,2),data,{drawHeaderRow:function(){return false;},startY:130,pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:8,valign:'middle'},margin:{horizontal:40,top:130,bottom:80},styles:{overflow:'linebreak'},columnStyles:{tit:{columnWidth:150,fontStyle:'bold'}}
    });
      doc.setFontSize(8);
       doc.text('FOTOGRAFIAS', 45,doc.autoTableEndPosY()+10);
      doc.text('FOTOGRAFIÁ FRENTE', 100,doc.autoTableEndPosY()+25);
      doc.addImage(frente, 'JPEG',60, doc.autoTableEndPosY()+30, 200, 190);
      doc.rect(60, doc.autoTableEndPosY()+30, 200, 190);
      doc.text('FOTOGRAFIÁ PERFIL', 340,doc.autoTableEndPosY()+25);
      doc.addImage(perfil, 'JPEG',300, doc.autoTableEndPosY()+30, 200, 190);
      doc.rect(300, doc.autoTableEndPosY()+30, 200, 190);
      doc.text('FOTOGRAFIÁ INCLUYENDO EL PEDESTAL Y PLACAS', 60,doc.autoTableEndPosY()+235);
      doc.addImage(pedestal, 'JPEG',60, doc.autoTableEndPosY()+240, 200, 190);
      doc.rect(60, doc.autoTableEndPosY()+240, 200, 190);
      doc.text('PLANO DE UBICACIÓN', 340,doc.autoTableEndPosY()+235);
      doc.addImage(plano, 'JPEG',300, doc.autoTableEndPosY()+240, 200, 190);
      doc.rect(300, doc.autoTableEndPosY()+240, 200, 190);
      doc.autoTable(columns2.splice(0,2), data2, {drawHeaderRow: function() {return false;},startY: doc.autoTableEndPosY()+440,pageBreak: 'auto',theme: 'mary',beforePageContent: header,afterPageContent: footer,bodyStyles: {rowHeight: 16, fontSize: 8, valign: 'top'},margin: {horizontal: 50, top: 135, bottom: 70},styles: {overflow: 'linebreak'},columnStyles: {tit: {columnWidth: 150,fontStyle: 'bold'}},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {
          doc.autoTableText("I. LOCALIZACIÓN", 40, row.y + 10, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 7) {

          doc.autoTableText("II. DATOS DEL AUTOR" , 40, row.y + 10, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        }  else if (row.index === 8) {

          doc.autoTableText("III. DATOS DE LA OBRA" , 40, row.y  + 10, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 11) {

          doc.autoTableText("IV. DIMENCIONES DE LA OBRAA (SIN PEDESTAL)" , 40, row.y + 10, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 16) {

          doc.autoTableText("V. REGIMEN DE PROPIEDAD" , 40, row.y  + 10, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }   else if (row.index === 18) {

          doc.autoTableText("VI. PROTECCIÓN LEGAL" , 40, row.y  + 10, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 20) {

          doc.autoTableText("VII. REFERENCIAS DE LA OBRA" , 40, row.y  + 10, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 22) {

          doc.autoTableText("VIII. ESTADO DE CONSERVACIÒN" , 40, row.y  + 10, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }
      }});
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      $('#visorFu object').attr('data',doc.output('datauristring'));
      $("#divPopup4").modal('show');
    })
    obj.error(function(error) {

    });
  };
  $scope.arqueologia=function(hola){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+hola
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var nro = $scope.datos.PTR_ARQ;
        $scope.ficha(hola,nro);
    });
    obj.error(function(error) {
    });  
  };
  $scope.ejemplo1=function(hola,mapa){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+hola
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {    
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var vector='';
      for(var i=0; i<9;i++){
        if($scope.datos.PTR_CRONO[i].estado){
          if(vector!=''){
            vector=vector+', '+$scope.datos.PTR_CRONO[i].resvalor;
          }
          else{
            vector=vector+$scope.datos.PTR_CRONO[i].resvalor;
          }
        }
      }
      var relbien1 = document.createElement('div');
      relbien1.innerHTML = $scope.datos.PTR_RELACION;

      var proviene = '';
      if($scope.datos.PTR_PROVIENE_C==='1'){
        proviene='CONTEXTO ARQUEOLÓGICO';
        var colprov = [
        {title: "Número", dataKey: "dos"},
        {title: "Coordenadas", dataKey: "tres"}
        ];
        var dataprov=[];
        for (var i=1; i<$scope.datos.PTR_UBIC_ANT.length;i++){
          var aporte = {"dos":$scope.datos.PTR_UBIC_ANT[i].f01_punto_des_,"tres":$scope.datos.PTR_UBIC_ANT[i].f01_veg_SFL_};          
          dataprov[i]=aporte;      
        }
      }
      else{
        if($scope.datos.PTR_PROVIENE_C==='3'){
          proviene=$scope.datos.PTR_PROVIENE;
        }
        else{
          proviene='COLECCIÓN';
        }
      }
      var columns = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      ];
      var data = [
      {"prim":"DENOMINACIÓN:","seg":proviene.toUpperCase()},
      {"prim":"CREADOR:","seg":$scope.datos.PTR_CREA}
      ];
      var colubic = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"}
      ];
      var dataubic = [
      {"prim":"UBICACIÓN ACTUAL:","seg":$scope.datos.PTR_UBIC_ACT.toUpperCase()},
      {"prim":"RELACION DEL BIEN O PIEZA CON EL YACIMIENTO:","seg":relbien1.innerText.toUpperCase()}
      ];
      var colbien = [
      {title: "primero", dataKey: "prim"}
      ];
      var databien = [
      {"prim":$scope.datos.PTR_DESC_BIEN.toUpperCase()}
      ];
      var colmat = [
      {title: "primero", dataKey: "prim"}
      ];
      var datamat = [
      {"prim":$scope.datos.PTR_MATERIAL.toUpperCase()}
      ];
      var coltec = [
      {title: "primero", dataKey: "prim"}
      ];
      var datatec = [
      {"prim":$scope.datos.PTR_TECN.toUpperCase()}
      ];  
      var colmanu = [
      {title: "primero", dataKey: "prim"}
      ];
      var datamanu = [
      {"prim":$scope.datos.PTR_MANF.toUpperCase()}    
      ];
      var coldeco = [
      {title: "primero", dataKey: "prim"}
      ];
      var datadeco = [
      {"prim":$scope.datos.PTR_DECOR.toUpperCase()}   
      ];
      var colatri = [
      {title: "primero", dataKey: "prim"}
      ];
      var dataatri = [
      {"prim":$scope.datos.PTR_ATRIB.toUpperCase()}    
      ];
      var coldown = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"}
      ];
      if($scope.datos.PTR_EST_CONS ==-1)
        {$scope.datos.PTR_EST_CONS =" ";} 
      var datadown = [
      {"prim":"ESTADO DE CONSERVACIÓN:","seg":$scope.datos.PTR_EST_CONS.toUpperCase()},
      {"prim":"DESCRIPCIÓN DEL ESTADO:","seg":$scope.datos.PTR_DESC_ESTADO.toUpperCase()},
      {"prim":"OBSERVACIONES:","seg":$scope.datos.PTR_OBS.toUpperCase()},
      {"prim":"CRONOLOGÍA:","seg":vector.toUpperCase()},
      {"prim":"FUNCIÓN:","seg":$scope.datos.PTR_FUNC.toUpperCase()},
      {"prim":"OBSERVACIONES:","seg":$scope.datos.PTR_OBS_FUNC.toUpperCase()}          
      ]; 

      var doc = new jsPDF('p', 'pt');
      var columnsLong = columns;
      var header = function (data) {
       doc.addImage(material,'JPEG', 35, 40, 525, 60);
        doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(11);
        doc.text('FICHA DE CATALOGACIÓN DE MUEBLES ARQUEOLOGICOS',60,120);
        doc.setFontSize(9);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_COD,470,120);
        doc.rect(390, 105, 170, 25);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var numeropag = 0;
      var footer = function (data) {
        if(data.pageCount >= numeropag){
          numeropag = numeropag + 1;
        }
        var str = "Página " + numeropag;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text(str, 470, doc.internal.pageSize.height - 45);
          doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746", 150, doc.internal.pageSize.height - 45);
      };
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('INFORMACIÓN GENERAL',40,140);
      doc.autoTable(columns.splice(0,4), data, {drawHeaderRow: function() {return false;} , startY: 155, pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 160,fontStyle: 'bold',fontSize: 9}}
      });
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('CONTEXTO ORIGINAL:',40,doc.autoTableEndPosY() +20);
      var m=doc.autoTableEndPosY()+30;
      if($scope.datos.PTR_PROVIENE_C==='1'){
        doc.setFontSize(9);
        doc.setFontStyle('bold');
        doc.text('UBICACIÓN GEOGRAFICA UTM',40,m+5);
        doc.autoTable(colprov, dataprov,{theme: 'mary',startY: m+10,headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto'});
        m=doc.autoTableEndPosY()+15;
      }

      doc.autoTable(colubic.splice(0,2), dataubic,{drawHeaderRow: function() {return false;},
        theme: 'mary',startY: m,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto',columnStyles: {prim: {columnWidth: 160,fontStyle: 'bold'}}
      });
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('DESCRIPCIÓN DEL BIEN MUEBLE',40,doc.autoTableEndPosY() +15);
      doc.autoTable(colbien.splice(0,1), databien,{drawHeaderRow: function() {return false;},theme: 'mary',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto',});
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('MATERIAL',40,doc.autoTableEndPosY() +15);
      doc.autoTable(colmat.splice(0,1), datamat,{drawHeaderRow: function() {return false;},
        theme: 'mary',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto',
      });
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('TECNICA',40,doc.autoTableEndPosY() +15);
      doc.autoTable(coltec.splice(0,1), datatec,{drawHeaderRow: function() {return false;},
        theme: 'mary',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto',
      });
      doc.setFontSize(9);
      doc.setFontStyle('bold');;
      doc.text('MANUFACTURA',40,doc.autoTableEndPosY() +15);
      doc.autoTable(colmanu.splice(0,1), datamanu,{drawHeaderRow: function() {return false;},
        theme: 'mary',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto',
      });
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('DECORACIÓN',40,doc.autoTableEndPosY() +15);
      doc.autoTable(coldeco.splice(0,1), datadeco,{drawHeaderRow: function() {return false;},
        theme: 'mary',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto',
      });
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('DESCRIPCIÓN DE LOS ATRIBUTOS',40,doc.autoTableEndPosY() +15);
      doc.autoTable(colatri.splice(0,1), dataatri,{drawHeaderRow: function() {return false;},
        theme: 'mary',startY: doc.autoTableEndPosY() +20,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'}, pageBreak: 'auto',
      });
      doc.autoTable(coldown.splice(0,4), datadown, {drawHeaderRow: function() {return false;} ,
        startY:doc.autoTableEndPosY() +10, pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 35, top: 110, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 160,fontStyle: 'bold',fontSize: 9}}
      });
      doc.addPage(790, 591);
      doc.addImage(material,'JPEG', 35, 35, 725, 60);
      doc.setTextColor(0);
      doc.setFontStyle('bold');
      doc.setFontSize(11);
      doc.text('FICHA DE CATALOGACIÓN DE MUEBLES ARQUEOLOGICOS',40,110);
      doc.text('NRO. FICHA: ',600,120);
      doc.setFontStyle('normal');
      doc.text($scope.datos.PTR_COD,670,120);
      doc.rect(590, 105, 170, 25);
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('UBICACIÓN:',40,130);
      doc.addImage(mapa,'JPEG', 40, 140, 700, 420);
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      $scope.visorf(doc.output('datauristring'));
    })
    obj.error(function(error) {
    });
  };
  $scope.visorf = function(st){
    $('#visorFu object').attr('data',st);
    $("#divPopup4").modal('show'); 
        //window.open(doc.output('datauristring'));
  }
  $scope.ejemplo2=function(hola,mapa){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+hola
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {    
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var vector='';
      for(var i=0; i<$scope.datos.PTR_IA_EST_CONS.length;i++){
        if($scope.datos.PTR_IA_EST_CONS[i].estado){
          if(vector!=''){
            vector=vector+', '+$scope.datos.PTR_IA_EST_CONS[i].resvalor;
          }
          else{
            vector=vector+$scope.datos.PTR_IA_EST_CONS[i].resvalor;
          }
        }
      }
      var tafo='';
      for(var i=0; i<$scope.datos.PTR_IA_TAFON.length ;i++){
        if($scope.datos.PTR_IA_TAFON[i].estado){
          if(tafo!=''){
            tafo=tafo+', '+$scope.datos.PTR_IA_TAFON[i].resvalor;
          }
          else{
            tafo=tafo+$scope.datos.PTR_IA_TAFON[i].resvalor;
          }
        }
      }
      var elemento='';
      for(var i=0; i<$scope.datos.PTR_IA_ELEM_MUEBLE.length;i++){
        if($scope.datos.PTR_IA_ELEM_MUEBLE[i].estado){
          if(elemento!=''){
            elemento=elemento+', '+$scope.datos.PTR_IA_ELEM_MUEBLE[i].resvalor;
          }
          else{
            elemento=elemento+$scope.datos.PTR_IA_ELEM_MUEBLE[i].resvalor;
          }
        }
      }
      var inter='';
      for(var i=0; i<$scope.datos.PTR_IA_TIP_INTER.length;i++){
        if($scope.datos.PTR_IA_TIP_INTER[i].estado){
          if(inter!=''){
            inter=inter+', '+$scope.datos.PTR_IA_TIP_INTER[i].resvalor;
          }
          else{
            inter=inter+$scope.datos.PTR_IA_TIP_INTER[i].resvalor;
          }
        }
      }
      var element='';
      for(var i=0; i<$scope.datos.PTR_IA_ELEM_INM.length;i++){
        if($scope.datos.PTR_IA_ELEM_INM[i].estado){
          if(element!=''){
            element=element+', '+$scope.datos.PTR_IA_ELEM_INM[i].resvalor;
          }
          else{
            element=element+$scope.datos.PTR_IA_ELEM_INM[i].resvalor;
          }
        }
      }
      var muebles='';
      for(var i=0; i<$scope.datos.PTR_IA_ELEM_MUEB.length;i++){
        if($scope.datos.PTR_IA_ELEM_MUEB[i].estado){
          if(muebles!=''){
            muebles=muebles+', '+$scope.datos.PTR_IA_ELEM_MUEB[i].resvalor;
          }
          else{
            muebles=muebles+$scope.datos.PTR_IA_ELEM_MUEB[i].resvalor;
          }
        }
      }
      var cronologia='';
      for(var i=0; i<$scope.datos.PTR_CRONO.length;i++){
        if($scope.datos.PTR_CRONO[i].estado){
          if(cronologia!=''){
            cronologia=cronologia+', '+$scope.datos.PTR_CRONO[i].resvalor;
          }
          else{
            cronologia=cronologia+$scope.datos.PTR_CRONO[i].resvalor;
          }
        }
      }
      var funcionalidad='';
      for(var i=0; i<$scope.datos.PTR_IA_FUNC.length;i++){
        if($scope.datos.PTR_IA_FUNC[i].estado){
          if(funcionalidad!=''){
            funcionalidad=funcionalidad+', '+$scope.datos.PTR_IA_FUNC[i].resvalor;
          }
          else{
            funcionalidad=funcionalidad+$scope.datos.PTR_IA_FUNC[i].resvalor;
          }
        }
      }
      var columns = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      ];
      var data = [
      {"prim":"DENOMINACIÓN:","seg":$scope.datos.PTR_PROVIENE},
      {"prim":"CREADOR:","seg":$scope.datos.PTR_CREA}
      ];

      var columns2 = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"}
      ];
      var data2 = [
      {"prim":"PUNTO DE UBICACIÓN EN EL MUNICIPIO:","seg":$scope.datos.PTR_MUNI.toUpperCase()},
      {"prim":"UBICACIÓN MACRODISTRITO:","seg":$scope.datos.PTR_MACRO.toUpperCase()},
      {"prim":"UBICACIÓN LOCAL:","seg":$scope.datos.PTR_LUG.toUpperCase()},
      {"prim":"UBICACIÓN ESPECÍFICA DEL POLIGONO:","seg":$scope.datos.PTR_IA_POLIG.toUpperCase()}      
      ];  
      var colprov = [
      {title: "Número", dataKey: "dos"},
      {title: "Coordenadas", dataKey: "tres"}
      ];
      var dataprov=[];
      for (var i=1; i<$scope.datos.PTR_IA_UBIC.length;i++){
        var aporte = {"dos":$scope.datos.PTR_IA_UBIC[i].f01_punto_des_,"tres":$scope.datos.PTR_IA_UBIC[i].f01_veg_SFL_};          
        dataprov[i]=aporte;      
      }  
      var columns3 = [
      {title: "primero", dataKey: "prim"}
      ];
      var data3 = [
      {"prim":$scope.datos.PTR_IA_DESC_URB.toUpperCase()}
      ];  

      var columns4 = [
      {title: "primero", dataKey: "prim"}
      ];
      var data4 = [
      {"prim":$scope.datos.PTR_IA_DESC_RUR.toUpperCase()}
      ];
     
      if($scope.datos.PTR_IA_YACIM ==-1)
        {$scope.datos.PTR_IA_YACIM =" ";}
        else if($scope.datos.PTR_IA_YACIM =='Otros')
        {$scope.datos.PTR_IA_YACIM =$scope.datos.PTR_IA_YACIM_O;} 
      
      var columns6 = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"}
      ];

      if($scope.datos.PTR_IA_DESC_ELEM_INM ==-1)
        {$scope.datos.PTR_IA_DESC_ELEM_INM_VALOR =" ";}
      else if ($scope.datos.PTR_IA_DESC_ELEM_INM_VALOR =='Otros'){
          $scope.datos.PTR_IA_DESC_ELEM_INM_VALOR =$scope.datos.PTR_IA_DESC_ELEM_INM_OTRO;
        } 
      var data6 = [
      {"prim":"DESCRIPCIÓN DE LOS ELEMENTOS INMUEBLES:","seg":$scope.datos.PTR_IA_DESC_ELEM_INM_VALOR.toUpperCase()}, 
      {"prim":"ESTADO DE CONSERVACIÓN:","seg":vector.toUpperCase()}, 
      {"prim":"DESCRIPCIÓN DEL ESTADO:","seg":$scope.datos.PTR_IA_DESC_EST_CONS.toUpperCase()},
      {"prim":"OBSERVACIONES:","seg":$scope.datos.PTR_IA_OBS_EST.toUpperCase()},
      {"prim":"TAFONOMIA:","seg":tafo.toUpperCase()},
      {"prim":"DESCRIPCIÓN DE TAFONOMIA:","seg":$scope.datos.PTR_IA_TAFON_DESC.toUpperCase()},
      {"prim":"PRESENCIA DE ELEMENTO:","seg":elemento.toUpperCase()},
      {"prim":"DESCRIPCIÓN:","seg":$scope.datos.PTR_IA_ELEM_MUEB_DESC.toUpperCase()},
      {"prim":"CRONOLÓGIA:","seg":cronologia.toUpperCase()},
      {"prim":"DESCRIPCIÓN DE CRONOLÓGIA:","seg":$scope.datos.PTR_CRONO_DESC.toUpperCase()},      
      {"prim":"FUNCIONALIDAD:","seg":funcionalidad.toUpperCase()},      
      {"prim":"TAMAÑO DEL SITIO O YACIMIENTO:","seg":$scope.datos.PTR_IA_TAM_YACIM.toUpperCase()},
      {"prim":"EVALUACIÓN DEL SUBSUELO:","seg":$scope.datos.PTR_IA_TAM_YACIM.toUpperCase()},
      {"prim":"TIPO DE INTERVENCIÓN:","seg":inter.toUpperCase()},
      {"prim":"NÚMERO DE POZOS:","seg":$scope.datos.PTR_IA_NUM_POZ.toUpperCase()},
      {"prim":"ÁREA DE INTERVENCIÓN:","seg":$scope.datos.PTR_IA_AR_INTER.toUpperCase()},
      {"prim":"PROFUNDIDAD MINIMA(cm):","seg":$scope.datos.PTR_IA_PROF_MIN.toUpperCase()},
      {"prim":"PROFUNDIDAD MÁXIMA(cm)","seg":$scope.datos.PTR_IA_PROF_MAX.toUpperCase()},
      {"prim":"ELEMENTOS INMUEBLES:","seg":element.toUpperCase()},
      {"prim":"ELEMENTOS MUEBLES:","seg":muebles.toUpperCase()},
      {"prim":"OBSERVACIONES:","seg":$scope.datos.PTR_IA_OBS.toUpperCase()}    
      ];
     
      var doc = new jsPDF('p', 'pt');
      var columnsLong = columns;

      var header = function (data) {
        doc.addImage(material,'JPEG', 35, 40, 525, 60);
        doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(9);
        doc.text('FICHA DE CATALOGACIÓN DE YACIMIENTOS ARQUEOLOGICOS',40,120);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_COD,470,120);
        doc.rect(390, 105, 170, 25);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var numeropag = 0;
      var footer = function (data) {
        if(data.pageCount >= numeropag){
          numeropag = numeropag + 1;
        }
        var str = "Página " + numeropag;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text(str, 470, doc.internal.pageSize.height - 45);
          doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746", 150, doc.internal.pageSize.height - 45);
      };
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('INFORMACIÓN GENERAL',40,130);
      doc.autoTable(columns.splice(0,4), data, {drawHeaderRow: function() {return false;} ,startY: 140, pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {top: 110, bottom: 80},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 170,fontStyle: 'bold'}}});
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('CONTEXTO ORIGINAL:',40,doc.autoTableEndPosY() +20);
      doc.autoTable(colprov, dataprov,{theme: 'mary',startY: doc.autoTableEndPosY() +25,headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},columnStyles: {dos: {columnWidth: 170}}, bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},styles: {overflow: 'linebreak'}, pageBreak: 'auto'});
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('UBICACIÓN GEOGRAFICA UTM:',40,doc.autoTableEndPosY() +10);
      doc.autoTable(columns2.splice(0,2), data2,  {drawHeaderRow: function() {return false;},theme: 'mary',startY: doc.autoTableEndPosY() +20,headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 170,fontStyle: 'bold'}}, pageBreak: 'auto'});
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('RELACIÓN DEL SITIO O YACIMIENTO CON OTRAS ÁREAS',40,doc.autoTableEndPosY() +15);
      doc.setFontSize(8);
      doc.setFontStyle('bold');
      doc.text('DESCRIPCIÓN DEL CONTEXTO INMEDIATO EN AREA URBANA',40,doc.autoTableEndPosY() +30);
      doc.text('DESCRIPCIÓN DEL CONTEXTO INMEDIATO EN AREA RURAL',300,doc.autoTableEndPosY() +30);
      var a=doc.autoTableEndPosY() +35;
      doc.autoTable(columns3.splice(0,2), data3,  {drawHeaderRow: function() {return false;},theme: 'mary',startY: a,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: { right: 305},styles: {overflow: 'linebreak'}});
      doc.autoTable(columns4.splice(0,1), data4,  {drawHeaderRow: function() {return false;},theme: 'mary',startY: a,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {left: 305},styles: {overflow: 'linebreak'}});
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('UBICACIÓN GEOMORFOLOGICA',40,doc.autoTableEndPosY()+20);
      doc.setFontSize(8);
      doc.text('DESCRIPCIÓN GENERAL DEL YACIMIENTO',40,doc.autoTableEndPosY()+30);
      doc.setFontSize(8);
      doc.setFontStyle('normal');
      if($scope.datos.PTR_IA_YACIM_VALOR == "Otros")
        $scope.datos.PTR_IA_YACIM_VALOR = $scope.datos.PTR_IA_YACIM_OTRO;
      doc.text($scope.datos.PTR_IA_YACIM_VALOR,40,doc.autoTableEndPosY()+40);
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('EVALUACIÓN SUPERFICIAL',40,doc.autoTableEndPosY() +55);
      doc.autoTable(columns6.splice(0,2), data6, {drawHeaderRow: function() {return false;} ,
        startY: doc.autoTableEndPosY() +60,pageBreak: 'auto',theme: 'mary',beforePageContent: header,afterPageContent: footer,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 40, top: 135, bottom: 60},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 170,fontStyle: 'bold'}}});
      doc.addPage(790, 591);
      doc.addImage(material,'JPEG', 35, 35, 725, 60);
      doc.setTextColor(0);
      doc.setFontStyle('bold');
      doc.setFontSize(11);
      doc.text('FICHA DE CATALOGACIÓN DE YACIMIENTOS ARQUEOLOGICOS',40,110);
      doc.text('NRO. FICHA: ',600,120);
      doc.setFontStyle('normal');
      doc.text($scope.datos.PTR_COD,670,120);
      doc.rect(590, 105, 170, 25);
      doc.setFontSize(9);
      doc.setFontStyle('bold');
      doc.text('UBICACIÓN:',40,130);
      doc.addImage(mapa,'JPEG', 40, 140, 700, 420);
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      $('#visorFu object').attr('data',doc.output('datauristring'));
      $("#divPopup4").modal('show'); 
    })
    obj.error(function(error) {                
    });
  };
  $scope.ficha = function(idfrcasos,nro) {
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+idfrcasos
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=response.record[0].cas_nro_caso;
      var reslocal = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select doc_url_logica,doc_correlativo, doc_datos, doc_nombre from dms_gt_documentos where doc_proceso = '"+ $scope.procesonro+"' and doc_estado = 'A' and doc_id ="+$scope.datos
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (respons) {
        $scope.url = JSON.parse(respons[0].ejecutartojson)
        var pic =[];
        pic[0] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        var k =0;
        var j=0;
        var n = 1;
        if($scope.url == null){
          if(nro == '2')
                $scope.ejemplo2(idfrcasos,pic[0]); 
          else     
                $scope.ejemplo1(idfrcasos,pic[0]); 
          }
          else{
        for(var i=0;i<$scope.url.length ;i++){
          var a= $scope.url[i].doc_nombre;
          var imga = $scope.url[i].doc_url_logica;
          imga = imga.replace(/Ñ/gi,"%d1");
          imga = imga.replace(/ñ/gi,"%f1");
          imga = imga.replace(/Á/gi,"%c1");
          imga = imga.replace(/á/gi,"%e1");
          imga = imga.replace(/É/gi,"%c9");
          imga = imga.replace(/é/gi,"%e9");
          imga = imga.replace(/Í/gi,"%cd");
          imga = imga.replace(/í/gi,"%ed");
          imga = imga.replace(/Ó/gi,"%d3");
          imga = imga.replace(/ó/gi,"%f3");
          imga = imga.replace(/Ú/gi,"%da");
          imga = imga.replace(/ú/gi,"%fa");
          imga = imga.replace(/“/gi,"%93");
          imga = imga.replace(/”/gi,"%94");
          imga = imga.replace(/&/gi,"%26");
          imga = imga.replace(/\\/gi,"/");
          if($scope.url[i].doc_correlativo == 1){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){ 
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.drawImage(img, 0, 0);      
                pic[0] = canvas.toDataURL("image/jpeg",0.1);
              j++;
              if(j == n){
                if(nro == '2')
                  $scope.ejemplo2(idfrcasos,pic[0]); 
                else     
                  $scope.ejemplo1(idfrcasos,pic[0]); 
              }
            }
            img.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            } 
          }
          if($scope.url.length == i+1 && k==0){
            if(nro == '2')
                $scope.ejemplo2(idfrcasos,pic[0]); 
            else     
                $scope.ejemplo1(idfrcasos,pic[0]); 
          }

          if($scope.url.length == i+1){
            n=k;
          }
        }
      }
      })
      obj.error(function(error) {
      });
      })
    obj.error(function(error) {
    });
  };  
  $scope.conjunto=function(cod_idcaso){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+cod_idcaso
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=JSON.parse(response.record[0].cas_datos);
      var columns1 = [
      {title: "titulo", dataKey: "tit"},
      {title: "descripcion", dataKey: "des"}
      ];
      var data1 = [
      {"tit":"Nominación","des":$scope.datos.PTR_NOM},
      {"tit":"Ubicación","des":$scope.datos.PTR_UBIC},
      {"tit":"Protección Legal","des":$scope.datos.PTR_TIP_PROT+' '+$scope.datos.PTR_NRO_PROT},
      {"tit":"Número Total de Inmuebles Tramo","des":$scope.datos.PTR_NUM_INM},
      {"tit":"Número Total de Inmuebles Patrimoniales","des":$scope.datos.PTR_NUM_PAT}
      ];
      var columns = [
      {title: "titulo", dataKey: "tit"},
      {title: "descripcion", dataKey: "des"}
      ];
      var data = [
      {"tit":"Indicador Urbano","des":$scope.datos.PTR_IND_URB},
      {"tit":"Indicador Artístico","des":$scope.datos.PTR_IND_ART},
      {"tit":"Indicador Tipológico","des":$scope.datos.PTR_IND_TIP},
      {"tit":"Indicador Tecnológico","des":$scope.datos.PTR_IND_TEC},
      {"tit":"Indicador de Integridad","des":$scope.datos.PTR_IND_INT},
      {"tit":"Indicador Histórico Cultural","des":$scope.datos.PTR_IND_HIST},
      {"tit":"Indicador Simbólico","des":$scope.datos.PTR_IND_SIMB},
      {"tit":"Nombre de la Vía","des":$scope.datos.PTR_NOM_VIA},
      {"tit":"Material de la Vía","des":$scope.datos.PTR_MAT_VIA},
      {"tit":"Clasificación","des":$scope.datos.PTR_CLASS},
      {"tit":"Entre Calles","des":$scope.datos.PTR_ENT_CALL}
      ];
      var colcantidad = [
      {title: "Inmuebles por Categoría y Condición de Protección", dataKey: "uno"},
      {title: "C/ Protección", dataKey: "dos"},
      {title: "S/ Protección", dataKey: "tres"},
      {title: "Total", dataKey: "cuatro"}
      ];
      var datacantidad=[];
      for (var i=1; i<$scope.datos.PTR_CANT_INM.length;i++){
        var aporte = {"uno":$scope.datos.PTR_CANT_INM[i].imn_cat ,"dos":$scope.datos.PTR_CANT_INM[i].inm_prot,"tres":$scope.datos.PTR_CANT_INM[i].inm_des,"cuatro":$scope.datos.PTR_CANT_INM[i].inm_total};          
        datacantidad[i]=aporte;      
      }
      var doc = new jsPDF('p', 'pt');
      var header = function (data) {
        doc.addImage(material,'JPEG', 35, 40, 525, 60);
        doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(9);
        doc.text('FICHA DE CATALOGACIÓN DE MUEBLES ARQUEOLOGICOS',40,120);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_COD_CONJ,470,120);
        doc.rect(390, 105, 170, 25);
         };
      var totalPagesExp = "{total_pages_count_string}";
      var footer = function (data) {
        var str = "Página " + data.pageCount;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text(str, 40, doc.internal.pageSize.height - 30);
        doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746", 40, doc.internal.pageSize.height - 45);
      };
      doc.setFontStyle('bold');
      doc.setFontSize(8);
      doc.text("DATOS GENERALES DEL CONJUNTO ", 40, 130);
      doc.autoTable(columns1.splice(0,2), data1, {drawHeaderRow: function() {return false;},startY: 140,pageBreak: 'auto',theme: 'plain',beforePageContent: header,afterPageContent: footer,bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 70},styles: {overflow: 'linebreak'},columnStyles: {tit: {columnWidth: 170,fontStyle: 'bold'}},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 2) {
          doc.autoTableText("PROTECCIÓN LEGAL", 40, row.y + row.height / 2, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        } else if (row.index === 3) {
          doc.autoTableText("INFORMACIÓN CUANTITATIVA DEL TRAMO", 40, row.y + row.height / 2, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        }
      }
    });  doc.autoTable(colcantidad, datacantidad,{startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'grid',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 110, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.setFontStyle('bold');

      doc.setFontSize(8);
      doc.text("INFORMACIÓN CUALITATIVA DEL CONJUNTO", 40, doc.autoTableEndPosY()+20);
      doc.autoTable(columns.splice(0,2),data,{drawHeaderRow:function(){return false;},startY:doc.autoTableEndPosY()+25,pageBreak:'auto',theme:'plain',bodyStyles:{rowHeight:12,fontSize:8,valign:'top'},beforePageContent:header,afterPageContent:footer,margin:{horizontal:50,top:130,bottom:80},styles:{overflow:'linebreak'},columnStyles:{tit:{columnWidth:140,fontStyle:'bold'}},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 7) {
          doc.autoTableText("IDENTIFICACIÓN DE TRAMOS", 40, row.y + row.height / 2, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
      }}});
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      //doc.save('conjunto'+'.pdf');
        $('#visorFu object').attr('data',doc.output('datauristring'));
        $("#divPopup4").modal('show');
        //window.open(doc.output('datauristring'));
    })
    obj.error(function(error) {
    });
  };
  $scope.espacioabierto=function(cas_id){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+cas_id
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {
      $scope.datos=response.record[0].cas_nro_caso;
      var reslocal = {
        "procedure_name":"ejecutartojson",
        "body":{
          "params": [
          {
            "name":"expression",

            "param_type":"IN","value":"select doc_url_logica,doc_correlativo, doc_nombre from dms_gt_documentos where doc_proceso = '"+ $scope.procesonro+"' and doc_estado = 'A' and doc_id ="+$scope.datos
          }]
        }
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
      obj.success(function (respons) {
        $scope.url = JSON.parse(respons[0].ejecutartojson);
        var pic =[];
        var j=0;
        var k=0;
        var n = 3;
        pic[0] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[1] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        pic[2] ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
        if($scope.url == null){
                $scope.espacios(cas_id,pic);           
          }
          else{
        for(var i=0;i<$scope.url.length ;i++){
          var a = $scope.url[i].doc_nombre;
          var imga = $scope.url[i].doc_url_logica;
          imga = imga.replace(/Ñ/gi,"%d1");
          imga = imga.replace(/ñ/gi,"%f1");
          imga = imga.replace(/Á/gi,"%c1");
          imga = imga.replace(/á/gi,"%e1");
          imga = imga.replace(/É/gi,"%c9");
          imga = imga.replace(/é/gi,"%e9");
          imga = imga.replace(/Í/gi,"%cd");
          imga = imga.replace(/í/gi,"%ed");
          imga = imga.replace(/Ó/gi,"%d3");
          imga = imga.replace(/ó/gi,"%f3");
          imga = imga.replace(/Ú/gi,"%da");
          imga = imga.replace(/ú/gi,"%fa");
          imga = imga.replace(/“/gi,"%93");
          imga = imga.replace(/”/gi,"%94");
          imga = imga.replace(/&/gi,"%26");
          imga = imga.replace(/\\/gi,"/");
          if($scope.url[i].doc_correlativo == 1){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                pic[0] = canvas.toDataURL("image/jpeg",0.2);
              j++;
              if(j == n ){
                $scope.espacios(cas_id,pic);
              }
            }
            img.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            } 
          }else if($scope.url[i].doc_correlativo == 2){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                pic[1] = canvas.toDataURL("image/jpeg",0.2);
              j++;
              if(j == n ){
                $scope.espacios(cas_id,pic);
              }
            }
            img.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            } 
          }else if($scope.url[i].doc_correlativo == 3){
            k++;
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = imga;
            img.onload = function(){
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                pic[2] = canvas.toDataURL("image/jpeg",0.2);
              j++;
              if(j == n ){
                $scope.espacios(cas_id,pic);
              }
            }
            img.onerror = function(){
              sweet.show('Error de Carga de Imagen', a, 'error');
            } 
          }
          if($scope.url.length == i+1 && k==0){
                $scope.archivofotografico(pic,nom,ficha,titulo);
          }

          if($scope.url.length == i+1){
            n=k;
          }
        }
      }
      });
      obj.error(function(error) {
      });
    });
    obj.error(function(error) {
    });
  };
  $scope.espacios=function(hola,image1){
    var resDatos = {
      "table_name":"_fr_casos",
      "filter": "cas_id="+hola
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
    obj.success(function (response) {    
      $scope.datos=JSON.parse(response.record[0].cas_datos);

      var materiales='';
      for(var i=0; i<10;i++){
        if($scope.datos.PTR_MURMAT[i].estado){
          if(materiales!=''){
            materiales=materiales+', '+$scope.datos.PTR_MURMAT[i].resvalor;
          }
          else{
            materiales=materiales+$scope.datos.PTR_MURMAT[i].resvalor;
          }
        }
      }
      var danos='';
      for(var i=0; i<6;i++){
        if($scope.datos.PTR_PATODAN[i].estado){
          if(danos!=''){
            danos=danos+', '+$scope.datos.PTR_PATODAN[i].resvalor;
          }
          else{
            danos=danos+$scope.datos.PTR_PATODAN[i].resvalor;
          }
        }
      }
      var parcial='';
      var panoramica='';
      if($scope.datos.PTR_VISTAS !=  undefined){
        if($scope.datos.PTR_VISTAS[0].estado){
          parcial = 'SI';
        }else {
          parcial = 'NO';
        }
        if($scope.datos.PTR_VISTAS[1].estado){
          panoramica = 'SI';
        }else {
          panoramica = 'NO';
        }
      }
      var other='';
      for(var i=0; i<3;i++){
        if($scope.datos.PTR_OTHER[i].estado){
          if(other!=''){
            other=other+', '+$scope.datos.PTR_OTHER[i].resvalor;
          }
          else{
            other=other+$scope.datos.PTR_OTHER[i].resvalor;
          }
        }
      }
      var causas='';
      for(var i=0; i<8;i++){
        if($scope.datos.PTR_PATOCAU[i].estado){
          if(causas!=''){
            causas=causas+', '+$scope.datos.PTR_PATOCAU[i].resvalor;
          }
          else{
            causas=causas+$scope.datos.PTR_PATOCAU[i].resvalor;
          }
        }
      }
      var preex1 = document.createElement('div');
      preex1.innerHTML = $scope.datos.PTR_PREEX; 
      var uso1 = document.createElement('div');
      uso1.innerHTML = $scope.datos.PTR_USOORG; 
      var hecho1 = document.createElement('div');
      hecho1.innerHTML = $scope.datos.PTR_HECHIS;
      var fiestas1 = document.createElement('div');
      fiestas1.innerHTML = $scope.datos.PTR_FIEREL;
      var histor1 = document.createElement('div');
      histor1.innerHTML = $scope.datos.PTR_DATHISC;
      var fuent1 = document.createElement('div');
      fuent1.innerHTML = $scope.datos.PTR_FUENTE;
      var preex1d = document.createElement('div');
      preex1d.innerHTML = $scope.datos.PTR_PREDIN;
      var uso1d = document.createElement('div');
      uso1d.innerHTML = $scope.datos.PTR_USOPREEX;
      var hecho1d = document.createElement('div');
      hecho1d.innerHTML = $scope.datos.PTR_HECHISD;
      var fiestas1d = document.createElement('div');
      fiestas1d.innerHTML = $scope.datos.PTR_FIERELD;
      var histor1d = document.createElement('div');
      histor1d.innerHTML = $scope.datos.PTR_DATHISTC;
      var fuentes1d = document.createElement('div');
      fuentes1d.innerHTML = $scope.datos.PTR_FUENTBIO;
      var espconj1 = document.createElement('div');
      espconj1.innerHTML = $scope.datos.PTR_INSCR;
      var espcon1 = document.createElement('div');
      espcon1.innerHTML = $scope.datos.PTR_ELEMVISID;
      var intrea1 = document.createElement('div');
      intrea1.innerHTML = $scope.datos.PTR_ELEMVISAL;
      var cartec1 = document.createElement('div');
      cartec1.innerHTML = $scope.datos.PTR_ELEMVISAB;
      var carico1 = document.createElement('div');
      carico1.innerHTML = $scope.datos.PTR_DESENTEI;
      var dathis1 = document.createElement('div');
      dathis1.innerHTML = $scope.datos.PTR_DESENTEI;
      var refeBib1 = document.createElement('div');
      refeBib1.innerHTML = $scope.datos.PTR_INFOBS;
      var obs1 = document.createElement('div');
      obs1.innerHTML = $scope.datos.PTR_PATOOBS;
      var coldato1 = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      {title: "tercero", dataKey: "ter"},
      {title: "cuarto", dataKey: "cuar"}
      ];
      var datadato1 = [
      {"prim":"Codigo de Catastro:","seg":$scope.datos.PTR_COD_CAT,"ter":"Georeferencia","cuar":$scope.datos.PTR_GEOREF}
      ];
       var coldato2 = [
        {title: "Nro", dataKey: "uno"},
        {title: "Punto Colineal", dataKey: "dos"}
        ];
        var datadato2=[];
      if($scope.datos.PTR_DOT_S != undefined){       
        for (var i=1; i<$scope.datos.PTR_DOT_S.length;i++){
          var aporte = {"uno":"P. Colineal "+i ,"dos":$scope.datos.PTR_DOT_S[i].f01_Pto_Colineal};          
          datadato2[i]=aporte;      
        }
      }
      var coldato = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      {title: "tercero", dataKey: "ter"},
      {title: "cuarto", dataKey: "cuar"}
      ];

      if($scope.datos.PTR_REPRO ==-1)
        {$scope.datos.PTR_REPRO =" ";} 

      if($scope.datos.PTR_MACRO ==-1)
        {$scope.datos.PTR_MACRO =" ";} 
      var datadato = [      
      {"prim":"Tradicional:","seg":$scope.datos.PTR_TRAD,"ter":"Actual:","cuar":$scope.datos.PTR_ACT},
      {"prim":"Departamento:","seg":$scope.datos.PTR_DEP,"ter":"Dirección:","cuar":$scope.datos.PTR_DIR},
      {"prim":"Municipio:","seg":$scope.datos.PTR_MUN,"ter":"Esq. o Entre Calles 1","cuar":$scope.datos.PTR_ESQ1},
      {"prim":"Ciudad/Poblado:","seg":$scope.datos.PTR_CIPO,"ter":"Esq. o Entre Calles 2","cuar":$scope.datos.PTR_ESQ2},
      {"prim":"Macro-distrito:","seg":$scope.datos.PTR_MACRO,"ter":"Altitud(m.s.n.m.)","cuar":$scope.datos.PTR_ALT},
      {"prim":"Barrio:","seg":$scope.datos.PTR_BARR,"ter":" ","cuar":" "},
      {"prim":"Nombre Propietario:","seg":$scope.datos.PTR_NOMPRO,"ter":"Propiedad","cuar":$scope.datos.PTR_REPRO},
      ];
      var colepo = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      {title: "tercero", dataKey: "ter"},
      {title: "cuarto", dataKey: "cuar"}
      ];
      if($scope.datos.PTR_MUREST ==-1)
        {$scope.datos.PTR_MUREST =" ";}

      if($scope.datos.PTR_EPOCA ==-1)
        {$scope.datos.PTR_EPOCA =" ";}

      if($scope.datos.PTR_ESTILO ==-1)
        {$scope.datos.PTR_ESTILO =" ";}
      if($scope.datos.PTR_UBICESP ==-1)
        {$scope.datos.PTR_UBICESP =" ";}
      if($scope.datos.PTR_LINCONS ==-1)
        {$scope.datos.PTR_LINCONS =" ";}
      if($scope.datos.PTR_TIPOLO ==-1)
        {$scope.datos.PTR_TIPOLO =" ";}
      if($scope.datos.PTR_MURINTE ==-1)
        {$scope.datos.PTR_MURINTE =" ";}
      var dataepo = [
      {"prim":"Época:","seg":$scope.datos.PTR_EPOCA,"ter":"Año de Construcción:","cuar":$scope.datos.PTR_ACONS},
      {"prim":"Ultima Remo-delación:","seg":$scope.datos.PTR_AULTR,"ter":" ","cuar":" "},
      {"prim":"Estilo:","seg":$scope.datos.PTR_ESTILO,"ter":" ","cuar":" "},
      {"prim":"Ubicación del Espacio en el Area:","seg":$scope.datos.PTR_UBICESP,"ter":"Linea de Construcción","cuar":$scope.datos.PTR_LINCONS},
      {"prim":"Tipológia:","seg":$scope.datos.PTR_TIPOLO,"ter":" ","cuar":" "},
      {"prim":"Materiales:","seg":materiales,"ter":"Integridad:","cuar":$scope.datos.PTR_MURINTE},
      {"prim":"Estado de Conservación:","seg":$scope.datos.PTR_MUREST,"ter":" ","cuar":" "}
      ];
      var colpato = [
      {title: "primero", dataKey: "prim"},
      {title: "segundo", dataKey: "seg"},
      {title: "tercero", dataKey: "ter"},
      {title: "cuarto", dataKey: "cuar"}
      ];
      if($scope.datos.PTR_INFADICIONAL ==-1)
        {$scope.datos.PTR_INFADICIONAL =" ";}
      var datapato = [
      {"prim":"Area de Espacio:","seg":$scope.datos.PTR_MEDIDAREA,"ter":"Ancho:","cuar":$scope.datos.PTR_MEDIDANC},
      {"prim":"Largo:","seg":$scope.datos.PTR_MEDIDLAR,"ter":"ancho de muro de cerco:","cuar":$scope.datos.PTR_MEDIAMC},
      {"prim":"Información Adicional:","seg":$scope.datos.PTR_INFADICIONAL,"ter":"Observaciones:","cuar":refeBib1.innerText},
      {"prim":"Daños:","seg":danos,"ter":"Causas:","cuar":causas},
      {"prim":"Observaciones:","seg":obs1.innerText,"ter":" ","cuar":" "}
      ];
      var colvisual = [
      {title: "primero", dataKey: "prim"}
      ];
      var datavisual = [
      {"prim":espcon1.innerText},
      {"prim":intrea1.innerText},
      {"prim":cartec1.innerText},
      {"prim":carico1.innerText},
      {"prim":dathis1.innerText}
      ];
      var colser = [
      {title: "Descripción", dataKey: "uno"},
      {title: "Proveedor", dataKey: "dos"}
      ];
      var dataser=[];
      for (var i=1; i<$scope.datos.PTR_SERV.length;i++){
        if($scope.datos.PTR_SERV[i].f01_emision_G_SERV_DESC===undefined){
          $scope.datos.PTR_SERV[i].f01_emision_G_SERV_DESC="1-Original";
          $scope.datos.PTR_SERV[i].f01_emision_G_SERV_PROV="1-Original"
        }
        var desc = $scope.datos.PTR_SERV[i].f01_emision_G_SERV_DESC.split('-');
        var prov=   $scope.datos.PTR_SERV[i].f01_emision_G_SERV_PROV.split('-'); 

        var aporte = {"uno":$scope.datos.PTR_SERV[i].f01_emision_G_SERV_DESC ,"dos":$scope.datos.PTR_SERV[i].f01_emision_G_SERV_PROV};          
        dataser[i]=aporte;      
      }
      var coluso = [
      {title: "Descripción", dataKey: "uno"},
      {title: "Tradicional", dataKey: "dos"},
      {title: "Actual", dataKey: "tres"}
      ];
      var datauso=[];
      for (var i=1; i<$scope.datos.PTR_USO.length;i++){
        if($scope.datos.PTR_USO[i].f01_emision_G_SERV_DESC===undefined){
          $scope.datos.PTR_USO[i].f01_emision_G_SERV_DESC="1-Original";
        }
        var desc = $scope.datos.PTR_USO[i].f01_emision_G_SERV_DESC.split('-');          
        var aporte = {"uno": $scope.datos.PTR_USO[i].f01_emision_G_SERV_DESC ,"dos":$scope.datos.PTR_USO[i].f01_emision_G_TRAD,"tres":$scope.datos.PTR_USO[i].f01_emision_G_ACT};          
        datauso[i]=aporte;      
      }
      var colreja = [
      {title: "Materiales", dataKey: "uno"},
      {title: "Tipo", dataKey: "dos"},
      {title: "Integridad", dataKey: "tres"}
      ];
      var datareja=[];
      for (var i=1; i<$scope.datos.PTR_REJAS.length;i++){
        var mat=" ";
        if( $scope.datos.PTR_REJAS[i].f01_reja_MAD_='SI'){
          mat=mat+'Madera ';
        }else if($scope.datos.PTR_REJAS[i].f01_reja_TUBO_='SI'){
          mat=mat+'Tubo Industrial ';
        }else if($scope.datos.PTR_REJAS[i].f01_reja_HIERRO_='SI'){
          mat=mat+'Hierro Forjado ';
        }else if($scope.datos.PTR_REJAS[i].f01_reja_OTRO_='SI'){
          mat=mat+$scope.datos.PTR_REJAS[i].f01_reja_OTRODESC_;
        }
        if($scope.datos.PTR_REJAS[i].f01_reja_DES_===undefined){
          $scope.datos.PTR_REJAS[i].f01_reja_DES_="1-Original";
          $scope.datos.PTR_REJAS[i].f01_reja_INT_="1-Original";
        }
        var desc = $scope.datos.PTR_REJAS[i].f01_reja_DES_.split('-');
        var integ= $scope.datos.PTR_REJAS[i].f01_reja_INT_.split('-');      
        var aporte = {"uno":$scope.datos.PTR_REJAS[i].f01_reja_DES_ ,"dos":mat,"tres":$scope.datos.PTR_REJAS[i].f01_reja_INT_};          
        datareja[i]=aporte;      
      }
      var colmuro = [
      {title: "Materiales", dataKey: "uno"},
      {title: "Tipo", dataKey: "dos"},
      {title: "Integridad", dataKey: "tres"}
      ];
      var datamuro=[];
      for (var i=1; i<$scope.datos.PTR_ACAMUR.length;i++){
        var mat=" ";
        if( $scope.datos.PTR_ACAMUR[i].f01_muro_AZU_='SI'){
          mat=mat+'Azulejo ';
        }else if($scope.datos.PTR_ACAMUR[i].f01_muro_CAL_='SI'){
          mat=mat+'Cal y Arena ';
        }else if($scope.datos.PTR_ACAMUR[i].f01_muro_CEM_='SI'){
          mat=mat+'Cemento y Arena ';

        } else if($scope.datos.PTR_ACAMUR[i].f01_muro_LAD_='SI'){
          mat=mat+'Ladrillo ';
        }else if($scope.datos.PTR_ACAMUR[i].f01_muro_MAD_='SI'){
          mat=mat+'Madera ';
        }else if($scope.datos.PTR_ACAMUR[i].f01_muro_MAR_='SI'){
          mat=mat+'Mármol ';
        }else if($scope.datos.PTR_ACAMUR[i].f01_muro_PIE_='SI'){
          mat=mat+'Piedra ';
        }else if($scope.datos.PTR_ACAMUR[i].f01_muro_OTRO_='SI'){
          mat=mat+$scope.datos.PTR_ACAMUR[i].f01_muro_OTRODESC_;
        }
        if($scope.datos.PTR_ACAMUR[i].f01_muro_DES_===undefined){
          $scope.datos.PTR_ACAMUR[i].f01_muro_DES_="1-Original";
          $scope.datos.PTR_ACAMUR[i].f01_muro_INT_="1-Original";
        }
        var desc = $scope.datos.PTR_ACAMUR[i].f01_muro_DES_.split('-');
        var integ= $scope.datos.PTR_ACAMUR[i].f01_muro_INT_.split('-');   
        var aporte = {"uno":$scope.datos.PTR_ACAMUR[i].f01_muro_DES_ ,"dos":mat,"tres":$scope.datos.PTR_ACAMUR[i].f01_muro_INT_};          
        datamuro[i]=aporte;      
      }
      var colpint = [
      {title: "Materiales", dataKey: "uno"},
      {title: "Tipo", dataKey: "dos"},
      {title: "Integridad", dataKey: "tres"}
      ];
      var datapint=[];
      for (var i=1; i<$scope.datos.PTR_PINTURA.length;i++){
        var mat=" ";
        if( $scope.datos.PTR_PINTURA[i].f01_pint_ACE_='SI'){
          mat=mat+'Aceite ';
        }else if($scope.datos.PTR_PINTURA[i].f01_pint_ACR_='SI'){
          mat=mat+'Acrílica ';
        }else if($scope.datos.PTR_PINTURA[i].f01_pint_CAL_='SI'){
          mat=mat+'Cal ';
        }else if($scope.datos.PTR_PINTURA[i].f01_pint_OTRO_='SI'){
          mat=mat+$scope.datos.PTR_PINTURA[i].f01_pint_OTRODESC_;
        }
        if($scope.datos.PTR_PINTURA[i].f01_pint_COD_===undefined){
          $scope.datos.PTR_PINTURA[i].f01_pint_COD_="1-Original";
          $scope.datos.PTR_PINTURA[i].f01_pint_INT_="1-Original";
        }
        var desc = $scope.datos.PTR_PINTURA[i].f01_pint_COD_.split('-');
        var integ= $scope.datos.PTR_PINTURA[i].f01_pint_INT_.split('-');      
        var aporte = {"uno":$scope.datos.PTR_PINTURA[i].f01_pint_COD_ ,"dos":mat,"tres":$scope.datos.PTR_PINTURA[i].f01_pint_INT_};           
        datapint[i]=aporte;      
      }
      var colpiso = [
      {title: "Materiales", dataKey: "uno"},
      {title: "Tipo", dataKey: "dos"},
      {title: "Integridad", dataKey: "tres"}
      ];
      var datapiso=[];
      for (var i=1; i<$scope.datos.PTR_PISOS.length;i++){
        var mat=" ";
        if( $scope.datos.PTR_PISOS[i].f01_pis_MOS_='SI'){
          mat=mat+'Mosaicos ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_POR_='SI'){
          mat=mat+'Porcelanato ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_LAJ_='SI'){
          mat=mat+'P. Laja ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_RIO_='SI'){
          mat=mat+'P. Rio ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_LAD_='SI'){
          mat=mat+'Ladrillos ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_GRA_='SI'){
          mat=mat+'Grama ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_TIE_='SI'){
          mat=mat+'Tierra ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_CON_='SI'){
          mat=mat+'Concreto ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_CER_='SI'){
          mat=mat+'Cerámica ';
        }else if($scope.datos.PTR_PISOS[i].f01_pis_MAD_='SI'){
          mat=mat+'Madera ';        
        }else if($scope.datos.PTR_PISOS[i].f01_pis_OTRO_='SI'){
          mat=mat+$scope.datos.PTR_PISOS[i].f01_pis_OTRODESC_;
        }   
        var aporte = {"uno":$scope.datos.PTR_PISOS[i].f01_pis_DES_ ,"dos":mat,"tres":$scope.datos.PTR_PISOS[i].f01_pis_INT_};           
        datapiso[i]=aporte;       
      }
      var colpue = [
      {title: "Materiales", dataKey: "uno"},
      {title: "Tipo", dataKey: "dos"},
      {title: "Integridad", dataKey: "tres"}
      ];
      var datapue=[];
      for (var i=1; i<$scope.datos.PTR_PUERTA.length;i++){
        var mat=" ";
        if( $scope.datos.PTR_PUERTA[i].f01_pue_MAD_='SI'){
          mat=mat+'Madera ';
        }else if($scope.datos.PTR_PUERTA[i].f01_pue_MET_='SI'){
          mat=mat+'Metal ';
        }else if($scope.datos.PTR_PUERTA[i].f01_pue_OTRO_='SI'){
          mat=mat+$scope.datos.PTR_PUERTA[i].f01_pue_OTRODESC_;
        }       
        var aporte = {"uno":$scope.datos.PTR_PUERTA[i].f01_pue_DES_ ,"dos":mat,"tres":$scope.datos.PTR_PUERTA[i].f01_pue_INT_};          
        datapue[i]=aporte;      
      }
      var colmob =[
      {title: "Materiales", dataKey: "uno"},
      {title: "Tipo", dataKey: "dos"},
      {title: "Integridad", dataKey: "tres"}
      ];
      var datamob=[];
      for (var i=1; i<$scope.datos.PTR_MOBURB.length;i++){
        var mat=" ";
        if( $scope.datos.PTR_MOBURB[i].f01_mob_ADO_='SI'){
          mat=mat+'Adobe ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_CAL_='SI'){
          mat=mat+'Cal ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_CAR_='SI'){
          mat=mat+'Fibra de Carbono ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_CON_='SI'){
          mat=mat+'Concreto ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_LAD_='SI'){
          mat=mat+'Ladrillo ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_MAD_='SI'){
          mat=mat+'Madera ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_MET_='SI'){
          mat=mat+'Metal ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_PIE_='SI'){
          mat=mat+'Piedra ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_VID_='SI'){
          mat=mat+'Vidrio ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_BARR_='SI'){
          mat=mat+'Barro ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_FIBR_='SI'){
          mat=mat+'Fibrocem ';
        }else if($scope.datos.PTR_MOBURB[i].f01_mob_OTRO_='SI'){
          mat=mat+$scope.datos.PTR_MOBURB[i].f01_mob_OTRODESC_;
        }
        if($scope.datos.PTR_MOBURB[i].f01_mob_DES_===undefined){
          $scope.datos.PTR_MOBURB[i].f01_mob_DES_="1-Original";
          $scope.datos.PTR_MOBURB[i].f01_mob_INT_="1-Original";
        }
        var desc = $scope.datos.PTR_MOBURB[i].f01_mob_DES_.split('-');
        var integ= $scope.datos.PTR_MOBURB[i].f01_mob_INT_.split('-');   
        var aporte = {"uno":$scope.datos.PTR_MOBURB[i].f01_mob_DES_ ,"dos":mat,"tres":$scope.datos.PTR_MOBURB[i].f01_mob_INT_ }; ;          
        datamob[i]=aporte;      
      }
      var colesc = [
      {title: "Materiales", dataKey: "uno"},
      {title: "Tipo", dataKey: "dos"},
      {title: "Integridad", dataKey: "tres"}
      ];
      var dataesc=[];
      for (var i=1; i<$scope.datos.PTR_ESCAL.length;i++){
        var mat=" ";
        if( $scope.datos.PTR_ESCAL[i].f01_esc_CON_='SI'){
          mat=mat+'Concreto ';
        }else if($scope.datos.PTR_ESCAL[i].f01_esc_LAD_='SI'){
          mat=mat+'Ladrillo ';
        }else if($scope.datos.PTR_ESCAL[i].f01_esc_MAD_='SI'){
          mat=mat+'Madera ';
        }else if($scope.datos.PTR_ESCAL[i].f01_esc_MET_='SI'){
          mat=mat+'Metal ';
        }else if($scope.datos.PTR_ESCAL[i].f01_esc_PIE_='SI'){
          mat=mat+'Piedra ';
        }else if($scope.datos.PTR_ESCAL[i].f01_esc_TIE_='SI'){
          mat=mat+'Tierra ';
        }else if($scope.datos.PTR_ESCAL[i].f01_esc_OTRO_='SI'){
          mat=mat+$scope.datos.PTR_ESCAL[i].f01_esc_OTRODESC_;
        }
        if($scope.datos.PTR_ESCAL[i].f01_esc_DES_===undefined){
          $scope.datos.PTR_ESCAL[i].f01_esc_DES_="1-Original";
          $scope.datos.PTR_ESCAL[i].f01_esc_INT_="1-Original";
        }
        var desc = $scope.datos.PTR_ESCAL[i].f01_esc_DES_.split('-');
        var integ= $scope.datos.PTR_ESCAL[i].f01_esc_INT_.split('-');    
        var aporte = {"uno":$scope.datos.PTR_ESCAL[i].f01_esc_DES_ ,"dos":mat,"tres":$scope.datos.PTR_ESCAL[i].f01_esc_INT_};          
        dataesc[i]=aporte;      
      }
      var colveg = [
      {title: "Materiales", dataKey: "uno"},
      {title: "Tipo", dataKey: "dos"},
      {title: "Integridad", dataKey: "tres"},
      {title: "Cantidad", dataKey: "cuatro"}
      ];
      var dataveg=[];
      for (var i=1; i<$scope.datos.PTR_VEGET.length;i++){
        var mat=" ";
        if( $scope.datos.PTR_VEGET[i].f01_veg_CAD_='SI'){
          mat=mat+'Caduca ';
        }else if($scope.datos.PTR_VEGET[i].f01_veg_PER_='SI'){
          mat=mat+'Perenne ';
        }else if($scope.datos.PTR_VEGET[i].f01_veg_SFL_='SI'){
          mat=mat+'Sin Floracion ';
        }else if($scope.datos.PTR_VEGET[i].f01_veg_OTRO_='SI'){
          mat=mat+$scope.datos.PTR_VEGET[i].f01_veg_OTRODESC_;
        }
        if($scope.datos.PTR_VEGET[i].f01_veg_DES_===undefined){
          $scope.datos.PTR_VEGET[i].f01_veg_DES_="1-Original";
          $scope.datos.PTR_VEGET[i].f01_veg_INT_="1-Original";
        }
        var desc = $scope.datos.PTR_VEGET[i].f01_veg_DES_.split('-');
        var integ= $scope.datos.PTR_VEGET[i].f01_veg_INT_.split('-');     
        var aporte = {"uno":$scope.datos.PTR_VEGET[i].f01_veg_DES_ ,"dos":mat,"tres":$scope.datos.PTR_VEGET[i].f01_veg_INT_,"cuatro":$scope.datos.PTR_VEGET[i].f01_veg_CAN_};           
        dataveg[i]=aporte;      
      }
      var colart = [
      {title: "Tipo", dataKey: "uno"},
      {title: "Integridad", dataKey: "tres"}
      ];
      var dataart=[];
      for (var i=1; i<$scope.datos.PTR_DETALLES.length;i++){
        if($scope.datos.PTR_DETALLES[i].f01_det_DES_===undefined){
          $scope.datos.PTR_DETALLES[i].f01_det_DES_="1-Original";
          $scope.datos.PTR_DETALLES[i].f01_det_INT_="1-Original";
        }
        var desc = $scope.datos.PTR_DETALLES[i].f01_det_DES_.split('-');
        var integ= $scope.datos.PTR_DETALLES[i].f01_det_INT_.split('-');    
        var aporte = {"uno":$scope.datos.PTR_DETALLES[i].f01_det_DES_ ,"tres":$scope.datos.PTR_DETALLES[i].f01_det_INT_};           
        dataart[i]=aporte;      
      }
      var color = [
      {title: "primero", dataKey: "prim"}
      ];
      var dataor = [
      {"prim":preex1.innerText},
      {"prim":uso1.innerText},
      {"prim":hecho1.innerText},
      {"prim":fiestas1.innerText},
      {"prim":histor1.innerText},
      {"prim":fuent1.innerText}      
      ];
      var coldoc = [
      {title: "primero", dataKey: "prim"}
      ];
      var datadoc = [
      {"prim":preex1d.innerText},
      {"prim":uso1d.innerText},
      {"prim":hecho1d.innerText},
      {"prim":fiestas1d.innerText},
      {"prim":histor1d.innerText},
      {"prim":fuentes1d.innerText}      
      ];
      var colhis = [
      {title: "Indicador Histórico Cultural:", dataKey: "uno"}
      ];
      var datahis = [];
      var j=0;
      for (var i=0; i<$scope.datos.PTR_VALORHIS.length;i++){
        if($scope.datos.PTR_VALORHIS[i].estado){
          var aporte = {"uno":$scope.datos.PTR_VALORHIS[i].resvalor}; 
          datahis[j]=aporte;
          j++;
        }    
      }
      var colrte = [
      {title: "Indicador Artístico:", dataKey: "uno"}
      ];
      var datarte = [];
      var j=0;
      for (var i=0; i<$scope.datos.PTR_VALORART.length;i++){
        if($scope.datos.PTR_VALORART[i].estado){
          var aporte = {"uno":$scope.datos.PTR_VALORART[i].resvalor};          
          datarte[j]=aporte;
          j++;
        }    
      }
      var coltipo = [
      {title: "Indicador Tipológico:", dataKey: "uno"}
      ];
      var datatipo = [];
      var j=0;
      for (var i=0; i<$scope.datos.PTR_VALORARQ.length;i++){
        if($scope.datos.PTR_VALORARQ[i].estado){
          var aporte = {"uno":$scope.datos.PTR_VALORARQ[i].resvalor};          
          datatipo[j]=aporte;
          j++;
        }    
      }
      var coltec = [
      {title: "Indicador Tecnológico", dataKey: "uno"}
      ];
      var datatec = [];
      var j=0;
      for (var i=0; i<$scope.datos.PTR_VALORTEC.length;i++){
        if($scope.datos.PTR_VALORTEC[i].estado){
          var aporte = {"uno":$scope.datos.PTR_VALORTEC[i].resvalor};          
          datatec[j]=aporte;
          j++;
        }    
      }
      var colinte = [
      {title: "Indicador de Integridad", dataKey: "uno"}
      ];
      var datainte = [];
      var j=0;
      for (var i=0; i<$scope.datos.PTR_VALORINTG.length;i++){
        if($scope.datos.PTR_VALORINTG[i].estado){
          var aporte = {"uno":$scope.datos.PTR_VALORINTG[i].resvalor};          
          datainte[j]=aporte;
          j++;
        }    
      }
      var colurb = [
      {title: "Indicador Urbano", dataKey: "uno"}
      ];
      var dataurb = [];
      var j=0;
      for (var i=0; i<$scope.datos.PTR_VALORURB.length;i++){
        if($scope.datos.PTR_VALORURB[i].estado){
          var aporte = {"uno":$scope.datos.PTR_VALORURB[i].resvalor};          
          dataurb[j]=aporte;
          j++;
        }    
      }
      var colinta = [
      {title: "Indicador Simbólico", dataKey: "uno"}
      ];
      var datainta = [];
      var j=0;
      for (var i=0; i<$scope.datos.PTR_VALORINT.length;i++){
        if($scope.datos.PTR_VALORINT[i].estado){
          var aporte = {"uno":$scope.datos.PTR_VALORINT[i].resvalor};          
          datainta[j]=aporte;
        }    
      }
      var colsimb = [
      {title: "Indicador Simbólico", dataKey: "uno"}
      ];
      var datasimb = [];
      var j=0;
      for (var i=0; i<$scope.datos.PTR_VALORSIMB.length;i++){
        if($scope.datos.PTR_VALORSIMB[i].estado){
          var aporte = {"uno":$scope.datos.PTR_VALORSIMB[i].resvalor};          
          datasimb[j]=aporte;
          j++;
        }    
      }
      var colinsc = [
      {title: "primero", dataKey: "prim"}
      ];
      var datainsc = [
      {"prim":espconj1.innerText}     
      ];
      var colcrite = [
      {title: "primero", dataKey: "prim"}
      ];
      var chis1 = document.createElement('div');
      chis1.innerHTML = $scope.datos.PTR_CRITERHIS; 
      var cart1 = document.createElement('div');
      cart1.innerHTML = $scope.datos.PTR_CRITERART; 
      var carq1 = document.createElement('div');
      carq1.innerHTML = $scope.datos.PTR_CRITERARQ; 
      var ctec1 = document.createElement('div');
      ctec1.innerHTML = $scope.datos.PTR_CRITERTEC;
      var cint1 = document.createElement('div');
      cint1.innerHTML = $scope.datos.PTR_CRITERINT; 
      var curb1 = document.createElement('div');
      curb1.innerHTML = $scope.datos.PTR_CRITERURB; 
      var cinta1 = document.createElement('div');
      cinta1.innerHTML = $scope.datos.PTR_CRITERINTA; 
      var csim1 = document.createElement('div');
      csim1.innerHTML = $scope.datos.PTR_CRITERSIMB; 
      var datacrite = [
      {"prim":chis1.innerText},
      {"prim":cart1.innerText},
      {"prim":carq1.innerText},
      {"prim":ctec1.innerText},
      {"prim":cint1.innerText},
      {"prim":curb1.innerText},
      {"prim":cinta1.innerText},
      {"prim":csim1.innerText}

      ];

      var doc = new jsPDF('p', 'pt');

      var header = function (data) {
        doc.addImage(material,'JPEG', 35, 40, 525, 60);
         doc.setTextColor(0);
        doc.setFontStyle('bold');
        doc.setFontSize(9);
        doc.text('FICHA DE CATALOGACION DE ESPACIOS ABIERTOS',40,120);
        doc.text('NRO. FICHA: ',400,120);
        doc.setFontStyle('normal');
        doc.text($scope.datos.PTR_REG,470,120);
        doc.rect(390, 105, 170, 25);
      };
      var totalPagesExp = "{total_pages_count_string}";
      var numeropag = 0;
      var footer = function (data) {
        if(1 == data.pageCount){
          numeropag = numeropag + 1;
        }
        var str = "Página " + numeropag;
        if (typeof doc.putTotalPages === 'function') {
          str = str + " de " + totalPagesExp;
        }
        doc.text(str, 470, doc.internal.pageSize.height - 45);
          doc.text("Para cualquier consulta, por favor comunicarse al Telefono. 2-2440746", 40, doc.internal.pageSize.height - 45);
      };
      doc.setFontSize(8);
      doc.setFontStyle('bold');
      doc.text('I. IDENTIFICACIÓN',35,130);
      doc.text('1. PLANO DE UBICACIÓN',40,145);
      doc.rect(60, 155, 300, 200);
      doc.addImage(image1[0],'JPEG', 60, 155,300,200);
      doc.autoTable(coldato1.splice(0,4), datadato1, {drawHeaderRow: function() {return false;} ,
        startY: 365,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 110, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 90,fontStyle: 'bold'},seg: {columnWidth: 150},ter: {columnWidth: 100,fontStyle: 'bold'},cuar: {columnWidth: 140}},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {
          doc.autoTableText("2. DATOS GENERALES", 40, row.y + row.height / 2, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        }           
      },
    });
      doc.autoTable(coldato2, datadato2, {startY: doc.autoTableEndPosY() +5 ,headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 110, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 90,fontStyle: 'bold'},dos: {columnWidth: 390}}
    });

      doc.autoTable(coldato.splice(0,4), datadato, {drawHeaderRow: function() {return false;} ,startY: doc.autoTableEndPosY() +10,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 110, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {prim: {columnWidth: 90,fontStyle: 'bold'},seg: {columnWidth: 150},ter: {columnWidth: 100,fontStyle: 'bold'},cuar: {columnWidth: 140}},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {

          doc.autoTableText("3. DENOMINACIÓN DEL INMUEBLE" , 40, row.y + row.height / 2, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        }  else if (row.index === 1) {

          doc.autoTableText("4. LOCALIZACIÓN" , 40, row.y + row.height / 2, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        }   else if (row.index === 6) {

          doc.autoTableText("5. REGIMEN DE PROPIEDAD" , 40, row.y + row.height / 2, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        }            
      },
    });

      doc.text('6. USO DE SUELO',40,doc.autoTableEndPosY() +15);

      doc.autoTable(coluso, datauso,{startY: doc.autoTableEndPosY() +20,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 110, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 240},dos: {columnWidth: 100},tres: {columnWidth: 140}}});
      doc.text('7. SERVICIOS',40,doc.autoTableEndPosY() +15);

      doc.autoTable(colser, dataser,{startY: doc.autoTableEndPosY() +20,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 110, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 240},dos: {columnWidth: 240}}});
      doc.setFontSize(8);
      doc.setFontStyle('bold');
      doc.text('Otros Servicios:',50,doc.autoTableEndPosY() +10); 
      doc.setFontStyle('normal');
      doc.text(other,60,doc.autoTableEndPosY() +20); 
      doc.setFontSize(8);
      doc.setFontStyle('normal');
      doc.setFontSize(8);
      doc.setFontStyle('bold');
     
      doc.addPage();
      doc.text('II. MARCO LEGAL',35,135);
      if($scope.datos.PTR_FIGPRO ==-1)
        {$scope.datos.PTR_FIGPRO =" ";} 
      doc.text('Figura de Protección Legal:',50,150); 
      doc.setFontSize(8);
      doc.setFontStyle('normal');
      doc.text($scope.datos.PTR_FIGPRO,160,150);
      doc.setFontSize(8);
      doc.setFontStyle('bold');
      if($scope.datos.PTR_REFHIST ==-1)
        {$scope.datos.PTR_REFHIST =" ";} 
      doc.text('III. REFERENCIA HISTÓRICA',35,165);
      doc.text('Referencia Histórica:',50,180); 
      doc.setFontSize(8);
      doc.setFontStyle('normal');
      doc.text($scope.datos.PTR_REFHIST,160,180);
      doc.setFontSize(8);
      doc.setFontStyle('bold');
      doc.text('IV. DATOS ORALES',35,190);
      doc.text('Fecha de Construcción:',40,205); 
      doc.text('Autor/Constructor:',300,205); 
      doc.text('Propietarios::',40,220);
      doc.setFontStyle('normal');
      doc.rect(40, 195, 520, 30);
      doc.setFontSize(8);
      doc.setFontStyle('normal');
      doc.text($scope.datos.PTR_FECCONS,150,205);
      doc.text($scope.datos.PTR_AUTOR,400,205);
      doc.text($scope.datos.PTR_PROP,150,220);

      doc.autoTable(color.splice(0,2), dataor, {drawHeaderRow: function() {return false;},startY: 225,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'top'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {
          doc.autoTableText("Preexistencia/Edificación/Intervenciones:", 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index ===1 ) {

          doc.autoTableText("Usos Originales" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 2) {

          doc.autoTableText("Hechos Históricos/Personajes Distinguidos" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }   else if (row.index === 3) {

          doc.autoTableText("Fiestas Religiosas" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }    
        else if (row.index === 4) {

          doc.autoTableText("Datos Históricos del Conjunto" , 40, row.y+15 , {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } 
        else if (row.index === 5) {

          doc.autoTableText("Fuentes Bibliográficas" , 40, row.y+15 , {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }         
      },
    });
      doc.setFontSize(8);
      doc.setFontStyle('bold');
      doc.text('V. DATOS DOCUMENTALES',35,doc.autoTableEndPosY() +15);
      doc.text('Fecha de Construcción:',40,doc.autoTableEndPosY() +30); 
      doc.text('Autor/Constructor:',300,doc.autoTableEndPosY() +30); 
      doc.text('Propietarios::',40,doc.autoTableEndPosY() +45);
      doc.rect(40, doc.autoTableEndPosY() +20, 520, 35); 
      doc.setFontSize(8);
      doc.setFontStyle('normal');
      doc.text($scope.datos.PTR_FECCONST,150,doc.autoTableEndPosY() +30);
      doc.text($scope.datos.PTR_AUTCONST,400,doc.autoTableEndPosY() +30);
      doc.text($scope.datos.PTR_PROPIE,150,doc.autoTableEndPosY() +45);

      doc.autoTable(coldoc.splice(0,2), datadoc, {drawHeaderRow: function() {return false;},startY: doc.autoTableEndPosY() +50,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'top'},margin: {horizontal: 50, top: 130, bottom: 80},styles: {overflow: 'linebreak'},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {
          doc.autoTableText("Preexistencia/ Edificación/ Intervenciones:", 40, row.y+10, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        } else if (row.index ===1 ) {

          doc.autoTableText("Usos Originales" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 2) {
          doc.autoTableText("Hechos Históricos/ Personajes Distinguidos" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 3) {

          doc.autoTableText("Fiestas Religiosas" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }    
        else if (row.index === 4) {

          doc.autoTableText("Datos Históricos del Conjunto" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } 
        else if (row.index === 5) {

          doc.autoTableText("Fuentes Bibliográficas" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }         
      },
    });
      doc.setFontSize(8);
      doc.setFontStyle('bold');
      doc.text('VI. INSCRIPCIONES',35,doc.autoTableEndPosY() +15);

      doc.autoTable(colinsc.splice(0, 1), datainsc, {drawHeaderRow: function() {return false;}, startY: doc.autoTableEndPosY() +20,theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}        

      });
      doc.autoTable(colepo.splice(0,4), dataepo, {drawHeaderRow: function() {return false;},startY: doc.autoTableEndPosY() +1,pageBreak: 'auto',theme: 'mary',columnStyles: {prim: {columnWidth: 90,fontStyle: 'bold'},seg: {columnWidth: 150},ter: {columnWidth: 100,fontStyle: 'bold'},cuar: {columnWidth: 140}},bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {
          doc.setTextColor(0);
          doc.autoTableText("VII. EPOCA", 35, row.y+10, {
            halign: 'left',
            valign: 'botton'
          });
          data.cursor.y += 20;
        } else if (row.index ===2 ) {
          doc.setTextColor(0);
          doc.autoTableText("VIII. ESTILO" , 35, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 3) {
          doc.setTextColor(0);
          doc.autoTableText("VIII. DESCRIPCIÓN DEL AREA" , 35, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }   else if (row.index === 4) {
          doc.setTextColor(0);
          doc.autoTableText("1. TIPOLOGÍA" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }    
        else if (row.index === 5) {
          doc.setTextColor(0);
          doc.autoTableText("2. MUROS DE DELIMITACIÓN" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } 
      }
    });
      doc.setFontSize(8);
      doc.setFontStyle('bold');
      doc.text('3. REJAS',40,doc.autoTableEndPosY() +15);
      doc.setFontSize(8);
      doc.setFontStyle('normal');

      if($scope.datos.PTR_REJAEST ==-1)
        {$scope.datos.PTR_REJAEST =" ";} 
      if($scope.datos.PTR_ACAEST ==-1)
        {$scope.datos.PTR_ACAEST =" ";} 
      if($scope.datos.PTR_PINTEST ==-1)
        {$scope.datos.PTR_PINTEST =" ";} 
      if($scope.datos.PTR_PISOEST ==-1)
        {$scope.datos.PTR_PISOEST =" ";} 
      if($scope.datos.PTR_PUERTAEST ==-1)
        {$scope.datos.PTR_PUERTAEST =" ";} 
      if($scope.datos.PTR_MOBEST ==-1)
        {$scope.datos.PTR_MOBEST =" ";}
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);  
      doc.text($scope.datos.PTR_REJAEST,150,doc.autoTableEndPosY() +25);
      doc.autoTable(colreja, datareja,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      doc.text('4. ACABADOS DE MUROS',40,doc.autoTableEndPosY() +15);
      doc.setFontStyle('normal');
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);
      doc.text($scope.datos.PTR_ACAEST,150,doc.autoTableEndPosY() +25);
      doc.autoTable(colmuro, datamuro,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      doc.text('5. PINTURAS',40,doc.autoTableEndPosY() +15);
      doc.setFontStyle('normal');
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);
      doc.text($scope.datos.PTR_PINTEST,150,doc.autoTableEndPosY() +25);
      doc.autoTable(colpint, datapint,{startY: doc.autoTableEndPosY() +30,beforePageContent: header,afterPageContent: footer,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      doc.text('6. PISOS',40,doc.autoTableEndPosY() +15);
      doc.setFontStyle('normal');
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);
      doc.text($scope.datos.PTR_PISOEST,150,doc.autoTableEndPosY() +25);
      doc.autoTable(colpiso, datapiso,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      doc.text('7. PUERTAS DE ACCESO',40,doc.autoTableEndPosY() +15);
      doc.setFontStyle('normal');
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);
      doc.text($scope.datos.PTR_PUERTAEST,150,doc.autoTableEndPosY() +25);
      doc.autoTable(colpue, datapue,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      doc.text('8. MOBILIARIO URBANO',40,doc.autoTableEndPosY() +15);
      doc.setFontStyle('normal');
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);
      doc.text($scope.datos.PTR_MOBEST,150,doc.autoTableEndPosY() +25);
      doc.autoTable(colmob, datamob,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      doc.text('9. ESCALERAS',40,doc.autoTableEndPosY() +15);
      doc.setFontStyle('normal');
      if($scope.datos.PTR_ESCEST ==-1)
        {$scope.datos.PTR_ESCEST =" ";} 
      if($scope.datos.PTR_VEGEST ==-1)
        {$scope.datos.PTR_VEGEST =" ";}
      if($scope.datos.PTR_DETALLEST ==-1)
        {$scope.datos.PTR_DETALLEST =" ";}
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);
      doc.text($scope.datos.PTR_ESCEST,150,doc.autoTableEndPosY() +25);
      doc.autoTable(colesc, dataesc,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      doc.text('10. CARACTERISTICAS DE LA VEGETACIÓN',40,doc.autoTableEndPosY() +15);
      doc.setFontStyle('normal');
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);
      doc.text($scope.datos.PTR_VEGEST,150,doc.autoTableEndPosY() +25); 
      doc.autoTable(colveg, dataveg,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150},tres: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      doc.text('11. DETALLES ARTISTICOS',40,doc.autoTableEndPosY() +15);
      doc.setFontStyle('normal');
      doc.text('Estado de conservación',50,doc.autoTableEndPosY() +25);
      doc.text($scope.datos.PTR_DETALLEST,150,doc.autoTableEndPosY() +25);
      doc.autoTable(colart, dataart,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {uno: {columnWidth: 150},dos: {columnWidth: 150},tres: {columnWidth: 150}}});
      doc.setFontStyle('bold');
      m = doc.autoTableEndPosY() +15;
      if(m > 710){
        doc.addPage();
        m = 125;
      }
      doc.text('X.ESQUEMA ARQUITECTONICO',35,m +15);      
      doc.addImage(image1[1],'JPEG', 40, m +20,200,200);
      doc.text('XI.ANGULO VISUAL HORIZONTAL',350,m +15);
      doc.text('Vista Panoramica:',350,m +190);
      doc.text('Vista Parcial:',350,m +200);
      doc.text('Orientación:',350,m +210);
      doc.text('Otros:',350,m +220);
      doc.setFontStyle('normal');
      doc.text(parcial,420,m +190);
      doc.text(panoramica,420,m +200);
      doc.text($scope.datos.PTR_ANGOR,420,m +210);
      doc.text($scope.datos.PTR_ANGGRA,420,m +220);
      doc.addImage(image1[2],'JPEG', 350,m +20,150,150);
      doc.setFontStyle('bold');
      doc.text('XII.ELEMENTOS VISUALES',35,m +235);
      doc.autoTable(colvisual.splice(0,1), datavisual, {drawHeaderRow: function() {return false;},startY: m +235,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'top'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {
          doc.autoTableText("De izquierda a Derecha" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 1) {
          doc.autoTableText("A lo alto" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 2) {
          doc.autoTableText("A lo bajo" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 3) {
          doc.autoTableText("XIII. DESCRIPCIÓN DEL ENTORNO INMEDIATO" , 35, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }    
        else if (row.index === 4) {
          doc.autoTableText("XIV. DESCRIPCIÓN DEL ESPACIO" , 35, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } 
      }
    });
      doc.autoTable(colpato.splice(0,4), datapato, {drawHeaderRow: function() {return false;}, startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'mary',beforePageContent: header,afterPageContent: footer,bodyStyles: {rowHeight: 14, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {
          doc.autoTableText("XV. MEDIDAS" , 35, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 2) {
          doc.autoTableText("XVI. INFORMACIÓN ADICIONAL" , 35, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 3) {
          doc.autoTableText("XVII. PATOLOGIAS" , 35, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } 
      },columnStyles: {prim: {columnWidth: 90,fontStyle: 'bold'},seg: {columnWidth: 150},ter: {columnWidth: 100,fontStyle: 'bold'},cuar: {columnWidth: 140}}
    });
      doc.setFontStyle('bold');
      doc.text('XVIII. VALORACIÓN',35,doc.autoTableEndPosY() +15);
      doc.autoTable(colhis, datahis,{startY: doc.autoTableEndPosY() +30,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.autoTable(colrte, datarte,{startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.autoTable(coltipo, datatipo,{startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.autoTable(coltec, datatec,{startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.autoTable(colinte, datainte,{startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.autoTable(colurb, dataurb,{startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.autoTable(colsimb, datasimb,{startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.autoTable(colinta, datainta,{startY: doc.autoTableEndPosY() +5,pageBreak: 'auto',theme: 'plain',bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'},headerStyles: {fontStyle: 'bold', rowHeight: 12, fontSize: 8, valign: 'middle'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'}});
      doc.setFontStyle('bold');
      doc.text('XIX. CRITERIOS DE VALORACIÓN',35,doc.autoTableEndPosY() +15);
      doc.autoTable(colcrite.splice(0,4), datacrite, {drawHeaderRow: function() {return false;} ,
        startY: doc.autoTableEndPosY() +10,pageBreak: 'auto',theme: 'plain',beforePageContent: header,afterPageContent: footer,bodyStyles: {rowHeight: 14, fontSize: 8, valign: 'top'},margin: {horizontal: 50, top: 130, bottom: 75},styles: {overflow: 'linebreak'},drawRow: function (row, data) {doc.setFontStyle('bold'); doc.setFontSize(8);
        if (row.index === 0) {
          doc.setTextColor(0);
          doc.autoTableText("Indicador Histórico Cultural" , 40, row.y +15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 1) {
          doc.setTextColor(0);
          doc.autoTableText("Indicador Artístico" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        }  else if (row.index === 2) {
          doc.setTextColor(0);
          doc.autoTableText("Indicador Tipológico" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 3) {
          doc.setTextColor(0);
          doc.autoTableText("Indicador Tecnológico" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 4) {
          doc.setTextColor(0);
          doc.autoTableText("Indicador de Integridad" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 5) {
          doc.setTextColor(0);
          doc.autoTableText("Indicador Urbano" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 6) {
          doc.setTextColor(0);
          doc.autoTableText("Indicador Simbólico" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } else if (row.index === 6) {
          doc.setTextColor(0);
          doc.autoTableText("Indicador Simbólico" , 40, row.y+15, {
            halign: 'left',
            valign: 'middle'
          });
          data.cursor.y += 20;
        } 
      }
    });
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      //doc.save('espacioabierto'+'.pdf');
        $('#visorFu object').attr('data',doc.output('datauristring'));
        $("#divPopup4").modal('show');
    });
    obj.error(function(error) {
    });
  };

$scope.volvers = function() {
  $scope.panelbuscador=true;
  $scope.bloques=false;
  $scope.archivos=false;
};
$scope.eliminar = function(casos){
    var caso = {};
    caso['cas_estado'] = 'X';
    caso['cas_modificado'] = $scope.fechactual;
    caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
    var resProceso = {"table_name":"_fr_casos",
    "body":caso,
    "id":casos.casoid};
    var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
    obj.success(function(data){
      $scope.cargarfichas(casos.procid);
      sweet.show('', 'Registro eliminado', 'success');
    })
    .error(function(data){
      sweet.show('', 'Registro no eliminado', 'error');
    });
}
$scope.cargarfichas = function(datoson){
  //$.blockUI();  
  $scope.panelCasos=true;
  $scope.panelbuscador=true;
  var resDatos = {
    "procedure_name":"patrimoniolst",
    "body":{
      "params": [
      {
        "name": "ci",
        "value": ''
      },{
        "name": "campo",
        "value": ''
      } ,{
        "name": "proceso",
        "value": parseInt(datoson)
      } ,{
        "name": "tipo",
        "value": '1'
      }           
      ]
    }
  };
  var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resDatos);
  obj.success(function (response) {
    $.unblockUI(); 
    var data = response; 
    if(data[0].procodigo == 'PTR_CBI'){
    $scope.bloquess = true;
  }else {    
    $scope.bloquess = false;
  };
    if(data.length > 0){
      $scope.datosGrilla = response;
      for(var i = 0;i<response.length;i++){
        $scope.datosGrilla[i].casodato = JSON.parse($scope.datosGrilla[i].casodata);
      }
      $scope.conArchivo = "mostrar";
      $scope.sinArchivo = null;
    }else{
      $scope.datosGrilla = response;
      $scope.mensaje  =   "El dato no tiene fichas.";
    }
  }).error(function(results){ 
    $.unblockUI();
  });
}
$scope.datoscampos= function(datoson){
  $scope.procesonro = datoson;
  $scope.datosactividad(datoson);
  var resAccesos = {"table_name":"_fr_busquedas",
  "filter": "bsq_estado='A' and bsq_ws_id="+sessionService.get('WS_ID')+" and bsq_prs_id="+datoson+""};  
  var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(resAccesos);
  obj.success(function(data) {
    $scope.getbsq=data.record;
    $scope.getbsqss=data.record[0].bsq_nombre;
  }).error(function(error) {
  });
};
$scope.datosactividad= function(datoson){
  $scope.actividadActual = datoson;
  var res = { "table_name":"_fr_actividad",
  "filter": "act_estado='A' and act_prc_id="+datoson};  
  var obj = DreamFactory.api[CONFIG.SERVICE].getRecords(res);
  obj.success(function(data) {
    sessionService.set('ACTIVIDADRESUMENSIG', data.record[0].act_siguiente);
    sessionService.set('ACTIVIDADRESUMEN', data.record[0].act_id);
    sessionService.set('ACTIVIDADRESUMENORDEN', data.record[0].act_orden + "-" + data.record[0].act_nombre);
  }).error(function(error) {
  });
};
$scope.getcasos10 = function(datos){
  $.blockUI();
  var campo = datos.valor.toUpperCase();  
  $scope.panelCasos=true;
  $scope.panelbuscador=true;
  var resDatos = {
    "procedure_name":"patrimoniolst",
    "body":{
      "params": [
      {
        "name": "ci",
        "value": campo
      },{
        "name": "campo",
        "value": datos.campo
      } ,{
        "name": "proceso",
        "value": parseInt(datos.espacio)
      } ,{
        "name": "tipo",
        "value": '2'
      }           
      ]
    }
  };
  var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resDatos);
  obj.success(function (response) {
    var data = response; 
    if(data.length > 0){
      $scope.datosGrilla = response;
      for(var i = 0;i<response.length;i++){
        $scope.datosGrilla[i].casodato = JSON.parse($scope.datosGrilla[i].casodata);
      }
      $scope.conArchivo = "mostrar";
      $scope.sinArchivo = null;
    }else{
      $scope.mensaje  =   "El dato no tiene fichas.";
    }
    $.unblockUI(); 
  }).error(function(results){  
    $.unblockUI();
  });
}; 
$scope.busquedaAtenderCaso = function(datoson, estado){
  datoson.casoactid = sessionService.get('ACTIVIDADRESUMEN');
  datoson.tiempo = "FUTURO";
  datoson.actsigid = sessionService.get('ACTIVIDADRESUMENSIG');;
  datoson.actnombre = sessionService.get('ACTIVIDADRESUMENORDEN');;
  datoson.casonro = datoson.casnrocaso;
  datoson.casonombre = datoson.casnombrecaso;
  $scope.atenderCaso(datoson, estado);
}
$scope.obtCasos = "";
$scope.getCasos = function(){
  var resOpcion = {
    "procedure_name":"casoslst",
    "body":{
      "params": [
      {
        "name": "id_nodo",
        "value": sessionService.get('IDNODO')
      },
      {
        "name": "id_ws",
        "value": sessionService.get('WS_ID')
      }
      ]
    }
  };
  var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
  .success(function (response){
    $scope.obtCasos=response;
    var data = response;  
  }).error(function(error) {
    $scope.errors["error_rol"] = error;
  });
};
$scope.getDatos = function(tablaNombre){
  var promise;
  var resGestion = {
    "table_name":tablaNombre
  };
  var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resGestion);
  obj.success(function (data) {
    $scope.promise=data.record;
  })
  obj.error(function(error) {
    defered.reject(error);
  });
};
$scope.getProcesos = function(){
  var resOpcion = {
    function_name: "lst_procesos_workspace",
    body:{
      "params": [
      {
        "name": "workspace_id",
        "value": sessionService.get('WS_ID')
      }
      ]
    }
  };
  DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
    $scope.obtProcesos=response;
    $scope.obtProceso=response;
    var data = response;  
    angular.forEach($scope.obtProcesos,function(val, index){
      if($scope.sIdProcesoActual == val.procid){
        $scope.mostrardepuracion = val.pdepuracion;
        if($scope.mostrardepuracion){
          $scope.classPropiedadesFormulario = "col-md-3";
          $scope.classCuerpo = "col-md-9";
          $scope.btnBlock_1   = true;
          $scope.btnBlock_2   = false;
        }else{
          $scope.classPropiedadesFormulario = "col-md-0";
          $scope.classCuerpo = "col-md-12";
        }
      }
    });
    $scope.tablaProcesos = new ngTableParams({
      page: 1,          
      count: 5,
      filter: {},
      sorting: {}      
    }, {
      total: $scope.obtProceso.length,
      getData: function($defer, params) {
        var filteredData = params.filter() ?
        $filter('filter')($scope.obtProceso, params.filter()) :
        $scope.obtProceso;              
        var orderedData = params.sorting() ?
        $filter('orderBy')(filteredData, params.orderBy()) :
        $scope.obtProceso;
        params.total(orderedData.length);
        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                 
      }
    });
    $.unblockUI();      
  }).error(function(error) {
    $scope.errors["error_rol"] = error;
  });
};
$scope.volver = function(){
  if ($scope.estadoCaso=="ACTIVIDAD") {
    $location.path('formularios|reportes|patrimonio|patrimonio.html');
    location.reload();
  } else {
    $scope.tituloP='Mis Casos';
    $scope.panelCasos=true;
    $scope.panelFormularios=false;
    $scope.panelbuscador = true;
    $route.reload();            
  }
}

$scope.atenderCaso = function(caso,estadoT){
  $scope.estadoCaso = estadoT; 
  if (estadoT == "RESUMEN") {
    sessionService.set("TRAMITE_ACTUAL", caso.casonombre);
    $scope.getProcesos(); 
    $scope.sIdProcesoActual = caso.procid;
    $scope.sCasoNro = caso.casonro;
    $scope.sCasonombre = caso.casonombre;
    $scope.sCasoNombre = caso.actnombre;
    $scope.sIdCaso = caso.casoid;
    $scope.sProcNombre = caso.procnombre;
    sessionService.set('DATOSTRAMITE',JSON.stringify(caso).toString());
    $scope.panelbuscador=false;
    $scope.casoActual=caso;
    $scope.seleccionado=true;
    $scope.tituloP='FICHA: '+caso.casonombre;
    $scope.datos=JSON.parse(caso.casodata);
    $scope.trmFormulario = $scope.datos;
    $scope.impFormulario = JSON.parse(caso.casodata);
    $scope.panelCasos=false;
    $scope.panelbuscador=false;
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
      $scope.panelbuscador=false;
      $scope.casoActual=caso;
      $scope.seleccionado=true;
      $scope.tituloP='FICHA: '+caso.casonombre;
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
        $scope.panelbuscador=false;
        $scope.casoActual=caso;
        $scope.seleccionado=true;
        $scope.tituloP='FICHA: '+caso.casonombre;
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
            sweet.show('', "Ficha recibida", 'success');
            $scope.getCasos();
          }
          if(estadoT == 'dejar')
          {
            sweet.show('', "Ficha Dejado", 'success');
            $route.reload();
            $scope.getCasos();
          }
        } else {
          sweet.show('', "La Ficha ya fue recibido por otro usuario", 'error');
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
    $scope.cargarDatos=function(datos){
      $scope.datosHistorico=datos;
      $scope.datos=datos;
      $scope.datos.g_tipo=$scope.casoActual.procodigo;
      $scope.datos.AE_NRO_CASO=$scope.sCasonombre;
      if($scope.datos.INT_TIPO_DOC_IDENTIDAD=="NIT"){
        $scope.datos.INT_TIPO_DOC_IDENTIDAD="NT"
      }
      if($scope.datos.INT_TIPO_DOC_IDENTIDAD=="RC"){
        $scope.datos.INT_TIPO_DOC_IDENTIDAD="RUC"
      }

      if ($scope.datos.INT_TIP_VIA=="AVENIDA") {
        $scope.datos.INT_VIA="AV";
        $scope.datos.INT_TIP_VIA="AV";
      }

      if ($scope.datos.INT_TIP_VIA=="CALLE") {
        $scope.datos.INT_VIA="CA";
        $scope.datos.INT_TIP_VIA="CA";
      }

      if ($scope.datos.INT_TIP_VIA=="CALLEJON") {
        $scope.datos.INT_VIA="CL";
        $scope.datos.INT_TIP_VIA="CL";
      }

      if ($scope.datos.INT_TIP_VIA=="CANCHA") {
        $scope.datos.INT_VIA="CN";
        $scope.datos.INT_TIP_VIA="CN";
      }

      if ($scope.datos.INT_TIP_VIA=="PARQUE") {
        $scope.datos.INT_VIA="PR";
        $scope.datos.INT_TIP_VIA="PR";
      }

      if ($scope.datos.INT_TIP_VIA=="PLAZA") {
        $scope.datos.INT_VIA="PL";
        $scope.datos.INT_TIP_VIA="PL";
      }

      if ($scope.datos.INT_TIP_VIA=="NO DEFINIDO") {
        $scope.datos.INT_VIA="ND";
        $scope.datos.INT_TIP_VIA="ND";
      }

      if ($scope.datos.INT_TIP_VIA=="PASAJE") {
        $scope.datos.INT_VIA="PA";
        $scope.datos.INT_TIP_VIA="PA";
      }
    }
    $scope.mensajeError = function(mensaje) {
      sweet.show('Campos obligatorios', mensaje, 'error');
    }
    $scope.datosRender = function() {
        //$.blockUI();
        var sDataSession    =   sessionService.get('DATOSTRAMITE');
        var sNumCasoNombre =   "";
        if(sDataSession){
            sNumCasoNombre =   JSON.parse(sDataSession).casonombre;
        }
        var multi_datos = document.renderForm.elements;
        var caso = {};
        try{
            data = '"{';
            if(multi_datos.length > 0 )
            {
                for (var i = 0; i < multi_datos.length; i++) {
                    nombreCampo = multi_datos[i].id;
                    valorCampo = multi_datos[i].value;
                    tipo = multi_datos[i].type;
                    if (multi_datos[i].type!="checkbox") {
                        if (multi_datos[i].style.cssText == "visibility: hidden;"){
                            //caso de la grilla usando un textarea
                            campo = multi_datos[i].id;
                            if (document.getElementById(campo).value != "undefined"){
                                datos = JSON.parse(document.getElementById(campo).value);
                                nuevosDatos = JSON.stringify(datos);
                                X = new RegExp("null,", "g");
                                Y = new RegExp(",null", "g");
                                Z = new RegExp("null", "g");
                                nuevosDatos = nuevosDatos.replace(X,"");
                                nuevosDatos = nuevosDatos.replace(Y,"");
                                nuevosDatos = nuevosDatos.replace(Z,"");
                                data = data + '"'+ nombreCampo +'": '+ nuevosDatos +', ';
                            } else {
                                data = data + '"'+ nombreCampo +'": [], ';
                            }
                        } else {
                            if (multi_datos[i].type=="radio"){
                                //caso de radio button
                                var multi_radio = document.renderForm.elements[multi_datos[i].name];
                                i = i + multi_radio.length-1;
                                data = data + '"'+ nombreCampo +'": "'+ multi_radio.value +'", ';
                            } else  if (tipo=="file") {
                                if(multi_datos[i].files[0] === undefined){
                                    $scope.direccionvirtual= CONFIG.APIURL +"/files/" + $scope.sIdProcesoActual + "/" + $scope.sIdCaso + "/";
                                    data = data+ '"'+nombreCampo +'":"'+$scope.direccionvirtual+multi_datos[i].name+'?app_name=todoangular",';
                                }
                                else{
                                   $scope.direccionvirtual= CONFIG.APIURL +"/files/" + $scope.sIdProcesoActual + "/" + $scope.sIdCaso + "/";
                                    var direccion = fileUpload.uploadFileToUrl(multi_datos[i].files[0], $scope.direccionvirtual);
                                    var z=valorCampo.split('\\');
                                    if (z[2] === undefined){
                                         data = data+ '"'+nombreCampo +'":"'+$scope.direccionvirtual+valorCampo+'?app_name=todoangular",';
                                    }
                                    else{
                                         data = data+ '"'+nombreCampo +'":"'+$scope.direccionvirtual+z[2]+'?app_name=todoangular",';
                                    }
                                 }
                            } else {
                                //caso para text, textarea, campo oculto, etc
                                if (document.getElementById(nombreCampo+"_ifr")){
                                    var iFrame =  document.getElementById(nombreCampo+"_ifr");
                                    var iFrameBody;
                                    if ( iFrame.contentDocument )
                                    { // FF
                                        iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
                                        valorCampo = iFrameBody.outerHTML;
                                        quitarComillas = new RegExp('"', "g");
                                        valorCampo = valorCampo.replace(quitarComillas,"'");
                                    }
                                    else if ( iFrame.contentWindow )
                                    { // IE
                                        iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
                                        valorCampo = iFrameBody.outerHTML;
                                        quitarComillas = new RegExp('"', "g");
                                        valorCampo = valorCampo.replace(quitarComillas,"'");
                                    }
                                }

                                if (nombreCampo){
                                    data = data + '"'+ nombreCampo +'": "'+ valorCampo +'", ';
                                }
                            }
                        }
                    } else {
                        var multi_radio = document.renderForm.elements[multi_datos[i].id];
                        if (multi_radio.length > 1){
                            //checkbox multiples
                            valorCHK='{"tipo":"CHKM"},';
                            for (var j = 0; j < multi_radio.length; j++) {
                                //contador = contador + 1;
                                nombreCampoInterno = multi_radio[j].id;
                                valorCampoInterno = multi_radio[j].value;
                                seleccionadoI = multi_radio[j].checked;
                                if (seleccionadoI ==true) {
                                    valorCampoCHKI = "true";
                                } else {
                                    valorCampoCHKI = "false";
                                }
                                partesI = valorCampoInterno.split("_");
                                valorCHK = valorCHK + '{"resid": ' + partesI[0]+ ', "estado": ' + valorCampoCHKI + ', "resvalor": "' + partesI[1]+ '"},';
                            }
                            i = i + multi_radio.length - 1;
                            valorCHK = valorCHK.substring(0, valorCHK.length -1);
                            valorCHK = '"' + nombreCampo +'":[' + valorCHK +'],';
                            data = data + valorCHK;
                        } else {

                            nombreCampoInterno = multi_datos[i].id;
                            valorCampoInterno = multi_datos[i].value;
                            seleccionadoI = multi_datos[i].checked;
                            partesI = valorCampoInterno.split("_");
                            if (partesI.length > 1){
                                if (seleccionadoI ==true) {
                                    valorCampoCHKI = "true";
                                } else {
                                    valorCampoCHKI = "false";
                                }
                                valorCHK = '{"tipo":"CHKM"}, {"resid": ' + partesI[0]+ ', "estado": ' + valorCampoCHKI + ', "resvalor": "' + partesI[1]+ '"}';
                                valorCHK = '"' + nombreCampoInterno +'":[' + valorCHK +'],';
                                data = data + valorCHK;

                            } else {
                                if (seleccionadoI ==true) {
                                    valorCampoCHKI = "true";
                                } else {
                                    valorCampoCHKI = "false";
                                }
                                data = data + '"'+ nombreCampoInterno +'": [{"tipo":"CHK"},{"valor": "'+ valorCampoCHKI +'"}], ';
                            }


                        }
                    }
                }
                angular.forEach($scope.datos,function(cel, fil){
                    swDatos = 0;
                    for (var i = 0; i < multi_datos.length; i++) {
                        nombreCampo = multi_datos[i].id;
                        valorCampo = multi_datos[i].value;
                        if (fil==nombreCampo){
                            i = multi_datos.length
                            swDatos = 1;
                        }
                    }
                    if (swDatos == 0){
                        valorData = JSON.stringify(cel);
                        if (valorData) {
                            var patt = valorData.substring(0, 1);
                            var patt1 = valorData.substring(valorData.length-1,valorData.length);
                            if (patt=="[" && patt1=="]"){
                                data = data + '"' + fil + '":' + valorData + ', ';
                            } else{
                                valorData = valorData.substring(1, valorData.length -1);
                                data = data + '"' + fil + '":"' + valorData + '", ';
                            }
                        }
                    }
                });
                data = data + '"AE_NRO_CASO":"' + sNumCasoNombre + '", ';
                data = data.substring(0, data.length -2);
                data = data + '}"';
                data = data.substring(1, data.length -1);
                data = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
                caso['cas_datos'] = data;
                caso['cas_modificado'] = $scope.fechactual;
                caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
                $scope.datosSerializados = data;
                $.unblockUI();
              }
        }catch(e){
            $.unblockUI();
        }
        var resProceso = {"table_name":"_fr_casos",
                        "body":caso,
                        "id":$scope.casoActual.casoid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
        obj.success(function(data){
            $scope.getCasos();
            $scope.evalReglasFormulario();
            $scope.datos=JSON.parse($scope.datosSerializados);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado, verifique los datos del Formulario', 'error');
        });
    }

    $scope.guardarData=function(datos){
      var datosSerializados = JSON.stringify(datos);
      $scope.datosSerializados = JSON.stringify(datos);
      var caso = {};
      caso['cas_datos'] = datosSerializados;
      caso['cas_modificado'] = $scope.fechactual;
      caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
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
    $scope.evalReglasAvanzar=function(){
      console.log("avanzar 5597");
      if($scope.datosSerializados){
        $scope.resp;
        $scope.data = JSON.parse($scope.datosSerializados);
      }
      else{
        $scope.resp;
        $scope.data = $scope.datos;
      }
      var sigActividad = "";
      var aRespuesta = '';
      angular.forEach($scope.obtReglas,function(cel, fil){
        var sReglaAct    = cel['regregla'];
        var sReglaEvaluada = false;
        var flags = "gi";
        angular.forEach($scope.data,function(campoVarlor, campoNombre){
          if(sReglaAct.indexOf(campoNombre) != -1 ){
            asignarValor = new RegExp('#'+campoNombre+'#', "g");
            sReglaAct = sReglaAct.replace(asignarValor,campoVarlor);
          }
        });
        sReglaEvaluada = eval(sReglaAct);
        if(sReglaEvaluada){
          aRespuesta=cel['regsig'];
        }
      });
      
            
      if(aRespuesta!=''){
        $scope.resp = aRespuesta;
        $scope.derivarOtro();
      } else {
        console.log($scope.estadoCaso);
        if ($scope.estadoCaso=="ACTIVIDAD") {
          sweet.show('', 'Ficha Actualizada', 'success');
          $location.path('formularios|reportes|patrimonio|patrimonio.html');
          location.reload();
        } else {
          $scope.cerrarCaso();
        }

      }      
    }
    $scope.evalReglasFormularioEntradaResumen = function(item){
      var sFormMostrar = "";
      $scope.formSigId=null;
      $scope.datos.g_tipo = sessionService.get("TIPO_PROCESO");
      $scope.datos.AE_NRO_CASO = sessionService.get("TRAMITE_ACTUAL");
      if ($scope.casoActual.casonombre){
      } else {
        $scope.casoActual.casonombre = $scope.datos.AE_NRO_CASO;
      }
      $scope.data = $scope.datos;
      $scope.publicid =[];
      $scope.publicid = $scope.datos.publicidad;
      $scope.obtReglasForm = JSON.parse(true);
      $scope.cargarFormularioCargarResumen(item);

    };

    $scope.evalReglasFormularioEntrada = function(){
      var sFormMostrar = "";
      $scope.formSigId=null;
      $scope.datos.g_tipo = sessionService.get("TIPO_PROCESO");
      $scope.datos.AE_NRO_CASO = sessionService.get("TRAMITE_ACTUAL");
      if ($scope.casoActual.casonombre){
      } else {
        $scope.casoActual.casonombre = $scope.datos.AE_NRO_CASO;
      }
      $scope.data = $scope.datos;
      $scope.publicid =[];
      $scope.publicid = $scope.datos.publicidad;
      $scope.obtReglasForm = JSON.parse($scope.reglasFormulario);
      angular.forEach($scope.obtReglasForm,function(celda, fila){
        if(celda['regftipo']=='ENTRADA')
          {   var sReglaForm = celda['regfregla'];
        var sReglaEvaluada = false;
        var flags = "gi";
        angular.forEach($scope.data,function(campoValor, campoNombre){
          if(sReglaForm.indexOf(campoNombre) != -1 ){
            var regex = new RegExp('#'+campoNombre+'#', flags);
            sReglaForm = sReglaForm.replace(regex, campoValor);
          }
        });
        sReglaEvaluada = eval(sReglaForm);
        if(sReglaEvaluada){
          $scope.formSigId=celda['regfsiguiente'];
        }
      }
    });
      if($scope.formSigId) {
        $scope.cargarFormularioCargar($scope.formSigId)
        $scope.memoria[$scope.contador]=$scope.formSigId;
        $scope.contador++;
      } else {
        var caso = {};
        if($scope.casoActual.actsigid==0 ) {
          $scope.evalReglasAvanzar();
        } else {
          $scope.derivar();
        }
      }
    };

    $scope.evalReglasFormulario = function(){
      console.log("REGLAS 5699")
      
      var sFormMostrar = "";
      $scope.formSigId=null;
      $scope.data = JSON.parse($scope.datosSerializados);
      $scope.obtReglasForm = JSON.parse($scope.reglasFormulario);
      angular.forEach($scope.obtReglasForm,function(celda, fila){
        if(celda['regftipo']=='SALIDA')
        {
          var sReglaForm = celda['regfregla'];
          var sReglaEvaluada = false;
          var flags = "gi";
          angular.forEach($scope.data,function(campoValor, campoNombre){
            if(sReglaForm.indexOf(campoNombre) != -1 ){
              asignarValor = new RegExp('#'+campoNombre+'#', "gi");
              sReglaForm = sReglaForm.replace(asignarValor,campoValor);
            }
          });
          sReglaEvaluada = eval(sReglaForm);
          if(sReglaEvaluada){
            $scope.formSigId=celda['regfsiguiente'];
          }
        }
      });
      if($scope.formSigId){
        $scope.cargarFormularioCargar($scope.formSigId)
        $scope.memoria[$scope.contador]=$scope.formSigId;
        $scope.contador++;
      }
      else{
        var caso = {};
        if($scope.casoActual.actsigid==0 ){
          $scope.evalReglasAvanzar();
        } else {
          if ($scope.estadoCaso=="ACTIVIDAD") {
            sweet.show('', 'Ficha Actualizada', 'success');
            $location.path('formularios|reportes|patrimonio|patrimonio.html');
            location.reload();
          } else {
            $scope.derivar();
          }
        }
      }
    };

    $scope.derivarOtro=function(){
      var datosSerializados = JSON.stringify($scope.datos);
      sweet.show({
        title: 'Derivar',
        text: 'Esta seguro de Cerrar la ficha?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'SI',
        closeOnConfirm: false
      }, function() {
        sweet.close();
        if(sessionService.get('US_IDMACRO') == 'null')
        {
          $scope.macro_id=0;
        }
        else{
          $scope.macro_id=sessionService.get('US_IDMACRO');
        }
        var resOpcion = {
          "procedure_name":"derivar_macro",
          "body":{
            "params": [
            {
              "name": "actid",
              "value": $scope.resp
            },{
              "name": "usrid",
              "value": sessionService.get('IDUSUARIO')
            },{
              "name": "casoid",
              "value": $scope.casoActual.casoid
            },{
              "name": "datoshistorico",
              "value": datosSerializados
            },{
              "name": "nrocaso",
              "value": $scope.casoActual.casonro
            },{
              "name": "nodoid",
              "value": sessionService.get('IDNODO')
            },{
              "name": "macro_id",
              "value": $scope.macro_id
            }
            ]
          }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
        obj.success(function(data){
          sweet.show('', 'Ficha Derivada', 'success');
          $scope.getCasos();
          $scope.volver();
        })
        .error(function(data){
          sweet.show('', 'Ficha no Derivada', 'error');
        });
      });
    }
    $scope.derivar=function(){
      var datosSerializados = JSON.stringify($scope.datos);
      sweet.show({
        title: 'Derivar',
        text: 'Esta seguro de Cerrar la Ficha?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'SI',
        closeOnConfirm: false
      }, function() {
        sweet.close();
        if(sessionService.get('US_IDMACRO') == 'null')
        {
          $scope.macro_id=0;
        }
        else{
          $scope.macro_id=sessionService.get('US_IDMACRO');
        }
        var resOpcion = {
          "procedure_name":"derivar_macro",
          "body":{
            "params": [
            {
              "name": "actid",
              "value": $scope.casoActual.actsigid
            },{
              "name": "usrid",
              "value": sessionService.get('IDUSUARIO')
            },{
              "name": "casoid",
              "value": $scope.casoActual.casoid
            },{
              "name": "datoshistorico",
              "value": datosSerializados
            },{
              "name": "nrocaso",
              "value": $scope.casoActual.casonro
            },{
              "name": "nodoid",
              "value": sessionService.get('IDNODO')
            },{
              "name": "macro_id",
              "value": $scope.macro_id
            }
            ]
          }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
        obj.success(function(data){
          sweet.show('', 'Ficha Derivada', 'success');
          $scope.getCasos();
          $scope.volver();
        })
        .error(function(data){
          sweet.show('', 'Ficha no Derivada', 'error');
        });
      });
    }
    $scope.cerrarCaso=function(){
      sweet.show({
        title: 'Cerrar',
        text: 'Esta seguro de Cerrar la Ficha?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'SI',
        closeOnConfirm: false
      }, function() {
        sweet.close();
        var caso = {};
        caso['cas_estado'] = 'B';
        caso['cas_modificado'] = $scope.fechactual;
        caso['cas_usr_id'] = sessionService.get('IDUSUARIO');
        var resProceso = {"table_name":"_fr_casos",
        "body":caso,
        "id":$scope.casoActual.casoid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resProceso);
        obj.success(function(data){
          sweet.show('', 'Cerrado', 'success');
          $scope.getCasos();
          $scope.volver();
        })
        .error(function(data){
          sweet.show('', '', 'error');
        });
      });
    }

    $scope.cargarFormularioResumen = function(item,posicion){
      $scope.tituloForm = item.formurl;
      $scope.formularioSeleccionado=item.formid;
      $scope.evalReglasFormularioEntradaResumen(item);
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
      //$.blockUI();
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
              value.data= value.data.replace(nombreCampo,"'"+$scope.datos.AE_NRO_CASO+"'");
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
    /*
    $scope.obtenerDataNuevo = function(formulario, idForm) {
      $scope[name] = 'Running';
      var deferred = $q.defer();
      //$.blockUI();
      var resDatos = {
        "procedure_name":"sp_lst_get_json_sql",
        "body":{
          "params": [
          {
            "name": "id_form",
            "value": formulario
          }

          ]
        }
      }; 
      var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resDatos);
      obj.success(function (response) {
        resultado = response[0].campo_descripcion;
        $scope.datadocumentos = JSON.parse(response[0].campo_descripcion);
        var i=0;
        $scope.array=[];
        try {
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
                var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery);
                obj.success(function (response){
                  $scope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                })
                obj.error(function(error) {
                  $scope.errors[value.campo] = error;
                  $scope.array[value.campo] = "";            
                });
              } else {
                if (value.tipo_llenado == "SQL2") {
                  nombreCampo = new RegExp("@TRAMITE@", "g");
                  value.data= value.data.replace(nombreCampo,"'"+$scope.datos.AE_NRO_CASO+"'");
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
                  var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resQuery);
                  obj.success(function (response){
                    $scope.array[value.campo] = JSON.parse(response[0].sp_reporte_dinamico123);
                  })
                  obj.error(function(error) {
                    $scope.errors[value.campo] = error;
                    $scope.array[value.campo] = "";                    
                  });
                } else {
                  $scope.array[value.campo] = value.data;
                }
              }
            } else {
              $scope.array[value.campo] = "";
            }
          }, log)
          $q.all($scope.datadocumentos).then(function(data){
            $scope.datosBD = $scope.array;
            $scope.template = '../../../app/view/formularios/formularios/'+idForm;
            $scope.tituloForm = '../../../app/view/formularios/formularios/'+idForm;
            $.unblockUI();
            deferred.resolve($scope.array);  
          });

        } catch(e) {
        }   
      });
      return deferred.promise;
    }
    */
    $scope.obtenerDataNuevo = function(formulario, idForm) {
        $scope[name] = 'Running';
        var deferred = $q.defer();
            $.blockUI();
            var resDatos = {
                "procedure_name":"sp_lst_get_json_sql",
                "body":{
                    "params": [
                        {
                            "name": "id_form",
                            "value": formulario
                        }

                    ]
                }
            };
            var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resDatos);
            obj.success(function (response) {
                resultado = response[0].campo_descripcion;
                $scope.datadocumentos = JSON.parse(response[0].campo_descripcion);
                var i=0;
                $rootScope.array=[];
                try {
                    angular.forEach($scope.datadocumentos, function(value, key) {
                        if (value.tipo_llenado){
                            if (value.tipo_llenado == "SQL") {
                                
                                try {
                                    var rData = new renderData();
                                    rData.sql = value.data;
                                    rData.renderSqlDinamic(function(response){
                                        x = JSON.parse(response);
                                        $rootScope.array[value.campo] = x.success.data[0].sp_reporte_dinamico123;
                                    });
                                } catch(error) {
                                    $scope.errors[value.campo] = error;
                                    $rootScope.array[value.campo] = "";
                                }
                            } else {
                                if (value.tipo_llenado == "SQL2") {
                                nombreCampo = new RegExp("@TRAMITE@", "g");
                                console.log("Sin reemplazo", value.data);
                                value.data= value.data.replace(nombreCampo,"'"+$scope.datos.AE_NRO_CASO+"'");
                                console.log("Con reemplazo", value.data);
                                try {
                                    var rData = new renderData();
                                    rData.sql = value.data;
                                    rData.renderSqlDinamic(function(response){
                                        x = JSON.parse(response);
                                        $rootScope.array[value.campo] = x.success.data[0].sp_reporte_dinamico123;
                                        console.log("Resultado",$rootScope.array[value.campo]);
                                    });
                                } catch(error) {
                                    $scope.errors[value.campo] = error;
                                    $rootScope.array[value.campo] = "";
                                }
                            } else {
                                $rootScope.array[value.campo] = value.data;
                            }
                            }
                        } else {
                            $rootScope.array[value.campo] = "";
                        }
                    }, log)
                    $q.all($scope.datadocumentos).then(function(data){
                        $scope.datosBD = $rootScope.array;
                        $scope.template = '../../../app/view/formularios/formularios/'+idForm;
                        $scope.tituloForm = '../../../app/view/formularios/formularios/'+idForm;
                        $.unblockUI();
                        deferred.resolve($rootScope.array);
                    });
                } catch(e) {
                    console.log("excepcion",nombreCampo);
                }
            });
        return deferred.promise;
    } 
    $scope.cargarFormularioCargarResumen=function(resumen){
      formid = resumen[0].formid;
      $scope.template ='';
      angular.forEach(resumen,function(celda, fila){

        if(celda['formid']==formid){
          cadVariables = celda['formurl']; 
              arrVariables = cadVariables.split("?");
          if (arrVariables[1]) {
            $scope.miPropioFormulario = arrVariables[1];

            var arregloDatos = $scope.obtenerDataNuevo($scope.miPropioFormulario, arrVariables[0]);
            arregloDatos.then(function(respuesta) {
              $scope.formularioSeleccionado=celda['formid'];
              $scope.reglasFormulario=celda['formreglas'];
            }, function(reason) {
              alert('Failed: ' + reason);
            });
          } else {
            $scope.template = '../../../app/view/formularios/formularios/'+celda['formurl'];
            $scope.tituloForm = '../../../app/view/formularios/formularios/'+celda['formurl'];
            $scope.formularioSeleccionado=celda['formid'];
            $scope.reglasFormulario=celda['formreglas'];
          }
        }
      });
    };
    $scope.cargarFormularioCargar=function(formid){
      $scope.template ='';
      angular.forEach($scope.obtFormularios,function(celda, fila){
        if(celda['formid']==formid){
          cadVariables = celda['formurl']; 
              arrVariables = cadVariables.split("?");
          if (arrVariables[1]) {
            $scope.miPropioFormulario = arrVariables[1];
            var arregloDatos = $scope.obtenerDataNuevo($scope.miPropioFormulario, arrVariables[0]);
            arregloDatos.then(function(respuesta) {
              $scope.formularioSeleccionado=celda['formid'];
              $scope.reglasFormulario=celda['formreglas'];
            }, function(reason) {
              alert('Failed: ' + reason);
            });
          } else {
            $scope.template = '../../../app/view/formularios/formularios/'+celda['formurl'];
            $scope.tituloForm = '../../../app/view/formularios/formularios/'+celda['formurl'];
            $scope.formularioSeleccionado=celda['formid'];
            $scope.reglasFormulario=celda['formreglas'];
          }
        }
      });
    };
    $scope.volverFormulario = function(){
      $scope.cargarFormularioCargar($scope.memoria[$scope.contador-2]);
      $scope.contador=$scope.contador-1;
    }
    $scope.limpiar = function(){
      $scope.datosCasoData = '';
      $scope.datosCaso = '';
      $scope.boton="new";
      $scope.desabilitado = false;
      $scope.titulo="CREAR FICHA";
      $scope.procesoSeleccionado='';
      $scope.procesoid='';
      $scope.datos = "";
      $scope.getProcesos();
      $scope.botontit="Siguiente";
      $scope.procventana=true;
      $scope.sig=false;
      $scope.inicioNexoValidarBtn();
      $scope.desabilitadoRc=false;
      $scope.botoncerrar="cerrar";
      $scope.tipo_hr='';
      $scope.datos.RC_NIT='';
      $scope.tipoPersonaRc=""; 
      $scope.datos.INT_RL_NUM_DOCUMENTO='';
    };
    $scope.inicioNexoValidarBtn = function(){
      $scope.desabilitadoFormulario = true;
      $scope.camposRcEncontrados = false;
      $scope.isActive = true;
      $scope.btnClass = "warning";
      $scope.btnActulizarClass = "success";
      $scope.btnMostrarRcConsulta = true;
      $scope.btnMostrarRcActualizar = false;
      $scope.spanOcultarMostrarExito = false;
      $scope.spanOcultarMostrarFracaso = false;
      $scope.desabilitadoFormularioJuridico = true;
    };
    $scope.seleccionarProceso = function(proceso){
      $scope.procesoSeleccionado=proceso.procid;
      $scope.procesoid=proceso;
    }

    $scope.adicionarCaso = function(){
      sessionService.set("TIPO_PROCESO", $scope.procesoid.procodigo);
      var json='{"g_fecha":"'+$scope.fechactual+'","g_tipo":"'+ $scope.procesoid.procodigo+'","g_usuario": "'+sessionService.get('USUARIO')+'","g_datos_solicitante": []}';
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
            }
            ]
          }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resFormulario);
        obj.success(function (data){
          sessionService.set("TRAMITE_ACTUAL", data[0].casonro);
          sweet.show('', 'Registro insertado', 'success');
          $scope.getCasos();
          data[0].casonombre = data[0].casonro;
          $scope.atenderCaso(data[0]);
          $scope.recibirTramite(data[0],'recibir');
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
    $scope.blocDesblocBtnDepuracion = function(){
      if($scope.btnBlock_1 == true){
        $scope.btnBlock_1   = false;
        $scope.btnBlock_2   = true;
      }else{
        $scope.btnBlock_1   = true;
        $scope.btnBlock_2   = false;
      }
    };
    $scope.getHistorico = function(){
      var resOpcion = {
        "procedure_name":"sp_mostrar_historico",
        "body":{"params": [{"name":"cas_id","value":$scope.sIdCaso}]}
      };
      var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion);
      obj.success(function (response) {
        $scope.obtHistorico=response;
        $scope.seleccionaProcesoMapa();
      });
      obj.error(function(error) {
        $scope.errors["error_rol"] = error;
      });
    };
    $scope.initDiagram = function() {
      if (window.goSamples) goSamples();  
      var $ = go.GraphObject.make; 
      myDiagram =
      $(go.Diagram, "myDiagramDiv",
      {
        initialContentAlignment: go.Spot.Center,
        allowDrop: true,  
        "LinkDrawn": showLinkLabel, 
        "LinkRelinked": showLinkLabel,
        "animationManager.duration": 800, 
        "undoManager.isEnabled": true  
      });
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
      function nodeStyle() {
        return [
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          locationSpot: go.Spot.Center,
          mouseEnter: function (e, obj) { showPorts(obj.part, true); },
          mouseLeave: function (e, obj) { showPorts(obj.part, false); }
        }
        ];
      }
      function makePort(name, spot, output, input) {
        return $(go.Shape, "Circle",
        {
          fill: "transparent",
          stroke: null,  
          desiredSize: new go.Size(8, 8),
          alignment: spot, alignmentFocus: spot,  
          portId: name, 
          fromSpot: spot, toSpot: spot, 
          fromLinkable: output, toLinkable: input, 
          cursor: "pointer"  
        });
      }
      var lightText = 'whitesmoke';
      myDiagram.nodeTemplateMap.add("",  
        $(go.Node, "Spot", nodeStyle(),
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
          ));
      myDiagram.linkTemplate =
      $(go.Link,  
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5, toShortLength: 4,
        relinkableFrom: false,
        relinkableTo: false,
        reshapable: false,
        resegmentable: false,
        mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
        mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
      },
      new go.Binding("points").makeTwoWay(),
      $(go.Shape,  
        { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
      $(go.Shape, 
        { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
      $(go.Shape,  
        { toArrow: "standard", stroke: null, fill: "gray"}),
      $(go.Panel, "Auto",  
        { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
        new go.Binding("visible", "visible").makeTwoWay(),
        $(go.Shape, "RoundedRectangle",  
          { fill: "#F8F8F8", stroke: null }),
        $(go.TextBlock, "Yes",  
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
      if (window.Inspector) myInspector = new Inspector('myInspector', myDiagram,
      {
        properties: {
          'key': { readOnly: true },
          'comments': {}
        }
      });
        function showLinkLabel(e) {
          var label = e.subject.findObject("LABEL");
          if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.model = go.Model.fromJson($scope.ImagenProceso);  
        myPalette =
        $(go.Palette, "myPaletteDiv",  
        {
          "animationManager.duration": 800, 
          nodeTemplateMap: myDiagram.nodeTemplateMap,  
          model: new go.GraphLinksModel([  
            { category: "Start", text: "" },
            { text: "" },
            { text: "???", figure: "diamond" },
            { category: "End", text: "" },
            { category: "Comment", text: "[ ]" }
            ])
        });
      }
      function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function(port) {
          port.stroke = (show ? "white" : null);
        });
      }
      $scope.save = function() {
        $scope.ImagenProceso = myDiagram.model.toJson();
        myDiagram.isModified = false;
      }
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
                  b=1;
                  if(response[i].tipoactid == 2)
                  {
                    x = c + 50;
                    y = y + 50;
                    if(bifurcacion == 0)
                      $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                    else
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
                    x = c + 35;
                    if(bifurcacion == 0)
                      $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                    else
                      bifurcacion = 0;
                    $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '","color":"yellowgreen", "duracion":' + response[i].actduracion + ', "transcurrio":' + $scope.actividadTranscurrido[i] + ', "diferencia":' + $scope.actividadDiferencia[i] + '},';
                  }
                  break;
                }else{
                  $scope.actividadEstado[i]= 1;
                  b=1;
                  if(response[i].tipoactid == 2)
                  {
                    x = c + 50;
                    y = y + 50;
                    if(bifurcacion == 0)
                      $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                    else
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
                    x = c + 35;
                    if(bifurcacion == 0)
                      $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                    else
                      bifurcacion = 0;
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
                x = c + 50;
                y = y + 50;
                if(bifurcacion == 0)
                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                else
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
                x = c + 35;
                if(bifurcacion == 0)
                  $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                else
                  bifurcacion = 0;
                $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":"' + response[i].actorden + '", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '"},';
              }
            }
            a = x+15;
            c = a+25;
            keya =keyb;
          }
          //$.blockUI();
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
$scope.llamarHistorico = function (caso) {
  if($scope.abrirHistorico == 0){
    $scope.abrirHistorico = 1;
    $scope.getHistorico();
  }else{
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
$scope.$on('api:ready',function(){
  $scope.proceso();
  $scope.wsId = sessionService.get('WS_ID');
  $scope.usuarioid = sessionService.get('IDUSUARIO');
  sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
  sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
});
$scope.inicioCrear = function () {
  if(DreamFactory.api[CONFIG.SERVICE]){
    $scope.proceso();
    $scope.wsId = sessionService.get('WS_ID');
    $scope.usuarioid = sessionService.get('IDUSUARIO');
    sessionService.set('IDNODO', sessionService.get('US_IDNODO'));
    sessionService.set('NODO', sessionService.get('US_NODODESCRIPCION'));
  }
}; 
$scope.$on('$destroy', function() {
});


});
var inmaterial = 'data:image/jpeg;base64,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';

var material = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIATgBOAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAEkCLwDASIAAhEBAxEB/8QAHQABAQABBQEBAAAAAAAAAAAAAAEHAgQFBggDCf/EAGQQAAEDAwEEAwgKDwUBDAkFAQEAAgMEBREGBxIhMRNBUQgUFiJhcYGSFRcyU1RVkZOx0SM1NjdCUnJzdHWhsrPB0jM0VmKCJDhDhJSVoqS0wtPh4hglY2R2g6PD8CYnRmWF8f/EABwBAQEAAgMBAQAAAAAAAAAAAAABAgQDBQYHCP/EAEkRAAIBAgMFAwgIBAQEBgMBAAABAgMRBAUhEhMxQVEGYXEUIjKRobHB0QcVNDVScoHwFkJTsiMzkuEkNlRzJWKCwtLxRYOTs//aAAwDAQACEQMRAD8A4nVn3VXf9Om/fK4tcpqz7qrv+nTfvlcWthGuEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARdt0Ns81LrCN9RbKaKGiYSHVdS/ciz2DgSfQD5cLnJ9juoZIJZLNdLJepISBJDSVgLwfTgfKQpdFszGyLsGptI3jTlqt1dd4HUr658zWU8jSJGdGQCXA9Rzw83mXYrPsj1JeIjJa7hYawNxv9DXh+75DgHCXQszHqLJ7thmuG+6Nqb56r/wAqN2Ga3d7k2o+aq/8AKm0hssxgi7BrjSN30dcYaC8d79NNF0rehk3xu5I54HYuvqkCLvektk+s9R07aqGgZQ0r27zJqx/Rh48jQC704x5VzVXsM1PGC2C6WWomDc9CKhzXHyDLfpwptItmYqRd0bsx1fFLXtuVslt8dFRyVb5pRvRuDRnda9uQXHsz58KaU2c3rU9JDParhZXvlaXCndWgTNAJHjMxkckuhZnTEWUHbDNcNGXexYHaar/yr4VGxPXccZfHS0NRjqiqm5Py4TaQ2WY2RcrqTT1603WijvdumopiMtD8EOHkcMg8+orc6R0xV6mmkho6+100rHMY1lZVCJ0pdnAYD7rl1do7VbkOBRZQGwvXJGQLWR+lf+VafaP1rnG/af8Ajf8A4KbSLssxiiyNedjWsrTaau6VYt3e9JC+eXdqCTutBJwMc8BcBoPQ981pJVssops0gYZeml3PdZxjgc+5KXQszrCLJ52G63B3SbUCervr/wAFTsL1yBk+xYHaar/yptIbLMXosoN2Ga4cMtNrPmqv/KsdXigntV1q7bVbnT0szoZNw5G804OD6ETTDTRtEW+sNsqbzeaO1UbC6eqmbEwAZxk8/MOfoWrUloq7Dfayz1zQ2opJTG/HJ3Y4eQjBHkKpDj0Rd20xs1veo6SGe13CySulYH9Aa5vSsHHg5gGQeBS9gdJRZQdsM1w0Zd7Fgdpqv/KvhU7E9eRRl8dJRVOOqKqbk/LhTaRdlmNkXJahsV309cDQXmgmoqgDeDZBwcO0EcCPKCt9pHSlZqZz2UVwtVPK17WNjq6sRPkJ/FB4u9CtyHX0WUfaK112Wz/jJ/pXU9X6NuGl4wa+4WiaXpRE6ClrGySsOCcuaOIHDn5lLotmdaRFzei9M3LVl69irWxplEL5nOccBrWjr85w0eVwVIcIi1Pa5j3Me0tc04c0jBB7FpQBEXedMbML/qSijqrTXWWbfY17ohWgyR7wyA5oBLTwPA9iN2FrnRkWSbjsU1xRUE9Y+GhlbBG6RzIpy57gBnAGOJ8ixsoncrVgi3Vpoam6XOlttGzfqKqVsUTe1zjgZ7Asj+0Vrrstn/GT/SjaQSbMXIu5XXZ5c7ZXQ0VZetOxzyS9E5huLcxHcc7L/wAUYbjJ6yB1rm6bYjrOpgZUU8lomhkG8x7Kvea4doIHFLoWZjJF3rUWy++6fppZrrcrFTujidKIXV7RI8NGcNaRknsHWuJ0bo246r3222ttcUrXbohqaoRyP4ZJa3mRjrS6FmdbRd+v+ynUNhpjPdrhYqUbjnsZJXBrpN0ZIaCOJ8gW7t+xjVtwpm1NBVWSrgdykhrQ9p9IGEuhZmNkXa9dbP8AUmjYqee808XQVDi1k0L99gdz3SccDjJ8uD2FcJYLXJebmygiqqOlc8E9LVzCKMYGeLjwHkVuSxx6LJM2xfVsNGa2aqskdMBkzOrQGY7d7GFxmntmt6vznstlysU0rHyNMIr2mTDHlhdugZ3SRwPWCD1qXRbM6Siyg7YZrhrS53sW1oGSTVYAHqroupbHLYqqOnmr7bWmRm/vUNSJmt44wSOR4ckTTDTRxKLeWi2XC718dBbKOarqZPcxRMLifL5B5Vkmg2FavlpW1FdVWu3hwyWSzkub5Dugt+QlG0gk2YqRZFvGxvWdFT98UcVFd4uJPeU4c4DzOxnzDK4W7aEvFpisJuclNQzXnpNyOpf0fQBpbxkJ4NyHA+TkcHgl0LM6oiyTQbF9XXClbVUNTZaqB/uZYa0PafMQML4XfZFqW0RCW53Cw0bXe56evDN49gyBk8E2kLMx6i7zprZjftRUkVRarhZJjJG2ToRXAysBGcOaASD5Fy7thmuGjJ9ix56r/wAqXQszF6Lv132Qa9tsT5TZxVRsG851NM1/DzZyfQF0JzS1xa4EOBwQRxCJ3JaxERc9etK3S06ZtGoKqMikugf0XikFm6eGfyh4w8ioOBRFzek9N1WpKp9NR1ttppWloa2rqRF0hccAMz7o+QIDhEWUG7C9cOaHN9iyCMgiq5/81dd1XoG66Zpp5blcrIZYC0Ppoq5rp/GIA8Tn158yl0WzOooiKkCLldNWOa/VklLDX26jcxm/vVtSIWu4gYBPM8eS72NheuSAR7FkHkRVf+VS6RUmzF6LJkuxDXLGksjt0rh+CyqGf2gLqep9F6o003fvNmqaaLh9mwHx8eXjNyAfIeKXQs0dfRfajgdVVkNM2SON00jYw+R26xpJxlx6h2lZBtuxvVVzp++LdW2OshzjpIK4PbnzgI3YJXMcIsnu2G63b7o2pvnqv/BVuwzXDhlvsWR5Kr/yptIbLMXouW1ZYK/TF9ms1z6LvqENL+idvN8YAjj5iuJVIERc5pPSeoNU1Rgsdtlqt04kk9zHH+U48B5uaA4NFll2wjU8UO9VXeyQPPJrp34PpLQuBvWyXXNsmaxtpFfE97WNno5BIwk9vIgdpIAHaptItmdERdvm0Dcma0rNK+yNrZWUrYyXzz9EyQva0hrd4ZLvHHDyFdhZsM1w9gew2tzXDIIqsgj1UuhZmL0XbdWaCummaWaa43KymSEgOpoa1rpuJxwZz4Hmvpo/Z3etVUbKi01toc94ce95KwCZoDt3JZjIGfpCXQszpyLvN82Y3uyyshuV10/TzPcxvRPuDWvAc7AcQRnd7T1LkKDYvq64UraqhqbLVQP9zLDWh7T5iBhLoWZjZFkS67IdS2pjX3S42Cia84aai4CMOPkyFj143XFuQcHGRyRO4asaUXdtF7MtTats5utpFF3uJXRfZZt128MZ4Y8q5kbDdbl26Daiezvr/wAEuhZmMEWUHbDNcN4uNrHnqv8Ayr51GxHW0FLLUvFsMcbC927U54AZPUm0hssxmi7vpXZnftTUEdXaa2zS77Q50JrB0sec4DmgZB4H5FytVsS1lS076iqltEEMY3nySVm61o7SSOCXQszGaLmLhYJqK/w2d1xtc0kxYBUQ1bXwN3jjxnjgMdfYu4UuxnVlVRCtpquyTUpGRNHXBzMflAYS6FmY3RdzotndyrK6Sip77pqSVpAAFzYQ/Iz4vbjrXPe0Vrnstn/GT/Sl0LMxciyY/YhrkNJjjtsxHUyrGf2gLquqdE6p0zGJb1Z56eBxwJgQ+P0uaSB6cJdCzOuoiKkCLnNH6XuuqqurprTEJJKWlfUvz1ho4NH+ZxwAFwaAIi5vR+lb5qy4mislE6oewAyvJDWRAnGXOPLzczg4BQHCIsnv2L3vpzRxag05LXtGXUoqzvjyY3c/sC6/ctneprTYbrd7xROt8dudE0sl49MXu3fEc3LTjIzx61LotmdQREVIEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAERUAuIABJPIBAfSOnqJG78cEr29rWEhSWGaLHSxPjzy3mkZWU9ANktOz6SpuU8UMb3zTxvkkDWiNzjuZJ4DIxjzhbXbDSzT0NurYW78MTntcW8fdhpB83in9i8Lhe2e/wA28gdNKG1KO1tfhT7ubsuPM7mplOxhd9ta2TtbqYyREXujpgiIgCIiAIiIAiIgOU1Z91V3/Tpv3yuLXKas+6q7/p0375XFogEREAREQBERAEW4p6KsqWF9PSTzNBwTHGXAHs4L6exV0+Laz5h31LhliKMXaU0n4oyUJPgjZot57FXT4trPmHfUnsVdPi2s+Yd9Sx8qofjXrRd3PobNFvPYq6fFtZ8w76k9irp8W1nzDvqTyqh+NetDdz6GzRbz2KunxbWfMO+pPYq6fFtZ8w76k8qofjXrQ3c+hs0W89irp8W1nzDvqT2KunxbWfMO+pPKqH4160N3PobNFvPYq6fFtZ8w76k9irp8W1nzDvqTyqh+NetDdz6GzRbz2KunxbWfMO+pPYq6fFtZ8w76k8qofjXrQ3c+hs0W89irp8W1nzDvqT2KunxbWfMO+pPKqH4160N3PobNFvPYq6fFtZ8w76k9irp8W1nzDvqTyqh+NetDdz6GzRbz2KunxbWfMO+pPYq6fFtZ8w76k8qofjXrQ3c+hs0W89irp8W1nzDvqT2KunxbWfMO+pPKqH4160N3PobNFvPYq6fFtZ8w76k9irp8W1nzDvqTyqh+NetDdz6GzRbz2KunxbWfMO+pPYq6fFtZ8w76k8qofjXrQ3c+hs0W89irp8W1nzDvqT2KunxbWfMO+pPKqH4160N3PobNFu32y5MYXvt9W1rRkkwuAA+RbRcsKsKnoNPwMXFrigiIsyBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAX3t8Aqq+npnO3BLK1hd2ZIGV8FQSDkHBCA9bbT9M3CTZVLYNJs6F0LGAQQ+KZoh7pgPlHHy8uteV6Kpumn7yypp31FvuNHJwy0tfG4cwQfkIPPkV6d2QbTrZqm3QW641EVLe427ronuwJwB7thPDt8XmMHq4rsutNEac1dTdHd6Bj5g3EdSzxZWc+ThzHHODwXEns6M5WtrVGBtsmoXar2faPvkzWtqHd8RVAby6Ru4HHyZxnHYQt93KDiNW3ZoPA0IyP9YXUNqmzy56GuDS95q7XO7FPVAY48TuOHU4AHyEce0Dt3co/dfdf0H/ALbVk7bOhivS1O591S5zdBUG6SM3NnI/+zkWFbUNR6Z05b9ZW67TUrKitdBHEx7hvbgBJcOTmnlg9i9F7bLJZ79p2ior3f4LJTNrmvbPKBhztx43OJABwSfQsd90BaLZYtmmlrXZ39JQwzu6KTfDukywuL8jgd4knhw48FIvSxZLW51Tbze4dRV2nrvE6PNTaI3yMY4O6N5c7eafKCuzdzjs+p7gBq+8wNmhjkLaCF4y1zm8DIR14PAeUE9QWD17W2cUsVFoKxU0TWhraCL3IxkloJPpJJVlorEjq7mMO6R11cLRJTaXstVJSSTRdNVyxHDtwkhrAeYzgk4weA6iV57Ekgl6USOEmd7ezxz25Xedvz3v2tXsOJ8UwtaD1DoWLoasVZEk7szhsy17cb3oXVGm73VyVdTBap5qWaQ5e6MMIc1x68ZBBOTxPYulbAnEbW7Hg4y6YHy/YXro8ckkRJjkewkFpLTjIPMLu+wP77di/Lm/gyJa1wndo9CbdfvVXv8ANs/iNXnjYvqS52PXlqgpamTvWtqmU1RBveI9r3BucdoJBB58MciV6X2qWw3jQVztorKWjMzGjpql+7GzDgeJ6uSx9sz2JyWHUNJfb1daeqdSuMkVPBGS0vx4ri49nPAHMDj1LCLSWpnJNs75tasNDftCXSGrgjfJBTvnp5HDjHI1pIIPVy49o4LxsvRG3PanQxWyu0rYnSSVspdT1kzoy1sLeIe0Z5uPLI4YJ45XndZQWhjNps92Wsl1spXE5JhYT6oXkSSz1motrFfZaKpEE1Tc6kNkcThm657ieHHkCvXdp+1VJ+YZ+6FjXZ3o3TFHrS96gpNQwXe59NOTBHujvTfcd4EZJ3ubc8OvgsIu1zKSvYx5s91rXz6M1fpS9XB1SI7RUyUcs8mXDDS0x5Jyc5BA6sHyY4fZHquLSemdX1bKmKK4y00DKFjnDec8ue3eaDz3d4OI8ix/Xf36f8476V8FyWOO53jZNW1lftbslTWVMtRNJV7z3yOJJOCvTW1Dhs51ER8Wz/uFeXdjH30rB+lf9kr1FtQ+9xqP9Wz/ALhWMuJnDgzy/so1jX6V1ZRyitkZbppWx1kT3nozG4gF2OQI5558PKVxGvaiCq1ve6mmmZNBLXzPjkY7LXtLyQQesLhF9KaGWpqI6eCN0k0rwyNjRkucTgAeXKztzMLmaO5a0wKq71mqamMGOjBp6XI/3xw8Zw8zTj/Wexfbup9M9DW0OqqaMBk471qsD8MDLHekZGf8oW5q9VQ7Nr9pLR1NMzvWhYH3l4PB0k3MnhkbuS/HYWjqWXtdWGHVGkbhZZC0d8wnonnk144sd6HAFcbdnczSurHiZZC7nh72bV7YGuIDmTNdg8x0buC6FV081JVS0tTG6KeF7o5GO5tcDgg+Yrvfc9/fXtX5M38Ny5JcDBcTO3dC/eku/wCVB/GYsFbCNRXK07QbZRQ1c3eVbL0E9PvEsdvDAOOWQcHPPmOteiNrtoN90BcLWK6loTMYsT1L92NpEjXcT5cY9K6Rss2Myaa1DT368XSGqmpt4wwQMO4HEYDi488Anhjng5XGmrHI09o7ftqsdFetnd1NVGDJR076qB+OLHsaT+0ZHpXj9pLXBzSQQcgjqWftue1WgmtNZpTT75n1ErjBXTviLGsaCQ+Mb2DvZAB4YwT18sALKCaRhNps95Qf2Ef5I+heG7+90l+uEjyXOdVSFxPWS4r3JB/YR/kj6F4Zvf26rv0iT94qUzKZs16Y7mPTHsZpWbUFTHipubvsWRxbC0kD5Tk+Ubq8/aNsc+pNUW+yU+Q6qmDXOH4DObnehoJ9Cz3pfX9NHtlk0nSuZFZIqZttpGjg1ssWePHlnxmeXDVZ8LGMeNzGvdC6Z9gNezVcEe7R3QGpjIHASZ+yN8+fG/1BY3XrPb9pnwi0BUTQR71Zbf8AaocDiWgeO3t4tycdZAXkxWLuhJWYWRO52e9m1Kh3HEb0EwODzHRlY7WQu55++lQfmpv4blZcCLiemtF3uHUemaS6R4JkaWSt/FkaS14+UFeU9sOm/BfXtfQRs3KWZ3fNLgYHRvJOB5Ad5voWSe5r1MINQ3jS1TIAyolfU0uSPdg4e30jBx/lK5/undNeyWk4L/Tx5qLY/EmOZheQD58O3T5BvLjXmszfnRuYz2G0sFtlvGu7gzNLYqVxhBOOkqHghrQeWcZGO1wXqWmJdTxOJySwE/IvL+0b/wDSezewaIjHR1tYPZO6Dkd53uGO6jjl/wDLC9P0n91h/Ib9CS6lh0PEWrHOfqm7PcSXOrZiSes75XqLueXF2yS0ZOcOnH/1nry5qj7prp+mTfvleou53+9Jafy5/wCM9ZT4GMOJhnumHudtPla4khlHC1vkGCfpJWNqSR8NXDLG4sex7XNcDggg8Csj90t99Go/RYf3VjaH+1Z+UFlHgYy4mUO6de5+0Om3jnFshA9Z5/muX7mS7NtVJqqrq5pBQ0lNHUyMBJDQN/ecG9uB6cBcN3TX3w6f9Ww/vPWnYz9xm0P9TH92RY/ymX8x6RvFutOq9NSUVT0dXbq+EFr2EEEHi17T28iCvIO0HSdw0dqOa013jsHj084GGzRnk4dh6iOo9vAnIfc97RhZ6qPSt6lPsfUPxSTOPCCQn3J/yuPyHyHIzJtR0XRa202+ilDI62LL6OoPON/YT+KeRHmPMBYrzWV+cjBepp5X9zbphr5HOHsrI3ieoGbA9C61sYe5m1KwOaSCarHDsLSD+wrteurdW2jYFYbbcad9PV096mZLG7mCDN8o6wRwI4hdS2N/fQ0/+lj6Cs1wZjzR6m2mkt2dajIOD7GVH8Ny8aWyiqLjcae30kfSVFTK2KJva5xwF7K2nfe51H+rKj+G5ecu5yo4qvalRPkx/s0MszQfxg3A/eWMHZMynq0egNn2kLNoDTDmsEZqBF0tfWPHjSEDJ49TRxwOrykknzJtG1xd9ZXqeoqqiRlAJD3rSA4ZGwe5yOt2OZ7ScYHBeo9q8j49muoXM5+x8o9Bbg/sK8YpDXUT00OW0vqO86ZubLhZq6SmmafGAOWSDsc3kR5/RxWSe6CvsOptOaKvkLQwVVPUOcwHIY8GIPbnrw4EehYgWt0sjo2Ruke5jM7jS7IbnngdSztrcwvpY9K9yq5x0DXgkkNubwPJ9jjXTu6ve46qtEZcd1tESB2EvOfoHyLuHcqfcFcP1m/+FGum91d911q/QT++VgvSM36Jw/c0PczajA1riA+kma7yjAP0gLMPdHuLdllY5pIIqIMEH/OFhzua/vp0v6NN+6s8bZbKdQaFqLYLhR0HSTRO6erk3I24dnie1JekI+idT7mHUFxu2mrhbrhUS1PsfKwQSSO3iGPB8TPMgFpxnqOOQC6j3U9ioaK9W29UsbYp65j2VIaAA9zN3DvPh2CfIF3XZ9U6F2Y6WmpqrV1vrKmaXpqh8Lg5zjjAa1jcuwAPLxJPDOFhba7ruXXV/jqWQPpqCla6Olhc4F2Ccl7scnOw3IGQMAZPMkvOug35tjhND2GbU2q7fZIcjvmUCRw/AjHF7vQ0H0r1VtM0jT37Z1U2KjgYx9NCH0LWgDcfGPFaOzIy3zFYP2bjwP2cXvXcviVtYDbrVngcn3bx1HBGf/lntWdNkepRqrQlBcXvDqqNvQVQyMiVnAk45ZGHeZySfMRtwPHBBBIIII5gqLIO3zTJ07r+plhjLaK5ZqoTjgHE+O30OyfIHBY+WadzBqx7d0Q90mjLK97i5xoISSeZ8QLyFtIc5+0HUDnEk+yM4yfyyvXehPuJsn6BB+4F5D2i/d/qD9ZT/wARywhxM58EcAiIuQ4wvaWzAl2znTpJyfY2D+GF4tXtLZd97jTn6tg/cCwnwM4cTzRtZuNfbdrd9qLfW1NJM2q8V8MpY4eKOsL0Bsh1K3XWgWyXWOKoqYy6krmOjG7Icc8cvGaRnqzleddtX307/wDpP/ZasmdyTK8w6hgJPRtdA8DynfB+gJJeaIvU6Ftx0QzRuqQaEO9i68Omps4+xnPjR+YZGCeogcSCVkbuTHH2GvrM+KKiIgf6St/3VkMbtE22ctHSMuAa13XgxvyP2D5Fx/cl/am/fn4v3XKN3iVK0jZ91s5zZtNgOIy2p5H80uhWmv1Js8k09fIrlK6nuUXfRoxI7cdHvbpa4HgSRxB6shZv2zaX09qa6WKK/alis7YulEcbi0OqA4syGuccAjA6jzWOO6gpKaguWnKGjjEVNT28xRMB4NY1wAHyBIvghJatnVtvFVT1u0uvq6WVksMsULmvY4OBBib1roiIs0rHGztGzHSU2s9WQWhj3RU4BlqpW4yyIEZxnrOQB589S9NawuNs2a7OJ5rRRQQMpYxFRwY4OldwaXccu4+M45ycHiugdyZRxi3X24cOldNFD5QACf5/sW/7q57xo21Rj3Lrhk+cRvx9JWD1lY5FpG558vl4ud8uD6+7V01ZUv5vkdnHkA5AeQcF2vZJr+56Rv1NC+re+zTzNbVU73ZYxpOC9v4pGc8OeMHqx0VFnYwud629kO2tXtwOQXQkfMRr1BoF75ND2KR7i5zrfASTzP2MLxRLJJNIZJZHyPPNzjkn0r2rs9+4Ow/q6D+GFhPRIzhxPJW0975NomoHvcXH2QmGT5HEBbnY/LJDtO0++Nxa41jW5HYcgj0gkLabS/vg6g/WE375W42TffK0/wDp0f0rPkYcz6bY5Xy7T9QPkdvEVbmjzAAD9gCzV3KjidBXAEkgXN+PJ9ijWEtrv3zdQ/pr1mzuU/uDuP60f/CjWMvRMo+kdT7rF7jqWyxlx3W0byB2Ev4/QFhVZo7rD7qbP+hO/fKwurHgSXEyVbtZSWPYk2z2q4NhuVZcpBKI5MSxw7oJIwctyQBnsyuU7luSSTaDXGSR7ybc8kuOcnpGLEKy53K/3wK39Wv/AIkaSWjCeqMh91ES3Z5Bgkf7fHy/JesX7E9cSWee4WS73HctdXRy9GZ5PFhlDSRjJwA4ZGOs7qyf3Uf3u4P1hH+69eYVIq6LJ2kZL7muR7NqVM1riA+lma7yjdz9ICzX3Qji3ZJeC0kEmAcPzzFhLubvvqUf6PN+4Vmzuh/vSXf8qD+MxSXpFj6J5KWWNE1E0fc86wax5aO/Ixw7HdGD8oWJ1lPRv+581h+mw/TGs2YRMa2x7o7lSyMcWubMwtIOCDvBe55CTSuJ5lhP7F4Wt/8Af6f8636QvdJGaQjl9j/ksKhnTPD1jvFyslxiuFrrJqWoicHNdG4jODnBHWO0HgV7U6Gk1DpuNldTtlpq6laXxvHU9uf5rA+l9g1RWzw1dfqKgmtpcDmizIZWg8QHcAOsZ44WSdp+0mz6Io32yFkkt3NPmlgEJ6NoIIa9x4AtBGMNOf5JavQR04nlvUtCy16iuVsjcXspKuWBrjzIa8tB/YuPX1q6iarq5qqpkdLPM90kj3c3OJySfOSuc2dadk1TrG32cB3QySb1Q4fgxN4vOerhwB7SFyHGehO5w0x7CaHF0qI92ruxExyOIiHCMekEu/1LCm3HTPg1r+sjhj3aOt/2qnwOADid5vZwdnh1DCy7oHaLFc9rl00/G9jbU+MU9ta33IMIOcY4eMN457GtW+7pDTPs3oc3SCPeq7S4zDA4mI8JB6AA7/SuNO0tTkaTjoeWl6x2W6fFJsZp6W0Ssp665ULpu+d0ZEsjThxxz3cgeYLycs8bANp1vobZFpPUEzaVsRPeVU8nccCSTG8n3JBPA8scOBAzlNOxjB6mGdQWq8WK8SUd4pp6SuY7fd0h4nj7oO6+PWCsoR6xrtT7AtQ2+6zuqa62SUo6Z3unxOmZulx63AtcM+bOTkr0DfrJZ9RW80d2oaeup3cW77Q7dOMZaeo8eYXnXa9sin0xTS3uxSvqrSw5miefslOD1/5m56+Y8vErFSTK4tcDEyIi5DAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiALfaamki1dYhG7HSXCNjuHMEO4fsWyAJIABJPIBds03oW519XR1NxoaVtC2UPliqwS57MH3Leo+fHWumz7G4bC4Gp5RNR2otLq9OS5s28FRqVK0dhXs0d32lQ0lVY4KOugrJ6aoq2xyR0oaXuG64/hEcAQDwyeHAdm40M+N+hLYYnzPibRtbGZmgP3QMDeAJGcAdamo75abNcLRSVdQ6AulLmtbE9wDOje0ZLQQOJaOP8lp0zX2jUdiqoaV4qYGVEsUrXxOYA4uLwMOA6nNK+FTjW+q6UZ05KmpbW1Z21utNEr6L+bXh0PZJw8ok1JbVrW58v3wMLIufv+krzZmulmgE1OOc0J3mjz9Y9K4BfoTCY3D42nvcPNSj1TueGq0Z0pbM1ZhERbRxhERAEREAREQHKas+6q7/p0375XFrlNWfdVd/06b98ri0QCIiAIiIAiIgMtbF/ucq/0w/uMXel0XYv9zlX+mH9xi70vzX2v++sR+b4I91lv2WHgERF5s3giIgCIiALTI9kcbpJHtYxoy5zjgALidV3+k0/bTVVA6SRx3YogcF5/kO0rE9ffb/qu4x28zkNqJA1lPH4rBx6+3HPJXf5T2fr5hF1W9mmuLftt4eo3sLgJ4hbfCPUy7aL3QXaedlvc+eOA4fMG4j3vxQTzPmGFya4zTNngsdoit8BLt3LnvPN7jzP/wCdQC5NdTi9wq0lh77C4X4vv/U1auxtvY4BERaxxhERAEREAREQBERAEREAREQBERAbDUP2guP6LL+4V56XoXUP2guP6LL+4V56X2X6Lvs+I8Y+5nmO0Hpw8GERF9TPPBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAW9sMUc98oIJmB8clTGx7T1guAIWyW9sU0dPe6CeZwZHHUxve49QDgSUB2fbFpo6T19WUtLA6nopXCooiOQYeOAf8AK7I7eA7Vz+znbJqCx1dPR3yc3S1lwa90vGaJueLmu5uxzwc57Qu1672ibNtXVUtjvlFXimgkLaa6QNa4t7XN5kNOBwwc9YC6na7Fskt9e2vrtaVVypWO32UjaF7XPxya44/kFhxWpnwehmLugxTybJ7m+XHAwujOOO90jcY//O1Yw7lH7r7r+g/9tq67te2l1Otpo6KjgdR2andvxxPA6SR2Mbz8EgYycAft4Y7Nsm1Fs60LU1Vb7PXCtqKqIRuzb3MDG5BwOJzx6/MpZqNi3vI7d3Vf3BW/9Zs/hSLDd71NT3LZVY9PyTudXW6tlO6WnhCRlpzy5kjHkWV9e7Qdl2s7K21XWvuscTJhMx8FOWua4AjrBHJx6l1C0R7C6GpE1RWX24AcRHURkNz5dwNJSOiJLVnUDpeOm2XHVlaJWy1VwbS0IDgGlgDi9xHXxaQOXuSvRewbUUF+2eUEIkZ33b4xSzxg8WhvBh9LQD58rEe3LXenNS2Kz2jTO+2lpJHPdGYDE1gDQ1gaOWMF3JdB0Rqq7aRvbLnapt0+5mid7iVnW1w/n1KtbSCeyzvPdOWZ9Br9l0bG4QXKna/f6jIzxHD0AMPpWKV6In2o7OtcWH2M1jRT0Ds726WukDH8QHMewZBweZA6x5+ozWLYhTO6d2rL1UMHjCFjMl3+XPR8PlHnROysyNXd0Y4stjuV3gr6iigLoLfTuqKmUg7kbQOAJ7TjAHXx7Cuz7A/vt2L8ub+DIvtrDX1HJY3aW0VazZLC85nDjmepJxnfdknHDHM5AAzjgtzskrtDabu1BqO7Xyv7/ga//ZI6IljHODm+7z43inPIc1XwC4mddu33qb3+bZ/Eauq9zpr72YtY0vdZwbhRM/2Z7uc0I6s9bm8vKMc8ErVq7aps61HputslTcK+KKrj3HPbRuJbxBBHl4LA1TU0untS01fpS81FV3sWyxVL4DC4Pyct3cnIxwPaCQsVG6sZOVndGa+6R0F37SO1jaoR3zTsxXxtbxkjA4ScOto5/wCX8led16gtW3LRtRaqd9zNXTVb4x08Ipy9rXdYBHMdnk7FiO7W7ZTVXeSqotT3ajo5JN803scXlgJJLWuyMDqGQfSrFtaMkknqj1RaftVSfmGfuheV9N6ii0vtsr7nVzvhojX1cVUWtLsxuc/qHE4dunh2LMkO2vQEULIm1lbusaGj/ZHdSxjeRsWul5q7pLeNRRSVUzpnxxwjcDnHJxlhOMntWMVbiWTvwOi6Qsc2qta0tppWucypqcyOaPcRZy53obn04C2OqaSloNTXShoS801NVywxF7t5xa15AJPXyWc9Ia32PaRgk9g4quOoezddUSUz3yu8m8eQ4DgMBefqmV9RUSTyHL5Hl7j5SclZp3MGrI7ZsY++lYP0r/sleotqH3uNR/q2f9wrzhspqtE2G627UV5vla2upi9xo46IljXcWg7+eI3TnkOJ8nHLd+2u7O7xZK601NdcGQ1kD4JHMpXbwa5pBIz18VjLVmcdEeYVkbYTaqV1+rdVXRubbp6nNXJwzvSYO4MHmeDj5wF1a60Omob1SQW+/VNVb5CO+Kl9EWOhG9g4ZveNgceYysqw6j2UU+zmq0XTXS7Qw1RD5qltIekfIC07x6seKBjs4LJsxSOHvGsNkt3udRc7jo69VFXUPL5ZHVrgXHzCTA8wWbtleq7PqrTYks8NTTxUThTGGofvSNAaN0k5JII6yeoryLfYLbT3SWG0V0tdRtx0c8kPROdwGctycYOR6FlbY1qjROh2z1VTqG4VE1bTxiamFCQyJ44njk72CSAeHBSUdCxlqbDulNMew+s23injDaS6t3zgcGzN4PHpGHeUkriu57++vavyZv4blknaFtB2Y6008+0XCvuMWHiWCaOkdvRSDIBx1jBII7D1HBHTdl9w2daR1A2+1N/uFZURteyGP2PcwMzkb2Q45Jb1dWT5CmuzYO20Ze7ob70l3/Kg/jMXEdz3r06is3sBdJnOutBGNx7zkzwjgDnrc3gD6DxyVstcbTtnWqtL1lhqblcII6lrfsjKNxLS1wcDjr4gLBgrodM6rguOlrrLVCkc2SGokgMRcceM0tyeHEg8eIUUbqxXKzuZi7pPQJljdrO0wuMjABcY2DOWjgJfRyPkweGCvP69RUW3DQ9VbYjcDVwTSRjpoDTl4accRkcCPKsQV1s2US3c1FJqe709C6Te71NvL3Nbn3Ifnl1DIJ7cqxbXEkknwPV8H9hH+SPoXhm9/bqu/SJP3ivTzdtugWtDRWVuAMf3Rywtd6HZlV399bFqq6spKioc+SEW478bSCThxOPdcBwOBzzjjIaFnqc7sWNu0fpa6bQr1DM9jnigoo4+D35I3y3OAerj1brlt6TVGyClrYq2n0Zeo6mGRsscgrn5a8HIP9pzyuc1pqTZXf8AR9BpqlulxtdNb3h9P0VE5wzgjxgfdcCeOc5Oc884VkjpRcXRMqHupBMWiYx4cWZ91u9uOOFUrmLdj2vpO+UWp9N0l5og7verjJ3Xc2kEhzT5QQQvJe1jTLtKa5rrY1m7Svd09J2GJxOB6Dlv+lZV2X6+0HonT8lo8IblcWOndM1z6FzAzIA3QMnA4Z85K2O1nVezPXFDFIbjX01xpWO6CZtG47wPHccOHDI59XyqRumZSs0YNWQu55++lQfmpv4blj1ZV2Q3XZ7pOvgv1yvFwnuXQFvQCjIZC5ww7iCd7rGeHPks5cDBcTolru9TYNZRXmkJ6WkrDIADjeAcctPkIyD517KjrLbdtNtuD3Ry22qpelcX+5Mbm5Oc9WF5I2gQ6LNRLXaVu9dUOnqC51LUUu4ImnJJD+vBwAMcjzXOWzaM+k2L1mkekf38+YwQkA8KZ/jPyeXPebjscOxYyVzKLsdT19fpNTavuN6fkMnlPQtIxuxjgwY6vFAz5cr2nSf3WH8hv0LxbpKi0vVPkdqS9VduYx7d1kFIZTK3jvcc+KeXUea9GM226AYxrRWVuAMD/ZHKTXQsH1PM+qPumun6ZN++V6d7nGoim2VUEUbwXwTTMkA/BJkc76HBeftobNHzVtTdNN3qtqpaqqMjqWekLBG12XOIfnjh2ABjkefDjyGx/aLUaGuE0c8MlVaqogzQsI3mOH4bc8M44YyM8OxZSV0Yxdmcj3TUTo9pz3uGBJRQub5RxH0grHlkpJLheqGghGZKmojhYPK5wA+lZ81nqDY9r+np6i7XSoo6yJmGzMifHMxp4lh8Utdg+fHHB4nPVIL9sz0J0tZpBlbfr2WObT1Naz7HTOPXjDePlAzjhkZKiega1OK7o+qZPtOqIWHjS0sMLvPu73/aX32M/cZtD/Ux/dkWO7jXVF1u09wuM7pJ6qYyTSEcck5Jx/JZd0He9lumLHeLbJe7pXm7wdBUvNEYwGYcMNAzj3R6+xV6KwWruYXXpPufdo5vdIzTF7qQ6507P9llkPjVEYHuSet7R6SBnjglYH1ZSacpaqPwcu9VcYH7xd09N0Rj4+KOfjcOvguKoqmoo6uGrpZXwzwvEkcjTgtcDkEKtXRE7M9G91YANEW3AAzc2k+X7E9Ya2N/fQ0/+lj6Cu07TdodHrXZjaYJyIb1T1wNVAAcOAjcOkafxSXDgeIORxHE8VsqqdE2O6W7UV6vla2upnOf3nHRFzA7JDTv548OOMDisVojJu8j0jtO+9zqP9WVH8Ny8qbKr8zTevrVdJnBtO2Xo5yTgBjxuknzZz6Fna+7Xdnd4sldaaiuuDIaynfBI5lK7eDXNIJHl4rzxqaksNJVRtsN2qLlC5pL3zUvQlhzwGMnPDr4KRXJiT1uj2VqKhjv2lrhbo5BuV9HJEx44jx2EA/tXiKpgmpqmWmqInxTRPLJGPGC1wOCCO0FZR2VbYa7S9JFZ7zDJcLXEMROafs0I6mgk4LR1A8u3GAux6rq9imtKv2Uq7rWWuvkGZnQxPY55/zAtc0nyhFeJXaRgdcjdLNX2yit9XWwmFlwhM9O1wIcY94gOIPUcZHaMHrWRm1Ox3Sz+/Ley6aqrWYdDFU/Y4WOH43ityPQ7zLpuodR1GstVsr9R1zqWne4NzFGZG00fYxmfJnGeJJKzuYWM5dyp9wVw/Wb/wCFGum91d911q/QT++5c7sy17s50Pp11pgvFxrHSTunkldROblxAHAccDDR1ridq2otm2u6ikq3X+40FTSxmMOFA6Rr28TjGRxzyOccTnyYL0rmb9Gx17ua/vpU36NN+6sxd0j96qt/SIf3wsU7ILxoHSFxiv1de6+avdS9G6nFCQyFzsb3jAnexjAPDmu66/2k7OtXaXqbFUXS4UzZi1wlZRucWlrg4cOvkj9K4XonnNbuzW+pu12pLZRt3qiqmbDGOrLjjj5FqvcNup7pNDaq6Suo27vRzyQ9E5/ignLcnGDkc+rKyTsbvOzvSr473eK2rmvO6QxgpHFtNnIO6QcOJB5+gdec29DBLU7Fr3UGzi0mk0ReLFcrpHYo2xNdBP0bN8tBcTuubvO7SevPlXK7GtbaDjvo07puy3K1G4Eu/wBoqDJG57Wk9bjgkA+fA8ixLtLOj6241d507eq+qqK2rdNLTVFLuBgfvOcQ/rw7AAxyPPhx2mzw6fprvFc71fKu2Po545YW09KZTJg5PHPi8gORzlY7OhlfU9C90Ppj2f0HLWwRh1ZaiamM4GTHj7I3Pm8byloXlJeqn7bdn72OY+qrHNcMEGkdghYSudt2Xz3ySWi1NdaS3PdviE28vczj7gOJ5YzgkHqznmkbriJWfA9PaE+4myfoEH7gXkPaL93+oP1lP/EcvQdq2x7PbfbKWgira0x00LIWnvR3ENaAPoWO9RybFr3e6u7S3bUFPLVymWRkMPi7xOSRvNJ4njzUjoyy1RjPTNoqb9qChs9G0marmbGCBndHW4+QDJPkC5na1brdaNoV0tlqgbBSUzo42MaSePRt3uf+bKyhoTVGxvR0rqi2SXKWscMGpqIHPeB2DgAPQFh3W1zjvOr7tdIXOdDVVckkTnDBLC47vDq4YWSd2YtWRwy9pbLvvcac/VsH7gXkPTVJY6uqkZfbtPbIWsyySKlM5c7PLGRjh1r0Pp/a5s8s1iobTBX3CSKjp2QMc+kdlwa0AE+XgpPUsNDCe2r76d//AEn/ALLVmPuV7RJSaRr7tLG5nf1SGxE/hMjGMj/UXD0Lp+p7lsZvWpajUFbVX+eaoeHy00ce5G8gAdgIzjtW61Htzigs7bToyzOt8UcQihmn3fsIAwN1gyOXLJ9BR3asFZO5r7qjUkNTXW/TFNKHmlJqaoDB3XkYYPPulxx/mC5TuS/tTfvz8X7rlgRsvf10ZLc6yYiaUGoqHZkfgnxncTlxxx58VnDZXrPZzoS11VJDe7hWyVMokkldQOZyGAAMnhj+aNWVgnd3NPdbEifTRBwQ2pwfTEsdbRNTU+o7NpdondLWUFvNPV7zTwcHYByeeQAeHasl7RdY7KNcx0bbrcbxC6kLzE+npyDh2Mg5BH4IXCael2FWmqbUyyXe5vYQ5grIS5gPla0AHzHIRaIPVnSdU6WbYNE6fuVYyeO5XZ00pjccBkLd0M4c8nez5iOC6kskbeNZWrV96tr7LJI+ipKYsG/GWYe53HgfIGrG6yXAxfEzF3LuooLdqWusdVI1jbjG10Jc7GZWE+KO0kOPqrJPdH2aW67Npp4GufJbp2VRa0ZJaAWuPmAcXHyBeV4ZZYJmTQyPiljcHMexxDmuByCCORWd9C7dac0LLdrOkkkduiM1cEYIe3GCXtzz7d35AsZJ3ujKL0szAq+lPDNUVEdPTxPmmlcGRxsaXOe4nAAA4kk9SzFeLVsLuVS+tptRV9ta/iYII3bgPXhr4yR5gceRbAau0FoljjoO2VFzuxaWtulwyBGD1tbgcerk3zlW5jYxrfbZVWa71NrrQwVNM/clDTkB3WMr2Ps0mZPs90/LG4EG3wjgeRDACPlXjKuq6murJaysnkqKiV29JLI7LnntJ6ysobGtrHglRixXmnkqLVvl0Usfu6fOS4Y/CaSc9RGTzzwkk2jKLSZ03alE+DaNqCORpa7v+V2D2FxI/YQt/sRpH1m1OxRtBIjnMzjjkGNLv5LJWt6nYrrGuN3rL7U0VY4ASy08b2OlAGBvNcwjIHDOMrq1VrHR+i6Cpo9nFNU1FyqY+ilvFYPGYznhjSB6eAGQDxwMW+liWszpe0qoFVtAv0zTkGvmAPbhxH8lnXuU/uDuP60f/CjXnK2x0k9xhjuFU+mpnvAmmbH0jmN6yG5GfMs8bMdebOdD6efaoLxcax0s7p5JXUTm5cQG8BxwMNHWpLhYseNzhu6w+6mz/oTv3ysLrPO0TVOyXXE9JUXS5XqCWlY5jHU8GMgnODlpXD6dk2G2ivZWPqb1cZI3B0baqI7jXA5Bw0Nz5jkInZBq7Os680xDprQelX1FJ0V1uQmqKh7s7wZ4u4wjqwHDPXnK7D3K/wB8Ct/Vr/4ka47b3rS0axu1sfZZJX01JA5p6SMsIe53HgfIAuX2SX3Z3oivmukl/uFZVVFOISzvAsbGCQ5w5nPEDj5Ed9kK1zvndR/e7p/1hH+69eYV6H2i7Qtm+tNOOs9XdLjTDpBLHLHRuJa8AgZB5jjxH0LAd4ioYLlNFbKySspGkdFO+Lo3PGBkluTjjnrSGiJPid47neoZBtVtrXHjLHNG3z9GT/IrOndBsdJslvAYCSDC447BMwleULdWVNuuFPX0cphqaaVssTwAd1zTkHB4HiOtei9P7aNIX6xvt+rYHUUssRjqGOiMkMueBwRkjPPiOHaeaSTvcsWrWPNiyrp5ho+5u1DPKNzvy5xshz+GAYs4+R3yLdXC0bDKad9a3UF4nZkvbRQgkHr3ASzPkyXeldS2ia1bqGGks1oojbNPW/hSUeQSSMjfcfxsE9Z5nicq8ScDqlv/AL/T/nW/SF7pd/cz+b/kvG+hINImqjrNT3erpegna4U0NIZBM0YPFwI3ePDlyXoJ223QBaW9+VuCMf3RyxnqZQdjHHc569NoubdK3SZ3eFZJ/sj3O4QzH8HyNd+91cSVlXbVoVms9NE0rALtRAyUjsgb/bGc9R/YQPKvM+rqPS1LLHJpm81de173b0c9KYjEOGOOfG6+oclmjZ3tus0WmYKXVctSy4046MysiLxM0cnHHJ2OB8vHrwElzQi+TPPU0ckMr4Zo3RyMcWvY4YLSOBBHUVmDZPJatEaArda3ynqJTdZe8KRkB3ZDGM75a7Ixkg+oMLRrir2Sao1N7OG93WgdJumqhioiRMRgZbn3BwOPMcM4znO92g6h2X6psVqtNPebnbIrW0spmx0Tns3SGjiCRk4aOOe1ZN3MUrHFWzVmyO2XGnuFDoy9Q1VNI2WKQVrjuuByDgyYPmPBeirJcaDUunKe404ElHXwB24/B4OHFrhxGRxBC8S0sdK+4RRVFQ6KldKGyTNZvFrM8XBvWQOOFn7ZvtF0Fo7TLLJ7PXKvayRz2vfQuYG7xzugZOB18+ZKxlEyjIwztC09LpbWFwszw7o4pCYHH8KI8WH5OB8oK7DtM0pDbNJ6R1Db6URU9fbImVRYDjp93e3ic83An1V2bbFqTZxraBtwprlX013pYHMiPeZLZxxLWOzy8Y+66sngVyke0/RNPoOy6UvFuqbvTPtUUdZ0IbiJ4GN3iQd4FucjGPFIJ6rdksjHGgNpeptISRxU1Say3NI3qKoOWYzx3DzYefLhk5IK9Q2u8WzVOhBdiGigrKR5lbJyaMEPac9hBGfIvO8unNks9WKmn13XU9FkF9O+ic6UdoDsftwfSt9tD2n252mWaN0PSy0loZH0Mk7xh0jOOWtB44OeJPE5PDrUavwCduJiRERchgEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBfSnhlqJ2QQRukkkcGta0ZJJXzWRdllmjgp5dQ1261jQ4Ql3IAe6f+zHoPkXT55m9PKcHLESV3wiusnwXz7jaweFliaqguHN9EcnpvTtu0vQtuV0AmrzgNAbvFrjyYwdbvL/JcXq7U9U17qearlpD8Eo5AJG8v7SX8E9eGeYlfbV1+lo6RleRu19Y0iiY7nTQfj46nu//ADksbOc5zi5xLnE5JJ4krxuQZHPNarzHMXttvS/DTlFcFFcL8W+DSV5drjcYsNHcUNF++Pe//vu+1bUGpm6Qh3LGXPc9x85cSVopHRUtU6shNZDUEDelpap0MhwMAAg7vrArmNI6cqtQV24zMVNGfs02ODfIO0r56qsFXYK8wTjfhfkwzAcHj+R7QvZyxuX1K7yxzTnb0e7587cba8DqlSrxh5Qlpfidz0bqypqA6nkqzdmRj7LG+IR1sTe3dHizN8rQ09gcvjrXSNNVUZvmnwxzHN35IY/cuH4zOw+T/wDDjd7ZRJHUU076arhdvwTsOHRu/mO0cisrbP8AUoulsNwlYynnjl6G607fcxyn3Mzexruvq45z4pJ8HnWWYjs3iFmOXPzW7Sjyfc0tLPgmldPvdzusJiIY+DoV+PJ/v2mLEXb9plgFruorqZgbSVZJwBwY/rHmPMensXUF9EyzMaWZYWGKo8JL1Pmv0eh0OIoSoVHTlxQREW+cIREQBERAcpqz7qrv+nTfvlcWvSV12C2euudVXOv1ex1RM+UtETMAucTj9q23/o+Wb/ENw+aYsNtGWyzzsi9EHufLN/iG4fNMT/0fLN/iC4fNMV20NlnndF6I/wDR8s3+ILh80xQ9z7Zv8QV/zTE20NlnnhF6H/8AR9s3+IK/5pif+j7Zv8QV/wA0xNtDZZ1LYv8Ac5V/ph/cYu9L5U2jKXRDDbaStmq2THpy+VoBBPi44fkr6r829r3fOsR+b4I9xlv2WHgERF5s3giIgC0TSMhifLK4MjY0uc48gBzK1rgddyxxadldO7dpt4Go8bBcwZcW/wCogN/1LnwtHf1o0+rSM6cdqSidC1FNHqW/wVFXJLFTvG7SUzCBI+MZJlOeDG8zvHPAcitWy+Ggn13XS0QPetNE8wb5y7BcGg/Jn5V1mlmrq+grKxv2S4XarbRxhvDdYACWt7BkxjyAYXZdBW+GrvstnoHH2PogHXCoacOrJM8GZ5iPIPi9YBzzX1HGUVQwFWltbMYxtpwS0v4tvzVzbvwXDbzPNY4GlGjxlPzYxXtfglxfzsZaRRVfJzRCIiAIiIAiIgCIiAIiIAiIgCIiAIiIDYah+0Fx/RZf3CvPS9JS0bbhE6ge8sbUtMLnDm0O4Z/auK9oez/H1d80xfY/ovklh8RfrH3M8v2g9OHgzASLPvtD2f4+rvmmKe0RaPj6u+aYvqW2jz9zAaLPntEWj4+rvmmJ7RFo+Pq75pibaFzAaLPftE2j49rvmmJ7RNo+Pq75pibaFzAiLPftE2j4+rvmmIdhNo+Pa75pibaJcwIiz17RVo+Pa75pie0VaPj2u+aYm2hcwKiz0dhVo+Pa75pie0VaPj2u+aYm2hcwKizydhdo+Pa75pie0XaPj2u+aam2hdGBkWefaLtHx7XfNNT2i7R8e13zTU20NpGBkWePaMtHx5XfNtT2jLT8e13zTU20NpGB0WePaMtPx7XfNNU9o20/Hld821NtE2kYIRZ39o20/Hld821T2jrT8eVvzTU20NpGCUWdvaOtPx5W/NNT2jrT8eVvzTU3kRtIwSizsdh1p+PK35tqntH2n48rfm2pvIjaRgpFnX2j7T8eVvzbVDsPtPx5W/NtTeRG2jBaLOntIWn48rfm2p7SFp+PK35tqbaG2jBaLOftIWn48rfm2p7SFp+O635tqbyI20YMRZy9pG0/Hdb821PaRtPx3W/NtTeRG2jBqLOXtI2n47rfm2p7SVq+O635tqbyJNtGDUWcfaStXx3W/NtQ7E7V8d1vzbU3kRtowcizj7Sdq+O635tqntJ2r47rfm2pvIjbRg9FnA7FLV8d1vzbU9pS1fHdb821N5EbyJg9Fm/2lLV8d1vzbU9pS1fHdb821N5EbyJhBFm/2lbV8d1vzbU9pW1fHVb821N5EbyJhBFm72lrV8dVvzbU9pa1fHVb821N5EbyJhFFm72lrV8dVvzbVPaXtfx1WfNtTeRG8iYSRZt9pe1/HVZ821PaXtfx1WfNtTeRJvImEkWbDsXtfx1WfNtT2l7X8dVnzbU3kRvImE0WbPaXtfx1WfNtQ7GLX8dVnzbU3kRvYmE0Wa/aYtfx1WfNtUOxm1/HNZ821N5Eb2JhVFmr2mbX8c1nzbU9pm1/HNZ821N5Eb2JhVFmr2mbX8c1nzbVPaatfxzWfNtTeRG9iYWRZp9pq1/HNZ821PaatfxzWfNtTeRG9iYWRZp9pq1/HNZ821T2m7Z8c1nzbVN5Em+iYXRZn9py2fHNZ821PactnxzWfNtV3kRvomGEWZzsctnxzWfNtT2nbZ8cVnzbU3kRvoGGEWZvadtnxzWfNtT2nbZ8c1nzbVN5Eb6BhlFmY7HbZ8cVnzbVPadtnxxV/NtTeRG+gYaRZl9p22fHFX821PaetnxxV/NtTeRG+gYaRZl9p62fHFX821T2n7Z8cVfzbVd5Eb+BhtFmT2n7Z8cVfzbU9p+2fHFX821TeRG/gYbRZk9p+2fHFX821T2oLb8cVfzbU3kRv4GHEWY/agtvxxV/NtU9qG2/G9X821N5Eb+Bh1FmL2obb8b1fzbUOyG2/G9X821N5Em/gYdRZh9qK2/G9X821PaitvxvV/NtTeRG/gYeRZh9qK2/G9X821Q7Irb8b1fzbU3kRv4GH0WYPajtvxvV/NtT2o7b8b1fzbU3kRv4GH0WX/ajtvxvV/NtU9qS2/G9X821N5EeUQ6mIUWXvaktvxtV/NtT2pLb8bVfzbU3kR5RDqYhRZe9qW2/G1X821T2pbd8bVfzbU3kR5RDqYiRZd9qW3fG1X821Palt3xtV/NtTeRJ5RT6mIkWXTsmt3xtV/NtT2prd8bVfqNTexHlFPqYiRZcOye3fG1X6jU9qe3fG1X6jU3sR5RT6mI0WXPant3xtVeo1Q7KLd8bVXqNTexHlNPqYkRZb9qi3fG1V6jU9qi3fG1V6jU3kR5TT6mJEWW/aot3xtVfNtU9qm3fGtV6jU3sR5TT6mJUWWvapt3xrVeo1Papt3xrVeo1N7EeU0+piVFln2qrd8a1XqNQ7Krd8a1XqNTexJ5TT6mJkWWPart/xrVeo1Part/xrVeo1N7EeU0+pidFlj2q7f8AGtV6jUOyu3/GtV6jU3sR5TT6mJ0WV/art/xrVeo1Part/wAa1XqNTexHlVPqYoRZX9qy3/GlV6jVPast/wAa1XqNTexHlVPqYpRZW9q23/GlV6jVPatt/wAaVXqNTexHlVPqYqRZV9q23/GlV6jU9q23/GlV6jU3sR5VT6mKkWVPaut/xpVeo1Paut/xpVeo1N7EeVU+pitFlT2r7f8AGlV6jU9q+3/GlV6jU3sSeV0upitFlM7L6D40qfUantYUHxpU+o1N7EeV0upixFlP2sKD40qfUaodmFB8aVPqNTexHldLqYtRZS9rGg+M6n1Gp7WNB8Z1PqNTexHldLqYtRZS9rGg+M6n1GqHZjQfGdT6jU3sR5XS6mLkWUfayoPjOp9RqntZUHxnU+o1N7EeV0upi9FlD2sqD4zqfUantZUHxnU+o1N7EeV0upi9Fk/2s6D4zqfUantZ0HxnU+o1N7EeV0upjBFk/wBrOg+M6n1GodmlB8Z1PqNTexJ5ZS6mMEWTva0ofjOp9RqHZrQ/GdT6jU3sR5ZS6mMUWTfa1ofjKp9Rqe1rQ/GVT6jU3sR5ZS6mMkWTTs2ofjKp9RqntbUPxlU+o1N7EeWUupjNFkz2tqH4yqfUantbUPxlU+o1N9EeWUupjNFkz2t6H4yqfUap7W9D8ZVPqNTexHltHqY0RZL9reh+Mqn1Gqe1xQ/GVR6jU3sR5bR6mNUWSva4ofjKo9Rqe1zQ/GVR6jU3sR5bR6mNUWSva4ofjKo9RqntcUXxlUeoE30R5bR6mNkWSTs5ovjKo9QJ7XNF8Y1HqBN9EnltHqY2RZJ9rmi+Maj1Antc0XxjUeoE30R5bR6mNkWSDs6ovjGo9QJ7XVF8Y1HqBN9EeW0epjdFkf2u6L4xqPUCe13RfGNR6gTfRHltHqY4RZG9ryi+Maj1AnteUXxjUeoFN9EeW0epjlFkb2vKL4xqPUCe15RfGNR6gV30R5dR6mOUWRjs8ovjGo9QKe17RfGNR6gTfRHl1HqY6RZF9r2i+MKj1Ap7X1F8YVHqBN9Enl1HqY7RZEOz6i+MKj1Ap7X9H8YVHqBN9EeXUepjxFkP2v6P4wqPUCe1/R/GFR6gU30B5dR6mPEWQjs/o/jCf1Antf0fxhP6gTfQHl1HqY9RZC8AKP4wn9QKeAFH8YT+oE30R5fQ6mPkWQfACj+MJ/UCeANH8Pn9UJvoDy+h1MfIsg+ANH8Pn9UJ4A0fw+f1Qm+gPL6HUx8iyAdBUfw+f1QngFR/D5/VCb6A8vodTH6LIHgFR/D5/VCh0HR/D5/VCb6BPrCh1OgIu/8AgHR/D5/VCh0HR/D5/VCb6A+sKHU6Ci794CUnw+f1QngJSfD5/VCb6A+sKHU6Ci794CUnw+f1QngJSfD5/VCb6A+sKHX2HQUXfvASk+Hz+qE8BKT4fP6oTfQH1hQ6+w6Ci794CUnw+f1QngJSfD5/VCb6A+sKHX2HQUXfvASk+Hz+qE8BKT4fP6oTfQH1hQ6+w6Ci794CUnw+f1QngJSfD5/VCb6A+sKHX2HQUXfvASk+Hz+qE8BKT4fP6oTfQH1hQ6+w6Ci794CUnw+f1QngJSfD5/VCb6A+sKHX2HQUXfvASk+Hz+qE8BKT4fP6oTfQH1hQ6+w6Ci794CUnw+f1QngJSfD5/VCb6A+sKHX2HQUXfvASk+Hz+qE8BKT4fP6oTfQH1hQ6+w6Ci794CUnw+f1QngJSfD5/VCb6A+sKHX2HQUXfvASk+Hz+qE8BKT4fP6oTfQH1hQ6+w6Ci794CUnw+f1QngJSfD5/VCb6A+sKHX2HQUXfvASk+Hz+qE8BKT4fP6oTfQH1hQ6+w6RQU0tZXQUkP9rPK2NnDIBcQMkdgzk+QFZhuVNBvWvS1O3FKI+lqAeP2CLA3SevecWg9o3lwGl9L0tBrCkkZUOnMEEk5D2jLXHDGn0hz/kXYWUwqKu/1/SlrpWtoonjjuNY3iR5d+R/qhfLe2GMli8zp4am/QSt+ebUV+qXnLwPWZROnHBuu+Dv/AKYq7+RivVlzdd7/AFVZvZjLt2LyMHAfX6VxQxnjyXffASk+Hz+qE8BKT4fP6oX0vDRo4ajCjT0jFJLwR5apmdGpJzk9X3G80VqWK2bPRW1sUAkiqZqeKKBpZ0pa4gHiSeOMk8VxtZqesv8ApG9SV1JR4p6yKKFrWO8UOYHZyT7oZ5jHmW8foqnNDT0fshN0cL5ZANwe6kkLif2gehSz6Zg9jr/au+Zdw1sDt/AzwhYvETyDB4Wr5ZJXqSrJ310TnwX6cXxO7hnirRdKMvNjB8uiMeLmtnVS2k1zDTStDqS8U76SoYR4rnNaXMJ7SQHN8xXZPASk+Hz+qFt6vScNqq7Zc4a2ZxpbjTyFpaACC8NI+Ry9XnNOni8vrUXzi7eNrp/ozq8FmVGOIg0+aOzPp3X/AEfcLPOTJXW2V9PvO4uc+PjG/wA72FpP5RWI1mWhj7x2kXJjXO6O50MVSQeXSRkxnHl3S3PmC4G6aGon3GokbVzRh8jnhgaMNBOcD5V4vsNjd1Vq4V+jJRqR7tpLaXhfT9DvM+nThTjWlybi/wBOHsMcIu/eAlJ8Pn9UJ4CUnw+f1Qvo++geZ+sKHX2HQUXfvASk+Hz+qE8BKT4fP6oTfQH1hQ6+w6Ci794CUnw+f1QngJSfD5/VCb6A+sKHX2HrVyirlFgdoyFRUqIQKHmqoeaAIiIDo+0D7awfmB+8V1xdj2gfbWD8wP3iuuL849rfvnEfm+CPa5d9lh4BERedN0IiIAsVbbbnJJWUtmjcRExnTSAdbjkD5AD8qyqsL7WHxv1nOG+6ZFG13n3c/QQvVdjqMamZKUl6KbXjovidllVNVMRryRsqKrp7LoqKt4Pr5KuZtI08oyWMDpPLgcB5T5FzmxWvgoaJ7ZuBra4QBx/GEeWj5cj0hdRrIjWaUywZkt9QZHD/ANnIGgn0OaB/qCUtY6l0bQ1NMPstLdnPJ8u4wt/dcvoWLwEMTgalF8Zzafdxcf04PxZ4bGOvW7aqhXdoRi9jwcePrv6j0Oi2NiudNeLTT3GlcHRzMDsdbT1g+UFb5fFqlOVKbhNWa0Z6hpp2YREWBAiIgCIiAIiIAiIgCIiAIiIAiIgPvbvthT/nW/SFkM81jy3fbCn/ADrfpCyGea+wfRl9nxHivczy/aD04eDIoqovpx50KKqICIiIAoVVCgIiIhGCoqVEBCoqVEIwiIhCIiIAtK1LSgC0rUtKEYREUYBUVKiAKFVQq8jFkREQEPNEPNFAaUREAQ8kQ8kMTShRCgIiIgIVFSohGEREBDzRDzRAaUREAWlalpQiCIiEBUVKiAKFVQoGBwIOMr7ian/Chx5uK26hQJ2N8x1K44DWg+UL69FF7235Fxi3NHMQ4RuOQeXkVMlK/E3XQxe9t+RToove2eqvoohyWRo6KP3tnyL5zdDEAXRt49jQvstncD47R5MqMxlogaiD3gfIFO+KfrgHyBbZaVDi22bwTUh5xY/0hfRraST3IYT2clxyKjaORNLAfwSPSvm+hb+A8jz8V8IqmSPr3m9hW+hlZK3LT5x2IjNbMjYSUszOO7vDyL4Lml8Z4I5eYw7tCNGLp9Diii+tRC+J3HiOor5LE42rBaTzWpaTzQjCiqiqIRERQBRVRAQ8lFTyUQBCiFCEREQMKFVQoQiIiAi0rUtKECIiALStS0oAiIhGCoqVFCEKipUVYChVUKEIiIhAoqoogFDyVUPJGCIUQoQiIiAKFVQogRERGRkPNRU81EIRERAEREBpQ8kQ8kBEREIQqKlRAFCqoUBEREIwoeaqh5oQLStS0oAiIoQiIiMMKFVQoiEUKqhVDIiIsWQhRCioCIihGaURFUAoqooQiiqirAREUBCoqVEJzCIiBkKIUQEPNRU81EBEREAREQxIeSip5KIAeS0rUeS0oRgqKlRCBERRgh5qKnmogIiIqQiiqiiARERghUVKihAhRChCKFVQqoERERhhERQgREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAXzdVU8UTZntlnhcHbrqctcMtdukc+eeHn9K+i4+hjFDXW+1CWaelqqmR248tHRkB8vAhoJG8Os/zB6nO516eElUpSso3cuuyk29nvvbjpxO0yenRqYlQqq7ei6XbXHusbyhqaE6gkp6SumbUysA6Oaje07sZy4BxaBjx/Lz4Lc3eqrIsRWqnoj4xMhn3gM+QAcTnrW1lGdc0Hkp6o/tiW7rP71J514rAZPh8Zm//ABLc/wDDjPV83ZatJcOR6rHZnVwuXJ0Eo+e46Lkr9b8eZx3feojzhso/0SH+avfOoD+DZR/8iQ/9pbpF7NZBl64U/bL5nlnneMf83sXyNr09/PXZR/wV5/7a0sffGGQsdZGGQhzyKF/jEDAJ+yceAAXKW+COrjdI2XLWuLPF7RwI9B4LTVwGCTdzkHiCurorIq+MlgoK9SPLzuK772ujsKtTN6OGWKlpB87Ln3dGcd0l99+s3/EH/wDerb3I6hfRP6EWGolaWuZHLRPDXEOB59IcHhw8uFyaLufqbBWtse1/M6xZvik77XsXyPjZL7RXip6Gam9j75Cxzeinjy5ueZafwmnA5EZ4eRbp1RFUXiSidFUMlDXP3nbga5rd0ZHHP4Q6u3yZ2VOT4XW9ueHetQSPTF9ZX2j46/A7LfJ+2SP6l8/xGFjk2PxPksmtiltLW9ryWl2r27j2dKv9aYShv4p7U7P9E9fE+sgDZHNByASAVpRF9RgnGKTd31Pnc2nJtKwREWRAiIgPQzlFXKLaPashUVKiECh5qqHmgCIiA6PtA+2sH5gfvFdcXY9oH21g/MD94rri/OPa375xH5vgj2uXfZYeAREXnTdC21wrqS30zqitqI4Imgkue7Hydp8i4LXurKbTNC0ACWunB6CLq/Kd5B+1YbuVzrrtUGpuFTJPIetx4N8gHIBeoyTszWzGO+qPZp+1+HzOxwWXyxPnN2R2XWG0e51szqeyl1DSg46TH2V/p/B9HHyrhr8+Ssp7fdXvMhqKZscjyckyRjcOT24DT6VxlFb6mvq209JC6WV3IN7OsnsHlXYqGOy01vrbVW3R1Y9re+Syij3mxOYDvYe7AJI4cARy4r6FTwmFy9RjhoarjZXbT5t+OuvSyN3FYzAZNsyrVFC/Xi/i+pw1jqmUt1j6dxFNMHQT9nRvBaSe3Gc+hfSwU0kN1rtJ14IFW7cYR+DM3JjeO0HJHmctJr9Ks8ZtLeKg9THSxxj0kB30LlIK6w36Fr+hrLRU22PpGVrpBOGtaRutdgNJ44A5n0LcrbyKk3TkotJX00ad4u19p2fJJ30PmvajP8rzDGYfGZdXTr0nws0pR5q7Vlpfi7WufLRmpq/TMzmMb01K92Zadxxx5ZB6is12e5Ul2t8ddRSiSKQdXNp6wewhYe1TZJamD2dthgqoZhv1DaV4eI3dbgOYaefEAjkV1u0Xy72SoM1rrHwOd7pvAtd5weBXnMzyKhnUN/QajV5+PSXeutvWrH0ipDD5jQjiMO+K/dz0iix7ofaMy5zx2+9RR01S8hsc0eejeeoEH3J/Z5lkJfOswy7EZfV3VeNn7H4M6erRnSdpoIiLROMIiIAiIgCIiAIiIAiIgCIiA+9u+2FP+db9IWQzzWPLd9sKf8636QshnmvsH0ZfZ8R4r3M8v2g9OHgyKKqL6cedCiqiAiIiAKFVQoCIiIRgqKlRAQqKlRCMIiIQiIiALStS0oAtK1LShGERFGAVFSogChVUKvIxZEREBDzRDzRQGlERAEPJEPJDE0oUQoCIiICFRUqIRhERAQ80Q80QGlERAFpWpaUIgiIhAVFSogChVUKBkUKqhQnIKsO69ruw5URAcsog4gFFTYItjX/2w/JW+Wwrv7f0BRnHU4HwWlalpWJwkREWQIVY3ujeHNOCFCooiHLQStljDhz6x2LWVxlJL0UoJ9yeBXJlZI54yujS5oc0tcMgrjKqEwvxzaeRXKLRPGJYyw+jyFRoSjdHErSea1OBaSDzC0nmsTXYUVUVRCIiKAKKqICHkoqeSiAIUQoQiIiBhQqqFCEREQEWlalpQgREQBaVqWlAEREIwVFSooQhUVKirAUKqhQhEREIFFVFEAoeSqh5IwRCiFCEREQBQqqFECIiIyMh5qKnmohCIiIAiIgNKHkiHkgIiIhCFRUqIAoVVCgIiIhGFDzVUPNCBaVqWlAERFCERERhhQqqFEQihVUKoZERFiyEKIUVAREUIzSiIqgFFVFCEUVUVYCIigIVFSohOYREQMhRCiAh5qKnmogIiIgCIiGJDyUVPJRADyWlajyWlCMFRUqIQIiKMEPNRU81EBERFSEUVUUQCIiMEKipUUIEKIUIRQqqFVAiIiMMIiKECIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgC2U33T2L89N/Bet6tjL91NjH/tJv4Tl1eefdmI/JL+1nZZN94UfzL3m6dx11SeSlqT/zoluq3+9Sedbb/wDnlP8AoVR+/EtzXf3uTzrzOSO+cL/sQ+B3ubr/AMNX/dl8TRFG+V+6wZK+k1JNE3ecAR14PJbfTNQ+e83eN+N2mdFGzzFm+fTl37AufIBBB4grQz3tnicvzN4enBOELXvxd0m9eXHQ2sr7L0MXgVWnJ7UuHRdPHvOm2aovFmrKqk7w7/oJp3zwzMmax0W+7Ja4OPEAknIz/Ic1UTvqHhxaBwwGg5XxW2kmc29WmmHuJ6h2/wCUNie4D1g0+heqr5bgcvnWzWFP/EUZSer6Xfcm+p0NLH4vHqngJT81tL9+ByQop9ze3R5s8VtyCCQRghc8uJuQAqjjrAXnuyvavFZri5YfERXBtW0tZrTi+p2vaDs9Qy/DxrUW+Nnf3nG0v3Y0Pkoqj96JfWA52hyj8W2/TIPqXyo/uyo/0Go/fiX0pQfbGqz1C2R/xXfUtHtI7Y7Gf9lf3xOxyRf8Jhv+4/7WfY8yoq/3Z86i+mQd4pnz+StJoIiLIgREQHoZyirlFtHtWQqKlRCBQ81VDzQBERAdH2gfbWD8wP3iuuLse0D7awfmB+8V1xfnHtb984j83wR7XLvssPALRLIyKJ0srwxjAXOcTgADrWtY82y3t9LR09ngeWuqcyTY/EBwB6Tn5F1mWYCePxUMPHS/PouZ2eHoutUUFzMda0ub75qaqry8uiL9yHyRjg36/SlkoI6hk1TVzd7UNMA6omxkjPJrR1uPUPqWzZH0j2tY0uc4gADrK3mrpo6Kkp9PQSB7qd5lrHN9y6YgDd8u4AR5yV9rp0dmNPC0dNLeEVxfwXezZ7VZ5Ds5lsq0Lbb0iu/r+nFl1NeZ4HS2q2RRUVveAQYuL6hhwQXvPE57BgA8McFxdil6MV5yfGopG/LhWha+507LexhfVsP+zY5vBPGP5eI9Paubp6a16f6VlQWXO5lu46LH+zw9ZBOcvcMdXDzrclKjhKW5UbyfJcX3t/FvuPhOX5dm3afMN9BufWUnpG/L9OSXjY6mOpbyokdT25lG04MpEs3l/FHoHH0rnhqm5Nm6KN9FT44sbFRwsLR2DDc4T2Ypbm7dvlthqiDwngAgmA8paMO9IR42tdOdLTuld+1Je09NU+irMKVGUqNaMp8Larx1OtUNZV0VSyooqiWCZp8V0biCu21dMLxa310kcMF4gb0lTBFgGWPh9kLR7lwJ4jrHHAXD323ttTIKq3yuno6kHoqlww4Ec2EfguGR585C4yhraqhrGVlJO+GeM7zXtPHP81nWpRxsFXou0lwfPvi+i6rk9bXR5bJc5xnZPMHCqno7ThfS3z6P3m+DGt4rM2zXU8V4tzLfUSHv+mZh29/vjRwDh+zKxbfWw1VHS3qkibFFWbwlib7mKZuN4DsByHDz+RbHT1ymtOoKKviJHRTNLh2tPBw9IyvO5vlsM2wbi1aavbuktGvXp7T9GyrUM0wMMRR1UldM9IIiL4wecCIiAIiIAiIgCIiAIiIAiIgPvbvthT/nW/SFkM81jy3fbCn/ADrfpCyGea+wfRl9nxHivczy/aD04eDIoqovpx50KKqICIiIAoVVCgIiIhGCoqVEBCoqVEIwiIhCIiIAtK1LSgC0rUtKEYREUYBUVKiAKFVQq8jFkREQEPNEPNFAaUREAQ8kQ8kMTShRCgIiIgIVFSohGEREBDzRDzRAaUREAWlalpQiCIiEBUVKiAKFVQoGRQqqFCcgiIgOVZ7geZEZ7geZERzkWwrv7f0Bb9bCt/vB8wRmFTgfBaVqWlYnCRERZAhUVKiiIFylM/fgY488YK4tb+3nMJHY5VcTOnxNyiIqcxx1wZuz7w/CGVtTzXIXMeIx3YcLhL1cKa02itulY7dp6OB88p7GsaXH9gWLNea1N2osYbEdd6x1/FLdrjYKC12RuWwzNc8yVD+xgPDdHW7t4Drxk9EScXB2ZERFDEKKqICHkoqeSiAIUQoQiIiBhQqqFCEREQEWlalpQgREQBaVqWlAEREIwVFSooQhUVKirAUKqhQhEREIFFVFEAoeSqh5IwRCiFCEREQBQqqFECIiIyMh5qKnmohCIiIAiIgNKHkiHkgIiIhCFRUqIAoV9o6eeT3ETz5ccF9hbqo82tb53IVRb5GyRcgLXP1yR/tT2Km98j/ali7uXQ49Q81v3WypHIsd5ivhJRVTOJhcfNx+hDFwkuRt1pWtzS04cCD5VoQxCIihCIiIwwoVVCiIRQqqFUMiIixZCFEKKgIiKEZpREVQCiqihCKKqKsBERQEKipUQnMIiIGQohRAQ81FTzUQEREQBERDEh5KKnkogB5LStR5LShGCoqVEIERFGCHmoqeaiAiIipCKKqKIBERGCFRUqKECFEKEIoVVCqgRERGGERFCBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBbGX7rLH+VP/CK3y2En3W2P8qf+GV1We/dmI/JL+1nZ5L94UfzI3g+72D9Bn/fiW6rv73J51tr211NPHeqWCplnh6RkscLQ9z4s+MACRxJa3jxPNbitLTUvcXsaM83OAXkuzlaNbMFiVpDdKOvWLin/ALHos9oyp4JUXrLeN6dHdo2Wkft9qD89B/BauzLqNjuFrtt6vD6272yDviWJ0bXVcYcQImg8M5HFdgivFomOIrpQyE/i1DD/ADXie1dKdXNa1SEW4trW2nBHq8ikoYClCTs0uBxy2U/3TWL8/L/AkXKMhY/3NVTO80mVpdaJX3W3Vomj3KWR73Djl29G5vD1l9KzjtFlk8BWpRrJylCSS14uLS5HhcqyXHQxlKpKm0lJN8OpzS4q5/3o+YLlVtKqjM0u/wBIG8MYwvm/Y/McNl+YOtiZbMdlq9m9brpc9n2kwVfGYNU6Ebu6fLv6nBUf3ZUf6DP+/EvvSD/9wK13ZbYh/wDUevpU2+akulPdIiZhHFJC+NrTvBrt07wxnJG4BjHHPkwddDGPCiactIkfb4t/n+PJw44+gLuc+zDD4qriMTQltRnTUV4qUW7p2aStz43Vr6208owdahSo0asbSjJt/qmlrw/evI0Sf2jvOVpWub+1f+UVoX1jDu9KL7l7j5tWVqkl3sIiLlOMIiID0M5RVyi2j2rIVFSohAoeaqh5oAiIgOj7QPtrB+YH7xXXF2PaB9tYPzA/eK64vzj2t++cR+b4I9rl32WHgFhbbcXeGNP2ChZj13rNKw3tnaX6tiPZSMA9Zy2exv3kvys73LIuVfQ4LRjmtvUdQ9ocKaKWpAIyMxxueOHnaFwMvQVsjpGyCGZ53nNkd4riexx5en5VzumS6GWtmY3MkdvqC3yExkZ+QldVPJfW8FC9epJdIr+4+Z/S1iGsZh6T1Si3bxf+x2jTlM+z0NVfKiJwqIz3vRg9T3tOX+XDeXlI7F0XWt4ngDKOj3m1EjS97xzawcz+w8fIu9UzHjZ7FOA5w9lHsOTwb9iaQPpWPNRNZHqmjmq8R01RC6nc8jg3eDmk+jeBXJlyjWxc5z1d2v8ATwXvf6nfZHTWX9k41MKrOo7yfPV24+FkdNY9rpt+d0jsni4O8bz8ea7VYbxU0FRDS1NR3xRVP9jOeberB7MHgR1ebn1etppqOrlpahhZLG4tcFrZN/6ufTuOcStezycCHY8/i/IF6OrSjVjsyR0uCx1bB1lVpOz9/czOukyKyR9glPSU9e0tDTx3JQ07j29hBAHlBK6qeiB4B5GO0Bczopkst2tXQkioMsRz2HIJPoXH3poddKyWIAwOneWObxGC44XmcF5mJqRT0aT/AF1V/wBVb1GP0r4anvMNioJKUk0+tla1/C5ztoMU+iq2GJrukp62KZ4c7OGOa5pI4Dr3R8i4zcAcHDmDlbvR+8KS+OOOiFu8fPLPSx7vpz/NceZsHGVwbOzXqpdffFHt/o2xe+yGEZr0XJe2/wAT0fZa1lytNLXswBPE1+OwkcR6Ct4uv7O3b2irYe2I/vFdgXwnHUo0cTUpx4KTXqZz1oqNSUVwTYREWqcYREQBERAEREAREQBERAfe3fbCn/Ot+kLIZ5rHlu+2FP8AnW/SFkM819g+jL7PiPFe5nl+0Hpw8GRRVRfTjzoUVUQEREQBQqqFARERCMFRUqICFRUqIRhERCEREQBaVqWlAFpWpaUIwiIowCoqVEAUKqhV5GLIiIgIeaIeaKA0oiIAh5Ih5IYmlCiFARERAQqKlRCMIiICHmiHmiA0oiIAtK1LShEEREICsW7Xtqlx2bGmmuelI62hq5Xx089PcuJ3eI32ujG6SOOASOfFZSK8992/9xNh/WTv4bkOWklKaTOz6L2t6j1fYZL7Ytm1VWUMUzoXmO7QiTeaASAxwaTwcOS3uidtuj9SXoWCqbXWG89IYu9LlEIyZAcFgcCRvZ4Ydgk8AFwHcX/ekqf1vN/DiWNe7UsNNbtbWi/UsYikudM9s5aMb8kRaN8+Xde0f6QhyqnCVRwserLrJcIqMvtlJT1dQDwjnqDC0j8oMdx9HpWCJu6SMeo36edoSp9kWVZojELkz+1D9zdzuY91wyu/9zvqqp1dsqtlwr5HS11OXUlTI45L3R8A4nrJaWk+UleUrh/umKj/AOMnf9dKEpUk3JSXA9nV1x1RTWM1rNO2+orGbzn0jLo4eKBkbrzCAXE5GDgcuKxLo/uiZNV6jpbBZtDzS11Vv9E19zYxp3WOeeJZgcGlZ6XhfuX/AL+unPPU/wDVpUMaUIyjJtcD05q/bTctDOpX612dXa20dQ7cjqqathqWOdjOOBABwCcEgnBWRdEarsWs9Pw33T1a2qo5CWnhh0bxzY9p4tcMjh5QeRBWMu7IrbbBsWmpKuSMVdVVwCjYSN4va4OcQPIzeyfKO1dT7hGiukVg1NXTskbbaiogZTF2d10jA/pC30OjBPk8iI5dlOntHeNsG2K47MquiZedHx1VPXdJ3tPS3TIduEZDg6IFpw5p6xx5lbbSm1HVWs7Iy/2HZw6eikc5jXOvUTCS04PBzR1rpPd6fazSX56q/diW82D6kotJ9zRJfK2ojhFM+rdEHkZkk3juMAPMk4GEZJxW7TS1Oy2favdpdo9t0Rf9B11jq6/fMc0tY2VhDWOdlpa3Dx4uOB4ZWUZHtjjc97mtY0Euc44AHaV1mmtMeo6PSGoa2Qd/25rawSCMZeZKdzHt8gJeHcPxQsXd2JrKqsulqHTFvmfDLeC91U9pwegZgFmf8xcPQ0jrUNdRU5KMdDmbxtyt1RqQaa0JYKzV1z3iCYJRFT8OZEhByB1uwG+Vc54W7QrbSmtvmzjpaZo3pBarmyonYPJE5rd8/kuXT+4309TUOz2p1AYmmsudU9vSY4iKPxQ31t8+kdizkqKmxCWylwOkbMdots2gVF2daKWphpLe6Fm/UN3Xve8OLgW5OMYA59q3u0PXumtCWttdf63cdJkQU0QDppiOe63PLynAHatWn9MUemtR6mvsD44qa7viqZY2tx0cjGOEjv8AVkO85K8hR3Gp2t7dqF10e91JX3BsbIXH+ypGuLujGOXiA8e0k9aiMqdKNSTfJHozTG0bXurqYXPTuzdkdpcSYam43QQmdva1oYT6eI8q3F/20v0fSOpdUaLu9su03CjbvsmpKh/AYE7T1ZBI3cgdSybDFHDCyGGNsccbQ1jGjAaBwAA6guL2haOpta6GqbHUGOOV72z00z256KVjgWu8nIg46nFXmY05RcuGh8dq2srroXT9TqFmnYbra6VrDO5lf0UzN5wbncMZBGSOIdnjyXSdlm3Kv2jXye1WHRTYn08PTTS1V1DI2NyB+DESSSeoLs3dKfeO1R+jM/isWDO4T+63Un6BH/EQ2Ixi6blY9Sakr6O2WiS4XKphpKWAb80sj8MYAOJJKwo/aJBtQNy0xpXRlTfrTuhlbWVdc6ggwTkDLWuec45cCRnIxldR7uDV1WbtatFU0zmUjIBXVbWnHSPc5zWNPaGhpOO1w7FkTuYrTBa9jdokijDZa4yVU7se6c55APqtaPQozinBQhtvjyNredpFVs6bb6HVmh/YmzOxT09ZaqsVNOzA4N3SxhbgDljiAcZwVkex3e3X20wXWz1kNbR1Dd6KWN3iu8naCDwIPEHmurbe7VBd9kOo4JmNcYKN1VGSOLXRfZAR2e5I8xKwR3HWqquj1fVaTllc6huELp4YychkzBkkdmWZz+S1EYKmqlNzXFGSdou2y46DvTbXftDyB0jOkhmhuQdFM3kS0mMHgeBBAPyhd62Xa6tOv9NMvFszDI13R1NK9wL4H9h7QRxB6/OCB0/a9oug15r+jsNc8xOOnauWmnHEwzNqKcNdjrHEgjsJ5c1510ffdSbGtpU0VZTva6B/QXCkz4tRFzBafN4zXfyJCGcaMKkPN9I9WbTNbXrRjIKpmlBdqGoqY6WKSCvDJBI/g0OY5nDLsgEEjlnGcLtlomuE9AyW50UNFUu91DFUdMGjq8bdbx9HpXSNfXi26h0Lp682qoZU0VXfLXJE8dnfUeQR1EcQR1EELIahrSSUVpqba5vro6Nz7fTQVNQPcxzTmJp/1BrsfIsHVvdEOo9TS6dn0TOLhFVmjcwXFuOlD9zGdzGM9azyeS8Oa1/3Qtw/+I//AL4VObDU4zbUkelNSbUrrpOGOs1ds+u9BQOcGuqqWqhqmMJ5b26Rj048mV3DRWr9P6ytPslp64MqomkNlZgtkid2PaeIP7D1ZXI3210d6s1ZabhE2Wlq4XQysI5gjHyjmD1FeLNil/rNFbXqKASu6Cas9jqxgOGva5+5kj/K7DvR5UEKUasW1o0epNq2u7loG1m8zadiuNs6VsXSRV+5I0uHNzDHgDORwcerkuu6B2v3vXENZLp3QT6htG5jZt+7Rx4Ls4xvMGfclfXur/vOVn6XB++uj9xpVU1FYtW1dZURU9PFJTvklkcGtY0NkySTyQsacXRc7andtR7WtQaauVDSah2cVtDFWzsgiqRcY5Yt5xx7pjSM9eCQeCyyV0LT74Np+y9lVWSfYq2tmmppDGMxtirH9CccOIaxoPbx7V30qGvUtwtZm2uL62Oje+300FTUDG5HNMYmu48fGDXY4eT5FhOu7oOSi1TLpqfRMwuMdX3mWC4t3ek3t3nuYxnrWdF4o1z/ALpCr/8AiCP+I1VHNhqcZtqSM+aj2yzaRuVPSa10PdbRHUZMU8NRFUseBzwQQDjIyM5GeSyRp29WvUNmp7xZqyOroqhu9HIz5CCDxBB4EHiFhruzauhbom0UD3s7+kuQliZnxujbG8PPmy5i33chUFxo9m1VUVjZGU9ZXvlpWu62BjWlw8hc0j/ShJU4uiqi0Zk/Wt/pdLaVuN/reMVFAZN3ON93JrAe1ziB6V9NKXqk1Hpu332hOYK2BsrRnJaSOLT5Qcg+ULDvdSz3W92ipsFlb0lNZ6dl0u5B5BztyJnnx0khB6mA9i2Hcd6t6e3XDRtVL49MTV0YJ/3txAkaPM4h3+soTcf4O3zMn7UteS6KfZ4aawVF6qbrO6CGCCXcdvADGPFOc5XW9abV9QaOtNPc9Q7PpaSCol6FmLtFI7e3S7BDWnHAFZIr7NR1t7tt3nDnT24Td7jhgGQBpd58Aj0lYd7sr7grR+tB/CkUJRUJSjFo53R21PUer7HNeNPbPJaymhmdA7/1vEx2+GtcQA5o6nBczs/17ctY2y7S0umTQXC2VQppKOtqywl2MnLhGS0jsx6V1LuO/vYV/wCuJf4MKyxbbNR2+7XO5U4c2a5PjkqBwwXMYGAj0AfIqStsRlKNveYcf3QT2aoOmn6KmbcW1veJjNxbgS7+5jO5jG91rs+q9pWoNJUPslqLZ7XQW9rg19TTXCKcMycDIGCOPDJwM9a863n/AHSM3/xWP+shepNttXQUeyjUbrjIxsctBLDGHH3UrmkRgdp3sfIoc1WnThKCUePibrZ7rrT2urW+usVQ8uhIbPTzN3ZYSeW8MngcHBBIODx4FcPtV19cdAUDbpU6cjr7bJOIWyw1+68OIJG8wx8OR5ErCvcdUlxdri6V0TXi3x28xTu/BMjnsLB58NcfNntWS+61+9P/AP6EP0PVMJUYxrqHFHI7K9qFftClqXWzS7KWlpHsbUTVFx5b2eDWiMlxwCeoeVXaltMuWgJqc3DSraylqjIIJqa4Z4MwTvNMYLTgg9Y58V07uMvub1B+mR/uFd92m26lvGrtIWquj6Smq318Mre1rqOQH08VDGcIRruNtF8j4bH9qtv2iTV9NFbn22qo2tk6J8wk6RhJBcCAORwD5wsiLxToe4Vey7bKyO4OLGUdW6jrTyD4XHBf5sbrx5gvV2026VNDpR9Pa5ALndZGW+3kHlLLw3/9Ld5/+lBiKChNbPBmM9Rd0ZbbVe6ugh0zUVcMEro46gVYYJmtcRvgbp4HBwstaRud0vFphuNxtMNtZURMlhjbV9M/DhnxvEaGnGORPoXkPug7XS2TaRNaKJm7TUdFSwxjrw2FoyfKeZXqy6Xoac2Wvvm6HuorS2VjTyc8RjdB8hdgIZV6UFCDguJxm0fanpzRdSy2zCe5XeXHR0FIA54z7nePJuc8BxJ7FrbqHaIbX7IHZ/QjLd7vP2bHfGPN0W5nyby87dzvDJqbbZTXK7yOq54xNXSPk4l8gGA4+ZzgR5gvYJ5IzCvTjRaja7Oh7OtqWnNZ1clsiFRbbxFvCSgrGhsmW+63TydjByOBGDwXM69vt207Zprrb7ALxBTxmSoYyq6OVrRzLWlpDgBknjnhyK8w90PDLprbbU3O0yupJ5BDXRvj4FkmMEjzuaSfOV6SjvQ1FshkvgaGGtsr5ntHJrjEd4DzHISwq0Yw2Zrgzo+hNvtk1HqWms1baZbQKo7kVRJUh7DIfctPijGeWe3HasuXKStio3vt9NDU1A9zHLMYmu7fGDXY+T5F5H2sbNJLFpqzaws0TnWysoqd1Ywce95nRt8b8lxPoJx1hZd7nHab4UWxum73UZvVHH9ikeeNVEOvyvb19o49qWMq+Hhs7ylw5nbNBa0veqbhcIH6U9jILbVvo6qWavDiJWjJa1rWeNzbxyBg5BK67tI2v1ug7vDbrzpNsjp4ulikprlvMc3JHXGCDkdYXadmQAqNW4AGdR1BPzcSwt3ZH3R2D9Dk/fCIxo04TrbLWn6ma9m2q7lrGyU98dYordbqgO6Fz63pJXbri3O4GAAZB5uz5F9toOu9O6Htzaq91REkuegpohvTTEc91vZ5TgeVcXsBIGx7TxPACB/8R68yVl1m2j7Z6Oa4PfJTXC6RU8cZJxHTdIAGgdXi5z5ST1pYtPDxqVJX0ij0vp/V2tdQWtl3tuhaanopm79P3/duilmYeTg1sTt3PVk+Xkttp3a1aarUz9Lakt1Tpq9teIxDVPa+J7jyDZBwOeokAHIwTlZGa1rGhjGhrWjAAGAAvNndi2yGG76fvEbQJaiGaCQgcxGWlv8AEd8iiOOhGnWnsNWuekkWPu591NU6o2aUdTXSOlrKOR1HNI45LywAtJ7Tuubk9Zysgoa84OEnF8jgNb6wsOjbV7IX2sELXZEUTRvSzHsY3r8/IdZC6bpzaJrHVsZrtM6A/wDVe8RHV3C4CHpQOxoaflG8PKsCanvFRtO2x08U07+8qq4Mo6VueEVP0mMgdpGXHylexqSmgo6SKkpYmQwQsEcUbBgMaBgAeQBXgbNWlGhFXV5P2GNdU7V59J0MnhTpC526sdG40pjkZPSzyY4N6UYx5QW5A44XZNeaouOmNNyX+KyxXCighbJOBWdHIzJA4NLCCBkdefIt7r7TlNqzSNwsNTuDvmIiKRzc9FIOLH+g49GQuI2xx9Hshv8AGSCWW8jPmwoccd3JxVuep1jZ7tiqtcXt9ps2lAyWOEzyPqLjusawEDqjJ5uHABZOuLry2h6S1WuCvqgMvgdVGIcuTX7hBOeHHdHlC87dxdTsqNe3gSZw22ZwOv7KxeuWsaxgaxoaB1BWxzYjDxhUtFaGM9l+o7zra0yXcaajt1G18kTO+Lh48kjMjGGxnDd4bpJORxwCusa824u0DqWSw3fQ/wDtUbGyCSC5B7HtdyIJjB7RxA5Lu+wTA2bw/rCv/wCuTLzj3YcjJNrcZY4OAtkIyPypFbHPRo03VcbHqXQOoLtqWxUd7rbJT2uiradtRTjv7ppS1wBaXNEYABac+6J5cFNo2r6XR+kLhqF8Hf3ebWO6Bkm6X7z2t91gge6z6FwezuWR+zrTLXPJa20UoA6h9hat3qK0Ul8tb7bXBxp5JInvaMeNuSNfunPUS3B8hKlzTlWSnw0udZk2tami0vLqSp2aVVNbo4enLpbrG1+527m7vfKFxeitvVdrGvnobDoOWongh6Z7X3RjPFyBzcwDmQuc2y/es1H+gSLB/cifdxdv1af4rEvobFNxlRlUtqvEzvpLalX3XXUmkLxo+osVa2kfUtfPWNkY8AgDBa3BBJ5gnGCuA2hbd59D6hNkvGjxJP0TZmSU10D43sdkAgmMHmCOIHJd1qbRST36ivTwRVUkMsLCMcWSFpIPpYMeleae62++TQ/qmL+LMiJhpwrVFFrkeo9n+oLlq6w0l7rbBTW6grIBNTh1b00pBPDLejAAI4+6J5cOzre0TU940xerZQxaQFcy7VgpKKaC5AAyH3Ie10Y3CRk8CRwPFcjsduJi2Y6YilblgtVOARzH2Nq07VHslu+gXsIc06liwf8Ag86GC3c5tWNvrK4al01pqe9y6epKyOkgfPVxwXE5ja3iS0uiG94vE5x2DKx7ovbPWavuslrsmjZJalkLp3NfcWMG6CAeJZ2uCzNtR+9lqn9TVn8F68s9yDT987Tq2MO3SLRKR87EljKGHpulKVtV4mTb7tdOl7nBRav0hdLSJxmOWOaOoY4DmQWkA4yMgcRnksiWS6UF6tVPdLXUsqqOoZvxSs5EfyIOQQeIIwsPd2DJSwaes9umLBcDWGVjc8eiDHBx8xJb8nkXLdyzS3Cm2aPfWNe2GorpJaUO6491gyPIXB37T1qNaHDVox3CqpWZlhdX1HrS2WTWNi0zUkd8XYvw7ewIsDDMj/M7xR5QuzSPZHG6SRzWMYC5znHAAHMleQNs1Ve6zVlJrKcSQUtzb01pcMgshjeWs8xIDZP/AJgRGGEoKtJpnr9cJrG7XKyWioulFaobjDSwvmnYaronhrRk7o3CDwB6x6V8tneootV6Ntt8jLQ+eICZo/AlbwePWBx5MLc61+469fq+f+G5DgUdmezJGNdGbaptWaggslq0m7vmYOcHS3ANY0NGSSdwn5AVlumMzoGGpjjjmI8dsby9oPkJAJ+QLyp3MP31If0Ob6AvV6jNjHUoUqmzBWIUQohpBERQjNKIiqAUVUUIRRVRVgIiKAhUVKiE5hERAyFEKICHmoqeaiAiIiAIiIYkPJRU8lEAPJaVqPJaUIwVFSohAiIowQ81FTzUQEREVIRRVRRAIiIwQqKlRQgQohQhFCqoVUCIiIwwiIoQIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiALYzgs1LZal4LYGPma+Q8GtLmYaCeQJJAHaVyUUMkuejaXYW2ooayOrqqasFUyOqqx3u9jwdwCFvLnjxg48sZHl4+Z7S5lRpYKrQU4ubVnG6uk1q7cdFrwPQdn8DVnioVnFqK1Ts7NrlfhxNs2/2+i1Fc6O518NJ3u5ne7nvIJDwXO4ZweJ7Oxfc6k0jjjd6Xy4eVvC7p610DZGdMQXhhdgloIBOPSPlX1NFU9gP+pdHLLcDhnHeY10ZuMbpSUeEUvG17vXm2+bO2WYYmum44TeRTdm03z/a/RdDipL1ouYYfWU0oPaxzv5Lbl+gpDvd6Ukh7RQOd/wBhc2aOp97/AOcFO9Kj3o/KFsQw2B5ZpP8A/rE4pYrEr/8AHr/Qzg3M0K7lbGH8m1SH6I18n02ijxZZap35FqlH/YXYDS1HvTlO95/en/ItynhcLyzGb/8A2Q+RrTxuI/6NL/0y+Z1l8Gk84bY7x/popW/yCsdu0/McMs96Z5S5zP8A7gXZDBN71J6pU6KX3t/qlb1PCYflipPxlF/+01Z46v8A9Ol+kvmcTDYbQWkMiuUQPMOrJB9Ei+1Eyqtl5MtJBHUUj6eKA9JUODow1zySMh29wd1kclvyx45sd8i0rcqZbhcXRlRqvbi+PDrfjGz9pqxzLE0KiqQ81rxfsbaNT3bz3OxjJytKIuyhFQiox4I6yUnJtviwiIsiBERAehnKKuUW0e1ZCoqVEIFDzVUPNAEREB0faB9tYPzA/eK64ux7QPtrB+YH7xXXF+ce1v3ziPzfBHtcu+yw8AsRbao3w6ipagt+xy0oaHdrmudkfIQsurrG0yzx3fSdV9jLqimYZ4C3mC0cR6RkLh7OY2ODzCE58Ho/1/3O4wNfcVlL9DEGm7hFRXaGadu/TuDop2/jRvBa79hK47UFO+23aejfBTncOWOY07r2kZa4ceRBBXyp2nhlcze6R94s1PcaVhkqqKMU9XG3i4sHCOQDrGPFPZgdq+yU5RoYlTfCWj8f5fivFo8/9JuT1MZl8cbSjeVPj+V/J/E5XZ9NT3LTl5sM5ijkk3Z4nEBoaRw3j5Ad0HsBJ6l0vU1hkqemt1xifBLG7rbxY7tHb/MLdWeofZLlDXSHEkR4wdb2ngWu7AQSO1d7dWWa50NLDdjJJbZC5lDcWHEtN/7GUYOccOPWOPbjTxUqmXYuVemm4T104ppWduuiTtz1twafXfR7nVLEYF5ZiVdxv5vNxfO3dwa48GYGuVrvPQtgqaJleyIbkVQw4e1vUM9Y84OOpatP6Vq3VEdTcIujgY7e6MnLn/JyCy5dbLZ7e9sNVc6qjc4ZHT0Zc1w7WuYSHBbNtbpuhhL4KerussZaAZyIYSTnjujLiOHaF28c6q16f+FBu/NJr2uy9puVavZfAVN7VxDdv5OLuuTVr+v9T626Jtmtct6qcRyTQvioYj7p7nAtL8dTWgnj1nGF1WJ8kTt6NxaVublcaq53B1XVu33vw3daMNa0cA1o6gOoLl6HTzaXduF+c6moAA9kfKapHMNa3mB2uPAeVYU9jBQc6786XJd3CK629t29Fovm2d5lju2OZp4Wm7LSKXJdW+V+fQ3VUW0elKeFtNHDV3LE8+5kZiaSI+HVk5d6GrrsVNUVNXFT07C+WV4Yxo5kngFvq64VF2uzpjGTJK4NjiYM7o5NY0dgGAF37ZrY2UWoY31rGOrw0ubAHBxp244vfjk45AA58SV0+Kxiy/DzrT1m7yt39PBKyv0R97y3A0spyyGHg9YrXvfN+syPYaBlrstHb2cqeJrCe044n0nJW+RF8SqVJVJucuL1Z1DbbuwiIsCBERAEREAREQBERAEREB97d9sKf8636QshnmseW77YU/51v0hZDPNfYPoy+z4jxXuZ5ftB6cPBkUVUX0486FFVEBEREAUKqhQEREQjBUVKiAhUVKiEYREQhEREAWlalpQBaVqWlCMIiKMAqKlRAFCqoVeRiyIiICHmiHmigNKIiAIeSIeSGJpQohQEREQEKipUQjCIiAh5oh5ogNKIiALStS0oRBERCArz33b/ANxNh/WTv4bl6EKwT3Tmmtba9obdZ9OaQrJYqKqfLJUzVlLGyThut3AZd7ByT4waeXDsHLR0mmz79xf96Sp/W838OJdL7uesifX6Ut7XAzRRVUzx1hrzEG/tY75F2fYRb9pezzR1VYazZzPWyPrH1MUrLvSMb4zGN3XeOSOLc5GefLgttNsX1Rr/AF47Vu0yupKSmO62O10Mhkc2JvuYi/gGjiSSMkknlngOZOMarm3odk7ka01Fs2O081SxzPZCsmq42uGDuHdYD6ejz5iF5uuH+6YqP/jJ3/XSvb9S72HtEcdss89XHTsbFDSUZiYWsAwAOkexoAAA5ryXU7Kdq8u02XWI0W4B95NzEJuVLnBm6Tdz0noQUZpuUnpc9hrwV3PVthu+2GxW6omq4YpjPvPpah8EoxTyHxXsIcOXUeIyOte1a693pljNXSaPu8ta4OayjM9I17XY4Fzum3N0nhwJPA8F5j2SbLNqGjNoto1LV6Nmnp6OR/SsiuFJvlr43MOMygEgOzjI5IY0GoxldnU9sFhv2gdqccepJJ9RUsUjaijkuMr5W1lPvZ3HEnPa1wHXx5EL2zszvmn9RaHtl00xDBT2ySECOmiYGCnI4OjLRwBacj9vIrrm2bQEO1DZ2KSajfb7zA0z281BYXwy44seWOc3dcAAcEjkeYWJu530xtl2aXmemuOjair0/WnNTBFcqQvikAwJGAzAZ6iMjIx2BEcsmqkO9H07vT7WaS/PVX7sS65sz2U6e1r3Psly7zdHqBhqTS1TJHZLmOJawtzukHGOWeK7p3Uektf7R5rLSad0VWintrp3STVNdRs6Uv3AN0dMTgBh5458l9di1NtK0BosabuWzarq3xTySxyw3ajAIfg4IMnDjnjxRklJqktl6mT7NX0tm2eW+4XKTvenpLXFJM4tOWgRjPDmT1Y554Lz73btqqRcdO3sMcaZ0MlK53U14IcB6QXeqV3HWjdsGtrxaLTPolth00LhTy3E+ylPNJLG2Rrjvbr/AHIxndAJJA4nkso6+0nada6YqbBeY3Op5sOZIzg+GQe5e09RH7QSDwJUNeDVKSkzH3cjXCKs2OU1KxwL6GsnhkHYS7pB+x4WXl5v0Ponalsd1DVSWO20+q7FWECeGCdsUhDc7r91/FrwCeW8Dnj1EZOi1pra5xdDadmdypal3DpbrVxQQRH8Y7pc9wHY0ZKpKsLycovRndr1SGvs9bQh26ainfEHZ5bzSM/tXhjYvM7T+2ywMuLTBJBcu9Zmu4bj3ZiIPmLl7T0XZrnaaKolvd4fdbpWzdPUyhu5FGcACOJn4LGgcM8Sck8SsUbcdhTtU3iTU+kqqCiu0hD6mnlJbHO8fhtcB4r+3hgnjwOSYjKhOMbxb0ZneNpe8NHMlcsGhrQ0cgMLDGidabTbTb4aLV+zC8V9dE3o+/bdNC9s2B7pw3gGk9ZBx5ByXZGQa91lW03svR+B9ghlbLJSx1TZq6t3SHBj3M8SKMkDeAJcRkZAKqJGk48Sd0p947VH6Mz+KxYM7hP7rNSfoEf8RZv7oCk1Nftn900tpvTFZcqm4RsYKgVNNFDGBI1zs9JIHE4b1Nxx5rEXc7aK2i7NtS3KovejKuSlr6QQl1NX0j3McHAgkGYcMZ68oc8WlSd2dX7ta21EW0qhvO4e9a6gbGx+OG/G5wcPkcw+lZ07nmqjrNjOm5IiCGUzoneQse5p+hcvtM0RadfaXkst1DonZ6SmqGgF9PJjg4do44I6x6CMZ7K7VtB2TirsFw09NqTT8kxmp6q1ysdJE4jj9je5pwcA46jnBOVDglNVKSjzRkfbJVR0eyjVM0rg1ptVRECfxnsLB+1wXmLuRrTUV21mO4sYegttJLLI/qBe3o2jzneJ9BWXNqsO0HafbotMWPS9XYLNJK19bWXaWON8gactaI2Ocd0HxuvJA5dfe9lGgLVs8017GW8mpqZSJKyqc3Dp3gcOHU0cgM8OPWSUQjNU6TjzZorPv3Wv/wCHKz/rNMuv90Jsvi15YO/7bGxmoKFhNM7l3wzmYnH9rSeR8hK1V9Trl+1ug1BBoG4GzU9tloZN6uoxOTI9ry8N6bGAY2DGe3zLJ0D3SQRyPhfC5zQ4xvILmEjkd0kZHLgSPKocW04OMkzxBso1RerZerfoipD+8aq/0MjoJch1PNHUxkkA8s4wR5B2cfcKw3tW2U9/bQ9P6609TgVMN1pX3SBuB0jGytzMP8wA8btHHmDnMipniKkZ2kiHkvDmtf8AdC3D/wCI/wD74Xtu51M1JRumgoKmvkHKCndGHu8xkc1vyleTdQ7LdqVx2jVmq4dHOYya5urY4X3GlyB0m8GkiTnjARGWEai3dnrlxDQXOIAHEk9S8G6XpJNUbZqSKgaXitvXTAtHKPpS9zvQ0E+heotZ1m1LUtgnsll0hDp99bGYp66tukT+iYRhwa2LeOSMje6uzPKbFdj9t2fB9xqaltyvczNx04ZushaebYwePHrceJ8nHIlGaoxk29Wbfur/ALzlZ+lwfvrE3cy6D01riw6lgv8AROmfE+BsEzJXMfCXNk4twcE8BzBHBZc7oe1ap1VpGTTOndMVdY99RFI+qdU00cW63jgb0geTnA4tHI8e3pmwTTu0nZx7LRV2gp66Gv6JwMN0pGujLN/qMnHO929SGdOVqDSeviZS2H2ifT+zOgslWfstBUVkDnEY3t2qmG8PIRxHkK7Xa6+lultp7jQy9NS1MYkhkAID2niCM9RCxNtHuu2W/WSotGntn5tLKlhjlqpLtSvl3DwIaA8BpI4ZyefDB4rKOmLebTpq1WsgA0dFDT4HVuMDf5KGrUj/ADN6s5FeJNokLajuh7hTvdI1st9YwuY8tcAZGjII4g+UL2ncaialo3zwUNRXSNxiCB0Ye7j1GRzW/KQvKmpNmW1G5bTKrV0Oj3sjkuffkcT7hS7waHhzQcSYzgBVHPhGottuxnVmyHQRuQuVdaZrpVtxiS4Vs1TnHUQ9xBHkIK7fcKqhstmnragspqGhgdI/dGGxxsbk4HkA5K2isqa6j6ertVXbJd7BgqXxOfyHHMT3tx6c8OSx5ttj1teqeDT+ndJz11sdUxSXGodWU8QqImuDjEwOkDuJGCSByxxByoa62qkkpP2nG6FvkjbHdKq+aJ1TVVmoJ5Kmt3LeHRmJ43I4gS4EtbEGj5V52s9bW7M9rENYaWtp20FXkw1MfRyyUzupzeomN3l4+Ze3rTVT1lE2aptlVbZCcGCodE548uY3ubj0rAvdG7P9U621NRXDTmk6ovp4XQVFRLV00bZgHZYWjpc9buJAOCOHBU2cPVjtOMtE+89AUlRBV0kNXTSNlgmjbJG9vJzXDII84Kwh3ZX3BWj9aD+FIu1bBodbWfSsGmtYafnpTRAtpawVUErHRfgscGvLgRnA4YwByxx6/wB0fp/WOt7bQ2XT+lauWOlq3TSVMtXTRsfhpa3cBl3uOSeIHVw7BxUkoVlroidx397Cv/XEv8GFZpWHu5xsertF2Cq0/qHS1XA2euNTHVR1VNJG0OYxpDgJd7huZ4A81li51M1JSOnp7fU3CQEYgp3Rh7vMZHNb8pQ48RrVbR4s1LA2p7oespnukY2XU5Y50byxwBqcZDhxB8o4hcz3SGkr1pjU0U8tyuVyslWS+ifWVL5+hcPdREuJ4jmD1g9ZBXI3DZltQqNpc2r2aPcGPu5uDYTcKXIHS9IG56TnjgvRGp7DTa90XVWe+WqqtonHiNqDE6WGQe5kaY3ubwPl4jIPApc3Z11CUGndW1OI2Eah0/qDQFLJYqCktjqf7HWUVOwNEU2OJx1h3ME57M5BXAd1p96f/wD0IfoesfbL9C7XNneszX0enRXW9zjDVxx19O1tTEDwc0OeCCObcgHqOMlZB2+2zV2tNHwWKxaQrzIamOolknqqRjWgNd4v9sSXZcPJwPEocGxGNdNSVvE4DuMvub1B+mR/uFZJ1n98XQn6TW/9Veuh9zlpvWmho7lbr/pSrbDXTRvjnhq6V7Y8Ag7w6XOOIPAE8+C7LreTWNRr7TdwtOiq2qt1nnndUSOraVjphJGY8xtMvIAl3jYJ4DgozGraVeTTXr7jF/df6U73utv1hTRYjq2ikqyB/vjRljj52gj/AEBdq7ny53DW8FouNzjf3vpejdRwvdymqX+Lv+dsIY3j1yOWRdf6fGttntws9RSSUlRVQF0Mc5YXRTNOWElrnN5gZwTwJXx2XaadojZzQWkUr56yKLpqqOIt3pJ3cXAEkNOD4oJIGGhCOunQUXxR5m7qL78dz/MU/wDCavR2t7XPetiVbbaVpfPJZ2ujYOb3NYHBo8pLcelYV2v7ONo+s9f3C/0OkZoKWYRsiZNXUofhjGtycSkDJBPMr0Loeoukmn6Smu1jq7VVU1PHHI2aWGRr3BuCWmN7uHDrA5hU5K80qdNpq6PMPcn1UdPtYZE8gOqaCaJnlI3X/Qwr12eSwXrnY9d7ZrWHW+zmSnZVx1HfD7dK7cbv58bcceG67JBaSMZODyA7wdc6i9jcDZrqL2U3P7Heh6Df/Pb/ALny7ufIozDEtVpKcDz93VlTHUbWpYmOBdTUUETwOokF/wBDws/6ctU9l2Ew2yqaWVENjeZWHmxzonOLT5icehdJ0Hsgu1w1rNrjaLJTyVslQallvidvtD8+Lvu5brcABoJ5DJ6jk3aPPe/BivoLFYKm61dZSyQxlk8MccbnNLcuMj2nrzwB5dSCtUi1CnF8DXpOjpbhs4s9DXQMqKaotMEcsTxlr2mJoIK8q7VNGXfZZrenr7TPOyidL09srBzYQc9G4/jDl2OHpA9RbMpb7HpW22u/6fqbXV0NJHA97p4ZI5SxoblpjeTxAzggY8q3+t9M2zV2nKmx3aLegmGWPHuonj3L2nqI+sciVFoYUq7o1HfVM6b3Ol6m1FpK7XypiZFNWXiaWRjPchxjizjyZWMu7I+6Owfocn74WVtgmlbno3Sdxsd0YOljukropG+5mjLI917fIcejiFj7b/o/XevNQ0FTZ9I1UVLR05i3qitpWue4uJJAEp4cutVcTkoyisS5X0MjbBmCTY1YI3cnU0jT6ZHry7oOCXTm2Sz0VxHRyUV5jp5t7hukSbpPm616i2J0uoLLom3acv8Ap6qoKiiY9pnM8EkTwXucMbkhdnBx7nq5rru2zY83V1Z4Q6eqIqK9tA6VryRHUbvuTke5eAMZ68DOOaFpVowqTjJ6S5mXjzXnfuyqmPGmaMOBkHfMrh1gfYwPl4/IsjWDV+rqO0xUmptBXyW6QsDHy0HQywzkD3eekG7nmR1fsXSK3ZrqraTrsaj1xCyy2mINZBb2TCSYxAkhmW8G5ySTz48B2EcOHiqVTbm9Ec/3K1rnt2y0VE7S32QrZamMH8TDYwfSWE+lZWkaHxuYSQHAg45r50dNT0VJDR0kLIaeBgjijYMNY0DAA8gC+yhr1Z7c3LqeHtFNk0vtbtUNyHRPt93ZDUZ/BxJuuPm5le4Vh7bXsaj1fWuv1gqIaO7uaBPHLkRVGBgHIBLXY4ZwQcDlzW70jqnaPZrdDadU6BuVyqIAIm1tBNFJ0wHAFw3sZ5cc8ewKvU3MRJYiMZRevNGVmNc9wa0EuPIBcDtooBHsd1Q4jfl9jpD5gOJW0pqDXGrN2mr6A6QsriDU/wC0tlr6pvPo2lmWwtPJxyXEcOGSsg3m3Ut3tFZaq5m/S1kD4Jm9rHtLT+wokcdOnu2pPieVO4mI8P70M8Taif8A6sa9au5LyzpnZ5tK2P7RHXrT9kGp7W+N8D+glax0sLiDhzTxa8FrTkAjh5VlG76p17qahdaLVo+q0yahu5PcblURk07TzLImEuc7GcZwM4yqbWJtKW2noa9jFU5+zOjEZxHLWVsmR+EHVcxHoxhefO6u++hF+rYv3nr05YbVS6c01SWm3QySQUNOI42AjfkwO0kDeJ7SBk9SwBtq0Jr/AFtrZ94t2k6iGlbTsgjE9bSh7t3JJIEpA4uPWouJwYWonXc27LUzls4+95pv9U0v8Fq5C9XSltUdM+p3yamqipYmtAy58jg0c+ocSfIDzXR9HXXXVn0pbLRWbOqyWehpI6YviulJuv3GhoPF+RkALiJKXaRqfafp+uvemW2bTtsnfMIxXQzHf6Nwa9267JOcAADhk+UqGvurybbVteaO37ZfvWaj/QJFg/uRPu4u36tP8VizVtdivly0dcrFY7BVXGorqfo2ytngjiZk8d4veHZwOoHmOPZizYVozXehtWVFwuuk6mWkqaR1O7oKylc5jt9rgcGUZHikc+tXkc9FxWGnFtXfeehl5a7rdpG0egcRwNpjwf8A5sq9SMJcwOLS0kZLTjI8nBYv297NZ9c0VLX2mWKO7UTXNayQ4bPGeO7nqIPLq4nPaIjgwVSNOqnLgdq2UkHZnpoj4rp/4YW11/MWak0PE3Lj7PCXdzzDKebJ/aulbNL5tA0xp+n03etn1zrDRtMdPUU00eCzPBrsnd4csg8scOs9wsdqvt61RTap1PSRW0UMcjLbbY5hK6IvGHyyPHAvLeAA4AE9aFlHd1HK+mvM7ttKlZPsu1RJGcg2ar9H2F68m9zBYYtR68uNtlr7jQE2iZzJ6GqfBIx2/GActIyBnO6eBwMhejtoVTe3aQu9mstjqrnPc6Cala5k0MccRewsy4yPaeGc8AVifYHs/wBo+gNdG9XTRtTPRy0clNIKevpHPbvFrgQDKAeLB19aqNzDVE6MtdTF9zgrtDbWui11RG+951AFQ2qJkFVCeUjS48eB3hnhkYPWF7Ct0tFV2ijuFqljnttTC19NJEMNLCOAx1Y5Y6l1fuhdmjtoOl4a+2Uoj1FQs3qdj3NaZWHi6Fzs7uesHOAc8cEldX2CWnajomjqLBqPR9VWWOQmSDoK+kdJTyHmADKPFPPGeB49ZRq5MRGOIpqV7SRzm2O5zR2Kn0/RQ1c9VepegeykZvzNphgzvaOvxPF87wulbaxHqbQDaGh0fqSknthbLSukoA2ONjRhzSQ4kN3PJzaF2a2xa5ZtSrdQXzRNdHb30go7cI62ke+CPfDnOcOlxlxGTgkjAHHmsg18r4aSSRlJLWOA/sYiwOfnhw33Nb8pCnA09rcOKWrWvE88dyhqjve6V2k6mTEdUDVUgJ/3xow9o87QD/oKztrX7j71+r5/4bl5vg2Y7SLTrT2d09ph9NFT1zp6OOSupstj3yWsdiT8XgfSs86nrtQV+iauCm0lcPZKto5Ye9zU02IXuaW5c/pcFuTnhk8OICrOXFxhKqpwa170efO5h++pD+hzfQF6vXmjZZoTaRovWEF8k0g6riZG+N8TbjTNJDhjIO/1HBWXrtqXX/eTxatnE/fRbhjqm6UoY09pDX5PmyPOo+IxyVWreDVrdUdrobpS1txuFFBvGSgkZFOcDd3nMD8DzBzc+db1dE2KWXUNn03Xv1VCY7tX3KWrnzIx5O81gzlhI/BPDqXe1GaFSKjJpO4REUONmlERVAKKqKEIoqoqwERFAQqKlRCcwiIgZCiFEBDzUVPNRARERAEREMSHkoqeSiAHktK1HktKEYKipUQgREUYIeaip5qICIiKkIoqoogEREYIVFSooQIUQoQihVUKqBEREYYREUIEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAbJjWU95nmqWB9PVxRRZDXHdMZkeScDA5txkj+R3NBRz0dso2UtZVUsdNwkgLo35yc7rjg8s9RHNba7TyQd5dG4DpK6CJ4LQctdIARx8i5GRj6earidHDuzSiVr4xuk8AMEdowOOePYF4rNsHCpnFKEIKW3aUk7NNLzb2el1F9/KyTu367L8XKGVVJyls7Pmxa0eutrrv+N3bRbCqpJpLhHX09dPSTsidFvRtY7LXFpPBzSObQhguTvdahuX+lsA/+2t2i9RWyzBV5bdWjGT6uKb9qPO0sxxdKOxTqNLubNg6grXc9RXj0PiH0MQW6f8O9Xd/nqcfQAubsRiqaXvtrQWue5rCeOQ0lufSQceTC5GRjJGlr2gheBx/ajKsFjJYeGEjKMXZtKK1XGytrbxR7HCZHmWJwyrTxDTaulr+l3fT1M6p7GtPurhdXf/6Ew+hyvsZT9dRcj57jP/WuRqI+imdHnOCpb3MnubqXGTFEJZPIHEho9O675PKvZYivl+FwTx2wtiyeiWt+HrujzNCGPxGK8lU3tXtxeluPqOPFsgByJ7j/AMoTn/tr7spmM5S1R/KqZHfS5dkwMYwMdi4y4wNieHsGA7q7CvP5D2vw2ZYryZ0dhvhqne2vRW0O2zfs9icFh9+qu2lx4q3tdzZtG6MAk+c5+lVEXuTyTdwiIgCIiAIiID0M5RVyi2j2rIVFSohAoeaqh5oAiIgOj7QPtrB+YH7xXXF2PaB9tYPzA/eK64vzj2t++cR+b4I9rl32WHgFCA4EEAg8CCqi86bpg3XunX6furjHGe8Z3F0D+of5T5QuBt9xqKCrZU0kropWcnD6D2jyL0Nc6CkuVFJR10DZoJB4zXfSOw+VYa2gaGnsDhXW90tRbnHx94ZdCc8Accx5V9SyDtHRx0FhcVpPhrwl/v3c+XQ9DhMzVSKpVFrw8TjKq3UuoYxUWuKCluY/taRrt1k/+aPJ4O7W/J2LY2OprbRVVFJV0jnUr2/7ZSztLQQOvta4dR7SvhDkDK5RmpbxHD0Br5JYwMBswEgA/wBQK9W97Gm6NlOD5NtNeD14cua6njs0+jqlUxqx+W1dzO97W0v3W4d64G+oapz4gzT9/YyJxyaC5Fg3T5N8GN3n4eZWtqNR0UZbU2SjML/xLZCY39hDmtwfOCtibtb6p29X6fts7zxL49+Ak+XccB+xbhmo62lpXUtqigtcT/dd6hwcf9TiXfIV108PPa82mn12rf3LXwvG/VncZflubSns5jSo1F+LW78U4v3nxjvF2ZKO8rLSUMruDXwW8B/oJBI9CslkvNaHVlyLqVrj49RXPLM/L4zj5gV8naiveCDe7kc9XfT/AK1t4G1l0rGxRCaqqJDho4ucVzxpVIXlaMer4v1u3tuejwuBp4SLjSjGC7lb5H2pJI6CpbT6eimq7jL9jbUlnjDPDETeo/5jx8yy7s60wdO2tzqoh9wqcOncDnd7Gg+TrPWVdA6Vi0/Q9LO1j7hNxkeBncH4oP09q7QvnXaLP1inLDYf0OcucrfBcl+p0mMxKk3Cnw69QiIvInXhERAEREAREQBERAEREAREQH3t32wp/wA636QshnmseW77YU/51v0hZDPNfYPoy+z4jxXuZ5ftB6cPBkUVUX0486FFVEBEREAUKqhQEREQjBUVKiAhUVKiEYREQhEREAWlalpQBaVqWlCMIiKMAqKlRAFCqoVeRiyIiICHmiHmigNKIiAIeSIeSGJpQohQEREQEKipUQjCIiAh5oh5ogNKIiALStS0oRBERCAqKlRAFCqoUDIoVVChOQREQHKs9wPMiM9wPMiI5yLj6z+8O9H0LkFx9Z/eHej6EZhU4HxWlalpWJwkRVrHOOGtJ8wX3jpJXe6AaPKsi2bNsVu6SlJIfKMDqb2rcQ08cfHG87tK+yIzjDqFCvlLURR83ZPYOK2c9U+Tg3xG+TmrcyckjcVNU2PLWeM/9gXHOJc4ucckoUWJwyk2FpPNalpPNQxYUVUVRCIiKAKKqICHkoqeSiAIUQoQiLXBE6aQMb6T2Lfigh3cEvz25VMlFs41Qr7VUDoH4Jy08iviVDFqxEREIRaVqWlCBERAFpWpaUAREQjBUVKihCFRUqKsBQqqFCEREQgUVUUQCh5KqHkjBEKIUIRERAFCqoUQIiIjIQ81FytPbWbgdM528eodS+NbQCJhkiJIHMFLGe7la5x6IiHGFyVppuHfDx+R9a2VLCZ52xjkefmXPNAa0NaMADACI5qUbu4REWZsGieQQwukdyaF12RznvL3HJJyVyd7lw1kI6/GK4tYM1a0ruxCoqVEOIKFVQoCIiIRhQ81VDzQgWlalpQBc1Z5+lp+jcfGj4ejqXCrc22Xoqth6neKfShnTlsyOfUVUVNs+FZA2ogLDz5tPYV16RrmOLHDBBwQu0Lib5T4IqGjnwd/IqM4a0b6nFqFVQoarIiIsWQhRCioCIihGaURFUAoqooQiiqirAREUBCoqVEJzCIiBkKIUQEPNRU81EBEREAREQxIeSip5KIAeS0rUeS0oRgqKlRCBERRgh5qKnmogIiIqQiiqiiARERghUVKihAhRChCKFVQqoERERhhERQgREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREBsrxBJNDA6IsBgqYqg72eIY8OI4deAuRgmNVZaWsMnSCpHTNO5u4a4bwGM9QOPQvhUf2En5J+hSyfcdZf0OL9wLzWcU4rMcHNLVya/TZb953+Wzby/EwfBJP2o+io5hRUcwvTHQE2efcVa/zP8yufXAbPPuKtf5n+ZXPr83Zt9vr/AJ5e9n3DBfZqf5V7jiLj/e3+j6FstNk+E148lPS/TKt7cP74/wBH0LZaa+6e8fmKX6ZV9Uzb/lGP5KXvgeAyv/mGf5p/E7Itjdv7NnnW+Wxu39mzzr592S++KHi/cz13aL7sq+C96OOREX30+QBERAEREAREQHoZyirlFtHtWQqKlRCBQ81VDzQBERAdH2gfbWD8wP3iuuLse0D7awfmB+8V1xfnHtb984j83wR7XLvssPALyvt32gazsm1a82u06hraSih6Do4Y3DdbvQRuOOHWST6V6oXjDuk/v1X/AP4N/wBWiXdfR5hqOIzOca0FJbD0aT/mj1NbOJyhQTi7a/Bm/wBm+0nXVw2gafoK3U1fPTVFxgimjc4Ye1zwCDw6wvXz2tewse0Oa4YIIyCF4U2T/fP0x+tab+I1e7Vs/SLhqOGxdFUYKPmvgkufcYZNUlOnJyd9TpF/2cWmvc6W3yvt8juO61u9Hn8nq9BXVavZTeWxvdT3KjlcPctIc3e9PHCzCi81he1GZ4aKiql0uqT9vH2npY4+ulbaMBO0TqqnfuyWiZxHWxzXD9hW7pdC6oq3hgt/e7et80gaB6Of7FmG+3yzWKmFTebrR2+I+5dUTNZveQZPE+QLp9Rtn2ZwSFj9UREj8SlnePlawhego9pc5xcL4fDbXeoya9hySz6VOOzJxT/febe37KKIBjrjdaiV+PHbC0NbnyE5OF3Ww2C02OIsttGyJxGHSHxnu87jxXBWfahs/u0rYqLVVv6R3BrZ3GAk9g6QN4+RdwaQ5oc0gg8QR1rzeaY/Nan+HjXJX5NbPssjTeNliF6d14nTNuF0uFl2WXq52uqkpKyBkRimjPjNzKwHHoJC8p+2rtE/xbcfWH1L1B3RX3mdQfkQ/wAeNeK19G+jzA4bEZdUlWpxk9t8Un/LHqeXzirOFZKMmtPizuntq7RP8W3H1h9Srdq20QHI1ZcPSWn+S7Lsb2Pw7QNMVN5kv0lvMNa6l6JtKJM4Yx29neH4+MeRdvre5mIgcaLV4dMB4rZqDDSfKQ8kfIV3OKzfszha8sPWjBSi7P8Aw/js2Nanh8dUgpxbs+//AHOl6c296+tk7O/6qmvEA91HUwNa7HkcwA58pyvR2y/aFZNfWl1Vbt6nq4MCpo5HAviJ5HP4TT1H6DwXi/VNjuOmr/V2S7RCKspX7rwDkHhkOB6wQQR5CuybDb/Uae2n2Woikc2KqqG0dQ0Hg+OUhvHzEh3naFrdoeyeXY7BSxODgozS2k46KSte1lpquDM8HmFalVUKjur2d+R7dRdc1FrnR+npjBeNRW+lnb7qEyh0g87G5cPkXAe3Vsy6To/Chmf0OfHy7mF8do5Tj68dulQnJdVFtexHpJYilF2lJL9UZCRcDpzWOltRu3LJfqCtlxnoo5h0mO3cPjY9C50kAZJwFqVqFSjLYqxcX0as/ackZRkrxdyouu+HeiP8Zad/5Th/qTw70R/jLTv/ACnD/UubyDFf0pepmO9p/iXrOxIuu+HeiP8AGWnf+U4f6lrg1ro2eZkEGrbBLLI4MYxlxhLnOJwAAHcSVHgcUtXTl6mN7D8SOfREWqch97d9sKf8636QshnmseW77YU/51v0hZDPNfYPoy+z4jxXuZ5ftB6cPBkUVUX0486FFVEBEREAUKqhQEREQjBUVKiAhUVKiEYREQhEREAWlalpQBaVqWlCMIiKMAqKlRAFCqoVeRiyIiICHmiHmigNKIiAIeSIeSGJpQohQEREQEKipUQjCIiAh5oh5ogNKIiALStS0oRBERCAqKlRAFCqoUDIoVVChOQREQHKs9wPMiM9wPMiI5yLbTywtlIfFvHtW5XH1n94d6PoRmM3ZH06eAf7wPkCd9RDlD9C2q0qHFts3hruyL9q0GueeTGhbVFRtM+z6uYjgQPMF8nySP8AdPcfStJUURjdsIiIzEhRCigC0nmtSh5oGRRcrTwNZEA5oLuZyFsK4AVLwAAOHLzKllCyufBERQxCiqiAh5KKnkogCFEKEN3aiBK8dZHBcguEY5zHBzTgjkVuRXzbuN1hPbhU5IzS4n1upG4xvXnK48rXI90jy55yVoKhhJ3dyIiIYkWlalpQgREQBaVqWlAEREIwVFSooQhUVKirAUKqhQhEREIFFVFEAoeSqh5IwRCiFCEREQBQqqFECLXCQ2Zjncg4ErQiA7GvlVODYJC7lulcVBXTQt3PFe0ct7qWipq5ajg8gN7Arc53WVjbIiDicBQ1jlbNFuxOmPNxwPMt+tMDBFCyMfgjC1Ko3IqysREUJwCT1LIyOCuT+krJD1NO6PQtuq4lzi48ycqLA0G7u5CoqVEAUKqhQEREQjCh5qqHmhAtK1LSgCIihDslPJ0tOyT8ZoJWtbOzP3qED8VxH8/5reLI3ou6TC+dRGJoXxu5OGF9EQM6s5pa4tdwIOCtJW9vEfR1riOTxvLZFQ0ZKzsRERYsxIUQoqAiIoRmlERVAKKqKEIoqoqwERFAQqKlRCcwiIgZCiFEBDzUVPNRARERAEREMSHkoqeSiAHktK1HktKEYKipUQgREUYIeaip5qICIiKkIoqoogEREYIVFSooQIV9GQSvGWsJC1GlqPez8oWjUzTA0pOE60U1yckvibUMBipxUo0pNPufyPgoV9+9Kj3s/KENJUe9n5QuP66y7/qIf6o/Mz+rMb/Rl/pfyNui+/elR73+0KGlqB/vTlks3y+Tsq8P9UfmYyy3GJXdKX+l/I+KLU+N7Pdsc3zhaVvQqQqR2oO67jUnCUHaSswiIsjEIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgNldqp9G2kkYQA+sgjflufEdIA79hXItZHHRNEAaIHSudGAwtwM+Xq7OrGMcF8J/7CTH4p+hSzOLtJWVziSTRx5J6/EC83mtJLNMHUvxclbl6Ld/E7/L6l8txMLcLP2pH0VHMKKjmF6U6Amzz7irX+Z/mVz64DZ59xVr/ADP8yufX5uzb7fX/ADy97PuGC+zU/wAq9xxFw/vj/R9C2WmvunvH5il+mVb24f3x/o+hbLTX3T3j8xS/TKvqmbf8ox/JS98DwGV/8wz/ADT+J2RbG7f2bPOt8tjdv7NnnXz7sl98UPF+5nru0X3ZV8F70cciIvvp8gCIiAIiIAiIgPQzlFXKLaPashUVKiECh5qqHmgCIiA6PtA+2sH5gfvFdcXY9oH21g/MD94rri/OPa375xH5vgj2uXfZYeAXjDuk/v1X/wD4N/1aJez14w7pP79V/wD+Df8AVol6D6NfvWp/23/dE1M7/wAhePwZwOyf75+mP1rTfxGr3avCWyf75+mP1rTfxGr3atr6TPtlD8r95hkf+XLxC6ltb1e3ROh6y9tYySpyIaWN3J0ruWfIAC49oau2rg9ZaUsWsLbFbtQUbqulimEzGCZ8eHgFoOWEE8HH5V8/y+eHhiacsUm6aaulxa6cuPidvWU3BqHHkeFr9eLpfrpLc7xXTVtXKcvkldk+YdQA6gOAXbtObINf3+0x3Shsu7SzN34XTzsiMjTyIa45weonAKzTqXR3c/6amdFee9Kedh8aAXCokkb52MeXD0hb+4d0Hs/oWdHRRXStDRhggpQxuOr3bm4HoX2Gv2pxuIowWTYOVuso2jblazt7dPd5uGApQk3iai/R6/qeW9RWS7aeuslrvVDNRVkeC6OQdR5EEcCPKMhZj7lnXlxptSR6MuFTJPb6tju8xI4noJGguw3saQHcO3GOZz0PbNrwbQNURXSK3mhp6enFPExz957gHOdvOPbl3LqWjYa4t2t6bLTg9+AfK0rvczw88wyOfl1NRnsNtcbSSbVv33GrQmqOKW6d1e3ij0/3RX3mdQfkQ/x414rXtTuivvM6g/Ih/jxrxWui+jX7sqfnf9sTbzv/AD4+HxZ6t7j/AO9pcP1xL/BhWZnOa1pc5wa0DJJOAAvz3o7ncqKIxUdwq6aMu3i2KZzAT24B58AtVVdbpVRmKpuVZOw/gyTucPkJWvm30fzzDHVMVv1FTd7bN7e1GWHzdUaShsXt3ndu6Hvluv21K4VVqmjqKaKOOn6aM5bI5rfGIPWM8M9eF1nZ7SyVuvLBSxNJfJcqdvDq+yNyfQOK4JZ67mfZ5UtuHhzqCI0VBTRONF0x6MvcW4MvHk0NJwesnI5L1GPrYfIsn2HLSMdmPVu1l6zRoxni8Te3F3fcYu1vHVah2p3uK1wSVk9ZdqgU8cQ3i/Mjt3HoXOV+xTaPRW11dJYekaxu8+KGojkkA/JDsk+QZKzDQXLYJoK++ylrrIDco2ua19NNPV+6GDg5czOOGc9at57o/SdPG8Wu0XaulA8XpGsijJ8+8T/zV5yXaDOJ7qnleDlu0krzi1fw85JK3O7N1YPDLadeor9z/wBjy7DLPS1LJoZJIJ4nBzXsJa5jgeYI4ghewO581tV6y0HMLpJ0tytz+gmk65WluWPPlPEHytz1ryJdayS43SruErWNkqp3zPawYaC5xJA8nFege4wcdzVbc8AaMgfPfUt7t5hKdbJ5V6kfPhstd12k1fpqcOU1HHEqCejuedEX6JrAXdA7YhQCo0ppOpBrOMdbXRn+x7Y4z+P2u6uQ48tPKO3GJzbErD4fCa83t6JdX5n/ANnLiMqhh4bc6ns/3PNK5jRH3aWP9Y0/8Rq4loc94a0FznHAA4kleoO5+2PtsbINU6opg66OAfSUjxkUo6nuHvnYPwfPy9N2iznDZVg5TrPWSaS5t/Lq+Ro4PDTxFRKPLiZyREX5tPan3t32wp/zrfpCyGeax5bvthT/AJ1v0hZDPNfYPoy+z4jxXuZ5ftB6cPBkUVUX0486FFVEBEREAUKqhQEREQjBUVKiAhUVKiEYREQhEREAWlalpQBaVqWlCMIiKMAqKlRAFCqoVeRiyIiICHmiHmigNKIiAIeSIeSGJpQohQEREQEKipUQjCIiAh5oh5ogNKIiALStS0oRBERCAqKlRAFCqoUDIoVVChOQREQHKt9yPMiDkEVRzkXH1n94d6PoXILj63+8O9CjMKnA+K0rUtKxOEiIvpTx9LKG8hzKyHE0NY95wxpJX3ZRSEeM5rf2rfMY1jd1owF8K6V8TW7hxk9iHJsJK7Pn3j/7X/mrS6hcPcyA+cYXzbVTg+7z5wt7TzCaPexgjgQmhEos42aJ8Z8duPKtC5eRjXsLXDIK4l7Sx5aeYOFGjGUbEW6paZ3SCSQYA4gHmvnSSMilLnjIxw4LfQzMmJ3M8O0IWCT4n0XHVkMr6hzmscQccfQuRXwlqoo3ljt7I8ipnNJrU4/veb3p3yLQ9rmHDgQewrke/Yf83yLbumhfWCR3uMdYUOJxXJm2ZG9/BjSfMF946GQ+7cG/tW9jnhe7cY7j2YX0SxkoI4mqg6Agb29kZ5LRBC+Z26wec9QW+qoHT1DRyaG8T6VuY2NjYGsGAEsTYuzYut5A4SgnyhbSZjo3ljuYXNFca50Yr3OlxugnmMoJxSNtHHJIfEYXLcx0EhGXua39q3kM8MjtyN2SBnGML6pYKCOIqYegkDN7eyM8l8St3dP7wPyR9JW06whxyVmGtc44a0k+QLcRUUzuLsMHlW8jqKYYYxwGTgANIW4SxmoI4qqpDBGH7+9k4xhfCKGSU+Iwny9S5idsTmDpcboOeJwviaumZ4oeMDqASxHBXNsy3vI8aQDzDKklBI0ZY4P8nJb6KaKX3DwfJ1r6JYy2Is4FwLSQRgjmFY43yO3WNLj5Fy09NFK8SP4Y59WVO+KWEbrXtAHU0ZSxhu7cWbRlvkIy97W/tVfbngeLID5xhbyOpgkO6x4z2HgvqhmqcWcFLG+N269uCtC5e4RCSnJx4zeIXEKM4Jx2WQqKlb230geBLKOH4I7UJGLk7I28NNNNxY3h2ngFuBbXfhSgeYZXJcAOwLjKqvfvlsOAB+FjmqcrhGPEptvZN/zV8ZaGdgy0B48nNWOuna7xiHjsIXJwyNljD2HgUIowlwOCIIOCMFaVzNZStnaSOEg5HtXDuBa4tcMEcCFLHHKDiRfSOnml9xGSO3qX2t8kEbnGbHVu5GVycE8U2ejdnHPhhLFhBS4s49lskIy+RrT2AZWzqY+imdHnewea7AtvJ3rDK6V5YHk8yeKNGcqStocXDRVEvHd3R2u4LcC2HHGYZ/JW67+pc46T/mlfZj2SM3mODh2hWyCpwOJqKGaJpcMPaOeOa2hXYlw1ziEVR4ow1wyFLGFSFtUbVVrS44aCT2BRcvBVUccbQ1wacccNKhhGKfFmyit9RIcuAYP8ytVQmCEyGUOx1YXMLaXX+5u84+lWxyulFRZwi+1E3fq4m/5s/Ivit3aRmtaewEqHBFXaOaUVUVNsi+VWd2llP+Q/QvqtvcTiil8yolwZwKIixNEhUVKiAKFVQoCIiIRhQ81VDzQgWlalpQBERQhythd9jmb2EFckuJsJ+ySj/KFyyyRuUvRQREQzOLvzPEik7CQuIK529jNFnseCuCKjNSsvOIiIsWcJCiFFQERFCM0oiKoBRVRQhFFVFWAiIoCFRUqITmEREDIUQogIeaip5qICIiIAiIhiQ8lFTyUQA8lpWo8lpQjBUVKiECIijBDzUVPNRARERUhFFVFEAiIjBCoqVFCHF1enrNVSGWS3xMlJLjJFmNxJ68twSpYKi4WjUMFlqa2WuoayN7qV8xzLG9gBLS7rGOS5VcddAG3exSgeMK/cB8jopM/Quk7RYKji8urKpFNqLafNNK6sdzkeNrUMbTUZOzaTXcztq4fUVJSVohjq6aGoa3JDZGBwB8xXMLjbt/as/JXyfsRBSzmm3yUn7Ge+7UTcctnbm170dfl09Y5G4NqpG+VkQYflGCvibPVUX2SxXasontHiwySGaA+QtdkjPaCuZRfbq+HpYiOxVipLo1f3ny6liq1GW1Tk0/E+WnNRuq611nvFO2jujW7waDmOdv4zD/Ln8hxzNRRRyAmPDHfsK6xqO2G5UQMDuirac9LSTA4LJBy49h5H/wAFz2lboLzYaW4Fu5I9uJWfivBw4fKF8r7RZbW7OV443LpOMJOzXJPjbvT7+FvA+gZPjaOd0Xh8ZFOUefd17mbaRjmPLXDBC0rlLlCHxdIB4zfoXFr3vZ7OY5vg1XtaS0kuj+T4njM5yyWW4l0r3T1T7giIu8OqCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiA0y/2T/ySvnYj/8Ao+yfocf7gX1fxYR5Fx1M+uZoGzPtzC+pbBAWtBaCWgs3h43D3OV0Gb3WNwbSu9qX9kjvMsSlg8TFu11H+5HJLbUV1toudZRXCop6U04jLHSztb0m8CTgHHLH7V9H6guP4OmKo+eph/qWk3e4SHLtNRg/+0qmfyBXVYzH5zjKEqUMJKm3bzlON1rfu8DsMJgMsw1ZVJ4iM0uTi7fE3dqr9OW23w0FLeKAQwt3WB1WwnHnyt17O2P45t3/ABpn1riDW17v/wCOWz/XV/VEV83S3J3ubDYh553H/wC0vI/wdi6snOpSnd6t7VP/AOR6T+I8LBKMakbLul8jlJbnp6WQvdeLfk/+9M+tfKkrdNUtZUVcN4oBLO1jX5q2EYbvY6/8xXFF14J+0+n2j8t5/wCwF9Y2Vp/taCzD8mN5Xcfw1j6tDyepOpsWSttQasuGm1ysdcs6wNKq60Iw2tdbSvrx/lOc9nbH8c27/jTPrXznu9gmAD7xb8DsqmfWuPZE0/2lHQf6Yz9a+nQUmONJB6GJhew+5qKpTqTjJcGtnT1SMcR2phUg4ThGSfLzv/ibjprXUQvdQVtPUOZje6KZr8Z7cHyFfFRscUeeiiZHnnujGVV7nK8FVwdF06tWVR3veXHloeQzDFU8TV26dNQVrWXDxCIi7E0QiIgCIiA9DOUVcoto9qyFRUqIQKHmqoeaAIiIDo+0D7awfmB+8V1xdj2gfbWD8wP3iuuL849rfvnEfm+CPa5d9lh4BeMO6T+/Vf8A/g3/AFaJez14w7pP79V//wCDf9WiXoPo1+9an/bf90TUzv8AyF4/BnA7KCBtO0wSQALrTcT+cavdPTQ++x+sF+d6L3nabsks9rQq77Y2Vb0b879UdTgcw8li47N795+iHTQ++x+sFhfupNd3DT9nobDZap1PUXNr3zzxOw9sLcDdaRy3iTxHU09q8rrv2sIHXDZRo69Uw34qEVFsq8D+ykErpGA/lMfn0LocF2Fo5XjqFatV3kXK1nGyvstq+r5r12Nurmsq9KcYxs7de9dx0amhnq6uOngY6WeaQMY0cS9zjgDzklZ+0v3NlVLTxz6j1C2mkcAXU1HFvlvk6RxxnzNI8qwNaq6e2XSkuVKQJ6Sdk8RIyN5jg4Z9IXo2HulrV7HB02mK3v3d4xtqG9EXflYzj/SvQ9qp56lTjlS0d9pq1+70uXf7jTwCwru8Q/Dj8DFu3zR9k0PqqhstkdUvYbe2eaSokDnue6R46gAODRyC47Yf99rTf6a36CuJ15qe46w1NVaguQayWoIayNmdyNjRhrB5h8pOetclsWlbFtX005xABr428e0nH812Do4ilkkqeJltVN3K7462dzh2oSxScFZXVvWepO6K+8zqD8iH+PGvFa9qd0V95nUH5EP8eNeK15v6Nfuyp+d/2xN7O/8APj4fFmeO562YaU1rourut9gqpKmK4vp2mKcsG4I43DgPK4rJDdgWzoHJo68+Q1jlxncf/e0uH64l/gwrM68T2lz7MqGa16VKvKMVLRJuyOzwWEoTw8JSgm7dDpGntk+z+xTtqKLTdNJOw5ElS505B7QHkgHzBede6J11ctQ61r7HFUyRWe1zup46djsNkkYcPe4dZ3gQOwDhzOfYK8ObaLNU2Paffqapjc0TVklVCSODo5HF7SO3njzgrtewNV4/Mp1cXNznGPm7TvbXVq/71NfNo7qgo01ZN62Nls80bd9cagFntAia8MMs00pIZEwEAuOMnmQAB2rO9g7myywlj75qGtrCOLo6aJsLfNk7xI+T0LDWx7Xs2z/U0lzFEK2mqITBUQ7+67dyCHNPHiCOvnxHDmMo6w7o6Oqss9JpuyVNNWTMLBU1MjfsOR7prW5yezJHp5L1HaNdpKuMVHL/ADaTS1Vv1u3qrd3tZo4LyKNParay6amBb9FTQXyvho2ltNHUyNhBOcMDiG8evhhZ97i//wDln/A//vrzs4EOIcCDnjnmsr7FrhU2/ZrtJloql9PUihpnRyRuw9vjStJB6vdc123arCyxGTzw6esnBX8ZxVzXy+ooYlT6X9zO+90DtiFF3xpPSVVmq4x11dG7+y6jHGfxu13VyHHl5saHPeAAXOccADiSVFvbDdq6x3aC622SOKrp3b0T3wslDHdoa8EZHUccFuZRktDJsJucMry5t6bT73rZeuxx4jFSxNTanw9x6S7n7Y+LK2DVOqaYG5kB9HSSDhSjqe4e+dg/B8/LOi8X+3btP/xOf+I0/wD3ae3btP8A8Tn/AIjT/wDdr59m3YvPc1xLxGIq023wV5WS6LzTt8PmeFw8NiEX7Pme0EXH6aqJqzTlsq6h+/NPSRSSOwBvOcwEnA4cyuQXy2pBwk4vkd8ndXPvbvthT/nW/SFkM81jy3fbCn/Ot+kLIZ5r679GX2fEeK9zPMdoPTh4Miiqi+nHnQoqogIiIgChVUKAiIiEYKipUQEKipUQjCIiEIiIgC0rUtKALStS0oRhERRgFRUqIAoVVCryMWRERAQ80Q80UBpREQBDyRDyQxNKFEKAiIiAhUVKiEYREQEPNEPNEBpREQBaVqWlCIIiIQFRUqIAoVVCgZFCqvlVCZ1PI2mkjjmLSI3yML2td1EtBBI8mR5whD6IvNm03bvrfQ+tq/TNTadP1jqTcLZ2RzNEjXsa8HBeccHYIyeIKztoifUFbZaW4X+W29LVQRytho6d7BEXNyQXOe7e5jqbyQzlTlFJvmdzUWL9X6m2j2jaNp3S9DHpmqpb8ZzFVyU07HQCFu+8OaJTk7pGCCMn8VffbFqPXuitIS6ktLNP3SCijaa2KanlieMnBezEpBGSPFPEDPEoc+y9DJC2Fb/eD5gsC7Fe6OfqvVzNP6soLfbDWYZQ1FOXBhlz7h+8T7rkD28OvhmnVzb4adxsE1ujrAMgVsL3xv4HDcsc0t4448fMjMKsHHRm6WldA2R6h1rq/S5v13jslujmM0VNDDTyvcHseWbzyZAMbzXeKOYx4wWNNqu27XGgtZVGnai2aerejjZIydkUzN9rhkZaZDg8xzKhxxpSlLZXE9Er6U0vRSb2MgjBXT9G1mr7zo+ku9bVWSmq6+liqIYo6KV7IQ8B2HEyguODjhu4PasJah2/a4s2tavS01m09JUU1aaQytbMGuO9gO93nB4FUQpSk7R5Hqjv2L8V/wAi29ZOyZrQ0OGD1rEWs9X7UdF2p96u2l7BerZB41S611UrJImfjEPaeHlGcdeBxXYtkW0fTm0mjldaZnUtdTtDqihqMCVg5bwxwc3PDI8mQMhQOM3G/I7kt3bT4zx5AvqyjibxcS79i6ntg1lS6A2fXLUEYhfVxtEVJE7iJJ38GA9ZA4uIzyaVbEhTd0d0XGVwxUu9H0L5aJ1BR6q0lbNRUBHQV9O2YNzncJ90w+VrstPlCl/bWPZK2gmggqSBuPnhMjByzloc0nhnrH8kZai0C3dt91J6F5d1bt91vp3WVdpmos2n5ZqSp73MrWzBruPB2N/hkEFZK1Lq/apoq1T3246W09fLZTjfq/YyrmjliZ1uIe08B1kZxzOBxUKqMotX5mZVxVf/AHp/o+hdV2RbV9M7SaSQWt0lJcoG71RQVGOka3lvNI4PbnhkcuGQMhdqr/70/wBH0KkrJrRnwRcBrur1BbtP1l0sMltMlHTyTvgrIHuEu63ewHNeN3keo9XJYT2b7btea51RFp+32nTVNUSRPkD5xPuYaMkcHE/sWJxwpSnFyXI9J0H95HmK5JYF1Ltb1bs5u1KNdaPpJrdUktjrrRVuc3PWN2QA72OOCW+Qnisw6M1RZNYafgvlgrW1dHNwyBhzHDmxzTxa4dnp5EFVHLGDjG7OQrah0OGsAyRzPUtiKqcOz0hWFtvu1LW2za9W+lfTafudPXQukilFPNE5pa4BzS3pHdo4549gW/0HqbafrDR9FqS3waPghrA8sinFSHDde5hzgkc2lGSdOdtq+hmVldGWDfBDuvAXHyu3pHO7SSsU6c1ttBj2p0WjdX2G0UkNXBLNFVUTpHNlDGk+KXHtxkEAjI4cQsqlDiqKSsmbm1/3g/kn+S5JdO1PU6hobRV3HTslsM1JSyzPhrYHvE26Mhocx7d3kep3McsccNbMNu20LX+qW6etln0vTVL4XytfUdOGYaM48VxP7ERzUqblG6PQl0/vA/JH0lbQrCd+25XzSOtjpzaLpWnpHNDT31bZ3PYY3E4ka1wy5vPrBGDwzwWZqKqp66igraSZk1NURtlikYctexwyCPIQUZw1acou75m4h/tmflD6VzSxLtc2k0ez6Ww9O1kjq+vY2Zp4mOmaR0sgx1jLcdvHsWWI3skjbJG5r2OALXNOQQeRCIyhFqN3zNtdf7u38sfQVxS6FrTWO0GfafVaN0nZbNPSUlLDUz1lcZWti3wcBxaeZwcADPA9hWPNqO2HXmgNQw2W5WzTVVNLStqQ+nE+6A5zm48ZwOcsKFdCU5WR6CjeY5A9vMFc4DkA9qwZFqPa5V6KpNT2y06TrY6miZWNpGGoE5a5odugE7pdg8s+bK7RQav1bdNjNJrm2R2WOrbbpayoo54JXNk3N47rHB4LeDTzByT1IhTptGRa7+6SeZcKsE7NduGvdoWoJNP0Vq01Ry97PnMkzZy3DSOHB/PiuQ17tP11s8q6R2qdMWeut9U4tZU26qkaMjm077Th2OOCMHjg8Dgy1KE9rZ5mZlzVK8yU7HnmRxXSdD6ptWstNU99s0rnQTZa5jxh8TxzY4do/bwI4FY12vbXtcbM7tRW19Fp65QVcBmimEE0ZGHEFpb0h8nX1ojCjTk5uPM9COGWkdoXALr+yHUOrtZaKptTXN9komV0UhpqeClleWEOc1rnuMgyMtzugDI/CCxJtP2u660PqKqtctpsVdBB0RFUyKVgPSNcWggvOD4j+GT7lGZToynLZXEz9Tx9LOxnUTx8y5sAAYHABY32B63Gv9KC8SxQwVsMj4KqGIndY4EEEZ44LSD589i7drm/xaX0jcr9Kzpe9IS6OIc5ZD4sbB5XPLW+lESFNxdnxORuMhjpXYOC7xVw5Xnez90DrrUGrKHTPsFYKepqKwUxc4SkMcXbpJw/jjjyWfqU1NPQb91qqV8rGl0ssUZijAHHOHOdgAdZPyKMxxFOUJam5W/tMhD3RHkRkLB52v3DVGsfBfZvaKave3LpbjXuc2nYwEAv3W4cW8QM5BJIwF2PUFz2paYtcl7gZpu/x0sbpamkhpZqeXcAy7ccZHg4GTxGeHDJ4IYxpSjJX0Zl5cZd4g2RsoHuuB866psf2qaf2kUMneDX0Vzp2h1TQTOBc0ct5p/DbnhngR1gZGeE2/6v1roW0NvlupLHcLQZ2xvbLHIyaEkcMkPw8E54gDHDgeayOaVKUnsczvC5Gzf776P5rBexPbQ3Wl3lsl9paW33F436MwlwZMAPGZ4xJ3hz8oz2ccpamqtS2/T1fc9NG1yTUkDpn09bC89NugnDXNeN04B5g5JHJY8zhVKUKijI7kuDuX98k8/8lw2zm66z1Joilv1yksdDUXGmjqKSKGllkbE13EF+ZBvZbjgMYJ5lYK2gbdda6a1rdNP1VnsM89HUGIyRsmDX8AQQC/hkEcFWc0qEqnmx4o9DLd2uQtqQzPB4wVwljbeW0YN7noJKlwBLaSF7GM4cRlznF3n4eZY81ltjitmroNJ6OtQ1Bf5JxBu9JuwxyHhukj3RHXyA45PA4xRq0qcpStEzouOvQ/sj5/5LqU8e2GK0mrjrdF1NeGbxoRRVDGE/itmM3PqyWgeZdX2f7ZrdrG6HTl4tz7FqGB743U0j95kjm8HNa7AIcMHLT6CeKyNipTbg2tTIaItrdGXF9KRa56SCozkOqYXSMI7MNc0jq459CxNI7atpdf7m7zj6V5jvvdHa8slyfRV+mrECySRgc0TYkDJHRuLSX8t5jh6F6Mt93pL/AKTor3QO3qaugjnj7QHAHB8o5HyhZM361KUI3ZtFvLR/fP8ASVjvbJrap0Vp+KpttJDWXGoe7ooZc7ojY0vkecEHAAA583BdQ2JbVtZ6/wBXvtMFHYbeyGmdPLO+GWTABAwGiQZJLu0cisbGvSoTktvkejFFGbwYA8guxxIGAT5l03bRrdmgdB1d9ayOWsLmwUcUnKSV3b5AA53+lU5YpydkdyW2uf8AcZfMPpW30zeKPUGnqC90Dt6mrqdk8faA4ZwfKOR8oXRNrertX2rVFk0zpGzUFxnukE0srqrfDYWxluXEtIw3j5eoDicKlcHK6OzIsL7T9ouv9n8FukulDpipNcZA0U3TndLN3Od4j8YLkdFas2mau0jHqK00OlAyRz2tp5nTteSwkYyCRxx1lY2Nbyaezt6WMrFRdF2d6k1TqzStZU1VNbrRd6O4y0kkMkD5GDca3II3wQcu55I4cisZWvbfrOv1fBpltosMdVNWij33CUsa/f3c+6zjKWEcNOTaXI9DqFdDu9TtcpKOSoo6HSNe9gz0Mb52Pd5G7xAz5yFudlup7xq/Rklzrqamt9xbUTU/RiNxZG5nAbzS7JweYyPQhg6TUdq+h3JFgXaNti1jovVlTYKi22OrMLWPbMyOVoe1zQRwL+HZzPJd3rbvtQp9PC9U1s0xcWd7ioNNC6dkxaW72G5yCcdWfNlLGcsNNJN214GQ1DzWMtku2C2a4rzaKmhdbLpuF8cfSb7JgOJ3TgHIHHBHLrPFdi2m3fUGntN1t+s5ts0dFD0klPVQvLnAHiQ9rxjh1bvVzQ45UZxnsS0Z2taVhPZRtU1hr3UkloiorHQshp3VEszopZMNDmtwG74ycuHWOtZrZvBgDyHOx4xAwCfN1IKtKVJ7MuJUXWdqGqWaO0VXXvDHVDGiOljfyfK7g0eUDiT5AVyWlL1Tai01QXukP2GsgbIBnO6fwmnyg5HoUMHCWztcjslh/tZfyVy64O3Mq309SKGaGGo3QGPmiMjAc9bQ5pPyhYF17t81tpHWFy05VWfT9RLQy7nSsZMA8EBwOC/hkEcFkjcw1KVSNonpZFxenBfu8Wyagntz6h7Gno6OnexsZx4w3nPcXdXHDeXJcogfE2V5/uLvyguBK5y+OxRgdrx/NcGVGalf0iIiLFnCQohRUBERQjNKIiqAUVUUIRRVRVgIiKAhUVKiE5hERAyFEKICHmoqeaiAiIiAIiIYkPJRU8lEAPJaVqPJaUIwVFSohAiIowQ81FTzUQEREVIRRVRRAIiIwQqKlRQgXHXb7YWT9ZN/hyLkVx12+2Fk/WTf4ci0M1+w1/yS9zN7K/tlL8y9521cbdv7Zn5P81yS4y7f27fyf5r4/wBhV/4vHwl7j6L2r+7peK95s0RF9wZ8rYXy0OwwSXqmyS1twdI3PVvsY8j5SV9V9dJxOFNWVTm4NVVveOOctaBGD5iGZ9K8V29qQjlOzLi5K3tfuPU9j4yeObXBJ3OYkGWOB5EELglzdQ8Mge49QXCLqvo4hNUa83wbSXik7+9G722lF1aUVxs/hb3MIiL6SeICIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAHktrp050dZf0Vv0Bbsc1stNHOjbL+jD+S6XMlfG4P80v/wDOR2+Bf/BYnwj/AHI3iKgEnAGSuQpaEAB83E/i/WuTN87wmU0t5iJavglxfh8+Bw5dleIzCpsUVpzfJGxjikkPiMLluWW+U+6c1v7VuquobTMAY0Fx5N5ALhKuOSs/vdRNIPxGPMbPNhpGR5HErzWDzTPM7/xMLGNGlylLVvw5P1W7zvcRl+VZX5mJk6k+i0S8enr/AEOSfRwx8JKprT5cD+aveAc3ejnDh5lwRstmJJdaaBxPMmnYSfThbaTTdrDzLSMmt8x5SUcroiPQOH7F2TynOkrxx933042NNY/KG7Swtl+dnYZKKdnEAPHkK27gWnDgQewrh47ze9PEG6k3W2A4NVGzE0I7XtHBw8o9PYu2wvpLjSR1EL2TQyN3mSNPMeQrqa3aTM8mqqnmlJSg+E4c/Xpfu81nYQyDBZjTdTAVGmv5Zfu/vOJRbmrpXw+MPGZ29i2y9pgcdh8dRVbDy2ov969GeVxWErYSo6VaNmgiIts1wiIgCIiA9DOUVcoto9qyFRUqIQKHmqoeaAIiIDo+0D7awfmB+8V1xdj2gfbWD8wP3iuuL849rfvnEfm+CPa5d9lh4BYg2hbNNnGodYV14vupaqjuM/R9NDHWwsa3dja0eK5hI8VoPE9ay+sA7SYJKraTXU0IBkmmijYD2ljAFy9ladWeLnuqrptReq6XWh3ODy2jmE3TrcEr/v1j2mtkP+MK7/lGn/7tPaa2Q/4wrv8AlGn/AO7XOVmzm3xNqKGG+OfdoKYVDo3Rbsbgc4APnHb2cFptGzuglora25Xeanr7nGZKeJkWWjDd4gnrIHmXp/rWWxt+X1PVrwve1uFtbmf1FlOztXfq/W/hY4X2mtkP+MK7/lGn/wC7XP6T0Lsy07BXUkOqn11vuEfR1dDWV0D4Zce5cQGAhwPEOBBC2dDs/pRarhWXW8GjFDVugkcIt5m60t8bt4g8PQuI2iaWj0vcaeCGqfUQzxl7S9oDgQcEcPQslWljp+S+XTlfu00s9HbitH3HPR7P5ZKqoU3rry/fI2V92KbP6mpfLZ9fw2+Jxz0Uzo6gN8gO8048+V9bBsX2cUtQ2W866juTGnPRRSxwNd5D4zjjzELJ11orYNA2my0Vy6Klr5YII5W0/Go33Ak4I8U83ZOOWF1iHZxSyaguNsNzmDaOnjmD+jGXF29wxnyLioZ9ialGUauLnBK/8qu0mle+yne76t95p0siyuV5zTVr9eCaV7eL4G41fobZRqOitdE+8U1sp7Yx8cDKCsiYCHEE728HZORnPPic5XCW3ZNspt1xprhSazrmVFNMyaJ3sjT+K9pBB/s+0Le2HZ/SVNpttVcrnPBPc/7uyKHea0FpcC4+UebmFroNnEDrfW1FxvIpDR1TopHlg3Nxpb42SeGQeA7cLCGKhh4OjHHVLJtWte9278tdb3NmeSZVtNylqu79NDu2s6jRuq9NVmn7jqKkjpasNEjoKuNrxuuDhgnI5tHUsY+01sh/xhXf8o0//drnbJoLTd5lmit2pZZ3xElzWQg7rd4gEnlxXHW3SNglrayKq1ECI6vvanhgAfNJxA390Z4ZPUOolceAdPAwnSw2KqQS1aUXxenQyqZNl1aTc221/wCV/I7ps4o9C6Esc1os+pYZqeapdUudVVkTnbxa1pALQ0YwwdXauyHVemQcHUFsB8tUz61gvXGn3aavzrd0/TsLGyRv3cEtOeY7cgrgoaWWuu1PQwY6WokjiZnlvOwB9K2qXZTDZm3iqmIk9pbW1Zanmu2GJXZ/B0K2EW3tysk/C56R8LNMf4gtf/GmfWuq7Qrbs01zRMgvd3t3TRAiCqhrGNmizzAPEEeQghdYuWza2wQV1JS358t2oqYTyRPhDWOBBIAOevB6z1LVbNmdvfS22C5XqanudyhdLDEyHea3daHEE9ZAcOseRaOHyzKMK1iKOLnGS4Wi0+F78L22db8LHlJ5xnVRulLDQf8A6la97Wve176W43Olz7EdGOnJg2oUUcOeDXxRudj8oSAfsXbtEbNdk2nauOurNQUd6q4yHMNVVRiJrh1iMcD/AKi5aLds6ozZaqvu16dQmkrHU8pEW8zxZA3I6+OeHnC4PaRpVmlLvDSQ1T6mGeHpGue0Bw4kEHHm/avSqs8yqeRLMJtu60io3ta62lFX0fU6ytm2PwdHyqeEgo6fzXave2l7rVdDsGodl+yi/wB/rbzPqqojnrp3TSMp6+AM33HJ3QWE8znmea12PZ1sts9JdKSk1nUmG50hpahr7jTnxd5rsjxODgW8/KV23T9mqrVb7TaKfU/esdVTyPhhFEwvc/Ac5wcc8RvHn5F0e3bPadsV3rbxc5oaK31TqZroId98pBA3sccDxhw49fYumw+JVWMqVTGzUI22Uk2351lo4LW6XBvXnodniMbjaexKGGi5O+1dpKPmqT12npZ80vDU2vtO7Hv8ZVv/AClT/wDdp7Tux7/GVb/ylT/92uVg2WY1TVW+pubm0EFM2oE7WDeIcXANI5DG67j5B2rS/SFHYIbHqS3XEXNs1wiETJAIY3tJcQS4+54NGcjhxW95bGTUaeY1JSaVtNLtNpN2srpc+Bq+XZjFOVTCQik3fXWyaTaV7uzfLicZ7Tux7/GVb/ylT/8Adp7Tux7/ABlW/wDKVP8A92uwXzTVr1Lfb9qSW4uitFLIyFrqWPpHSObGwO3cdQJxwzldM2gaXdpa7x0ranvmnniEsUhbunGSCCO0Y/aubAVKuMnGj5dUVRq7VuDsm1e1m1dXOHH5visJCVbyaDpp2TvxV2k7Xuk7Ox6JtNPBSWqkpaWQyU8MDI4nkglzQ0AHI4HgFulsbB9orf8Aosf7oW+XySsmqkk3fVn0elLapxl1R97d9sKf8636QshnmseW77YU/wCdb9IWQzzX1v6Mvs+I8V7meb7QenDwZFFVF9OPOhRVRARERAFCqoUBEREIwVFSogIVFSohGEREIRERAFpWpaUAWlalpQjCIijAKipUQBQqqFXkYsiIiAh5oh5ooDSiIgCHkiHkhiaUKIUBEREBCoqVEIwiIgIeaIeaIDSiIgC0rUtKEQREQgKipUQBQqqFAyKFVQoTkeIe6w+/ddvzFN/BavZ+lhmwWof+6w/uBeM+60jezbXcnOGBJTU7m+UdE0fSCvZ+i8S2C0vbxaaOFwPk3Aht1vQgcBrn782zn8m6f9XYvvt747ItQA+8s/isW31kRNtv0BAzxnwUt0qJAObWmOJgJ8hLsehbjb396PUH5ln8ViBcY/vmeae6n2RO0hdXav05TltirJczxRjhRTE9WOTHHl2Hhw8VZS7mrax4a2hunr9UA6goIgGyPPGsiHDf8rxwDu3n24zld7dQ3e11NruVNHVUdVGYpoZBlr2kYIK8KbXND37YztEpq601M7aIymotNcOeAeMb+oubnBHJwOccSAZnpWjsPieqdh/3s6D9IrP+tTLzL3X334pf0CD/ALS9H9ztUvrNjljrJQ0STmpkcG8gXVMpOPlXnDuvvvxS/oEH/aURx4f/ADn+p6x2ffcFp79V038Jq8ZbUxnug7sP/wC7b++1ezdn33Bae/VdN/CavGW1L/dCXX9dt/faqXC+nI99T0lNPSS0k0LJIJmGOSNwyHtIwQe3IX5+6EulTs/23U0lHI5raC7PopgT7uHpDG8H/Tk+cA9S/QeR7I43SSODGNBLnE4AA6yvz205Qy6724MZQsc+O5Xp9U8ge5hMpke4+ZuUM6FtmV+B70klkkPjvJXnfumqK761or0LTITbNGxRzVbAM9PUSYLwOr7FEQ49m+Qs3azvtPpnS1wvtS0vZSQl7YxzkfyYweVzi1o8pXRtnsOurNpSa012zuK5T17pp7nK+8ws75lmJMhLd04GDu4zyACnM1aGj2jpvcQaz6WiuehqyXx4Ca6hDj+ASBKweY7rsf5nL0RX/wB5PmC8GUcl52P7Zqeero5aWe2VTXvp+lDy+neOLd4cHZjcRnt8y92d909fDDXUcrZqaoiZLDI3k9jmgtI84IRnLi4285czwvtv+/vfP1iz6GL3hRxRzxzwzRtkikbuvY4ZDgcggjsXg/bf9/e+frFn0MXvK3EN6VziAAAST1IWtwh4HgbTlxm2d7chLRPcxlqvUlK9pdjfhEpje0+duV7yr/70/wBH0LwbQ0Em0LbvLBbmmWO736WfeAzuwumc9z/MGZPoXvO4DFU7ygKjG8EcDrP7j71+r5/4bl5H7k378lH+iVH7i9caz+4+9fq+f+G5eR+5N+/JR/olR+4oYUP8qZ6R7oS0wXfY9qGOaMOdS03fcTscWOjIdkegOHmJWFO4m1FU0Wvq/Tbnk0dypDMGE8GyxEEEDytLgfMOxZy28XKG1bINTTzPDemoXUzBnm6XEYA9b9iwR3FOn6mu2jVmoDG4Udso3MMmOBll8VrfVDz6B2ojPD/5MrnN93d9uNK/o9T+9Gvro/aJZNJ9zHSwR3mmF+dS1UVNSxTg1DJHzShry0cWgZDsnHLhzC+Xd3fbjSv6PU/vRrdaL2f2bV/cw0ZbaaZ17FNVS0lVHC0TmVk8u63eHEg4DcHhg+QIZy2d1Ha4X+ZnOW10ldWWq6ThxqqAPdC8H3xm64HyEEHzgLkiuLvF2pbDZY6yt3t3fhgaxuN58kj2sa0A9Zc4LlCoda7m3un2iuv6BN+4V5E7j+SOLbNBJLI2NgoKjLnHAHiheu7p9orr+gTfuFeNu5aslo1BtZgt17t1NcKQ0czzDUMD2FwAwcFVG/hv8uRzXdY3ei1fteo6DTThdJqWijonGl+ydJN0j3Fjd3O9jeA4deR1L0ns0s1Vp7QFjstc4GqpKOOObByA/GSAesAnHoXKUeldM6eqd6xaftdse5mHPpaVkbncTzIGSutbYbrX0elHWqyNMl7vT+8KBjXBpDnAl78nkGsDnZ6iAjOGrU3lqa5HnjujKW66jDdojXl9kdWyWyiYByij4Nl8z3iY+YN7VnruUtZeFOy+noamXfuFkIo5sniYwPsTvV8XzsK4TUVo1PeNnMuh4tnUcFGaRtNTO9mYT0TmAdG/3PEhwBPbx7VhTuadT1GhNsDLTdN6mp7hIbZWxvOOjl3sMJ8oeN3PUHOQ2I/4lJroey6u20dNU1dxhhDaqtdH3xJk5fuNIaPJgE/KV5B7sX76ND+p4v4sy9lXX+7t/LH0FeNe7F++jQ/qeL+LMhw4b/P/AEPR2yb712lv1RS/wmrndSW6jtOy+90FBCIaaO2VbmMBJDd5j3HGfKSuC2Tfeu0t+qKX+E1do1397+/fqqo/hORHDD034nkHuRXNZtWlc9waPYufiTj8Ji713X2pbLPpa3aepq2nqbia9tS+OJ4cYmNY9uXY5El4wD2FY07maw2jUe0Oe2XughrqR1snd0crcgOy0Bw7CMnBHJbHVdku2x/alBLHGypippRU0MkzAWVEJOMHy4y09YPEdRQ35wjKve+qXAz33KOn7rY9nlRPdIJKb2QrDUQQyNw4R7jWhxB5b2D6AD1rondqfb/TP6FL/EXoHReo7bqzTVHfrVJvU9SzJaT40bh7pjvKDw/byXn7u1Pt/pn9Cl/iIa2Hk5Yhtmdu5v8AvIaY/Rn/AMV66HrzSzdY37aBZQwGpdarbLSE9UzDUlvmz7k+RxXfO5v+8hpj9Gf/ABXrj9Pffd1b+rrb9NSjMKknGba/eqMBdyJqw6d2lP0/WPMdLemdBuu4btQzJjz5T4zfO4L0lq4eEe0ew6Xb41HagL3ch1FzSWUsZ8795+D70F5W7ojT1Rozau67W3ep4a54uNJIzh0codl4HlDxveQOC9U7FIa+t05NrG9QthuupZG1sjByigDQ2CMeQMAd53lU2arTSqLmeQ9nP3/rb+u3fvuWee6wv9TaNm7LfSSOjfdakU8rgcHogC5w9JDR5iVgbZzx2/W39du/fcs7d1nY6i6bOIrjSsL3WurbNKAM4icC1x9BLT5sqGNe3lELnXO4yoIm23UVzLAZXzQwB3Y1oc4gefeHyBei6BodVsBAI45B8y87dxlXxOtGobZvASx1EU4bnm1zS3P/ADf2hejrUz7I+U8GtHMoauJTeIZ4Y05c5dA7c+noHujit16kpXtB91B0pje0+dufTg9S9d7coYajT1kpqiJksMuoreySN4y1zTMAQR1gheRLDbZdebdDBQNdJHcr5JUucB7mEymR7j5m5K9cba5QaPT0QPLUVuJ+fahuYlpOPU8tbbtntbs61RFdbM6Zlpnm6WhnY471NIDvdGXdRGMtPWB2gr0DsY2j0+vNnN4jqnxx3yjoXtrIhw6QbjgJWjsPX2Hh1jPcdU2G26lsNVZbtAJqSpZuuHW09TmnqcDxBXjfUdr1Nsh1/JFBO5jwx4p6gN+x1dO8FpBHYRwI6iOHUUOOjNYiKjL0ke19k/3rNJfqSi/gMXjPugvv7ah/TY/3GL2Zsn+9ZpL9SUX8Bi8Z90F9/bUP6bH+4xDkw/8AmM9RbXr7PpvZte7xSuLKiGn3IXjmx73CNrvQXA+hefu4+omVm151XM3fdSW+WZjjxw8uYzPnw9yz/tisk+otmV9tNKwvqJKfpImDm98bhIGjyktx6VgLuOq6Ok2syUkrt11Xb5Y4wet7XMfj1Wu+RRGvhbbiduJ7MXh7uloXWPbxdqu3PdTyl8FZG9nAskMbCXDy7wJXuFeHu6Zndetu11paBjqiRrqekjYwZL5BG0Fo8u8SPOsjlwnpvwPVOj7ob5pS03hzQ11bRxTuaOpzmAkfKSuVXFaOtZsek7TZ3EOfRUUUDiORc1gBPygrlVgzqpWu7HnXa7pD2X2Mu1RSxb1VZr/cxMQOLqeStkB8+67dPkBcuf7kXV/f2jrjo6qlzPbZBUUoJ4mB7vGA/Jec/wDzAsm7LLfS3XZ3drXXRCWlq7rdYJmH8JjqqYEfIV5JtDdR7Ndr81qtsZmulPUvoI4yMCoEnixnHYcsePQsjuLb2nKnzM27RB7O2fXuo3eNS26hfaLf2EtIdUPHnfusz/7Mro/caP3NoNzd1C38fnWLK+vLNFp/YJdbNE/pO9rY5r5DzkkPF7z5XOLj6ViPuP8A7uLv+rT/ABWKcjgpyvh525HsZeae6ipLtrKlu9wtjy6z6OkjhmYBnp55MGYj820xA9mXrOms9Rs07omsvpj6aaKLdp4RzmncQyOMflPLR6V0bStHrS1aGOmq/Z4y4d8xy+yMz71CDVSTEmZ5G7+EXHzDA6lSUXs+edR7jDWHflir9GVcuZqBxqqME84Xnx2jyNeQf/mLPFXbKOSvN0MINaylfTMkyeEbi1xGPKWtPoXhvTNZddku2KnkuMElPLbqkR1cO8HF0DwN4ZHB2WOyPLgr3fTyxVFPHPBI2SKVgex7TkOaRkEeTCpyYqFpXXBnlzuyP7rpj8up+iJd07mP70Nv/Pz/AMQrpvdmN3IdNMP4MtUP2RLuXcx/eht/5+f+IVjyOCf2OPj8zIdHQUtFJVyU0QjdVz9PNg+6futbnycGNXjawzwUu3SmqKmaOGGLUO9JJI4NaxonOSSeAC9pFeLtPwxVG3WmgniZLFJqHdex7Q5rgZzkEHmEQwDup36HpOz64t2odq7bHY7lHW0dHZ55qiSCTeifK6aENAI4OLW73Efjkdq7fa7ZS2zvsUjXNFVUvqpATw3343secjPpK6patE2+x7VW6gstvio6WstE8FUyBgZG2USwlpAHAFw3uX4me1dpiutLNfqmzRbzqilp455iMbrBI54aD5TuOOOxQ06mz/JwseVu6h++xU/okH7q9Jx6hs1g0TR3C63CnpoYaGNx3pAHOwwcGjmSeoBebO6h++xU/okH7q7Dts2ZU1No+2au05RMhZFRxC408LcDBaPswHnOHeg9RKp2M6cKlOlGTsdZ7n6y3K87U6K50NM+OioZnVFRKB4kbcHDM9pzjHZk9S9H7Y/vXak/QJPoXQe5g11T3KyjSFb0UVfQsLqYhob08Xo5ub19ZGD1Erv22P712pP0CT6EfE18TOUsSlJWtYwZ3I33eXT9Vu/ixr06vMXcjfd5dP1W7+LGvRWrLzBp/TtdeahpcyliL2sHOR/JrB5XOIA86j4mOPTdey7jDvdEU1z1ZTXRtteTb9LRslqWgZ6aeTBcB+bjw4/llbfuTdU9JS3DSNTJ40WaukyfwTgSNHmO6cf5nLuGkYtY2rTL7bW6Gjrpqx8s1fK66xN74klJLyRg4GDu47AF56p3XTZltRhmqKWSnmoKgPdD0geXQPHFu8OByx2M9vmVNilFVaUqOmnD9/vie6LC3EMru1wHyf8A/V4p7pP79uo/zsP8CNe19NzQVVlp6ymkbJBUsE0b28nNcMg+kYXijuk/v26j/Ow/wI1UZZerS/Q9zoi4a736C36islj3BJU3WSbA38GOOOJz3Pxjj4243HD3eerBhq2uzXfn8Yo/OT/+fKuKK3d0k6Wtfjk3xR6FtCoaVR3kyIiLFnGQohRUBERQjNKIiqAUVUUIRRVRVgIiKAhUVKiE5hERAyFEKICHmoqeaiAiIiAIiIYkPJRU8lEAPJaVqPJaUIwVFSohAiIowQ81FTzUQEREVIRRVRRAIiIwQqKlRQgXHXb7YWT9ZN/hyLkVx12+2Fk/WTf4ci0M1+w1/wAkvczeyv7ZS/MvedtXGXX+3b+T/NcmuIvVRSQ1LG1FdSU7izIbLM1hIyeOCV8b7FV6dDNYzqOys/cfSe01GdbAONNXd0bdF8HXC0M93fLUzz1bPrVhu+ny7DbpHVOH4NM10n7oK+t1s9wlNXjtTfSMZNv1K3rZ87pZNiqjs0orrJpfE3McElQejjLmZ4F4HuR2+fsXMQxxU8DIo2tjijaGtaOAa0DgFxLL0x7d2ht9S4ZIDpmdC0ecO8f/AJpWmSeom/tpAR+K0YaOP7ern2dS8NmGWZv2mxMZVae5pR4bXHvduLb/AEXK56vCY3LsioOMJ7yo+Nvdfgl7Tc3CpEpEbD4o5ntK2aIvoWWZdRy3DRw9FaL1t82zxWOxtXHV5VqvF+zuCIi3zUCIiAIvlUVEVP0XSnHSzMhZ5XPcGj6Vy1TRRMgc5hIc0Z4nmunzDPMJl9elQrN7VThZd9tTssHlOJxlGdaklaPH/Y45ERdwdaEREAREQBERAEREAREQBERAFt7nNLT22qqIGCSaKF742EE7zg0kDA4nitwvvZhTV8EsrS5wZM+I9XjNOD+3K67Nc1w+V0PKMRe10tNXdm9l2X1sfW3VHjx14G0NTcJaRlRboLbUNzhwmEkRGAAeon3W91cgOaUm8y3wQPp6em6Pe+xwPLo2gnIAJA4Yx1BbWeJtr1bRspyIoasvE7WtADi1j3AnA5kvJOesDy531MwVNwZTA+KxolmH+XOGj0kHzhrh1rzeGWFwNOeOqXlGEVOEm5XammkrN22uXDmuB3+K3+LnDCU7Rcm4yiktNlrW/G3P9DkrbABGJnNIc4ZAI4gLdTSCKJzz1Ba1x92k9xGPyivnWCjW7R5xHyh32nd90VrZdOi7z2GKdLJctluV6K0729Lv3myle6R5e45JWlEX3inTjTioQVktEj5JOcpycpO7YREWRiCAQQRkHmFwtmkOmdRMoQSLPc34hHVTz/ijsa7qHb5uPNLj9R0BuVmqKVnCbd34XDgWyN4tIPVxGPMStHM8vpZjhZ4arwkvU+T/AEN/LcdPBYiNWH696O3EAjBGQuKrqfoX7zfcO5eRfTTFxF20/RXDI3pogX4/GHB37QVv5oxLE5h6wviWRZtWyLHuM/RvszXg7X8V/tzPp+b5bTzXCXj6Vrxfw8GcGirmlri08wcFRfeoyUkpLgz5E04uzCIipAiIgPQzlFXKLaPashUVKiECh5qqHmgCIiA6PtA+2sH5gfvFdcXY9oH21g/MD94rri/OPa375xH5vgj2uXfZYeAWBte1feG1Sori3e73qoJd3t3WsOP2LPK6NfaTQlZq19HcqCWa5TPjZLK0TdG2RzfsbHOad1ri1vAebtGcezuMhhK85Tg5Jxaeyr81rxWh3mXY2lhKjlV4NWOG1JW6EuVZVagrK+OuL6NscFHuva8SDPHhjtA48Oa3du1Jpquj09daq8R0k9qhe2Wnex285zoww4xz5Z4ZX0jsuziS/myttknfPSugDyZ+idM1nSOiD87peGeNjPUesFfO02rZtc7w+1U1qnFS187GGQVDGSmF+5KGPJ3XbruBwV2kquEdJRarWitNI6Raa05Wavr3X5Gx5fgXFQ2p6aL0elre04u5artFw0VqGHvpsdVWVj5IIHA7zmZZg9nJq4zbDerXea63yWysZUtiic15aCMEkdoXYpaHZs2ktdTDZayqbdI3y0jKaOoke9rMbxLWnIxvDmvpdLbs2tl1FtrLTUMl3IHyPDah0cQmeWR77gcNy5pHH0rawuKweHrxqU6VW6cmlZc7RfO+lreJy0s0y+lNVI7Wl+nNLv6I4iu1JZhprSMTKxsk1vq6eWpja05Y1g8bq4rsw1LpKC+3C4tvsb31dLGzdEbt1u7vdeOZzy6sLYz2vZlDdq21SUOKyinpYJ49+bg6pc1sWPG4glwyRyzxX0fZdnDL/wCwrrZJ3x0wpy/M/RCYx9IIi/O6HlnjYz1jrIC1atTA1Y22Kq0b4R4NqXq1Tv0aOKeOy+SteXP8PN3t60bax6ptNXpqzQSaidaX0MbY6qINO9K1rN0YOD2A8M9a4+56ms1XoW+0bLg99TU1RdAybJkewOZgnhjk1dyds/0c1pc60Ma0DJJqJMAesuCt9s2ZV+nqW/U1A51DVVLKWJ5dOHdI+URNBaTkeMRz6jnkpRxeWynvacKjW0noo8buSV++z462Whn5bgITv53G/wDLydzaaVuelaHQzbZFfmW6tqo96qmEZdIHHmBw6hwHZ5+KafuulrRpuagob+2kniqt6SpEBMlRGHg4Hnb4vkW4udu2b2+2VNxls1VJTUtU+lnfCyok6ORhwc4PAZ4Z5L5ahtugrTRUk77BOH1DTO+KQVIfDTMLemle0ZLQ0OHMDJIC5d5hq0mtmq9uV+ENWtf1suT0RhPMcC9puUtXd+idU2tXS33fU8VXbaplTCKVjC5oIw4Odw4+cLqtprm2zUlDcXNL2008UrmjmQ0gkfsWXbxbdmFprZqOto2smhtr7m4NkmcDTszvOBDsE8DwHFW9WPZrbLlHRVtrk6VzI3yOYZ3Mha9/RxukcDhgc4EAnsPUCV3eW9oMJhqEcPuaji42Xmq7XrPK9s6H1xg6FDBSUXSle8vDThc4nVdZoG4VNx1DVXCK4zT0jWUtKA9r2SAEZOMc/F58sFcnR6p0tXSWG+1N6ipZrbTSMlpnxuLy57GtIGOzB5ZzlfO5WvZZbq660VXQGOe1Ugq6pu/OcRnkW+N4x4jgOPEJcbXsvoKGjrJrXM6GrpDWsMXfDyynAaXSvAPitG+3JPb5CutdfAVKUKbjXfKOkfRcLNJXtrHW6V+Z5iOX5pCrKolQV7N6z1kpbSbdr6S5XtyOKuGrbNX6CvEBq2x1lXcDNHTuB3tzp2OHVj3IXD7aL1a73eaGa1VjKqOOnLXuaCMHeJxxCyZ7XeiizfFmYW4zkVEpyPWXWbXTbJblBZJqSiL23uSWOhBdOC8x+7yC7xceXtHatjLs3yqjWWIoU6r2XJ8ItLairrjyUG14M1cbkecYmg6FWdLzlFXvK/mttPhzctf0PrNq3Tpv2k6gXSIxUVPO2oduu+xl0TQAeHWQVKHWFoqaa/WyG/ttU8tc6alrNwlpYXNJI4c+BGD2reUundm1TVwUsNrJlnqqikjHSTDMkBIkHuurdPHrXxsdm2X3qSmjt1v6V9Q6oawdJOOMDmtkBy7hgubz5g5C1HXylQ1p1vNXHZg7WlKd3d247S10smbiwOdbTe1S8566zXGMYcUrrRJ6a3NFs1lpxup7jRyXmolop6NkTaupJIL2l+QDgYGH9fWD5Fsdo0VJBshs8FDUmqpo6mNscxZu9IA2TxsdWVvKq27LoLRQXQ2qeWCvhdUU7YRUPeYmtDnvLQchrQRnPaOsrnbnHol1lfaauJ0tvt1vbdOja+UtbB4+Hgg5PuX8OanlmEw+Jo16FOrZSTaajrspxurPjd25Iy+q8wr4arRryp3lGSi05abTUrO64ad7Oi7NdSUFNo+4WGa8Cz1r5jLT1TmEgAhv7fFPPtXBbUrrQXK9QMttyqrjDBDumaY5y4nJDeA4cl32mtOzCe0XC5i0zxRW5odVRzCoZKwFoc3xCcneBGMZzngt5T6Y2cVDbQ+G2B7bwzpKIiWbEjej6TPuuHi8eK7OlneW4bHTxu6q3bd1sxtdxV9b34K9r2V2+Z1dbs9m1fAxwcp07JJXvO9k3bS1uL42u9DuVg+0Vv8A0WP90LfL5wRRwQRwRN3Y42hjBnOABgBfRfM6slOcpLmz6NSi4QjF8kfe3fbCn/Ot+kLIZ5rHlu+2FP8AnW/SFkM819c+jL7PiPFe5nm+0Hpw8GRRVRfTjzoUVUQEREQBQqqFARERCMFRUqICFRUqIRhERCEREQBaVqWlAFpWpaUIwiIowCoqVEAUKqhV5GLIiIgIeaIeaKA0oiIAh5Ih5IYmlCiFARERAQqKlRCMIiICHmiHmiA0oiIAtK1LShEEREICoqVEAUKqhQMih5qrcNqWs9zC0eYoEYi28bF27SW09zt1VHb73SxdEySYHopo8khj8cRgkkOAPMjB4Y+ezuk27aXsNPp6psml7nFSRiGmrZrg9hDGjDQ7daS4AYHIHHPJWYu/T73+1O/T73+1DmVVKOy9TrOh9J3KivVXqvVdxguWpKyEU+9TRllNRwA73Qwg+Ngu4lzuJOOWFx+22w621ZpSs0zplljpoKwMEtZW1srZGgODi1sbInDjugZLuWeC7t34fex8qnfp97/ag3qvc2mln6kdbWt1PS2qCta1oc631Ukschx4zsPjYW8erxvOtntH0daNdaTqtPXmPMUw3opWjx4JB7mRvlH7QSDwK5fv0+9/tTv0+9/tRsm8SdzpWyvSl40bswt+n6htNU19C2do3ZC2OQmWRzDvYJAILTyJGeSwttb2KbQ9fa1qdRSVOmKBr42RRwCtnkLGtGOLugGSTk8hzXp7v0+9/tWh1W13uoWnzlQiqbMnJPU6Poum1jaNHUdquFvsU1bQUkVPE+G5SiOfcaG7ziYMs4DPAO49iwdqHuf9pGodb12p/ZLSlPUVNYatsXfdQ4MO9kNz0PHHDsXqKaRr8bsYZjs61oa4tcHNOCFSQrODbR0HV+n9r+r7DLYKu66T0/R1bDFWT281FRM9h4Oa3fawAEZB68da32yfY/pnZ3RyG3Olq7nO3dnr5wN9zee60Dg1ueOBxPDJOBjvTK3A8dmfKFXVzceKwnzlDJ1U425GL9q2jto2pr3aG2eTTUVktlwhrjDVVkwkrHxuDgHhsJDW8+ALuo9gGS7I6qNGwXGlpKWtweljpql08Y48MPcxhPqhaZaqWThndHYFoglMUm+BnhjCXOPeLRJGD9v2xrWe0rVVNeKFmmbYKam73LpK+d8kzQ5zmlwEAAxvHhx867Xso0ztH0fo5mnryywXYUTCKCaGvmad3eGI35g4AAuw4Z5NbjrGTDXH3r/nJ38feh6yHJKspR2XwPKmttgm0XUetLjqSWv0xSzVdSZxEKqdwj5YGeh44AHHgsr32ybXNU2aawTXXSlggrIjFV1NCZ55nMIw4MD2tDcgnrzjkQslTP6SRz8Yz1LQCWuyDghQwdeTavyOqbHtkWmtm0Ek1AZK66zs3J6+cAOLee6xo4MbkA44k9ZOBjv1TTsmAycOHIrbR1rgMPYHeUHC1GvHVEflVEqinqzrmv7RqWu09WWzTsVqklrKaSB0tdVSQiLebu7wDI373M8MtWA9nOw3aXoPWVNfaKt0nVzRMewwyVNRuva5pB4iLIPWvTT62U+5DWr5MmcJhK7LiO0qEjW2Fsx5mI9Y7Ldd7SKmmptZagtdpstM/pRR2mJ8hkdjGXPkx42CQDjAzyWVNDaTsei9PQ2PT9GKakjJc4k5fK883vd1uOB8gAwAAuQ7/PvQ9ZTv8+9D1kLvVbZvoYL2/wCyraHtMvVvq4hpq301BC6KOM3CeV7y52S4noAByAxx5c1vtneltreh9HU2nI4NG1cFK5/QSy1lS0jfe55BxFx4uPYszd/n3oesvjU1Rmj3Nzd45zlCyrXjs8jClbozarqTXNhuuqrtptlmtVdHVigt8kwBcw5DsOZ4zvO7A44xkrMbWOed1rST2BRfSnl6GTf3d7qxlQ4JT2mrnE6sotUVFkq6LT1Ja3z1dNLAZa+rfC2IubgOAZG8v5nhlvIcePDCWyPYbtG2f64pdSx1Wlq9sLHxyU5rp499r2kcHdAcEcDyPJejPZA+9f8AOU9kD70PWVOaFZQWyjRPFVyxwyzQxsmMY6VkUhe1rusBxAJHlwM9gWJbnpzabUbUqHVdRBph9Db4JIKS3uuE4LRIMOk3+gPjnA6sYGPKsu+yB96HrLbVU3TSh+7u4GMZQ49tK7RohguHQNkFNEKkM3ujdKRHv45b+7nGeGd3PXjqXnbaV3P2utW68umpqObS1rZXSiUU7a6d5a4NALt7oBxcQXHhzK9KeyB96HrJ7IH3oeshnSqql6JwmmKfWMekYaTVDLVUXemY1nTUdVI5lSQ3G87ejaWEnGcB3WfIsFbZNj20HXurxe5ZNN25jKZlPFCa2eQhrS45LuhHElx6vrXo/wBkT70PWW1q5+neHbu7gY5oYqtsy2o8TqWyyzaqs+lbdY75S2tzaCmZTx1NHVySdIG4Ay18bd3h5Ty+TntolFqa5aWrbNpyntLpa6jlpnz11ZJEId9u7vBrIn7/AAJ5lvVzXJ01YYYhH0e9jryvp7In3oeshIzintHnbZPsP2jaB1fHqCOp0vXtEMkMkHf08Zc1w6ndAcEEA8lkTbDs98PdGChrIoaS7QjpaSfeLmRS48Zm9gEsPInHUDjIwsi+yJ96HrL4VdWahgbubuDnnlDKpX2pKd9UYM2I7N9pugK+eMVen7jaKog1FKKuZpY/kJGEw4DscCOvh2Ai7atkO0PaPeqGuD9MW2CipzDHE6vnkc7Li4uJ6AAcwMeTms40lT3uHDc3t7HXhff2RPvQ9ZCxxFpbb4nTdjtg1no/Q9Lpm701hqe8IpBT1FNcJfshLnOa1zXQjdGXYLgTw/BK4C0ad2mUG0O76kqqLTUtFcYYYDTR3CcOibFvbpD+g8Y+M/PAc+rCyibifeR6y0vuBcwt6LGRj3SGMqsZX7zHO13QFJr6222lnkbFJRVzJukOcmEkCVgI5Et5eVoXd56u6U1sZTWSht01QwBkTKuqdTxNaBw4sjeeHDhgcOtCopc4Y1JKy5I876Z7n7aRZNbUOqRcdK1E9LWirdEaqoDZDvZLc9DwzxC9Dm3VlVbnRXWhowZmOZNTxTGePdOQW7zmM3gR2tC3UFZNEMZ329jl9xcm/hREeYqnNUrKr6Rgyl2Maj0brQ6m2cVtK2GQObPbLi5zWOjJyWB7QSRkAjIyMDiV2zVMG1nUenZtPW6yWTTTathiqa+S6moeGOGHdG1sQwSOGT29R4rJBuMfVG4+cr4S18rhhgDB8pQb9Xu9WdH2RbLrDswt8skEpuN6qWBs9ZIwNO7z3GD8FmRnmSTzPAAcZtUs+u9RvoYLCLDSw0dwhrhPV1cpfK6I7zWljYsNG9z8Y5wOSyASXEkkknrK0qXOKVeUpbTNtZBdqikBudHSwVQPjMpah0zMdu85jDzzwx6VxG07ZxQ6/wBI1Frrmtp66P7JQVRGXQyY6/8AKeAI9PMBdno6jvd7nbm9kY54W59kz7yPW/8ABCU5KL2uZx+kqC62PZ1ZLW2mpZrnQWympnxSVBjiMjI2tcN9rXEDgeIacrzttB2C7R9T61uepJarTcD66czCOOrneIxwAbkwjOABxwF6Y9lD7yPW/wDBQ3Q+8j1kuc8cSou6Z16xvvL6QezlJQU9UAARR1L5mOOOJ8ZjCOPVx86x1q/YlWS6xh1noWvisd6inFQYp2nvd8nWfFBLd7k4YIOTy45yqTkk9q5A3M+8j1v/AARHBSqbEm07HTaq67XprWaSn0jp6luLmbvfz7u58DXfjCLo97y4J+VdY2a7EI9M3Z+qdQXAX7UU0j5XSbuIonuOXPbni5xJPjHHPgOtZZ9kz7yPWUNzPvI9b/wVucrrrZcVpc2MkckZAkYW55ZW3ulPfBRk2ehpJ6onDW1dQ6GMDtLmseezhj0re1lT3y5p3N3dGOeVuBcyAB0I4f5lDWWxfU6hsgsWu9M0E1r1KzT9VTy1k9X3zRVcvSMMri9zejdEAfHJ47wwD1446NTbM6K6bWrbr0GPfpKN0ckJHGSYYET+zg1z/S1nlx3L2UPvI9ZPZQ+8j1v/AAS5sOum278ToO1mw6rv2la6w2altkcdbEI5KmsqpGGPxuIDGxuzwHPeHPlw4412P7LddbP9SzXXpNO18VRTGnki79mjIBc1wcD0J4jd5Y616Cq68zwmPot3J572VslLnEq7hFwjwZ0PWNg2i6k1JY5LcdNxWmzV7LgKWorZt6qkYRguLYSG444AzxOTngBli3PrZKGN9xp6enqiD0kdPOZo2nPDD3MYTwx+CFw1PKYZmyN6j8q7AxzXxh7TkEZCqM4VNqKj0PPe2/Y3rPaHq+O+UbdNWwMpW07g6ume6Xdc4h7sQAA4cBjjy5rJWxmyaz0zpWm07quW0VcdDH0dLVUdTI95YD4rHNfG0eKOAIPIAY613pFkbEqrcdl8DAG3/Z3rbX91oWw+D9vpaLpXR79bM98hfu5JxCAPcDhx5niuX2MaZ1VozT0enruyzVFLHLJI2opquUvaHcd3cdEAePXvDgeXDjli9Rb0TZRzacHzFcSsGalWtLZ3fI2d3fco6TetVLSVNRn3FTUOhZjB47zWPPPHDHpXnih2I7QaPVkOpIrlpo1cVcK0NdPPuF4fv4P2LOMr0kVEuYUq8qSajzOjV7trctMWUdPoqmlLcdI+pqZMHtA6Mftytrsq0nqnTUd/uOo6+hut6ukzZekjmfuO3GkNa5xYN0ZJHBpAHIdSyGoUJvXsuKS1PP20vZBrrWmrqm/yVGnaMStYxkIq5n7jWtA910Iz28hzWYtJ0d5j07FadSUdsPRUzKdxpqh8zJwG7ri5r427uR1eNzK55EuWpXlOKi+R54rdhWqrVrR150ZebXSU8NR01F3xLIJYuvdIDHAgcRz4jnzWTda23XGodEVNibR6ep6utg6Kon9kJixnHxi1vQ5OR2nhnrxx70oeaXEsTObTlq0YM2R7LtcaC1NLdul09XxTUzqeSLvyaM4Lmu3gehPEFo6usrt20ew671Hc7U22+wEFrt9ZFWPhnq5S6qewhwa7EWA0HPDjngfIMirSlxLEylPbaVzb259a+kY6409PT1JzvxwTmVg8zixpPqhYe2ybLtVa91HT3GjbYaHoYOg3n1krnyjeJaTiHAxnlx86zSt3aoelq2k+5Z4x/khhRqypzvHidW2Q2HX+kNHDT16FguQo2kUEsVfM04LgRG/MPADLsOGeoY6xifaDsH2hav1nc9STV2mKV1dLviFtXO4MaGhrRnoRngBxwPMF6eUVN+NaUZOS4s6FTP2wRUUcUlFoaWdrA0y9/VQDiBz3ei/muu6T0btAp9qE2u9c3ayVTY6CSmpaegkl3YS4tw1rXsGG+6yck5PWsvrh73Ub8ggaeDeLvOhxTrOEXZcTjSSTk8SVCqoVDrmRERYshCiFFQERFCM0oiKoBRVRQhFFVFWAiIoCFRUqITmEREDIUQogIeaip5qICIiIAiIhiQ8lFTyUQA8lpWo8lpQjBUVKiECIijBDzUVPNRARERUhFFVFEAiIjBCoqVFCBcfdvthZP1k3+FIuQWwuQzdLIP8A+wB+SKVdfmztgK7/APJL+1m9lavjaX5l7zta4i908EtSx0sEUhDMZcwHrK5dcZdv7dv5P818h7Cfe8fCXuPovav7ul4r3mwZFEz3EbG+ZoC1otvDdrbTXvvCvqYKcinEzTM8Na7LiMAnrG6flC+x5hjFg8POu4uWyuC4s+a4PCyxdeNFO1+b4G7ZFI8ZbG4jyBHxSsGXRuA7SFLy51fDBLbLzLAzDsPpXRua45xxyDnGDyI618tG3Gvqu/7ddJY56qhlawzMaG9Ixzd5pIHAHHPC8lW7SZlRwMcxlQju29Vd7S1trpbj7z0VLIcFUxMsHGs94udlZ6X6mtfWiY+WuYzo8xNaXSOI4dgA8pPH/Se0L5XyKpYydlAYmTlv2IyA7oJ7cL6aXuVbXSV1NXQU0UtJIxn2AktIcwO6/OubtJnNeOTrE4SPm1EvOvZxUrcuuttOHE4sjyulLMXRxD1g3pbjb4e8117WsqXNaABw4DzL4K3etv0Ne+Ohgtj4ABumZ7w/lxzgYXH3m8Xe3ie4d5W6enZGwkGR7ZAeTseKQRxHYubJsfmTwFNvDbSUFZ7avLhya0utdX6zjzLAYJ4yajXs3J3Wy9OPfr0OREchbvBjt0deOCMY9+dxjnY54C5er3RTSF7i1uOJAJPyDmuHt+pbO+vbbMz0kzhmIVMLohL+SXYyuno9tsViMJOtRwzlJPldpLq3bj3LxOxqdlKNLERpzrWTXOybfcuhs7zbo7lQvpJnSRcQ5r2HDmOByCPKtxQMusVDuV9dJW8h0hhEYx6Ov0rb3O53S33SSbvWgnoX1EUTHdI4StDnNYSRgg8T2jguxXD+5v8AR9IW1mGdtY3CUq+Fi3NxtJtO21a9la6s3ztw4HDhMqfkmInSxDtFSulzte1339xxC1COQtLgxxaOvHBcXeLjc7VHNX09LQ1NJDBvubLI5sgcCc4wCCMY7OtdrqnFtLI5rA8hpIaXYB8mepb2f9o6+VYinSjR2lN2TuteF7L9ebRqZRkVLH0Z1XVtsrVW4cbXf6crnEMY95wxrneYI9jmHD2lp8oXH12pLnaWipr7TS94BwEj6aoc50QJxvEFgzz6l2apDJKZz9wSAN3mjOM8O1aWN7VY3L8VCGLwuzCfC0k37NL6rT2mzh+zmGxeHlPD19qUeOll8/19hxLGPecMaXHyBHsew4e1zfOFsLhqC72uF1VJZqSSij4yCnqnOkY3rdgsAOF2TeirKFssZD45WB7HdoIyCrju1ONy7E01i8NsU5u19pN+y60vw9pMN2ew2LoSlh6+1OPdZe3X9fYcQqAScAZK0SvbGzed2gADmSTgAeUkgelcxFGylpy9wG8BlxHb2Luc9z6nlShBR26k3aMVz8X+7nV5Tk88wcpOWzCPFnG9BNjPRP8AVWggg4IIPlXG3k39m/XWy6yumZ4wpJY2GKQfiDABHnyfP1rnbRV09+sdNcY27onj3h1ljuRHoIIXX4zP8blMqcswpR3c3a8G3svvTWv6dGb2HyXC5hCfkVR7UeUklfwtwNmtbI5H+4Y53mC2le+6U07HUMFFM1gd0rKh7mnPDd3SAfLz8i5mxVhuNlo68xiM1EDZCwHIbkZwsu0faStlMITp0tqMuEr6deC14c9EY5LkVPMHJTqbLjxVtfXwOPa1zjhoJPYAtT45GDL2OaPKFs6q7XyljdJS2WhljaM9Eyrd0jvNlgGfSuas1wprzZ6e4QA9DUMyGu5jqIPmIIWpmvafMMsnGpXwuzSbtfaTfsuk7cvabOA7PYTGwlGliLzXRO3t1a7/AGHHLj7dbK2iuc89tuM8VNUyGWam6IPBeebmk+5z2cVu7h35G094tpnzMkHizlwYWg8RkAkHC3mlLnLdKGeSenip5IKmSnc2Jxc0lhxkEgfQt3tRmqwmCVR0FVhK3FqyfLTVv96mt2fy+VfEOMazpyXTj368EfKQvMhMmd7PHK+mlQZKeqrHDBmqXtbxz4kZ3BjyEtLv9RStIFVITyB4pohu7pG1ZOS6mY4ntJGT9K6Ttpi28loKKspuLsuFtm9vC9vUdp2XwyWY1m3dxurvx4nMriLi7eqneTAXLrhqw5qpPyl0f0eU1LMKk3yg/a0dl2zm1g4R6y+DPiiIvsR81CIiAIiID4aAzFS3OhIDRTXCURtHIMdh7f3l2ZdZ0g4+z2oW9QmgP/0W/UuzL4B2qpqnnFdLrf1pP4n2TI5upl9KT6HFXJm7Ukj8IZW1W+u48aM+QrYr7B2Wryr5RQnLpb1Nr4HzLP6SpZjViut/Wr/EIiLvzqAiIgPQzlFXKLaPashUVKiECh5qqHmgCIiA6PtA+2sH5gfvFdcXY9oH21g/MD94rri/OPa375xH5vgj2uXfZYeAXQ7jp7UjNY1Nfa5mR0lXcqSsmkbVujPRxsZHLE5gGH5awEZOOJ5Hn3xF0+Fxc8M5OKTura+KfwNqpTU0rnRqfTN3bqaLfbTC2QXuW8NqBKekcXwPjEW5jgQ6RxznG6B28NrpDSN3tmsn3SeKCKAVNxe+Xvt8pmjqJzJG1sZG7FjgXFpGSOOeYyGi2nm9dxcdNVb368eOr7ui0Rx+Twvf9/vQxjJoy8xWnSMJo46x9ppaiGpjiuclId5+5ulsjBkjxTkLfaq0dcbrqKqvUJa2UQW7vaM1L+jc+CokkkEjPcvG64bpcDg8RunisgIs/rrE7SkrXV+vOW09L24+taMnk0LW/fCxjbUuhrvXawN9opKZm9eqKeQOecyUkYp3PHL3QfTtI8meWVyE2mbu7U0ga2m9jJb5HeDUGU9I3dgbH0W5jiS9gOc43Sesce8osfrjEbEYO1lHZWnLT26DyaF2+rucRrKjuFw0tcrfa3sjrKqndBG97sBm+N0u84BJHlC6izRl7orHc7bT1FNVtF0o7lQ7/wBiDjE6Fz4yGghueh4HjxdkrIqLhw2Y1cNDYha178Oaafw9rM50Yzd2dFk0zd6jQV6tsraaK4XStmqxEJS5kQfMHBpdjiQ0DJxzW511YrxXXB9ZaIqWZ1Raam2SNnmMYj6UsLZODTkDdORwJyMLuKLKOZ1o1Nuy4t25apL4KxHQi1b96GL9oez663mlqG2menbURWWKhpJJXEZcOlZIHYBwHRSuHnx2LltW6Yu9fdLiKFtM6kvFJR01RJJKWupugle4uDcHey2QgDIwR2HK70i5VnWJSgnZ7PDT8r9jin436mPk0Lt9f9/mY01hoO63jVtRdKeWmZBUSxMlDnHL4GsY8t5dcsMXDsJX2uWk782zUNPQx0c07tNuslSJZixsTnNYBKPFO80EOyOBPBZFRWOd4lRhHS0OCt3W1/fIPCwu31NvS04p7fFSMcXCKIRgnrwMZWK9H7N73aK+yzVMtI6G3OpHsja8noyKYx1OOHHekbG4elZcRcGFzOvhYVIU/wCfj7fmzKpQhNpvkdDsmmb1S6tgmqI6UW+kuNfXRztmJfL3ySWs3N3gW77snPUMc+Gy0Xoe7WPVlvucklN3m2kqBUxteSRUPe3Dxw4gxsjB7NwLJKLllnOIcZR0tJWen5vjJv8A2MVhoXT6f7fIx3Q6Z1JaLTpea3xUNRcbVap6CWKWYtZvSiIh4dunIa6IZGASCVv77pq718l8kMlNJJX6ZFsa7JaHVH2bJx1N+yBd1RYyzau5bdlfXW3WW17yrDxSt++Fjo9w0XIzT1Na7RKYJqmtpp7lVTzOnkc2HDhgvJ3hvRsaG8Bgn07Oh03qW0UenWQQUlxfZayr3Q6o6HpIJA9sR9yQCGuaCMdSyIisc3xGzsStJNtu/O6cePHg7cegeHhe60/d/eaIHSOgjdNGI5C0F7A7eDTjiM9fnWtEXVs5z7277YU/51v0hZDPNY8t32wp/wA636QshnmvsH0ZfZ8R4r3M8v2g9OHgyKKqL6cedCiqiAiIiAKFVQoCIiIRgqKlRAQqKlRCMIiIQiIiALStS0oAtK1LShGERFGAVFSogChVUKvIxZEREBDzRDzRQGlERAEPJEPJDE0oUQoCIiICFRUqIRhERAQ80Q80QGlERAFpWpaUIgiIhAVFSogChVUKBkUKqhQnIIiIAtK1LSoAiIjIwtK1LSoQiIiyBCoqVFEQIiIyEKIUUAWk81qWk80DCiqiqIRERQBRVRAQ8lFTyUQBCiFCEREQMKFVQoQiIiAi0rUtKECIiALStS0oAiIhGCoqVFCEKipUVYChVUKEIiIhAoqoogFDyVUPJGCIUQoQiIiAKFVQogRERGRkPNRU81EIRERAFyFpqd09A88D7nz9i49OXEIZRlsu52NFs7dViZvRvP2QftW8WRtppq6NMrGyRuY7k4YK67NG6KV0bubThdkWwu1N0jOmYPGbzHaFGcVWN1c4cqKlRQ1goVVCgIiIhGFDzVUPNCBaVqWlAFztqg6GmBcPHfxP8lx9qpTPN0jx9jYflPYubRHPSh/MFFV8p5WQxmSQ4A/aqc586+pFNAXfhng0eVdfeS4kk5JOSV9aqd9RKZH+gdgXxKlzTqT2mRQqqFDjZERFiyEKIUVAREUIzSiIqgFFVFCEUVUVYCIigIVFSohOYREQMhRCiAh5qKnmogIiIgCIiGJDyUVPJRADyWlajyWlCMFRUqIQIiKMEPNRU81EBERFSEUVUUQCIiMEKipUUIFsqob1+sjP/enu+SCT61vVqprfJLeKateC2OnikDQfwnuwAfQA71l0XaTGUsLllZ1JWcotLvbVtPWdvkOHnXx9PZV0mm+5I5pcbdv7Vn5K5JbS4wOlYHMGXN6u0L5F2QxdLCZtTnVdou6u+9ae0+ido8NUxGXzjTV2rO3gzi1W0jatwY6KN+OPjtBAQgg4PArRpOqE1feYXu+zQ1LGhp5tjMbS30E759JX17tHmdXLcvniaKvJWS6K7tc+d5Jl8MdjI0ajstW+unI3FRHSW+MM6KWZ+CWwwtAz6Tho9JGV89NVsNVcrnEy2to5ojF0jt8OdJlpIzgdQ4cyt7X08r599jd4EfItnp+gmpLxdaiZ0WKjoS1gdlwDWkZI6snOPMV4HNK9DE5Hv62JdStKz2dqyTurrYVloubXf0PX5dTqUM0dGnQUKavrbV6aec+vcfe5/wB6/wBIWx0n9ub9+kQ/wWLf3MHvnODjdC43ST2m/agjBG82aBxHkMLfqK7PNNeyNO3SHvRoZdp2hqX6yOQuP97d5h9C4DV/3NVv5A+kLslfTyvn32N3gR1LgNXQTOsFZC2J7pCwANaMk8QvTdnsfhqmW0YRqJtQV1dXVkk7o6LNcJXp5hUlKDs5uztpq7rU7XV/3aT8krgpYYZXMdLFHIYzvMLmg7p7R2LnaoE00gAyd0rhiCOYwvO/R1JeR1VfXa+CO37aJ+U03/5ficbqL+4RfplN/HYu0XD+5v8AR9IXWb7HJLRRNjY57u+6c4aM8pmErs9eCaR4AyeH0qdq5RWc4DXhJf3I5ez8X9U4rwf9rOp6u+5i5fo7/oXbqn+6yfkldT1THJLp24Rxxue90DgGtGSTjlhdsqQTTSADJ3Sp24lHyvA6/wAz98CdlYvyTFacvhI6tqQA6cuefgcv7hXYqPjZ4T/7u391df1Cx7rBcmNa5zjSSgADJJ3CuxUjXNtMTHNIcIACCOIO6r28lHbwmv8AM/8A2jsinusR4fM4O4MbJQVEbxlronNI7QQVyOlCTpO0k8+8Yf4YWxq2nvWYYOdx3D0LkNLsfHpa1xyMcx7aKFrmuGCCGDIIU+kKS3FDX+Z+4djE9ut4I4eqePZmzQuJDZKwl3Yd2KRwHrAH0LsVx/uj/R9K6nqqKrbRQ11HG59RQVDKpsYHGQNyHN9LSV2W311Je7QyroZRJFK3IPW09h7CFx9roOhm2Ex8v8tOKb5K0r+56eBydnmq2WYjCx9NqWnirGwU0G3o7PUwtaGsjr6ljAOQaJXLW6ORri0sdkdQGSt3ZKb2NtDI58Nkc58soBzh73F5A7cE49C2u3eJp1sFSw9J7U5yTSWras9dPFI1uyNGdLEVKtRWjFWbenM+FzwKiXHZ/JXRf3IWn9Dj/dC+VQ4yue/HF2eC++j2Pj0pao5GOY9tJGC1wwQd0Lre2dGWHynCUJvzo2T/AEjZm/2YqKtjsTVjwk21+rubZXQjQzT/AEbRhraupDR2DpnoQQcEEFfTRcb47I5sjHMJq6ggOGOBmeQV230gyi8rhZ/zr+2R13Y2LWMnf8PxRKj+3k/KP0ra7Pv7jc/1rU/vLdVIIqJMg8XH6V8NBRyR0Fx6SNzN651Dm7wxkb/MeRcXbCcXkNOz5w9zM+zMWs1qXX4vebmsANVIDyzxXw2eTdNoy3ZBDo4zE4HmCxxaR+xbitBFTISDzXGaJmNLdrxZpDyn78gJGMsk4kDyB2R6Vx9qMM8R2do1Ia7Cg/02be9o5ez9dUs3rU5fzOXvudrXDVoxVSedcyuLujcVO9+M1ed+j+soZlKD/mi/Y0/dc7XtjSc8DGS5SXuaNoiIvsx8yCIiAIiIDRpNn/rO+y44Oqo2/JBH9a7EuF0fGRbJalx3jVVUswPa3e3WH1WtXNL899pa6r5rXmvxNerT4H2fJ6TpYGlF9F7dTjbsfsrG9gytkvtWSdJUPcOWcBfFfbOz2ElhMso0ZcVHXxer958qznELE46rUjwb92nwCIi7g60IiID0M5RVyi2j2rIVFSohAoeaqh5oAiIgOGvtgjutUyd9S6IsZuYDc9ZP81xvgdB8Ok9QfWu1rSvP4rsrlOLrSr1qKcpcXeXwZuU8wxFOKjGWi8Dq3gdB8Ok9QfWngdB8Ok9QfWu0otf+C8j/AKC9cvmZfWmL/H7vkdW8D4Ph0nqD61Do+H4dJ6g+tdpUPJT+C8k/oL1y+Y+tMX+P3fI6v4Hw/DZPUH1p4Hw/DZPUH1rs6J/BeSf0F65fMfWmL/H7F8jrHgfD8Nk9QfWodIQ/DZPUH1rtChV/gvI/6C9cvmT60xf4/YvkdY8EIfhsnqD608EIfhsnqD612ZE/gvI/6C9cvmPrTF/j9i+R1jwRh+GyeoPrTwRh+GyeoPrXZjzRT+C8k/oL1y+Y+tMX+P2L5HWPBKH4bJ6gTwSh+GSeoF2VE/gzJP6C9cvmR5pi/wAfsXyOteCUPwyT1AnglD8Mk9QLsqJ/BeSf0F65fMfWuL/H7F8jrPgnD8Mk9QfWngnD8Mk9QLsqh5K/wXkf9BeuXzJ9a4v8fsXyOteCkPwyT1Ah0pD8Mk9QLsihU/gzJP6C9cvmT61xf4/Yvkdc8FYfhknqBPBWH4ZJ6gXYkT+DMk/oL1y+Y+tcX+P2L5HXPBWH4Y/1B9aHSsPwx/qBdjQp/BmSf0F65fMfWuL/AB+xfI654LQ/DH+oE8Fofhj/AFAuxIn8GZJ/QXrl8x9a4v8AH7F8jgKfTUUM8coq3kscHY3BxwVzx5qqHmu1y3KMHlkZRwkNlS46t+9s1a+Kq4hp1HexFFVF2RrhRVRARERAFCqoUBEREIwVFSogIVFSohGEREIRERAFpWpaUAWlalpQjCIijAKipUQBQqqFXkYsiIiAh5oh5ooDSiIgCHkiHkhiaUKIUBEREBCoqVEIwiIgIeaIeaIDSiIgC0rUtKEQREQgKipUQBQqqFAyKFVQoTkEREAWlalpUARERkYWlalpUIRERZAhUVKiiIEREZCFEKKALSea1LSeaBhRVRVEIiIoAoqogIeSip5KIAhRChCIiIGFCqoUIRERARaVqWlCBERAFpWpaUAREQjBUVKihCFRUqKsBQqqFCEREQgUVUUQCh5KqHkjBEKIUIRERAFCqoUQIiIjIyHmoqeaiEIiIgCIiAjXFrg5pII5ELmKGtbMAyQhsn7HLhkKXMozcTsqhXFUdxczDJ8ub1O6wuUY9kjA5jg4HrCqNmM1LgcVcqItzLC3LebmjqXHLsy2VZb2Skviwx/Z1FGjinS5o4ZQr7TwSwnEjCPL1L4lQ4GrEREQjCh5qqtY5791jS4nqAQhpX3oqR9TJwyGA+M5buktjiQ6oOB+KDxXKMa1jQ1jQ1o5AJY5oUm9WSKNkUYjYMNHJValsKy4RwgtjxI/9gVOdtRWpuKmeOnjL5HY7B1lcDWVMlTJvO4NHuW9i0TyyTPL5HFx+haFi2atSo5aBQqqFEcRFCqoVQyIiLFkIUQoqAiIoRmlERVAKKqKEIoqoqwERFAQqKlRCcwiIgZCiFEBDzUVPNRARERAEREMSHkoqeSiAHktK1HktKEYKipUQgREUYIeaip5qICIiKkIoqoogEREYIVFSooQ2csV36Vzqe7MgYT4rRSNdgecnJWkt1B/iD/obFvkK66tk+ArzdSrRjJvm0mzfpZrjKMVCnUaS5I2O7qD/EH/AENihGoPj/8A6Gxb5QriWQZX/wBPD/Svkcn11mH9aXrPjSvubXDvutgqm9eaUNcfSDj9i2FfaZH3Jt0ttdJb68N3HyNYHtlb2Paefn+oY5RFt08vwtKm6UKaUXxVlZ/oa08fiZVFVc3tLmfKF93c3drLo2QdkFOIs+ckuPyYWydbqqG6T19tuJo31EbWTDoWyb5aThxz18VySLhp5PgKVOVKFGKjLirLXnr1OSebY2c1UlVd1w14Hzo33NjZG1tx77a4DA6BrN35Fx9dapHXH2TttfLb60tDHvY0PZI0dT2HmuURctLLsJSpSowpRUJcVZWfiuBxTzDFTqqtKo3JcHfU20QvLmbtVe5HfmKdkeflDj8hClTHdTVmaju76dpY1pY6FsgJBPHJ8/7FukXDDJsvhBwjQik+PmrXnrocss2xspqbqu64a8DZY1B/iD/oca3rX1DoY21M3TyNbgv3A3e8uAiLLD5TgcNPeUaMYy6pJMxr5ni8RDYq1G10bNlJDdm1U0tHeXU8UhBERp2vDcADgT28/SmNQf4g/wChxreopWyfAV5upVoxlJ8W4psypZtjaMFCnVaS5Jm2rW3SSuNTR3Z1KHRhro+ga8Egnjx6+IHoXzxqD/EH/Q41vUWNTJcuqNOdCLsktYrglZLhyWhYZvjqatGq1+vXifC4tuE9TFUUdydRvaHBwETXh+cYyD2Y/avjjUH+IP8Aoca3qLKrk+ArW3lGLskleK0S4LwRjTzXG0k1Cq1d3483xZt69txnfBLT3J1NNH7pwia4P4Y4g8F8sag/xB/0ONb1Eq5PgKuzvKMXZWV4rRLku4U81xtK+xVau7vXi+oY+odDG2pn6eVowZNwN3vQFxD7J0FXJW2auntVRJxeIgHRPPa6M8CfNhcui2Vg8OqO4UFsfhsrergcHllfe77be11vqbaF+oAWia9U729ZZQhrj6S4j9i3Dd/H2SaSZ/W954n0DAHoACqLXw2UYHCT26FGMX1SV/Wc2IzPF4mOxVqNrpc2tbDXPmhlobi6jdGHBwETXh+ccwezB+VaMag/xB/0ONb1FlicrwWKnt16UZPhdpNkw+ZYvDw2KVRxXRM+Na2uqKWJrbg6KpZuHp2xjiQcnxeXHsXwxqD/ABB/0ONb1FhUyjAVIxjOjFqOivFaLuMqea4ym5SjVab1evE2szLtLRNifd3d8NlEjZ2wNGAPwd3kQtGNQf4g/wChxreosZZLl0oqLoQsuHmrT2GUc3x0W5Kq7vjqaKV9wELo66u77JdkHoWsx5OC4fUYmt9XSajpI3PkoSW1LG85Kc+6Ho5js4lc2hAIwRkFc8cuwsKEsNCmlCV7pKy148Di+sMQ68cRKbclzfcczRVMFZSRVdNIJIZWh7HDrBXyucW/CHjmz6F0yhqpNHVhjk35NPzvyCAXGieT+4T/APmfdd6hkiqIGyxPZLFI3LXNOQ4HrBXxfGYHE9mMzhVteKd4vqua8baP5H1CjiKGeYGUL6tWa6Pr6zhEW4rKcwvyBlh5Hs8i26+1YLG0cdQjXoO8Zfuz71zPleKwtXC1XSqqzQREW0a4XxqzKYeipzieU9HEexx68dYHFx8gK+y5C30hbJ3xKMOAwxvZ2nz/AMvOV0XaHOqeU4SVRvz3pFdX8lxf+52+S5XPMMSo281ayfd82bqkgipaWGmhbuxQsEbB2ADAXzr5uihIB8Z3AL6VE7IW5cePUFxE0jpZC9x4/QvmXZLs7UzLELFV1/hxd9f5n08L8fUe67RZ1DA0XQpP/Eat4Lr8vWaERF9qPlwREQBERAehnKKuUW0e1ZCoqVEIFDzVUPNAEREAWlalpQIIiIQih5KqHkoCIiIRhQqqFUhEREBDzRDzRQGlERQjCIioIoeSqh5KkIoVVCsSEREQBCiFARERAwoeaqh5oYkUVUQBRVRARERAFCqoUBEREIwVFSogIVFSohGEREIRERAFpWpaUAWlalpQjCIijAKipUQBQqqFXkYsiIiAh5oh5ooDSiIgCHkiHkhiaUKIUBEREBCoqVEIwiIgIeaIeaIDSiIgC0rUtKEQREQgKipUQBQqqFAyKFVQoTkEREAWlalpUARERkYWlalpUIRERZAhUVKiiIEREZCFEKKALSea1LSeaBhRVRVEIiIoAoqogIeSip5KIAhRChCIiIGFCqoUIRERARaVqWlCBERAFpWpaUAREQjBUVKihCFRUqKsBQqqFCEREQgUVUUQCh5KqHkjBEKIUIRERAFCqoUQIiIjIyHmoqeaiEIiIgCIiA0oeSIeSAi1wyyQu3o3lpWhEIclBcxymZ6W/Ut7DUQy/wBnI0nszxXXyorc5VVa4nZiARgjIW2loqZ5yYgD5OC4iOpqI/cSuHkJyF9m3OpHPcd5wlzPexfFG7NrpzydIPSPqUFrg63yfKPqXwF1k64mfKr7Kv8AeW/KmhL0zdMt9K3mwu85W5YxjBhjGtHkGFxLrpOeTIx6CvhJXVT+HSkD/KMKDeQXBHOvexgy9zWjtJwtlPc4I8iPMjvJwC4dznOOXOLj2krQlzB1nyN1VV08+QXbrfxWraoijOFtt6kRERkYUKqhREIoVVCqGRERYshCiFFQERFCM0oiKoBRVRQhFFVFWAiIoCFRUqITmEREDIUQogIeaip5qICIiIAiIhiQ8lFTyUQA8lpWo8lpQjBUVKiECIijBDzUVPNRARERUhFFVFEAiIjBCoqVFCBCiFCEUKqhVQIiIjDCIihAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgJIxkjHRyNa9jgQ5rhkEHmCFwlPRXXT8pl09IJ6MnL7dO/DfL0bj7k+Q8PoXOItfFYShjKTo14qUXyf79ps4XF1sJUVSjKzPnbtXWerf3pXF1sq/wqesG5nzE8COziuUkoWPAfBIMHiOsH0riqqmp6qLoaqCKeMnO5IwOHyFcY3TtDAP8A1fNXW5xOc0tU9v7CS39i8nDspWy+o6mV4hwT/lktqP7/AEb7z0c+0OHxsFDH0dprmtH+/YdiNDOOpp9KrKCYnxi1o+VcNHRV8fBuorufynRO+mNam0Ux3hUXe6VDXdTqjo8emMNK2nQ7SSWzvaS70pX9T0NZVMii9rYm+66t8znX9425rZKmojjLjhpkcBk9gHWV8ZLm6TIp4nNb75IME+ZvPt548xXG01JTUxLoYWteRhz+b3DyuPE+lfdatHsbTq1vKMxqutPv0Xq6d2i7jmq9ppU6W5wNNU4+t/v1srnOcSXOLieZKiIvZU6cacVCCslwSPMTnKcnKTu2ERFkYhERAEREB6HIym6ERbR7Ubo8qm4PKiIBuDypuDyoiEG4PKm4PKiIUbg8qnRt7SiIB0be0p0be0oiEJ0be0qdG3tKIgHRN7SnRN7SiIQdE3tKdE3tKIgJ0Le0oYm9pREBOhb2lOhb2lEQE6Bna5OgZ2uRFCDoGdrk6Bna5EVA73Z2uU73Z2uREA73Z2uUNOztciKEsTvdna5O92drkRBYd7s7XJ3sztciILDvaPtd8qd7R9rvlREFh3tH2u+VTvWPtd8qIhLDvWPtd8qd6R/jP+VEQWHekf4z/lTvSP8AGf8AKiILE7zi/Gf8oTvOL8Z/yhEQlh3nF+M/5QoaOL8Z/wAoREFid5xfjP8AlCd5xfjP+UIiCyHecX4z/lCd5RfjP+UIiEsTvKL8Z/yhO8ovxn/KERBYd5RfjP8AlCd5RfjP+UIiEsh3jD+M/wCUfUp3lF+M/wCUIiCyHeUX4z/lCneMP4z/AJR9SIgsh3jD+M/5R9SneEP40nyj6kRQWQ7wh/Gk+UfUneEP40nyj6kRCWQNBD+NJ8o+pTvCH8aT5R9SIgsh3hD+NJ8o+pT2Ph/Gk+UfUiILIex8P40nyj6k9j4fxpPlH1Iiosh7HQ/jSfKPqT2Og/Gk+UfUiKCyJ7HQfjyfKPqT2Ng/Hk+UfUiISyHsbB+PJ8o+pPY2D8eT5R9SIhLInsbB+PJ8o+pPYyD8eT5R9SIgsh7GU/48vyj6lDbIPx5PlH1IiCyJ7GQfjyfKPqT2Mp/x5flH1IiEsh7GU/48vyj6k9jKf8eX5R9SIgsh7F0/48vyj6k9i6f8eX5R9SIgsiexVP8Ajy/KPqT2Kp/x5flH1IiCyHsVT/jy/KPqU9iaf8eX5R9SIhLInsVT/jy/KPqT2Kp/x5flH1IiCyHsVT/jy/KPqT2Jp/x5flH1IiCyHsTT/jy/KPqU9iab8eX5R9SIhLIexFN+PL8o+pPYim/Hm+UfUiIWyHsRTfjzfKPqT2Ipvx5vlH1IiE2UQ2im/Hl+UfUp7EU3483yj6kRQWQ9iKb8eb5R9SexFN+PN8o+pEQlkPYem/Hm+UfUp7D0vvk3yj6kRBsoew1L75N8o+pPYal98m+UfUiINlD2GpffJvlH1KewtL75N8o+pEVJsoewtL75N8o+pPYWl98m+UfUiKMbK6D2FpffJvlH1KGy0vvk3yj6kRBsroPYWl98m+UfUp7CUvvk3yj6kRBsroPYSl98m+UfUp7B0nvk/rD6kRUmyug9g6T3yf1h9SewdJ75P6w+pEUGyug9g6T3yf1h9SewdJ75P6w+pEQbK6ENjpMf2k/rD6lPYOk98n9YfUiITZXQewdJ75P6w+pPYKk98n9YfUiINldB7BUnvk/rD6k9gqT3yf1h9SIg2V0HsFSe+T+sPqU9gaP3yf1h9SIhNldCGw0fvk/rD6k9gqT3yf1h9SIg2V0J7A0fvk/rD6k9gKP3yf1h9SIhNldB7AUfvs/rD6k9gKP32f1h9SIg2V0HsBR++z+sPqU8H6P32o9YfUiINldB4P0fvtR6w+pPB+j99qPWH1IiDZXQeD9F77UesPqTweovfaj1h9SIoTZXQng9Re+1HrD6k8HqL32o9YfUiINldB4PUXvtR6w+pQ6eovfaj1h9SIg2V0J4PUXvtR6w+pPB6i99qPWH1Iio2V0Hg9Re+1HrD6k8HaL32o9YfUiKDZXQeDtF77UesPqTwcovfaj1h9SIhNldCeDlD77Ues36k8HKH32o9Zv1IiE2V0Hg3Q++1PrN+pPBuh99qfWb9SIg2V0Hg3Q++1PrN+pTwboffan1m/UiINldB4NUPvtT6zfqUOm6H32p9Zv1IiDZj0Hg1Q++1PrN+pTwaoffan1m/UiITZj0HgzQe+1PrN+pPBmg99qfWb9SIg2Y9B4M0HvtT6zfqTwZoPfan1m/UiINmPQ0+DNB77U+s36k8GaD36p9Zv1IiDZj0HgxQe/VPrN+pPBig9+qfWb9SIhNmPQngxQe/VPrN+pPBig9+qfWb9SIg2Y9B4MUHv1T6zfqTwXt/v1V6zfqREGzHoTwXt/v1V6zfqTwXt/v1V6zfqREGxHoPBe3+/VXrN+pPBa3+/VXrN+pEQmxHoTwXt/v1V6zfqU8Frf79Ves36kRBsR6DwWt/v1V6zfqTwWt/v1V6zfqRFBsR6DwVt/v1V6zf6U8Fbf79Ves3+lEQbEeg8Fbf79Ves3+lTwVt/v1V6zf6URCbEeg8FLd79Ves3+lPBS3e/VXrN/pRFQ4R6E8E7d79Ves3+lPBO3e/VXrN/pRFLE2I9B4J2736r9Zv9KeCdu9+q/Wb/SiINiPQeCdu9+q/Wb/AEp4J2736r9Zv9KIlhsR6GnwTt3v1X6zf6U8E7d79V+s3+lEQOEeg8E7d79V+s3+lPBK2+/1frt/pREsTYj0Hglbff6v12/0qeCNt9/q/Xb/AEoiDYj0Hgjbff6v12/0p4I233+r9dv9KIlhsR6EOkbb7/V+u3+lTwRtvv8AV+u3+lESxNiPQeCNt9/q/Xb/AEp4I233+r9dv9KIlhsR6DwQtvv9X67f6U8ELb7/AFfrt/pREsNiPQngfbPf6v12/wBKeB9s9/q/Xb/SiJYbEehPA+2e/wBX67f6U8D7Z7/V+u3+lESw2I9B4H2z3+r9dv8ASngfbPf6v12/0oiWJsR6E8D7Z7/V+u3+lPA62e/1nrt/pREsNiPQeB1s9/rPXb/Sp4HWz3+s9dv9KIliOEeg8DbZ7/Weu3+lPA21+/1nrt/pREsTYj0Hgba/f6z12/0p4G2v3+s9dv8ASiKNDYj0J4GWv3+s9dv9KeBlr9/rPXb/AEoiWGxHoPAu1/CKz12/0p4F2v4RWeu3+lEVsNiPQngXa/hFZ67f6VPAu1/CKz12/wBKIpYbEeg8C7X8IrPXb/SngXa/hFZ67f6URLDYj0HgXa/hFZ67f6VPAq1fCK312/0oiWJsR6DwKtXwit9dv9KeBVq+EVvrt/pREsNiPQeBNq+EVvrt/pU8CbV8IrfXb/SiJYbEeg8CbV8IrfXb/SngTavhFb67f6URLE3ceg8CbV8IrfXb/SngTavhFb67f6URLDdx6DwJtXwit9dv9KeBNq+EVvrt/pREsN3HoPAm1fCK312/0p4E2r4RW+u3+lESw3ceg8CbV8IrfXb/AEp4E2r4RW+u3+lESw3ceg8CbV8IrfXb/SngTavhFb67f6URLDdx6DwJtXwit9dv9KeBNq+EVvrt/pREsN3HoPAm1fCK312/0p4E2r4RW+u3+lESw3ceg8CbV8IrfXb/AEp4E2r4RW+u3+lESw3ceg8CbV8IrfXb/SngTavhFb67f6URLDdx6DwJtXwit9dv9KeBNq+EVvrt/pREsN3HoPAm1fCK312/0p4E2r4RW+u3+lESw3ceg8CbV8IrfXb/AEp4E2r4RW+u3+lESw3ceg8CbV8IrfXb/SngTavhFb67f6URLDdx6DwJtXwit9dv9KeBNq+EVvrt/pREsN3HoPAm1fCK312/0p4E2r4RW+u3+lESw3ceg8CbV8IrfXb/AEp4E2r4RW+u3+lESw3ceg8CbV8IrfXb/SngTavhFb67f6URLDdx6DwJtXwit9dv9KeBNq+EVvrt/pREsN3HoPAm1fCK312/0p4E2r4RW+u3+lESw3ceg8CbV8IrfXb/AEp4E2r4RW+u3+lESw3ceg8CbV8IrfXb/SngTavhFb67f6URLDdx6DwJtXwit9dv9KeBNq+EVvrt/pREsN3Hof/Z';
var cultural = 'data:image/jpeg;base64,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';
var lapaz = 'data:image/jpeg;base64,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sizR9ciN0Y5MFhl1jbSDJZES5heTi10danMr5a5iriOfIqS5jABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAiLpZOpTZy7AVM1HwWRP75wifx8bQApS631W1iYzXJSTnjodm6JysGAgzDlXai/OZLMSUOAGJyjgqVU6MYiBGqInnguOTHZJ7aFLZ2Suz+7MKCpubs4BRgOShpx+MYLiSyN/KOPUgCcWGlMd7awfOHJamrvH9jgAn/owKZz+gsTFC06pLM85xM8h4cqfh+zXrK7HX0PFwlUewlgsXvo2mWlBZi7oYUtFpzkBM6I8So2RLajl5qTcZQ/UunyKoP9bG0W/nxFS5YE141AMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMABgAMADQ3m7DjcrdLgMLJSXHYjUDvKMw6jQ++o+DafixmIHOu3NlGC5rNGMBOz6je21poR2W6Um3xU9pOiydP8Ak+JOHADPl2kBWNa62RYAgWNNbnGEbUyJDJpxuy1PY+B7Wb7DCgqKu5zdxLlNZoClaiMAESBh5Hgzrv6jI+r9Lrdh5v8AyfABeXYLY6PYYAj6whmIvXM/ln9bhu3liRX7bvaqXeZiregsrppaS6/DHT7aSf34y+14Ydz9EcgXj2c2dVEjoixx00RlLQoPkpUvTAPzUpTEKwFfGADAAYADAAYADAAYADAAYADAAYADAAYADAAYADAAYADAAYADAAYADAAYADAAYADAAYADABiuMJgUk6RG4Q4Mw7lboMh8HkHVkojykAlLxfrGenJdR0WLVB1a1Fpp2/L+DT0PcxkBCcTZ45LULzHrOACEsmjy0L1D0ftbV+1YXsPGb2v2PJwFHULtbnN3qIahABAcoBhtWG7qDF6R+0NaZV0Lq97LhS125FKZs9CzdrkjsvL6cX3DOEbN7K2CfUyfemsDm+NOPFNY/oy1w2vJZeEZmWephkYM4ADAAYADAAYADAAYADAAYADAAYADAAYADAAYADAAYADAAYADABjABnABjABnAAYADAAYADAB80rhumZPFyqFStK040r1a0L0cMOE2YOXu117hR9o7i60nBhQknFiq0Yp+9knRjrN7tZHZc0qSx0Pyfc+jiap5xuKOBO+yfSUl5PI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';
