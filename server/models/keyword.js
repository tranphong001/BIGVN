import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const keywordSchema = new Schema({
  title: { type: 'String', required: true, maxLength: [20, 'Độ dài vượt quá 20 từ.'] },
  alias: { type: 'String', required: true, unique: true },
  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Keyword', keywordSchema);
