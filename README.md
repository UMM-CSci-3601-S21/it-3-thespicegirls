# Word River <!-- omit in toc -->

[![Server Build Status](../../actions/workflows/server.yml/badge.svg)](../../actions/workflows/server.yml)
[![Client Build Status](../../actions/workflows/client.yaml/badge.svg)](../../actions/workflows/client.yaml)
[![End to End Build Status](../../actions/workflows/e2e.yaml/badge.svg)](../../actions/workflows/e2e.yaml)

[![BCH compliance](https://bettercodehub.com/edge/badge/UMM-CSci-3601-S21/it-3-thespicegirls?branch=main)](https://bettercodehub.com/)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/UMM-CSci-3601-S21/it-3-thespicegirls.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/UMM-CSci-3601-S21/it-3-thespicegirls/alerts/)

- [Development](#development)
  - [Common commands](#common-commands)
- [Deployment](#deployment)
- [Contributors](#contributors)

Word River is an extension to Story Builder where a teacher or admin can organize and manage both their contextpacks and learners. Contextpacks are made up of multiple wordlists that often have similar themes or purpose.
>Story Builder is an app for children who are just learning to read to support their engagement with words. This application is built in Unity using RTVoice for enabling Text-To-Speech and featuring a robust drag and drop system.
>
>-Taken from the [Story Builder repository.](https://github.com/kidstech/story-builder)

Word River is a place that teachers or researchers can create and manage the contextpacks used in Story Builder.

 - user login: users are able to login and have either admin status or regular status
 - add contextpacks: users are able to create their own contextpacks
 - edit contextpacks: admin and the creator of that pack can edit what is in the contextpack
 - add learner: admin can create new learners
 - assign contextpacks to learners: admin are able to assign contextpacks to their learners
 - export the learners contextpacks
## [Development](DEVELOPMENT.md)

Instructions on setting up the development environment and working with the code are in [the development guide](DEVELOPMENT.md).

### Common commands

From the `server` directory:
- `./gradlew run` to start the server
- `./gradlew test` to test the server

From the `client` directory:
- `ng serve` to run the client
- `ng test` to test the client
- `ng e2e` and `ng e2e --watch` to run end-to-end tests

From the `database` directory:
- `./mongoseed.sh` (or `.\mongoseed.bat` on Windows) to seed the database

## [Deployment](DEPLOYMENT.md)

Instructions on how to setup this project are in [the deployment guide](DEPLOYMENT.md).

## Contributors

This contributors to this project can be seen [here](../../graphs/contributors).
