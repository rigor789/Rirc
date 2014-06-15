function Colors() {
    this.colors  = [
        'black',
        'blue',
        'green',
        'red',
        'orange',
    ];
    this.current = -1;
}

Colors.prototype.next = function() {
    this.current++;
    if(this.current == this.colors.length) {
        this.current = -1;
    }
    return this.colors[this.current];
};
