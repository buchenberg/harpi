'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Spec Schema
 */
var SpecSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Spec name',
    trim: true
  },
  spec: {},
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Spec', SpecSchema);
