//var urlIf = "http://192.168.5.248:9091/wsRCPG";
var urlIf = "http://192.168.35.33:9091/wsRCPG";
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
var urlGenesis = "http://192.168.5.248:9099/wsGENESIS";
function ejecutarAjaxGenesis(vUrlCompGen, vTypeCallGen, vDataCallGen, vFunctionRespGen) {
    try{
        $.ajax({
          type: vTypeCallGen,
          url: urlGenesis + vUrlCompGen,
          data: vDataCallGen,
          async: false,
          success: function(response) {
            dataRespGen = JSON.stringify(response);
            vFunctionRespGen(dataRespGen);
          },
          error: function (response, status, error) {
            dataRespGen = "{\"error\":{\"message\":\""+response.responseText+"\",\"code\":700}}";
            vFunctionRespGen(dataRespGen);
          }
        });
        return dataRespGen;
    }catch(error){
        return error;
    }
};


/*///////////////////////////////////////////////// CREAR TRAMITE AE LINEA /////////////////////////////////*/
function gCrearCaso() {
    this.usr_id;
    this.datos;
    this.procodigo;
};
gCrearCaso.prototype.crearCasoAeLinea = function (functionResp) {
    urlComp = "/crearCasoAeLinea";
    typeCall = "post";
    dataParams = {
      "usr_id" : this.usr_id,
      "datos" : this.datos,
      "procodigo" : this.procodigo
    };
    ejecutarAjaxIF(urlComp, typeCall, dataParams, functionResp);
};
/*///////////////////////////////////////////////// NATURAL /////////////////////////////////////////////////*/
function gDocumentos() {
    this.doc_sistema;
    this.doc_proceso;
    this.doc_id;
    this.doc_ci_nodo;
    this.doc_datos;
    this.doc_url;
    this.doc_version;
    this.doc_tiempo;
    this.doc_firma_digital;
    this.doc_usuario;
    this.doc_tipo_documento;
    this.doc_tamanio_documento;
    this.doc_nombre;
    this.doc_tps_doc_id;
    this.doc_url_logica;
    this.doc_acceso;
    this.doc_tipo_documento_ext;
    this.doc_nrotramite_nexo;
    this.doc_id_codigo;
};
gDocumentos.prototype.insertarDoc = function (functionResp) {
    urlComp = "/gDocumentosIf";
    typeCall = "post";
    dataParams = {
      "sdoc_sistema" : this.doc_sistema,
      "sdoc_proceso" : this.doc_proceso,
      "sdoc_id" : this.doc_id.toString(),
      "sdoc_ci_nodo" : this.doc_ci_nodo,
      "sdoc_datos" : this.doc_datos,
      "sdoc_url" : this.doc_url,
      "sdoc_version" : this.doc_version,
      "sdoc_tiempo" : this.doc_tiempo,
      "sdoc_firma_digital" : this.doc_firma_digital.toString(),
      "sdoc_usuario" : this.doc_usuario,
      "sdoc_tipo_documento" : this.doc_tipo_documento,
      "sdoc_tamanio_documento" : this.doc_tamanio_documento,
      "sdoc_nombre" : this.doc_nombre,
      "sdoc_tps_doc_id" : this.doc_tps_doc_id,
      "sdoc_url_logica" : this.doc_url_logica,
      "sdoc_acceso" : this.doc_acceso,
      "sdoc_tipo_documento_ext" : this.doc_tipo_documento_ext,
      "sdoc_nrotramite_nexo" : this.doc_nrotramite_nexo,
      "sdoc_id_codigo" : this.doc_id_codigo.toString()
    };
    ejecutarAjaxIF(urlComp, typeCall, dataParams, functionResp);
};
function fum() {
    this.tra_id;
    this.estado_pago;
    this.fum;
};
fum.prototype.estadoFum = function (functionResp) {
    urlComp = "/updEstadoFum";
    typeCall = "post";
    dataParams = {
      "tra_id" : this.tra_id,
      "estado_pago" : this.estado_pago,
      "fum" : this.fum
    };
    ejecutarAjaxIF(urlComp, typeCall, dataParams, functionResp);
};





function lstDatosGenesis(){
    this.idContribuyente;
    this.clase;
    this.padron;
    this.identificacion;
    this.primerNombre;
    this.primerApellido;
    this.segundoApellido;
    this.nit;
    this.empresa;
    this.p_accion;
};
lstDatosGenesis.prototype.lst_DatosGenesis = function (functionResp) {
    urlCompGen = "/lstDatosGenesis";
    typeCallGen = "post";
    dataParamsGen = {
      "idContribuyente" : this.idContribuyente,
      "clase"           : this.clase,
      "padron"          : this.padron,
      "identificacion"  : this.identificacion,
      "primerNombre"    : this.primerNombre,
      "primerApellido"  : this.primerApellido,
      "segundoApellido" : this.segundoApellido,
      "nit"             : this.nit,
      "empresa"         : this.empresa,
      "p_accion"        : this.p_accion
    };
    ejecutarAjaxGenesis(urlCompGen, typeCallGen, dataParamsGen, functionResp);
};
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
