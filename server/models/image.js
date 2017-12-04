import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  name: { type: 'String', required: true, maxLength: [200, 'Độ dài vượt quá 200 từ.'] },
  directory: { type: 'String', required: true },
  dateCreated: { type: Date, default: Date.now },
});
export default mongoose.model('Image', imageSchema);
