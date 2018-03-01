# shumblerip

> Rumbleship's user password strength utility for coincident client- and server-side use

## Installation

```shell
$ yarn install shumblerip
```

## Usage

```javascript
$ node
> import Shumblerip from 'shumblerip';
[Function: Shumblerip]
> const strength = new Shumblerip({
    // Not required for instantiation; settable afterward via this.check(password)
    password: 'RumbleshipNbvcxz',
    // Not required but must be an object whose values are strings or null.
    // Not intended to be set after instantiation.
    user: { first: 'Adam', last: 'Hemphill', email: 'adam@rumbleship.com' },
    // Required for instantiation
    config: {
      dictionary: ['rumbleship', 'rumble', 'ship', 'nbvcxz', 'zxcvbn'], // Must be strings
      passing: 2 // Number 0-4 or function which takes `result` as its only argument
    }
  });
Shumblerip {
  arguments: {
    password: 'RumbleshipNbvcxz',
    user: {
      first: 'Adam',
      last: 'Hemphill',
      email: 'adam@rumbleship.com',
      dictionary: [Object]
    },
    config: { dictionary: [Object], passing: 2 }
  },
  config: {
    dictionary: ['rumbleship', 'rumble', 'ship', 'nbvcxz', 'zxcvbn'],
    passing: 2
  },
  version: '0.1.0',
  dictionary: [
    'Adam',
    'Hemphill',
    'adam',
    'rumbleship.com',
    'rumbleship',
    'rumble',
    'ship',
    'nbvcxz',
    'zxcvbn'
  ],
  result: {
    password: 'RumbleshipNbvcxz',
    guesses: 15000,
    guesses_log10: 4.176091259055681,
    sequence: [[Object], [Object]],
    calc_time: 3,
    crack_times_seconds: {
      online_throttling_100_per_hour: 540000,
      online_no_throttling_10_per_second: 1500,
      offline_slow_hashing_1e4_per_second: 1.5,
      offline_fast_hashing_1e10_per_second: 0.0000015
    },
    crack_times_display: {
      online_throttling_100_per_hour: '6 days',
      online_no_throttling_10_per_second: '25 minutes',
      offline_slow_hashing_1e4_per_second: '2 seconds',
      offline_fast_hashing_1e10_per_second: 'less than a second'
    },
    score: 1,
    feedback: { warning: '', suggestions: [Object] },
    passes: false
  }
}
> strength.check('ZJuLBPmXdNDbJxFWkoWEPHKKTrDdZm').passes
true
>
```

### Server

* Expose `config` via an endpoint (e.g. `GET` `/users/password-requirements`)
* Implement logic to conditionally allow password change requests (to e.g. `PUT` `/users/{id}/password`) when `Shumblerip.check(password).passes`
* Be sure the client will have access to `user` properties you use

### Client

* Instantiate with `config` retrieved from server (and `user` details as necessary to mirror its instance)
* Invoke `Shumblerip.check(password)` (debounced) for user input, allowing submission when `Shumblerip.check(password).passes`
* Beware of the pitfalls specified in [the `zxcvbn` README](https://github.com/dropbox/zxcvbn/blob/master/README.md)

## Transpiling

Currently built for the running version of `node` (developed on `v6.10.0`). To transpile it for another environment, modify`babel.presets`in`package.json`(refer to [Babel's documentation](https://babeljs.io/docs/plugins/preset-env/)) and run [`yarn build`](https://yarnpkg.com/lang/en/docs/package-json/#toc-scripts)

## TODO

* Enhance `parseEmail()` function
* Tests
* Remove references to previous package name in `README.md`

## Acknowledgements

* [`zxcvbn`](https://github.com/dropbox/zxcvbn`) because this is just a wrapper for it