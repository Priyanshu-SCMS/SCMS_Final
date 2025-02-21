const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
    studentName: String,
    fatherName: String,
    classSection: String,
    feeDescription: String,
    dueDate: String,
    installmentAmount: Number,
    receivedAmount: Number,
    dueAmount: Number,
    category: String  // "current_due", "total_due", "receipt"
});

module.exports = mongoose.model('Fee', FeeSchema);
