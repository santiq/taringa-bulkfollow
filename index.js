var t = require('taringajs');
var taringa = new t('USUARIO', 'PASSWORD');
var _ = require('lodash');
var async = require('async');

taringa.on('logged',()=>{
	var counter = 0;
	var counter2 = 0;
	getAllFollowers(function(err,followers){

		if(err)
			console.log(err);
		else{

			async.forEachOfSeries(followers, (follower, key, next) =>{
				setTimeout(()=>{	
				  console.log('Siguiendo a : ', follower.nick);		  	
			  	  taringa.user.follow(follower.id);
				  	next();		
				},1*1000);
				
			}, (err) => {
			  if (err) console.error(err.message);

			  	console.log("Listo rufian! Ahora seguis a todos! \n ");
				  
			})
		}

	})
		
});


var getAllFollowers=(cb)=>{

	taringa.user.getStats(null,(err,data)=>{
		if(err)
			return cb(error);

		var followersPages = Math.ceil(data.followers / 50 );
		
		var arr2 = [];
		
		for(var i =1 ; i<=followersPages;i++){
			arr2[i-1]=i;
		}
		
		var followers = [];

		async.forEachOfSeries(arr2,(page,next)=>{
					taringa.user.getFollowers(null,page,(err,data)=>{
						followers = followers.concat(data);
						next();
					});	
		},function(err){
			if(!err)
				return cb(null,followers);
		})	
	})
};
