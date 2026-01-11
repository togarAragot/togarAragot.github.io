window.InteractionsMenu = {
    el: null,
    isOpen: false,

    init() {
        this.el = document.getElementById('open-interactions-menu');
        this.interactionsContainer = document.querySelector('.interactions');

        if (this.el !== null) {
            this._registerEvents();
        }
    },

    _registerEvents() {
        this.el.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
    },

    _toggle(state) {
        this.isOpen = state;

        if (this.isOpen) {
            this.el.classList.add('open');
        } else {
            this.el.classList.remove('open');
        }
    },

    onClick() {
        this._toggle(!this.isOpen);
    },

    onResize() {
        //always close the menu
        this._toggle(false);
    }
}