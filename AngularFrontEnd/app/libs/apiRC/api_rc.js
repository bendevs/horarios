//var urlRC = "http://40.117.238.8:90/wsRC";
//var urlRCPG = "http://40.117.238.8:90/wsRCPG";
var urlRC = "http://192.168.5.248:9091/wsRC";
var urlRCPG = "http://192.168.5.248:9091/wsRCPG";
var urlComp;
var dataResp;
var dataParams;
var typeCall;

/*///////////////////////////////////////////////// EJECUTAR AJAX /////////////////////////////////////////////////*/
function ejecutarAjax(vUrlComp, vTypeCall, vDataCall, vFunctionResp) {
    $.ajax({
      type: vTypeCall,
      url: urlRC + vUrlComp,
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
function validarDocumento(documento) {
    if( typeof(documento) != 'undefined' && documento != null && documento != "" && documento.slice(-1) == "-" ){ 
        return false 
    }
    else { 
        if (/^([0-9\-])*$/.test(documento)) { return true } else { return false }
    }
};

function validarNatural(opcion, datos) {
    switch(opcion)
    {
      case "NEW": 
        if( ( typeof(datos.nombre) != 'undefined' && datos.nombre != null && datos.nombre != "") &&
            ( typeof(datos.materno) != 'undefined' && datos.materno != null && datos.materno != "") &&
            ( typeof(datos.ci) != 'undefined' && datos.ci != null && datos.ci != "") &&
            ( typeof(datos.expedido) != 'undefined' && datos.expedido != null && datos.expedido != "") &&
            ( typeof(datos.fec_nacimiento) != 'undefined' && datos.fec_nacimiento != null && datos.fec_nacimiento != "") &&
            ( typeof(datos.lugar_nacimiento) != 'undefined' && datos.lugar_nacimiento != null && datos.lugar_nacimiento != "") &&
            ( typeof(datos.sexo) != 'undefined' && datos.sexo != null && datos.sexo != "") &&
            ( typeof(datos.id_estado_civil) != 'undefined' && datos.id_estado_civil != null && datos.id_estado_civil != "") &&
            ( typeof(datos.profesion) != 'undefined' && datos.profesion != null && datos.profesion != "") )
        {
            return true
        }
        break;

      case "UPD": 
        if( ( typeof(datos.nombre) != 'undefined' && datos.nombre != null && datos.nombre != "") &&
            ( typeof(datos.materno) != 'undefined' && datos.materno != null && datos.materno != "") &&
            ( typeof(datos.ci) != 'undefined' && datos.ci != null && datos.ci != "") &&
            ( typeof(datos.expedido) != 'undefined' && datos.expedido != null && datos.expedido != "") &&
            ( typeof(datos.fec_nacimiento) != 'undefined' && datos.fec_nacimiento != null && datos.fec_nacimiento != "") &&
            ( typeof(datos.lugar_nacimiento) != 'undefined' && datos.lugar_nacimiento != null && datos.lugar_nacimiento != "") &&
            ( typeof(datos.sexo) != 'undefined' && datos.sexo != null && datos.sexo != "") &&
            ( typeof(datos.id_estado_civil) != 'undefined' && datos.id_estado_civil != null && datos.id_estado_civil != "") &&
            ( typeof(datos.profesion) != 'undefined' && datos.profesion != null && datos.profesion != "")

            // ( typeof(datos.pais) != 'undefined' && datos.pais != null && datos.pais != "") &&
            // ( typeof(datos.departamento) != 'undefined' && datos.departamento != null && datos.departamento != "") &&
            // ( typeof(datos.provincia) != 'undefined' && datos.provincia != null && datos.provincia != "") &&
            // ( typeof(datos.municipio) != 'undefined' && datos.macrodistrito != null && datos.macrodistrito != "") &&
            // ( typeof(datos.macrodistrito) != 'undefined' && datos.profesion != null && datos.profesion != "") &&
            // ( typeof(datos.distrito) != 'undefined' && datos.distrito != null && datos.distrito != "") &&
            // ( typeof(datos.zona) != 'undefined' && datos.zona != null && datos.zona != "") &&
            // ( typeof(datos.tipo_via) != 'undefined' && datos.tipo_via != null && datos.tipo_via != "") &&
            // ( typeof(datos.nombre_via) != 'undefined' && datos.nombre_via != null && datos.nombre_via != "") 
            )
        {
            return true
        }
        break;

      case "DEL": 
        return false
        break;

      return false
    }
};


function validarJuridico(opcion, datos) {
    switch(opcion)
    {
      case "NEW": 
        if( ( typeof(datos.nit) != 'undefined' && datos.nit != null && datos.nit != "") 
            // ( typeof(datos.razonSocial) != 'undefined' && datos.razonSocial != null && datos.razonSocial != "") &&
            // ( typeof(datos.ci_representante) != 'undefined' && datos.ci_representante != null && datos.ci_representante != "") &&
            // ( typeof(datos.poder_replegal) != 'undefined' && datos.poder_replegal != null && datos.poder_replegal != "") &&
            // ( typeof(datos.nro_notaria) != 'undefined' && datos.nro_notaria != null && datos.nro_notaria != "") 
          )
        {
            return true
        }
        break;

      case "UPD": 
        if( ( typeof(datos.nit) != 'undefined' && datos.nit != null && datos.nit != "") &&
            ( typeof(datos.razonSocial) != 'undefined' && datos.razonSocial != null && datos.razonSocial != "") &&
            ( typeof(datos.ci_representante) != 'undefined' && datos.ci_representante != null && datos.ci_representante != "") &&
            ( typeof(datos.poder_replegal) != 'undefined' && datos.poder_replegal != null && datos.poder_replegal != "") &&
            ( typeof(datos.nro_notaria) != 'undefined' && datos.nro_notaria != null && datos.nro_notaria != "")&&

            ( typeof(datos.pais) != 'undefined' && datos.pais != null && datos.pais != "")&&
            ( typeof(datos.departamento) != 'undefined' && datos.departamento != null && datos.departamento != "")&&
            ( typeof(datos.provincia) != 'undefined' && datos.provincia != null && datos.provincia != "")&&
            ( typeof(datos.municipio) != 'undefined' && datos.municipio != null && datos.municipio != "")&&
            ( typeof(datos.macrodistrito) != 'undefined' && datos.macrodistrito != null && datos.macrodistrito != "")&&
            ( typeof(datos.distrito) != 'undefined' && datos.distrito != null && datos.distrito != "")&&
            ( typeof(datos.zona) != 'undefined' && datos.zona != null && datos.zona != "")&&
            ( typeof(datos.tipo_via) != 'undefined' && datos.tipo_via != null && datos.tipo_via != "")&&
            ( typeof(datos.nombre_via) != 'undefined' && datos.nombre_via != null && datos.nombre_via != "") )
        {
            return true
        }
        break;

      case "DEL": 
        return false
        break;

      return false
    }
};

////////////////////////////////////////////PROFESION///////////////////////////
function rcProfesion() {
};
rcProfesion.prototype.getProfesiones = function (functionResp)
{
   
      urlComp = "/getProfesiones";
      typeCall = "post";
      dataParams = {
      };

      ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);  
   
};
/*///////////////////////////////////////////////// LOGUIN /////////////////////////////////////////////////*/
function rcLoguin() {
    this.usuario;
    this.pin;
};

rcLoguin.prototype.loguinDatosNatural = function (functionResp)
{
    if(validarDocumento(this.usuario))
    {
      urlComp = "/loguin";
      typeCall = "post";
      dataParams = {
        "usuario":  this.usuario,
        "pin": this.pin
      };

      ejecutarAjax(urlComp, typeCall, dataParams, functionResp);  
    }
    else
    {
      dataResp = "{\"error\":{\"message\":\"usuario con formato incorrecto\",\"code\":701}}";
      functionResp(dataResp);
    }
};

/*///////////////////////////////////////////////// NATURAL /////////////////////////////////////////////////*/
function rcNatural(){
    this.nombre;
    this.paterno;
    this.materno;
    this.tercer_apellido;
    this.ci;
    this.complemento;
    this.expedido;
    this.fec_nacimiento;
    this.lugar_nacimiento;
    this.pais_origen;
    this.sexo;
    this.id_estado_civil;
    this.profesion;
    this.otra_profesion;
    this.telefono;
    this.movil;
    this.correo;
    this.direccion;

    this.pais;
    this.departamento;
    this.provincia;
    this.municipio;
    this.macrodistrito;
    this.macrodistrito_desc;
    this.distrito;
    this.distrito_desc;
    this.zona;
    this.zona_desc;
    this.tipo_via;
    this.nombre_via;
    this.numero_casa;
    this.edificio;
    this.bloque;
    this.piso;
    this.oficina;

    this.latitud;
    this.longitud;
    
    this.usr_id;
    this.activacionf;
    this.activaciond;
    this.file_fotocopia_ci;
    this.fec_vencimiento;
    this.file_factura_luz;
    this.URL;

    this.oid;

    this.pinAnterior;
    this.pinNuevo;
};

rcNatural.prototype.buscarPersona = function (functionResp)
{  
    urlComp = "/buscarPersona";
    typeCall = "post";
    dataParams = {
      "tipo_persona":  this.tipo_persona,
      "ci":  this.ci,
      "nombres":  this.nombres,
      "paterno":  this.paterno,
      "materno":  this.materno,
      "nit":  this.nit,
      "razon_social":  this.razonSocial,
      "ci_representante":  this.ci_r,
      "representante":  this.representante
    };

    ejecutarAjax(urlComp, typeCall, dataParams, functionResp);
};

rcNatural.prototype.buscarNatural = function (functionResp)
{
    urlComp = "/ciudadano";
    typeCall = "post";
    dataParams = {
      "ci":  this.ci,
      "complemento":  this.complemento,
      "nombre":  this.nombre,
      "paterno":  this.paterno,
      "materno":  this.materno,
    };

    ejecutarAjax(urlComp, typeCall, dataParams, functionResp);
};

rcNatural.prototype.crearNatural = function (functionResp)
{
    urlComp = "/new";
    typeCall = "post";

    if(validarNatural("NEW", this))
    {
        dataParams = {
          "ci": this.ci,
          "complemento": this.complemento,
          "nombres": this.nombre,
          "paterno": this.paterno,
          "materno": this.materno,
          "tercer_apellido": this.tercer_apellido,
          "expedido": this.expedido,
          "fec_nacimiento": this.fec_nacimiento,
          "lugar_nacimiento": this.lugar_nacimiento,
          "pais_origen": this.pais_origen,
          "sexo": this.sexo,
          "id_estado_civil": this.id_estado_civil,
          "profesion": this.profesion,
          "otra_profesion": this.otra_profesion,
          "telefono": this.telefono,
          "movil": this.movil,
          "correo": this.correo,
          "direccion": this.direccion,          
          "tipo_persona": "NATURAL",
          "usr_id": this.usr_id,
          "activacionf": "NO",
          "activaciond": "NO"
        };

        console.log("PARAEMTRSO...:",dataParams);

        ejecutarAjax(urlComp, typeCall, dataParams, functionResp);
    }
    else
    {
        dataResp = "{\"error\":{\"message\":\"Uno o varios campos obligatorios vacios\",\"code\":702}}";
        functionResp(dataResp);
    }
};

rcNatural.prototype.datosCiudadanoNatural = function (functionResp)
{
  urlComp = "/obtDatos";
  typeCall = "post";

  dataParams = {
          "oid": this.oid
  };

  ejecutarAjax(urlComp, typeCall, dataParams, functionResp);


}

rcNatural.prototype.modificarNatural = function (functionResp)
{
    //var id="57798d0e2f59181eb2806c01";
    urlComp = "/updatePrs/" + this.oid;
    //urlComp = "/updatePrs/" + id;
    typeCall = "put";
    
    if(validarNatural("UPD", this))
    {
        dataParams = {          
          "nombres": ((typeof(this.nombre) == 'undefined' || this.nombre == null) ? "" : this.nombre),
          "paterno": ((typeof(this.paterno) == 'undefined' || this.paterno == null) ? "" : this.paterno),
          "materno": ((typeof(this.materno) == 'undefined' || this.materno == null) ? "" : this.materno),
          "tercer_apellido": ((typeof(this.tercer_apellido) == 'undefined' || this.tercer_apellido == null) ? "" : this.tercer_apellido),
          "ci": ((typeof(this.ci) == 'undefined' || this.ci == null) ? "" : this.ci),
          "complemento": ((typeof(this.complemento) == 'undefined' || this.complemento == null) ? "" : this.complemento),
          "expedido": ((typeof(this.expedido) == 'undefined' || this.expedido == null) ? "" : this.expedido),
          "fec_nacimiento": ((typeof(this.fec_nacimiento) == 'undefined' || this.fec_nacimiento == null) ? "" : this.fec_nacimiento),
          "lugar_nacimiento": ((typeof(this.lugar_nacimiento) == 'undefined' || this.lugar_nacimiento == null) ? "" : this.lugar_nacimiento),
          "pais_origen": ((typeof(this.pais_origen) == 'undefined' || this.pais_origen == null) ? "" : this.pais_origen),
          "sexo": ((typeof(this.sexo) == 'undefined' || this.sexo == null) ? "" : this.sexo),
          "id_estado_civil": ((typeof(this.id_estado_civil) == 'undefined' || this.id_estado_civil == null) ? "" : this.id_estado_civil),
          "profesion": ((typeof(this.profesion) == 'undefined' || this.profesion == null) ? "" : this.profesion),
          "otra_profesion": ((typeof(this.otra_profesion) == 'undefined' || this.otra_profesion == null) ? "" : this.otra_profesion),
          "telefono": ((typeof(this.telefono) == 'undefined' || this.telefono == null) ? "" : this.telefono),
          "movil": ((typeof(this.movil) == 'undefined' || this.movil == null) ? "" : this.movil),
          "correo": ((typeof(this.correo) == 'undefined' || this.correo == null) ? "" : this.correo),
          "direccion": ((typeof(this.direccion) == 'undefined' || this.direccion == null) ? "" : this.direccion),
          "pais": ((typeof(this.pais) == 'undefined' || this.pais == null) ? "" : this.pais),
          "departamento": ((typeof(this.departamento) == 'undefined' || this.departamento == null) ? "" : this.departamento),
          "provincia": ((typeof(this.provincia) == 'undefined' || this.provincia == null) ? "" : this.provincia),
          "municipio": ((typeof(this.municipio) == 'undefined' || this.municipio == null) ? "" : this.municipio),
          "macrodistrito": ((typeof(this.macrodistrito) == 'undefined' || this.macrodistrito == null) ? "" : this.macrodistrito),
          "macrodistrito_desc": ((typeof(this.macrodistrito_desc) == 'undefined' || this.macrodistrito_desc == null) ? "" : this.macrodistrito_desc),
          "distrito": ((typeof(this.distrito) == 'undefined' || this.distrito == null) ? "" : this.distrito),
          "distrito_desc": ((typeof(this.distrito_desc) == 'undefined' || this.distrito_desc == null) ? "" : this.distrito_desc),
          "zona": ((typeof(this.zona) == 'undefined' || this.zona == null) ? "" : this.zona),
          "zona_desc": ((typeof(this.zona_desc) == 'undefined' || this.zona_desc == null) ? "" : this.zona_desc),
          "tipo_via": ((typeof(this.tipo_via) == 'undefined' || this.tipo_via == null) ? "" : this.tipo_via),
          "nombre_via": ((typeof(this.nombre_via) == 'undefined' || this.nombre_via == null) ? "" : this.nombre_via),
          "numero_casa": ((typeof(this.numero_casa) == 'undefined' || this.numero_casa == null) ? "" : this.numero_casa),
          "edificio": ((typeof(this.edificio) == 'undefined' || this.edificio == null) ? "" : this.edificio),
          "bloque": ((typeof(this.bloque) == 'undefined' || this.bloque == null) ? "" : this.bloque),
          "piso": ((typeof(this.piso) == 'undefined' || this.piso == null) ? "" : this.piso),
          "oficina": ((typeof(this.oficina) == 'undefined' || this.oficina == null) ? "" : this.oficina),
          "latitud": ((typeof(this.latitud) == 'undefined' || this.latitud == null) ? "" : this.latitud),
          "longitud":((typeof(this.longitud) == 'undefined' || this.longitud == null) ? "" : this.longitud),

          "tipo_persona": "NATURAL",
          "usr_id": ((typeof(this.usr_id) == 'undefined' || this.usr_id == null) ? "" : this.usr_id),
          "activacionf": ((typeof(this.activacionf) == 'undefined' || this.activacionf == null) ? "" : this.activacionf),
          "activaciond": ((typeof(this.activaciond) == 'undefined' || this.activaciond == null) ? "" : this.activaciond),

          "file_fotocopia_ci": ((typeof(this.file_fotocopia_ci) == 'undefined' || this.file_fotocopia_ci == null) ? "" : this.file_fotocopia_ci),
          "fec_vencimiento": ((typeof(this.fec_vencimiento) == 'undefined' || this.fec_vencimiento == null) ? "" : this.fec_vencimiento),
          "file_factura_luz": ((typeof(this.file_factura_luz) == 'undefined' || this.file_factura_luz == null) ? "" : this.file_factura_luz),
          "URL": this.URL,

          //"tercer_apellido":this.tercer_apellido
          
        };

        console.log("API UPDATE:",dataParams);
        ejecutarAjax(urlComp, typeCall, dataParams, functionResp);
    }
    else
    {
        dataResp = "{\"error\":{\"message\":\"Uno o varios campos obligatorios vacios\",\"code\":702}}";
        functionResp(dataResp);
    }
};

rcNatural.prototype.modificarCambioPinNatural = function (functionResp)
{
  //var id="57798d0e2f59181eb2806c01";
  urlComp = "/setCambioPin/" + this.oid;
  //urlComp = "/updatePrs/" + id;
  typeCall = "put";
  dataParams = {          
          "pin": ((typeof(this.pinAnterior) == 'undefined' || this.pinAnterior == null) ? "" : this.pinAnterior),
          "pinNuevo": ((typeof(this.pinNuevo) == 'undefined' || this.pinNuevo == null) ? "" : this.pinNuevo),
          

          //"tercer_apellido":this.tercer_apellido
          
        };

        //console.log("API C:",dataParams);
        ejecutarAjax(urlComp, typeCall, dataParams, functionResp);
};




/*///////////////////////////////////////////////// JURIDICO /////////////////////////////////////////////////*/
function rcJuridico() {
    
    this.nit;
    this.razonSocial;
    this.telefono;
    this.movil;
    this.correo;
    this.profesion;
    this.otra_profesion;
    this.direccion;

    this.ci_representante;
    this.complemento_representante;
    this.representante;
    this.nombre;
    this.paterno;
    this.materno;
    this.poder_replegal;
    this.nro_notaria; 

    this.pais;
    this.departamento;
    this.provincia;
    this.municipio;
    this.macrodistrito;
    this.macrodistrito_desc;
    this.distrito;
    this.distrito_desc;
    this.zona;
    this.zona_desc;
    this.tipo_via;
    this.nombre_via;
    this.numero_casa;
    this.edificio;
    this.bloque;
    this.piso;
    this.oficina;

    this.latitud;
    this.longitud;

    this.usr_id;
    this.activacionf;
    this.activaciond;
    
    this.file_fotocopia_ci;
    this.file_factura_luz;
    this.URL;

    this.oid;
};


rcJuridico.prototype.buscarJuridico = function (functionResp)
{
    /*
    urlComp = "";
    typeCall = "post";
    dataParams = {
      "nit":  this.nit,
      "razon_social":  this.razonSocial,
      "ci_representante": this.ci
    };
    */

    urlComp = "/buscarPersona";
    typeCall = "post";
    dataParams = {
      "tipo_persona":  this.tipo_persona,
      "nit":  this.nit,
      "razon_social":  this.razonSocial,
      "ci_representante":  this.ci_r,
      "representante":  this.representante
    };


    ejecutarAjax(urlComp, typeCall, dataParams, functionResp);
};

rcJuridico.prototype.crearJuridico = function (functionResp)
{
    urlComp = "/new";
    typeCall = "post";

    if(validarJuridico("NEW", this))
    {
        dataParams = {
          "nit":  this.nit,
          "razon_social": this.razonSocial,
          "telefono" : this.telefono,
          "movil" : this.movil,
          "correo" : this.correo,
          "ci_representante": this.ci,
          "complemento_representante": this.complemento,
          "representante":this.nombre + " " + this.paterno + " " + this.materno,
          "poder_replegal": this.poder_replegal,
          "nro_notaria": this.nro_notaria,
          "tipo_persona": "JURIDICO",
          
          "usr_id": this.usr_id,
          "activacionf": "NO",
          "activaciond": "NO"
        };

        ejecutarAjax(urlComp, typeCall, dataParams, functionResp);
    }
    else
    {
        dataResp = "{\"error\":{\"message\":\"Uno o varios campos obligatorios vacios\",\"code\":702}}";
        functionResp(dataResp);
    }
};

rcJuridico.prototype.modificarJuridico = function (functionResp)
{
    urlComp = "/updateEmp/" + this.oid;;
    typeCall = "put";
    dataParams = {
        "nit":  ((typeof(this.nit) == 'undefined' || this.nit == null) ? "" : this.nit),
        "razon_social": ((typeof(this.razonSocial) == 'undefined' || this.razonSocial == null) ? "" : this.razonSocial),
        "telefono" : ((typeof(this.telefono) == 'undefined' || this.telefono == null) ? "" : this.telefono),
        "movil" : ((typeof(this.movil) == 'undefined' || this.movil == null) ? "" : this.movil),
        "correo" : ((typeof(this.correo) == 'undefined' || this.correo == null) ? "" : this.correo),
        "ci_representante": ((typeof(this.ci) == 'undefined' || this.ci == null) ? "" : this.ci),
        "complemento_representante": ((typeof(this.complemento) == 'undefined' || this.complemento == null) ? "" : this.complemento),
        "representante":((typeof(this.representante) == 'undefined' || this.representante == null) ? "" : this.representante),
        "poder_replegal": ((typeof(this.poder_replegal) == 'undefined' || this.poder_replegal == null) ? "" : this.poder_replegal),
        "nro_notaria": ((typeof(this.nro_notaria) == 'undefined' || this.nro_notaria == null) ? "" : this.nro_notaria),
        "profesion": ((typeof(this.profesion) == 'undefined' || this.profesion == null) ? "" : this.profesion),
        "otra_profesion": ((typeof(this.otra_profesion) == 'undefined' || this.otra_profesion == null) ? "" : this.otra_profesion),
        "direccion" : ((typeof(this.direccion) == 'undefined' || this.direccion == null) ? "" : this.direccion),
        "pais" : ((typeof(this.pais) == 'undefined' || this.pais == null) ? "" : this.pais),
        "departamento" : ((typeof(this.departamento) == 'undefined' || this.departamento == null) ? "" : this.departamento),
        "provincia" :((typeof(this.provincia) == 'undefined' || this.provincia == null) ? "" : this.provincia),
        "municipio" : ((typeof(this.municipio) == 'undefined' || this.municipio == null) ? "" : this.municipio),
        "macrodistrito" : ((typeof(this.macrodistrito) == 'undefined' || this.macrodistrito == null) ? "" : this.macrodistrito),
        "macrodistrito_desc": ((typeof(this.macrodistrito_desc) == 'undefined' || this.macrodistrito_desc == null) ? "" : this.macrodistrito_desc),                                                                 
        "distrito" : ((typeof(this.distrito) == 'undefined' || this.distrito == null) ? "" : this.distrito),
        "distrito_desc": ((typeof(this.distrito_desc) == 'undefined' || this.distrito_desc == null) ? "" : this.distrito_desc),                                     
        "zona" : ((typeof(this.zona) == 'undefined' || this.zona == null) ? "" : this.zona),
        "zona_desc" : ((typeof(this.zona_desc) == 'undefined' || this.zona_desc == null) ? "" : this.zona_desc),
        "tipo_via" : ((typeof(this.tipo_via) == 'undefined' || this.tipo_via == null) ? "" : this.tipo_via),
        "nombre_via" : ((typeof(this.nombre_via) == 'undefined' || this.nombre_via == null) ? "" : this.nombre_via),
        "numero_casa" : ((typeof(this.numero_casa) == 'undefined' || this.numero_casa == null) ? "" : this.numero_casa),
        "edificio" : ((typeof(this.edificio) == 'undefined' || this.edificio == null) ? "" : this.edificio),
        "bloque" : ((typeof(this.bloque) == 'undefined' || this.bloque == null) ? "" : this.bloque),
        "piso" :((typeof(this.piso) == 'undefined' || this.piso == null) ? "" : this.piso),
        "oficina" : ((typeof(this.oficina) == 'undefined' || this.oficina == null) ? "" : this.oficina),
        "latitud" : ((typeof(this.latitud) == 'undefined' || this.latitud == null) ? "" : this.latitud),
        "longitud" : ((typeof(this.longitud) == 'undefined' || this.longitud == null) ? "" : this.longitud),
        "tipo_persona": "JURIDICO",
        "usr_id": this.usr_id,
        "activacionf": ((typeof(this.activacionf) == 'undefined' || this.activacionf == null) ? "" : this.activacionf),
        "activaciond": ((typeof(this.activaciond) == 'undefined' || this.activaciond == null) ? "" : this.activaciond),                         
        "file_fotocopia_ci" : ((typeof(this.file_fotocopia_ci) == 'undefined' || this.file_fotocopia_ci == null) ? "" : this.file_fotocopia_ci),
        "file_factura_luz" : ((typeof(this.file_factura_luz) == 'undefined' || this.file_factura_luz == null) ? "" : this.file_factura_luz),
        "URL": this.URL
    };
    ejecutarAjax(urlComp, typeCall, dataParams, functionResp);
    console.log("DATOS NUEVOS MODIFICADOS",JSON.stringify(dataParams) );
    
};

function rcIdioma(){
    this.filtro;
};
rcIdioma.prototype.obtenerTitulos = function (functionResp)
{
  urlComp = "/getTitulos";
  typeCall = "post";

  dataParams = {
          "filtro": this.filtro
  };

  ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);
}

rcIdioma.prototype.obtenerContenidos = function (functionResp)
{
  urlComp = "/getContenidos";
  typeCall = "post";

  dataParams = {
          "filtro": this.filtro
  };

  ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);
}
rcIdioma.prototype.obtenerImagenes = function (functionResp)
{
  urlComp = "/getImagenes";
  typeCall = "post";

  dataParams = {
          "filtro": this.filtro
  };

  ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);
}
rcIdioma.prototype.obtenerMensajes = function (functionResp)
{
  urlComp = "/getMensajes";
  typeCall = "post";

  dataParams = {
          "filtro": this.filtro
  };

  ejecutarAjax1(urlComp, typeCall, dataParams, functionResp);
}






