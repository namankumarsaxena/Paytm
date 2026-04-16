
const mongoose = require('mongoose');

 async function connectionDB() { 
    try{
        await mongoose.connect('');
        console.log('Connected Successfully');
    } catch(error) {
        console.error('Connection error :', error);
    }
}
const {Schema} = mongoose;
// const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    firstName: {type: String, required:true,trim:true},
    lastName: {type: String, required:true,trim:true},
    username : {type: String, unique: true},
    password: {type: String, required:true, minlength: 8}
});

const accountSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const UserModal = mongoose.model('User', UserSchema)
const AccountModal = mongoose.model('Account', accountSchema);

module.exports = {
    UserModal,
    AccountModal,
    connectionDB
}
