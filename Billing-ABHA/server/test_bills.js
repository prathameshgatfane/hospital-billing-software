import mongoose from "mongoose";
import OpdBilling from "./models/OpdBilling.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const bills = await OpdBilling.find().lean();
  console.log("Total bills:", bills.length);
  bills.forEach(b => console.log(b.billNumber, b.billDate, b.totalAmount, b.paymentStatus));
  process.exit(0);
});
