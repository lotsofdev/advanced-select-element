// @ts-nocheck

import { __highlightText } from '@lotsof/sugar/string';

import __LitElement from '@lotsof/lit-element';
// @TODO            check why import does not work
// @ts-ignore
import { __isFocusWithin } from '@lotsof/sugar/is';
import { __uniqid } from '@lotsof/sugar/string';
import { PropertyValueMap, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { __escapeRegexChars } from '@lotsof/sugar/string';

import { __i18n } from '@lotsof/i18n';

import { __hotkey } from '@lotsof/sugar/keyboard';

import { __nearestElement } from '@lotsof/sugar/dom';

import { __escapeQueue } from '@lotsof/sugar/keyboard';

import '../../src/css/AdvancedSelectElement.bare.css';

import {
  __distanceFromElementTopToViewportBottom,
  __distanceFromElementTopToViewportTop,
  __getStyleProperty,
  __onScrollEnd,
} from '@lotsof/sugar/dom';

import { __stripTags } from '@lotsof/sugar/html';

import type {
  TAdvancedSelectElementApi,
  TAdvancedSelectElementClasses,
  TAdvancedSelectElementItemsFunctionApi,
} from '../shared/AdvancedSelectElement.types.js';

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
  // @state()
  private _displayedMaxItems: number = 0;

  @state()
  private _filterValue: string = '';

  @state()
  private _items: TAdvancedSelectElementItem[] = [];

  @state()
  private _filteredItems: TAdvancedSelectElementItem[] = [];

  @state()
  private _isLoading: boolean = false;

  @property()
  public items:
    | any[]
    | ((api: TAdvancedSelectElementItemsFunctionApi) => any[]) = [];

  @property()
  public value: string | Function = 'value';

  @property()
  public label: string | Function = 'label';

  @property({ type: Boolean })
  public showKeywords: boolean = false;

  @property({ type: String })
  public emptyText: string = __i18n('No items found...');

  @property({ type: String })
  public loadingText: string = __i18n('Loading, please wait...');

  @property({ type: Function })
  public filterValuePreprocess?: Function;

  @property({ type: String })
  public hotkey?: string;

  @property({ type: Function })
  public filterItems?: Function;

  @property({ type: Number })
  public minChars: number = 1;

  @property({ type: Array })
  public filtrable: string[] = [];

  @property({ type: Array })
  public highlightable: string = [];

  @property({ type: Object })
  public templates?: (api: TAdvancedSelectElementApi) => any;

  @property({ type: Number })
  public closeTimeout: number = 100;

  @property({ type: Boolean })
  public interactive: boolean = true;

  @property({ type: Boolean })
  public notSelectable: boolean = false;

  @property({ type: Number })
  public maxItems: number = -1;

  @property({ type: Object })
  public classes: TAdvancedSelectElementClasses = {};

  @property({ type: Boolean })
  public inline: boolean = false;

  private _$container: HTMLElement = document.createElement('div');
  private _$list: HTMLElement = document.createElement('ul');
  private _$dropdown: HTMLElement = document.createElement('div');
  private _$input: HTMLInputElement = document.createElement('input');
  private _$form?: HTMLFormElement;
  private _templatesFromHtml: Record<string, string> = {};
  private _isArrowUsed: boolean = false;
  private _isArrowUsedTimeout?: Timeout;
  private _baseTemplates = (api: TAdvancedSelectElementApi): any => {};

  constructor() {
    super('s-advanced-select');
  }
  private async mount() {
    this._displayedMaxItems = this.maxItems;

    // filtrable
    if (typeof this.filtrable === 'string') {
      this.filtrable = (<string>this.filtrable).split(',').map((f) => f.trim());
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
      throw new Error(
        `Sorry but you have to specify at least one property in the "filtrable" item property...`,
      );
    }

    // @ts-ignore
    this._baseTemplates = ({ type, item, $items, html }) => {
      switch (type) {
        case 'item':
          return html`
            ${unsafeHTML(
              typeof this.label === 'function'
                ? __i18n(this.label({ item }))
                : __i18n(item[this.label]),
            )}
          `;
          break;
        case 'group':
          return html` <h4 class="${this.cls('_group-label')}">
              ${__i18n(item.label)}
            </h4>
            <ul class="${this.cls('_group-items')}">
              <div class="${this.cls('_group-items-inner')}">${$items}</div>
            </ul>`;
          break;
        case 'empty':
          return html` <div>${__i18n(this.emptyText)}</div> `;
          break;
        case 'loading':
          return html`
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
        this._$input.focus();
      });
    }
  }

  _loadingTimeout: any;
  protected updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    if (changedProperties.has('_isLoading')) {
      if (this._isLoading) {
        this.dispatch('loading');
      } else {
        this.dispatch('loaded');
      }
    }

    if (this._filterValue) {
      this.classList.add('-filtered');
    } else {
      this.classList.remove('-filtered');
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

  protected async firstUpdated() {
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

    // handle update on key event
    this._$input.addEventListener('keyup', async (e) => {
      if (!this.isActive()) {
        return;
      }

      // nothing has changed
      if (this._filterValue === (<HTMLInputElement>e.target).value) {
        return;
      }

      this.resetPreselected();
      this.resetSelected();

      const value = (<HTMLInputElement>e.target).value;
      this._filterValue = value;
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
      this._filterValue = value;
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
      `.${this.internalCls('_dropdown')}`,
    ) as HTMLElement;

    // handle scroll behaviors
    document.addEventListener('scroll', () => {
      this._updateListSizeAndPosition();
    });
    this._updateListSizeAndPosition();
    __onScrollEnd(this._$list, () => {
      if (this.maxItems === -1) {
        return;
      }
      this._displayedMaxItems = (this._displayedMaxItems ?? 0) + this.maxItems;
      this._filterItems();
    });

    // handle arrows
    document.addEventListener('keyup', (e) => {
      if (!this.isActive()) return;
      if (!this._filteredItems.length) return;

      const directionsMap = {
        ArrowDown: 'bottom',
        ArrowUp: 'top',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      if (!directionsMap[e.key]) return;

      // mark the arrow as used
      this._isArrowUsed = true;
      clearTimeout(this._isArrowUsedTimeout);
      this._isArrowUsedTimeout = setTimeout(() => {
        this._isArrowUsed = false;
      }, 100);

      const $items = this.querySelectorAll(
          `.${this.internalCls('_item')}.-match`,
        ),
        $from =
          this.querySelector(`.${this.internalCls('_item')}.-preselected`) ||
          this.querySelector(`.${this.internalCls('_item')}.-selected`) ||
          this.querySelectorAll(`.${this.internalCls('_item')}`)[0];

      let direction;

      if (!this.getPreselectedItem()) {
        this.preselect($items[0].dataset.id);
      } else {
        let $nearestElement: HTMLElement = __nearestElement($from, $items, {
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
      if (!this.isActive()) return;
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
  }

  private _initListeners(): void {
    // handle hotkeys
    if (this.hotkey) {
      __hotkey(this.hotkey, () => {
        this._$input.focus();
      });
    }
  }

  private _grabTemplatesFromDom() {
    this.querySelectorAll('template').forEach(($template) => {
      if (!$template.hasAttribute('type')) return;
      // @ts-ignore
      this._templatesFromHtml[$template.getAttribute('type')] =
        $template.innerHTML;
    });
  }

  private _renderTemplate(api: Partial<TAdvancedSelectElementApi>): any {
    const finalApi: TAdvancedSelectElementApi = {
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

  /**
   * Preselect an item
   */
  public preselect(
    item: string | TAdvancedSelectElementItem,
    settings?: {
      preventFocus?: boolean;
    },
  ): void {
    if (typeof item === 'string') {
      item = this.getItemById(item);
    }
    // reset preselected
    this.getPreselectedItem()?.state.preselected = false;
    // check if the component is in not selectable mode
    if (this.notSelectable) return;
    // do not preselect if not match the search
    if (!item.state.match) return;
    // set the new preselected
    item.state.preselected = true;
    // set focus in the input
    if (!settings?.preventFocus) {
      setTimeout(() => {
        this._$input.focus();
      });
    }
    // make sure the ui is up to date
    this.requestUpdate();
  }

  public resetPreselected(): void {
    this.getPreselectedItem()?.state.preselected = false;
  }

  public async setSearch(value: string): void {
    this._$input.value = value;
    this._filterValue = value;
    this._filterItems();
    await this.refreshItems();
    this.requestUpdate();
  }

  /**
   * Select an item
   */
  public select(
    item: string | TAdvancedSelectElementItem = this.getPreselectedItem(),
  ): void {
    if (typeof item === 'string') {
      item = this.getItemById(item);
    }
    // reset preselected
    // this.getPreselectedItem()?.state.selected = false;
    // check if the component is in not selectable mode
    if (this.notSelectable) return;
    // do not select if not match the search
    if (!item.state.match) return;
    // set the new preselected
    item.state.selected = true;
    // set focus in the input
    setTimeout(() => {
      if (!item.preventSet) {
        this.setSearch(item.value ?? item.id);
      } else {
        this.setSearch('');
      }
      if (item.preventClose) {
        this._$input.focus();
      }
    });

    // close if not prevented
    if (!item.preventClose) {
      this.close();
    }

    // dispatch an event
    if (!item.preventSelect) {
      this.dispatch('select', {
        detail: {
          item,
          $elm: this.querySelector(
            `.${this.internalCls('_item')}[data-internal-id="${
              item._internalId
            }"]`,
          ),
        },
      });
    }

    // make sure the ui is up to date
    this.requestUpdate();
  }

  public resetSelected(): void {
    this.getSelectedItem()?.state.selected = false;
  }

  /**
   *  Reset
   */
  public reset() {
    this.resetPreselected();
    this.resetSelected();
    this.setSearch('');
    this.dispatch('reset');
  }
  public getItemById(id: string): TAdvancedSelectElementItem {
    return this._filteredItems.find((item) => item.id === id);
  }
  public getPreselectedItem(): TAdvancedSelectElementItem {
    return this._filteredItems.find((item) => item.state.preselected);
  }
  public getSelectedItem(): TAdvancedSelectElementItem {
    return this._filteredItems.find((item) => item.state.selected);
  }
  public getMatchItems(): TAdvancedSelectElementItem[] {
    return this._filteredItems.filter((item) => item.state.match);
  }
  public async open(): void {
    __escapeQueue(() => {
      if (!this.isActive()) return;
      this.reset();
      this.close();
    });
    await this.refreshItems();
    this.dispatch('open');
  }
  public close(): void {
    (<HTMLElement>document.activeElement)?.blur();
    this.dispatch('close');
  }

  private _isLoadingTimeout: any;
  public async refreshItems(): Promise<void> {
    clearTimeout(this._isLoadingTimeout);
    this._isLoadingTimeout = setTimeout(() => {
      this._isLoading = true;
    }, 100);

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
          search: this._filterValue,
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

    // init items (state, id, etc...)
    this._initItems(this._items);

    // filter items
    await this._filterItems();

    // update component
    clearTimeout(this._isLoadingTimeout);
    this._isLoading = false;

    // preselect the first item in the list
    this.preselect(this._filteredItems[0], {
      preventFocus: true,
    });
  }

  private _initItems(items: any[]): TAdvancedSelectElementItem[] {
    return items.map((item) => {
      if (item.items) {
        item.items = this._initItems(item.items);
      }
      return this._initItem(item);
    });
  }

  private _initItem(
    item: Partial<TAdvancedSelectElementItem>,
  ): TAdvancedSelectElementItem | undefined {
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
    return item as TAdvancedSelectElementItem;
  }

  private _getItemsOnly(): TAdvancedSelectElementItem[] {
    const itemsOnly: any[] = [];
    this._items.forEach((item) => {
      if (item.type == 'group') {
        item.items.forEach((item) => {
          itemsOnly.push(item);
        });
      } else {
        itemsOnly.push(item);
      }
    });

    return itemsOnly;
  }

  private async _filterItems() {
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
      _filteredItems = await this.filterItems(
        _filteredItems,
        _filterValue,
        this,
      );
    } else {
      let matchedItemsCount = 0;
      if (!this.filtrable.length) return true;
      _filteredItems = _filteredItems.filter((item) => {
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
            const searchParts = _filterValue
              .split(' ')
              .map((v) => v.replace(/[^a-zA-Z0-9 ]/g, '').trim())
              .filter((v) => v !== '');

            const reg = new RegExp(
              `${_filterValue}`
                .split(' ')
                .map((v) => {
                  return v.replace(/[^a-zA-Z0-9 ]+/g, '').trim();
                })
                .join('|'),
              'gi',
            );

            if (propValue.match(reg)) {
              matchFilter = true;
              if (
                this.highlightable.includes(propName) &&
                _filterValue &&
                _filterValue !== ''
              ) {
                let finalString: string = item._original[propName];
                finalString = __highlightText(finalString, searchParts, {
                  class: this.cls('_highlight'),
                });
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
        item.state.match = matchFilter;
        return matchFilter;
      });
    }

    this._filteredItems = _filteredItems;
    this._isLoading = false;
  }

  /**
   * Maintain the dropdown position and size
   */
  private _updateListSizeAndPosition() {
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
  private _removeKeyword(keyword: string): void {
    const newValue = this._filterValue
      .split(' ')
      .filter((k) => k !== keyword)
      .join(' ');
    this.setSearch(newValue);
  }

  private _renderItems(
    items: TAdvancedSelectElementItem[],
    inGroup: boolean = false,
  ): any {
    return html`${items.map((item, idx) => {
      return this._renderItem(item, idx, inGroup);
    })}`;
  }

  private _renderItem(
    item: TAdvancedSelectElementItem,
    idx: number,
    inGroup: boolean = false,
  ): any {
    this._currentItemIdx++;

    if (!item._internalId) {
      Object.defineProperty(item, '_internalId', {
        value: `s-${__uniqid()}`,
        writable: false,
        enumerable: false,
        configurable: false,
      });
    }

    if (
      this.maxItems !== -1 &&
      this._currentItemIdx > this._displayedMaxItems
    ) {
      return;
    }

    return html`
      <li
        data-id="${item.id}"
        data-internal-id="${item._internalId}"
        @pointerup=${() => this.select(item)}
        @mouseover=${() => {
          if (this._isArrowUsed) return;
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
          type: item.type ?? 'item',
          item,
          idx,
        })}
      </li>
    `;
  }

  private _currentItemIdx = 0;
  public render() {
    this._currentItemIdx = 0;

    const $before = this._renderTemplate({
        type: 'before',
      }),
      $after = this._renderTemplate({
        type: 'after',
      }),
      $empty = this._renderTemplate({
        type: 'empty',
      });

    return html`
      <div class="${this.cls('_dropdown')} ${this.classes.dropdown}">
        ${$before
          ? html`
              <div
                class="${this.cls('_before')} ${this.classes.before}"
                tabindex="-1"
              >
                ${$before}
              </div>
            `
          : ''}
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
                        >${__i18n(keyword)}</span
                      >
                    `,
                  )}
              </div>
            `
          : ''}
        <ul class="${this.cls('_items')} ${this.classes.items}">
          ${this._isLoading
            ? html`
                <li class="${this.classes.item} ${this.cls('_loading')}">
                  ${this._renderTemplate({
                    type: 'loading',
                  })}
                </li>
              `
            : !this._isLoading && this._filteredItems.length <= 0 && $empty
            ? html`
                <li class="${this.classes.item} ${this.cls('_empty')}">
                  ${$empty}
                </li>
              `
            : !this._isLoading
            ? this._items.map((item, idx) => {
                switch (item.type) {
                  case 'group':
                    const renderedItems = this._renderItems(
                      item.items ?? [],
                      true,
                    );
                    return html`
                      <li
                        class="${this.classes.group} ${this.cls('_group')}"
                        group="${item[this.label as string] ??
                        item.label ??
                        item.title ??
                        item.name}"
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
                    return this._renderItem(item, idx);
                    break;
                }
              })
            : ''}
        </ul>
        ${$after
          ? html`
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
