primitives.Lineto = function Lineto() {
	this.primitiveType = 'Lineto';
	this.points = (arguments[0] && arguments[0].points) || (arguments && arguments.length ? Array.prototype.slice.apply(arguments) : [{x: 0, y: 0}]);
	this.points = this.points.map(function (point, idx) {
		return {x: point.x, y: point.y}
	})
};
primitives.Lineto.prototype = Object.create(primitives.Primitive.prototype);
primitives.Lineto.prototype.constructor = primitives.Lineto;
primitives.Lineto.prototype.getPathData = function () {
	return 'L' + this.points.reduce(function (valSoFar, val) {
		return valSoFar + ' ' + val.x + ',' + val.y;
	}, '');
};
primitives.Lineto.prototype.getExtremities = function () { // shouldn't really be called getExtremities
	var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
	
	this.points.forEach(function (point) {
		if (point.x < minX) { minX = point.x; }
		if (point.x > maxX) { maxX = point.x; }
		if (point.y < minY) { minY = point.y; }
		if (point.y > maxY) { maxY = point.y; }
	});
	
	return [{x: minX, y: minY}, {x: maxX, y: minY}, {x: maxX, y: maxY}, {x: minX, y: maxY}];
};
primitives.Lineto.prototype.render = function (ctx) {
	this.points.forEach(function (point) { ctx.lineTo(point.x, point.y); });
};