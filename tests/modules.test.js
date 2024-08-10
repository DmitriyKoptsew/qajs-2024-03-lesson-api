import { greet, farewell } from '../src/modules.js'

describe('greet function', () => {
  it('should return a greeting message with the given name', () => {
    const result = greet('John')
    expect(result).toBe('Hello, John!')
  })

  it('should handle empty name gracefully', () => {
    const result = greet('')
    expect(result).toBe('Hello, !')
  })
})

describe('farewell function', () => {
  it('should return a farewell message with the given name', () => {
    const result = farewell('Jane')
    expect(result).toBe('Goodbye, Jane!')
  })

  it('should handle empty name gracefully', () => {
    const result = farewell('')
    expect(result).toBe('Goodbye, !')
  })
})
