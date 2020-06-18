//制作事件驱动源
class eventTarget{
    constructor(){
        this.handlers={};
    }
    handler(type, handler) {
        //添加事件对象
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = new Array();
        }
        this.handlers[type] = this.handlers[type].concat(handler);
    }
    removeHandler(type, handler) {
        if (typeof this.handlers == "undefined") { this.handlers = {} }
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                if (handler[i] == handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    }
    trigger(type) {
        if (typeof this.handlers == "undefined") { this.handlers = {} }
        if (this.handlers[type] instanceof Array) {
            var handlers = this.handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i].call(this, this);
            }
        }
    }
};
export default eventTarget;
