import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const districtSchema = new Schema({
  city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  name: { type: 'String', required: true },
  disable: { type: 'bool', default: false },

  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('District', districtSchema);
