console.log('conected js')
// const form = document.getElementById('loginForm');

// form.addEventListener('submit',evt=>{
//     evt.preventDefault();
//     let data = new FormData(form);
//     let obj = {};
//     data.forEach((value,key)=>obj[key]=value);
//     fetch('/loginjwt',{
//         method:'POST',
//         body:JSON.stringify(obj),
//         headers:{
//             "Content-Type":"application/json"
//         }
//     }).then(result=>result.json()).then(json=>{
//         if(json.status=="success"){//Debería venir un token
//             localStorage.setItem('CoderTokeFeliz',json.token);
//         }
//     });
// })



// const socket = io();

// function enviarMensaje() {

//   const id = document.getElementById("id");
//   const nombre = document.getElementById("nombre");
//   const apellido = document.getElementById("apellido");
//   const edad = document.getElementById("edad");
//   const alias = document.getElementById("alias");
//   const text = document.getElementById("text");

//   if (!id.value || !nombre.value || !apellido.value || !edad.value|| !alias.value || !text.value) {
//     alert("Debe completar los campos");
//     return false;
//   }

//   socket.emit("mensajeNuevo", { 
//     id: id.value, 
//     nombre: nombre.value, 
//     apellido: apellido.value, 
//     edad: edad.value, 
//     alias: alias.value, 
//     text: text.value 
//   });

//   mensaje.value = "";
//   return false;
// }

// socket.on("mensajes", (mensajes) => {
//   let mensajesHtml = mensajes.posts
//     .map(
//       (mensaje) =>
//         `<span>
//         <div><img class='avatarRandomImg' src=${mensaje.author.avatar}></img></div> 
//         <div><b>${mensaje.author.alias}</b></div> 
//         <div>${mensaje.text}</div> 
//         <hr>       
//         </span>`
//     )
//     .join("<br>");

//   document.getElementById("mesaggesWall").innerHTML = mensajesHtml;
// });

// // const loginForm = document.getElementById('loginForm');


//   const loginView = async (user) => {
//     const template = await (await fetch("/views/vistaLogin.hbs")).text();
//     const templateCompiled = Handlebars.compile(template);
//     return templateCompiled({ user });
//   };
  
  
//   socket.on("userlogin", async (user) => {
//     const template = await loginView(user);
//     document.getElementById("loginView").innerHTML = template;
//   });