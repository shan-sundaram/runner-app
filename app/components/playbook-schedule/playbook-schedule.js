define(['knockout', 'text!./playbook-schedule.html', 'fixtures'], function (ko, template, fixtures) {

    function PlaybookScheduleViewModel(params) {
        var self = this;
    }

    return {
        viewModel: PlaybookScheduleViewModel,
        template: template
    };
});
