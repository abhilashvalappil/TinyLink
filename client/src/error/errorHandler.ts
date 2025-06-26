
import { AxiosError } from "axios";

// interface BackendErrorResponse {
//     success: boolean;
//     message: string;
//     error?: string;
// }

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const backendError = error.response?.data;

    if (Array.isArray(backendError?.message)) {
      return backendError.message[0]; // e.g., ['Invalid Password']
    }

    return backendError?.message || "Something went wrong. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};
