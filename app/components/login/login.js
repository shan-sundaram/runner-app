define([
    'knockout',
    'text!./login.html'
], function (
    ko,
    template
) {

    function LoginViewModel(params) {
        var self = this;
        var dev = true;


        if (dev) {

        } else {

        }
    }

    var loginMapping = {
        create: function (options) {
            return new LoginMappingAdditions(options.data);
        }
    };

    function LoginMappingAdditions(data) {
        var self = this;
        ko.mapping.fromJS(data, {}, self);

        return self;
    }

    // Use prototype to declare any public methods
    LoginViewModel.prototype.doSomething = function () {

    };

    return {
        viewModel: LoginViewModel,
        template: template
    };
});
