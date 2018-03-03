//var urlIf2 = "http://gmlppc10007:9091/wsIf";
var urlIf2 = "http://192.168.5.248:9091/wsIf";
//CONEXION GENESIS
var urlGenesis = "http://192.168.5.248:9091/wsGENESIS";

var urlComp;
var dataResp;
var dataParams;
var typeCall;

/*///////////////////////////////////////////////// EJECUTAR AJAX /////////////////////////////////////////////////*/
function ejecutarAjaxIF2(vUrlComp, vTypeCall, vDataCall, vFunctionResp) {
    $.ajax({
      type: vTypeCall,
      url: urlIf2 + vUrlComp,
      data: vDataCall,
      async: false,
      success: function(response) {
        dataResp = JSON.stringify(response);
        vFunctionResp(dataResp);
      },
      error: function (response, status, error) {
        dataResp = "{\"error\":{\"message\":\""+response.responseText+"\",\"code\":700}}";
        vFunctionResp(dataResp);
      }
    });
    return dataResp;
};
/*///////////////////////////////////////////////// CREAR TRAMITE AE LINEA /////////////////////////////////*/
function renderData() {
    this.id_form;
    this.sql;
};
renderData.prototype.obtenerDataRender = function (functionResp) {
    urlComp = "/renderdatos";
    typeCall = "post";
    dataParams = {
      "id_form" : this.id_form
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};

renderData.prototype.renderSqlDinamic = function (functionResp) {
    try{
        urlComp = "/renderSql";
        typeCall = "post";
        dataParams = {
          "sql" : this.sql
        };
        ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
    } catch(e){
        console.log("Error de conexion : ", e);
    }
};

renderData.prototype.renderDatosSql = function (functionResp) {
    urlComp = "/renderdatosSql";
    typeCall = "post";
    dataParams = {
      "id_form" : this.id_form
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};
function casos() {
    this.nodo;
    this.ws;
};
casos.prototype.listar = function (functionResp) {
    urlComp = "/casos";
    typeCall = "post";
    dataParams = {
      "id_nodo" : this.nodo,
      "id_ws" : this.ws
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};

function nodo() {
    this.usuario;
};
nodo.prototype.listarNodo = function (functionResp) {
    urlComp = "/getNodos";
    typeCall = "post";
    dataParams = {
      "usuario" : this.usuario
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};





































function f_oculta_div(id){
    if (document.getElementById){
        try{
            var el = document.getElementById(id.trim());
            el.style.display = 'none';
        }catch(e){
            var serror  = "ADVERTENCIA DE CAMPO METODO: f_oculta_div - " +  id + ":" + e.toString();
            jsonError   =   jsonError   +   serror +    "<br>";
        }
    }
}
function f_muestra_div(id){
    if (document.getElementById){
        try{
            var el = document.getElementById(id.trim());
            el.style.display = 'block';
        }catch(e){
            var serror  = "ADVERTENCIA DE CAMPO METODO: f_muestra_div - " +  id + ":" + e.toString();
            jsonError   =   jsonError   +   serror +    "<br>";
        }
    }
}
function f_obtener_valor(id){
    if (document.getElementById){
        try{
        var val = document.getElementById(id.trim()).value;
        }catch(e){
            console.log("Error de comportamiento:", id);
            var serror  = "ADVERTENCIA DE CAMPO METODO: f_obtener_valor - " +  id + ":" + e.toString();
            jsonError   =   jsonError   +   serror +    "<br>";
        }
        return val;
    }
}
function f_obtener_valor_chkm(id){
    if (document.getElementById){
        var srespuesta  =   "";
        try{
            var val = document.getElementById(id.trim());
            var schecks =   $('input:checkbox[id="' + id + '"]:checked');
            var ItemArray = [];
            $.each(schecks, function (cont, data){
                ItemArray.push({
                    nombre : data.value,
                    valor: data.checked
                });
            });
            srespuesta  =   JSON.stringify(ItemArray);
        }catch(e){
            console.log("Error de comportamiento:", id);
            var serror  = "ADVERTENCIA DE CAMPO METODO: f_obtener_valor - " +  id + ":" + e.toString();
            jsonError   =   jsonError   +   serror +    "<br>";
        }
        return srespuesta;
    }
}
function f_obtener_texto(id){
    try{
        var combo = document.getElementById(id.trim());
        var selected = combo.options[combo.selectedIndex].text;
        document.getElementById(id+'_VALOR').value = selected;
        console.log(selected);
    }catch(e){
        var serror  = "ADVERTENCIA DE CAMPO METODO: f_obtener_texto - " +  id + ":" + e.toString();
        jsonError   =   jsonError   +   serror +    "<br>";
    }
}

//FECHA Y HORA DEL SERVIDOR
function fechaserver() {
};
fechaserver.prototype.fechahora = function (functionResp) {
    urlComp = "/fechaHora";
    typeCall = "post";
    dataParams = {
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};

//IP CLIENTE - SERVER
function ipae() {
};
ipae.prototype.ipClienteServer = function (functionResp) {
    urlComp = "/ipservicio";
    typeCall = "post";
    dataParams = {
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};

//IF - ALMACENAR DOCUMENTOS
function gIfDocumento() {
    /*this.doc_sistema;
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
    this.doc_id_codigo;*/
    this.doc_sistema;
    this.doc_proceso;
    this.doc_id;
    this.doc_ci_nodo;
    this.doc_datos;
    this.doc_titulo;
    this.doc_palabras;
    this.doc_url;
    this.doc_version;
    this.doc_tiempo;
    this.doc_firma_digital;
    this.doc_estado;
    this.doc_usuario;
    this.doc_tipo_documento;
    this.doc_tamanio_documento;
    this.doc_nombre;
    this.doc_tps_doc_id;
    this.doc_url_logica;
    this.doc_acceso;
    this.doc_cuerpo;
    this.doc_tipo_documentacion;
    this.doc_tipo_ingreso;
    this.doc_estado_de_envio;
    this.doc_correlativo;
    this.doc_tipo_documento_ext;
    this.doc_nrotramite_nexo;
    this.doc_id_carpeta;
};

gIfDocumento.prototype.almacenarDoc = function (functionResp) {
    urlComp = "/crearAdjunto";
    typeCall = "post";
    dataParams = {
        /*"sdoc_sistema" : this.doc_sistema,
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
        "sdoc_id_codigo" : this.doc_id_codigo.toString()*/
        "doc_sistema" : this.doc_sistema,
        "doc_proceso" : this.doc_proceso,
        "doc_id" : this.doc_id.toString(),
        "doc_ci_nodo" : this.doc_ci_nodo,
        "doc_datos" : this.doc_datos,
        "doc_titulo" : "",
        "doc_palabras" : "",
        "doc_url" : this.doc_url,
        "doc_version" : this.doc_version,
        "doc_tiempo" : this.doc_tiempo,
        "doc_firma_digital" : this.doc_firma_digital.toString(),
        "doc_estado" : "",
        "doc_usuario" : this.doc_usuario,
        "doc_tipo_documento" : this.doc_tipo_documento,
        "doc_tamanio_documento" : this.doc_tamanio_documento,
        "doc_nombre" : this.doc_nombre,
        "doc_tps_doc_id" : this.doc_tps_doc_id,
        "doc_url_logica" : this.doc_url_logica,
        "doc_acceso" : this.doc_acceso,
        "doc_cuerpo" : "",
        "doc_tipo_documentacion" : this.doc_tipo_documento_ext,
        "doc_tipo_ingreso" : "",
        "doc_estado_de_envio" : "",
        "doc_correlativo" : "",
        "doc_tipo_documento_ext" : this.doc_tipo_documento_ext,
        "doc_nrotramite_nexo" : this.doc_nrotramite_nexo,
        "doc_id_carpeta" : 0
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};

//IF - GUARDAR DATOS
/*console.log(req.body.datos);
console.log(req.body.casid);*/
function guardarFormData() {
    this.datos;
    this.fmodificado;
    this.usrid;
    this.casid;
};
guardarFormData.prototype.casdatos = function (functionResp) {
    urlComp = "/guardarFormCasos";
    typeCall = "post";
    dataParams = {
        "datos" : this.datos,
        "fmodificado":this.fmodificado,
        "usrid":this.usrid,
        "casid" : this.casid
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};

/*AVANZAR TRAMITE --*/
function avanzarCaso() {
    this.actid;
    this.usrid;
    this.casoid;
    this.datoshistorico;
    this.macro_id;
};

avanzarCaso.prototype.avanzar = function (functionResp) {
    urlComp = "/avanzarCaso";
    typeCall = "post";
    dataParams = {
        "actid":this.actid,
        "usrid":this.usrid,
        "casoid":this.casoid,
        "datoshistorico":this.datoshistorico,
        "macro_id":this.macro_id
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};

//AE - CONEXION GENESIS
var urlCompGen;
var dataRespGen;
var dataParamsGen;
var typeCallGen;

/*///////////////////////////////////////////////// EJECUTAR AJAX /////////////////////////////////////////////////*/
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

//AE - REGISTRAR ACITIVIDAD ECONOMICA
function registrarAE() {
    this.idContribuyente;
    this.clase;
    this.hojaRuta;
    this.numeroOrden;
    this.nit;
    this.cuentaEnergiaElectrica;
    this.idActividadDesarrollada;
    this.denominacion;
    this.inicio;
    this.fin;
    this.tipoVia;
    this.via;
    this.numero;
    this.edificio;
    this.bloque;
    this.piso;
    this.departamento;
    this.idZona;
    this.idDistrito;
    this.entreCalles;
    this.telefono;
    this.casilla;
    this.codigoZona;
    this.superficie;
    this.idCategoria;
    this.productosElaborados;
    this.actividadesSecundarias;
    this.establecimiento;
    this.tipoActividad;
    this.factor;
    this.horarioAtencion;
    this.capacidad;
    this.estado;
    this.tipoTransaccion;
    this.usuario;
    this.ipUsuario;
    this.equipo;
    this.funcionario;
    this.tipoFormulario;
    this.observaciones;
};

registrarAE.prototype.registrar = function (functionResp) {
    urlCompGen = "/registrarAE";
    typeCallGen = "post";
    dataParamsGen = {
        "idContribuyente": this.idContribuyente,
        "clase": this.clase,
        "hojaRuta": this.hojaRuta,
        "numeroOrden": this.numeroOrden,
        "nit": this.nit,
        "cuentaEnergiaElectrica": this.cuentaEnergiaElectrica,
        "idActividadDesarrollada": this.idActividadDesarrollada,
        "denominacion": this.denominacion,
        "inicio": this.inicio,
        "fin": this.fin,
        "tipoVia": this.tipoVia,
        "via": this.via,
        "numero": this.numero,
        "edificio": this.edificio,
        "bloque": this.bloque,
        "piso": this.piso,
        "departamento": this.departamento,
        "idZona": this.idZona,
        "idDistrito": this.idDistrito,
        "entreCalles": this.entreCalles,
        "telefono": this.telefono,
        "casilla": this.casilla,
        "codigoZona": this.codigoZona,
        "superficie": this.superficie,
        "idCategoria": this.idCategoria,
        "productosElaborados": this.productosElaborados,
        "actividadesSecundarias": this.actividadesSecundarias,
        "establecimiento": this.establecimiento,
        "tipoActividad": this.tipoActividad,
        "factor": this.factor,
        "horarioAtencion": this.horarioAtencion,
        "capacidad": this.capacidad,
        "estado": this.estado,
        "tipoTransaccion": this.tipoTransaccion,
        "usuario": this.usuario,
        "ipUsuario": this.ipUsuario,
        "equipo": this.equipo,
        "funcionario": this.funcionario,
        "tipoFormulario": this.tipoFormulario,
        "observaciones": this.observaciones
    };
    ejecutarAjaxGenesis(urlCompGen, typeCallGen, dataParamsGen, functionResp);
};

//AE - LISTAR ID AREA RECAUDACION POR USUARIO
function arearecaudacion(){
    this.usuario;
};
arearecaudacion.prototype.lstAreaRecaudacion = function (functionResp) {
    urlCompGen = "/lstAreaRecaudadionXusuaio";
    typeCallGen = "post";
    dataParamsGen = {
      "usuario" : this.usuario
    };
    ejecutarAjaxGenesis(urlCompGen, typeCallGen, dataParamsGen, functionResp);
};

function actividadesContribuyente(){
    this.idContribuyente;
    this.tipo;
};
actividadesContribuyente.prototype.lstActividadesEconomicas = function (functionResp) {
    urlCompGen = "/lstActividaEconomica";
    typeCallGen = "post";
    dataParamsGen = {
      "idContribuyente" : this.idContribuyente,
      "tipo" : this.tipo
    };
    ejecutarAjaxGenesis(urlCompGen, typeCallGen, dataParamsGen, functionResp);
};






function crearTramite() {
    this.proid;
    this.actid;
    this.usr_id;
    this.datos;
    this.procodigo;
    this.macro_id;
    this.nodo_id;
    this.ws_id;
};
crearTramite.prototype.crear_tramite_macro = function (functionResp) {
    urlComp = "/crearTramiteLotus";
    typeCall = "post";
    dataParams = {
        "proid" : this.proid,
        "actid" : this.actid,
        "usr_id" : this.usr_id,
        "datos" : this.datos,
        "procodigo" : this.procodigo,
        "macro_id" : this.macro_id,
        "nodo_id" : this.nodo_id,
        "ws_id" : this.ws_id
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};

function buscarCaso(){
    this.id_nodo;
    this.id_ws;
    this.scampo;
};
buscarCaso.prototype.bsccaso = function (functionResp) {
    urlCompGen = "/buscarCaso";
    typeCallGen = "post";
    dataParamsGen = {
      "id_nodo" : this.id_nodo,
      "id_ws" : this.id_ws,
      "scampo" : this.scampo
    };
    ejecutarAjaxIF2(urlCompGen, typeCallGen, dataParamsGen, functionResp);
};

function modificarCasos(){
    this.casid;
    this.modificacion;
    this.casdatos;
    this.usr_id;
};
modificarCasos.prototype.modificar_Casos = function (functionResp) {
    urlComp = "/modificarCasos";
    typeCall = "post";
    dataParams = {
      "casid"           : this.casid,
      "modificacion"    : this.modificacion,
      "casdatos"        : this.casdatos,
      "usr_id"          : this.usr_id
    };
    ejecutarAjaxIF2(urlComp, typeCall, dataParams, functionResp);
};