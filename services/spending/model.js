const mongoose= require("mongoose");

const spendingSchema= new mongoose.Schema({
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    date: {
        type: Date,
        required: true
    }
  });

const SpendingModel= mongoose.model("Spending", spendingSchema);

module.exports= SpendingModel;
