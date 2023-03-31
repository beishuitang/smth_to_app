export default {
  menuEl: {} as HTMLElement,
  init: function () {
    this.menuEl = document.querySelector("#menu") as HTMLElement;
  },
  switchMenu: function (opration: "show" | "hide") {
    if (opration == "show") {
      this.fillPassword();
    }
    const width = this.menuEl.clientWidth;
    function showAll(left: number) {
      return left >= 0;
    }
    function hideAll(left: number) {
      return left <= -width;
    }
    const step0 = 20;
    const [start, end, step, finished] =
      opration == "show"
        ? [-Math.trunc(width / step0) * step0, "0px", step0, showAll]
        : [-width % step0, -width + "px", -step0, hideAll];
    this.menuEl.style.left = start + "px";
    const intervalID = setInterval(() => {
      const left = parseInt(this.menuEl.style.left.split("p")[0]);
      if (finished(left)) {
        this.menuEl.style.left = end;
        clearInterval(intervalID);
      } else {
        this.menuEl.style.left = left + step + "px";
      }
    }, 20);
  },
  username: "newsmth_script_username",
  password: "newsmth_script_password",
  saveConfig: "newsmth_script_config",
  savePassword: function (save: boolean) {
    if (save) {
      localStorage.setItem(this.saveConfig, "1");
      const usernameEl = this.menuEl.querySelector("#u_login_id");
      const passwordEl = this.menuEl.querySelector("#u_login_passwd");
      if (
        usernameEl instanceof HTMLInputElement &&
        passwordEl instanceof HTMLInputElement
      ) {
        localStorage.setItem(this.username, usernameEl.value);
        localStorage.setItem(this.password, passwordEl.value);
      }
    } else {
      localStorage.setItem(this.saveConfig, "0");
    }
  },
  fillPassword: function () {
    if (localStorage.getItem(this.saveConfig) == "1") {
      const usernameEl = this.menuEl.querySelector("#u_login_id");
      const passwordEl = this.menuEl.querySelector("#u_login_passwd");
      if (
        usernameEl instanceof HTMLInputElement &&
        passwordEl instanceof HTMLInputElement
      ) {
        const u = localStorage.getItem(this.username);
        const p = localStorage.getItem(this.password);
        usernameEl.value = u ? u : "";
        passwordEl.value = p ? p : "";
      }
    }
  },
};
