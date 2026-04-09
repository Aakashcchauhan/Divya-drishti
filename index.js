import { runEngine } from "./core/engine.js";

const path = process.argv[2] || "./";

runEngine(path).then(res => {
  console.log("\nFinal Report:\n");
  console.log(res.report);
});
