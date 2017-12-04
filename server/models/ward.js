import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const wardSchema = new Schema({
  district: { type: Schema.Types.ObjectId, ref: 'District', required: true },
  name: { type: 'String', required: true },
  disable: { type: 'bool', default: false },

  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Ward', wardSchema);
