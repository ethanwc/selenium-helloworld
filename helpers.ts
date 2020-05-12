import { By, until, WebDriver } from "selenium-webdriver";

const waitUntilTime = 10000;

export async function findByCss(selector: string, driver: WebDriver) {
  const el = await driver.wait(
    until.elementLocated(By.css(selector)),
    waitUntilTime
  );
  return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}

export async function findByXpath(selector: string, driver: WebDriver) {
  const el = await driver.wait(
    until.elementLocated(By.xpath(selector)),
    waitUntilTime
  );
  return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}

export async function findByXpathMany(selector: string, driver: WebDriver) {
  return await driver.wait(
    until.elementsLocated(By.xpath(selector)),
    waitUntilTime
  );
}
