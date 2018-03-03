app.controller('SeguroController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
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
  $scope.fechini = '';
  $scope.fechfin = '';
  $scope.gestion = fecha.getFullYear();
  $scope.listado=function(){
    var doc = new jsPDF('p', 'pt');
    var colser = [
    {title: "Codigo", dataKey: "uno"},
    {title: "Nombre del Bien Inmueble", dataKey: "dos"},
    {title: "Dirección", dataKey: "tres"},
    {title: "Valor", dataKey: "cuatro"},
    {title: "Gestión", dataKey: "cinco"}
    ];
    var dataser=[];
    for (var i=0; i<$scope.grupos.length;i++){
      var aporte = {"uno":$scope.grupos[i].codigo ,"dos":$scope.grupos[i].nombre,"tres":$scope.grupos[i].direccion ,"cuatro":$scope.grupos[i].valor,"cinco":$scope.grupos[i].gestion };          
      dataser[i]=aporte;      
    }
    var header = function (data) {
      doc.setFontSize(8);
      doc.setTextColor(0);
      doc.setFontStyle('normal');
      doc.text('GOBIERNO AUTONÓMO MUNICIPAL DE LA PAZ', 40, 65);
     };
    var totalPagesExp = "{total_pages_count_string}";
    var footer = function (data) {
      var str = "Pagina " + data.pageCount;
      if (typeof doc.putTotalPages === 'function') {
        str = str + " de " + totalPagesExp;
      }
      doc.text(str, 40, doc.internal.pageSize.height - 30);
      doc.text("Gobierno Autonomo Municipal de La Paz Tel. 2-2440709 ", 40, doc.internal.pageSize.height - 45);
    };
      doc.setFontSize(7);
    doc.text("Fecha de Inicio: "+$scope.fechini,40,80);

    doc.text("Fecha de Fin: "+$scope.fechfin,200,80);
    doc.autoTable(colser, dataser, {startY: 110,theme: 'mary',bodyStyles: {rowHeight: 12, fontSize: 9, valign: 'middle'},beforePageContent: header,afterPageContent: footer,margin: {horizontal: 30, top: 140, bottom: 75},styles: {overflow: 'linebreak'}});
    doc.setFontSize(9);
    doc.setFontStyle('normal');
    var text="Se encuentran "+$scope.grupos.length+" inmuebles para el seguro.";
    doc.text(text,35, doc.autoTableEndPosY()+20);
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
    doc.save('seguros'+$scope.gestion+'.pdf');
  };
  $scope.getMostrarTabla= function(registro){
    $scope.fechini=$filter('date')(new Date(registro.FECHA1), 'yyyy-MM-dd');
    $scope.fechfin=$filter('date')(new Date(registro.FECHA2), 'yyyy-MM-dd');
    $scope.TablaCreacion = true;
    var reslocal = {
      "procedure_name":"ubi.sp_carga_tabla_seguro",
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
        ] 
      }
    };
    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
    obj.success(function (response) {
      $scope.grupos = response; 
    })
    obj.error(function(error) {
    });
  }
  $scope.$on('api:ready',function(){      
  });  
  $scope.inicioCrear = function () {
  }; 
});