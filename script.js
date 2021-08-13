const keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
    },
    eventHandlers: {
        oninput: null,
        onClose: null,
    },
    properties: {
        value: "",
        capsLock: false,
    },
    init(){
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.main.classList.add('keyboard','keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('focus',() => {
                this.open(element.value,currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },
    _createKeys(){
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };
        keyLayout.forEach(key => {
            const button = document.createElement('button');
            const insertLineBreak = ['backspace','p','enter','?'].indexOf(key) !== -1;
            button.setAttribute('type','button');
            button.classList.add('keyboard__key');
            switch(key){
                case "backspace":
                    button.classList.add('keyboard__key--wide');
                    button.innerHTML = createIconHTML('backspace');
                    button.addEventListener('click',() => {
                        this.properties.value = this.properties.value.substring(0,this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });
                    break;
                case "caps":
                    button.classList.add('keyboard__key--wide','keyboard__key--activatable');
                    button.innerHTML = createIconHTML('keyboard_capslock');
                    button.addEventListener('click',() => {
                        this._toggleCapsLock();
                        button.classList.toggle('keyboard__key--active',this.properties.capsLock);
                    });
                    break;
                case "enter":
                    button.classList.add('keyboard__key--wide');
                    button.innerHTML = createIconHTML('keyboard_return');
                    button.addEventListener('click',() => {
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');
                    });
                    break;
                case "space":
                    button.classList.add('keyboard__key--extra-wide');
                    button.innerHTML = createIconHTML('space_bar');
                    button.addEventListener('click',() => {
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');
                    });
                    break;
                case "done":
                    button.classList.add('keyboard__key--wide','keyboard__key--dark');
                    button.innerHTML = createIconHTML('check_circle');
                    button.addEventListener('click',() => {
                        this.close();
                        this._triggerEvent('onclose');
                    });
                    break;
                default:
                    button.textContent = key.toLowerCase();
                    button.addEventListener('click',() => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent('oninput');
                    });
                    break;
            }
            fragment.appendChild(button);
            if(insertLineBreak){
                fragment.appendChild(document.createElement('br'));
            }
        });
        return fragment;
    },
    _triggerEvent(handlerName){
        if(typeof this.eventHandlers[handlerName] == 'function'){
            this.eventHandlers[handlerName](this.properties.value);
        }
    },
    _toggleCapsLock(){
        this.properties.capsLock = !this.properties.capsLock;
        for(const key of this.elements.keys){
            if(key.childElementCount === 0){
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },
    open(initialValue,oninput,onclose){
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');
    },
    close(){
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');
    }
};
window.addEventListener('DOMContentLoaded',() => keyboard.init());
