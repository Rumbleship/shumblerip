// https://github.com/dropbox/zxcvbn
import zxcvbn from 'zxcvbn';
import { name, version } from './../package.json';

class Shumblerip {
  constructor({ password, user, config } = {}) {
    if (
      typeof config !== 'object' ||
      !(
        Array.isArray(config.dictionary) ||
        config.dictionary.every(val => typeof val === 'string')
      ) ||
      !(
        (typeof config.passing === 'number' &&
          config.passing < 5 &&
          config.passing > -1) ||
        typeof config.passing === 'function'
      )
    ) {
      throw new Error(
        '`arguments[0].config` must be an object with a `dictionary` property which is an array of strings and a `passing` property which is a number 0-4 or a function'
      );
    }

    this.arguments = arguments[0];
    this.config = Object.assign({}, this.arguments.config);
    this.config.specification = `${name}@${version}`;

    if (password) {
      this.check(password, user);
    }
    Object.freeze(this.config);
    Object.defineProperty(this, 'config', {
      configurable: false,
      writable: false
    });
    return this;
  }

  _addUser(user) {
    if (!user) {
      delete this.arguments.user;
      this.dictionary = this.config.dictionary;
      return;
    }
    if (
      typeof user !== 'object' ||
      !Object.keys(user).every(
        key => typeof user[key] === 'string' || user[key] === null
      )
    ) {
      throw new Error(
        '`user` must be an object with properties including `email` whose values are strings or null'
      );
    }
    this.arguments.user = user;
    const { first, last, email } = user;
    const userDictionary = [
      ...new Set([first, last, ...this._parseEmail(email)])
    ].filter(x => x);

    this.dictionary = [
      ...new Set(
        [...userDictionary, ...this.config.dictionary].map(val =>
          val.toLowerCase()
        )
      )
    ];
  }

  _parseEmail(email) {
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error('`email` must include "@" and "." characters');
    }
    return email.split('@');
  }

  // Interface

  check(password, user) {
    this._addUser(user);
    if (typeof password !== 'string') {
      throw new Error('`password` must be a string');
    }
    this.arguments.password = password;
    this.result = zxcvbn(password, this.dictionary);
    this.result.passes =
      typeof this.config.passing === 'number'
        ? this.result.score >= this.config.passing
        : this.config.passing(this.result);
    return this;
  }

  get passes() {
    return (this.result && this.result.passes) || false;
  }
}

module.exports = Shumblerip;
