const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    isActive: { type: Boolean, default: true }, // for soft delete
    password: { type: String, required: true },
}, {
    timestamps: true,
});


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;