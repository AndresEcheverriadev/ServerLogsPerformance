import fs from "fs";
import { getTimestamp } from '../utils/timeStamp.js'

class MesaggesSystem{
  constructor() {
    this.ruta = `../src/DB/mesaggesContainer.txt`;
  };

    async listarMensajes() {
      try {
        const file = await fs.promises.readFile(this.ruta);
        return JSON.parse(file) ;
      } catch (error) {
        return error
      }
    };

    async insertarMensaje(message) {
      try {
        const mensajes = await this.listarMensajes();
        const randIdNumber = Math.random().toFixed(2)*100
        const nuevoMensaje = {
          id: `0xd${randIdNumber}`,
          author: {
              id:message.id,
              nombre:message.nombre,
              apellido:message.apellido,
              edad:message.edad,
              alias:message.alias,
              avatar:faker.random.image(),
              timestamp:getTimestamp(),
          }, 
          text:message.text,
        };
        console.log(message);
        mensajes.posts.push(nuevoMensaje);
        console.log(nuevoMensaje);
        const updatedMensagges = await fs.promises.writeFile(this.ruta, JSON.stringify(mensajes, null, 2));
        return updatedMensagges;
      } catch (error) {
        return error;
      }
    };   
}

export {MesaggesSystem}