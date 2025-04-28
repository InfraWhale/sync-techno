# Node 22 버전의 가벼운 Alpine 이미지 사용
FROM node:22-alpine

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 앱 소스 코드 복사
COPY . .

# Express 서버 포트 노출 (3000번 포트 기준)
EXPOSE 3000

# 서버 실행
CMD ["npm", "start"]