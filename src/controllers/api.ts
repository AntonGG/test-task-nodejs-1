import { Router, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import multer from "multer";
import Database from "../database/database";
import Hero from "../types/hero";
import RequestFile from "../types/requestFile";
import Status from "../types/status";

const route = Router();

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

export default (app: Router, db: Database) => {
  app.use("/", route);

  route.post(
    "/setHeroStats",
    //Валидация параметров запроса
    [
      body("name")
        .isString()
        .isLength({ max: 15 }),
      check("strength")
        .exists()
        .isInt({ max: 10 })
        .isLength({ max: 10 }),
      body("dexterity")
        .isNumeric()
        .isInt({ max: 10 }),
      body("intellect")
        .isNumeric()
        .isInt({ max: 10 }),
      body("isInvincible").isBoolean(),
    ],
    async (req: Request, res: Response) => {
      //проверка на ошибку валидации, если да, то возвращаем статус юзеру
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const status: Status = {
          status: false,
          msg: errors.array(),
        };
        return res.status(400).json(status);
      }

      //записываем статы
      db.setHeroStats(req.body as Hero);

      //Возвращаем ОК
      const status: Status = {
        status: true,
        msg: "Hero stats saved",
      };
      res.status(200).json(status);
    }
  );

  route.get("/getHeroStats", async (req: Request, res: Response) => {
    //проверка на наличие в базе данных статы
    const heroStats = db.getHeroStats;
    if (heroStats != null) {
      res.status(200).json(db.getHeroStats());
    } else {
      const status: Status = {
        status: false,
        msg: "Hero stats not found",
      };
      res.status(501).json(status);
    }
  });

  route.post(
    "/uploadHeroImage",
    upload.single("image"),
    async (req: Request, res: Response) => {
      //получаем информацию о файле и буффер
      const { file } = (await req.files) as RequestFile;
      //проверяем какой файл загрузили, е/сли картинка то запишем в базу
      if (file.mimetype.indexOf("image") > -1) {
        //Возвращаем ОК
        const status: Status = {
          status: true,
          msg: "Hero image saved",
        };
        //сохраняем картинку в базу
        db.setHeroImage(file);
        res.status(200).json(status);
      } else {
        //Возвращаем ошибку реквеста
        const status: Status = {
          status: false,
          msg: "You have not uploaded a picture",
        };
        res.status(401).json(status);
      }
    }
  );
  route.get("/getHeroImage", async (req: Request, res: Response) => {
    //проверка на наличие в базе картинки
    const heroImage = db.getHeroImage;
    if (heroImage != null) {
      const file = db.getHeroImage();
      //отправка картинки с нужным mime-type
      res
        .status(200)
        .contentType(file.mimetype)
        .send(file.data);
    } else {
      const status: Status = {
        status: false,
        msg: "Hero image not found",
      };
      res.status(501).json(status);
    }
  });
};
