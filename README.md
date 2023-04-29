# UnivIS API

This package creates a wrapper for the PRG export of the univis servers. It is inspired by [michigg/univis_api](https://github.com/michigg/univis_api).

## Usage

Create a UnivIS client:

```ts
import { UnivISClient } from 'univis-api'

const client = new UnivISClient({ domain: 'univis.uni-bamberg.de' })

// Get Calendar events
client.getCalendar({ start: '2023-05-03', end: '2023-05-05' }).then(console.log)

// Manual request to get all faculties
client.request('departments', { name: 'Fakultät' })
```
