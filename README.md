# Sistema de Gestión de Vendedores

Este es un sistema web para la gestión de vendedores que permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre una base de datos MySQL, además de exportar los datos a Excel y PDF.

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm (incluido con Node.js)

## Características

- ✅ Registro de vendedores
- ✅ Listado de vendedores
- ✅ Búsqueda por nombre, apellido o celular
- ✅ Edición de vendedores
- ✅ Eliminación de vendedores
- ✅ Validación de datos
- ✅ Interfaz responsiva
- ✅ Hot Reload en desarrollo
- ✅ Exportación a Excel
- ✅ Exportación a PDF

## Configuración de la Base de Datos

1. Asegúrate de tener MySQL instalado y ejecutándose
2. Crea una base de datos llamada `railway` en MySQL
3. Ejecuta el siguiente script SQL para crear la tabla y los procedimientos almacenados:

```sql
USE railway;

-- Eliminar procedimientos existentes
DROP PROCEDURE IF EXISTS sp_busven;
DROP PROCEDURE IF EXISTS sp_delven;
DROP PROCEDURE IF EXISTS sp_ingven;
DROP PROCEDURE IF EXISTS sp_modven;
DROP PROCEDURE IF EXISTS sp_selven;

-- Eliminar tabla si existe
DROP TABLE IF EXISTS `vendedor`;

-- Estructura de tabla para la tabla `vendedor`
CREATE TABLE `vendedor` (
  `id_ven` int(11) NOT NULL AUTO_INCREMENT,
  `nom_ven` varchar(25) NOT NULL,
  `apel_ven` varchar(25) NOT NULL,
  `cel_ven` char(9) NOT NULL,
  PRIMARY KEY (`id_ven`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Procedimientos almacenados
DELIMITER $$

-- Procedimiento para buscar un vendedor por ID
CREATE PROCEDURE `sp_busven` (IN `p_id_ven` INT)   
BEGIN
    SELECT * FROM vendedor 
    WHERE id_ven = p_id_ven;
END$$

-- Procedimiento para eliminar un vendedor
CREATE PROCEDURE `sp_delven` (IN `p_id_ven` INT)   
BEGIN
    DELETE FROM vendedor 
    WHERE id_ven = p_id_ven;
END$$

-- Procedimiento para insertar un nuevo vendedor
CREATE PROCEDURE `sp_ingven` (IN `p_nom_ven` VARCHAR(25), IN `p_apel_ven` VARCHAR(25), IN `p_cel_ven` CHAR(9))   
BEGIN
    INSERT INTO vendedor (nom_ven, apel_ven, cel_ven)
    VALUES (p_nom_ven, p_apel_ven, p_cel_ven);
    SELECT LAST_INSERT_ID() AS nuevo_id_vendedor;
END$$

-- Procedimiento para modificar un vendedor existente
CREATE PROCEDURE `sp_modven` (IN `p_id_ven` INT, IN `p_nom_ven` VARCHAR(25), IN `p_apel_ven` VARCHAR(25), IN `p_cel_ven` CHAR(9))   
BEGIN
    UPDATE vendedor 
    SET 
        nom_ven = p_nom_ven,
        apel_ven = p_apel_ven,
        cel_ven = p_cel_ven
    WHERE id_ven = p_id_ven;
END$$

DELIMITER ;
```

## Instalación

1. Clona este repositorio:
```bash
git clone <url-del-repositorio>
```

2. Navega al directorio del proyecto:
```bash
cd node_clase
```

3. Instala las dependencias:
```bash
npm install
```

4. Configura la conexión a la base de datos:
   - Abre el archivo `app/db.js`
   - Modifica los datos de conexión según tu configuración:
```javascript
const pool = mysql.createPool({
  host: "tu-host",
  user: "tu-usuario",
  password: "tu-contraseña",
  port: 3306,
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## Ejecución

El proyecto tiene dos modos de ejecución:

### Modo Desarrollo
Este modo incluye recarga automática cuando se detectan cambios en el código:
```bash
npm run dev
```

### Modo Producción
Para ejecutar en modo producción:
```bash
npm start
```

Una vez iniciado, abre tu navegador y visita:
```
http://localhost:3000
```

## Uso de la Aplicación

### Gestión de Vendedores
- Para agregar un nuevo vendedor, completa el formulario en la parte superior
- Para editar un vendedor, haz clic en el botón "Editar" en la fila correspondiente
- Para eliminar un vendedor, haz clic en el botón "Eliminar" en la fila correspondiente
- Para buscar vendedores, utiliza el campo de búsqueda que filtra por nombre, apellido o celular

### Exportación de Datos
- Para exportar a Excel, haz clic en el botón "Exportar Excel"
  - Se descargará un archivo `Vendedores.xlsx` con todos los registros
- Para exportar a PDF, haz clic en el botón "Exportar PDF"
  - Se descargará un archivo `Vendedores.pdf` con un reporte formateado

## Tecnologías Utilizadas

- Frontend:
  - HTML5
  - CSS3 (Bootstrap 5)
  - JavaScript (Vanilla)
  - Bootstrap Icons
- Backend:
  - Node.js
  - Express.js
  - MySQL2 (con soporte para promesas)
  - XLSX (para exportación a Excel)
  - PDFMake (para exportación a PDF)
  - Nodemon (desarrollo)
- Base de Datos:
  - MySQL

## Estructura del Proyecto

```
node_clase/
├── app/
│   ├── view/
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   └── modals.js
│   │   └── index.html
│   ├── create/
│   │   └── createVendedor.js
│   ├── update/
│   │   └── updateVendedor.js
│   ├── delete/
│   │   └── deleteVendedor.js
│   ├── db.js
│   └── server.js
├── package.json
└── README.md
```

## Contribución

Si deseas contribuir al proyecto:

1. Haz un Fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 