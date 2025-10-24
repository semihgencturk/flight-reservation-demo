export interface City {
  code: string
  name: string
}

export interface Country {
  code: string
  name: string
}

export interface Airport {
  name: string
  code: string
  city: City
  country: Country
}

export interface Price {
  amount: number
  currency: string
}

export type FareStatus = "AVAILABLE" | "ERROR"
export type BrandCode = "ecoFly" | "extraFly" | "primeFly"
export type CabinClass = "ECONOMY" | "BUSINESS"

export interface FareSubcategory {
  brandCode: BrandCode
  price: Price
  order: number
  status: FareStatus
  rights: string[]
}

export interface FareCategory {
  subcategories: FareSubcategory[]
}

export interface Flight {
  originAirport: Airport
  destinationAirport: Airport
  arrivalDateTimeDisplay: string
  departureDateTimeDisplay: string
  flightDuration: string
  fareCategories: {
    BUSINESS: FareCategory
    ECONOMY: FareCategory
  }
}

export interface FlightData {
  flights: Flight[]
}
