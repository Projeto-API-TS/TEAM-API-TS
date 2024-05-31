import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
    connectionString: config.CONNECTION_STRING,
    max: 20
});

export default pool;