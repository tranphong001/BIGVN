import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  name: { type: 'String', required: true },
  value: { type: 'String', required: true },
  disable: { type: 'bool', default: false },

  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Setting', settingSchema);
