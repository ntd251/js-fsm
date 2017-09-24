class AssertionError extends Error {}
class InvalidDataType extends AssertionError {}

let Utils = {
  assert(message, isValid, errorClass)  {
    if (!isValid) {
      let error = errorClass ? new errorClass(message) : new AssertionError(message);
      throw error;
    }
  },

  assertType(value, type) {
    let targetType = value.constructor.name;
    let expectedType = type.name || type;
    let isValid = targetType === expectedType;
    let message = `Expected ${expectedType}, got ${targetType}`;

    this.assert(message, isValid, InvalidDataType);
  },
};

export default Utils;
