import { hasURL } from 'utils/urlChecks'

test('hasURL', () => {
  expect(hasURL('this is my personal website: https://app.primeanetwork.com')).toBe(true)
  expect(hasURL('#corngang')).toBe(false)
  expect(hasURL('Unislap-LP.org')).toBe(true)
  expect(hasURL('https://primeanetwork.com')).toBe(true)
  expect(hasURL('https://www.primeanetwork.com')).toBe(true)
  expect(hasURL('http://primeanetwork.com')).toBe(true)
  expect(hasURL('http://username:password@primeanetwork.com')).toBe(true)
  expect(hasURL('http://app.primeanetwork.com')).toBe(true)
  expect(hasURL('username:password@app.primeanetwork.com:22')).toBe(true)
  expect(hasURL('primeanetwork.com:80')).toBe(true)
  expect(hasURL('asdf primeanetwork.com:80 asdf')).toBe(true)
})
