var Controller = function () {

    this.left = new Controller.ButtonInput();
    this.right = new Controller.ButtonInput();
    this.up = new Controller.ButtonInput();
    this.down = new Controller.ButtonInput();

    this.moveKey = function (type, key_code) {
        let isPressed = (type === "keydown");
        switch (key_code) {
            case 37:
                this.left.getInput(isPressed);
                break;
            case 38:
                this.up.getInput(isPressed);
                break;
            case 39:
                this.right.getInput(isPressed);
                break;
            case 40:
                this.down.getInput(isPressed);
                break;
        }
    };
};

Controller.prototype = {
    constructor: Controller
};

Controller.ButtonInput = function () {
    this.active = this.isPressed = false;
};

Controller.ButtonInput.prototype = {

    constructor: Controller.ButtonInput,

    getInput: function (isPressed) {
        if (this.isPressed !== isPressed) this.active = isPressed;
        this.isPressed = isPressed;
    }
};
