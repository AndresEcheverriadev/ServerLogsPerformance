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

process.on("message", (message) => {
  const resultado = randoms(message);
  process.send(resultado);
  process.exit;
});
