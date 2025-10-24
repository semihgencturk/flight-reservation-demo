"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, ChevronRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LAST_SEARCH_STORAGE_KEY } from "@/constants/storage";
import { mockFlightData } from "@/data/mock-flights";
import type { CabinClass, FareSubcategory, Flight } from "@/types/flight";
import { useTranslation } from "react-i18next";
import { FlightSearchField } from "@/components/feature/flightSearch/FlightSearchField";
import { FlightSearchDatePicker } from "@/components/feature/flightSearch/FlightSearchDatePicker";
import { FlightSearchPassengerSelector } from "@/components/feature/flightSearch/FlightSearchPassengerSelector";

interface FlightSearchData {
  origin: string;
  destination: string;
  date: Date | undefined;
  passengers: number;
  cabinClass: CabinClass;
}

type SearchResult =
  | {
      variant: "success";
      flights: Flight[];
      flight: Flight;
      fare: FareSubcategory;
      passengers: number;
      cabinClass: CabinClass;
      date: Date;
    }
  | {
      variant: "error";
      message: string;
    };

const FLIGHTS: Flight[] = mockFlightData.flights;

const normalize = (value: string) => value.trim().toLowerCase();

const matchesAirport = (term: string, airport: Flight["originAirport"]) => {
  const query = normalize(term);

  if (!query) {
    return false;
  }

  const fields = [
    airport.code,
    airport.name,
    airport.city.name,
    airport.city.code,
    airport.country.name,
    airport.country.code,
  ];

  return fields.some((field) => normalize(field).includes(query));
};

const formatCurrency = (amount: number, currency: string, locale: string) =>
  `${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;

export function FlightSearchHero() {
  const [searchData, setSearchData] = useState<FlightSearchData>({
    origin: "",
    destination: "",
    date: undefined,
    passengers: 1,
    cabinClass: "ECONOMY",
  });
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const locale = i18n.language ?? "en";
  const navigate = useNavigate();

  const closeResult = () => {
    setIsResultOpen(false);
    setSearchResult(null);
  };

  useEffect(() => {
    if (!isResultOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeResult();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResultOpen]);

  const handleSearch = () => {
    const { origin, destination, cabinClass, passengers, date } = searchData;
    const trimmedOrigin = origin.trim();
    const trimmedDestination = destination.trim();

    if (!trimmedOrigin || !trimmedDestination) {
      setSearchResult({
        variant: "error",
        message: t("flightSearch.messages.missingRoute"),
      });
      setIsResultOpen(true);
      return;
    }

    if (!date) {
      setSearchResult({
        variant: "error",
        message: t("flightSearch.messages.missingDate"),
      });
      setIsResultOpen(true);
      return;
    }

    const matchingFlights = FLIGHTS.filter(
      (flight) =>
        matchesAirport(trimmedOrigin, flight.originAirport) &&
        matchesAirport(trimmedDestination, flight.destinationAirport)
    );

    if (!matchingFlights.length) {
      setSearchResult({
        variant: "error",
        message: t("flightSearch.messages.noRoute"),
      });
      setIsResultOpen(true);
      return;
    }

    const availableFlights = matchingFlights.filter((flight) =>
      flight.fareCategories[cabinClass].subcategories.some(
        (subcategory) => subcategory.status === "AVAILABLE"
      )
    );

    if (!availableFlights.length) {
      setSearchResult({
        variant: "error",
        message: t("flightSearch.messages.noCabin"),
      });
      setIsResultOpen(true);
      return;
    }

    const primaryFlight = availableFlights[0];
    const availableFare =
      primaryFlight.fareCategories[cabinClass].subcategories.find(
        (subcategory) => subcategory.status === "AVAILABLE"
      ) ?? primaryFlight.fareCategories[cabinClass].subcategories[0];

    const payload = {
      flights: availableFlights,
      search: {
        origin: trimmedOrigin,
        destination: trimmedDestination,
        passengers,
        cabinClass,
        date: date.toISOString(),
      },
    };

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          LAST_SEARCH_STORAGE_KEY,
          JSON.stringify(payload)
        );
      } catch {
        // Ignore storage errors
      }
    }

    setSearchResult({
      variant: "success",
      flights: availableFlights,
      flight: primaryFlight,
      fare: availableFare,
      passengers,
      cabinClass,
      date,
    });
    setIsResultOpen(true);
  };

  return (
    <div className="min-h-[50vh] bg-gradient-to-br from-[#1e3a5f] to-[#2d5a7b] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-light text-white mb-2">
          {t("flightSearch.hero.title")}
        </h1>
        <p className="text-xl md:text-2xl font-light text-white/90">
          {t("flightSearch.hero.subtitle")}
        </p>
      </div>

      <div className="w-full max-w-6xl bg-[#4a5f7a]/80 backdrop-blur-sm rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          <FlightSearchField
            icon={<Plane className="w-5 h-5 text-gray-600 rotate-45" />}
            placeholder={t("flightSearch.form.originPlaceholder")}
            value={searchData.origin}
            onChange={(value) =>
              setSearchData((prev) => ({
                ...prev,
                origin: value,
              }))
            }
          />

          <FlightSearchField
            icon={<Plane className="w-5 h-5 text-gray-600 -rotate-45" />}
            placeholder={t("flightSearch.form.destinationPlaceholder")}
            value={searchData.destination}
            onChange={(value) =>
              setSearchData((prev) => ({
                ...prev,
                destination: value,
              }))
            }
          />

          <FlightSearchDatePicker
            date={searchData.date}
            locale={locale}
            placeholder={t("flightSearch.form.datePlaceholder")}
            onChange={(selectedDate) =>
              setSearchData((prev) => ({ ...prev, date: selectedDate }))
            }
          />

          <FlightSearchPassengerSelector
            cabinClass={searchData.cabinClass}
            passengers={searchData.passengers}
            onCabinClassChange={(value) =>
              setSearchData((prev) => ({ ...prev, cabinClass: value }))
            }
            onPassengersChange={(value) =>
              setSearchData((prev) => ({ ...prev, passengers: value }))
            }
            labels={{
              selectionTitle: t("flightSearch.form.selectionTitle"),
              cabinClass: {
                economy: t("flightSearch.form.cabinClass.economy"),
                business: t("flightSearch.form.cabinClass.business"),
              },
              passenger: t("flightSearch.form.passengerLabel"),
            }}
          />

          <Button
            onClick={handleSearch}
            className="bg-[#c8102e] hover:bg-[#a00d25] text-white px-8 py-6 h-auto rounded-md"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {isResultOpen && searchResult ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          onClick={closeResult}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl text-gray-800"
            onClick={(event) => event.stopPropagation()}
          >
            {searchResult.variant === "success" ? (
              <>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t("flightSearch.result.successTitle")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t("flightSearch.result.dateLabel")}:{" "}
                      {searchResult.date.toLocaleDateString(locale, {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p className="font-medium text-gray-700">
                    {t("flightSearch.result.route", {
                      origin: searchResult.flight.originAirport.city.name,
                      originCode: searchResult.flight.originAirport.code,
                      destination:
                        searchResult.flight.destinationAirport.city.name,
                      destinationCode:
                        searchResult.flight.destinationAirport.code,
                    })}
                  </p>
                  <p>
                    {t("flightSearch.result.departureLabel")}:{" "}
                    {searchResult.flight.departureDateTimeDisplay} •{" "}
                    {t("flightSearch.result.arrivalLabel")}:{" "}
                    {searchResult.flight.arrivalDateTimeDisplay}
                  </p>
                  <p>
                    {t("flightSearch.result.durationLabel")}:{" "}
                    {searchResult.flight.flightDuration}
                  </p>
                  <p>
                    {t("flightSearch.result.cabinLabel")}:{" "}
                    {t(
                      `flightSearch.form.cabinClass.${searchResult.cabinClass.toLowerCase()}`
                    )}
                  </p>
                  <p>
                    {t("flightSearch.result.passengerLabel", {
                      count: searchResult.passengers,
                    })}
                    : {searchResult.passengers} •{" "}
                    {t("flightSearch.result.totalLabel")}:{" "}
                    {formatCurrency(
                      searchResult.fare.price.amount * searchResult.passengers,
                      searchResult.fare.price.currency,
                      locale
                    )}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <Button variant="outline" onClick={closeResult}>
                    {t("flightSearch.result.close")}
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/flight-reservation", {
                        state: {
                          flights: searchResult.flights,
                          search: {
                            origin: searchData.origin.trim(),
                            destination: searchData.destination.trim(),
                            passengers: searchResult.passengers,
                            cabinClass: searchResult.cabinClass,
                            date: searchResult.date.toISOString(),
                          },
                        },
                      });
                      closeResult();
                    }}
                  >
                    {t("flightSearch.result.viewResults")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {t("flightSearch.result.errorTitle")}
                  </h2>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {searchResult.message}
                </p>
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={closeResult}>
                    {t("flightSearch.result.close")}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
