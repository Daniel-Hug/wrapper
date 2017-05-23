/*
	usage:

	var wrapper = new Wrapper({
		parent: element in document (required),
		cells: collection of elements sorted tallest first (required),
		cellWidth: number or array of numbers (in pixels; required),
		cellHeight: number or array of numbers (in pixels; required),
		fixedWidth: boolean (optional)
	});
*/

function Wrapper(options) {
	this.parent = options.parent;
	this.cells = options.cells;
	this.cellWidth = options.cellWidth;
	this.cellHeight = options.cellHeight;
	this.fixedWidth = !!options.fixedWidth;
	this.wrapperWidth = this.getWrapperWidth();

	this.render();

	if (this.fixedWidth) return;
	var instance = this;
	var timer;

	function handleResize() {
		var newWrapperWidth = instance.getWrapperWidth();
		if (newWrapperWidth !== instance.wrapperWidth) {
			instance.wrapperWidth = newWrapperWidth;
			instance.render();
		}
	}

	window.addEventListener('resize', function() {
		clearTimeout(timer);
		timer = setTimeout(handleResize, 50);
	});
}

Wrapper.prototype.getWrapperWidth = function() {
	var wrapper = this.parent.parentNode;
	var computedStyle = getComputedStyle(wrapper);
	return wrapper.clientWidth - 
		(parseFloat(computedStyle.paddingLeft) + 
		parseFloat(computedStyle.paddingRight));
};

Wrapper.prototype.getColCount = function() {
	return Math.floor(this.getWrapperWidth() / this.cellWidth);
};

Wrapper.prototype.render = function() {
	var maxRowWidth = 0;

	// reposition cells
	var top = 0;
	var left = 0;
	var bottom = typeof this.cellHeight === 'number' ? this.cellHeight : this.cellHeight[0];
	for (var i = 0; i < this.cells.length; i++) {
		var style = this.cells[i].style;
		var cellWidth = typeof this.cellWidth === 'number' ? this.cellWidth : this.cellWidth[i];
		
		// if this cell is too wide for this row
		var right = left + cellWidth;
		if (left > 0 && right > this.wrapperWidth) {
			left = 0;
			top = bottom;
			var cellHeight = typeof this.cellHeight === 'number' ? this.cellHeight : this.cellHeight[i];
			bottom += cellHeight;
		} else {
			if (right > maxRowWidth) maxRowWidth = right;
		}
		style.left = left + 'px';
		style.top = top + 'px';
		left += cellWidth;
	}

	// set parent size
	this.parent.style.height = bottom + 'px';
	this.parent.style.width = maxRowWidth + 'px';
};
