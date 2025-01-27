import bodyParser from "body-parser";
import express from "express";
import usuario_routes from './routes/usuario';

// INICIALIZAMOS EXPRESS
const app = express();
const port = process.env.PORT || 4201;

// BODYPARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

// CORS CONFIGURACION
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Allow", "GET, PUT, POST, DELETE, OPTIONS");
  next();
});

// INICIALIZACION DE RUTAS
app.use('/api', usuario_routes);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

export default app;
