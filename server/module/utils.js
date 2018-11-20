/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable import/prefer-default-export */

class Utils {
  static validateParcel(options) {
    const requireFields = [
      'shortname',
      'destination',
      'destination_lat',
      'destination_lng',
      'origin',
      'origin_lat',
      'origin_lng',
      'description',
      'distance',
      'weight',
      'price',
    ];
    let testField;
    const validated = requireFields.every((field) => {
      testField = field;
      return Utils.filterParcelInput(field, options[field]);
    });
    if (!validated) {
      throw Error(`${testField} field is required to create a Parcel`);
    }
  }

  static filterParcelInput(field, value) {
    switch (field) {
      case 'description':
      case 'origin':
      case 'shortname':
      case 'destination':
        return Utils.validateText(value);
      case 'destination_lat':
      case 'destination_lng':
      case 'origin_lat':
      case 'origin_lng':
        return Utils.isNumeric(value);
      case 'distance':
      case 'weight':
      case 'price':
        return (Utils.isNumeric(value) || Utils.isInteger(value));
    }
    // any other field is not our concern ignore it
    return true;
  }

  static validateCreateUser(options) {
    const requireFields = ['firstname', 'email', 'password', 'surname', 'mobile'];
    let testField; let testValue;

    const valid = requireFields.every((field) => {
      testField = field;
      testValue = options[field];
      switch (field) {
        case 'email':
          return Utils.validateEmail(testValue);
        case 'firstname':
        case 'surname':
          return Utils.validateName(testValue);
        case 'mobile':
          return Utils.isInteger(testValue);
        default: return Utils.validateText(testValue);
      }
    });
    if (!valid) { throw Error(`Field ${testField} does not meet requirent value: ${testValue}`); }
  }

  static isInteger(value) {
    return (/^\d+$/.test(value));
  }

  static validateEmail(email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  }

  static isNumeric(cord) {
    return /^[0-9]+\.[\d]+$/.test(cord);
  }

  static validateText(text) {
    return (/^[a-zA-Z0-9\s\.,\+\-\(\)]+$/.test(text));
  }

  static validateName(name) {
    return (/^[a-zA-Z0-9]+$/.test(name));
  }
}

export {
  Utils as util,
};
