import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { CabinClass, FareSubcategory, Flight } from "@/types/flight";
import { useTranslation } from "react-i18next";

interface FlightSuccessState {
  flight: Flight;
  fare: FareSubcategory;
  cabin: CabinClass;
  passengers: number;
  totalPrice: number;
  currency: string;
  date?: string;
  origin?: string;
  destination?: string;
  promoApplied?: boolean;
}

function FlightSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locale = i18n.language ?? "en";
  const state = location.state as FlightSuccessState | undefined;

  useEffect(() => {
    if (!state) {
      navigate("/flight-search", { replace: true });
    }
  }, [navigate, state]);

  if (!state) {
    return null;
  }

  const travelDate = state.date ? new Date(state.date) : undefined;

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl rounded-xl border border-white/10 bg-white/95 p-8 shadow-xl">
        <div className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 inline-flex items-center gap-2">
          <span>✔</span>
          {t("flightResults.successTitle")}
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          {t("flightResults.successSubtitle")}
        </h1>
        <p className="mt-2 text-slate-600">{t("flightResults.successDetails")}</p>

        <div className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">
                {state.flight.originAirport.city.name} ({state.flight.originAirport.code}) → {state.flight.destinationAirport.city.name} ({state.flight.destinationAirport.code})
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {state.flight.departureDateTimeDisplay} • {state.flight.arrivalDateTimeDisplay}
              </p>
            </div>
            <div className="text-right text-sm text-slate-600">
              {travelDate
                ? travelDate.toLocaleDateString(locale, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {t("flightSearch.result.cabinLabel")}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {t(`flightSearch.form.cabinClass.${state.cabin.toLowerCase()}`)}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {state.fare.brandCode}
              </p>
              {state.promoApplied ? (
                <p className="mt-2 text-xs font-semibold text-emerald-600">
                  {t("flightResults.successPromo")}
                </p>
              ) : null}
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {t("flightResults.passengers")}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {state.passengers}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {state.totalPrice.toLocaleString(locale, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {state.currency}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={() => navigate("/", { replace: true })}>
            {t("flightResults.successBack")}
          </Button>
        </div>
      </div>
    </main>
  );
}

export default FlightSuccessPage;
