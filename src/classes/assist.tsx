import AppInfo from "./app-info.js";
import notify from "devextreme/ui/notify";
import axios from "axios";
import TaskResult from "./task-result.js";
import { jwtDecode } from "jwt-decode";

class Assist {
  static firebaseConfig = {
    apiKey: "AIzaSyCbH2wyJmcqTQU3gIl_raQwr0AmVuG_bhA",
    authDomain: "myzambia-5c62c.firebaseapp.com",
    databaseURL: "https://myzambia-5c62c.firebaseio.com",
    projectId: "myzambia-5c62c",
    storageBucket: "myzambia-5c62c.appspot.com",
    messagingSenderId: "878075714362",
    appId: "1:878075714362:web:55575ac3647ff7d3cd0e03",
  };

  static isTokenExpired() {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded = jwtDecode(token);
        if (!decoded.exp) {
          return true; // no expiry → treat as invalid
        } else {
          const now = Date.now() / 1000; // current time in seconds
         // console.log("token cheque", now, "vs", decoded.exp);
          return decoded.exp < now;
        }
      } else {
        //not found, return true
        return true;
      }
    } catch (e) {
      // invalid token
      return true;
    }
  }

  static getTokenDetails(token: string) {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (e) {
      return undefined; // invalid token
    }
  }

  ///Logs a message to the console
  static log(message: string, type: string = "log") {
    const current = new Date();

    const date =
      current.toDateString() + " " + current.toLocaleTimeString() + " ";

    if (type === "info") {
      console.info(date + AppInfo.appCode + ": " + message);
    } else if (type === "warn") {
      console.warn(date + AppInfo.appCode + ": " + message);
    } else if (type === "error") {
      console.error(date + AppInfo.appCode + ": " + message);
    } else {
      console.log(date + AppInfo.appCode + ": " + message);
    }
  }

  static showMessage(message: string, type = "info") {
    notify(
      {
        message: message,
      },
      type,
      4000
    );
  }

  ///Deletes data from the specified url
  static async loadData(title: string, url: string) {
    Assist.log(
      `Starting to load ${title} from server using url ${AppInfo.apiUrl}${url}`,
      "log"
    );

    return new Promise(function (resolve, reject) {
      axios
        .get(`${AppInfo.apiUrl}${url}`)
        .then((response) => {
          Assist.log(`Response has completed for loading ${title} from server`);

          if (response.status !== 200) {
            Assist.log(
              `Unable to process response for loading ${title} from server: ${JSON.stringify(
                response
              )}`
            );

            reject(
              new TaskResult(
                false,
                "Unable to process server response from server",
                null
              )
            );
          } else {
            resolve(new TaskResult(true, "", response.data));
          }
        })
        .catch((error) => {
          Assist.log(
            `An error occured when loading ${title} from server: ${JSON.stringify(
              error
            )}`
          );
          reject(
            new TaskResult(
              false,
              `An error occured when loading ${title} from server`,
              null
            )
          );
        });
    });
  }

  /**Deletes the specified item
   * @param {string} title The tile of the item being deleted
   * @param {string} key The id of the record to delete
   * @param {string} url The url used for the post method
   * @returns TaskResult
   */
  static async deleteItem(title: string, url: string, key: string) {
    Assist.log(
      `Starting to delete ${title} with id {key} from server using url ${
        AppInfo.apiUrl + url
      }`,
      "log"
    );

    return new Promise(function (myResolve, myReject) {
      axios({
        method: "post",
        url: AppInfo.apiUrl + url,
        data: { uid: key },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((response) => {
          Assist.log(
            `Response has completed for deleting ${title} from server`
          );

          if (typeof response.data == "string") {
            Assist.log(
              `Unable to process response for deleting ${title} from server: ${JSON.stringify(
                response
              )}`
            );

            myReject(
              new TaskResult(
                false,
                "Unable to process server response from server",
                null
              )
            );
          } else {
            if (response.data.succeeded) {
              myResolve(new TaskResult(true, "", response.data.items));
            } else {
              Assist.log(
                `Unable to delete ${title} from server: ${response.data.message}`
              );
              myReject(new TaskResult(false, response.data.message, null));
            }
          }
        })
        .catch((error) => {
          Assist.log(
            `An error occured when deleting ${title} from server: ${JSON.stringify(
              error
            )}`
          );
          myReject(
            new TaskResult(
              false,
              `An error occured when deleting ${title} from server`,
              null
            )
          );
        });
    });
  }

  static async downloadJson(filename: string, jsonData: string) {
    const url = "downloadJson";

    Assist.log(
      `Starting to download JSON with filename ${filename} and except ${jsonData.substring(
        0,
        10
      )} from server using url ${AppInfo.apiUrl + url}`,
      "log"
    );

    return new Promise(function (myResolve, myReject) {
      axios({
        method: "post",
        url: AppInfo.apiUrl + url,
        data: { ufilename: filename, ujson: jsonData },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        responseType: "blob",
      })
        .then((response) => {
          // create file link in browser's memory
          const href = URL.createObjectURL(response.data);

          // create "a" HTML element with href to file & click
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", `${filename}.csv`); //or any other extension
          document.body.appendChild(link);
          link.click();

          // clean up "a" element & remove ObjectURL
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        })
        .catch((error) => {
          Assist.log(
            `An error occured when downloading JSON with filename ${filename} and except ${jsonData.substring(
              0,
              10
            )} from server: ${JSON.stringify(error)}`
          );
          myReject(
            new TaskResult(
              false,
              `An error occured when downloading the file`,
              null
            )
          );
        });
    });
  }
  /**Logs the login for the specified user
   * @param {string} username The username of the user
   * @param {string} source The source of the login
   * @returns TaskResult
   */
  static async addLogin(username: string, source: string) {
    const url = "login/update";

    Assist.log(
      `Starting to login ${username} with source ${source} from server using url ${
        AppInfo.apiUrl + url
      }`,
      "log"
    );

    return new Promise(function (myResolve, myReject) {
      axios({
        method: "post",
        url: AppInfo.apiUrl + url,
        data: { uid: 0, uusername: username, usource: source },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((response) => {
          Assist.log(
            `Response has completed for logging login for ${username} from server`
          );

          if (typeof response.data == "string") {
            Assist.log(
              `Unable to process response for logging login ${username} from server: ${JSON.stringify(
                response
              )}`
            );

            myReject(
              new TaskResult(
                false,
                "Unable to process server response from server",
                null
              )
            );
          } else {
            if (response.data.succeeded) {
              myResolve(
                new TaskResult(
                  true,
                  `Successfully logged the login event for ${username}`,
                  response.data.items
                )
              );
            } else {
              Assist.log(
                `Unable to log login for ${username} from server: ${response.data.message}`
              );
              myReject(new TaskResult(false, response.data.message, null));
            }
          }
        })
        .catch((error) => {
          Assist.log(
            `An error occured when logging login for ${username} from server: ${JSON.stringify(
              error
            )}`
          );
          myReject(
            new TaskResult(
              false,
              `An error occured when logging login for ${username} from server`,
              null
            )
          );
        });
    });
  }

  /**Adds the specified audit action in the database
   * @param {string} title The title of the audit
   * @param {string} action The action of the log
   * @param {string} description The description of the log
   * @param {string} exception The exception of the log
   * @returns TaskResult
   */
  static async addAudit(
    username: string,
    title: string,
    action: string,
    description: string
  ) {
    const url = "audit/update";

    Assist.log(
      `Starting to audit ${title} with from server using url ${
        AppInfo.apiUrl + url
      }`,
      "log"
    );

    return new Promise(function (myResolve, myReject) {
      axios({
        method: "post",
        url: AppInfo.apiUrl + url,
        data: {
          uid: 0,
          uusername: username,
          utitle: title,
          uaction: action,
          udescription: description,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((response) => {
          Assist.log(`Response has completed for audit ${title} from server`);

          if (typeof response.data == "string") {
            Assist.log(
              `Unable to process response for audit ${title} from server: ${JSON.stringify(
                response
              )}`
            );

            myReject(
              new TaskResult(
                false,
                "Unable to process server response from server",
                null
              )
            );
          } else {
            if (response.data.succeeded) {
              myResolve(
                new TaskResult(
                  true,
                  `Successfully added the audit for ${title}`,
                  response.data.items
                )
              );
            } else {
              Assist.log(
                `Unable to audit ${title} from server: ${response.data.message}`
              );
              myReject(new TaskResult(false, response.data.message, null));
            }
          }
        })
        .catch((error) => {
          Assist.log(
            `An error occured when auditing ${title} from server: ${JSON.stringify(
              error
            )}`
          );
          myReject(
            new TaskResult(
              false,
              `An error occured when auditting ${title} from server`,
              null
            )
          );
        });
    });
  }

  /**Logs the specified action in the database
   * @param {string} title The title of the log
   * @param {string} action The action of the log
   * @param {string} description The description of the log
   * @param {string} exception The exception of the log
   * @returns TaskResult
   */
  static async addLog(
    username: string,
    title: string,
    action: string,
    description: string,
    exception: string
  ) {
    const url = "log/update";

    Assist.log(
      `Starting to log ${title} with from server using url ${
        AppInfo.apiUrl + url
      }`,
      "log"
    );

    return new Promise(function (myResolve, myReject) {
      axios({
        method: "post",
        url: AppInfo.apiUrl + url,
        data: {
          uid: 0,
          uusername: username,
          utitle: title,
          uaction: action,
          udescription: description,
          uexception: exception === null ? "" : JSON.stringify(exception),
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then((response) => {
          Assist.log(`Response has completed for log ${title} from server`);

          if (typeof response.data == "string") {
            Assist.log(
              `Unable to process response for log ${title} from server: ${JSON.stringify(
                response
              )}`
            );

            myReject(
              new TaskResult(
                false,
                "Unable to process server response from server",
                null
              )
            );
          } else {
            if (response.data.succeeded) {
              myResolve(new TaskResult(true, "", response.data.items));
            } else {
              Assist.log(
                `Unable to log ${title} from server: ${response.data.message}`
              );
              myReject(new TaskResult(false, response.data.message, null));
            }
          }
        })
        .catch((error) => {
          Assist.log(
            `An error occured when logging ${title} from server: ${JSON.stringify(
              error
            )}`
          );
          myReject(
            new TaskResult(
              false,
              `An error occured when logging ${title} from server`,
              null
            )
          );
        });
    });
  }

  static processFileUpload(e: any) {
    let result = new TaskResult(false, "", null);

    if (e.request.status === 200) {
      try {
        const res = JSON.parse(e.request.response);

        console.log("runq", res);

        if (res === null) {
          Assist.showMessage(
            `The response from the server is invalid. Please try again`,
            "error"
          );
        } else {
          if (res.Succeeded) {
            result = new TaskResult(
              true,
              "",
              `${AppInfo.fileServer}${res.Data}`
            );
          } else {
            Assist.showMessage(res.Message, "error");
          }
        }
      } catch (x) {
        Assist.showMessage(
          `Unable to process response from server. Please try again`,
          "error"
        );
      }
    } else {
      Assist.showMessage(
        `Unable to upload thumbnail image. Please try again`,
        "error"
      );
    }

    return result;
  }
}

export default Assist;
