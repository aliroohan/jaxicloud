import { config } from "dotenv";
import path from "path";
import mongoose from "mongoose";

config({ path: path.resolve(process.cwd(), ".env.local") });
config();
import bcrypt from "bcryptjs";
import {
  AdminUser,
  Bundle,
  Category,
  Product,
  Solution,
} from "../lib/models";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jaxicloud";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to", MONGODB_URI);

  await Promise.all([
    AdminUser.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Bundle.deleteMany({}),
    Solution.deleteMany({}),
  ]);

  const email = process.env.ADMIN_EMAIL || "admin@jaxicloud.com";
  const password = process.env.ADMIN_PASSWORD || "admin123456";
  const passwordHash = await bcrypt.hash(password, 12);

  await AdminUser.create({
    email,
    passwordHash,
    role: "admin",
  });
  console.log(`Admin user: ${email} / ${password}`);

  const [cameras, trackers, tablets, sensors] = await Category.insertMany([
    {
      name: "Cameras",
      slug: "cameras",
      description: "AI-powered MDVR and onboard camera systems for fleets.",
      icon: "camera",
    },
    {
      name: "Trackers",
      slug: "trackers",
      description: "GPS/GNSS tracking hardware for real-time fleet visibility.",
      icon: "map-pin",
    },
    {
      name: "Tablets",
      slug: "tablets",
      description: "Rugged in-cab tablets for drivers and dispatch.",
      icon: "tablet",
    },
    {
      name: "Sensors",
      slug: "sensors",
      description: "ADAS, DMS, and IoT sensors for safety and compliance.",
      icon: "activity",
    },
  ]);

  const [transit, logistics, school] = await Solution.insertMany([
    {
      name: "Public Transit",
      slug: "public-transit",
      description:
        "Passenger safety, APC counting, and operations visibility for buses and rail.",
      productIds: [],
      metaTitle: "Public Transit Fleet Solutions | Jaxicloud",
      metaDescription:
        "Integrated cameras, trackers, and sensors for public transit fleets.",
    },
    {
      name: "Logistics & Freight",
      slug: "logistics-freight",
      description:
        "Route visibility, cargo security, and driver coaching for freight fleets.",
      productIds: [],
      metaTitle: "Logistics Fleet Solutions | Jaxicloud",
      metaDescription:
        "End-to-end hardware kits for logistics and freight operators.",
    },
    {
      name: "School Transport",
      slug: "school-transport",
      description:
        "Student safety, stop alerts, and cabin monitoring for school buses.",
      productIds: [],
      metaTitle: "School Transport Solutions | Jaxicloud",
      metaDescription:
        "Safety-first solutions for school and student transport fleets.",
    },
  ]);

  const placeholder = (label: string) => ({
    url: `https://placehold.co/800x600/0f172a/94a3b8?text=${encodeURIComponent(label)}`,
    alt: label,
  });

  const products = await Product.insertMany([
    {
      name: "AI Dash Camera Pro",
      slug: "ai-dash-camera-pro",
      modelNumber: "JXC-CAM-200",
      tagline: "Dual-channel AI camera with DMS and ADAS alerts",
      overview:
        "The AI Dash Camera Pro delivers dual-channel recording with onboard AI for driver monitoring and forward collision warnings. Built for commercial fleets that need reliable evidence and proactive safety coaching.",
      categoryId: cameras._id,
      images: [placeholder("AI Dash Camera Pro")],
      tags: ["AI", "ADAS", "DMS", "Dual Channel"],
      keyFeatures: [
        {
          icon: "brain",
          title: "On-device AI",
          description: "Detects distraction, fatigue, and risky maneuvers locally.",
        },
        {
          icon: "shield",
          title: "Event evidence",
          description: "Automatic clip upload on harsh braking or impact.",
        },
      ],
      specifications: [
        {
          groupName: "Camera",
          items: [
            { label: "Channels", value: "2 (road + cabin)" },
            { label: "Resolution", value: "1080p @ 30fps" },
          ],
        },
        {
          groupName: "Connectivity",
          items: [
            { label: "Cellular", value: "4G LTE" },
            { label: "Wi-Fi", value: "802.11n" },
          ],
        },
      ],
      certifications: ["CE", "FCC", "ISO 16750"],
      videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      specSheetUrl: "",
      supplierSource: "Streamax X3-H0404",
      price: "Contact for pricing",
      status: "published",
      metaTitle: "AI Dash Camera Pro | Jaxicloud Fleet",
      metaDescription:
        "Dual-channel AI dash camera with DMS and ADAS for commercial fleets.",
      solutionIds: [transit._id, logistics._id],
    },
    {
      name: "Fleet GPS Tracker X1",
      slug: "fleet-gps-tracker-x1",
      modelNumber: "JXC-TRK-100",
      tagline: "Always-on GNSS tracking with geofencing",
      overview:
        "Compact OBD and hardwire tracker with multi-constellation GNSS, geofencing, and low-power standby for asset recovery.",
      categoryId: trackers._id,
      images: [placeholder("Fleet GPS Tracker X1")],
      tags: ["GPS", "4G", "Geofence"],
      keyFeatures: [
        {
          icon: "map",
          title: "Live location",
          description: "Sub-minute updates with historical playback.",
        },
      ],
      specifications: [
        {
          groupName: "Tracking",
          items: [
            { label: "GNSS", value: "GPS + GLONASS + Galileo" },
            { label: "Accuracy", value: "< 2.5m CEP" },
          ],
        },
      ],
      certifications: ["CE", "RoHS"],
      videoUrls: [],
      supplierSource: "Topicon T100",
      price: "Contact for pricing",
      status: "published",
      metaTitle: "Fleet GPS Tracker X1 | Jaxicloud Fleet",
      metaDescription: "Reliable GNSS tracker with geofencing for fleet assets.",
      solutionIds: [logistics._id, school._id],
    },
    {
      name: "Rugged Driver Tablet 10",
      slug: "rugged-driver-tablet-10",
      modelNumber: "JXC-TAB-10",
      tagline: "Sunlight-readable Android tablet for the cab",
      overview:
        "A 10-inch rugged tablet with vehicle power dock, glove-friendly touch, and fleet MDM readiness for navigation and electronic forms.",
      categoryId: tablets._id,
      images: [placeholder("Rugged Driver Tablet 10")],
      tags: ["Android", "Rugged", "10-inch"],
      keyFeatures: [
        {
          icon: "sun",
          title: "Sunlight readable",
          description: "800-nit display stays clear in bright cabins.",
        },
      ],
      specifications: [
        {
          groupName: "Display",
          items: [
            { label: "Size", value: "10.1 inch" },
            { label: "Brightness", value: "800 nit" },
          ],
        },
      ],
      certifications: ["IP65", "MIL-STD-810G"],
      videoUrls: [],
      supplierSource: "Internal rebrand",
      price: "Contact for pricing",
      status: "published",
      metaTitle: "Rugged Driver Tablet 10 | Jaxicloud Fleet",
      metaDescription: "Rugged Android tablet for drivers and field ops.",
      solutionIds: [logistics._id],
    },
    {
      name: "ADAS Forward Sensor Kit",
      slug: "adas-forward-sensor-kit",
      modelNumber: "JXC-SNS-ADAS",
      tagline: "Forward collision and lane departure sensing",
      overview:
        "Plug-compatible ADAS sensor kit that pairs with Jaxicloud cameras for FCW, LDW, and headway monitoring.",
      categoryId: sensors._id,
      images: [placeholder("ADAS Forward Sensor Kit")],
      tags: ["ADAS", "FCW", "LDW"],
      keyFeatures: [
        {
          icon: "alert",
          title: "Real-time alerts",
          description: "Audio and visual warnings for collision risk.",
        },
      ],
      specifications: [
        {
          groupName: "Sensing",
          items: [
            { label: "Range", value: "Up to 120m" },
            { label: "Alerts", value: "FCW, LDW, HMW" },
          ],
        },
      ],
      certifications: ["CE"],
      videoUrls: [],
      supplierSource: "OEM module",
      price: "Contact for pricing",
      status: "published",
      metaTitle: "ADAS Forward Sensor Kit | Jaxicloud Fleet",
      metaDescription: "Forward ADAS sensing kit for fleet safety programs.",
      solutionIds: [transit._id, school._id],
    },
    {
      name: "Cabin DMS Module",
      slug: "cabin-dms-module",
      modelNumber: "JXC-SNS-DMS",
      tagline: "Driver monitoring for fatigue and distraction",
      overview:
        "Infrared DMS module designed for day/night cabin monitoring with privacy-conscious event clips.",
      categoryId: sensors._id,
      images: [placeholder("Cabin DMS Module")],
      tags: ["DMS", "IR", "Safety"],
      keyFeatures: [
        {
          icon: "eye",
          title: "Night-ready IR",
          description: "Works in dark cabins without distracting the driver.",
        },
      ],
      specifications: [
        {
          groupName: "Optics",
          items: [
            { label: "IR", value: "850nm" },
            { label: "FOV", value: "120°" },
          ],
        },
      ],
      certifications: ["CE", "FCC"],
      videoUrls: [],
      supplierSource: "OEM module",
      price: "Contact for pricing",
      status: "published",
      metaTitle: "Cabin DMS Module | Jaxicloud Fleet",
      metaDescription: "Driver monitoring module for fatigue and distraction.",
      solutionIds: [transit._id, logistics._id, school._id],
    },
    {
      name: "MDVR 4-Channel Hub",
      slug: "mdvr-4-channel-hub",
      modelNumber: "JXC-CAM-MDVR4",
      tagline: "Centralized multi-camera DVR for buses",
      overview:
        "Rugged 4-channel MDVR with SSD storage, ignition sensing, and remote live view for transit and coach fleets.",
      categoryId: cameras._id,
      images: [placeholder("MDVR 4-Channel Hub")],
      tags: ["MDVR", "4-Channel", "SSD"],
      keyFeatures: [
        {
          icon: "hard-drive",
          title: "SSD storage",
          description: "Shock-resistant storage for continuous recording.",
        },
      ],
      specifications: [
        {
          groupName: "Recording",
          items: [
            { label: "Channels", value: "4" },
            { label: "Storage", value: "Up to 2TB SSD" },
          ],
        },
      ],
      certifications: ["E-Mark", "CE"],
      videoUrls: [],
      supplierSource: "Streamax",
      price: "Contact for pricing",
      status: "published",
      metaTitle: "MDVR 4-Channel Hub | Jaxicloud Fleet",
      metaDescription: "4-channel MDVR hub for transit and coach fleets.",
      solutionIds: [transit._id, school._id],
    },
  ]);

  const productBySlug = Object.fromEntries(
    products.map((p) => [p.slug, p]),
  );

  await Solution.findByIdAndUpdate(transit._id, {
    productIds: [
      productBySlug["ai-dash-camera-pro"]._id,
      productBySlug["adas-forward-sensor-kit"]._id,
      productBySlug["mdvr-4-channel-hub"]._id,
      productBySlug["cabin-dms-module"]._id,
    ],
  });
  await Solution.findByIdAndUpdate(logistics._id, {
    productIds: [
      productBySlug["ai-dash-camera-pro"]._id,
      productBySlug["fleet-gps-tracker-x1"]._id,
      productBySlug["rugged-driver-tablet-10"]._id,
      productBySlug["cabin-dms-module"]._id,
    ],
  });
  await Solution.findByIdAndUpdate(school._id, {
    productIds: [
      productBySlug["fleet-gps-tracker-x1"]._id,
      productBySlug["adas-forward-sensor-kit"]._id,
      productBySlug["mdvr-4-channel-hub"]._id,
      productBySlug["cabin-dms-module"]._id,
    ],
  });

  await Bundle.insertMany([
    {
      name: "Transit Safety Starter Kit",
      slug: "transit-safety-starter-kit",
      description:
        "A ready-to-deploy kit combining MDVR, AI dash camera, and DMS for public transit fleets.",
      images: [placeholder("Transit Safety Starter Kit")],
      productIds: [
        productBySlug["mdvr-4-channel-hub"]._id,
        productBySlug["ai-dash-camera-pro"]._id,
        productBySlug["cabin-dms-module"]._id,
      ],
      price: "Contact for pricing",
      status: "published",
      metaTitle: "Transit Safety Starter Kit | Jaxicloud",
      metaDescription:
        "Bundle of MDVR, AI camera, and DMS for transit operators.",
    },
    {
      name: "Logistics Visibility Bundle",
      slug: "logistics-visibility-bundle",
      description:
        "Tracker, rugged tablet, and AI camera package for freight visibility and coaching.",
      images: [placeholder("Logistics Visibility Bundle")],
      productIds: [
        productBySlug["fleet-gps-tracker-x1"]._id,
        productBySlug["rugged-driver-tablet-10"]._id,
        productBySlug["ai-dash-camera-pro"]._id,
      ],
      price: "Contact for pricing",
      status: "published",
      metaTitle: "Logistics Visibility Bundle | Jaxicloud",
      metaDescription:
        "Tracker, tablet, and camera bundle for logistics fleets.",
    },
  ]);

  console.log(
    `Seeded ${products.length} products, 4 categories, 3 solutions, 2 bundles.`,
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
