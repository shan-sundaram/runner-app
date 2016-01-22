define(['knockout', 'text!./playbook-build.html', '/scripts/fixtures.js'], function (ko, htmlString, fixtures) {

    function PlaybookBuildViewModel(params) {
        var self = this;
    }

    return {
        viewModel: PlaybookBuildViewModel,
        template: htmlString
    };
});
