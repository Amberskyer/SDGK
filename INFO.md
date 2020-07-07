# AmberEgg备忘录

## egg-sequelize-auto


```bash
$ egg-sequelize-auto -o "./app/model/youzy" -d youzy -h 127.0.0.1 -p 3306 -u root  -x 123456 -e mysql
$ egg-sequelize-auto -o "./app/model/kk2" -d sdgk-data-dev -h 47.98.141.198 -p 3306 -u dev  -x yqdev2020?? -e mysql
```
- timestamps: false,
- freezeTableName: true// 默认false修改表名为复数，true不修改表名，与数据库表名同步

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
