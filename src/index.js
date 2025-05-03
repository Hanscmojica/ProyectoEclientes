const express = require("express");
const cors = require("cors");
const path = require("path");

const v1UsuarioRouter = require("./v1/routes/usuarioRoutes");
const v1AuthRoutes = require("./v1/routes/authRoutes");
const v1PermisoRouter = require("./v1/routes/permisoRoutes");
const v1PerfilRouter = require("./v1/routes/perfilRoutes");
const v1PerfilUsuarioRouter = require("./v1/routes/perfilUsuarioRoutes");
const v1PerfilPermisosRouter = require("./v1/routes/perfilPermisoRoutes");
const v1ApiExternaRouter = require("./v1/routes/apiExternaRoutes");
const v1ImagesRouter = require("./v1/routes/imageRoutes");
const v1PdfsRouter = require("./v1/routes/pdfRoutes");
const v1BibliotecaRouter = require("./v1/routes/biblioteca");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para todas las solicitudes
app.use(cors());

app.use(express.json());

// Rutas API
app.use("/api/v1/auth", v1AuthRoutes);
app.use("/api/v1/usuarios", v1UsuarioRouter);
app.use("/api/v1/permisos", v1PermisoRouter);
app.use("/api/v1/perfiles", v1PerfilRouter);
app.use("/api/v1/perfilesUsuarios", v1PerfilUsuarioRouter);
app.use("/api/v1/perfilesPermisos", v1PerfilPermisosRouter);
app.use("/api/v1/apiExterna", v1ApiExternaRouter);
app.use("/api/v1/pdfs", v1PdfsRouter);
app.use("/api/v1/images/usuarios", v1ImagesRouter);
app.use("/api/v1/biblioteca", v1BibliotecaRouter);

// Verificar si la carpeta build existe
const frontendPath = path.resolve(__dirname, '../frontend/build');
console.log('Ruta del frontend:', frontendPath);

// Configurar carpeta de archivos estáticos para el frontend
app.use(express.static(frontendPath));

// Ruta comodín para enviar todas las rutas desconocidas al frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
