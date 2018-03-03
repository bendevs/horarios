
CREATE OR REPLACE FUNCTION dag.sp_dag_codificacion2(
    activo1 integer,
    cantidad integer)
  RETURNS character varying AS
$BODY$
	declare
	ini varchar(50);
	fin varchar(50);
	min varchar(14); 
	max integer;
	valor varchar(50);
	valor2 varchar(13);
	activo text;
	c integer;
begin	
		if cantidad = 1 then
		for i in 1..cantidad LOOP
			activo := (select trim(to_char(activo1,'0000')));
			max:= (select substring(max(dag_ubm_activo_codigoaf) from 7 for 13)::integer 
			from dag.dag_ubm_activos
			WHERE    dag_ubm_activo_codigoaf LIKE ('1'||activo||'-%')::text);
			max:= max + 1;
			valor2 := (select trim(to_char(max,'0000000')));
			valor := '1'||activo||'-'||valor2;
			ini := valor;
			fin := valor;
			insert into dag.dag_ubm_activos ("dag_ubm_activo_codigoaf") values(valor);
			valor := ini||' '||fin;
			return valor;
		end loop;
	else 
			c:=1;
		for i in 1.. cantidad  LOOP 
			if c = 1 then
				activo := (select trim(to_char(activo1,'0000')));
				max:= (select substring(max(dag_ubm_activo_codigoaf) from 7 for 13)::integer 
				from dag.dag_ubm_activos
				WHERE    dag_ubm_activo_codigoaf LIKE ('1'||activo||'-%')::text);
				max:= max + 1;
				valor2 := (select trim(to_char(max,'0000000')));
				valor := '1'||activo||'-'||valor2;
				insert into dag.dag_ubm_activos ("dag_ubm_activo_codigoaf") values(valor);
					ini:= valor;
					c:=c+1;
			else 
				activo := (select trim(to_char(activo1,'0000')));
				max:= (select substring(max(dag_ubm_activo_codigoaf) from 7 for 13)::integer 
				from dag.dag_ubm_activos
				WHERE    dag_ubm_activo_codigoaf LIKE ('1'||activo||'-%')::text);
				max:= max + 1;
				valor2 := (select trim(to_char(max,'0000000')));
				valor := '1'||activo||'-'||valor2;
				insert into dag.dag_ubm_activos ("dag_ubm_activo_codigoaf") values(valor);
				fin:=valor;
			end if;
		end loop;
	valor := ini||' '||fin;
	return valor;
	end if;
	
	--min := (select min(dag_ubm_activo_codigoaf)::text
	--from dag.dag_ubm_activos
	--WHERE dag_ubm_activo_codigoaf LIKE ('1'||activo||'-%'));
	
END
$BODY$
  LANGUAGE plpgsql VOLATILE