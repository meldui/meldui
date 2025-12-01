import type { BaseFilterType, ComplexFilterType, FilterOperator, FilterType } from '../types'
import { getBaseFilterType, isComplexFilterType } from '../types'

/**
 * Default operators for base filter types
 */
export const DEFAULT_OPERATORS: Record<BaseFilterType, FilterOperator> = {
  text: 'contains',
  number: 'equals',
  date: 'is',
  select: 'is',
  boolean: 'is',
} as const

/**
 * Default operators for complex types (used in advanced mode)
 */
export const COMPLEX_TYPE_DEFAULT_OPERATORS: Record<ComplexFilterType, FilterOperator> = {
  multiselect: 'isAnyOf', // multiselect defaults to isAnyOf in advanced mode
  range: 'between', // range defaults to between in advanced mode
  daterange: 'isBetween', // daterange defaults to isBetween in advanced mode
} as const

/**
 * Available operators for base filter types
 */
export const AVAILABLE_OPERATORS: Record<BaseFilterType, FilterOperator[]> = {
  text: [
    'contains',
    'equals',
    'startsWith',
    'endsWith',
    'notContains',
    'notEquals',
    'isEmpty',
    'isNotEmpty',
  ],
  number: [
    'equals',
    'notEquals',
    'greaterThan',
    'greaterThanOrEqual',
    'lessThan',
    'lessThanOrEqual',
    'between',
    'isEmpty',
    'isNotEmpty',
  ],
  date: ['is', 'isBefore', 'isAfter', 'isBetween', 'isEmpty', 'isNotEmpty'],
  select: ['is', 'isAnyOf', 'isNot', 'isNoneOf', 'isEmpty', 'isNotEmpty'],
  boolean: ['is', 'isEmpty', 'isNotEmpty'],
} as const

/**
 * Operators that don't require a value
 */
export const NULLARY_OPERATORS: FilterOperator[] = ['isEmpty', 'isNotEmpty']

/**
 * Operators that require two values (range operators)
 */
export const BINARY_OPERATORS: FilterOperator[] = [
  'between', // number range
  'isBetween', // date range
]

/**
 * Operators that require array values
 */
export const ARRAY_OPERATORS: FilterOperator[] = ['isAnyOf', 'isNoneOf']

/**
 * Human-readable operator labels
 */
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  // Text
  contains: 'contains',
  equals: 'equals',
  startsWith: 'starts with',
  endsWith: 'ends with',
  notContains: 'does not contain',
  notEquals: 'not equals',

  // Number
  greaterThan: 'is greater than',
  greaterThanOrEqual: 'is greater than or equal to',
  lessThan: 'is less than',
  lessThanOrEqual: 'is less than or equal to',
  between: 'between',

  // Date
  is: 'is',
  isBefore: 'before',
  isAfter: 'after',
  isBetween: 'between',

  // Select
  isAnyOf: 'is any of',
  isNot: 'is not',
  isNoneOf: 'is none of',

  // Common
  isEmpty: 'is empty',
  isNotEmpty: 'is not empty',
}

/**
 * Get available operators for a filter type
 * In advanced mode, complex types use their base type operators
 */
export function getAvailableOperators(
  filterType: FilterType,
  advancedMode: boolean = false,
): FilterOperator[] {
  if (advancedMode && isComplexFilterType(filterType)) {
    // In advanced mode, use base type operators
    const baseType = getBaseFilterType(filterType)
    return AVAILABLE_OPERATORS[baseType]
  }

  // In simple mode, complex types don't show operators
  if (isComplexFilterType(filterType)) {
    return []
  }

  return AVAILABLE_OPERATORS[filterType as BaseFilterType]
}

/**
 * Get default operator for a filter type
 */
export function getDefaultOperator(
  filterType: FilterType,
  advancedMode: boolean = false,
): FilterOperator {
  if (advancedMode && isComplexFilterType(filterType)) {
    // In advanced mode, use complex type's default operator
    return COMPLEX_TYPE_DEFAULT_OPERATORS[filterType]
  }

  if (isComplexFilterType(filterType)) {
    // This shouldn't happen in simple mode, but provide a fallback
    const baseType = getBaseFilterType(filterType)
    return DEFAULT_OPERATORS[baseType]
  }

  return DEFAULT_OPERATORS[filterType as BaseFilterType]
}

/**
 * Check if operator requires no value
 */
export function isNullaryOperator(operator: FilterOperator): boolean {
  return NULLARY_OPERATORS.includes(operator)
}

/**
 * Check if operator requires two values
 */
export function isBinaryOperator(operator: FilterOperator): boolean {
  return BINARY_OPERATORS.includes(operator)
}

/**
 * Check if operator requires array value
 */
export function isArrayOperator(operator: FilterOperator): boolean {
  return ARRAY_OPERATORS.includes(operator)
}

/**
 * Get human-readable label for operator
 */
export function getOperatorLabel(operator: FilterOperator): string {
  return OPERATOR_LABELS[operator] || operator
}

/**
 * Validate operator for filter type
 */
export function isValidOperator(
  filterType: FilterType,
  operator: FilterOperator,
  advancedMode: boolean = false,
): boolean {
  const availableOps = getAvailableOperators(filterType, advancedMode)
  return availableOps.includes(operator)
}
