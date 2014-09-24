
/*common.js*/
function min(a,b)
{
    return Math.min(a,b);
}
function abs(a,b)
{
    return Math.abs(a,b);
}
function elementExistInArray(element,arr){
    for (var i = 0; i < arr.length; i++) {
        if (element == arr[i]) {
            return true;
        };
    };
    return false;
}
function dumpObj(obj,flag){
    var ret = flag?flag+"":"";
    for(var key in obj){
        ret += "\n"+key+": "+obj[key];
    }
    alert(ret);
}
/*common.js*/


/*event.js*/
var touchFunc = function(obj,type,func) {
    //滑动范围在5x5内则做点击处理，s是开始，e是结束
    var init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};
    var sTime = 0, eTime = 0;
    type = type.toLowerCase();
 
    function getPercentX(tx){
        return Math.round(10000 * tx / document.body.clientWidth) / 100.0;
    }
    function getPercentY(ty){
        return Math.round(10000 * ty / document.body.clientHeight) / 100.0;
    }

    obj.addEventListener("touchstart",function(){
        sTime = new Date().getTime();
        var pageX = event.targetTouches[0].pageX;
        var pageY = event.targetTouches[0].pageY;
        init.sx = pageX;
        init.sy = pageY;
        init.ex = init.sx;
        init.ey = init.sy;
        if(type.indexOf("start") != -1)
        {
            func(obj,
                "start",
                {
                    "stopEvent":function(){event.stopPropagation()},
                    "stopDefault":function(){event.preventDefault()},
                    "touchX":pageX,
                    "touchY":pageY,
                    "percentX":getPercentX(pageX),
                    "percentY":getPercentY(pageY)
                }
            );
        }
    }, false);
    if (type == "start") {
        return;
    };
    obj.addEventListener("touchmove",function() {
        event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
        var pageX = event.targetTouches[0].pageX;
        var pageY = event.targetTouches[0].pageY;
        init.ex = pageX;
        init.ey = pageY;
        if(type.indexOf("move")!=-1)
        {
            func(obj,
                "move",
                {
                    "stopEvent":function(){event.stopPropagation()},
                    "stopDefault":function(){event.preventDefault()},
                    "touchX":pageX,
                    "touchY":pageY,
                    "percentX":getPercentX(pageX),
                    "percentY":getPercentY(pageY)
                }
            );
        }
    }, false);
 
    obj.addEventListener("touchend",function() {
        var changeX = init.sx - init.ex;
        var changeY = init.sy - init.ey;
        if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeY)>init.y)
        {
            //左右事件
            if(changeX > 0) {
                if(type.indexOf("left")!=-1)
                {
                    func(obj,
                        "left",
                        {
                            "stopEvent":function(){event.stopPropagation()},
                            "stopDefault":function(){event.preventDefault()},
                            "changeX":changeX,
                            "changeY":changeY,
                            "percentX":getPercentX(changeX),
                            "percentY":getPercentY(changeY)
                        }
                    );
                }
            }else{
                if(type.indexOf("right")!=-1)
                {
                    func(obj,
                        "right",
                        {
                            "stopEvent":function(){event.stopPropagation()},
                            "stopDefault":function(){event.preventDefault()},
                            "changeX":changeX,
                            "changeY":changeY,
                            "percentX":getPercentX(changeX),
                            "percentY":getPercentY(changeY)
                        }
                    );
                }
            }
        }
        if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x)
        {
            //上下事件
            if(changeY > 0) {
                if(type.indexOf("top")!=-1)
                {
                    func(obj,
                        "top",
                        {
                            "stopEvent":function(){event.stopPropagation()},
                            "stopDefault":function(){event.preventDefault()},
                            "changeX":changeX,
                            "changeY":changeY,
                            "percentX":getPercentX(changeX),
                            "percentY":getPercentY(changeY)
                        }
                    );
                }
            }else{
                if(type.indexOf("down")!=-1)
                {
                    func(obj,
                        "down",
                        {
                            "stopEvent":function(){event.stopPropagation()},
                            "stopDefault":function(){event.preventDefault()},
                            "changeX":changeX,
                            "changeY":changeY,
                            "percentX":getPercentX(changeX),
                            "percentY":getPercentY(changeY)
                        }
                    );
                }
            }
        }
        if(Math.abs(changeX)<init.x && Math.abs(changeY)<init.y)
        {
            eTime = new Date().getTime();
            //点击事件，此处根据时间差细分下
            if((eTime - sTime) > 300) {
                if(type.indexOf("long")!=-1) //长按
                {
                    func(obj,
                        "long",
                        {
                            "stopEvent":function(){event.stopPropagation()},
                            "stopDefault":function(){event.preventDefault()}
                        }
                    );
                }
            }
            else {
                if(type.indexOf("click")!=-1) //当点击处理
                {
                    func(obj,
                        "click",
                        {
                            "stopEvent":function(){event.stopPropagation()},
                            "stopDefault":function(){event.preventDefault()}
                        }
                    );
                }
            }
        }
        if(type.indexOf("end")!=-1) func();
    }, false);
};
/*event.js*/

/*tiaoqiMap.js*/
var myMap = {
        /*
         "000":{
         x:0,
         y:0,
         z:0,
         px:0,
         py:0,
         "x-1":"-100",
         "x+1":"100",
         "y-1":"0-10",
         "y+1":"010",
         "z-1":"00-1",
         "z+1":"001"
         }
         */
};
var directors = ["x-1","x+1","y-1","y+1","z-1","z+1"];
var directorDelts = {
    "x-1":[-1,0,0],
    "x+1":[1,0,0],
    "y-1":[0,-1,0],
    "y+1":[0,1,0],
    "z-1":[0,0,-1],
    "z+1":[0,0,1]
};
var initMyMap = function()
{
    var directorNegatives = {
        "x-1":"x+1",
        "x+1":"x-1",
        "y-1":"y+1",
        "y+1":"y-1",
        "z-1":"z+1",
        "z+1":"z-1"
    };
    function takeKey(x,y,z)
    {
        if( x * y < 0)
        {
            var minAbs = min(abs(x),abs(y));
            if(x < 0)
            {
                minAbs = -minAbs;
            }
            z += minAbs;
            x -= minAbs;
            y += minAbs;
        }
        if( x * z < 0)
        {
            var minAbs = min(abs(x),abs(z));
            if(x < 0)
            {
                minAbs = -minAbs;
            }
            y += minAbs;
            x -= minAbs;
            z += minAbs;
        }
        if(y * z > 0)
        {
            var minAbs = min(abs(y),abs(z));
            if(y < 0)
            {
                minAbs = -minAbs;
            }
            x += minAbs;
            y -= minAbs;
            z -= minAbs;
        }
        return x + "" + y + "" + z + "";
    }
    function makeMapOnKey(mapKey)
    {
        var cElement = myMap[mapKey];
        var x = cElement.x;
        var y = cElement.y;
        var z = cElement.z;
        for(var directKey in directorDelts)
        {
            if(cElement[directKey] != undefined)
            {
                continue;
            }
            var mapNextKey = takeKey(x+directorDelts[directKey][0],y+directorDelts[directKey][1],z+directorDelts[directKey][2]);
            var mapNext = myMap[mapNextKey];
            if(mapNext == undefined)
            {
                cElement[directKey] = "none";
            }else{
                cElement[directKey] = mapNextKey;
                mapNext[directorNegatives[directKey]] = mapKey;
                makeMapOnKey(mapNextKey);
            }
        }
    }
    var mapBaseMetrix = [
                         [[0,0],[0,0],[0,0]],   //(0,0,0)
                         
                         [[1,0],[0,0],[0,0]],   //(1,0,0)
                         [[0,0],[1,0],[0,0]],   //(0,1,0)
                         [[0,0],[0,0],[1,0]],   //(0,0,1)
                         
                         [[1,0],[0,1],[0,0]],   //(1,1,0)
                         [[1,0],[0,0],[0,1]],   //(1,0,1)
                         [[0,0],[1,0],[0,-1]],  //(0,1,-1)
        ];
    for(var i = 1;i <= 4;i++)
    for(var j = 1;j <= 4;j++)
    {
        for(var k = 0;k<mapBaseMetrix.length;k++)
        {
            var x = mapBaseMetrix[k][0][0] * i + mapBaseMetrix[k][0][1] * j;
            var y = mapBaseMetrix[k][1][0] * i + mapBaseMetrix[k][1][1] * j;
            var z = mapBaseMetrix[k][2][0] * i + mapBaseMetrix[k][2][1] * j;
            myMap[x+""+y+""+z] = {
                        "x":x,
                        "y":y,
                        "z":z,
                        "px":Math.round(((x+y*0.5+z*0.5)*7.6+50 - 2.5)*100)/100,
                        "py":Math.round((((y-z)*0.866)*5.6+50 - 2)*100)/100
                };
            myMap[(-x)+""+(-y)+""+(-z)] = {
                        "x":-x,
                        "y":-y,
                        "z":-z,
                        "px":Math.round(((-(x+y*0.5+z*0.5))*7.6+50 - 2.5)*100)/100,
                        "py":Math.round(((-(y-z)*0.866)*5.6+50 - 2)*100)/100
                };
        }
    }
    makeMapOnKey("000");
}
/*tiaoqiMap.js*/

/*tiaoqiBall.js*/
var allBallsOnPlatform = [
                /*
                    {
                        "ballIndex":0,
                        "imgBallID":"img_ball_0"
                    }
                */
];


function addOneBall(ballPx,ballPy,ballUrls,ballsHTMLContainnerID)
{
    var ballIndex = allBallsOnPlatform.length;
    var imgBallID = "img_ball_" + ballIndex;
    var ballTaget = imgBallHTML(imgBallID);
    if (ballTaget == undefined) {
        document.getElementById(ballsHTMLContainnerID).innerHTML 
        += "<img class='ballBase' id='" + imgBallID + "' style='left:"+ballPx+"%;top:"+ballPy+"%;' src='"+ballUrls+"'></img>";
    }else{
        ballTaget.style.left = ballPx + "%";
        ballTaget.style.top = ballPy + "%";
        ballTaget.style.width = "5%";
        ballTaget.style.height = "5%";
        ballTaget.src = ballUrls;
        ballTaget.style.display = "block";
    }
    allBallsOnPlatform.push({
        "ballIndex":ballIndex,
        "imgBallID":imgBallID
    });
    return allBallsOnPlatform[ballIndex];
}
function imgBallHTML(imgBallID){
    return document.getElementById(imgBallID);
}
function removeAllBallOnPlatForm(fnBallWillRemove)
{
    for (var i = 0; i < allBallsOnPlatform.length; i++) {
        imgBallHTML(allBallsOnPlatform[i].imgBallID).style.display = "none";
        fnBallWillRemove(allBallsOnPlatform[i]);
    };
    allBallsOnPlatform = [];
}
function findBallOnPlatformByKey(keyName,keyValue)
{
    var ballFinded = [];
    if(keyValue == undefined){
        return ballFinded;
    }
    for (var i = 0; i < allBallsOnPlatform.length; i++) {
        if (allBallsOnPlatform[i][keyName] == keyValue) {
            ballFinded.push(allBallsOnPlatform[i]);
        };
    };
    return ballFinded;
}
/*tiaoqiBall.js*/


/*tiaoqiMapBallBase.js*/
function moveBallWithMapKey(fromMapKey,toMapKey)
{
    if (myMap[fromMapKey]["ballIndex"] == undefined) {
        alert("erro: fromeBall Not exist!");
        return false;
    };
    if (myMap[toMapKey]["ballIndex"] != undefined) {
        alert("error: toBall exist!");
        return false;
    };
    var ballIndex = myMap[fromMapKey]["ballIndex"];
    myMap[fromMapKey]["ballIndex"] = undefined;
    myMap[toMapKey]["ballIndex"] = ballIndex;
    allBallsOnPlatform[ballIndex]["mapKey"] = toMapKey;
    imgBallHTML(allBallsOnPlatform[ballIndex]["imgBallID"]).style.left = myMap[toMapKey]["px"] + "%";
    imgBallHTML(allBallsOnPlatform[ballIndex]["imgBallID"]).style.top = myMap[toMapKey]["py"] + "%";
    return allBallsOnPlatform[ballIndex];
}
function findMapKeyWalkFrom(mapKey)
{
    var allOneStepWalk = [];
    for (var direct in directorDelts) {
        var nextMapKey = myMap[mapKey][direct];
        if (nextMapKey != "none" && myMap[nextMapKey]["ballIndex"] == undefined) {
            allOneStepWalk.push(nextMapKey);
        };
    };
    return allOneStepWalk;
    
}
function isBallIndexExistWithSpecialEmpty(mapKey,speciaEmpty)
{
    return myMap[mapKey]["ballIndex"] == undefined || elementExistInArray(mapKey,speciaEmpty);
}
function findMapKeyJumpFrom_OneStep_WithDirect(mapKey,direct,speciaEmpty)
{
    if (speciaEmpty == undefined) {
        speciaEmpty = [];
    };
    var nextMapKey = myMap[mapKey][direct];
    var directEnables = [];
    var iStep = 0;
    while(nextMapKey != "none" && isBallIndexExistWithSpecialEmpty(nextMapKey,speciaEmpty))
    {
        iStep++;
        nextMapKey = myMap[nextMapKey][direct];
    }
    if (nextMapKey == "none") {
        return directEnables;
    };
    nextMapKey = myMap[nextMapKey][direct];
    while(nextMapKey != "none" &&  isBallIndexExistWithSpecialEmpty(nextMapKey,speciaEmpty))
    {
        if (iStep == 0) {
            directEnables.push(nextMapKey);
            return directEnables;
        };
        iStep--;
        nextMapKey = myMap[nextMapKey][direct];
    }
    return directEnables;
}
function findMapKeyJumpFrom_OneStep(mapKey,speciaEmpty)
{
    var allOneStepJump = [];
    for (var direct in directorDelts) {
        var tDirectJump = findMapKeyJumpFrom_OneStep_WithDirect(mapKey,direct,speciaEmpty);
        for (var j = 0; j < tDirectJump.length; j++) {
            allOneStepJump.push(tDirectJump[j]);
        };
    };
    return allOneStepJump;
}
function findMapKeyJumpFrom_AllEnable(mapKey)
{
    var jumpArray = [];
    var jumpDic = {
    };
    jumpDic[mapKey] = true;
    var allJumpKey = [];
    jumpArray.push(mapKey);
    for (var i = 0; i < jumpArray.length; i++) {
        var currentKey = jumpArray[i];
        var oneJump = findMapKeyJumpFrom_OneStep(currentKey,[mapKey]);
        for(var j = 0;j<oneJump.length;j++){
            if (jumpDic[oneJump[j]]) {
                continue;
            };
            jumpArray.push(oneJump[j]);
            allJumpKey.push(oneJump[j]);
            jumpDic[oneJump[j]] = true;
        }
    };
    return allJumpKey;
}
function findMapKeyMoveFrom_AllEnable(mapKey)
{
    var allWalkEnable = findMapKeyWalkFrom(mapKey);
    var allJumpEnable = findMapKeyJumpFrom_AllEnable(mapKey);
    var allMoveEnable = [];
    var allMoveDic = {};
    for (var i = 0; i < allWalkEnable.length; i++) {
        if(allMoveDic[allWalkEnable[i]]){
            continue;
        }
        allMoveEnable.push(allWalkEnable[i]);
        allMoveDic[allWalkEnable[i]] = true;
    };
    for (var i = 0; i < allJumpEnable.length; i++) {
        if(allMoveDic[allJumpEnable[i]]){
            continue;
        }
        allMoveEnable.push(allJumpEnable[i]);
        allMoveDic[allJumpEnable[i]] = true;
    };
    return allMoveEnable;
}
/*tiaoqiMapBallBase.js*/
