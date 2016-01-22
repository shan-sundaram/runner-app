define(['knockout', 'jquery', 'text!/views/navigation.html', 'fixtures'], function (ko, jquery, htmlString, fixtures) {

    function NavigationViewModel(params) {
        var self = this;
    }

    return {
        viewModel: NavigationViewModel,
        template: htmlString
    };
});
