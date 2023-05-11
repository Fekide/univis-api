import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { Person, UnivISResult } from '../types'
import { resolveReferences } from './utils'

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
        const room = resolveReferences(event.rooms?.room, result.UnivIS.Room)
        const roomContacts: Person[] = room.flatMap((r) =>
          resolveReferences(r.contacts?.contact, result.UnivIS.Person)
        )
        const contact = resolveReferences(event.contact, result.UnivIS.Person)
        return {
          ...event,
          rooms: {
            ...room,
            contacts: roomContacts,
          },
          contact,
        }
      }) || []

    return events
  }
}
