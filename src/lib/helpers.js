export const extractIds = (data) => {
  const buckets = [data, data?.data, data?.user, data?.payload];
  let id = null;
  let userId = null;

  for (const obj of buckets) {
    if (!obj || typeof obj !== "object") continue;
    if (id === null && (typeof obj.id === "string" || typeof obj.id === "number")) {
      id = obj.id;
    }
    if (userId === null && (typeof obj.userId === "string" || typeof obj.userId === "number")) {
      userId = obj.userId;
    }
  }

  return { id, userId };
};
