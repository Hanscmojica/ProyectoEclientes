# BUENAS PRACTICAS DE NODE CON EXPRESS

PROYECTO ELABORADO PARA BASE DE NUEVOS PROYECTOS CON BUENAS PRATICAS

* CONEXIÓN DE BASE DE DATOS CON PRISMA Y MYSQL
* CREACION DE CONTENEDOR PARA LA BASE DE DATOS

## Configuración de Puertos
- **Backend**: Puerto 3000
- **Frontend**: Puerto 3001

## Instalación

1. Clona este repositorio:
   ```bash

2. Ya clonada la carpeta instalar dependencias npm:
   ```bash
    npm install
3. Construir contenedor docker para la base de datos o cambia la ruta del .env:
   ```bash
    docker-compse up -d

3. CAMBIAR EL .env.example a .env:

4. Ya con el contenedor iniciado y las dependencias instalada arrancar el servidor:
   ```bash
    npm run dev

## Inicio Rápido
Para iniciar tanto el backend como el frontend con un solo comando, se puede usar el script:
```
.\start-servers.bat
```

Esto iniciará:
- El backend en http://localhost:3000
- El frontend en http://localhost:3001

## Acceso
- **Usuario**: HANS
- **Contraseña**: password123
