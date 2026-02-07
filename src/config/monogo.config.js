import mongoose from "mongoose";
import dns from "dns";

// Force specific DNS servers (Google Public DNS) to resolve SRV records
// This fixes "querySrv ECONNREFUSED" errors on some networks/ISPs
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
  console.log("Could not set custom DNS servers:", error.message);
}
console.log(process.env.MONGO_URI);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
