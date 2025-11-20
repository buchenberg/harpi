'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
patcher = require('mongoose-json-patch'),
  Schema = mongoose.Schema;

/**
 * Har Schema
 */
var HarSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Har name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  log: {},
  puml: {
    type: String
  },
  specs: [{
    type: Schema.ObjectId,
    ref: 'Spec'
  }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

HarSchema.plugin(patcher);

mongoose.model('Har', HarSchema);