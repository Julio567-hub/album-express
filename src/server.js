import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

const fotos = [
    {
        id: 1, titulo: 'Atardecer', calificacion: 4.5,
        descripcion: 'Playa de Montañita'},
    {
        id: 2, titulo: 'Malecon', calificacion: 4.0,
        descripcion: 'Guayaquil de noche'
    }
];

app.use(express.json());

app.use((req, res, next) => {
    const hora = new Date().toISOString();
    console.log(`[${hora}] ${req.method} ${req.url}`);
    next();
});

app.get('/api/fotos', (req,res) => {
    res.json(fotos);
});

app.get('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const foto = fotos.find((f) => f.id === id);
    if (!foto) {
        return res
        .status(404)
        .json({ error: 'Foto no encontrada' });
    }
    res.json(foto);
});

app.post('/api/fotos', (req, res) => {
    const { titulo, descripcion, calificacion } = req.body;
    if (!titulo) {
        return res
        .status(400)
        .json({ mensaje: 'El título es obligatorio' });
    }
    const nueva = {
        id: fotos.length + 1, titulo, descripcion, calificacion,
    };
    fotos.push(nueva);
    res.status(201).json(nueva);
});

app.patch('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = fotos.findIndex((f) => f.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensaje: `Foto ${id} no encontrada` });
    }

    const fotoActualizada = {
        ...fotos[indice],
        ...req.body,
        id: id
    };

    fotos[indice] = fotoActualizada;

    res.json(fotoActualizada);
});

app.delete('/api/fotos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = fotos.findIndex((f) => f.id === id);

    if (indice === -1) {
        return res.status(404).json({ mensaje: `Foto ${id} no encontrada` });
    }

    fotos.splice(indice, 1);

    res.status(204).end();
});

app.get('/api/error', async () => {
    throw new Error('Algo salió mal');
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});