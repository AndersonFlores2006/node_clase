-- Usar la base de datos
USE railway;

-- Eliminar procedimientos almacenados si existen
DROP PROCEDURE IF EXISTS sp_ingven;
DROP PROCEDURE IF EXISTS sp_modven;
DROP PROCEDURE IF EXISTS sp_delven;
DROP PROCEDURE IF EXISTS sp_lisven;
DROP PROCEDURE IF EXISTS sp_busven;
DROP PROCEDURE IF EXISTS sp_searchven;
DROP PROCEDURE IF EXISTS sp_lisdistritos;

-- Eliminar tablas si existen (en orden correcto por las foreign keys)
DROP TABLE IF EXISTS Vendedor;
DROP TABLE IF EXISTS Distrito;

-- Crear la tabla Distrito
CREATE TABLE IF NOT EXISTS Distrito (
    id_distrito INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

-- Insertar distritos
INSERT INTO Distrito (nombre) VALUES
('San Juan de Lurigancho'),
('San Martín de Porres'),
('Ate'),
('Comas'),
('Villa El Salvador'),
('Villa María del Triunfo'),
('San Juan de Miraflores'),
('Los Olivos'),
('Puente Piedra'),
('Santiago de Surco');

-- Crear la tabla Vendedor
CREATE TABLE IF NOT EXISTS Vendedor (
    id_ven INT PRIMARY KEY AUTO_INCREMENT,
    nom_ven VARCHAR(25) NOT NULL,
    apel_ven VARCHAR(25) NOT NULL,
    cel_ven CHAR(9) NOT NULL,
    id_distrito INT,
    id_cargo INT,
    FOREIGN KEY (id_distrito) REFERENCES Distrito(id_distrito) ON DELETE SET NULL
);

-- Procedimiento almacenado para insertar (sp_ingven)
DELIMITER //
CREATE PROCEDURE sp_ingven(
    IN p_nom_ven VARCHAR(25),
    IN p_apel_ven VARCHAR(25),
    IN p_cel_ven CHAR(9),
    IN p_id_distrito INT
)
BEGIN
    DECLARE distrito_exists INT;
    
    -- Validar datos no nulos
    IF p_nom_ven IS NULL OR p_apel_ven IS NULL OR p_cel_ven IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Todos los campos son obligatorios';
    END IF;
    
    -- Validar longitud del celular
    IF LENGTH(p_cel_ven) != 9 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El número de celular debe tener exactamente 9 dígitos';
    END IF;
    
    -- Validar que el distrito existe
    IF p_id_distrito IS NOT NULL THEN
        SELECT COUNT(*) INTO distrito_exists FROM Distrito WHERE id_distrito = p_id_distrito;
        IF distrito_exists = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El distrito especificado no existe';
        END IF;
    END IF;
    
    INSERT INTO Vendedor(nom_ven, apel_ven, cel_ven, id_distrito)
    VALUES (p_nom_ven, p_apel_ven, p_cel_ven, p_id_distrito);
    
    SELECT LAST_INSERT_ID() AS nuevo_id_vendedor;
END //
DELIMITER ;

-- Procedimiento almacenado para actualizar (sp_modven)
DELIMITER //
CREATE PROCEDURE sp_modven(
    IN p_id_ven INT,
    IN p_nom_ven VARCHAR(25),
    IN p_apel_ven VARCHAR(25),
    IN p_cel_ven CHAR(9),
    IN p_id_distrito INT,
    IN p_id_cargo INT
)
BEGIN
    DECLARE vendedor_exists INT;
    DECLARE distrito_exists INT;
    
    -- Validar que el vendedor existe
    SELECT COUNT(*) INTO vendedor_exists FROM Vendedor WHERE id_ven = p_id_ven;
    IF vendedor_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El vendedor especificado no existe';
    END IF;
    
    -- Validar datos no nulos
    IF p_nom_ven IS NULL OR p_apel_ven IS NULL OR p_cel_ven IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Todos los campos son obligatorios';
    END IF;
    
    -- Validar longitud del celular
    IF LENGTH(p_cel_ven) != 9 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El número de celular debe tener exactamente 9 dígitos';
    END IF;
    
    -- Validar que el distrito existe si se proporciona
    IF p_id_distrito IS NOT NULL THEN
        SELECT COUNT(*) INTO distrito_exists FROM Distrito WHERE id_distrito = p_id_distrito;
        IF distrito_exists = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El distrito especificado no existe';
        END IF;
    END IF;
    
    UPDATE Vendedor 
    SET nom_ven = p_nom_ven,
        apel_ven = p_apel_ven,
        cel_ven = p_cel_ven,
        id_distrito = p_id_distrito,
        id_cargo = p_id_cargo
    WHERE id_ven = p_id_ven;
END //
DELIMITER ;

-- Procedimiento almacenado para eliminar (sp_delven)
DELIMITER //
CREATE PROCEDURE sp_delven(
    IN p_id_ven INT
)
BEGIN
    DECLARE vendedor_exists INT;
    
    -- Validar que el vendedor existe
    SELECT COUNT(*) INTO vendedor_exists FROM Vendedor WHERE id_ven = p_id_ven;
    IF vendedor_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El vendedor especificado no existe';
    END IF;
    
    DELETE FROM Vendedor WHERE id_ven = p_id_ven;
END //
DELIMITER ;

-- Procedimiento almacenado para listar distritos
DELIMITER //
CREATE PROCEDURE sp_lisdistritos()
BEGIN
    SELECT * FROM Distrito ORDER BY nombre;
END //
DELIMITER ;

-- Procedimiento almacenado para listar (sp_lisven)
DELIMITER //
CREATE PROCEDURE sp_lisven()
BEGIN
    SELECT 
        v.*,
        COALESCE(d.nombre, 'Sin distrito') as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    ORDER BY v.id_ven;
END //
DELIMITER ;

-- Procedimiento almacenado para buscar por ID (sp_busven)
DELIMITER //
CREATE PROCEDURE sp_busven(
    IN p_id_ven INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Vendedor WHERE id_ven = p_id_ven) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El vendedor especificado no existe';
    END IF;
    
    SELECT 
        v.*,
        COALESCE(d.nombre, 'Sin distrito') as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    WHERE v.id_ven = p_id_ven;
END //
DELIMITER ;

-- Procedimiento almacenado para buscar por texto (sp_searchven)
DELIMITER //
CREATE PROCEDURE sp_searchven(
    IN p_search VARCHAR(50)
)
BEGIN
    IF p_search IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El término de búsqueda no puede estar vacío';
    END IF;
    
    SELECT v.*, d.nombre as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    WHERE v.nom_ven LIKE CONCAT('%', p_search, '%')
       OR v.apel_ven LIKE CONCAT('%', p_search, '%')
       OR d.nombre LIKE CONCAT('%', p_search, '%')
       OR v.cel_ven LIKE CONCAT('%', p_search, '%')
    ORDER BY v.id_ven;
END //
DELIMITER ;