IN jornada INT,
    IN equipamiento INT,
    IN fsolicitud DATE
)
BEGIN
    -- Obtener todos los bloques horarios para la jornada seleccionada
    SELECT 
        b.bloque_id,
        b.descripcion,
        CASE
            -- Verificar si el bloque está reservado
            WHEN EXISTS (
                SELECT 1
                FROM Solicitudes s
                WHERE s.id_equipamiento = equipamiento
                  AND s.fecha_solicitud = fsolicitud
                  AND JSON_CONTAINS(s.bloques_seleccionados, CAST(b.bloque_id AS JSON))
            )
            THEN 'reservado'
            -- Verificar si el bloque está superpuesto con otro bloque ya reservado
            WHEN EXISTS (
                SELECT 1
                FROM Superposiciones sp
                JOIN Solicitudes s ON (
                    JSON_CONTAINS(s.bloques_seleccionados, CAST(sp.bloque_manana_id AS JSON))
                    OR JSON_CONTAINS(s.bloques_seleccionados, CAST(sp.bloque_tarde_id AS JSON))
                )
                WHERE s.id_equipamiento = equipamiento
                  AND s.fecha_solicitud = fsolicitud
                  AND s.id_jornada = IF(jornada = 1, 2, 1) -- Jornada opuesta
                  AND (sp.bloque_manana_id = b.bloque_id OR sp.bloque_tarde_id = b.bloque_id))
            
            THEN 'superpuesto'
            ELSE 'disponible'
        END AS estado
    FROM 
        Bloques b
    WHERE 
        b.jornada_id = jornada;
END