# 영화추천플랫폼 "영화보러갈래"

단국대학교 2020학년도 오픈소스SW설계 프로젝트 영화 추천 플랫폼 "영화보러갈래"

## 개요

영화 추천 플랫폼 [영화보러갈래 (링크)](https://movie.live2skull.kr)

> 영화 및 리뷰, 사용자의 취향에 맞는 추천 영화를 제공합니다.

![메인화면.PNG](/_images/메인화면.PNG)

### 소개자료

- 발표 자료 : [구글 드라이브 링크](https://drive.google.com/file/d/1eRYdDwKYqA7KQy_Uaucqhw0Ls5CBOKxj/view?usp=sharing)
- 개발 보고서 : [구글 드라이브 링크](https://)

## 구성요소

본 프로젝트는 다음 구성요소로 구성되어 있습니다.

### frontend

서비스 웹 프론트엔드 구현

개발 언어 및 프레임워크
- nodejs
- react, semantic-ui

컴포넌트 구성

![프론트엔드_다이어그램.png](/_images/프론트엔드_다이어그램.png)



### backend_and_parser

서비스 API, 영화 추천 기능 제공, 영화 및 리뷰 수집 크롤러 구현

개발 언어 및 프레임워크
- django
- djangorestframework


개발 문서
- [API Documentation](https://app.swaggerhub.com/apis/live2skull/MovieRecommenderDKU/1.0.0#/)  
- [Package Documentation](https://docs.movie.live2skull.kr/)


## 프로젝트 설치

본 프로젝트 repository를 프로젝트를 설치하고자 하는 시스템에 내려받습니다.

```
git clone https://github.com/live2skull/DKU2020_Movie_Recommender
```

### frontend 설치 및 준비

1. nodejs 설치

    `nodejs 12` 이상의 nodejs를 시스템에 설치합니다.

2. 의존 패키지 설치

    프론트엔드 구성에 필요한 의존 패키지를 설치합니다. 설치에 수 분이 소요됩니다.

    ```
    npm install
    ```

3. 프론트엔드 실행 테스트

    프론트엔드 테스트용 배포 서버를 실행합니다.

    ```
    npm run start
    ```

    성공적으로 서버가 실행되었다면 다음 메세지가 출력됩니다.

    ```
    Compiled successfully!

    You can now view team-movie in the browser.

    http://localhost:3001

    Note that the development build is not optimized.
    To create a production build, use yarn build.
    ```
    
    해당 배포 서버로 접속해 정상적으로 동작하는지 확인합니다.

4. static 파일 컴파일

    서비스를 위한 static 파일을 컴파일합니다. 수 분이 소요됩니다.
    ```
    npm run build
    ```
    
    frontend 디렉터리의 `build` 폴더 내부에 컴파일된 파일들이 출력되며, 운영 상황에 맞게 static 파일을 웹 서버에 배포해 서비스합니다.

### backend 설치 및 준비

1. python3 및 mysql 설치

    `Python 3.7` 이상의 파이썬 인터프리터 및 데이터베이스로 `mysql 5.6` 이상의 버전을 설치합니다.

2. 실행 가상환경 .venv 생성 및 진입

    backend 폴더 `backend_and_parser` 로 이동하여 실행 가상환경을 생성하고, 진입합니다.  
    다음은 `.venv` 폴더에 가상환경을 만들고, 진입하는 과정입니다.

    ```
    cd backend_and_parser
    python3 -m venv .venv
    source ./.venv/bin/activate
    ```

    > 💡 Windows 환경에서는 다음 방법으로 가상 환경에 진입합니다.
    ```
    ./.venv/scripts/activate.bat
    ```

3. 의존 패키지 설치

    서버 실행에 필요한 의존 패키지를 설치합니다.

    ```
    pip install -r requirements.txt
    ```

4. 설정 파일 작성

    backend 루트 폴더에 `.env` 파일을 생성하고, 다음 설정값에 맞게 작성합니다.

    >💡 사전 수집된 영화 / 추천 정보를 import 할 경우 `DB_NAME` 을 `movie-parser`로 설정해야 합니다.

    >💡 `ALLOWED_HOST` 는 기본적으로 `127.0.0.1`을 포함합니다.

    >⚠️ `SECRET_KEY` 값을 분실할 경우, 가입된 사용자의 비밀번호 해쉬를 복원할 수 없습니다. 
    
    |값 이름|설명|필수|
    |------|--------|----|
    |DB_HOST|mysql 데이터베이스 호스트|O|
    |DB_USER|mysql 데이터베이스 계정명|O|
    |DB_PASSWORD|mysql 데이터베이스 계정 비밀번호|O|
    |DB_NAME|mysql 데이터베이스 스키마 이름|O|
    |PRODUCTION|1일 경우 배포 모드로 동작하며, 디버그 정보가 클라이언트에게 제공되지 않습니다.|O|
    |ALLOWED_HOST|접속을 허용할 호스트 명|X
    |SENTRY_DSN|sentry 서비스와 연동할 dsn 주소|X|
    |PRINT_LOG_LEVEL|기능 로그 출력 레벨 (default: INFO)|X|

    
5. 데이터베이스 스키마 구성

    설정 파일에서 구성한 `DB_NAME` 의 스키마를 mysql에서 생성하고,  
    다음 명령을 통해 서버 운영에 필요한 스카마 테이블을 구성합니다.

    >⚠️ 정상적으로 진행되지 않는다면, 데이터베이스 서버 상태 및 설정 파일을 확인합니다.

    >⚠️ `DB_USER` 로 지정한 계정은 해당 스키마에 테이블 생성 및 수정 권한이 있어야 합니다.

    ```
    python manage.py migrate
    ```

6. 서버 실행

    `8080` 번 포트로 backend API 서버를 실행합니다.

    ```
    python manage.py runserver 0.0.0.0:8080
    ```

    성공적으로 서버가 실행되었다면 다음 메세지가 출력됩니다.
    ```
    Performing system checks...

    Watching for file changes with StatReloader
    System check identified no issues (0 silenced).
    December 05, 2020 - 22:05:00
    Django version 2.2.11, using settings 'movie_parser.settings'
    Starting development server at http://127.0.0.1:8000/
    Quit the server with CTRL-BREAK.
    ```


### 영화, 평가 정보 수집

추천을 위한 영화, 평가 정보를 [네이버 영화]

> 💡 평가 정보(사용자 댓글) 수집 과정에서 작성자를 추측할 수 있는 닉네임 및 아이디의 일부 정보는 추출하지 않습니다.

1. 사전 수집된 데이터베이스 자료 import (권장)

    사전 수집된 데이터베이스 자료를 import 하여 바로 사용할 수 있습니다.   

    데이터베이스 백업 자료 : [구글 드라이브 링크](https://drive.google.com/file/d/1cM2-X3_RwFaow90vnmjtBkaXktpnyO50/view?usp=sharing)

    `2020. 11. 29` 일 기준으로 영화 약 개, 추천 정보 약 개가 수집되어 있습니다.


2. 직접 수집

    >⚠️ 데이터 수집 기능이 최적화되어 있지 않으므로 (병렬 처리 미구현 등), 본 과정은 매우 오래 걸릴 수 있습니다.

    현재 상영 중인 영화와 평가 정보를 수집합니다.
    ```
    python manage.py batch --task movie_current_showing 
    ```

    > 💡 현재 상영중인 영화에 대해서만 운영하고자 할 경우 본 과정을 생략합니다.

    평가 정보가 입력된 영화와 해당 평가 정보를 추가 수집합니다.
    ```
    python manage.py batch --task movie_from_recommends
    ```

    수집된 평가 정보에 대해 고유 사용자를 지정합니다.
    ```
    python manage.py batch --task recommend_info
    ```

## 히스토리

|기간|일정|
|------|--------|
|2020. 09|프로젝트 사전조사|
|2020. 10|크롤러 구현, 영화 데이터 수집, 프론트엔드 프로토타입 작성|
|2020. 11|API, 추천 기능 구현, 프론트엔드 연동|
|2020. 12|프로젝트 문서화, 최종 프로토타입 작성 및 운영|
