// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// React Router v7 uses TextEncoder, which jsdom does not provide
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});
