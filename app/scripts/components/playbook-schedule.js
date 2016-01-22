define(['knockout', 'text!/views/playbook-schedule.html', 'fixtures'], function (ko, htmlString, fixtures) {

    function PlaybookScheduleViewModel(params) {
        var self = this;
    }

    return {
        viewModel: PlaybookScheduleViewModel,
        template: htmlString
    };
});
