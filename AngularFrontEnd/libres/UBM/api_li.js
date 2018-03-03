
var urlRCPG = "http://localhost:9091/wsHorarios";
var urlComp;
var dataResp;
var dataParams;
var typeCall;

/*///////////////////////////////////////////////// EJECUTAR AJAX /////////////////////////////////////////////////*/

function ejecutarAjax1(vUrlComp, vTypeCall, vDataCall, vFunctionResp) {
  $.ajax({
    type: vTypeCall,
    url: urlRCPG + vUrlComp,
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

/*///////////////////////////////////////////////// VALIDAR CAMPOS /////////////////////////////////////////////////*/
function spCatalogo(){

  this.pla;
  this.mar;
  this.tip;
  this.mod;
  this.pol;
  this.cha;
  this.mot;
  this.pa;
  this.rad;
  this.cil;
  this.tra;
  this.plaza;
  this.usr;
  this.via;
  this.ini;
  this.fin;
};

spCatalogo.prototype.getMenu = function (functionResp){
  urlComp = "/listarInfracciones";
  typeCall = "post";
  dataParams = {
    "fechainic":  this.fechainic,
    "fechafin":  this.fechafin,
    "accion":  this.accion
  };

  ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);
};

spCatalogo.prototype.listaAula = function (functionResp){
  urlComp = "/listaAula";
  typeCall = "post";
  dataParams = {
    "id":  this.id,
    "aula":  this.au_aula
  };

  ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);
};

spCatalogo.prototype.getlistaVehiculo = function (functionResp){
  urlComp = "/listaVehiculo";
  typeCall = "post";
  /*  dataParams = {
      "fechainic":  this.fechainic,
      "fechafin":  this.fechafin,
      "accion":  this.accion
    };*/

    ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);
  };

  spCatalogo.prototype.getcrearVehiculo = function (functionResp){
    urlComp = "/createvehiculo";
    typeCall = "post";
    dataParams = {
      "pla":  this.pla,
      "mar":  this.mar,
      "tip":  this.tip,
      "mod":  this.mod,
      "pol":  this.pol,
      "cha":  this.cha,
      "mot":  this.mot,
      "pa":  this.pa,
      "rad":  this.rad,
      "cil":  this.cil,
      "tra":  this.tra,
      "plaza":  this.plaza,
      "usr":  this.usr
    };

    ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);
  };
