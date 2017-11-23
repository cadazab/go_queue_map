function getDataFromServer(code,port,cb){    //cb: Callback
	fetch('http://192.168.101.42:'+port+code)
	.then(function(response){
		response.json().then(function(result){
			//console.log(result)
			return result
		})
		.then(cb)
	})
}

function sendDataToServer(code,cb){    //cb: Callback
	fetch('http://192.168.101.42:3007'+code)
	.then(function(response){
		response.json().then(function(result){
			//console.log(result)
			return result
		})
		.then(cb)
	})
}

const Client = {
	getDataFromServer,
	sendDataToServer
}

export default Client
