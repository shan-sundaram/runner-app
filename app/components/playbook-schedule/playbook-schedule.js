define(['knockout', 'text!./playbook-schedule.html', '/scripts/fixtures.js'], function (ko, template, fixtures) {

    function PlaybookScheduleViewModel(params) {
        var self = this;
    }

    return {
        viewModel: PlaybookScheduleViewModel,
        template: template
    };
});
