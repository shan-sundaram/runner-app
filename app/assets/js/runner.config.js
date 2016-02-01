define(['runner'], function (RNR) {
    var self = this;

    var DEV_CONTEXT_EXTERNAL = 'http://api.dev.automation.ctl.io';
    var DEV_CONTEXT_INTERNAL = 'http://10.121.41.24:30000';

    var theToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBpLXRpZXIzIiwiYXVkIjoidXJuOnRpZXIzLXVzZXJzIiwibmJmIjoxNDUzMTU2NjQ3LCJleHAiOjE0NTQzNjYyNDcsInVuaXF1ZV9uYW1lIjoic2l2YS5wb3B1cmkud2Z0YyIsInVybjp0aWVyMzphY2NvdW50LWFsaWFzIjoiV0ZUQyIsInVybjp0aWVyMzpsb2NhdGlvbi1hbGlhcyI6IlVDMSIsInJvbGUiOiJBY2NvdW50QWRtaW4ifQ.zhIGzDb8yJX_mfWJLvIKBXWlr9LDbpjAypUA60NK2jA';
    var theAccountAlias = 'WFTC';

    var theRunnerInstance = new RNR.Runner({
        token: theToken,
        accountAlias: theAccountAlias
    });

    theRunnerInstance.context.endpoint = DEV_CONTEXT_INTERNAL;

    return {
        getRunnerInstance: function () {
            //return runner;
            return theRunnerInstance;
        }
    };
});
