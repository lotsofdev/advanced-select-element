import __LitElement from '@lotsof/lit-element';
import { PropertyValueMap } from 'lit';
import '../../src/css/AdvancedSelectElement.bare.css';
import type { TAdvancedSelectElementApi, TAdvancedSelectElementClasses, TAdvancedSelectElementItemsFunctionApi } from '../shared/AdvancedSelectElement.types.js';
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
 * @event           sAdvancedSelect.items                Dispatched when the items are setted of updated
 * @event           sAdvancedSelect.select               Dispatched when an item has been selected
 * @event           sAdvancedSelect.preselect            Dispatched when an item has been preselected
 * @event           sAdvancedSelect.close                Dispatched when the dropdown is closed
 * @event           sAdvancedSelect.open                 Dispatched when the dropdown is opened
 * @event           sAdvancedSelect.reset                Dispatched when the input is resetted
 * @event           sAdvancedSelect.loading              Dispatched when the element enterd in loading state
 *
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
 * import { define as __AdvancedSelectElementDefine } from '@lotsof/advancedSelect-component';
 * __AdvancedSelectElementDefine();
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
 * import { define } from '@lotsof/advancedSelect-component';
 * define();
 *
 * @example         html        Custom templates and items
 * <my-cool-filtrable-input>
 *    <input type="text" class="s-input" placeholder="Type something..." />
 * </my-cool-filtrable-input>
 *
 * @example         js
 * import { define } from '@lotsof/advancedSelect-component';
 * define({
 *     items: async () => {
 *         // you can get your items however you want
 *         // const request = await fetch('...');
 *         // const items = await request.json();
 *         return [{title: 'Hello', value: 'World'},{title: 'Plop', value:'Yop}];
 *     },
 *     templates: ({ type, html }) => {
 *         switch (type) {
 *             case 'item':
 *                 return html`
 *                     <li class="_item">
 *                         My title: ${item.title}
 *                     </li>
 *                 `;
 *                 break;
 *             case 'loading':
 *                 return html`
 *                     <li class="_loading">
 *                         Loading, please wait...
 *                     </li>
 *                 `;
 *                 break;
 *             case 'empty':
 *                 return html`
 *                     <li class="_empty">
 *                         No items found...
 *                     </li>
 *                 `;
 *                 break;
 *         }
 *     },
 * }, 'my-cool-filtrable-input');
 *
 * @since           2.0.0
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://coffeekraken.io)
 */
export default class AdvancedSelectElement extends __LitElement {
    private _displayedMaxItems;
    private _filterValue;
    private _items;
    private _filteredItems;
    private _isLoading;
    items: any[] | ((api: TAdvancedSelectElementItemsFunctionApi) => any[]);
    value: string | Function;
    label: string | Function;
    showKeywords: boolean;
    emptyText: string;
    loadingText: string;
    filterValuePreprocess?: Function;
    hotkey?: string;
    filterItems?: Function;
    minChars: number;
    filtrable: string[];
    highlightable: string;
    templates?: (api: TAdvancedSelectElementApi) => any;
    closeTimeout: number;
    interactive: boolean;
    notSelectable: boolean;
    maxItems: number;
    classes: TAdvancedSelectElementClasses;
    inline: boolean;
    private _$container;
    private _$list;
    private _$dropdown;
    private _$input;
    private _$form?;
    private _templatesFromHtml;
    private _isArrowUsed;
    private _isArrowUsedTimeout?;
    private _baseTemplates;
    constructor();
    private mount;
    _loadingTimeout: any;
    protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    protected firstUpdated(): Promise<void>;
    private _initListeners;
    private _grabTemplatesFromDom;
    private _renderTemplate;
    /**
     * Preselect an item
     */
    preselect(item: string | TAdvancedSelectElementItem, settings?: {
        preventFocus?: boolean;
    }): void;
    resetPreselected(): void;
    setSearch(value: string): void;
    /**
     * Select an item
     */
    select(item?: string | TAdvancedSelectElementItem): void;
    resetSelected(): void;
    /**
     *  Reset
     */
    reset(): void;
    getItemById(id: string): TAdvancedSelectElementItem;
    getPreselectedItem(): TAdvancedSelectElementItem;
    getSelectedItem(): TAdvancedSelectElementItem;
    getMatchItems(): TAdvancedSelectElementItem[];
    open(): void;
    close(): void;
    private _isLoadingTimeout;
    refreshItems(): Promise<void>;
    private _initItems;
    private _initItem;
    private _getItemsOnly;
    private _filterItems;
    /**
     * Maintain the dropdown position and size
     */
    private _updateListSizeAndPosition;
    /**
     * This function just remove a keyword from the input and filter the items again
     */
    private _removeKeyword;
    private _renderItems;
    private _renderItem;
    private _currentItemIdx;
    render(): import("lit-html").TemplateResult<1>;
}
