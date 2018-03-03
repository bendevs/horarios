var urlIf = "http://192.168.34.18:9091/wsIf";
var urlComp;
var dataResp;
var dataParams;
var typeCall;

/*///////////////////////////////////////////////// EJECUTAR AJAX /////////////////////////////////////////////////*/
function ejecutarAjaxIF(vUrlComp, vTypeCall, vDataCall, vFunctionResp) {
    $.ajax({
      type: vTypeCall,
      url: urlIf + vUrlComp,
      data: vDataCall,
      //dataType: "json",
      async: false,
      //processData: true,
      success: function(response) {
        //console.log(response);
        dataResp = JSON.stringify(response);
        vFunctionResp(dataResp);
      },
      error: function (response, status, error) {
        //dataResp = response.responseText;
        dataResp = "{\"error\":{\"message\":\""+response.responseText+"\",\"code\":700}}";
        vFunctionResp(dataResp);
      }
    });
    return dataResp;
};
/*///////////////////////////////////////////////// CONSULTAS /////////////////////////////////////////////////*/

function reporteAe4(){
    this.AnioIni;
    this.AnioFin;
    this.Reg;
};

reporteAe4.prototype.filtrar_reporteAe4 = function (functionResp){
    urlComp = "/reporteAe4";
    typeCall = "post";
    dataParams = {
      "AnioIni":  this.AnioIni,
      "AnioFin":  this.AnioFin,
      "Reg":  this.Reg
    };

    ejecutarAjaxIF(urlComp, typeCall, dataParams, functionResp);
};
