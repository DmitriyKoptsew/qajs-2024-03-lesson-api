export function calculateTotal(products, discount) {
  // Проверка на корректность скидки
  if (discount < 0) {
    throw new Error('Скидка не может быть отрицательным числом.')
  }

  if (discount > 100) {
    throw new Error('Скидка не может быть больше 100%.')
  }

  // Рассчитываем сумму товаров без скидки и с учётом скидки
  const totalWithoutDiscount = products.reduce(
    (acc, product) => acc + product.quantity * product.price,
    0,
  )
  const totalWithDiscount = totalWithoutDiscount * (1 - discount / 100)

  return {
    totalWithoutDiscount,
    totalWithDiscount,
  }
}
