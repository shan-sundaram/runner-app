define(['knockout', 'text!./playbook-schedule.html', '/scripts/fixtures.js'], function (ko, htmlString, fixtures) {

    function PlaybookScheduleViewModel(params) {
        var self = this;
    }

    return {
        viewModel: PlaybookScheduleViewModel,
        template: htmlString
    };
});
