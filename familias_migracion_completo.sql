-- ============================================================
-- SCRIPT COMPLETO PARA GENERAR TABLAS DE FAMILIA
-- Versión final (RUT numéricos válidos, excepto basura)
-- ============================================================

-- ============================================================
-- 0. BACKUP DE TABLAS
-- ============================================================
CREATE TABLE apoderados_bkp AS SELECT * FROM apoderados;
CREATE TABLE alumnos_bkp AS SELECT * FROM alumnos;

-- ============================================================
-- 1. ELIMINAR apoderados BASURA (rut NULL, 0 o '')
-- ============================================================

-- Primero desvincular alumnoss
UPDATE alumnos SET idpadre = NULL 
WHERE idpadre IN (SELECT id_ap FROM apoderados WHERE rut IS NULL OR rut=0 OR rut='');

UPDATE alumnos SET idmadre = NULL 
WHERE idmadre IN (SELECT id_ap FROM apoderados WHERE rut IS NULL OR rut=0 OR rut='');

UPDATE alumnos SET idapoderado = NULL 
WHERE idapoderado IN (SELECT id_ap FROM apoderados WHERE rut IS NULL OR rut=0 OR rut='');

UPDATE alumnos SET idapoderadosupl = NULL 
WHERE idapoderadosupl IN (SELECT id_ap FROM apoderados WHERE rut IS NULL OR rut=0 OR rut='');

-- Borrar apoderados basura
DELETE FROM apoderados
WHERE rut IS NULL OR rut=0 OR rut='';

-- ============================================================
-- 2. CREACION DE TABLAS familias Y familia_integrantes
-- ============================================================

DROP TABLE IF EXISTS familia_integrantes;
DROP TABLE IF EXISTS familia;

CREATE TABLE familia (
    id_familia INT AUTO_INCREMENT PRIMARY KEY,
    familia_hash VARCHAR(255) UNIQUE,
    fecha_creacion DATETIME
);

CREATE TABLE IF NOT EXISTS familia_integrantes (
    id_familia INT NOT NULL,
    tipo ENUM('alumno','apoderado','padre','madre','suplente') NOT NULL,
    id_relacionado INT NOT NULL,
    PRIMARY KEY(id_familia, tipo, id_relacionado),
    FOREIGN KEY (id_familia) REFERENCES familia(id_familia)
);


-- ============================================================
-- 3. FUNCION fn_hash_familia
-- ============================================================

DROP FUNCTION IF EXISTS fn_hash_familia;

DELIMITER //
CREATE FUNCTION fn_hash_familia(
    p_rut_ap INT,
    p_rut_apsu INT,
    p_rut_padre INT,
    p_rut_madre INT
)
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    DECLARE tmp TEXT;

    SET tmp = CONCAT_WS('|',
        p_rut_ap,
        p_rut_apsu,
        p_rut_padre,
        p_rut_madre
    );

    IF tmp IS NULL OR tmp = '' THEN
        RETURN NULL;
    END IF;

    RETURN (
        SELECT GROUP_CONCAT(DISTINCT rut ORDER BY rut SEPARATOR '|')
        FROM (
            SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(tmp, '|', n.n), '|', -1) AS rut
            FROM (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) n
            WHERE n.n <= (LENGTH(tmp) - LENGTH(REPLACE(tmp, '|', '')) + 1)
        ) AS x
        WHERE rut IS NOT NULL AND rut <> ''
    );
END;
//
DELIMITER ;

-- ============================================================
-- 4. PROCEDIMIENTO: sp_get_or_create_familia
-- ============================================================
DROP PROCEDURE IF EXISTS sp_get_or_create_familia;
DELIMITER $$

CREATE PROCEDURE sp_get_or_create_familia(
    IN p_rut_ap INT,
    IN p_rut_apsu INT,
    IN p_rut_padre INT,
    IN p_rut_madre INT,
    OUT p_id_familia INT
)
proc:BEGIN
    DECLARE v_ruts TEXT;
    DECLARE v_hash VARCHAR(64);

    -- Construir lista limpia de RUTs válidos
    SET v_ruts = (
        SELECT GROUP_CONCAT(rut ORDER BY rut SEPARATOR '|')
        FROM (
            SELECT DISTINCT rut
            FROM (
                SELECT p_rut_ap AS rut
                UNION SELECT p_rut_apsu
                UNION SELECT p_rut_padre
                UNION SELECT p_rut_madre
            ) AS t1
            WHERE rut IS NOT NULL
              AND rut <> ''
              AND rut <> 0
        ) AS t2
    );

    -- Si no hay RUTs válidos, no se puede crear familia
    IF v_ruts IS NULL THEN
        SET p_id_familia = NULL;
        LEAVE proc;
    END IF;

    -- Generar hash
    SET v_hash = MD5(v_ruts);

    -- Si existe familia para este hash, obtener su id
    SELECT id_familia INTO p_id_familia
    FROM familia
    WHERE familia_hash = v_hash
    LIMIT 1;

    IF p_id_familia IS NOT NULL THEN
        LEAVE proc;
    END IF;

    -- Crear nueva familia
    INSERT INTO familia (familia_hash, fecha_creacion)
    VALUES (v_hash, NOW());

    SET p_id_familia = LAST_INSERT_ID();

END$$

DELIMITER ;

-- ============================================================
-- 5. RESETEAR TABLAS DE FAMILIAS
-- ============================================================

DELETE FROM familia_integrantes;
DELETE FROM familia;
ALTER TABLE familia AUTO_INCREMENT = 1;

-- ============================================================
-- 6. GENERAR FAMILIAS PARA CADA alumnos
-- ============================================================

-- NOTA IMPORTANTE:
-- Algunos motores MySQL no permiten CALL dentro de UPDATE.
-- La versión alternativa con cursor siempre funciona.

DROP PROCEDURE IF EXISTS sp_generar_familias;

DELIMITER $$

CREATE PROCEDURE sp_generar_familias()
BEGIN
    DECLARE v_id_alumno INT;
    DECLARE v_idpadre INT;
    DECLARE v_idmadre INT;
    DECLARE v_idapoderado INT;
    DECLARE v_idapoderadosupl INT;
    DECLARE v_id_familia INT;
    DECLARE done INT DEFAULT 0;

    DECLARE cur CURSOR FOR
        SELECT id_alumno, idpadre, idmadre, idapoderado, idapoderadosupl
        FROM alumnos;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO v_id_alumno, v_idpadre, v_idmadre, v_idapoderado, v_idapoderadosupl;

        IF done = 1 THEN
            LEAVE read_loop;
        END IF;

        CALL sp_get_or_create_familia(
            v_idapoderado,
            v_idapoderadosupl,
            v_idpadre,
            v_idmadre,
            v_id_familia
        );

        IF v_id_familia IS NOT NULL THEN
            UPDATE alumnos SET id_familia = v_id_familia WHERE id_alumno = v_id_alumno

            INSERT IGNORE INTO familia_integrantes(id_familia, tipo, id_relacionado)
            VALUES(v_id_familia, 'alumno', v_id_alumno);

            IF v_idpadre IS NOT NULL THEN
                INSERT IGNORE INTO familia_integrantes(id_familia, tipo, id_relacionado)
                VALUES(v_id_familia, 'padre', v_idpadre);
            END IF;

            IF v_idmadre IS NOT NULL THEN
                INSERT IGNORE INTO familia_integrantes(id_familia, tipo, id_relacionado)
                VALUES(v_id_familia, 'madre', v_idmadre);
            END IF;

            IF v_idapoderado IS NOT NULL THEN
                INSERT IGNORE INTO familia_integrantes(id_familia, tipo, id_relacionado)
                VALUES(v_id_familia, 'apoderado', v_idapoderado);
            END IF;

            IF v_idapoderadosupl IS NOT NULL THEN
                INSERT IGNORE INTO familia_integrantes(id_familia, tipo, id_relacionado)
                VALUES(v_id_familia, 'suplente', v_idapoderadosupl);
            END IF;

        END IF;

    END LOOP;

    CLOSE cur;

END $$

DELIMITER ;



CALL sp_generar_familias();

-- ============================================================
-- 7. reporte alumno familia
-- ============================================================
DROP PROCEDURE IF EXISTS sp_reporte_alumno_familia;
DELIMITER $$
CREATE PROCEDURE sp_reporte_alumno_familia(
    IN p_id_alumno INT
)
proc: BEGIN
    DECLARE v_id_familia INT;
    DECLARE v_familia_hash VARCHAR(64);

    -- 1) Verificar que el alumno exista
    IF (SELECT COUNT(*) FROM alumnos WHERE id_alumno = p_id_alumno) = 0 THEN
        SELECT 'ERROR: Alumno no existe' AS mensaje;
        LEAVE proc;
    END IF;

    -- 2) Obtener id_familia
    SELECT id_familia INTO v_id_familia
    FROM alumnos
    WHERE id_alumno = p_id_alumno
    LIMIT 1;

    -- 3) Si no tiene familia asignada, mostrar y salir
    IF v_id_familia IS NULL THEN
        SELECT 
            'Alumno sin familia asociada' AS inconsistencia,
            a.*
        FROM alumnos a
        WHERE id_alumno = p_id_alumno;
        LEAVE proc;
    END IF;

    -- 4) Obtener hash de la familia (si existe)
    SELECT familia_hash INTO v_familia_hash
    FROM familia
    WHERE id_familia = v_id_familia
    LIMIT 1;

    -- 5) Mostrar encabezado del alumno
    SELECT 
        'ALUMNO' AS seccion,
        a.*, 
        v_id_familia AS familia_asignada,
        v_familia_hash AS familia_hash
    FROM alumnos a
    WHERE id_alumno = p_id_alumno;

    -- 6) Mostrar integrantes de la familia
    SELECT 
        'INTEGRANTES' AS seccion,
        fi.tipo,
        fi.id_relacionado AS id_apoderado,
        ap.rut,
        ap.dv,
        CONCAT_WS(' ', ap.apat, ap.amat, ap.nombres) AS nombre_completo
    FROM familia_integrantes fi
    LEFT JOIN apoderados ap ON ap.id_ap = fi.id_relacionado
    WHERE fi.id_familia = v_id_familia
    ORDER BY 
        CASE fi.tipo
            WHEN 'alumno' THEN 1
            WHEN 'padre' THEN 2
            WHEN 'madre' THEN 3
            WHEN 'apoderado' THEN 4
            WHEN 'suplente' THEN 5
            ELSE 6
        END;

    -- 7) Buscar inconsistencias: integrantes sin registro en apoderado
    SELECT
        'INCONSISTENCIAS' AS seccion,
        CONCAT('ID ', fi.id_relacionado, ' en familia_integrantes no existe en apoderado.') AS detalle
    FROM familia_integrantes fi
    LEFT JOIN apoderados ap ON ap.id_ap = fi.id_relacionado
    WHERE fi.id_familia = v_id_familia
      AND ap.id_ap IS NULL;

END$$
DELIMITER ;
-- ============================================================
-- 8. REPORTES DE CONTROL
-- ============================================================

SELECT COUNT(*) AS total_familias FROM familias;

SELECT id_familia, COUNT(*) AS integrantes
FROM familia_integrantes
GROUP BY id_familia
ORDER BY integrantes DESC;

SELECT id_familia
FROM familia_integrantes
GROUP BY id_familia
HAVING COUNT(*) > 10;

-- FIN DEL SCRIPT
