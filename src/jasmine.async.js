this.AsyncSpec = (function(global){

  // Private Methods
  // ---------------
  
  function runAsync(block,ctx){
    return function(){
      var done = false;
      var complete = function(){ done = true; };

      runs(function(){
        block.call(ctx,complete);
      });

      waitsFor(function(){
        return done;
      });
    };
  }

  // Constructor Function
  // --------------------

  function AsyncSpec(spec){
    this.spec = spec;
  }

  // Public API
  // ----------

  AsyncSpec.prototype.beforeEach = function(block){
    this.spec.beforeEach(runAsync(block,this.spec));
  };

  AsyncSpec.prototype.afterEach = function(block){
    this.spec.afterEach(runAsync(block,this.spec));
  };

  AsyncSpec.prototype.it = function(description, block){
    // For some reason, `it` is not attached to the current
    // test suite, so it has to be called from the global
    // context.

    global.it(description, runAsync(block,this.spec));
  };

  return AsyncSpec;
})(this);