# Oh Ghost

This tools convert markdown format in hexo/octopress into json that you can import in http://<host>/ghost/debug


## Install

```bash
npm install oghost -g
```


## Usage

In `_posts/` folder, run:

```bash
oghost > ~/exports.json
```


This will output posts and tags into exports.json.

# About this repository
This is originally published by @villadora and customized by @kuropen to prevent this script from generating article with too long slug and ensure the converted articles can be imported.
The repository for the original version is currently not available.
This repository is here to present the solution for the problem.

