DELIMITER $$

CREATE PROCEDURE InsertarAlumno(
    IN prut INT,
    IN pdv VARCHAR(1),
    IN pnombres VARCHAR(80),
    IN papat VARCHAR(80),
    IN pamat VARCHAR(80),
    IN pfnac DATETIME,
    IN pgenero VARCHAR(1),
    IN pdomicilio VARCHAR(200),
    IN pidcomuna INT,
    IN pcurrepe VARCHAR(45),
    IN pcanthnos INT,
    IN pnroentrehnos INT,
    IN phnosaca INT,
    IN phnoscursos VARCHAR(45),
    IN penfermo INT,
    IN pcuidados VARCHAR(300),
    IN pprocedencia VARCHAR(300),
    IN ppromedionota DECIMAL(3, 1),
    IN pidvivecon INT,
    IN pdescripcionvivecon VARCHAR(100),
    IN pidcurso INT,
    IN pactivo INT,
    IN pevaluareligion INT,
    IN pidapoderado INT,
    IN pidapoderadosupl INT,
    IN pidmadre INT,
    IN pidpadre INT,
    IN pap_rut INT,
    IN pap_dv VARCHAR(1),
    IN pap_nombres VARCHAR(200),
    IN pap_apat VARCHAR(80),
    IN pap_amat VARCHAR(80),
    IN pap_parentesco INT,
    IN pap_fono1 VARCHAR(40),
    IN pap_fono2 VARCHAR(40),
    IN pap_emergencia VARCHAR(80),
    IN pap_email VARCHAR(50),
    IN pap_domicilio VARCHAR(200),
    IN pap_id_comuna INT,
    IN papsu_rut INT,
    IN papsu_dv VARCHAR(1),
    IN papsu_nombres VARCHAR(200),
    IN papsu_apat VARCHAR(80),
    IN papsu_amat VARCHAR(80),
    IN papsu_parentesco INT,
    IN papsu_fono1 VARCHAR(40),
    IN papsu_fono2 VARCHAR(40),
    IN papsu_emergencia VARCHAR(80),
    IN papsu_email VARCHAR(50),
    IN papsu_domicilio VARCHAR(200),
    IN papsu_id_comuna INT,
    IN pmadre_rut INT,
    IN pmadre_dv VARCHAR(1),
    IN pmadre_nombres VARCHAR(200),
    IN pmadre_apat VARCHAR(80),
    IN pmadre_amat VARCHAR(80),
    IN pmadre_estudios VARCHAR(100),
    IN pmadre_ocupacion VARCHAR(100),
    IN ppadre_rut INT,
    IN ppadre_dv VARCHAR(1),
    IN ppadre_nombres VARCHAR(200),
    IN ppadre_apat VARCHAR(80),
    IN ppadre_amat VARCHAR(80),
    IN ppadre_estudios VARCHAR(100),
    IN ppadre_ocupacion VARCHAR(100)
)
BEGIN
    DECLARE exit HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al insertar datos. Operación revertida.';
    END;

    START TRANSACTION;

    -- Variables locales
    DECLARE new_id_alumno INT;
    DECLARE new_id_apoderado INT;
    DECLARE new_id_apoderado_supl INT;
    DECLARE new_id_madre INT;
    DECLARE new_id_padre INT;

    -- Apoderado principal
    IF pidapoderado IS NULL THEN
        INSERT INTO apoderados (rut, dv, nombres, apat, amat, parentesco, fono1, fono2, emergencia, email, domicilio, id_comuna)
        VALUES (pap_rut, pap_dv, pap_nombres, pap_apat, pap_amat, pap_parentesco, pap_fono1, pap_fono2, pap_emergencia, pap_email, pap_domicilio, pap_id_comuna);
        SET new_id_apoderado = LAST_INSERT_ID();
    ELSE
        UPDATE apoderados
        SET rut = pap_rut, dv = pap_dv, nombres = pap_nombres, apat = pap_apat, amat = pap_amat, parentesco = pap_parentesco,
            fono1 = pap_fono1, fono2 = pap_fono2, emergencia = pap_emergencia, email = pap_email, domicilio = pap_domicilio, id_comuna = pap_id_comuna
        WHERE id_ap = pidapoderado;
        SET new_id_apoderado = pidapoderado;
    END IF;

    -- Apoderado suplente
    IF pidapoderadosupl IS NULL THEN
        INSERT INTO apoderados (rut, dv, nombres, apat, amat, parentesco, fono1, fono2, emergencia, email, domicilio, id_comuna)
        VALUES (papsu_rut, papsu_dv, papsu_nombres, papsu_apat, papsu_amat, papsu_parentesco, papsu_fono1, papsu_fono2, papsu_emergencia, papsu_email, papsu_domicilio, papsu_id_comuna);
        SET new_id_apoderado_supl = LAST_INSERT_ID();
    ELSE
        UPDATE apoderados
        SET rut = papsu_rut, dv = papsu_dv, nombres = papsu_nombres, apat = papsu_apat, amat = papsu_amat, parentesco = papsu_parentesco,
            fono1 = papsu_fono1, fono2 = papsu_fono2, emergencia = papsu_emergencia, email = papsu_email, domicilio = papsu_domicilio, id_comuna = papsu_id_comuna
        WHERE id_ap = pidapoderadosupl;
        SET new_id_apoderado_supl = pidapoderadosupl;
    END IF;

    -- Inserción del alumno
    INSERT INTO alumno (rut, dv, nombres, apat, amat, fnac, genero, domicilio, id_comuna, currepe, canthnos, nroentrehnos, hnosaca, hnoscursos, enfermo, cuidados
