(function(window, undefined) {
    var $ = this.jQuery,
        ko = this.ko,
        console = this.console;
    var helpers, libraries;

    helpers = {};

    libraries = {
        jquery: true,
        jqueryUi: true,
        knockout: true,
        knockoutValidation: true
    };

    helpers.calculatePasswordStrength = function(password) {
        var charTypes, lower, number, special, strength, upper;
        upper = /[A-Z]/;
        lower = /[a-z]/;
        number = /[0-9]/;
        special = /[\~\!\@\#\$\%\^\&\*\_\-\+\=\|\\\(\)\{\}\[\]\:<>\,\.\?\/]/;
        charTypes = 0;
        strength = 0;
        if (lower.test(password)) {
            charTypes++;
        }
        if (upper.test(password)) {
            charTypes++;
        }
        if (number.test(password)) {
            charTypes++;
        }
        if (special.test(password)) {
            charTypes++;
        }
        if (password.length < 8) {
            strength = 0;
        } else if (charTypes < 3) {
            strength = 1;
        } else if (password.length === 8 && charTypes === 3) {
            strength = 2;
        } else if (password.length <= 9 && charTypes === 3) {
            strength = 3;
        } else if (password.length >= 9 && charTypes === 4) {
            strength = 4;
        } else {
            strength = 0;
        }
        return strength;
    };

    helpers.containsAny = function(value, possibilitiesArray) {
        var contained, ps;
        ps = ko.unwrap(possibilitiesArray);
        if (typeof ps === 'string') {
            ps = ps.split('');
        }
        if (!$.isArray(ps)) {
            throw 'Possibilities must me an array or string, they may be observable';
        }
        ps = $.unique(ps);
        contained = [];
        ps.forEach(function(c) {
            if (value.indexOf(c) >= 0) {
                contained.push(c);
            }
        });
        return contained;
    };

    helpers.hasItems = function(data) {
        data = ko.unwrap(data);
        return data && data.length && data.length > 0;
    };

    helpers.isDeferred = function(data) {
        if (data !== null && typeof data.then === 'function') {
            return true;
        } else {
            return false;
        }
    };

    if (typeof $ === "undefined" || $ === null) {
        libraries.jquery = false;
        console.error('jQuery is required, please make sure it is included before the cyclops script.');
    }

    if (typeof ko === "undefined" || ko === null) {
        libraries.knokcout = false;
        console.error('knokcout is required, please make sure it is included before the cyclops script.');
    }

    if ($.ui == null) {
        libraries.jqueryUi = false;
        console.log('jQuery UI is not referenced or is referenced after cyclops some parts of cyclops may not be avalible.');
    }

    if (ko.validation == null) {
        libraries.knockoutValidation = false;
        console.log('knockout validation is not referenced or is referenced after cyclops some parts of cyclops may not be avalible.');
    }


    /**
     * Cast value as observable, if it already is then just return otherwise wrap it in an observable
     */
    ko.asObservable = function(value) {
        if (ko.isObservable(value)) {
            return value;
        } else {
            return ko.observable(value);
        }
    };


    /**
     * Cast value as observableArray, if it already is then just return otherwise wrap it in an observableArray
     */

    ko.asObservableArray = function(value) {
        if (ko.isObservable(value)) {
            return value;
        } else {
            return ko.observableArray(value);
        }
    };

    var _sortBy;

    _sortBy = function(array, propName, isDesc) {
        array.sort(function(a, b) {
            var propA, propB;
            propA = ko.unwrap(a[propName]);
            propB = ko.unwrap(b[propName]);
            if ((propA != null) && (propB != null)) {
                if (propA > propB) {
                    if (isDesc) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else if (propA < propB) {
                    if (isDesc) {
                        return 1;
                    } else {
                        return -1;
                    }
                } else {
                    return 0;
                }
            } else {
                throw 'each item in the array must have the property you are sorting on';
            }
        });
        return array;
    };

    ko.filterableArray = function(initValues, options) {
        var result;
        options = $.extend({
            fields: ['name', 'description', 'id'],
            comparer: function(query, item) {
                var match;
                item = ko.unwrap(item);
                if (typeof query !== 'string') {
                    throw 'The default comparer only supports string queries, you can provide your own comparer to support object queries';
                }
                query = query.toLowerCase();
                if (typeof item === 'string') {
                    return item.toLowerCase().indexOf(query) > -1;
                } else if (typeof item === 'object') {
                    match = false;
                    options.fields.forEach(function(p) {
                        if (item.hasOwnProperty(p) && options.comparer(query, item[p])) {
                            return match = true;
                        }
                    });
                    return match;
                } else {
                    return query === item.toString();
                }
            }
        }, options);
        result = ko.pureComputed({
            read: function() {
                var query;
                if (result._sorter() != null) {
                    result.all.sort(result._sorter());
                }
                if (result.query()) {
                    query = result.query();
                    return result.all().filter(function(value) {
                        return options.comparer(query, value);
                    });
                }
                return result.all();
            },
            write: function(value) {
                return result.all(value);
            }
        });
        result.all = ko.asObservableArray(initValues);
        result.query = ko.observable();
        result._sorter = ko.observable(null);
        result.isSorting = ko.pureComputed(function() {
            return result._sorter() != null;
        });
        result.clearSort = function() {
            return result._sorter(null);
        };
        result.isFilterableArray = true;
        result.length = 0;
        result.sortByString = function(propName) {
            return result._sorter(function(a, b) {
                var propA, propB;
                propA = ko.unwrap(a[propName]);
                propB = ko.unwrap(b[propName]);
                if ((propA != null) && (propB != null)) {
                    if (propA > propB) {
                        return 1;
                    } else if (propA < propB) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else {
                    throw 'each item in the array must have the property you are sorting on';
                }
            });
        };
        result.sortByStringDesc = function(propName) {
            return result._sorter(function(a, b) {
                var propA, propB;
                propA = ko.unwrap(a[propName]);
                propB = ko.unwrap(b[propName]);
                if ((propA != null) && (propB != null)) {
                    if (propA > propB) {
                        return -1;
                    } else if (propA < propB) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    throw 'each item in the array must have the property you are sorting on';
                }
            });
        };
        result.sort = function(func) {
            if (func != null) {
                return result._sorter(func);
            } else {
                throw 'you need to specify a sort function when using sort on a filterableArray';
            }
        };
        ['pop', 'push', 'reverse', 'shift', 'splice', 'unshift', 'slice', 'replace', 'indexOf', 'destroy', 'destroyAll', 'remove', 'removeAll'].forEach(function(method) {
            return result[method] = function() {
                return result.all[method].apply(result.all, arguments);
            };
        });
        return result;
    };


    /*
     * An observable that tracks an edits
     * @param initValue The initial value of the observable
     */
    ko.trackableObservable = function(initValue) {
        var result;
        initValue = ko.unwrap(initValue);
        result = ko.observable(initValue);

        /*
         * The previous valued that has been marked as `initial` or `committed`
         */
        result.committedValue = ko.observable(initValue);

        /*
         * Commit the current value as the new commited value.
         * e.g. when your save completes and you want to reset to this value.
         * @function
         */
        result.commit = function() {
            result.committedValue(result());
        };

        /*
         * Reset the current value to the initial value
         * @function
         */
        result.reset = function() {
            result(result.committedValue());
            if (result.isModified) {
                result.isModified(false);
            }
        };
        result.isTrackableObservable = true;
        return result;
    };


    /*
     * An observable that tracks an edits
     * @param initValues The initial array of the observable
     */
    ko.trackableObservableArray = function(initValues) {
        var initArray, oldValues, result;
        initArray = ko.unwrap(initValues) || [];
        oldValues = initArray.slice();
        result = ko.observableArray(initValues);

        /*
         * The previous array that has been marked as `initial` or `committed`
         */
        result.committedValue = ko.observableArray(initArray.slice());

        /*
         * Commit the current array as the new commited array.
         * e.g. when your save completes and you want to reset to this array.
         * @function
         */
        result.commit = function() {
            result.committedValue(result());
        };

        /*
         * Reset the current array to the initial array
         * @function
         */
        result.reset = function() {
            $.each(oldValues, function() {
                if (this.reset) {
                    this.reset();
                }
            });
            result(oldValues.slice());
            if (result.isModified) {
                result.isModified(false);
            }
        };
        result.isTrackableObservableArray = true;
        return result;
    };


    /*
     * renders when the collection has items. Can be used
     * on with virtual elements.
     * @param anyArray any array observable or not
     * @example <!-- ko any: collection -->content<!-- /ko -->
     */
    ko.bindingHandlers.any = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            return ko.bindingHandlers['if']['init'](element, (function() {
                return ko.computed(function() {
                    return helpers.hasItems(valueAccessor());
                });
            }), allBindings, viewModel, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.any = true;

    ko.bindingHandlers.asyncMessage = {
        init: function(element, valueAccessor) {
            var $element, options, possible;
            options = {
                validating: 'checking availability...',
                valid: 'available'
            };
            possible = valueAccessor();
            $element = $(element);
            if (ko.isObservable(possible)) {
                $.extend(options, {
                    value: possible
                });
            } else {
                $.extend(options, possible);
            }
            $element.addClass('async-message');
            $element.html('<span class=\'validating hide\'>' + ko.unwrap(options.validating) + '</span>' + '<span class=\'valid hide\'>' + ko.unwrap(options.valid) + '</span>');
        },
        update: function(element, valueAccessor) {
            var $element, observable, possible;
            $element = $(element);
            possible = valueAccessor();
            observable = void 0;
            if (ko.isObservable(possible)) {
                observable = possible;
            } else {
                observable = possible.value;
                if (ko.isObservable(possible.validating)) {
                    $element.find('.validating').html(possible.validating());
                }
                if (ko.isObservable(possible.valid)) {
                    $element.find('.valid').html(possible.valid());
                }
            }
            $element.find('.validating, .valid').hide();
            if (observable.isValidating()) {
                $element.find('.validating').show();
            } else if (observable.isValid()) {
                $element.find('.valid').show();
            }
        }
    };

    ko.bindingHandlers.console = {
        update: function(element, valueAccessor) {
            console.log(ko.unwrap(valueAccessor()));
        }
    };

    ko.virtualElements.allowedBindings.console = true;


    /*
     * renders when the collection is empty. Can be used
     * on with virtual elements.
     * @param anyArray any array observable or not
     * @example <!-- ko empty: collection -->content<!-- /ko -->
     */
    ko.bindingHandlers.empty = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            return ko.bindingHandlers['if']['init'](element, (function() {
                return ko.computed(function() {
                    return !helpers.hasItems(valueAccessor());
                });
            }), allBindings, viewModel, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.empty = true;

    ko.bindingHandlers.fadeSlide = {
        update: function(element, valueAccessor) {
            var afterAnimation, duration, isCurrentlyVisible, shouldShow, value;
            value = ko.unwrap(valueAccessor()) || false;
            shouldShow = false;
            duration = 300;
            isCurrentlyVisible = $(element).css('display') !== 'none';
            afterAnimation = valueAccessor().afterAnimation;
            if (typeof value === 'object') {
                if (value.visible != null) {
                    shouldShow = ko.unwrap(value.visible);
                } else {
                    throw new Error('You need to have a visible value... ');
                }
                duration = value.duration || duration;
            } else {
                shouldShow = value;
            }
            if (shouldShow && !isCurrentlyVisible) {
                $(element).stop(true, true).fadeIn({
                    duration: duration,
                    queue: false
                }).css('display', 'none').slideDown(duration, function() {
                    if (typeof afterAnimation === 'function') {
                        afterAnimation.call();
                    }
                });
            } else if (!shouldShow && isCurrentlyVisible) {
                $(element).stop(true, true).fadeOut({
                    duration: duration,
                    queue: false
                }).slideUp(duration, function() {
                    if (typeof afterAnimation === 'function') {
                        afterAnimation.call();
                    }
                });
            }
        }
    };

    ko.bindingHandlers.fadeVisible = {
        update: function(element, valueAccessor) {
            var afterAnimation, isCurrentlyVisible, options, shouldShow, value;
            value = ko.unwrap(valueAccessor()) || false;
            shouldShow = false;
            options = {
                duration: 500
            };
            isCurrentlyVisible = element.style.display !== 'none';
            afterAnimation = valueAccessor().afterAnimation;
            if (typeof value === 'object') {
                if (value.visible) {
                    shouldShow = ko.unwrap(value.visible);
                } else {
                    throw new Error('You need to have a visible value... ');
                }
                options.duration = value.duration || options.duration;
                options = $.extend(options, value.options || {});
            } else {
                shouldShow = value;
            }
            if (shouldShow && !isCurrentlyVisible) {
                $(element).stop().fadeIn(options, function() {
                    if (typeof afterAnimation === 'function') {
                        afterAnimation.call();
                    }
                });
            } else if (!shouldShow && isCurrentlyVisible) {
                if (value.fadeOut === void 0 || value.fadeOut) {
                    $(element).stop().fadeOut(options, function() {
                        if (typeof afterAnimation === 'function') {
                            afterAnimation.call();
                        }
                    });
                } else {
                    element.style.display = 'none';
                }
            }
        }
    };


    /*
     * renders href attrribute
     * @param url the url to be placed in the href
     * @example <a data-bind='href: model.url'></a>
     */
    ko.bindingHandlers.href = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            return ko.bindingHandlers['attr']['update'](element, (function() {
                return {
                    href: valueAccessor()
                };
            }), allBindings, viewModel, bindingContext);
        }
    };


    /*
     * renders href attrribute
     * @param true or false to add the indeterminate property
     * @example <input type='checkbox' data-binding='indeterminate: model.indeterminate'></a>
     */
    ko.bindingHandlers.indeterminate = {
        update: function(element, valueAccessor) {
            var value;
            value = ko.unwrap(valueAccessor());
            return $(element).prop("indeterminate", value);
        }
    };

    var _scrollIntoView;

    _scrollIntoView = function(element) {
        var $element, $parent, elementBottom, elementTop, parentBottom, parentTop;
        $element = $(element);
        $parent = $element.parents('.scroll-area');
        parentTop = $parent.offset().top;
        elementTop = $element.offset().top;
        parentBottom = parentTop + $parent.height();
        elementBottom = elementTop + $element.outerHeight();
        if (elementBottom > parentBottom) {
            $element[0].scrollIntoView(false);
        } else if (elementTop < parentTop) {
            $element[0].scrollIntoView();
        }
    };

    ko.bindingHandlers.scrollTo = {
        update: function(element, valueAccessor) {
            var value;
            value = ko.unwrap(valueAccessor()) || false;
            if (value) {
                return _scrollIntoView(element);
            }
        }
    };

    ko.bindingHandlers.slide = {
        update: function(element, valueAccessor) {
            var afterAnimation, duration, isCurrentlyVisible, shouldShow, value;
            value = ko.unwrap(valueAccessor()) || false;
            shouldShow = false;
            duration = 300;
            isCurrentlyVisible = $(element).css('display') !== 'none';
            afterAnimation = valueAccessor().afterAnimation;
            if (typeof value === 'object') {
                if (value.visible != null) {
                    shouldShow = ko.unwrap(value.visible);
                } else {
                    throw new Error('You need to have a visible value... ');
                }
                duration = value.duration || duration;
            } else {
                shouldShow = value;
            }
            if (shouldShow && !isCurrentlyVisible) {
                $(element).stop(true, true).css('display', 'none').slideDown(duration, function() {
                    if (typeof afterAnimation === 'function') {
                        afterAnimation.call();
                    }
                });
            } else if (!shouldShow && isCurrentlyVisible) {
                $(element).stop(true, true).slideUp(duration, function() {
                    if (typeof afterAnimation === 'function') {
                        afterAnimation.call();
                    }
                });
            }
        }
    };

    ko.bindingHandlers.templateSwitcher = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var binding, displayTemplate, errorTemplate, hasErrored, isLoading, loadingTemplate, newValueAccessor, noContentTemplate, templateInfo, templateToRender, value;
            binding = ko.unwrap(valueAccessor());
            isLoading = ko.unwrap(binding.loading);
            hasErrored = ko.unwrap(binding.error) || false;
            value = ko.unwrap(binding.value);
            templateInfo = binding.templates || {};
            loadingTemplate = templateInfo.loading || 'cyclops.templateSwitcherLoadingTemplate';
            noContentTemplate = templateInfo.empty || 'cyclops.templateSwitcherEmptyTemplate';
            errorTemplate = templateInfo.error || 'cyclops.templateSwitcherErrorTemplate';
            displayTemplate = templateInfo.display;
            if (displayTemplate === void 0 || displayTemplate === null) {
                throw 'You Must define a display template. e.g. templates: { display: \'myTemplate\' }';
            }
            templateToRender = void 0;
            if (isLoading) {
                templateToRender = loadingTemplate;
            } else if (hasErrored) {
                templateToRender = errorTemplate;
            } else {
                if ($.isArray(value) && value.length < 1) {
                    templateToRender = noContentTemplate;
                } else if (!value) {
                    templateToRender = noContentTemplate;
                } else {
                    templateToRender = displayTemplate;
                }
            }
            newValueAccessor = function() {
                return templateToRender;
            };
            ko.bindingHandlers['template']['update'](element, newValueAccessor, allBindings, viewModel, bindingContext);
        }
    };

    ko.virtualElements.allowedBindings.templateSwitcher = true;


    /*
     * renders href attrribute
     * @param title to be displayed
     * @example <a data-bind='title: model.title'></a>
     */
    ko.bindingHandlers.title = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            return ko.bindingHandlers['attr']['update'](element, (function() {
                return {
                    title: valueAccessor()
                };
            }), allBindings, viewModel, bindingContext);
        }
    };

    ko.bindingHandlers.validationMsg = {
        init: function(element) {
            var $element;
            $element = $(element);
            $element.css({
                display: 'none'
            });
            $element.removeClass('hide');
            $element.addClass('validationMessage');
        },
        update: function(element, valueAccessor) {
            var $element, config, error, isCurrentlyVisible, isModified, isValid, isVisible, obsv;
            obsv = valueAccessor();
            config = libraries.knockoutValidation ? ko.validation.utils.getConfigOptions(element) : {};
            isModified = false;
            isValid = false;
            $element = $(element);
            if (obsv === null || typeof obsv === 'undefined') {
                throw new Error('Cannot bind validationMessage to undefined value. data-bind expression: ' + element.getAttribute('data-bind'));
            }
            if ($element.data('debounce')) {
                window.clearTimeout($(element).data('debounce'));
            }
            isModified = obsv.isModified && obsv.isModified();
            isValid = obsv.isValid && obsv.isValid();
            error = null;
            if (!config.messagesOnModified || isModified) {
                error = isValid ? null : obsv.error;
            }
            isVisible = !config.messagesOnModified || isModified ? !isValid : false;
            isCurrentlyVisible = element.style.display !== 'none';
            if (config.allowHtmlMessages) {
                ko.utils.setHtml(element, error);
            } else {
                ko.bindingHandlers.text.update(element, function() {
                    return error;
                });
            }
            if (isCurrentlyVisible && !isVisible) {
                $element.data('debounce', window.setTimeout((function() {
                    $element.stop().animate({
                        opacity: 'hide',
                        height: 'hide',
                        margin: 'hide',
                        padding: 'hide'
                    }, 200, (libraries.jqueryUi ? 'easeInOutQuad' : 'swing'));
                }), 30));
            } else if (!isCurrentlyVisible && isVisible) {
                $element.data('debounce', window.setTimeout((function() {
                    $element.stop().animate({
                        opacity: 'show',
                        height: 'show',
                        margin: 'show',
                        padding: 'show'
                    }, 200, (libraries.jqueryUi ? 'easeInOutQuad' : 'swing'));
                }), 30));
            }
        }
    };

    var _getWidgetBindings;

    _getWidgetBindings = function(element, valueAccessor, allBindingsAccessor) {
        var allBindings, disabled, enabled, myBinding, value, widgetName, widgetOptions;
        value = valueAccessor();
        myBinding = ko.unwrap(value);
        allBindings = allBindingsAccessor();
        if (typeof myBinding === 'string') {
            myBinding = {
                'name': myBinding
            };
        }
        widgetName = myBinding.name;
        widgetOptions = myBinding.options;
        disabled = myBinding.disabled;
        enabled = myBinding.enabled;
        if (typeof $.fn[widgetName] !== 'function') {
            throw new Error('widget binding doesn\'t recognize \'' + widgetName + '\' as jQuery UI widget');
        }
        if (allBindings.options && !widgetOptions && element.tagName !== 'SELECT') {
            throw new Error('widget binding options should be specified like this:\ndata-bind=\'widget: {name:"' + widgetName + '", options:{...} }\'');
        }
        return {
            widgetName: widgetName,
            widgetOptions: widgetOptions,
            disabled: disabled,
            enabled: enabled
        };
    };

    ko.bindingHandlers.widget = {
        update: function(element, valueAccessor, allBindingsAccessor) {
            var subscribeToDisabledIfSet, subscribeToEnabledIfSet, updateDisabled, widgetBindings;
            widgetBindings = _getWidgetBindings(element, valueAccessor, allBindingsAccessor);
            updateDisabled = function(disabled) {
                var methodName;
                methodName = disabled ? 'disable' : 'enable';
                $(element)[widgetBindings.widgetName](methodName);
            };
            subscribeToDisabledIfSet = function(disabled) {
                if (disabled === void 0 || disabled === null) {
                    return;
                }
                if (ko.isObservable(disabled)) {
                    disabled.subscribe(function(newValue) {
                        updateDisabled(newValue);
                    });
                }
                updateDisabled(ko.unwrap(disabled));
            };
            subscribeToEnabledIfSet = function(enabled) {
                if (enabled === void 0 || enabled === null) {
                    return;
                }
                if (ko.isObservable(enabled)) {
                    enabled.subscribe(function(newValue) {
                        updateDisabled(!newValue);
                    });
                }
                updateDisabled(!ko.unwrap(enabled));
            };
            $(element)[widgetBindings.widgetName](widgetBindings.widgetOptions);
            subscribeToDisabledIfSet(widgetBindings.disabled);
            subscribeToEnabledIfSet(widgetBindings.enabled);
        }
    };

    $.fn.actionToolbarConfirm = function(options) {
        options = $.extend({
            messageHtml: "Are you sure?",
            yesHtml: '<svg class="cyclops-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-check"></use></svg> yes',
            noHtml: '<svg class="cyclops-icon"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-times"></use></svg> no',
            timeout: 3000,
            easing: libraries.jqueryUi ? 'easeInOutQuad' : 'swing',
            classes: "action-toolbar-confirm-primary"
        }, options);
        return $(this).each(function(idx, action) {
            var $action, $actions, $area, $confirm, $noBtn, $yesBtn, events, reset, show, timeoutTracker;
            $action = $(action);
            $confirm = $("<div class='action-toolbar-confirm " + options.classes + "'> <div class='buttons'> <button class='yes'>" + options.yesHtml + "</button><button class='no'>" + options.noHtml + "</button> </div> <div class='message'>" + options.messageHtml + "</div> </div>");
            $confirm.hide();
            $yesBtn = $confirm.find('.yes');
            $noBtn = $confirm.find('.no');
            $area = $action.parents('.action-area');
            $actions = $area.find('.action-toolbar, .action-toolbar-left, .action-toolbar-right');
            timeoutTracker = null;
            $area.append($confirm);
            reset = function(event) {
                if (event) {
                    event.preventDefault();
                }
                $actions.animate({
                    'margin-top': 0
                }, {
                    duration: 200,
                    easing: options.easing,
                    complete: function() {
                        $area.removeClass("action-toolbar-confirm-shown");
                        return $confirm.hide();
                    }
                });
            };
            show = function(event) {
                if (event) {
                    event.preventDefault();
                }
                if ($action.is(':disabled')) {
                    return;
                }
                $confirm.show();
                $area.addClass("action-toolbar-confirm-shown");
                $actions.animate({
                    'margin-top': -40
                }, {
                    duration: 200,
                    easing: options.easing
                });
            };
            $confirm.hover(function() {
                if (timeoutTracker) {
                    return window.clearTimeout(timeoutTracker);
                }
            }, function() {
                return timeoutTracker = window.setTimeout(reset, options.timeout);
            });
            events = $._data($action[0], "events");
            if (events) {
                events.click.forEach(function(c) {
                    $yesBtn.on("click", c.handler);
                });
            }
            $yesBtn.on("click", reset);
            $noBtn.on("click", reset);
            $action.off("click");
            return $action.on("click", show);
        });
    };

    $.fn.inlineConfirm = function(options) {
        options = $.extend({
            messageHtml: "Are you sure?",
            yesHtml: "YES",
            noHtml: "NO",
            timeout: 3000
        }, options);
        $(this).each(function(idx, btn) {
            var $btn, $confirmContainer, $container, $message, $noBtn, $viewport, $yesBtn, buttonHeight, float, reset, show, timeoutTracker, topAmount;
            $btn = $(btn);
            $container = $("<div class='inline-confirm'>" + "<div class='viewport'>" + "<div class='confirmation-container'>" + "<span class='message'>Are you sure?</span>" + "<button class='btn btn-default no'></button>" + "<button class='yes'></button>" + "</div>" + "</div>" + "</div>");
            $viewport = $container.find(".viewport");
            $confirmContainer = $container.find(".confirmation-container");
            $message = $container.find(".message");
            $yesBtn = $container.find(".yes");
            $noBtn = $container.find(".no");
            timeoutTracker = null;
            $message.html(options.messageHtml);
            $yesBtn.html(options.yesHtml);
            $noBtn.html(options.noHtml);
            float = $btn.css("float");
            $btn.attr("class").split(" ").forEach(function(c) {
                if (c.indexOf("btn") !== 0) {
                    $container.addClass(c);
                    return $btn.removeClass(c);
                } else {
                    return $yesBtn.addClass(c);
                }
            });
            $btn.css("float", float);
            $btn.addClass("original-button");
            $confirmContainer.css("float", float);
            buttonHeight = $btn.innerHeight();
            topAmount = (buttonHeight * -1) + -5;
            $container.height(buttonHeight);
            $container.insertBefore($btn);
            $btn.insertBefore($confirmContainer);
            reset = function(event) {
                if (event) {
                    event.preventDefault();
                }
                $btn.animate({
                    opacity: 1
                }, 100);
                $confirmContainer.animate({
                    opacity: 0
                }, 200);
                $viewport.animate({
                    top: 0
                }, 200);
                if (timeoutTracker) {
                    return window.clearTimeout(timeoutTracker);
                }
            };
            show = function(event) {
                if (event) {
                    event.preventDefault();
                }
                $btn.animate({
                    opacity: 0
                }, 200);
                $confirmContainer.animate({
                    opacity: 1
                }, 200);
                return $viewport.animate({
                    top: topAmount
                }, 200);
            };
            $confirmContainer.hover(function() {
                if (timeoutTracker) {
                    return window.clearTimeout(timeoutTracker);
                }
            }, function() {
                return timeoutTracker = window.setTimeout(reset, options.timeout);
            });
            $._data($btn[0], "events").click.forEach(function(c) {
                $yesBtn.on("click", c.handler);
            });
            $yesBtn.on("click", reset);
            $noBtn.on("click", reset);
            $btn.off("click");
            $btn.on("click", function(event) {
                event.preventDefault();
                return show();
            });
        });
        return $(this);
    };

    var adjustoverflowMenu, flexObjects, resizeTimeout;

    flexObjects = [];

    resizeTimeout = void 0;

    adjustoverflowMenu = function() {
        $(flexObjects).each(function() {
            $(this).overflowMenu({
                'undo': true
            }).overflowMenu(this.options);
        });
    };

    $(window).resize(function() {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout((function() {
            adjustoverflowMenu();
        }), 200);
    });

    $.fn.overflowMenu = function(options) {
        var checkFlexObject, s;
        checkFlexObject = void 0;
        s = $.extend({
            'threshold': 2,
            'cutoff': 0,
            'linkText': 'more&hellip;',
            'linkTitle': 'View More',
            'linkTextAll': 'actions&hellip;',
            'linkTitleAll': 'Open/Close Menu',
            'undo': false
        }, options);
        this.options = s;
        checkFlexObject = $.inArray(this, flexObjects);
        if (checkFlexObject >= 0) {
            flexObjects.splice(checkFlexObject, 1);
        } else {
            flexObjects.push(this);
        }
        return this.each(function() {
            var $firstItem, $items, $lastChild, $lastItem, $menu, $moreItem, $popup, $this, allInPopup, button, firstItemHeight, firstItemTop, i, keepLooking, li, needsMenu, numItems, numToRemove;
            $this = $(this);
            $items = $this.find('> li');
            $firstItem = $items.first();
            $lastItem = $items.last();
            numItems = $this.find('li').length;
            firstItemTop = Math.floor(($firstItem.offset() || {}).top);
            firstItemHeight = Math.floor($firstItem.outerHeight(true));
            $lastChild = void 0;
            keepLooking = void 0;
            $moreItem = void 0;
            numToRemove = void 0;
            allInPopup = false;
            $menu = void 0;
            i = void 0;
            needsMenu = function($itemOfInterest) {
                var result;
                if ($itemOfInterest.length < 1) {
                    return false;
                }
                result = Math.ceil($itemOfInterest.offset().top) >= firstItemTop + firstItemHeight ? true : false;
                return result;
            };
            if (needsMenu($lastItem) && numItems > s.threshold && !s.undo && $this.is(':visible')) {
                $popup = $('<ul class="dropdown-menu"></ul>');
                i = numItems;
                while (i > 1) {
                    $lastChild = $this.find('> li:last-child');
                    keepLooking = needsMenu($lastChild);
                    $lastChild.appendTo($popup);
                    if (i - 1 <= s.cutoff) {
                        $($this.children().get().reverse()).appendTo($popup);
                        allInPopup = true;
                        break;
                    }
                    if (!keepLooking) {
                        break;
                    }
                    i--;
                }
                if (allInPopup) {
                    button = $("<a role='button' href='#' title='" + s.linkTitleAll + "'>" + s.linkTextAll + " <svg class='cyclops-icon'><use xlink:href='#icon-caret-down'></svg></a>");
                } else {
                    $popup.addClass('dropdown-menu-right');
                    button = $("<a role='button' href='#' title='" + s.linkTitle + "'>" + s.linkText + " <svg class='cyclops-icon'><use xlink:href='#icon-caret-down'></svg></a>");
                }
                button.dropdown();
                li = $('<li class="dropdown overflow-menu"></li>');
                li.append(button);
                $this.append(li);
                $moreItem = $this.find('> li.overflow-menu');
                if (needsMenu($moreItem)) {
                    $this.find('> li:nth-last-child(2)').appendTo($popup);
                }
                $popup.children().each(function(i, li) {
                    $popup.prepend(li);
                });
                $moreItem.append($popup);
            } else if (s.undo && $this.find('ul.dropdown-menu')) {
                $menu = $this.find('ul.dropdown-menu');
                numToRemove = $menu.find('li').length;
                i = 1;
                while (i <= numToRemove) {
                    $menu.find('> li:first-child').appendTo($this);
                    i++;
                }
                $menu.remove();
                $this.find('> li.dropdown').remove();
            }
        });
    };

    $.fn.passwordStrength = function(options) {
        $(this).each(function(idx, input) {
            var $input, container, messageBlock, strength;
            options = $.extend({}, options);
            $input = $(input);
            container = options.messageContainer ? $(options.messageContainer) : $('<p class=\'password-strength\'></p>');
            messageBlock = $('<span class=\'strength\'></span>');
            container.text('password strength: ');
            container.append(messageBlock);
            if (!options.messageContainer) {
                container.insertAfter($input);
            }
            strength = 0;
            $input.on('input', function() {
                strength = helpers.calculatePasswordStrength($input.val());
                messageBlock.removeClass('strong');
                messageBlock.removeClass('good');
                messageBlock.removeClass('weak');
                if ($input.val().length < 1) {
                    messageBlock.text('');
                } else if (strength >= 4) {
                    messageBlock.text('Strong');
                    messageBlock.addClass('strong');
                } else if (strength >= 3) {
                    messageBlock.text('Good');
                    messageBlock.addClass('good');
                } else {
                    messageBlock.text('Weak');
                    messageBlock.addClass('weak');
                }
            });
        });
    };

    var GroupPickerViewModel;

    GroupPickerViewModel = (function() {
        function GroupPickerViewModel(options) {
            options = options || {};
            this.defaultShouldShow = function(group) {
                if (group.type != null) {
                    return ko.unwrap(group.type) === 'default';
                } else {
                    return true;
                }
            };
            this.shouldShow = options.shouldShow != null ? options.shouldShow : this.defaultShouldShow;
            this.groups = ko.asObservableArray(options.groups != null ? options.groups : []);
            this.isLoading = ko.asObservable(options.isLoading != null ? options.isLoading : false);
            this.loadingHtmlMessage = ko.asObservable(options.loadingHtmlMessage != null ? options.loadingHtmlMessage : "Fetching Groups&hellip;");
            this.emptyHtmlMessage = ko.asObservable(options.emptyHtmlMessage != null ? options.emptyHtmlMessage : "No Groups");
            this.selected = ko.asObservable(options.selectedGroup);
        }

        return GroupPickerViewModel;

    })();

    var ServerPickerGroupViewModel, ServerPickerServerViewModel, ServerPickerViewModel;

    ServerPickerGroupViewModel = (function() {
        function ServerPickerGroupViewModel(group, options) {
            var _doesntMatter;
            this.rawGroup = group;
            this.state = ko.observable('unchecked');
            this.isChecked = ko.computed((function(_this) {
                return function() {
                    return _this.state() === 'checked';
                };
            })(this));
            this.isIndeterminate = ko.computed((function(_this) {
                return function() {
                    return _this.state() === 'indeterminate';
                };
            })(this));
            this.selectable = ko.computed((function(_this) {
                return function() {
                    return _this.state() !== 'notSelectable';
                };
            })(this));
            this.rawServers = ko.asObservableArray(group.servers != null ? group.servers : []);
            this.allRawGroups = ko.asObservableArray(group.groups != null ? group.groups : []);
            this.rawGroups = ko.computed((function(_this) {
                return function() {
                    return _this.allRawGroups().filter(options.shouldShowGroup);
                };
            })(this));
            this.groups = ko.computed((function(_this) {
                return function() {
                    return _this.rawGroups().map(function(g) {
                        return new ServerPickerGroupViewModel(g, options);
                    });
                };
            })(this));
            this.selectableGroups = ko.computed((function(_this) {
                return function() {
                    return _this.groups().filter(function(g) {
                        return g.state() !== 'notSelectable';
                    });
                };
            })(this));
            this.servers = ko.computed((function(_this) {
                return function() {
                    return _this.rawServers().map(function(s) {
                        return new ServerPickerServerViewModel(s, options);
                    });
                };
            })(this));
            this.selectableServers = ko.computed((function(_this) {
                return function() {
                    return _this.servers().filter(function(s) {
                        return s.selectable();
                    });
                };
            })(this));
            this.setServersAndGroups = function(checked) {
                this.selectableGroups().forEach((function(_this) {
                    return function(g) {
                        return g.setServersAndGroups(checked);
                    };
                })(this));
                return this.servers().forEach((function(_this) {
                    return function(s) {
                        if (s.selectable()) {
                            return s.isChecked(checked);
                        }
                    };
                })(this));
            };
            this.clickHandler = (function(_this) {
                return function(group, event) {
                    var checkbox, checked;
                    checkbox = $(event.target);
                    checked = checkbox.prop('checked');
                    _this.setServersAndGroups(checked);
                    return true;
                };
            })(this);
            this.title = ko.computed((function(_this) {
                return function() {
                    if (_this.selectable()) {
                        return options.getGroupTitle(_this.rawGroup);
                    } else {
                        return 'Groups that have no decendent server are not selectable.';
                    }
                };
            })(this));
            this.allServers = ko.computed((function(_this) {
                return function() {
                    var servers;
                    servers = _this.selectableServers();
                    _this.selectableGroups().forEach(function(g) {
                        servers = servers.concat(g.servers());
                    });
                    return servers;
                };
            })(this));
            _doesntMatter = ko.computed((function(_this) {
                return function() {
                    var checkedGroups, indeterminateGroups, selectableGroups, selectableServers, selectedServers, uncheckedGroups;
                    if (!options.multiSelect()) {
                        return;
                    }
                    checkedGroups = [];
                    indeterminateGroups = [];
                    uncheckedGroups = [];
                    selectableGroups = _this.selectableGroups();
                    selectableServers = _this.selectableServers();
                    selectedServers = selectableServers.filter(function(s) {
                        return s.isChecked();
                    });
                    selectableGroups.forEach(function(g) {
                        if (g.state.peek() === 'checked') {
                            return checkedGroups.push(g);
                        } else if (g.state.peek() === 'indeterminate') {
                            return indeterminateGroups.push(g);
                        } else {
                            return uncheckedGroups.push(g);
                        }
                    });
                    if (selectableGroups.length === 0 && selectableServers.length === 0) {
                        _this.state('notSelectable');
                    } else if (uncheckedGroups.length === selectableGroups.length && selectedServers.length === 0) {
                        _this.state('unchecked');
                    } else if (checkedGroups.length === selectableGroups.length && selectedServers.length === selectableServers.length) {
                        _this.state('checked');
                    } else if (checkedGroups.length > 0 || selectedServers.length > 0) {
                        _this.state('indeterminate');
                    }
                };
            })(this));
        }

        return ServerPickerGroupViewModel;

    })();

    ServerPickerServerViewModel = (function() {
        function ServerPickerServerViewModel(server, options) {
            this.rawServer = server;
            this.displayName = ko.asObservable(this.rawServer.displayName != null ? this.rawServer.displayName : this.rawServer.name);
            this.isChecked = ko.observable(false);
            this.title = ko.computed((function(_this) {
                return function() {
                    return options.getServerTitle(_this.rawServer);
                };
            })(this));
            this.selectable = ko.computed((function(_this) {
                return function() {
                    return options.isServerSelectable(_this.rawServer);
                };
            })(this));
        }

        return ServerPickerServerViewModel;

    })();

    ServerPickerViewModel = (function() {
        function ServerPickerViewModel(options) {
            var _doesntMatter;
            options = options || {};
            this.defaultShouldShowGroup = function(group) {
                if (group.type != null) {
                    return ko.unwrap(group.type) === 'default';
                } else {
                    return true;
                }
            };
            this.defaultIsServerSelectable = function(server) {
                return true;
            };
            this.defaultGetServerTitle = function(server) {
                return server.description;
            };
            this.defaultGetGroupTitle = function(group) {
                return group.description;
            };
            this.defaultGetServerIcon = function(state) {
                state = ko.unwrap(state);
                if (state === 'archived') {
                    return '#icon-question';
                } else if (state === 'queuedForArchive') {
                    return '#icon-question';
                } else if (state === 'deleted') {
                    return '#icon-question';
                } else if (state === 'queuedForDelete') {
                    return '#icon-question';
                } else if (state === 'queuedForRestore') {
                    return '#icon-question';
                } else if (state === 'underConstruction') {
                    return '#icon-question';
                } else if (state === 'template') {
                    return '#icon-queue';
                } else if (state === 'noDetails') {
                    return '#icon-question';
                } else if (state === 'maintenanceMode') {
                    return '#icon-maintenance';
                } else if (state === 'stopped') {
                    return '#icon-stop';
                } else if (state === 'started') {
                    return '#icon-play';
                } else if (state === 'paused') {
                    return '#icon-pause';
                } else {
                    return '#icon-question';
                }
            };
            this.allGroups = ko.asObservableArray(options.groups != null ? options.groups : []);
            this.isLoading = ko.asObservable(options.isLoading != null ? options.isLoading : false);
            this.loadingHtmlMessage = ko.asObservable(options.loadingHtmlMessage != null ? options.loadingHtmlMessage : 'Fetching Servers&hellip;');
            this.emptyHtmlMessage = ko.asObservable(options.emptyHtmlMessage != null ? options.emptyHtmlMessage : 'No Servers');
            this.selected = ko.asObservableArray(options.selectedServers);
            this.getServerIcon = options.getServerIcon != null ? options.getServerIcon : this.defaultGetServerIcon;
            this.shouldShowGroup = options.shouldShowGroup != null ? options.shouldShowGroup : this.defaultShouldShowGroup;
            this.isServerSelectable = options.isServerSelectable != null ? options.isServerSelectable : this.defaultIsServerSelectable;
            this.getServerTitle = options.getServerTitle != null ? options.getServerTitle : this.defaultGetServerTitle;
            this.getGroupTitle = options.getGroupTitle != null ? options.getGroupTitle : this.defaultGetGroupTitle;
            this.multiSelect = ko.asObservable(options.multiSelect != null ? options.multiSelect : true);
            this.templateName = ko.pureComputed((function(_this) {
                return function() {
                    if (_this.multiSelect()) {
                        return 'cyclops.serverPicker.group.multi';
                    } else {
                        return 'cyclops.serverPicker.group.single';
                    }
                };
            })(this));
            this.groups = ko.computed((function(_this) {
                return function() {
                    var filteredGroups;
                    filteredGroups = _this.allGroups().filter(_this.shouldShowGroup);
                    return filteredGroups.map(function(g) {
                        return new ServerPickerGroupViewModel(g, {
                            shouldShowGroup: _this.shouldShowGroup,
                            getGroupTitle: _this.getGroupTitle,
                            isServerSelectable: _this.isServerSelectable,
                            getServerTitle: _this.getServerTitle,
                            multiSelect: _this.multiSelect
                        });
                    });
                };
            })(this));
            this.groups().forEach((function(_this) {
                return function(g) {
                    g.allServers().forEach(function(s) {
                        if (_this.selected().indexOf(s.rawServer) > -1) {
                            s.isChecked(true);
                        }
                    });
                };
            })(this));
            _doesntMatter = ko.computed((function(_this) {
                return function() {
                    var checkedServers;
                    if (!_this.multiSelect()) {
                        return;
                    }
                    checkedServers = [];
                    _this.groups().forEach(function(g) {
                        checkedServers = checkedServers.concat(g.allServers().filter(function(s) {
                            return s.isChecked();
                        }));
                    });
                    checkedServers = checkedServers.map(function(s) {
                        return s.rawServer;
                    });
                    _this.selected(checkedServers);
                };
            })(this));
            _doesntMatter.extend({
                rateLimit: 50
            });
        }

        return ServerPickerViewModel;

    })();

    var Account, AccountSwitcherViewModel;

    Account = (function() {
        function Account(options) {
            var i, idx, ref;
            this.rawAcct = options.rawAcct;
            this.alias = this.rawAcct.accountAlias;
            this.name = ko.asObservable(this.rawAcct.businessName);
            this.primaryDatacenter = ko.asObservable(this.rawAcct.primaryDataCenter);
            this.path = options.path;
            this.depth = options.depth;
            this.depthHtml = '';
            for (idx = i = 0, ref = this.depth; 0 <= ref ? i <= ref : i >= ref; idx = 0 <= ref ? ++i : --i) {
                if (idx > 0) {
                    this.depthHtml = this.depthHtml + "<span class='marker'>&mdash;</span>";
                }
            }
            this.pathDisplayText = ko.pureComputed((function(_this) {
                return function() {
                    return _this.path + " - " + (_this.name());
                };
            })(this));
        }

        return Account;

    })();

    AccountSwitcherViewModel = (function() {
        function AccountSwitcherViewModel(options) {
            var _activeItemIndex, _close, _createAccountModel, _setCurrentAccount, pageSize;
            options = options || {};
            this.isOpen = ko.observable(false);
            this.isOpen.subscribe((function(_this) {
                return function(newValue) {
                    if (newValue) {
                        return $("account-switcher .take-over").animate({
                            top: 40,
                            bottom: 0
                        });
                    } else {
                        return $("account-switcher .take-over").animate({
                            top: '-100%',
                            bottom: '100%'
                        });
                    }
                };
            })(this));
            this.toggleHandler = (function(_this) {
                return function(data, event) {
                    $('body').toggleClass('account-switcher-open');
                    _this.isOpen(!_this.isOpen());
                    if (_this.isOpen()) {
                        if (!_this.loading()) {
                            $('account-switcher .take-over .search-input input').focus();
                        }
                        return $('account-switcher .toggle-btn svg').animate({
                            deg: 180
                        }, {
                            step: function(now, fx) {
                                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                                return $(this).css('transform', 'rotate(' + now + 'deg)');
                            },
                            duration: 250
                        }, 250);
                    } else {
                        $('account-switcher .toggle-btn svg').animate({
                            deg: 0
                        }, {
                            step: function(now, fx) {
                                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                                return $(this).css('transform', 'rotate(' + now + 'deg)');
                            },
                            duration: 250
                        }, 250);
                        _this.clearSearch();
                        _this.forceShowAllAccts(false);
                        return _activeItemIndex(-1);
                    }
                };
            })(this);
            _close = (function(_this) {
                return function() {
                    $('body').removeClass('account-switcher-open');
                    _this.isOpen(false);
                    _this.clearSearch();
                    _this.forceShowAllAccts(false);
                    return _activeItemIndex(-1);
                };
            })(this);
            this.clearSearch = (function(_this) {
                return function() {
                    var _activeItemIndex;
                    _this.flatOrgList.query('');
                    return _activeItemIndex = -1;
                };
            })(this);
            this.currentAccountAlias = ko.asObservable(options.currentAccountAlias);
            this.loading = ko.asObservable(options.loading);
            this.rawAccounts = ko.asObservableArray(options.accounts || []);
            this.flatOrgList = ko.filterableArray([], {
                fields: ['alias', 'name'],
                comperer: function(query, acct) {
                    if (acct.alias.indexOf(querytoLowerCase()) === 0) {
                        return true;
                    }
                    if (acct.businessName.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                        return true;
                    }
                    return false;
                }
            });
            this.flatOrgList.query.subscribe((function(_this) {
                return function() {
                    _this.forceShowAllAccts(false);
                    return _activeItemIndex(0);
                };
            })(this), null, 'beforeChange');
            this.isSearching = ko.computed((function(_this) {
                return function() {
                    return !!_this.flatOrgList.query();
                };
            })(this));
            _createAccountModel = (function(_this) {
                return function(options) {
                    var depth, path;
                    path = options.path + " / " + options.rawAcct.accountAlias;
                    depth = options.depth++;
                    options.accounts.push(new Account({
                        rawAcct: options.rawAcct,
                        path: path,
                        depth: depth
                    }));
                    return options.rawAcct.subAccounts.forEach(function(acct) {
                        return _createAccountModel({
                            rawAcct: acct,
                            path: path,
                            depth: depth + 1,
                            accounts: options.accounts
                        });
                    });
                };
            })(this);
            ko.computed((function(_this) {
                return function() {
                    var accounts;
                    accounts = [];
                    _this.rawAccounts().forEach(function(acct) {
                        return _createAccountModel({
                            rawAcct: acct,
                            path: '',
                            depth: 0,
                            accounts: accounts
                        });
                    });
                    _this.flatOrgList(accounts);
                };
            })(this));
            this.getImpersonatedOrgDiaplayText = (function(_this) {
                return function(acct) {
                    return (acct.alias.toUpperCase()) + " - " + (ko.unwrap(acct.name));
                };
            })(this);
            this.impersonatedOrg = ko.observable();
            this.impersonatedOrg.subscribe((function(_this) {
                return function(newValue) {
                    return _this.currentAccountAlias(newValue.alias);
                };
            })(this));
            _setCurrentAccount = (function(_this) {
                return function() {
                    var possibleAccounts;
                    possibleAccounts = _this.flatOrgList().filter(function(acct) {
                        return acct.alias.toLowerCase() === _this.currentAccountAlias().toLowerCase();
                    });
                    if (possibleAccounts.length === 1) {
                        return _this.impersonatedOrg(possibleAccounts[0]);
                    } else {
                        throw 'There is more than one account with the same alias, this should not be possible check the data please.';
                    }
                };
            })(this);
            if (!this.loading()) {
                _setCurrentAccount();
            } else {
                this.loading.subscribe((function(_this) {
                    return function(newValue) {
                        if (!newValue) {
                            return _setCurrentAccount();
                        }
                    };
                })(this));
            }
            this.impersonateOrg = (function(_this) {
                return function(acct) {
                    _this.impersonatedOrg(acct);
                    return _this.toggleHandler();
                };
            })(this);
            pageSize = 50;
            this.forceShowAllAccts = ko.observable(false);
            this.showAllOrgsHandler = (function(_this) {
                return function() {
                    return _this.forceShowAllAccts(true);
                };
            })(this);
            this.showingAllOrgs = ko.pureComputed((function(_this) {
                return function() {
                    var total, visible;
                    total = _this.flatOrgList().length;
                    visible = _this.displayOrgs().length;
                    return visible === total;
                };
            })(this));
            this.limitedOrgsDisplayedMessage = ko.pureComputed((function(_this) {
                return function() {
                    var total, visible;
                    total = _this.flatOrgList().length;
                    visible = _this.displayOrgs().length;
                    if (_this.loading()) {
                        return '';
                    } else if (_this.forceShowAllAccts() || visible === total) {
                        return total + " accounts";
                    } else {
                        return "Showing " + visible + " of " + total + " accounts";
                    }
                };
            })(this));
            this.displayOrgs = ko.pureComputed((function(_this) {
                return function() {
                    var end, start;
                    if (_this.forceShowAllAccts()) {
                        return _this.flatOrgList();
                    }
                    end = 1 * pageSize;
                    start = end - pageSize;
                    return _this.flatOrgList().slice(start, end);
                };
            })(this));
            _activeItemIndex = ko.observable(-1);
            this.activeItem = ko.pureComputed((function(_this) {
                return function() {
                    var value;
                    value = _activeItemIndex();
                    if (value > -1) {
                        return _this.displayOrgs()[value];
                    }
                };
            })(this));
            this.hoverHandler = (function(_this) {
                return function(data, event) {
                    return _activeItemIndex(_this.displayOrgs().indexOf(data));
                };
            })(this);
            this.isActiveItem = (function(_this) {
                return function(data) {
                    return data === _this.activeItem();
                };
            })(this);
            this.isCurrentItem = (function(_this) {
                return function(data) {
                    return data === _this.impersonatedOrg();
                };
            })(this);
            this.forceShowAllAccts.subscribe(function() {
                return _activeItemIndex(0);
            });
            $(document).on('keydown', (function(_this) {
                return function(e) {
                    var activeAccount;
                    if (e.ctrlKey && e.keyCode === 73) {
                        return _this.toggleHandler();
                    } else if (_this.isOpen()) {
                        if (e.keyCode === 38) {
                            if (_activeItemIndex() > 0) {
                                _activeItemIndex(_activeItemIndex() - 1);
                            }
                            return false;
                        } else if (e.keyCode === 40) {
                            if (_activeItemIndex() < _this.displayOrgs().length - 1) {
                                _activeItemIndex(_activeItemIndex() + 1);
                            }
                            return false;
                        } else if (e.keyCode === 27) {
                            _close();
                            return false;
                        } else if (e.keyCode === 13) {
                            e.preventDefault();
                            activeAccount = _this.activeItem();
                            if (activeAccount) {
                                _this.impersonateOrg(activeAccount);
                            }
                            return false;
                        }
                    }
                };
            })(this));
        }

        return AccountSwitcherViewModel;

    })();

    var ShowPasswordViewModel;

    ShowPasswordViewModel = (function() {
        function ShowPasswordViewModel(params) {
            if (params.getPassword === null || typeof params.getPassword !== 'function') {
                throw 'A parameter \'getPassword\' is required and must be a function';
            }
            this.loading = ko.observable(false);
            this.errored = ko.observable(false);
            this.showPassword = ko.observable(false);
            this.timer = null;
            this.password = ko.observable('');
            this.fetchPassword = (function(_this) {
                return function() {
                    var result;
                    _this.loading(true);
                    _this.errored(false);
                    _this.showPassword(true);
                    result = params.getPassword();
                    if (helpers.isDeferred(result)) {
                        result.always(function() {
                            return _this.loading(false);
                        });
                        result.fail(function() {
                            return _this.errored(true);
                        });
                        return result.done(function(result) {
                            if (typeof result === 'object') {
                                return _this.password(result.password);
                            } else {
                                return _this.password(result);
                            }
                        });
                    } else {
                        _this.loading(false);
                        _this.errored(false);
                        if (typeof result === 'object') {
                            return _this.password(result.password);
                        } else {
                            return _this.password(result);
                        }
                    }
                };
            })(this);
            this.retryHandler = (function(_this) {
                return function() {
                    _this.fetchPassword();
                    return false;
                };
            })(this);
            this.clickHandler = (function(_this) {
                return function() {
                    if (_this.showPassword()) {
                        _this.showPassword(false);
                        _this.errored(false);
                        _this.loading(false);
                    } else {
                        _this.fetchPassword();
                    }
                    return false;
                };
            })(this);
            this.mouseOver = (function(_this) {
                return function() {
                    if (_this.timer) {
                        return window.clearTimeout(_this.timer);
                    }
                };
            })(this);
            this.mouseExit = (function(_this) {
                return function() {
                    if (_this.showPassword() && !_this.loading()) {
                        return _this.timer = window.setTimeout(function() {
                            _this.showPassword(false);
                            _this.errored(false);
                            return _this.loading(false);
                        }, 15000);
                    }
                };
            })(this);
        }

        return ShowPasswordViewModel;

    })();

    var SliderViewModel,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    SliderViewModel = (function() {
        function SliderViewModel(options) {
            this.trackClick = bind(this.trackClick, this);
            this.dragHandler = bind(this.dragHandler, this);
            this.dragStopHandler = bind(this.dragStopHandler, this);
            this.dragStartHandler = bind(this.dragStartHandler, this);
            this.getFillRightValue = bind(this.getFillRightValue, this);
            this.getTickMarginPercentage = bind(this.getTickMarginPercentage, this);
            this.getCommitedValueStyles = bind(this.getCommitedValueStyles, this);
            this.getOutOfRangeValueLeftPosition = bind(this.getOutOfRangeValueLeftPosition, this);
            this.convertToNumber = bind(this.convertToNumber, this);
            this.getValuePercentage = bind(this.getValuePercentage, this);
            this.getMaxFromValidationRule = bind(this.getMaxFromValidationRule, this);
            this.getMinFromValidationRule = bind(this.getMinFromValidationRule, this);
            this.validateValueAganistMinAndMaxBound = bind(this.validateValueAganistMinAndMaxBound, this);
            this.validateValue = bind(this.validateValue, this);
            options = options || {};
            this.minDefault = 1;
            this.maxDefault = 128;
            this.step = 1;
            this.hasjQueryUi = libraries.jqueryUi;
            this.value = ko.asObservable(options.value != null ? options.value : minDefault);
            this.min = ko.asObservable(options.min != null ? options.min : this.getMinFromValidationRule());
            this.max = ko.asObservable(options.max != null ? options.max : this.getMaxFromValidationRule());
            this.disabled = ko.asObservable(options.disabled != null ? options.disabled : false);
            this.value.subscribe((function(_this) {
                return function(newValue) {
                    newValue = Math.floor(_this.convertToNumber(newValue, _this.min()));
                    if (_this.value() !== newValue) {
                        _this.value(newValue);
                    }
                    _this.validateValue();
                    _this.possibleValue(_this.value());
                };
            })(this));
            this.possibleValue = ko.observable(this.value());
            this.shouldShowTicks = ko.asObservable(options.showTicks != null ? options.showTicks : true);
            this.validateValue();
            this.minBound = ko.asObservable(options.minBound != null ? options.minBound : this.min);
            this.maxBound = ko.asObservable(options.maxBound != null ? options.maxBound : this.max);
            this.minBound.subscribe(this.validateValueAganistMinAndMaxBound);
            this.maxBound.subscribe(this.validateValueAganistMinAndMaxBound);
            this.validateValueAganistMinAndMaxBound();
            this.numberofTotalSteps = ko.pureComputed((function(_this) {
                return function() {
                    return _this.maxBound() - _this.minBound();
                };
            })(this));
            this.boundedSingleStepPercentage = ko.pureComputed((function(_this) {
                return function() {
                    return 100 / _this.numberofTotalSteps();
                };
            })(this));
            this.currentValuePercentage = ko.pureComputed((function(_this) {
                return function() {
                    return (_this.value() - _this.min()) * 100 / (_this.max() - _this.min());
                };
            })(this));
            this.validTrackLeftMargin = ko.pureComputed((function(_this) {
                return function() {
                    return (Math.abs(_this.minBound() - _this.min()) * _this.boundedSingleStepPercentage()) + "%";
                };
            })(this));
            this.validTrackRightMargin = ko.pureComputed((function(_this) {
                return function() {
                    return (Math.abs(_this.max() - _this.maxBound()) * _this.boundedSingleStepPercentage()) + "%";
                };
            })(this));
            this.canShowTicks = ko.pureComputed((function(_this) {
                return function() {
                    if (_this.numberofTotalSteps() > 32) {
                        return false;
                    } else {
                        return _this.shouldShowTicks();
                    }
                };
            })(this));
            this.fillRightValue = ko.pureComputed((function(_this) {
                return function() {
                    return (100 - _this.getValuePercentage(_this.value())) + "%";
                };
            })(this));
            this.mainClasses = ko.pureComputed((function(_this) {
                return function() {
                    var classes;
                    classes = [];
                    if (_this.max() < _this.maxBound()) {
                        classes.push('has-max-bound');
                    }
                    if (_this.min() > _this.minBound()) {
                        classes.push('has-min-bound');
                    }
                    if (_this.disabled()) {
                        classes.push('disabled');
                    }
                    return classes.join(' ');
                };
            })(this));
            this.isCommitedValueOutSideRange = ko.pureComputed((function(_this) {
                return function() {
                    if (_this.value.isTrackableObservable) {
                        return _this.value.committedValue() > _this.max() || _this.value.committedValue() < _this.min();
                    }
                    return false;
                };
            })(this));
            this.outOfRangeMessage = ko.pureComputed((function(_this) {
                return function() {
                    if (_this.value.isTrackableObservable && _this.isCommitedValueOutSideRange()) {
                        return "The current value of <strong>" + (_this.value.committedValue()) + "</strong> is outside the valid range of <strong>" + (_this.min()) + " &ndash; " + (_this.max()) + "</strong>. The closest allowable value has been selected.";
                    }
                };
            })(this));
        }

        SliderViewModel.prototype.validateValue = function() {
            if (this.value() < this.min()) {
                console.error('value cannot be less than the minimum value.');
                this.value(this.min());
            }
            if (this.value() > this.max()) {
                console.error('value cannot be greater than the maximum value');
                this.value(this.max());
            }
        };

        SliderViewModel.prototype.validateValueAganistMinAndMaxBound = function() {
            if (this.value() < this.minBound()) {
                console.error('value cannot be less than the min bound value.');
                this.value(this.minBound());
            }
            if (this.value() > this.maxBound()) {
                console.error('value cannot be greater than the max bound value');
                this.value(this.maxBound());
            }
        };

        SliderViewModel.prototype.getMinFromValidationRule = function() {
            var minValue, rules;
            rules = this.value.rules ? this.value.rules().filter((function(r) {
                return r.rule === 'min';
            })) : [];
            minValue = rules.length > 0 ? rules[0].params : void 0;
            if (ko.isObservable(minValue)) {
                return minValue;
            }
            return this.convertToNumber(minValue, this.minDefault);
        };

        SliderViewModel.prototype.getMaxFromValidationRule = function() {
            var maxValue, rules;
            rules = this.value.rules ? this.value.rules().filter((function(r) {
                return r.rule === 'max';
            })) : [];
            maxValue = rules.length > 0 ? rules[0].params : void 0;
            if (ko.isObservable(maxValue)) {
                return maxValue;
            }
            return this.convertToNumber(maxValue, this.maxDefault);
        };

        SliderViewModel.prototype.getValuePercentage = function(newValue) {
            return (newValue - this.min()) * 100 / (this.max() - this.min());
        };

        SliderViewModel.prototype.convertToNumber = function(value, defaultValue) {
            var result;
            result = defaultValue;
            if (typeof value === 'string') {
                result = parseFloat(value);
            } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
                result = value;
            }
            return result;
        };

        SliderViewModel.prototype.getOutOfRangeValueLeftPosition = function() {
            return ((this.value.committedValue() - this.minBound()) * 100 / (this.maxBound() - this.minBound())) + "%";
        };

        SliderViewModel.prototype.getCommitedValueStyles = function() {
            var leftPosition;
            leftPosition = (this.value.committedValue() - this.minBound()) * 100 / (this.maxBound() - this.minBound());
            if (leftPosition > 100) {
                return {
                    display: 'none'
                };
            } else {
                return {
                    display: 'block',
                    left: leftPosition + "%"
                };
            }
        };

        SliderViewModel.prototype.getTickMarginPercentage = function(index) {
            return ((index() + 1) * this.boundedSingleStepPercentage()) + "%";
        };

        SliderViewModel.prototype.getFillRightValue = function() {
            return (100 - this.currentValuePercentage()) + "%";
        };

        SliderViewModel.prototype.dragStartHandler = function(event, ui) {
            $(ui.helper).children('.slider-tooltip').fadeIn({
                duration: 50,
                easing: 'easeOutQuad'
            });
        };

        SliderViewModel.prototype.dragStopHandler = function(event, ui) {
            var fill;
            $(ui.helper).children('.slider-tooltip').fadeOut({
                duration: 200,
                easing: 'easeOutQuad'
            });
            $(ui.helper).css({
                left: this.currentValuePercentage() + '%'
            });
            fill = $(ui.helper).siblings('.slider-value-fill');
            fill.css({
                right: this.getFillRightValue()
            });
            this.value(this.possibleValue());
        };

        SliderViewModel.prototype.dragHandler = function(event, ui) {
            var fill, stepWidth, track, validTrack;
            track = $(ui.helper).parents('.slider-track');
            validTrack = $(ui.helper).parent('.slider-valid-track');
            fill = $(ui.helper).siblings('.slider-value-fill');
            stepWidth = track.width() / this.numberofTotalSteps();
            fill.css({
                right: validTrack.width() - ui.position.left
            });
            this.possibleValue(Math.abs(Math.round(ui.position.left / stepWidth) + this.min()));
        };

        SliderViewModel.prototype.trackClick = function(data, event) {
            var element, stepWidth, track;
            if (this.disabled()) {
                return;
            }
            element = $(event.target);
            if (!element.is('.slider-handle2')) {
                track = element.parents('.slider-track');
                stepWidth = track.width() / this.numberofTotalSteps();
                this.possibleValue(Math.abs(Math.round(event.offsetX / stepWidth) + this.min()));
                this.value(this.possibleValue());
            }
        };

        return SliderViewModel;

    })();

    var ToggleViewModel;

    ToggleViewModel = (function() {
        function ToggleViewModel(options) {
            options = options || {};
            this.affirmativeText = ko.asObservable(options.affirmativeText != null ? options.affirmativeText : 'yes');
            this.negativeText = ko.asObservable(options.negativeText != null ? options.negativeText : 'no');
            this.value = ko.asObservable(options.value != null ? options.value : false);
            this.disabled = ko.asObservable(options.disabled != null ? options.disabled : false);
        }

        return ToggleViewModel;

    })();

    if (libraries.knockoutValidation) {
        ko.validation.rules.checked = {
            validator: function(value) {
                return !!ko.unwrap(value);
            },
            message: 'You must agree.'
        };
    }

    if (libraries.knockoutValidation) {
        ko.validation.rules.ipAddress = {
            validator: function(value) {
                if (value) {
                    return value.match(/^((2(5[0-5]|[0-4][0-9])|[01]?[0-9][0-9]?)\.){3}(2(5[0-5]|[0-4][0-9])|[01]?[0-9][0-9]?)$/i);
                }
                return true;
            },
            message: 'Please enter a valid IPv4 address (ex: 10.189.12.0).'
        };
    }

    if (libraries.knockoutValidation) {
        ko.validation.rules.ipAddressCidr = {
            validator: function(value) {
                if (value) {
                    return value.match(/^((2(5[0-5]|[0-4][0-9])|[01]?[0-9][0-9]?)\.){3}(2(5[0-5]|[0-4][0-9])|[01]?[0-9][0-9]?)\/(3[012]|[12]?[0-9])$/i);
                }
                return true;
            },
            message: 'Please enter a valid IPv4 CIDR (ex: 10.189.12.0/24).'
        };
    }

    if (libraries.knockoutValidation) {
        ko.validation.rules.notEmpty = {
            hasItems: function(data) {
                var result, value;
                value = ko.unwrap(data);
                result = false;
                if (value.length && value.length > 0) {
                    result = true;
                }
                return result;
            },
            validator: function(value) {
                return this.hasItems(value);
            },
            message: 'Must not be empty'
        };
    }

    if (libraries.knockoutValidation) {
        ko.validation.rules.passwordStrength = {
            validator: function(val, options) {
                var badCharacters, many, strength;
                options = $.extend({
                    requiredStrength: 3,
                    dissallowedCharacters: []
                }, options);
                if (!val) {
                    return true;
                }
                strength = helpers.calculatePasswordStrength(val);
                badCharacters = helpers.containsAny(val, options.dissallowedCharacters);
                if (badCharacters.length > 0) {
                    many = badCharacters.length > 1;
                    this.message = 'The character' + (many ? 's' : '') + ' \'' + badCharacters.join('\', \'') + '\' ' + (many ? 'are' : 'is') + ' not allowed.';
                } else if (strength < options.requiredStrength) {
                    if (options.requiredStrength >= 4) {
                        this.message = 'A password must be at least 9 characters and contain all of the following: ' + '<ul>' + '<li>uppercase letters</li>' + '<li>lowercase letters</li>' + '<li>numbers</li>' + '<li>symbols</li>' + '</ul>';
                    } else if (options.requiredStrength >= 3) {
                        this.message = 'A password must be at least 9 characters and contain at least 3 of the following: ' + '<ul>' + '<li>uppercase letters</li>' + '<li>lowercase letters</li>' + '<li>numbers</li>' + '<li>symbols</li>' + '</ul>';
                    } else if (options.requiredStrength >= 2) {
                        this.message = 'A password must be at least 8 characters and contain at least 3 of the following: ' + '<ul>' + '<li>uppercase letters</li>' + '<li>lowercase letters</li>' + '<li>numbers</li>' + '<li>symbols</li>' + '</ul>';
                    } else {
                        this.message = 'A password must be at least 8 characters.';
                    }
                }
                return strength >= options.requiredStrength && badCharacters.length < 1;
            },
            message: ''
        };
    }

    if (libraries.knockoutValidation) {
        ko.validation.rules.uri = {
            validator: function(value, options) {
                var pattern, scheme, type;
                options = $.extend({}, options);
                scheme = options.scheme;
                pattern = value.match(/(https?|ftp)\:\/\/([a-z0-9\-.]*)\.([a-z]{2,3})(\:[0-9]{2,5})?(\/([a-z0-9+\$_\-]\.?)+)*\/?/i);
                type = scheme ? value.substring(0, value.indexOf(':')).toLowerCase() === scheme.toLowerCase() : true;
                return pattern && type;
            },
            message: 'Please enter a valid uri'
        };
    }

    if (libraries.knockoutValidation) {
        ko.validation.registerExtenders();
    }

    $(function() {
        var closeAll, open, toggle;
        closeAll = function() {
            $('.dropdown').removeClass('open').children('button, a').attr('aria-expanded', false);
            $('.dropdown-dismiss').remove();
        };
        open = function(dropdown) {
            closeAll();
            dropdown.addClass('open');
            dropdown.children('button, a').attr('aria-expanded', true);
            if ('ontouchstart' in document.documentElement) {
                $('<div class=\'dropdown-dismiss\'></div>').on('click', function() {
                    return close(dropdown);
                }).insertAfter(dropdown);
            }
        };
        toggle = function(e) {
            var dropdown, isOpen;
            if ($(this).is(':disabled')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            dropdown = $(this).parents('.dropdown');
            isOpen = dropdown.hasClass('open');
            if (isOpen) {
                return closeAll();
            } else {
                return open(dropdown);
            }
        };
        closeAll();
        $('.dropdown').children('a, button').click(toggle);
        $(document).on('click.cyclops.dropdown', function(event) {
            var dropdown;
            dropdown = $('.dropdown.open');
            return closeAll();
        });
        $.fn.dropdown = function() {
            return this.each(function() {
                return $(this).click(toggle);
            });
        };
    });

    ko.components.register('slider', {
        viewModel: SliderViewModel,
        template: {
            element: "cyclops.slider"
        }
    });

    ko.components.register('toggle', {
        viewModel: ToggleViewModel,
        template: {
            element: "cyclops.toggle"
        }
    });

    ko.components.register('group-picker', {
        viewModel: GroupPickerViewModel,
        template: {
            element: "cyclops.groupPicker"
        }
    });

    ko.components.register('server-picker', {
        viewModel: ServerPickerViewModel,
        template: {
            element: "cyclops.serverPicker"
        }
    });

    ko.components.register('show-password', {
        viewModel: ShowPasswordViewModel,
        template: {
            element: "cyclops.showPassword"
        }
    });

    ko.components.register('account-switcher', {
        viewModel: AccountSwitcherViewModel,
        template: {
            element: "cyclops.accountSwitcher"
        }
    });

    $(function() {
        var navbars, setAriaAndClass, toggle;
        toggle = function() {
            var btn, menu;
            btn = $(this);
            menu = btn.parents('.navbar').find('.navbar-collapse');
            if (menu.is(':visible')) {
                menu.stop().slideUp(300, function() {
                    return setAriaAndClass(menu, btn);
                });
            } else {
                menu.stop().slideDown(300, function() {
                    return setAriaAndClass(menu, btn);
                });
            }
        };
        setAriaAndClass = function(menu, btn) {
            var isVisible;
            isVisible = menu.is(':visible');
            menu.attr('aria-expanded', isVisible);
            btn.attr('aria-expanded', isVisible);
            if (isVisible) {
                menu.removeClass('collapsed');
            } else {
                menu.addClass('collapsed');
            }
        };
        return navbars = $("nav.navbar").each(function(idx, nb) {
            var $nb, btn, menu;
            $nb = $(nb);
            menu = $nb.find('.avbar-collapse');
            btn = $nb.find('.navbar-toggle');
            setAriaAndClass(menu, btn);
            return btn.click(toggle);
        });
    });

})(this || (0, eval)('this'));

$.holdReady(true);
$.get("https://assets.ctl.io/cyclops/1.1.3/templates/cyclops.tmpl.min.html", function(tmpl) {
    $("head")
        .append(tmpl);
    $.holdReady(false);
});

// We don't need to hold ready becuase no code is going to error
// if the element isn't there yet, unlike the templates.
$.get("https://assets.ctl.io/cyclops/1.1.3/svg/cyclops.icons.min.svg", function(data) {
    var div = $("<div id='cyclopsIcons' style='display:none' aria-hidden='true'></div>")
    div.html(new XMLSerializer()
        .serializeToString(data.documentElement));
    $("body")
        .append(div);
});
//# sourceMappingURL=cyclops.js.map