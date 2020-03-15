primitives.Moveto = function Moveto() {
	this.primitiveType = 'Moveto';
	this.points = (arguments[0] && arguments[0].points) || [arguments[0] || {x: 0, y: 0}];
	this.points = this.points.map(function (point, idx) {
		return {x: point.x, y: point.y}
	})
};
primitives.Moveto.prototype = Object.create(primitives.Primitive.prototype);
primitives.Moveto.prototype.constructor = primitives.Moveto;
primitives.Moveto.prototype.getPathData = function () {
	return 'M ' + this.points[0].x + ' ' + this.points[0].y;
};
primitives.Moveto.prototype.getExtremities = function () {
	return [this.points[0]];
};
primitives.Moveto.prototype.render = function (ctx) {
	ctx.moveTo(this.points[0].x, this.points[0].y);
};