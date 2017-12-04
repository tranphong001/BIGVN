import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  name: { type: 'String', required: true },
  imageDirectory: { type: 'String', required: true },
  description: { type: 'String', required: true },
  link: { type: 'String', default: '' },
  disable: { type: 'Boolean', default: false },

  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.model('Banner', bannerSchema);
