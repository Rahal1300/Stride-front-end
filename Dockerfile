# using staged builds
FROM node:18-buster as builder
# make the directory where the project files will be stored
RUN mkdir -p /usr/src/next-nginx
# set it as the working directory so that we don't need to keep referencing it
WORKDIR /usr/src/next-nginx
# Copy the package.json file
COPY . .
# install project dependencies
RUN npm install --f
# copy project files 
# run the build command which will build and export html files
RUN npm run build

EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script when container starts
CMD [ "npm", "start" ]


# # bundle static assets with nginx
# FROM nginx:1.21.0-alpine as production
# ENV NODE_ENV production
# # remove existing files from nginx directory
# # copy built assets from 'builder' stage
# COPY --from=builder /usr/src/next-nginx/.next/ /usr/share/nginx/html
# # expose port 80 for nginx
# EXPOSE 80
# # start nginx
# CMD ["nginx", "-g", "daemon off;"]