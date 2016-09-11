function Matrix(containerId,rows,cols){
	this.containerId=containerId;
	this.rows=rows;
	this.cols=cols;	
	var n=this.rows*this.cols;
	this.create=function(){
		var matrix=document.getElementById(this.containerId);
		matrix.innerHTML="";
		for(var i=0;i<n;i++){
			var div=document.createElement("div");
			div.className="cell";
			matrix.appendChild(div);
		}		
	}
	this.prepare=function(){
		for(var i=0;i<n;i++){
			var elem=$("#matrix div").eq(i)
			elem.removeClass("red");
		}
	}
	this.getCell=function(row,col){
		var  elem=$("#matrix div").eq((col-1)*20+row-1)
		if(elem.hasClass("red")){
			return true;
		}else{
			return false;
		}
	}
	this.setCell=function(row,col,val){
		var  elem=$("#matrix div").eq((col-1)*20+row-1)
		if(val==true){
			elem.addClass("red");
		}
		if(!val){
			elem.removeClass("red");
		}
	}
}
	function Square(row,col,course){
		this.body=[row,col,row-1,col,row-1,col-1];
		this.course=course;
		this.score=0;
		this.name=null;
		var that=this;
		this.checkCell=function(x,y){
			for(var i=0;i<that.body.length-1;i+=2){
				if(that.body[i]==x && that.body[i+1]==y){
					return false;
				}	
			}
			return true;
		}
		this.randomCell=function(){
			var x=Math.floor(Math.random()*(20-1+1))+1;
			var y=Math.floor(Math.random()*(20-1+1))+1;
			var res=that.checkCell(x,y)
			if(res){
				m.setCell(x,y,true)
			}else{
				that.randomCell();
			}
		}
		this.create=function(){
			for(var i=0;i<=that.body.length-1;i+=2){
				m.setCell(that.body[i],that.body[i+1],true)
			}
			that.randomCell();
		}
		var s=0;
		this.move=function(){
			s=1;
			var last_body=that.body.slice(that.body.length-2)
			if(that.course=="right"){
				that.body.unshift(that.body[0]+1,that.body[1])
			}else if(that.course=="left"){
				that.body.unshift(that.body[0]-1,that.body[1])
			}else if(that.course=="up"){
				that.body.unshift(that.body[0],that.body[1]-1)
			}else if(that.course=="down"){
				that.body.unshift(that.body[0],that.body[1]+1)
			}
		
			var x=0;
			for(var i=2;i<=that.body.length-1;i+=2){
				if(that.body[0]==that.body[i] && that.body[1]==that.body[i+1]){
					x=1;
				}
			}
			if(that.body[0]>20 || that.body[0]<1 || that.body[1]<1 || that.body[1]>20 || x==1){
				alert("BANG!!!!");
				that.scores();
				m.create();
				that.body[0]=2;
				that.body[1]=2
				that.body[2]=1
				that.body[3]=2
				that.body[4]=1
				that.body[5]=1
				that.body.length=6
				that.course="right"
				that.randomCell();
				that.score=0;
				s=0;
				x=0;
			}
			if(m.getCell(that.body[0],that.body[1])){
				that.randomCell();
				that.score++;
			}else if(s>0){
				that.body.pop();
				that.body.pop();
				m.setCell(last_body[0],last_body[1],false)
			}
			for(var i=0;i<=that.body.length-1;i+=2){	
				m.setCell(that.body[i],that.body[i+1],true)
			}
		}		
		this.deleteSquare=function(){
			for(var i=0;i<=that.body.length-1;i+=2){	
				m.setCell(that.body[i],that.body[i+1])
			}
			that.body.length(0)
		}
		this.scores=function(){
			$.get('add.php',{'name':that.name,'score':that.score},showScores,'json')
			function showScores(data){
				var arr=[];
				for(var k in data){
					var html=data[k]['name']+':'+data[k]['score'];
					arr.push(html)
				}
				alert(arr)
			}
		}
}
function gameplay(){
	var intId=null;
	$(document).on("click","#start",function(){
		clearInterval(intId);
		m=new Matrix("matrix",20,20);
		m.create();
		m.prepare();
		square=new Square(2,2,"right");
		square.name=prompt("Введите имя");
		square.create();
		intId=setInterval(square.move, $("input:checked").val())
	})
}
function objectNavigate(code_of_key){
	if(code_of_key==37 && square.body[0]>1 && square.course!="right"){
		square.course="left"; console.log(square.course);
	}else if(code_of_key==38 && square.body[1]>1 && square.course!="down"){
		square.course="up";console.log(square.course);
	}else if(code_of_key==39 && square.body[0]<20 && square.course!="left"){
		square.course="right";console.log(square.course);
	}else if(code_of_key==40 && square.body[1]<20 && square.course!="up"){
		square.course="down";console.log(square.course)
	}
}
window.onload=function(){
	gameplay();
	$(document).keydown(function(event){
		objectNavigate(event.which);
	})
}