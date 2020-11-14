var tasks = [];
var inventory = []

var application = new Vue({
    el: "#counter",
    data: {
        title: "Counter",
        employees: employees,
        instructions: instructions,
        qrActive: false,
        taskActive: false,
        user: null,
        task: null,
        confirmationIndex: null,
        error: null,
        omitted: [],
        currentIndex: 0,
        hasPrevious: false,
        hasNext: true,
    },
    methods: {
        toggle(name) {
            $("#" + name).toggleClass("is-active");
            this.qrActive = $("#scanner").hasClass("is-active");
        },
        verify(id) {
            if (employees[id] == undefined)
                this.error = "User not found."
            else {
                if (tasks.length == 0) {
                    this.error = "No active task found for user. Please accept a task or rescan."
                    return
                }
                // Check if employee has a task
                for (task of tasks)
                    if (task.delegate == id) {
                        this.taskActive = true;
                        this.qrActive = false;
                        this.task = task;
                        this.confirmationIndex = Object.keys(this.task.prescription[0]).length

                        // Only set user when task is found.
                        this.user = employees[id];
                        return
                    }
                    else {
                        this.error = "No active task found for user. Please accept a task or rescan."
                    }
            }
        },
        reset() {
            this.qrActive = false;
            this.taskActive = false;
            this.user = null;
            this.task = null;
            this.error = null;
        },
        remove(i) {
            k = this.omitted.indexOf(i)

            if (k != -1) {
                this.omitted.splice(k, 1);
            }
            else {
                this.omitted.push(i);
            }

            console.log(this.omitted)
        },
        go(i) {
            this.currentIndex += i;

            this.hasPrevious = this.currentIndex > 0;
            this.hasNext = this.currentIndex < this.confirmationIndex;

            this.title = this.currentIndex == this.confirmationIndex ? 'Confirmation' : 'Instructions'
        },
        complete() {
            console.log('done')
        }
    },
});

// Populate tasks

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
            tasks = [];
            for (d in data) {
                tasks.push(data[d]);
            }
        },
    });
}

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

updateTasks();
setInterval(updateTasks, 1000);