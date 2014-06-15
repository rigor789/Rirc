exports.Colors = function() {
    this.colors  = [
        'black',
        'blue',
        'green',
        'red',
        'orange',
    ];
    this.current = -1;
}

exports.Colors.prototype.next = function() {
    this.current++;
    if(this.current == this.colors.length) {
        this.current = 0;
    }
    return this.colors[this.current];
};
