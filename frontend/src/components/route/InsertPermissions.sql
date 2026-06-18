INSERT INTO att_permission_types (name,description,leave_pay,max_hours_per_year,max_hours_per_month,max_requests_per_year,max_requests_per_month,show_in_dashboard,show_accumulated_hours_per_year,show_accumulated_hours_per_month,show_accumulated_requests_per_year,show_accumulated_requests_per_month)
VALUES
('Personal con goce de sueldo', 'Los funcionarios y empleados pueden solicitar un máximo de cinco días de licencia con goce de sueldo durante el año por motivos personales, los cuales se concederán siempre y cuando a juicio del jefe inmediato el goce de ellos no afecte la prestación del servicio. se concederán a discreción del jefe. Este permiso no podrá otorgarse previo o posterior a un período de vacación',1,40,NULL,NULL,NULL,0,0,0,0,0),
('Personal sin goce de sueldo', 'Los funcionarios y empleados pueden solicitar licencia sin goce de sueldo por motivos personales hasta un máximo de ocho días previa autorización del director de área, si excede este tiempo es requerida la autorización del Director General. Sujeto a juicio de la jefatura inmediata, siempre y cuando no se afecte la prestación del servicio. Este tipo de licencia no se abonará para fijar el tiempo de servicio del servidor público',0,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Duelo', 'Los funcionarios que atraviesen la perdida de un familiar cercano (Padre, madre, conyuge,  hijos) contaran con un permiso por tres días máximo con goce de sueldo; este permiso se respaldará con acta de defunción',0,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Diligencias oficiales locales', 'Para cumplir obligaciones de carácter público establecidas por la Ley u ordenadas por autoridad competente',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Enfermedad de pariente', 'Para cumplir las obligaciones familiares que razonablemente reclamen su presencia como en los casos de enfermedad grave de su cónyuge o compañero (a) de vida, padres o hijos e hijas; requiere comprobante por parte de autoridad competente',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Matrimonio', 'Cuando el empleado contrajere matrimonio civil o religioso, a opción y petición formal del funcionario o servidor público, para concederle el permiso deberá presentar documento que acredite el acto, los días deberán ser gozados en el año calendario',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Incapacidad', 'Motivo de enfermedad o accidente común o de trabajo que imposibilite al servidor público desempeñar sus labores, siempre y cuando presente constancia médica de incapacidad extendida y/o avalada por la institución o médico competente',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Enfermedad sin certificado', 'El funcionario podrá gozar licencia por enfermedad sin incapacidad medica, hasta un máximo de 5 días acumulados en un mismo mes, sin que esta exceda de 15 días acumulados en un mismo año. El excedente se deducira del sueldo',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Maternidad', 'Descanso pre y post-natal, hasta por un período de dieciséis semanas, dentro del cual estará comprendida la fecha del parto, de conformidad a lo establecido en este reglamento',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Misión oficial local', 'Entiendase como misión oficial toda actividad de trabajo que se realice fuera de la dependencia donde labora en territorio nacional; por ejemplo: reuniones de trabajo fuera de la instalación, capacitaciones, u otras actividades similares relacionadas con la institución',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Misión oficial Internacional', 'Entiendase como misión oficial toda actividad de trabajo que se realice en territorio internacional; por ejemplo: reuniones de trabajo, capacitaciones, conferencias u otras actividades similares relacionadas con la institución. Requiere autorización del Director General',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Problema de marcación', 'Se utilizará cuando el marcador no registre una de las marcaciones requeridas (entrada o salida) Esta modalidad podrá utilizarse hasta un máximo de tres veces en un mes',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Hora de lactancia', 'La colaboradora podrá pactar con su jefe inmediato de comun acuerdo, una hora díaria de lactancia materna, pudiendo solicitarla al incio de la jornada o al fin de la misma, esta hora podrá fraccionarse en dos períodos de treina minutos, uno al inicio de la jornada y el otro al final',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Compensatorio', 'La licencia por tiempo compensatorio deben solicitarse con debida anticipación para no interrumpir con la actividad regular de la unidad, El día de descanso compensatorio no es acumulable, será remunerado con salario básico y deberá concederse en la misma semana laboral o, a más tardar, en la siguiente',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Paternidad', 'El personal tiene derecho a tres días de licencia en caso de paternidad por nacimiento o adopción; licencia que se concederá a elección del trabajador desde el día del nacimiento, de forma continua, o distribuidos dentro de los primeros quince días desde la fecha del nacimiento',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Suspención laboral', 'Se aplicará cuando el trabajador sea suspendido disciplinariamente conforme a lo regulado en el reglamento interno de la DGEHM',0,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Llegada tardía por fuerza mayor', 'Se utilizará exclusivamente por motivos de: Congestionamientos vehiculares inesperados tales como accidentes de transito agran escala, paro de transporte colectivo, cierre de calles inesperados, manifestaciones; de no cumplir con este requisito será rechazado',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Consulta medica de empleados e hijos ', 'Se utilizará cuando el trabajador ingrese posterior al horario establecido o se retire antes para asistir a una cita médica; requiere marcación ya sea anticipada o retrasada, podrá utilizarse para asistir a consulta médica de hijo e hija',1,NULL,NULL,NULL,NULL,0,0,0,0,0),
('Permiso por estudio', 'A definir',1,NULL,NULL,NULL,NULL,0,0,0,0,0);

-- UPDATE att_permission_types SET active = 0 WHERE id != 7;

INSERT INTO att_steps (name,correlative,att_permission_type_id,managed_by_boss,managed_by_supplicant)
SELECT 'Envio Empleado',1,id,0,1 FROM att_permission_types;

INSERT INTO att_steps (name,correlative,att_permission_type_id,managed_by_boss,managed_by_supplicant)
SELECT 'Aprobación Jefe Inmediato',2,id,1,0 FROM att_permission_types;

INSERT INTO att_steps (name,correlative,att_permission_type_id,managed_by_boss,managed_by_supplicant)
SELECT 'Aprobación Talento Humano',100,id,0,0 FROM att_permission_types;

INSERT INTO att_attachments (name,att_step_id)
VALUES
('Incapacidad',1);

INSERT INTO adm_employee_att_permission_type
(adm_employee_id,att_permission_type_id,used_hours_on_year,used_hours_on_month,used_requests_on_year,used_requests_on_month)
SELECT em.id,pt.id,0,0,0,0 FROM adm_employees AS em
INNER JOIN att_permission_types AS pt
ORDER BY em.id,pt.id;

ALTER TABLE adm_employee_adm_functional_position MODIFY salary DOUBLE(9,2) null;

SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_COLUMN_NAME, REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'att_attachments';

ALTER TABLE att_attachments DROP INDEX att_attachments_name_unique;

ALTER TABLE att_permission_types
ADD COLUMN max_days_per_request MEDIUMINT AFTER leave_pay;

ALTER TABLE att_permission_types
ADD COLUMN max_hours_per_request MEDIUMINT AFTER leave_pay;


INSERT INTO att_attachments (name,att_step_id)
VALUES
('Memorandun de Aprobación',17),
('Acta de Defunción',4),
('Comprobación',3),
('Constacia Médica',5),
('Acta de Matrimonio',11),
('Incapacidad',8),
('Incapacidad por Maternidad',10),
('Comprobante de Misión',13),
('Comprobante de Misión',12),
('Incapacidad por Maternidad',7),
('Acta de Nacimiento',14),
('Acta de Amonestación',19),
('Evidencia de Eventualidad',9),
('Comprobante',2);











SELECT
    pt.id,
    pt.name,
    st.id st_name,
    st.name st_name
FROM
    att_permission_types AS pt
    INNER JOIN att_steps AS st ON pt.id = st.att_permission_type_id
WHERE st.correlative = 1
ORDER BY pt.id;