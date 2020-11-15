let tasks = [];
let inventory = [];

let locations = {
  Amoxicillin: "RC-201",
  Aspirin: "RC-901",
  Diclofenac: "RC-945",
  Esomeprazole: "RC-839",
  Famotidine: "RC-822",
  Hydroxyzine: "RC-401",
  Lansoprazole: "RC-855",
  Nystatin: "RC-421",
  Penicillin: "RC-911",
  Ranitidine: "RC-841",
};

var application = new Vue({
  el: "#Application",
  data: {
    firstAvailableIndex: 0,
    title: "Tasks",
    tasks: tasks,
    inventory: inventory,
    locations: locations,
    toggle: "Inventory",
    employees: employees,
    activeQR: null,
    currentUser: null,
    error: null,
    timer: 0,
    autoCloseTimer: null,
    autoCloseInterval: null,
    low: [],
    counter: null,
    updating: false,
    timeUpdated: "A long time ago",


    lastUpdated: 'A long time ago',
    lastUpdatedTimer: null,
  },
  methods: {
    round(i) {
      return Math.round(i);
    },
    status(threshold, quantity) {
      if (quantity <= threshold) return "Low";
      return "Normal";
    },
    len(i) {
      return i.length
    },
    generateValues(total) {
      let values = [];
      for (var i = 1; i < 11; i++) values.push((total * i) / 10);
      return values;
    },
    updateAvailableIndex() {
      this.firstAvailableIndex = 0;

      for (i = 0; i < tasks.length; i++) {
        if (tasks[i].available) {
          this.firstAvailableIndex = i;
          break;
        } else this.firstAvailableIndex++;
      }
    },
    autoClose() {
      this.autoCloseTimer -= 1;
      if (this.autoCloseTimer <= 0) {
        for (var i = 0; i < tasks.length; i++) {
          if (!tasks[i].available) {
            $('#modal' + i).removeClass("is-active");
          }
        }
        clearInterval(this.autoCloseInterval)
      }
    },
    setThreshold(name, threshold) {
      for (var medicine of this.inventory)
        if (medicine.name == name) {
          medicine.threshold = threshold;
          $.ajax({
            url: "https://hcitp-5edf.restdb.io/rest/inventory/" + medicine._id,
            data: medicine,
            type: "PUT",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("x-apikey", apikey);
            },
          });
          break;
        }

      if (this.low.includes(name)) {
        console.log('correct')
        this.low.splice(this.low.indexOf(name), 1);
      }
    },
    toggleView() {
      this.title == "Tasks"
        ? ((this.title = "Inventory"), (this.toggle = "Tasks"))
        : ((this.title = "Tasks"), (this.toggle = "Inventory"));
    },
    toggleModal(i) {
      $("#modal" + i).toggleClass("is-active");
      this.activeQR = $("#modal" + i).hasClass("is-active") ? i : null;
      this.currentUser = null;
      this.error = null;
    },
    toggleHelp() {
      $("#help").toggleClass("is-active");
    },
    toggleTask(i) {
      this.error = false;
      tasks[i].available = !tasks[i].available;
      tasks[i].delegate = this.currentUser;
      // Update DB
      $.ajax({
        url: "https://hcitp-5edf.restdb.io/rest/tasks/" + tasks[i]._id,
        data: tasks[i],
        type: "PUT",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("x-apikey", apikey);
        },
      });

      if (!tasks[i].available) {
        this.autoCloseTimer = 3
        this.autoCloseInterval = setInterval(this.autoClose, 1000)
      }
      this.currentUser = null;
      this.error = null;
      this.updateAvailableIndex();
    },
    updateTimer() {
      let time = Math.round((new Date().getTime() - this.timeUpdated) / 1000);
      this.lastUpdated = time < 60 ? time + "s ago" : Math.round(time / 60) + "minute(s) ago";
    },
    verify(user) {
      this.error = null;
      // Verify that user exists
      if (this.employees[user] == undefined) {
        this.currentUser = null;
        this.error = 'User not recognized.';
        return;
      }

      // Changing current user to the verified user, by ID number
      this.currentUser = user;

      // Checking if user is working on anything currently
      for (var task of this.tasks) {
        if (task.delegate == this.currentUser) {
          this.error = 'User already working on a task.';
          this.currentUser = null;
          return;
        }
      }
    },
    countdown() {
      this.timer -= 1;
      if (this.timer <= 0) {
        clearInterval(this.counter)
        this.clearNotification()
      }
    },
    showNotification() {
      $("#modal-noti").addClass("is-active");
      this.timer = 5;
      this.counter = setInterval(this.countdown, 1000);
    },
    clearNotification() {
      this.timer = 0;
      $("#modal-noti").removeClass("is-active");

      for (med of inventory)
        if (this.low.includes(med.name)) {
          med.notified = true
          $.ajax({
            url: "https://hcitp-5edf.restdb.io/rest/inventory/" + med._id,
            data: med,
            type: "PUT",
            beforeSend: function (xhr) {
              xhr.setRequestHeader("x-apikey", apikey);
            },
          });
        }
      this.low = []
    },

  },
});

function addTasks() {
  $.ajax({
    url: "https://hcitp-5edf.restdb.io/rest/tasks",
    data: {},
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("x-apikey", apikey);
    },
    success: function (data) {

      // Removing deleted stuff
      for (task in tasks) {
        var inside = false;
        for (d in data) {
          if (data[d]._id == tasks[task]._id) {
            inside = true
          }
        }
        if (!inside) {
          tasks.splice(tasks.indexOf(tasks[task]), 1)
        }
      }

      // Adding missing stuff
      for (d in data) {
        var inside = false;
        for (task in tasks) {
          if (data[d]._id == tasks[task]._id) {
            inside = true
          }
        } if (!inside) {
          tasks.push(data[d])
        }
      }

      application.updateAvailableIndex();


      application.timeUpdated = new Date().getTime()
      application.updating = false

      addTasks()
    }
  });
}

// Initial updating of Tasks
function fetchTasks() {
  $.ajax({
    url: "https://hcitp-5edf.restdb.io/rest/tasks",
    data: {},
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("x-apikey", apikey);
    },
    success: function (data) {
      for (d in data) {
        tasks.push(data[d]);
      }
      application.updateAvailableIndex();

      application.timeUpdated = new Date().getTime()
      if (application.lastUpdatedTimer == null) {
        application.lastUpdatedTimer = setInterval(application.updateTimer, 1000)
      }


      addTasks()
    },
  });
}

function userFetchTasks() {
  application.updating = true;
}

function detectLow() {
  // Initial Inventory Request
  $.ajax({
    url: "https://hcitp-5edf.restdb.io/rest/inventory",
    data: {},
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("x-apikey", apikey);
    },
    success: function (data) {
      if (inventory.length == 0) return
      for (d in data) {
        if (data[d].quantity <= inventory[d].threshold && inventory[d].notified == false && !application.low.includes(data[d].name)) {
          application.low.push(data[d].name)
        }
        inventory[d].quantity = data[d].quantity
      }

      detectLow()
    },
  });
}

function fetchInventory() {
  // Initial Inventory Request
  $.ajax({
    url: "https://hcitp-5edf.restdb.io/rest/inventory",
    data: {},
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("x-apikey", apikey);
    },
    success: function (data) {
      for (d in data) {
        inventory.push(data[d]);
      }

      detectLow()
    },
  });
}



// Initial Requests
fetchTasks()
fetchInventory()