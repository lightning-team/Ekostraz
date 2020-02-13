import { RawServerIntervention } from './types';
import faker from 'faker';
// Fake data that will be moved/removed out of production code. No need for linting.
/* tslint:disable */
export const FAKE_DATA = [...new Array(100).keys()].map(() => ({
  date: '2019-06-28T23:24:42.888Z',
  contactPerson: `${faker.name.firstName()} ${faker.name.lastName()}`,
  description:
    'Odit ut magni eum molestiae explicabo omnis sunt reiciendis dolorem. Suscipit amet harum aut vitae eum eum quam alias consequatur. Quos dolorem eum adipisci sit molestiae adipisci qui necessitatibus consequuntur.',
  phone: '(042) 648-7651 x44008',
  email: 'Hyman31@gmail.com',
  status: 'Do weryfikacji',
  address: 'Mszczonowska 3',
  city: 'Warszawa',
  streetNumber: '1',
  geolat: 52.13585,
  geolng: 20.89395,
}));

export function getFakeData(page: number = 1) {
  const pageStart = (page - 1) * 10;
  const pageEnd = page * 10;
  // return FAKE_DATA.slice(pageStart, pageEnd).map(transformKeys);
  return FAKE_DATA.map(transformKeys);
}

function transformKeys(entry: any): RawServerIntervention {
  return {
    id: String(Math.floor(Math.random() * 10000)),
    creationDate: entry['date'],
    fullName: entry['contactPerson'],
    city: entry['city'],
    street: entry['street'],
    streetNumber: entry['streetNumber'],
    description: entry['description'],
    status: entry['status'],
    phoneNumber: entry['phone'],
    email: entry['email'],
    geoLat: entry['geolat'],
    geoLng: entry['geolng'],
  };
}
