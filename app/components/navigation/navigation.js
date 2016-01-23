define(['knockout', 'jquery', 'text!./navigation.html', 'fixtures'], function (ko, jquery, template, fixtures) {

    function NavigationViewModel(params) {
        var self = this;
    }

    return {
        viewModel: NavigationViewModel,
        template: template
    };
});

