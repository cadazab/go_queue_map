# Go Queue Map

## Components

The application is divided in two components, a backend **server** and a frontend React **app**.

###Server

The server in charge of providing information to the interface is  developed with [nodeJS](https://nodejs.org/en/), hence written on JavaScript, it uses the web framework [Express](https://expressjs.com/) to manage the http requests and the [mssql](https://github.com/tediousjs/node-mssql) library to connect to our database.

Location:

```bash
/root/TablesMerge/App/GoQueueMap-prod-server.js
```



### App

The app or  the user interface  is written in [ReactJS](https://reactjs.org/) using the web framework [Ant Design](https://ant.design/docs/react/introduce),

Location:

```bash
/root/TablesMerge/App/src/App.js
```



## Workflow

![](https://github.com/cadazab/go_queue_map/blob/master/goqueuemap.png)

###Development

The development stage takes place in the ubuntu server  **192.168.101.220:3000**, the project location is:

```bash
/home/administrator/Desktop/go_queue_map
```

To start the development environment, open a terminal with two tabs, in both go to the project location, then in the first tab write:

```bash
nodemon Server/GoQueueMap-test-server.js
```

in the second one:

```bash
cd App
yarn start
```

Now you can make changes in the **server** and in the **app** and see live changes within the web browser.

### Production

Once  you have made the desired changes and you tested all the changes in the browser successfully, it is time to compile and deploy. 

#### Compile

To compile the app you have to stop the process in the second tab of the terminal (ctrl + c) and then execute:

```bash
yarn build
```

This process will compile the react application and create static HTML, JS, and CSS files into the folder:

```bash
/home/administrator/Desktop/go_queue_map/App/build
```

#### Deploy

The production version of the application is located in the **SVN Server** (192.168.101.42)

There are two ways of deploy the **application** into the production stage

##### The copy-paste way

you just have to copy the contents of the folder **/home/administrator/Desktop/go_queue_map** located in the **Ubuntu Server** and paste into **/root/TablesMerge** in the **SVN Server**, and then restart the service (See Restarting the service above)



##### The Git way

This way is more elegant and is favorable because includes a **repository**, or in other words, a track of the history of the application, but requires basic knowledge of Git. A Git explanation is out of the scope of this documentation, but if you have some interest you can start looking this website: [Git](https://try.github.io/levels/1/challenges/1).

If you have some knowledge of git, and github, then the deployment is simple, but there is two requirements:

1.  you need an account on github.
2. Ask Camilo to make you an Admin in the application repository.

Then you can do the Git deploy process:

1. go to **/home/administrator/Desktop/go_queue_map** in the **Ubuntu server**, then commit and push the changes.
```bash
git commit -m "description of the new changes"
git push origin master
```

2. go to  **/root/TablesMerge** in the **SVN Server**. then pull the new changes
```bash
git pull origin master
```

you will need your GitHub account credentials.

3. Restart the service

## Restarting the service

Go to the **SVN Server** and execute: 

```
pm2 list
```

this will show you a detailed list of the running services within the server, to restart a service look the **id** of the process you want to restart and then:

```
pm2 restart [proccess id]
```

you will need to restart the services **GoQueueMap-prod-server** and **GoQueueMapApp**.

you can find more information of **PM2** here: [PM2](http://pm2.keymetrics.io/docs/usage/quick-start/)



