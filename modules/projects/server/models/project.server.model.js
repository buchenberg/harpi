/*'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */

var ProjectSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  hars: [ {
    type: Schema.ObjectId,
    ref: 'Har'
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


mongoose.model('Project', ProjectSchema);