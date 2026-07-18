import app from "./app.js";
import connectDB from "./config/db.js";
import { seedSuperAdmin } from "./config/seedData.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    seedSuperAdmin();

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
};

startServer();