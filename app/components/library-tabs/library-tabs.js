define(['knockout', 'jquery', 'text!./library-tabs.html', 'fixtures'], function (ko, jquery, template, fixtures) {

    var tabsConfig = [
        {
            title: 'public',
            count: '13'
        },
        {
            title: 'private',
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
            var selected = self.selectedTab();
            return selected && selected.title;
        };
    }

    return {
        viewModel: LibraryTabsViewModel,
        template: template
    };
});
