import { calculateTotal } from '../src/discount.js'

describe('calculateTotal function', () => {
  const testCasesPositive = [
    {
      name: 'case 1: valid discount',
      products: [
        { name: 'Товар1', quantity: 3, price: 10 },
        { name: 'Товар2', quantity: 5, price: 5 },
      ],
      discount: 10,
      expected: {
        totalWithoutDiscount: 55,
        totalWithDiscount: 49.5,
      },
    },
    {
      name: 'case 2: discount is 0',
      products: [
        { name: 'Товар1', quantity: 3, price: 10 },
        { name: 'Товар2', quantity: 5, price: 4 },
      ],
      discount: 0,
      expected: {
        totalWithoutDiscount: 50,
        totalWithDiscount: 50,
      },
    },
  ]

  test.each(testCasesPositive)('%s', ({ products, discount, expected }) => {
    const result = calculateTotal(products, discount)
    expect(result.totalWithoutDiscount).toBe(expected.totalWithoutDiscount)
    expect(result.totalWithDiscount).toBeCloseTo(expected.totalWithDiscount, 2)
  })

  const testCasesNegative = [
    {
      name: 'case 3: invalid negative discount',
      products: [
        { name: 'Товар1', quantity: 3, price: 10 },
        { name: 'Товар2', quantity: 5, price: 10 },
      ],
      discount: -10,
      expectedError: 'Скидка не может быть отрицательным числом.',
    },
    {
      name: 'case 4: invalid discount over 100%',
      products: [
        { name: 'Товар1', quantity: 3, price: 10 },
        { name: 'Товар2', quantity: 5, price: 10 },
      ],
      discount: 110,
      expectedError: 'Скидка не может быть больше 100%.',
    },
  ]

  test.each(testCasesNegative)(
    '%s',
    ({ products, discount, expectedError }) => {
      expect(() => calculateTotal(products, discount)).toThrow(expectedError)
    },
  )
})
