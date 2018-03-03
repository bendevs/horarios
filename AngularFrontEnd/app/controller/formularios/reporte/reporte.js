app.controller('ReporteController', function ($scope,$location,$route,CONFIG,DreamFactory,sessionService,ngTableParams,$filter,sweet) {
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
  $scope.filename = "Reporte";
  $scope.registro = {};
  $scope.tablaReporte = null;

  $scope.getProcedimiento = function(locid){
    var reslocal = {
      "procedure_name":"sp_lst_proceso",
      "body":{
        "params":[
          {
            "name":"wsid",
            "param_type":"IN","value":locid
          }]
      }
    };
    DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal)
    .success(function (response){
      $scope.proc = response;
    })
    .error(function(error){
      $.unblockUI(); 
      $scope.errors["error_reg_localidad"]=error;
    });        
  };
    
  $scope.getCasos = function(sec1id){
    var reslocal = {
      "procedure_name":"sp_lst_formularioproceso",
      "body":{
        "params": [
          {
            "name":"procid",
            "param_type":"IN","value":sec1id
          }] 
      }
    };
    DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal)
    .success(function (response){
      $scope.casos = response;             
    })
    .error(function(error){              
      $scope.errors["error_reg_localidad"]=error;
    });        
  };

  $scope.cargarDatos = function(sec1id,fecini, fecfin){        
    console.log("DAtos", sec1id,fecini,fecfin);
    $scope.TablaCreacion = true;
    var reslocal = {
      "procedure_name":"sp_casos_lst3",
      "body":{
        "params": [
            {
              "name":"gtipo",
              "param_type":"IN","value":sec1id
            },
            {
              "name":"fechini",
              "param_type":"IN","value":fecini
            },
            {
              "name":"fechfin",
              "param_type":"IN","value":fecfin
            }
            ] }
        };
        var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
        obj.success(function (response) {
            $scope.obtCreacion = response; 
        })
        obj.error(function(error) {
           
            $scope.errors["error_creacion"] = error;         
        });        
        
    };

    $scope.recuperaJSON = function(id)
    {
      var resDatos = {
                    "table_name":"_fr_casos",
                    "filter": "cas_id =" + id
                    
                };
            var obj=DreamFactory.api[CONFIG.SERVICE].getRecordsByFilter(resDatos);
            obj.success(function (response) {

              console.log("respuesta--->:", response);
                resultado = response.record[0].cas_datos;
                console.log("resultado-->",resultado);
                $scope.datadocumentos = JSON.parse(response.record[0].cas_datos);  
                console.log("lo que sale de json",$scope.datadocumentos); 
               });
        obj.error(function(error) {
           
            $scope.errors["error_creacion"] = error;         
        }); 
      };

   $scope.getCampos = function(seclid,campo){
      $scope.recuperaJSON(seclid);
        ind = 0; 
        $scope.indices = []; 
        $scope.seleccionar = [];
        $.blockUI();
        $scope.idfd = campo;
        $scope.panelVerCampos = true;
        $scope.descripcion=[];
        var resCampos = {
            "procedure_name":"sp_lst_campos",
            "body":{
                "params": [
                    {
                        "name": "idcampo",
                        "value": campo
                    }
                ]
            }
        };

        DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(resCampos)
        .success(function (results) {
          console.log("get campos--->:", results);
          var i = 1;
         
            if (results.length>0) {
                if (results[0].sp_lst_campos != '') {
                  datos = JSON.parse(results[0].sp_lst_campos);                             
                  var vectorCampos = [];
                  angular.forEach(datos,function(celda, fila){
                    var objetoCampo = {};
                    var codigo = celda['campo'];   
                    var reslocal = {
                      "procedure_name":"sp_casos_lst4",
                        "body":{
                          "params": [
                            {
                              "name":"codigo",
                              "param_type":"IN","value":codigo
                            },
                            {
                                "name":"caid",
                                "param_type":"IN","value":seclid
                            },
                            {
                                "name":"fila",
                                "param_type":"IN","value":fila
                            }
                          ] }
                    };
                    var obj=DreamFactory.api[CONFIG.SERVICE].callStoredProcWithParams(reslocal);
                    obj.success(function (response) {
                      console.log("sp_4 lista 4", response);
                    $scope.descripcion = response[0] ;
                    objetoCampo.titulo = $scope.descripcion.titulo;
                    objetoCampo.descripcion= $scope.descripcion.descripcion ;
                    })
                    obj.error(function(error) {
                      $.unblockUI(); 
                      $scope.errors["error_creacion"] = error;   
                                
                    });
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


  
  

  $scope.ejemplo=function(){
    $scope.obtpdf = $scope.obtCreacion;
    var columns = [
        {title: "#", dataKey: "#"},
        {title: "Codigo", dataKey: "codigo"}, 
        {title: "Informacion General", dataKey: "infgen"}, 
        {title: "Fecha Creacion", dataKey: "fcrea"},
        {title: "ubicacion Anterior", dataKey: "ubiant"},
        {title: "Ubicacion Actual", dataKey: "ubiact"}
      ];
    var data=[];
    i=0;
    angular.forEach($scope.obtpdf,function(celda, fila){            
      var aporte = {};
      aporte['#'] = i+1;
      aporte['codigo'] = celda['cod'];
      aporte['infgen'] = celda['infgral'];
      aporte['fcrea'] = celda['feccrea'];
      aporte['ubiant'] = celda['ubicant'];
      aporte['ubiact'] = celda['ubicact'];            
      data[i]=aporte;
      i++;
    });
    var doc = new jsPDF('p', 'pt');
    var columnsLong = columns;

    var header = function (data) {
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 40, 25, 25);
        doc.text("BIENES INMUEBLES ARQUEOLOGICOS", data.settings.margin.left + 35, 60);
    };

    var totalPagesExp = "{total_pages_count_string}";
    var footer = function (data) {
        var str = "Pagina " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
        }
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
        doc.text("OFICIALIA MAYOR DE CULTURAS. TEL. 2-2202559 AV. 6 DE AGOSTO", data.settings.margin.left, doc.internal.pageSize.height - 45);
    };

    var options = {
        beforePageContent: header,
        afterPageContent: footer,
        margin: {horizontal: 30, top: 80, bottom: 40},
        styles: {overflow: 'linebreak'},
        columnStyles: {codigo: {columnWidth: 'wrap'}}
         } ;
    doc.autoTable(columnsLong, data, options);

    doc.autoTable(columnsLong, data, options);
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }
    doc.save('hola'+'.pdf');
  }

  $scope.ejemplo2=function(){
    // $scope.obtpd = $scope.obtCampos;
    // var columns = [
    //   {title: "#", dataKey: "#"},
    //         //{title: "Operador", key: "operador"},
    //   {title: "Titulo", dataKey: "tit"}, 
    //   {title: "Descripcion", dataKey: "des"}, 
            
    // ];
    // var data=[];
    // i=0;
    // angular.forEach($scope.obtpd,function(celda, fila){            
    //   var aporte = {};
    //   aporte['#'] = i+1;
    //         //aporte['operador'] = celda['nombre_operador'];
    //   aporte['tit'] = celda['titulo'];
    //   aporte['des'] = celda['descripcion'];            
    //   data[i]=aporte;
    //   i++;
    // });
    // var doc = new jsPDF('p', 'pt');
    // var columnsLong = columns;

    // var header = function (data) {
    //     doc.setFontSize(20);
    //     doc.setTextColor(40);
    //     doc.setFontStyle('normal');
    //     //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 40, 25, 25);
    //     doc.text('Arqueologia', data.settings.margin.left + 35, 60);
    // };

    // var totalPagesExp = "{total_pages_count_string}";
    // var footer = function (data) {
    //     var str = "Pagina " + data.pageCount;
    //     // Total page number plugin only available in jspdf v1.0+
    //     if (typeof doc.putTotalPages === 'function') {
    //         str = str + " de " + totalPagesExp;
    //     }
    //     doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
    //     doc.text("OFICIALIA MAYOR DE CULTURAS. TEL. 2-2202559 AV. 6 DE AGOSTO", data.settings.margin.left, doc.internal.pageSize.height - 45);
    // };

    // var options = {
    //     beforePageContent: header,
    //     afterPageContent: footer,
    //     margin: {horizontal: 30, top: 80, bottom: 40},
    //     styles: {overflow: 'linebreak'},
    //     columnStyles: {codigo: {columnWidth: 'wrap'}}
    //      } ;
    // doc.autoTable(columnsLong, data, options);

    // // Total page number plugin only available in jspdf v1.0+
    // if (typeof doc.putTotalPages === 'function') {
    //     doc.putTotalPages(totalPagesExp);
    // }
    // doc.save('ficha'+'.pdf');

      console.log($scope.datadocumentos);   

        $scope.obtpdf = $scope.datadocumentos; //datos;

        var doc = new jsPDF('p','','letter');
        {
            // var imgGAMLP = 'data:image/jpeg;base64,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';
            // doc.addImage(imgGAMLP, 'PNG', 15, 10, 25, 25);

            var imgMovilidad = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCACLAx4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD99KKKKACviL4/f8lr8Tf9fzfyFfbtfEXx+/5LX4m/6/m/kK/lv6Vf/Igwf/X7/wBskfpfhh/v9X/B/wC3I5Ciiiv4TP20KKKKACiiigAooooAR/uH6V93fCr/AJJh4c/7Blv/AOi1r4Rf7h+lfd3wq/5Jh4c/7Blv/wCi1r+sfoof8jTH/wDXuH/pTPy7xQ/3Wh/if5G/RRRX9vn4wFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVOn3B9KgqdPuD6UAQUUUUAFfEXx+/wCS1+Jv+v5v5Cvt2viL4/f8lr8Tf9fzfyFfy39Kv/kQYP8A6/f+2SP0vww/3+r/AIP/AG5HIUUUV/CZ+2hRRRQAUUUUAFFFFACP9w/Svu74Vf8AJMPDn/YMt/8A0WtfCL/cP0r7u+FX/JMPDn/YMt//AEWtf1j9FD/kaY//AK9w/wDSmfl3ih/utD/E/wAjfooor+3z8YCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKnT7g+lQVOn3B9KAIKKKKACviL4/f8AJa/E3/X838hX27XxF8fv+S1+Jv8Ar+b+Qr+W/pV/8iDB/wDX7/2yR+l+GH+/1f8AB/7cjkKKKK/hM/bQooooAKKKKACiiigBH+4fpX3d8Kv+SYeHP+wZb/8Aota+EX+4fpX3d8Kv+SYeHP8AsGW//ota/rH6KH/I0x//AF7h/wClM/LvFD/daH+J/kb9FFFf2+fjAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABU6fcH0qCp0+4PpQBBRRRQAV8R/H5c/GvxN/1/N/IV9uV8S/Hz/ktPib/AK/m/kK/lv6Vf/Igwf8A1+/9skfpfhj/AL9W/wAH/tyOO2GjYafQBuOByT0FfwmftVxmw0bDXI+CPjr4f+JvjfVtE8Ozyaz/AGB8mp39uubKzmJwsHmHiSU4YkJkKFOSOBXY10YnC1sPP2deLjKydno7PVabq61V+lnszatRq0ZclWPK9HZ766rTzWvpqM2GjYafRXOY3GbDRsNPooC5G6HYfpX3Z8KG3/C7w4R/0DLf/wBFrXws/wBw/Svuf4R/8kq8N/8AYMt//Ra1/V/0UH/wrY9f9O4/+lM/MPE/XC0P8T/I6Kiiiv7hPxkKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqdPuD6VBU6fcH0oA/mn/4iH/2uP+ik6Z/4S+m//GaVf+Dh79rkn/kpOmf+Evpv/wAZr4npU+9X16wtH+RfcfnDx+J/5+S+9n2z/wARDv7XH/RSdM/8JfTf/jNfoN+yp8ZfEX7Q/wCzh4N8c+Lb1NS8TeKNOW+1K6S3SBZ5izAsI0AReAOFAFfhHX7af8E6f+TFvhb/ANgKP/0N6/kv6YFGnDhnBOEUn9YXT/p3UP2PwUxVapm1eNSba9n1f96J7RXlP7bHxdm+Cn7NuvataeYNQuzHpdk6ts8qa4bYHLdgq7j+Fa37Tv7QOn/szfB3UfFN9Et5NDtgsLHzRG1/cP8AdjB7ADLMQDhVNfnX8Yf2g/GH7QWruvjTVby5t9Ttnez8OaQpW209kHmI7LyBIMD7299r8lc4r+R/DbgDGZ1iqePlFfV6c1e/2+WzlFLtbdu0el76H9RfXcqymjDOOIK8aGFjOMbu/NNt/DTjFOU5d1FOy1Pr/wD4Joavp9z8P/FdnbXjTXVtrBeWJoVi/dBRBHKqgZCsYXUDsIxn5ic/Stfk98PvjHqvwg8RaVq+h3OreGfEy8B9QRX07UIuA0VyRs+VyqseDtYlsqWyPu39jf8AbSt/2moL/SNX06Dw7410Zd93pscpeK4iyB50JPOASAwOcblIJBzXteKnh/mOExdXOqUeahKze147R6aSjf7Udr623fzfCWcUs+y6eMw2JWIqUm1W0lGUW5NRk4TUZRjNWlBW91PkdnFo90ooor8SPaCiiigBVXcwB7nFfnh8X/8AguV+058Kvi34p8L6F4+0+z0Tw5q1zpmnwN4dsJTDbwytHGpdoizYVQMkknvX6Hx/6xfrX4eftRf8nN/ET/sZL/8A9KHr+y/ob0qdTN8y50n+7hv/AI2fhHjtiatHA4V0pON5y2dvsn0oP+Dgf9rD/oo2m/8AhMad/wDGafH/AMHAn7V7r/yUXTf/AAmdO/8AjNfF1Swfc/Gv7+WDoW+Bfcj+ZXmmM/5+y/8AAmfZ6f8ABwB+1ef+ai6b/wCEzp3/AMapyf8ABf8A/aub/moum/8AhM6d/wDGq+M46dF2qvqeH/kX3Iz/ALUxv/P2X/gT/wAz7NH/AAX8/atP/NRNN/8ACZ07/wCNU8f8F+f2rP8Aooum/wDhM6d/8ar40HWn1SwWH/kX3Iyea43/AJ/S/wDAn/mfZY/4L7/tVj/momm/+E1p/wD8apy/8F9f2qyP+Siad/4TWn//ABqvjanp92n9Sw/8i+5GbzbHf8/pf+BP/M+yT/wXz/aoQZPxE03Hv4a0/wD+NU5f+C+P7VLf81D03/wmtP8A/jVeN/s7/Dr/AIRfXNK8S65bpP8A2jBN/YekLZfbrvUpCpVZvIIKCIZYhpPvYyqng1xXxN+H3/CLXp1KxuLe/wDD+qXMv2K4gDL5XzE+RLG3zRyKuODkEDIJrxsPj8vq42WDjBabSto5XleKdrXVu+r5lvCR6Ff+1aWFWKdaevTmd0tLN67O/bs/tI+nU/4L2/tUEf8AJQ9O/wDCa0//AONUq/8ABez9qcsP+Lhad/4TWn//ABqvjtOlOT74+te79Rw//PtfcjxXnGP/AOf0/wDwJ/5n2Sv/AAXm/alJ/wCShad/4Ten/wDxqnj/AILy/tSE/wDJQdO/8JvT/wD41Xx4nWnjrR9Rw/8Az7X3IX9sY/8A5/T/APAn/mfYSf8ABeD9qQn/AJKDp3/hN6f/APGqeP8Agu/+1Hj/AJKBp3/hOaf/APGq+P0606msDhv+fa+5GbznMLfx5/8AgT/zPsAf8F3P2osf8lA0/wD8JzT/AP41T/8Ah+z+1D/0UDTv/CcsP/jVfIA6VJV/UcN/z7j9yMXneY2/jz/8Cf8AmfXqf8F2P2oT/wA1A07/AMJyw/8AjVOX/gut+1Ax/wCR/wBP/wDCcsP/AI1XyFHUidav6hhv+fcfuRhLPMx/6CJ/+BS/zPrxP+C6X7T5/wCZ/wBP/wDCcsP/AI1Tv+H6P7T/AP0P+n/+E5Yf/Gq+RY6dV/2fhf8An3H7kYTz7Ml/zET/APApf5n12P8Aguf+07/0P2n/APhO2H/xqnj/AILm/tOEf8j9p/8A4Tth/wDGq+RakHSq/s/C3/hx+5GH9v5nb/eJ/wDgUv8AM+uf+H5X7Tf/AEPun/8AhO2H/wAapy/8Fxv2mz/zP2n/APhO2H/xqvkipE7U/wCzsL/z7j9yMZcQZpf/AHmp/wCBy/zPrYf8FxP2mh/zPun/APhO2H/xqpB/wXB/aZz/AMj7Yf8AhPWH/wAar5JqUdatZdhP+fcfuRlLiLNb/wC81P8AwOX+Z9Z/8Pv/ANpj/ofLD/wnrD/41T/+H3n7S/8A0Plh/wCE9Y//ABqvkypKr+zsJ/z6j9yMp8R5r/0E1P8AwOX+Z9Yx/wDBbv8AaWY/8j3Yf+E9Y/8AxqpP+H2/7Sv/AEPdh/4T1j/8ar5Ni61LVf2bhP8An1H7kYPiTNrf71U/8Dl/mfV6/wDBbX9pVv8Ame7D/wAJ+x/+NU9f+C2X7ShH/I92H/hP2P8A8ar5PjqVPu0/7Nwlv4UfuRj/AKy5v/0FVP8AwOX+Z9XJ/wAFr/2k2/5nqw/8J+x/+NVJ/wAPrP2kv+h6sP8Awn7H/wCNV8oxf1qWj+zcJ/z6j9yM3xNnH/QVU/8AA5f5n1Un/Bav9pFn/wCR5sP/AAn7H/41Tv8Ah9T+0gW/5Hqw6/8AQAsf/jVeR/sWfCvQPjf+1X4H8KeKLprTQtb1DybrbL5LXGI3dLdX/gMrqkQbt5nHOK+mLn4Nz/HX4J+O/tngT4AeC5fC2l3V+2nQW+paJ4i8EC3dgBdTeQ8dyzbQNkrnzNwKlc8ctelgaU+R0Y9Oi6u39f8ABPXwGLz3F0XWhjKi1aS556uKTfXTRq3fXom1wv8Aw+o/aPz/AMjzYf8Aggsf/jdPX/gtL+0cSP8AiubD6f2BY/8Axuux8V+HLD4NfH/wb8KfDXwL8LePfBfiG00thq97o811qvi2O6iiea9gv0b/AEcIXcKI8LH5R3V7F4b/AGWfhXafDGy+H+naX4W8Sahr114003Qrm50Jpr/WZrGeQWkh1iLi0EGMFmUrJjsK551MBBRk6Cs9tI7a6vtt1/R276GG4grznThj53ho7zmvevFJK796/MtV8k7xv84D/gtH+0b38c2H/ggsf/jdKv8AwWh/aNP/ADPNh/4ILH/41XtPw8+Fvgjwv4T1TWLnRvAOlyaf8HvB2rDUNa8KnW7O3vLm5ljuLl7SJS8kkowpZRnO0nha1vgn8LPA+v8A7N+l+Ltf0P4QX3hFdR8T3/jKc+GJYdX1DToLoRwS6VDGvnW6xs6/KSvlB03cA0pVMCk39XW6Wy3tfsEMHn82o/2jNNxcvjlolJQu/eulfVu1rJ7vQ8B/4fP/ALRh/wCZ4sP/AAQWP/xupI/+Czf7RTLz43sOv/QBsf8A43Xtnw5/Zj+Hfxc8Z/s56VpXhrSbfxNpugaH4n1qymij8vxdpFzK8Vy0qY2yXFu6RyNnJeOaQ87K8m8aWlj+zP8ACbwXqvhD4V+EvHk3jm51KbVtX1vRJNZiguI76WFdIgiUhbfZGik4HmNvypAFaweAnLkjQXN6RXf9F/Wpw14cQUabr1MwnyJXup1H/J0T3Tmk9tr7NXzx/wAFmP2is/8AI7WP/ghsv/jVPX/gsr+0ST/yO1j/AOCGy/8AjdcR+2d8CrHwR+03p/hjwfo02m3/AIj03Srt/DQkaZ9D1O9jUvpwY5b5HZcBuVDgHpX0j8a/2LPDHg63+HL6VpnhiaL4beLNH8PeJ7m11K1vT4ksrmS2Wa+u4o3Zott6Z4NswB8uRB2wNJrLoqDdKPv67L+t9P8AgHJQnxNVnXhHGVP3Ls/fnrrrb0Scne1rW3aR5OP+Cyf7RBH/ACO1h/4IbL/43VrR/wDgr3+0n4h1O2sbDxZFfX15KsNvbW3hyzlmnkY4VERYiWYnoAM10cvgfS/g9D8f9ck8D+HHm0H4p6dpGhw61oiTWkVtLdXaSQRI4AKeSY22qcYCHsK6b40aRovgfx58cPGfhv4ceDtX8QfCvxJaeHNG0a00fZZaJYOJJG1ae2hI+0S78RCRvlXgkcVH+xX5Y0I/dHd8v/yS/E3/AOF5Q56mYVFa91zTvZe0u1rq7U5NK3VdLtcF4z/4Ku/tPfDnxRe6Jr3iaDS9X05xHdWk+g2PmQMQG2tiMgHBHHb61mr/AMFj/wBogn/kdrH/AMENl/8AG69V+AHw38JePtb+GfxD8VfDLw3ous67a+Jvt/hlLE2+meIray09p4dRS1k3CEmTMZZflZgGAq98JP2Lvhx4q+G+gXv2GDVPCXjjxx/avhq4MqQ6hqVl/Y9zOmiPP95HF5C1u4ByWTI5YVDqZfBWqUFdf3Vvdp2+6/p6MqGF4lrtSw2YTtJ6J1J3UWoOLe386T00fTVX8eH/AAWO/aH/AOh1sP8AwQ2X/wAbpV/4LG/tDMP+R1sP/BFZf/G6ueGbaD9o/wCG/wAUk8XfCbwp8OYPAOhy6pp+s6PokukSaVfRyokWm3BZsXHnbim18yZBYe3t3xx/Zg+H1t+1ZB42s/C+kWPgT4eNJpninRILdEtLnUo1tjYIYwNuLo38AIxz9nkzWk5YCnLknQjfXpF9E0vne3r6o4qNLiTEUfrFDMajheO86idm5KUrN7R5W3/du900vBh/wWL/AGhv+h2sf/BDZf8AxunL/wAFif2hj/zOtj/4IbL/AON13n7RfgvQ/wBmi28WeK/B3w38KeLb7UPiDrOiXj6lox1HT/CVvbOgtrWO1BEcbTKzOHYdBha8m/ar+GeieF/iJ8LNStfDVv4M1LxzpVlquu+FY9/k6TM90Y/kjcl4o5o1EgiYkrkjoa3oQwFW1qEbO9tI9N9P6/FHm5jX4kwimpZjUcoct1z1LWk7Rad7N90tVrvaVtw/8Fi/2hQf+R1sf/BFZf8Axugf8FjP2hSf+R1sf/BFZf8AxuvoLxv+y/8ADw/tsf8ACdQeFtHh+HWgX0nhrUtBS3RbKTXVvIbG2gMQG3Esd3Bc4xz5Mmawdb/Zz8NTftdfAOysvBely6BqeveJLbWI4dMVrW5S21a7RUnwu0iKJUGG+6oHYVzRr5a0n7BbX2juk3b10/FHp1ct4rhKSeZVNJqKtUqapzhBT32bl6+6zx7/AIfE/tCf9DrY/wDgisv/AI3SH/gsX+0ID/yOlj/4I7L/AON17J4D/Z0+H/xZuf2fdH0/w9o1v4titLDxPfR+Sgh8XaU2pyQ3sMi4xJLDHGkozndGZh/CKo6Z+zX4I8W3vgkN4U06+u4JPH+oW2jWqfZ38VXNhfgWWnsyYZkC5AUHO1Co61ftctTs6C6/Zj0v+fL/AJ7M5PqXFso88Mzm0+W37yp1dNNb3unUV1a7tpfmjfyof8Fiv2hCP+R1sf8AwRWX/wAboH/BYn9oT/odLL/wR2X/AMare/Z71gftC/GTwHa+J/gR4V0mwj8XWdlcazpOgzaZZRo5IawuoSGhm3dt+JBjqec9drVr8J/ht+yx4afxbp3gCJNd8N63ItomgSt4kv79b+5itJoLyNQsUcZVAfMbGFxtIxWtRYKElTeGTemyi979vTyODDT4hr0pYiGb1IwSbvKdSOzgteZrrNbX20u9DzVf+CxH7QZ/5nOy/wDBHZf/ABqlH/BYj9oIt/yOdl/4I7L/AONV3Gu/sP2um/sQNpP9j6GPiLp2iR+OZ75dStjqruxZpdKa13eeESxMc+Su3zA3rz4x+214H07whrvw6fR9JttOtNQ+HmhX1y9rb+XHc3MsDNJKxAwZGPJPU1thoZbWqckKMd2tl06/PoeZm+I4vy/DfWa+Pq/DB29pU+02nHfeNtfVWOw/4fD/ALQX/Q52f/gjsv8A41R/w+G/aC/6HOz/APBHZf8AxqvVPBPgPQPE/iH4G/Dyf4V+FdX8N+OPAlnqWv63BpZt9U0yVzcLJf8A25CNuwRoxEmVOCD94VyP7T2h+FPh9+yF4Is9K/4V/a6jrPhKzvJEbwfJJrWqObuRDdpqSr5cQZIwSrNuIVh/GKwh9QlUVNYeN2+y2110Xk/8ztrrielhamLlm1TlhFt/vJrVKD5VzSSfxqzTbvdWvvzaf8Fhf2gSP+Rzs/8AwR2X/wAapf8Ah8J+0D/0OVn/AOCSy/8AjVcXr/giwX/gn/4U1630mA6xN421O1ub+K2zO9ulnbssbuBnYGZiATgEmvb/AIg/sQ2ehfsWtpcWkaKvxB8NaRB4xvr2PUbZtTuGlLtd6a9sG89Ut7RreUFl27kkx97nWpDLYNc1GOsnHZdHa/psebhcRxjied0cfVajSjU/iVNeaPMorX4rXt00tvY4Uf8ABYP9oAn/AJHKz/8ABJZf/Gqd/wAPgf2gP+hzs/8AwR2X/wAarX/YT0zwfpn7OHi7xJ4pi+HcCWPirTLOW+8VaFJqqfZJIZmmt4ViUyLK4TKkEDKnkcV2n7NH7L/gD4k2njbxENH0uHwj8Rdfu/DvhM6xqNvZ3Gg6cqyk6jAs7hpZEna1jCoWfAkBz3yr/wBn0pTUsOrRdr8q1/pa/I7MvXFmNpYedDNanNVTly+1neKV0m0m3ZySjeyV2ul2vM/+HwP7QH/Q52f/AIJLL/41Un/D379oD/ocrP8A8Ell/wDGq0PhNp8/7P8A+zr49n8d+AvBmpf2TfXfhfQ4r3w9HcanfaxkiaQ3BBcW9qoLHoCzIoIOa+VlG1QOvHX1rroYLBVXJKjGye9lr+B83m/EfEuBp0ZTzGtzVFdxc5px1tr73XW3W2trNX+ml/4K+/H8n/kcrP8A8Ell/wDGqs2v/BXP4/Stz4xsv/BJZ/8Axuvl+P71X7A4b8a2lleCt/Cj/wCAo82jxxxG5a4+t/4Mn/mfVmlf8FWvjtdOA/i6zP8A3BbT/wCN102k/wDBTf41XRHmeKrQ/wDcItf/AIivlbw5bGVskhVzjJrttIsWS5jiT94zgEBRzzXkYnBYSLsqcfuR+i5HxNndSKc8XVfrOX+Z9N6P/wAFE/i9dkb/ABLbHP8A1C7Yf+yV1mj/ALdXxQuwN/iC3P8A3Dbf/wCJr5p0SJoZNrAqynBB7Gu78PLkLXlzwuHW0F9yP1LKs2x8/jrTfrJ/5nv1j+2X8RpwN2twH/twg/8Aia0Yv2vPiA/XWYf/AABh/wDia8h0teBWxDGVUZBAboSOtYfV6H8i+5H22HxeIa1m/vZ6cn7Wnj5h/wAhiH/wCh/+JqRP2sPHjHnWIR7/AGKH/wCJrzeNPlqRUpfV6H8i+5HfGvW/mf3s6T4dftjfFnWdP1J9dms9Mmh1W7htEjjgn861WUiGRsRrtJX+Hnp1Oa6D/hrDx7/0GIf/AACh/wDia8y0Ob7fFLsUlhdzxBRySVlZePypNQ1e30y7aCaTbKpw6gZ2H0OOhohh6NleK+5Gsq1ZvST+9npn/DWPj3/oMQ/+AUP/AMTQf2svH3/QYh/8Aof/AImvOoZUuYg8bB1PRgadt5q/q9D+RfciPrFb+Z/eeh/8NZ+Pf+gxD/4BQ/8AxNfWPw51a41/4e6DfXT+ZdXunW88zhQu53jVmOBwOSa+CsYr7t+EPHwn8Mf9gm0/9EpXk5rTpxhFwSR6WW1Jyk+Ztn8eNKn3qSlT71e3E+EkPr9tP+CdP/Ji3wt/7AUf/ob1+Jdftp/wTnG79hf4W/8AYDj/APQ3r+SPpif8kxgv+whf+m6h+z+B/wDyN6//AF7/APbonh3/AAVpWST4jfCZZ2/4lnmXRZJTi3eUyQD5s8Z29c/wk9s18K/Hi38WWv7PuvX/AIekuLbV5dZa11ea1JeWIbVYcckAky9OpTA5Civ0L+Nf7RfwW/b48Z67+z3pXiydfiZot5cyQRSaRcrFY3lkHEu6VkCMmA6ttbkHjJAr5e8X+CPG37Mvi+8i8VaHq2nXLq0Uuoafam707XIhjDu3Cnt83B6hkyTn838Ks5eBymjlGMpezxELSVOonF1IObnGSTV3GV2rpStKKb0P6NzfKpZ5VyvNMql7WWBeIhOnGoozSrwUfbUnK0FVpOztdSaV4+9ZP5S/Yn8VeLvEfgjxVb+K/t02j2MWUnvVYq1wNwQoTyTu2jPozjpkD7T/AOCfc95bftp+BVgt/NuH0Kdb8xgssFuYJNrE9vkEHXuwHtXDaHAfixqNtbaFovibxPqIYukFno3n28DHgcGTyxnuXjx9a97+H3xK+Gf/AASYSy1T42+KrrRvGXxFtZZre1h02fUPs0Ecil1kmgRt0m5kyPlRcYUHlj9F4hcRQxWAxGXYWg5YnEKSjRgnKTbhytqMU20lecpWSdkvV4DhvG5FmVXiTPK0Ip4X6rFSnzVanNU9p7SvzRg4cqtTpr3mlFe/sn940V8i+Hf+C7H7LXiTWrexj+JT2j3LhFlvNCv7eBCf70jRYUe54r6x0bWbPxHo9pqOnXdtf6ffwpcWt1bSiWG5icBkdHUkMrAggg4INfxjm/Deb5Ty/wBqYWpR5tueEoX9OZK5rhMxwuKv9WqRnbezT/Is0UUV4h2Cx/6xfrX4eftRf8nN/ET/ALGS/wD/AEoev3Dj/wBYv1r8PP2ov+Tm/iJ/2Ml//wClD1/Z/wBDP/kb5n/16h/6Wz8B8fP9wwn+OX/pJwtSwfc/Goqlg+5+Nf6BrY/l1ksdOi7U2OnRdqozJR1p9MHWn1SMZEldF8LPC1l438f6XpGoy3kFlfyOkr2gXzhiN2G3dwMlQMnOAScHpXO13/7NWhvqfxa069Zf+JZoW6/1SbzFX7NahSjPyRk5dVAGSSw+tefnFd0MBWqxlytQlZ+dna3ne1u70OnL6PtcXSptXTkrryvr8rb+R7xbatJ4n8fS3ehibwnEsDWMF9PqQgj06FY8bDIsXynHyZA6uo43Vz/igW2veHtX0fV9I1Kyj1Scak8qzq09vJv4ZQyAEZO0gkHqM5pYPFfhG21URtHrTXskMsCOQo2pJJHKQeqhv3I4J6bq0NK13wt8RNQurHTm1CxutXmmRXuF/cxy3FwbgMejYMh2gjjBzzX5TGg8O1UVGSjFR1968VF3Ur8zb72afpq7/qFWca0JUvaRblfS61bW1rWXy+/a3zJbv5kIPqM1In3x9aQ2kunyPb3EMttcW7GOWGVCjwuOCrKeQR6GlT74+tftl09Ufi7utGWU608daYnWnjrQSyVOtOpqdadTRk9iQdKkqMdKkqzB7Do6kTrUcdSJ1rQ557EkdOpsdOrQ55klSDpUdSDpVdTn6ElSJ2qOpE7VRjPckqUdaiqUdapGEtx9SVHUlUYzHxdalqKLrUtWYS2HR1Kn3aijqVPu1XQwJIv61LUUX9alpGTHwnEqkEgg5BBwQRyCPeu68d/tN/Ej4o+EoPD/AIl8e+L9f0K2KGOwv9VmngBX7pKs2GI7bs47VwkX+sFP/j/Gm4Rk02tgjXqwi4wk0pb2e/r3O78LftM/EfwP4Cl8K6N498X6V4amV0fTLTVZorba/wB9Qgb5Q2TkLgHJzTvD37SfxD8K/DVvBul+OPFGm+EpUkjfSLTUHhtGWQlpF2qRwxYkjvk561wtSJ2o9jTe8V3269zN47Eq1qktFbd7dvTy2PQ/CH7VHxL8B6kl3onjzxTpV1Hp1vo6S2t8yMtlb7vItgf+ece5tq9txqEftKfEN9atNSPjbxL/AGhp895c21x9tbfDLef8fbA+s/8Ay0zw3euITrSp0p+wpXb5V9xnLH4q3L7SVl/efr376+p1Nj8bvGWl+J9C1u28U65b6x4Xs10/R72K6ZJtLtlDhYYWH3IwHcbRxhz61o/DT9o74g/CJdR/4RXxv4p8OjV5jPerp+oyQLdSHrIyqcF+T82M+9cNUsH3Pxq3RptWcV9xzLG4iEuaNSSa832t+St6GzofjrW/DnjWHxJY6tqFt4ht7k3keprOxuknOSZfMOW38n5jzzT9B8bax4aOsjT9TvbP/hI7d7TVfKlK/wBows4dkl/vguA3PcZrHHWpE+9T5YvoZKtUW0n1699/v6nZeO/2gvHXxQ03TLTxN4z8Ta/a6I6vp8OoajJOlo4wFZAxPzdAD196k0/4u+P/AAn8UpvFFv4h8WaV401Nmkm1KOea3v7wvgHceGkDYHBBBwK9C/4J9arpmk/F3XWa60XT/GM3hu8i8EXusFBZWmtnZ5LM0n7tZCnmiNn+UOV74r6I+HE/j7w9omj2P7Qmq/bfEtx468Oy+BINY1GC+1m1nGoR/bZg8bs0dmYODvbYW27RXmV8TCjJ01BW7dXfeytql1+fY+my/Kq+OpxxMq81Jt+9ZuMXFac0uZOMntBW6pJ66fH2tfFr4l3fjyXxTqmu+Nn8SvZyW8mp3j3BuhaspjdN7jKxFWKkDC/NjvWPbeOPFFv8OINFj1PXY/CNlqP9owWyPILG3vcbfOQj5VlxxkHP419q+NfjPo3xK+K/7R8UmrePtS0/RPCeq2N3H4h1iK9VFGs23mR6fsVfLhKI21Dk8JzxSfGq8+N8vjnXtX+H3iTwp/woOTT2TRVl1LT18Jw6UYgFt5rWU8TjkMrR+b5mTUQx60jKEY+rsulktN9dF6muI4dfv1KeIqVFdr3Y80tXJOTXOvd9xcz72ufI3xI+PfxH+LGmWGleLfF3jHxBaW7JLZ2ep3s8yEnhHVGPzk/wtgk9jUOpfGXx34lutaa88R+Jb2bVbqDUdX3zSM1zPa4EM84/vRYADN93A9K+xI/D+i2/x18FfEjxBrmmaJoHwx+EXhy6t765he7ii1eaCSHT1MMeZJNkpMxRRkCHnGavaf8ADW2+IHxn+IvirwLqFl4ntfjP8JtXe3lsozZpd62kltBfQrFMVaMvOPNVHxxN6CpWY0opfu0lb5J72va23vEz4XxtSTf1lyk5Wte8nBJxU7c12uZumtOu+tj5X074ifEj4VaJ/wALG074mXWl6x45upPtEVjrUn9q6gFLb7m5RRsChwQN7b8sCFwc1574h8S61rni241fWb7VLvXZ5luZ7y+ld7t5eGV2Z/mz0IJ9q+x9N+AEeseCv2b/AA54/wDL0XRvAUXijWPGMVxKrGxs7XUI5ZI2CFsmQ7IwFyT5nGa4n/goZJo/xy8OeH/i/oXibSPFd3dTSeG/FF1p+nTadGl3Huls38iYCQA2jLFuxtJtxzk1vh8bTlVUVHe6ul2bUVe3VLv2tuebmmQYmGDlVlVfuKEuST1blCEqklFyveMppaR2Um2mtfCtT+NHjwzSXF34k8Sg6nqsXiJ5Jp5FF3fx8R3uTw0i8YcdOPar9l+0B8UNAtdY0SDxb42sYvE9xJc6lYJeTxf2jNOcyO8fBZpMncQPmzzmvs7WdM8KfF/4PfBrTPEtzp8MPwj8EaR48n3yLvv9MCTrfWY9XMttZYXr+8ap/G/iLT7v9qbVfjr4o8Q6P4Yl0jwRocek311ZyX1vDr9/Yko32eIM8ghTznIA4JQmsFmVN+66Wqv990opadfw8zvlwpiY2qrGuzcdb2tFxbqN3kkuWzSTfv73R8KWPxU8Yadf6Dq9truvQXHhCNbLR7yOZ1OkICzLDE4+4Pmc7f8AaajVPiL4z1q60SG41fxHPPptxNqOkJ5solt5riTzZZ4MYYNJIN5ZepGc19eaZ4N8Lax+2bceELW6i1X4MftK2S6pE9o5t1srhC83mxCQAxSQ3UUyBWAPlT7TWT8L/jX4k+PmhfFTUvh5cWOg/GPUtWs4NItY7qG1u7fw1DE8YsdNlkKhHjKxbwhV3UEjJNdP1+PxKmtk7vS19NdNLPmv2t5njf6t1E/ZTxUm3KUeWKcuZ00pe77yUuaPsnDXXm0+BX+edd/aN+LPjzxVpc2peMfHWr614bm+02AmvJ5p9OlHHmInJV+fvYzz1rlfEPjDxF4ifTbDVb7VLx9E3QWNtclmay3yGVkRDyN0jFiMclq/Qv4N+I73w1Lp6fFLxSLD4u6b4K8TPrGsadcw3Ws6PpHlQG2+0yRNiS7jcSPGpYyBRg4Jrxb9qbxMup/t6fCG38271ODRRoNtH4pvp4ZZvF8X2pZF1FpI/lIZX2jJLgJhsEYEYbMIup7ONJJJN3W2l9tFo/12NM24Wq08IsTVxc5Oc4RcZLX3uXSS521KPW+l42veyPm+5+JXjbR/io3i251fxFa+M7lmlOqTPJHfSl0MTHcw3HKEoexBx0rR8cfGX4la38PrDwt4j17xZL4XshElnpuoPKtpF5S7YwiMAPkXgAdBX2Z+0JeeL9Lm+KyfFnVLa50W/wDF9vJ8NrTUr6C61COb+1VbzrQKzSRWotcht21MFQBmuB/4K/Q683xFa4u1+JH9jz61eGxk13W7e90aX5V2nT4Y/nhTGeHzwQOxp4bMIVatODhHXre+yT0087eTTOfOOF8RgcDia8cTUtG14uLTfPKUW5pSdr8iab+KLiz50P7QvxN1j4ZN4YXxd4xm8IWVutq+nRXk32GGEDiN1X5QmP4W4ouPj98S9W+Glt4Lk8UeK7jwncQLbW+jmeRrSaJGBVEj6Mqso4HQivqprr4s6j4Z+Hl5+z7rthY/DjTtAtFvLa21KztLex1EJ/px1aKZhvZpAxLSKyshG333fg5oV5481/8AZ38Y2134Wm0P4YajrR8YX2n3ttb6fojm/muNwTK4idGBj2LtYEAdqieYUox5/Zx3fXVOzauraNtW+f36UeFsZWqexjiqt3GKvyvklBypxfJLn96EYzcnolaN3a7t8efD345/Ez4deFn8N+GvEfizStI1MyTtptlJIsV1uG2RvLA+YELgnH8PPSs6bx5430H4gXPi+XUPEVn4lu3k+0atL5iXMrTIyOGdhk70LAg9Vz2r6n8U6N4ytLP9nP4j+FzqVnoOlabbWF9rNndrD9l+06xMphfDBwHjmUEYxh8HvXQ/G+w8S/tWaP8AGjwhot+fE3ibR/i8t7DY3OpxpJBpMcdzAjxmVwPIjZsYU4QHOMU/7QpqfM4Rs7qTvt71tdPR6nO+FcVKj7NYiq5ws6cbO0v3fOuT3r7pxXKnt6o+LLW58U2Hg6/0WNdci0CS5S7vrMRSC28+NSEeQYwGVXOCegb3qvq3inWvFmk6bb3l7f39j4btzDYxuzPFpsTSbiE7IC7Z92PrX6nab8VNG8QeM9ev9K8davZ+b8UtRuNO0/R7mFYPGcltpdnnTpJJGEflymJ1Ut8rEYBBK14Z+z2/w/8Ah38P7q08dazongi4+PWpXs+paJNps9zLa6PI09vZwRuiFbYpdOZtz44hToAayhnLlFydLXTRb679OiT1+TsdWL8PFTqxowx3uPmTlKyilFrl157Wc5R91tNJ80VI+Y7T9sv4yx6XeGD4heNxZSyFrtkvpPKZ5OCXPTLe/Jry4DAr76+D3gnxN4P/AGW9d8BazqFt4Y0fw0viG2v/ABBpWr2c1l5wJBt9XsJlJkaXYot5IiX2yIVx1r4EQ5QcY46elehgK9OpKapxSs+nXtsvwPj+LMtxmFpYaeLrTqOcb2ndcr05krttpN25rJO2jdmk+P71aFhH8/frWbG/NXtLu2lm29AR1HauyZ8xhvi1Ov0cRQRKS++X7wUDp9a7LwzqEULH5iPP/wBY5XLD6VxehaYySgvKo3r9SRXVWmn+QivG3mJ3IHK/WvCxXK3a5+q5A5pJ2O5OvpfXUb20flxQqEAb7z/Wu08M65C4XduVh2x1+lea6LL8m3oDz+Ndbon7uJeteRNJKyP13J5OTuz134dXEGq+JrGG52/Z5JdjQjJkk/uj8T717z4q1m1sPCosY7WFYoiIwHjUqeOQo9B69z64r5x8C/E668K2ccdtb2QmUti5MQafB/hDHkD6Yr0Pwz4vm8S2v2vVr7fBbuqwhAZPNb1PfA6nPsK8HG05ylzPZH6nls4KnyrdlzWL7T7GxjSPT7aW9MjSTPJKYEVD0UAEZPB6D61lftF/EDS/gd8B9W8axaTo7R6RatcyfatSkETfdVRuLKvLtjr6dzisPxxeXuu3Ug0+3aVUYMJEQtLCqg/NkdB1zXCftf6VqOvf8E3fi9L/AMTJ1j0OaxST7KZHiEvyNsVecDeGxjPB4NZVZThT5ub8T06EIynblPnz/gj5/wAFYNZ/az+IvxC8AeOtO0XSdR+zTazod3psGyXDTgTWrEMS6r5ishU5I3KSeDX1v4xkhiuls7WFkit13FiPmfPIYnGe9flp/wAEOvE+nfEP9vDWbHQvDlp4VR/DOoiQPMBHGP7QjuE35UOSqMIwAN2EBwB0/ba38D6N4g0qHSNItDr961qJpbydzHZ2YyQCw+8SxBwuc8DtSoYhU0py1NqtFzfLHQ+f7LU5tNmLRSFd3BXAIb8K3/DniSO9WdbxhGYoTIp6eadwGB26HP4VH8VPCr6J4u1NbTTDZWtk6xSRCUOQcdRzyCc9M8VyEd550RwcrnvXsRkqkbpnmSjyys0er+NNF/4QuO2mmkU214CYnyMnGM8fjX218HJVn+EXhV15V9HtGB9QYUr857/xzdavoNnpt2YXiss+VL5f73BxhS3cDGB7HvX6J/A0Y+Cng/kH/iSWXI7/ALhK8jMFNU4qbu7s9HA8vO3Dsfx8UqfepKVPvV78T4CQ+v21/wCCcn/JjXws/wCwHH/6G9fiVX7a/wDBOX/kxr4Wf9gOP/0N6/kj6Yn/ACTGC/7CF/6bqH7R4Hf8jev/ANe//bon5k/8E/8A/lY3+Iv/AGGPFX8pq/UP9uD4j+PvhZ+zXrmrfDf/AIQ+PxKjRxrd+KdSisdK06FiRJcSPKyoxXgKjHBLDIIG0/lB8VP2Vviv8LP+ChHxH+KPw1+LXwu8Ka1f+I9VNtLPqLvdWsdxNIGikje0kQSFSQRzgg4PGau/GH4U/tDftp/CK98C/EX49/DnxTO2pWuoaDaQXjILq7jEsRtmWGyQkus2VLZAaIDA3bh+X8VcH4bPs2y3OZYqkqFKjQhOM41JP3buXuqKi4663mtL9N/2XLMqz/B4LEYeOXYhylKcoyVNpWezvb7nZlT4z/8ABRv40/sveAPDnijTv2uvA3xI8W3V4v8AavgjSNDt7mxs0KsxzcxxCKVFwFOwocsNhYDNVf8Ag4H+K0vx3+Hv7Lvja4tI7C48W+C5tXmto2LJA8xtZHRSedoLEDPOMVL8X/gT43+N/wCyH4e+Fj3f7Mvw4j8GTwNcrpTzpqPiKaGNojcXVwkLqpXcxYZy7uTwABW9+3r+y8/7UnwG/Z28N+HviF8M4tW+Fvg86HrS3Wp3McTzAQgNCwtyXQiInOBjNfaZRRyfBZ1luYxpRp1KdTEKc4U4x/dypT5Ob2VOELN2UfjavZzcro8rFcJ8U18JiKLwleUZRg0nCo9VJXtzXe2+3pY8p/bp/bY/Zx/av+AGneDPhJ8Arzw78RXvLX7Nqlro1naSbVGJUC2rM8xk6bWH+11GK9c+D3jr4r/s+/Bjwl4I179qvwT+z/pvg7w0GGizrb61rJvpriedre5tkV57cxpJGpV+VxtCE5x+kWjftdfBDRtBggt/GXhWxvYrAW5u7KzZJIG8oIzqyxAjGc547V+XH7IPwN8U/sTfFPxkdL1n9m3x0niICK08XeKzcXM2jgFyLmOAxGVXbeGZCDuZEG4gZPz2R5os1yitl/8AZ9ShGhJVIRrp15VJSvGThOvSlTgoR+zyTb5nyq+/g5xVw+V5hy4rFwVXWE0pKm4cvSUFNSvfe7ja2p7d/wAE9f21v2nP+Cj37Mnjfw/4X8deFND+IfgPWNNlj8Vahp6Imo6dNFdiSKWMQOm/fDGwcRqcFgcY58Rm/b5/bM8V/tVf8Kh+HXxh0L4reIQ3lyXvhrRbKTTI2X/Wkzy2qL5cfG6X/V54DHvn+BP2NPi3+zT8AviR4H0v4r/Dfw7qXxMu9NuL27j1i6he/wBLRL0PGW+y7kWV5oT8pG4K6njIO7+yN8PPj5+wT4FnTwD43/Zu0qDXpZGn1i8ilubzUBGygxG4e1yY42K/IMKC2SMnNe1Lh/JqGIx+Ly/DYWrCpJfV6c6Hu3dOLlOU/ZSlyqSk404WW+q6cH+ssJQo0q+LlGUV+8kqyvbmdlbnSTs1eT8t+v7S+GYb220HTY9Sljn1KO2hS8ljGElnCKJGXgcF9xHA69K/Ej9qL/k5v4if9jJf/wDpQ9ftL8JdS1LWPhh4Xu9ZuLG81m70m0nv7ix/49Z7hoUaV4uB+7ZyxXgcEcV+LX7UX/JzfxE/7GS//wDSh68j6HcHDPM1hK11TgtNvje3kYeO8lLLcFKOzk//AElHC1veH/hx4j8SaaLvTfDuv6lasxUT2mmzTxkjgjcikZ4PftWDX2H/AMESvEeoWP7YE+nw3t1HYXugXb3FsspEUzI8JRivTKknB68n1r+0+Nc/rZHkWJzihBTdCLnyttJpatXV7Ptoz+fOHssp5jmVLAVZOKqSUbrW1+tup8xXXww8UaZZvcXHhjxJBBGcPLJpVwqIfclMCsWBtwBHI9RX1d+y3c/EVf8Agphd/wDCJHxA1q/i++GsBDL9iOn/AGuTz/Pz8m3b0zzu245xXI/8FOdK8I6N+2d4lh8HfY1tDHBJqMdpjyIb9lJnVccA/cLAcB2bvmvKyvjWpXz6GRVqabnQVdSg78vvKPLONvdve8Zcz5rPRHXjeHY08slmdObSjUdO0la+l+aL67aq2ndngg60+r2qeD9V0LQtK1S9067tdN11ZX066ljKxXyxPskMZ/i2v8p9DVGv0ClUhUjzQaau1prqnZr1TTT7NWPkqkJQdpqz3+/VfetV5Eldx8CbgpruuQBoUN7oF5Buki3n/lm2FP8ACTt6+m4d64euw+BdnqGp/E3TLPSbJ9S1LUGNrbWkcXnPcOwztCfxcKcg8etcebKLwVTnaSSbu9lbW7b2StudGXO2Lp+bS+/Q9v0O0up7e1b7bP8A2Z/wj1472OT5Mkv23AlK52lhgDJGeBzWb440q+vfhzcx3+pXGoT3Ot6pFFNcFnMEey32xjJJ2qScKOBk4HNekfCH/hY3x61CbSNPltbDQNIPlatfyWVta2GlIoLFHJUKXwuRGPYnaOaofEf4wXfxCmh0/wAFXuk+KRpcBnMmm3nnaoW2HzJIoJIonkZecyQqzYHyqijn8bo5lVhmaopU3KDc52lpTUk+Xnk4JRcr6J6tK+qsfquIwuGeE9pJySkuWN1rJq3NypSd0rb7Jvo7niH7Q32jU7PwPrF3PObvUvD0cE9rcn9/ZPbSyQYYN+9xIqrKDJknzDglQAPOU++PrSGZrmV5Xd5JZWLO7ks7t3LE8k/WlT74+tftWW4L6pho4e9+W9tLaNtpf9uppX3drvVn43j8V9Yruta17eetkm/m9bdL2RZTrTx1pidaeOtd5xMlTrTqanWnU0ZPYkHSpKjHSpKswew6OpE61HHUida0OeexJHTqbHTq0OeZJUg6VHUg6VXU5+hJUidqjqRO1UYz3JKlHWoqlHWqRhLcfUlR1JVGMx8XWpaii61LVmEth0dSp92oo6lT7tV0MD1fw9+xH8WfFPwqtvG2leBNZ1TwxeWz3sN3ZtFO8sCMVeUQK5mKAqQTs4xVf4e/sk/Ef4rSaEvh7wrd6l/wkum3OsaYVuII1urO3mEM8+55FCqkhCncQeeARzX0P8L/AB/8PLPSP2afHGo/FrRPDk/wd0p11jQ7SG6n168lW/muRaxRpH5e2VGCMXkCgOcgiuo8Aftg/Cy407w/f+IZNObTj8OfGdjqnhqK4kt387UNYN1DpiyIvySSQMQjDgY6ivGnjcSr8sL6vo/73nrstdFqfYUsjyyfL7Sty3Sfxx1vyXei91LmkrNN+7fXVHzboX7APxl13xbrWiweAdUXU/DkdvLqMVxc21usEdxv8hxJJKqOj+W+1kZgdp5rP+G/7GHxU+L1xqy+GvBOq6suh3smm3k0bwpAl0hw0CSu6pLID/DGzHp6ivsKH9pX4Y+MtF+InhVdd+DZ8HHSPDWneBdJ8VnUhp0WnWkt3M8F55W64+2QtMd3zFdzLgla8S8Z3Xgb9pX4O+BvDH/CzvCHw4vfhfNqNhLp99Fe/wBh6lHLeSTpqGnyRxuxYqwTZKFkIVOaqnjsTJ2lG232W7aX2v30t07szxORZZBJ0qnO7S09pBXany2TcbL3feu/iW0Vc8i8Afsm/Ev4oeMNZ0DRPBOvXGreHH8vV4JoRaDS3JICzvMUSNjjgMwJ7ZqDxb+zV4/+HsHieTXvCWsaMvgtrUa39sjERsPtTlLdiCcusjKQrJuU4617dq3jXwb8dPgPqHwsu/jM9pf6J4qk1238TeKbS8i0/wAZQPaxwATlfOmikg8siLzQQYyOFPA0fAXxv8H/AAM+F3jvSpviIPirPY33g+502C6guYYNSjsdSe4ubO0E5Zjbxpj5mEanecJjrv8AW6/8ut1paW11rfbZ38uuzPN/sfAOydSytJ83PBq6jJqPKve0aSum1L7NuaLPP9Z/YR8aeF/2bT45vvDXjZNQLi5exGkIILDThybudjL54DDBXEO0AEsw4rim/Zj8fQaz4K09vC+oLd/EeBLnwyhaPbrEbgFTG27aOCpwxUgMMgZFfR/h7x98Ovh7+2PqX7QI+M9vr2mz3t3rEXhtLK8XxLqJnRwNLuEaPyEiXzBGzmQpsQYHTHffC39tj4b3Xxd+C+ieKtesofB/hbwzoerW2owK7J4S160WYT2zfLnypoGEMgAI3LA38JrD67ioptR5tL7NW0287fj6nZ/YWU1ZKM6ypu6ivfhK6uvfbW3Mr2X2Wk37p8T/AAo+Avi/44+Nrvw54U0SfWNasIZbm5tkmiiMEcTBJHZpHVAFZgDz3rpNO/Yv+Kl38UZPBP8Awg+sQ+KI7FtUNjcGKDdaKQrXCyO4ieMFgNyuRXW/sb+M/DWnfFj4s2+veJdG8NWPjLwhrui2Go6m0gtDPdSp5W8ojMFIyeFPAPHavdfgB+0B8NvhhoOg/DW+8deF/FcGgeEPEllNr2sw3kXh+e41F7bytMT5RcNaqInLsFXOTtxXRicZiKcmoRv8n23vtvpbfXc8zLMky7EU4TxFXlbbv78F9pJKzV02m5c2qVrW1PkLUPgH4v0n4yW/w/m0WT/hMbq4itYdNjuYZWkllUNGokVzHyCD97Azzirvxb/Zr8efAXWNNsvF3hjUdGn1kldPLFJo71gwUrHJEzIzBmAKg5BIyOa7/wCGPizwx8MP+CiXg7XZL7wLp/hXR/EFjeT3Xhc3J0O1iVFLmHzx52Ac7tw+8Wxxiu9+Gv7XXg7XvjTpd/4g0Tw54V+HnwlutU8VaLoGkGeWbxLq8rgQkSTs5Ls4ST5tqKIzxzirnicRFpxjdct3p110Wve2mu+rOXD5Vl1SE41KvJP2jjHVNKKcbyl7qurOTveN2rKLvp4npP7JfxF174x6h8O4PCl43jTTYvNutIlmgilRNqMDl3CNkSIRtY53cZ5ro2/4J0/GiCyvZ0+Hmozixd4Z1trq0nlLIoZ0RElLSFVYEhAxGa9dvP2g/hn8RPjp8BPiTFreq6XqHg/X7bSPEsfia5judUmsreQT2+pSywxqkigPJESAGGxAQcZrpvgV+058KfCnw58ORahdaFL440PxV4p1zwzqWoz3S6foN1NIr2kt3HDgtDOAQG+bayrlcE456mOxkUnGHqrPfXz20+59T0cPw/ktSco1a+l/dfPFXj7ltORvm95p7K8X8Ku18seGf2T/AIieMIYm0zwnqF6JdBPiiMRvFubTQ7R/aQC4ON6su3G/I+7WJ4d+CXiXxT8LtY8cafoNzdeFNAuIrbUNTQJ5VvNIUCLgnczEyJ90HG8ZxmvrvwF+2roPwx0DTddsvEunS+KNI+ElrpvkDd/pOrJrhu5bPgYy8RbP8O1+tb+gftf/AAj+APh3xB4f8JahBrXhDQrvSPEmn6eyFJdbvJdbF7dRICNu+2tUt4gWwMwe5qnmGLTaVO+q77X1/NW+b6HPHhnJppSli+X3ZN3cfi5W42S9Jcy3+FJ3kj5Q8X/sX/FXwB4Bk8Uaz4C17T9Et4luLieSNC9nG3SSaJWMsSn1dFFZ8v7MPj2HxB4P0qTwtfrf/EK3S88Oxlo8avGwyrRtu2jgg4YggEZAyK988C+KvAHwK+P/AIl+MD/GCx8c22qQ6nLbeHoLS8Gta695FIi2t+ssYijjQyAuxdgfKG0dK9I+Ev7Zfw5/4W38HNC8VeIrX/hFPCHhXQdRs9WjV2Xw3rtpbyR3Ns/y58ueIiNwMgOkLdiacsfioq8Yc2l9pLptZ9nv32Wpz0uGsnqSUauI9m3JJJzpy05l7zlFWSkrpL7LScm4u58a6T+zj441zVvDlhYeFdVv73xfFNPo1vaoJpL6OGRopXAUnaqOjAlsAYz05qX4vfs3+OfgBJZHxj4Z1DQ49TDCzuJCktvdFfvKk0bNGzDuu7I9K+kdB/aU8CzfCXQfBlz4s/sKXxF4G1Pw5c67awSzN4duH1qS7jSZUG/yJ4tquUyQrDjrXnHjPXvCvwR/ZH1z4bWHjfSviJrPirXrLVx/Y0Vx/ZXh6O2VwXSSZELTzbwrBEwFXk+vRDGYiU+WUba22eqvvfZW7Pf5o8rFZFllPDupTq3fJzX54WUuVPk5Lc0nJ6JppRvqnyyOA+Ef7J3xF+Pej3GpeEPCGqa1p1tN5DXSeXDC02M+UjyMokk5HyIS3PSsvVPgJ4y0C1s5r/w5qVgL3Wn8OwpcoIZTqKbN9sUYhlcb0+8APmHNewXN/wCEP2lfgF8M9Em+JGi/DnVPhtZz6dd6brcN0LO733DTC/tXgRw0zBgHRgrZQYOOT2Hhbx14E+I/gXQvD+rfGOJbrwF8Q/8AhJX1vxNY3iy+IbAw26FoAPOfzFMBVY5GBK7Dx0DeNrResdLvTlloujvs76bf8Eyhw9l9WKjGpq4pqTqU0pSaTkuV2lHl95e83drpdJ/Pev8A7Nnjfwvqum2Oo+Hbizuda1i40CzSWeECe/t5Fimh3b8Ao7qCzELz1IrX+Jf7FXxP+E+lX174k8I3Om2umWg1C6dru2l8iAyJEJCEkY4LyIBxk7sjjJr2L9rD4h+D/wBqP4Ey6npfjTw5o+o6X4u8U+IBoeqtPHqF7b3s8b26xKkbJ5jLH0ZlALDnrWt4p+NngP4ifEL4leH/APhL9J0iy8e/D3QNFsdbuYpmsLe9so7V5IZiiM6jMTpuCkAipjj8S1GXL35lZ9JJaa9nfrsOrw1lEalWCrXTUfZv2kLNypylqrdJxUd425lfz8N8FfsPfFP4gRxnR/Bl5drJptprKN9pt4la0ui4tpcvIo/eGNwB975enSuc0j9nvxtrfjXXfDNr4Y1Z9e8M2s97qunmLZNYwwgGV3UkcDK9MltwxnIr7K0r9pj4Hw+F9Y8J+ML+Pxl4W0vw54O8MSiza5tTrL2U1y1zdW2AsjRwGVGIYqXCnHUVn237ang/4ReMfFPjbW9Xk8WeNPGfieCZh4Hukt4LTSdMEQtIJGuY2JhuMDfH99liG4islmWNbklS9NGuz79r32totb6dNThHIIwpTljLLXn9+MrJOa0Sj1koqNnK6cnZJJy+L7P4c6xcfDu48Wx6dI3h231BNKlvwy7FuXjaVYsZ3ZKKxzjHHWnW3w61m48A3HimHT5ZNAtL5NMnu0ZWENw6F0jZQdw3KrYJGDggHPFfUHizT/hj4k+CHxI8E+F/iR4Q0XT77x1a+K9EGqtcRK9ibCTNsNkTkSxSTeVggD92Tnpnzj9gH406V8Jvi9fQ+J59NXwlrGmyvfW2pRtJazXdqDdWDFRzvW6jjAPo7g8Ma7o42pKlOpGOselmm1o/v3+Z8tV4cwlLG0MJWrLlqJpzUotRndq7t9i9nrZ2d02cCf2dPGTfGSH4fnw/cf8ACaXDJGulGSLzt7RecFY7tqts5IYgjocHiqN/8GPE2naL4j1G50S6gtPCN/HpesvKFU6fcuzqkTqTu3Fo3HAIG2vR/wBi/wCM1tpH7c3hTxz451pbeKTV7jUdX1O6JP7yWKYs7bQTy79h3FetN8dvAf7Qf7L+qaf4j8S23h3x/wCL/EOhWPiS4uFby722spJF/tYYBG828iiQdS8O7Hz1FfGYmlUUXC6tG7Se7bv8kl8tO5WW5DlWNw06sa7hPmq8sZSirxhCLhd/zOUkuiklK1nHX5rh/Z/8YO/hDdoN1F/wnwLeH3mdIk1MB9hKszBV+Yj7xHBB6EGt74lfsZ/Ev4QaTqN94k8J3OmWuj28V1eu1zbyfZYpZRFGzBJGI3OQBxnnPTmvc/2nv2lvhV+0x8HPGHhvSP7f0G48MTw6n4TGsXEUlk8VvFFYtY2ixoHhEtuiS7JC2XjySDnN/wCJHxo8BfFn4k/HDw7F4y0bSLP4ieH/AA5BpWu3cc5077RYR2zSxSlEZ0yUdQ2wjKH2zzrH4t8rlTt3VntePn/LJ/OLPRq8K5HH2kaWJ53ooSU4JOXJV0acb/xKaS1Xu1I3d9X4R4O/Yc+Kvjx3XSfB13d+XZWeoEfareP9xdqz2zjdIM+YqttA545ANczoPwH8ZeJ/GuteHLLw3qs2veHre4u9TsDFtnso4P8AWs6tjG3I46kkAA5FfZlj+098EL2y1zw94tuo/Ffhu0i8H6FG8LXNr9tOnwTxzX8SqFkaGKR1JQlWZc4zxnA8P/tk+FPhF4q8YeOvEOrS+KPHnjnxYlzP/wAIVcpbwW2nae8bQRlriNibe5YDdHjeyRLuIORWazHGNyXs9dLaNdvP1vtbRa306avB/D0VSk8ZZXlzvnjKyTklZKO7ahy2c+ZOUvdUVf49t/h3rF58PrjxXHp8j+H7O/j0ya+3LsS5dGkSPGd2Sisc4xx1rLr618V2Hwz8U/Bz4leDfDHxF8I6Fp+qeNbPxVoo1VriJfsZspd1sPLiciSKSbysEY/d5z0r5KB4r08JiXWUm1a3k1pY+E4gyeGAlSjTmp8yd2pRkuZSadrdLWavvcic4FTWGpDTrkMybx29qiJwKhlGW64raoeTh/i0O00LV/t0nmK5fBwfb8K7bS9VkuLRI2xgHOR1rxBLqSwmEtvMUYc5U4rq/CfxgitZFg1RWjycCdFyP+BAcj6ivDxUo394/UOHY1GtNT2bSmy2PxBrq9EvjDhDxnBHvXBeG9Xt9YtY7i0niuIm+68bZXPp9a7TRp1nXBwCK8iqfsOSXVju/Dmp24u42uoY7iFTkjZy31wQf1rT8QatYHU2bT7Pybc/6tkchvbKkkVyVpP9lO7BK+orZ0rV/sk3nCOGcFSu2VA6898HuK4JRV7n6RhX7ljS1z9suT9nHwHNNLox8STXs622n6fbyeVc6hcHO2MuB8qDqzN8qAEmvzM/bI/4KQ+N/jU9zbavr1uPCtlu1F9MtIljtI8zGItEqFfNO7fh3MhYRgq2CTX01+2h8e01Lxnd6dqccF/Z+H7CKy2NAqrvnAmm3Yxn5BAueRhTwea/Iv8AaS+Kc3jP4w+J7r92yTyJaxMv8MUaBVAxx65wMZPHFfM4qXPXlFKyX5n1+EjyUk29Sz42+O0ieKdJ1/wwt14X1jR3B0+/sZGt7wRYKiQyowYPkHGOzN1GBX6Xf8Enf+C5Xi/4oeN9K+FnxQ1TT5dU1iU2ug6/LbJBHeXLrtjtrpIwqGVyQscpAG5sN1Br8f43MsnzEscdzWtoep3Oiala3tpK9vd2M0dzbzJ96GRGDKw9wQCPpRCXKrdDR6s/q80n4P33h/wdcXvjHxJJpFvaMTCGyjRPgDepbJZTn7oUlicYHUeFa9YaXqt7jRbi7uCZnRIpVAaRR0kGMdeuCOPWvPPgV+05qv7WX7N3hDxhqOo3d2+sWKXFzFLOzrDdJuimwD0O9Xx7EVr7zE2QSD6g17eFpTh77lv22PLrzjL3UjbvLK4sWaGWN0mUD5JBgiv0t+AZJ+BXgvcMN/YNjkeh+zx1+Y6eKryQQrcO15DBwqSdh6buv61+mH7NlrLY/s6eAYZp5LuaHw5pySTyffmYWsYLt7k8n61zZnJuMUzbAxSk7H8glKn3qSlT71e9E/P5D6/bX/gnKcfsM/Cz/sBx/wDob1+JVfoV+yr/AMFc/h/8Cf2cvBvg3VPD3jC61Hw7py2dxNaxW5hkYMxyhaUHHPcCv5t+k7wfnPEWQYTC5Jh5VpxrczUbaR9nNX1a6tI/U/CXO8DlmZ1q2PqKnFwsm+/NF/od5qtz/wAKf1bxber4p8Ntp7+JNV1eQPZ3/mx75UjljkSLh3QqvluRlDuZfvLm38QfEWq+JNR8NCbxH4OtJvC+urq8DWel6ifOlghuLpozjkBonYFhyxVQMk1SP/BbX4TyMxPgzxiS5JYtZ2ZLE4zn97znauf90egpy/8ABbT4UeaX/wCEN8Y72wS/2O0y2OmT5tfzQuAuPrxqSyWo5pPW9LtZdPW/e/Q/pR+M2XufO8dRuv7j9H+B0Ph7xTqg+G2t6raa58OzpWiWVrHqV5Jp2oF5ftEMCxSKGHzBlVNyjuSfTKL411zw+TdTat4X1U2mr3UrXJTUmh82W5RCgGcFIV2oqgY2BsAu1YK/8FuPhWqFR4Q8ZhWxlRa2mDgADI83sAAPoKF/4LY/CoRhR4O8ZBQdwUWlpgHO7OPN655+vNc3/EOeO223klTV96e1kmrpevlZpW0u8n4w5U1Z4yj/AOAP+rWe39Lzr4PeGLT4D+GfE+t2PjXwzf6fqqwGaWbRtSV7ZluJI1TagDOhlDI8bfK3yA16f8db/W/Fvwavhquv+CNO0TxPqx8Pie20zUZpvtfmRsqlcEkBoflZuFV8cYquP+C1vwqKn/ijvGGDwR9ktORkn/nr6kn6k0q/8FsfhZt2/wDCI+M9oYuB9ltMbiclseb1zznrXt4nhXxFr4yGOqZNUdSMk7t0r2ioqP2UrrlWtnttvf8APM1znhXMa2Jr4rMFfEOTmk5pNzcnPRPRNyeitv6GpL8a9WtNXvbJdf8Ah1NfQ20eovnSNRkDQtc3DoNxG1gGWRFGR5exW4zWT8RFu9T1jxl4eg8XaBFYeKbC30grqemXsv8AZ9wlpNFP5U4UrIzmCZyGO4kRMeoyo/4LUfCkR7P+EO8YBMFdv2O0xg5yMeb05P5mpD/wWq+FrptPhHxiVOeDaWmDnr/y1riocC8fUKntaGR1E/8AuE9U4yT+Ho4q3ldXs3fmr5hwjXp+yrZjdf4p7NSi1v1Unf5PdK31t8M9E/4Rn4feHtNM8V0dO021tfPi/wBXN5cSrvX2OMj61+Kv7UX/ACc38RP+xkv/AP0oevvm2/4LY/DGBUSPwt42RIwAqrb2oCgdAB5vAr87/jD4ztviN8X/ABV4hs45obTXdWub+COYASIksrOobBIyAecGv2T6MXAXEuQZtmOKz7CSoqrCNnLl1fM29m+58d4u8R5RmGX4TD5XWVT2beivouVJbnOV9b/8EUYzN+2qxVSyxeHb0yEDIQF4AM+mTXyRXc/DT9ozx58ItLe08K+LNY8O28hy62EiwmTkn5mA3NyT1Jxmv6f45yLE51w/isowjip14OF5NpLm0vopN27aX7o/HeG8yo5dmlHHV03GnJSsrXdumrX3/gfQOheE9d+Jnx213TdbvPGS6BrvxMufDElwut3axRhpmJgit4zxIiushkl/dKu0bSSawNL+Bnhy/sPCGn3nhi9GfBGvazd3dtPNFPNeWc99sZ85X5hBHlSOA3HavFvGXxu8Y/Ei9Nxr3ifWdTuGYO8ktwVaRh0ZyuN7DAwWyR2xWWvjHWZEKtrGrkNI8rA3svzO/wB5j83VsDJ7968jDcJZnCml9YVN2StDn5U1CcLp3i38SbukrwWmunoVeIMC5u9Fz1esuW7TlGVtnb4Wt2/ePf8AQvhH4N8a/CvS/EieFdZtIrjwlr+sC0XWbiaKG5sJoUQxsy8RvvfcuD16kjNU7f4IeF9butGtodCv7OTxJ8ObrxcJVvZpF066gjuCBGpzuhY24LCTcf3hCsMCvCofEGoQ24hTUNQSEKUES3LhAp6rtzjB7jvT01/UInRl1C/Vo4/KQi5cFE/uDnhfbpXpx4azCPPyYyau5uPvTdk3JxWs3flvHV78uvxM4J53g5cvNho7RvpFXa5VJ6R05rPba+myPdH/AGf/AAzafFXxr4Z+y3V1ZeCrW0u7fVBdOo1zfNaxlGwdoW4Fwxi8rDLtX7/zVv8Aw8+CXhmb4vz2lvoGrwR+HviTb+F0kTUZxNPbTfaxl2A+WRDAhBQLkMQc9a+cf+Eg1D7Hb2/2+++z2jBoIvtD7ICOhQZwpHbHSrejeM9U0fUorqPUNQLpMJ2H2uQeYw7sQeT79aivw1mdTDyp/XJczio3vJa2inKykl71pO20ebTa7KWd4CFaM/qyspX2jtdtLb7N1ru+XXex9gftqeJZfhd+xD8JvDOhboNM8Uaatxfyqu37TI6+dOWPUu7kBs/wow6MRXxxpV1e2Gp2s+myXMOpwTpJZSWxImScMPLMZHO/djGO9exeEv2r7PWPhvJ4G+IGhXHiPwqszXGnS2t1s1HRZGYsfKd+Hj3FmCsQV3MAdrFa1vg58U/g7+zr4pg8Vabp/i7xx4h04mbTLXU4IbK1s5sfK8jKzbtp5yqk+hWvC4ZoY3hvLcRgamDnXrOpVmnGzjWdSTlFyk3aDs1GfPZK148yO3PKuFzjG0sVDExp0lGEWpXTp8qSfLG15bOUeW71s+Usf8FJPh9D4E+PmmTtbQWGteI/DljrGvWkIASDUpAy3BCjgb2TcQOMknvXgCffH1rovi18WNb+OXxH1bxX4huBc6trE3mylRiOJQAqRoOyKoCgeg9cmudT74+tfccI5Zi8uyXC4HHTUqtOEVJq9rpbK+to/Cm9WkrnyXEGNoYvMq2Jw0bQlJtX3t3fm935ssp1p460xOtPHWvozxmSp1p1NTrTqaMnsSDpUlRjpUlWYPYdHUidajjqROtaHPPYkjp1Njp1aHPMkqQdKjqQdKrqc/QkqRO1R1InaqMZ7klSjrUVSjrVIwluPqSo6kqjGY+LrUtRRdalqzCWw6OpU+7UUdSp92q6GA/zPKjLf3ea+iX/AOCfN6vjTwD4WX4i+A5PF/xCj06ez0NRe/arOC9hM0c0zeT5e1VHzbWJyeAa+dWTzYWUfxAivsGX/gpjLc/H34O3st14ib4afDi10RrvRPstv50l5ZWjQyyxHOSCzErukAIPIHSuLFuurex7P8tP6/E9bKIYCXN9efWCW+zfvPRrZddbdmeV+Bf2NL7W/B1j4h8S+N/Afw60nW7uez0STxHeTRya20MhikkijiikZYFcbTLJtXNUviR+yH4k+FPgKDxBq1/oDQ3Hi1vB6R2V6LsPcC3juBOsseY3gZJVwQ27OQVBGK6xPjv8K/jd8PPC2jfE+x8faXqfgJLmw0rVPCy2s41PTpLmS4S3uIrhlEcqNIwEqEjB5Umt3wr+35D8DfgLD4Q+E48TeCP+K6l12VZ5LfUDLpbWsMQheV05mMkbMQsaqAwAY4rN1MVfRa322VumuvTyfyOr6tlPJ78rLlVmm3Lmsrpxdlo7parT+bc5nwr/AME+vG/jX9ozx38M9MutFuNY+H0Ur3120rx2lzIpRYoImZdxlmkdUjUgZbPpXmXwa+GN98afiz4a8HafLBZal4m1KHS4JLsMI4JZG2gybQWAB64BNfTnjf8A4KU+G/DnifxjrvgrwRZ65rHjnxt/wll7J4qgkRLJbUR/2akP2a4VjJHJ5srFiVDOMA9R5p/w0T4N0r/goFo3xY0fSdXsPDEfiK08S3ul+VH59vPlZbuKEBtrJ53mGPJX5WAOMVVGti3F88fs6eqWv3vb0OfH4LKITpqhVuvaWlv8DlpZ2+zFe9q3d+Rfk/4J5+ItS8Q6Rb+G/F/gbxlpmoeI4PCl7qWkXUzJoN/NIY41vIZIkmjRmVgHCsrEYBzXnHxx+Emn/BfxGNLs/HHhfxrNG80V42iJchdPlifYY5POijJYndjbkfKeele++A/2z/hj8AfG3meBtM8d6jY+JvGeneJvFOo62lrFcfZrO8a7SztLeJyufMckyPJk4AwM8ecfts/tBad+0H8RtP1zSPFXjjxGLcTlT4k0uysn03dN5iRQi2ZhIg7mT5vlHqaMNUxTrJVF7vpb79P8iM0wuVRwcp4eS9rdXSbaWv2W2r6Wb0lq2rq1y6v7AWu2RttL1bxx8NfDvjq9slv4PCGq6w1tqex08xElkKfZ4ZmQhhFJKrcjOM1y/wAPv2VPFXxC+BHjX4gWS2kekeBplhu7eVyLq8I2mcwKAQ4gV0eQ54VwRmu9+K3xz+CX7Q/i69+IHjPw/wDEmHxtq8CPq+iaPdWcej6perEsfnpcyBprdH2qzR+W5Bzg11Hwr/4KEeFfgvo3w78L6T8OtJ1nwp4csJ7fW7vVI5f7Vnl1DK6r9n2TiLY8RSNPNViREudvY9tjFT0jeWl9Eku6Tvr2Xre72F9SyV4hqdRRp2ai1KTbvZRlJcujWsmtFdctknd+Wax+yvHo37MFn8Uj8QPBs9he3JsItJjW7+3teqiSS2vMIj8yOOQMx37cA4Ynin+Of2OfFvw40f4aX+qGwig+KDRR2O12ZtNllMRSK6GMo5inimAGfkf1Fa2k/Gb4d/8ACoPCnw+1G28UXPhrQ/iPdeJLt1t4hPdaRJDFEkIHmY+0MseGGdo3ZDHpXo3ib/go5ofxmPiODxX4D0nQ47jxBp/irSLvw/FK119us5o0QXImnKbWslMJMQXBC/LjGB1cWnorq77bbL/N/wDBM4YPJ5wftJqEuWNrOTXMlebe+/wrZa36Hkuj/sh+JNY+OHjPwSt/oNqPh/Pcx+INdvbo22k6bFBKYmneRl3bWfhFCl2JwF61qXX7DHivWZPD0ngfVPDfxM0rxLqX9j22o+HrlzDa3mxpDDcrMkb2/wC7VpNzrtKKxzxXd+M/2qfhZe/FP4lzWtr4/wBZ8F/Gt5bjxRbXMFpY3+jzi7F1bS2LLJIknluX3LLtDDFN+Gn7bXg/9k3S7PRPhdofiLXtI1DVf7R8UXnih4ba51mH7NNaizhjtyy26iOeQ+ZuZi+3sMUnWxjV4R10smtNtbvo77L073R9QySM+SvUXJd3kpNyXve6oqzUk4WberTvs0lLzjx7+yiPB/hDV9V0n4kfDDxnJ4dIGrWGi6u32u0BO0vGs0cYuUB4LQl8dcY5rPuf2XvE1j+zFbfFl/sf/COXOpnThBvP2tEyyLdlMY+ztMjxBs/fUjFev61+2L8MvBvwG1Twl4N8NalrNxqdgdL06bxP4a0ZG8MQvkPKtzAhuLu4VSQjuyDOCQSKu6j+334H1eS/8EN8PrWD4XXHhNfBkOoJE58SJZxR+ZBKw8/7MXF7+/IC5+Y/MT1qOIxiStC+vl8PXtr29Ou5hVy7I3N3rKLcbJJtpTd7O+t4pL3teq2d4rzjw5+xJqd/oehy6743+HvgnWfFNot9ouh69qUkF9fQOP3Uj7Y2jt1l/g85l3e1LpX7B3jbVI/DDJPoMKeIrPU9Rup7i+EVr4ftdPuvs1zPdz4MYj342tGX3BlxkmtjxP8AG74RfH2HRNe+JGl/EO08Y6PpNrpF/D4de0On+IktohFDIXmO+1coqh9quOMqBW34a/bY8HaP8L/Cngu48K63ceFF8P6z4b8RWMV4i3MVvd6iLy2ktLgjDyw7UyZEVXIIxg5DdXGWvFa31VlZaPZ316f5rYwjg8hcmqs0o2XK1KV5Pmh8a5Xy6OV7bK7SlZN0Pib+x7Z+Mtd8M3fwwvvCmq+D9S1Oz8LT6lp+t3OpPZ6hPJtjlvllgikiEhPymOLyyEAHzdeY8f8A7Efi74Ya98S9P1a40uKT4ZafbardSIztFq1tcTLDFLatt+YEvn5sY2sOoIrs/ht+1J8N/wBnD+zdK8B2XjfU9M1LxPo+t+J9U12O2iu5bXT7kXEVra28TlAd2SXd8k8YA6WdW/bs0XxV8Dfi54V1TR9Rn1PxPPcReFdTCp5lnp8+pi+Nnc/N91HDMm3dtMsi8DFKNTGxaUVeOm+9rrV/j8tQr4bIKsJTqzUarUm1F+4pKMrRjZbN8rv/ADXjdp3XB/Cn9jy4+KfwmsPF03jvwL4TttY1ifQtOtteuJ7dr26iRHKiRYmjQESLguwGeuKuz/sM6r4S8DalrXjbxf4T8ASaZrt14daw1cXUlxPeW8SSsqGCKRCrJIpVs4IIOcGrnw2+MPwq1D9l7RfA3xAh8eyXHh/xPeeII4tBhtRFqCTQxRiB5pXDR/6s5ZUbAPHt6rcf8FK9J+IXwy8V2Wr6r468Eaz4i8Q3mq+X4d06yv7WW0ks4LWC0le4dWG1YRudVyck98B1a2NU2oJ2v26X0to76b6MxwmB4flQi680p8ia956y5fe5leKi1LSK5ldX0dlfwD9nT9mC8/aI0nxNqEfiTw/4W0/wolm15c6sLgozXUxghVRDHI2TJgHjA3D3rq9A/wCCdvjTXPFMWjTal4esdRfxtJ4EdHmkkSO8S0N0ZdyoQYTGMDHzZPKjmn/sPftQaL+zl4c+IGn6pq3jXw5c+LbXT4bLVvC0EE15YG3naV8CZ0XDqdnfhm4r1DTf+Cj3giH4mWOujwvrWlW1v8TB40ktrZIXMtsNK+xMxwyr9pkmzK4ACfO2GqsTWx8as1Rj7vTTyX63/wCB158qy/hupgsPUxtS1Rv31d7c8l8rRUei3+1ry+VeDP2CtV+LOpeJ7TwJ408HeN5vCmkDVLkad9qj+0OZHjFrF50KFpyU4H3TuUA5OKg+G37C2tfELwlomuzeJ/DGg6RrHhvUfFL3N/8AaNthaWN2trMJRHGx373BAUHgHODxXc+OP25dLNv49n0rxT8RfEGueJNE02z0nVtX06ysLjS7m01MXi4Fs5XywBlWwW3EgjHNdzon/BTXwTJ4j0PUv7K8T+ELmPwZqui38uh2dtP9j1S+vYLqS6tY5ZAhjMiTPtfG0yBcEDNZzr5io+7H+uX0W7206G9HLeFJVLValmlqruzbqWVvedrQV2ud35k01Znhui/sQ3fiDwlqPiCz+IHw8/sGK/l0vStQur2ezt9fuordbiSOF5YlEeFbaDOYwz8LnrXC/DP4Ial8UfA/jHX7K6sre28FwWc93FOWEkwubpLZBHgEZDuCckcDjJr6K+GH7dPgX4feJPE2o3178U/E51S8lnu7O9SxGm+M4nt1jSPULQlordo2H+sgDMyKvQ9PFPgd8cNK+Gnws+J+hXtretdeNbbTYbI2yqYrc22oR3LhyzAgbEIXAPOM4611UquMalzLrG3pf3vw/pbLwMfgcgjOl7OorONbmSb0kot09bveWiV+m8l78uo+JH/BPLxp8LPi14j8Jane6KZfD3he88Wi/ieRrTUbW1XMqQtsz5oYMhVgMMvJAIJr/EP9gHxp8PPi38P/AAfJcaTf3nxHt4bjTbq2eQ28IfBdZSygqYkZXfAOFYEZr0/V/wDgoz4e1/xD8a0vtF1e60rxraar/wAIjM6R/a9Emv7ZYLiOQb8CCUxxOwUttaIEAljUfj7/AIKJ+H/EeneLDa6RrLaqdPtLbwhezrGraLLLpkGm6ozYc4EkMOY9ufm5IXNcsK+Z3SlHprp1aVn8m9fR+R6eIyzg/lm6VZ/Fpq7qKcnJba80Y2g+8oXt71vM/in+wl4m+EfibR9KvtX0G5m1rxW/hGF7dpSiXKC3JlbKA+X/AKSnTn5W46Zl+J37EM/wb8D3WseJPH3gvTZlu9WsrHTnF41zqsunXD28qxbYSg3Oo272X74zjnHq3jX9ur4W/Fn4gPqXiDSfHltZ+HvGx8Y6ANOS133m6G2VrW6V3/d/vLZSHRm+ViMZrO8f/t9aL8U/2a9R8Oz6t448Ma7qNxr15eafpmnWVzpWqPqF3JcRxSzSuJkRA+wsi55Y4OBRHEZg+Tmjb+bTvf1+ehNfKuFIvEulVT0fs1zPdOKd9Yb6uN3qtUns+L8d/wDBO3xL4H0+1nTxL4T1R/tuk2Oo29tJcLNpL6mFNo0gkiVXVgwz5TMRg8VkeG/2ML3U/EXxMtNV8YeFfDVl8Kr9NO1fUtQ+0tbSyPcSW6GMRRO5BkjPVR94e9e3fFD/AIKQeDfF/h6C2jXx5rQefQJIdM1SG0TTvDTac8JmuLMq7SNNKI3XkoP3rZ9Kj8L/ALbXwt8B+Ofitq/h/W/ixotz8U7yPUpb6HRtOkuNIlW7lnaOJHnKOjLKUy3PtWccTmPs/fi76dPON+nbm6ff12r5Nwn9aj7CsuRc17yf8tTlt7yveSpt+8t3dw1UfEY/2M9Rk+FM3i8+MfBEGmXE2oJoa3V7JbP4kSycLM9sXjCDOfkSVkd+y5ryAHIr6k+HH7Z3gf4f/D/xRYTr8Qtem1h9VFxpN+9rLofiV7kv5F5cQsSbOePcrMLcEMyDDAV8tINqAdcDr616eDnXk5qstL6f1/Xy2Xw3EmGyylToSy+SbcffSbdnp+bvp0tbXScmhwnWjzYWODj8qFPNRNGrfeFdNQ8HD35iV9OtbtcblyeODVHUfBAuk+SZxxRPZxt/eX6Gsm+upbQnHnKOzK2CK+ZzDyZ+t8K62KUeteLPhDqr3ujXe6PGZYWG6OVR2ZT/ADHNfTvwF+I+u+OdFl/4SHw5J4cvrcptUyq6Xisu7fGPvADjOc9etfJXiLxJfQxti7kYEYw+GyPxFdJoX7b2raXaw2mqrG0dtGEEsdum8AYAIyOoAx1Gc9RivmvrSpN897H7vlWBnWS5Er9z7bt2YL948+/WtCO6/syy+1TzQwWoYLvmlWMMTxgZIya+VNO/atvrnSrOS08Z6aROiqxu7OJWVtpYndt+U+zDtwea4+bxP/wlcLy6pqMdxqN4GkkecRxpLKSdxCL8gyc8LwPSuGrmqa/dL7z77C5U4K1V/cYP7bWqrqPj/wAav8zGHWMqFYj7kNuOMdT/AI1+bvjIM/ijUGIClrh2wOgyc/1r9FPGmnX9lZWy6reaD4h8991w13A4LhkXaQ0bD7uxRgcYxWHp37F3w68RCV77RLK4ubtmnknt7i7jCl+dqZlxhegyO3U15Lq3k523PfhStFRufnxCMOv8zV1JyAfTbX3/AGH/AATF+GeqXLfPr8IPzbFvvlQegyCfzNb8H/BKL4W30DKtx4kiP3dwvRkfhtpOsl0LVFs9t/4I53tzdfsHaIzptgTWNRtom2HDgSqx56ZBc/pX02bfzHYIQxHT1NfKX7M3wDsP2VfiBoOn6brl4fC+25YrqN0QsM8uxRgDCfMccsODivpq+8T2Gn67Y2TXtsl1qKyNZqJVP2ny8bwhB5IBzjuMkZwce1gcZGcFFuz2PNxWGlCV1tuacUTFsHgg8ZFfqP8AAIk/AnwVnr/YNjn/AMB46/LZbtiRuJI9e+K/UP8AZykmm/Z78CNcKiTt4d08yKjblVvs0eQD3GanMtkPB7s/GL/iE0+I3/RYvBX/AII7r/45Sj/g00+IwP8AyWPwV/4I7r/45X7n0Vh/aeI7/gjn/sLB/wAv4s/DL/iE3+I3/RYvBX/gjuv/AI5QP+DTj4jA/wDJYvBX/gjuv/jlfubRT/tPEd/wQv7Cwf8AK/vZ+Gg/4NOviL/0WHwX/wCCO6/+OU4f8GnvxFA/5LD4L/8ABHdf/HK/cmij+1MR3/BC/sHBfy/iz8Nx/wAGn3xFB/5LD4L/APBHdf8Axynf8QoXxF/6LB4L/wDBJdf/AByv3Gop/wBq4nv+CF/q/gv5X97Pw7/4hRfiJ/0WDwZ/4JLr/wCOUf8AEKL8RP8AosHgz/wSXX/xyv3Eoo/tXE9/wQnw7gXvF/ez8Pv+IUn4h/8ARYPBn/gkuv8A45Th/wAGpnxDA/5K/wCDP/BJdf8Axyv2/op/2tie/wCCF/q5gP5X97/zPxBX/g1N+IY/5q/4N/8ABJdf/HKcv/Bqj8Ql/wCaveDf/BJdf/HK/byij+1sT3/BC/1bwH8r+9/5n4if8QqfxC/6K94N/wDBJdf/ABynx/8ABqv8QkH/ACV7wb/4JLr/AOOV+3FFP+18V3/BC/1ay/8Alf3v/M/Eof8ABq58Ql/5q74N/wDBJdf/ABylT/g1e+IK/wDNXfB3/gkuf/jlftpRR/a+K/m/BE/6sZf/ACP73/mficP+DWL4gj/mrng7/wAEtz/8cp3/ABCyfED/AKK54O/8Etz/APHK/a+in/bGK/m/BC/1Wy7+R/e/8z8Uh/wa0fED/orfg/8A8Etz/wDHKcP+DWvx+B/yVvwf/wCCW5/+OV+1dFH9s4r+b8EL/VXLf5H97/zPxX/4hb/H/wD0Vrwf/wCCW5/+OUq/8GuPj9f+ateD/wDwS3P/AMcr9p6KP7Zxf834Il8J5Y/sP/wJ/wCZ+La/8Guvj8D/AJK14Q/8Etz/APHKVf8Ag138fA/8lZ8If+CW5/8AjlftHRT/ALaxf834IX+qOWfyP/wJ/wCZ+MK/8Gv/AI+B/wCSseEP/BNc/wDxynD/AINgfHoP/JWPCP8A4Jrn/wCOV+zlFH9tYv8Am/BC/wBUcr/kf/gT/wAz8ZV/4NhvHoP/ACVjwj/4Jrn/AOOU7/iGI8ef9FX8Jf8Agmuf/jlfsxRT/tvF/wA34IX+p+V/yP8A8Cf+Z+NI/wCDYvx4P+ar+Ev/AATXP/xynj/g2P8AHn/RVvCX/gmuf/jlfsnRT/tzGfzfgif9TMq/59v/AMCl/mfjav8AwbIeO1/5qt4S/wDBNc//ABynD/g2U8dj/mq3hP8A8E1z/wDHK/ZCij+3cZ/N+CJfBWUP/l2//Apf5n44r/wbMeOx/wA1V8J/+Ca5/wDjlL/xDM+Ov+iq+E//AATXP/xyv2Nop/29jf5vwRH+o+Tvem//AAKX+Z+Ov/EM746/6Kr4U/8ABNcf/HKcP+DaDxyB/wAlU8Kf+Ca4/wDjlfsRRT/t/G/zfgv8if8AUTJv+fb/APApf5n49f8AENH45/6Kp4U/8E1x/wDHKcP+DafxyP8AmqfhT/wT3H/xyv2Doo/1gxv834L/ACF/qFkr/wCXb/8AApf5n4/D/g2r8cf9FT8K/wDgnuP/AI5Tx/wbXeNwf+Sp+Ff/AATXH/xyv1+op/6wY7+b8F/kT/qBkj/5dP8A8Cl/mfkH/wAQ2Xjf/oqXhX/wT3H/AMcp3/ENr43/AOipeFv/AAT3H/xyv16op/6w47+b8F/kT/xD7I3vSf8A4FL/ADPyHT/g238bKf8AkqPhb/wT3H/xyn/8Q3njb/oqPhb/AME9x/8AHK/XWij/AFix3834L/In/iHeRf8APp/+BS/zPyLH/Bt942H/ADVDwv8A+Ce4/wDjlPX/AINwvGoH/JUPC/8A4J7j/wCOV+uNFP8A1jx/8/4L/In/AIhzkP8Az6f/AIHL/M/JBP8Ag3G8ar/zU/wv/wCCi4/+OU//AIhyvGn/AEU/wx/4KLj/AOOV+tlFH+sWP/m/Bf5C/wCIb5B/z6f/AIHL/M/JRP8Ag3M8aK2f+Fn+GP8AwUXH/wAcp3/EOd4zz/yU7wx/4KLj/wCOV+tNFP8A1jx/8/4L/IX/ABDbIP8Any//AAOX+Z+TH/EOj4z/AOineGf/AATz/wDxynD/AIN1PGY/5qd4Z/8ABRP/APHK/WWij/WTMP5/wX+RH/EM+Hn/AMuX/wCBz/zPydX/AIN2fGQ/5qb4Z/8ABRP/APHKVf8Ag3a8ZKP+Sm+Gf/BRP/8AHK/WGij/AFkzD+f8F/kL/iGPDz/5cv8A8Dn/AJn5P/8AEO54y/6Kb4Z/8FE//wAcp8f/AAbweMUH/JTPDX/gon/+OV+rtFP/AFlzD+f8F/kT/wAQu4c/58v/AMDn/wDJH5SD/g3j8Yg/8lM8N/8Agon/APjlPH/BvP4wB/5KX4b/APBRP/8AHK/Viij/AFlzD+f8F/kH/ELuHP8Any//AAOf/wAkflSv/BvX4wA/5KX4b/8ABRP/APHKUf8ABvZ4wA/5KX4b/wDBRP8A/HK/VWij/WXMP5/wX+RL8LOG3vRf/gc//kj8ql/4N7PGCj/kpfhv/wAFE/8A8cpy/wDBvd4vB/5KV4b/APBRP/8AHK/VOin/AKzZh/P+C/yJ/wCIU8Nf8+H/AOBz/wDkj8rf+IfHxf8A9FK8Of8Agon/APjlOH/Bvl4uH/NSvDv/AIKJ/wD45X6oUUf6zZh/P+C/yI/4hNwy/wDlw/8AwOf/AMkflgP+DfPxcP8AmpXh3/wUz/8AxylH/Bvr4uH/ADUrw7/4KZ//AIuv1Ooo/wBZ8x/n/Bf5C/4hJwx/z4f/AIHP/wCSPyx/4h9fFpP/ACUnw7/4KZ//AIulH/Bvr4sH/NSfD3/gpn/+Lr9TaKf+s+Y/z/gv8if+IRcL/wDPh/8Agc//AJI/LT/iH38Wf9FJ8P8A/gpm/wDi6Q/8G+vis/8ANSfD/wD4KZv/AIuv1Moo/wBaMx/n/Bf5E/8AEH+Ff+gd/wDgc/8A5I/LT/iH38V4/wCSkeH/APwVTf8AxdL/AMQ/Hir/AKKR4f8A/BTN/wDF1+pVFP8A1ozH+f8ABf5E/wDEHOFP+gd/+Bz/APkj8th/wb8+Kh/zUjQP/BVN/wDF0D/g368VA/8AJSNA/wDBVN/8XX6k0Uf60Zl/P+C/yJ/4g1wn/wBA7/8AA5//ACR+W/8AxD+eKf8Aoo+gf+Cqb/4ul/4h/PFP/RSNA/8ABVN/8XX6j0Uv9aMx/n/Bf5C/4gxwl/0Dv/wOf/yR+XK/8G/3ikD/AJKPoH/gqm/+Lpf+If8A8U/9FH0H/wAFU3/xdfqLRR/rPmP8/wCC/wAhf8QX4S/6Bn/4HP8A+SPy7H/BADxQD/yUfQf/AAVTf/F0v/DgLxR/0UfQf/BVN/8AF1+odFH+s+Y/z/gv8hf8QX4S/wCgZ/8Agc//AJI/Lz/hwF4o/wCij6D/AOCqb/4unf8ADgbxR/0UbQf/AAVTf/F1+oNFL/WfMf5/wX+Qf8QW4R/6Bn/4HP8A+SPy9H/BAPxR/wBFH0H/AMFU3/xdRv8A8G/vihz/AMlI0H/wUzf/ABdfqNRSfEuYPef4L/IqPgzwnHbDv/wOf/yR+W//ABD9+Ks/8lK0D/wUTf8Axyo7n/g3y8U3I5+JPh78dHm/+OV+plFclTN8VU+OX4I9jB+HGQYX+BSa/wC35fqz8jvEH/Btr4u1bPkfFfw/a5/6gczD9Za43Vf+DWvxzqud3xj8Kj/aXw9cA/8Ao7FftHRXHLETl8R9HhsjwlDSkmvmz8TNL/4NWviNoN551l8cfC8Tdx/wjdxhh3BHn13mmf8ABt14xstBFtL47+GVxdZUPOfCs4EicZyvnH5iBjOffFfrvRWGl7nqqFlY/G7xT/wbK+PdbubP7J8U/ANjaWjBxbf8IxcOpOCOG87I69OnHStXwt/wbn/FXw3aeR/wt/wJJEjfuUTwzcxiNM8L/r+evWv18oo0HZ9z8n7H/ggT8XrSzjB+LngJ5xcbpH/4Ru7CvDn7gH2jhsYG7OM84rpNH/4IdfFKyvZWm+KPgl7YuDFEnh+5Uou3DAnzvmJbkHAwOPev08oqeSL6Fc0u5+Yfif8A4IK+LvHi2o1j4heGJPswlUGDSbmPIZgQP9b6KAfXmuZtv+Deb4j+GNch1XQPjJ4fsNStIVitppNDnc2+AQ23EwxuBI9s8V+sVFL2UL3sPnna1z88Pg9/wSS+MOgtqP8AwnPxZ8H+KPOIe0ez8Ny2MkBLMX3nzWDg5XHAxj3r70+GnhaTwL8ONA0SWVLiXR9Nt7F5UUqsrRRKhYA8gHbmtuit5VZSiovZGMacYtyR/9k=';
            doc.addImage(imgMovilidad, 'PNG', 15, 10, 190, 30);
                                    // COL, FIL, ancho, alto);

            doc.setFontSize(10);
            doc.setFont("helvetica");
            doc.setFontType("bold");
            // doc.text(65, 25, "GOBIERNO AUTONOMO MUNICIPAL DE LA PAZ");
            // doc.text(70, 29, "SECRETARIA MUNICIPAL DE MOVILIDAD");

            // doc.setFontSize(14);
            // doc.text(50, 35, "FORMULARIO DE AFILIACIÓN DEL VEHÍCULO");

            doc.setFontSize(10);
            doc.text(25, 45, "1. INFORMACION GENERAL:");

            doc.setFontSize(9);
            //doc.text(110, 45, 'CATEGORIA SOL:');    doc.text(160, 18, '' + $scope.obtpdf[0].codigo);

             // Para la elaboracion de Rectangulos enmarcando a los Requisitos
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
           doc.rect(20, 50, 175, 20); 
          ///             (COL, FIL, ANCHO, ALTO , X,X,X)


            doc.text(25, 55, 'CÓDIGO:');                      doc.text(100, 55, '' +  $scope.obtpdf.PTR_COD);
                //doc.text(25, 60, 'CLASIFICACION:');         doc.text(140, 50, '' + $scope.obtpdf[0].descripcion);
            doc.text(25, 60, 'FECHA DE CREACION :');           doc.text(100,60, '' + $scope.obtpdf.PTR_FEC_CREA);
                 //doc.text(110, 159, 'COLOR:');               doc.text(140,55, '' + $scope.obtpdf[0].colorcar);
            doc.text(25, 65, 'PROVENIENCIA DEL BIEN MUEBLE:'); doc.text(100, 65, '' + $scope.obtpdf.PTR_PROVIENE);
            //     doc.text(110, 60, 'Nº PUERTAS:');           doc.text(140, 60, '' + $scope.obtpdf[0].nropuertas);
            // doc.text(35, 65, 'MARCA:');                 doc.text(55,65, '' + $scope.obtpdf[0].marca);
            //     doc.text(110, 65, 'Nº ASIENTOS:');          doc.text(140,65, '' + $scope.obtpdf[0].capacidad);
            // doc.text(35, 70, 'TIPO:');                  doc.text(55, 70, '' + $scope.obtpdf[0].tipo);
            //     doc.text(110, 70, 'POLIZA:');               doc.text(140, 70, '' + $scope.obtpdf[0].poliza);
            // doc.text(35, 75, 'CLASE:');                 doc.text(55, 75, '' + $scope.obtpdf[0].clasevehiculo);
            //     doc.text(110, 75, 'PAIS:');                 doc.text(140,75,'' + $scope.obtpdf[0].pais);            
            
            //doc.text(20, 80, '...............................................................................................................................................................................................................................'); 
            doc.setFontSize(10);
            doc.text(25, 80, "2. CONTEXTO ORIGINAL:");   

             // Para la elaboracion de Rectangulos enmarcando a los Requisitos
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
           doc.rect(20, 85, 175, 38); 
          ///             (COL, FIL, ANCHO, ALTO , X,X,X)         

            doc.setFontSize(9);
            doc.text(22, 90, 'UBICACION GEOGAFICA UTM ANTERIOR:');           doc.text(110,90, '' + $scope.obtpdf.PTR_UBIC_ANT );
                                                                             // doc.text(110, 95, 'PUNTO 1');
                                                                             // doc.text(110, 100,'PUNTO 2');
                                                                             // doc.text(110, 105, 'PUNTO 3');
                                                                             // doc.text(110, 110, 'PUNTO 4');
                                                                             
             doc.text(22, 115, 'UBICACION ACTUAL:');                doc.text(110, 115, $scope.obtpdf.PTR_UBIC_ACT);
            doc.text(22, 120, 'RELACION DEL BIEN O PIEZA CON EL YACIMIENTO:');       //doc.text(110, 120, $scope.obtpdf.PTR_RELACION);
            //     doc.text(110, 110, 'ZONA REF.:');           doc.text(140, 110, '' + $scope.obtpdf[0].zona_ref);
        }
             doc.setFontSize(9);
             doc.text(22, 130, '3. DESCRIPCIÓN DEL BIEN MUEBLE:');   
           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
            doc.rect(20, 135, 175, 23); 
          ///             (COL, FIL, ANCHO, ALTO , X,X,X)
           doc.setFontSize(9);
            doc.text(22, 140, 'UBICACION GEOGAFICA UTM ANTERIOR:');           //doc.text(110,140, '' + $scope.obtpdf.PTR_DESC_BIEN );
                                                                             // doc.text(110, 145, 'PUNTO 1');
                                                                             // doc.text(110, 150,'PUNTO 2');
                                                                             // doc.text(110, 155, 'PUNTO 3');    

           //***
           doc.setFontSize(9);
             doc.text(22, 165, '4. MATERIAL:');   
           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
            doc.rect(20, 170, 175, 23); 

            doc.setFontSize(9);
            doc.text(22, 175, 'UBICACION GEOGAFICA UTM ANTERIOR:');           //doc.text(110,175, '' + $scope.obtpdf.PTR_MATERIAL );
                                                                             doc.text(110, 180, 'PUNTO 1');
                                                                             doc.text(110, 185,'PUNTO 2');
                                                                             doc.text(110, 190, 'PUNTO 3');

             //***
           doc.setFontSize(9);
             doc.text(22, 200, '5. TECNICA:');   
           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
            doc.rect(20, 205, 175, 23); 
            ///otra hoja
            //doc.addpage();
             doc.setFontSize(9);
            doc.text(22, 210, 'UBICACION GEOGAFICA UTM ANTERIOR:');           //doc.text(110,210, '' + $scope.obtpdf.PTR_TECN );
                                                                             doc.text(110, 215, 'PUNTO 1');
                                                                             doc.text(110, 220,'PUNTO 2');
                                                                             doc.text(110, 225, 'PUNTO 3');
            doc.setFontSize(9);
             doc.text(22, 235, '6. MANUFACTURA:');   
           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
            doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
            doc.rect(20, 240, 175, 23); 

            doc.setFontSize(9);
            doc.text(22, 245, 'UBICACION GEOGAFICA :');          // doc.text(110,245, '' + $scope.obtpdf.PTR_MANUF);
                                                                             doc.text(110, 250, 'PUNTO 1');
                                                                             doc.text(110, 255,'PUNTO 2');
                                                                             doc.text(110, 260, 'PUNTO 3');
            ///otra hoja
            doc.addPage();
            var imgMovilidad = 'data:image/jpeg;base64,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';
            doc.addImage(imgMovilidad, 'PNG', 15, 10, 190, 30);
                                    // COL, FIL, ancho, alto);

            doc.setFontSize(9);
             doc.text(20, 50, '7. DECORACIÓN:');   
           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
             doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
           doc.rect(20, 55, 175, 23); 

            doc.setFontSize(9);
            doc.text(22, 60, 'UBICACION GEOGAFICA:');           //doc.text(110,60, '' + $scope.obtpdf.PTR_DECOR );
                                                                             doc.text(110, 65, 'PUNTO 1');
                                                                             doc.text(110, 70,'PUNTO 2');
                                                                             doc.text(110, 75, 'PUNTO 3');

             doc.setFontSize(9);
             doc.text(20, 85, '8. DESCRIPCION DE LOS ATRIBUTOS:');   
           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
             doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
           doc.rect(20, 90, 175, 23); 

            doc.setFontSize(9);
            doc.text(22, 95, 'UBICACION GEOGAFICA:');           //doc.text(110,95, '' + $scope.obtpdf.PTR_ATRIB );
                                                                             doc.text(110, 100, 'PUNTO 1');
                                                                             doc.text(110, 105,'PUNTO 2');
                                                                             doc.text(110, 110, 'PUNTO 3');

           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
             doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
           doc.rect(20, 115, 175, 23); 

            doc.setFontSize(9);
            doc.text(22, 120,'ESTADO DE CONSERVACION:');           //doc.text(110,95, '' + $scope.obtpdf.PTR_DESC_ESTADO);
            doc.text(22, 125, 'DESCRIPCION DEL ESTADO:');           doc.text(110, 125, 'DATOS');
            doc.text(22, 130, 'CRONOLOGIA:');                       doc.text(110, 130, 'DATOS');
            doc.text(22, 135, 'FUNCIÓN:');                          doc.text(110, 135, 'DATOS');

            doc.setFontSize(9);
             doc.text(20, 145, 'FUNCIÓN:');                     
           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
             doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
           doc.rect(20, 150, 175, 23); 

            doc.setFontSize(9);
            doc.text(22, 155, 'UBICACION GEOGAFICA:');           //doc.text(110,155, '' + $scope.obtpdf.PTR_FUNC );

             doc.setFontSize(9);
             doc.text(20, 160, 'FOTOGRAFIAS:');   
           // Para la elaboracion de Rectangulos enmarcando a los Requisitos
             doc.setDrawColor(0);
            doc.setFillColor(255, 255, 255);            
           doc.rect(20, 165, 175, 23); 

            doc.setFontSize(9);
            doc.text(22, 170, 'FOTOGRAFIA GEOGAFICA:');           //doc.text(110,170, '' + $scope.obtpdf.PTR_IMAGEN);
                                                                             
                                                                             



                                                                             






        
        // if($scope.obtpdf.length > 1)
        // {
        //     //doc.text(20, 125, '...............................................................................................................................................................................................................................'); 
        //     doc.setFontSize(10);
        //     doc.text(25, 120, "3. DATOS DEL POSEEDOR:");  
        //     doc.setFontSize(9);
        //     doc.text(20, 125, 'AP. PATERNO:');           doc.text(55, 125, '' + $scope.obtpdf[1].paterno );
        //         doc.text(110, 125, 'AP. MATERNO:');          doc.text(140, 125, '' + $scope.obtpdf[1].materno);
        //     doc.text(20, 130, 'NOMBRES:');               doc.text(55, 130, '' + $scope.obtpdf[1].nombre);
        //         doc.text(110, 130, 'C.I.:');                 doc.text(140, 130, '' + $scope.obtpdf[1].ci);
        //     doc.text(20, 135, 'TELEFONO:');             doc.text(55, 135, '' + $scope.obtpdf[1].telefono);
        //         doc.text(110, 135, 'CORREO:');              doc.text(140, 135, '' + $scope.obtpdf[1].correo);
        //     doc.text(20, 140, 'DOMICILIO:');            doc.text(55, 140, '' + $scope.obtpdf[1].direccion);
        //         doc.text(110, 140, 'ZONA:');                doc.text(140, 140, '' + $scope.obtpdf[1].zona);            
        // }

        // doc.setFontSize(10);
        // doc.text(25, 150, "4. REQUISITOS:"); 
        // // Para la elaboracion de Rectangulos enmarcando a los Requisitos
        // doc.setDrawColor(0);
        // doc.setFillColor(255, 255, 255);            
        // doc.roundedRect(20, 152, 175, 33, 3, 3, 'FD'); 
        // ///             (COL, FIL, ANCHO, ALTO , X,X,X)
        // doc.setFontSize(8);
        // doc.text(25, 157, '•');
        // doc.text(28, 157, 'CERTIFICADO DE PROPIEDAD DE REGISTRO DEL VEHÍCULO AUTOMOTOR CPRVA-03, RADICATORIA DEL MUNICIPIO');        
        // doc.text(28, 162, 'DE LA PAZ (FOTOCOPIA), PARA EL CASO DE VEHÍCULOS MOTORIZADOS QUE PRESTEN EL SERVICIO INTERMUNICI-');        
        // doc.text(28, 167, 'PAL, SE ACEPTARÁ RADICATORIA DEL MUNICIPIO DE EL ALTO');
        // doc.text(25, 172, '•');
        // doc.text(28, 172, 'PÓLIZA DEL SEGURO OBLIGATORIO DE ACCIDENTES DE TRÁNSITO (SOAT) (FOTOCOPIA)');
        // doc.text(25, 177, '•');
        // doc.text(28, 177, 'CÉDULA DE IDENTIDAD DEL SOLICITANTE Y DEL PROPIETARIO DEL VEHÍCULO MOTORIZADO (FOTOCOPIA)');
        // doc.text(25, 182, '•');
        // doc.text(28, 182, 'TESTIMONIO DE PODER ESPECÍFICO (FOTOCOPIA LEGALIZADA, SI CORRESPONDE)');

        // doc.setFontSize(10);
        // doc.text(25, 192, "5. DECLARACION JURADA:"); 
        // Para la elaboracion de Rectangulos enmarcando a la declaracion jurada
        // doc.setDrawColor(0);***************************************
        // doc.setFillColor(255, 255, 255);            
        // doc.roundedRect(20, 194, 175, 28, 3, 3, 'FD'); 
        // ///             (COL, FIL, ANCHO, ALTO , X,X,X)
        // doc.setFontSize(8);

        // doc.text(25, 199, 'AL EFECTO SOLICITADO, JURO QUE TODA LA INFORMACIÓN CONSIGNADA Y ADJUNTA AL PRESENTE FORMULARIO ES');
        // doc.text(25, 204, 'FIDEDIGNA, VERÍDICA Y VERIFICABLE EN CUALQUIER MOMENTO, PARA LO CUAL AUTORIZO EXPRESAMENTE Y MANI-'); 
        // doc.text(25, 209, 'FIESTO EN PLENO CONSENTIMIENTO PARA QUE EL  GOBIERNO  AUTÓNOMO  MUNICIPAL  DE  LA  PAZ,  EN USO DE SUS');
        // doc.text(25, 214, 'ATRIBUCIONES ESPECIFICAS REALICE VERIFICACIONES QUE VEA POR CONVENIENTE. CONSIDÉRESE QUE EL FALSO');
        // doc.text(25, 219, 'TESTIMONIO SE CONSTITUYE UN DELITO TIPIFICADO EN EL ART. 169 DEL CÓDIGO PENAL.');        

        // doc.text(25, 255, '_________________________________________________________');
        // doc.text(110, 255, '_________________________________________________________');

        // doc.text(26,260, 'FIRMA DEL PROPIETARIO O POSEEDOR DEL VEHÍCULO');
        // doc.text(130,260, 'ACLARACIÓN DE FIRMA');
              
      doc.save('formularioPatrimonioArqueologico.pdf');
  };
  
  $scope.limpiar = function(){
    $scope.only=false;        
    $scope.obtCreacion= '';
    $scope.boton="new";
    $scope.titulo="Registro de Creacion";
  }; 

  $scope.$on('api:ready',function(){      
    $scope.getProcedimiento(sessionService.get('WS_ID'));
  });

  $scope.limpiarCampos = function(){
    $scope.datosCampo = '';
    $scope.boton = "new";
    $scope.desabilitado = false;
    $scope.tituloP = "Añadir Campo";
  };

  $scope.inicioCrear = function () {
    if(DreamFactory.api[CONFIG.SERVICE]){          
      $scope.getProcedimiento(sessionService.get('WS_ID'));
    }
  }; 

});








