import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: 'String', required: true },
  term_id: { type: 'number', required: true },
  title: { type: 'String', required: true },
  alias: { type: 'String', required: true },
  metaKeyword: { type: 'String', required: true },
  metaDescription: { type: 'String', required: true },
  description: { type: 'String', required: true },
  status: { type: 'number', default: 0 },

  parentId: { type: Schema.Types.ObjectId, default:null, ref: 'Category' },
  createTime: { type: Date, default: Date.now },
});

export default mongoose.model('Category', categorySchema);
