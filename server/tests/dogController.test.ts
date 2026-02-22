import { describe, it, expect, vi, afterEach } from "vitest";
import { getDogImage } from "../controllers/dogController";
import * as dogService from "../services/dogService";

describe("dogController API test", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return success true and the mocked JSON from the service", async () => {
    const mockDogData = {
      imageUrl: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
      status: "success",
    };

    vi.spyOn(dogService, "getRandomDogImage").mockResolvedValue(mockDogData);
    const mockReq = {} as any;
    const mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;
    await getDogImage(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      data: mockDogData,
    });
  });
});
