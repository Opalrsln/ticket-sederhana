"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const hono_1 = require("hono");
const app = (0, express_1.default)();
const hono = new hono_1.Hono();
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Define a schema
const userSchema = new mongoose_1.default.Schema({
    name: String,
    email: String,
    password: String,
});
// Create a model
const User = mongoose_1.default.model('User', userSchema);
// Define a route
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find();
    res.json(users);
}));
// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
//# sourceMappingURL=index.js.map