'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Har = mongoose.model('Har'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, har;

/**
 * Har routes tests
 */
describe('Har CRUD tests', function () {

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

    // Save a user to the test db and create new Har
    user.save(function () {
      har = {
        name: 'Har name'
      };

      done();
    });
  });

  it('should be able to save a Har if logged in', function (done) {
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

        // Save a new Har
        agent.post('/api/hars')
          .send(har)
          .expect(200)
          .end(function (harSaveErr, harSaveRes) {
            // Handle Har save error
            if (harSaveErr) {
              return done(harSaveErr);
            }

            // Get a list of Hars
            agent.get('/api/hars')
              .end(function (harsGetErr, harsGetRes) {
                // Handle Har save error
                if (harsGetErr) {
                  return done(harsGetErr);
                }

                // Get Hars list
                var hars = harsGetRes.body;

                // Set assertions
                (hars[0].user._id).should.equal(userId);
                (hars[0].name).should.match('Har name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Har if not logged in', function (done) {
    agent.post('/api/hars')
      .send(har)
      .expect(403)
      .end(function (harSaveErr, harSaveRes) {
        // Call the assertion callback
        done(harSaveErr);
      });
  });

  it('should not be able to save an Har if no name is provided', function (done) {
    // Invalidate name field
    har.name = '';

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

        // Save a new Har
        agent.post('/api/hars')
          .send(har)
          .expect(400)
          .end(function (harSaveErr, harSaveRes) {
            // Set message assertion
            (harSaveRes.body.message).should.match('Please fill Har name');

            // Handle Har save error
            done(harSaveErr);
          });
      });
  });

  it('should be able to update an Har if signed in', function (done) {
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

        // Save a new Har
        agent.post('/api/hars')
          .send(har)
          .expect(200)
          .end(function (harSaveErr, harSaveRes) {
            // Handle Har save error
            if (harSaveErr) {
              return done(harSaveErr);
            }

            // Update Har name
            har.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Har
            agent.put('/api/hars/' + harSaveRes.body._id)
              .send(har)
              .expect(200)
              .end(function (harUpdateErr, harUpdateRes) {
                // Handle Har update error
                if (harUpdateErr) {
                  return done(harUpdateErr);
                }

                // Set assertions
                (harUpdateRes.body._id).should.equal(harSaveRes.body._id);
                (harUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Hars if not signed in', function (done) {
    // Create new Har model instance
    var harObj = new Har(har);

    // Save the har
    harObj.save(function () {
      // Request Hars
      request(app).get('/api/hars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Har if not signed in', function (done) {
    // Create new Har model instance
    var harObj = new Har(har);

    // Save the Har
    harObj.save(function () {
      request(app).get('/api/hars/' + harObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', har.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Har with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Har is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Har which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Har
    request(app).get('/api/hars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Har with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Har if signed in', function (done) {
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

        // Save a new Har
        agent.post('/api/hars')
          .send(har)
          .expect(200)
          .end(function (harSaveErr, harSaveRes) {
            // Handle Har save error
            if (harSaveErr) {
              return done(harSaveErr);
            }

            // Delete an existing Har
            agent.delete('/api/hars/' + harSaveRes.body._id)
              .send(har)
              .expect(200)
              .end(function (harDeleteErr, harDeleteRes) {
                // Handle har error error
                if (harDeleteErr) {
                  return done(harDeleteErr);
                }

                // Set assertions
                (harDeleteRes.body._id).should.equal(harSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Har if not signed in', function (done) {
    // Set Har user
    har.user = user;

    // Create new Har model instance
    var harObj = new Har(har);

    // Save the Har
    harObj.save(function () {
      // Try deleting Har
      request(app).delete('/api/hars/' + harObj._id)
        .expect(403)
        .end(function (harDeleteErr, harDeleteRes) {
          // Set message assertion
          (harDeleteRes.body.message).should.match('User is not authorized');

          // Handle Har error error
          done(harDeleteErr);
        });

    });
  });

  it('should be able to get a single Har that has an orphaned user reference', function (done) {
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

          // Save a new Har
          agent.post('/api/hars')
            .send(har)
            .expect(200)
            .end(function (harSaveErr, harSaveRes) {
              // Handle Har save error
              if (harSaveErr) {
                return done(harSaveErr);
              }

              // Set assertions on new Har
              (harSaveRes.body.name).should.equal(har.name);
              should.exist(harSaveRes.body.user);
              should.equal(harSaveRes.body.user._id, orphanId);

              // force the Har to have an orphaned user reference
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

                    // Get the Har
                    agent.get('/api/hars/' + harSaveRes.body._id)
                      .expect(200)
                      .end(function (harInfoErr, harInfoRes) {
                        // Handle Har error
                        if (harInfoErr) {
                          return done(harInfoErr);
                        }

                        // Set assertions
                        (harInfoRes.body._id).should.equal(harSaveRes.body._id);
                        (harInfoRes.body.name).should.equal(har.name);
                        should.equal(harInfoRes.body.user, undefined);

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
      Har.remove().exec(done);
    });
  });
});
