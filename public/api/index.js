const socket = io();

const createProductView = async (products) => {
  const template = await (await fetch("/views/partials/vistaProductos.handlebars")).text();
  const templateCompiled = Handlebars.compile(template);
  return templateCompiled({ products });
};


socket.on("products", async (products) => {
  const template = await createProductView(products);
  document.getElementById("productsView").innerHTML = template;
});