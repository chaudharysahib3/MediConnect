import mongoose from "mongoose";

const appointmentSchema=new mongoose.Schema(
    {
        patient: {
            type:mongoose.Schema.Types.ObjectId, ref:"User", required: true
        },
        doctor:{
            type:mongoose.Schema.Types.ObjectId, ref:"User", required: true
        },
        reason:{
            type:String
        },
        date:{
            type:Date, required:true
        },
        status:{
            type:String,
            enum:["pending", "accepted", "rejected", "completed"],
            default:"pending"
        },
    },
    {timestamps:true}
);

export default mongoose.model("Appintment", appointmentSchema);