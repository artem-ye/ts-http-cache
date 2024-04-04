import { mockFn as mockFnRelativeImport } from './mock/mockFn';
import { mockFn as mockFnPthAliasImport } from '@mock/mockFn';

describe('Jest runtime', () => {
  test('Should be run successfully', () => {
    expect(true).toBe(true);
  });

  test('Import due relative path works', () => {
    expect(mockFnRelativeImport(1)).toEqual(1);
  });

  test('Import due path alias works', () => {
    expect(mockFnPthAliasImport(true)).toEqual(true);
  });
});
