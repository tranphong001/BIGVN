import News from '../models/news';
import User from '../models/user';
import Topic from '../models/topic';
import Setting from '../models/setting';
import Category from '../models/category';
import City from '../models/city';
import Keyword from '../models/keyword';
import cuid from 'cuid';
import fs from 'fs';
import KhongDau from 'khong-dau';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

function writeImage(base64image) {
  return new Promise((resolve, reject) => {
    const ext = base64image.split(';')[0].match(/jpeg|png|gif/)[0];
    const data = base64image.replace(/^data:image\/\w+;base64,/, '');
    const buf = new Buffer(data, 'base64');
    const date = Date.now();
    const srcImageName = `${date.toString()}_${cuid()}`;

    fs.writeFile(`public/${srcImageName}.${ext}`, buf, (err) => {
      if (err) {
        reject('error');
      } else {
        imagemin([`public/${srcImageName}.${ext}`], './public', {
          plugins: [
            imageminJpegtran(),
            imageminPngquant({ quality: '70-80' }),
          ],
        }).then(files => {
          const imageName = `${date.toString()}_${cuid()}`;
          fs.writeFile(`public/${imageName}.${ext}`, files[0].data, (err2) => {
            if (err2) {
              reject('error')
            } else {
              fs.unlink(`public/${srcImageName}.${ext}`, (err) => {});
              resolve(`${imageName}.${ext}`);
            }
          });
          // => [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
        });
      }
    });
  });
}
export function updateNews(req, res) {
  const reqNews = req.body.news;
  if (reqNews &&
    reqNews.hasOwnProperty('userId') &&
    reqNews.hasOwnProperty('id') &&
    reqNews.hasOwnProperty('type') &&
    reqNews.hasOwnProperty('title') &&
    reqNews.hasOwnProperty('content') &&
    reqNews.hasOwnProperty('thumbnail') &&
    reqNews.hasOwnProperty('imagesBase64') &&
    reqNews.hasOwnProperty('deleteImages')
  ) {
    let bool = false;
    if (reqNews.type === 'news') {
      if (
        reqNews.hasOwnProperty('category') &&
        reqNews.hasOwnProperty('city') &&
        reqNews.hasOwnProperty('district') &&
        reqNews.hasOwnProperty('ward') &&
        reqNews.hasOwnProperty('address') &&
        reqNews.hasOwnProperty('price') &&
        reqNews.hasOwnProperty('contact') &&
        reqNews.contact.hasOwnProperty('name') &&
        reqNews.contact.hasOwnProperty('address') &&
        reqNews.contact.hasOwnProperty('phone')
      ) {
        User.findOne({ _id: mongoose.Types.ObjectId(reqNews.userId), newser: true }).exec((userErr, user) => {
          if (userErr) {
            res.json({ news: 'error' });
          } else {
            if (user) {
              News.updateOne(
                { _id: reqNews.id },
                {
                  $pullAll: { imageDirectories: reqNews.deleteImages },
                }
              ).exec((err1) => {
                if (err1) {
                  res.json({ news: 'error' });
                } else {
                  const promises = [];
                  reqNews.imagesBase64.map((base64) => {
                    promises.push(writeImage(base64));
                  });
                  Promise.all(promises).then((imageDirectories) => {
                    const alias = KhongDau(reqNews.title).toString().toLowerCase().replace(/[^0-9a-z]/gi, " ").trim().replace(/ {1,}/g," ").replace(/ /g, '-');
                    News.updateOne(
                      { _id: reqNews.id },
                      {
                        $pushAll: { imageDirectories },
                        category: reqNews.category,
                        city: reqNews.city,
                        district: reqNews.district,
                        thumbnail: reqNews.thumbnail,
                        ward: reqNews.ward,
                        address: reqNews.address,
                        title: reqNews.title,
                        alias,
                        price: reqNews.price,
                        content: reqNews.content,
                        contact: reqNews.contact,
                        approved: false
                      }
                    ).exec((err2) => {
                      if (err2) {
                        res.json({ news: 'error' });
                      } else {
                        res.json({ news: 'success' });
                      }
                    });
                  });
                }
              });
            } else {
              res.json({ news: 'error' });
            }
          }
        });
      } else {
        res.json({news: 'missing'});
      }
    } else {
      if (reqNews.hasOwnProperty('topic')) {
        User.findOne({ _id: mongoose.Types.ObjectId(reqNews.userId), newser: true }).exec((userErr, user) => {
          if (userErr) {
            res.json({ news: 'error' });
          } else {
            if (user) {
              const promises = [];
              reqNews.imagesBase64.map((base64) => {
                promises.push(writeImage(base64));
              });
              Promise.all(promises).then((imageDirectories) => {
                News.updateOne(
                  { _id: reqNews.id },
                  {
                    $pullAll: { imageDirectories: reqNews.deleteImages },
                  }
                ).exec((err1) => {
                  if (err1) {
                    res.json({ news: 'error' });
                  } else {
                    const alias = KhongDau(reqNews.title).toString().toLowerCase().replace(/[^0-9a-z]/gi, " ").trim().replace(/ {1,}/g," ").replace(/ /g, '-');
                    News.updateOne(
                      { _id: reqNews.id },
                      {
                        $pushAll: { imageDirectories },
                        topic: reqNews.topic,
                        title: reqNews.title,
                        thumbnail: reqNews.thumbnail,
                        alias,
                        summary: reqNews.summary,
                        content: reqNews.content,
                        approved: false
                      }
                    ).exec((err2) => {
                      if (err2) {
                        res.json({ news: 'error' });
                      } else {
                        res.json({ news: 'success' });
                      }
                    });
                  }
                });
              });
            } else {
              res.json({ news: 'error' });
            }
          }
        });
      } else {
        res.json({ news: 'missing' });
      }
    }
  } else {
    res.json({ news: 'missing' });
  }
}
export function createNews(req, res) {
  const reqNews = req.body.news;
  if (reqNews &&
      reqNews.hasOwnProperty('userId') &&
      reqNews.hasOwnProperty('type') &&
      reqNews.hasOwnProperty('title') &&
      reqNews.hasOwnProperty('content') &&
      reqNews.hasOwnProperty('thumbnail') &&
      reqNews.hasOwnProperty('imagesBase64')
  ) {
    let bool = true;
    if (reqNews.type === 'news') {
      if (
        !reqNews.hasOwnProperty('category') ||
        !reqNews.hasOwnProperty('city') ||
        !reqNews.hasOwnProperty('district') ||
        !reqNews.hasOwnProperty('ward') ||
        !reqNews.hasOwnProperty('address') ||
        !reqNews.hasOwnProperty('price') ||
        !reqNews.hasOwnProperty('contact') ||
        !reqNews.contact.hasOwnProperty('name') ||
        !reqNews.contact.hasOwnProperty('address') ||
        !reqNews.contact.hasOwnProperty('phone')
      ) {
        res.json({ news: 'missing' });
        bool = false;
        return;
      }
    } else {
      if (!reqNews.hasOwnProperty('topic')
      ) {
        res.json({ news: 'missing' });
        bool = false;
        return;
      }
    }
    if (bool) {
      User.findOne({ _id: mongoose.Types.ObjectId(reqNews.userId), newser: true }).exec((userErr, user) => {
        if (userErr) {
          res.json({ news: 'error' });
        } else {
          if (user) {
            const promises = [];
            const keywordArr = [];
            reqNews.imagesBase64.map((base64) => {
              promises.push(writeImage(base64));
            });
            Promise.all(promises).then((imageDirectories) => {
              reqNews.keywords.map((k) => {
                const keywordTemp = KhongDau(k.name).toString().toLowerCase()
                                                            .replace(/[^0-9a-z]/gi, ' ').trim()
                                                            .replace(/ {1,}/g, ' ').replace(/ /g, '-');
                Keyword.findOneAndUpdate(
                  { alias: keywordTemp },
                  { alias: keywordTemp, title: k.name },
                  { upsert: true, new: true, setDefaultsOnInsert: true },
                  (error, result) => {
                    if (!error) {
                      if (!result) {
                        const newKeyword = new Keyword({
                          alias: keywordTemp,
                          title: k.name,
                        });
                        newKeyword.save((errSave) => {
                          if (!errSave) {
                            keywordArr.push(newKeyword._id);
                          }
                        });
                      } else {
                        keywordArr.push(result._id);
                      }
                    }
                  });
              });
              const alias = KhongDau(reqNews.title).toString().toLowerCase().replace(/[^0-9a-z]/gi, ' ').trim().replace(/ {1,}/g, ' ').replace(/ /g, '-');
              const titleSearch = KhongDau(reqNews.title.trim()).toString().toLowerCase();
              console.log(keywordArr);
              const news = new News({
                category: reqNews.category,
                topic: reqNews.topic,
                userId: reqNews.userId,
                city: reqNews.city,
                district: reqNews.district,
                ward: reqNews.ward,
                type: reqNews.type,
                address: reqNews.address,
                title: reqNews.title,
                metaDescription: reqNews.metaDescription,
                metaKeyword: reqNews.metaKeyword,
                titleSearch,
                keyword: keywordArr,
                price: reqNews.price,
                content: reqNews.content,
                summary: reqNews.summary,
                contact: reqNews.contact,
                imageDirectories: imageDirectories,
                thumbnail: reqNews.thumbnail,
              });
              news.alias = (reqNews.type === 'news') ? `${alias}-${news._id}` : alias;
              news.save((err) => {
                if (err) {
                  res.json({news: 'error'});
                } else {
                  res.json({news: 'success'});
                }
              });
            }, (err) => {
              res.json({news: 'error'});
            });
          } else {
            res.json({news: 'error'});
          }
        }
      });
    }
  } else {
    res.json({ news: 'missing' });
  }
}
export function getAlias(req, res) {
  console.log('abcdef');
}

export function getNewsByAlias(req, res) {
  News.findOne({ alias: { $regex: req.params.alias, $options: 'i' }, approved: true, type: 'news' })
    .populate('category', 'title alias')
    .populate('topic', 'title alias')
    .populate('city', 'name')
    .exec((err, news) => {
      if (err) {
        res.json({ news: 'error' });
      } else {
        if (news) {
          res.json({ news });
        } else {
          res.json({ news: '404' });
        }
      }
    });
}
export function getNewsByCategory(req, res) {
  const page = (req.query.page && req.query.page !== '') ? req.query.page : 0;
  Category.findOne({ alias: { $regex: req.params.category, $options: 'i' }, status: 0 }).exec((err, cate) => {
    if (err) {
      res.json({ news: [] });
    } else {
      if (cate) {
        Setting.findOne({name: 'newsCount'}).exec((errSetting, max) => {
          if (errSetting) {
            res.json({ news: [] });
          } else {
            News.find(
              { category: mongoose.Types.ObjectId(cate._id), approved: true, vipAll: false, vipCategory: false, type: 'news' },
              {},
              { skip: Number(max.value) * page, limit: Number(max.value), sort: { dateCreated: -1 } }
            )
              .sort({ dateCreated: -1 })
              .populate('category', 'title alias')
              .populate('topic', 'title alias')
              .populate('city', 'name')
              .exec((err1, news) => {
                if (err1) {
                  res.json({ news: [] });
                } else {
                  res.json({ news });
                }
              });
          }
        });
      } else {
        res.json({ news: [] });
      }
    }
  });
}
export function getNewsVipCategory(req, res) {
  Setting.findOne({ name: 'vipNewsCount' }).exec((err2, count) => {
    if (err2) {
      res.json({news: []});
    } else {
      Category.findOne({alias: req.params.alias}).exec((err, category) => {
        if (err) {
          res.json({news: []});
        } else {
          if (category) {
            News.find({
              category: mongoose.Types.ObjectId(category._id),
              vipCategory: true,
              approved: true,
              type: 'news'
            }, {}, {sort: {vipCategory: 1, dateCreated: -1}})
              .populate('category', 'title alias')
              .populate('topic', 'title alias')
              .populate('city', 'name')
              .limit(Number(count.value))
              .exec((err, news) => {
              if (err) {
                res.json({news: []});
              } else {
                res.json({news});
              }
            });
          } else {
            News.findOne({alias: req.params.alias, approved: true}).exec((err2, news) => {
              if (err2) {
                res.json({news: []});
              } else {
                if (news) {
                  News
                    .find({
                      category: mongoose.Types.ObjectId(news.category),
                      vipCategory: true,
                      approved: true
                    }, {}, {sort: {vipCategory: 1, dateCreated: -1}})
                    .limit(10)
                    .populate('category', 'title alias')
                    .populate('topic', 'title alias')
                    .populate('city', 'name')
                    .exec((err3, news2) => {
                      if (err3) {
                        res.json({news: []});
                      } else {
                        res.json({news: news2});
                      }
                    });
                } else {
                  res.json({news: []});
                }
              }
            });
          }
        }
      });
    }
  });
}
export function getNewsVipAll(req, res) {
  Setting.findOne({name: 'maxVipAll'}).exec((err2, maxVipAll) => {
    if (err2) {
      res.json({ news: [] });
    } else {
      News.find({ vipAll: true, approved: true, type: 'news' }, {}, { sort: { dateCreated: -1 } })
        .populate('category', 'title alias')
        .populate('city', 'name')
        .limit(Number(maxVipAll.value))
        .exec((err, news) => {
          if (err) {
            res.json({news: []});
          } else {
            const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

            res.json({news: shuffleArray(news)});
          }
        });
    }
  });
}
export function getNews(req, res) {

}
export function getNews2(req, res) {
  const searchString = req.query.searchString ? req.query.searchString : '';
  const searchCategory = req.query.searchCategory ? req.query.searchCategory: '';
  const searchCity= req.query.searchCity ? req.query.searchCity: '';
  const searchPage = req.query.searchPage ? req.query.searchPage: 0;
  Setting.findOne({name: 'newsCount'}).exec((errSetting, max) => {
    if (errSetting) {
      res.json({news: [], count: 0});
    } else {
      let cates = [];
      let citys = [];
      Category.find({}).exec((errCate, categories) => {
        if (errCate) {
          res.json({news: []});
        } else {
          categories.map(cate => cates.push(cate._id));
          City.find({}).exec((errCity, cities) => {
            if (errCity) {
              res.json({news: [], count: 0});
            } else {
              cities.map(c => citys.push(c._id));
              if (searchString === '') {
                News
                  .aggregate([
                    {
                      $match:
                        {
                          approved: true,
                          type: 'news',
                          category: {$in: (searchCategory === '') ? cates : [mongoose.Types.ObjectId(searchCategory)]},
                        }
                    },
                    {$sort: {"dateCreated": -1}},
                    {
                      $lookup: {
                        "from": "categories",
                        "localField": "category",
                        "foreignField": "_id",
                        "as": "category"
                      }
                    },
                    {$unwind: '$category'},
                    {
                      $lookup: {
                        "from": "cities",
                        "localField": "city",
                        "foreignField": "_id",
                        "as": "city"
                      }
                    },
                    {$unwind: '$city'},
                    {$group: {"_id": "$category", "news": {$first: "$$ROOT"}}},
                    {$project: {"_id": "$form._id", "news": "$news",}},
                    {$sort: {"index": 1, "score": -1}},
                    {
                      $group: {
                        _id: null,
                        "news": { $push: "$news" },
                        count: { $sum: 1 },
                      }
                    },
                    {
                      $project:
                        {
                          "news": { $slice: [ "$news", Number(max.value) * Number(searchPage), Number(max.value) ] },
                          count: "$count",
                        }
                    },
                  ])
                  .exec((err, result) => {
                    if (err) {
                      res.json({news: [], count: 0});
                    } else {
                      if (result.length > 0) {
                        const length = result[0].count / max + (result[0].count % max === 0) ? 0 : 1;
                        res.json({news: result[0].news, count: (result[0].count !== 0) ? length : 0 });
                      } else {
                        res.json({news: [], count: 0});
                      }
                    }
                  });
              } else {
                console.log(searchString);
                console.log(searchString);
                News
                  .aggregate([
                    {
                      $match: {
                        approved: true,
                        type: 'news',
                        titleSearch: { $regex: `^${KhongDau(searchString)}|${KhongDau(searchString)}`, $options: 'i' },
                      }
                    },
                    {
                      $lookup: {
                        "from": "cities",
                        "localField": "city",
                        "foreignField": "_id",
                        "as": "city"
                      }
                    },
                    {
                      $lookup: {
                        "from": "categories",
                        "localField": "category",
                        "foreignField": "_id",
                        "as": "category"
                      }
                    },
                    {$group: {_id: "$_id", "news": {$first: "$$ROOT"}}},
                    {
                      $project:
                        {
                          "news": "$news",
                          index: {$indexOfCP: [{$toLower: "$news.titleSearch"}, KhongDau(searchString)]},
                        }
                    },
                    {$unwind: '$news.city'},
                    {$unwind: '$news.category'},
                    {$sort: {"index": 1}},
                    {
                      $group: {
                        _id: null,
                        "news": { $push: "$news" },
                        count: { $sum: 1 },
                      }
                    },
                    {
                      $project:
                        {
                          news: { $slice: [ "$news", Number(max.value) * Number(searchPage), Number(max.value) ] },
                          count: "$count",
                        }
                    },
                  ])
                  .exec((err, result) => {
                    if (err) {
                      res.json({news: [], count: 0});
                    } else {
                      if (result.length > 0) {
                        const length = result[0].count / Number(max) + (result[0].count %  Number(max) === 0) ? 0 : 1;
                        res.json({news: result[0].news, count: (result[0].count !== 0) ? length : 0 });
                      } else {
                        res.json({news: [], count: 0});
                      }
                    }
                  });
              }
            }
          });
        }
      });
    }
  });
}
export function getNewsByCity(req, res) {
  const searchCity= req.params.city ? req.params.city: '';
  const searchPage = req.query.searchPage ? req.query.searchPage: 0;
  Setting.findOne({name: 'newsCount'}).exec((errSetting, max) => {
    if (errSetting) {
      res.json({news: [], count: 0});
    } else {
      let citys = [];
      City.find({}).exec((errCity, cities) => {
        if (errCity) {
          res.json({news: [], count: 0});
        } else {
        cities.map(c => citys.push(c._id));
        News
          .aggregate([
            {
              $match:
                {
                  approved: true,
                  type: 'news',
                  city: {$in: (searchCity === '') ? citys : [mongoose.Types.ObjectId(searchCity)]},
                }
            },
            {$sort: {"dateCreated": -1}},
            {
              $lookup: {
                "from": "categories",
                "localField": "category",
                "foreignField": "_id",
                "as": "category"
              }
            },
            {$unwind: '$category'},
            {
              $lookup: {
                "from": "cities",
                "localField": "city",
                "foreignField": "_id",
                "as": "city"
              }
            },
            {$unwind: '$city'},
            {$group: {"_id": "$_id", "news": {$first: "$$ROOT"}}},
            {$project: {"_id": "$form._id", "news": "$news",}},
            {$sort: {"index": 1, "score": -1}},
            {
              $group: {
                _id: null,
                "news": { $push: "$news" },
                count: { $sum: 1 },
              }
            },
            {
              $project:
                {
                  "news": { $slice: [ "$news", Number(max.value) * Number(searchPage), Number(max.value) ] },
                  count: "$count",
                }
            },
          ])
          .exec((err, result) => {
            if (err) {
              res.json({news: [], count: 0});
            } else {
              if (result.length > 0) {
                const length = result[0].count / max + (result[0].count % max === 0) ? 0 : 1;
                res.json({news: result[0].news, count: (result[0].count !== 0) ? length : 0 });
              } else {
                res.json({news: [], count: 0});
              }
            }
          });
        }
      })
    }
  });
}
export function getBlogs(req, res) {
  News
    .aggregate([
      {$match:
        {
          approved: true,
          type: 'blog',
        }
      },
      {$sort:{"dateCreated":-1}},
      {
        $lookup: {
          "from": "topics",
          "localField": "topic",
          "foreignField": "_id",
          "as": "topic"
        }
      },
      {$unwind: '$topic'},
      {$group:{"_id":"$topic", "news":{$first:"$$ROOT"}}},
      {$project:{"_id":"$form._id", "news":"$news", }},
    ])
    .exec((err, blogs) => {
      if (err) {
        res.json({blogs: []});
      } else {
        const arr = [];
        blogs.map((newss) => {
          arr.push(newss.news);
        });
        res.json({ blogs: arr });
      }
    });
}
export function getRelated(req, res) {
  Setting.findOne({name: 'relatedNewsCount'}).exec((err2, max) => {
    if (err2) {
      res.json({ news: [] });
    } else {
      News.findOne({ alias: req.params.alias }).exec((err, news) => {
        if (err) {
          res.json({ news: [] });
        } else {
          if (news) {
            News.find(
              {
                $or: [
                  { category: mongoose.Types.ObjectId(news.category) },
                  { topic: mongoose.Types.ObjectId(news.topic) },
                ],
                approved: true,
                type: news.type,
                _id: { $ne: mongoose.Types.ObjectId(news._id) }
              },
              {},
              {
                sort: {
                  vipAll: -1,
                  vipCategory: -1,
                  dateCreated: -1,
                },
              }
            )
              .populate('category', 'title alias')
              .populate('topic', 'title alias')
              .populate('city', 'name')
              .limit(Number(max.value))
              .exec((err2, news2) => {
                if (err2) {
                  res.json({ news: [] });
                } else {
                  res.json({ news: news2 });
                }
              });
          } else {
            res.json({ news: [] });
          }
        }
      });
    }
  });
}
export function getNewsByUserId(req, res) {
  News.find({ userId: req.params.id, type: 'news' }).exec((err, news) => {
    if (err) {
      res.json({ news: [] });
    } else {
      res.json({ news });
    }
  });
}
export function getBlogByUserId(req, res) {
  News.find({ userId: req.params.id, type: 'blog' }).exec((err, blogs) => {
    if (err) {
      res.json({ blogs: [] });
    } else {
      res.json({ blogs });
    }
  });
}
export function getBlogByAlias(req, res) {
  News.findOne({alias: { $regex: req.params.alias, $options: 'i' }, approved: true, type: 'blog'})
    .populate('category', 'title alias')
    .populate('topic', 'title alias')
    .populate('city', 'name')
    .exec((err, blog) => {
      if (err) {
        res.json({blog: 'error'});
      } else {
        if (blog) {
          res.json({blog});
        } else {
          res.json({blog: '404'});
        }
      }
    });
}
export function getBlogByTopic(req, res) {
  const page = (req.query.page && req.query.page !== '') ? req.query.page : 0;
  Topic.findOne({ alias: { $regex: req.params.topic, $options: 'i' }, disable: false }).exec((err, topic) => {
    if (err) {
      res.json({ blogs: [] });
    } else {
      if (topic) {
        News.find(
          { topic: mongoose.Types.ObjectId(topic._id), approved: true, vipAll: false, vipCategory: false, type: 'blog' },
          {},
          { skip: 10 * page, limit: 10, sort: { dateCreated: -1 } }
        )
          .populate('category', 'title alias')
          .populate('topic', 'title alias')
          .populate('city', 'name')
          .exec((err1, blogs) => {
            if (err1) {
              res.json({ blogs: [] });
            } else {
              res.json({ blogs });
            }
          });
      } else {
        res.json({ blogs: [] });
      }
    }
  });
}
