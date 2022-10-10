const clusterEnablerInstances = this.exec_mode === "cluster" ? "max" : null;

module.exports = {
  apps: [
    {
      name: "server1",
      script: "server.js",
      watch: true,
      args: "",
      exec_mode: "fork",
      instances: clusterEnablerInstances,
      node_args: ["--harmony", "--expose-gc"],
    },
    {
      name: "server2",
      script: "server.js",
      watch: true,
      args: "-p 8081",
      exec_mode: "fork",
      instances: clusterEnablerInstances,
      node_args: "--harmony --expose-gc",
    },
    {
      name: "server3",
      script: "server.js",
      watch: true,
      args: "-p 8082",
      exec_mode: "fork",
      instances: clusterEnablerInstances,
      node_args: "--harmony --expose-gc",
    },
  ],
};
