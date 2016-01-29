define(['knockout', 'text!./job-build.html', 'fixtures'], function (ko, template, fixtures) {

    function JobBuildViewModel(params) {
        var self = this;
    }

    return {
        viewModel: JobBuildViewModel,
        template: template
    };
});
