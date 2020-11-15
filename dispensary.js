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
    activeQR: [],
    currentUser: null,
    error: null,
    timer: 0,
    low: [],
    counter: null,
  },
  methods: {
    round(i) {
      return Math.round(i);
    },
    status(threshold, quantity) {
      if (quantity <= threshold) return "Low";
      return "Normal";
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
    },
    toggleView() {
      this.title == "Tasks"
        ? ((this.title = "Inventory"), (this.toggle = "Tasks"))
        : ((this.title = "Tasks"), (this.toggle = "Inventory"));
    },
    toggleModal(i) {
      $("#modal" + i).toggleClass("is-active");
      this.activeQR = $("#modal" + i).hasClass("is-active") ? i : null;
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
      this.currentUser = null;
      this.error = null;
      this.updateAvailableIndex();
    },
    verify(user) {
      // Verify that user exists
      if (this.employees[user] == undefined) {
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
        $("#modal-noti").removeClass("is-active");
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

    }

  },
});

// Subsequent updating of Tasks
function updateTasks() {
  $.ajax({
    url: "https://hcitp-5edf.restdb.io/rest/tasks",
    data: {},
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("x-apikey", apikey);
    },
    success: function (data) {
      var toDelete = [];
      tasks.forEach(function (item, index) {
        let exist = false;

        data.forEach(function (dItem) {
          if (item._id == dItem._id) exist = true;
        });

        if (!exist) toDelete.push(index);
      });

      toDelete.reverse();

      toDelete.forEach(function (item) {
        tasks.splice(item, 1);
      });

      data.forEach(function (item, index) {
        if (item._id != tasks[index]._id) tasks.push(item);
      });
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
    },
  });
}

// Initial Taskings Request
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
  },
});



fetchInventory()

setInterval(updateTasks, 5000);
setInterval(fetchInventory, 5000);