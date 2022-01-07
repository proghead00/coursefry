export const currencyFormatter = (data) => {
  return ((data.amount * 100) / 100).toLocaleString(data.currency, {
    style: "currency",
    curency: data.currency,
    currency: "inr",
  });
};

export const stripeCurrencyFormatter = (data) => {
  return (data.amount / 100).toLocaleString(data.currency, {
    style: "currency",
    curency: data.currency,
    currency: "inr",
  });
};
