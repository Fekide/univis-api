export interface UnivISResult {
  UnivIS: UnivIS
}

export interface UnivIS {
  Event?: Event[]
  Person?: Person[]
  Room?: Room[]
  _version: string
  _semester: string
}

export interface Event {
  calendar: string
  contact: ContactElement
  description?: string
  enddate: Date
  endtime: string
  id: string
  internal: string
  marked?: string
  orgname: string
  orgunits: Orgunits
  repeat?: string
  rooms?: Rooms
  startdate: Date
  starttime: string
  title: string
  url?: string
  presenter?: string
  _key: string
}

export interface ContactElement {
  UnivISRef: UnivISRef
}

export interface UnivISRef {
  _type: Type
  _key: string
}

export enum Type {
  Person = 'Person',
  Room = 'Room',
}

export interface Orgunits {
  orgunit: string[] | string
}

export interface Rooms {
  room: ContactElement
}

export interface Person {
  firstname?: string
  id?: string
  lastname: string
  lehr?: string
  locations?: Locations
  orgname?: string
  orgunits?: Orgunits
  pub_visible?: string
  visible?: string
  _key: string
  fis_link_show?: string
  gender?: string
  title?: string
  work?: string
}

export interface Locations {
  location: Location
}

export interface Location {
  buildingkey?: string
  email: string
  floor?: string
  ort?: string
  office?: string
  street?: string
  tel?: string
  url?: string
  fax?: string
}

export interface Room {
  id: string
  name: string
  orgname: string
  orgunits: Orgunits
  short: string
  _key: string
  address?: string
  beam?: string
  buildingkey?: string
  description?: string
  floor?: string
  audconf?: string
  bluray?: string
  contacts?: Contacts
  covid2size?: string
  covidsize?: string
  dvd?: string
  examsize?: string
  funk?: string
  lose?: string
  mikr?: string
  pruef?: string
  size?: string
  visu?: string
  dbeam?: string
  pc?: string
  anst?: string
  fest?: string
}

export interface Contacts {
  contact: ContactElement[] | ContactElement
}
