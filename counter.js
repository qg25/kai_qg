var tasks = [];
var inventory = []

var application = new Vue({
    el: "#counter",
    data: {
        title: "Counter",
        counterHelp: counterHelp,
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
        timeUpdated: 'A long time ago',
        updating: false,
        success: false,
        timer: null,
        fetchInterval: null,
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
                // Check if employee has a task
                for (task of tasks)
                    if (task.delegate == id) {
                        this.taskActive = true;
                        this.qrActive = false;
                        this.task = task;
                        this.confirmationIndex = Object.keys(this.task.prescription[0]).length

                        // Only set user when task is found.
                        this.user = employees[id];

                        this.setView('Instructions')
                        return
                    }

                this.error = "No active task found for user. Please accept a task or rescan."

            }
        },
        start() {
            this.title = 'Instructions'
            clearInterval(this.fetchInterval)
        },
        reset() {
            this.showLoading()
            this.qrActive = false
            this.taskActive = false
            this.user = null
            this.task = null
            this.confirmationIndex = null
            this.error = null
            this.omitted = []
            this.currentIndex = 0
            this.hasPrevious = false
            this.hasNext = true
            this.title = 'Counter'
            this.setView('Counter')

            this.fetchInterval = setInterval(fetchTasks, 5000);
        },
        remove(i) {
            // Trickery
            k = this.omitted.indexOf(i)

            if (k != -1) {
                this.omitted.splice(k, 1);
            }
            else {
                this.omitted.push(i);
            }
        },
        go(i) {
            this.currentIndex += i;

            this.hasPrevious = this.currentIndex > 0;
            this.hasNext = this.currentIndex < this.confirmationIndex;

            this.title = this.currentIndex == this.confirmationIndex ? 'Confirmation' : 'Instructions'

            this.setView(this.title)
        },
        setView(i) {
            this.view = i
        },
        updateInventory() {
            // force update
            this.omitted.push(-1);
            this.omitted.pop()
            for (const [index, item] of Object.keys(task.prescription[0]).entries()) {
                if (this.omitted.indexOf(index) == -1) {
                    console.log(parseInt(task.prescription[0][item]));
                    for (med in inventory) {
                        if (inventory[med].name == item) {
                            inventory[med].quantity -= parseInt(task.prescription[0][item]);
                            $.ajax({
                                url: "https://hcitp-5edf.restdb.io/rest/inventory/" + inventory[med]._id,
                                data: inventory[med],
                                type: "PUT",
                                beforeSend: function (xhr) {
                                    xhr.setRequestHeader("x-apikey", apikey);
                                },
                            });
                        }
                    }
                }
            }

            // Delete task from database
            $.ajax({
                url: "https://hcitp-5edf.restdb.io/rest/tasks/" + task._id,
                data: task,
                type: "DELETE",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("x-apikey", apikey);
                },
            });
        },
        clearSuccess() {
            this.success = false
            clearInterval(this.timer)
            this.reset()
        },
        showSuccess() {
            this.title = 'Success'
            this.success = true;
            this.timer = setInterval(this.clearSuccess, 2000);
        },
        showLoading() {
            this.updating = true;
            this.title = 'Refresh'
            fetchTasks()
        },
        complete() {
            this.updateInventory()
            this.showSuccess()
        },
    },
});

// Populate tasks

// Updating of Tasks
function fetchTasks() {
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
            var timestamp = new Date().getTime()
            application.timeUpdated = new Date(timestamp).toLocaleTimeString('sg-SG')
            application.updating = false
        },
    });
}

function userFetchTasks() {
    application.updating = true;
    fetchTasks()
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

fetchTasks();
fetchInventory();
application.fetchInterval = setInterval(fetchTasks, 5000);