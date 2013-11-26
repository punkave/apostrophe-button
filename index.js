var extend = require('extend');

module.exports = function(options, callback) {
  return new Construct(options, callback);
};

module.exports.Construct = Construct;

function Construct(options, callback) {
  var apos = options.apos;
  var app = options.app;
  var self = this;
  self._dirs = (options.dirs || []).concat([ __dirname ]);

  self.pushAsset = function(type, name, optionsArg) {
    var options = {};
    extend(true, options, optionsArg);
    options.fs = __dirname;
    options.web = '/apos-button';
    return apos.pushAsset(type, name, options);
  };

  // Include our editor template in the markup when aposTemplates is called
  self.pushAsset('template', 'buttonEditor', { when: 'user' });

  // Make sure that aposScripts and aposStylesheets summon our assets
  self.pushAsset('script', 'editor', { when: 'user' });

  app.get('/apos-button/*', apos.static(__dirname + '/public'));

  apos.itemTypes.button = {
    widget: true,
    label: 'Button',
    css: 'simple-button',
    icon: 'button',
    render: function(data) {
      console.log(__dirname + '/views')
      // return apos.partial('button', data, __dirname + '/views');
      return apos.partial('button', data, self._dirs.map(function(dir) { return dir + '/views'; }) );
    }
  };

  return setImmediate(function() { return callback(null); });
}
