import { createApp } from "vue";
// import YDrag from "@nimble-ui/drag"
import router from "./router";

import App from "./App.vue"

const app = createApp(App)
// app.use(YDrag)
app.use(router);
app.mount("#app");
