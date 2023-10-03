# hide-and-seek
ZepScript를 이용한 교육용 술래잡기 앱<br>
2023 항해커톤 Zep 기업과제, BE 1명

## Rule<br>
### 1. 준비
관리자는 문제 출제와 Hider, Seeker 지정 후 게임을 시작한다.
### 2. 시작
Hider는 스페이스의 랜덤한 위치에서 크기가 16배 큰 상태로 시작한다.<br>
Seeker는 스페이스 지정된 위치에서 시야가 좁은 상태(displayRatio=5)로 시작한다.
### 3. 게임
게임은 6분간 진행되며 시작 후 30초에 첫번째 문제가 출제되며 문제별 50초의 풀이시간과 10초의 대기시간을 가진다.<br>
Hider는 상단 오브젝트 뒤에 숨을 수 있고 문제를 맞추면 크기가 줄어든다.<br>
Seeker는 공격으로 Hider를 잡을 수 있고 문제를 맞추면 시야가 넓어진다.<br>
잡힌 Hider는 유령이 되며 문제를 맞춰서 살아남은 Hider를 도와줄 수 있다.<br>
제한된 시간안에 Hider를 모두 잡으면 Seeker의 승리, 시간이 모두 지나면 Hider의 승리로 게임이 종료된다.
### 4. 결과집계
게임이 종료되면 문항별 정답률과 Hider는 생존시간, Seeker는 잡은 유저 수를 집계한다.
### 5. 결과발표
승리팀과 패배팀을 나눠 집계한 결과를 보여준다.<br>
문항별 정답률과 답안선택률, 유저별 답안을 저장하여 관리자가 볼 수 있게 한다.

## Seeker<br>
문제를 맞추면 시야가 넓어지고 3문제를 맞추면 원거리 공격, 4문제를 맞추면 이동속도가 빨라진다.<br>
![Seeker](https://github.com/Kkangjn/hide-and-seek/assets/135511684/82d662b3-1390-4ef4-a97d-868afa374180)

## Hider<br>
문제를 맞추면 크기가 줄어든다.<br><br>
![Hider](https://github.com/Kkangjn/hide-and-seek/assets/135511684/4bae2783-62ad-41cd-9d4f-6130987a359e)

## 프로젝트 회고
해커톤 참여가 처음인데 사실 주제보다 ZepScript가 매력적이어서 이끌리듯 선택했다.<br> 
짧은 기간이지만 ZepScript의 가이드북이 잘 되어있어서 쉽게 배울 수 있고, 높은 확장성을 가지고 있어서 원하는걸 구현할 수 있었다.<br> 
그러나 Java와 Spring boot만 배웠기에 위젯의 Html과 JavaScript에 막혀서 시간이 부족했고 3번까지만 구현이 된 상태이다.<br>
추후에 미완성된 기능과 아래에 적은 기능들을 추가하여 배포한 뒤 밸런스 조절도 할 예정이다.

## 추가하고싶은 기능들
- 전용 스페이스 제작
- GPT와 연동하여 자동 질문 생성
