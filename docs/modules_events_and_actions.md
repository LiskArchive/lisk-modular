# Events & Actions for Modules

## Chain

| Actions         | Events                    |
| --------------- | ------------------------- |
| postTransaction | new:transaction           |
| postSignature   | new:signature             |
| getStatus       | new:block                 |
| addDelegate     | changed:status            |
| removeDelegate  | changed:forging           |
|                 | detected:fork             |
|                 | block:forging:started     |
|                 | block:forging:finished    |
|                 | block:forging:failed      |
|                 | block:processing:started  |
|                 | block:processing:finished |
|                 | block:processing:failed   |

## P2P

| Actions | Events           |
| ------- | ---------------- |
| addPeer | peer:added       |
|         | peer:removed     |
|         | peer:banned      |
|         | peer:blacklisted |
|         | sync:started     |
|         | sync:finished    |
|         | sync:failed      |

## API

| Actions           | Events         |
| ----------------- | -------------- |
| addWhiteListed    | access:added   |
| removeWhiteListed | access:removed |
|                   | request:failed |
