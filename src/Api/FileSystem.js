import fs from "fs";
import { ErrorLogger } from "../utils/logger.js";

class FileSystem {
  constructor() {
    this.ruta = `./DB/fakeProducts.json`;
  }

  async listarProductos() {
    try {
      const file = await fs.promises.readFile(this.ruta);
      return JSON.parse(file);
    } catch (error) {
      ErrorLogger.error("Archivo no existe-Archivo nuevo creado");
      await fs.promises.writeFile(this.ruta, JSON.stringify([]));
      return [];
    }
  }
}

export { FileSystem };
