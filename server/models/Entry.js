const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema({
    itemId: Number,
    label: String,
    category: String,
    before: String,
    after: String
}, { _id: false });

const partSchema = new mongoose.Schema({
    partName: String,
    quantity: Number
}, { _id: false });

const partsDetailSchema = new mongoose.Schema({
    partName: String,
    status: String,   // AVAILABLE / NOT_AVAILABLE
    eta: String
}, { _id: false });

const entrySchema = new mongoose.Schema({
    timeIn: String,
    date: String,
    vehicleNo: String,
    model: String,
    chassisNo: String,
    customerName: String,
    mobileNo: String,
    kilometer: String,

    serviceAdvisor: String,
    workType: String,
    mechanicName: String,

    complaints: [String],

    checklist: [checklistItemSchema],

    // STATUS FLOW

    status: {
        type: String,
        enum: [
            "GATE_IN",
            "FLOOR_IN",
            "JOBCARD",
            "PARTS_REQUESTED",
            "PARTS_DONE",
            "ESTIMATE_CREATED",
            "ESTIMATE_APPROVED",
            "ESTIMATE_REJECTED",
            "GATE_OUT"
        ],
        default: "GATE_IN"
    },

    // 🔥 INDENT
    indent: {
        parts: [partSchema],
        notes: String
    },

    // 🔥 PARTS TEAM
    partsStatus: {
        type: String,
        enum: ["PENDING", "AVAILABLE", "ESTIMATE"],
        default: "PENDING"
    },

    estimate: {
        kilometer: String,
        workType: String,

        parts: [
            {
                description: String,
                amount: Number
            }
        ],

        labour: [
            {
                description: String,
                amount: Number
            }
        ],

        total: Number,
        approved: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING"
        }
    },

    partsDetails: [partsDetailSchema]



}, { timestamps: true });

module.exports = mongoose.model("Entry", entrySchema);