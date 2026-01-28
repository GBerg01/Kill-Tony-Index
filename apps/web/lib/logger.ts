const formatDetails = (details?: Record<string, unknown>) => {
  if (!details || Object.keys(details).length === 0) {
    return "";
  }

  return ` ${JSON.stringify(details)}`;
};

export const logError = (message: string, details?: Record<string, unknown>) => {
  console.error(`[api:error] ${message}${formatDetails(details)}`);
};
