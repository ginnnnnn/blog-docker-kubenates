# import a image templete
FROM node:alpine
# define a work directory
WORKDIR /app
# copy npm package for installing node modules
COPY package.json ./
# npm  install
RUN npm install
#copy all other scripts to our work directory
COPY ./ ./
# set up start up  command
CMD ["npm","start"]