export interface StatDetail {
  id: string;
  number: number;
  suffix: string;
  name: string;
  description: string;
}

export const STAT_DETAILS: StatDetail[] = [
  {
    id: "vehicles",
    number: 500000,
    suffix: "+",
    name: "CONNECTED VEHICLES",
    description: "Active commercial vehicles monitored continuously in real time."
  },
  {
    id: "countries",
    number: 45,
    suffix: "+",
    name: "COUNTRIES DEPLOYED",
    description: "Global telematics operations across Americas, Europe, Asia & MEA."
  },
  {
    id: "uptime",
    number: 99.98,
    suffix: "%",
    name: "MISSION-CRITICAL UPTIME",
    description: "Enterprise Cloud SLAs ensuring uninterrupted fleet connectivity."
  },
  {
    id: "hardware",
    number: 120,
    suffix: "+",
    name: "HARDWARE MODELS",
    description: "Cameras, OBD trackers, CANbus interfaces & BLE sensors."
  }
];
