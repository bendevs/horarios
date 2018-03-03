var pg = require('pg');
var sql = require('mssql');
var x = require('./connection/connectionIf.js');
var pool = new pg.Pool(x);


//BLOQUE PARA EXPORTAR LAS APP.POST
module.exports = function(app) {  

  app.post('/wsHorarios/listaAula', listaAula);
  app.post('/wsHorarios/createAula', createAula);

  app.post('/wsHorarios/listaMateria', listaMateria);

  app.post('/wsHorarios/listaHorario', listaHorario);

  app.post('/wsHorarios/listaDocente', listaDocente);

  app.get('*', function(req, res) {
    res.sendfile('./index.html'); // Carga única de la vista
  });
};

function listaAula(req, res) {
    console.log(req.body);
    var au_aula = req.body.aula;
    var dataQuery = "SELECT * FROM hor_aula('" + au_aula + "')";
    ejecutarQuery(dataQuery, res);
};

function listaMateria(req, res) {
    console.log(req.body);
    var dataQuery = "SELECT * FROM hor_materia";
    ejecutarQuery(dataQuery, res);
};

function listaHorario(req, res) {
    console.log(req.body);
    var dataQuery = "SELECT * FROM hor_horario";
    ejecutarQuery(dataQuery, res);
};

function listaDocente(req, res) {
    console.log(req.body);
    var dataQuery = "SELECT * FROM hor_docente";
    ejecutarQuery(dataQuery, res);
};

function createAula(req, res){
    console.log(req.body);
    var mov_placa = req.body.pla;
    var mov_marca = req.body.mar;
    var mov_tipo = req.body.tip;
    var mov_modelo = req.body.mod;
    var mov_poliza = req.body.pol;
    var mov_chasis = req.body.cha;
    var mov_nro_motor = req.body.mot;
    var mov_pais = req.body.pa;
    var mov_radicatoria = req.body.rad;
    var mov_cilindrada = req.body.cil;
    var mov_traccion = req.body.tra;
    var mov_plazas = req.body.plaza;
    var mov_usr = req.body.usr;
    var dataQuery = "SELECT * FROM create_vehiculo('" + mov_placa + "' , '" + mov_marca + "' , '" + mov_tipo + "' , " + mov_modelo + " , " + mov_poliza + " , '" + mov_chasis + "', '" + mov_nro_motor + "' , '" + mov_pais + "' ,'" + mov_radicatoria + "' , " + mov_cilindrada + " , '" + mov_traccion + "' , " + mov_plazas + ","+ mov_usr +")";
    ejecutarQuery(dataQuery, res);
}

function listavia(req, res){
    console.log(req.body);
    var nom_via = req.body.via;
    var fecha_ini = req.body.ini;
    var fecha_fin = req.body.fin;
    var dataQuery = "SELECT * FROM infracciones_vias('" + nom_via + "' , '" + fecha_ini + "' , '" + fecha_fin + "')";
    ejecutarQuery(dataQuery, res);
}

function ejecutarQuery(dataQuery, res){
    pool.connect(function(err, client, done) {
      if(err) {
        res.json({"error": { "message": "error de conexion: "+err, "code": 601 }});
      }
      else
      {
        client.query(dataQuery, function(err, result) {
          done();
        
          if(err) {
            res.json({"error": { "message": "error de consulta: "+err, "code": 602,dataQuery}});
          }
          else {
            //res.json(result.rows);  
            res.json({"success": { "data": result.rows, "code": 200  }});
          }
        });  
      }
    });
     
    pool.on('error', function (err, client) {
      res.json({"error": { "message": "error de instancia: "+err, "code": 603 }});
    });
};
