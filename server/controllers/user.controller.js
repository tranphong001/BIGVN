import User from '../models/user';
import sanitizeHtml from 'sanitize-html';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cuid from 'cuid';
import svgCaptcha from 'svg-captcha';
function generateToken(user) {
  const u = {
    userName: user.userName,
    _id: user.id,
  };
  return jwt.sign(u, 'bigvndev', {
    expiresIn: '1h'
  });
}

export function createUser(req, res) {
  const reqUser = req.body.user;
  if (reqUser &&
    reqUser.hasOwnProperty('password') &&
    reqUser.hasOwnProperty('fullName') &&
    reqUser.hasOwnProperty('userName')) {
    bcrypt.genSalt(10).then((salts) => {
      bcrypt.hash(reqUser.password, salts).then((passwords) => {
        const newUser = new User({
          password: passwords,
          userName: sanitizeHtml(reqUser.userName),
          fullName: sanitizeHtml(reqUser.fullName),
          salt: salts,
        });
        newUser.save((err, user) => {
          if (err) {
            res.json({ user: 'error' });
          } else {
            const token = generateToken(user);
            const response = {
              id: user._id,
              userName: user.userName,
              fullName: user.fullName,
              blogger: false,
              newser: true,
              token,
            };
            res.json({ user: response });
          }
        });
      });
    });
  } else {
    res.json({ user: 'missing' });
  }
}

export function facebookSocial(req, res) {
  const facebook = req.body.user;
  if (facebook &&
    facebook.hasOwnProperty('facebookId') &&
    facebook.hasOwnProperty('email') &&
    facebook.hasOwnProperty('userName') &&
    facebook.hasOwnProperty('fullName')
  ) {
    User.findOne({ userName: facebook.email }).exec((err, user) => {
      if (err) {
        res.json({ user: 'error' });
      } else {
        if (user) {
          User.updateOne({ userName: facebook.email }, { facebookId: facebook.facebookId }).exec((err2) => {
            if (err2) {
              res.json({ user: 'error' });
            } else {
              const token = generateToken(user);
              const response = {
                id: user._id,
                userName: user.userName,
                fullName: user.fullName,
                blogger: user.blogger,
                newser: user.newser,
                facebookId: facebook.facebookId,
                token,
              };
              res.json({ user: response });
            }
          });
        } else {
          const ranStr = cuid();
          bcrypt.genSalt(10).then((salts) => {
            bcrypt.hash(ranStr, salts).then((passwords) => {
              const newUser = new User({
                password: passwords,
                userName: sanitizeHtml(facebook.email),
                fullName: sanitizeHtml(facebook.fullName),
                facebookId: facebook.facebookId,
                salt: salts,
              });
              newUser.save((err3, users) => {
                if (err3) {
                  res.json({ user: 'error' });
                } else {
                  const token = generateToken(users);
                  const response = {
                    id: users._id,
                    userName: users.userName,
                    fullName: users.fullName,
                    blogger: false,
                    newser: true,
                    token
                  };
                  res.json({ user: response });
                }
              });
            });
          });
        }
      }
    });
  } else {
    res.json({ user: 'missing' });
  }
}
export function getCaptcha(req, res) {
  const result = svgCaptcha.create();
  res.json({ captcha: result });
}
export function googleSocial(req, res) {
  const google = req.body.user;
  if (google &&
    google.hasOwnProperty('googleId') &&
    google.hasOwnProperty('email') &&
    google.hasOwnProperty('userName') &&
    google.hasOwnProperty('fullName')
  ) {
    User.findOne({ userName: google.email }).exec((err, user) => {
      if (err) {
        res.json({ user: 'error' });
      } else {
        if (user) {
          User.updateOne({ userName: google.email }, { googleId: google.googleId }).exec((err2) => {
            if (err2) {
              res.json({ user: 'error' });
            } else {
              const token = generateToken(user);
              const response = {
                id: user._id,
                userName: user.userName,
                fullName: user.fullName,
                blogger: user.blogger,
                newser: user.newser,
                token,
              };
              res.json({ user: response });
            }
          });
        } else {
          const ranStr = cuid();
          bcrypt.genSalt(10).then((salts) => {
            bcrypt.hash(ranStr, salts).then((passwords) => {
              const newUser = new User({
                password: passwords,
                userName: sanitizeHtml(google.email),
                fullName: sanitizeHtml(google.fullName),
                googleId: google.googleId,
                salt: salts,
              });
              newUser.save((err1, users) => {
                if (err1) {
                  res.json({ user: 'error' });
                } else {
                  const token = generateToken(users);
                  const response = {
                    id: users._id,
                    userName: users.userName,
                    fullName: users.fullName,
                    blogger: false,
                    newser: true,
                    token,
                  };
                  res.json({ user: response });
                }
              });
            });
          });
        }
      }
    });
  } else {
    res.json({ user: 'missing' });
  }
}

export function loginUser(req, res) {
  const reqUser = req.body.user;
  if (reqUser &&
    reqUser.hasOwnProperty('userName') &&
    reqUser.hasOwnProperty('password')) {
    User.findOne({ userName: reqUser.userName }).exec((err, user) => {
      if (err) {
        res.json({ user: 'unknown' });
      } else {
        if (user !== null) {
          bcrypt.compare(reqUser.password, user.password, (err2, result) => {
            if (err2) {
              res.json({ user: 'unknown' });
            } else {
              if (result) {
                const token = generateToken(user);
                const response = {
                  id: user._id,
                  userName: user.userName,
                  fullName: user.fullName,
                  newser: user.newser,
                  blogger: user.blogger,
                  token,
                };
                res.json({ user: response });
              } else {
                res.json({ user: 'unknown' });
              }
            }
          });
        } else {
          res.json({ user: 'unknown' });
        }
      }
    });
  } else {
    res.json({ user: 'missing' });
  }
}
export function reloginUser(req, res) {
  const user = req.body.user;
  if (user && user.hasOwnProperty('token')) {
    jwt.verify(user.token, 'bigvndev', (err1, token) => {
      if (err1) {
        res.json({ user: 'none' });
      } else {
        User.findOne({ _id: token._id })
          .exec((err, user) => {
            if (err) {
              res.json({ user: err });
            } else {
              if (user) {
                console.log(user);
                const token = generateToken(user);
                const response = {
                  id: user._id,
                  userName: user.userName,
                  fullName: user.fullName,
                  newser: user.newser,
                  blogger: user.blogger,
                  token,
                };
                res.json({ user: response });
              } else {
                res.json({ user: 'none' });
              }
            }
          });
      }
    });
  } else {
    res.json({ user: 'none' });
  }
}
