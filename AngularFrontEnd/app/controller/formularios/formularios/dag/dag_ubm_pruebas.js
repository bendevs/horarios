app.controller('dagPrueba', function ($scope, $rootScope, DreamFactory, CONFIG, sessionService, sweet) {
	// cargo funcionarios para asignar
	$scope.ListFuncionarios = "";
    $scope.Cargarfuncionarios = function () {
        var datosFuncionarios = {
            "procedure_name":"dag.sp_dag_ubm_funcionarioreponsable",
        };
        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(datosFuncionarios).success(function (response){
            var tmpListFuncionarios = JSON.stringify(response);
            $scope.ListFuncionarios = JSON.parse(tmpListFuncionarios);
        })
        .error(function(data){
            sweet.show('', 'Error al cargar la informacion de los funcionarios: ', 'error');
        });
    };


//     dag.dag_ubm_asignacioncabecera
//   dag_ubm_ac_gestion smallint NOT NULL, -- gestion del formulario
//   dag_ubm_ac_tipo_trans character(1) NOT NULL, -- tipo de transaccion "A" asignacion, "D" devolucion
//   dag_ubm_ac_s smallint NOT NULL, -- sector del formulario
//   dag_ubm_ac_da smallint NOT NULL, -- direccion administrativa del formulario
//   dag_ubm_ac_ue smallint, -- unidad ejecutora del formulario
//   dag_ubm_ac_oficina smallint, -- oficina del formulario
//   dag_ubm_ac_form character varying(10) NOT NULL, -- numero del formulario ej. "15/16"
//   dag_ubm_ac_num_form integer NOT NULL, -- numero de formulario ej "15"
//   dag_ubm_ac_fecha_trans timestamp without time zone, -- fecha de la transaccion
//   dag_ubm_ac_codigo_responsable text, -- codigo del funcionario al que se le hace el formulario
//   dag_ubm_ac_detalle_trans text, -- detalle u observacion de la transaccion
//   dag_ubm_ac_cimembercontrol text,
//   dag_ubm_ac_fechacontrol 
    $scope.getAD = function(){
        var resUO= {
            table_name:"dag.dag_ubm_asignacioncabecera",
            order:"dag_ubm_ac_gestion ASC, dag_ubm_ac_tipo_trans ASC, dag_ubm_ac_s ASC, dag_ubm_ac_da ASC, dag_ubm_ac_ue ASC, dag_ubm_ac_oficina ASC, dag_ubm_ac_num_form ASC"
            // filter:"dag_uo_gestion=2016 and dag_uo_estado LIKE 'A'"
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].getRecords(resUO);
        obj.success(function(response){
            $scope.datosAsig = response.record;
        })
        .error(function(response){
            sweet.show('', 'Error: ', 'error');
        })
    }

    $scope.selectedRow = null;
    $scope.setClickedRow = function(index){
        $scope.selectedRow = index ;
        // var archivo = $scope.datosAsig[$scope.selectedRow].dag_ubm_ac_s +'-'+ $scope.datosAsig[$scope.selectedRow].dag_ubm_ac_da +'-'+ $scope.datosAsig[$scope.selectedRow].dag_ubm_ac_form;
        // sweet.show({
        //     title: 'Imprimir',
        //     text: 'Desea imprimir el formulario ' + archivo + '?',
        //     type: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#DD6B55',
        //     confirmButtonText: 'SI',
        //     closeOnConfirm: false
        // }, function() {
        //     sweet.close();
            $scope.ImpresionFormAsigDev($scope.datosAsig[$scope.selectedRow].dag_ubm_ac_s,$scope.datosAsig[$scope.selectedRow].dag_ubm_ac_da,$scope.datosAsig[$scope.selectedRow].dag_ubm_ac_form,$scope.datosAsig[$scope.selectedRow].dag_ubm_ac_tipo_trans);
        // });
    }

    $scope.ImpresionFormAsigDev = function (s,da,form,tipoform) {
        var resDatos = {
            "procedure_name":"dag.sp_dag_ubm_formasigdevo",
            "body":{
            "params": [                                
                {
                    "name": "ps",
                    "value": s
                },
                {
                    "name": "pda",
                    "value": da
                },
                {
                    "name": "pform",
                    "value": form
                },
                {
                    "name": "ptipoform",
                    "value": tipoform
                }
            ]
        }
        };
        obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resDatos);
        obj.success(function (response) {
            $scope.datos=response;
            if ($scope.datos[0].fitem == null) {fitem = "";} else {fitem = $scope.datos[0].fitem};
            if ($scope.datos[0].fpat == null) {fpat = "";} else {fpat = $scope.datos[0].fpat;}; 
            if ($scope.datos[0].fmat == null) {fmat = "";} else {fmat = $scope.datos[0].fmat;};
            if ($scope.datos[0].fnombre == null) {fnombre = "";} else {fnombre = $scope.datos[0].fnombre;};
            if ($scope.datos[0].s == null) {s = "";} else {s = $scope.datos[0].s;};
            if ($scope.datos[0].da == null) {da = "";} else {da = $scope.datos[0].da;};
            if ($scope.datos[0].ue == null) {ue = "";} else {ue = $scope.datos[0].ue;};
            if ($scope.datos[0].uo == null) {uo = "";} else {uo = $scope.datos[0].uo;};
            if ($scope.datos[0].obstrans == null) {obstrans = "";} else {obstrans = $scope.datos[0].obstrans;};

            // var col = [
            //     {title: "primero", dataKey: "prim"},
            //     {title: "segundo", dataKey: "seg"}
            // ];
            // var data = [
            //     {"prim":"Bien Cultural:","seg":"$scope.datos.PTR_DEN.toUpperCase()"},
            //     {"prim":"Tipo de Bien Cultural:","seg":"$scope.datos.PTR_TB_CUL.toUpperCase()"},
            //     {"prim":"Categoría de la declaratoria:","seg":"$scope.datos.PTR_PROT_LEGAL.toUpperCase()"},
            //     {"prim":"Norma Legal:","seg":"$scope.datos.PTR_NIV_PROTEC.toUpperCase()"},
            //     {"prim":"Número Legal:","seg":"$scope.datos.PTR_NUM_PRLEGAL.toUpperCase()"},
            //     {"prim":"Fecha de Programación:","seg":"$scope.datos.PTR_FEC_PROG.toUpperCase()"}
            // ];
            var doc = new jsPDF('p', 'pt', [612,  935]); // 'legal':[612,  1008] 935

            var totalPagesExp = "{total_pages_count_string}";
            var header = function (data) {
                var escudo = new Image();
                escudo.src = '../../view/formularios/formularios/dag/escudo_lpz.jpg';
                doc.addImage(escudo, 'JPEG', 35, 15, 80, 68);
                var logo = new Image();
                logo.src = '../../view/formularios/formularios/dag/logo_gestion.jpg';
                doc.addImage(logo, 'JPEG', 540, 15, 57, 60);
                doc.setTextColor(0);
                doc.setFontSize(5);
                doc.setFontStyle('normal');
                if ($scope.datos[0].tipotrans == 'A') {
                    doc.text('F-UBM-M02',540,81);
                    doc.text('V:2.0',585,81);
                }
                else
                {
                    doc.text('F-UBM-M03',540,81);
                    doc.text('V:2.0',570,81);
                }
                doc.setFontStyle('bold');
                doc.setFontSize(11);
                if ($scope.datos[0].tipotrans == 'A') {
                    doc.text('                      FORMULARIO I (ASIGNACIÓN)\nINVENTARIO INDIVIDUALIZADO DE BIENES DE USO',200,25);
                }
                else
                {
                    doc.text('                      FORMULARIO I (DEVOLUCIÓN)\nINVENTARIO INDIVIDUALIZADO DE BIENES DE USO',200,25);
                }

                doc.setFontStyle('normal');
                doc.rect(260, 43, 170, 12);
                doc.text('S:'+ $scope.datos[0].s +' DA:' + $scope.datos[0].da +' FORM:' + $scope.datos[0].form,270,53);
                
                $scope.PDFfecha(540,90,doc);
                var str = data.pageCount;
                if (typeof doc.putTotalPages === 'function') {
                    str = str + "/" + totalPagesExp;
                }
                doc.text(str, 571, 119);

                doc.setFontSize(9);
                doc.setFontStyle('bold');
                doc.text('DATOS RESPONSABLE:',130,65);
                doc.setFontSize(7);
                doc.setFontStyle('normal');
                doc.text('CI: '+ $scope.datos[0].codresponsable,135,75);
                doc.text('NOMBRE: '+ fpat + ' ' + fmat + ', ' + fnombre,190,75);
                doc.text('ITEM: '+ fitem,135,85);

                doc.setFontSize(9);
                doc.setFontStyle('bold');
                doc.text('DATOS ASIGNACION:',30,95);
                doc.setFontSize(7);
                doc.setFontStyle('normal');
                doc.text('SECTOR: '+ s,35,105);
                doc.text('DIRECCION ADMINISTRATIVA: '+ da,35,115);
                doc.text('UNIDAD EJECUTORA: '+ ue,35,125);
                doc.text('UNIDAD ORGANIZACIONAL: '+ uo,35,135);
                doc.text('OBSERVACIONES DE LA ASIGNACIÓN: '+ obstrans,35,145);
                doc.setLineWidth(2);
                doc.line(15, 147, 597, 147);
            };
            var footer = function (data) {
                doc.setFontSize(8);
                doc.setFontStyle('normal');
                doc.text("Elaborado por: ", 15, doc.internal.pageSize.height - 35);
                var fechimpre = "Fecha de impresión: " + $scope.datos[0].fecha_trans.substr(0, 10);
                doc.text(fechimpre, doc.internal.pageSize.width - 120, doc.internal.pageSize.height - 35);                
            };

            var getColumns = function () {
                return [
                    {title: "ID", dataKey: "id"},
                    {title: "CODIGO", dataKey: "codigoaf"},
                    {title: "DESCRIPCION", dataKey: "descripcion"},
                    {title: "OTR. CODIGOS", dataKey: "codigos"},
                    {title: "OBSERVACIONES", dataKey: "observeciones"},
                ];
            };

            // Uses the faker.js library to get random data.
            function getData() {
                var size = Object.keys($scope.datos).length;
                var data = [];
                for (var j=0; j<size; j++) {
                    data.push({
                        id: j+1,
                        codigoaf: $scope.datos[j].codigoaf,
                        descripcion: $scope.datos[j].tipoactivo + ' ' + $scope.datos[j].descripcion,
                        codigos: $scope.datos[j].codigo + ', ' + $scope.datos[j].codigoold,
                        observeciones: $scope.datos[j].obstrans,
                    });
                }
                return data;
            }

            doc.autoTable(
                getColumns(), 
                getData(), 
                {
                    tableWidth: 582,
                    beforePageContent: header,
                    afterPageContent: footer,
                    margin:{horizontal:15,top:150,bottom:60},
                    headerStyles: {
                        font: 'tahoma',
                        rowHeight: 10, 
                        fontSize: 8, 
                        valign: 'middle', 
                        halign: 'middle', 
                        textColor: 0, 
                        fillColor: [255, 255, 0]
                    },
                    bodyStyles: {
                        rowHeight: 10, 
                        fontSize: 7.695652173913, 
                        valign: 'top'
                    },
                    theme:'grid',
                    styles: {
                        overflow:'linebreak',
                        cellPadding: 2,
                    },
                }
            );
            $scope.PDFfirmas(doc);

            if (typeof doc.putTotalPages === 'function') {
                doc.putTotalPages(totalPagesExp);
            }
            // $scope.PDFregla(150,155,doc);
            doc.save(s+'-'+da+'-'+form+'.pdf');
        });
        obj.error(function(error) {  
        });
    }

    $scope.PDFfecha = function (x,y,doc) {
        // RECUADROS
        doc.rect(x, y, 19, 10);
        doc.rect(x+19, y, 19, 10);
        doc.rect(x+38, y, 19, 10);
        doc.rect(x, y+10, 19, 10);
        doc.rect(x+19, y+10, 19, 10);
        doc.rect(x+38, y+10, 19, 10);

        doc.rect(x, y+22, 28, 9);
        doc.rect(x+28, y+22, 29, 9);
        
        //DIVIDO LA FECHA DE ASIGNACION POR PARTES
        doc.setFontSize(6);
        doc.setFontStyle('normal');
        doc.text('FECHA ASIGNACIÓN',x,y-1);
        var f = $scope.datos[0].fecha_trans;
        var anio = f.substr(6, 4);
        var mes = f.substr(3, 2);
        var dia = f.substr(0, 2);
        doc.setFontSize(8);
        doc.setFontStyle('normal');
        doc.text('DIA',x+2,y+8);
        doc.text('MES',x+20,y+8);
        doc.text('AÑO',x+39,y+8);
        doc.text(dia,x+5,y+18);
        doc.text(mes,x+24,y+18);
        doc.text(anio,x+39,y+18);
        doc.setFontSize(6);
        doc.text('PAGINA',x+2,y+29);
    }
    $scope.PDFregla = function (x,y,doc) {
        doc.setLineWidth(0.5);
        doc.rect(15, x, 10, 10);
        doc.rect(25, x, 10, 10);
        doc.rect(35, x, 10, 10);
        doc.rect(45, x, 10, 10);
        doc.rect(55, x, 10, 10);
        doc.rect(65, x, 10, 10);
        doc.rect(75, x, 10, 10);
        doc.rect(85, x, 10, 10);
        doc.rect(95, x, 10, 10);
        doc.rect(105, x, 10, 10);
        doc.rect(115, x, 10, 10);
        doc.rect(125, x, 10, 10);
        doc.rect(135, x, 10, 10);
        doc.rect(145, x, 10, 10);
        doc.rect(155, x, 10, 10);
        doc.rect(165, x, 10, 10);
        doc.rect(175, x, 10, 10);
        doc.rect(185, x, 10, 10);
        doc.rect(195, x, 10, 10);
        doc.rect(105, x, 10, 10);
        doc.rect(215, x, 10, 10);
        doc.rect(225, x, 10, 10);
        doc.rect(235, x, 10, 10);
        doc.rect(245, x, 10, 10);
        doc.rect(255, x, 10, 10);
        doc.rect(265, x, 10, 10);
        doc.rect(275, x, 10, 10);
        doc.rect(285, x, 10, 10);
        doc.rect(295, x, 10, 10);
        doc.rect(205, x, 10, 10);
        doc.rect(315, x, 10, 10);
        doc.rect(325, x, 10, 10);
        doc.rect(335, x, 10, 10);
        doc.rect(345, x, 10, 10);
        doc.rect(355, x, 10, 10);
        doc.rect(365, x, 10, 10);
        doc.rect(375, x, 10, 10);
        doc.rect(385, x, 10, 10);
        doc.rect(395, x, 10, 10);
        doc.rect(305, x, 10, 10);
        doc.rect(415, x, 10, 10);
        doc.rect(425, x, 10, 10);
        doc.rect(435, x, 10, 10);
        doc.rect(445, x, 10, 10);
        doc.rect(455, x, 10, 10);
        doc.rect(465, x, 10, 10);
        doc.rect(475, x, 10, 10);
        doc.rect(485, x, 10, 10);
        doc.rect(495, x, 10, 10);
        doc.rect(405, x, 10, 10);
        doc.rect(515, x, 10, 10);
        doc.rect(525, x, 10, 10);
        doc.rect(535, x, 10, 10);
        doc.rect(545, x, 10, 10);
        doc.rect(555, x, 10, 10);
        doc.rect(565, x, 10, 10);
        doc.rect(575, x, 10, 10);
        doc.rect(585, x, 10, 10);
        doc.rect(595, x, 10, 10);
        doc.rect(505, x, 10, 10);
        doc.rect(615, x, 10, 10);
        doc.setFontSize(5);
        doc.text('15',15,y);
        doc.text('25',25,y);
        doc.text('35',35,y);
        doc.text('45',45,y);
        doc.text('55',55,y);
        doc.text('65',65,y);
        doc.text('75',75,y);
        doc.text('85',85,y);
        doc.text('95',95,y);
        doc.text('105',105,y);
        doc.text('115',115,y);
        doc.text('125',125,y);
        doc.text('135',135,y);
        doc.text('145',145,y);
        doc.text('155',155,y);
        doc.text('165',165,y);
        doc.text('175',175,y);
        doc.text('185',185,y);
        doc.text('195',195,y);
        doc.text('205',205,y);
        doc.text('215',215,y);
        doc.text('225',225,y);
        doc.text('235',235,y);
        doc.text('245',245,y);
        doc.text('255',255,y);
        doc.text('265',265,y);
        doc.text('275',275,y);
        doc.text('285',285,y);
        doc.text('295',295,y);
        doc.text('305',305,y);
        doc.text('315',315,y);
        doc.text('325',325,y);
        doc.text('335',335,y);
        doc.text('345',345,y);
        doc.text('355',355,y);
        doc.text('365',365,y);
        doc.text('375',375,y);
        doc.text('385',385,y);
        doc.text('395',395,y);
        doc.text('405',405,y);
        doc.text('415',415,y);
        doc.text('425',425,y);
        doc.text('435',435,y);
        doc.text('445',445,y);
        doc.text('455',455,y);
        doc.text('465',465,y);
        doc.text('475',475,y);
        doc.text('485',485,y);
        doc.text('495',495,y);
        doc.text('505',505,y);
        doc.text('515',515,y);
        doc.text('525',525,y);
        doc.text('535',535,y);
        doc.text('545',545,y);
        doc.text('555',555,y);
        doc.text('565',565,y);
        doc.text('575',575,y);
        doc.text('585',585,y);
        doc.text('595',595,y);
        doc.text('605',605,y);
        doc.text('615',615,y);
    }
    $scope.PDFfirmas = function (doc) {
        doc.setFontSize(10);
        doc.setFontStyle('bold');
        doc.text("El presente formulario no constituye la totalidad de los bienes asignados al funcionario", 150, doc.internal.pageSize.height - 55);
        doc.setLineWidth(2);
        doc.line(15, doc.internal.pageSize.height - 170, 597, doc.internal.pageSize.height - 170);
        doc.rect(doc.internal.pageSize.width - 270, doc.internal.pageSize.height - 165, 255, 100);
        
    }
    // PROCEDIMINETOS CUANDO SE INGRESA AL FORMULARIO O SE HACE F5
	$scope.$on('api:ready',function(){
		//$scope.Cargarfuncionarios();
		//$scope.datos.agregado = "false";
        $scope.getAD();
	});
	$scope.inicioDagPrueba = function () {
		if(DreamFactory.api[CONFIG.SERVICE]){
			//$scope.Cargarfuncionarios();
			//$scope.datos.agregado = "false";
            $scope.getAD();
		}
	}; 
});