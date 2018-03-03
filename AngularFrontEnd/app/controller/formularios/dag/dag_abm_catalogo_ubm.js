app.controller('dag_abm_catalogo_ubmController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet,$timeout, $routeParams, $location, $http, Data, LogGuardarInfo, $sce, registroLog, FileUploader, $window) {

	// muestra la imagen guardada en el servidor
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
	
	// adicionar nodo en el arbol
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
	/////////////////////////////////// ARBOL  //////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////

	
	$scope.guardarItem = function (){
		var size = Object.keys($scope.item).length;
		if(size > $scope.NItems ){
			//console.log("Ok",size, ' ', $scope.NItems);
			var node = $('#tree1').tree('getSelectedNode');
			var nodo_carac = "";
			for (j=$scope.NItems;j<size;j++){
				//console.log($scope.item[j].caracteristicas1);
				var datosItem = {
					"procedure_name":"dag.sp_dag_insitem",
					"body":{
						"params": [                                
							{
								"name": "pdag_cat_id",
								"value": node.id
							},
							{
								"name": "pdag_cat_nombre",
								"value": node.name
							},
							{
								"name": "pdag_cat_caracteristicas",
								"value": $scope.item[j].caracteristicas1
							}
						]
					}
				};
				DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosItem).success(function (response){
					$scope.impresion = response;
				})
				.error(function(data){
					sweet.show('', 'Error al guardar la informacion: ', 'error');
				});
				
			}
		}
		else
		{
			alert("No existen items nuevos para guardar");
		}
	}


	// Cargo las caracteristicas de la clase seleccionada
	$scope.MostrarInformacion = function (id_item) {
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
				$scope.partida = DetItem[0].partida1;
				$scope.DAG_CAT_PART = DetItem[0].partida;
				$scope.DAG_CAT_ITEM_IMG = DetItem[0].imagen;
				$scope.caracteristicas1 = JSON.parse(DetItem[0].caracteristicas);
				var size = Object.keys($scope.caracteristicas1).length;
                $scope.caracteristicas = [];
                // $scope.caracteristicas.pop();
                
                for(var j=0; j<size; j++){
                    $scope.caracteristicas.push({ 
                        name: $scope.caracteristicas1[j],
                        value: "-----" //$scope.caracteristicas1[j]
                    });
                }
                $scope.MostrarInformacion1(id_item);
			}
		})
		.error(function(data){
			sweet.show('', 'Error al cargar la informacion del item: ', 'error');
		});
	};

	// Lleno la grilla segun la clase escogida
	$scope.partida = "";
	$scope.NItems = 0;
	$scope.MostrarInformacion1 = function (id_item) {
		var datosConsulta = {
			"procedure_name":"dag.sp_dag_cat_items",
			"body":{
				"params": [                                
					{
						"name": "id_item",
						"value": id_item
					}
				]
			}
		};
		DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosConsulta).success(function (response){
			var DetItem = response;
			$scope.NItems = Object.keys(DetItem).length;
			$scope.item = [];
			if ($scope.NItems > 0){
				for(var j=0; j<$scope.NItems; j++){
					var nodo_carac = "";
                    $scope.caracteristicas1 = JSON.parse(DetItem[j].caracteristicas);
                    var size1 = Object.keys($scope.caracteristicas1).length;
                    //console.log($scope.caracteristicas1);
                    var atributos = "";
                    xi=0;
                    for(var aux in $scope.caracteristicas1){
						atributos += aux + " ";
						xi++;
						if ((eval('$scope.caracteristicas1.'+ aux)!= "") && (aux != "PARTIDA")){
							nodo_carac = nodo_carac + ' ' + aux + ': ' + eval('$scope.caracteristicas1.'+ aux) ;
							if (xi<size1-1){
								nodo_carac = nodo_carac + ',';
							}
							//console.log(aux, ' ' , eval('$scope.caracteristicas1.'+ aux));
						}
						if (aux == "PARTIDA"){
							$scope.partida = eval('$scope.caracteristicas1.'+ aux);
							//console.log(aux, ' ' , eval('$scope.caracteristicas1.'+ aux));
						}

					}
					$scope.item.push({ 
                        id: DetItem[j].id,
                        partida: $scope.partida,
                        nombre: DetItem[j].nombre,
                        caracteristicas: nodo_carac,
                        caracteristicas1: $scope.caracteristicas1
                    });
				}
				//console.log($scope.item);
			}
		})
		.error(function(data){
			sweet.show('', 'Error al cargar la informacion del item: ', 'error');
		});
	};

	// Adiciona items 
	$scope.pushItem = function () {
		var size = Object.keys($scope.caracteristicas).length;
		var nodo_carac = Array();
		var nodo_carac1 = Array();
		var node = $('#tree1').tree('getSelectedNode');
		if (node.children.length == 0){
			nodo_carac = "";
			nodo_carac1 = '{"PARTIDA":' + $scope.partida ;
			for(var j=0; j<size; j++){
				//console.log($scope.caracteristicas[j].name,':',$scope.caracteristicas[j].value);
				nodo_carac = nodo_carac + ' ' + $scope.caracteristicas[j].name + ': ' + $scope.caracteristicas[j].value;
				if (j<size-1) {
					nodo_carac = nodo_carac + ', ';
				}
				nodo_carac1 = nodo_carac1 + ',' + JSON.stringify($scope.caracteristicas[j].name) + ':' + JSON.stringify($scope.caracteristicas[j].value);
			}
			nodo_carac1 = nodo_carac1 + '}';
			//console.log(nodo_carac1);
			//console.log(node.children.length);
			$scope.item.push({ 
				id: $scope.item.length + 1,
				partida: $scope.partida,
				nombre: node.name,
				caracteristicas: nodo_carac,
				caracteristicas1: nodo_carac1
			});
			console.log(nodo_carac1);
		}
		else
		{
			alert("No se puede agregar items en nodos que tienen hijos");
		}
		//console.log($scope.item);
	}

	// Eliminar el ultimo item
	$scope.dropItem = function () {
		var size = Object.keys($scope.item).length;
		//console.log($scope.NItems);
		if(size > $scope.NItems ){
			$scope.item.pop();
		}
		else
		{
			alert("No se puede eliminar mas");
			console.log("No se puede eliminar mas");
		}
	}

	// Inicio del formulario
	$scope.$on('api:ready',function(){
		//alert("DAGG");
		$scope.arbolNodos();
		//$scope.datos.agregado = "false";
	});
	$scope.inicioDag = function () {
		if(DreamFactory.api[CONFIG.SERVICE]){
			//alert("DAGG");
			$scope.arbolNodos();
			//$scope.datos.agregado = "false";
		}
	};
});