app.controller('dagController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout, $routeParams, $location, $http, Data, LogGuardarInfo, $sce, registroLog, FileUploader, $window) {
	$scope.imprimirArchivo = function (fum) {
		console.log("FUM",fum);
		if(fum == null ||fum == ""){
			sweet.show('', "No existe Imagen", 'warning');
		}else{
			$scope.varSpin = true;
			$scope.RegistroFUM={
				registrado:'OK',
				mensaje:''
			};
			var cadena= fum;
			if (cadena.indexOf('?') != -1){
				separador = '?';
				arreglodecadena = cadena.split(separador);
				cadena = arreglodecadena[0];
				console.log('arreglo de la cadena',arreglodecadena[0]);
			}
			var tipoarch=cadena.substr(-4);
			console.log('substring: ',cadena.substr(-4));
			var imagen = cadena.indexOf('.jpeg');
			console.log(imagen);

			if(tipoarch == '.pdf'){
				$scope.archotro = false;
				$scope.archpdf = true;
				$('#visorFum object').attr('data',fum);
				$timeout(function(){$scope.varSpin=false}, 1000);
			}
			else {
				var tipoimg = tipoarch.toUpperCase();
				console.log(tipoimg);
				if(tipoimg == '.JPG' || tipoimg == '.PNG' || tipoimg == '.BMP' || tipoimg == '.GIF') {
					$scope.archotro = true;
					$scope.archpdf = false;
					$scope.archivoP=fum;
					$('#imgSalida').attr("src",fum);
				}
				else{ document.location = fum;}
			}
		}
	};
	$scope.PosIdBusq = -1;
	$scope.FindItem = [];
	$scope.sw = 0;
	$scope.checkDescripcion=false;
	$scope.BusquedaRecursiva = function(rama){
		//console.log(rama);
		for(var j=0; j<rama.length; j++){
			if (rama[j].children.length>0){
				$scope.BusquedaRecursiva(rama[j].children);
				if ($scope.sw==1){break;}
			}
			if (rama[j].label.search(new RegExp($scope.datos.nombre, "i"))>=0){
				sw=0;
				for(var x=0; x<$scope.FindItem.length; x++){
					if ($scope.FindItem[x].id == rama[j].id){
						sw = 1;
					}
				}
				if (sw == 0){
					//console.log(rama[j].id,' ',rama[j].label,' ',rama[j].children.length);
					$scope.FindItem.push({ id: rama[j].id });
					//console.log($scope.FindItem);
					id=rama[j].id;
					var node = $('#tree1').tree('getNodeById', id);
					$('#tree1').tree('selectNode', node);
					$('#tree1').tree('scrollToNode', node);
					$scope.MostrarInformacion(id);
					$scope.sw=1;
					break;
				}
			}
		}
	}
	$scope.BuscaSiguiente = function(datos){
		if(datos.nombre == 'undefined' || datos.nombre == null){
			datos.nombre = "";
			//console.log("entra");
		};
		// console.log("nombre :",datos.nombre);
		// console.log($scope.jsonArbol,datos.nombre);
		if (datos.nombre != 'undefined' || datos.nombre != "") {
			$scope.BusquedaRecursiva($scope.jsonArbol);
			if ($scope.sw == 0){
				if ($scope.FindItem.length>0){
					alert("No se encontraron mas coincidencias");
				} else {
					alert("No se encontraron coincidencias");
				}
			}
			$scope.sw = 0;
		} else {
			alert("El campo de busqueda esta vacio");
		}
    };
    $scope.BuscaAnterior = function(datos){
    	if (datos.descripcion == 'undefined' || datos.descripcion == null) {
			datos.descripcion = "";
		};
		if(datos.nombre == 'undefined' || datos.nombre == null){
			datos.nombre = "";
		};
    	$scope.FindItem.pop();
    	$scope.FindItem.pop();
    	$scope.BusquedaRecursiva($scope.jsonArbol);
    	$scope.sw = 0;
    }
    $scope.cerear = function(){
    	$scope.FindItem = [];
    }
    $scope.cerear1 = function(){
    	console.log($scope.checkDescripcion);
    }
	$scope.getreportemant=function(grupo, imagen){
		var pic ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAFCAYAAACJmvbYAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAAVSURBVAiZY/z///9/BhyACZcEDSUBO0oEBrFgibAAAAAASUVORK5CYII=";
		console.log(grupo, imagen);
		if(imagen == null ||imagen == ""){
			$scope.getreportemant2(pic,grupo);
		}
		else{
			var img4 = new Image();
			img4.crossOrigin = 'Anonymous';
			img4.src = imagen;
			img4.onload = function(){
				var canvas = document.createElement('CANVAS');
				var ctx = canvas.getContext('2d');
				canvas.height = img4.height;
				canvas.width = img4.width;
				ctx.drawImage(img4, 0, 0);
				pic = canvas.toDataURL("image/jpg",0.2);
				$scope.getreportemant2(pic,grupo);
			}
		}
	};
	$scope.getreportemant2=function(pic,grupo){
		$scope.obtpdf = grupo;
		var columns = [
			{title: "Cod. Catálogo", dataKey: "catid"}, 
			{title: "Nombre", dataKey: "nombre"}, 
			{title: "Descripción", dataKey: "descripcion"}, 
			{title: "Partida", dataKey: "partida"},
			{title: "Observaciones", dataKey: "observacion"}
		];
		var data=[
		{"catid":grupo.catid,"nombre":grupo.nombre,"descripcion":grupo.descripcion,"partida":grupo.partida,"observacion":grupo.observacion}
		];
		var doc = new jsPDF('l', 'pt');
		var columnsLong = columns;
		var header = function (data) {
			doc.setFontSize(14);
			doc.setTextColor(40);
			doc.setFontStyle('normal');
			//   doc.addImage(headerImgservicio, 'JPEG', data.settings.margin.left, 20, 530, 80);
			doc.text("REPORTE DE CATÁLOGO DE BIENES MUEBLES", data.settings.margin.left + 125, 80);
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
			beforePageContent: header,
			afterPageContent: footer,
			pageBreak: 'auto',
			margin: {horizontal: 30, top: 90, bottom: 70},
			styles: {overflow: 'linebreak'},
			columnStyles: {catid: {columnWidth: 'wrap'}}
		};
		doc.autoTable(columnsLong, data, options);
		doc.addImage(pic,'JPEG',290, doc.autoTableEndPosY() +30, 200 , 200);
		if (typeof doc.putTotalPages === 'function') {
			doc.putTotalPages(totalPagesExp);
		}
		doc.save('Catalogo_muebles'+'.pdf');
	};
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////// ARBOL DE CATALOGACION //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // llamada para convertir el arbol en un archivo
    $scope.actualizarArbol=function(){
    	$.blockUI();
		var resRoles = {
			"procedure_name":"dag.sp_dag_catalogo"
		};
		//servicio listar roles 
		var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
		obj.success(function (response) {
			$scope.obtArbol = response;
			var obtArbol=JSON.stringify($scope.obtArbol);
			//console.log(obtArbol);
			var parametros = {
				"NODOS" : obtArbol,
				"TARBOL" : "dataCatalogo.json"
			};
			$.ajax({
				data: parametros,
				//url: 'http://192.168.17.144:88/dreamfactory/dist/generaArbolAjaxDAG.php',
				url: 'http://192.168.5.248/dreamfactory/dist/dag/generaArbolAjaxDAG.php',
				//url: [CONFIG.DSP]+'192.168.17.144:88/dreamfactory/dist/generaArbolAjax.php',
				type: 'POST',
				error: function (response) {
					$.unblockUI();
					//sweet.show('Exito', 'Se realizó la actualización correctamente', 'success');
				}
			});
		})
		obj.error(function(error) {
			$.unblockUI();
			sweet.show('', 'Actualización no realizada, intentelo nuevamente', 'warning');
		});
	}
	// llamada archivo del arbol para cargar en pantalla
	$scope.jsonArbol = "";
	$scope.arbolNodos = function () {
		$.ajax({ 
			data:{ } ,            
			//url: 'http://192.168.17.144:88/dreamfactory/dist/storeArbolAjaxDAG.php',
			url: 'http://192.168.5.248/dreamfactory/dist/dag/storeArbolAjaxDAG.php',
			type: 'post', 
			dataType: "json",
			success: function (response) { 
				$timeout(function () {
					var tempJsonArbol = JSON.stringify(response);
					$scope.jsonArbol = JSON.parse(tempJsonArbol);
					$('#tree1').tree({
						data:  $scope.jsonArbol,
						closedIcon: $('<i class="fa fa-plus-circle"/>'),
						openedIcon: $('<i class="fa fa-minus-circle"/>'),
						autoOpen: 0
					});
				}, 1000);
			}
		});
	}
	// ojo no borrar la funcion q no hace nada
	$scope.alestra = function () {
		//$scope.nodoAr
		$scope.contadorentrada=0;
		$('#tree1').bind(
			'tree.select',
			function(event) {
				if ($scope.contadorentrada==0){
					if (event.node) {
						// node was selected
						var node = event.node;
						//alert(node.name);
						$scope.contadorentrada++;
						$scope.MostrarInformacion(node.id);
						//console.log(node);
						//$scope.datos.UBI_IT = node.name;
						$scope.$apply();					
					}
					else {
						// event.node is null
						// a node was deselected
						// e.previous_node contains the deselected node
					}
				}
			}
		);
	};
	$scope.addNode = function() {
		if ($scope.agregado == "false") {
			var nameNode = $scope.datos.DAG_CAT_PRESUP_ITEM;
			var idNode = parseInt($scope.nodoAr.children.length) + 1;
			var padreNode = parseInt($scope.nodoAr.id);
			//console.log(nameNode, " ", idNode);
			$('#tree1').tree(
				'appendNode', 
				{ 
					name: nameNode, 
					id: idNode,
					padre : padreNode
				}, 
				$scope.nodoAr
			);
			$scope.agregado = "true";
			alert("Item agregado como hijo de: " + padreNode);
		}
		else{
			alert("Solo se puede agregar una vez");
		};
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////// ARBOL  //////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////

	$scope.MostrarInformacion = function (id_item) {
		//console.log(id_item);
  		var datosImpresion = {
			"procedure_name":"dag.sp_dag_cat_desc_item",
			"body":{
				"params": [                                
					{
						"name": "id_item",
						"value": id_item
					}
				]
			}
		};
		DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosImpresion).success(function (response){
			var DetItem = response;
			if (Object.keys(DetItem).length == 1){
				$scope.DAG_CAT_DESC_ITEM = DetItem[0].descripcion;
				if ($scope.DAG_CAT_DESC_ITEM==""){$scope.DAG_CAT_DESC_ITEM ="-----";}				
				$scope.DAG_CAT_PART = DetItem[0].partida;
				$scope.DAG_CAT_ITEM_IMG = DetItem[0].imagen;
				$scope.DAG_CAT_CARACTERISTICAS = DetItem[0].caracteristicas;
				// console.log('|',$scope.DAG_CAT_CARACTERISTICAS,'|');
			}
		})
		.error(function(data){
			sweet.show('', 'Error al cargar la informacion del item: ', 'error');
		});
	};

	$scope.$on('api:ready',function(){
		//alert("DAGG");
		$scope.arbolNodos();
		$scope.datos="";
		//$scope.datos.agregado = "false";
	});
	$scope.inicioDag = function () {
		if(DreamFactory.api[CONFIG.SERVICE]){
			//alert("DAGG");
			$scope.arbolNodos();
			$scope.datos="";
			//$scope.datos.agregado = "false";
		}
	}; 
});