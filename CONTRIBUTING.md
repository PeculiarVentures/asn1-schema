# Contributing

### Installation

First, ensure you have Node v10+ and the latest [yarn](https://yarnpkg.com) installed on your machine.

As an external contributor, you will have to fork PeculiarVentures/asn1-schema to contribute code.
Clone your fork onto your machine and then run the following commands to install dependencies:

```sh
git clone git@github.com:<username>/asn1-schema.git
cd asn1-schema
yarn bootstrap
yarn build
```

## Developing

A typical contributor workflow looks like this:

1. Create a new feature branch.
1. Write some code.
1. Ensure your code is **tested**.
    - Add unit tests as necessary when fixing bugs or adding features; run them with `yarn test` in the relevant `packages/` directory.
1. Submit a Pull Request on GitHub and fill out the template.
1. Team members will review your code and merge it after approvals.
    - You may be asked to make modifications to code style or to fix bugs you may have not noticed.
    - Please respond to comments in a timely fashion (even if to tell us you need more time).
1. Cheers, you contributed!
