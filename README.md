# Sistema de Gestión de Vendedores

Este es un sistema web para la gestión de vendedores que permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre una base de datos MySQL, además de exportar los datos a Excel y PDF.

## Requisitos Previos

* Node.js (v14 o superior)
* MySQL (v8.0 o superior)
* npm (incluido con Node.js)
* Docker y Docker Compose (opcional, para desarrollo con contenedores)

## Configuración del Entorno

Para ejecutar la aplicación, necesitas configurar las siguientes variables de entorno en un archivo `.env`:

```env
# Database Configuration
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_PORT=your_port
DB_DATABASE=your_database
DB_CONNECTION_LIMIT=10

# Server Configuration
NODE_ENV=development
PORT=3000
```

⚠️ Nota de Seguridad: Nunca subas el archivo .env al repositorio. Las variables de entorno sensibles en producción deben configurarse directamente en el panel de control de Render.

## Despliegue Automático
Este proyecto está configurado con GitHub Actions para despliegue automático en Render cuando se hace push a la rama main. El despliegue se realiza automáticamente después de cada commit exitoso.

## Características

* ✅ Registro de vendedores con información completa
* ✅ Asignación de distritos a vendedores
* ✅ Asignación de cargos a vendedores
* ✅ Listado de vendedores con filtros
* ✅ Búsqueda por nombre, apellido, distrito o celular
* ✅ Edición de vendedores
* ✅ Eliminación de vendedores
* ✅ Validación de datos
* ✅ Interfaz responsiva
* ✅ Hot Reload en desarrollo
* ✅ Exportación a Excel
* ✅ Exportación a PDF
* ✅ Gestión de distritos
* ✅ Gestión de cargos

## Instalación y Ejecución

1. Clonar el repositorio:
```bash
git clone https://github.com/AndersonFlores2006/node_clase.git
cd node_clase
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` con las variables de entorno necesarias (ver sección de Configuración del Entorno)

4. Iniciar la aplicación:
```bash
npm start
```

## Desarrollo con Docker

1. Asegúrate de tener Docker y Docker Compose instalados
2. Configura las variables de entorno en el archivo `.env`
3. Ejecuta:
```bash
docker compose up
```

## Despliegue en Render

La aplicación está configurada para desplegarse en Render. Asegúrate de configurar las variables de entorno en el panel de configuración de Render.

## Estructura de la Base de Datos

### Tabla Vendedor
- id_ven (INT, Primary Key, Auto-increment)
- nom_ven (VARCHAR(25))
- apel_ven (VARCHAR(25))
- cel_ven (CHAR(9))
- id_distrito (INT, Foreign Key)
- id_cargo (INT)

### Tabla Distrito
- id_distrito (INT, Primary Key, Auto-increment)
- nombre (VARCHAR(50))

## API Endpoints

### Vendedores
- GET `/api/vendedores` - Listar todos los vendedores
- GET `/api/vendedores/:id` - Obtener un vendedor por ID
- POST `/api/vendedores` - Crear nuevo vendedor
- PUT `/api/vendedores/:id` - Actualizar vendedor
- DELETE `/api/vendedores/:id` - Eliminar vendedor
- GET `/api/vendedores/search` - Buscar vendedores

### Distritos
- GET `/api/distritos` - Listar todos los distritos

## Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (Vanilla)
- Bootstrap Icons

### Backend
- Node.js
- Express.js
- MySQL2 (con soporte para promesas)
- XLSX (para exportación a Excel)
- PDFMake (para exportación a PDF)
- Nodemon (desarrollo)
- dotenv (variables de entorno)

### Base de Datos
- MySQL

### Contenedores
- Docker
- Docker Compose

## Estructura del Proyecto
```
node_clase/
├── app/
│   ├── controllers/
│   │   └── vendedorController.js
│   │   └── distritoController.js
│   ├── models/
│   │   └── Vendedor.js
│   ├── views/
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   └── modals.js
│   │   └── index.html
│   ├── db.js
│   ├── railway_procedures.sql
│   └── server.js
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Seguridad
- Variables de entorno para credenciales sensibles
- Validación de datos en frontend y backend
- Sanitización de entradas de usuario
- Manejo de errores robusto

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 