import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  title: { type: 'String', required: true },
  alias: { type: 'String', required: true },
  disable: { type: 'bool', default: false },

  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Topic', topicSchema);
