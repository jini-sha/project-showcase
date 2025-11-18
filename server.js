const app = require("./app");
const connectDB = require("./utils/db");
const mainRouter = require("./routes/index.routes");
const errorMiddleware = require("./middleware/error.middleware");
const PORT = process.env.PORT || 3000;
const http = require('http')
const server = http.createServer(app);

app.use(errorMiddleware);
app.use("/api", mainRouter);
connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1);
    });
