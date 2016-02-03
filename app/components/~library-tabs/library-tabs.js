define(['knockout', 'jquery', 'text!./library-tabs.html', 'fixtures'], function (ko, jquery, template, fixtures) {

    var tabsConfig = [
        {
            title: 'public',
            component: 'playbooks-public',
            count: '13'
        },
        {
            title: 'private',
            component: 'playbooks-private',
            count: '3'
        }
    ];

    function Tab(tabData, selectedTab) {
        this.title = ko.observable(tabData.title || '—');
        this.count = ko.observable(tabData.count || '0');
        this.titleString = ko.computed(function() {
            return this.title() + ' (' + this.count() + ')';
        }, this);

        this.isSelected = ko.computed(function() {
            return this === selectedTab();
        }, this);
    }

    function LibraryTabsViewModel() {
        var self = this;

        self.selectedTab = ko.observable();
        self.tabs = ko.observableArray();

        tabsConfig.forEach(function (tabData) {
            var tabObject = new Tab(tabData, self.selectedTab);
            self.tabs.push(tabObject);
        });

        //inialize with first tab selected
        self.selectedTab(self.tabs()[0]);

        self.getTemplate = function(item) {
            var selected = self.selectedTab().component;
            //var template = selected && selected.title;
            //console.log("template", template);
            return "playbooks-public";
            //return selected;
        };

        //self.selectedView = ko.computed(function () {
        //    return self.selectedTab().component;
        //}, this);


    }

    return {
        viewModel: LibraryTabsViewModel,
        template: template
    };
});
