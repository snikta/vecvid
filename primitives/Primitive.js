let primitives = {};
primitives.Primitive = function Primitive() {
};
primitives.Primitive.prototype.translate = function (xMove, yMove) {
	for (var i = this.points.length - 1; i >= 0; i--) {
		this.points[i].x = this.points[i].x + xMove;
		this.points[i].y = this.points[i].y + yMove;
	}
	return this;
};
primitives.Primitive.prototype.scale = function (xFactor, yFactor, xOffset, yOffset) {
	for (var i = this.points.length - 1; i >= 0; i--) {
		this.points[i].x = (this.points[i].x - xOffset) * xFactor + xOffset;
		this.points[i].y = (this.points[i].y - yOffset) * yFactor + yOffset;
	}
	return this;
};
primitives.Primitive.prototype.rotate = function (cosTheta, sinTheta, aboutX, aboutY) {
	for (var i = this.points.length - 1; i >= 0; i--) {
		this.points[i] = (window.rotatePoint || Write.misc.rotatePoint)(this.points[i], cosTheta, sinTheta, aboutX, aboutY);
	}
	return this;
};
primitives.Primitive.prototype.applyMatrix = function (matrix) {
	var a = matrix.a, c = matrix.c, e = matrix.e, b = matrix.b, d = matrix.d, f = matrix.f, x, y;
	for (var i = this.points.length -  1; i >= 0; i--) {
		x = this.points[i].x;
		y = this.points[i].y;
		this.points[i] = {x: a * x + c * y + e, y: b * x + d * y + f};
	}
	return this;
};