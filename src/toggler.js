'use strict';

import attributelist from './attributelist'

let instances = [],
    defaults = {
        delay: 200,
        targetLocal: false,
        callback: null
    },
    StormToggler = {
        init: function() {
            this.open = false;
            this.targetElement = document.getElementById(this.targetId);
            this.classTarget = (!this.settings.targetLocal) ? document.documentElement : this.targetElement.parentNode;
            if((!this.settings.targetLocal)) {
                this.statusClass = ['on--', this.targetId].join('');
                this.animatingClass = ['animating--', this.targetId].join('');
            } else {
                this.statusClass = 'active';
                this.animatingClass = 'animating';
            }
    
            attributelist.set(this.btn, {
                'role' : 'button',
                'aria-controls' : this.targetId,
                'aria-expanded' : 'false'
            });

            attributelist.set(this.targetElement, {
                'aria-hidden': true
            });

            this.btn.addEventListener('click', (e) => { 
                this.toggle.call(this, e); 
            }, false);
        },
        toggle: function(e) {
            var delay = this.classTarget.classList.contains(this.statusClass) ?  this.settings.delay : 0;
            
            if(!!e){
                e.preventDefault();
                e.stopPropagation();
            }
            
            this.classTarget.classList.add(this.animatingClass);
            
            window.setTimeout(() => {
                this.open = !this.open;
                this.classTarget.classList.remove(this.animatingClass);
                this.classTarget.classList.toggle(this.statusClass);
                attributelist.toggle(this.btn, 'aria-expanded');
                attributelist.toggle(this.targetElement, 'aria-hidden');
                (!!this.settings.callback && typeof this.settings.callback === 'function') && this.settings.callback.call(this);
            }, delay);
        }
    };

	
let create = (el, i, opts) => {
    instances[i] = Object.assign(Object.create(StormToggler), {
        btn: el,
        targetId: (el.getAttribute('href')|| el.getAttribute('data-target')).substr(1),
        settings: Object.assign({}, defaults, opts)
    });
    instances[i].init();
}

let init = (sel, opts) => {
    var els = [].slice.call(document.querySelectorAll(sel));
    
    if(els.length === 0) {
        throw new Error('Toggler cannot be initialised, no augmentable elements found');
    }
    
    els.forEach((el, i) => {
        create(el, i, opts);
    });
    return instances;
    
}

let reload = (sel, opts) => {
    [].slice.call(document.querySelectorAll(sel)).forEach((el, i) => {
        if(!instances.filter(instance => { return (instance.btn === el); }).length) {
            create(el, instances.length, opts);
        }
    });
}

let destroy = () => {
    instances = [];  
}

let Toggler = { init, reload, destroy }

export { Toggler };