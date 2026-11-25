import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ThemeButtonComponent } from '@shared/atoms/theme-button/theme-button';

export type ThemeDataTableRow = Readonly<Record<string, unknown>>;
export type ThemeDataTableFilterType = 'text' | 'number' | 'set';
export type ThemeDataTableFilterOperator =
  | 'contains'
  | 'doesNotContain'
  | 'equals'
  | 'notEquals'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual';

export interface ThemeDataTableColumn {
  readonly key: string;
  readonly label: string;
  readonly sortable?: boolean;
  readonly filterable?: boolean;
  readonly filterType?: ThemeDataTableFilterType;
  readonly display?: 'text' | 'currency' | 'number';
}

interface FilterCondition {
  readonly operator: ThemeDataTableFilterOperator;
  readonly value: string;
}

type AppliedColumnFilter =
  | { readonly type: 'set'; readonly values: readonly string[] }
  | {
      readonly type: 'condition';
      readonly first: FilterCondition;
      readonly second?: FilterCondition;
      readonly logic: 'and' | 'or';
    };

@Component({
  selector: 'app-theme-data-table',
  standalone: true,
  imports: [ThemeButtonComponent],
  templateUrl: './theme-data-table.html',
})
export class ThemeDataTableComponent implements OnChanges {
  private static nextId = 0;
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly idPrefix = `theme-data-table-${ThemeDataTableComponent.nextId++}`;
  protected appliedFilters: Record<string, AppliedColumnFilter> = {};

  @Input() rows: readonly ThemeDataTableRow[] = [];
  @Input() columns: readonly ThemeDataTableColumn[] = [];
  @Input() rowKey = 'id';
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() entityLabel = 'registros';

  @Output() readonly retryRequested = new EventEmitter<void>();

  protected activeFilterKey: string | null = null;
  protected panelTop = 0;
  protected panelLeft = 0;
  protected firstCondition: FilterCondition = { operator: 'contains', value: '' };
  protected secondCondition: FilterCondition = { operator: 'contains', value: '' };
  protected conditionLogic: 'and' | 'or' = 'and';
  protected optionSearch = '';
  protected selectedOptions: string[] = [];
  protected sortKey = '';
  protected sortDirection: 'asc' | 'desc' = 'asc';
  protected currentPage = 0;
  protected pageSize = 10;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) this.currentPage = 0;
  }

  protected get activeFilterColumn(): ThemeDataTableColumn | null {
    return this.columns.find((column) => column.key === this.activeFilterKey) ?? null;
  }

  protected get activeFilterType(): ThemeDataTableFilterType {
    const column = this.activeFilterColumn;
    return column ? this.filterTypeFor(column) : 'text';
  }

  protected get operatorOptions(): readonly {
    value: ThemeDataTableFilterOperator;
    label: string;
  }[] {
    if (this.activeFilterType === 'number') {
      return [
        { value: 'equals', label: 'Es igual a' },
        { value: 'notEquals', label: 'No es igual a' },
        { value: 'greaterThan', label: 'Es mayor que' },
        { value: 'greaterThanOrEqual', label: 'Es mayor o igual que' },
        { value: 'lessThan', label: 'Es menor que' },
        { value: 'lessThanOrEqual', label: 'Es menor o igual que' },
      ];
    }

    return [
      { value: 'contains', label: 'Contiene' },
      { value: 'doesNotContain', label: 'No contiene' },
      { value: 'equals', label: 'Es igual a' },
      { value: 'notEquals', label: 'No es igual a' },
      { value: 'startsWith', label: 'Comienza con' },
      { value: 'endsWith', label: 'Termina con' },
    ];
  }

  protected get filterOptions(): readonly string[] {
    const key = this.activeFilterKey;
    if (!key) return [];
    return [
      ...new Set(
        this.rows
          .map((row) => row[key])
          .filter((value) => value !== null && value !== undefined)
          .map(String),
      ),
    ].sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base' }));
  }

  protected get visibleFilterOptions(): readonly string[] {
    const query = this.optionSearch.trim().toLocaleLowerCase();
    return this.filterOptions.filter(
      (option) => !query || option.toLocaleLowerCase().includes(query),
    );
  }

  protected get allOptionsSelected(): boolean {
    return (
      this.filterOptions.length > 0 &&
      this.filterOptions.every((option) => this.selectedOptions.includes(option))
    );
  }

  protected get activeFilterCount(): number {
    return Object.keys(this.appliedFilters).length;
  }

  protected get filteredRows(): readonly ThemeDataTableRow[] {
    const filters = Object.entries(this.appliedFilters);
    return this.rows.filter((row) =>
      filters.every(([key, filter]) => this.matchesFilter(row[key], filter)),
    );
  }

  protected get sortedRows(): readonly ThemeDataTableRow[] {
    const rows = [...this.filteredRows];
    if (!this.sortKey) return rows;
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    return rows.sort(
      (left, right) => this.compareValues(left[this.sortKey], right[this.sortKey]) * direction,
    );
  }

  protected get visibleRows(): readonly ThemeDataTableRow[] {
    const start = this.currentPage * this.pageSize;
    return this.sortedRows.slice(start, start + this.pageSize);
  }

  protected get firstVisibleRow(): number {
    return this.sortedRows.length === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  protected get lastVisibleRow(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.sortedRows.length);
  }

  protected get totalPages(): number {
    return Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize));
  }

  protected get canApplyFilter(): boolean {
    if (this.activeFilterType === 'set') return true;
    const firstValue = this.firstCondition.value.trim();
    const secondValue = this.secondCondition.value.trim();
    if (!firstValue) return false;
    if (this.activeFilterType === 'number' && Number.isNaN(Number(firstValue))) return false;
    return !secondValue || this.activeFilterType !== 'number' || !Number.isNaN(Number(secondValue));
  }

  protected get hasSecondCondition(): boolean {
    return Boolean(this.secondCondition.value.trim());
  }

  protected formatCell(value: unknown, display: ThemeDataTableColumn['display'] = 'text'): string {
    if (value === null || value === undefined || value === '') return '—';
    if (display === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(value);
    }
    if (display === 'number' && typeof value === 'number')
      return new Intl.NumberFormat('es-MX').format(value);
    return String(value);
  }

  protected toggleSort(key: string): void {
    if (this.sortKey === key) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
  }

  protected sortAriaValue(key: string): 'ascending' | 'descending' | 'none' {
    if (this.sortKey !== key) return 'none';
    return this.sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  protected toggleFilter(column: ThemeDataTableColumn, event: MouseEvent): void {
    if (this.activeFilterKey === column.key) {
      this.closeFilterPanel();
      return;
    }

    const trigger = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const panelWidth = Math.min(288, window.innerWidth - 16);
    this.panelLeft = Math.max(
      8,
      Math.min(trigger.right - panelWidth, window.innerWidth - panelWidth - 8),
    );
    this.panelTop = Math.max(8, Math.min(trigger.bottom + 4, window.innerHeight - 8));
    this.activeFilterKey = column.key;
    this.optionSearch = '';
    this.conditionLogic = 'and';

    const activeFilter = this.appliedFilters[column.key];
    if (activeFilter?.type === 'set') {
      this.selectedOptions = [...activeFilter.values];
      this.firstCondition = { operator: 'contains', value: '' };
      this.secondCondition = { operator: 'contains', value: '' };
    } else if (activeFilter?.type === 'condition') {
      this.firstCondition = { ...activeFilter.first };
      this.secondCondition = activeFilter.second
        ? { ...activeFilter.second }
        : { operator: 'contains', value: '' };
      this.conditionLogic = activeFilter.logic;
      this.selectedOptions = [];
    } else {
      this.firstCondition = {
        operator: this.filterTypeFor(column) === 'number' ? 'equals' : 'contains',
        value: '',
      };
      this.secondCondition = {
        operator: this.filterTypeFor(column) === 'number' ? 'equals' : 'contains',
        value: '',
      };
      this.selectedOptions = [...this.filterOptions];
    }

    requestAnimationFrame(() => {
      const panel = document.getElementById(`${this.idPrefix}-filter-panel`);
      if (!panel) return;

      const panelHeight = panel.getBoundingClientRect().height;
      this.panelTop = Math.max(
        8,
        Math.min(trigger.bottom + 4, window.innerHeight - panelHeight - 8),
      );
    });
  }

  protected onOperatorChange(event: Event, condition: 'first' | 'second'): void {
    const operator = (event.target as HTMLSelectElement).value as ThemeDataTableFilterOperator;
    if (condition === 'first') this.firstCondition = { ...this.firstCondition, operator };
    else this.secondCondition = { ...this.secondCondition, operator };
  }

  protected onConditionValueChange(event: Event, condition: 'first' | 'second'): void {
    const value = (event.target as HTMLInputElement).value;
    if (condition === 'first') this.firstCondition = { ...this.firstCondition, value };
    else this.secondCondition = { ...this.secondCondition, value };
  }

  protected onOptionSearch(event: Event): void {
    this.optionSearch = (event.target as HTMLInputElement).value;
  }

  protected toggleAllOptions(event: Event): void {
    this.selectedOptions = (event.target as HTMLInputElement).checked
      ? [...this.filterOptions]
      : [];
  }

  protected toggleOption(event: Event, option: string): void {
    const selected = (event.target as HTMLInputElement).checked;
    this.selectedOptions = selected
      ? [...this.selectedOptions, option]
      : this.selectedOptions.filter((value) => value !== option);
  }

  protected applyFilter(): void {
    const key = this.activeFilterKey;
    if (!key || !this.canApplyFilter) return;

    if (this.activeFilterType === 'set') {
      if (this.selectedOptions.length === this.filterOptions.length)
        delete this.appliedFilters[key];
      else this.appliedFilters[key] = { type: 'set', values: [...this.selectedOptions] };
    } else {
      const secondValue = this.secondCondition.value.trim();
      this.appliedFilters[key] = {
        type: 'condition',
        first: { ...this.firstCondition, value: this.firstCondition.value.trim() },
        second: secondValue ? { ...this.secondCondition, value: secondValue } : undefined,
        logic: this.conditionLogic,
      };
    }

    this.currentPage = 0;
    this.closeFilterPanel();
  }

  protected clearColumnFilter(): void {
    if (this.activeFilterKey) delete this.appliedFilters[this.activeFilterKey];
    this.currentPage = 0;
    this.closeFilterPanel();
  }

  protected clearAllFilters(): void {
    this.appliedFilters = {};
    this.currentPage = 0;
    this.closeFilterPanel();
  }

  protected changePageSize(event: Event): void {
    const pageSize = Number((event.target as HTMLSelectElement).value);
    if (!Number.isInteger(pageSize) || pageSize < 1) return;
    this.pageSize = pageSize;
    this.currentPage = 0;
  }

  protected previousPage(): void {
    this.currentPage = Math.max(0, this.currentPage - 1);
  }

  protected nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) this.currentPage += 1;
  }

  protected closeFilterPanel(): void {
    this.activeFilterKey = null;
  }

  protected trackRow(index: number, row: ThemeDataTableRow): unknown {
    return row[this.rowKey] ?? index;
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onDocumentPointerDown(event: PointerEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.closeFilterPanel();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeFilterPanel();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.closeFilterPanel();
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.closeFilterPanel();
  }

  private filterTypeFor(column: ThemeDataTableColumn): ThemeDataTableFilterType {
    if (column.filterType) return column.filterType;
    const value = this.rows.find(
      (row) => row[column.key] !== null && row[column.key] !== undefined,
    )?.[column.key];
    return typeof value === 'number' ? 'number' : 'text';
  }

  private matchesFilter(value: unknown, filter: AppliedColumnFilter): boolean {
    if (filter.type === 'set') return filter.values.includes(String(value ?? ''));
    const firstMatches = this.matchesCondition(value, filter.first);
    if (!filter.second) return firstMatches;
    const secondMatches = this.matchesCondition(value, filter.second);
    return filter.logic === 'and' ? firstMatches && secondMatches : firstMatches || secondMatches;
  }

  private matchesCondition(value: unknown, condition: FilterCondition): boolean {
    if (typeof value === 'number') {
      const expected = Number(condition.value);
      if (Number.isNaN(expected)) return false;
      switch (condition.operator) {
        case 'equals':
          return value === expected;
        case 'notEquals':
          return value !== expected;
        case 'greaterThan':
          return value > expected;
        case 'greaterThanOrEqual':
          return value >= expected;
        case 'lessThan':
          return value < expected;
        case 'lessThanOrEqual':
          return value <= expected;
        default:
          return false;
      }
    }

    const actual = String(value ?? '').toLocaleLowerCase();
    const expected = condition.value.toLocaleLowerCase();
    switch (condition.operator) {
      case 'contains':
        return actual.includes(expected);
      case 'doesNotContain':
        return !actual.includes(expected);
      case 'equals':
        return actual === expected;
      case 'notEquals':
        return actual !== expected;
      case 'startsWith':
        return actual.startsWith(expected);
      case 'endsWith':
        return actual.endsWith(expected);
      default:
        return false;
    }
  }

  private compareValues(left: unknown, right: unknown): number {
    if (left === right) return 0;
    if (left === null || left === undefined) return 1;
    if (right === null || right === undefined) return -1;
    if (typeof left === 'number' && typeof right === 'number') return left - right;
    return String(left).localeCompare(String(right), undefined, { sensitivity: 'base' });
  }
}
