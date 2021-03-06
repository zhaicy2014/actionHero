var actionHeroPrototype = require(__dirname + "/../../actionHero.js").actionHeroPrototype;
var actionHero = new actionHeroPrototype();
var api;
var messages = [];

var multiAction = function(action, count, params, next){
  var started = 0;
  var i = 0;
  var start = new Date().getTime();
  while(i < count){
    started++;
    var theseParams = {};
    for (var x in params){
      theseParams[x] = params[x];
      if(typeof theseParams[x] === 'function'){
        theseParams[x] = theseParams[x]();
      }
    }
    api.specHelper.runAction(action, theseParams, function(response, connection){
      started--;
      if(started === 0){
        var durationSeconds = ((new Date().getTime()) - start) / 1000;
        messages.push('benchmark: action: ' + action + ' x ' + count + ' >>> ' + durationSeconds + "s");
        next(durationSeconds);
      }
    });
    i++;
  }
};

describe('Benchmarks', function(){

  before(function(done){
    actionHero.start(function(err, a){
      api = a;
      done();
    })
  });

  after(function(done){
    actionHero.stop(function(err){
      console.log('');
      console.log('');
      messages.forEach(function(message){
        console.log(message);
      });
      done();
    });
  });

  it('status', function(done){
    this.timeout(60000)
    multiAction('randomNumber', 1000, {}, function(duration){
      done();
    });
  });

  it('status', function(done){
    this.timeout(60000)
    multiAction('status', 1000, {}, function(duration){
      done();
    });
  });

  it('cacheTest', function(done){
    this.timeout(60000)
    multiAction('cacheTest', 1000, {
      key:   function(){ return api.utils.randomString(32) }, 
      value: function(){ return api.utils.randomString(32) }
    }, function(duration){
      done();
    });
  });

});
