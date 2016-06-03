/*'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

 var HarSchema = new Schema({
  logType: {
    id: "logType",
    description: "HTTP Archive structure.",
    type: "object",
    properties: {
      log: {
        type: "object",
        properties: {
          version: {
            type: String,
            required: true
          },
          creator: {
            $ref: "creatorType",
            required: true
          },
          browser: {
            $ref: "browserType",
            required: true
          },
          pages: {
            type: "array",
            items: {
              $ref: "pageType"
            }
          },
          entries: {
            type: "array",
            items: {
              $ref: "entryType"
            },
            required: true
          },
          comment: {
            type: String
          }
        }
      }
    }
  },
  creatorType: {
    id: "creatorType",
    description: "Name and version info of the log creator app.",
    type: "object",
    properties: {
      name: {
        type: String,
        required: true
      },
      version: {
        type: String,
        required: true
      },
      comment: {
        type: String
      }
    }
  },
  browserType: {
    id: "browserType",
    description: "Name and version info of used browser.",
    type: "object",
    optional: true,
    properties: {
      name: {
        type: String,
        required: true
      },
      version: {
        type: String,
        required: true
      },
      comment: {
        type: String
      }
    }
  },
    pageType: {
        id: "pageType",
        description: "Exported web page",
        type: "object",
        optional: true,
        properties: {
            startedDateTime: {
                type: String,
                format: "date-time",
                pattern: "^(\d{4})(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))",
                required: true
            },
            id: {
                type: String,
                unique: true,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            pageTimings: {
                $ref: "pageTimingsType",
                required: true
            },
            comment: {
                type: String
            }
        }
    },
    pageTimingsType: {
       id: 'pageTimingsType',
       description: 'foo',
       type: "object",
       properties: {
        onContentLoad: {
          type: "number",
          min: -1
        },
        onLoad: {
          type: "number",
          min: -1
        },
        comment: {
          type: String
        }
      }
    },
    entryType: {
      id: "entryType",
      description: "Request and Response related info",
      type: "object",
      optional: true,
      properties: {
        pageref: {
          type: String
        },
        startedDateTime: {
          type: String,
          format: "date-time",
          pattern: "^(\d{4})(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))",
          required: true
        },
        time: {
          type: "integer",
          min: 0,
          required: true
        },
        request: {
          $ref: "requestType",
          required: true
        },
        response: {
          $ref: "responseType",
          required: true
        },
        cache: {
          $ref: "cacheType",
          required: true
        },
        timings: {
          $ref: "timingsType",
          required: true
        },
        serverIPAddress: {
          type: String
        },
        connection: {
          type: String
        },
        comment: {
          type: String
        }
      }
    },
    requestType: {
      id: "requestType",
      description: "Monitored request",
      type: "object",
      properties: {
        method: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        },
        httpVersion: {
          type: String,
          required: true
        },
        cookies: {
          type: "array",
          items: {
            $ref: "cookieType"
          },
          required: true
        },
        headers: {
          type: "array",
          items: {
            $ref: "recordType"
          },
          required: true
        },
        queryString: {
          type: "array",
          items: {
            $ref: "recordType"
          },
          required: true
        },
        postData: {
          $ref: "postDataType"
        },
        headersSize: {
          type: "integer",
          required: true
        },
        bodySize: {
          type: "integer",
          required: true
        },
        comment: {
          type: String
        }
      }
    },
    recordType: {
      id: "recordType",
      description: "Helper name-value pair structure.",
      type: "object",
      properties: {
        name: {
          type: String,
          required: true
        },
        value: {
          type: String,
          required: true
        },
        comment: {
          type: String
        }
      }
    },
    responseType: {
      id: "responseType",
      description: "Monitored Response.",
      type: "object",
      properties: {
        status: {
          type: "integer",
          required: true
        },
        statusText: {
          type: String,
          required: true
        },
        httpVersion: {
          type: String,
          required: true
        },
        cookies: {
          type: "array",
          items: {
            $ref: "cookieType"
          },
          required: true
        },
        headers: {
          type: "array",
          items: {
            $ref: "recordType"
          },
          required: true
        },
        content: {
          $ref: "contentType",
          required: true
        },
        redirectURL: {
          type: String,
          required: true
        },
        headersSize: {
          type: "integer",
          required: true
        },
        bodySize: {
          type: "integer",
          required: true
        },
        comment: {
          type: String
        }
      }
    },
    cookieType: {
      id: "cookieType",
      description: "Cookie description.",
      type: "object",
      properties: {
        name: {
          type: String,
          required: true
        },
        value: {
          type: String,
          required: true
        },
        path: {
          type: String
        },
        domain: {
          type: String
        },
        expires: {
          type: String
        },
        httpOnly: {
          type: "boolean"
        },
        secure: {
          type: "boolean"
        },
        comment: {
          type: String
        }
      }
    },
    postDataType: {
      id: "postDataType",
      description: "Posted data info.",
      type: "object",
      optional: true,
      properties: {
        mimeType: {
          type: String,
          required: true
        },
        text: {
          type: String
        },
        params: {
          type: "array",
          properties: {
            name: {
              type: String,
              required: true
            },
            value: {
              type: String
            },
            fileName: {
              type: String
            },
            contentType: {
              type: String
            },
            comment: {
              type: String
            }
          }
        },
        comment: {
          type: String
        }
      }
    },
    contentType: {
      id: "contentType",
      description: "Response content",
      type: "object",
      properties: {
        size: {
          type: "integer",
          required: true
        },
        compression: {
          type: "integer"
        },
        mimeType: {
          type: String,
          required: true
        },
        text: {
          type: String
        },
        encoding: {
          type: String
        },
        comment: {
          type: String
        }
      }
    },
    cacheType: {
      id: "cacheType",
      description: "Info about a response coming from the cache.",
      type: "object",
      properties: {
        beforeRequest: {
          $ref: "cacheEntryType"
        },
        afterRequest: {
          $ref: "cacheEntryType"
        },
        comment: {
          type: String
        }
      }
    },
    cacheEntryType: {
      id: "cacheEntryType",
      optional: true,
      description: "Info about cache entry.",
      type: "object",
      properties: {
        expires: {
          type: String
        },
        lastAccess: {
          type: String,
          required: true
        },
        eTag: {
          type: String,
          required: true
        },
        hitCount: {
          type: "integer",
          required: true
        },
        comment: {
          type: String
        }
      }
    },
    timingsType: {
      id: "timingsType",
      description: "Info about request-response timing.",
      type: "object",
      properties: {
        dns: {
          type: "integer",
          min: -1,
          required: true
        },
        connect: {
          type: "integer",
          min: -1,
          required: true
        },
        blocked: {
          type: "integer",
          min: -1,
          required: true
        },
        send: {
          type: "integer",
          min: -1,
          required: true
        },
        wait: {
          type: "integer",
          min: -1,
          required: true
        },
        receive: {
          type: "integer",
          min: -1,
          required: true
        },
        ssl: {
          type: "integer",
          min: -1
        },
        comment: {
          type: String
        }
      }
    }
  });

mongoose.model('Har', HarSchema);