# Advanced Select Element

This custom element allows you to create with ease some fully customizable advanced select with built-in search, keyboard support, and more.

## Features

- Framework agnostic
  - Use the `customElement` api of the browser (through [Lit](https://lit.dev))
- Fully customizable
  - Use your own `input`
  - Fully customizable select options
  - Provided `CSS` template files
- Contextual options
  - Return custom options depending on actual user input
- Support for groups
  - Can group some items
  - Display the group name into the options
- I18n ready through [@lotsof/i18n](https://github.com/lotsofdev/i18n)
- Hotkey supported to focus in the `input`
- `minChars` to trigger the search only with a certain amount of characters
- `maxItems` to prevent displaying too many results
- `filtrable` to specify which of your item properties are used for search
- `highlightable` to specify which of your item properties are highlighted options
- `inline` to create an inline advanced element without the dropdown
- Flexible source:
  - Inline `JSON`
    - Through the `items` attribute
    - Through a script tag like `<script type="application/json">{...}</script>`
  - Remote `JSON` through `fetch`
  - Custom `function`
- Dispatched events:
  - `sAdvancedSelect.items`: Dispatched when the items are setted of updated
  - Full list bellow
- Simple and complete API:
  - `setSearch`: Set the input value and search for it
  - Full api bellow

### Coming features

- Infinite scroll in conjuction with the `maxDisplay` attribute

## Install

```sh
npm i @lotsof/advanced-select-element
```

## Usage

### Simple example

You need first to define your advanced select element like so:

```ts
import __SAdvancedSelectElement from '@lotsof/s-advanced-select-element';
import type { TAdvancedSelectElementItemsFunctionApi } from '@lotsof/s-advanced-select-element';

__SAdvancedSelectElement('my-advanced-select', __SAdvancedSelectElement, {
    items: (api: TAdvancedSelectElementItemsFunctionApi): TAdvancedSelectElementItem[] {
        return [{
            id: 'my-item-1',
            label: 'My item 1',
            value: 'my-item-1'
        }, {
            id: 'my-item-2',
            label: 'My item 2',
            value: 'my-item-2
        }];
    }
})
```

Then, simply add it to your `html` like so:

```html
<my-advanced-select>
  <input type="text" name="something" />
</my-advanced-select>
```

### Using groups

```ts
import __SAdvancedSelectElement from '@lotsof/s-advanced-select-element';
import type { TAdvancedSelectElementItemsFunctionApi } from '@lotsof/s-advanced-select-element';

__SAdvancedSelectElement('my-advanced-select', __SAdvancedSelectElement, {
    items: (api: TAdvancedSelectElementItemsFunctionApi): TAdvancedSelectElementItem[] {
        return [{
            type: 'group',
            label: 'Group 1',
            items: [{
                id: 'item-1',
                label: 'Item 1',
                value: 'item-1'
            }]
        }, {
            type: 'group',
            label: 'Group 2',
            items: [{
                id: 'item-2',
                label: 'Item 2',
                value: 'item-2'
            }]
        }]
    }
})
```

### Fetch items from an API

```ts
import __SAdvancedSelectElement from '@lotsof/s-advanced-select-element';
import type { TAdvancedSelectElementItemsFunctionApi } from '@lotsof/s-advanced-select-element';

__SAdvancedSelectElement('my-advanced-select', __SAdvancedSelectElement, {
  items: '/my/cool/api',
});
```

Then, simply add it to your `html` like so:

```html
<my-advanced-select>
  <input type="text" name="something" />
</my-advanced-select>
```

You can as well pass the `items` attribute directly on the component like so:

```html
<my-advanced-select items="/my/cool/api">
  <input type="text" name="something" />
</my-advanced-select>
```

### Different items depending on search

```ts
import __SAdvancedSelectElement from '@lotsof/s-advanced-select-element';
import type { TAdvancedSelectElementItemsFunctionApi } from '@lotsof/s-advanced-select-element';

__SAdvancedSelectElement('my-advanced-select', __SAdvancedSelectElement, {
    items: (api: TAdvancedSelectElementItemsFunctionApi): TAdvancedSelectElementItem[] {

        let items: TAdvancedSelectElementItem[] = [];

        switch(true) {
            case api.search.startsWith('/'):
                // show components
                items = [{
                    id: 'component-1',
                    label: 'Component 1',
                    value: '/component-1'
                }, {
                    id: 'component-2',
                    label: 'Component 2',
                    value: '/component-2'
                }]
            break;
            case api.search.startsWith('@'):
                // media queries
                items = [{
                    id: 'mobile',
                    label: 'Mobile',
                    value: '@mobile'
                }, {
                    id: 'desktop',
                    label: 'Desktop',
                    value: '@desktop'
                }];
            break;
            default:
                items = [{
                    id: 'components',
                    label: 'Components',
                    value: '/'
                }, {
                    id: 'mediaQueries',
                    label: 'Media queries',
                    value: '@'
                }];
            break;
        }

        return items;
    }
})
```

## Attributes

Here's the list of attributes that can be passed through the html attributes, or through the `define` function like so:

```ts
import __SAdvancedSelectElement from '@lotsof/s-advanced-select-element';

__SAdvancedSelectElement('my-advanced-select', __SAdvancedSelectElement, {
  // override default attributes here...
  minChars: 2,
  // etc...
});
```

or directly on the element inside your `html` like so:

```html
<s-advanced-select-element minChars="2">
  <input type="text" />
</s-advanced-select-element>
```

Here's the list:

```ts
/**
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
 * @attribute       {Boolean}       [inline=false]     *
 */
```

## Events

Here's the list of events you can subscribe to:

```ts
/**
 * @event           sAdvancedSelect.items                Dispatched when the items are setted of updated
 * @event           sAdvancedSelect.select               Dispatched when an item has been selected
 * @event           sAdvancedSelect.preselect            Dispatched when an item has been preselected
 * @event           sAdvancedSelect.close                Dispatched when the dropdown is closed
 * @event           sAdvancedSelect.open                 Dispatched when the dropdown is opened
 * @event           sAdvancedSelect.reset                Dispatched when the input is resetted
 * @event           sAdvancedSelect.loading              Dispatched when the element enterd in loading state
 * @event           sAdvancedSelect.loaded               Dispatched when the element exit the loading state
 */
```

## API

Here's all the methods you can access through the element directly:

```ts
/**
 * @name          preselect
 * @type          Function
 *
 * Preselect an item in the dropdown
 *
 * @param       {String|TAdvancedSelectElementItem}        item        The item to preselect. Can be a string that represent the id of the item, or the item itself
 * @param       {Object}        [settings={}]           Some settings to configure your preselection
 *
 * @since       1.0.0
 */

/**
 * @name        resetPreselected
 * @type        Function
 *
 * Reset the preselected item
 *
 * @since       1.0.0
 */

/**
 * @name        setSearch
 * @type        Function
 *
 * Set the search value and refresh items accordingly
 *
 * @param       {String}        value       The value to set
 *
 * @since       1.0.0
 */

/**
 * @name       select
 * @type       Function
 *
 * Select an item in the dropdown
 *
 * @param       {String|TAdvancedSelectElementItem}        item        The item to select. Can be a string that represent the id of the item, or the item itself
 *
 * @since       1.0.0
 */

/**
 * @name        reset
 * @type        Function
 *
 * Reset the advanced select (preselected, selected, search, etc...)
 *
 * @since       1.0.0
 */

/**
 * @name        getItemById
 * @type        Function
 *
 * Get an item by it's id
 *
 * @param       {String}        id        The id of the item to get
 * @return      {TAdvancedSelectElementItem}        The item found
 *
 * @since       1.0.0
 */

/**
 * @name       getPreselectedItem
 * @type       Function
 *
 * Get the preselected item
 *
 * @return      {TAdvancedSelectElementItem}        The preselected item
 *
 * @since       1.0.0
 */

/**
 * @name        getSelectedItem
 * @type        Function
 *
 * Get the selected item
 *
 * @return      {TAdvancedSelectElementItem}        The selected item
 *
 * @since       1.0.0
 */

/**
 * @name        getMatchItems
 * @type        Function
 *
 * Get the items that match the search
 *
 * @return      {TAdvancedSelectElementItem[]}        The items that match the search
 *
 * @since       1.0.0
 */

/**
 * @name        focus
 * @type        Function
 *
 * Focus the input and open the dropdown
 *
 * @since       1.0.0
 */

/**
 * @name       blur
 * @type       Function
 *
 * Blur the input and close the dropdown
 *
 * @since       1.0.0
 */

/**
 * @name        refreshItems
 * @type        Function
 *
 * Refresh the items in the dropdown
 *
 * @since       1.0.0
 */
```
