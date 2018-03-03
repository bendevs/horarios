APIREST 
=======

API Rest para consumir sobre una base de datos mongo

	1.- app.get('/api/ciudadano', getCiudadanos); Devuelve error de acceso;
	2.- app.post('/api/ciudadano', getCiudadano); Devuelve array segun su ci
	3.- app.post('/api/loguin', getLoguin); Devuelve array segun ci y pin
	4.-	app.post('/api/ciudadano', setCiudadano);
	Lo demas en desarrollo
	5.-	app.put('/api/ciudadano/:dtspsl_ci', updateCiudadano);
	6.-	app.delete('/api/ciudadano/:dtspsl_ci', removeCiudadano);


MANEJO DE ERRORES

	600 - "Sin acceso a los servicios."
	601 - "Error en ingreso de Carnet de Identidad"
	602 - "Usuario no registrado"
	603 - "Usuario o Contraseña Errados. Verifique los mismos"
	604 - "Ciudadano no encontrado"
	605 - "Usuario se encuentra registrado"
	606 - "Empresa se encuentra registrado"
	607 - "Campos obligatorios persona natural"
	608 - "Campos obligatorios persona juridica"
	609 - "Persona no encontrada no existe OID"

