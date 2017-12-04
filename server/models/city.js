import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: { type: 'String', required: true },
  disable: { type: 'bool', default: false },

  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('City', citySchema);
