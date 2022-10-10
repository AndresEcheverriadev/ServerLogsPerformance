import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { FileSystem } from "./Api/FileSystem.js";
import { MesaggesSystem } from "./Api/MesaggesSystem.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "./Config/process.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import passport from "passport";
import initializePassport from "./Config/passport.js";
import { fork } from "child_process";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cluster from "cluster";
import { cpus } from "os";
import compression from "compression";
import { logger } from "./utils/logger.js";

// const modoCluster = process.argv[3] == "cluster";

// if (modoCluster && cluster.isPrimary) {
//   const numCPUs = cpus().length;

//   console.log(`Número de procesadores: ${numCPUs}`);
//   console.log(`PID MASTER ${process.pid}`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     console.log(
//       "Worker",
//       worker.process.pid,
//       "died",
//       new Date().toLocaleString()
//     );
//     cluster.fork();
//   });
// } else {}

function randoms(combinations) {
  const arrayNumbers = [];
  const count = {};

  for (let index = 0; index < combinations; index++) {
    const min = Math.ceil(1);
    const max = Math.floor(1000);
    const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
    arrayNumbers.push(randomNumber);
  }

  arrayNumbers.forEach((number) => {
    count[number] = (count[number] || 0) + 1;
  });

  const result = Object.entries(count).map(([key, value]) =>
    Object.assign({ numero: key, repeticiones: value })
  );

  return result;
}

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const apiMensajes = new MesaggesSystem();
const apiProductos = new FileSystem();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const port = config.Port;
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use(logger());

// ---start Compression Switch---

app.use(compression());

// ---start Compression Switch---

initializePassport();

const connection = mongoose.connect(config.MongoURL);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.MongoURL,
      mongoOptions: advancedOptions,
      ttl: 3600,
    }),
    secret: config.Secret,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 600000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../public/views"));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  req.logger.info("peticion recibida al servidor");
  if (!req.session.user) return res.redirect("/login");
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  req.logger.info("peticion recibida al servidor desde /home");
  req.session.contador++;
  res.render("vistaContenedor", { user: req.user.email });
});

app.get("/login", (req, res) => {
  req.logger.info("peticion recibida al servidor desde /login");
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  }
});

app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/loginfail" }),
  async (req, res) => {
    res.redirect("/home");
  }
);

app.get("/loginfail", (req, res) => {
  res.render("vistaError", { error: "Login failed" });
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/registerfail" }),
  async (req, res) => {
    res.redirect("/home");
  }
);

app.get("/registerfail", async (req, res) => {
  res.render("vistaError", { error: "Register failed" });
});

app.get("/logout", (req, res) => {
  req.logger.info("peticion recibida al servidor desde /logout");
  const email = req.session?.email;
  if (email) {
    req.session.destroy((err) => {
      if (!err) {
        res.render(path.join(__dirname, "../public/views/vistaLogout"), {
          email,
        });
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

const dataInfo = {
  args: process.argv.slice(2),
  plataforma: process.platform,
  Node: process.version,
  memoria: JSON.stringify(process.memoryUsage.rss()),
  ruta: process.execPath,
  proceso: process.pid,
  carpeta: process.cwd(),
};

app.get("/info", (req, res) => {
  console.log(dataInfo);
  res.render("vistaPros", { dataInfo });
});

// app.get("/randoms", (req, res) => {
//   req.logger.info("peticion recibida al servidor desde /randoms");
//   const { cantidad = 1e8 } = req.query;

//   const calcCombinations = fork("./calcCombinations.js");
//   calcCombinations.send(cantidad);
//   calcCombinations.on("message", (combinations) => {
//     res.render("vistaRandoms", { combinations });
//   });
// });

app.get("/randoms", (req, res) => {
  req.logger.info("peticion recibida al servidor desde /randoms");
  const { cantidad = 1e8 } = req.query;
  const combinations = randoms(cantidad);
  res.render("vistaRandoms", { combinations });
});

app.get("*", function (req, res) {
  req.logger.warn("peticion a una ruta inexistente");
  res.status(404).send("Esta página no existe");
});

io.on("connection", async (socket) => {
  console.log(`Cliente conectado en ${socket.id}`);
  socket.emit("products", await apiProductos.listarProductos());
});

const server = httpServer.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});

server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});

console.log("args ->", process.argv.slice(2));

// andres@correox.cl
// 123456A
// taskkill /f /im node.exe
// taskkill /f /im nginx.exe
// taskkill /f /im pm2.exe
// pm2 start ecosystem.config.cjs
