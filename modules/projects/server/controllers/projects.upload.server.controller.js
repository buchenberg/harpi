'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Update har
 */
// exports.uploadHar = function(req, res) {
//   var user = req.user,
//   projectId = req.project._id,
//   uploadDestination = './modules/projects/client/uploads/projects/'+projectId+'/har/';
  
//   var message = null;
//   var upload = multer({
//     dest: uploadDestination
//   }).single('file');

//   if (user) {

//     console.log(user.displayName + ' is uploading a file to the ' +req.project.title+ ' project.');
//     console.log("Uploading har to "+uploadDestination);

//     upload(req, res, function(err) {
//       if (err) {
//         console.log(err);
//         return res.status(400).send({
//           //STUB
//           message: 'error stub'
//         });
//       } else {
//         //STUB
//          console.log('Do some magic.');
//          return res.status(200).send({
//           message: 'success stub'
//         });
//       }
//     });
//   } else {
//     res.status(400).send({
//       message: 'Unauthorized.'
//     });
//   }
// };