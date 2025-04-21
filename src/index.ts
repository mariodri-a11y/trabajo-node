import { redBright } from "colorette";
import app from "./app";
import { PORT } from "./config";
import { connectDB } from "./db";

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(redBright(`🚀 Server is running on http://localhost:${PORT}`));
    });
  } catch (error) {
    console.error("❌ Error al iniciar la app:", error);
  }
})();