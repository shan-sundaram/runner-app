define(['knockout', 'jquery', 'text!./navigation.html', '/scripts/fixtures.js'], function (ko, jquery, htmlString, fixtures) {

    function NavigationViewModel(params) {
        var self = this;
    }

    return {
        viewModel: NavigationViewModel,
        template: htmlString
    };
});
