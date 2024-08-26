export type TAdvancedSelectElementItemsFunctionApi = {
  search: string;
  items: any[];
};

export type TAdvancedSelectElementItemState = {
  match: boolean;
  preselected: boolean;
  selected: boolean;
};

export type TAdvancedSelectElementItem = {
  id: string;
  type?: 'item' | 'group';
  items?: TAdvancedSelectElementItem[];
  state?: TAdvancedSelectElementItemState;
  preventClose?: boolean;
  preventSelect?: boolean;
  preventSet?: boolean;
  [key: string]: any;
};

export type TAdvancedSelectElementClasses = {
  container?: string;
  input?: string;
  dropdown?: string;
  items?: string;
  item?: string;
  before?: string;
  after?: string;
  keywords?: string;
  group?: string;
};

export type TAdvancedSelectElementApi = {
  type: 'item' | 'group' | 'loading' | 'before' | 'after' | 'empty' | string;
  item: any;
  $items: any[];
  html: Function;
  unsafeHTML: Function;
  idx: number;
};
