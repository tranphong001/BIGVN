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
              reject('error');
            } else {
              fs.unlink(`public/${srcImageName}.${ext}`, (err) => {});
              resolve(`${imageName}.${ext}`);
            }
          });
        });
      }
    });
  });
}
function addKeyword(newKeyword) {
  return new Promise((resolve, reject) => {
    const keywordTemp = KhongDau(newKeyword.name).toString().toLowerCase()
      .replace(/[^0-9a-z]/gi, ' ').trim()
      .replace(/ {1,}/g, ' ').replace(/ /g, '-');
    Keyword.findOneAndUpdate(
      { alias: keywordTemp },
      { alias: keywordTemp, title: newKeyword.name },
      { upsert: true, new: true, setDefaultsOnInsert: true },
      (error, result) => {
        if (!error) {
          resolve(result._id);
        } else {
          reject('error');
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
function titleCase(str) {
  let splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
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
            const promises2 = [];
            const keywordArr = [];
            reqNews.imagesBase64.map((base64) => {
              promises.push(writeImage(base64));
            });
            Promise.all(promises).then((imageDirectories) => {
              if (reqNews.hasOwnProperty('keywords')) {
                reqNews.keywords.map((k) => {
                  promises2.push(addKeyword(k));
                });
              }
              Promise.all(promises2).then((keywords) => {
                const alias = KhongDau(reqNews.title).toString().toLowerCase().replace(/[^0-9a-z]/gi, ' ').trim().replace(/ {1,}/g, ' ').replace(/ /g, '-');
                const titleSearch = KhongDau(reqNews.title.trim()).toString().toLowerCase();
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
                  keywords,
                  price: reqNews.price,
                  content: reqNews.content,
                  summary: reqNews.summary,
                  ending: reqNews.ending,
                  contact: reqNews.contact,
                  imageDirectories: imageDirectories,
                  thumbnail: reqNews.thumbnail,
                });
                news.alias = (reqNews.type === 'news') ? `${alias}-${news._id}` : alias;
                news.save((err5) => {
                  if (err5) {
                    res.json({ news: 'error' });
                  } else {
                    res.json({ news: 'success' });
                  }
                });
              });
            }, (err) => {
              res.json({ news: 'error' });
            });
          } else {
            res.json({ news: 'error' });
          }
        }
      });
    }
  } else {
    res.json({ news: 'missing' });
  }
}
export function getAlias(req, res) {
  res.json({});
}

export function getNewsVipCategory(req, res) {
  Setting.findOne({ name: 'vipNewsCount' }).exec((err2, count) => {
    if (err2) {
      res.json({ news: [] });
    } else {
      Category.findOne({alias: req.params.alias}).exec((err, category) => {
        if (err) {
          res.json({ news: [] });
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
                res.json({ news: [] });
              } else {
                res.json({ news });
              }
            });
          } else {
            News.findOne({ alias: req.params.alias, approved: true}).exec((err2, news) => {
              if (err2) {
                res.json({ news: [] });
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
export function getNewsByType(req, res) {

}
export function getTag(req, res) {
  const page = req.query.page ? req.query.page : 0;
  Setting.findOne({ name: 'newsCount' }).exec((errSetting, max) => {
    if (errSetting) {
      res.json({mode: 'list', type: '', news: [], maxPage: 1});
    } else {
      Keyword.findOne({alias: req.params.alias}).exec((errKeyword, keyword) => {
        if (errKeyword) {
          res.json({mode: 'list', type: '', news: [], maxPage: 1});
        } else {
          if (keyword) {
            News.find(
              {keywords: mongoose.Types.ObjectId(keyword._id), approved: true, type: 'blog'},
              {},
              {skip: Number(max.value) * page, limit: Number(max.value), sort: {dateCreated: -1}}
            )
              .sort({dateCreated: -1})
              .populate('topic', 'title alias')
              .populate('city', 'name')
              .populate('keywords', 'title alias')
              .exec((err1, news) => {
                if (err1) {
                  res.json({mode: 'list', type: '', news: [], maxPage: 1});
                } else {
                  News.find(
                    {keywords: mongoose.Types.ObjectId(keyword._id), approved: true, type: 'blog'},
                    {},
                    {skip: Number(max.value) * page, limit: Number(max.value), sort: {dateCreated: -1}}
                  ).count().exec((errKeyword2, count) => {
                    if (errKeyword2) {
                      res.json({mode: 'list', type: '', news: [], maxPage: 1});
                    } else {
                      const temp1 = count / Number(max.value);
                      const temp2 = (count % Number(max.value) === 0) ? 1 : 0;
                      const length = Math.ceil(temp1 + temp2);
                      res.json({mode: 'list', type: 'blog', news, maxPage: (count !== 0) ? length : 0});
                    }
                  });
                }
              });
          } else {
            res.json({mode: 'list', type: '', news: [], maxPage: 1});
          }
        }
      });
    }
  });
}
// tim` theo topic cua blog
// tim` theo category
// tim` theo alias cua news
// return 404
export function getNewsOrBlog(req, res) {
  const page = req.query.page ? req.query.page : 0;
  const searchString = req.query.searchString ? req.query.searchString : '';
  const searchCategory = req.query.searchCategory ? req.query.searchCategory: '';
  const searchCity = req.query.searchCity ? req.query.searchCity: '';
  const searchPage = req.query.searchPage ? req.query.searchPage : 0;
  if (req.params.alias === 'undefined') {
    Setting.findOne({ name: 'newsCount' }).exec((errSetting, max) => {
      if (errSetting) {
        res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
      } else {
        const cates = [];
        const citys = [];
        Category.find({}).exec((errCate, categories) => {
          if (errCate) {
            res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
          } else {
            categories.map(cate => cates.push(cate._id));
            City.find({}).exec((errCity, cities) => {
              if (errCity) {
                res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
              } else {
                cities.map(c => citys.push(c._id));
                if (searchString === '') {
                  News
                    .aggregate([
                      {
                        $match: {
                          approved: true,
                          type: 'news',
                          category: { $in: (searchCategory === '') ? cates : [mongoose.Types.ObjectId(searchCategory)] },
                        },
                      },
                      { $sort: { dateCreated: -1 } },
                      {
                        $lookup: {
                          from: 'categories',
                          localField: 'category',
                          foreignField: '_id',
                          as: 'category',
                        },
                      },
                      { $unwind: '$category' },
                      {
                        $lookup: {
                          from: 'cities',
                          localField: 'city',
                          foreignField: '_id',
                          as: 'city',
                        },
                      },
                      { $unwind: '$city'},
                      { $group: { _id: '$category', news: { $first: '$$ROOT' } } },
                      { $project: { _id: '$form._id', news: '$news' }},
                      { $sort: { index: 1, score: -1 } },
                      {
                        $group: {
                          _id: null,
                          news: { $push: '$news' },
                          count: { $sum: 1 },
                        },
                      },
                      {
                        $project: {
                          news: { $slice: [ '$news', Number(max.value) * Number(searchPage), Number(max.value) ] },
                          count: '$count',
                        },
                      },
                    ])
                    .exec((errN, result) => {
                      if (errN) {
                        res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
                      } else {
                        if (result.length > 0) {
                          const length = result[0].count / Number(max.value) + (result[0].count % Number(max.value) === 0) ? 0 : 1;
                          res.json({ mode: 'list', type: '', news: result[0].news, maxPage: (result[0].count !== 0) ? length : 0 });
                        } else {
                          res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
                        }
                      }
                    });
                } else {
                  News
                    .aggregate([
                      {
                        $match: {
                          approved: true,
                          type: 'news',
                          titleSearch: { $regex: `^${KhongDau(searchString)}|${KhongDau(searchString)}`, $options: 'i' },
                        },
                      },
                      {
                        $lookup: {
                          from: 'cities',
                          localField: 'city',
                          foreignField: '_id',
                          as: 'city',
                        },
                      },
                      {
                        $lookup: {
                          from: 'categories',
                          localField: 'category',
                          foreignField: '_id',
                          as: 'category',
                        },
                      },
                      { $group: { _id: '$_id', news: { $first: '$$ROOT' } } },
                      {
                        $project: {
                          news: '$news',
                          index: { $indexOfCP: [{ $toLower: '$news.titleSearch' }, KhongDau(searchString)] },
                        },
                      },
                      { $unwind: '$news.city' },
                      { $unwind: '$news.category' },
                      { $sort: { index: 1 } },
                      {
                        $group: {
                          _id: null,
                          news: { $push: '$news' },
                          count: { $sum: 1 },
                        },
                      },
                      {
                        $project: {
                          news: { $slice: [ '$news', Number(max.value) * Number(searchPage), Number(max.value) ] },
                          count: '$count',
                        },
                      },
                    ])
                    .exec((err, result) => {
                      if (err) {
                        res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
                      } else {
                        if (result.length > 0) {
                          const length = result[0].count / Number(max.value) + (result[0].count % Number(max.value) === 0) ? 0 : 1;
                          res.json({ mode: 'list', type: '', news: result[0].news, maxPage: (result[0].count !== 0) ? length : 0 });
                        } else {
                          res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
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
    return;
  }

  if (req.params.alias === 'blogs') {
    News
      .aggregate([
        {
          $match: {
            approved: true,
            type: 'blog',
          }
        },
        { $sort: { dateCreated: -1 } },
        {
          $lookup: {
            from: 'topics',
            localField: 'topic',
            foreignField: '_id',
            as: 'topic',
          }
        },
        { $unwind: '$topic' },
        { $group: { _id: '$topic', news:{ $first: '$$ROOT' } }},
        { $project: { _id: '$form._id', news: '$news', } },
      ])
      .exec((err, news) => {
        if (err) {
          res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
        } else {
          const arr = [];
          news.map((n) => {
            arr.push(n.news);
          });
          res.json({ mode: 'list', type: '', news: arr, maxPage: 1 });
        }
      });
    return;
  }
  Setting.findOne({ name: 'newsCount' }).exec((errSetting, max) => {
    if (errSetting) {
      res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
    } else {
      Topic.findOne({ disable: false, alias: req.params.alias }).exec((errTopic, topic) => {
        if (errTopic) {
          res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
        } else {
          if (topic) {
            News.find(
              { topic: mongoose.Types.ObjectId(topic._id), approved: true, type: 'blog' },
              {},
              { skip: Number(max.value) * page, limit: Number(max.value), sort: { dateCreated: -1 } }
            )
              .populate('topic', 'title alias')
              .populate('city', 'name')
              .populate('keywords', 'title alias')
              .exec((err1, news) => {
                if (err1) {
                  res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
                } else {
                  News.find(
                    { topic: mongoose.Types.ObjectId(topic._id), approved: true, type: 'blog' },
                    {},
                    { skip: Number(max.value) * page, limit: Number(max.value), sort: { dateCreated: -1 } }
                  ).count().exec((errBlog2, count) => {
                    if (errBlog2) {
                      res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
                    } else {
                      const temp1 = count / Number(max.value);
                      const temp2 = (count % Number(max.value) === 0) ? 1 : 0;
                      const length = Math.ceil(temp1 + temp2);
                      res.json({ mode: 'list', type: 'blog', news, maxPage: (count !== 0) ? length : 0 });
                    }
                  });
                }
              });
          } else {
            Category.findOne({ alias: req.params.alias }).exec((errCategory, category) => {
              if (errCategory) {
                res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
              } else {
                if (category) {
                  News.find(
                    { category: mongoose.Types.ObjectId(category._id), approved: true, vipAll: false, vipCategory: false, type: 'news' },
                    {},
                    { skip: Number(max.value) * page, limit: Number(max.value), sort: { dateCreated: -1 } }
                  )
                    .sort({ dateCreated: -1 })
                    .populate('category', 'title alias')
                    .populate('city', 'name')
                    .exec((err1, news) => {
                      if (err1) {
                        res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
                      } else {
                        News.find(
                          { category: mongoose.Types.ObjectId(category._id), approved: true, vipAll: false, vipCategory: false, type: 'news' },
                          {},
                          { skip: Number(max.value) * page, limit: Number(max.value), sort: { dateCreated: -1 } }
                        ).count().exec((errCategory2, count) => {
                          if (errCategory2) {
                            res.json({ mode: 'list', type: '', news: [], maxPage: 1 });
                          } else {
                            const temp1 = count / Number(max.value);
                            const temp2 = (count % Number(max.value) === 0) ? 1 : 0;
                            const length = Math.ceil(temp1 + temp2);
                            res.json({ mode: 'list', type: 'news', news, maxPage: (count !== 0) ? length : 0 });
                          }
                        });
                      }
                    });
                } else {
                  News.findOne({ alias: { $regex: req.params.alias, $options: 'i' }, approved: true })
                    .populate('category', 'title alias')
                    .populate('topic', 'title alias')
                    .populate('keywords', 'title alias')
                    .populate('city', 'name')
                    .exec((err, news) => {
                      if (err) {
                        res.json({ news: 'error' });
                      } else {
                        if (news) {
                          if (news.type === 'blog') {
                            const kw1 = news.keywords[0];
                            const kw2 = news.keywords[1];
                            News.find({ approved: true, type: 'blog', keywords: kw1 })
                              .populate('topic', 'title alias')
                              .populate('keywords', 'title alias')
                              .populate('city', 'name')
                              .exec((errR1, related1) => {
                              if (errR1) {
                                res.json({ mode: 'detail', type: '', news, maxPage: 1 });
                              } else {
                                News.find({ approved: true, type: 'blog', keywords: kw2 })
                                  .populate('topic', 'title alias')
                                  .populate('keywords', 'title alias')
                                  .populate('city', 'name')
                                  .exec((errR2, related2) => {
                                  if (errR2) {
                                    res.json({ mode: 'detail', type: '', news, maxPage: 1 });
                                  } else {
                                    res.json({
                                      mode: 'detail',
                                      type: 'blog',
                                      news,
                                      maxPage: 1,
                                      related1,
                                      related2,
                                    });
                                  }
                                });
                              }
                            });
                          } else {
                            res.json({ mode: 'detail', type: '', news, maxPage: 1 });
                          }
                        } else {
                          res.json({ mode: 'detail', type: 'news', news: '404', maxPage: 1 });
                        }
                      }
                    });
                }
              }
            });
          }
        }
      });
    }
  });
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
