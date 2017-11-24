function getDataFromServer(code,port,cb){    //cb: Callback
	fetch('http://192.168.101.220:'+port+code)
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
}

export default Client
