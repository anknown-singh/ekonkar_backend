const getFinalPrice = (productPrice, discountType, discountValue) => {
  var finalPrice;
  this.productPrice = Number(productPrice);
  this.discountValue = Number(discountValue);
  if (discountType === "percentage") {
    finalPrice =
      this.productPrice - this.productPrice * (this.discountValue / 100);
    return finalPrice;
  } else if (discountType === "price") {
    finalPrice = this.productPrice - this.discountValue;
    return finalPrice;
  }

  return null;
};

module.exports = getFinalPrice;
