// @ts-nocheck
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { __highlightText } from '@lotsof/sugar/string';
import __LitElement from '@lotsof/lit-element';
// @TODO            check why import does not work
// @ts-ignore
import { __isFocusWithin } from '@lotsof/sugar/is';
import { __uniqid } from '@lotsof/sugar/string';
import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { __escapeRegexChars } from '@lotsof/sugar/string';
import { __i18n } from '@lotsof/i18n';
import { __hotkey } from '@lotsof/sugar/keyboard';
import { __nearestElement } from '@lotsof/sugar/dom';
import { __escapeQueue } from '@lotsof/sugar/keyboard';
import '../../src/css/AdvancedSelectElement.bare.css';
import { __distanceFromElementTopToViewportBottom, __distanceFromElementTopToViewportTop, __getStyleProperty, __onScrollEnd, } from '@lotsof/sugar/dom';
import { __stripTags } from '@lotsof/sugar/html';
/**
 * @name                AdvancedSelectElement
 * @as                  Advanced Select Input
 * @namespace           js
 * @type                CustomElement
 * @interface           ./interface/AdvancedSelectElementInterface.ts
 * @menu                Styleguide / UI              /styleguide/ui/s-filtrable-einput
 * @platform            html
 * @status              beta
 *
 * This component represent a filtrable input to display and filter a list of items easily.
 *
 * @feature           Framework agnostic. Simply webcomponent.
 * @feature           Fully customizable
 * @feature           Built-in search
 *
 * @attribute       {String|Function}         [items]                         The items to display in the dropdown. Can be a JSON string, a url to an api endpoints, a string that represent a query selector to a script tag, or a function that return the items
 * @attribute       {String}        [value=value]                                   The value property to use to display the items
 * @attribute       {String}        [label=label]                                   The label property to use to display the items
 * @attribute       {Boolean}       [showKeywords=false]                            Specify if you want to show the keywords in the dropdown
 * @attribute       {String}        [emptyText=No items found...]                   The text to display when no items are found
 * @attribute       {String}        [loadingText=Loading, please wait...]           The text to display when the component is in loading state
 * @attribute       {Function}      [filterValuePreprocess]                         A function to preprocess the filter value before filtering the items
 * @attribute       {String}        [hotkey=null]                                   A hotkey to focus the input
 * @attribute       {Function}      [filterItems=null]                              A function to filter the items
 * @attribute       {Number}        [minChars=1]                                    The minimum characters to type before filtering the items
 * @attribute       {Array}         [filtrable=[id,value,label]]                    The properties to filter on
 * @attribute       {Array}         [highlightable=[label]]                         The properties to highlight in the dropdown
 * @attribute       {Function}      [templates=null]                                A function to render the templates
 * @attribute       {Number}        [closeTimeout=100]                              The timeout to wait before closing the dropdown
 * @attribute       {Boolean}       [notSelectable=false]                           Specify if the component is not selectable
 * @attribute       {Number}        [maxItems=-1]                                   The maximum items to display in the dropdown
 * @attribute       {TAdvancedSelectElementClasses}        [classes=null]                                  Some classes to apply to the different elements
 * @attribute       {Boolean}       [inline=false]                                  Specify if the dropdown should be displayed inline
 *
 *
 * @event           sAdvancedSelect.items                Dispatched when the items are setted of updated
 * @event           sAdvancedSelect.select               Dispatched when an item has been selected
 * @event           sAdvancedSelect.preselect            Dispatched when an item has been preselected
 * @event           sAdvancedSelect.close                Dispatched when the dropdown is closed
 * @event           sAdvancedSelect.open                 Dispatched when the dropdown is opened
 * @event           sAdvancedSelect.reset                Dispatched when the input is resetted
 * @event           sAdvancedSelect.loading              Dispatched when the element enterd in loading state
 * @event           sAdvancedSelect.loaded               Dispatched when the element exit the loading state
 *
 * @support         chromium
 * @support         firefox
 * @support         safari
 * @support         edge
 *
 * @import          import { define as __AdvancedSelectElementDefine } from '@lotsof/advancedSelect-component';
 *
 * @snippet         __AdvancedSelectElementDefine($1)
 *
 * @install           shell
 * npm i @lotsof/advancedSelect-component
 *
 * @install           js
 * import __SAdvancedSelectElement from '@lotsof/advancedSelect-component';
 * __SAdvancedSelectElement.define();
 *
 * @example         html            Simple example
 * <template id="items">
 *   [{"title":"Hello","value":"hello"},{"title":"world","value":"world"}]
 * </template>
 * <advancedSelect items="#items" label="title" filtrable="title">
 *   <input type="text" class="s-input" placeholder="Type something..." />
 * </advancedSelect>
 *
 * @example         js
 * import __SAdvancedSelectElement from '@lotsof/advanced-select-element';
 * __SAdvancedSelectElement.define('my-cool-filtrable-input');
 *
 * @example         html        Custom templates and items
 * <my-cool-filtrable-input>
 *    <input type="text" class="s-input" placeholder="Type something..." />
 * </my-cool-filtrable-input>
 *
 * @example         js
 * import __SAdvancedSelectElement from '@lotsof/advanced-select-element';
 * __SAdvancedSelectElement.define('my-cool-filtrable-input', {
 *     items: async () => {
 *         // you can get your items however you want
 *         // const request = await fetch('...');
 *         // const items = await request.json();
 *         return [{title: 'Hello', value: 'World'},{title: 'Plop', value:'Yop}];
 *     }
 * });
 *
 * @since           2.0.0
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
 */
export default class AdvancedSelectElement extends __LitElement {
    constructor() {
        super('s-advanced-select');
        // @state()
        this._displayedMaxItems = 0;
        this._filterValue = '';
        this._items = [];
        this._filteredItems = [];
        this._isLoading = false;
        this.items = [];
        this.value = 'value';
        this.label = 'label';
        this.showKeywords = false;
        this.emptyText = __i18n('No items found...');
        this.loadingText = __i18n('Loading, please wait...');
        this.minChars = 1;
        this.filtrable = [];
        this.highlightable = [];
        this.closeTimeout = 100;
        this.notSelectable = false;
        this.maxItems = -1;
        this.classes = {};
        this.inline = false;
        this._$container = document.createElement('div');
        this._$list = document.createElement('ul');
        this._$dropdown = document.createElement('div');
        this._$input = document.createElement('input');
        this._templatesFromHtml = {};
        this._isArrowUsed = false;
        this._baseTemplates = (api) => { };
        this._currentItemIdx = 0;
    }
    mount() {
        return __awaiter(this, void 0, void 0, function* () {
            this._displayedMaxItems = this.maxItems;
            // filtrable
            if (typeof this.filtrable === 'string') {
                this.filtrable = this.filtrable.split(',').map((f) => f.trim());
            }
            if (!this.filtrable.length) {
                this.filtrable.push('id');
                this.filtrable.push('value');
                if (typeof this.label === 'string') {
                    this.filtrable.push(this.label);
                }
            }
            if (!this.highlightable.length) {
                if (typeof this.label === 'string') {
                    this.highlightable.push(this.label);
                }
            }
            if (!this.filtrable.length) {
                throw new Error(`Sorry but you have to specify at least one property in the "filtrable" item property...`);
            }
            // @ts-ignore
            this._baseTemplates = ({ type, item, $items, html }) => {
                switch (type) {
                    case 'item':
                        return html `
            ${unsafeHTML(typeof this.label === 'function'
                            ? __i18n(this.label({ item }))
                            : __i18n(item[this.label]))}
          `;
                        break;
                    case 'group':
                        return html ` <h4 class="${this.cls('_group-label')}">
              ${__i18n(item.label)}
            </h4>
            <ul class="${this.cls('_group-items')}">
              <div class="${this.cls('_group-items-inner')}">${$items}</div>
            </ul>`;
                        break;
                    case 'empty':
                        return html ` <div>${__i18n(this.emptyText)}</div> `;
                        break;
                    case 'loading':
                        return html `
            <div class="${this.cls('_loading')}">
              ${__i18n(this.loadingText)}
            </div>
          `;
                        break;
                }
            };
            // grab templates
            this._grabTemplatesFromDom();
            // init listeners (hotkeys, etc...)
            this._initListeners();
            // if we have the focus in
            if (__isFocusWithin(this)) {
                setTimeout(() => {
                    this.focus();
                });
            }
        });
    }
    updated(changedProperties) {
        if (changedProperties.has('_isLoading')) {
            if (this._isLoading) {
                this.dispatch('loading');
            }
            else {
                this.dispatch('loaded');
            }
        }
        if (this._filterValue) {
            this.classList.add('-filtered');
        }
        else {
            this.classList.remove('-filtered');
        }
        if (this._isLoading) {
            this.classList.add('-loading');
        }
        else {
            this.classList.remove('-loading');
        }
        if (!this._filteredItems.length) {
            this.classList.add('-empty');
        }
        else {
            this.classList.remove('-empty');
        }
        if (this.inline) {
            this.classList.add('-inline');
        }
        else {
            this.classList.remove('-inline');
        }
    }
    firstUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // input
            this._$input =
                (_a = this.querySelector('input')) !== null && _a !== void 0 ? _a : document.createElement('input');
            if (!((_b = this._$input) === null || _b === void 0 ? void 0 : _b.parentElement)) {
                this.appendChild(this._$input);
            }
            this._$input.setAttribute('autocomplete', 'off');
            this._$form = this._$input.form;
            // prevent from sending form if search is opened
            (_c = this._$form) === null || _c === void 0 ? void 0 : _c.addEventListener('submit', (e) => {
                if (!this.isActive()) {
                    e.preventDefault();
                }
            });
            // handle update on key event
            this._$input.addEventListener('keyup', (e) => __awaiter(this, void 0, void 0, function* () {
                if (!this.isActive()) {
                    return;
                }
                // nothing has changed
                if (this._filterValue === e.target.value) {
                    return;
                }
                this.resetPreselected();
                this.resetSelected();
                const value = e.target.value;
                this._filterValue = value;
                this._displayedMaxItems = this.maxItems;
                // if passed a function to the items property,
                // we refresh the items at eash keystroke
                if (typeof this.items === 'function') {
                    yield this.refreshItems();
                }
                else {
                    // just filterinf the current items
                    this._filterItems();
                }
            }));
            // handle update on focus
            this._$input.addEventListener('focus', (e) => {
                if (!this.isActive()) {
                    return;
                }
                const value = e.target.value;
                this._filterValue = value;
                this._open();
                this._updateListSizeAndPosition();
            });
            // input class
            this._$input.classList.add(...this.cls('_input').split(' '));
            if (this.classes.input) {
                this._$input.classList.add(this.classes.input);
            }
            // container class
            this._$container = this;
            this._$container.classList.add(...this.cls().split(' '));
            if (this.classes.container) {
                this._$container.classList.add(this.classes.container);
            }
            // get the list and the dropdown
            this._$list = this.querySelector('ul');
            this._$dropdown = this.querySelector(`.${this.internalCls('_dropdown')}`);
            // handle scroll behaviors
            document.addEventListener('scroll', () => {
                this._updateListSizeAndPosition();
            });
            this._updateListSizeAndPosition();
            __onScrollEnd(this._$list, () => {
                var _a;
                if (this.maxItems === -1) {
                    return;
                }
                this._displayedMaxItems = ((_a = this._displayedMaxItems) !== null && _a !== void 0 ? _a : 0) + this.maxItems;
                this._filterItems();
            });
            // handle arrows
            document.addEventListener('keyup', (e) => {
                if (!this.isActive())
                    return;
                if (!this._filteredItems.length)
                    return;
                const directionsMap = {
                    ArrowDown: 'bottom',
                    ArrowUp: 'top',
                    ArrowLeft: 'left',
                    ArrowRight: 'right',
                };
                if (!directionsMap[e.key])
                    return;
                // mark the arrow as used
                this._isArrowUsed = true;
                clearTimeout(this._isArrowUsedTimeout);
                this._isArrowUsedTimeout = setTimeout(() => {
                    this._isArrowUsed = false;
                }, 100);
                const $items = this.querySelectorAll(`.${this.internalCls('_item')}.-match`), $from = this.querySelector(`.${this.internalCls('_item')}.-preselected`) ||
                    this.querySelector(`.${this.internalCls('_item')}.-selected`) ||
                    this.querySelectorAll(`.${this.internalCls('_item')}`)[0];
                let direction;
                if (!this.getPreselectedItem()) {
                    this.preselect($items[0].dataset.id);
                }
                else {
                    let $nearestElement = __nearestElement($from, $items, {
                        direction: directionsMap[e.key],
                    });
                    if (!$nearestElement) {
                        return;
                    }
                    this.preselect($nearestElement.dataset.id);
                }
            });
            // handle return key
            document.addEventListener('keyup', (e) => {
                if (e.key !== 'Enter') {
                    return;
                }
                // protect agains actions when not focus
                if (!this.isActive())
                    return;
                this.select();
            });
            // restore value from state
            if (this._filterValue) {
                this.setSearch(this._filterValue);
                // this._$input.value = this._filterValue;
            }
            // open if a value exists
            if (this._$input.value) {
                this._filterValue = this._$input.value;
            }
        });
    }
    _initListeners() {
        // handle hotkeys
        if (this.hotkey) {
            __hotkey(this.hotkey, () => {
                this.focus();
            });
        }
    }
    _grabTemplatesFromDom() {
        this.querySelectorAll('template').forEach(($template) => {
            if (!$template.hasAttribute('type'))
                return;
            // @ts-ignore
            this._templatesFromHtml[$template.getAttribute('type')] =
                $template.innerHTML;
        });
    }
    _renderTemplate(api) {
        const finalApi = Object.assign({ type: '', item: null, html: html, unsafeHTML: unsafeHTML, idx: 0 }, api);
        if (this.templates) {
            const res = this.templates(finalApi);
            if (res)
                return res;
        }
        // from template tags
        if (this._templatesFromHtml[finalApi.type]) {
            return html ` ${unsafeHTML(this._templatesFromHtml[finalApi.type])} `;
        }
        // @ts-ignore
        return this._baseTemplates(finalApi);
    }
    /**
     * Preselect an item
     */
    preselect(item, settings) {
        var _a;
        if (typeof item === 'string') {
            item = this.getItemById(item);
        }
        // reset preselected
        (_a = this.getPreselectedItem()) === null || _a === void 0 ? void 0 : _a.state.preselected = false;
        // check if the component is in not selectable mode
        if (this.notSelectable)
            return;
        // do not preselect if not match the search
        if (!item.state.match)
            return;
        // set the new preselected
        item.state.preselected = true;
        // set focus in the input
        if (!(settings === null || settings === void 0 ? void 0 : settings.preventFocus)) {
            setTimeout(() => {
                this.focus();
            });
        }
        // make sure the ui is up to date
        this.requestUpdate();
    }
    resetPreselected() {
        var _a;
        (_a = this.getPreselectedItem()) === null || _a === void 0 ? void 0 : _a.state.preselected = false;
    }
    setSearch(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this._$input.value = value;
            this._filterValue = value;
            this._filterItems();
            yield this.refreshItems();
            this.requestUpdate();
        });
    }
    /**
     * Select an item
     */
    select(item = this.getPreselectedItem()) {
        if (typeof item === 'string') {
            item = this.getItemById(item);
        }
        // reset preselected
        // this.getPreselectedItem()?.state.selected = false;
        // check if the component is in not selectable mode
        if (this.notSelectable)
            return;
        // do not select if not match the search
        if (!item.state.match)
            return;
        // set the new preselected
        item.state.selected = true;
        // set focus in the input
        setTimeout(() => {
            var _a;
            if (!item.preventSet) {
                this.setSearch((_a = item.value) !== null && _a !== void 0 ? _a : item.id);
            }
            else {
                this.setSearch('');
            }
            if (item.preventClose) {
                this.focus();
            }
        });
        // close if not prevented
        if (!item.preventClose) {
            this._close();
        }
        // dispatch an event
        if (!item.preventSelect) {
            this.dispatch('select', {
                detail: {
                    item,
                    $elm: this.querySelector(`.${this.internalCls('_item')}[data-internal-id="${item._internalId}"]`),
                },
            });
        }
        // make sure the ui is up to date
        this.requestUpdate();
    }
    resetSelected() {
        var _a;
        (_a = this.getSelectedItem()) === null || _a === void 0 ? void 0 : _a.state.selected = false;
    }
    /**
     *  Reset
     */
    reset() {
        this.resetPreselected();
        this.resetSelected();
        this.setSearch('');
        this.dispatch('reset');
    }
    getItemById(id) {
        return this._filteredItems.find((item) => item.id === id);
    }
    getPreselectedItem() {
        return this._filteredItems.find((item) => item.state.preselected);
    }
    getSelectedItem() {
        return this._filteredItems.find((item) => item.state.selected);
    }
    getMatchItems() {
        return this._filteredItems.filter((item) => item.state.match);
    }
    _open() {
        return __awaiter(this, void 0, void 0, function* () {
            __escapeQueue(() => {
                if (!this.isActive())
                    return;
                this.reset();
                this._close();
            });
            yield this.refreshItems();
            this.dispatch('open');
        });
    }
    _close() {
        var _a;
        (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
        this.dispatch('close');
    }
    focus() {
        this._$input.focus();
    }
    blur() {
        this._$input.blur();
        this._close();
    }
    refreshItems() {
        return __awaiter(this, void 0, void 0, function* () {
            clearTimeout(this._isLoadingTimeout);
            this._isLoadingTimeout = setTimeout(() => {
                this._isLoading = true;
            }, 100);
            if (this.items) {
                if (typeof this.items === 'string') {
                    try {
                        this._items = JSON.parse(this.items);
                    }
                    catch (e) {
                        const $itemsElm = document.querySelector(this.items);
                        if ($itemsElm) {
                            this._items = JSON.parse($itemsElm.innerHTML.trim());
                        }
                    }
                }
                else if (typeof this.items === 'function') {
                    this._items = yield this.items({
                        search: this._filterValue,
                        items: this._items,
                    });
                }
                else {
                    this._items = this.items;
                }
                this.dispatch('items', {
                    detail: {
                        items: this._items,
                    },
                });
            }
            // init items (state, id, etc...)
            this._initItems(this._items);
            // filter items
            yield this._filterItems();
            // update component
            clearTimeout(this._isLoadingTimeout);
            this._isLoading = false;
            // preselect the first item in the list
            if (this._filteredItems.length) {
                this.preselect(this._filteredItems[0], {
                    preventFocus: true,
                });
            }
        });
    }
    _initItems(items) {
        return items.map((item) => {
            if (item.items) {
                item.items = this._initItems(item.items);
            }
            return this._initItem(item);
        });
    }
    _initItem(item) {
        if (item.type === 'group') {
            return;
        }
        if (!item.state) {
            item.state = {
                match: true,
                preselected: false,
                selected: false,
            };
        }
        if (!item.id) {
            item.id = __uniqid();
        }
        if (!item.type) {
            item.type = 'item';
        }
        return item;
    }
    _getItemsOnly() {
        const itemsOnly = [];
        this._items.forEach((item) => {
            if (item.type == 'group') {
                item.items.forEach((item) => {
                    itemsOnly.push(item);
                });
            }
            else {
                itemsOnly.push(item);
            }
        });
        return itemsOnly;
    }
    _filterItems() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filterValue && this._filterValue.length < this.minChars) {
                return;
            }
            this._isLoading = true;
            const itemsOnly = this._getItemsOnly();
            let _filterValue = this._filterValue;
            if (this.filterValuePreprocess) {
                _filterValue = this.filterValuePreprocess(_filterValue);
            }
            _filterValue = __escapeRegexChars(_filterValue);
            let _filteredItems = itemsOnly;
            // custom function
            if (this.filterItems) {
                _filteredItems = yield this.filterItems(_filteredItems, _filterValue, this);
            }
            else {
                let matchedItemsCount = 0;
                if (!this.filtrable.length)
                    return true;
                _filteredItems = _filteredItems.filter((item) => {
                    let matchFilter = false;
                    for (let i = 0; i < Object.keys(item).length; i++) {
                        const propName = Object.keys(item)[i];
                        if (typeof item[propName] !== 'string')
                            continue;
                        const propValue = __stripTags(item[propName]);
                        // store original value
                        if (!item._original) {
                            Object.defineProperty(item, `_original`, {
                                value: {},
                                writable: true,
                                configurable: false,
                                enumerable: false,
                            });
                        }
                        if (!item[`_original`][propName]) {
                            item[`_original`][propName] = item[propName];
                        }
                        // check if the current propName is specified in the filtrable list
                        if (this.filtrable.indexOf(propName) !== -1) {
                            const searchParts = _filterValue
                                .split(' ')
                                .map((v) => v.replace(/[^a-zA-Z0-9 ]/g, '').trim())
                                .filter((v) => v !== '');
                            const reg = new RegExp(`${_filterValue}`
                                .split(' ')
                                .map((v) => {
                                return v.replace(/[^a-zA-Z0-9 ]+/g, '').trim();
                            })
                                .join('|'), 'gi');
                            if (propValue.match(reg)) {
                                matchFilter = true;
                                if (this.highlightable.includes(propName) &&
                                    _filterValue &&
                                    _filterValue !== '') {
                                    let finalString = item._original[propName];
                                    finalString = __highlightText(finalString, searchParts, {
                                        class: this.cls('_highlight'),
                                    });
                                    item[propName] = finalString;
                                }
                                else {
                                    item[propName] = item._original[propName];
                                }
                            }
                            else {
                                item[propName] = item._original[propName];
                            }
                        }
                    }
                    if (matchFilter) {
                        matchedItemsCount++;
                    }
                    item.state.match = matchFilter;
                    return matchFilter;
                });
            }
            this._filteredItems = _filteredItems;
            this._isLoading = false;
        });
    }
    /**
     * Maintain the dropdown position and size
     */
    _updateListSizeAndPosition() {
        if (!this.isActive() || this.inline)
            return;
        if (!this._$dropdown)
            return;
        const marginTop = __getStyleProperty(this._$dropdown, 'marginTop'), marginBottom = __getStyleProperty(this._$dropdown, 'marginBottom');
        const distanceTop = __distanceFromElementTopToViewportTop(this._$input);
        const distanceBottom = __distanceFromElementTopToViewportBottom(this._$input) -
            this._$input.clientHeight;
        let maxHeight;
        if (distanceTop > distanceBottom) {
            this._$container.classList.add('-top');
            this._$dropdown.style.top = `auto`;
            this._$dropdown.style.bottom = `calc(100% - ${marginBottom})`;
            maxHeight = distanceTop - parseInt(marginTop);
        }
        else {
            this._$container.classList.remove('-top');
            this._$dropdown.style.bottom = `auto`;
            this._$dropdown.style.top = `calc(100% - ${marginTop})`;
            maxHeight = distanceBottom - parseInt(marginBottom);
        }
        this._$dropdown.style.maxHeight = `${maxHeight}px`;
    }
    /**
     * This function just remove a keyword from the input and filter the items again
     */
    _removeKeyword(keyword) {
        const newValue = this._filterValue
            .split(' ')
            .filter((k) => k !== keyword)
            .join(' ');
        this.setSearch(newValue);
    }
    _renderItems(items, inGroup = false) {
        return html `${items.map((item, idx) => {
            return this._renderItem(item, idx, inGroup);
        })}`;
    }
    _renderItem(item, idx, inGroup = false) {
        var _a;
        this._currentItemIdx++;
        if (!item._internalId) {
            Object.defineProperty(item, '_internalId', {
                value: `s-${__uniqid()}`,
                writable: false,
                enumerable: false,
                configurable: false,
            });
        }
        if (this.maxItems !== -1 &&
            this._currentItemIdx > this._displayedMaxItems) {
            return;
        }
        return html `
      <li
        data-id="${item.id}"
        data-internal-id="${item._internalId}"
        @pointerup=${() => this.select(item)}
        @mouseover=${() => {
            if (this._isArrowUsed)
                return;
            this.preselect(item);
            this.requestUpdate();
        }}
        style="z-index: ${999999999 - idx}"
        tabindex="-1"
        class="${this.cls('_item')} ${this.classes.item} ${inGroup
            ? this.cls('_group-item')
            : ''} ${item.state.selected ? '-selected' : ''} ${item.state
            .preselected
            ? '-preselected'
            : ''} ${this._filterValue ? '-filtered' : ''} ${item.state.match
            ? '-match'
            : ''}"
      >
        ${this._renderTemplate({
            type: (_a = item.type) !== null && _a !== void 0 ? _a : 'item',
            item,
            idx,
        })}
      </li>
    `;
    }
    render() {
        this._currentItemIdx = 0;
        const $before = this._renderTemplate({
            type: 'before',
        }), $after = this._renderTemplate({
            type: 'after',
        }), $empty = this._renderTemplate({
            type: 'empty',
        });
        return html `
      <div class="${this.cls('_dropdown')} ${this.classes.dropdown}">
        ${$before
            ? html `
              <div
                class="${this.cls('_before')} ${this.classes.before}"
                tabindex="-1"
              >
                ${$before}
              </div>
            `
            : ''}
        ${this._$input && this._$input.value && this.showKeywords
            ? html `
              <div
                tabindex="-1"
                class="${this.cls('_keywords')} ${this.classes.keywords}"
              >
                ${this._$input.value
                .split(' ')
                .filter((s) => s !== '')
                .map((keyword) => html `
                      <span
                        tabindex="-1"
                        @click=${() => this._removeKeyword(keyword)}
                        class="${this.cls('_keyword')}"
                        >${__i18n(keyword)}</span
                      >
                    `)}
              </div>
            `
            : ''}
        <ul class="${this.cls('_items')} ${this.classes.items}">
          ${this._isLoading
            ? html `
                <li class="${this.classes.item} ${this.cls('_loading')}">
                  ${this._renderTemplate({
                type: 'loading',
            })}
                </li>
              `
            : !this._isLoading && this._filteredItems.length <= 0 && $empty
                ? html `
                <li class="${this.classes.item} ${this.cls('_empty')}">
                  ${$empty}
                </li>
              `
                : !this._isLoading
                    ? this._items.map((item, idx) => {
                        var _a, _b, _c, _d;
                        switch (item.type) {
                            case 'group':
                                const renderedItems = this._renderItems((_a = item.items) !== null && _a !== void 0 ? _a : [], true);
                                return html `
                      <li
                        class="${this.classes.group} ${this.cls('_group')}"
                        group="${(_d = (_c = (_b = item[this.label]) !== null && _b !== void 0 ? _b : item.label) !== null && _c !== void 0 ? _c : item.title) !== null && _d !== void 0 ? _d : item.name}"
                      >
                        ${this._renderTemplate({
                                    type: 'group',
                                    $items: renderedItems,
                                    item,
                                })}
                      </li>
                    `;
                                break;
                            default:
                                return html ` ${this._renderItem(item, idx)} `;
                                break;
                        }
                    })
                    : ''}
        </ul>
        ${$after
            ? html `
              <div
                class="${this.cls('_after')} ${this.classes.after}"
                tabindex="-1"
              >
                ${$after}
              </div>
            `
            : ''}
      </div>
    `;
    }
}
__decorate([
    state()
], AdvancedSelectElement.prototype, "_filterValue", void 0);
__decorate([
    state()
], AdvancedSelectElement.prototype, "_items", void 0);
__decorate([
    state()
], AdvancedSelectElement.prototype, "_filteredItems", void 0);
__decorate([
    state()
], AdvancedSelectElement.prototype, "_isLoading", void 0);
__decorate([
    property()
], AdvancedSelectElement.prototype, "items", void 0);
__decorate([
    property()
], AdvancedSelectElement.prototype, "value", void 0);
__decorate([
    property()
], AdvancedSelectElement.prototype, "label", void 0);
__decorate([
    property({ type: Boolean })
], AdvancedSelectElement.prototype, "showKeywords", void 0);
__decorate([
    property({ type: String })
], AdvancedSelectElement.prototype, "emptyText", void 0);
__decorate([
    property({ type: String })
], AdvancedSelectElement.prototype, "loadingText", void 0);
__decorate([
    property({ type: Function })
], AdvancedSelectElement.prototype, "filterValuePreprocess", void 0);
__decorate([
    property({ type: String })
], AdvancedSelectElement.prototype, "hotkey", void 0);
__decorate([
    property({ type: Function })
], AdvancedSelectElement.prototype, "filterItems", void 0);
__decorate([
    property({ type: Number })
], AdvancedSelectElement.prototype, "minChars", void 0);
__decorate([
    property({ type: Array })
], AdvancedSelectElement.prototype, "filtrable", void 0);
__decorate([
    property({ type: Array })
], AdvancedSelectElement.prototype, "highlightable", void 0);
__decorate([
    property({ type: Object })
], AdvancedSelectElement.prototype, "templates", void 0);
__decorate([
    property({ type: Number })
], AdvancedSelectElement.prototype, "closeTimeout", void 0);
__decorate([
    property({ type: Boolean })
], AdvancedSelectElement.prototype, "notSelectable", void 0);
__decorate([
    property({ type: Number })
], AdvancedSelectElement.prototype, "maxItems", void 0);
__decorate([
    property({ type: Object })
], AdvancedSelectElement.prototype, "classes", void 0);
__decorate([
    property({ type: Boolean })
], AdvancedSelectElement.prototype, "inline", void 0);
//# sourceMappingURL=AdvancedSelectElement.js.map