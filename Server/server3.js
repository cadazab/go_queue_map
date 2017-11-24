var fs = require('fs');
var express = require('express');
var app = express();
var sql = require('mssql')
var https = require('https');
var bodyParser = require('body-parser');
var authentication = require('./authentication')

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

//Set Acct, Test or Prod

var authenticationProd = authentication.Prod

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function callDatabase(quer, cb){

    new sql.Request().query(quer, function(err, recordset) {
      if(err) console.log(err)


      cb(recordset);
    });
}

sql.connect(authenticationProd);

app.get('/getMappingOptions', (req,res)=>{
  callDatabase(`SELECT Mapping_Nr, Mapping
                FROM
                wq.T_mapping`,(result)=>{
		res.json(result.recordset);
	})
})

app.get('/enviroment/:env', (req,res)=>{
  sql.close()
  var env = req.params.env;
  switch (env) {
    case 'test':
      authentication['server'] = 'pant-sql-dev\\test'
      break;
    case 'acct':
      authentication['server'] = 'pant-sql-test\\ibs'
      break;
    case 'prod':
      authentication['server'] = 'pant-sql\\ibs'
      break;
  }

  sql.connect(authentication).then(pool => {
    callDatabase('select @@servername as server',(result)=>{
      res.json(result.recordset);
    })
  });
})

app.get('/Columns/:schema/:table', function(req,res){
	var table = req.params.table;
  var schema = req.params.schema

	callDatabase(`SELECT name
                FROM
                sys.dm_exec_describe_first_result_set
                ('Select * from `+schema+`.`+table+`', NULL, 0)`,
 function(result){
		res.json(result.recordset);
	})
})


app.get('/loadData/:schema/:table/:mapping/:outputfieldFilter/:ibsFilter/:orderBy/:ascOrDesc'
, function(req,res){
  var schema = req.params.schema;
  var table = req.params.table;
  var mapping = req.params.mapping;
  var outputfield = req.params.outputfieldFilter;
  if(outputfield === 'empty'){outputfield = ''}
  var ibsFilter = req.params.ibsFilter;
  if(ibsFilter === 'empty'){ibsFilter = ''}
  var orderBy = req.params.orderBy
  var ascOrDesc = req.params.ascOrDesc

  if(orderBy === 'null'){
    callDatabase(`Select * from `+schema+`.`+table+
                 ` where Outputfield like '%`+outputfield+`%' and `+
                 `Mapping_Nr=`+mapping+
                 ` and coalesce(IBSdefault,'') like '%`+ibsFilter+`%'`,
    function(result){
  		res.json(result.recordset);
  	})
  }else{
    callDatabase(`Select * from `+schema+`.`+table+
                 ` where Outputfield like '%`+outputfield+`%' and `+
                 `Mapping_Nr=`+mapping+
                 ` and coalesce(IBSdefault,'') like '%`+ibsFilter+`%'`+
                 ` ORDER BY `+orderBy+` `+ascOrDesc,
    function(result){
  		res.json(result.recordset);
  	})
  }
})

app.get('/inputOptions/:webquenr/', function(req,res){
	var webquenr = req.params.webquenr;

	callDatabase(`Select distinct name, value
                from apd.TF_Table_t_webqueue (`+webquenr+`)`,
 function(result){
		res.json(result.recordset);
	})
})

app.get('/updateInput/:schema/:table/:key/:keyColumn/:input/', function(req,res){

  var schema = req.params.schema;
  var table = req.params.table;
  var key = req.params.key;
	var input = req.params.input;
  var keyColumn = req.params.keyColumn

  if(input === 'null'){
    callDatabase(`update `+schema+`.`+table+`
                  set inputfield = `+input+`
                  where `+keyColumn+` = `+key+`;
                  select top 1 * from `+schema+`.`+table,

     function(result){
    		res.json(result.recordset);
    	})
  }else{
    callDatabase(`update `+schema+`.`+table+`
                  set inputfield = '`+input+`'
                  where `+keyColumn+` = `+key+`;
                  select top 1 * from `+schema+`.`+table,

     function(result){
    		res.json(result.recordset);
    	})
  }




})

app.get('/updateIBSdefault/:schema/:table/:key/:keyColumn/:input/', function(req,res){

  var schema = req.params.schema;
  var table = req.params.table;
  var key = req.params.key;
	var input = req.params.input.toString();
  var keyColumn = req.params.keyColumn

  if(input==='null'){
    callDatabase(`update `+schema+`.`+table+
                 ` set IBSdefault = null `+
                  `where `+keyColumn+` = `+key+`;
                  select top 1 * from `+schema+`.`+table,

     function(result){
    		res.json(result.recordset);
    	})
  }else{
    callDatabase(`update `+schema+`.`+table+
                 ` set IBSdefault = '`+input+`'
                  where `+keyColumn+` = `+key+`;
                  select top 1 * from `+schema+`.`+table,

     function(result){
    		res.json(result.recordset);
    	})
  }
})



//
//
app.post(`/editProduct`,
function(req, res){
	callDatabase(`update TT_Product
		set ruleengine_nr = `+req.body.ruleEngine+`,
		product_currency_nr = `+req.body.currency+`,
		key_category = `+req.body.category+`,
		product= '`+req.body.name+`',
		[@min_premium] = '`+req.body.minPremium+`',
		[@min_rate] = '`+req.body.minRate+`',
		[@min_deductible] = '`+req.body.minDeductible+`',
		rate_basis = '`+req.body.rateBasis+`'
		where product_nr = `+req.body.productNr ,
  function(result){
		res.redirect('back');
	})
})

app.post(`/newProduct`,
function(req, res){
	callDatabase(`insert into TT_Product (
    ruleengine_nr,
    product_currency_nr,
    key_category,
    product,
    [@min_premium],
    [@min_rate],
    [@min_deductible],
    rate_basis)
    VALUES (
    `+req.body.ruleEngine+`,
    `+req.body.currency+`,
    `+req.body.category+`,
    '`+req.body.name+`',
    '`+req.body.minPremium+`',
    '`+req.body.minRate+`',
    '`+req.body.minDeductible+`',
    '`+req.body.rateBasis+`'
    )` ,
  function(result){
		res.redirect('back');
	})
})

app.post(`/editMethod`,
function(req, res){
	callDatabase(`update TT_Method
  set method = '`+req.body.name+`',
  weight = `+req.body.weight+`,
  Key_priority = `+req.body.priority+`,
  typ_nr = `+req.body.type+`
  where method_nr = `+req.body.methodNr ,
  function(result){
		res.redirect('back');
	})
})

///
///



app.listen(3009, function(){
	console.log('Example app listening on port 3009')
})
