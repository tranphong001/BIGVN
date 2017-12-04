import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  facebookId: { type: 'String', default: '' },
  googleId: { type: 'String', default: '' },

  userName: { type: 'String', required: true, unique: true },
  fullName: { type: 'String', required: true },
  password: { type: 'String', required: true },
  salt: { type: 'String', default: '' },

  newser: { type: 'bool', default: true },
  blogger: { type: 'bool', default: false },

  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
