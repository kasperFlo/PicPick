// import mongoose from "mongoose";
import { dbConnect } from "../DBmanager"; // Adjust the path as necessary
import {User} from "./User";

export async function initAdminUser() {
  
  await dbConnect(); // Make sure DB is connected first

  const adminExists = await User.findOne({ username: "AdminTest" });
  if (adminExists != null) {
    console.log("Admin user exists:", adminExists);
    return;
  }
  // If admin doesn't exist, create one
  console.log("Admin user not found, creating one...");
  const newUser = new User({
    username: "AdminTest",
    email: "admin@example.com",
    password: "password123", // Ideally hashed for productionIDK
    firstName: "Admin",
    lastName: "User",
    createdAt: new Date(),
    wishlist: [
      {
        name: "Sony WH-1000XM4 Wireless Headphones",
        link: "https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3",
        price: 348.0,
      },
      {
        name: "Samsung 49-Inch Odyssey G9 Gaming Monitor",
        link: "https://www.bestbuy.com/site/samsung-odyssey-g9-49-led-curved-qhd-gaming-monitor-white/6425569.p",
        price: 1399.99,
      },
      {
        name: "Apple MacBook Pro 16-inch",
        link: "https://www.walmart.com/ip/Apple-MacBook-Pro-16-inch-M3-Pro-chip-with-12-core-CPU-and-18-core-GPU-36GB-Unified-Memory-512GB-SSD-Space-Black/5032356228",
        price: 2699.0,
      },
      {
        name: "NVIDIA GeForce RTX 4080 Graphics Card",
        link: "https://www.newegg.com/nvidia-geforce-rtx-4080/p/N82E16814487016",
        price: 1199.99,
      },
      {
        name: "Logitech MX Master 3S Mouse",
        link: "https://www.amazon.com/Logitech-Master-Advanced-Wireless-Mouse/dp/B09HM94VDS",
        price: 99.99,
      },
    ],
  });
  await newUser.save();
  console.log("Admin user created successfully");
}
