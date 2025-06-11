const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema(
    {
        // userId: Number,
        name: {type: String, required: true}, 
        email: {type: String, required: true, unique: true}, 
        password: {type: String, required: true}, 

        role: {
            type: String, 
            enum: ['admin', 'theaterAdmin','user'], 
            default: 'user'
        }
    }, 
    {timestamps: true}
);
// userSchema.plugin(AutoIncrement, { inc_field: 'userId' });
module.exports = mongoose.model('User', userSchema);