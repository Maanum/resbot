import { db } from "./test.js";
import { testFunction } from "./test3.js";

console.log(db.data);
db.data.push({ this: "secondarticle" });

testFunction();
