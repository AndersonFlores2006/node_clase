-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS Ventas;

-- Usar la base de datos
USE Ventas;

-- Crear la tabla Vendedor
CREATE TABLE IF NOT EXISTS Vendedor (
    id_ven INT PRIMARY KEY AUTO_INCREMENT,
    nom_ven VARCHAR(25),
    ape_ven VARCHAR(25),
    cel_ven CHAR(9)
);

-- Procedimiento almacenado para insertar (sp_ingven)
DELIMITER //
CREATE PROCEDURE sp_ingven(
    IN p_nom_ven VARCHAR(25),
    IN p_ape_ven VARCHAR(25),
    IN p_cel_ven CHAR(9)
)
BEGIN
    IF LENGTH(p_cel_ven) = 9 THEN
        INSERT INTO Vendedor(nom_ven, ape_ven, cel_ven)
        VALUES (p_nom_ven, p_ape_ven, p_cel_ven);
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El número de celular debe tener exactamente 9 dígitos';
    END IF;
END //
DELIMITER ;

-- Procedimiento almacenado para actualizar (sp_modven)
DELIMITER //
CREATE PROCEDURE sp_modven(
    IN p_id_ven INT,
    IN p_nom_ven VARCHAR(25),
    IN p_ape_ven VARCHAR(25),
    IN p_cel_ven CHAR(9)
)
BEGIN
    IF LENGTH(p_cel_ven) = 9 THEN
        UPDATE Vendedor 
        SET nom_ven = p_nom_ven,
            ape_ven = p_ape_ven,
            cel_ven = p_cel_ven
        WHERE id_ven = p_id_ven;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El número de celular debe tener exactamente 9 dígitos';
    END IF;
END //
DELIMITER ;

-- Procedimiento almacenado para eliminar (sp_eliven)
DELIMITER //
CREATE PROCEDURE sp_eliven(
    IN p_id_ven INT
)
BEGIN
    DELETE FROM Vendedor WHERE id_ven = p_id_ven;
    
    -- Reordenar IDs
    SET @num := 0;
    UPDATE Vendedor SET id_ven = @num := (@num + 1) ORDER BY id_ven;
    ALTER TABLE Vendedor AUTO_INCREMENT = 1;
END //
DELIMITER ;

-- Procedimiento almacenado para listar (sp_lisven)
DELIMITER //
CREATE PROCEDURE sp_lisven()
BEGIN
    SELECT * FROM Vendedor ORDER BY id_ven;
END //
DELIMITER ;

-- Procedimiento almacenado para buscar por ID (sp_busven)
DELIMITER //
CREATE PROCEDURE sp_busven(
    IN p_id_ven INT
)
BEGIN
    SELECT * FROM Vendedor WHERE id_ven = p_id_ven;
END //
DELIMITER ;

-- Procedimiento almacenado para buscar por texto (sp_searchven)
DELIMITER //
CREATE PROCEDURE sp_searchven(
    IN p_search VARCHAR(50)
)
BEGIN
    SELECT * FROM Vendedor 
    WHERE nom_ven LIKE CONCAT('%', p_search, '%')
       OR ape_ven LIKE CONCAT('%', p_search, '%')
       OR cel_ven LIKE CONCAT('%', p_search, '%')
    ORDER BY id_ven;
END //
DELIMITER ; 