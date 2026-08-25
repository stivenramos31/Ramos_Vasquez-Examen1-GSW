import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = 3005;

// Configuración de Rate Limit
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 Minuto
    max: 30, // 30 peticiones por minuto
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Demasiadas peticiones, Intente en 1 minuto"
    }
});

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(limiter);

// Base de datos
interface Usuario {
    id: number;
    nombre: string;
    email: string;
}

let usuarios: Usuario[] = [
    { id: 1, nombre: "Carlos Ramos", email: "carlos@example.com" },
    { id: 2, nombre: "María López", email: "maria@example.com" },
    { id: 3, nombre: "Ana Martínez", email: "ana@example.com" }
];

// GET /api/usuarios
app.get("/api/usuarios", (req: Request, res: Response) => {
    res.json(usuarios);
});

// GET /api/usuarios/:id
app.get("/api/usuarios/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usuario = usuarios.find((u) => u.id === id);

    if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
});

// POST /api/usuarios
app.post("/api/usuarios", (req: Request, res: Response) => {
    const { nombre, email } = req.body || {};

    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
        return res.status(400).json({ error: "El nombre es obligatorio y no puede estar vacío" });
    }
    if (!email || typeof email !== "string" || email.trim().length === 0) {
        return res.status(400).json({ error: "El email es obligatorio y no puede estar vacío" });
    }

    const nuevoId = usuarios.length > 0
        ? Math.max(...usuarios.map((u) => u.id)) + 1
        : 1;

    const nuevoUsuario: Usuario = {
        id: nuevoId,
        nombre: nombre.trim(),
        email: email.trim()
    };

    usuarios.push(nuevoUsuario);

    res.status(201).json(nuevoUsuario);
});

// GET /api/health
app.get("/api/health", (req: Request, res: Response) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});

// Prevenir cierre del proceso
process.on("uncaughtException", (err) => {
    console.error("Excepción capturada:", err);
});