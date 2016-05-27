'use strict';

var wrapper = function wrapper(fn) {
    return function () {
        if (arguments[1] === Object(arguments[1]) && !Array.isArray(arguments[1])) {
            for (var attr in arguments[1]) {
                fn.call(null, arguments[0], attr, arguments[1][attr]);
            }
        } else if (Array.isArray(arguments[1])) {
            var el = arguments[0];
            arguments[1].forEach(function (a) {
                fn.call(null, el, a);
            });
        } else {
            fn.apply(null, arguments);
        }
    };
};

var attributelist = {
    set: function set(el, attr) {
        wrapper(function (e, a, v) {
            e.setAttribute(a, v);
        })(el, attr);
    },
    toggle: function toggle(el, attr) {
        wrapper(function (e, a) {
            e.setAttribute(a, e.getAttribute(a) === 'false' ? true : false);
        })(el, attr);
    }
};

var instances = [];
var defaults = {
    delay: 200,
    targetLocal: false,
    callback: null
};
var StormToggler = {
    init: function init() {
        var _this = this;

        this.open = false;
        this.targetElement = document.getElementById(this.targetId);
        this.classTarget = !this.settings.targetLocal ? document.documentElement : this.targetElement.parentNode;
        if (!this.settings.targetLocal) {
            this.statusClass = ['on--', this.targetId].join('');
            this.animatingClass = ['animating--', this.targetId].join('');
        } else {
            this.statusClass = 'active';
            this.animatingClass = 'animating';
        }

        attributelist.set(this.btn, {
            'role': 'button',
            'aria-controls': this.targetId,
            'aria-expanded': 'false'
        });

        attributelist.set(this.targetElement, {
            'aria-hidden': true
        });

        this.btn.addEventListener('click', function (e) {
            _this.toggle.call(_this, e);
        }, false);
    },
    toggle: function toggle(e) {
        var _this2 = this;

        var delay = this.classTarget.classList.contains(this.statusClass) ? this.settings.delay : 0;

        if (!!e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.classTarget.classList.add(this.animatingClass);

        window.setTimeout(function () {
            _this2.open = !_this2.open;
            _this2.classTarget.classList.remove(_this2.animatingClass);
            _this2.classTarget.classList.toggle(_this2.statusClass);
            attributelist.toggle(_this2.btn, 'aria-expanded');
            attributelist.toggle(_this2.targetElement, 'aria-hidden');
            !!_this2.settings.callback && typeof _this2.settings.callback === 'function' && _this2.settings.callback.call(_this2);
        }, delay);
    }
};
var create = function create(el, i, opts) {
    instances[i] = Object.assign(Object.create(StormToggler), {
        btn: el,
        targetId: (el.getAttribute('href') || el.getAttribute('data-target')).substr(1),
        settings: Object.assign({}, defaults, opts)
    });
    instances[i].init();
};

var init = function init(sel, opts) {
    var els = [].slice.call(document.querySelectorAll(sel));

    if (els.length === 0) {
        throw new Error('Toggler cannot be initialised, no augmentable elements found');
    }

    els.forEach(function (el, i) {
        create(el, i, opts);
    });
    return instances;
};

var reload = function reload(sel, opts) {
    [].slice.call(document.querySelectorAll(sel)).forEach(function (el, i) {
        if (!instances.filter(function (instance) {
            return instance.btn === el;
        }).length) {
            create(el, instances.length, opts);
        }
    });
};

var destroy = function destroy() {
    instances = [];
};

var Toggler = { init: init, reload: reload, destroy: destroy };

Toggler.init('.js-toggle');
Toggler.init('.js-toggle-local', { targetLocal: true });
//# sourceMappingURL=app.js.map
