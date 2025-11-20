# HAR to Mermaid - Project Plan

## Overview
Create a new standalone library `har-to-mermaid` that converts HAR (HTTP Archive) files into Mermaid sequence diagrams. This will follow the same architectural pattern as `har-to-swagger`.

## Architecture Decision

### ✅ Separate Project Benefits
1. **Separation of Concerns**: Each library has a single, focused responsibility
2. **Reusability**: Can be used in other projects beyond harpi
3. **Maintainability**: Easier to test, version, and maintain independently
4. **Consistency**: Matches the existing `har-to-swagger` pattern
5. **Clean Integration**: Keeps the harpi controller code clean and focused

### Project Structure
```
har-to-mermaid/
├── index.js                 # Main entry point
├── lib/
│   └── har-to-mermaid.js    # Core conversion logic
├── test/
│   └── test.js              # Unit tests
├── package.json
├── README.md
└── LICENSE
```

## Current Implementation Analysis

### Existing Code Location
- **File**: `server/modules/hars/server/controllers/hars.server.controller.js`
- **Function**: `mermaidify(log, callback)` (lines 297-400)
- **Size**: ~100 lines of code
- **Type**: Synchronous callback-based

### Current Functionality
1. Generates Mermaid sequence diagrams
2. Extracts participants (services) from HAR entries
3. Creates request/response sequences
4. Handles query params, path params
5. Includes status codes and error messages
6. Adds notes for URL paths

## Proposed API Design

### Option 1: Synchronous (Current Pattern)
```javascript
var h2m = require('har-to-mermaid');

// Simple synchronous call
var mermaidText = h2m.generate(harLog);

// With callback (for consistency with har-to-swagger)
h2m.generate(harLog, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result.mermaid);
  }
});
```

### Option 2: Async/Promise (Modern Pattern)
```javascript
var h2m = require('har-to-mermaid');

// Promise-based
h2m.generateAsync(harLog)
  .then(result => console.log(result.mermaid))
  .catch(err => console.error(err));

// Or with async/await
const result = await h2m.generateAsync(harLog);
```

### Option 3: Both (Recommended)
Support both synchronous and async patterns for flexibility:
```javascript
// Synchronous (fast, simple)
var mermaidText = h2m.generate(harLog);

// Async (for consistency with har-to-swagger)
h2m.generateAsync(harLog, function(err, result) {
  // callback
});

// Or Promise
const result = await h2m.generateAsync(harLog);
```

## Implementation Plan

### Phase 1: Project Setup
1. Create `har-to-mermaid` directory structure
2. Initialize `package.json` with minimal dependencies
3. Set up basic project files (README, LICENSE)
4. Create initial `index.js` and `lib/har-to-mermaid.js`

### Phase 2: Core Functionality
1. Extract `mermaidify` function from harpi controller
2. Refactor into clean, testable functions
3. Add error handling
4. Support both sync and async APIs
5. Add input validation

### Phase 3: Enhancements
1. **Configuration Options**:
   - Custom participant names
   - Diagram theme/styling
   - Filter options (by method, status, etc.)
   - Grouping options

2. **Additional Diagram Types** (Future):
   - Flowchart diagrams
   - Gantt charts (timing)
   - State diagrams

3. **Better Formatting**:
   - Smarter service name extraction
   - Better parameter display
   - Request/response body previews

### Phase 4: Testing & Documentation
1. Write unit tests
2. Add example HAR files for testing
3. Document API and options
4. Create usage examples

### Phase 5: Integration
1. Update harpi to use `har-to-mermaid` library
2. Replace inline `mermaidify` function
3. Update dependencies
4. Test integration

## Dependencies

### Minimal Dependencies
- **url** (Node.js built-in) - Already used for URL parsing
- Potentially **lodash** or native JS for utilities (if needed)

### No Heavy Dependencies Needed
Unlike `har-to-swagger` which needs schema generation, Mermaid is just text generation, so dependencies should be minimal.

## Integration with harpi

### Current Usage
```javascript
// In hars.server.controller.js
mermaidify(log, function (text) {
  mermaidText = text;
});
```

### After Integration
```javascript
// In hars.server.controller.js
var h2m = require('har-to-mermaid');

// Option 1: Synchronous
var mermaidText = h2m.generate(log);

// Option 2: Async (if we go that route)
const result = await h2m.generateAsync(JSON.stringify({ log: log }));
var mermaidText = result.mermaid;
```

### Package.json Update
```json
{
  "dependencies": {
    "har-to-mermaid": "file:../../har-to-mermaid"
  }
}
```

## File Structure Details

### `index.js`
```javascript
var HarToMermaid = require('./lib/har-to-mermaid.js');
module.exports = HarToMermaid;
```

### `lib/har-to-mermaid.js`
```javascript
function HarToMermaid() {}

HarToMermaid.generate = function(harLog) {
  // Synchronous implementation
};

HarToMermaid.generateAsync = function(harLog, callback) {
  // Async implementation with callback
  // Could also return Promise
};

module.exports = HarToMermaid;
```

## Testing Strategy

### Test Cases
1. Empty HAR file
2. Single request/response
3. Multiple services
4. Different HTTP methods
5. Error responses (4xx, 5xx)
6. Query parameters
7. Path parameters
8. Custom service names (x-service-name)

### Test Files
- Create sample HAR files in `test/fixtures/`
- Unit tests in `test/test.js`

## Future Enhancements

### Diagram Types
1. **Sequence Diagram** (current) - Request/response flow
2. **Flowchart** - Service dependencies
3. **Gantt Chart** - Timing visualization
4. **State Diagram** - State transitions

### Features
1. Filtering by HTTP method, status code, service
2. Grouping by service or endpoint
3. Custom styling/themes
4. Export options (SVG, PNG via Mermaid CLI)
5. Interactive diagrams

## Migration Path

### Step 1: Create Library
- Set up `har-to-mermaid` project
- Extract and refactor code

### Step 2: Test Library
- Write tests
- Verify output matches current implementation

### Step 3: Integrate
- Add dependency to harpi
- Update controller to use library
- Remove inline `mermaidify` function

### Step 4: Cleanup
- Remove old code
- Update documentation

## Questions to Consider

1. **API Style**: Sync, async, or both?
   - Recommendation: Both for flexibility

2. **Input Format**: HAR log object or full HAR file?
   - Current: Just `log` object
   - Recommendation: Support both

3. **Output Format**: Just Mermaid text or structured object?
   - Current: Just text
   - Recommendation: Start with text, add structured output later if needed

4. **Configuration**: How configurable should it be?
   - Start simple, add options as needed

5. **Diagram Types**: Just sequence or multiple types?
   - Start with sequence, add others incrementally

## Next Steps

1. ✅ Review and approve plan
2. Create `har-to-mermaid` project structure
3. Extract and refactor `mermaidify` function
4. Add tests
5. Integrate into harpi
6. Remove old code

