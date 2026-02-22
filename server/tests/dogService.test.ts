import { afterEach, describe, it, expect, vi } from "vitest";
import { getRandomDogImage } from "../services/dogService";

describe("dogService API tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("should fetch image of a dog and return a success status", async () => {
    const mockApiData = {
      message: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
      status: "success",
    };

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockApiData,
    } as Response);

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockApiData.message);
    expect(result.status).toBe("success");
    expect(fetchSpy).toHaveBeenCalledOnce();

    fetchSpy.mockRestore();
  });

  it("Should throw an error if the API request fails", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(getRandomDogImage()).rejects.toThrow(
      "Failed to fetch dog image: Dog API returned status 500",
    );
    expect(fetchSpy).toHaveBeenCalledOnce();

    fetchSpy.mockRestore();
  });
});
