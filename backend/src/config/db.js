const mongoose = require("mongoose");
const dns = require("node:dns");

async function conectarDB() {
  try {
    const servidoresDns = (process.env.MONGO_DNS_SERVERS || "")
      .split(",")
      .map((servidor) => servidor.trim())
      .filter(Boolean);

    if (servidoresDns.length > 0) {
      dns.setServers(servidoresDns);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = conectarDB;
