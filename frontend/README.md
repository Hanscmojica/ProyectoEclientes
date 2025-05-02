## E-Clientes Frontend

Este proyecto es el frontend para la aplicación E-Clientes, un sistema de gestión para agencias aduanales que permite consultar referencias, monitorear su estado y descargar documentos relacionados.

## Características

- Sistema de autenticación seguro con JWT
- Validación de credenciales según el caso de uso especificado
- Interfaz de usuario moderna con Material UI
- Rutas protegidas para acceso autorizado
- Panel de control para gestión de referencias aduanales

## Requisitos previos

- Node.js (versión 14 o superior)
- npm o yarn
- Backend de e-Clientes en funcionamiento

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```
   npm install
   ```
3. Configurar variables de entorno si es necesario

## Ejecución

Para iniciar el servidor de desarrollo:

```
npm start 
```

La aplicación estará disponible en: http://localhost:3000

## Desarrollo

Este frontend está diseñado para trabajar con el backend BASE-BACKEND existente. Se comunica a través de API RESTful utilizando Axios como cliente HTTP.

## Autenticación

El sistema implementa el caso de uso de validación de credenciales según los requisitos, permitiendo:
- Login de usuarios con email y contraseña
- Validación de sesiones activas
- Control de tiempo de inactividad
- Restricción de acceso a un dispositivo a la vez
- Gestión de contraseñas y políticas de seguridad 

npm run build para cualquier cambio en el frontend, ponemos en el bash : cd frontend , y despues npm run build para crear un cambio optimizado 