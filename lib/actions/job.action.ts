export const fetchLocation = async (): Promise<ActionResponse<string>> => {
  try {
    const response = await fetch("http://ip-api.com/json/?fields=country");
    const location = await response.json();

    return { success: true, data: location?.country };
  } catch (error) {
    return {
      success: false,
      data: "",
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch location",
      },
    };
  }
};

export const fetchJobs = async (
  filters: JobFilterParams
): Promise<ActionResponse<Job[]>> => {
  try {
    const { query = "", page = 1 } = filters;

    const headers = {
      "x-rapidapi-key": process.env.RAPID_API_KEY ?? "",
      "x-rapidapi-host": "jsearch.p.rapidapi.com",
    };

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}`,
      {
        headers,
      }
    );

    const result = await response.json();

    return { success: true, data: result?.data ?? [] };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch jobs",
      },
    };
  }
};
