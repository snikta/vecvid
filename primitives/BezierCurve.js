var solveQuadratic = function (a, b, c) {
	var twoA = 2 * a,
		sqrtPart = Math.sqrt(Math.pow(b, 2) - 2 * twoA * c); // 2 * twoA = 4 * a i.e. b^2-4ac
	
	return {
		plus: (-b + sqrtPart) / twoA,
		minus: (-b - sqrtPart) / twoA
	};
};

primitives.BezierCurve = function BezierCurve(p0, p1, p2, p3) {
	this.primitiveType = 'BezierCurve';
	this.points = (arguments[0] && arguments[0].points) || [p0 || {x: 0, y: 0}, p1 || {x: 0, y: 0}, p2 || {x: 0, y: 0}, p3 || {x: 0, y: 0}];
	this.points = this.points.map(function (point, idx) {
		return {x: point.x, y: point.y}
	})
};
primitives.BezierCurve.prototype = Object.create(primitives.Primitive.prototype);
primitives.BezierCurve.prototype.constructor = primitives.BezierCurve;

primitives.BezierCurve.evaluateCurve = function (t, p0, p1, p2, p3) {
	return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
};
primitives.BezierCurve.prototype.getPortion = function (t) {
	var p1 = this.points[0], p2 = this.points[1], p3 = this.points[2], p4 = this.points[3],
		p12 = {x: (p2.x - p1.x) * t + p1.x, y: (p2.y - p1.y) * t + p1.y},
		p23 = {x: (p3.x - p2.x) * t + p2.x, y: (p3.y - p2.y) * t + p2.y},
		p34 = {x: (p4.x - p3.x) * t + p3.x, y: (p4.y - p3.y) * t + p3.y},
		p123 = {x: (p23.x - p12.x) * t + p12.x, y: (p23.y - p12.y) * t + p12.y},
		p234 = {x: (p34.x - p23.x) * t + p23.x, y: (p34.y - p23.y) * t + p23.y},
		p1234 = {x: (p234.x - p123.x) * t + p123.x, y: (p234.y - p123.y) * t + p123.y};
	
	return new this.constructor(p1, p12, p123, p1234, p234);
};
primitives.BezierCurve.prototype.getArcLength = function () {
	if (this._arcLength) { return this._arcLength; }
	
	var len = 0.0, steps = 10, stepIndex, point, t, prevPoint, deltaX, deltaY,
		p0 = this.points[0], p1 = this.points[1], p2 = this.points[2], p3 = this.points[3];
	
	for (stepIndex = 0; stepIndex < steps; stepIndex++) {
		t = parseFloat(stepIndex / steps);
		point = {
			x: this.constructor.evaluateCurve(t, p0.x, p1.x, p2.x, p3.x),
			y: this.constructor.evaluateCurve(t, p0.y, p1.y, p2.y, p3.y)
		};
		
		if (stepIndex > 0) {
			deltaX = point.x - prevPoint.x;
			deltaY = point.y - prevPoint.y;
			len += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		}
		prevPoint = point;
	}
	
	this._arcLength = len;
	return this._arcLength;
};
primitives.BezierCurve.prototype.getPathData = function () {
	return 'C ' + this.points[1].x + ',' + this.points[1].y + ' ' + this.points[2].x + ',' + this.points[2].y + ' ' + this.points[3].x + ',' + this.points[3].y;
};
primitives.BezierCurve.prototype.render = function (ctx) {
	ctx.bezierCurveTo(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y);
};
primitives.BezierCurve.prototype.getExtremities = function () {
	// h/t http://pomax.nihongoresources.com/pages/bezier/ and http://pomax.github.io/bezierinfo/#boundingbox
	var a = this.points[0].x, b = this.points[0].y,
		c = this.points[1].x, d = this.points[1].y,
		e = this.points[2].x, f = this.points[2].y,
		g = this.points[3].x, h = this.points[3].y,
		xS = [a, g], yS = [b, h], // t = 0: (a, b) and t = 1: (g, h)
		wX = -a + 3 * c + g - 3 * e, wY = -b + 3 * d + h - 3 * f,
		uX = 2 * a - 4 * c + 2 * e, uY = 2 * b - 4 * d + 2 * f,
		vX = c - a, vY = d - b,
		// now solve the quadratic wt^2 + ut + v = 0 (we divided both sides by 3)
		tX = solveQuadratic(wX, uX, vX),
		tY = solveQuadratic(wY, uY, vY),
		result;
	
	if (tX.plus > 0 && tX.plus < 1) {
		result = primitives.BezierCurve.evaluateCurve(tX.plus, a, c, e, g);
		if (isFinite(result)) {
			xS.push(result);
		}
	}
	
	if (tX.minus > 0 && tX.minus < 1) {
		result = primitives.BezierCurve.evaluateCurve(tX.minus, a, c, e, g);
		if (isFinite(result)) {
			xS.push(result);
		}
	}
	
	if (tY.plus > 0 && tY.plus < 1) {
		result = primitives.BezierCurve.evaluateCurve(tY.plus, b, d, f, h);
		if (isFinite(result)) {
			yS.push(result);
		}
	}
	
	if (tY.minus > 0 && tY.minus < 1) {
		result = primitives.BezierCurve.evaluateCurve(tY.minus, b, d, f, h);
		if (isFinite(result)) {
			yS.push(result);
		}
	}
	
	var minX = Math.min.apply(null, xS), maxX = Math.max.apply(null, xS), minY = Math.min.apply(null, yS), maxY = Math.max.apply(null, yS);
	return [{x: minX, y: minY}, {x: maxX, y: minY}, {x: maxX, y: maxY}, {x: minX, y: maxY}];
};