import __LitElement from '@lotsof/lit-element';
import { PropertyValueMap } from 'lit';
import '../../src/css/advancedSelectElement.css';
export interface IAdvancesSelectElementItemsFunctionApi {
    search: string;
    items: any[];
}
export interface IAdvancedSelectElementItemState {
    match: boolean;
    preselected: boolean;
    selected: boolean;
}
export interface IAdvancedSelectElementItem {
    id: string;
    type?: 'item' | 'group';
    state: IAdvancedSelectElementItemState;
    [key: string]: any;
}
export interface IAdvancesSelectElementClasses {
    container?: string;
    input?: string;
    dropdown?: string;
    items?: string;
    item?: string;
    before?: string;
    after?: string;
    keywords?: string;
    group?: string;
}
export interface IAdvancesSelectElementApi {
    type: string;
    item: any;
    $items: any[];
    html: Function;
    unsafeHTML: Function;
    idx: number;
}
/**
 * @name                AdvancedSelectElement
 * @as                  Filtrable input
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
 * @event           advancedSelect.items                Dispatched when the items are setted of updated
 * @event           advancedSelect.select               Dispatched when an item has been selected
 * @event           advancedSelect.close                Dispatched when the dropdown is closed
 * @event           advancedSelect.open                 Dispatched when the dropdown is opened
 * @event           advancedSelect.reset                Dispatched when the input is resetted
 * @event           advancedSelect.loading              Dispatched when the element enterd in loading state
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
    private _searchValue;
    private _items;
    private _filteredItems;
    private _isLoading;
    items: any[] | ((api: IAdvancesSelectElementItemsFunctionApi) => any[]);
    value: string | Function;
    label: string | Function;
    showKeywords: boolean;
    emptyText: string;
    loadingText: string;
    _searchValuePreprocess?: Function;
    filterItems?: Function;
    filtrable: string[];
    templates?: (api: IAdvancesSelectElementApi) => any;
    closeTimeout: number;
    interactive: boolean;
    notSelectable: boolean;
    maxItems: number;
    classes: IAdvancesSelectElementClasses;
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
    mount(): Promise<void>;
    _loadingTimeout: any;
    protected updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    firstUpdated(): Promise<void>;
    _grabTemplates(): void;
    _renderTemplate(api: Partial<IAdvancesSelectElementApi>): any;
    validate(): void;
    validateAndClose(): void;
    /**
     * Preselect an item
     */
    preselect(item: any): void;
    preselectById(id: string): void;
    resetPreselected(): void;
    /**
     * Select an item
     */
    select(item: any): void;
    selectById(id: string): void;
    selectValidateAndClose(item: any): void;
    resetSelected(): void;
    /**
     *  Reset
     */
    reset(): void;
    getItemById(id: string): IAdvancedSelectElementItem;
    getPreselectedItem(): IAdvancedSelectElementItem;
    getSelectedItem(): IAdvancedSelectElementItem;
    getMatchItems(): IAdvancedSelectElementItem[];
    open(): Promise<void>;
    close(): void;
    private _isLoadingTimeout;
    refreshItems(): Promise<void>;
    _initItems(items: any[]): IAdvancedSelectElementItem[];
    _initItem(item: Partial<IAdvancedSelectElementItem>): IAdvancedSelectElementItem;
    _getItemsOnly(): IAdvancedSelectElementItem[];
    _filterItems(): Promise<void>;
    /**
     * Maintain the dropdown position and size
     */
    _updateListSizeAndPosition(): void;
    /**
     * This function just remove a keyword from the input and filter the items again
     */
    _removeKeyword(keyword: string): void;
    _renderItems(items: any[], inGroup?: boolean): any;
    _renderItem(item: any[], idx: number, inGroup?: boolean): any;
    private _currentItemIdx;
    render(): import("lit-html").TemplateResult<1>;
}
