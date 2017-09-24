class AssertionError extends Error {}
class InvalidDataType extends AssertionError {}

let Utils = {
  assert(message, isValid, errorClass)  {
    if (!isValid) {
      errorClass = errorClass || AssertionError;
      throw new errorClass(message);
    }
  },

  assertType(value, type) {
    let targetType = value.constructor.name;
    let expectedType = type.name || type;
    let isValid = targetType === expectedType;
    let message = `Expected ${expectedType}, got ${targetType}`;

    this.assert(message, isValid, InvalidDataType);
  },

  deepUpdateJson(json, keys, value) {
    keys.forEach((key, index) => {
      if (index < keys.length - 1) {
        json[key] = json[key] || {};
      } else {
        json[key] = value;
      }

      json = json[key];
    });
  }
};

export default Utils;
