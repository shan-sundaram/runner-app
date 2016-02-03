define(['runner'], function (RNR) {
    var self = this;

    var DEV_CONTEXT_EXTERNAL = 'http://api.dev.automation.ctl.io';
    var DEV_CONTEXT_INTERNAL = 'http://10.121.41.24:30000';



    //var theAuth = JSON.parse(localStorage.getItem('auth');
    //var theToken = theAuth.bearerToken;
    //var theAccountAlias = theAuth.accountAlias;
    //var theToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBpLXRpZXIzIiwiYXVkIjoidXJuOnRpZXIzLXVzZXJzIiwibmJmIjoxNDU0MzY2ODc3LCJleHAiOjE0NTU1NzY0NzcsInVuaXF1ZV9uYW1lIjoiZXJpYy5qb2huc29uLndmYWQiLCJ1cm46dGllcjM6YWNjb3VudC1hbGlhcyI6IldGQUQiLCJ1cm46dGllcjM6bG9jYXRpb24tYWxpYXMiOiJVQzEiLCJyb2xlIjoiQWNjb3VudEFkbWluIn0.KdzQwWMYaA3XESDoBVlHKDQO9sUbL8roiMaQx__CuiQ';
    //var theAccountAlias = 'WFAD';

    var theToken;
    var theAccountAlias;

    var theAuth = JSON.parse(sessionStorage.getItem('auth'));
    if (null === theAuth) {
        window.location.replace("/index.html");
    } else {
        theToken = theAuth.bearerToken;
        theAccountAlias = theAuth.accountAlias;

        if (null === theToken || null === theAccountAlias) {
            window.location.replace("/index.html");
        }
    }

    var creds = {
        token: theToken,
        accountAlias: theAccountAlias
    };

    console.log(creds);

    var theRunnerInstance = new RNR.Runner(creds);

    theRunnerInstance.context.endpoint = DEV_CONTEXT_INTERNAL;

    return {
        getRunnerInstance: function () {
            //return runner;
            return theRunnerInstance;
        }
    };
});
