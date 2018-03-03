app.controller('procesosController', function ($scope, $route,$rootScope, DreamFactory, CONFIG,sessionService,ngTableParams,$filter,sweet) {
     var fecha= new Date();
    var mes=fecha.getMonth()+1;
    if(mes.toString().length==1)
        mes='0'+mes;
    var dia=fecha.getDate();
    if(dia.toString().length==1)
        dia='0'+dia;
    var strfechactual=fecha.getFullYear() + "-" + mes + "-" + dia + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    $scope.panelProcesos=true;
	  $scope.panelWorkspace=true;
    $scope.panelActividades=false;
    $scope.panelReglaNegocioActividad = false;
    $scope.panelReglasFormularios = false;
    $scope.panelImpresiones = false;
    $scope.panelFormularioDinamico = false;
    $scope.panelVerCampos = false;
    $scope.titulo='Procesos';
    $scope.errors = {};
    $scope.objCampos = {};
    $scope.ImagenProceso = '{}';
    $scope.ImagenLinks = '';
    $scope.cargarLibreria = 0;

    /*************************************MAPA DE PROCESOS****************************************/
    $scope.initDiagram = function() {
        if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
        var $ = go.GraphObject.make;  // for conciseness in defining templates
        myDiagram =
          $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
            {
              initialContentAlignment: go.Spot.Center,
              allowDrop: true,  // must be true to accept drops from the Palette
              "LinkDrawn": showLinkLabel,  // this DiagramEvent listener is defined below
              "LinkRelinked": showLinkLabel,
              "animationManager.duration": 800, // slightly longer than default (600ms) animation
              "undoManager.isEnabled": true  // enable undo & redo
            });
        // when the document is modified, add a "*" to the title and enable the "Save" button
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
        // helper definitions for node templates
        function nodeStyle() {
          return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
              // the Node.location is at the center of each node
              locationSpot: go.Spot.Center,
              //isShadowed: true,
              //shadowColor: "#888",
              // handle mouse enter/leave events to show/hide the ports
              mouseEnter: function (e, obj) { showPorts(obj.part, true); },
              mouseLeave: function (e, obj) { showPorts(obj.part, false); }
            }
          ];
        }
        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
        // and where the port is positioned on the node, and the boolean "output" and "input" arguments
        // control whether the user can draw links from or to the port.
        function makePort(name, spot, output, input) {
          // the port is basically just a small circle that has a white stroke when it is made visible
          return $(go.Shape, "Circle",
                   {
                      fill: "transparent",
                      stroke: null,  // this is changed to "white" in the showPorts function
                      desiredSize: new go.Size(12, 12),
                      alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                      portId: name,  // declare this object to be a "port"
                      fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                      fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                      cursor: "pointer"  // show a different cursor to indicate potential link point
                   });
        }
        // define the Node templates for regular nodes
        var lightText = 'whitesmoke';
        myDiagram.nodeTemplateMap.add("",  // the default category
          $(go.Node, "Spot", nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
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
                  wrap: go.TextBlock.WrapFit,
                  maxSize: new go.Size(200, NaN),
                  editable: false
                },
                new go.Binding("text").makeTwoWay())
            ),
            // four named ports, one on each side:
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
            // three named ports, one on each side except the top, all output only:
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
            // three named ports, one on each side except the bottom, all input only:
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
            // no ports, because no links are allowed to connect with a comment
          ));
        // replace the default Link template in the linkTemplateMap
        myDiagram.linkTemplate =
          $(go.Link,  // the whole link panel
            {
              routing: go.Link.AvoidsNodes,
              curve: go.Link.JumpOver,
              corner: 5, toShortLength: 4,
              relinkableFrom: false,
              relinkableTo: false,
              reshapable: false,
              resegmentable: false,
              // mouse-overs subtly highlight links:
              mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
              mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,  // the highlight shape, normally transparent
              { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
            $(go.Shape,  // the link path shape
              { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
            $(go.Shape,  // the arrowhead
              { toArrow: "standard", stroke: null, fill: "gray"}),
            $(go.Panel, "Auto",  // the link label, normally not visible
              { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5},
              new go.Binding("visible", "visible").makeTwoWay(),
              $(go.Shape, "RoundedRectangle",  // the label shape
                { fill: "#F8F8F8", stroke: null }),
              $(go.TextBlock, "Yes",  // the label
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
        // support editing the properties of the selected person in HTML
        if (window.Inspector) myInspector = new Inspector('myInspector', myDiagram,
              {
            properties: {
              'key': { readOnly: true },
              'comments': {}
            }
          });
        // Make link labels visible if coming out of a "conditional" node.
        // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
        function showLinkLabel(e) {
          var label = e.subject.findObject("LABEL");
          if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
        }
        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
        myDiagram.model = go.Model.fromJson($scope.ImagenProceso);  // load an initial diagram from some JSON text
        // initialize the Palette that is on the left side of the page
        myPalette =
          $(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
            {
              "animationManager.duration": 800, // slightly longer than default (600ms) animation
              nodeTemplateMap: myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
              model: new go.GraphLinksModel([  // specify the contents of the Palette
                { category: "Start", text: "" },
                { text: "" },
                { text: "???", figure: "diamond" },
                { category: "End", text: "" },
                { category: "Comment", text: "[ ]" }
              ])
            });
    }
      // Make all ports on a node visible when the mouse is over the node
    function showPorts(node, show) {
        var diagram = node.diagram;
        if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
        node.ports.each(function(port) {
            port.stroke = (show ? "white" : null);
        });
    }
    // Show the diagram's model in JSON format that the user may edit
    $scope.save = function() {
        $scope.ImagenProceso = myDiagram.model.toJson();
        myDiagram.isModified = false;
    }
      // add an SVG rendering of the diagram at the end of this page
    $scope.makeSVG = function() {
        myDiagram.model = go.Model.fromJson($scope.ImagenProceso);
        var svg = myDiagram.makeSvg({
            scale: 1
          });
        obj = document.getElementById("SVGArea");
        obj.appendChild(svg);
        if (obj.children.length > 0) {
          obj.replaceChild(svg, obj.children[0]);
        }
    }

    $scope.regresar = function() {
        $scope.panelProcesos=true;
		$scope.panelWorkspace=true;
        $scope.panelReglaNegocioActividadMapa = false;
        $scope.panelActividadesMapa=false;
    }

    $scope.seleccionaProcesoMapa = function(datos){
        $.blockUI();
        $scope.panelActividadesMapa=true;
        if($scope.cargarLibreria == 0)
        {
          $scope.initDiagram();
          $scope.cargarLibreria = 1;
        }
        $scope.panelWorkspace=false;
        $scope.panelProcesos=false;
        $scope.bifurcaciones = {};
        $scope.nombreActividad = {};
        $scope.idActividad = {};
        $scope.ordenActividad = {};
        $scope.panelReglaNegocioActividadMapa = false;
        $scope.ImagenLinks = "";
        $scope.procesoSeleccionado=datos.procid;
        $scope.ImagenProceso = '{ "linkFromPortIdProperty": "fromPort", "linkToPortIdProperty": "toPort", "nodeDataArray": [ ';
        $scope.ImagenProceso = $scope.ImagenProceso + '{"key":-1 , "category":"Start", "loc":"-360 80", "text":""},';
        var x = -360;
        var a = x+15;
        var b = a+25;
        var y = 80;
        var keya= -1;
        var keyb = -1;
        var bifurcacion = 0;
        var resRoles = {
            "procedure_name":"actividadlst2",
            "body":{"params": [{"name":"procid","value":datos.procid}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            $.unblockUI();
            $scope.procActividad = response;
            $scope.procTitulo = datos.procnombre;
            $scope.procElementos = response.length;
            for(var i = 0; i < $scope.procElementos; i++)
            {
                $scope.bifurcaciones[i] = response[i].tipoactid;
                $scope.nombreActividad[i] = response[i].actnombreorden;
                $scope.idActividad[i] = response[i].actid;
                $scope.ordenActividad[i] = response[i].actorden;
                keyb = response[i].actid;
                if(response[i].tipoactid == 2)
                {
                    x = b + 50;
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
                    x = b + 35;
                    if(bifurcacion == 0)
                      $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keya + ', "to":' + keyb + ', "fromPort":"R", "toPort":"L"},';
                    else
                      bifurcacion = 0;
                    $scope.ImagenProceso = $scope.ImagenProceso + '{"key":' + keyb + ', "loc":"' + x + ' ' + y + '", "text":" ' + response[i].actorden + ' ", "actividad":"' + response[i].actorden + '","titulo":"' + response[i].actnombreorden + '"},';
                }
                a = x+15;
                b = a+25;
                keya =keyb;
            }
            $.blockUI()
            setTimeout(function(){            
              x = b + 40;
              $scope.ImagenLinks = $scope.ImagenLinks + '{"from":' + keyb + ', "to":0, "fromPort":"R", "toPort":"L"}';
              $scope.ImagenProceso = $scope.ImagenProceso + '{"category":"End", "text":"", "key": 0, "loc":"' + x + ' ' + y + '"} ], "linkDataArray": [ ' + $scope.ImagenLinks + ']}';
              $scope.makeSVG();
              $.unblockUI();
            },3000);

        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    }

    /*reglas de negocio actividades*/
    $scope.getReglaNegocioActividadMapa = function(actividad, sel){
        $.blockUI();
        console.log(actividad);
        var resRNactivdad = {
            "procedure_name":"sp_lst_rnactividad",
            "body":{"params": [{"name":"actid","value":actividad}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
        obj.success(function (response) {
            $scope.panelReglaNegocioActividadMapa = true;
            $scope.obtNRactividadMapa = response;
            $scope.tituloRNMapa='Reglas de Negocio de la Actividad: '+ $scope.nombreActividad[sel];
            $.unblockUI();
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    }
    /**********************************FIN MAPA DE PROCESOS****************************************/
	$scope.tablaWorkspace = {};
    $scope.obtWorkspace = "";
    $scope.getWorkspace = function(){
        $.blockUI();
        var resOpcion = {
            function_name: "workspace_lst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
            $scope.obtWorkspace=response;
            var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaWorkspace.reload();
            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error; alert('eeee');
        });
    };
	$scope.tablaWorkspace = new ngTableParams({
        page: 1,
        count: 10,
        filter: {},
        sorting: {}
    }, {
        total: $scope.obtWorkspace.length,
        getData: function($defer, params) {
            var filteredData = params.filter() ?
            $filter('filter')($scope.obtWorkspace, params.filter()) :
            $scope.obtWorkspace;
            var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            $scope.obtWorkspace;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.tablaProcesos = {};
    $scope.obtProcesos = "";
    $scope.getProcesos = function(wsId){
	$scope.wsId=wsId;
        $.blockUI();
        var resOpcion = {
            function_name: "sp_procesos_workspace_lst",
			"body":{"params": [{"name":"ws_id","value":wsId}]}
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
            $scope.obtProcesos=response;
             var data = response;   //grabamos la respuesta para el paginado
            $scope.tablaProcesos.reload();
            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    $scope.tablaProcesos = new ngTableParams({
        page: 1,
        count: 10,
        filter: {},
        sorting: {}
    }, {
        total: $scope.obtProcesos.length,
        getData: function($defer, params) {
            var filteredData = params.filter() ?
            $filter('filter')($scope.obtProcesos, params.filter()) :
            $scope.obtProcesos;
            var orderedData = params.sorting() ?
            $filter('orderBy')(filteredData, params.orderBy()) :
            $scope.obtProcesos;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    $scope.getTipoActividad = function(){
        $.blockUI();
        var resOpcion = {
            function_name: "tipoactividadlst",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
            $scope.obtTiposActividad=response;
			$scope.getHitos();
            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    $scope.getHitos = function(){
        $.blockUI();
        var resOpcion = {
            function_name: "sp_lst_hitos",
			"body":{"params": [{"name":"proceso_id","value":$scope.procesoSeleccionado}]}
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredFuncWithParams(resOpcion).success(function (response){
            $scope.obtHitos=response;
            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    $scope.getNodo = function(datosActividad){
        $.blockUI();
        var resOpcion = {
            "procedure_name":"nodoslst",
            "body":{
                "params": [
                    {
                        "name": "nombre_nodo",
                        "value": datosActividad
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            $scope.obtNodos=response;
            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };

    $scope.buscarNodo = function (datosActividad) {
       console.log("DATOSSSS   ",datosActividad);
        $scope.getNodo(datosActividad);
    };

    $scope.seleccionaProceso = function(datos){
        $.blockUI();
        $scope.panelProcesos = false;
		$scope.panelWorkspace = false;
        $scope.panelFormularios = false;
        $scope.panelReglaNegocioActividad = false;
        $scope.datosProc=datos;
        $scope.panelReglasFormularios = false;
        $scope.panelImpresiones = false;

        $scope.procesoSeleccionado=datos.procid;
        var resRoles = {
            "procedure_name":"actividadlst",
            "body":{"params": [{"name":"procid","value":datos.procid}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            $scope.obtActividades = response;
            $scope.tituloA='Actividades del Proceso: '+datos.procnombre;
            $scope.panelProcesos=false;
			$scope.panelWorkspace = false;
            $scope.panelActividades=true;
            $scope.getTipoActividad();
            $scope.getActividad();
            $.unblockUI();
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    }
    $scope.getFormularios = function(actividad){
        $.blockUI();
        $scope.datosAct=actividad;
        $scope.actividadSeleccionado=actividad.actid;
        var resRoles = {
            "procedure_name":"formularioslst",
            "body":{"params": [{"name":"actiid","value":actividad.actid}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRoles);
        obj.success(function (response) {
            $scope.obtFormularioss = response;
            $scope.tituloF='Formularios de la Actividad: '+actividad.actnombre;
            $scope.panelProcesos=false;
			$scope.panelWorkspace = false;
            $scope.panelFormularios=true;
            $scope.panelReglaNegocioActividad = false;
            $scope.panelReglasFormularios = false;
            $scope.panelImpresiones = false;
            $.unblockUI();
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
        var resTipos = {
            "procedure_name":"sp_lst_tipoformulario"
        };
        var obj1=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resTipos);
        obj1.success(function (response2) {
            $scope.obtTipoFormularioss = response2;
        });
        obj1.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    }
    $scope.volver = function(){
        $scope.titulo='Procesos';
        $scope.panelProcesos=true;
		$scope.panelWorkspace = true;
        $scope.panelActividades=false;
        $scope.panelFormularios=false;
        $scope.panelReglaNegocioActividad=false;
        $scope.panelReglasFormularios=false;
        $scope.panelImpresiones=false;
        $scope.panelFormularioDinamico=false;
        $scope.panelVerCampos=false;
    }
    $scope.modificarProcesoCargar = function(datosProceso){
        $scope.datosProceso = datosProceso;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.tituloP="Modificar Proceso";
    };
    $scope.modificarFormularioCargar = function(datosFormulario){
       $scope.datosFormulario = datosFormulario;
        $scope.url = $scope.datosFormulario.formurl.split('?');
        if($scope.url[1])
        {
          console.log($scope.url[1]);
          $scope.dinamico='SI';
          $scope.datosFormulario.formDinamico=$scope.url[1];
          $scope.trueee($scope.dinamico);
        }
        else
          $scope.dinamico='NO';
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.tituloP="Modificar Formulario";
    };
     $scope.eliminarFormularioCargar = function(datosFormulario){
        $scope.datosFormulario= datosFormulario;
        $scope.url = $scope.datosFormulario.formurl.split('?');
        if($scope.url[1])
        {
          console.log($scope.url[1]);
          $scope.dinamico='SI';
          $scope.datosFormulario.formDinamico=$scope.url[1];
          $scope.trueee($scope.dinamico);
        }
        else
          $scope.dinamico='NO';
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.tituloP="Eliminar Proceso";
    };
    $scope.eliminarProcesoCargar = function(datosProceso){
        $scope.datosProceso= datosProceso;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.tituloP="Eliminar Proceso";
    };
    $scope.modificarActividadCargar = function(datosActividad){
        console.log(datosActividad);
        if(datosActividad.actinicio=='SI' || datosActividad.actinicio=='INICIO'){
            datosActividad.actinicio='INICIO';
        }
        else{
            datosActividad.actinicio='FINAL';
        }
        $scope.datosActividad = datosActividad;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.tituloP="Modificar Actividad";
        $scope.buscarNodo(datosActividad.nodonombre);

    };
    $scope.eliminarActividadCargar = function(datosActividad){
        if(datosActividad.actinicio=='SI'){
            datosActividad.actinicio='INICIO';
        }
        else{
            datosActividad.actinicio='FINAL';
        }
        $scope.datosActividad= datosActividad;
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.tituloP="Eliminar Actividad";
        $scope.buscarNodo(datosActividad.nodonombre);
    };
    $scope.limpiar = function(){
        $scope.datosProceso = '';
        $scope.boton="new";
        $scope.desabilitado = false;
        $scope.tituloP="Registrar Proceso";
    };
    $scope.limpiarActividad = function(){
        $scope.datosActividad = '';
        $scope.boton="new";
        $scope.desabilitado = false;
        $scope.tituloP="Registrar Actividad";
            $scope.nodonombre='';
            $scope.getNodo($scope.nodonombre);
    };
    $scope.limpiarFormulario = function(){
        $scope.datosFormulario = '';
        $scope.boton="new";
        $scope.dinamico='';
        $scope.desabilitado = false;
        $scope.tituloP="Registrar Formulario";
    };

    $scope.adicionarProceso = function(datosProceso){
        var proceso = {};
        $.blockUI();
        proceso['prc_nombre'] = datosProceso.procnombre;
        proceso['prc_codigo'] = datosProceso.procodigo;
		proceso['prc_ws_id'] = $scope.wsId;
        proceso['prc_registrado'] = strfechactual;
        proceso['prc_modificado'] = strfechactual;
        proceso['prc_usr_id'] = sessionService.get('IDUSUARIO');
        if(datosProceso.pdepuracion){
            proceso['prc_depuracion'] = "TRUE";
        }else{
            proceso['prc_depuracion'] = "FALSE";
        }
        var resProceso = {"table_name":"_fr_proceso",
                        "body":proceso};
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resProceso);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $.unblockUI(); //cerrar la mascara
            $scope.getProcesos($scope.wsId);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarProceso = function(datosProceso){
        var opcion = {};
        $.blockUI();
        opcion['prc_nombre'] = datosProceso.procnombre;
        opcion['prc_codigo'] = datosProceso.procodigo;
        opcion['prc_modificado'] = strfechactual;
        opcion['prc_usr_id'] = sessionService.get('IDUSUARIO');
        if(datosProceso.pdepuracion){
            opcion['prc_depuracion'] = "TRUE";
        }else{
            opcion['prc_depuracion'] = "FALSE";
        }
        var resOpcion = {"table_name":"_fr_proceso",
                        "body":opcion,
                        "id" : datosProceso.procid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resOpcion);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI();
            $scope.getProcesos($scope.wsId);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };
    $scope.eliminarProceso = function(datosProceso){
        var opcion = {};
        $.blockUI();
        opcion['prc_modificado'] = strfechactual;
        opcion['prc_estado'] = 'B';
        opcion['prc_usr_id'] = sessionService.get('IDUSUARIO');
        var resOpcion = {"table_name":"_fr_proceso",
                        "body":opcion,
                        "id" : datosProceso.procid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resOpcion);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $.unblockUI();
            $scope.getProcesos($scope.wsId);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };
    $scope.adicionarActividad = function(datosActividad){
        if(datosActividad.actinicio=='INICIO'){
            datosActividad.actinicio='SI';
            datosActividad.actfinal='NO'
        }
        else{
            datosActividad.actinicio='NO';
            datosActividad.actfinal='SI'
        }
        if(datosActividad.tipoactid==2){
            datosActividad.actsiguiente=0;
        }
        var actividad = {};
        $.blockUI();
        actividad['act_prc_id'] = $scope.datosProc.procid;
        actividad['act_nombre'] = datosActividad.actnombre;
        actividad['act_orden'] = datosActividad.actorden;
        actividad['act_tipo_act_id'] = datosActividad.tipoactid;
        actividad['act_contador'] = 0;
        actividad['act_siguiente'] = datosActividad.actsiguiente;
        actividad['act_duracion'] = datosActividad.actduracion;
        actividad['act_inicio'] = datosActividad.actinicio;
        actividad['act_nodo_id'] = datosActividad.nodoid;
        actividad['act_fin'] = datosActividad.actfinal;
        actividad['act_registrado'] = strfechactual;
        actividad['act_modificado'] = strfechactual;
        actividad['act_hito_id'] = 15;
        actividad['act_usr_id'] = sessionService.get('IDUSUARIO');
        var resActividad = {"table_name":"_fr_actividad",
                        "body":actividad};
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resActividad);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $.unblockUI(); //cerrar la mascara
            $scope.seleccionaProceso($scope.datosProc);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };
    $scope.modificarActividad = function(datosActividad){
        if(datosActividad.actinicio=='INICIO'){
            datosActividad.actinicio='SI';
            datosActividad.actfinal='NO'
        }
        else{
            datosActividad.actinicio='NO';
            datosActividad.actfinal='SI'
        }
        if(datosActividad.tipoactid==2){
            datosActividad.actsiguiente=0;
        }
        var actividad = {};
        $.blockUI();
        actividad['act_nombre'] = datosActividad.actnombre;
        actividad['act_tipo_act_id'] = datosActividad.tipoactid;
        actividad['act_orden'] = datosActividad.actorden;
        actividad['act_siguiente'] = datosActividad.actsiguiente;
        actividad['act_duracion'] = datosActividad.actduracion;
        actividad['act_inicio'] = datosActividad.actinicio;
        actividad['act_nodo_id'] = datosActividad.nodoid;
        actividad['act_fin'] = datosActividad.actfinal;
		actividad['act_hito_id'] = 15;
        actividad['act_modificado'] = strfechactual;
        actividad['act_usr_id'] = sessionService.get('IDUSUARIO');
        var resOpcion = {"table_name":"_fr_actividad",
                        "body":actividad,
                        "id" : datosActividad.actid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resOpcion);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI();
            $scope.seleccionaProceso($scope.datosProc);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };
    $scope.eliminarActividad = function(datosActividad){
        var opcion = {};
        $.blockUI();
        opcion['act_modificado'] = strfechactual;
        opcion['act_estado'] = 'B';
        opcion['act_usr_id'] = sessionService.get('IDUSUARIO');
        var resOpcion = {"table_name":"_fr_actividad",
                        "body":opcion,
                        "id" : datosActividad.actid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resOpcion);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $.unblockUI();
            $scope.seleccionaProceso($scope.datosProc);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };

    $scope.cerrarFormulario = function(){
        $scope.getFormularios($scope.datosAct);
    };
    $scope.adicionarFormulario = function(datosFormulario){
      console.log(datosFormulario);
        var formulario = {};
        $.blockUI();
        if($scope.dinamico=='SI'){
          var aaa=JSON.parse(datosFormulario.formDinamico);
          formulario['form_url'] = '../../../app/view/formularios/formularios/render.html?'+aaa.cid;
        }
        else{
          formulario['form_url'] = '../../../app/view/formularios/formularios/'+datosFormulario.formurl;
        }
        console.log(formulario['form_url']);
        formulario['form_act_id'] = $scope.datosAct.actid;
        formulario['form_orden'] = datosFormulario.formorden;
        formulario['form_descripcion'] = datosFormulario.formdescripcion2;
        formulario['form_tipo_id'] = datosFormulario.formtpid;
        formulario['form_direccionamiento'] = datosFormulario.formdireccionamiento;
        formulario['form_registrado'] = strfechactual;
        formulario['form_modificado'] = strfechactual;
        formulario['form_usr_id'] = sessionService.get('IDUSUARIO');
        var resformulario = {"table_name":"_fr_formularios",
                        "body":formulario};
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resformulario);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $.unblockUI(); //cerrar la mascara
            $scope.getFormularios($scope.datosAct);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarFormulario = function(datosFormulario){
        var formulario = {};
        $.blockUI();
        if($scope.dinamico=='SI'){
          if(JSON.parse(datosFormulario.formDinamico).cid)
          {
            var aaa=JSON.parse(datosFormulario.formDinamico);
            formulario['form_url'] = '../../../app/view/formularios/formularios/render.html?'+aaa.cid;
          }else{
            formulario['form_url'] = '../../../app/view/formularios/formularios/render.html?'+datosFormulario.formDinamico;
          }
        }
        else{
          formulario['form_url'] = '../../../app/view/formularios/formularios/'+datosFormulario.formurl;
        }
        console.log(formulario['form_url']);
        formulario['form_act_id'] = $scope.datosAct.actid;
        formulario['form_orden'] = datosFormulario.formorden;
        formulario['form_descripcion'] = datosFormulario.formdescripcion2;
        formulario['form_tipo_id'] = datosFormulario.formtpid;
        formulario['form_direccionamiento'] = datosFormulario.formdireccionamiento;
        formulario['form_modificado'] = strfechactual;
        formulario['form_usr_id'] = sessionService.get('IDUSUARIO');
        var resformulario = {"table_name":"_fr_formularios",
                        "body":formulario,
                        "id" : datosFormulario.formid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformulario);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI();
            $scope.getFormularios($scope.datosAct);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };

    $scope.eliminarFormulario = function(datosFormulario){
        var formulario = {};
        $.blockUI();
        formulario['form_estado'] = 'B';
        formulario['form_modificado'] = strfechactual;
        formulario['form_usr_id'] = sessionService.get('IDUSUARIO');
        var resformulario = {"table_name":"_fr_formularios",
                        "body":formulario,
                        "id" : datosFormulario.formid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformulario);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $.unblockUI();
            $scope.getFormularios($scope.datosAct);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };

    /*reglas de negocio actividades*/
    $scope.getReglaNegocioActividad = function(actividad){
        $.blockUI();
        $scope.datosActRegla=actividad;
        $scope.datosAct=actividad;
        $scope.actividadSeleccionado=actividad.actid;
        var resRNactivdad = {
            "procedure_name":"sp_lst_rnactividad",
            "body":{"params": [{"name":"actid","value":actividad.actid}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
        obj.success(function (response) {
            $scope.obtNRactividad       =   [];
            $scope._DataActividadInicio =   []
            $scope.tituloRN='Reglas de Negocio de la Actividad: '+actividad.actnombre;
            $scope.panelProcesos=false;
			$scope.panelWorkspace = false;
            $scope.panelFormularios=false;
            $scope.panelReglaNegocioActividad = true;
            $scope.panelReglasFormularios = false;
            $scope.panelImpresiones = false;
            var flags="gi";
            
            angular.forEach(response,function(celda, fila){
                var objeto={};
                objeto['rna_id']=celda['rna_id'];
                objeto['rna_act_id']=celda['rna_act_id'];
                objeto['rna_orden']=celda['rna_orden'];
                objeto['rna_siguiente']=celda['rna_siguiente'];
                objeto['rna_actnombre']=celda['rna_actnombre'];                
                var regex_1 = new RegExp("'#", flags);
                var regex_2 = new RegExp("#'", flags);
                var reem=celda['rna_regla'].replace(regex_1,"#");
                objeto['rna_regla']=reem.replace(regex_2,"#");
                $scope.obtNRactividad[fila]=objeto;
            });            
            angular.copy($scope.obtNRactividad, $scope._DataActividadInicio);
            $.unblockUI();
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    }
    
    $scope.restablecerData  =   function(){
        $scope._DataActividadInicio_2 = [];
        angular.copy($scope._DataActividadInicio, $scope._DataActividadInicio_2);
        $scope.obtNRactividad   = $scope._DataActividadInicio_2;
    };
    
    $scope.getActividad = function(){
        $scope.nombreActividades=$scope.obtActividades;
    };

    $scope.adicionarReglaActividad = function(datosReglaActividad){
        $scope.uno=datosReglaActividad.rna_regla.split('#');
        $scope.cadena="";
        var sw=0;
        angular.forEach($scope.uno,function(celda, fila){

            if(fila==0 && celda){
                console.log(celda);
                $scope.cadena=$scope.cadena+celda;
            }
            if(fila!=0 && $scope.uno.length){
                if(fila%2==0){
                    $scope.cadena=$scope.cadena+celda;
                }
                else{
                    $scope.cadena=$scope.cadena+"'#"+celda+"#'";
                }
            }
        });
        var actividadRegla = {};
        $.blockUI();
        actividadRegla['rgn_act_id'] = $scope.actividadSeleccionado;
        actividadRegla['rgn_orden'] = datosReglaActividad.rna_orden;
        actividadRegla['rgn_siguiente'] = datosReglaActividad.rna_siguiente;
        actividadRegla['rgn_registrado'] = strfechactual;
        actividadRegla['rgn_modificado'] = strfechactual;
        actividadRegla['rgn_usr_id'] = sessionService.get('IDUSUARIO');
        actividadRegla['rgn_estado'] = 'A';
        actividadRegla['rgn_regla'] = $scope.cadena;
        var resRegla = {"table_name":"_fr_reglas_negocio",
                        "body":actividadRegla};
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resRegla);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $.unblockUI(); //cerrar la mascara
            $scope.getReglaNegocioActividad($scope.datosAct);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarReglaActividad = function(datosReglaActividad){
        $scope.uno=datosReglaActividad.rna_regla.split('#');
        $scope.cadena="";
        var sw=0;
        angular.forEach($scope.uno,function(celda, fila){
            if(fila==0 && celda){
                $scope.cadena=$scope.cadena+celda;
            }
            if(fila!=0 && $scope.uno.length){
                if(fila%2==0){
                    $scope.cadena=$scope.cadena+celda;
                }
                else{
                    $scope.cadena=$scope.cadena+"'#"+celda+"#'";
                }
            }
        });
        var actividadRegla = {};
        $.blockUI();
        actividadRegla['rgn_orden'] = datosReglaActividad.rna_orden;
        actividadRegla['rgn_siguiente'] = datosReglaActividad.rna_siguiente;
        actividadRegla['rgn_modificado'] = strfechactual;
        actividadRegla['rgn_usr_id'] = sessionService.get('IDUSUARIO');
        actividadRegla['rgn_regla'] = $scope.cadena;
        var resReglaActividad = {"table_name":"_fr_reglas_negocio",
                        "body":actividadRegla,
                        "id" : datosReglaActividad.rna_id};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resReglaActividad);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI();
            $scope.getReglaNegocioActividad($scope.datosAct);  ;
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };

    $scope.eliminarReglaActividad = function(datosReglaActividad){
        var actividadRegla = {};
        $.blockUI();
        actividadRegla['rgn_estado'] = 'B';
        actividadRegla['rgn_modificado'] = strfechactual;
        actividadRegla['rgn_usr_id'] = sessionService.get('IDUSUARIO');
        var resReglaActividad = {"table_name":"_fr_reglas_negocio",
                        "body":actividadRegla,
                        "id" : datosReglaActividad.rna_id};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resReglaActividad);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $.unblockUI();
            $scope.getReglaNegocioActividad($scope.datosAct);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };

    /*reglas de negocio formulario*/
    $scope.getReglaNegocioFormulario = function(formulario){
        $.blockUI();
        $scope.datosForm=formulario;
        $scope.formularioSeleccionado=formulario.formid;
        var resRNformulario = {
            "procedure_name":"sp_lst_rnformulario",
            "body":{"params": [{"name":"formid","value":formulario.formid}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNformulario);
        obj.success(function (response) {
            $scope.obtNRformulario = [];
            $scope.tituloRNF='Reglas de Negocio del Formulario: '+formulario.formdescripcion;
            var flags="gi";
            angular.forEach(response,function(celda, fila){
                var objeto={};
                objeto['rnf_id']=celda['rnf_id'];
                objeto['rnf_form_id']=celda['rnf_form_id'];
                objeto['rnf_orden']=celda['rnf_orden'];
                objeto['rnf_siguiente']=celda['rnf_siguiente'];
                objeto['rnf_nombreform']=celda['rnf_nombreform'];
                objeto['rnf_tipo_regla']=celda['rnf_tipo_regla'];
                var reem=celda['rnf_regla'].replace("'#","#",flags);
                objeto['rnf_regla']=reem.replace("#'","#",flags);
                $scope.obtNRformulario[fila]=objeto;
            });
            $scope.panelReglasFormularios = true;
            $.unblockUI();
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    }

    $scope.getFormulario = function(){
        $scope.nombreFormularios=$scope.obtFormularioss;
    };

    $scope.adicionarReglaFormulario = function(datosReglaFormulario){
        $scope.uno=datosReglaFormulario.rnf_regla.split('#');
        $scope.cadena="";
        var sw=0;
        angular.forEach($scope.uno,function(celda, fila){
            if(fila==0 && celda){
                console.log(celda);
                $scope.cadena=$scope.cadena+celda;
            }
            if(fila!=0 && $scope.uno.length){
                if(fila%2==0){
                    $scope.cadena=$scope.cadena+celda;
                }
                else{
                    $scope.cadena=$scope.cadena+"'#"+celda+"#'";
                }
            }
        });
        console.log($scope.cadena);
        var formularioRegla = {};
        $.blockUI();
        formularioRegla['rgnf_form_id'] = $scope.formularioSeleccionado;
        formularioRegla['rgnf_orden'] = datosReglaFormulario.rnf_orden;
        formularioRegla['rgnf_regla'] = $scope.cadena;
        formularioRegla['rgnf_siguiente_formulario'] = datosReglaFormulario.rnf_siguiente;
        formularioRegla['rgnf_tipo_regla'] = datosReglaFormulario.rnf_tipo_regla;
        formularioRegla['rgnf_registrado'] = strfechactual;
        formularioRegla['rgnf_modificado'] = strfechactual;
        formularioRegla['rgnf_usr_id'] = sessionService.get('IDUSUARIO');
        formularioRegla['rgnf_estado'] = 'A';
        var resRegla = {"table_name":"_fr_reglas_negocio_formularios",
                        "body":formularioRegla};
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resRegla);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $.unblockUI(); //cerrar la mascara
            $scope.getReglaNegocioFormulario($scope.datosForm);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarReglaFormulario = function(datosReglaFormulario){
        $scope.uno=datosReglaFormulario.rnf_regla.split('#');
        $scope.cadena="";
        var sw=0;
        angular.forEach($scope.uno,function(celda, fila){
            if(fila==0 && celda){
                console.log(celda);
                $scope.cadena=$scope.cadena+celda;
            }
            if(fila!=0 && $scope.uno.length){
                if(fila%2==0){
                    $scope.cadena=$scope.cadena+celda;
                }
                else{
                    $scope.cadena=$scope.cadena+"'#"+celda+"#'";
                }
            }
        });
        console.log($scope.cadena);
        var formularioRegla = {};
        $.blockUI();
        formularioRegla['rgnf_orden'] = datosReglaFormulario.rnf_orden;
        formularioRegla['rgnf_siguiente_formulario'] = datosReglaFormulario.rnf_siguiente;
        formularioRegla['rgnf_regla'] = $scope.cadena;
        formularioRegla['rgnf_tipo_regla'] = datosReglaFormulario.rnf_tipo_regla;
        formularioRegla['rgnf_modificado'] = strfechactual;
        formularioRegla['rgnf_usr_id'] = sessionService.get('IDUSUARIO');
        var resReglaFormulario = {"table_name":"_fr_reglas_negocio_formularios",
                        "body":formularioRegla,
                        "id" : datosReglaFormulario.rnf_id};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resReglaFormulario);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI();
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };

    $scope.eliminarReglaFormulario = function(datosReglaFormulario){
        var formularioRegla = {};
        $.blockUI();
        formularioRegla['rgnf_regla'] = datosReglaFormulario.rnf_regla;
        formularioRegla['rgnf_estado'] = 'B';
        formularioRegla['rgnf_modificado'] = strfechactual;
        formularioRegla['rgnf_usr_id'] = sessionService.get('IDUSUARIO');
        var resReglaFormulario = {"table_name":"_fr_reglas_negocio_formularios",
                        "body":formularioRegla,
                        "id" : datosReglaFormulario.rnf_id};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resReglaFormulario);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $.unblockUI();
            $scope.getReglaNegocioFormulario($scope.datosForm);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };

    $scope.limpiarReglaActividad = function(){
        $scope.datosReglaActividad = '';
        $scope.boton="new";
        $scope.desabilitado = false;
        $scope.tituloR="Registrar Nueva Regla de Negocio";
        $scope.getActividad();
    };
    $scope.modificarReglaActividadCargar = function(reglaActividad){
        console.log("datosss   ",reglaActividad);
        $scope.getActividad();
        $scope.datosReglaActividad = reglaActividad;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.tituloR="Modificar Regla de Negocio";
    };
    $scope.eliminarReglaActividadCargar = function(reglaActividad){
        $scope.datosReglaActividad= reglaActividad;
        $scope.getActividad();
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.tituloR="Eliminar Regla de Negocio";
    };

    $scope.limpiarReglaFormulario = function(){
        $scope.datosReglaFormulario = '';
        $scope.getFormulario();
        $scope.boton="new";
        $scope.desabilitado = false;
        $scope.tituloA="Registrar Nueva Regla de Negocio";
        $scope.getActividad();
    };
    $scope.modificarReglaFormularioCargar = function(reglaFormulario){

        $scope.getFormulario();
        $scope.datosReglaFormulario = reglaFormulario;
        $scope.boton="upd";
        $scope.desabilitado=false;
        $scope.tituloA="Modificar Regla de Negocio";
    };
    $scope.eliminarReglaFormularioCargar = function(reglaFormulario){
        $scope.datosReglaFormulario= reglaFormulario;
        $scope.getFormulario();
        $scope.desabilitado=true;
        $scope.boton="del";
        $scope.tituloA="Eliminar Regla de Negocio";
    };

    //<!-- IMPRESIONES -->
    $scope.getImpresiones = function(actividad)
    {
        $scope.datosFormActImpresion    = {};
        $scope.actividadActual          = actividad;
        $.blockUI();
        console.log("ACTIVIDAD: ", actividad);
        $scope.sNombreActividad = actividad.actnombreorden;
        $scope.sOrdenActividad  = actividad.actorden;
        $scope.datosFormActImpresion.idact = actividad.actid;
        var resRNactivdad = {
            "procedure_name":"sp_lst_actividad_impresion",
            "body":{"params": [{"name":"idactividad","value":actividad.actid}]}
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resRNactivdad);
        obj.success(function (response) {

            $scope.dataFormatoImpresion = [];
            $scope._DataImpresionInicio = [];
            var flags="gi";
            angular.forEach(response,function(celda, fila){
                var objeto={};
                objeto['idactimp']=celda['idactimp'];
                objeto['idact']=celda['idact'];
                objeto['actnombre']=celda['actnombre'];
                objeto['formimp']=celda['formimp'];
                objeto['formdescrip']=celda['formdescrip'];
                objeto['formcontenido']=celda['formcontenido'];
                objeto['actorden']=celda['actorden'];
                var reem=celda['aimpregla'].replace("'#","#",flags);
                reem=reem.replace(" OR "," || ",flags);
                reem=reem.replace(" AND "," && ",flags);
                objeto['aimpregla']=reem.replace("#'","#",flags);
                $scope.dataFormatoImpresion[fila]=objeto;
            });
            angular.copy($scope.dataFormatoImpresion, $scope._DataImpresionInicio);
            console.log("IMPRESIONES A LISTAR:", $scope.dataFormatoImpresion);
            $scope.panelProcesos=false;
			$scope.panelWorkspace = false;
            $scope.panelActividades=true;
            $scope.panelFormularios=false;
            $scope.panelReglaNegocioActividad = false;
            $scope.panelReglasFormularios = false;
            $scope.panelImpresiones = true;
            $.unblockUI();
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });

        /*OBTENER LOS FORMATOS DE IMPRESION*/
        
        var resFormatosImp = {
                "procedure_name":"sp_lst_formato_impresion",
                "body":{"params": [{"name":"prc_ws_id","value":$scope.wsId}]
                }
            };

        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resFormatosImp);
        obj.success(function (response) {
            $scope.dataCboFormatoImpresion = response;
        });
        obj.error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    
    $scope.restablecerDataImpresiones  =   function(){        
        $scope._DataImpresionInicio_2 = [];
        angular.copy($scope._DataImpresionInicio, $scope._DataImpresionInicio_2);
        $scope.dataFormatoImpresion   = $scope._DataImpresionInicio_2;
    };
    
    //<!-- IMPRESIONES -->
    $scope.guardarFormatosImpresion = function(datosImpresion){
        var ree1=/ && /gi;
        var ree2=/OROR/g;
        $scope.reemplazo=datosImpresion.aimpregla.replace(/([||])/g, "OR");
        $scope.reemplazo=$scope.reemplazo.replace(ree2,"OR");
        $scope.reemplazo=$scope.reemplazo.replace(ree1," AND ");
        $scope.uno=$scope.reemplazo.split('#');
        $scope.cadena="";
        var sw=0;
        angular.forEach($scope.uno,function(celda, fila){

            if(fila==0 && celda){
                console.log(celda);
                $scope.cadena=$scope.cadena+celda;
            }
            if(fila!=0 && $scope.uno.length){
                if(fila%2==0){
                    $scope.cadena=$scope.cadena+celda;
                }
                else{
                    $scope.cadena=$scope.cadena+"'#"+celda+"#'";
                }
            }
        });
        var impresion = {};
        impresion['aimp_act_id']       = datosImpresion.idact;
        impresion['aimp_imp_id']       = datosImpresion.formimp;
        impresion['aimp_regla']        = $scope.cadena;
        impresion['aimp_registrado']   = strfechactual;
        impresion['aimp_modificado']   = strfechactual;
        var resImpresion = {"table_name":"_fr_actividad_impresion",
                        "body":impresion};
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resImpresion);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $scope.getImpresiones($scope.actividadActual);
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };
    //<!-- IMPRESIONES -->
    $scope.eliminarFormatoImpresionCargar = function(impresion){
        console.log("CARGAR DATOS IMPRESION:", impresion);
        $scope.datosFormActImpresion    =   impresion;
        $scope.boton                    =   "del";
        $scope.tituloR                  =   "Eliminar Formato Impresion";
        $scope.desabilitado             =   false;
    };

    //<!-- IMPRESIONES -->
    $scope.eliminarFormatosImpresion = function(datosImpresion){
        console.log("ALMACENANDO FORMATOS DE IMPRESION:", datosImpresion);
        var opcion = {};
        opcion['aimp_modificado']   = strfechactual;
        opcion['aimp_estado']       = 'B';
        var resOpcion = {"table_name":"_fr_actividad_impresion",
                        "body": opcion,
                        "id" : datosImpresion.idactimp};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resOpcion);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $scope.getImpresiones($scope.actividadActual);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };

    //<!-- IMPRESIONES -->
    $scope.limpiarFormatoImp = function(){
        $scope.datosFormImpresion   =   '';
        $scope.boton                =   "new";
        $scope.desabilitado         =   false;
        $scope.tituloR              =   "Registrar Nuevo Formato Impresion";
        console.log("LISTANDO FORMULARIOS DE IMPRESION ");
    };

    //<!-- IMPRESIONES -->
    $scope.modificarFormatosImpresion = function(datosImpresion){
        var ree1=/ && /gi;
        var ree2=/OROR/g;
        $scope.reemplazo=datosImpresion.aimpregla.replace(/([||])/g, "OR");
        $scope.reemplazo=$scope.reemplazo.replace(ree2,"OR");
        $scope.reemplazo=$scope.reemplazo.replace(ree1," AND ");
        $scope.uno=$scope.reemplazo.split('#');
        $scope.cadena="";
        var sw=0;
        angular.forEach($scope.uno,function(celda, fila){
            if(fila==0 && celda){
                console.log(celda);
                $scope.cadena=$scope.cadena+celda;
            }
            if(fila!=0 && $scope.uno.length){
                if(fila%2==0){
                    $scope.cadena=$scope.cadena+celda;
                }
                else{
                    $scope.cadena=$scope.cadena+"'#"+celda+"#'";
                }
            }
        });
        /*ACTUALIZAR UN CAMPO DEL FORMULARIO*/
        var resOpcion = {
            "procedure_name":"sp_act_actividad_impresion",
            "body":{
                "params": [{
                        "name": "aimpid", "value": datosImpresion.idactimp
                    },{ "name": "impid","value": datosImpresion.formimp
                    },{ "name": "impregla","value": $scope.cadena
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion).success(function (response){
            sweet.show('', 'Registro Modificado', 'success');
            $scope.getImpresiones($scope.actividadActual);
        }).error(function(error) {
        });
    };

    /*formularios dinamicos*/
  $scope.trueee = function(dinamico){
    if(dinamico=='SI'){
      $.blockUI();
      $scope.procesofd = $scope.datosProc;
      var resOpcion = {
          "procedure_name":"sp_lst_formularioproceso",
          "body":{
              "params": [
                  {
                      "name": "procid",
                      "value": $scope.datosProc.procid
                  }
              ]
          }
      };
      var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
      .success(function (response){
          $scope.obtCampoFormulario=response;
          $.unblockUI();
      }).error(function(error) {
          $scope.errors["error_rol"] = error;
      });
    }
  }
  $scope.getCamposFormProc = function(proceso){
        $.blockUI();
        console.log("idddddd  ",proceso);
        $scope.procesofd = proceso;
        var resOpcion = {
            "procedure_name":"sp_lst_formularioproceso",
            "body":{
                "params": [
                    {
                        "name": "procid",
                        "value": proceso.procid
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            $scope.obtCampoFormulario=response;
            $scope.panelFormularioDinamico = true;
            $scope.panelVerCampos = false;
            $scope.panelProcesos = false;
			$scope.panelWorkspace = false;
            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };


     $scope.adicionarFormularioDinamico = function(datosfd){
        $.blockUI();
        var formularioD = {};
        formularioD['campo_nombre'] = datosfd.cnombre;
        formularioD['campo_descripcion'] = '[]';
        formularioD['campo_registrado'] = strfechactual;
        formularioD['campo_modificado'] = strfechactual;
        formularioD['campo_usr_id'] = sessionService.get('IDUSUARIO');
        formularioD['campo_estado'] = 'A';
        formularioD['campo_prc_id'] = $scope.procesofd.procid;
        var resformularioD = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioD};
        var obj = DreamFactory.api[CONFIG.SERVICE].createRecords(resformularioD);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $scope.getCamposFormProc($scope.procesofd);
            $.unblockUI(); //cerrar la mascara

        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
        })
    };

    $scope.modificarFormularioDinamico = function(datosfd){
        $.blockUI();
        var formularioD = {};
        formularioD['campo_nombre'] = datosfd.cnombre;
        formularioD['campo_modificado'] = strfechactual;
        formularioD['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioD = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioD};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioD);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI(); //cerrar la mascara
            $scope.getCamposFormulario();
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };

    $scope.modificarFormularioDinamico = function(datosfd){
        $.blockUI();
        var formularioD = {};
        formularioD['campo_nombre'] = datosfd.cnombre;
        formularioD['campo_modificado'] = strfechactual;
        formularioD['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioD = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioD,
                        "id" : datosfd.cid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioD);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $.unblockUI();
        })
        obj.error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
        })
    };

    $scope.eliminarFormularioDinamico = function(datosfd){
        $.blockUI();
        var formularioD = {};
        formularioD['campo_modificado'] = strfechactual;
        formularioD['campo_usr_id'] = sessionService.get('IDUSUARIO');
        formularioD['campo_estado'] = 'B';
        var resformularioD = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioD,
                        "id" : datosfd.cid};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioD);
        obj.success(function(data){
            sweet.show('', 'Registro eliminado', 'success');
            $.unblockUI();
            $scope.getCamposFormProc($scope.procesofd);
        })
        obj.error(function(data){
            sweet.show('', 'Registro no eliminado', 'error');
        })
    };

    $scope.limpiarfd = function(){
        $scope.datosfd = '';
        $scope.boton = "new";
        $scope.desabilitado = false;
        $scope.tituloP = "Registrar Formulario Dinámico";
    };
    $scope.modificarFormularioDinamicoCargar = function(camposFormulario){
        $scope.datosfd = camposFormulario;
        $scope.boton = "upd";
        $scope.desabilitado = false;
        $scope.tituloP = "Modificar Formulario Dinámico";
    };
    $scope.eliminarFormularioDinamicoCargar = function(camposFormulario){
        $scope.datosfd = camposFormulario;
        $scope.desabilitado = true;
        $scope.boton = "del";
        $scope.tituloP = "Eliminar Formulario Dinámico";
    };
//-----------------------------------------------------------------


    // The modes
    $scope.modes = ['Scheme', 'XML', 'Javascript'];
    $scope.mode = $scope.modes[0];


    // The ui-codemirror option
    $scope.cmOption = {
      lineNumbers: true,
      indentWithTabs: true,
      onLoad : function(_cm){

      // HACK to have the codemirror instance in the scope...
    $scope.modeChanged = function(){
          _cm.setOption("mode", $scope.mode.toLowerCase());
          };
      }
    };

    // Initial code content...
    $scope.cmModel = ';; Scheme code in here.\n' +
    '(define (double x)\n\t(* x x))\n\n\n' +
    '<!-- XML code in here. -->\n' +
    '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n' +
    '// Javascript code in here.\n' +
    'function foo(msg) {\n\tvar r = Math.random();\n\treturn "" + r + " : " + msg;\n}';


//-------------------------------------------------------------------





    $scope.getCampos = function(campo){
        $.blockUI();
        $scope.modes = ['Scheme', 'XML', 'Javascript'];
        $scope.mode = $scope.modes[2];
           // The ui-ace option
        $scope.aceOption = {
          mode: $scope.mode.toLowerCase(),
          onLoad: function (_ace) {

            // HACK to have the ace instance in the scope...
            $scope.modeChanged = function () {
              _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
            };

          }
        };
        ind = 0;
        $scope.indices = [];
        $scope.seleccionar = [];
        $scope.idfd = campo;
        $scope.panelVerCampos = true;
       /*var resCampos = {
            "procedure_name":"sp_lst_campos",
            "body":{
                "params": [
                    {
                        "name": "idcampo",
                        "value": campo
                    }
                ]
            }
        };*/
        var resCampos = {
            "procedure_name":"get_json_order",
            "body":{
                "params": [
                    {
                        "name": "id_form",
                        "value": campo
                    }
                ]
            }
        };
        //servicio listar roles
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resCampos)
        .success(function (results) {
            if (results.length>0) {
                if (results[0].sp_lst_campos != '') {
                datos = JSON.parse(results[0].get_json_order);
                var vectorCampos = [];
                angular.forEach(datos,function(celda, fila){
                    var objetoCampo = {};
                    objetoCampo.titulo = celda['titulo'];
                    objetoCampo.campo = celda['campo'];
                    objetoCampo.tipo = celda['tipo'];
                    objetoCampo.posicion = celda['posicion'];
                    objetoCampo.columnas = celda['columnas'];
                    objetoCampo.comportamientos = JSON.stringify(celda['comportamientos']);
                    console.log(objetoCampo.comportamientos);
                    if (objetoCampo.tipo == 'SCRIPT') {
                          objetoCampo.comportamientos =objetoCampo.comportamientos.substring(1,objetoCampo.comportamientos.length-1);
                          objetoCampo.comportamientos=objetoCampo.comportamientos.replace(/\\n?/g, '\n');
                          objetoCampo.comportamientos=objetoCampo.comportamientos.replace(/\\t?/g, '\t');

                        }

                    objetoCampo.estado = celda['estado'];
                    objetoCampo.orden = celda['orden'];
                    if (celda['tipo'] == 'CBO'  || celda['tipo'] == 'GRD' || celda['tipo'] == 'CHKM') {
                        objetoCampo.tipo_llenado = celda['tipo_llenado'];
                        if(celda['tipo_llenado'] == 'datos'){
                        objetoCampo.data = JSON.stringify(celda['data']);
                        }
                        else{
                            objetoCampo.data = celda['data'];
                        };
                    };
                    vectorCampos[fila] = objetoCampo;
                });

                $scope.obtCampos = vectorCampos;
                dimension = datos.length-1;
                $.unblockUI();
                } else{
                $scope.obtCampos = '';
                datos = [];
                dimension = datos.length-1;
                $.unblockUI();
                };
            }
        }).error(function(error) {
            $scope.errors["error_roles"] = error;
        });
    };

    $scope.adicionarCampos = function(datosCampo){
        $.blockUI();
        var formularioCampos = {};
        $scope.objCampos.titulo = datosCampo.titulo;
        $scope.objCampos.campo = datosCampo.campo;
        $scope.objCampos.tipo = datosCampo.tipo;
        $scope.objCampos.posicion = datosCampo.posicion;
        $scope.objCampos.columnas = datosCampo.columnas;
        //$scope.objCampos.comportamientos = JSON.parse(datosCampo.comportamientos);
        if (datosCampo.comportamientos)
          if (datosCampo.tipo == 'SCRIPT') {
            $scope.objCampos.comportamientos = datosCampo.comportamientos;
          } else {
            $scope.objCampos.comportamientos = JSON.parse(datosCampo.comportamientos);
          }
        $scope.objCampos.estado = datosCampo.estado;
        $scope.objCampos.orden = datosCampo.orden;
        if (datosCampo.tipo == 'CBO'  || datosCampo.tipo == 'GRD' || datosCampo.tipo == 'CHKM') {
            $scope.objCampos.tipo_llenado = datosCampo.tipo_llenado;
            if (datosCampo.tipo_llenado == 'datos') {
                datosData = JSON.parse(datosCampo.data);
                $scope.objCampos.data = datosData;
            }
            else{
                $scope.objCampos.data = datosCampo.data;
            };
        }
        dimension = dimension + 1;
        datos[dimension] = $scope.objCampos;
        var descripcion = JSON.stringify(datos);
        formularioCampos['campo_descripcion'] = descripcion;
        formularioCampos['campo_modificado'] = strfechactual;
        formularioCampos['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioCampos = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioCampos,
                        "id" : $scope.idfd};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioCampos);
        obj.success(function(data){
            sweet.show('', 'Registro insertado', 'success');
            $scope.getCampos($scope.idfd);
            $.unblockUI(); //cerrar la mascara
        })
        .error(function(data){
            sweet.show('', 'Registro no insertado', 'error');
            $.unblockUI();
        })
    };

    $scope.modificarCampos = function(datosCampo){ console.log(datosCampo);
        $.blockUI();
        var formularioCampos = {};
        var vectorCampos2 = [];
        for (var i = 0; i <= datos.length-1; i++) {
            if (i != $scope.indice) {
                vectorCampos2[i] = datos[i];
            } else{
                var objetoCampo2 = {};
                objetoCampo2.titulo = datosCampo.titulo;
                objetoCampo2.campo = datosCampo.campo;
                objetoCampo2.tipo = datosCampo.tipo;
                objetoCampo2.posicion = datosCampo.posicion;
                objetoCampo2.columnas = datosCampo.columnas;
                if (datosCampo.comportamientos)
                    if (datosCampo.tipo == 'SCRIPT') {
                      objetoCampo2.comportamientos = datosCampo.comportamientos;
                    } else {
                      objetoCampo2.comportamientos = JSON.parse(datosCampo.comportamientos);
                    // objetoCampo2.comportamientos=(datosCampo.comportamientos);
                    }
                objetoCampo2.estado = datosCampo.estado;
                objetoCampo2.orden = datosCampo.orden;
                if (datosCampo.tipo == 'CBO'  || datosCampo.tipo == 'GRD' || datosCampo.tipo == 'GRDRC' || datosCampo.tipo == 'CHKM') {
                    objetoCampo2.tipo_llenado = datosCampo.tipo_llenado;
                    if (datosCampo.tipo_llenado == 'datos') {
                        datosData = JSON.parse(datosCampo.data);
                    objetoCampo2.data = datosData;
                    }
                    else{
                    objetoCampo2.data = datosCampo.data;
                    };
                }
                vectorCampos2[i] = objetoCampo2;console.log("grilla cargada",objetoCampo2);
            };
        };
        var descripcion = JSON.stringify(vectorCampos2);
        formularioCampos['campo_descripcion'] = descripcion;
        formularioCampos['campo_modificado'] = strfechactual;
        formularioCampos['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioCampos = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioCampos,
                        "id" : $scope.idfd};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioCampos);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $scope.getCampos($scope.idfd);
            $.unblockUI(); //cerrar la mascara
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
            $.unblockUI();
        })
    };

    $scope.eliminarCampos = function(datosCampo){
        $.blockUI();
        var formularioCampos = {};
        datos.splice($scope.indice, 1);
        var descripcion = JSON.stringify(datos);
        formularioCampos['campo_descripcion'] = descripcion;
        formularioCampos['campo_modificado'] = strfechactual;
        formularioCampos['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioCampos = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioCampos,
                        "id" : $scope.idfd};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioCampos);
        obj.success(function(data){
            sweet.show('', 'Registro modificado', 'success');
            $scope.getCampos($scope.idfd);
            $.unblockUI(); //cerrar la mascara
        })
        .error(function(data){
            sweet.show('', 'Registro no modificado', 'error');
            $.unblockUI();
        })
    };

    $scope.seleccionar = [];
    $scope.indices = [];
    var ind = 0;
    $scope.check = function(seleccionado, index){
        if(seleccionado){
            $scope.seleccionar.push(datos[index]);
            $scope.indices.push(index);
            ind++;
        } else {
      // remove item
        for(var i=0 ; i < $scope.seleccionar.length; i++) {
            if(index == $scope.indices[i]){
                $scope.seleccionar.splice(i,1);
                $scope.indices.splice(i,1);
                }
            }
        }
        console.log("el vector copiado  ",$scope.seleccionar,"indicesss   ",$scope.indices);
    };

   $scope.clonarCampos = function(idf){
        $.blockUI();
        var formularioCampos = {};
        console.log("id form   ",idf);
        var campoClonado = JSON.stringify(datos);
        if (idf > 0 && $scope.seleccionar.length >0) {
            formularioCampos['campo_descripcion'] = campoClonado;
        formularioCampos['campo_modificado'] = strfechactual;
        formularioCampos['campo_usr_id'] = sessionService.get('IDUSUARIO');
        var resformularioCampos = {"table_name":"_fr_formulario_dinamico",
                        "body":formularioCampos,
                        "id" : idf};
        var obj = DreamFactory.api[CONFIG.SERVICE].updateRecord(resformularioCampos);
        obj.success(function(data){
            sweet.show('', 'Registro copiado', 'success');
            $scope.datosCombo='';
            $scope.getCampos($scope.idfd);
            ind = 0;
            $scope.indices = [];
            $scope.seleccionar = [];
            $.unblockUI(); //cerrar la mascara
        })
        .error(function(data){
            sweet.show('', 'Registro no copiado', 'error');
            $.unblockUI();
        })
            console.log("el vector copiado  ",$scope.seleccionar,"indicesss   ",$scope.indices);
        }else{
            sweet.show('', 'Seleccione campo y formulario', 'warning');
            $.unblockUI();
        };
    };




    $scope.limpiarCampos = function(){
        //$scope.datosCampo = '';
        $scope.boton = "new";
        $scope.desabilitado = false;
        $scope.tituloP = "Añadir Campo";
    };

    $scope.limpiarCamposvali = function(){
          //$scope.datosCampo = '';
        $scope.boton = "new";
        $scope.desabilitado = false;
        $scope.tituloP = "Añadir Campo";
        //$scope.campo = "Añadir Campo";
        //$scope.campoP='';
        console.log(datos);
        var vectorCampos2 = [];
        for (var i = 0; i <= datos.length-1; i++) {
            if (i != $scope.indice) {
                vectorCampos2[i] = datos[i];
            } else{
                var objetoCampo2 = {};
                objetoCampo2.titulo=datosCampo.titulo;
                objetoCampo2.campo=datosCampo.campo;
                objetoCampo2.tipo = datosCampo.tipo;
                objetoCampo2.posicion = datosCampo.posicion;
                objetoCampo2.columnas = datosCampo.columnas;
                objetoCampo2.estado = datosCampo.estado;
                objetoCampo2.orden = datosCampo.orden;
                vectorCampos2[i] = objetoCampo2;
                console.log(objetoCampo2);
            }
        }
        $scope.datosCampo= '';
        //$scope.tituloP=" Añadir Campo ";

    };
    $scope.modificarCamposCargar = function(campos,indice){
        $scope.indice = indice;
        console.log("este es el vector     ",datos,"  dimension   ",dimension,"  indice a modificar  ",$scope.indice);
        $scope.datosCampo = campos; console.log($scope.datosCampo);
        $scope.boton = "upd";
        $scope.desabilitado = false;
        $scope.tituloP = "Modificar Campo";
    };
    $scope.eliminarCamposCargar = function(campos,indice){
        $scope.indice = indice;
        console.log("este es el vector     ",datos,"  dimension   ",dimension,"  indice a eliminar  ",$scope.indice);
        $scope.datosCampo = campos;
        console.log(campos.estado);
        console.log(campos.posicion);
        console.log(campos.tipo);
        $scope.desabilitado = true;
        $scope.boton = "del";
        $scope.tituloP = "Eliminar Campo";
    };

    $scope.cargarcombo = function(proceso){
        $.blockUI();
        var resOpcion = {
            "procedure_name":"sp_lst_catalogo",
            "body":{
                "params": [
                    {
                        "name": "tipox",
                        "value": 2
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            $scope.codigo=response;

            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    $scope.cargarcombo1 = function(proceso){
        $.blockUI();
        var resOpcion = {
            "procedure_name":"sp_lst_catalogo",
            "body":{
                "params": [
                    {
                        "name": "tipox",
                        "value": 7
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            $scope.codigo1=response;

            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    $scope.cargarcombo2 = function(proceso){
        $.blockUI();
        var resOpcion = {
            "procedure_name":"sp_lst_catalogo",
            "body":{
                "params": [
                    {
                        "name": "tipox",
                        "value": 21
                    }
                ]
            }
        };
        var obj = DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resOpcion)
        .success(function (response){
            $scope.codigo2=response;

            $.unblockUI();
        }).error(function(error) {
            $scope.errors["error_rol"] = error;
        });
    };
    //<!-- IMPRESIONES -->
    $scope.modificarImpresionCargar = function(fmImpresion){
        console.log("DATOS A MODIFICAR:", fmImpresion);
        $scope.datosFormActImpresion    =   fmImpresion;
        $scope.boton                    =   "upd";
        $scope.desabilitado             =   false;
        $scope.tituloR                  =   "Modificar Formato Impresion";
        console.log("LISTANDO FORMULARIOS DE IMPRESION ");
    };

    /*$scope.dibujo = function(){
     html2canvas(document.getElementById("impresionPDF"),{
     // html2canvas(document.getElementById("SVGArea"),{
     //   html2canvas(document.getElementById("myDiagramDiv"),{
        onrendered: function(canvas){
          var img=canvas.toDataURL("image/png");
          var doc = new jsPDF();
          doc.addImage(img,'JPEG', 10, 10, 170, 220);
          doc.save('proceso.pdf');
        }
      });
    }

    $scope.crearPDF = function(){
      html2canvas(document.getElementById('impresionPDF'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 550,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("MapaProceso.pdf");
            }
      });
    }


    /*/
    $scope.pdf22 = function(image){
      console.log("tabla",$scope.procActividad.length);
    var colrte = [
        {title: "Act.", dataKey: "act"},
        {title: "Nombre Actividad", dataKey: "nomact"},
        {title: "Tipo Actividad", dataKey: "tipact"},
        {title: "Act. sig.", dataKey: "actsig"},
        {title: "Nombre siguiente actividad", dataKey: "nomsigact"},
        {title: "Act. inicio", dataKey: "actini"},
        {title: "Act. fin", dataKey: "actfin"},
        {title: "Formularios", dataKey: "form"}
      ];

    var datarte = [];
    textoRemplazar = new RegExp("<br>", "g");
    for (var i=0; i<$scope.procActividad.length;i++){
      if($scope.procActividad[i].sigorden===null){
        $scope.procActividad[i].sigorden=' ';
      }
       if($scope.procActividad[i].signombre===null){
        $scope.procActividad[i].signombre=' ';
      }
      console.log($scope.procActividad[i].actorden);
      textoFormularios= $scope.procActividad[i].actformularios.replace(textoRemplazar,"\n");
      var aporte = {"act":$scope.procActividad[i].actorden,"nomact":$scope.procActividad[i].actnombre,"tipact":$scope.procActividad[i].tipodescripcion,"actsig":$scope.procActividad[i].sigorden,"nomsigact":$scope.procActividad[i].signombre,"actini":$scope.procActividad[i].actinicio,"actfin":$scope.procActividad[i].actfin,"form":textoFormularios};
          datarte[i]=aporte;
      };

    var doc = new jsPDF('l', 'pt');

        var header = function (data) {
            doc.setFontSize(9);
            doc.setTextColor(40);
            doc.setFontStyle('bold');
            doc.text($scope.procTitulo, data.settings.margin.left + 130, 55);
    };

         var totalPagesExp = "{total_pages_count_string}";
          var footer = function (data) {
              var str = "Pagina " + data.pageCount;
              // Total page number plugin only available in jspdf v1.0+
              if (typeof doc.putTotalPages === 'function') {
                  str = str + " de " + totalPagesExp;
              }
              doc.text(str, 720, doc.internal.pageSize.height - 30);

          };
         doc.autoTable(colrte, datarte, {startY: 70,theme: 'grid',bodyStyles: {font:'helvetica',fontSize: 8, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 35, top: 70, bottom: 75},styles: {overflow: 'linebreak'},columnStyles: {act: {columnWidth: 40,fontStyle: 'bold'},nomact: {columnWidth: 110},tipact: {columnWidth: 55},actsig: {columnWidth: 40},nomsigact: {columnWidth: 110},actini: {columnWidth: 40},actfin: {columnWidth: 40},form: {columnWidth: 330}}});
      console.log(doc.autoTableEndPosY());
        if(doc.autoTableEndPosY()>360){
          doc.addPage();
           doc.setFontSize(9);
            doc.setTextColor(40);
            doc.setFontStyle('bold');
            doc.text($scope.procTitulo, 130, 55);
        //   doc.addImage(image,'JPEG', 180, 70,500, 180);
        doc.addImage(image,'JPEG', 40, 70);
        doc.setFontSize(8);
            doc.setTextColor(40);
            doc.setFontStyle('normal');
            doc.text("Pagina "+totalPagesExp+" de "+totalPagesExp, 720, 560);
        }
        else{
          doc.addImage(image,'JPEG', 30, doc.autoTableEndPosY()+20);
          }

          if (typeof doc.putTotalPages === 'function') {
              doc.putTotalPages(totalPagesExp);
          }
    doc.save('proceso'+'.pdf');
  };


    $scope.cargarDatosPDF = function()
    {
      html2canvas(document.getElementById("sample"),{
        onrendered: function(canvas){
          var img=canvas.toDataURL("image/png");
          console.log("Dibujo");
          $scope.pdf22(img);
        }
      });
    };
    $scope.importar = function()
    {
      html2canvas(document.getElementById("sample"),{
        onrendered: function(canvas){
          var img=canvas.toDataURL("image/png");
          console.log("Dibujo");
          $scope.pdf22(img);
        }
      });
    };    
	$scope.exportar = function(proceso)
    {console.log(proceso);
        $.blockUI();
        var parametros = {
            "procedure_name":"exportar_proceso",
			"body":{
                "params": [
                    {
                        "name": "id_proceso",
                        "value": 1
                    }
                ]
            }
        };
        //servicio listar roles 
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(parametros);
        obj.success(function (response) {
            $scope.obtArbol = response;
            var obtArbol=JSON.stringify($scope.obtArbol);
            var parametros = {
                "contenido" : obtArbol
            };
            $.ajax({
                data: parametros,
               // url: "http://gmlppc05905:9292/dreamfactory/dist/generaArbolAjax.php",
				url: [CONFIG.DSP]+'/dreamfactory/dist/exportarProceso.php',
                type: 'POST',
                error: function (response) {
                    $.unblockUI();
                    sweet.show('Exito', 'Se realizó la actualización correctamente', 'success');
                }
            });
        })
        obj.error(function(error) {
            $.unblockUI();
            sweet.show('', 'Actualización no realizada, intentelo nuevamente', 'warning');
        });
    };
    $scope.$on('api:ready',function(){
      //  $scope.getWorkspace();
		$scope.getProcesos(sessionService.get('WS_ID'));
        $scope.cargarcombo();
        $scope.cargarcombo1();
        $scope.cargarcombo2();
    });

    $scope.inicioProcesos = function () {
        if(DreamFactory.api[CONFIG.SERVICE]){
           //scope.getWorkspace();
			$scope.getProcesos(sessionService.get('WS_ID'));
            $scope.cargarcombo();
            $scope.cargarcombo1();
            $scope.cargarcombo2();
        }
    };
});
