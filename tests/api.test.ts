import fetch from "node-fetch";
import { promises as fs } from "fs";
import FormData from "form-data";

const host = "localhost:3000";
const headers = {
  "content-type": "application/json",
};
const validHeroStats = {
  name: "Vasya",
  strength: 3,
  dexterity: 1,
  intellect: 1,
  isInvincible: true,
};
const invalidHeroStats = {
  name: "Vasya",
  strength: 33,
  dexterity: 1,
  intellect: 1,
  isInvincible: true,
};

const invalidSetHeroStats = async () => {
  const resp = await fetch(`http://${host}/setHeroStats`, {
    method: "post",
    headers,
    body: JSON.stringify(invalidHeroStats),
  });
  const json = await resp.json();
  if (!json.status) {
    console.log(json);
  }
  expect(json.status).toBe(false);
};

const setHeroStats = async () => {
  const resp = await fetch(`http://${host}/setHeroStats`, {
    method: "post",
    headers,
    body: JSON.stringify(validHeroStats),
  });
  const json = await resp.json();

  expect(json.status).toBe(true);
};

const getHeroStats = async () => {
  const resp = await fetch(`http://${host}/getHeroStats`, {
    method: "get",
  });
  const json = await resp.json();
  expect(json).toEqual(validHeroStats);
};

const uploadHeroImage = async () => {
  const fileName = "superhero.png";
  const path = `tests/${fileName}`;
  const fileStats = await fs.stat(path);
  const fileSizeInBytes = fileStats.size;
  const buffer = await fs.readFile(path);

  const formData = new FormData();
  formData.append("file", buffer, fileName);

  const resp = await fetch(`http://${host}/uploadHeroImage`, {
    method: "POST",
    body: formData,
  });
  const json = await resp.json();

  expect(json.status).toBe(true);
};

const invalidUploadHeroImage = async () => {
  const fileName = "api.test.ts";
  const path = `tests/${fileName}`;
  const fileStats = await fs.stat(path);
  const fileSizeInBytes = fileStats.size;
  const buffer = await fs.readFile(path);

  const formData = new FormData();
  formData.append("file", buffer, fileName);

  const resp = await fetch(`http://${host}/uploadHeroImage`, {
    method: "POST",
    body: formData,
  });
  const json = await resp.json();
  if (!json.status) {
    console.log(json);
  }
  expect(json.status).toBe(false);
};

const getHeroImage = async () => {
  const resp = await fetch(`http://${host}/getHeroImage`, {
    method: "get",
  });
  const imageBuffer = await resp.buffer();
  const extension = resp.headers.get("content-type")!.split("/")[1];

  //сохраняем картинку
  await fs.writeFile(`tests/image.${extension}`, imageBuffer);
};

describe("User route tests", () => {
  test("POST invalidSetHeroStat", async () => await invalidSetHeroStats());
  test("POST setHeroStat", async () => await setHeroStats());
  test("GET getHeroStat", async () => await getHeroStats());
  test("POST uploadHeroImage", async () => await uploadHeroImage());
  test("POST invalidUploadHeroImage", async () =>
    await invalidUploadHeroImage());
  test("GET getHeroImage", async () => await getHeroImage());
});
