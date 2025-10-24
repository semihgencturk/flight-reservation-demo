"use client";

import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FlightReservationHeroProps {
  origin: string;
  destination: string;
  passengers: number;
  promoCodeEnabled: boolean;
  onPromoCodeChange: (enabled: boolean) => void;
  sortBy: "price" | "time";
  onSortChange: (sortBy: "price" | "time") => void;
}

export function FlightReservationHero({
  origin,
  destination,
  passengers,
  promoCodeEnabled,
  onPromoCodeChange,
  sortBy,
  onSortChange,
}: FlightReservationHeroProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6">
        <div className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded mb-4 font-semibold">
          {t("flightResults.flight")}
        </div>
        <h1 className="text-2xl md:text-3xl font-normal text-foreground mb-6">
          {origin} - {destination}, {passengers} {t("flightResults.passengers")}
        </h1>

        <div className="flex items-center gap-3 mb-2">
          <Label
            htmlFor="promo-code"
            className="text-base font-normal text-muted-foreground"
          >
            {t("flightResults.promoCode")}
          </Label>
          <Switch
            id="promo-code"
            checked={promoCodeEnabled}
            onCheckedChange={onPromoCodeChange}
          />
        </div>

        {promoCodeEnabled && (
          <div className="space-y-2 text-sm text-muted-foreground mt-3">
            <p>{t("flightResults.promoDescription")}</p>
            <p>{t("flightResults.promoRestriction")}</p>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          {t("flightResults.sortCriteria")}
        </span>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "price" ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange("price")}
            className="text-sm"
          >
            {t("flightResults.economyPrice")}
          </Button>
          <Button
            variant={sortBy === "time" ? "default" : "outline"}
            size="sm"
            onClick={() => onSortChange("time")}
            className="text-sm"
          >
            {t("flightResults.departureTime")}
          </Button>
        </div>
      </div>
    </div>
  );
}
