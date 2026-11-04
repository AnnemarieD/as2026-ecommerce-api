const { expect } = require('chai');
const users = require('../data/users.json');
const discountCases = require('../data/checkout-discount-ep.json');
const { login, addToCart, checkout, clearCart } = require('../helpers/api');

describe('Checkout module — discount business rule (equivalence partitioning)', function () {
  this.timeout(10000);

  discountCases.forEach((testCase) => {
    it(`${testCase.id}: ${testCase.partition} [paymentMethod=${
      testCase.omitPaymentMethod ? '(omitted)' : testCase.paymentMethod
    }]`, async function () {
      const user = users[testCase.userKey];
      expect(user, `unknown userKey ${testCase.userKey}`).to.exist;

      const token = await login(user.email, user.password);
      await clearCart(token);

      const cartRes = await addToCart(token, testCase.productId, testCase.quantity);
      expect(cartRes.status).to.equal(200);

      const paymentMethod = testCase.omitPaymentMethod
        ? null
        : testCase.paymentMethod;
      const res = await checkout(token, paymentMethod);

      expect(res.status).to.equal(testCase.expected.httpStatus);

      if (testCase.expected.errorPresent) {
        expect(res.body).to.have.property('error');
        expect(res.body).to.have.property('message');
        return;
      }

      expect(res.body).to.have.property('order');
      const { order } = res.body;

      expect(order.paymentMethod).to.equal(testCase.paymentMethod);
      expect(order.discountRate).to.equal(testCase.expected.discountRate);
      expect(order.discountAmount).to.equal(testCase.expected.discountAmount);
      expect(order.subtotal).to.equal(testCase.expected.subtotal);
      expect(order.total).to.equal(testCase.expected.total);
    });
  });
});
