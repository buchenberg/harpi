'use strict';

module.exports.profileUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

module.exports.harUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'application/json') {
    return cb(new Error('Only JSON files are allowed!'), false);
  }
  cb(null, true);
};
