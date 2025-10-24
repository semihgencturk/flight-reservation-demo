import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FlightReservationHero } from "@/components/feature/flightReservation/FlightReservationHero";
import type { CabinClass, FareSubcategory, Flight } from "@/types/flight";
import { mockFlightData } from "@/data/mock-flights";
import { Button } from "@/components/ui/button";
import { LAST_SEARCH_STORAGE_KEY } from "@/constants/storage";

interface FlightReservationLocationState {
  flights: Flight[];
  search: {
    origin: string;
    destination: string;
    passengers: number;
    cabinClass: CabinClass;
    date?: string;
  };
}

const parseTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map((value) => Number(value) || 0);
  return hours * 60 + minutes;
};

function FlightReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locationState = location.state as
    | FlightReservationLocationState
    | undefined;

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !locationState?.flights?.length ||
      !locationState.search
    ) {
      return;
    }

    try {
      window.localStorage.setItem(
        LAST_SEARCH_STORAGE_KEY,
        JSON.stringify(locationState),
      );
    } catch {
      // Ignore storage write errors
    }
  }, [locationState]);

  const fallbackFlight = mockFlightData.flights[0];

  const reservationState = useMemo<FlightReservationLocationState | null>(() => {
    if (locationState?.flights?.length && locationState.search) {
      return locationState;
    }

    if (typeof window === "undefined") {
      return null;
    }

    const storedValue = window.localStorage.getItem(LAST_SEARCH_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    try {
      const parsed = JSON.parse(
        storedValue,
      ) as FlightReservationLocationState | null;

      if (!parsed?.flights?.length || !parsed.search) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }, [locationState]);

  const searchInfo = reservationState?.search ?? {
    origin: fallbackFlight?.originAirport.code ?? "—",
    destination: fallbackFlight?.destinationAirport.code ?? "—",
    passengers: 1,
    cabinClass: "ECONOMY" as CabinClass,
    date: undefined,
  };

  const flights = reservationState?.flights?.length
    ? reservationState.flights
    : mockFlightData.flights;

  const locale = i18n.language ?? "en";
  const travelDate = searchInfo.date ? new Date(searchInfo.date) : undefined;

  const [promoCodeEnabled, setPromoCodeEnabled] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "time">("price");
  const [expandedFlight, setExpandedFlight] = useState<
    | {
        key: string;
        cabin: CabinClass;
      }
    | null
  >(null);
  const [confirmSelection, setConfirmSelection] = useState<
    | {
        flight: Flight;
        fare: FareSubcategory;
        cabin: CabinClass;
        price: number;
      }
    | null
  >(null);

  const getAvailableFare = useCallback(
    (flight: Flight, cabin: CabinClass = searchInfo.cabinClass) => {
      const subcategories = flight.fareCategories[cabin].subcategories;

      if (promoCodeEnabled) {
        const ecoFare = subcategories.find(
          (subcategory) =>
            subcategory.status === "AVAILABLE" &&
            subcategory.brandCode === "ecoFly",
        );
        if (ecoFare) {
          return ecoFare;
        }
      }

      return subcategories.find(
        (subcategory) => subcategory.status === "AVAILABLE",
      );
    },
    [promoCodeEnabled, searchInfo.cabinClass],
  );

  const getAdjustedPrice = useCallback(
    (subcategory: FareSubcategory) =>
      promoCodeEnabled && subcategory.brandCode === "ecoFly"
        ? subcategory.price.amount / 2
        : subcategory.price.amount,
    [promoCodeEnabled],
  );

  const sortedFlights = useMemo(() => {
    const flightsCopy = [...flights];
    return flightsCopy.sort((a, b) => {
      if (sortBy === "price") {
        const fareA = getAvailableFare(a);
        const fareB = getAvailableFare(b);
        const priceA = fareA ? fareA.price.amount : Number.POSITIVE_INFINITY;
        const priceB = fareB ? fareB.price.amount : Number.POSITIVE_INFINITY;
        return priceA - priceB;
      }

      return (
        parseTimeToMinutes(a.departureDateTimeDisplay) -
        parseTimeToMinutes(b.departureDateTimeDisplay)
      );
    });
  }, [flights, sortBy, getAvailableFare]);

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg p-8">
        <FlightReservationHero
          origin={searchInfo.origin}
          destination={searchInfo.destination}
          passengers={searchInfo.passengers}
          promoCodeEnabled={promoCodeEnabled}
          onPromoCodeChange={setPromoCodeEnabled}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {travelDate && !Number.isNaN(travelDate.getTime()) ? (
            <span className="text-sm text-muted-foreground">
              {t("flightSearch.result.dateLabel")}: {" "}
              {travelDate.toLocaleDateString(locale, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {t("flightResults.flight")} • {" "}
              {t(
                `flightSearch.form.cabinClass.${searchInfo.cabinClass.toLowerCase()}`,
              )}
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/flight-search")}
          >
            {t("flightResults.modifySearch")}
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {t("flightResults.resultsTitle")}
          </h2>
          {sortedFlights.length ? (
            sortedFlights.map((flight, index) => {
              const fare = getAvailableFare(
                flight,
                searchInfo.cabinClass,
              );
              const routeKey = `${flight.originAirport.code}-${flight.destinationAirport.code}-${flight.departureDateTimeDisplay}-${index}`;
              const economySummary = getAvailableFare(
                flight,
                "ECONOMY" as CabinClass,
              );
              const businessSummary = getAvailableFare(
                flight,
                "BUSINESS" as CabinClass,
              );
              const economyPrice =
                economySummary != null
                  ? getAdjustedPrice(economySummary)
                  : null;
              const businessPrice =
                businessSummary != null
                  ? getAdjustedPrice(businessSummary)
                  : null;
              const isExpanded =
                expandedFlight?.key === routeKey &&
                expandedFlight.cabin in flight.fareCategories;

              return (
                <div
                  key={routeKey}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-slate-500">
                        {flight.originAirport.city.name} (
                        {flight.originAirport.code}) → {" "}
                        {flight.destinationAirport.city.name} (
                        {flight.destinationAirport.code})
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {flight.departureDateTimeDisplay} • {" "}
                        {flight.arrivalDateTimeDisplay}
                      </p>
                      <p className="text-sm text-slate-500">
                        {t("flightSearch.result.durationLabel")}: {" "}
                        {flight.flightDuration}
                      </p>
                    </div>

                    <div className="text-right">
                      {fare ? (
                        <>
                        <p className="text-sm text-slate-500">
                          {t("flightSearch.result.cabinLabel")}: {" "}
                          {t(
                            `flightSearch.form.cabinClass.${searchInfo.cabinClass.toLowerCase()}`,
                          )}
                        </p>
                        <p className="text-2xl font-semibold text-slate-900">
                            {getAdjustedPrice(fare).toLocaleString(locale, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {fare.price.currency}
                        </p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">
                          {t("flightResults.noAvailability")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedFlight((prev) =>
                          prev && prev.key === routeKey && prev.cabin === "ECONOMY"
                            ? null
                            : { key: routeKey, cabin: "ECONOMY" },
                        )
                      }
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                        expandedFlight?.key === routeKey &&
                        expandedFlight.cabin === "ECONOMY"
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Economy
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          {economyPrice != null
                            ? `${economyPrice.toLocaleString(locale, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })} ${
                                economySummary?.price.currency ?? ""
                              }`
                            : t("flightResults.noAvailability")}
                        </p>
                        <p className="text-xs text-slate-500">
                          {t("flightResults.perPassenger")}
                        </p>
                      </div>
                      <span className="text-sm text-primary">
                        {expandedFlight?.key === routeKey &&
                        expandedFlight.cabin === "ECONOMY"
                          ? t("flightResults.hideDetails")
                          : t("flightResults.showDetails")}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedFlight((prev) =>
                          prev && prev.key === routeKey && prev.cabin === "BUSINESS"
                            ? null
                            : { key: routeKey, cabin: "BUSINESS" },
                        )
                      }
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                        expandedFlight?.key === routeKey &&
                        expandedFlight.cabin === "BUSINESS"
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Business
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          {businessPrice != null
                            ? `${businessPrice.toLocaleString(locale, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })} ${
                                businessSummary?.price.currency ?? ""
                              }`
                            : t("flightResults.noAvailability")}
                        </p>
                        <p className="text-xs text-slate-500">
                          {t("flightResults.perPassenger")}
                        </p>
                      </div>
                      <span className="text-sm text-primary">
                        {expandedFlight?.key === routeKey &&
                        expandedFlight.cabin === "BUSINESS"
                          ? t("flightResults.hideDetails")
                          : t("flightResults.showDetails")}
                      </span>
                    </button>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {flight.fareCategories[expandedFlight.cabin].subcategories.map(
                        (subcategory) => {
                          const adjustedPrice = getAdjustedPrice(subcategory);
                          const isEco = subcategory.brandCode === "ecoFly";
                          const isDisabled =
                            promoCodeEnabled && !isEco;

                          return (
                            <div
                              key={subcategory.brandCode}
                              className="flex flex-col rounded-lg border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="flex items-baseline justify-between">
                                <h3 className="text-sm font-semibold uppercase text-slate-700">
                                  {subcategory.brandCode}
                                </h3>
                                <span className="text-base font-semibold text-slate-900">
                                {`${adjustedPrice.toLocaleString(locale, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })} ${subcategory.price.currency}`}
                                </span>
                              </div>
                              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                                {subcategory.rights.map((right) => (
                                  <li key={right}>{right}</li>
                                ))}
                              </ul>
                            <Button
                              className="mt-auto w-full bg-[#c8102e] hover:bg-[#a00d25] disabled:cursor-not-allowed disabled:bg-slate-300"
                              disabled={isDisabled}
                              onClick={() => {
                                if (isDisabled) {
                                  return;
                                }
                                setConfirmSelection({
                                  flight,
                                  fare: subcategory,
                                  cabin: expandedFlight.cabin,
                                  price: adjustedPrice,
                                });
                              }}
                            >
                              {t("flightResults.selectFare")}
                            </Button>
                          </div>
                          );
                        },
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
              {t("flightResults.noResults")}
            </div>
          )}
        </div>
      </div>
      {confirmSelection ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmSelection(null)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl text-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-semibold">
              {t("flightResults.confirmTitle")}
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              {t("flightResults.confirmMessage")}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmSelection(null)}
              >
                {t("flightResults.confirmNo")}
              </Button>
              <Button
                onClick={() => {
                  if (!confirmSelection) {
                    return;
                  }

                  navigate("/flight-success", {
                    state: {
                      flight: confirmSelection.flight,
                      fare: confirmSelection.fare,
                      cabin: confirmSelection.cabin,
                      passengers: searchInfo.passengers,
                      totalPrice:
                        confirmSelection.price * searchInfo.passengers,
                      currency: confirmSelection.fare.price.currency,
                      date: searchInfo.date,
                      origin: searchInfo.origin,
                      destination: searchInfo.destination,
                      promoApplied: promoCodeEnabled,
                    },
                  });
                  setConfirmSelection(null);
                }}
              >
                {t("flightResults.confirmYes")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default FlightReservationPage;
