FROM public.ecr.aws/lambda/nodejs:22

WORKDIR /var/task

# install node modules
COPY package*.json ./
RUN npm install

# copy source code
COPY . .

# prisma generate kar build ke pehle
RUN npx prisma generate

# build typescript
RUN npm run build

# final command
CMD ["dist/index.handler" ]
