import __LitElement from '@lotsof/lit-element';
// @TODO            check why import does not work
// @ts-ignore
import { __isFocusWithin } from '@lotsof/sugar/is';
import { PropertyValueMap, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { __escapeQueue } from '@lotsof/sugar/keyboard';

import '../../src/css/advancedSelectElement.css';

import {
  __distanceFromElementTopToViewportBottom,
  __distanceFromElementTopToViewportTop,
  __getStyleProperty,
  __onScrollEnd,
} from '@lotsof/sugar/dom';

import { __stripTags } from '@lotsof/sugar/html';

export interface IAdvancesSelectElementItemsFunctionApi {
  search: string;
  items: any[];
}

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
  @state()
  private _displayedMaxItems: number = 0;

  @state()
  private _searchValue: string = '';

  @state()
  private _items: any[] = [];

  @state()
  private _filteredItems: any[] = [];

  @state()
  private _preselectedItems: any[] = [];

  @state()
  private _selectedItems: any[] = [];

  @state()
  private _isLoading: boolean = false;

  @property()
  public items:
    | any[]
    | ((api: IAdvancesSelectElementItemsFunctionApi) => any[]) = [];

  @property()
  public value: string | Function = 'value';

  @property()
  public label: string | Function = 'label';

  @property()
  public showKeywords: boolean = false;

  @property()
  public emptyText: string = 'No items found...';

  @property()
  public loadingText: string = 'Loading, please wait...';

  @property()
  public _searchValuePreprocess?: Function;

  @property()
  public filterItems?: Function;

  @property()
  public filtrable: string[] = [];

  @property()
  public templates?: (api: IAdvancesSelectElementApi) => any;

  @property()
  public closeTimeout: number = 100;

  @property()
  public interactive: boolean = true;

  @property()
  public notSelectable: boolean = false;

  @property()
  public maxItems: number = 25;

  @property()
  public classes: IAdvancesSelectElementClasses = {};

  @property()
  public inline: boolean = false;

  private _$container: HTMLElement = document.createElement('div');
  private _$list: HTMLElement = document.createElement('ul');
  private _$dropdown: HTMLElement = document.createElement('div');
  private _$input: HTMLInputElement = document.createElement('input');
  private _$form?: HTMLFormElement;
  private _templatesFromHtml: Record<string, string> = {};
  private _baseTemplates = (api: IAdvancesSelectElementApi): any => {};

  constructor() {
    super({
      name: 'advanced-select',
    });
  }
  async mount() {
    this._displayedMaxItems = this.maxItems;

    // filtrable
    if (typeof this.filtrable === 'string') {
      this.filtrable = (<string>this.filtrable).split(',').map((f) => f.trim());
    }

    if (!this.filtrable.length && typeof this.label === 'string') {
      this.filtrable.push(this.label);
    }

    if (!this.filtrable.length) {
      throw new Error(
        `Sorry but you have to specify at least one property in the "filtrable" attribute...`,
      );
    }

    // @ts-ignore
    this._baseTemplates = ({ type, item, html }) => {
      switch (type) {
        case 'item':
          return html`
            ${unsafeHTML(
              typeof this.label === 'function'
                ? this.label({ item })
                : item[this.label],
            )}
          `;
          break;
        case 'empty':
          return html`
            <div class="${this.cls('_empty')}">${this.emptyText}</div>
          `;
          break;
        case 'loading':
          return html`
            <div class="${this.cls('_loading')}">${this.loadingText}</div>
          `;
          break;
      }
    };

    // if we have the focus in the
    if (__isFocusWithin(this)) {
      setTimeout(() => {
        this._$input.focus();
      });
    }
  }

  _loadingTimeout: any;
  protected updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    if (changedProperties.has('_isLoading')) {
      clearTimeout(this._loadingTimeout);
      if (this._isLoading) {
        this._loadingTimeout = setTimeout(() => {
          if (this._isLoading) {
            this.dispatch('loading');
          }
        }, 500);
      } else {
        this.dispatch('loaded');
      }
    }

    if (this._isLoading) {
      this.classList.add('-loading');
    } else {
      this.classList.remove('-loading');
    }
    if (!this._filteredItems.length) {
      this.classList.add('-empty');
    } else {
      this.classList.remove('-empty');
    }
    if (this.inline) {
      this.classList.add('-inline');
    } else {
      this.classList.remove('-inline');
    }
  }

  async firstUpdated() {
    // input
    this._$input =
      <any>this.querySelector('input') ?? document.createElement('input');
    if (!this._$input?.parentElement) {
      this.appendChild(this._$input);
    }
    this._$input.setAttribute('autocomplete', 'off');
    this._$form = this._$input.form as HTMLFormElement;
    // prevent from sending form if search is opened
    this._$form?.addEventListener('submit', (e) => {
      if (!this.isActive()) {
        e.preventDefault();
      }
    });

    // grab templates
    this._grabTemplates();

    // handle update on key event
    this._$input.addEventListener('keyup', async (e) => {
      if (!this.isActive()) {
        return;
      }

      // nothing has changed
      if (this._searchValue === (<HTMLInputElement>e.target).value) {
        return;
      }

      const value = (<HTMLInputElement>e.target).value;
      this._searchValue = value;
      this._displayedMaxItems = this.maxItems;

      // if passed a function to the items property,
      // we refresh the items at eash keystroke
      if (typeof this.items === 'function') {
        await this.refreshItems();
      } else {
        // just filterinf the current items
        this._filterItems();
      }
    });

    // handle update on focus
    this._$input.addEventListener('focus', (e) => {
      if (!this.isActive()) {
        return;
      }
      const value = (<HTMLInputElement>e.target).value;
      this._searchValue = value;
      this.open();
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
    this._$list = this.querySelector('ul') as HTMLUListElement;
    this._$dropdown = this.querySelector(
      `.${this.cls('_dropdown')}`,
    ) as HTMLElement;

    // handle scroll behaviors
    document.addEventListener('scroll', () => {
      this._updateListSizeAndPosition();
    });
    this._updateListSizeAndPosition();
    __onScrollEnd(this._$list, () => {
      this._displayedMaxItems = (this._displayedMaxItems ?? 0) + this.maxItems;
      this._filterItems();
    });

    // handle up arrow
    document.addEventListener('keyup', (e) => {
      if (e.key !== 'ArrowUp') {
        return;
      }

      if (!this.isActive()) return;
      if (!this._filteredItems.length) return;

      if (!this._preselectedItems.length) {
        this._preselectedItems.push(
          this._filteredItems[this._filteredItems.length - 1],
        );
      } else {
        const currentIdx = this._filteredItems.indexOf(
          this._preselectedItems[0],
        );
        if (currentIdx === -1) {
          return;
        }
        const newIdx = currentIdx - 1;
        if (newIdx < 0) return;
        this._preselectedItems = [];
        this._preselectedItems.push(this._filteredItems[newIdx]);
      }
      this.requestUpdate();

      const $item =
        this._$list.children[
          this._filteredItems.indexOf(this._preselectedItems[0])
        ];
      (<HTMLElement>$item).focus();
    });

    // handle down arrow
    document.addEventListener('keyup', (e) => {
      if (e.key !== 'ArrowDown') {
        return;
      }

      if (!this.isActive()) return;
      if (!this._filteredItems.length) return;

      if (!this._preselectedItems.length) {
        this._preselectedItems.push(this._filteredItems[0]);
      } else {
        const currentIdx = this._filteredItems.indexOf(
          this._preselectedItems[0],
        );
        if (currentIdx === -1) {
          return;
        }
        const newIdx = currentIdx + 1;
        if (newIdx > this._filteredItems.length - 1) return;
        this._preselectedItems = [];
        this._preselectedItems.push(this._filteredItems[newIdx]);
      }

      this.requestUpdate();

      const $item =
        this._$list.children[
          this._filteredItems.indexOf(this._preselectedItems[0])
        ];
      (<HTMLElement>$item).focus();
    });

    // handle return key
    document.addEventListener('keyup', (e) => {
      if (e.key !== 'Enter') {
        return;
      }

      // protect agains actions when not focus
      if (!this.isActive()) return;
      this.validateAndClose();
    });

    // restore value from state
    if (this._searchValue) {
      this._$input.value = this._searchValue;
    }

    // open if a value exists
    if (this._$input.value) {
      this._searchValue = this._$input.value;
    }
  }

  _grabTemplates() {
    this.querySelectorAll('template').forEach(($template) => {
      if (!$template.hasAttribute('type')) return;
      // @ts-ignore
      this._templatesFromHtml[$template.getAttribute('type')] =
        $template.innerHTML;
    });
  }

  _renderTemplate(api: Partial<IAdvancesSelectElementApi>): any {
    const finalApi: IAdvancesSelectElementApi = {
      type: '',
      item: null,
      html: html,
      unsafeHTML: unsafeHTML,
      idx: 0,
      ...api,
    };

    if (this.templates) {
      const res = this.templates(finalApi);
      if (res) return res;
    }
    // from template tags
    if (this._templatesFromHtml[finalApi.type]) {
      return html` ${unsafeHTML(this._templatesFromHtml[finalApi.type])} `;
    }
    // @ts-ignore
    return this._baseTemplates(finalApi);
  }
  validate() {
    this._selectedItems = this._preselectedItems;
    this._preselectedItems = [];

    // protect against not selected item
    if (!this._selectedItems.length) return;

    // temp thing cause we need to support multiple items selected at once
    // @TODO            support for multiple items selected at once
    const item = this._selectedItems[0];

    let value;
    if (typeof this.value === 'function') {
      value = this.value({
        items: [item],
      });
    } else {
      value = item[this.value];
    }

    if (!item.preventSet) {
      if (typeof value !== 'string') {
        throw new Error(
          `<red>[advancedSelect]</red> Sorry but the returned value "<yellow>${value}</yellow>" has to be a string...`,
        );
      }
      (<HTMLInputElement>this._$input).value = __stripTags(value);
    }

    let selectedItemItem = 0;
    for (let i = 0; i < this._filteredItems.length; i++) {
      const itemObj = this._filteredItems[i];
      if (itemObj.id === item.id) {
        selectedItemItem = i;
        break;
      }
    }

    const $selectedItem = this._$list.children[selectedItemItem];

    // dispatch an event
    if (!item.preventSelect) {
      this.dispatch('select', {
        detail: {
          item: this._selectedItems[0],
          items: this._selectedItems,
          $elm: $selectedItem,
        },
      });
    }

    // @ts-ignore
    this._searchValue = this._$input.value;

    // @ts-ignore
    this.requestUpdate();
  }
  validateAndClose() {
    this.validate();
    setTimeout(() => {
      this.close();
    }, this.closeTimeout);
  }
  resetPreselected() {
    this._preselectedItems = [];
    this.requestUpdate();
  }
  resetSelected() {
    this.resetPreselected();
    this._selectedItems = [];
    this.requestUpdate();
  }
  reset() {
    this.resetSelected();
    this._$input.value = '';
    this._searchValue = '';
    this._filterItems();
    this.dispatch('reset');
  }
  async open() {
    __escapeQueue(() => {
      if (!this.isActive()) return;
      this.resetPreselected();
      this.close();
    });
    await this.refreshItems();
    this.dispatch('open');
  }
  close() {
    (<HTMLElement>document.activeElement)?.blur();
    this.dispatch('close');
  }
  async refreshItems() {
    this._isLoading = true;

    if (this.items) {
      if (typeof this.items === 'string') {
        try {
          this._items = JSON.parse(this.items);
        } catch (e) {
          const $itemsElm: HTMLElement | null = document.querySelector(
            this.items,
          );
          if ($itemsElm) {
            this._items = JSON.parse((<HTMLElement>$itemsElm).innerHTML.trim());
          }
        }
      } else if (typeof this.items === 'function') {
        this._items = await this.items({
          search: this._searchValue,
          items: this._items,
        });
      } else {
        this._items = this.items;
      }

      this.dispatch('items', {
        detail: {
          items: this._items,
        },
      });
    }
    await this._filterItems();

    this._isLoading = false;
  }
  async _filterItems() {
    this._isLoading = true;

    // reset selected
    this.resetSelected();

    let items = this._items;

    let _searchValue = this._searchValue;
    if (this._searchValuePreprocess) {
      _searchValue = this._searchValuePreprocess(_searchValue);
    }

    // let _filteredItems = items.map((item) => __clone(item));
    let _filteredItems = items;

    // custom function
    if (this.filterItems) {
      _filteredItems = await this.filterItems(this._items, _searchValue, this);
    } else {
      let matchedItemsCount = 0;
      _filteredItems = _filteredItems.filter((item) => {
        if (matchedItemsCount >= this._displayedMaxItems) return false;

        if (!this.filtrable.length) return true;

        let matchFilter = false;
        for (let i = 0; i < Object.keys(item).length; i++) {
          const propName = Object.keys(item)[i];

          if (typeof item[propName] !== 'string') continue;

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
            const reg = new RegExp(
              `${_searchValue}`.split(' ').join('|'),
              'gi',
            );

            if (propValue.match(reg)) {
              matchFilter = true;
              if (_searchValue && _searchValue !== '') {
                const reg = new RegExp(_searchValue.split(' ').join('|'), 'gi');
                const finalString = item._original[propName].replace(
                  reg,
                  (str) => {
                    return `<span class="${this.cls('_highlight')}"
                                      >${str}</span>`;
                  },
                );
                item[propName] = finalString;
              } else {
                item[propName] = item._original[propName];
              }
            } else {
              item[propName] = item._original[propName];
            }
          }
        }
        if (matchFilter) {
          matchedItemsCount++;
        }
        return matchFilter;
      });
    }

    this._filteredItems = _filteredItems;

    this._isLoading = false;
  }
  preselectAndValidate(item) {
    this.preselect(item);
    this.validate();
  }
  preselectValidateAndClose(item) {
    this.preselect(item);
    this.validateAndClose();
  }
  preselect(item) {
    // check if the component is in not selectable mode
    if (this.notSelectable) return;
    if (!this._preselectedItems.includes(item)) {
      this._preselectedItems.push(item);
    }
    this.requestUpdate();
  }
  _updateListSizeAndPosition() {
    if (!this.isActive() || this.inline) return;

    if (!this._$dropdown) return;

    const marginTop = __getStyleProperty(this._$dropdown, 'marginTop'),
      marginBottom = __getStyleProperty(this._$dropdown, 'marginBottom');
    const distanceTop = __distanceFromElementTopToViewportTop(this._$input);
    const distanceBottom =
      __distanceFromElementTopToViewportBottom(this._$input) -
      this._$input.clientHeight;
    let maxHeight;

    if (distanceTop > distanceBottom) {
      this._$container.classList.add('-top');
      this._$dropdown.style.top = `auto`;
      this._$dropdown.style.bottom = `calc(100% - ${marginBottom})`;
      maxHeight = distanceTop - parseInt(marginTop);
    } else {
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
  _removeKeyword(keyword: string): void {
    const newValue = this._searchValue
      .split(' ')
      .filter((k) => k !== keyword)
      .join(' ');
    this._$input.value = newValue;
    this._searchValue = newValue;
    this._filterItems();
  }

  render() {
    return html`
      <div class="${this.cls('_dropdown')} ${this.classes.dropdown}">
        <div
          class="${this.cls('_before')} ${this.classes.before}"
          tabindex="-1"
        >
          ${this._renderTemplate({
            type: 'before',
          })}
        </div>
        ${this._$input && this._$input.value && this.showKeywords
          ? html`
              <div
                tabindex="-1"
                class="${this.cls('_keywords')} ${this.classes.keywords}"
              >
                ${this._$input.value
                  .split(' ')
                  .filter((s) => s !== '')
                  .map(
                    (keyword) => html`
                      <span
                        tabindex="-1"
                        @click=${() => this._removeKeyword(keyword)}
                        class="${this.cls('_keyword')}"
                        >${keyword}</span
                      >
                    `,
                  )}
              </div>
            `
          : ''}
        <ul class="${this.cls('_list')} ${this.classes.list}">
          ${this._isLoading
            ? html`
                <li
                  class="${this.cls('_item')} ${this.classes.item} ${this.cls(
                    '_loading',
                  )}"
                >
                  ${this._renderTemplate({
                    type: 'loading',
                  })}
                </li>
              `
            : !this._isLoading && this._filteredItems.length <= 0
            ? html`
                <li
                  class="${this.cls('_item')} ${this.classes.item} ${this.cls(
                    '_no-item',
                  )}"
                >
                  ${this._renderTemplate({
                    type: 'empty',
                  })}
                </li>
              `
            : !this._isLoading && this._filteredItems.length
            ? this._filteredItems.map((item, idx) =>
                idx < this._displayedMaxItems
                  ? html`
                      <li
                        @click=${() => this.preselectValidateAndClose(item)}
                        @focus=${() => this.preselect(item)}
                        style="z-index: ${999999999 - idx}"
                        tabindex="-1"
                        class="${this.cls('_item')} ${this.classes
                          .item} ${this._selectedItems.includes(item)
                          ? '-selected'
                          : ''} ${this._preselectedItems.includes(item)
                          ? '-preselected'
                          : ''}"
                      >
                        ${this._renderTemplate({
                          type: 'item',
                          item,
                          idx,
                        })}
                      </li>
                    `
                  : '',
              )
            : ''}
        </ul>
        <div class="${this.cls('_after')} ${this.classes.after}" tabindex="-1">
          ${this._renderTemplate({
            type: 'after',
          })}
        </div>
      </div>
    `;
  }
}
