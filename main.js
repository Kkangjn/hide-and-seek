let blueman1 = App.loadSpritesheet('blueman-4.png', 12, 16, {
    left: [5, 6, 7, 8, 9], 
    up: [15, 16, 17, 18, 19],
    down: [0, 1, 2, 3, 4],
    right: [10, 11, 12, 13, 14],
		dance: [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],
		down_jump: [38],
		left_jump: [39],
		right_jump: [40],
		up_jump: [41],
}, 8);

let blueman2 = App.loadSpritesheet('blueman-2.png', 24, 32, {
    left: [5, 6, 7, 8, 9], 
    up: [15, 16, 17, 18, 19],
    down: [0, 1, 2, 3, 4],
    right: [10, 11, 12, 13, 14],
		dance: [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],
		down_jump: [38],
		left_jump: [39],
		right_jump: [40],
		up_jump: [41],
}, 8);

let blueman3 = App.loadSpritesheet('blueman.png', 48, 64, {
    left: [5, 6, 7, 8, 9],
    up: [15, 16, 17, 18, 19],
    down: [0, 1, 2, 3, 4],
    right: [10, 11, 12, 13, 14],
		dance: [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],
		down_jump: [38],
		left_jump: [39],
		right_jump: [40],
		up_jump: [41],
}, 8);

let blueman4 = App.loadSpritesheet('blueman2.png', 96, 128, {
    left: [5, 6, 7, 8, 9],
    up: [15, 16, 17, 18, 19],
    down: [0, 1, 2, 3, 4],
    right: [10, 11, 12, 13, 14],
		dance: [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],
		down_jump: [38],
		left_jump: [39],
		right_jump: [40],
		up_jump: [41],
}, 8);

let blueman5 = App.loadSpritesheet('blueman4.png', 192, 256, {
    left: [5, 6, 7, 8, 9],
    up: [15, 16, 17, 18, 19],
    down: [0, 1, 2, 3, 4],
    right: [10, 11, 12, 13, 14],
		dance: [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37],
		down_jump: [38],
		left_jump: [39],
		right_jump: [40],
		up_jump: [41],
}, 8);

let ghost = App.loadSpritesheet("ghost.png", 32, 48, {
	left: [2],
	right: [1],
	up: [3],
	down: [0],
});

let redBoxing = App.loadSpritesheet("redBoxing.png");
let blueBoxing = App.loadSpritesheet("blueBoxing.png");

const STATE_INIT = 3000;
const STATE_READY = 3001;
const STATE_PLAYING = 3002;
const STATE_JUDGE = 3004;
const STATE_END = 3005;

let _state = STATE_INIT;

let _timer = 360;
let _stateTimer = 0;

let allQuizInfo = [];

let _blueTeam = [];
let _redTeam = [];
let quizInfo = [];

let QUESTION_COUNTER = 0;
let TEAM_COUNTER = 0;

let _players = App.players;
let _alive = 0;
let alivePlayer = [];

let gameNum = 0;
let gameResults = [];
let questionAnswer = [];

App.onJoinPlayer.Add(function(p) {
    p.tag = {
        x: p.tileX,
        y: p.tileY,
        sturn : false,
        sTime : 1,
        super : false,
        team: Math.floor(TEAM_COUNTER % 2),
        alive : false,
        shield : false,
        hp : 2,
        answer : 0,
    };
    
    if(_state != STATE_INIT){
        p.title = null; // 타이틀 삭제
        p.tag.alive = false; // alive 속성 false
        p.sprite = ghost; // 캐릭터 이미지를 ghost로 변경
        p.hidden = true; // 타겟 숨기기
    } else{
        if(p.tag.team == 0)
            _redTeam.push(p);
        else if(p.tag.team == 1)
            _blueTeam.push(p);

        TEAM_COUNTER++;
        p.nameColor = p.tag.team == 0 ? 16711680 : 255;
        p.sprite = p.tag.team == 0 ? null : blueman3;
        p.moveSpeed = p.tag.team == 0 ? 100 : 80;
        p.attackType = 2;
        p.attackSprite = p.tag.team == 0 ? redBoxing : blueBoxing;
        p.attackParam2 = p.tag.team == 0 ? 2 : 0;
        p.attackParam1 = p.tag.team == 0 ? 2 : 0;

    }
    p.sendUpdated();

    _players = App.players;
});

// 다른 플레이어를 때릴 때
App.onUnitAttacked.Add(function (sender, x, y, target) {
	if (_state != STATE_PLAYING) return;

	// 공격자가 블루팀이면
	if (sender.tag.team == 1) return;

    // 타겟이 레드 팀이면 return
    if (target.tag.team == 0) return;

	// 타겟이 살아 있는 상태이면서 shield가 false인 경우
	if (target.tag.alive && !target.tag.shield) {
		target.tag.hp--; // 타겟의 체력이 1 만큼 감소

		// 타겟의 체력이 0이된 경우
		if (target.tag.hp == 0) {
			target.title = null; // 타이틀 삭제
			target.tag.alive = false; // alive 속성 false
			target.sprite = ghost; // 캐릭터 이미지를 ghost로 변경
            target.hidden = true; // 타겟 숨기기
			target.sendUpdated(); // 타겟 속성 업데이트

			_alive = checkSuvivors();

            if(_alive == 0){
                startState(STATE_JUDGE);
            }
		}
        //  else {
		// 	// 타겟을 공격하면 타겟이 1초간 무적 상태가 됨. (shield = true)
		// 	target.tag.shield = true;
		// 	setHPgage(target, target.tag.hp);
		// 	target.sendUpdated();
		// }
	}
});

App.addOnKeyDown(81, function(player){
    App.sayToAll(`${player.name}님이 q키를 눌렀습니다.`);
    if(_state == STATE_PLAYING){
        let i = 0;
        if(_timer<=330 && _timer>=280){
            i=0;
        }else if(_timer<=270 && _timer>=220){
            i=1;
        }else if(_timer<=210 && _timer>=160){
            i=2;
        }else if(_timer<=150 && _timer>=100){
            i=3;
        }else if(_timer<=90 && _timer>=30){
            i=4;
        }else{
            player.sendMessage("지금은 문제 준비중 입니다.");
            return;
        }
        let widget =  player.showWidget("quiz.html", "bottomleft", 600, 400);
        widget.sendMessage({
            quiz: quizInfo[i],
        })
        widget.onMessage.Add(function (sender, msg) {
            switch (msg.type) {
                case "close":
                    widget.destroy();
                    break;
                case "submit":
                    if(quizInfo[i].correctAnswer==msg.selectedAnswer){
                        player.sendMessage("정답 입니다.");
                        let pAnswer = player.tag.answer + 1;
                        player.tag.answer = pAnswer;
                        
                        if(player.tag.team == 0){
                            switch(pAnswer){
                                case 0 :
                                    player.cameraEffect = 1; // 1 = 비네팅 효과
                                    player.cameraEffectParam1 = 300; // 비네팅 효과의 범위를 300으로 지정
                                    player.displayRatio = 5;
                                    break;
                                case 1 :
                                    player.cameraEffect = 1;
                                    player.cameraEffectParam1 = 500;
                                    player.displayRatio = 3;
                                    break;
                                case 2 :
                                    player.cameraEffect = 1;
                                    player.cameraEffectParam1 = 800;
                                    player.displayRatio = 1;
                                    break;
                                case 3 :
                                    // player.attackParam1 += 2;
                                    player.attackParam2 += 2;
                                    break;
                                case 4 :
                                    player.moveSpeed += 40;
                                    break;
                            }
                    
                        }else if(player.tag.team == 1){
                            switch(pAnswer){
                                case 0 :
                                    player.sprite = blueman5;
                                    break;
                                case 1 :
                                    player.sprite = blueman4;
                                    break;
                                case 2 :
                                    player.sprite = blueman3;
                                    break;
                                case 3 :
                                    player.sprite = blueman2;
                                    break;
                                case 4 :
                                    player.sprite = blueman1;
                                    break;
                            }
                        }
                        player.sendUpdated();
                    } else{
                        player.sendMessage("오답 입니다.");
                    }
                    widget.destroy();
                    break;
            }
        })
    }
});

// 모바일용
App.addMobileButton(8, 50, 400, function (player) {
    App.sayToAll(`${player.name}, TOP_LEFT 버튼`);

    if(_state == STATE_PLAYING){
        let i = 0;
        if(_timer<=330 && _timer>=280){
            i=0;
        }else if(_timer<=270 && _timer>=220){
            i=1;
        }else if(_timer<=210 && _timer>=160){
            i=2;
        }else if(_timer<=150 && _timer>=100){
            i=3;
        }else if(_timer<=90 && _timer>=30){
            i=4;
        }else{
            player.sendMessage("지금은 문제 준비중 입니다.");
            return;
        }
        let widget = player.showWidget("quiz.html", "middle", 600, 400);
        widget.sendMessage({
            quiz: quizInfo[i],
        })
        widget.onMessage.Add(function (sender, msg) {
            switch (msg.type) {
                case "close":
                    widget.destroy();
                    break;
                case "submit":
                    let correct = quizInfo[i].correctAnswer==msg.selectedAnswer ? true : false;
                    let answer = {
                        gameNum : gameNum,
                        questionId : quizInfo[i].id,
                        playerName : player.name,
                        playerId : player.id,
                        answer : msg.selectedAnswer,
                        correct : correct
                    };
                    questionAnswer.push(answer);
                    if(correct){
                        player.sendMessage("정답 입니다.");
                        let pAnswer = player.tag.answer + 1;
                        player.tag.answer = pAnswer;
                        
                        if(player.tag.team == 0){
                            switch(pAnswer){
                                case 0 :
                                    player.cameraEffect = 1; // 1 = 비네팅 효과
                                    player.cameraEffectParam1 = 300; // 비네팅 효과의 범위를 300으로 지정
                                    player.displayRatio = 5;
                                    break;
                                case 1 :
                                    player.cameraEffect = 1;
                                    player.cameraEffectParam1 = 500;
                                    player.displayRatio = 3;
                                    break;
                                case 2 :
                                    player.cameraEffect = 1;
                                    player.cameraEffectParam1 = 800;
                                    player.displayRatio = 1;
                                    break;
                                case 3 :
                                    // player.attackParam1 += 2;
                                    player.attackParam2 += 2;
                                    break;
                                case 4 :
                                    player.moveSpeed += 40;
                                    break;
                            }
                    
                        }else if(player.tag.team == 1){
                            switch(pAnswer){
                                case 0 :
                                    player.sprite = blueman5;
                                    break;
                                case 1 :
                                    player.sprite = blueman4;
                                    break;
                                case 2 :
                                    player.sprite = blueman3;
                                    break;
                                case 3 :
                                    player.sprite = blueman2;
                                    break;
                                case 4 :
                                    player.sprite = blueman1;
                                    break;
                            }
                        }
                        player.sendUpdated();
                    } else{
                        player.sendMessage("오답 입니다.");
                    }
                    widget.destroy();
                    break;
            }
        })
    }
});

App.addOnKeyDown(82, function(player){
    App.sayToAll(`${player.name}님이 r키를 눌렀습니다.`);
    if(player.role>=3000){
        if(_state == STATE_INIT){
            _stateTimer = 0;
            _state = STATE_READY;
            startState(STATE_READY);
        } else if (_state == STATE_END){
            _state = STATE_INIT;
            App.showName = true;
        }
    }
});

App.addOnKeyDown(84, function(player){
    App.sayToAll(`${player.name}님이 t키를 눌렀습니다.`);
    if(player.role>=3000){
        if(_state == STATE_INIT){
            let widget = player.showWidget("question.html", "middle", 600, 400);
            widget.onMessage.Add(function (sender, msg) {
                switch (msg.type) {
                    case "close":
                        widget.destroy();
                        break;
                    case "save":
                        msg.questionData.id = QUESTION_COUNTER;
                        allQuizInfo.push(msg.questionData);
                        QUESTION_COUNTER ++;
                        widget.destroy();
                        break;
                }
            })
        }
    }
});

App.addOnKeyDown(85, function(player){
    App.sayToAll(`${player.name}님이 u키를 눌렀습니다.`);
    if(player.role>=3000){
        if(_state == STATE_INIT){
            let widget = player.showWidget("team.html", "middle", 600, 400);
            let _playersName = [];
            let _playersId = [];
            for (var i = 0; i < _players.length; i++) {
                _playersName.push(_players[i].name);
                _playersId.push(_players[i].id);
            }
            widget.sendMessage({
                playersName : _playersName,
                playersId : _playersId,
            })
            widget.onMessage.Add(function (sender, msg) {
                switch (msg.type) {
                    case "close":
                        widget.destroy();
                        break;
                    case "save":
                        for (var i = 0; i < _players.length; i++) {
                            let p =_players[i];
                            p.tag.team = 1;
                            for (var j = 0; j < msg.redTeamId.length; j++) {
                                if(p.id==msg.redTeamId[j]){
                                    p.tag.team=0
                                }
                            }

                            if(p.tag.team == 0)
                                _redTeam.push(p);
                            else if(p.tag.team == 1)
                                _blueTeam.push(p);

                            TEAM_COUNTER++;
                            p.tag.alive = p.tag.team == 0 ? false : true;
                            p.nameColor = p.tag.team == 0 ? 16711680 : 255;
                            p.sprite = p.tag.team == 0 ? null : blueman3;
                            p.moveSpeed = p.tag.team == 0 ? 100 : 80;
                            p.attackType = 2;
                            p.attackSprite = p.tag.team == 0 ? redBoxing : blueBoxing;
                            p.attackParam2 = p.tag.team == 0 ? 2 : 0;
                            p.attackParam1 = p.tag.team == 0 ? 2 : 0;

                            p.sendUpdated();
                        }

                        widget.destroy();
                        break;
                }
            })
        }
    }
});

App.addOnKeyDown(89, function(player){
    App.sayToAll(`${player.name}님이 y키를 눌렀습니다.`);
    if(player.role>=3000){
        if(_state == STATE_INIT){
            let _questions = [];
            let _questionId = [];
            for (var i = 0; i < allQuizInfo.length; i++) {
                _questions.push(allQuizInfo[i].question);
                _questionId.push(allQuizInfo[i].id);
            }
            let widget = player.showWidget("questions.html", "middle", 600, 800);
            widget.sendMessage({
                questions : _questions,
                questionId : _questionId,
            })
            widget.onMessage.Add(function (sender, msg) {
                switch (msg.type) {
                    case "close":
                        widget.destroy();
                        break;
                    case "save":
                        quizInfo = [];
                        for (var i = 0; i < 5; i++) {
                            quizInfo.push(allQuizInfo[msg.selectQuestionId[i]])
                        }
                        widget.destroy();
                        break;
                }
            })
        }
    }
});

function checkSuvivors() {
	let alive = 0;
	for (let i in _players) {
		let p = _players[i];
		if (p.tag.alive) {
			++alive;
            alivePlayer.push(p);
		}
	}
	return alive;
}


// called every 20ms
// 20ms 마다 호출되는 업데이트
// param1 : deltatime ( elapsedTime )
App.onUpdate.Add(function(dt) {

    _stateTimer += dt;

    switch(_state)
    {
        case STATE_INIT:
            App.showCenterLabel("문제 출제중입니다. 잠시만 기다려 주세요.");

            break;
        case STATE_READY:
            App.showCenterLabel("게임이 잠시 뒤에 시작됩니다.");
            if(_stateTimer >= 3)
            {
                startState(STATE_PLAYING);
            }
            break;
        case STATE_PLAYING:
            if(_stateTimer >= 1) {
                _stateTimer = 0;
                _timer--;
            }
            let minutes = Math.floor(_timer / 60);
            let seconds = _timer % 60;
            if(_timer<=330 && _timer>=280){
                App.showCenterLabel(minutes + " 분 " + seconds + " 초 " + `\n 첫번째 문제 풀이 시간입니다.`);
            }else if(_timer<=270 && _timer>=220){
                App.showCenterLabel(minutes + " 분 " + seconds + " 초 " + `\n 두번째 문제 풀이 시간입니다.`);
            }else if(_timer<=210 && _timer>=160){
                App.showCenterLabel(minutes + " 분 " + seconds + " 초 " + `\n 세번째 문제 풀이 시간입니다.`);
            }else if(_timer<=150 && _timer>=100){
                App.showCenterLabel(minutes + " 분 " + seconds + " 초 " + `\n 네번째 문제 풀이 시간입니다.`);
            }else if(_timer<=90 && _timer>=30){
                App.showCenterLabel(minutes + " 분 " + seconds + " 초 " + `\n 다섯번째 문제 풀이 시간입니다.`);
            }else if(_timer<30 && _timer>=15){
                App.showCenterLabel(minutes + " 분 " + seconds + " 초 " + "\n 모든 문제가 출제되었습니다.");
            }else if(_timer<15 && _timer>=0){
                App.showCenterLabel(minutes + " 분 " + seconds + " 초 " + "\n 지금부터는 플레이어의 이름이 표시됩니다.");
                App.showName = true;
                App.sendUpdated();
            }else if(_timer < 0){
                _alive = checkSuvivors();
                startState(STATE_JUDGE);
            }else{
                App.showCenterLabel(minutes + " 분 " + seconds + " 초 " + "\n 지금은 문제 준비중 입니다.");
            }
            break;

        case STATE_JUDGE:

            // let redTeamName = ["kang1","kang2","kang3"];
            // let redTeamCorrect = [1,2,3];
            // let redTeamCatch = [3,2,1];
            // let blueTeamName = ["young1","young2","young3"];
            // let blueTeamCorrect = [3,2,1];
            // let blueTeamAlive = [true, false, true]
            // let widget = App.showWidget("result.html", "middle", 600, 800);
            // widget.sendMessage({
            //     redTeamName : redTeamName,
            //     redTeamCorrect : redTeamCorrect,
            //     redTeamCatch : redTeamCatch,
            //     blueTeamName : blueTeamName,
            //     blueTeamCorrect : blueTeamCorrect,
            //     blueTeamAlive : blueTeamAlive,
    
            // })

            if(_stateTimer >= 5)
            {   
                // widget.destroy();
                startState(STATE_END);
            }
            break;
        case STATE_END:
            break;
    }
});

function startState(state)
{
    _state = state;
    _stateTimer = 0;

    switch(_state)
    {
        case STATE_INIT:
            break;
        case STATE_READY:
            let redTeam = 0;
            let blueTeam = 0;
            
            for (let i in _players) {
                let p =_players[i];

                p.tag.hp = 2,
                p.tag.answer = 0,
                p.tag.alive = p.tag.team == 0 ? false : true;
                p.nameColor = p.tag.team == 0 ? 16711680 : 255;
                p.sprite = p.tag.team == 0 ? null : blueman5;
                p.attackType = 2;
                p.attackSprite = p.tag.team == 0 ? redBoxing : blueBoxing;
                p.attackParam2 = p.tag.team == 0 ? 2 : 0;
                p.attackParam1 = p.tag.team == 0 ? 2 : 0;
                p.title = null;
                p.moveSpeed = 0;
                p.cameraEffect = p.tag.team == 0 ? 1 : 0; // 1 = 비네팅 효과
                p.cameraEffectParam1 = p.tag.team == 0 ? 300 : null; // 비네팅 효과의 범위를 300으로 지정
                p.displayRatio = p.tag.team == 0 ? 5 : 1;
                p.sendUpdated();
                App.showName = false;
                App.sendUpdated();

                redTeam += p.tag.team == 0 ? 1 : 0;
                blueTeam += p.tag.team == 0 ? 0 : 1;
            }
            
            if(redTeam==0 || blueTeam==0){
                App.sayToAll("팀당 최소 한명은 있어야 합니다.");
                startState(STATE_END);
            }
            break;

        case STATE_PLAYING:
            _state = STATE_PLAYING;
            gameNum ++;
            for(let i in _players) {
                let p = _players[i];
                p.moveSpeed = p.tag.team == 0 ? 100 : 80;
                p.sendUpdated();
            }
            break;

        case STATE_JUDGE:
            _state = STATE_JUDGE;
            for(let i in _players) {
                let p = _players[i];
                p.moveSpeed = 0;
                p.sendUpdated();
            }
            break;
        case STATE_END:
            _state = STATE_END;

            for(let i in _players) {
                let p = _players[i];
                p.moveSpeed = 80;
                p.title = null;
                p.sprite = null;
                p.hidden = false;
                p.displayRatio = 1;
                p.sendUpdated();
            }

            _state = STATE_INIT;
            App.showName = true;
            App.sendUpdated();
            break;
    }
}