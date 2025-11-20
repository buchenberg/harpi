'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Hars Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/hars',
            permissions: '*'
        }, {
                resources: '/api/hars/:harId',
                permissions: '*'
            }]
    }, {
            roles: ['user'],
            allows: [{
                resources: '/api/hars',
                permissions: ['get', 'post']
            }, {
                    resources: '/api/hars/:harId',
                    permissions: ['get', 'patch']
                }, {
                    resources: '/api/hars/:harId/puml',
                    permissions: ['get', 'post']
                }, {
                    resources: '/api/hars/:harId/specs',
                    permissions: ['post']
                }]
        },         {
            roles: ['guest'],
            allows: [{
                resources: '/api/hars',
                permissions: ['get', 'post']
            }, {
                    resources: '/api/hars/:harId',
                    permissions: ['get', 'delete']
                }, {
                    resources: '/api/hars/:harId/puml',
                    permissions: ['get']
                }, {
                    resources: '/api/hars/:harId/specs',
                    permissions: ['get', 'post']
                }]
        }]);
};

/**
 * Check If Hars Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Har is being processed and the current user created it then allow any manipulation
    if (req.har && req.user && req.har.user && req.har.user.id === req.user.id) {
        return next();
    }

    // Get the route path - use req.route.path if available, otherwise use req.path
    var resource = req.route && req.route.path ? req.route.path : req.path;
    
    // Normalize the resource path to match ACL definitions
    // Remove query strings
    resource = resource.split('?')[0];
    
    // In development, log the ACL check for debugging
    if (process.env.NODE_ENV === 'development') {
        console.log('[ACL] Checking access:', {
            resource: resource,
            method: req.method.toLowerCase(),
            roles: roles,
            routePath: req.route ? req.route.path : 'undefined',
            reqPath: req.path
        });
    }
    
    // Check for user roles
    acl.areAnyRolesAllowed(roles, resource, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // Log the error for debugging
            console.error('[ACL] Authorization error:', err);
            console.error('[ACL] Details:', {
                resource: resource,
                method: req.method.toLowerCase(),
                roles: roles,
                routePath: req.route ? req.route.path : 'undefined',
                reqPath: req.path
            });
            // An authorization error occurred
            return res.status(500).json({
                message: 'Unexpected authorization error',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        } else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                if (process.env.NODE_ENV === 'development') {
                    console.log('[ACL] Access granted for', resource);
                }
                return next();
            } else {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[ACL] Access denied for', resource, 'with roles', roles);
                }
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};