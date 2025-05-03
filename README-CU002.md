# Documentación de Implementación - CU002: Referencias

## Descripción General

Este documento describe la implementación del caso de uso CU002: Referencias, que permite a los clientes consultar la información de sus operaciones aduanales registradas en el sistema y a los ejecutivos de cuenta cargar, actualizar y mantener dicha información.

## Actores Involucrados

- **Cliente**: Usuario final que consulta la información de sus operaciones aduanales registradas en el sistema.
- **Ejecutivo de cuenta**: Responsable de cargar, actualizar y mantener la información de las referencias de operaciones en la base de datos.

## Precondiciones

- El cliente debe estar autenticado en el sistema con sus credenciales válidas (referencia al CU0001: Inicio de Sesión).
- El sistema debe tener acceso a la API de SAGA para consultar la información de referencias.
- El ejecutivo de cuenta debe haber registrado y actualizado previamente la información de las referencias en la base de datos.
- La conexión a internet debe estar activa para realizar las consultas a la API.

## Flujo Principal Implementado

1. **Inicio**:
   - El cliente, desde la página principal de la plataforma, selecciona la opción "Referencias" (implementado a través de navegación en el Dashboard).

2. **Visualización de Lista de Referencias**:
   - El sistema consulta a través de la API de SAGA para recuperar las referencias asociadas al cliente autenticado.
   - El sistema muestra una lista de referencias disponibles, presentando información resumida.

3. **Selección de Referencia**:
   - El cliente selecciona una referencia específica de la lista para ver información detallada.

4. **Visualización de Detalle de Referencia**:
   - El sistema despliega la vista detallada de la referencia seleccionada, incluyendo:
     - Folio de la Referencia
     - Fecha de operación
     - Aduana involucrada
     - Número de patente
     - Bultos
     - Cantidad de mercancía (Número de bultos)
     - Clase de (bulto) mercancía
     - Peso bruto de la mercancía
     - Estado del proceso
     - Descripción de las Mercancías
     - Ejecutivo
     - Cliente

5. **Registro de la Consulta**:
   - El sistema registra la consulta realizada, capturando la fecha, hora, usuario y referencia consultada, para fines de auditoría y trazabilidad.

## Flujos Alternativos Implementados

1. **No Existen Referencias Disponibles**:
   - Si la consulta no arroja resultados, el sistema muestra un mensaje informando que no se encontraron registros de operaciones aduanales asociadas.

2. **Error en la Consulta de Datos**:
   - En caso de un error al acceder a la API de SAGA, el sistema muestra un mensaje de error y solicita al cliente reintentar más tarde.

## Componentes Implementados

### Frontend

1. **Referencias.js**:
   - Página principal que muestra la lista de referencias y gestiona la selección de referencias para ver sus detalles.
   - Incluye funcionalidad de búsqueda y visualización del historial de consultas.

2. **DetalleReferencia.js**:
   - Componente que muestra los detalles completos de una referencia seleccionada.
   - Visualiza todos los campos requeridos en el caso de uso.

3. **HistorialConsultas.js**:
   - Componente que muestra el historial de consultas realizadas por el cliente.
   - Permite visualizar qué referencias se han consultado, cuándo y con qué detalle.

4. **referenciaService.js**:
   - Servicio que se encarga de la comunicación con el backend para obtener datos de referencias.
   - Incluye funcionalidad para registrar consultas y obtener el historial.

### Backend

1. **apiExternaRoutes.js**:
   - Define las rutas para acceder a los endpoints relacionados con referencias.
   - Incluye rutas para auditoría y trazabilidad.

2. **apiExternaController.js**:
   - Controlador que maneja las peticiones relacionadas con referencias.
   - Se comunica con la API de SAGA y gestiona las respuestas.
   - Registra las consultas realizadas para auditoría.

3. **apiErrorService.js**:
   - Servicio encargado de registrar los errores de conexión con la API externa.
   - Guarda logs detallados para diagnóstico y solución posterior.

## Postcondiciones Implementadas

1. El sistema registra la consulta realizada, incluyendo fecha, hora, usuario y referencia consultada.
2. La lista de referencias consultadas queda almacenada en el historial de consultas del cliente.
3. En caso de error o falta de referencias, el sistema registra el evento en el log correspondiente.
4. Si la conexión a la API falla, se genera un registro de error para su diagnóstico y solución posterior.

## Notas Técnicas

1. **Manejo de Conexión con SAGA**:
   - Se implementó un verificador de conexión con la API de SAGA.
   - Si la conexión falla, se utilizan datos mock para mostrar ejemplos de referencias.

2. **Auditoría y Trazabilidad**:
   - Cada consulta se registra en un historial que puede ser consultado por el cliente.
   - Se guardan detalles como tipo de consulta, detalle, fecha, hora y usuario.

3. **Registro de Errores**:
   - Los errores de conexión con la API se registran en archivos de log diarios.
   - Cada error incluye detalles como stack trace, respuesta de la API y datos del usuario.

4. **Datos Mock**:
   - Se implementaron datos de ejemplo para permitir el funcionamiento en caso de que la API no esté disponible.
   - Esto facilita las pruebas y el desarrollo, así como la demostración del sistema.

## Mejoras Futuras

1. Implementar paginación en la lista de referencias para mejorar el rendimiento con grandes volúmenes de datos.
2. Añadir filtros adicionales por fecha, estado, aduana, etc.
3. Implementar un sistema de notificaciones para alertar sobre cambios en el estado de las referencias.
4. Desarrollar funcionalidad para exportar los datos de referencias a formatos como PDF o Excel.
5. Mejorar la interfaz de usuario para mostrar información más detallada y visualizaciones gráficas.

---

*Este documento forma parte de la documentación del proyecto e-Clientes: Sistema de Agencia Aduanal.* 