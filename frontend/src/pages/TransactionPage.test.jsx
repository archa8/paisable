import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import api from "../api/axios";
import {handleExportCSV} from "./TransactionsPage";


describe("handleExportCSV", () => {
  let mockGet;
  let mockCreateObjectURL;
  let mockRevokeObjectURL;
  let mockCreateElement;
  let mockAppendChild;
  let mockClick;
  let mockRemove;

  beforeEach(() => {
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn();
    }
    if (!window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL = vi.fn();
    }

    // mock api.get
    mockGet = vi.spyOn(api, "get");

    // mock URL functions
    mockCreateObjectURL = vi.spyOn(window.URL, "createObjectURL").mockReturnValue("blob:url");
    mockRevokeObjectURL = vi.spyOn(window.URL, "revokeObjectURL").mockImplementation(() => {});

    // mock DOM
    mockClick = vi.fn();
    mockRemove = vi.fn();
    mockAppendChild = vi.spyOn(document.body, "appendChild").mockImplementation(() => {});

    mockCreateElement = vi.spyOn(document, "createElement").mockImplementation(() => ({
      href: "",
      download: "",
      click: mockClick,
      remove: mockRemove,
    }));

    // mock alert
    vi.spyOn(window, "alert").mockImplementation(() => {});
    // mock console.error
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should download CSV successfully", async () => {
    const dummyCSV = "name,amount\nTest,100";
    mockGet.mockResolvedValueOnce({ data: dummyCSV });

    await handleExportCSV();

    // API call check
    expect(mockGet).toHaveBeenCalledWith("/transactions/export", { responseType: "blob" });

    // DOM and URL interactions
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemove).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    const error = new Error("Network error");
    mockGet.mockRejectedValueOnce(error);

    await handleExportCSV();

    expect(console.error).toHaveBeenCalledWith("Failed to export CSV", error);
    expect(window.alert).toHaveBeenCalledWith("Failed to export CSV. Please try again.");
  });
});