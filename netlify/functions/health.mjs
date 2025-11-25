export default async (req, context) => {
  return new Response(
    JSON.stringify({
      status: "online",
      timestamp: new Date().toISOString(),
      user: "Vicentegg4212",
      version: "2.0.0",
      model: "gemini-2.0-flash",
      gemini: {
        model: "gemini-2.0-flash"
      }
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};
