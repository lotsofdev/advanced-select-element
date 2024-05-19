import __LitElement from '@lotsof/lit-element';
import '../../src/css/advancedSelectElement.css';
export interface IAdvancesSelectElementClasses {
    container?: string;
    input?: string;
    dropdown?: string;
    list?: string;
    item?: string;
    before?: string;
    after?: string;
    keywords?: string;
}
export interface IAdvancesSelectElementApi {
    type: string;
    item: any;
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
 * @event           s-filtrable-input.items              Dispatched when the items are setted of updated
 * @event           s-filtrable-input.select                Dispatched when an item has been selected
 * @event           s-filtrable-input                       Dispatched for every events of this component. Check the detail.eventType prop for event type
 *
 *
 * @support         chromium
 * @support         firefox
 * @support         safari
 * @support         edge
 *
 * @import          import { define as __AdvancedSelectElementDefine } from '@lotsof/s-filtrable-input-component';
 *
 * @snippet         __AdvancedSelectElementDefine($1)
 *
 * @install           shell
 * npm i @lotsof/s-filtrable-input-component
 *
 * @install           js
 * import { define as __AdvancedSelectElementDefine } from '@lotsof/s-filtrable-input-component';
 * __AdvancedSelectElementDefine();
 *
 * @example         html            Simple example
 * <template id="items">
 *   [{"title":"Hello","value":"hello"},{"title":"world","value":"world"}]
 * </template>
 * <s-filtrable-input items="#items" label="title" filtrable="title">
 *   <input type="text" class="s-input" placeholder="Type something..." />
 * </s-filtrable-input>
 *
 * @example         js
 * import { define } from '@lotsof/s-filtrable-input-component';
 * define();
 *
 * @example         html        Custom templates and items
 * <my-cool-filtrable-input>
 *    <input type="text" class="s-input" placeholder="Type something..." />
 * </my-cool-filtrable-input>
 *
 * @example         js
 * import { define } from '@lotsof/s-filtrable-input-component';
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
    items: any[] | Function;
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
    closeOnSelect: boolean;
    resetOnSelect: boolean;
    notSelectable: boolean;
    maxItems: number;
    classes: IAdvancesSelectElementClasses;
    inline: boolean;
    private _$container;
    private _$list;
    private _$dropdown;
    private _$input;
    private _$form?;
    private _preselectedItems;
    private _selectedItems;
    private _filteredItems;
    private _templatesFromHtml;
    private _baseTemplates;
    private _isLoading;
    constructor();
    mount(): Promise<void>;
    firstUpdated(): Promise<void>;
    _grabTemplates(): void;
    _renderTemplate(api: Partial<IAdvancesSelectElementApi>): any;
    validate(): void;
    validateAndClose(): void;
    resetSelected(): void;
    reset(): void;
    open(): void;
    close(): void;
    refreshItems(): Promise<void>;
    _filterItems(needUpdate?: boolean): Promise<void>;
    preselectAndValidate(item: any): void;
    preselectValidateAndClose(item: any): void;
    _setPreselectedItem(item: any): void;
    _updateListSizeAndPosition(): void;
    /**
     * This function just remove a keyword from the input and filter the items again
     */
    _removeKeyword(keyword: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
