FROM node:5.5.0

RUN apt-get update -qq && apt-get install -y build-essential

WORKDIR /home/mean
ENV NODE_ENV development

RUN npm install -g gulp gulp-cli

ADD package.json /home/mean/package.json
RUN npm install

# Make everything available for start
RUN mkdir -p /home/mean/api
ADD ./api /home/mean/api
ADD gulpfile.babel.js /home/mean/gulpfile.babel.js
ADD .babelrc /home/mean/.babelrc
ADD .eslintrc /home/mean/.eslintrc
ADD .eslintignore /home/mean/.eslintignore

# Set production environment as default
ENV NODE_ENV production
ENV PORT 8080

EXPOSE 8080
RUN cd /home/mean
CMD ["gulp", "api:cluster"]
