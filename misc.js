// API KEY
var apikey = "5f9d636a231ba42851b49fd5";

// EMPLOYEES
const employees = {
    301: "Dominic",
    821: "Joshua",
    1602: "Caroline"
};


const instructions = {
    "Paracetamol": {
        "dosage": "Consume 1 to 2 tablets 3 to 4 times a day when necessary for individual ≥ 12 years old.",
        "warning": "Do not take more than 2 tablets at any time and ensure each dose is at least 4 hours apart. Do not take more than 8 tablets in 24 hours.",
        "allergy": [
            "Urticaria",
            "Angioedema",
            "Anaphylaxis"
        ]
    }, "Dextromethorphan": {
        "dosage": "Consume 10mL 4 times a day when necessary for individual ≥ 12 years old.",
        "warning": "Do not take more than 40mL in 24 hours and ensure each dose is at least 6 to 8 hours apart.",
        "allergy": [
            "Anaphylaxis",
            "Angioedema"
        ]
    }, "Prazosin": {
        "dosage": "Consume 1 mg 2 or 3 times a day after meal.",
        "warning": "Do not take more than 20 mg in 24 hours.",
        "allergy": [
            "Urticaria",
            "Anaphylaxis"
        ]
    }, "Amoxicillin": {
        "dosage": "Consume 500mg 2 times a day after meal. To be finished",
        "warning": "Do not take more than 1000mg in 24 hours and ensure each dose is at least 12 hours apart.",
        "allergy": [
            "Urticaria",
            "Angioedema"
        ]
    }, "Diphenoxylate": {
        "dosage": "Consume 2 tablets 4 times a day when necessary",
        "warning": "Do not take more than 8 tablets in 24 hours and ensure each dose is at least 3 hours apart.",
        "allergy": [
            "Urticaria",
            "Angioedema",
            "Anaphylaxis"
        ]
    }, "Esomeprazole": {
        "dosage": "Consume 1 to 2 tablets 3 to 4 times a day when necessary for individual ≥ 12 years old.",
        "warning": "Do not take more than 2 tablets at any time and ensure each dose is at least 4 hours apart. Do not take more than 8 tablets in 24 hours.",
        "allergy": [
            "Urticaria",
            "Angioedema",
            "Anaphylaxis"
        ]
    }
}

const counterHelp =
{
    "Counter":
    {
        "How do I start?":
            ["Ensure that you have accepted a task from the primary 'Tasks' console. An accepted task should be grayed out.",
                "Click 'Scan employee pass' and follow the on-screen instructions to start dispensing medicine.",
                "If your task is grayed out, but you still encounter an error, Congratulations! You completed a task before the database updated.",
                "Try again in 10 seconds, or click the update button at the bottom right of the screen"]
    },
    "Instructions":
    {
        "What should I take note of?":
            ["Go through the details of each medicine with the patient.",
                "If the patient does not want a particular medicine, click on the 'Patient does not want this medication' button.",
                "Ensure that the button turns RED before proceeding.",
                "Click on the exit button at the top left at anytime throughout dispensing to cancel the current task."]

    },
    "Confirmation": {
        "Confirmation": ["Confirm all the details of the current task.",
            "Click on green button to confirm the details displayed is correct.",
            "If there are any changes, click on the red button to return to the previous pages to edit.",
            "Click on the exit button at the top left at anytime throughout dispensing to cancel the current task."]

    }
}

const taskHelp =
{
    "Tasks":
    {
        "How do I start?":
            ["Select a task from the 'Tasks' console by clicking on any white Tasks box.",
                "Read through the task details.",
                "Accept a task by scanning your QR code.",
                "An accepted task should be grayed out.",
                "",
                "Click the red button to stop working on an task.",]
    },
    "Inventory":
    {
        "What can I do here?":
            ["Look through the medicine details.",
                "Use the dropdown menu to change the notification threshold for low stocks.",
                "Changes are automatically saved.",
                "Exit using the button on the bottom left.",]
    },
}