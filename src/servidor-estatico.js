import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const Servidor = http.createServer((req, res) => {
    // Ruta
    if (req.url === "/" || req.url === "/index.html") {
        // Salimos de 'src' con '..' para encontrar la carpeta 'public' en la raíz
        const archivo = path.join(__dirname, "..", "public", "index.html");
        fs.readFile(archivo, (error, contenido) => {
            if (error) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                res.end("Error al leer el archivo");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(contenido);
        });
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Página no encontrada");
    }
});
Servidor.listen(3001, () => {
    console.log("Servidor escuchando en http://localhost:3001");
});
//# sourceMappingURL=servidor-estatico.js.map