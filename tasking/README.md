# Type this command in cli to post task

## If current working directory in cli is in /tasking

curl -k -i -H "Content-Type: application/json"\
 -H "x-apikey: 5f9d636a231ba42851b49fd5"\
 -X POST -d @task.json https://hcitp-5edf.restdb.io/rest/tasks

**OR**

curl -k -i -H "Content-Type: application/json"\
 -H "x-apikey: 5f9d636a231ba42851b49fd5"\
 -X POST -d @task2.json https://hcitp-5edf.restdb.io/rest/tasks

## If current working directory in cli is not /tasking, /assets or /js

curl -k -i -H "Content-Type: application/json"\
 -H "x-apikey: 5f9d636a231ba42851b49fd5"\
 -X POST -d @tasking/task.json https://hcitp-5edf.restdb.io/rest/tasks

**OR**

curl -k -i -H "Content-Type: application/json"\
 -H "x-apikey: 5f9d636a231ba42851b49fd5"\
 -X POST -d @tasking/task2.json https://hcitp-5edf.restdb.io/rest/tasks
