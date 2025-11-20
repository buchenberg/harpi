'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Diagram Schema
 */
var DiagramSchema = new Schema({
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
  mermaid: {
    type: String,
    default: '',
    required: 'Mermaid diagram text is required'
  },
  har: {
    type: Schema.ObjectId,
    ref: 'Har'
  },
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
}, { strict: false });

mongoose.model('Diagram', DiagramSchema);

