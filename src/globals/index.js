import { reject } from "q";
import Vue from 'vue'

export const  notificationSystem = {
    options: {
      show: {
        theme: "dark",
        icon: "icon-person",
        position: "topCenter",
        progressBarColor: "rgb(0, 255, 184)",
        buttons: [
          [
            "<button>Ok</button>",
            (instance, toast) => {
              alert("Hello world!");
            },
            true
          ],
          [
            "<button>Close</button>",
            (instance, toast) => {
              instance.hide(
                {
                  transitionOut: "fadeOutUp",
                  onClosing: function(instance, toast, closedBy) {
                    console.info("closedBy: " + closedBy);
                  }
                },
                toast,
                "buttonName"
              );
            }
          ]
        ],
        onOpening: function(instance, toast) {
          console.info("callback abriu!");
        },
        onClosing: function(instance, toast, closedBy) {
          console.info("closedBy: " + closedBy);
        }
      },
      ballon: {
        balloon: true,
        position: "bottomCenter"
      },
      info: {
        position: "bottomLeft"
      },
      success: {
        position: "bottomRight"
      },
      warning: {
        position: "topLeft"
      },
      error: {
        position: "topRight"
      },
      question: {
        timeout: 20000,
        close: false,
        overlay: true,
        toastOnce: true,
        id: "question",
        zindex: 999,
        position: "center",
        buttons: [
          [
            "<button><b>YES</b></button>",
            function(instance, toast) {
              instance.hide({ transitionOut: "fadeOut" }, toast, "yes");
            },
            true
          ],
          [
            "<button>NO</button>",
            function(instance, toast) {
              instance.hide({ transitionOut: "fadeOut" }, toast, "no");
            }
          ]
        ],
        onClosing: function(instance, toast, closedBy) {
          console.info("Closing | closedBy: " + closedBy)
          
        },
        onClosed: function(instance, toast, closedBy) {
          console.info("Closed | closedBy: " + closedBy)
          Object.defineProperties(Vue.prototype, {
            $toastResponse: {
                get () {
                  return closedBy
                }
              }
            }
          )
        }
      }
    }
  }

export const setMinDate = (e, date) => {
    const target = e.target
    const min = new Date(date)
    Object.assign(target, {min: min.toISOString().split('T')[0]})
}

export const setMaxDate = (e) => {
  const target = e.target
  const max = new Date()
  Object.assign(target, {max: max.toISOString().split('T')[0]})
}

export const validateDate = (e) => {
  if (e.target.validity.valid){
      e.target.vale = ''
      return  !e.target.validity.valid
  }
  else{
      return !e.target.validity.valid
  }
}

export const matchString = (word) => {
  if (word === null) return true
  const pattern = /^[a-zA-Z'\s]+$/
  const match = word.match(pattern)
  return (match && word !== '') ? true : false
}

export const addDays = (date, days) => {
  let d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export const compareDates = (date1, date2) => {
  return date1 > date2
}