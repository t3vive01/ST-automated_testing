import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import dogRoutes from "../routes/dogRoutes";
import * as dogController from "../controllers/dogController";

vi.mock("../controllers/dogController");

describe("dogRoutes API Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/dogs/random should return 200 with success true and mocked image", async () => {
    const mockedJson = {
      success: true,
      data: {
        imageUrl: "https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg",
        status: "success",
      },
    };

    vi.mocked(dogController.getDogImage).mockImplementation(
      async (_req, res) => {
        res.status(200).json(mockedJson);
      },
    );

    const app = express();
    app.use("/api/dogs", dogRoutes);

    const res = await request(app).get("/api/dogs/random");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.imageUrl).toBe(mockedJson.data.imageUrl);
  });

  it("should return 500 and an error message on GET /api/dogs/random when service fails", async () => {
    const mockErrorResponse = {
      success: false,
      error: "Failed to fetch dog image: Network error",
    };

    vi.mocked(dogController.getDogImage).mockImplementation(
      async (_req, res) => {
        res.status(500).json(mockErrorResponse);
      },
    );

    const app = express();
    app.use("/api/dogs", dogRoutes);

    const response = await request(app).get("/api/dogs/random");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(
      "Failed to fetch dog image: Network error",
    );
  });
});
