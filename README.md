# Lisk

The purpose of the repo is to create a blue-print/prototype of the concept of modular verison of the lisk core.

## Directories

* Directory [packages](./packages) are backbone of the lisk.
* Directory [modules](./modules) are individual puzzle pieces of the lisk.
* Directory [components](./components) are the generator packages to generate shared components for modules.

## Interface List 

Please see the [list of actions and events](./docs/modules_events_and_actions.md) supported by each module. 

## Development Setup

```bash
git clone git@github.com:LiskHQ/lisk-modular.git
cd lisk-moduler
npm install
npm install -g bunyan
npx lerna bootstrap --hoist
node packages/lisk-core/bin/liskctrl start | bunyan -o short
```
