define(['knockout', 'text!./jobs.html', '/scripts/fixtures.js', 'runner'], function (ko, template, fixtures, RNR) {

    function Job(params) {
        this.jobId = ko.observable(params.jobId || '—');
        this.name = ko.observable(params.name || '—');
        this.status = ko.observable(params.status || '—');
        this.icon = ko.observable(params.icon || '—');
        this.user = ko.observable(params.user || '—');
        this.duration = ko.observable(params.duration || '—');
        this.finished = ko.observable(params.finished || '—');
    }

    function JobsViewModel(params) {
        var self = this;

        $.getScript('/scripts/runner.js', function()
        {
            //alert('good');
        });

        self.jobs = [];

        /*fixtures.jobs.forEach(function (job) {
         var jobObject = new Job(job);
         self.jobs.push(jobObject);
         });*/

        var runner_ctx = new RNR.Runner({
            token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBpLXRpZXIzIiwiYXVkIjoidXJuOnRpZXIzLXVzZXJzIiwibmJmIjoxNDUzMTU2NjQ3LCJleHAiOjE0NTQzNjYyNDcsInVuaXF1ZV9uYW1lIjoic2l2YS5wb3B1cmkud2Z0YyIsInVybjp0aWVyMzphY2NvdW50LWFsaWFzIjoiV0ZUQyIsInVybjp0aWVyMzpsb2NhdGlvbi1hbGlhcyI6IlVDMSIsInJvbGUiOiJBY2NvdW50QWRtaW4ifQ.zhIGzDb8yJX_mfWJLvIKBXWlr9LDbpjAypUA60NK2jA',
            accountAlias : 'WFTC'
        });

        runner_ctx.jobs.find().then(function(page){

/*
            fixtures.jobs.forEach(function (job) {
                var jobObject = new Job(job);
                self.jobs.push(jobObject);
            });
*/

            console.log(page.values);

            page.values.forEach(function (job) {
                var jobObject = new Job(job);
                self.jobs.push(jobObject);
            });


        });
    }

    return {
        viewModel: JobsViewModel,
        template: template
    };
});


