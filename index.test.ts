import { By, Builder, WebDriver, WebElement } from "selenium-webdriver";
import "selenium-webdriver/chrome";
import "selenium-webdriver/firefox";
import "chromedriver";
import "geckodriver";

import { findByCss, findByXpath, findByXpathMany } from "./helpers";

const rootURL = "https://microsoftnews.msn.com/?pcsonly=true";
const expected_cards = 14;
let driver: WebDriver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

beforeAll(async () => {
  driver = await new Builder().forBrowser("firefox").build();
});

afterAll(async () => driver.quit());

it("initialises the context", async () => {
  await driver.get(rootURL);
});

it("should click infopane to the right", async () => {
  const rightSlideButton = await findByXpath("//button[@title='Next Slide']", driver);
  //click n-1 times
  for (let x = 0; x < expected_cards - 1; x++) await rightSlideButton.click();

  //find carousel container of cards
  const anchor = await findByXpath(
    "//*[@class='carousel_tabPanels-DS-card1-1']",
    driver
  );

  // const child: WebElement = await anchor.findElement(
  //   By.xpath("//*[@id='infopane-0-ComplexContentPreview']")
  // );

  //get carousel cards
  const children: WebElement[] = await anchor.findElements(By.xpath("//div"));
  console.log(children.length);

  const actual = "";
  const expected = "";
  // expect(actual).toEqual(expected);
});
