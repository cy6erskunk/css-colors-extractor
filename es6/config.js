"use strict";
class ConfigUpdater {
  get ignore() {
    return [].map.call(document.querySelectorAll(".ignore__item"), (item) => {
      return item.value;
    });
  }

  get cwd() {
    return document.querySelector(".cwd__input").value;
  }

  get button() {
    return document.querySelector(".update-argv");
  }

  bindEventHandlers() {
    this.button.addEventListener("click", (e) => {
      this.postValues();
    });

    document.body.addEventListener("keyup", (e) => {
      if (e.keyCode === 13 && e.target.matches(".ignore__item")) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "input ignore__item";
        document.querySelector(".ignore").appendChild(input);
      } else if (e.keyCode === 13 && e.target.matches(".cwd__input")) {
        this.postValues();
      }
    });
  }

  postValues() {
    const url = "/argv";
    const data = {
      cwd: this.cwd,
      ignore: this.ignore,
    };
    const req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status === 200) {
          this.ok();
        } else {
          this.error();
        }
      }
    };

    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(data));
    this.clearButtonState();
  }

  ok() {
    this.updateButtonState("success");
  }

  error() {
    this.updateButtonState("error");
  }

  clearButtonState() {
    this.button.className = this.button.className.replace(/error|success/g, "");
  }

  updateButtonState(state) {
    this.button.className += ` ${state}`;
  }
}

const config = new ConfigUpdater();

export default config;
