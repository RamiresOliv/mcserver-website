//                                      POPUPS START UP
const f_id = Math.floor(Math.random(46111) * 45823561 + 453087);
const popups_folder_element = document.createElement("div");
var global_time = 0;
popup = (arg1, arg2) => {
  setTimeout(() => {
    if (!arg1) {
      console.warn(
        `error: Requires a argument! Exemple: 'popup("Hello world")' or 'popup("error", "oh no!")'`
      );

      return {
        success: false,
        message: `error: Requires a argument! Exemple: 'popup("Hello world")' or 'popup("error", "oh no!")'`,
      };
    }
    var type = null;
    var text = null;
    if (!arg2) {
      type = "normal";
      text = arg1;
    } else {
      type = arg1;
      text = arg2;
    }
    if (document.getElementById("popup")) {
      document.getElementById("popup").remove();
    }
    var time = 3000;
    var popup_body = document.createElement("div");
    popup_body.id = "popup";
    document
      .getElementById("popups_folder-fxs-" + f_id)
      .appendChild(popup_body);
    if (type.toLowerCase() == "error") {
      popup_body.className = "error-popup";
      document.getElementById("popup").style.animation = "error_in 1s linear";
      document.getElementById("popup").style.backgroundColor =
        "rgba(66, 0, 0, 0.541)";
      time = 10000;
      global_time += 10000;
    } else if (type.toLowerCase() == "warning") {
      popup_body.className = "warning-popup";
      document.getElementById("popup").style.animation = "warn_in 1s linear";
      document.getElementById("popup").style.backgroundColor =
        "rgba(79, 58, 0, 0.541)";
      time = 5000;
      global_time += 5000;
    } else if (type.toLowerCase() == "success") {
      popup_body.className = "success-popup";
      document.getElementById("popup").style.animation = "success_in 1s linear";
      document.getElementById("popup").style.backgroundColor =
        "rgba(0, 66, 22, 0.541)";
      time = 7000;
      global_time += 7000;
    } else {
      popup_body.className = "warning-popup";
      document.getElementById("popup").style.animation = "normal_in 1s linear";
      time = 3000;
      global_time += 3000;
    }
    popup_body.innerHTML = "<p id='popup_text'>" + text + "</p>";
    document.getElementById("popup").style.opacity = 1;
    setTimeout(() => {
      if (document.getElementById("popup")) {
        document.getElementById("popup").style.animation = "out 1s linear";
        document.getElementById("popup").style.opacity = 0;
        setTimeout(() => {
          if (document.getElementById("popup_text")) global_time -= time;
          document.getElementById("popup_text").remove();
        }, 1000);
      }
    }, time);
    return {
      success: true,
      message: "success",
    };
  }, 1000);
};
setTimeout(() => {
  popups_folder_element.id = "popups_folder-fxs-" + f_id;
  document.body.appendChild(popups_folder_element);
  setTimeout(() => {
    console.log("Popups main loadded.");
  }, 300);
  document.head.innerHTML += `<style id="popups_style"/>#popup_text {
    position: relative;
    margin-left: 3px;
    margin-right: 3px;
    margin-top: 15px;
  }
  @keyframes normal_in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes warn_in {
    from {
      opacity: 0;
    }
    to {
      background-color: rgba(79, 58, 0, 0.541);
      opacity: 1;
    }
  }
  @keyframes error_in {
    from {
      opacity: 0;
    }
    to {
      background-color: rgba(66, 0, 0, 0.541);
      opacity: 1;
    }
  }
  @keyframes success_in {
    from {
      opacity: 0;
    }
    to {
      background-color: rgba(0, 66, 22, 0.541);
      opacity: 1;
    }
  }
  @keyframes out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  .normal-popup {
    opacity: 0;
    width: auto;
    height: 20px;
    display: table;
    text-align: center;
    background-color: rgb(46, 46, 46);
    border-radius: 10px;
    margin: 0px auto 0px auto;
  }
  .success-popup {
    opacity: 0;
    width: auto;
    height: 20px;
    display: table;
    text-align: center;
    background-color: rgb(46, 46, 46);
    border-radius: 10px;
    margin: 0px auto 0px auto;
  }
  .warning-popup {
    opacity: 0;
    width: auto;
    height: 20px;
    display: table;
    text-align: center;
    background-color: rgb(46, 46, 46);
    border-radius: 10px;
    margin: 0px auto 0px auto;
  }
  .error-popup {
    opacity: 0;
    width: auto;
    height: 20px;
    display: table;
    text-align: center;
    background-color: rgb(46, 46, 46);
    border-radius: 10px;
    margin: 0px auto 0px auto;
  }</style>`;
}, 100);
window.onload = () => {}; // RUNS THE START UP OF THE POPUPS.
