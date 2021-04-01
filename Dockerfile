FROM node:12-slim as realestate_base

WORKDIR /var/service

# Beforing deploying to production we would need to build the typescript file into javascript files
# However, that is not in the scope of this project
CMD npm run start

FROM realestate_base as realestate_cron

CMD npm run scrape
