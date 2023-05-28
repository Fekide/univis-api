import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { Person, UnivISResult } from '../types'
import { parseOptions, resolveReferences } from './utils'

export type UnivISDomain =
  | 'univis.uni-bamberg.de'
  | 'univis.uni-erlangen.de'
  | 'univis.th-koeln.de'
  | 'univis.uni-luebeck.de'
  | 'univis.uni-kiel.de'

export interface UnivISClientOptions {
  domain: UnivISDomain
}

export interface RoomOptions {
  department?: string
  name?: string
  longname?: string
  contact?: string
  fullname?: string
  size?: string
  path?: string
  id?: string
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
        const rooms = resolveReferences(
          event.rooms?.room,
          result.UnivIS.Room
        ).map((r) => {
          const roomContacts: Person[] = resolveReferences(
            r.contacts?.contact,
            result.UnivIS.Person
          )
          return {
            ...r,
            contacts: roomContacts,
          }
        })
        const contact = resolveReferences(event.contact, result.UnivIS.Person)
        return {
          ...event,
          rooms,
          contact,
        }
      }) || []

    return events
  }

  async getRooms(options: RoomOptions) {
    const result = await this.request('rooms', parseOptions({ ...options }))

    const rooms = result.UnivIS.Room?.map((room) => {
      const roomContacts: Person[] = resolveReferences(
        room.contacts?.contact,
        result.UnivIS.Person
      )
      return {
        ...room,
        contacts: roomContacts,
      }
    })
    return rooms
  }
}
