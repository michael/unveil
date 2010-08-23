// Tween
// =============================================================================
//
// Adapted from EASING EQUATIONS (R. Penner) and JSTween (P. Maegerman)

uv.Tween = function(opts) {
  this.prop = opts.property;
  this.obj = opts.obj;
  this.begin = opts.begin || opts.obj[this.prop];
  this._pos = this.begin;
  this.setDuration(opts.duration);
  
  this.easer = opts.easer || uv.Tween.strongEaseInOut;
  this.setFinish(opts.finish || opts.obj[this.prop]);
  
  // event handlers
  this.handlers = {};
};

uv.Tween.prototype = {
  obj: new Object(),
  easer: function (t, b, c, d) { return c*t/d + b; },
  begin: 0,
  change: 0,
  prevTime: 0,
  prevPos: 0,
  looping: false,
  _playing: false,
  _duration: 0,
  _time: 0,
  _pos: 0,
  _position: 0,
  _startTime: 0,
  _finish: 0,
  name: '',
  suffixe: '',
  // Bind event handler
  bind: function(name, fn) {
    if (!this.handlers[name]) {
      this.handlers[name] = [];
    }
    this.handlers[name].push(fn);
  },
  // Trigger event
  trigger: function(name) {
    var that = this;
    if (this.handlers[name]) {
      _.each(this.handlers[name], function(fn) {
        fn.apply(that, []);
      });
    }
  },
  setTime: function(t) {
  	this.prevTime = this._time;
  	if (t > this.getDuration()) {
  		if (this.looping) {
  			this.rewind (t - this._duration);
  			this.update();
  			// execute onLooped callback
  		} else {
  			this._time = this._duration;
  			this.update();
        this.stop();
  		}
  	} else if (t < 0) {
  		this.rewind();
  		this.update();
  	} else {
  		this._time = t;
  		this.update();
  	}
  },
  getTime: function(){
  	return this._time;
  },
  setDuration: function(d){
  	this._duration = (d == null || d <= 0) ? 0.2 : d / 1000;
  },
  getDuration: function(){
  	return this._duration;
  },
  setPosition: function(p){
  	this.prevPos = this._pos;
  	this.obj[this.prop] = p;
  	this._pos = p;
  	// execute onPositionChanged callback
  },
  getPosition: function(t) {
  	if (t == undefined) t = this._time;
  	return this.easer(t, this.begin, this.change, this._duration);
  },
  setFinish: function(f) {
  	this.change = f - this.begin;
  },
  getFinish: function() {
  	return this.begin + this.change;
  },
  isPlaying: function() {
    return this._playing;
  },
  init: function(obj, prop, easer, begin, finish, duration, suffixe) {
  	if (!arguments.length) return;
  	this._listeners = new Array();
  	this.addListener(this);
  	this.obj = obj;
  	this.prop = prop;
  	this.begin = begin;
  	this._pos = begin;
  	this.setDuration(duration);
  	if (easer!=null && easer!='') {
  		this.easer = easer;
  	}
  	this.setFinish(finish);
  },
  
  start: function() {
  	this.rewind();
  	this._playing = true;
  	this.trigger('start');
  },
  rewind: function(t) {
  	this.reset();
  	this._time = (t == undefined) ? 0 : t;
  	this.fixTime();
  	this.update();
  },
  fforward: function() {
  	this._time = this._duration;
  	this.fixTime();
  	this.update();
  },
  update: function() {
  	this.setPosition(this.getPosition(this._time));
  },
  tick: function() {
    if (this._playing) {
      this.nextFrame();
    }
  },
  nextFrame: function() {
  	this.setTime((this.getTimer() - this._startTime) / 1000);
  },
  reset: function() {
    this._playing = false;
  },
  stop: function() {
    this._playing = false;    
    this.trigger('finish');
  },
  continueTo: function(finish, duration) {
  	this.begin = this._pos;
  	this.setFinish(finish);
  	if (this._duration != undefined) {
  		this.setDuration(duration);
  	}
  	this.start();
  },
  resume: function() {
  	this.fixTime();
  	this._playing = true;
  	// executing onResumed callback
  },
  yoyo: function () {
  	this.continueTo(this.begin,this._time);
  },
  fixTime: function() {
  	this._startTime = this.getTimer() - this._time * 1000;
  },
  getTimer: function() {
  	return new Date().getTime() - this._time;
  }
};

// Easing functions
uv.Tween.backEaseIn = function(t,b,c,d,a,p) {
	if (s == undefined) var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
};

uv.Tween.backEaseOut = function(t,b,c,d,a,p) {
	if (s === undefined) var s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
};

uv.Tween.backEaseInOut = function(t,b,c,d,a,p) {
	if (s == undefined) var s = 1.70158; 
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
};

uv.Tween.elasticEaseIn = function(t,b,c,d,a,p) {
  var s;
	if (t==0) return b;  
	if ((t/=d)==1) return b+c;  
	if (!p) p=d*0.3;
	if (!a || a < Math.abs(c)) {
		a=c; s=p/4;
	}
	else 
		s = p/(2*Math.PI) * Math.asin (c/a);

	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
};

uv.Tween.elasticEaseOut = function (t,b,c,d,a,p) {
  var s;
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
	if (!a || a < Math.abs(c)) { a=c; s=p/4; }
	else s = p/(2*Math.PI) * Math.asin (c/a);
	return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
};

uv.Tween.elasticEaseInOut = function (t,b,c,d,a,p) {
  var s;
	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(0.3*1.5);
	if (!a || a < Math.abs(c)) { a=c; s=p/4; }
	else s = p/(2*Math.PI) * Math.asin (c/a);
	if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
};

uv.Tween.bounceEaseOut = function(t,b,c,d) {
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	}
};

uv.Tween.bounceEaseIn = function(t,b,c,d) {
	return c - Tween.bounceEaseOut (d-t, 0, c, d) + b;
};

uv.Tween.bounceEaseInOut = function(t,b,c,d) {
	if (t < d/2) return Tween.bounceEaseIn (t*2, 0, c, d) * 0.5 + b;
	else return Tween.bounceEaseOut (t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
};

uv.Tween.strongEaseInOut = function(t,b,c,d) {
	return c*(t/=d)*t*t*t*t + b;
};

uv.Tween.regularEaseIn = function(t,b,c,d) {
	return c*(t/=d)*t + b;
};

uv.Tween.regularEaseOut = function(t,b,c,d) {
	return -c *(t/=d)*(t-2) + b;
};

uv.Tween.regularEaseInOut = function(t,b,c,d) {
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
};

uv.Tween.strongEaseIn = function(t,b,c,d) {
	return c*(t/=d)*t*t*t*t + b;
};

uv.Tween.strongEaseOut = function(t,b,c,d) {
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
};

uv.Tween.strongEaseInOut = function(t,b,c,d) {
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
};