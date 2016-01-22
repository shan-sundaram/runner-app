define(['knockout', 'text!/views/playbook-build.html', 'fixtures'], function (ko, htmlString, fixtures) {

    function PlaybookBuildViewModel(params) {
        var self = this;
    }

    return {
        viewModel: PlaybookBuildViewModel,
        template: htmlString
    };
});
