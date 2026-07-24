import { config } from "dotenv";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

config({ path: path.resolve(process.cwd(), ".env.local") });
config();

import { Category, Product } from "../lib/models";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jaxicloud";

const STREAMAX_BASE_URL = "https://www.streamax.com";

function fixImageUrl(urlPath: string): string {
  if (!urlPath) return "";
  if (urlPath.startsWith("http://") || urlPath.startsWith("https://")) {
    return urlPath;
  }
  return `${STREAMAX_BASE_URL}${urlPath.startsWith("/") ? "" : "/"}${urlPath}`;
}

function createSlug(title: string, customUrl?: string): string {
  let source = customUrl || title;
  source = source.replace(/\.html$/i, "");
  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

async function seedStreamaxData() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const jsonPath = path.resolve(process.cwd(), "response1.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("response1.json file not found at:", jsonPath);
    process.exit(1);
  }

  const fileData = fs.readFileSync(jsonPath, "utf-8");
  const parsed = JSON.parse(fileData);
  const items = parsed.content || [];

  console.log(`Found ${items.length} product items in response1.json`);

  // Clear existing products and categories to ensure clean streamax dataset
  await Product.deleteMany({});
  await Category.deleteMany({});

  // 1. Create Standard Categories
  const categoryDocs = await Category.insertMany([
    {
      name: "Dash Cameras & AI",
      slug: "dash-cameras",
      description: "AI-powered ADAS and DMS dual-vision cameras for commercial fleets.",
      icon: "camera",
    },
    {
      name: "Mobile MDVR & Computing",
      slug: "mdvr-computing",
      description: "Industrial multi-channel mobile video recorders & AI computing hubs.",
      icon: "cpu",
    },
    {
      name: "Driver Terminals & ELD",
      slug: "driver-terminals",
      description: "Rugged Android driver displays, dispatch terminals, and ELD units.",
      icon: "tablet",
    },
    {
      name: "Passenger & APC Sensors",
      slug: "passenger-sensors",
      description: "Automatic passenger counting 3D cameras and optical sensors.",
      icon: "users",
    },
    {
      name: "Mining & Heavy Equipment",
      slug: "mining-machinery",
      description: "Heavy-duty waterproof cameras and sensors for mining and excavators.",
      icon: "shield",
    },
  ]);

  const catMap = new Map<string, mongoose.Types.ObjectId>();
  categoryDocs.forEach((c) => catMap.set(c.slug, c._id as mongoose.Types.ObjectId));

  // 2. Iterate through items and transform
  const productsToInsert = [];

  for (const item of items) {
    const title = item.title ? item.title.trim() : "Unnamed Product";
    const slug = createSlug(title, item.customUrl);

    // Determine category based on single6 (industry) and single7 (type)
    const typeTag = (item.single7 || "").toLowerCase();
    const industryTag = (item.single6 || "").toLowerCase();

    let catSlug = "dash-cameras";
    if (industryTag.includes("mining")) {
      catSlug = "mining-machinery";
    } else if (typeTag.includes("mdvr")) {
      catSlug = "mdvr-computing";
    } else if (title.toLowerCase().includes("xpad") || title.toLowerCase().includes("terminal") || typeTag.includes("terminal")) {
      catSlug = "driver-terminals";
    } else if (title.toLowerCase().includes("p3d") || title.toLowerCase().includes("apc") || typeTag.includes("sensor")) {
      catSlug = "passenger-sensors";
    } else if (typeTag.includes("camera") || typeTag.includes("dashcam")) {
      catSlug = "dash-cameras";
    }

    const categoryId = catMap.get(catSlug) || catMap.get("dash-cameras")!;

    // Main image
    const images: { url: string; alt: string }[] = [];
    if (item.photo) {
      images.push({
        url: fixImageUrl(item.photo),
        alt: title,
      });
    }

    // Gallery images
    if (Array.isArray(item.batchPhoto1)) {
      for (const p of item.batchPhoto1) {
        if (p.src) {
          images.push({
            url: fixImageUrl(p.src),
            alt: p.title || title,
          });
        }
      }
    }

    // Key Features from batchPhoto2
    const keyFeatures: { icon: string; title: string; description: string }[] = [];
    if (Array.isArray(item.batchPhoto2)) {
      for (const feat of item.batchPhoto2) {
        if (feat.title && feat.title.trim()) {
          keyFeatures.push({
            icon: "check-circle",
            title: feat.title.trim(),
            description: feat.note || "",
          });
        }
      }
    }

    // Tags from batchPhoto5
    const tags: string[] = [];
    if (Array.isArray(item.batchPhoto5)) {
      for (const tagObj of item.batchPhoto5) {
        if (tagObj.title) {
          const cleanedTag = tagObj.title.replace(/^#/, "").trim();
          if (cleanedTag) tags.push(cleanedTag);
        }
      }
    }
    if (industryTag) tags.push(industryTag);
    if (typeTag) tags.push(typeTag);

    // Overview & Tagline
    const tagline = item.single8 || item.note1 || item.note3 || "";
    const rawContent = item.content1 || item.note3 || item.single8 || "";
    const overview = stripHtml(rawContent) || tagline || title;

    productsToInsert.push({
      name: title,
      slug,
      modelNumber: title,
      tagline,
      overview,
      categoryId,
      images,
      tags,
      keyFeatures,
      specifications: [
        {
          groupName: "General Specs",
          items: [
            { label: "Application", value: item.single6 || "Commercial Fleet" },
            { label: "Hardware Category", value: item.single7 || "Telematics" },
            { label: "Deployment", value: "Enterprise Certified" },
          ],
        },
      ],
      certifications: ["CE-EMC", "E-Mark", "RoHS", "IP67 / IP69K"],
      price: "Contact for pricing",
      status: "published",
      metaTitle: `${title} | JaxiCloud Fleet Hardware`,
      metaDescription: tagline || overview.slice(0, 160),
    });
  }

  const insertedProducts = await Product.insertMany(productsToInsert);
  console.log(`Successfully seeded ${insertedProducts.length} products into MongoDB!`);

  await mongoose.disconnect();
  console.log("Database connection closed.");
}

seedStreamaxData().catch((err) => {
  console.error("Error seeding Streamax data:", err);
  process.exit(1);
});
