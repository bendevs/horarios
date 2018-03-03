CREATE TABLE hor_aula                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
(
 au_id serial PRIMARY KEY,
 au_aula text not null,
 au_usr_id integer,
 au_registrado timestamp without time zone NOT NULL DEFAULT now(),
 au_modificado timestamp without time zone NOT NULL DEFAULT now(),
 au_estado char(1) NOT NULL DEFAULT 'A'::bpchar
);
INSERT INTO hor_aula (au_aula,au_usr_id) VALUES 
('Aula 1',1),
('Aula 2',1),
('Aula 3',1),
('Aula 4',1),
('Aula 5',1),
('Aula 6',1);

CREATE TABLE hor_materia                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
(
 mat_id serial PRIMARY KEY,
 mat_au_id integer NOT NULL,
 mat_materia text not null,
 mat_usr_id integer,
 mat_registrado timestamp without time zone NOT NULL DEFAULT now(),
 mat_modificado timestamp without time zone NOT NULL DEFAULT now(),
 mat_estado char(1) NOT NULL DEFAULT 'A'::bpchar,
 FOREIGN KEY(mat_au_id) REFERENCES hor_aula(au_id)
);

INSERT INTO hor_materia (mat_au_id,mat_materia,mat_usr_id) VALUES 
(1,'Cálculo 1',1),
(1,'Cálculo 2',1),
(1,'Cálculo 3',1),
(1,'Programación',1),
(1,'Fisica 1',1),
(1,'Fisica 2',1);

CREATE TABLE hor_horario                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
(
 hor_id serial PRIMARY KEY,
 hor_mat_id integer NOT NULL,
 hor_au_id integer NOT NULL,
 hor_horario text not null,
 hor_usr_id integer,
 hor_registrado timestamp without time zone NOT NULL DEFAULT now(),
 hor_modificado timestamp without time zone NOT NULL DEFAULT now(),
 hor_estado char(1) NOT NULL DEFAULT 'A'::bpchar,
 FOREIGN KEY(hor_mat_id) REFERENCES hor_materia(mat_id),
 FOREIGN KEY(hor_au_id) REFERENCES hor_aula(au_id)
);
INSERT INTO hor_horario (hor_mat_id,hor_au_id,hor_horario,hor_usr_id) VALUES 
(1,1,'09:00-11:00',1),
(2,2,'10:00-12:00',1),
(3,3,'13:00-15:00',1),
(4,4,'15:00-17:00',1),
(5,5,'17:00-19:00',1),
(6,6,'19:00-21:00',1);


CREATE TABLE hor_docente                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
(
 doc_id serial PRIMARY KEY,
 doc_mat_id integer NOT NULL,
 doc_au_id integer NOT NULL,
 doc_hor_id integer NOT NULL,
 doc_nombre text not null,
 doc_usr_id integer,
 doc_registrado timestamp without time zone NOT NULL DEFAULT now(),
 doc_modificado timestamp without time zone NOT NULL DEFAULT now(),
 doc_estado char(1) NOT NULL DEFAULT 'A'::bpchar,
 FOREIGN KEY(doc_mat_id) REFERENCES hor_materia(mat_id),
 FOREIGN KEY(doc_au_id) REFERENCES hor_aula(au_id),
 FOREIGN KEY(doc_hor_id) REFERENCES hor_horario(hor_id)
);
INSERT INTO hor_docente(doc_mat_id,doc_au_id,doc_hor_id,doc_nombre,doc_usr_id) VALUES 
(1,6,4,'Carlos Cabrera',1),
(2,5,6,'Armado Ruiz',1),
(3,4,5,'Susana Diaz',1),
(4,3,3,'Andrea Lima',1),
(5,2,1,'Rene Carrasco',1),
(6,1,2,'Julia Apaza',1);