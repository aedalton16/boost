var LineTool      = require('./LineTool'),
    RectangleTool = require('./RectangleTool'),
    PolygonTool   = require('./PolygonTool'),
    EraserTool    = require('./EraserTool'),
    GridTool      = require('./GridTool'),
    TriangleTool  = require('./TriangleTool'),
    CircleTool    = require('./CircleTool'),
    FreeDrawTool  = require('./FreeDrawTool'),
    TextTool      = require('./TextTool'),
    FillTool      = require('./FillTool'),
    DefaultTool   = require('./DefaultTool');

module.exports = function(toolOptions) {
  return {
    LINE:      new LineTool(toolOptions),
    RECTANGLE: new RectangleTool(toolOptions),
    POLYGON:   new PolygonTool(toolOptions),
    ERASE:     new EraserTool(toolOptions),
    GRID:      new GridTool(toolOptions),
    TRIANGLE:  new TriangleTool(toolOptions),
    CIRCLE:    new CircleTool(toolOptions),
    FREE:      new FreeDrawTool(toolOptions),
    TEXT:      new TextTool(toolOptions),
    FILL:      new FillTool(toolOptions),
    DEFAULT:   new DefaultTool(toolOptions)
  };
}
