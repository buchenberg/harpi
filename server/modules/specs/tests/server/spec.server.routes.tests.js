'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Spec = mongoose.model('Spec'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, spec;

/**
 * Spec routes tests
 */
describe('Spec CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Spec
    user.save(function () {
      spec = {
        name: 'Spec name'
      };

      done();
    });
  });

  it('should be able to save a Spec if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Spec
        agent.post('/api/specs')
          .send(spec)
          .expect(200)
          .end(function (specSaveErr, specSaveRes) {
            // Handle Spec save error
            if (specSaveErr) {
              return done(specSaveErr);
            }

            // Get a list of Specs
            agent.get('/api/specs')
              .end(function (specsGetErr, specsGetRes) {
                // Handle Spec save error
                if (specsGetErr) {
                  return done(specsGetErr);
                }

                // Get Specs list
                var specs = specsGetRes.body;

                // Set assertions
                (specs[0].user._id).should.equal(userId);
                (specs[0].name).should.match('Spec name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Spec if not logged in', function (done) {
    agent.post('/api/specs')
      .send(spec)
      .expect(403)
      .end(function (specSaveErr, specSaveRes) {
        // Call the assertion callback
        done(specSaveErr);
      });
  });

  it('should not be able to save an Spec if no name is provided', function (done) {
    // Invalidate name field
    spec.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Spec
        agent.post('/api/specs')
          .send(spec)
          .expect(400)
          .end(function (specSaveErr, specSaveRes) {
            // Set message assertion
            (specSaveRes.body.message).should.match('Please fill Spec name');

            // Handle Spec save error
            done(specSaveErr);
          });
      });
  });

  it('should be able to update an Spec if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Spec
        agent.post('/api/specs')
          .send(spec)
          .expect(200)
          .end(function (specSaveErr, specSaveRes) {
            // Handle Spec save error
            if (specSaveErr) {
              return done(specSaveErr);
            }

            // Update Spec name
            spec.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Spec
            agent.put('/api/specs/' + specSaveRes.body._id)
              .send(spec)
              .expect(200)
              .end(function (specUpdateErr, specUpdateRes) {
                // Handle Spec update error
                if (specUpdateErr) {
                  return done(specUpdateErr);
                }

                // Set assertions
                (specUpdateRes.body._id).should.equal(specSaveRes.body._id);
                (specUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Specs if not signed in', function (done) {
    // Create new Spec model instance
    var specObj = new Spec(spec);

    // Save the spec
    specObj.save(function () {
      // Request Specs
      request(app).get('/api/specs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Spec if not signed in', function (done) {
    // Create new Spec model instance
    var specObj = new Spec(spec);

    // Save the Spec
    specObj.save(function () {
      request(app).get('/api/specs/' + specObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', spec.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Spec with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/specs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Spec is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Spec which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Spec
    request(app).get('/api/specs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Spec with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Spec if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Spec
        agent.post('/api/specs')
          .send(spec)
          .expect(200)
          .end(function (specSaveErr, specSaveRes) {
            // Handle Spec save error
            if (specSaveErr) {
              return done(specSaveErr);
            }

            // Delete an existing Spec
            agent.delete('/api/specs/' + specSaveRes.body._id)
              .send(spec)
              .expect(200)
              .end(function (specDeleteErr, specDeleteRes) {
                // Handle spec error error
                if (specDeleteErr) {
                  return done(specDeleteErr);
                }

                // Set assertions
                (specDeleteRes.body._id).should.equal(specSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Spec if not signed in', function (done) {
    // Set Spec user
    spec.user = user;

    // Create new Spec model instance
    var specObj = new Spec(spec);

    // Save the Spec
    specObj.save(function () {
      // Try deleting Spec
      request(app).delete('/api/specs/' + specObj._id)
        .expect(403)
        .end(function (specDeleteErr, specDeleteRes) {
          // Set message assertion
          (specDeleteRes.body.message).should.match('User is not authorized');

          // Handle Spec error error
          done(specDeleteErr);
        });

    });
  });

  it('should be able to get a single Spec that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Spec
          agent.post('/api/specs')
            .send(spec)
            .expect(200)
            .end(function (specSaveErr, specSaveRes) {
              // Handle Spec save error
              if (specSaveErr) {
                return done(specSaveErr);
              }

              // Set assertions on new Spec
              (specSaveRes.body.name).should.equal(spec.name);
              should.exist(specSaveRes.body.user);
              should.equal(specSaveRes.body.user._id, orphanId);

              // force the Spec to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Spec
                    agent.get('/api/specs/' + specSaveRes.body._id)
                      .expect(200)
                      .end(function (specInfoErr, specInfoRes) {
                        // Handle Spec error
                        if (specInfoErr) {
                          return done(specInfoErr);
                        }

                        // Set assertions
                        (specInfoRes.body._id).should.equal(specSaveRes.body._id);
                        (specInfoRes.body.name).should.equal(spec.name);
                        should.equal(specInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Spec.remove().exec(done);
    });
  });
});
