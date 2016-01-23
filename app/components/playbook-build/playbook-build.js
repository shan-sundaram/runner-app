define(['knockout', 'text!./playbook-build.html', 'fixtures'], function (ko, template, fixtures) {

    function PlaybookBuildViewModel(params) {
        var self = this;
    }

    return {
        viewModel: PlaybookBuildViewModel,
        template: template
    };
});
