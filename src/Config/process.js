import dotenv from "dotenv";
import yargs from "yargs";
dotenv.config();

const yarg = yargs(process.argv.slice(2))
  .default({
    p: 8080,
    m: "cluster" ? "cluster" : "fork",
  })
  .alias({
    p: "PORT",
    m: "MODE",
  });

const args = yarg.argv;

const config = {
  MongoURL: process.env.MONGOURL,
  Secret: process.env.SECRET,
  Port: args.p,
  Mode: args.m,
};

export { config };
