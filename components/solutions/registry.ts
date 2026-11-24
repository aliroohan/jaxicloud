import type { ComponentType } from "react";
import type { SolutionLayoutProps } from "./shared/types";
import { FuelManagementLayout } from "./fuel-management-system/FuelManagementLayout";
import { ConstractorLayout } from "./constractor/ConstractorLayout";
import { LorryLayout } from "./lorry/LorryLayout";
import { LeasingControlLayout } from "./leasing-control/LeasingControlLayout";
import { NimbusLayout } from "./nimbus/NimbusLayout";
import { HecterraLayout } from "./hecterra-agriculture/HecterraLayout";
import { CoolingMonitoringLayout } from "./cooling-monitoring/CoolingMonitoringLayout";
import { LogisticsLayout } from "./logistics-delivery-system/LogisticsLayout";
import { EcoDriveLayout } from "./eco-drive/EcoDriveLayout";
import { FleetrunLayout } from "./fleetrun-fleet-volunteer/FleetrunLayout";
import { WiaTagLayout } from "./wia-tag/WiaTagLayout";
import { TpmsEbsLayout } from "./tpms-ebs-cooling-fuel-monitoring/TpmsEbsLayout";
import { DashcamLayout } from "./dashcam/DashcamLayout";
import { DashcamBusLayout } from "./dashcam-bus-truck/DashcamBusLayout";
import { DoorOpeningLayout } from "./registration-of-truck-door-opening/DoorOpeningLayout";
import { TpmsSolutionsLayout } from "./tpms-solutions/TpmsSolutionsLayout";
import { TemperatureLayout } from "./temperature-monitoring-work/TemperatureLayout";
import { GeolocationToolsLayout } from "./geolocation-of-construction-tools/GeolocationToolsLayout";
import { SidePanelsLayout } from "./opening-detection-of-truck-side-panels/SidePanelsLayout";
import { EDriversBookLayout } from "./e-drivers-book/EDriversBookLayout";
import { ClickConnectLayout } from "./click-connect/ClickConnectLayout";
import { SafeStartLayout } from "./safe-start/SafeStartLayout";
import { TachoLiveLayout } from "./tacho-live/TachoLiveLayout";
import { TransportTelematicsLayout } from "./transport-telematics/TransportTelematicsLayout";
import { JaxicloudPlatformLayout } from "./jaxicloud-platform/JaxicloudPlatformLayout";

export type SolutionLayoutComponent = ComponentType<SolutionLayoutProps>;

/** Dedicated art-directed layouts keyed by solution slug. */
export const solutionLayouts: Record<string, SolutionLayoutComponent> = {
  "fuel-management-system": FuelManagementLayout,
  constractor: ConstractorLayout,
  lorry: LorryLayout,
  "leasing-control": LeasingControlLayout,
  nimbus: NimbusLayout,
  "hecterra-agriculture": HecterraLayout,
  "cooling-monitoring": CoolingMonitoringLayout,
  "logistics-delivery-system": LogisticsLayout,
  "eco-drive": EcoDriveLayout,
  "fleetrun-fleet-volunteer": FleetrunLayout,
  "wia-tag": WiaTagLayout,
  "tpms-ebs-cooling-fuel-monitoring": TpmsEbsLayout,
  dashcam: DashcamLayout,
  "dashcam-bus-truck": DashcamBusLayout,
  "registration-of-truck-door-opening": DoorOpeningLayout,
  "tpms-solutions": TpmsSolutionsLayout,
  "temperature-monitoring-work": TemperatureLayout,
  "geolocation-of-construction-tools": GeolocationToolsLayout,
  "opening-detection-of-truck-side-panels": SidePanelsLayout,
  "e-drivers-book": EDriversBookLayout,
  "click-connect": ClickConnectLayout,
  "safe-start": SafeStartLayout,
  "tacho-live": TachoLiveLayout,
  "transport-telematics": TransportTelematicsLayout,
  "jaxicloud-platform": JaxicloudPlatformLayout,
};

export function getSolutionLayout(
  slug: string,
): SolutionLayoutComponent | null {
  return solutionLayouts[slug] ?? null;
}
