define(['knockout', 'text!./job-schedule.html', 'fixtures'], function (ko, template, fixtures) {

    function JobScheduleViewModel(params) {
        var self = this;
    }

    return {
        viewModel: JobScheduleViewModel,
        template: template
    };
});
