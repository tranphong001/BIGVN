import Category from '../models/category';

export function createCategory(req, res) {
  const reqCategory =  req.body.category;
  if (reqCategory &&
    reqCategory.hasOwnProperty('name') &&
    reqCategory.hasOwnProperty('title') &&
    reqCategory.hasOwnProperty('alias') &&
    reqCategory.hasOwnProperty('metaKeyword') &&
    reqCategory.hasOwnProperty('description') &&
    reqCategory.hasOwnProperty('metaDescription')
  ) {
    Category.findOne({}).sort(term_id, 1).run((err, doc) => {
      if (err) {
        res.json({ category: 'error' });
      } else {
        const term_id = doc.term_id;
        const category = new Category({
          name: reqCategory.name,
          term_id,
          title: reqCategory.title,
          alias: reqCategory.alias,
          metaKeyword: reqCategory.metaKeyword,
          metaDescription: reqCategory.metaDescription,
          description: reqCategory.description,
        });
        category.save((err1) => {
          if (err1) {
            res.json({ category: 'error' });
          } else {
            res.json({ category: 'success' });
          }
        });
      }
    });
  } else {
    res.json({ category: 'missing' });
  }
}
export function getCategories(req, res) {
  Category.find({ status: 0 }).exec((err, categories) => {
    if (err) {
      res.json({ categories: [] });
    } else {
      res.json({ categories });
    }
  });
}
