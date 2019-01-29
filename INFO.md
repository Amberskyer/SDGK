# AmberEgg备忘录

## egg-sequelize-auto


```bash
$ egg-sequelize-auto -o "./app/model" -d dbname -h localhost -p 3306 -u root  -x my_password -e mysql
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