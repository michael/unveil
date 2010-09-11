/**
 * @author sole / http://soledadpenades.com/
 * @author mr.doob / http://mrdoob.com/
 * Easing equations by Robert Penner http://www.robertpenner.com/easing/ (BSD license)
 */
 
uv.TweenManager = uv.TweenManager || ( function() {
	var i, time, tweens = [];

	this.add = function (tween) {
		tweens.push(tween);
	};

	this.remove = function (tween) {
		for (var i = 0, l = tweens.length; i < l; i++) {
			if (tween == tweens[ i ]) {
				tweens.splice(i, 1);
				return;
			}
		}
	};
	
	this.update = function() {
		i = 0;
		time = new Date().getTime();
		while( i < tweens.length ) {
			tweens[ i ].update( time ) ? i++ : tweens.splice( i, 1 );
		}
	};
	return this;
})(),

// uv.Tween = uv.Tween || {};

uv.Tween = function ( object ) {
	uv.TweenManager.add( this );

	var _object = object,
	_valuesStart = {},
	_valuesChange = {},
	_valuesTo = {},
	_duration = 1000,
	_delayTime = 0,
	_startTime = null,
	_easingFunction = uv.Tween.Easing.Back.EaseInOut,
	_nextTween = null,
	_onUpdateFunction = null,
	_onCompleteFunction = null,
	_completed = false;

	this.to = function( duration, properties ) {
		_duration = duration * 1000;
		for ( var property in properties ) {
			if ( _object[ property ] === null ) {
				continue;
			}
			// The current values are read when the tween starts;
			// here we only store the final desired values
			_valuesTo[ property ] = properties[ property ];
		}
		return this;
	};

	this.start = function() {
		_completed = false;
		_startTime = new Date().getTime() + _delayTime;
		for ( var property in _valuesTo ) {
			if ( _object[ property ] === null ) {
				continue;
			}
			_valuesStart[ property ] = _object[ property ];
			_valuesChange[ property ] = _valuesTo[ property ] - _object[ property ];
		}
		return this;
	}

	this.delay = function ( amount ) {
		_delayTime = amount * 1000;
		return this;
	};

	this.easing = function ( easing ) {
		_easingFunction = easing;
		return this;
	};

	this.chain = function ( chainedTween ) {
		_nextTween = chainedTween;
	}

	this.onUpdate = function ( onUpdateFunction ) {
		_onUpdateFunction = onUpdateFunction;
		return this;
	};

	this.onComplete = function ( onCompleteFunction ) {
		_onCompleteFunction = onCompleteFunction;
		return this;
	};

	this.update = function ( time ) {
		var property, elapsed;

		if ( time < _startTime || _startTime === null) {
			return true;
		}

		if ( _completed ) {
			return (_nextTween === null);
		}
		elapsed = time - _startTime;

		if( elapsed > _duration ) {

			_completed = true;
			_startTime = null;

			if(_onCompleteFunction !== null) {
				_onCompleteFunction();
			}

			if(_nextTween !== null) {
				_nextTween.start();
				return true; // this tween cannot be safely destroyed
			} else {
				return false; // no associated tweens, tween can be destroyed
			}
		}

		for ( property in _valuesChange ) {
			_object[ property ] = _easingFunction(elapsed, _valuesStart[ property ], _valuesChange[ property ], _duration );
		}

		if ( _onUpdateFunction !== null ) {
			_onUpdateFunction.apply(_object);
		}
		return true;
	};

	this.destroy = function () {
		uv.TweenManager.remove(this);
	};
};


uv.Tween.Easing = { Back: {}, Elastic: {}, Expo: {}, Linear: {} };

uv.Tween.Easing.Back.EaseIn = function( t, b, c, d ) {
	var s = 1.70158;
	return c * ( t /= d  ) * t * ( ( s + 1 ) * t - s ) + b;
};

uv.Tween.Easing.Back.EaseOut = function( t, b, c, d ) {
	var s = 1.70158;
	return c * ( ( t = t / d - 1 ) * t * ( ( s + 1 ) * t + s ) + 1 ) + b;
};

uv.Tween.Easing.Back.EaseInOut = function( t, b, c, d ) {
	var s = 1.70158;
	if ( ( t /= d / 2 ) < 1 ) return c / 2 * ( t * t * ( ( ( s *= ( 1.525 ) ) + 1 ) * t - s ) ) + b;
	return c / 2 * ( ( t -= 2 ) * t * ( ( ( s *= ( 1.525 ) ) + 1 ) * t + s ) + 2 ) + b;
};

uv.Tween.Easing.Elastic.EaseIn = function( t, b, c, d ) {
	if ( t == 0 ) return b;
	if ( ( t /= d ) == 1 ) return b + c;
	var p = d * .3;
	var a = c;
	var s = p / 4;
	return - ( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
};

uv.Tween.Easing.Elastic.EaseOut = function( t, b, c, d ) {
	if ( t == 0 ) return b;
	if ( ( t /= d ) == 1 ) return b + c;
	var p = d * .3;
	var a = c;
	var s = p / 4;
	return ( a * Math.pow( 2, - 10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) + c + b );
};

uv.Tween.Easing.Elastic.EaseInOut = function(t, b, c, d) {
	if ( t == 0 ) return b;
	if ( ( t /= d / 2 ) == 2 ) return b + c;
	var p = d * ( .3 * 1.5 );
	var a = c;
	var s = p / 4;
	if ( t < 1 ) return - .5 * ( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
	return a * Math.pow( 2, - 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) * .5 + c + b;
};

uv.Tween.Easing.Expo.EaseIn = function(t, b, c, d) {
	return ( t == 0) ? b : c * Math.pow( 2, 10 * ( t / d - 1 ) ) + b;
};

uv.Tween.Easing.Expo.EaseOut = function(t, b, c, d) {
	return ( t == d ) ? b + c : c * ( - Math.pow( 2, - 10 * t / d) + 1) + b;
};

uv.Tween.Easing.Expo.EaseInOut = function(t, b, c, d) {
	if ( t == 0 ) return b;
	if ( t == d ) return b+c;
	if ( ( t /= d / 2 ) < 1) return c / 2 * Math.pow( 2, 10 * ( t - 1 ) ) + b;
	return c / 2 * ( - Math.pow( 2, - 10 * --t ) + 2) + b;
};

uv.Tween.Easing.Linear.EaseNone = function (t, b, c, d) {
		return c*t/d + b;
};

uv.Tween.Easing.Linear.EaseIn = function (t, b, c, d) {
		return c*t/d + b;
};

uv.Tween.Easing.Linear.EaseOut = function (t, b, c, d) {
		return c*t/d + b;
};

uv.Tween.Easing.Linear.EaseInOut = function (t, b, c, d) {
		return c*t/d + b;
};
