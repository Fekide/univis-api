import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { Person, UnivISResult } from '../types'

export type UnivISDomain =
  | 'univis.uni-bamberg.de'
  | 'univis.uni-erlangen.de'
  | 'univis.th-koeln.de'
  | 'univis.uni-luebeck.de'
  | 'univis.uni-kiel.de'

export interface UnivISClientOptions {
  domain: UnivISDomain
}

export class UnivISClient {
  domain: UnivISDomain
  parser: XMLParser
  constructor(options: UnivISClientOptions) {
    this.domain = options.domain
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '_',
    })
    this.request = this.request.bind(this)
  }

  async request(
    search: string,
    options: { [arg: string]: string }
  ): Promise<UnivISResult> {
    const params = new URLSearchParams()
    params.set('show', 'xml')
    params.set('search', search)
    Object.keys(options).forEach((key) => {
      params.set(key, options[key])
    })
    const result = await axios.get<string>(`https://${this.domain}/prg`, {
      params,
    })

    return this.parser.parse(result.data)
  }

  async getCalendar({ start, end }: { start: string; end: string }) {
    const result = await this.request('calendar', { start, end })

    const events =
      result.UnivIS.Event?.map((event) => {
        const roomKey = event.rooms?.room.UnivISRef._key
        const room =
          roomKey !== undefined
            ? result.UnivIS.Room?.find((r) => r._key === roomKey)
            : undefined
        let roomContacts: Person[] = []
        if (room) {
          const roomContactObject = room.contacts?.contact
          const roomContactsKeys = Array.isArray(roomContactObject)
            ? roomContactObject.map((c) => c.UnivISRef._key)
            : roomContactObject !== undefined
            ? [roomContactObject.UnivISRef._key]
            : undefined
          roomContacts =
            roomContactsKeys !== undefined && result.UnivIS.Person !== undefined
              ? result.UnivIS.Person?.filter((p) =>
                  roomContactsKeys?.includes(p._key)
                )
              : []
        }
        const contact = event.contact.UnivISRef._key
        return {
          ...event,
          rooms: {
            ...room,
            contacts: roomContacts,
          },
          contact: result.UnivIS.Person?.find((p) => p._key === contact),
        }
      }) || []

    return events
  }
}
