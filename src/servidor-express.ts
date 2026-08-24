import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Configuraciones de express[cite: 6]
const app = express();
const PORT = 3000; // Examen requiere puerto 3000[cite: 1]

const limiter = rateLimit({
    windowMs: 60_000, // 1 Minuto[cite: 6]
    max: 30, // Examen solicita 30 peticiones[cite: 1]
    message: {
        error: "Demasiadas peticiones, Intente en 1 minuto"
    }
});

// Middlewares
app.use(helmet());
app.use(express.json());
app.use(limiter);

// Base de datos simulada en memoria
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

// GET /api/usuarios => Listar todos los usuarios[cite: 1, 6]
app.get("/api/usuarios", (req: Request, res: Response) => {
    res.json(usuarios);
});

// GET /api/usuarios/:id => Obtener usuario por ID[cite: 1, 6]
app.get("/api/usuarios/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id); // Estilo de clase[cite: 6]
    const usuario = usuarios.find((u: any) => u.id == id); // Estilo de clase[cite: 6]

    if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" }); //[cite: 1]
    }

    res.json(usuario);
});

// POST /api/usuarios => Crear un nuevo Usuario[cite: 1, 6]
app.post("/api/usuarios", (req: Request, res: Response) => {
    const { nombre, email } = req.body; //[cite: 1]

    // Validaciones al estilo de clase[cite: 6]
    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
        return res.status(400).json({ error: "El nombre es obligatorio y no puede estar vacío" });
    }
    if (!email || typeof email !== "string" || email.trim().length === 0) {
        return res.status(400).json({ error: "El email es obligatorio y no puede estar vacío" });
    }

    // Calculo del autoincremental exacto a la clase[cite: 6]
    const nuevoId = usuarios.length > 0
        ? Math.max(...usuarios.map((u: any) => u.id)) + 1
        : 1;

    const nuevoUsuario = {
        id: nuevoId,
        nombre: nombre.trim(),
        email: email.trim()
    };

    usuarios.push(nuevoUsuario);

    res.status(201).json(nuevoUsuario);
});

// GET /api/health => Estado del servidor[cite: 1]
app.get("/api/health", (req: Request, res: Response) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString()
    });
});

// Middleware de manejo de errores (sin stack trace para el cliente)[cite: 1]
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});