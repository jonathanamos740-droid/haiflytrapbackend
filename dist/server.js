"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./config/cors");
const errorHandler_1 = require("./middleware/errorHandler");
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const marketers_routes_1 = __importDefault(require("./routes/marketers.routes"));
const handlers_routes_1 = __importDefault(require("./routes/handlers.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const blogs_routes_1 = __importDefault(require("./routes/blogs.routes"));
const seo_routes_1 = __importDefault(require("./routes/seo.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
// Security Middleware
app.use((0, helmet_1.default)());
app.use(helmet_1.default.hsts({ maxAge: 31536000, includeSubDomains: true }));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(cors_2.corsOptions));
// API Prefix
const API_PREFIX = '/api/v1';
// Register Routes
app.use(`${API_PREFIX}/auth`, auth_routes_1.default);
app.use(`${API_PREFIX}/products`, products_routes_1.default);
app.use(`${API_PREFIX}/orders`, orders_routes_1.default);
app.use(`${API_PREFIX}/marketers`, marketers_routes_1.default);
app.use(`${API_PREFIX}/handlers`, handlers_routes_1.default);
app.use(`${API_PREFIX}/admin`, admin_routes_1.default);
app.use(`${API_PREFIX}/health`, health_routes_1.default);
app.use(`${API_PREFIX}/blogs`, blogs_routes_1.default);
app.use(`${API_PREFIX}/notifications`, notifications_routes_1.default);
// SEO Routes (Sitemap at root)
app.use('/', seo_routes_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Haifly Trap API running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map