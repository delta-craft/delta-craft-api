const getEndpoint = () =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://api.deltacraft.eu";

export default getEndpoint;
