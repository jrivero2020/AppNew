import { signout } from "./api-auth";

const auth = {
  authenticate(jwt, cb) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    }
    cb();
  },
  isAuthenticated() {
    if (typeof window === "undefined") {
      return false;
    }

    if (sessionStorage.getItem("jwt")) {
      return JSON.parse(sessionStorage.getItem("jwt"));
    } else {
      // console.log("No está en sessionStorage");
      return false;
    }
  },
  clearJWT() {
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
    // cb()
    signout().then((data) => {
      if (data.error) {
        sessionStorage.removeItem("jwt");
      } else {
        document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
      }
    });
  },
};

export default auth;
